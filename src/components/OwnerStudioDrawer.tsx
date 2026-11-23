import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useProjects } from '../context/ProjectsContext';
import { useToast } from '../context/ToastContext';
import {
  auth,
  isVerifiedOwnerUser,
  signInOwnerWithGoogle,
  signOutOwner,
  subscribeOwnerAuth,
  OWNER_ADMIN_EMAIL,
} from '../firebase';
import {
  STUDIO_ASSET_PREFIX,
  saveStudioAssetToCloud,
  persistProjectOverrideToCloud,
  persistCustomProjectToCloud,
  deleteStudioProjectFromCloud,
  deleteStudioAssetFromCloud,
  exportFullStudioBackupJson,
  importFullStudioBackupJson,
} from '../services/studioCloudService';
import type { User } from 'firebase/auth';
import type {
  ProjectItem,
  StudioProjectOverride,
  StudioUploadedAssetSlot,
} from '../types';
import {
  X,
  Upload,
  Sparkles,
  Plus,
  Image as ImageIcon,
  FileText,
  Trash2,
  Check,
  Loader2,
  FolderPlus,
  Layers,
  Wand2,
  ExternalLink,
  AlertCircle,
  Pencil,
  RefreshCw,
  Star,
  Save,
  Cloud,
  Download,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

interface OwnerStudioDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  ownerToken: string;
  onNavigatePortfolio?: () => void;
}

type StudioTab = 'upload' | 'create' | 'manage';

interface QueuedAssetItem {
  id: string;
  file: File;
  previewUrl: string;
  isPdf: boolean;
  slot: StudioUploadedAssetSlot;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  collectionTag: string;
  collectionTagEn: string;
  aiGenerated: boolean;
  aiSource?: 'gemini' | 'template';
  isGeneratingAi: boolean;
  setAsHeroCover?: boolean;
}

interface ExistingAssetEditable {
  url: string;
  type: StudioUploadedAssetSlot;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  collectionTag?: string;
  collectionTagEn?: string;
}

type PendingReplaceTarget = {
  projectId: string;
  slotTarget: 'logo' | 'hero' | 'pdf' | 'asset';
  originalUrl?: string;
  currentMeta?: ExistingAssetEditable;
};

const SLOT_OPTIONS: {
  value: StudioUploadedAssetSlot;
  labelAr: string;
  labelEn: string;
}[] = [
  { value: 'lookbook', labelAr: 'تشكيلة / معرض أزياء (Lookbook)', labelEn: 'Lookbook / Collection' },
  { value: 'mockup', labelAr: 'موك اب وتطبيقات (Mockup)', labelEn: 'Brand Mockup' },
  { value: 'poster', labelAr: 'منشور سوشيال ميديا (Poster)', labelEn: 'Social Media Post' },
  { value: 'brand', labelAr: 'عنصر هوية بصرية (Brand)', labelEn: 'Brand Identity Element' },
  { value: 'cover', labelAr: 'غلاف المشروع الرئيسي (Cover)', labelEn: 'Primary Hero Cover' },
  { value: 'storefront', labelAr: 'واجهة موقع / متجر (Storefront)', labelEn: 'Website Interface' },
  { value: 'logo', labelAr: 'الشعار الرسمي (Logo)', labelEn: 'Official Brandmark' },
  { value: 'pdf', labelAr: 'ملف الهوية البصرية (PDF)', labelEn: 'Brand Book PDF' },
];

const COLOR_PRESETS: { name: string; nameEn: string; hex: string }[][] = [
  [
    { name: 'عنابي ملكي', nameEn: 'Royal Burgundy', hex: '#4A1219' },
    { name: 'ذهبي عتيق', nameEn: 'Antique Gold', hex: '#C8A46B' },
    { name: 'كريمي عاجي', nameEn: 'Warm Ivory', hex: '#F4ECE0' },
  ],
  [
    { name: 'بنفسجي بلس', nameEn: 'Pulse Violet', hex: '#7C3AED' },
    { name: 'أوبسيديان داكن', nameEn: 'Deep Obsidian', hex: '#09080F' },
    { name: 'فضي معدني', nameEn: 'Metallic Silver', hex: '#D4D4D8' },
  ],
  [
    { name: 'كحلي ملكي', nameEn: 'Royal Navy', hex: '#08193B' },
    { name: 'ذهبي كلاسيك', nameEn: 'Classic Gold', hex: '#D4AF37' },
    { name: 'عاجي نقي', nameEn: 'Pure Cream', hex: '#F8F6F2' },
  ],
];

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Generates a lightweight 1024px max JPEG dataURL strictly for Gemini Vision analysis,
 * keeping batch 40-image AI captioning crisp and fast while preserving original upload quality.
 */
async function createVisionAnalysisDataUrl(file: File): Promise<{ dataBase64: string; mimeType: string }> {
  const fullDataUrl = await fileToBase64(file);
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
    return { dataBase64: fullDataUrl, mimeType: file.type || 'image/jpeg' };
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const maxDim = 1024;
      let { width, height } = img;
      if (width <= maxDim && height <= maxDim) {
        resolve({ dataBase64: fullDataUrl, mimeType: file.type || 'image/jpeg' });
        return;
      }
      if (width > height) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve({ dataBase64: fullDataUrl, mimeType: file.type || 'image/jpeg' });
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      resolve({
        dataBase64: canvas.toDataURL('image/jpeg', 0.82),
        mimeType: 'image/jpeg',
      });
    };
    img.onerror = () => resolve({ dataBase64: fullDataUrl, mimeType: file.type || 'image/jpeg' });
    img.src = fullDataUrl;
  });
}

export const OwnerStudioDrawer: React.FC<OwnerStudioDrawerProps> = ({
  isOpen,
  onClose,
  ownerToken,
  onNavigatePortfolio,
}) => {
  const { lang, isAr, dir } = useLanguage();
  const {
    getProjects,
    studioStore,
    applyStoreData,
    refreshProjects,
    registerLocalAssetPreview,
    toCanonicalUrl,
  } = useProjects();
  const toast = useToast();

  const [firebaseUser, setFirebaseUser] = useState<User | null>(
    () => auth.currentUser
  );
  const [isAuthenticatingCloud, setIsAuthenticatingCloud] = useState(false);

  useEffect(() => {
    const unsub = subscribeOwnerAuth((u) => {
      setFirebaseUser(u);
    });
    return () => unsub();
  }, []);

  const isCloudOwnerReady = isVerifiedOwnerUser(firebaseUser);

  const arProjects = useMemo(() => getProjects('ar'), [getProjects]);
  const enProjects = useMemo(() => getProjects('en'), [getProjects]);
  const allProjects = isAr ? arProjects : enProjects;

  const [activeTab, setActiveTab] = useState<StudioTab>('upload');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(() => 'athar');
  const [defaultUploadSlot, setDefaultUploadSlot] = useState<StudioUploadedAssetSlot>('lookbook');
  const [autoAiEnabled, setAutoAiEnabled] = useState<boolean>(true);
  const [autoAiOnReplace, setAutoAiOnReplace] = useState<boolean>(true);
  const [queue, setQueue] = useState<QueuedAssetItem[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [progressInfo, setProgressInfo] = useState<{
    current: number;
    total: number;
    stage: string;
  } | null>(null);

  // Tab 2: New Project Form state
  const [newClientAr, setNewClientAr] = useState('');
  const [newClientEn, setNewClientEn] = useState('');
  const [newTitleAr, setNewTitleAr] = useState('');
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newCategoryAr, setNewCategoryAr] = useState('هوية بصرية وإبداعية متكاملة');
  const [newCategoryEn, setNewCategoryEn] = useState('Brand Identity & Creative Direction');
  const [newTagAr, setNewTagAr] = useState('بناء علامة تجارية');
  const [newTagEn, setNewTagEn] = useState('Branding');
  const [newSummaryAr, setNewSummaryAr] = useState('');
  const [newSummaryEn, setNewSummaryEn] = useState('');
  const [newLocationAr, setNewLocationAr] = useState('مصر');
  const [newLocationEn, setNewLocationEn] = useState('Egypt');
  const [newYear, setNewYear] = useState(String(new Date().getFullYear()));
  const [newWebsiteUrl, setNewWebsiteUrl] = useState('');
  const [newColors, setNewColors] = useState(COLOR_PRESETS[0]);
  const [newQueue, setNewQueue] = useState<QueuedAssetItem[]>([]);

  // Tab 3: Edit / Replace Existing Project Assets state
  const [replacingKey, setReplacingKey] = useState<string | null>(null);
  const [editingUrl, setEditingUrl] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<ExistingAssetEditable | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState<boolean>(false);
  const [isGeneratingEditAi, setIsGeneratingEditAi] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const newProjectFileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);
  const backupImportInputRef = useRef<HTMLInputElement>(null);
  const pendingReplaceTargetRef = useRef<PendingReplaceTarget | null>(null);

  const ensureCloudOwnerAuth = useCallback(async (): Promise<boolean> => {
    if (isVerifiedOwnerUser(auth.currentUser)) {
      return true;
    }
    setIsAuthenticatingCloud(true);
    try {
      const user = await signInOwnerWithGoogle();
      setFirebaseUser(user);
      if (!isVerifiedOwnerUser(user)) {
        toast.error(
          isAr ? 'حساب غير مصرح له بالحفظ' : 'Unauthorized Google account',
          isAr
            ? `يرجى تسجيل الدخول بحساب المالك (${OWNER_ADMIN_EMAIL}) لحفظ الصور في السحابة.`
            : `Sign in with owner account (${OWNER_ADMIN_EMAIL}) to save permanently.`
        );
        return false;
      }
      toast.success(
        isAr ? 'تم تفعيل الحفظ السحابي الدائم!' : 'Cloud Storage Connected!'
      );
      return true;
    } catch {
      toast.error(
        isAr ? 'يلزم تسجيل الدخول بحساب Google أولاً' : 'Google Sign-In required',
        isAr
          ? 'اضغط "تفعيل الحفظ السحابي الدائم" في أعلى الاستوديو لحفظ صورك للأبد.'
          : 'Click Connect Cloud Storage at top of Studio so uploads never reset.'
      );
      return false;
    } finally {
      setIsAuthenticatingCloud(false);
    }
  }, [isAr, toast]);

  const handleCloudSignIn = useCallback(async () => {
    await ensureCloudOwnerAuth();
  }, [ensureCloudOwnerAuth]);

  const handleExportBackup = useCallback(async () => {
    try {
      const jsonStr = await exportFullStudioBackupJson();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pulseocto-studio-backup-${new Date()
        .toISOString()
        .slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(
        isAr ? 'تم تحميل النسخة الاحتياطية بنجاح' : 'Backup downloaded!'
      );
    } catch {
      toast.error(isAr ? 'تعذر تصدير النسخة' : 'Export failed');
    }
  }, [isAr, toast]);

  const handleImportBackup = useCallback(
    async (file: File) => {
      const ok = await ensureCloudOwnerAuth();
      if (!ok) return;
      try {
        const text = await file.text();
        const count = await importFullStudioBackupJson(text);
        toast.success(
          isAr ? 'تم استيراد النسخة للسحابة!' : 'Backup restored to cloud!',
          isAr ? `تم استرجاع ${count} عنصر.` : `Restored ${count} items.`
        );
      } catch {
        toast.error(isAr ? 'تعذر استيراد الملف' : 'Invalid backup file');
      }
    },
    [ensureCloudOwnerAuth, isAr, toast]
  );

  const selectedProject = useMemo(
    () => allProjects.find((p) => p.id === selectedProjectId) || allProjects[0],
    [allProjects, selectedProjectId]
  );

  const selectedProjectAr = useMemo(
    () => arProjects.find((p) => p.id === selectedProjectId) || arProjects[0],
    [arProjects, selectedProjectId]
  );

  const selectedProjectEn = useMemo(
    () => enProjects.find((p) => p.id === selectedProjectId) || enProjects[0],
    [enProjects, selectedProjectId]
  );

  const existingProjectAssets = useMemo<ExistingAssetEditable[]>(() => {
    if (!selectedProjectAr || !selectedProjectEn) return [];
    const map = new Map<string, ExistingAssetEditable>();

    const enByUrl = new Map<
      string,
      NonNullable<ProjectItem['assetShowcase']>[number]
    >(
      (selectedProjectEn.assetShowcase || []).map((item) => [item.url, item])
    );

    (selectedProjectAr.assetShowcase || []).forEach((item) => {
      if (!item.url || map.has(item.url)) return;
      const enItem = enByUrl.get(item.url);
      map.set(item.url, {
        url: item.url,
        type: (item.type || 'lookbook') as StudioUploadedAssetSlot,
        title: item.title || '',
        titleEn: item.titleEn || enItem?.title || '',
        description: item.description || '',
        descriptionEn: item.descriptionEn || enItem?.description || '',
        collectionTag: item.collectionTag,
        collectionTagEn: item.collectionTagEn || enItem?.collectionTag,
      });
    });

    (selectedProjectAr.gallery || []).forEach((url, idx) => {
      if (!url || map.has(url)) return;
      map.set(url, {
        url,
        type: url === selectedProjectAr.heroImage ? 'cover' : 'lookbook',
        title: `${selectedProjectAr.client} — ${idx + 1}`,
        titleEn: `${selectedProjectEn.client} — ${idx + 1}`,
        description: '',
        descriptionEn: '',
      });
    });

    return Array.from(map.values());
  }, [selectedProjectAr, selectedProjectEn]);

  const authHeaders = useMemo(
    () => ({
      'Content-Type': 'application/json',
      ...(ownerToken ? { 'x-studio-owner-token': ownerToken } : {}),
    }),
    [ownerToken]
  );

  const buildQueuedItems = useCallback(
    (files: FileList | File[], fallbackSlot: StudioUploadedAssetSlot): QueuedAssetItem[] => {
      return Array.from(files)
        .filter((f) => f.type.startsWith('image/') || f.type === 'application/pdf')
        .map((file, idx) => {
          const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
          const inferredSlot: StudioUploadedAssetSlot = isPdf ? 'pdf' : fallbackSlot;
          return {
            id: `${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 7)}`,
            file,
            previewUrl: isPdf ? '' : URL.createObjectURL(file),
            isPdf,
            slot: inferredSlot,
            title: '',
            titleEn: '',
            description: '',
            descriptionEn: '',
            collectionTag: '',
            collectionTagEn: '',
            aiGenerated: false,
            isGeneratingAi: false,
            setAsHeroCover: inferredSlot === 'cover',
          };
        });
    },
    []
  );

  const requestAiCopyForItem = useCallback(
    async (
      item: QueuedAssetItem,
      context: { clientName: string; category: string; summary: string }
    ): Promise<Partial<QueuedAssetItem>> => {
      if (item.isPdf) {
        return {
          title: item.title || `دليل الهوية البصرية — ${context.clientName}`,
          titleEn: item.titleEn || `Brand Guidelines Book — ${context.clientName}`,
          description:
            item.description ||
            `ملف الهوية البصرية المعتمد لعلامة ${context.clientName} شاملاً قواعد الشعار والألوان والخطوط.`,
          descriptionEn:
            item.descriptionEn ||
            `Official brand book PDF for ${context.clientName} covering logo system, colors, and typography.`,
          aiGenerated: true,
          aiSource: 'template',
        };
      }

      const visionPayload = await createVisionAnalysisDataUrl(item.file);
      const res = await fetch('/api/studio/generate-copy', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          dataBase64: visionPayload.dataBase64,
          mimeType: visionPayload.mimeType,
          clientName: context.clientName,
          projectCategory: context.category,
          assetType: item.slot,
          brandSummary: context.summary,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate copy');
      }
      const json = await res.json();
      const generated = json?.data || {};
      return {
        // Strictly preserve any manual text the owner already typed!
        title: item.title.trim() ? item.title : generated.title || '',
        titleEn: item.titleEn.trim() ? item.titleEn : generated.titleEn || '',
        description: item.description.trim()
          ? item.description
          : generated.description || '',
        descriptionEn: item.descriptionEn.trim()
          ? item.descriptionEn
          : generated.descriptionEn || '',
        collectionTag: item.collectionTag.trim()
          ? item.collectionTag
          : generated.collectionTag || '',
        collectionTagEn: item.collectionTagEn.trim()
          ? item.collectionTagEn
          : generated.collectionTagEn || '',
        aiGenerated: true,
        aiSource: json?.source === 'gemini' ? 'gemini' : 'template',
      };
    },
    [authHeaders]
  );

  const handleGenerateSingleCopy = useCallback(
    async (
      itemId: string,
      targetQueue: 'existing' | 'new'
    ) => {
      const list = targetQueue === 'existing' ? queue : newQueue;
      const setList = targetQueue === 'existing' ? setQueue : setNewQueue;
      const target = list.find((q) => q.id === itemId);
      if (!target) return;

      const context =
        targetQueue === 'existing'
          ? {
              clientName: selectedProject?.client || 'Pulse OCTO Client',
              category: selectedProject?.category || 'Branding',
              summary: selectedProject?.summary || '',
            }
          : {
              clientName: newClientAr || newClientEn || 'New Brand',
              category: newCategoryAr || newCategoryEn,
              summary: newSummaryAr || newSummaryEn,
            };

      setList((prev) =>
        prev.map((q) => (q.id === itemId ? { ...q, isGeneratingAi: true } : q))
      );

      try {
        const patch = await requestAiCopyForItem(target, context);
        setList((prev) =>
          prev.map((q) =>
            q.id === itemId ? { ...q, ...patch, isGeneratingAi: false } : q
          )
        );
      } catch {
        setList((prev) =>
          prev.map((q) => (q.id === itemId ? { ...q, isGeneratingAi: false } : q))
        );
        toast.error(
          isAr ? 'تعذر توليد النص تلقائياً' : 'Could not auto-generate text',
          isAr ? 'يمكنك كتابة العنوان والشرح يدوياً.' : 'You can enter title and caption manually.'
        );
      }
    },
    [
      queue,
      newQueue,
      selectedProject,
      newClientAr,
      newClientEn,
      newCategoryAr,
      newCategoryEn,
      newSummaryAr,
      newSummaryEn,
      requestAiCopyForItem,
      toast,
      isAr,
    ]
  );

  const handleGenerateBlankCopies = useCallback(
    async (targetQueue: 'existing' | 'new') => {
      const list = targetQueue === 'existing' ? queue : newQueue;
      const setList = targetQueue === 'existing' ? setQueue : setNewQueue;

      const blanks = list.filter(
        (q) => !q.title.trim() || !q.description.trim()
      );
      if (blanks.length === 0) {
        toast.info(
          isAr ? 'جميع الصور لديها نصوص بالفعل' : 'All images already have text'
        );
        return;
      }

      const context =
        targetQueue === 'existing'
          ? {
              clientName: selectedProject?.client || 'Pulse OCTO Client',
              category: selectedProject?.category || 'Branding',
              summary: selectedProject?.summary || '',
            }
          : {
              clientName: newClientAr || newClientEn || 'New Brand',
              category: newCategoryAr || newCategoryEn,
              summary: newSummaryAr || newSummaryEn,
            };

      for (let i = 0; i < blanks.length; i++) {
        const item = blanks[i];
        setProgressInfo({
          current: i + 1,
          total: blanks.length,
          stage: isAr
            ? `توليد نصوص بالذكاء الاصطناعي (${i + 1} / ${blanks.length})...`
            : `Generating AI copy (${i + 1} / ${blanks.length})...`,
        });
        setList((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, isGeneratingAi: true } : q))
        );
        try {
          const patch = await requestAiCopyForItem(item, context);
          setList((prev) =>
            prev.map((q) =>
              q.id === item.id ? { ...q, ...patch, isGeneratingAi: false } : q
            )
          );
        } catch {
          setList((prev) =>
            prev.map((q) => (q.id === item.id ? { ...q, isGeneratingAi: false } : q))
          );
        }
      }
      setProgressInfo(null);
      toast.success(
        isAr
          ? `تم توليد النصوص لـ ${blanks.length} ملف بنجاح`
          : `Generated copy for ${blanks.length} assets`
      );
    },
    [
      queue,
      newQueue,
      selectedProject,
      newClientAr,
      newClientEn,
      newCategoryAr,
      newCategoryEn,
      newSummaryAr,
      newSummaryEn,
      requestAiCopyForItem,
      toast,
      isAr,
    ]
  );

  const handlePublishToExisting = useCallback(async () => {
    if (!selectedProject || queue.length === 0 || isPublishing) return;

    const authed = await ensureCloudOwnerAuth();
    if (!authed) return;

    setIsPublishing(true);
    const total = queue.length;
    const addedAssets: NonNullable<ProjectItem['assetShowcase']> = [];
    const addedGallery: string[] = [];
    let logoUrl: string | undefined;
    let heroUrl: string | undefined;
    let pdfPayload: ProjectItem['brandGuidelinesPdf'] | undefined;

    try {
      for (let i = 0; i < queue.length; i++) {
        let current = queue[i];
        setProgressInfo({
          current: i + 1,
          total,
          stage: isAr
            ? `ضغط وحفظ الملف سحابياً ${i + 1} من ${total}...`
            : `Compressing & saving to cloud ${i + 1} of ${total}...`,
        });

        // 1. Auto-generate copy if user left title or description empty and Auto-AI is enabled
        if (
          autoAiEnabled &&
          (!current.title.trim() || !current.description.trim())
        ) {
          try {
            const aiPatch = await requestAiCopyForItem(current, {
              clientName: selectedProject.client,
              category: selectedProject.category,
              summary: selectedProject.summary,
            });
            current = { ...current, ...aiPatch };
          } catch {
            // Keep graceful fallback below
          }
        }

        // 2. Upload & store permanently inside Firebase Firestore
        const savedCloudAsset = await saveStudioAssetToCloud({
          projectId: selectedProject.id,
          file: current.file,
        });
        registerLocalAssetPreview(
          savedCloudAsset.url,
          savedCloudAsset.previewDataUrl
        );
        const savedUrl = savedCloudAsset.url;
        const fileSize = savedCloudAsset.fileSize;

        const finalTitle =
          current.title.trim() || `${selectedProject.client} — ${i + 1}`;
        const finalTitleEn =
          current.titleEn.trim() ||
          `${selectedProject.clientEn || selectedProject.client} — ${i + 1}`;
        const finalDesc =
          current.description.trim() ||
          `عنصر بصري مضاف حديثاً ضمن مشروع ${selectedProject.client}.`;
        const finalDescEn =
          current.descriptionEn.trim() ||
          `Curated visual deliverable for ${selectedProject.clientEn || selectedProject.client}.`;

        if (current.slot === 'pdf' || current.isPdf) {
          pdfPayload = {
            url: savedUrl,
            title: finalTitle,
            titleEn: finalTitleEn,
            description: finalDesc,
            descriptionEn: finalDescEn,
            fileSize,
          };
        } else if (current.slot === 'logo') {
          logoUrl = savedUrl;
        } else {
          if (current.slot === 'cover' && current.setAsHeroCover) {
            heroUrl = savedUrl;
          }
          addedAssets.push({
            url: savedUrl,
            title: finalTitle,
            titleEn: finalTitleEn,
            type: current.slot,
            description: finalDesc,
            descriptionEn: finalDescEn,
            ...(current.collectionTag
              ? { collectionTag: current.collectionTag }
              : {}),
            ...(current.collectionTagEn
              ? { collectionTagEn: current.collectionTagEn }
              : {}),
          });
          if (current.slot === 'lookbook') {
            addedGallery.push(savedUrl);
          }
        }
      }

      const customIdx = studioStore.customProjects.findIndex(
        (c) => c.id === selectedProject.id
      );

      if (customIdx >= 0) {
        const baseCustom = studioStore.customProjects[customIdx];
        const updatedCustom: ProjectItem = {
          ...baseCustom,
          ...(logoUrl ? { logo: logoUrl } : {}),
          ...(heroUrl ? { heroImage: heroUrl } : {}),
          ...(pdfPayload ? { brandGuidelinesPdf: pdfPayload } : {}),
          assetShowcase: [...addedAssets, ...(baseCustom.assetShowcase || [])],
          gallery: Array.from(
            new Set([...(baseCustom.gallery || []), ...addedGallery])
          ),
        };
        await persistCustomProjectToCloud(updatedCustom);
      } else {
        const existingOverride =
          studioStore.projectOverrides[selectedProject.id] || {};
        const prevAssets = Array.isArray(existingOverride.addedAssets)
          ? existingOverride.addedAssets
          : [];
        const prevGallery = Array.isArray(existingOverride.addedGallery)
          ? existingOverride.addedGallery
          : [];
        const prevRemoved = Array.isArray(existingOverride.removedAssetUrls)
          ? existingOverride.removedAssetUrls
          : [];
        const addedUrlSet = new Set(addedAssets.map((a) => a.url));

        const nextOverride: StudioProjectOverride = {
          ...existingOverride,
          ...(logoUrl ? { logo: logoUrl } : {}),
          ...(heroUrl ? { heroImage: heroUrl } : {}),
          ...(pdfPayload ? { brandGuidelinesPdf: pdfPayload } : {}),
          addedAssets: [...addedAssets, ...prevAssets],
          addedGallery: Array.from(new Set([...prevGallery, ...addedGallery])),
          removedAssetUrls: prevRemoved.filter((u) => !addedUrlSet.has(u)),
          updatedAt: new Date().toISOString(),
        };
        await persistProjectOverrideToCloud(selectedProject.id, nextOverride);
      }

      queue.forEach((q) => q.previewUrl && URL.revokeObjectURL(q.previewUrl));
      setQueue([]);
      setProgressInfo(null);

      toast.success(
        isAr ? 'تم الحفظ الدائم في السحابة!' : 'Saved Permanently to Cloud!',
        isAr
          ? `تم حفظ ${total} عنصر في قاعدة البيانات السحابية لمشروع ${selectedProject.client} ولن تُحذف أبداً.`
          : `Saved ${total} assets permanently to Firestore for ${selectedProject.client}.`,
        onNavigatePortfolio
          ? {
              action: {
                label: isAr ? 'عرض في مشاريعنا' : 'Open Portfolio',
                onClick: () => {
                  onClose();
                  onNavigatePortfolio();
                },
              },
            }
          : undefined
      );
    } catch (err: any) {
      toast.error(
        isAr ? 'حدث خطأ أثناء الحفظ السحابي' : 'Cloud Save Error',
        err?.message || (isAr ? 'حاول مرة أخرى.' : 'Please try again.')
      );
    } finally {
      setIsPublishing(false);
      setProgressInfo(null);
    }
  }, [
    selectedProject,
    queue,
    isPublishing,
    ensureCloudOwnerAuth,
    isAr,
    autoAiEnabled,
    requestAiCopyForItem,
    registerLocalAssetPreview,
    studioStore.customProjects,
    studioStore.projectOverrides,
    toast,
    onNavigatePortfolio,
    onClose,
  ]);

  const handleCreateNewProject = useCallback(async () => {
    if (!newClientAr.trim() || isPublishing) {
      toast.warning(
        isAr ? 'اكتب اسم العميل / البراند أولاً' : 'Enter client name first'
      );
      return;
    }

    const authed = await ensureCloudOwnerAuth();
    if (!authed) return;

    setIsPublishing(true);
    const tempProjectSlug =
      (newClientEn || newClientAr)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || `brand-${Date.now().toString(36)}`;
    const uniqueProjectId = `${tempProjectSlug}-${Date.now().toString(36).slice(-4)}`;

    const assetShowcase: NonNullable<ProjectItem['assetShowcase']> = [];
    const gallery: string[] = [];
    let logoUrl = '';
    let heroUrl = '';
    let pdfPayload: ProjectItem['brandGuidelinesPdf'] | undefined;

    try {
      const total = newQueue.length;
      for (let i = 0; i < total; i++) {
        let current = newQueue[i];
        setProgressInfo({
          current: i + 1,
          total,
          stage: isAr
            ? `حفظ سحابي وتوليد نصوص ${i + 1} من ${total}...`
            : `Cloud saving & captioning ${i + 1} of ${total}...`,
        });

        if (
          autoAiEnabled &&
          (!current.title.trim() || !current.description.trim())
        ) {
          try {
            const aiPatch = await requestAiCopyForItem(current, {
              clientName: newClientAr.trim(),
              category: newCategoryAr.trim(),
              summary: newSummaryAr.trim(),
            });
            current = { ...current, ...aiPatch };
          } catch {
            // fallback handled below
          }
        }

        const savedCloudAsset = await saveStudioAssetToCloud({
          projectId: uniqueProjectId,
          file: current.file,
        });
        registerLocalAssetPreview(
          savedCloudAsset.url,
          savedCloudAsset.previewDataUrl
        );
        const savedUrl = savedCloudAsset.url;

        const finalTitle =
          current.title.trim() || `${newClientAr.trim()} — ${i + 1}`;
        const finalTitleEn =
          current.titleEn.trim() ||
          `${(newClientEn || newClientAr).trim()} — ${i + 1}`;
        const finalDesc =
          current.description.trim() ||
          `عمل بصري متكامل من تنفيذ Pulse OCTO لصالح ${newClientAr.trim()}.`;
        const finalDescEn =
          current.descriptionEn.trim() ||
          `Curated creative asset engineered by Pulse OCTO for ${(newClientEn || newClientAr).trim()}.`;

        if (current.slot === 'pdf' || current.isPdf) {
          pdfPayload = {
            url: savedUrl,
            title: finalTitle,
            titleEn: finalTitleEn,
            description: finalDesc,
            descriptionEn: finalDescEn,
            fileSize: savedCloudAsset.fileSize,
          };
        } else if (current.slot === 'logo') {
          logoUrl = savedUrl;
        } else {
          if (!heroUrl && (current.slot === 'cover' || current.slot === 'brand')) {
            heroUrl = savedUrl;
          }
          assetShowcase.push({
            url: savedUrl,
            title: finalTitle,
            titleEn: finalTitleEn,
            type: current.slot,
            description: finalDesc,
            descriptionEn: finalDescEn,
            ...(current.collectionTag ? { collectionTag: current.collectionTag } : {}),
            ...(current.collectionTagEn ? { collectionTagEn: current.collectionTagEn } : {}),
          });
          gallery.push(savedUrl);
        }
      }

      if (!heroUrl && gallery.length > 0) {
        heroUrl = gallery[0];
      }

      const newProjectPayload: ProjectItem = {
        id: uniqueProjectId,
        slug: uniqueProjectId,
        title: newTitleAr.trim() || `${newClientAr.trim()} — منظومة براند متكاملة`,
        titleEn:
          newTitleEn.trim() ||
          `${(newClientEn || newClientAr).trim()} — Integrated Brand System`,
        category: newCategoryAr.trim(),
        categoryEn: newCategoryEn.trim(),
        tag: newTagAr.trim(),
        tagEn: newTagEn.trim(),
        summary:
          newSummaryAr.trim() ||
          `تطوير الهوية البصرية والحضور الرقمي لعلامة ${newClientAr.trim()} ضمن منظومة متكاملة تعكس قيمة العلامة في السوق.`,
        summaryEn:
          newSummaryEn.trim() ||
          `Full visual identity and digital presence crafted by Pulse OCTO for ${(newClientEn || newClientAr).trim()}.`,
        heroImage: heroUrl,
        logo: logoUrl || undefined,
        websiteUrl: newWebsiteUrl.trim() || undefined,
        gallery,
        client: newClientAr.trim(),
        clientEn: (newClientEn || newClientAr).trim(),
        duration: isAr ? 'منظومة متكاملة' : 'Integrated System',
        durationEn: 'Integrated System',
        challenge: newSummaryAr.trim() || `بناء حضور بصري وتسويقي متكامل لعلامة ${newClientAr.trim()}.`,
        challengeEn: newSummaryEn.trim() || `Building a cohesive brand presence for ${(newClientEn || newClientAr).trim()}.`,
        solution:
          newSummaryAr.trim() ||
          `صياغة الهوية البصرية والمحتوى الإبداعي وتطبيقاتهما عبر المنصات الرقمية.`,
        solutionEn:
          newSummaryEn.trim() ||
          `Crafting visual identity, creative direction, and cohesive digital assets.`,
        location: newLocationAr.trim() || 'مصر',
        locationEn: newLocationEn.trim() || 'Egypt',
        year: newYear.trim() || String(new Date().getFullYear()),
        stats: [],
        deliverables: ['الهوية البصرية الكاملة', 'إدارة وإنتاج المحتوى الإبداعي'],
        deliverablesEn: ['Complete Brand Identity', 'Creative Direction & Production'],
        brandColors: newColors,
        assetShowcase,
        ...(pdfPayload ? { brandGuidelinesPdf: pdfPayload } : {}),
      };

      await persistCustomProjectToCloud(newProjectPayload);

      newQueue.forEach((q) => q.previewUrl && URL.revokeObjectURL(q.previewUrl));
      setNewQueue([]);
      setNewClientAr('');
      setNewClientEn('');
      setNewTitleAr('');
      setNewTitleEn('');
      setNewSummaryAr('');
      setNewSummaryEn('');
      setNewWebsiteUrl('');
      setProgressInfo(null);

      toast.success(
        isAr ? 'تم إنشاء المشروع وحفظه سحابياً!' : 'New Project Saved to Cloud!',
        isAr
          ? `أصبح مشروع "${newProjectPayload.client}" محفوظاً دائماً وظاهراً الآن في صفحة مشاريعنا.`
          : `"${newProjectPayload.clientEn}" is permanently saved and live in Portfolio.`,
        onNavigatePortfolio
          ? {
              action: {
                label: isAr ? 'معاينة في مشاريعنا' : 'View in Projects',
                onClick: () => {
                  onClose();
                  onNavigatePortfolio();
                },
              },
            }
          : undefined
      );
      setSelectedProjectId(newProjectPayload.id);
      setActiveTab('manage');
    } catch (err: any) {
      toast.error(
        isAr ? 'تعذر إنشاء المشروع' : 'Could not create project',
        err?.message || ''
      );
    } finally {
      setIsPublishing(false);
      setProgressInfo(null);
    }
  }, [
    newClientAr,
    newClientEn,
    newTitleAr,
    newTitleEn,
    newCategoryAr,
    newCategoryEn,
    newTagAr,
    newTagEn,
    newSummaryAr,
    newSummaryEn,
    newLocationAr,
    newLocationEn,
    newYear,
    newWebsiteUrl,
    newColors,
    newQueue,
    isPublishing,
    ensureCloudOwnerAuth,
    autoAiEnabled,
    requestAiCopyForItem,
    registerLocalAssetPreview,
    toast,
    isAr,
    onNavigatePortfolio,
    onClose,
  ]);

  const handleDeleteAsset = useCallback(
    async (
      projectId: string,
      displayUrl: string,
      isPdf = false,
      slotTarget?: 'logo' | 'pdf' | 'asset'
    ) => {
      const authed = await ensureCloudOwnerAuth();
      if (!authed) return;

      const canonicalUrl = toCanonicalUrl(displayUrl);
      try {
        const customIdx = studioStore.customProjects.findIndex(
          (c) => c.id === projectId
        );
        if (customIdx >= 0) {
          const targetProj = { ...studioStore.customProjects[customIdx] };
          if (slotTarget === 'pdf' || isPdf) {
            delete targetProj.brandGuidelinesPdf;
          } else if (slotTarget === 'logo') {
            delete targetProj.logo;
          } else {
            targetProj.gallery = (targetProj.gallery || []).filter(
              (u) => u !== canonicalUrl && u !== displayUrl
            );
            targetProj.assetShowcase = (targetProj.assetShowcase || []).filter(
              (a) => a.url !== canonicalUrl && a.url !== displayUrl
            );
            if (targetProj.heroImage === canonicalUrl || targetProj.heroImage === displayUrl) {
              targetProj.heroImage = targetProj.gallery[0] || '';
            }
          }
          await persistCustomProjectToCloud(targetProj);
        } else {
          const existing = { ...(studioStore.projectOverrides[projectId] || {}) };
          if (slotTarget === 'pdf' || isPdf) {
            delete existing.brandGuidelinesPdf;
          } else if (slotTarget === 'logo') {
            if (existing.logo) delete existing.logo;
            existing.removedAssetUrls = Array.from(
              new Set([...(existing.removedAssetUrls || []), canonicalUrl])
            );
          } else {
            existing.addedAssets = (existing.addedAssets || []).filter(
              (a) => a.url !== canonicalUrl && a.url !== displayUrl
            );
            existing.addedGallery = (existing.addedGallery || []).filter(
              (u) => u !== canonicalUrl && u !== displayUrl
            );
            if (existing.heroImage === canonicalUrl || existing.heroImage === displayUrl) {
              delete existing.heroImage;
            }
            existing.removedAssetUrls = Array.from(
              new Set([...(existing.removedAssetUrls || []), canonicalUrl])
            );
          }
          await persistProjectOverrideToCloud(projectId, existing);
        }

        if (canonicalUrl.startsWith(STUDIO_ASSET_PREFIX)) {
          await deleteStudioAssetFromCloud(
            canonicalUrl.slice(STUDIO_ASSET_PREFIX.length)
          );
        }

        if (editingUrl === displayUrl) {
          setEditingUrl(null);
          setEditDraft(null);
        }
        toast.info(isAr ? 'تم حذف العنصر من السحابة' : 'Asset removed from cloud');
      } catch {
        toast.error(isAr ? 'تعذر الحذف' : 'Failed to remove');
      }
    },
    [
      ensureCloudOwnerAuth,
      toCanonicalUrl,
      studioStore.customProjects,
      studioStore.projectOverrides,
      editingUrl,
      toast,
      isAr,
    ]
  );

  const handleDeleteCustomProject = useCallback(
    async (projectId: string) => {
      const authed = await ensureCloudOwnerAuth();
      if (!authed) return;
      try {
        await deleteStudioProjectFromCloud(projectId);
        toast.info(isAr ? 'تم حذف المشروع المخصص' : 'Custom project deleted');
      } catch {
        toast.error(isAr ? 'تعذر حذف المشروع' : 'Failed to delete project');
      }
    },
    [ensureCloudOwnerAuth, toast, isAr]
  );

  const triggerReplacePicker = useCallback(
    (target: PendingReplaceTarget) => {
      pendingReplaceTargetRef.current = target;
      if (replaceFileInputRef.current) {
        replaceFileInputRef.current.accept =
          target.slotTarget === 'pdf' ? 'application/pdf' : 'image/*';
        replaceFileInputRef.current.value = '';
        replaceFileInputRef.current.click();
      }
    },
    []
  );

  const handleReplaceFileSelected = useCallback(
    async (file: File) => {
      const target = pendingReplaceTargetRef.current;
      if (!target) return;

      const authed = await ensureCloudOwnerAuth();
      if (!authed) return;

      const isPdfTarget = target.slotTarget === 'pdf';
      const loadingId = target.originalUrl || target.slotTarget;
      setReplacingKey(loadingId);

      try {
        const savedCloudAsset = await saveStudioAssetToCloud({
          projectId: target.projectId,
          file,
        });
        registerLocalAssetPreview(
          savedCloudAsset.url,
          savedCloudAsset.previewDataUrl
        );
        const savedCanonicalUrl = savedCloudAsset.url;
        const canonicalOriginalUrl = toCanonicalUrl(target.originalUrl || '');

        let updatedFields: Partial<ExistingAssetEditable> = {
          title: target.currentMeta?.title || '',
          titleEn: target.currentMeta?.titleEn || '',
          description: target.currentMeta?.description || '',
          descriptionEn: target.currentMeta?.descriptionEn || '',
          type: target.currentMeta?.type || 'lookbook',
        };

        if (!isPdfTarget && target.slotTarget === 'asset' && autoAiOnReplace && file.type.startsWith('image/')) {
          try {
            const visionPayload = await createVisionAnalysisDataUrl(file);
            const aiRes = await fetch('/api/studio/generate-copy', {
              method: 'POST',
              headers: authHeaders,
              body: JSON.stringify({
                dataBase64: visionPayload.dataBase64,
                mimeType: visionPayload.mimeType,
                clientName: selectedProjectAr?.client || target.projectId,
                projectCategory: selectedProjectAr?.category || '',
                assetType: target.currentMeta?.type || 'lookbook',
                brandSummary: selectedProjectAr?.summary || '',
              }),
            });
            if (aiRes.ok) {
              const aiJson = await aiRes.json();
              if (aiJson?.data) {
                updatedFields = {
                  ...updatedFields,
                  title: aiJson.data.title || updatedFields.title,
                  titleEn: aiJson.data.titleEn || updatedFields.titleEn,
                  description: aiJson.data.description || updatedFields.description,
                  descriptionEn:
                    aiJson.data.descriptionEn || updatedFields.descriptionEn,
                  collectionTag: aiJson.data.collectionTag,
                  collectionTagEn: aiJson.data.collectionTagEn,
                };
              }
            }
          } catch {
            // keep existing metadata if AI generation fails
          }
        }

        const customIdx = studioStore.customProjects.findIndex(
          (c) => c.id === target.projectId
        );

        if (customIdx >= 0) {
          const targetProj = { ...studioStore.customProjects[customIdx] };
          if (isPdfTarget) {
            targetProj.brandGuidelinesPdf = {
              url: savedCanonicalUrl,
              title:
                selectedProjectAr?.brandGuidelinesPdf?.title ||
                `دليل الهوية البصرية — ${selectedProjectAr?.client || target.projectId}`,
              titleEn:
                selectedProjectEn?.brandGuidelinesPdf?.title ||
                `Brand Guidelines Book — ${selectedProjectEn?.client || target.projectId}`,
              description:
                selectedProjectAr?.brandGuidelinesPdf?.description ||
                `ملف الهوية البصرية المعتمد لعلامة ${selectedProjectAr?.client || target.projectId}.`,
              descriptionEn:
                selectedProjectEn?.brandGuidelinesPdf?.description ||
                `Official brand guidelines PDF for ${selectedProjectEn?.client || target.projectId}.`,
              fileSize: savedCloudAsset.fileSize,
            };
          } else if (target.slotTarget === 'logo') {
            targetProj.logo = savedCanonicalUrl;
          } else if (target.slotTarget === 'hero') {
            targetProj.heroImage = savedCanonicalUrl;
          } else {
            targetProj.assetShowcase = (targetProj.assetShowcase || []).map((a) =>
              a.url === canonicalOriginalUrl || a.url === target.originalUrl
                ? {
                    ...a,
                    url: savedCanonicalUrl,
                    type: (updatedFields.type as any) || a.type,
                    title: updatedFields.title || a.title,
                    titleEn: updatedFields.titleEn || a.titleEn,
                    description: updatedFields.description || a.description,
                    descriptionEn: updatedFields.descriptionEn || a.descriptionEn,
                  }
                : a
            );
            targetProj.gallery = (targetProj.gallery || []).map((u) =>
              u === canonicalOriginalUrl || u === target.originalUrl
                ? savedCanonicalUrl
                : u
            );
            if (target.currentMeta?.url === selectedProjectAr?.heroImage) {
              targetProj.heroImage = savedCanonicalUrl;
            }
          }
          await persistCustomProjectToCloud(targetProj);
        } else {
          const existing = {
            ...(studioStore.projectOverrides[target.projectId] || {}),
          };
          if (isPdfTarget) {
            existing.brandGuidelinesPdf = {
              url: savedCanonicalUrl,
              title:
                selectedProjectAr?.brandGuidelinesPdf?.title ||
                `دليل الهوية البصرية — ${selectedProjectAr?.client || target.projectId}`,
              titleEn:
                selectedProjectEn?.brandGuidelinesPdf?.title ||
                `Brand Guidelines Book — ${selectedProjectEn?.client || target.projectId}`,
              description:
                selectedProjectAr?.brandGuidelinesPdf?.description ||
                `ملف الهوية البصرية المعتمد لعلامة ${selectedProjectAr?.client || target.projectId}.`,
              descriptionEn:
                selectedProjectEn?.brandGuidelinesPdf?.description ||
                `Official brand guidelines PDF for ${selectedProjectEn?.client || target.projectId}.`,
              fileSize: savedCloudAsset.fileSize,
            };
          } else if (target.slotTarget === 'logo') {
            existing.logo = savedCanonicalUrl;
          } else if (target.slotTarget === 'hero') {
            existing.heroImage = savedCanonicalUrl;
          } else {
            let replacedAdded = false;
            existing.addedAssets = (existing.addedAssets || []).map((a) => {
              if (a.url === canonicalOriginalUrl || a.url === target.originalUrl) {
                replacedAdded = true;
                return {
                  ...a,
                  url: savedCanonicalUrl,
                  type: (updatedFields.type as any) || a.type,
                  title: updatedFields.title || a.title,
                  titleEn: updatedFields.titleEn || a.titleEn,
                  description: updatedFields.description || a.description,
                  descriptionEn: updatedFields.descriptionEn || a.descriptionEn,
                };
              }
              return a;
            });
            existing.addedGallery = (existing.addedGallery || []).map((u) =>
              u === canonicalOriginalUrl || u === target.originalUrl
                ? savedCanonicalUrl
                : u
            );
            if (!replacedAdded && canonicalOriginalUrl) {
              existing.replacedAssets = {
                ...(existing.replacedAssets || {}),
                [canonicalOriginalUrl]: {
                  url: savedCanonicalUrl,
                  type: (updatedFields.type as any) || 'lookbook',
                  title: updatedFields.title,
                  titleEn: updatedFields.titleEn,
                  description: updatedFields.description,
                  descriptionEn: updatedFields.descriptionEn,
                  collectionTag: updatedFields.collectionTag,
                  collectionTagEn: updatedFields.collectionTagEn,
                },
              };
            }
            if (target.currentMeta?.url === selectedProjectAr?.heroImage) {
              existing.heroImage = savedCanonicalUrl;
            }
          }
          await persistProjectOverrideToCloud(target.projectId, existing);
        }

        if (editingUrl && editingUrl === target.originalUrl) {
          setEditingUrl(savedCloudAsset.previewDataUrl);
          setEditDraft((prev) =>
            prev
              ? {
                  ...prev,
                  ...updatedFields,
                  url: savedCloudAsset.previewDataUrl,
                }
              : null
          );
        }

        toast.success(
          isAr ? 'تم استبدال الملف وحفظه سحابياً!' : 'Replaced & Saved to Cloud!',
          isAr
            ? 'تم تحديث الصورة مباشرة في صفحة المشروع وحفظها في السحابة.'
            : 'Updated live and saved permanently in Firestore.'
        );
      } catch (err: any) {
        toast.error(
          isAr ? 'تعذر استبدال الملف' : 'Could not replace asset',
          err?.message || ''
        );
      } finally {
        setReplacingKey(null);
        pendingReplaceTargetRef.current = null;
      }
    },
    [
      ensureCloudOwnerAuth,
      registerLocalAssetPreview,
      toCanonicalUrl,
      authHeaders,
      selectedProjectAr,
      selectedProjectEn,
      autoAiOnReplace,
      studioStore.customProjects,
      studioStore.projectOverrides,
      editingUrl,
      toast,
      isAr,
    ]
  );

  const handleSetAsHeroCover = useCallback(
    async (projectId: string, item: ExistingAssetEditable) => {
      const authed = await ensureCloudOwnerAuth();
      if (!authed) return;
      setIsSavingEdit(true);
      const canonicalUrl = toCanonicalUrl(item.url);
      try {
        const customIdx = studioStore.customProjects.findIndex(
          (c) => c.id === projectId
        );
        if (customIdx >= 0) {
          const targetProj = {
            ...studioStore.customProjects[customIdx],
            heroImage: canonicalUrl,
          };
          await persistCustomProjectToCloud(targetProj);
        } else {
          const existing = {
            ...(studioStore.projectOverrides[projectId] || {}),
            heroImage: canonicalUrl,
          };
          await persistProjectOverrideToCloud(projectId, existing);
        }
        toast.success(
          isAr ? 'تم التعيين كغلاف رئيسي وحفظه سحابياً' : 'Hero Cover Saved to Cloud'
        );
      } catch {
        toast.error(isAr ? 'تعذر تحديث الغلاف' : 'Failed to update hero cover');
      } finally {
        setIsSavingEdit(false);
      }
    },
    [
      ensureCloudOwnerAuth,
      toCanonicalUrl,
      studioStore.customProjects,
      studioStore.projectOverrides,
      toast,
      isAr,
    ]
  );

  const handleGenerateAiForExistingAsset = useCallback(async () => {
    if (!editDraft || !selectedProjectAr) return;
    setIsGeneratingEditAi(true);
    try {
      const isDataUri = editDraft.url.startsWith('data:');
      const mimeMatch = isDataUri ? editDraft.url.match(/^data:([^;]+);/) : null;
      const res = await fetch('/api/studio/generate-copy', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          ...(isDataUri
            ? {
                dataBase64: editDraft.url,
                mimeType: mimeMatch?.[1] || 'image/webp',
              }
            : { imageUrl: editDraft.url }),
          clientName: selectedProjectAr.client,
          projectCategory: selectedProjectAr.category,
          assetType: editDraft.type,
          brandSummary: selectedProjectAr.summary,
        }),
      });
      if (!res.ok) throw new Error('AI generation failed');
      const json = await res.json();
      if (json?.data) {
        setEditDraft((prev) =>
          prev
            ? {
                ...prev,
                title: json.data.title || prev.title,
                titleEn: json.data.titleEn || prev.titleEn,
                description: json.data.description || prev.description,
                descriptionEn: json.data.descriptionEn || prev.descriptionEn,
                collectionTag: json.data.collectionTag || prev.collectionTag,
                collectionTagEn: json.data.collectionTagEn || prev.collectionTagEn,
              }
            : prev
        );
        toast.success(
          isAr ? 'تم توليد النصوص بالذكاء الاصطناعي' : 'AI copy generated'
        );
      }
    } catch {
      toast.error(isAr ? 'تعذر توليد النصوص' : 'AI generation failed');
    } finally {
      setIsGeneratingEditAi(false);
    }
  }, [editDraft, selectedProjectAr, authHeaders, toast, isAr]);

  const handleSaveAssetMetadata = useCallback(async () => {
    if (!editDraft || !selectedProjectAr) return;
    const authed = await ensureCloudOwnerAuth();
    if (!authed) return;

    setIsSavingEdit(true);
    const canonicalUrl = toCanonicalUrl(editDraft.url);
    try {
      const customIdx = studioStore.customProjects.findIndex(
        (c) => c.id === selectedProjectAr.id
      );
      if (customIdx >= 0) {
        const targetProj = { ...studioStore.customProjects[customIdx] };
        targetProj.assetShowcase = (targetProj.assetShowcase || []).map((a) =>
          a.url === canonicalUrl || a.url === editDraft.url
            ? {
                ...a,
                title: editDraft.title,
                titleEn: editDraft.titleEn,
                description: editDraft.description,
                descriptionEn: editDraft.descriptionEn,
                type: editDraft.type as any,
                collectionTag: editDraft.collectionTag,
                collectionTagEn: editDraft.collectionTagEn,
              }
            : a
        );
        if (editDraft.type === 'cover') {
          targetProj.heroImage = canonicalUrl;
        }
        await persistCustomProjectToCloud(targetProj);
      } else {
        const existing = {
          ...(studioStore.projectOverrides[selectedProjectAr.id] || {}),
        };
        let foundInAdded = false;
        existing.addedAssets = (existing.addedAssets || []).map((a) => {
          if (a.url === canonicalUrl || a.url === editDraft.url) {
            foundInAdded = true;
            return {
              ...a,
              title: editDraft.title,
              titleEn: editDraft.titleEn,
              description: editDraft.description,
              descriptionEn: editDraft.descriptionEn,
              type: editDraft.type as any,
              collectionTag: editDraft.collectionTag,
              collectionTagEn: editDraft.collectionTagEn,
            };
          }
          return a;
        });
        if (!foundInAdded && canonicalUrl) {
          existing.replacedAssets = {
            ...(existing.replacedAssets || {}),
            [canonicalUrl]: {
              ...(existing.replacedAssets?.[canonicalUrl] || {}),
              url: canonicalUrl,
              title: editDraft.title,
              titleEn: editDraft.titleEn,
              description: editDraft.description,
              descriptionEn: editDraft.descriptionEn,
              type: editDraft.type as any,
              collectionTag: editDraft.collectionTag,
              collectionTagEn: editDraft.collectionTagEn,
            },
          };
        }
        if (editDraft.type === 'cover') {
          existing.heroImage = canonicalUrl;
        }
        await persistProjectOverrideToCloud(selectedProjectAr.id, existing);
      }
      setEditingUrl(null);
      setEditDraft(null);
      toast.success(
        isAr ? 'تم حفظ التعديلات في السحابة!' : 'Saved permanently to cloud!'
      );
    } catch {
      toast.error(isAr ? 'تعذر حفظ التعديلات' : 'Failed to save changes');
    } finally {
      setIsSavingEdit(false);
    }
  }, [
    editDraft,
    selectedProjectAr,
    ensureCloudOwnerAuth,
    toCanonicalUrl,
    studioStore.customProjects,
    studioStore.projectOverrides,
    toast,
    isAr,
  ]);

  const renderQueueCards = (
    items: QueuedAssetItem[],
    setItems: React.Dispatch<React.SetStateAction<QueuedAssetItem[]>>,
    queueType: 'existing' | 'new'
  ) => (
    <div className="space-y-3 mt-4">
      {items.map((item, idx) => (
        <div
          key={item.id}
          className="rounded-2xl bg-white/[0.03] border border-white/10 p-3.5 sm:p-4 flex flex-col sm:flex-row gap-4"
        >
          {/* Preview Thumbnail */}
          <div className="w-full sm:w-28 h-28 rounded-xl bg-black/50 border border-white/10 overflow-hidden flex items-center justify-center shrink-0 relative">
            {item.isPdf ? (
              <div className="flex flex-col items-center gap-1 text-amber-300 px-2 text-center">
                <FileText className="w-7 h-7" />
                <span className="text-[10px] font-mono truncate max-w-[96px]">
                  {item.file.name}
                </span>
              </div>
            ) : (
              <img
                src={item.previewUrl}
                alt={item.file.name}
                className="w-full h-full object-cover"
              />
            )}
            <span className="absolute top-1.5 start-1.5 px-1.5 py-0.5 rounded bg-black/75 text-[10px] font-mono text-zinc-200">
              {idx + 1}
            </span>
          </div>

          {/* Copy Fields & Slot Controls */}
          <div className="flex-1 min-w-0 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={item.slot}
                  onChange={(e) => {
                    const nextSlot = e.target.value as StudioUploadedAssetSlot;
                    setItems((prev) =>
                      prev.map((q) =>
                        q.id === item.id
                          ? { ...q, slot: nextSlot, setAsHeroCover: nextSlot === 'cover' }
                          : q
                      )
                    );
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-[#0d0a17] border border-white/15 text-xs text-white focus:outline-none focus:border-purple-400"
                >
                  {SLOT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {isAr ? opt.labelAr : opt.labelEn}
                    </option>
                  ))}
                </select>

                {item.aiGenerated ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/35 text-[11px] font-semibold text-emerald-300">
                    <Sparkles className="w-3 h-3" />
                    {isAr ? 'نصوص مولّدة بالـ AI' : 'AI Copy Ready'}
                  </span>
                ) : autoAiEnabled && (!item.title.trim() || !item.description.trim()) ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-purple-500/15 border border-purple-400/35 text-[11px] text-purple-200">
                    <Wand2 className="w-3 h-3" />
                    {isAr
                      ? 'سيُولّد الشرح تلقائياً عند النشر'
                      : 'Auto-AI will fill blank fields'}
                  </span>
                ) : null}
              </div>

              <div className="flex items-center gap-1.5">
                {!item.isPdf && (
                  <button
                    type="button"
                    disabled={item.isGeneratingAi}
                    onClick={() => handleGenerateSingleCopy(item.id, queueType)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-600/25 hover:bg-purple-600/45 border border-purple-400/40 text-[11px] font-bold text-purple-100 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {item.isGeneratingAi ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3" />
                    )}
                    <span>{isAr ? 'توليد النص الآن' : 'Generate Text'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
                    setItems((prev) => prev.filter((q) => q.id !== item.id));
                  }}
                  className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-rose-500/20 border border-white/10 text-zinc-400 hover:text-rose-300 transition-colors cursor-pointer"
                  aria-label="Remove item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={item.title}
                onChange={(e) =>
                  setItems((prev) =>
                    prev.map((q) =>
                      q.id === item.id ? { ...q, title: e.target.value } : q
                    )
                  )
                }
                placeholder={
                  isAr
                    ? 'العنوان بالعربية (اختياري — اتركه فارغاً للتوليد التلقائي)'
                    : 'Arabic Title (optional — leave blank for AI)'
                }
                className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-400"
              />
              <input
                type="text"
                value={item.titleEn}
                onChange={(e) =>
                  setItems((prev) =>
                    prev.map((q) =>
                      q.id === item.id ? { ...q, titleEn: e.target.value } : q
                    )
                  )
                }
                placeholder={
                  isAr
                    ? 'العنوان بالإنجليزية (اختياري)'
                    : 'English Title (optional)'
                }
                className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <textarea
                rows={2}
                value={item.description}
                onChange={(e) =>
                  setItems((prev) =>
                    prev.map((q) =>
                      q.id === item.id ? { ...q, description: e.target.value } : q
                    )
                  )
                }
                placeholder={
                  isAr
                    ? 'وصف / شرح الصورة بالعربية (اختياري — يُولّد تلقائياً بالـ AI لو فارغ)'
                    : 'Arabic caption (optional — auto-generated if empty)'
                }
                className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-400 resize-none"
              />
              <textarea
                rows={2}
                value={item.descriptionEn}
                onChange={(e) =>
                  setItems((prev) =>
                    prev.map((q) =>
                      q.id === item.id ? { ...q, descriptionEn: e.target.value } : q
                    )
                  )
                }
                placeholder={
                  isAr
                    ? 'وصف بالإنجليزية (اختياري)'
                    : 'English caption (optional)'
                }
                className="w-full px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-400 resize-none"
              />
            </div>

            {item.slot === 'cover' && queueType === 'existing' && (
              <label className="inline-flex items-center gap-2 text-xs text-zinc-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(item.setAsHeroCover)}
                  onChange={(e) =>
                    setItems((prev) =>
                      prev.map((q) =>
                        q.id === item.id
                          ? { ...q, setAsHeroCover: e.target.checked }
                          : q
                      )
                    )
                  }
                  className="accent-purple-500"
                />
                <span>
                  {isAr
                    ? 'تعيين هذه الصورة كغلاف رئيسي للمشروع (Hero Cover)'
                    : 'Set as primary project Hero Cover'}
                </span>
              </label>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1100] bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-5"
        dir={dir}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.97 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-5xl max-h-[92vh] rounded-3xl bg-[#07050c] border border-purple-500/35 shadow-[0_30px_90px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden text-white"
        >
          {/* Header */}
          <header className="px-5 sm:px-7 py-4 border-b border-white/10 bg-[#0b0714] flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-400/40 flex items-center justify-center text-purple-300 shrink-0">
                <Wand2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black text-white truncate">
                    {isAr
                      ? 'استوديو إدارة المشاريع والرفع الذكي'
                      : 'Owner Studio — Projects & AI Asset Manager'}
                  </h2>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/35 text-[10px] font-bold text-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {isAr ? 'خاص بالمالك فقط' : 'Owner Only'}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 truncate">
                  {isAr
                    ? 'ارفع صور المشاريع دفعة واحدة أو أضف مشروعاً جديداً مع الحفظ السحابي الدائم.'
                    : 'Batch-upload visuals or create projects saved permanently in Firebase Cloud.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer shrink-0"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </header>

          {/* Permanent Cloud Storage & Backup Status Bar */}
          <div className="px-5 sm:px-7 py-2.5 border-b border-white/[0.08] bg-[#080512] flex flex-wrap items-center justify-between gap-2.5 shrink-0">
            <div className="flex items-center gap-2 text-xs min-w-0">
              {isCloudOwnerReady ? (
                <>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {isAr
                        ? 'الحفظ السحابي الدائم مفعّل (Firebase)'
                        : 'Permanent Cloud Save Active'}
                    </span>
                  </span>
                  <span className="text-zinc-400 truncate hidden sm:inline font-mono text-[11px]">
                    {firebaseUser?.email}
                  </span>
                </>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-200 font-semibold">
                  <Cloud className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {firebaseUser
                      ? isAr
                        ? `الحساب الحالي (${firebaseUser.email}) غير مطابق للمالك`
                        : `Signed in as ${firebaseUser.email} — owner required`
                      : isAr
                        ? 'فعّل تسجيل الدخول بجوجل لحفظ صورك سحابياً للأبد'
                        : 'Sign in with Google to persist uploads permanently'}
                  </span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <input
                ref={backupImportInputRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    void handleImportBackup(file);
                  }
                  e.target.value = '';
                }}
              />

              <button
                type="button"
                onClick={handleExportBackup}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-[11px] font-bold text-zinc-200 cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>{isAr ? 'تصدير نسخة (JSON)' : 'Export Backup'}</span>
              </button>

              <button
                type="button"
                onClick={() => backupImportInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-[11px] font-bold text-zinc-200 cursor-pointer"
              >
                <Upload className="w-3 h-3" />
                <span>{isAr ? 'استيراد نسخة' : 'Import Backup'}</span>
              </button>

              {isCloudOwnerReady ? (
                <button
                  type="button"
                  onClick={() => void signOutOwner()}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-rose-500/20 border border-white/10 text-[11px] text-zinc-400 hover:text-rose-200 cursor-pointer"
                  title={isAr ? 'تسجيل الخروج من السحابة' : 'Sign out'}
                >
                  <LogOut className="w-3 h-3" />
                  <span>{isAr ? 'خروج' : 'Sign out'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isAuthenticatingCloud}
                  onClick={() => void handleCloudSignIn()}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold cursor-pointer disabled:opacity-50"
                >
                  {isAuthenticatingCloud ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Cloud className="w-3 h-3" />
                  )}
                  <span>
                    {isAr
                      ? 'تفعيل الحفظ السحابي (Google)'
                      : 'Connect Cloud (Google)'}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-5 sm:px-7 py-3 border-b border-white/[0.08] bg-[#090611] flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
                  activeTab === 'upload'
                    ? 'bg-[#7c3aed] text-white border-purple-400/60 shadow-[0_6px_20px_rgba(124,58,237,0.35)]'
                    : 'bg-white/[0.03] text-zinc-300 hover:text-white border-white/10'
                }`}
              >
                <Upload className="w-4 h-4" />
                <span>{isAr ? 'رفع صور/ملفات لمشروع' : 'Upload Project Assets'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('create')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
                  activeTab === 'create'
                    ? 'bg-[#7c3aed] text-white border-purple-400/60 shadow-[0_6px_20px_rgba(124,58,237,0.35)]'
                    : 'bg-white/[0.03] text-zinc-300 hover:text-white border-white/10'
                }`}
              >
                <FolderPlus className="w-4 h-4" />
                <span>{isAr ? 'إضافة مشروع جديد' : 'Add New Project'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('manage')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border ${
                  activeTab === 'manage'
                    ? 'bg-[#7c3aed] text-white border-purple-400/60 shadow-[0_6px_20px_rgba(124,58,237,0.35)]'
                    : 'bg-white/[0.03] text-zinc-300 hover:text-white border-white/10'
                }`}
              >
                <Pencil className="w-4 h-4" />
                <span>
                  {isAr ? 'تعديل وتغيير الصور' : 'Edit & Replace Images'}
                </span>
              </button>
            </div>

            {/* Auto-AI Global Toggle */}
            <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-zinc-200 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={autoAiEnabled}
                onChange={(e) => setAutoAiEnabled(e.target.checked)}
                className="accent-purple-500"
              />
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span>
                {isAr
                  ? 'توليد النصوص بالـ AI تلقائياً عند ترك الشرح فارغاً'
                  : 'Auto-AI text for blank captions'}
              </span>
            </label>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
            {/* =======================================================
                TAB 1: UPLOAD IMAGES / PDF TO EXISTING PROJECT
               ======================================================= */}
            {activeTab === 'upload' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Project Selector */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                      {isAr ? 'اختر المشروع المستهدف' : 'Select Target Project'}
                    </label>
                    <select
                      value={selectedProjectId}
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#100b1d] border border-white/15 text-sm font-semibold text-white focus:outline-none focus:border-purple-400"
                    >
                      {allProjects.map((proj) => (
                        <option key={proj.id} value={proj.id}>
                          {isAr ? proj.client : proj.clientEn || proj.client} —{' '}
                          {proj.category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Default Upload Slot */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                      {isAr
                        ? 'تصنيف الصور/الملفات المرفوعة'
                        : 'Asset Section Placement'}
                    </label>
                    <select
                      value={defaultUploadSlot}
                      onChange={(e) =>
                        setDefaultUploadSlot(e.target.value as StudioUploadedAssetSlot)
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-[#100b1d] border border-white/15 text-sm font-semibold text-white focus:outline-none focus:border-purple-400"
                    >
                      {SLOT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {isAr ? opt.labelAr : opt.labelEn}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Drag & Drop Multi-File Zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files?.length) {
                      setQueue((prev) => [
                        ...prev,
                        ...buildQueuedItems(e.dataTransfer.files, defaultUploadSlot),
                      ]);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`rounded-3xl border-2 border-dashed p-8 sm:p-10 text-center transition-all cursor-pointer ${
                    isDragging
                      ? 'border-purple-400 bg-purple-500/15'
                      : 'border-white/15 hover:border-purple-400/60 bg-white/[0.02] hover:bg-white/[0.04]'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.length) {
                        setQueue((prev) => [
                          ...prev,
                          ...buildQueuedItems(e.target.files!, defaultUploadSlot),
                        ]);
                        e.target.value = '';
                      }
                    }}
                  />
                  <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-400/35 flex items-center justify-center text-purple-300 mx-auto mb-3">
                    <ImageIcon className="w-7 h-7" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {isAr
                      ? 'اسحب الصور أو ملف PDF هنا — أو اضغط للاختيار'
                      : 'Drag & drop images or PDF here — or click to browse'}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 max-w-xl mx-auto">
                    {isAr
                      ? 'يمكنك اختيار صورة واحدة أو 40+ صورة معاً (JPG, PNG, WEBP, PDF). إذا تركت العنوان أو الشرح فارغاً سيقوم الذكاء الاصطناعي بكتابتهما حسب محتوى كل صورة.'
                      : 'Select 1 or 40+ files at once (JPG, PNG, WEBP, PDF). Leave any title or caption blank and Gemini AI will craft bilingual copy from the image.'}
                  </p>
                </div>

                {queue.length > 0 && (
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-white/10">
                      <span className="text-xs sm:text-sm font-bold text-white">
                        {isAr
                          ? `الملفات الجاهزة للرفع (${queue.length})`
                          : `Queued Files (${queue.length})`}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={isPublishing}
                          onClick={() => handleGenerateBlankCopies('existing')}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/25 hover:bg-purple-600/40 border border-purple-400/40 text-xs font-bold text-purple-100 transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>
                            {isAr
                              ? 'توليد نصوص الصور الفارغة الآن'
                              : 'Preview AI Copy for Blanks'}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            queue.forEach((q) => q.previewUrl && URL.revokeObjectURL(q.previewUrl));
                            setQueue([]);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-zinc-300 cursor-pointer"
                        >
                          {isAr ? 'مسح الكل' : 'Clear All'}
                        </button>
                      </div>
                    </div>

                    {renderQueueCards(queue, setQueue, 'existing')}
                  </div>
                )}
              </div>
            )}

            {/* =======================================================
                TAB 2: CREATE NEW PROJECT
               ======================================================= */}
            {activeTab === 'create' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                      {isAr ? 'اسم البراند / العميل (بالعربية) *' : 'Client / Brand Name (Arabic) *'}
                    </label>
                    <input
                      type="text"
                      value={newClientAr}
                      onChange={(e) => setNewClientAr(e.target.value)}
                      placeholder={isAr ? 'مثال: أثر للأزياء' : 'e.g. أثر'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#100b1d] border border-white/15 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                      {isAr ? 'اسم البراند (بالإنجليزية)' : 'Client / Brand Name (English)'}
                    </label>
                    <input
                      type="text"
                      value={newClientEn}
                      onChange={(e) => setNewClientEn(e.target.value)}
                      placeholder="e.g. Athar Couture"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#100b1d] border border-white/15 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                      {isAr ? 'عنوان المشروع (بالعربية)' : 'Project Headline (Arabic)'}
                    </label>
                    <input
                      type="text"
                      value={newTitleAr}
                      onChange={(e) => setNewTitleAr(e.target.value)}
                      placeholder={isAr ? 'مثال: بناء الهوية البصرية الكاملة' : 'Headline in Arabic'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#100b1d] border border-white/15 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                      {isAr ? 'عنوان المشروع (بالإنجليزية)' : 'Project Headline (English)'}
                    </label>
                    <input
                      type="text"
                      value={newTitleEn}
                      onChange={(e) => setNewTitleEn(e.target.value)}
                      placeholder="e.g. Complete Visual Identity System"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#100b1d] border border-white/15 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                      {isAr ? 'التصنيف / المجال' : 'Category'}
                    </label>
                    <input
                      type="text"
                      value={newCategoryAr}
                      onChange={(e) => setNewCategoryAr(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#100b1d] border border-white/15 text-sm text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                      {isAr ? 'الوسم المختصر (Tag)' : 'Short Tag'}
                    </label>
                    <input
                      type="text"
                      value={newTagAr}
                      onChange={(e) => setNewTagAr(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#100b1d] border border-white/15 text-sm text-white focus:outline-none focus:border-purple-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                      {isAr ? 'رابط الموقع (اختياري)' : 'Website URL (optional)'}
                    </label>
                    <input
                      type="url"
                      value={newWebsiteUrl}
                      onChange={(e) => setNewWebsiteUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#100b1d] border border-white/15 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                      {isAr ? 'نبذة عن المشروع (بالعربية)' : 'Summary (Arabic)'}
                    </label>
                    <textarea
                      rows={3}
                      value={newSummaryAr}
                      onChange={(e) => setNewSummaryAr(e.target.value)}
                      placeholder={isAr ? 'وصف مختصر لقصة المشروع وما تم تنفيذه...' : 'Arabic summary...'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#100b1d] border border-white/15 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-400 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                      {isAr ? 'نبذة عن المشروع (بالإنجليزية)' : 'Summary (English)'}
                    </label>
                    <textarea
                      rows={3}
                      value={newSummaryEn}
                      onChange={(e) => setNewSummaryEn(e.target.value)}
                      placeholder="Short project summary in English..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#100b1d] border border-white/15 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-400 resize-none"
                    />
                  </div>
                </div>

                {/* Palette Presets */}
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-2">
                    {isAr ? 'باليت ألوان الهوية البصرية' : 'Brand Color Palette'}
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    {COLOR_PRESETS.map((preset, pIdx) => {
                      const isSelected = newColors[0]?.hex === preset[0]?.hex;
                      return (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => setNewColors(preset)}
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-purple-400 bg-purple-500/15'
                              : 'border-white/10 bg-white/[0.02] hover:border-white/25'
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            {preset.map((sw) => (
                              <span
                                key={sw.hex}
                                className="w-4 h-4 rounded-full border border-white/20"
                                style={{ backgroundColor: sw.hex }}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-zinc-300">
                            {isAr ? preset[0].name : preset[0].nameEn}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Files dropzone for new project */}
                <div
                  onClick={() => newProjectFileInputRef.current?.click()}
                  className="rounded-2xl border-2 border-dashed border-white/15 hover:border-purple-400/60 bg-white/[0.02] p-6 text-center cursor-pointer transition-colors"
                >
                  <input
                    ref={newProjectFileInputRef}
                    type="file"
                    multiple
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.length) {
                        setNewQueue((prev) => [
                          ...prev,
                          ...buildQueuedItems(e.target.files!, 'lookbook'),
                        ]);
                        e.target.value = '';
                      }
                    }}
                  />
                  <div className="inline-flex items-center gap-2 text-sm font-bold text-purple-200">
                    <Plus className="w-4 h-4" />
                    <span>
                      {isAr
                        ? 'إرفاق الشعار والغلاف وصور المشروع وملف PDF'
                        : 'Attach Logo, Cover, Gallery Photos & Brand PDF'}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">
                    {isAr
                      ? 'يمكنك تحديد نوع كل ملف (شعار / غلاف / موك اب / بوستر / تشكيلة) وسيُنشئ الـ AI الشرح تلقائياً إذا تركته فارغاً.'
                      : 'Set slot types per file; blank captions are automatically generated by Gemini Vision.'}
                  </p>
                </div>

                {newQueue.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-white/10">
                      <span className="text-xs font-bold text-white">
                        {isAr
                          ? `مرفقات المشروع الجديد (${newQueue.length})`
                          : `New Project Assets (${newQueue.length})`}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleGenerateBlankCopies('new')}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/25 hover:bg-purple-600/40 border border-purple-400/40 text-xs font-bold text-purple-100 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>
                          {isAr ? 'توليد النصوص الفارغة الآن' : 'Generate AI Copy'}
                        </span>
                      </button>
                    </div>
                    {renderQueueCards(newQueue, setNewQueue, 'new')}
                  </div>
                )}
              </div>
            )}

            {/* =======================================================
                TAB 3: EDIT & REPLACE ANY EXISTING IMAGE OR ASSET
               ======================================================= */}
            {activeTab === 'manage' && selectedProject && (
              <div className="space-y-6">
                {/* Hidden single file picker for replacing any image or PDF */}
                <input
                  ref={replaceFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleReplaceFileSelected(file);
                    }
                    e.target.value = '';
                  }}
                />

                {/* Project selector + Auto-AI replace option */}
                <div className="rounded-2xl bg-white/[0.025] border border-white/10 p-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                      {isAr
                        ? 'اختر المشروع لتعديل أو تغيير صوره الحالية'
                        : 'Select Project to Edit or Replace Existing Images'}
                    </label>
                    <select
                      value={selectedProjectId}
                      onChange={(e) => {
                        setSelectedProjectId(e.target.value);
                        setEditingUrl(null);
                        setEditDraft(null);
                      }}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#100b1d] border border-white/15 text-sm font-semibold text-white focus:outline-none focus:border-purple-400"
                    >
                      {allProjects.map((proj) => (
                        <option key={proj.id} value={proj.id}>
                          {isAr ? proj.client : proj.clientEn || proj.client} — {proj.category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <label className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-zinc-200 cursor-pointer select-none shrink-0">
                    <input
                      type="checkbox"
                      checked={autoAiOnReplace}
                      onChange={(e) => setAutoAiOnReplace(e.target.checked)}
                      className="accent-purple-500"
                    />
                    <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                    <span>
                      {isAr
                        ? 'تحديث العنوان والوصف بالـ AI عند تغيير الصورة'
                        : 'Auto-update AI caption when replacing photo'}
                    </span>
                  </label>
                </div>

                {/* Primary Brand Slots: Logo, Hero Cover, Brand Book PDF */}
                <div>
                  <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-300" />
                    <span>
                      {isAr
                        ? `العناصر الرئيسية لمشروع "${selectedProject.client}"`
                        : `Primary Slots for "${selectedProject.client}"`}
                    </span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                    {/* 1. Official Logo Card */}
                    <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-3.5 flex flex-col justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-xl bg-black/60 border border-white/10 overflow-hidden flex items-center justify-center shrink-0 p-1.5">
                          {selectedProject.logo ? (
                            <img
                              src={selectedProject.logo}
                              alt="Logo"
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-zinc-600" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white">
                            {isAr ? 'الشعار الرسمي (Logo)' : 'Official Logo'}
                          </div>
                          <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                            {selectedProject.logo
                              ? isAr
                                ? 'مضاف على الهيدر والكارت'
                                : 'Active brandmark'
                              : isAr
                              ? 'لا يوجد شعار مرفق'
                              : 'No logo attached'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={replacingKey === 'logo'}
                          onClick={() =>
                            triggerReplacePicker({
                              projectId: selectedProject.id,
                              slotTarget: 'logo',
                            })
                          }
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600/25 hover:bg-purple-600/45 border border-purple-400/40 text-xs font-bold text-purple-100 cursor-pointer disabled:opacity-50"
                        >
                          {replacingKey === 'logo' ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <RefreshCw className="w-3.5 h-3.5" />
                          )}
                          <span>
                            {selectedProject.logo
                              ? isAr
                                ? 'تغيير الشعار'
                                : 'Replace Logo'
                              : isAr
                              ? 'رفع شعار'
                              : 'Upload Logo'}
                          </span>
                        </button>

                        {selectedProject.logo && (
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteAsset(
                                selectedProject.id,
                                selectedProject.logo!,
                                false,
                                'logo'
                              )
                            }
                            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/25 border border-rose-400/25 text-rose-300 cursor-pointer"
                            title={isAr ? 'حذف الشعار' : 'Remove Logo'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* 2. Hero Cover Card */}
                    <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-3.5 flex flex-col justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-xl bg-black/60 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                          {selectedProject.heroImage ? (
                            <img
                              src={selectedProject.heroImage}
                              alt="Hero Cover"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-zinc-600" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white">
                            {isAr ? 'صورة الغلاف الرئيسي' : 'Primary Hero Cover'}
                          </div>
                          <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                            {isAr
                              ? 'الواجهة الرئيسية للمشروع'
                              : 'Main case study & card cover'}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={replacingKey === 'hero'}
                        onClick={() =>
                          triggerReplacePicker({
                            projectId: selectedProject.id,
                            slotTarget: 'hero',
                          })
                        }
                        className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600/25 hover:bg-purple-600/45 border border-purple-400/40 text-xs font-bold text-purple-100 cursor-pointer disabled:opacity-50"
                      >
                        {replacingKey === 'hero' ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <RefreshCw className="w-3.5 h-3.5" />
                        )}
                        <span>{isAr ? 'تغيير صورة الغلاف' : 'Replace Cover Image'}</span>
                      </button>
                    </div>

                    {/* 3. Brand Guidelines PDF Card */}
                    <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-3.5 flex flex-col justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-xl bg-amber-500/10 border border-amber-400/25 overflow-hidden flex items-center justify-center shrink-0 text-amber-300">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white">
                            {isAr ? 'ملف الهوية البصرية (PDF)' : 'Brand Book PDF'}
                          </div>
                          <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                            {selectedProject.brandGuidelinesPdf?.title ||
                              (isAr ? 'غير مرفق بعد' : 'Not attached')}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={replacingKey === 'pdf'}
                          onClick={() =>
                            triggerReplacePicker({
                              projectId: selectedProject.id,
                              slotTarget: 'pdf',
                            })
                          }
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/30 border border-amber-400/35 text-xs font-bold text-amber-100 cursor-pointer disabled:opacity-50"
                        >
                          {replacingKey === 'pdf' ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <RefreshCw className="w-3.5 h-3.5" />
                          )}
                          <span>
                            {selectedProject.brandGuidelinesPdf?.url
                              ? isAr
                                ? 'تغيير ملف PDF'
                                : 'Replace PDF'
                              : isAr
                              ? 'رفع PDF'
                              : 'Upload PDF'}
                          </span>
                        </button>

                        {selectedProject.brandGuidelinesPdf?.url && (
                          <button
                            type="button"
                            onClick={() =>
                              handleDeleteAsset(
                                selectedProject.id,
                                selectedProject.brandGuidelinesPdf!.url,
                                true,
                                'pdf'
                              )
                            }
                            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/25 border border-rose-400/25 text-rose-300 cursor-pointer"
                            title={isAr ? 'حذف ملف PDF' : 'Remove PDF'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* All Current Images of the Selected Project */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-purple-300" />
                      <span>
                        {isAr
                          ? `جميع صور المشروع الحالية (${existingProjectAssets.length})`
                          : `All Current Project Images (${existingProjectAssets.length})`}
                      </span>
                    </h3>
                    <span className="text-[11px] text-zinc-400">
                      {isAr
                        ? 'اضغط "تغيير الصورة" لاستبدال أي صورة بنفس مكانها أو "تعديل النص" لتحديث الشرح'
                        : 'Replace any photo in-place or edit its bilingual copy'}
                    </span>
                  </div>

                  {existingProjectAssets.length === 0 ? (
                    <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-6 text-center text-xs text-zinc-400">
                      {isAr
                        ? 'لا توجد صور معرض لهذا المشروع حتى الآن. استخدم تبويب "رفع صور/ملفات لمشروع" لإضافة صور.'
                        : 'No gallery images on this project yet. Use Upload tab to add visuals.'}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {existingProjectAssets.map((item) => {
                        const isHero = item.url === selectedProject.heroImage;
                        const isReplacingThis = replacingKey === item.url;
                        const isEditingThis = editingUrl === item.url && editDraft !== null;
                        const slotMeta = SLOT_OPTIONS.find((s) => s.value === item.type);

                        return (
                          <div
                            key={item.url}
                            className={`rounded-2xl bg-white/[0.03] border transition-colors overflow-hidden flex flex-col ${
                              isEditingThis
                                ? 'border-purple-400/70 sm:col-span-2 lg:col-span-3'
                                : 'border-white/10 hover:border-white/25'
                            }`}
                          >
                            <div
                              className={
                                isEditingThis
                                  ? 'flex flex-col md:flex-row gap-4 p-4'
                                  : 'flex flex-col flex-1'
                              }
                            >
                              {/* Thumbnail Preview */}
                              <div
                                className={`relative bg-black/60 overflow-hidden shrink-0 ${
                                  isEditingThis
                                    ? 'w-full md:w-64 aspect-[4/3] rounded-xl border border-white/10'
                                    : 'w-full aspect-[4/3]'
                                }`}
                              >
                                <img
                                  src={item.url}
                                  alt={isAr ? item.title : item.titleEn || item.title}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                                {isReplacingThis && (
                                  <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center gap-2 text-xs text-purple-200 font-bold">
                                    <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                                    <span>{isAr ? 'جاري استبدال الصورة...' : 'Replacing...'}</span>
                                  </div>
                                )}

                                <span className="absolute top-2 start-2 px-2 py-0.5 rounded-full bg-black/80 border border-white/15 text-[10px] font-semibold text-zinc-200">
                                  {isAr
                                    ? slotMeta?.labelAr.split('(')[0].trim() || item.type
                                    : slotMeta?.labelEn || item.type}
                                </span>

                                {isHero && (
                                  <span className="absolute top-2 end-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/85 text-[10px] font-bold text-black">
                                    <Star className="w-2.5 h-2.5 fill-current" />
                                    {isAr ? 'غلاف' : 'Hero'}
                                  </span>
                                )}
                              </div>

                              {/* Normal Card Info & Controls OR Inline Editor */}
                              {isEditingThis && editDraft ? (
                                <div className="flex-1 min-w-0 space-y-3">
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <select
                                      value={editDraft.type}
                                      onChange={(e) =>
                                        setEditDraft((prev) =>
                                          prev
                                            ? {
                                                ...prev,
                                                type: e.target.value as StudioUploadedAssetSlot,
                                              }
                                            : prev
                                        )
                                      }
                                      className="px-3 py-1.5 rounded-xl bg-[#0d0a17] border border-white/15 text-xs text-white focus:outline-none focus:border-purple-400"
                                    >
                                      {SLOT_OPTIONS.filter(
                                        (opt) => opt.value !== 'logo' && opt.value !== 'pdf'
                                      ).map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                          {isAr ? opt.labelAr : opt.labelEn}
                                        </option>
                                      ))}
                                    </select>

                                    <div className="flex flex-wrap items-center gap-2">
                                      <button
                                        type="button"
                                        disabled={isReplacingThis}
                                        onClick={() =>
                                          triggerReplacePicker({
                                            projectId: selectedProject.id,
                                            slotTarget: 'asset',
                                            originalUrl: item.url,
                                            currentMeta: editDraft,
                                          })
                                        }
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-bold text-white cursor-pointer"
                                      >
                                        <RefreshCw className="w-3.5 h-3.5 text-purple-300" />
                                        <span>{isAr ? 'تغيير ملف الصورة' : 'Swap Photo'}</span>
                                      </button>

                                      <button
                                        type="button"
                                        disabled={isGeneratingEditAi}
                                        onClick={handleGenerateAiForExistingAsset}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/25 hover:bg-purple-600/45 border border-purple-400/40 text-xs font-bold text-purple-100 cursor-pointer disabled:opacity-50"
                                      >
                                        {isGeneratingEditAi ? (
                                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        ) : (
                                          <Sparkles className="w-3.5 h-3.5" />
                                        )}
                                        <span>{isAr ? 'توليد وصف بالـ AI' : 'AI Caption'}</span>
                                      </button>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    <input
                                      type="text"
                                      value={editDraft.title}
                                      onChange={(e) =>
                                        setEditDraft((prev) =>
                                          prev ? { ...prev, title: e.target.value } : prev
                                        )
                                      }
                                      placeholder={isAr ? 'العنوان بالعربية' : 'Arabic Title'}
                                      className="w-full px-3 py-2 rounded-xl bg-black/45 border border-white/15 text-xs text-white focus:outline-none focus:border-purple-400"
                                    />
                                    <input
                                      type="text"
                                      value={editDraft.titleEn}
                                      onChange={(e) =>
                                        setEditDraft((prev) =>
                                          prev ? { ...prev, titleEn: e.target.value } : prev
                                        )
                                      }
                                      placeholder={isAr ? 'العنوان بالإنجليزية' : 'English Title'}
                                      className="w-full px-3 py-2 rounded-xl bg-black/45 border border-white/15 text-xs text-white focus:outline-none focus:border-purple-400"
                                    />
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    <textarea
                                      rows={2}
                                      value={editDraft.description}
                                      onChange={(e) =>
                                        setEditDraft((prev) =>
                                          prev ? { ...prev, description: e.target.value } : prev
                                        )
                                      }
                                      placeholder={isAr ? 'الشرح بالعربية' : 'Arabic Description'}
                                      className="w-full px-3 py-2 rounded-xl bg-black/45 border border-white/15 text-xs text-white focus:outline-none focus:border-purple-400 resize-none"
                                    />
                                    <textarea
                                      rows={2}
                                      value={editDraft.descriptionEn}
                                      onChange={(e) =>
                                        setEditDraft((prev) =>
                                          prev ? { ...prev, descriptionEn: e.target.value } : prev
                                        )
                                      }
                                      placeholder={isAr ? 'الشرح بالإنجليزية' : 'English Description'}
                                      className="w-full px-3 py-2 rounded-xl bg-black/45 border border-white/15 text-xs text-white focus:outline-none focus:border-purple-400 resize-none"
                                    />
                                  </div>

                                  <div className="flex items-center justify-end gap-2 pt-1">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingUrl(null);
                                        setEditDraft(null);
                                      }}
                                      className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-xs font-bold text-zinc-300 cursor-pointer"
                                    >
                                      {isAr ? 'إلغاء' : 'Cancel'}
                                    </button>
                                    <button
                                      type="button"
                                      disabled={isSavingEdit}
                                      onClick={handleSaveAssetMetadata}
                                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-xs font-bold text-white cursor-pointer disabled:opacity-50"
                                    >
                                      {isSavingEdit ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      ) : (
                                        <Save className="w-3.5 h-3.5" />
                                      )}
                                      <span>{isAr ? 'حفظ التعديلات' : 'Save Changes'}</span>
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="p-3.5 flex flex-col justify-between gap-3 flex-1">
                                  <div>
                                    <div className="text-xs font-bold text-white line-clamp-1">
                                      {isAr ? item.title : item.titleEn || item.title}
                                    </div>
                                    <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1 min-h-[2rem]">
                                      {(isAr
                                        ? item.description
                                        : item.descriptionEn || item.description) ||
                                        (isAr ? 'بدون وصف مكتوب بعد' : 'No caption yet')}
                                    </p>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/[0.07]">
                                    <button
                                      type="button"
                                      disabled={isReplacingThis}
                                      onClick={() =>
                                        triggerReplacePicker({
                                          projectId: selectedProject.id,
                                          slotTarget: 'asset',
                                          originalUrl: item.url,
                                          currentMeta: item,
                                        })
                                      }
                                      className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-600/25 hover:bg-purple-600/45 border border-purple-400/40 text-[11px] font-bold text-purple-100 cursor-pointer disabled:opacity-50"
                                    >
                                      <RefreshCw className="w-3 h-3" />
                                      <span>{isAr ? 'تغيير الصورة' : 'Replace'}</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingUrl(item.url);
                                        setEditDraft({ ...item });
                                      }}
                                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 text-[11px] font-bold text-zinc-200 cursor-pointer"
                                      title={isAr ? 'تعديل النص والتصنيف' : 'Edit text & slot'}
                                    >
                                      <Pencil className="w-3 h-3" />
                                      <span>{isAr ? 'تعديل' : 'Edit'}</span>
                                    </button>

                                    {!isHero && (
                                      <button
                                        type="button"
                                        disabled={isSavingEdit}
                                        onClick={() =>
                                          handleSetAsHeroCover(selectedProject.id, item)
                                        }
                                        className="p-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/25 border border-amber-400/25 text-amber-300 cursor-pointer"
                                        title={isAr ? 'تعيين كغلاف رئيسي' : 'Set as Hero Cover'}
                                      >
                                        <Star className="w-3.5 h-3.5" />
                                      </button>
                                    )}

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDeleteAsset(selectedProject.id, item.url)
                                      }
                                      className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/25 border border-rose-400/25 text-rose-300 cursor-pointer"
                                      title={isAr ? 'حذف / إخفاء الصورة' : 'Delete / Hide image'}
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Custom Created Projects Management */}
                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <FolderPlus className="w-4 h-4 text-purple-300" />
                    <span>
                      {isAr
                        ? `المشاريع المضافة عبر الاستوديو (${studioStore.customProjects.length})`
                        : `Studio-Created Projects (${studioStore.customProjects.length})`}
                    </span>
                  </h3>
                  {studioStore.customProjects.length === 0 ? (
                    <div className="rounded-2xl bg-white/[0.02] border border-white/10 p-4 text-center text-xs text-zinc-400">
                      {isAr
                        ? 'لم تضف مشاريع جديدة بعد. يمكنك استخدام تبويب "إضافة مشروع جديد" لإنشاء مشروع كامل.'
                        : 'No custom projects yet. Use "Add New Project" to create one.'}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {studioStore.customProjects.map((cp) => (
                        <div
                          key={cp.id}
                          className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {cp.heroImage || cp.logo ? (
                              <img
                                src={cp.logo || cp.heroImage}
                                alt={cp.client}
                                className="w-12 h-12 rounded-xl object-cover border border-white/15 shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-xs font-bold shrink-0">
                                {cp.client.slice(0, 2)}
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="text-sm font-bold text-white truncate">
                                {cp.client}
                              </div>
                              <div className="text-xs text-zinc-400 truncate">
                                {cp.category} • {(cp.assetShowcase || []).length}{' '}
                                {isAr ? 'عناصر' : 'assets'}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => setSelectedProjectId(cp.id)}
                              className="px-2.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 border border-purple-400/30 text-[11px] font-bold text-purple-200 cursor-pointer"
                            >
                              {isAr ? 'تحرير صوره' : 'Edit'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCustomProject(cp.id)}
                              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/25 border border-rose-400/25 text-rose-300 cursor-pointer"
                              title={isAr ? 'حذف المشروع' : 'Delete Project'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Action Bar */}
          <footer className="px-5 sm:px-7 py-4 border-t border-white/10 bg-[#0b0714] flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              {progressInfo ? (
                <div className="flex items-center gap-2 text-purple-200 font-semibold">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                  <span>{progressInfo.stage}</span>
                </div>
              ) : (
                <span className="inline-flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-purple-300" />
                  <span>
                    {isAr
                      ? 'لا يظهر هذا الاستوديو لأي زائر عام على الموقع.'
                      : 'Private studio dock — hidden from public visitors.'}
                  </span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              {onNavigatePortfolio && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigatePortfolio();
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-xs font-bold text-zinc-200 cursor-pointer"
                >
                  <span>{isAr ? 'فتح صفحة المشاريع' : 'Open Projects Page'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}

              {activeTab === 'upload' && (
                <button
                  type="button"
                  disabled={queue.length === 0 || isPublishing}
                  onClick={handlePublishToExisting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-40 text-white text-xs sm:text-sm font-bold shadow-[0_8px_24px_rgba(124,58,237,0.45)] transition-all cursor-pointer"
                >
                  {isPublishing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>
                    {isAr
                      ? `رفع وحفظ (${queue.length})`
                      : `Upload & Publish (${queue.length})`}
                  </span>
                </button>
              )}

              {activeTab === 'create' && (
                <button
                  type="button"
                  disabled={!newClientAr.trim() || isPublishing}
                  onClick={handleCreateNewProject}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-40 text-white text-xs sm:text-sm font-bold shadow-[0_8px_24px_rgba(124,58,237,0.45)] transition-all cursor-pointer"
                >
                  {isPublishing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FolderPlus className="w-4 h-4" />
                  )}
                  <span>
                    {isAr ? 'إنشاء ونشر المشروع' : 'Publish New Project'}
                  </span>
                </button>
              )}
            </div>
          </footer>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};
