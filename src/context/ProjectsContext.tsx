import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { getLocalizedProjects } from '../data/agencyData';
import {
  STUDIO_ASSET_PREFIX,
  subscribeStudioCloud,
  resolveChunkedAssetUrl,
} from '../services/studioCloudService';
import type {
  Language,
  ProjectItem,
  StudioProjectOverride,
  StudioStoreData,
} from '../types';

interface ProjectsContextValue {
  studioStore: StudioStoreData;
  isLoadingStudio: boolean;
  isCloudSynced: boolean;
  getProjects: (lang: Language) => ProjectItem[];
  applyStoreData: (data: StudioStoreData) => void;
  refreshProjects: () => Promise<void>;
  registerLocalAssetPreview: (canonicalUrl: string, displayUrl: string) => void;
  toCanonicalUrl: (displayOrCanonicalUrl: string) => string;
  resolveDisplayUrl: (canonicalOrDisplayUrl: string) => string;
}

const EMPTY_STORE: StudioStoreData = {
  customProjects: [],
  projectOverrides: {},
};

const ProjectsContext = createContext<ProjectsContextValue | null>(null);

function resolveUrl(url: string | undefined, urlMap: Record<string, string>): string {
  if (!url) return '';
  if (url.startsWith(STUDIO_ASSET_PREFIX)) {
    return urlMap[url] || '';
  }
  return url;
}

function localizeCustomProject(
  proj: ProjectItem,
  lang: Language,
  urlMap: Record<string, string>
): ProjectItem {
  const base: ProjectItem =
    lang === 'ar'
      ? proj
      : {
          ...proj,
          title: proj.titleEn || proj.title,
          category: proj.categoryEn || proj.category,
          tag: proj.tagEn || proj.tag,
          summary: proj.summaryEn || proj.summary,
          client: proj.clientEn || proj.client,
          duration: proj.durationEn || proj.duration,
          challenge: proj.challengeEn || proj.challenge,
          solution: proj.solutionEn || proj.solution,
          location: proj.locationEn || proj.location,
          originBadge: proj.originBadgeEn || proj.originBadge,
          deliverables: proj.deliverablesEn || proj.deliverables,
          scopeOfWork: proj.scopeOfWorkEn || proj.scopeOfWork,
          assetShowcase: (proj.assetShowcase || []).map((asset) => ({
            ...asset,
            title: asset.titleEn || asset.title,
            description: asset.descriptionEn || asset.description,
            collectionTag: asset.collectionTagEn || asset.collectionTag,
          })),
          brandGuidelinesPdf: proj.brandGuidelinesPdf
            ? {
                ...proj.brandGuidelinesPdf,
                title:
                  proj.brandGuidelinesPdf.titleEn || proj.brandGuidelinesPdf.title,
                description:
                  proj.brandGuidelinesPdf.descriptionEn ||
                  proj.brandGuidelinesPdf.description,
              }
            : undefined,
          brandColors: (proj.brandColors || []).map((c) => ({
            ...c,
            name: c.nameEn || c.name,
          })),
        };

  return {
    ...base,
    logo: base.logo ? resolveUrl(base.logo, urlMap) || undefined : undefined,
    heroImage: resolveUrl(base.heroImage, urlMap),
    gallery: (base.gallery || [])
      .map((u) => resolveUrl(u, urlMap))
      .filter(Boolean),
    assetShowcase: (base.assetShowcase || [])
      .map((asset) => ({
        ...asset,
        url: resolveUrl(asset.url, urlMap),
      }))
      .filter((asset) => Boolean(asset.url)),
    brandGuidelinesPdf: base.brandGuidelinesPdf
      ? {
          ...base.brandGuidelinesPdf,
          url: resolveUrl(base.brandGuidelinesPdf.url, urlMap),
        }
      : undefined,
  };
}

function mergeProjectWithOverride(
  proj: ProjectItem,
  store: StudioStoreData,
  lang: Language,
  urlMap: Record<string, string>
): ProjectItem {
  const override = store.projectOverrides?.[proj.id];
  if (!override) return proj;

  const removedSet = new Set(override.removedAssetUrls || []);
  const replacedMap = override.replacedAssets || {};

  const applyReplacement = (
    item: NonNullable<ProjectItem['assetShowcase']>[number]
  ): NonNullable<ProjectItem['assetShowcase']>[number] => {
    const rep = replacedMap[item.url];
    const target = rep
      ? {
          ...item,
          url: rep.url || item.url,
          type: rep.type || item.type,
          title: rep.title ?? item.title,
          titleEn: rep.titleEn ?? item.titleEn,
          description: rep.description ?? item.description,
          descriptionEn: rep.descriptionEn ?? item.descriptionEn,
          collectionTag: rep.collectionTag ?? item.collectionTag,
          collectionTagEn: rep.collectionTagEn ?? item.collectionTagEn,
        }
      : item;

    return {
      ...target,
      title: lang === 'en' ? target.titleEn || target.title : target.title,
      description:
        lang === 'en'
          ? target.descriptionEn || target.description
          : target.description,
      collectionTag:
        lang === 'en'
          ? target.collectionTagEn || target.collectionTag
          : target.collectionTag,
    };
  };

  const addedAssetsRaw = (override.addedAssets || []).map((asset) => ({
    ...asset,
    title: lang === 'en' ? asset.titleEn || asset.title : asset.title,
    description:
      lang === 'en'
        ? asset.descriptionEn || asset.description
        : asset.description,
    collectionTag:
      lang === 'en'
        ? asset.collectionTagEn || asset.collectionTag
        : asset.collectionTag,
  }));

  const mergedShowcaseMap = new Map<
    string,
    NonNullable<ProjectItem['assetShowcase']>[number]
  >();

  addedAssetsRaw.forEach((item) => {
    if (item.url && !removedSet.has(item.url) && !mergedShowcaseMap.has(item.url)) {
      mergedShowcaseMap.set(item.url, item);
    }
  });
  (proj.assetShowcase || []).forEach((item) => {
    if (!item.url || removedSet.has(item.url)) return;
    const replaced = applyReplacement(item);
    if (
      replaced.url &&
      !removedSet.has(replaced.url) &&
      !mergedShowcaseMap.has(replaced.url)
    ) {
      mergedShowcaseMap.set(replaced.url, replaced);
    }
  });

  Object.entries(replacedMap).forEach(([origUrl, rep]) => {
    const finalUrl = rep?.url || origUrl;
    if (!removedSet.has(finalUrl) && !mergedShowcaseMap.has(finalUrl)) {
      mergedShowcaseMap.set(finalUrl, {
        url: finalUrl,
        title:
          lang === 'en'
            ? rep.titleEn || rep.title || proj.client
            : rep.title || proj.client,
        titleEn: rep.titleEn,
        type: rep.type || 'lookbook',
        description:
          lang === 'en'
            ? rep.descriptionEn || rep.description || ''
            : rep.description || '',
        descriptionEn: rep.descriptionEn,
        collectionTag:
          lang === 'en'
            ? rep.collectionTagEn || rep.collectionTag
            : rep.collectionTag,
        collectionTagEn: rep.collectionTagEn,
      });
    }
  });

  const mergedGallery = Array.from(
    new Set([
      ...(override.addedGallery || []),
      ...(proj.gallery || []).map((gUrl) => replacedMap[gUrl]?.url || gUrl),
    ])
  )
    .filter((url) => Boolean(url) && !removedSet.has(url))
    .map((u) => resolveUrl(u, urlMap))
    .filter(Boolean);

  const replacedHero = proj.heroImage
    ? replacedMap[proj.heroImage]?.url || proj.heroImage
    : '';
  const canonicalHero =
    override.heroImage && !removedSet.has(override.heroImage)
      ? override.heroImage
      : removedSet.has(proj.heroImage) || removedSet.has(replacedHero)
      ? mergedGallery[0] || ''
      : replacedHero;

  const canonicalLogo =
    override.logo && !removedSet.has(override.logo)
      ? override.logo
      : removedSet.has(proj.logo || '')
      ? undefined
      : proj.logo;

  const resolvedPdf = override.brandGuidelinesPdf
    ? {
        ...override.brandGuidelinesPdf,
        url: resolveUrl(override.brandGuidelinesPdf.url, urlMap),
        title:
          lang === 'en'
            ? override.brandGuidelinesPdf.titleEn ||
              override.brandGuidelinesPdf.title
            : override.brandGuidelinesPdf.title,
        description:
          lang === 'en'
            ? override.brandGuidelinesPdf.descriptionEn ||
              override.brandGuidelinesPdf.description
            : override.brandGuidelinesPdf.description,
      }
    : proj.brandGuidelinesPdf;

  const resolvedShowcase = Array.from(mergedShowcaseMap.values())
    .map((item) => ({
      ...item,
      url: resolveUrl(item.url, urlMap),
    }))
    .filter((item) => Boolean(item.url));

  return {
    ...proj,
    logo: canonicalLogo ? resolveUrl(canonicalLogo, urlMap) || undefined : undefined,
    heroImage: resolveUrl(canonicalHero, urlMap),
    brandGuidelinesPdf: resolvedPdf,
    assetShowcase: resolvedShowcase,
    gallery: mergedGallery,
  };
}

export const ProjectsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cloudStore, setCloudStore] = useState<StudioStoreData>(EMPTY_STORE);
  const [localStore, setLocalStore] = useState<StudioStoreData>(EMPTY_STORE);
  const [assetUrlMap, setAssetUrlMap] = useState<Record<string, string>>({});
  const [isLoadingStudio, setIsLoadingStudio] = useState<boolean>(true);
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);

  const refreshProjects = useCallback(async () => {
    try {
      const res = await fetch('/api/studio/projects');
      if (!res.ok) return;
      const json = await res.json();
      if (json?.success && json.data) {
        setLocalStore({
          customProjects: Array.isArray(json.data.customProjects)
            ? json.data.customProjects
            : [],
          projectOverrides:
            json.data.projectOverrides &&
            typeof json.data.projectOverrides === 'object'
              ? json.data.projectOverrides
              : {},
        });
      }
    } catch {
      // Static fallback works cleanly if local API is absent
    } finally {
      setIsLoadingStudio(false);
    }
  }, []);

  // Subscribe live to permanent Firestore database
  useEffect(() => {
    let active = true;
    const unsub = subscribeStudioCloud((payload) => {
      if (!active) return;
      setCloudStore(payload.store);
      setAssetUrlMap((prev) => ({ ...prev, ...payload.assetUrlMap }));
      setIsCloudSynced(true);
      setIsLoadingStudio(false);

      // Reassemble any multi-chunk Brand Book PDFs in background
      payload.chunkedPdfAssetIds.forEach((assetId) => {
        const key = `${STUDIO_ASSET_PREFIX}${assetId}`;
        setAssetUrlMap((curr) => {
          if (curr[key]) return curr;
          void resolveChunkedAssetUrl(assetId)
            .then((blobUrl) => {
              if (active && blobUrl) {
                setAssetUrlMap((prevMap) => ({ ...prevMap, [key]: blobUrl }));
              }
            })
            .catch(() => {});
          return curr;
        });
      });
    });

    void refreshProjects();
    return () => {
      active = false;
      unsub();
    };
  }, [refreshProjects]);

  // Combine Firestore durable state (authoritative) + local dev session store
  const studioStore = useMemo<StudioStoreData>(() => {
    const customMap = new Map<string, ProjectItem>();
    for (const c of localStore.customProjects) {
      customMap.set(c.id, c);
    }
    for (const c of cloudStore.customProjects) {
      customMap.set(c.id, c);
    }

    const overrides: Record<string, StudioProjectOverride> = {
      ...localStore.projectOverrides,
      ...cloudStore.projectOverrides,
    };

    return {
      customProjects: Array.from(customMap.values()),
      projectOverrides: overrides,
    };
  }, [cloudStore, localStore]);

  const reverseAssetMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const [canonical, display] of Object.entries(assetUrlMap) as [string, string][]) {
      if (typeof display === 'string' && display) {
        map.set(display, canonical);
      }
    }
    return map;
  }, [assetUrlMap]);

  const registerLocalAssetPreview = useCallback(
    (canonicalUrl: string, displayUrl: string) => {
      setAssetUrlMap((prev) => ({ ...prev, [canonicalUrl]: displayUrl }));
    },
    []
  );

  const toCanonicalUrl = useCallback(
    (displayOrCanonicalUrl: string): string => {
      if (!displayOrCanonicalUrl) return '';
      return reverseAssetMap.get(displayOrCanonicalUrl) || displayOrCanonicalUrl;
    },
    [reverseAssetMap]
  );

  const resolveDisplayUrl = useCallback(
    (canonicalOrDisplayUrl: string): string =>
      resolveUrl(canonicalOrDisplayUrl, assetUrlMap),
    [assetUrlMap]
  );

  const applyStoreData = useCallback((data: StudioStoreData) => {
    setLocalStore({
      customProjects: Array.isArray(data?.customProjects)
        ? data.customProjects
        : [],
      projectOverrides:
        data?.projectOverrides && typeof data.projectOverrides === 'object'
          ? data.projectOverrides
          : {},
    });
  }, []);

  const getProjects = useCallback(
    (lang: Language): ProjectItem[] => {
      const baseList = getLocalizedProjects(lang).map((proj) =>
        mergeProjectWithOverride(proj, studioStore, lang, assetUrlMap)
      );
      const customList = (studioStore.customProjects || []).map((proj) =>
        localizeCustomProject(proj, lang, assetUrlMap)
      );
      return [...customList, ...baseList];
    },
    [studioStore, assetUrlMap]
  );

  const value = useMemo<ProjectsContextValue>(
    () => ({
      studioStore,
      isLoadingStudio,
      isCloudSynced,
      getProjects,
      applyStoreData,
      refreshProjects,
      registerLocalAssetPreview,
      toCanonicalUrl,
      resolveDisplayUrl,
    }),
    [
      studioStore,
      isLoadingStudio,
      isCloudSynced,
      getProjects,
      applyStoreData,
      refreshProjects,
      registerLocalAssetPreview,
      toCanonicalUrl,
      resolveDisplayUrl,
    ]
  );

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
};

export function useProjects() {
  const ctx = useContext(ProjectsContext);
  if (!ctx) {
    return {
      studioStore: EMPTY_STORE,
      isLoadingStudio: false,
      isCloudSynced: false,
      getProjects: (lang: Language) => getLocalizedProjects(lang),
      applyStoreData: () => {},
      refreshProjects: async () => {},
      registerLocalAssetPreview: () => {},
      toCanonicalUrl: (u: string) => u,
      resolveDisplayUrl: (u: string) => u,
    };
  }
  return ctx;
}
