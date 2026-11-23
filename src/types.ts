export type Language = 'ar' | 'en';
export type Direction = 'rtl' | 'ltr';

export interface ServiceItem {
  id: string;
  number: string;
  arabicNumber: string;
  title: string;
  titleEn: string;
  shortDesc: string;
  shortDescEn?: string;
  fullDesc: string;
  fullDescEn?: string;
  iconName: string;
  bgImage: string;
  deliverables: string[];
  deliverablesEn?: string[];
  metricsHighlight: string;
  metricsHighlightEn?: string;
  tag: string;
  tagEn?: string;
  innerImages?: string[];
}

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  category: string;
  categoryEn?: string;
  tag: string;
  tagEn?: string;
  summary: string;
  summaryEn?: string;
  heroImage: string;
  logo?: string;
  websiteUrl?: string;
  gallery: string[];
  client: string;
  clientEn?: string;
  duration: string;
  durationEn?: string;
  challenge: string;
  challengeEn?: string;
  solution: string;
  solutionEn?: string;
  location?: string;
  locationEn?: string;
  year?: string;
  metricHighlight?: {
    value: string;
    label: string;
    labelEn?: string;
  };
  metricsRow?: {
    val1: string;
    lbl1: string;
    lbl1En?: string;
    val2: string;
    lbl2: string;
    lbl2En?: string;
    val3: string;
    lbl3: string;
    lbl3En?: string;
  };
  scopeOfWork?: string[];
  scopeOfWorkEn?: string[];
  stats: {
    label: string;
    labelEn?: string;
    value: string;
    sublabel?: string;
    sublabelEn?: string;
  }[];
  deliverables: string[];
  deliverablesEn?: string[];
  quote?: {
    text: string;
    textEn?: string;
    author: string;
    authorEn?: string;
    role: string;
    roleEn?: string;
  };
  techStack?: {
    name: string;
    category: string;
    iconName?: string;
    description?: string;
    descriptionEn?: string;
  }[];
  strategyDetails?: {
    phase: string;
    phaseEn?: string;
    title: string;
    titleEn?: string;
    description: string;
    descriptionEn?: string;
    bullets?: string[];
    bulletsEn?: string[];
  }[];
  assetShowcase?: {
    url: string;
    title: string;
    titleEn?: string;
    type: 'cover' | 'storefront' | 'poster' | 'brand' | 'mockup' | 'lookbook';
    description: string;
    descriptionEn?: string;
    postUrl?: string;
    platform?: 'Facebook' | 'Instagram' | 'TikTok';
    collectionTag?: string;
    collectionTagEn?: string;
  }[];
  brandGuidelinesPdf?: {
    url: string;
    title: string;
    titleEn?: string;
    description?: string;
    descriptionEn?: string;
    pageCount?: number;
    fileSize?: string;
  };
  brandNarrative?: {
    eyebrow: string;
    eyebrowEn?: string;
    headline: string;
    headlineEn?: string;
    founderQuote?: string;
    founderQuoteEn?: string;
    paragraphs: string[];
    paragraphsEn?: string[];
    pillars?: {
      title: string;
      titleEn?: string;
      detail: string;
      detailEn?: string;
    }[];
  };
  originBadge?: string;
  originBadgeEn?: string;
  isBrandInCreation?: boolean;
  externalPostLinks?: {
    id: string;
    title: string;
    titleEn?: string;
    platform: 'Facebook' | 'Instagram' | 'TikTok' | 'Website';
    url: string;
    tag?: string;
    tagEn?: string;
  }[];
  brandColors?: {
    hex: string;
    name?: string;
    nameEn?: string;
  }[];
  cardTheme?: {
    bgStyle: string;
    borderClass: string;
    hoverBorderClass: string;
    glowColor: string;
    isSolidBrandBg?: boolean;
    solidBgHex?: string;
  };
  videos?: {
    url: string;
    title: string;
    titleEn?: string;
    description?: string;
    descriptionEn?: string;
    duration?: string;
  }[];
  contactPhones?: string[];
  branches?: string[];
  branchesEn?: string[];
}

export interface ArmData {
  id: number;
  title: string;
  titleEn?: string;
  enTitle: string;
  philosophy?: string;
  philosophyEn?: string;
  deliverables?: string[];
  deliverablesEn?: string[];
  tag?: string;
  tagEn?: string;
  iconName?: string;
  goal: string;
  goalEn?: string;
  impact: string;
  impactEn?: string;
  metric: string;
  metricEn?: string;
  angle: number; // For circular radar / ray distribution
  color: string;
  image?: string;
}

export interface InsightItem {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  excerptAr: string;
  excerptEn: string;
  contentAr: string;
  contentEn: string;
  category: 'media-buying' | 'e-commerce' | 'ai-workflows' | 'tracking-capi' | 'branding-cro';
  categoryAr: string;
  categoryEn: string;
  tag: string;
  author: {
    nameAr: string;
    nameEn: string;
    roleAr: string;
    roleEn: string;
    avatar: string;
  };
  publishDate: string;
  readTime: string;
  readTimeEn: string;
  coverImage: string;
  statsHighlight: {
    value: string;
    labelAr: string;
    labelEn: string;
  };
  takeawaysAr: string[];
  takeawaysEn: string[];
  likesCount: number;
  trendingScore: number;
  isFeatured?: boolean;
}

export type StudioUploadedAssetSlot =
  | 'lookbook'
  | 'mockup'
  | 'poster'
  | 'brand'
  | 'cover'
  | 'storefront'
  | 'logo'
  | 'pdf';

export interface StudioAssetReplacement {
  url: string;
  title?: string;
  titleEn?: string;
  type?: 'cover' | 'storefront' | 'poster' | 'brand' | 'mockup' | 'lookbook';
  description?: string;
  descriptionEn?: string;
  collectionTag?: string;
  collectionTagEn?: string;
}

export interface StudioProjectOverride {
  logo?: string;
  heroImage?: string;
  brandGuidelinesPdf?: ProjectItem['brandGuidelinesPdf'];
  addedAssets?: NonNullable<ProjectItem['assetShowcase']>;
  addedGallery?: string[];
  replacedAssets?: Record<string, StudioAssetReplacement>;
  removedAssetUrls?: string[];
  updatedAt?: string;
}

export interface StudioStoreData {
  customProjects: ProjectItem[];
  projectOverrides: Record<string, StudioProjectOverride>;
}
