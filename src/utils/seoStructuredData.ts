import React, { useEffect } from 'react';
import { HOME_FAQ_SCHEMA_ITEMS, FAQItem } from '../data/faqData';

export interface StructuredDataOptions {
  lang?: 'ar' | 'en';
  siteUrl?: string;
  customFaqs?: FAQItem[];
}

export const DEFAULT_SITE_URL = 'https://www.pulseocto.com';

export const OFFICIAL_ARM_SLUGS: Record<number, string> = {
  1: 'branding',
  2: 'digital-marketing',
  3: 'web-ecommerce',
  4: 'creative-studio',
  5: 'digital-products',
  6: 'brand-strategy',
  7: 'content-creation',
  8: 'seo-growth',
};

export const SLUG_TO_ARM_ID: Record<string, number> = {
  'branding': 1,
  'arm-1': 1,
  'service-1': 1,
  'digital-marketing': 2,
  'marketing': 2,
  'arm-2': 2,
  'service-2': 2,
  'web-ecommerce': 3,
  'arm-3': 3,
  'service-3': 3,
  'creative-studio': 4,
  'studio': 4,
  'arm-4': 4,
  'service-4': 4,
  'digital-products': 5,
  'arm-5': 5,
  'service-5': 5,
  'brand-strategy': 6,
  'strategy': 6,
  'arm-6': 6,
  'service-6': 6,
  'content-creation': 7,
  'content': 7,
  'arm-7': 7,
  'service-7': 7,
  'seo-growth': 8,
  'growth': 8,
  'arm-8': 8,
  'service-8': 8,
};

/**
 * Generates Schema.org JSON-LD object for 'MarketingAgency' & 'ProfessionalService'
 * Tailored for Pulse OCTO with all 8 arms in their exact official order (01 to 08)
 */
export function generateProfessionalServiceSchema(options: StructuredDataOptions = {}) {
  const lang = options.lang || 'ar';
  const isAr = lang === 'ar';
  const siteUrl = DEFAULT_SITE_URL;
  const logoUrl = `${siteUrl}/12.png`;

  return {
    '@context': 'https://schema.org',
    '@type': ['ProfessionalService', 'MarketingAgency'],
    '@id': `${siteUrl}/#organization`,
    name: 'Pulse OCTO',
    alternateName: [
      'Pulse OCTO | وكالة تسويق رقمي وحلول برمجية متكاملة في مصر',
      'وكالة Pulse OCTO للتسويق الرقمي والحلول التقنية المتكاملة',
      'بولس أكتو',
      'وكالة Pulse OCTO الرقمية',
      'Pulse OCTO Agency',
      'Pulse OCTO Digital Marketing & Tech Solutions',
    ],
    slogan: 'ONE BRAND. ONE SYSTEM. ONE PULSE.',
    url: `${siteUrl}/`,
    logo: {
      '@type': 'ImageObject',
      '@id': `${siteUrl}/#logo`,
      url: logoUrl,
      contentUrl: logoUrl,
      width: 512,
      height: 512,
      caption: 'Pulse OCTO | وكالة تسويق رقمي وحلول برمجية متكاملة في مصر',
    },
    image: [logoUrl, `${siteUrl}/og/home.jpg`],
    description: isAr
      ? 'Pulse OCTO وكالة تسويق رقمي وحلول برمجية متكاملة في بنها ومصر. نطور أعمالك عبر 8 أذرع: الهوية البصرية، الإعلانات الممولة، برمجة المواقع، والـ SEO.'
      : 'Pulse OCTO is an integrated digital marketing and software solutions agency in Benha, Qalyubia, Egypt. Scaling brands across 8 synchronized arms: Branding, Paid Media, Web & E-Commerce, Creative Studio, Tech Solutions, Strategy, Content, and SEO.',
    telephone: '+201112998882',
    email: 'CEO@pulseOCTO.com',
    priceRange: '$$',
    currenciesAccepted: 'EGP, SAR, AED, USD, EUR',
    paymentAccepted: 'Credit Card, Bank Wire, Cash, Vodafone Cash, InstaPay',
    address: {
      '@type': 'PostalAddress',
      streetAddress: isAr ? 'شارع فريد ندا، بنها الجديدة' : 'Farid Nada Street, New Benha',
      addressLocality: isAr ? 'بنها' : 'Benha',
      addressRegion: isAr ? 'القليوبية' : 'Qalyubia',
      postalCode: '13511',
      addressCountry: 'EG',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 30.466,
      longitude: 31.185,
    },
    areaServed: [
      { '@type': 'Country', name: 'Egypt' },
      { '@type': 'Country', name: 'Saudi Arabia' },
      { '@type': 'Country', name: 'United Arab Emirates' },
      { '@type': 'Country', name: 'Kuwait' },
      { '@type': 'Country', name: 'Qatar' },
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        opens: '09:00',
        closes: '20:00',
      },
    ],
    founder: {
      '@type': 'Person',
      name: 'Tarek Wagieh',
      jobTitle: isAr ? 'المؤسس والمدير التنفيذي' : 'Founder & Managing Director',
    },
    sameAs: [
      'https://www.facebook.com/profile.php?id=61589519280210',
      'https://www.instagram.com/pulse.octo/',
      'https://www.tiktok.com/@tarekakl',
      'https://wa.me/201116066968',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+201112998882',
        email: 'contact@pulseocto.com',
        contactType: 'customer service',
        areaServed: ['EG', 'SA', 'AE', 'KW', 'QA'],
        availableLanguage: ['Arabic', 'English'],
      },
      {
        '@type': 'ContactPoint',
        telephone: '+201116066968',
        email: 'CEO@pulseOCTO.com',
        contactType: 'sales',
        areaServed: ['EG', 'SA', 'AE', 'KW', 'QA'],
        availableLanguage: ['Arabic', 'English'],
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: isAr
        ? 'منظومة الأذرع الثمانية - Pulse OCTO | وكالة تسويق رقمي وحلول تقنية متكاملة'
        : 'The 8-Arm Synergy Engine - Pulse OCTO Digital Agency',
      itemListElement: [
        {
          '@type': 'Offer',
          position: 1,
          url: `${siteUrl}/branding`,
          itemOffered: {
            '@type': 'Service',
            name: isAr ? '01 الهوية وبناء العلامة (Branding & Identity)' : '01 Branding & Visual Identity',
            url: `${siteUrl}/branding`,
            description: isAr
              ? 'تصميم الشعارات، الهوية البصرية المتكاملة، أدلة العلامة التجارية، والتغليف المبتكر.'
              : 'Logo design, comprehensive visual identity systems, brand guidelines, and packaging.',
          },
        },
        {
          '@type': 'Offer',
          position: 2,
          url: `${siteUrl}/digital-marketing`,
          itemOffered: {
            '@type': 'Service',
            name: isAr ? '02 التسويق الرقمي والإعلانات الممولة (Digital Marketing & Paid Media)' : '02 Digital Marketing & Paid Media',
            url: `${siteUrl}/digital-marketing`,
            description: isAr
              ? 'إدارة الحملات الإعلانية الممولة على Meta وGoogle وTikTok وSnapchat، وإدارة منصات التواصل الاجتماعي.'
              : 'Performance media buying on Meta, Google, TikTok, and Snapchat, plus social media management.',
          },
        },
        {
          '@type': 'Offer',
          position: 3,
          url: `${siteUrl}/web-ecommerce`,
          itemOffered: {
            '@type': 'Service',
            name: isAr
              ? 'تصميم وبرمجة المواقع المخصصة وتطوير المتاجر الإلكترونية (Custom Web & E-commerce Development)'
              : 'Custom Web & E-commerce Development',
            url: `${siteUrl}/web-ecommerce`,
            description: isAr
              ? 'نحن لا نقتصر على منصات التجارة الإلكترونية الجاهزة فحسب، بل نصمم ونبرمج المواقع وتطبيقات الويب والمتاجر الإلكترونية المخصصة (Custom Development) بالكامل للشركات والعلامات التجارية من الصفر. نقدم حلول برمجة متكاملة وتخصيص احترافي (Customization) يلبى كافة الاحتياجات المعقدة بعيداً عن القوالب التقليدية، مع إدارة البنية التحتية والدومينات وربط بوابات الدفع وشحن المتاجر (سلة، زد، Shopify Plus، وووكومرس) بجودة عالمية وسرعة فائقة تضمن تفوقك الرقمي.'
              : 'We do not limit ourselves to ready-made e-commerce platforms; we design and develop fully custom websites, web applications, and e-commerce stores from scratch for companies and brands. We deliver end-to-end development and advanced customization beyond traditional templates, managing infrastructure, domains, payment gateways, and shipping integrations (Salla, Zid, Shopify Plus, WooCommerce) with world-class quality and ultra-fast performance.',
          },
        },
        {
          '@type': 'Offer',
          position: 4,
          url: `${siteUrl}/creative-studio`,
          itemOffered: {
            '@type': 'Service',
            name: isAr ? '04 الاستوديو والإنتاج الإبداعي (Creative Studio & Production)' : '04 Creative Studio & Production',
            url: `${siteUrl}/creative-studio`,
            description: isAr
              ? 'الإنتاج الإعلاني والسينمائي، تصوير المنتجات، الموشن جرافيك، الـ Reels، والـ 3D والـ CGI.'
              : 'Commercial video production, product photography, motion graphics, Reels, 3D, and CGI.',
          },
        },
        {
          '@type': 'Offer',
          position: 5,
          url: `${siteUrl}/digital-products`,
          itemOffered: {
            '@type': 'Service',
            name: isAr ? '05 المنتجات والحلول الرقمية (Digital Products & Automation)' : '05 Digital Products & Automation',
            url: `${siteUrl}/digital-products`,
            description: isAr
              ? 'تطوير تطبيقات الموبايل، أنظمة الويب المخصصة، لوحات التحكم، وحلول الأتمتة وربط الأنظمة API.'
              : 'Mobile apps, custom web applications, interactive dashboards, and workflow API automation.',
          },
        },
        {
          '@type': 'Offer',
          position: 6,
          url: `${siteUrl}/brand-strategy`,
          itemOffered: {
            '@type': 'Service',
            name: isAr ? '06 الاستراتيجية ودراسة السوق (Brand Strategy & Market Research)' : '06 Brand Strategy & Market Research',
            url: `${siteUrl}/brand-strategy`,
            description: isAr
              ? 'دراسات السوق والمنافسين، تحديد التموضع التسويقي، بناء رحلة العميل، وخطط الإطلاق والتوسع.'
              : 'Market and competitor analysis, brand positioning, customer journey mapping, and go-to-market strategy.',
          },
        },
        {
          '@type': 'Offer',
          position: 7,
          url: `${siteUrl}/content-creation`,
          itemOffered: {
            '@type': 'Service',
            name: isAr ? '07 صناعة المحتوى والكتابة الإعلانية (Content Creation & Copywriting)' : '07 Content Creation & Copywriting',
            url: `${siteUrl}/content-creation`,
            description: isAr
              ? 'الكتابة الإعلانية البيعية Copywriting، صناعة المحتوى الإبداعي، وكتابة سيناريوهات الفيديو والإعلانات.'
              : 'Conversion copywriting, creative content calendars, and commercial video scriptwriting.',
          },
        },
        {
          '@type': 'Offer',
          position: 8,
          url: `${siteUrl}/seo-growth`,
          itemOffered: {
            '@type': 'Service',
            name: isAr ? '08 النمو وتصدر محركات البحث (SEO & Growth Optimization)' : '08 SEO & Growth Optimization',
            url: `${siteUrl}/seo-growth`,
            description: isAr
              ? 'تحسين محركات البحث الداخلي والتقني SEO، تحسين معدل التحويل CRO، وتتبع البيانات والتحليلات GA4 وCAPI.'
              : 'Technical and organic SEO dominance, Conversion Rate Optimization (CRO), and GA4/CAPI analytics.',
          },
        },
      ],
    },
    knowsAbout: [
      'Digital Marketing',
      'Performance Marketing',
      'Search Engine Optimization (SEO)',
      'E-Commerce Development',
      'Conversion Rate Optimization (CRO)',
      'Meta Conversions API (CAPI)',
      'Brand Identity Design',
      'Motion Graphics',
      'ROAS Scaling',
    ],
  };
}

/**
 * Generates Schema.org JSON-LD object for 'WebSite' and 'BreadcrumbList'
 */
export function generateWebSiteAndBreadcrumbSchema(options: StructuredDataOptions = {}) {
  const lang = options.lang || 'ar';
  const isAr = lang === 'ar';
  const siteUrl = DEFAULT_SITE_URL;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: `${siteUrl}/`,
        name: 'Pulse OCTO | وكالة تسويق رقمي وحلول تقنية متكاملة',
        alternateName: [
          'Pulse OCTO',
          'وكالة تسويق رقمي وحلول تقنية متكاملة',
          'Pulse OCTO | Integrated Digital Marketing & Tech Solutions Agency',
        ],
        publisher: {
          '@id': `${siteUrl}/#organization`,
        },
        inLanguage: ['ar-EG', 'en-US'],
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${siteUrl}/#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: isAr
              ? 'Pulse OCTO | وكالة تسويق رقمي وحلول تقنية متكاملة'
              : 'Pulse OCTO | Integrated Digital Marketing & Tech Solutions Agency',
            item: `${siteUrl}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: isAr ? '01 الهوية وبناء العلامة' : '01 Branding & Identity',
            item: `${siteUrl}/branding`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: isAr ? '02 التسويق الرقمي والإعلانات الممولة' : '02 Digital Marketing',
            item: `${siteUrl}/digital-marketing`,
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: isAr
              ? 'تصميم وبرمجة المواقع المخصصة وتطوير المتاجر الإلكترونية (Custom Web & E-commerce Development)'
              : 'Custom Web & E-commerce Development',
            item: `${siteUrl}/web-ecommerce`,
          },
          {
            '@type': 'ListItem',
            position: 5,
            name: isAr ? '04 الاستوديو والإنتاج الإبداعي' : '04 Creative Studio',
            item: `${siteUrl}/creative-studio`,
          },
          {
            '@type': 'ListItem',
            position: 6,
            name: isAr ? '05 المنتجات والحلول الرقمية' : '05 Digital Products',
            item: `${siteUrl}/digital-products`,
          },
          {
            '@type': 'ListItem',
            position: 7,
            name: isAr ? '06 الاستراتيجية ودراسة السوق' : '06 Brand Strategy',
            item: `${siteUrl}/brand-strategy`,
          },
          {
            '@type': 'ListItem',
            position: 8,
            name: isAr ? '07 صناعة المحتوى والكتابة الإعلانية' : '07 Content Creation',
            item: `${siteUrl}/content-creation`,
          },
          {
            '@type': 'ListItem',
            position: 9,
            name: isAr ? '08 النمو وتصدر محركات البحث' : '08 SEO & Growth',
            item: `${siteUrl}/seo-growth`,
          },
        ],
      },
    ],
  };
}

/**
 * Generates Schema.org JSON-LD object for 'FAQPage'
 * Preserves the exact 6 core questions used by HomeFAQ and adds complete FAQ coverage
 */
export function generateFAQPageSchema(options: StructuredDataOptions = {}) {
  const lang = options.lang || 'ar';
  const isAr = lang === 'ar';
  const siteUrl = DEFAULT_SITE_URL;
  const faqs = options.customFaqs || HOME_FAQ_SCHEMA_ITEMS;

  const mainEntity = faqs.map((item) => ({
    '@type': 'Question',
    name: isAr ? item.question.ar : item.question.en,
    acceptedAnswer: {
      '@type': 'Answer',
      text: isAr ? item.answer.ar : item.answer.en,
    },
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${siteUrl}/#faq`,
    name: isAr
      ? 'إجابات صريحة عن منظومة الأذرع - Pulse OCTO'
      : 'Direct Answers About the 8-Arm System - Pulse OCTO',
    description: isAr
      ? 'إجابات صريحة عن منظومة الأذرع الثمانية في وكالة Pulse OCTO للتسويق الرقمي والحلول البرمجية المتكاملة.'
      : 'Direct answers about Pulse OCTO’s 8-arm digital marketing and software solutions system.',
    mainEntity,
  };
}

/**
 * Injects a JSON-LD structured data script into document.head.
 * If a script with the given ID already exists, its content is updated.
 */
export function injectJsonLdScript(id: string, schema: object): HTMLScriptElement | null {
  if (typeof document === 'undefined') return null;

  try {
    let script = document.getElementById(id) as HTMLScriptElement | null;

    if (!script) {
      script = document.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify(schema, null, 2);
    return script;
  } catch (error) {
    console.warn(`[SEO Utility] Failed to inject JSON-LD schema with id "${id}":`, error);
    return null;
  }
}

/**
 * Removes a JSON-LD structured data script from document.head by its ID
 */
export function removeJsonLdScript(id: string): void {
  if (typeof document === 'undefined') return;

  try {
    const script = document.getElementById(id);
    if (script && script.parentNode) {
      script.parentNode.removeChild(script);
    }
  } catch (error) {
    console.warn(`[SEO Utility] Failed to remove JSON-LD schema with id "${id}":`, error);
  }
}

export const SCRIPT_ID_PROFESSIONAL_SERVICE = 'pulseocto-jsonld-professionalservice';
export const SCRIPT_ID_WEBSITE_BREADCRUMB = 'pulseocto-jsonld-website';
export const SCRIPT_ID_FAQ_PAGE = 'pulseocto-jsonld-faqpage';
export const SCRIPT_ID_ACTIVE_SERVICE = 'pulseocto-jsonld-active-service';

export interface SingleArmServiceEntry {
  armId: number;
  slug: string;
  nameAr: string;
  nameEn: string;
  serviceTypeAr: string;
  serviceTypeEn: string;
  descAr: string;
  descEn: string;
}

export const ARM_SERVICE_SCHEMA_CATALOG: Record<number, SingleArmServiceEntry> = {
  1: {
    armId: 1,
    slug: 'branding',
    nameAr: '01 الهوية وبناء العلامة (Branding & Identity)',
    nameEn: '01 Branding & Visual Identity',
    serviceTypeAr: 'تصميم الهوية البصرية وبناء العلامات التجارية',
    serviceTypeEn: 'Brand Identity & Packaging Design',
    descAr: 'تصميم الشعارات، الهوية البصرية المتكاملة، أدلة العلامة التجارية (Brand Guidelines)، وتصميم التغليف والمطبوعات التي تمنح علامتك حضوراً قوياً.',
    descEn: 'Strategic logo design, comprehensive visual identity systems, brand guidelines, and packaging by Pulse OCTO.',
  },
  2: {
    armId: 2,
    slug: 'digital-marketing',
    nameAr: '02 التسويق الرقمي والإعلانات الممولة (Digital Marketing & Paid Media)',
    nameEn: '02 Digital Marketing & Paid Media',
    serviceTypeAr: 'إدارة الحملات الإعلانية الممولة والتسويق الرقمي',
    serviceTypeEn: 'Performance Marketing & Paid Media Management',
    descAr: 'إدارة الحملات الإعلانية الممولة على فيسبوك، إنستجرام، جوجل، تيك توك، وسناب شات، وإدارة حسابات التواصل الاجتماعي لزيادة المبيعات.',
    descEn: 'High-converting performance media buying across Meta, Google, TikTok, and Snapchat, plus social media management by Pulse OCTO.',
  },
  3: {
    armId: 3,
    slug: 'web-ecommerce',
    nameAr: 'تصميم وبرمجة المواقع المخصصة وتطوير المتاجر الإلكترونية (Custom Web & E-commerce Development)',
    nameEn: 'Custom Web & E-commerce Development',
    serviceTypeAr: 'تصميم وبرمجة المواقع المخصصة وتطوير المتاجر الإلكترونية',
    serviceTypeEn: 'Custom Web & E-commerce Development',
    descAr: 'نحن لا نقتصر على منصات التجارة الإلكترونية الجاهزة فحسب، بل نصمم ونبرمج المواقع وتطبيقات الويب والمتاجر الإلكترونية المخصصة (Custom Development) بالكامل للشركات والعلامات التجارية من الصفر. نقدم حلول برمجة متكاملة وتخصيص احترافي (Customization) يلبى كافة الاحتياجات المعقدة بعيداً عن القوالب التقليدية، مع إدارة البنية التحتية والدومينات وربط بوابات الدفع وشحن المتاجر (سلة، زد، Shopify Plus، وووكومرس) بجودة عالمية وسرعة فائقة تضمن تفوقك الرقمي.',
    descEn: 'We do not limit ourselves to ready-made e-commerce platforms; we design and develop fully custom websites, web applications, and e-commerce stores from scratch for companies and brands. We deliver end-to-end development and advanced customization beyond traditional templates, managing infrastructure, domains, payment gateways, and shipping integrations (Salla, Zid, Shopify Plus, WooCommerce) with world-class quality and ultra-fast performance.',
  },
  4: {
    armId: 4,
    slug: 'creative-studio',
    nameAr: '04 الاستوديو والإنتاج الإبداعي (Creative Studio & Production)',
    nameEn: '04 Creative Studio & Production',
    serviceTypeAr: 'الإنتاج الإعلاني والسينمائي والموشن جرافيك والـ 3D',
    serviceTypeEn: 'Commercial Production, Motion Graphics & 3D CGI',
    descAr: 'الإنتاج الإعلاني والسينمائي، تصوير المنتجات الفوتوغرافي، الموشن جرافيك، صناعة الـ Reels، وتصميمات الـ 3D والـ CGI الاحترافية.',
    descEn: 'Commercial video production, studio product photography, motion graphics, Reels/Shorts editing, and 3D CGI visuals by Pulse OCTO.',
  },
  5: {
    armId: 5,
    slug: 'digital-products',
    nameAr: '05 المنتجات والحلول الرقمية (Digital Products & Automation)',
    nameEn: '05 Digital Products & Automation',
    serviceTypeAr: 'تطوير تطبيقات الموبايل والأنظمة الرقمية والأتمتة',
    serviceTypeEn: 'Mobile App Development, Custom SaaS & Workflow Automation',
    descAr: 'تطوير تطبيقات الموبايل (iOS & Android)، أنظمة الويب المخصصة، لوحات التحكم التفاعلية، وحلول الأتمتة وربط الأنظمة البرمجية API.',
    descEn: 'iOS & Android mobile apps, custom web platforms, interactive dashboards, and workflow API automation by Pulse OCTO.',
  },
  6: {
    armId: 6,
    slug: 'brand-strategy',
    nameAr: '06 الاستراتيجية ودراسة السوق (Brand Strategy & Market Research)',
    nameEn: '06 Brand Strategy & Market Research',
    serviceTypeAr: 'دراسات السوق واستراتيجيات العلامة التجارية والنمو',
    serviceTypeEn: 'Brand Positioning, Market Research & Growth Strategy',
    descAr: 'دراسات السوق وتحليل المنافسين، تحديد التموضع التسويقي، بناء شرائح العملاء ورحلة المشتري، وخطط الإطلاق والتوسع المدروسة.',
    descEn: 'Comprehensive market and competitor analysis, brand positioning, customer journey mapping, and go-to-market growth roadmaps.',
  },
  7: {
    armId: 7,
    slug: 'content-creation',
    nameAr: '07 صناعة المحتوى والكتابة الإعلانية (Content Creation & Copywriting)',
    nameEn: '07 Content Creation & Copywriting',
    serviceTypeAr: 'صناعة المحتوى الإبداعي والكتابة الإعلانية البيعية',
    serviceTypeEn: 'Conversion Copywriting & Creative Content Strategy',
    descAr: 'الكتابة الإعلانية البيعية (Copywriting)، خطط المحتوى الإبداعي، كتابة سيناريوهات الفيديو والإعلانات، والمحتوى المتخصص المتوافق مع محركات البحث.',
    descEn: 'Persuasive conversion copywriting, creative content calendars, video scriptwriting, and authority articles by Pulse OCTO.',
  },
  8: {
    armId: 8,
    slug: 'seo-growth',
    nameAr: '08 النمو وتصدر محركات البحث (SEO & Growth Optimization)',
    nameEn: '08 SEO & Growth Optimization',
    serviceTypeAr: 'تحسين محركات البحث SEO ومعدل التحويل CRO والتحليلات',
    serviceTypeEn: 'Technical SEO, CRO & Server-Side Analytics',
    descAr: 'تحسين محركات البحث الداخلي والتقني (SEO)، تحسين معدل التحويل (CRO)، وتتبع البيانات والتحليلات المتقدمة (GA4 & Server-Side CAPI).',
    descEn: 'Technical and organic SEO dominance, Conversion Rate Optimization (CRO), and advanced GA4 & CAPI analytics by Pulse OCTO.',
  },
};

/**
 * Generates a dedicated Service + BreadcrumbList JSON-LD schema when viewing one of the 8 Arms
 */
export function generateSingleArmServiceSchema(
  viewOrSlug: string,
  lang: 'ar' | 'en' = 'ar'
): object | null {
  const armId = SLUG_TO_ARM_ID[viewOrSlug];
  if (!armId || !ARM_SERVICE_SCHEMA_CATALOG[armId]) return null;

  const entry = ARM_SERVICE_SCHEMA_CATALOG[armId];
  const isAr = lang === 'ar';
  const siteUrl = DEFAULT_SITE_URL;
  const serviceUrl = `${siteUrl}/${entry.slug}`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${serviceUrl}#service`,
        name: isAr ? entry.nameAr : entry.nameEn,
        serviceType: isAr ? entry.serviceTypeAr : entry.serviceTypeEn,
        description: isAr ? entry.descAr : entry.descEn,
        url: serviceUrl,
        provider: {
          '@id': `${siteUrl}/#organization`,
        },
        areaServed: [
          { '@type': 'Country', name: 'Egypt' },
          { '@type': 'Country', name: 'Saudi Arabia' },
          { '@type': 'Country', name: 'United Arab Emirates' },
          { '@type': 'Country', name: 'Kuwait' },
          { '@type': 'Country', name: 'Qatar' },
        ],
        availableChannel: {
          '@type': 'ServiceChannel',
          serviceUrl,
          servicePhone: '+201112998882',
          availableLanguage: ['Arabic', 'English'],
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${serviceUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: isAr ? 'الرئيسية - Pulse OCTO' : 'Home - Pulse OCTO',
            item: `${siteUrl}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: isAr ? entry.nameAr : entry.nameEn,
            item: serviceUrl,
          },
        ],
      },
    ],
  };
}

/**
 * Updates 'MarketingAgency' and 'WebSite/BreadcrumbList' Schema.org JSON-LD in document.head
 * without removing the static initial scripts from index.html
 */
export function injectPulseOctoSchemas(
  options: StructuredDataOptions & { activeView?: string } = {}
): () => void {
  const professionalServiceSchema = generateProfessionalServiceSchema(options);
  const websiteSchema = generateWebSiteAndBreadcrumbSchema(options);
  const faqPageSchema = generateFAQPageSchema(options);

  injectJsonLdScript(SCRIPT_ID_PROFESSIONAL_SERVICE, professionalServiceSchema);
  injectJsonLdScript(SCRIPT_ID_WEBSITE_BREADCRUMB, websiteSchema);
  injectJsonLdScript(SCRIPT_ID_FAQ_PAGE, faqPageSchema);

  if (options.activeView) {
    const activeServiceSchema = generateSingleArmServiceSchema(
      options.activeView,
      options.lang || 'ar'
    );
    if (activeServiceSchema) {
      injectJsonLdScript(SCRIPT_ID_ACTIVE_SERVICE, activeServiceSchema);
    } else {
      removeJsonLdScript(SCRIPT_ID_ACTIVE_SERVICE);
    }
  }

  return () => {
    // Keep the static JSON-LD scripts in document.head intact on unmount so crawlers and HomeFAQ always find them
  };
}

/**
 * React hook that maintains JSON-LD schemas in document.head
 */
export function usePulseOctoStructuredData(
  options: StructuredDataOptions & { activeView?: string } = {}
): void {
  const { lang, siteUrl, customFaqs, activeView } = options;

  useEffect(() => {
    const cleanup = injectPulseOctoSchemas({ lang, siteUrl, customFaqs, activeView });
    return cleanup;
  }, [lang, siteUrl, customFaqs, activeView]);
}


