import React, { useEffect, useLayoutEffect, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';
import {
  VIEW_SEO_DATA,
  getCanonicalUrlForView,
  resolveViewFromUrlOrSlug,
  syncDocumentCanonical,
  syncSingleMetaTag,
} from '../hooks/useSEO';
import {
  DEFAULT_SITE_URL,
  generateProfessionalServiceSchema,
  generateFAQPageSchema,
  usePulseOctoStructuredData,
} from '../utils/seoStructuredData';

export {
  generateProfessionalServiceSchema,
  generateFAQPageSchema,
  injectJsonLdScript,
  removeJsonLdScript,
  injectPulseOctoSchemas,
  usePulseOctoStructuredData,
} from '../utils/seoStructuredData';

/**
 * Dedicated OpenGraph image configuration array for the 8 Arms of Pulse OCTO.
 * Each arm has its own custom 1200x630 visual asset rather than sharing a single image.
 */
export interface ArmOgImageConfig {
  id: number;
  sectionKey: string;
  slug: string;
  imagePath: string;
  altAr: string;
  altEn: string;
}

export const ARMS_OG_IMAGE_LIST: ReadonlyArray<ArmOgImageConfig> = [
  {
    id: 1,
    sectionKey: 'arm-1',
    slug: 'branding',
    imagePath: '/og/arm-1.jpg',
    altAr: '01 الهوية البصرية وبناء العلامة التجارية - Pulse OCTO',
    altEn: '01 Branding & Visual Identity - Pulse OCTO',
  },
  {
    id: 2,
    sectionKey: 'arm-2',
    slug: 'digital-marketing',
    imagePath: '/og/arm-2.jpg',
    altAr: '02 التسويق الرقمي والإعلانات الممولة - Pulse OCTO',
    altEn: '02 Digital Marketing & Paid Media - Pulse OCTO',
  },
  {
    id: 3,
    sectionKey: 'arm-3',
    slug: 'web-ecommerce',
    imagePath: '/og/arm-3.jpg',
    altAr: '03 تطوير المواقع والمتاجر الإلكترونية - Pulse OCTO',
    altEn: '03 Web & E-Commerce Development - Pulse OCTO',
  },
  {
    id: 4,
    sectionKey: 'arm-4',
    slug: 'creative-studio',
    imagePath: '/og/arm-4.jpg',
    altAr: '04 الاستوديو والإنتاج الإبداعي - Pulse OCTO',
    altEn: '04 Creative Studio & Production - Pulse OCTO',
  },
  {
    id: 5,
    sectionKey: 'arm-5',
    slug: 'digital-products',
    imagePath: '/og/arm-5.jpg',
    altAr: '05 المنتجات والحلول الرقمية والأتمتة - Pulse OCTO',
    altEn: '05 Digital Products & Automation - Pulse OCTO',
  },
  {
    id: 6,
    sectionKey: 'arm-6',
    slug: 'brand-strategy',
    imagePath: '/og/arm-6.jpg',
    altAr: '06 الاستراتيجية ودراسة السوق - Pulse OCTO',
    altEn: '06 Brand Strategy & Market Research - Pulse OCTO',
  },
  {
    id: 7,
    sectionKey: 'arm-7',
    slug: 'content-creation',
    imagePath: '/og/arm-7.jpg',
    altAr: '07 صناعة المحتوى والكتابة الإعلانية - Pulse OCTO',
    altEn: '07 Content Creation & Copywriting - Pulse OCTO',
  },
  {
    id: 8,
    sectionKey: 'arm-8',
    slug: 'seo-growth',
    imagePath: '/og/arm-8.jpg',
    altAr: '08 النمو وتصدر محركات البحث SEO - Pulse OCTO',
    altEn: '08 SEO & Growth Optimization - Pulse OCTO',
  },
];

/**
 * Lookup dictionary mapping every page, section, and arm identifier (`currentSection`)
 * to its dedicated OpenGraph image path (`/og/*.jpg`).
 */
export const SECTION_OG_IMAGE_MAP: Record<string, string> = {
  // Primary Pages & Sections
  home: '/og/home.jpg',
  hero: '/og/home.jpg',
  'who-we-are': '/og/who-we-are.jpg',
  about: '/og/who-we-are.jpg',
  services: '/og/services.jpg',
  'our-services': '/og/services.jpg',
  'services-accordion-wrapper': '/og/services.jpg',
  'the-8-arms': '/og/the-8-arms.jpg',
  'eight-arms': '/og/the-8-arms.jpg',
  arms: '/og/the-8-arms.jpg',
  'arms-3d-orbit': '/og/the-8-arms.jpg',
  'arms-3d-showcase': '/og/the-8-arms.jpg',
  portfolio: '/og/portfolio.jpg',
  projects: '/og/portfolio.jpg',
  work: '/og/portfolio.jpg',
  'case-studies': '/og/portfolio.jpg',
  'portfolio-section': '/og/portfolio.jpg',
  'trust-partners-section': '/og/portfolio.jpg',
  blog: '/og/blog.jpg',
  insights: '/og/blog.jpg',
  'insights-section': '/og/blog.jpg',
  contact: '/og/contact.jpg',
  faq: '/og/contact.jpg',
  'faq-section-wrapper': '/og/contact.jpg',
  'wizard-section': '/og/contact.jpg',
  'roi-calculator': '/og/contact.jpg',
  'tech-stack': '/og/services.jpg',

  // The 8 Arms (by arm-X, service-X, numeric index, and clean route slug)
  'arm-1': '/og/arm-1.jpg',
  'service-1': '/og/arm-1.jpg',
  '1': '/og/arm-1.jpg',
  '01': '/og/arm-1.jpg',
  branding: '/og/arm-1.jpg',

  'arm-2': '/og/arm-2.jpg',
  'service-2': '/og/arm-2.jpg',
  '2': '/og/arm-2.jpg',
  '02': '/og/arm-2.jpg',
  'digital-marketing': '/og/arm-2.jpg',

  'arm-3': '/og/arm-3.jpg',
  'service-3': '/og/arm-3.jpg',
  '3': '/og/arm-3.jpg',
  '03': '/og/arm-3.jpg',
  'web-ecommerce': '/og/arm-3.jpg',

  'arm-4': '/og/arm-4.jpg',
  'service-4': '/og/arm-4.jpg',
  '4': '/og/arm-4.jpg',
  '04': '/og/arm-4.jpg',
  'creative-studio': '/og/arm-4.jpg',

  'arm-5': '/og/arm-5.jpg',
  'service-5': '/og/arm-5.jpg',
  '5': '/og/arm-5.jpg',
  '05': '/og/arm-5.jpg',
  'digital-products': '/og/arm-5.jpg',

  'arm-6': '/og/arm-6.jpg',
  'service-6': '/og/arm-6.jpg',
  '6': '/og/arm-6.jpg',
  '06': '/og/arm-6.jpg',
  'brand-strategy': '/og/arm-6.jpg',

  'arm-7': '/og/arm-7.jpg',
  'service-7': '/og/arm-7.jpg',
  '7': '/og/arm-7.jpg',
  '07': '/og/arm-7.jpg',
  'content-creation': '/og/arm-7.jpg',

  'arm-8': '/og/arm-8.jpg',
  'service-8': '/og/arm-8.jpg',
  '8': '/og/arm-8.jpg',
  '08': '/og/arm-8.jpg',
  'seo-growth': '/og/arm-8.jpg',
};

/**
 * Dynamically resolves the dedicated OpenGraph image path and full URL
 * for any `currentSection` (page, section, or Arm 1..8) from `SECTION_OG_IMAGE_MAP` and `ARMS_OG_IMAGE_LIST`.
 */
export function resolveSectionOgImage(
  currentSection?: string,
  customImage?: string
): {
  fullUrl: string;
  localPath: string;
  altAr: string;
  altEn: string;
} {
  if (customImage) {
    const isAbsolute = /^https?:\/\//i.test(customImage);
    const localPath = isAbsolute
      ? customImage.replace(/^https?:\/\/[^/]+/i, '') || '/og/home.jpg'
      : customImage.startsWith('/')
        ? customImage
        : `/${customImage}`;
    const fullUrl = isAbsolute ? customImage : `${DEFAULT_SITE_URL}${localPath}`;
    return {
      fullUrl,
      localPath,
      altAr: 'Pulse OCTO | وكالة تسويق رقمي وحلول تقنية متكاملة',
      altEn: 'Pulse OCTO | Integrated Digital Marketing & Tech Solutions Agency',
    };
  }

  const normalizedKey = (currentSection || 'home')
    .trim()
    .replace(/^[#/]+|\/+$/g, '')
    .toLowerCase();

  const resolvedViewKey = resolveViewFromUrlOrSlug(normalizedKey);

  // 1. Check if it matches one of the 8 Arms in ARMS_OG_IMAGE_LIST
  const matchedArm = ARMS_OG_IMAGE_LIST.find(
    (arm) =>
      arm.sectionKey === normalizedKey ||
      arm.sectionKey === resolvedViewKey ||
      arm.slug === normalizedKey ||
      String(arm.id) === normalizedKey ||
      `0${arm.id}` === normalizedKey
  );

  if (matchedArm) {
    return {
      fullUrl: `${DEFAULT_SITE_URL}${matchedArm.imagePath}`,
      localPath: matchedArm.imagePath,
      altAr: matchedArm.altAr,
      altEn: matchedArm.altEn,
    };
  }

  // 2. Lookup in SECTION_OG_IMAGE_MAP by raw key or normalized view key
  const localPath =
    SECTION_OG_IMAGE_MAP[normalizedKey] ||
    SECTION_OG_IMAGE_MAP[resolvedViewKey] ||
    VIEW_SEO_DATA[resolvedViewKey]?.ogImagePath ||
    SECTION_OG_IMAGE_MAP.home;

  const meta = VIEW_SEO_DATA[resolvedViewKey] || VIEW_SEO_DATA.home;
  return {
    fullUrl: `${DEFAULT_SITE_URL}${localPath}`,
    localPath,
    altAr: meta.ogImageAltAr || meta.titleAr,
    altEn: meta.ogImageAltEn || meta.titleEn,
  };
}

export interface SEOHeadProps {
  currentSection?: string;
  activeSection?: string;
  canonicalUrl?: string;
  customTitle?: string;
  customDescription?: string;
  customImage?: string;
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export const SEOHead: React.FC<SEOHeadProps> = ({
  currentSection: propCurrentSection,
  activeSection: propActiveSection,
  canonicalUrl: propCanonicalUrl,
  customTitle,
  customDescription,
  customImage,
}) => {
  const { lang, isAr } = useLanguage();
  const externalSection = propCurrentSection || propActiveSection;
  const [internalSection, setInternalSection] = useState<string>(externalSection || 'home');

  // Synchronize immediately when currentSection or activeSection prop changes
  useIsomorphicLayoutEffect(() => {
    if (externalSection) {
      setInternalSection(externalSection);
    }
  }, [externalSection]);

  // Listen to real-time arm/section navigation events dispatched anywhere in the app
  useEffect(() => {
    const handleSectionEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ section?: string }>;
      const nextSec = customEvent.detail?.section;
      if (nextSec) {
        setInternalSection(nextSec);
      }
    };

    const handleOpenArmEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ armId?: number }>;
      const armId = customEvent.detail?.armId;
      if (armId) {
        setInternalSection(`arm-${armId}`);
      }
    };

    window.addEventListener('pulse-octo:section-change', handleSectionEvent as EventListener);
    window.addEventListener('pulse-octo:open-arm', handleOpenArmEvent as EventListener);
    return () => {
      window.removeEventListener('pulse-octo:section-change', handleSectionEvent as EventListener);
      window.removeEventListener('pulse-octo:open-arm', handleOpenArmEvent as EventListener);
    };
  }, []);

  // Detect active section on scroll only if no explicit section prop is provided
  useEffect(() => {
    if (externalSection) {
      return;
    }

    const sectionIds = [
      'hero',
      'services',
      'eight-arms',
      'projects',
      'tech-stack',
      'roi-calculator',
      'faq',
      'contact',
    ];

    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPos) {
          setInternalSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [externalSection]);

  const activeTarget = externalSection || internalSection || 'home';

  // Dynamic Section/View Metadata & Dedicated OG Image resolved from SECTION_OG_IMAGE_MAP / ARMS_OG_IMAGE_LIST
  const resolvedSection = useMemo(() => resolveViewFromUrlOrSlug(activeTarget), [activeTarget]);
  const currentMeta = VIEW_SEO_DATA[resolvedSection] || VIEW_SEO_DATA.home;
  const pageTitle = customTitle || (isAr ? currentMeta.titleAr : currentMeta.titleEn);
  const pageDescription =
    customDescription || (isAr ? currentMeta.descAr : currentMeta.descEn);
  const ogDescription =
    customDescription ||
    (isAr ? currentMeta.ogDescAr || currentMeta.descAr : currentMeta.ogDescEn || currentMeta.descEn);

  const siteUrl = DEFAULT_SITE_URL;
  const currentUrl = propCanonicalUrl || getCanonicalUrlForView(resolvedSection);
  const ogImg = useMemo(
    () => resolveSectionOgImage(activeTarget, customImage),
    [activeTarget, customImage]
  );
  const ogImageUrl = ogImg.fullUrl;
  const ogImageAlt = isAr ? ogImg.altAr : ogImg.altEn;
  const ogType = currentMeta.ogType || 'website';
  const siteName = 'Pulse OCTO';

  // Ensure immediate synchronous DOM meta tag updates with zero duplicates
  useIsomorphicLayoutEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    document.documentElement.lang = lang;
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
    document.title = pageTitle;

    syncSingleMetaTag('name', 'title', pageTitle);
    syncSingleMetaTag('name', 'description', pageDescription);

    syncSingleMetaTag('property', 'og:type', ogType);
    syncSingleMetaTag('property', 'og:site_name', siteName);
    syncSingleMetaTag('property', 'og:title', pageTitle);
    syncSingleMetaTag('property', 'og:description', ogDescription);
    syncSingleMetaTag('property', 'og:url', currentUrl);
    syncSingleMetaTag('property', 'og:image', ogImageUrl);
    syncSingleMetaTag('property', 'og:image:secure_url', ogImageUrl);
    syncSingleMetaTag('property', 'og:image:type', 'image/jpeg');
    syncSingleMetaTag('property', 'og:image:width', '1200');
    syncSingleMetaTag('property', 'og:image:height', '630');
    syncSingleMetaTag('property', 'og:image:alt', ogImageAlt);
    syncSingleMetaTag('property', 'og:locale', isAr ? 'ar_EG' : 'en_US');
    syncSingleMetaTag('property', 'og:locale:alternate', isAr ? 'en_US' : 'ar_EG');

    syncSingleMetaTag('name', 'twitter:card', 'summary_large_image');
    syncSingleMetaTag('name', 'twitter:url', currentUrl);
    syncSingleMetaTag('name', 'twitter:title', pageTitle);
    syncSingleMetaTag('name', 'twitter:description', ogDescription);
    syncSingleMetaTag('name', 'twitter:image', ogImageUrl);
    syncSingleMetaTag('name', 'twitter:image:alt', ogImageAlt);

    syncDocumentCanonical(currentUrl);

    window.dispatchEvent(
      new CustomEvent('pulse-octo:seo-updated', {
        detail: {
          viewKey: resolvedSection,
          title: pageTitle,
          description: pageDescription,
          canonicalUrl: currentUrl,
          ogImageUrl,
          localImagePath: ogImg.localPath,
          ogImageAlt,
          ogType,
          siteName,
        },
      })
    );
  }, [
    resolvedSection,
    pageTitle,
    pageDescription,
    ogDescription,
    currentUrl,
    ogImageUrl,
    ogImg.localPath,
    ogImageAlt,
    ogType,
    siteName,
    isAr,
    lang,
  ]);

  // Direct injection into document.head via the SEO utility hook
  usePulseOctoStructuredData({
    lang: isAr ? 'ar' : 'en',
    siteUrl,
    activeView: resolvedSection,
  });

  return (
    <Helmet>
      {/* HTML Attributes & Title only — meta and canonical tags are managed exclusively by syncSingleMetaTag/syncDocumentCanonical to prevent duplicates */}
      <html lang={lang} dir={isAr ? 'rtl' : 'ltr'} />
      <title>{pageTitle}</title>
    </Helmet>
  );
};



