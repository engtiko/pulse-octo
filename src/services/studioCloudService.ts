import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import {
  auth,
  db,
  OperationType,
  handleFirestoreError,
  isVerifiedOwnerUser,
} from '../firebase';
import type {
  ProjectItem,
  StudioProjectOverride,
  StudioStoreData,
} from '../types';

export const STUDIO_ASSET_PREFIX = 'studio-asset://';
const PROJECTS_COLLECTION = 'studioProjects';
const ASSETS_COLLECTION = 'studioAssets';

export interface CloudAssetRecord {
  assetId: string;
  projectId: string;
  kind: 'image' | 'pdf';
  mimeType: string;
  fileName: string;
  fileSize?: string;
  dataUrl?: string;
  chunkCount: number;
}

export function sanitizeId(raw: string, fallback = 'item'): string {
  const cleaned = (raw || '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 100);
  return cleaned || fallback;
}

/**
 * Recursively removes `undefined` fields so Firestore `setDoc` / `updateDoc` never fail.
 */
export function sanitizeForFirestore<T>(input: T): T {
  if (Array.isArray(input)) {
    return input
      .filter((v) => v !== undefined)
      .map((v) => sanitizeForFirestore(v)) as unknown as T;
  }
  if (input && typeof input === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
      if (v !== undefined) {
        out[k] = sanitizeForFirestore(v);
      }
    }
    return out as T;
  }
  return input;
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

/**
 * Compresses raster images cleanly on-device to fit comfortably inside a single
 * Firestore document (< 650 KB base64) while preserving sharp retina quality.
 */
export async function compressImageToDurableDataUrl(
  file: File
): Promise<{ dataUrl: string; mimeType: string; byteEstimate: number }> {
  const rawDataUrl = await readFileAsDataUrl(file);
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    if (rawDataUrl.length <= 750_000) {
      return {
        dataUrl: rawDataUrl,
        mimeType: file.type || 'image/png',
        byteEstimate: Math.round((rawDataUrl.length * 3) / 4),
      };
    }
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const attempts = [
        { maxDim: 1600, quality: 0.84, type: 'image/webp' },
        { maxDim: 1400, quality: 0.78, type: 'image/webp' },
        { maxDim: 1200, quality: 0.72, type: 'image/webp' },
        { maxDim: 1024, quality: 0.66, type: 'image/jpeg' },
        { maxDim: 840, quality: 0.58, type: 'image/jpeg' },
      ];

      let bestDataUrl = rawDataUrl;
      let bestMime = file.type || 'image/webp';

      for (const attempt of attempts) {
        let { width, height } = img;
        if (width > attempt.maxDim || height > attempt.maxDim) {
          if (width >= height) {
            height = Math.max(1, Math.round((height * attempt.maxDim) / width));
            width = attempt.maxDim;
          } else {
            width = Math.max(1, Math.round((width * attempt.maxDim) / height));
            height = attempt.maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) break;

        ctx.drawImage(img, 0, 0, width, height);
        const encoded = canvas.toDataURL(attempt.type, attempt.quality);
        bestDataUrl = encoded;
        bestMime = attempt.type;
        if (encoded.length <= 650_000) {
          break;
        }
      }

      resolve({
        dataUrl: bestDataUrl,
        mimeType: bestMime,
        byteEstimate: Math.round((bestDataUrl.length * 3) / 4),
      });
    };
    img.onerror = () =>
      resolve({
        dataUrl: rawDataUrl,
        mimeType: file.type || 'image/jpeg',
        byteEstimate: file.size,
      });
    img.src = rawDataUrl;
  });
}

function assertVerifiedOwner(): string {
  const user = auth.currentUser;
  if (!user || !isVerifiedOwnerUser(user)) {
    throw new Error(
      'OWNER_AUTH_REQUIRED: يرجى تسجيل الدخول بحساب Google المالك لتفعيل الحفظ السحابي الدائم.'
    );
  }
  return user.uid;
}

/**
 * Persists an uploaded image or PDF durably inside Firestore (`studioAssets`).
 * Large PDFs (> 600 KB) are transparently split into ordered subcollection chunks.
 */
export async function saveStudioAssetToCloud(params: {
  projectId: string;
  file: File;
}): Promise<{
  url: string;
  assetId: string;
  previewDataUrl: string;
  fileSize: string;
}> {
  const ownerUid = assertVerifiedOwner();
  const safeProjectId = sanitizeId(params.projectId, 'project');
  const isPdf =
    params.file.type === 'application/pdf' ||
    params.file.name.toLowerCase().endsWith('.pdf');
  const assetId = `ast_${safeProjectId}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 6)}`;
  const assetPath = `${ASSETS_COLLECTION}/${assetId}`;
  const cleanName = params.file.name.slice(0, 180) || (isPdf ? 'brand-book.pdf' : 'asset.webp');

  if (!isPdf) {
    const compressed = await compressImageToDurableDataUrl(params.file);
    const fileSize = formatBytes(compressed.byteEstimate);
    try {
      await setDoc(doc(db, ASSETS_COLLECTION, assetId), {
        assetId,
        projectId: safeProjectId,
        kind: 'image',
        mimeType: compressed.mimeType,
        fileName: cleanName,
        fileSize,
        dataUrl: compressed.dataUrl,
        chunkCount: 0,
        ownerUid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, assetPath);
    }

    return {
      url: `${STUDIO_ASSET_PREFIX}${assetId}`,
      assetId,
      previewDataUrl: compressed.dataUrl,
      fileSize,
    };
  }

  // PDF persistence (direct single-doc if <= 600KB, else ordered chunks)
  const pdfDataUrl = await readFileAsDataUrl(params.file);
  const fileSize = formatBytes(params.file.size);
  const CHUNK_CHAR_SIZE = 420_000;

  if (pdfDataUrl.length <= 600_000) {
    try {
      await setDoc(doc(db, ASSETS_COLLECTION, assetId), {
        assetId,
        projectId: safeProjectId,
        kind: 'pdf',
        mimeType: 'application/pdf',
        fileName: cleanName,
        fileSize,
        dataUrl: pdfDataUrl,
        chunkCount: 0,
        ownerUid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, assetPath);
    }
    return {
      url: `${STUDIO_ASSET_PREFIX}${assetId}`,
      assetId,
      previewDataUrl: pdfDataUrl,
      fileSize,
    };
  }

  // Multi-chunk PDF
  const chunks: string[] = [];
  for (let offset = 0; offset < pdfDataUrl.length; offset += CHUNK_CHAR_SIZE) {
    chunks.push(pdfDataUrl.slice(offset, offset + CHUNK_CHAR_SIZE));
  }
  if (chunks.length > 40) {
    throw new Error('PDF file is too large for cloud storage (max ~12 MB).');
  }

  // Create parent asset first (satisfies Master Gate rule)
  try {
    await setDoc(doc(db, ASSETS_COLLECTION, assetId), {
      assetId,
      projectId: safeProjectId,
      kind: 'pdf',
      mimeType: 'application/pdf',
      fileName: cleanName,
      fileSize,
      chunkCount: chunks.length,
      ownerUid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, assetPath);
  }

  for (let i = 0; i < chunks.length; i++) {
    const chunkPath = `${assetPath}/chunks/${i}`;
    try {
      await setDoc(doc(db, ASSETS_COLLECTION, assetId, 'chunks', String(i)), {
        assetId,
        chunkIndex: i,
        data: chunks[i],
        ownerUid,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, chunkPath);
    }
  }

  // Convert data URL to Blob URL for instant browser preview
  const blobUrl = dataUrlToBlobUrl(pdfDataUrl);
  return {
    url: `${STUDIO_ASSET_PREFIX}${assetId}`,
    assetId,
    previewDataUrl: blobUrl,
    fileSize,
  };
}

export function dataUrlToBlobUrl(dataUrl: string): string {
  try {
    const [header, base64] = dataUrl.split(',');
    const mimeMatch = header.match(/data:([^;]+);/);
    const mime = mimeMatch ? mimeMatch[1] : 'application/pdf';
    const binary = atob(base64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mime });
    return URL.createObjectURL(blob);
  } catch {
    return dataUrl;
  }
}

/**
 * Resolves a multi-chunk PDF asset into a playable/downloadable Blob URL.
 */
export async function resolveChunkedAssetUrl(assetId: string): Promise<string | null> {
  const chunksPath = `${ASSETS_COLLECTION}/${assetId}/chunks`;
  try {
    const q = query(collection(db, ASSETS_COLLECTION, assetId, 'chunks'), orderBy('chunkIndex'));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const pieces = snap.docs
      .map((d) => d.data() as { chunkIndex: number; data: string })
      .sort((a, b) => a.chunkIndex - b.chunkIndex)
      .map((d) => d.data);
    const joined = pieces.join('');
    return dataUrlToBlobUrl(joined);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, chunksPath);
  }
}

export async function persistProjectOverrideToCloud(
  rawProjectId: string,
  overrideData: StudioProjectOverride
): Promise<void> {
  const ownerUid = assertVerifiedOwner();
  const projectId = sanitizeId(rawProjectId, 'project');
  const docPath = `${PROJECTS_COLLECTION}/${projectId}`;
  const ref = doc(db, PROJECTS_COLLECTION, projectId);
  const cleanOverride = sanitizeForFirestore({
    ...overrideData,
    updatedAt: new Date().toISOString(),
  });

  try {
    const existingSnap = await getDoc(ref);
    if (existingSnap.exists()) {
      await updateDoc(ref, {
        kind: 'override',
        overrideData: cleanOverride,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(ref, {
        projectId,
        kind: 'override',
        overrideData: cleanOverride,
        ownerUid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

export async function persistCustomProjectToCloud(
  project: ProjectItem
): Promise<void> {
  const ownerUid = assertVerifiedOwner();
  const projectId = sanitizeId(project.id, 'project');
  const docPath = `${PROJECTS_COLLECTION}/${projectId}`;
  const ref = doc(db, PROJECTS_COLLECTION, projectId);
  const cleanProject = sanitizeForFirestore({ ...project, id: projectId });

  try {
    const existingSnap = await getDoc(ref);
    if (existingSnap.exists()) {
      await updateDoc(ref, {
        kind: 'custom',
        customProject: cleanProject,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(ref, {
        projectId,
        kind: 'custom',
        customProject: cleanProject,
        ownerUid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

export async function deleteStudioProjectFromCloud(rawProjectId: string): Promise<void> {
  assertVerifiedOwner();
  const projectId = sanitizeId(rawProjectId, 'project');
  const docPath = `${PROJECTS_COLLECTION}/${projectId}`;
  try {
    await deleteDoc(doc(db, PROJECTS_COLLECTION, projectId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

export async function deleteStudioAssetFromCloud(assetId: string): Promise<void> {
  assertVerifiedOwner();
  if (!assetId) return;
  const cleanId = sanitizeId(assetId, '');
  if (!cleanId) return;
  const assetPath = `${ASSETS_COLLECTION}/${cleanId}`;
  try {
    const chunksSnap = await getDocs(collection(db, ASSETS_COLLECTION, cleanId, 'chunks'));
    for (const chunkDoc of chunksSnap.docs) {
      await deleteDoc(chunkDoc.ref);
    }
    await deleteDoc(doc(db, ASSETS_COLLECTION, cleanId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, assetPath);
  }
}

export interface CloudStudioSnapshotPayload {
  store: StudioStoreData;
  assetUrlMap: Record<string, string>;
  chunkedPdfAssetIds: string[];
}

export function subscribeStudioCloud(
  onUpdate: (payload: CloudStudioSnapshotPayload) => void
): () => void {
  let latestProjects: {
    id: string;
    kind: 'override' | 'custom';
    overrideData?: StudioProjectOverride;
    customProject?: ProjectItem;
  }[] = [];
  let latestAssetMap: Record<string, string> = {};
  let latestChunkedPdfIds: string[] = [];

  const emit = () => {
    const customProjects: ProjectItem[] = [];
    const projectOverrides: Record<string, StudioProjectOverride> = {};
    for (const p of latestProjects) {
      if (p.kind === 'custom' && p.customProject) {
        customProjects.push(p.customProject);
      } else if (p.kind === 'override' && p.overrideData) {
        projectOverrides[p.id] = p.overrideData;
      }
    }
    onUpdate({
      store: { customProjects, projectOverrides },
      assetUrlMap: { ...latestAssetMap },
      chunkedPdfAssetIds: [...latestChunkedPdfIds],
    });
  };

  const unsubProjects = onSnapshot(
    collection(db, PROJECTS_COLLECTION),
    (snap) => {
      latestProjects = snap.docs.map((d) => {
        const data = d.data() as {
          projectId?: string;
          kind?: 'override' | 'custom';
          overrideData?: StudioProjectOverride;
          customProject?: ProjectItem;
        };
        return {
          id: data.projectId || d.id,
          kind: data.kind || 'override',
          overrideData: data.overrideData,
          customProject: data.customProject,
        };
      });
      emit();
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, PROJECTS_COLLECTION);
    }
  );

  const unsubAssets = onSnapshot(
    collection(db, ASSETS_COLLECTION),
    (snap) => {
      const nextMap: Record<string, string> = {};
      const nextChunked: string[] = [];
      snap.docs.forEach((d) => {
        const data = d.data() as CloudAssetRecord;
        const id = data.assetId || d.id;
        const key = `${STUDIO_ASSET_PREFIX}${id}`;
        if (data.dataUrl) {
          nextMap[key] =
            data.kind === 'pdf' ? dataUrlToBlobUrl(data.dataUrl) : data.dataUrl;
        } else if (data.kind === 'pdf' && data.chunkCount > 0) {
          nextChunked.push(id);
        }
      });
      latestAssetMap = nextMap;
      latestChunkedPdfIds = nextChunked;
      emit();
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, ASSETS_COLLECTION);
    }
  );

  return () => {
    unsubProjects();
    unsubAssets();
  };
}

/**
 * Exports all cloud studio projects and assets as a portable JSON backup file.
 */
export async function exportFullStudioBackupJson(): Promise<string> {
  let projectsSnap;
  let assetsSnap;
  try {
    projectsSnap = await getDocs(collection(db, PROJECTS_COLLECTION));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, PROJECTS_COLLECTION);
  }
  try {
    assetsSnap = await getDocs(collection(db, ASSETS_COLLECTION));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, ASSETS_COLLECTION);
  }

  const projects = projectsSnap.docs.map((d) => d.data());
  const assets = assetsSnap.docs.map((d) => d.data());
  return JSON.stringify(
    {
      version: 1,
      exportedAt: new Date().toISOString(),
      projects,
      assets,
    },
    null,
    2
  );
}

export async function importFullStudioBackupJson(rawJson: string): Promise<number> {
  const ownerUid = assertVerifiedOwner();
  const parsed = JSON.parse(rawJson) as {
    projects?: Array<{
      projectId: string;
      kind: 'override' | 'custom';
      overrideData?: StudioProjectOverride;
      customProject?: ProjectItem;
    }>;
    assets?: Array<CloudAssetRecord>;
  };

  let count = 0;
  for (const ast of parsed.assets || []) {
    if (!ast.assetId || !ast.projectId) continue;
    const path = `${ASSETS_COLLECTION}/${ast.assetId}`;
    try {
      await setDoc(doc(db, ASSETS_COLLECTION, ast.assetId), {
        assetId: sanitizeId(ast.assetId, 'asset'),
        projectId: sanitizeId(ast.projectId, 'project'),
        kind: ast.kind === 'pdf' ? 'pdf' : 'image',
        mimeType: ast.mimeType || 'image/webp',
        fileName: (ast.fileName || 'asset.webp').slice(0, 200),
        fileSize: ast.fileSize || '—',
        ...(ast.dataUrl ? { dataUrl: ast.dataUrl } : {}),
        chunkCount: Number(ast.chunkCount || 0),
        ownerUid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      count++;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  for (const proj of parsed.projects || []) {
    if (!proj.projectId) continue;
    if (proj.kind === 'custom' && proj.customProject) {
      await persistCustomProjectToCloud(proj.customProject);
      count++;
    } else if (proj.overrideData) {
      await persistProjectOverrideToCloud(proj.projectId, proj.overrideData);
      count++;
    }
  }

  return count;
}
