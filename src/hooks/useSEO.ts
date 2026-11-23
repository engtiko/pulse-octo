import { useEffect, useLayoutEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  DEFAULT_SITE_URL,
  generateSingleArmServiceSchema,
  injectJsonLdScript,
  removeJsonLdScript,
  SCRIPT_ID_ACTIVE_SERVICE,
} from '../utils/seoStructuredData';

export interface ViewSEOMetadata {
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  canonicalPath?: string;
  ogImagePath?: string;
  ogImageAltAr?: string;
  ogImageAltEn?: string;
  ogType?: 'website' | 'article';
}

export const VIEW_SEO_DATA: Record<string, ViewSEOMetadata> = {
  home: {
    titleAr: 'Pulse OCTO | وكالة تسويق رقمي وحلول تقنية متكاملة',
    titleEn: 'Pulse OCTO | Integrated Digital Marketing & Tech Solutions Agency',
    descAr: 'Pulse OCTO | وكالة تسويق رقمي وحلول تقنية متكاملة. نقود نمو العلامات التجارية عبر 8 أذرع متخصصة: الهوية البصرية، الإعلانات الممولة، برمجة المواقع والمتاجر، الإنتاج الإبداعي، الحلول التقنية، الاستراتيجية، صناعة المحتوى، وتصدر محركات البحث SEO.',
    descEn: 'Pulse OCTO | Integrated Digital Marketing & Tech Solutions Agency. Scaling brands and e-commerce through 8 specialized arms: Branding, Paid Media, Web & E-Commerce, Creative Studio, Tech Solutions, Strategy, Content, and SEO.',
    canonicalPath: '/',
    ogImagePath: '/og/home.jpg',
    ogImageAltAr: 'Pulse OCTO | وكالة تسويق رقمي وحلول تقنية متكاملة',
    ogImageAltEn: 'Pulse OCTO | Integrated Digital Marketing & Tech Solutions Agency',
    ogType: 'website',
  },
  hero: {
    titleAr: 'Pulse OCTO | وكالة تسويق رقمي وحلول تقنية متكاملة',
    titleEn: 'Pulse OCTO | Integrated Digital Marketing & Tech Solutions Agency',
    descAr: 'Pulse OCTO | وكالة تسويق رقمي وحلول تقنية متكاملة. نقود نمو العلامات التجارية عبر 8 أذرع متخصصة: الهوية البصرية، الإعلانات الممولة، برمجة المواقع والمتاجر، الإنتاج الإبداعي، الحلول التقنية، الاستراتيجية، صناعة المحتوى، وتصدر محركات البحث SEO.',
    descEn: 'Pulse OCTO | Integrated Digital Marketing & Tech Solutions Agency. Scaling brands and e-commerce through 8 specialized arms: Branding, Paid Media, Web & E-Commerce, Creative Studio, Tech Solutions, Strategy, Content, and SEO.',
    canonicalPath: '/',
    ogImagePath: '/og/home.jpg',
    ogImageAltAr: 'Pulse OCTO | وكالة تسويق رقمي وحلول تقنية متكاملة',
    ogImageAltEn: 'Pulse OCTO | Integrated Digital Marketing & Tech Solutions Agency',
    ogType: 'website',
  },
  'who-we-are': {
    titleAr: 'من نحن | Pulse OCTO — وكالة تسويق رقمي وحلول تقنية متكاملة',
    titleEn: 'Who We Are | Pulse OCTO — Digital Marketing & Tech Solutions Agency',
    descAr: 'تعرف على قصة ورؤية Pulse OCTO وكالة تسويق رقمي وحلول تقنية متكاملة ومنظومة الأذرع الثمانية. نصنع الفارق للعلامات التجارية بأعلى كفاءة استراتيجية وتنفيذية.',
    descEn: 'Discover Pulse OCTO leadership, company philosophy, and our integrated 8-arm system engineering growth for brands in Egypt and the MENA region.',
    canonicalPath: '/who-we-are',
    ogImagePath: '/og/who-we-are.jpg',
    ogImageAltAr: 'من نحن - رؤية وفلسفة وكالة Pulse OCTO',
    ogImageAltEn: 'Who We Are - Pulse OCTO Philosophy & Leadership',
    ogType: 'website',
  },
  'the-8-arms': {
    titleAr: 'منظومة الأذرع الثمانية | Pulse OCTO — وكالة تسويق رقمي وحلول تقنية متكاملة',
    titleEn: 'The 8-Arm Integrated Growth System | Pulse OCTO Agency',
    descAr: 'منظومة متكاملة تعمل فيها الأذرع الثمانية (الهوية، التسويق، المواقع، الاستوديو، البرمجيات، الاستراتيجية، المحتوى، والـ SEO) في تناغم متصل كالنبض العصبي.',
    descEn: 'Our proprietary 8-arm integrated growth system aligning branding, paid media, e-commerce, studio production, software, strategy, content, and SEO.',
    canonicalPath: '/the-8-arms',
    ogImagePath: '/og/the-8-arms.jpg',
    ogImageAltAr: 'منظومة الأذرع الثمانية المتكاملة - Pulse OCTO',
    ogImageAltEn: 'The 8-Arm Integrated Growth System - Pulse OCTO',
    ogType: 'website',
  },
  'eight-arms': {
    titleAr: 'منظومة الأذرع الثمانية | Pulse OCTO — وكالة تسويق رقمي وحلول تقنية متكاملة',
    titleEn: 'The 8-Arm Integrated Growth System | Pulse OCTO Agency',
    descAr: 'منظومة متكاملة تعمل فيها الأذرع الثمانية (الهوية، التسويق، المواقع، الاستوديو، البرمجيات، الاستراتيجية، المحتوى، والـ SEO) في تناغم متصل كالنبض العصبي.',
    descEn: 'Our proprietary 8-arm integrated growth system aligning branding, paid media, e-commerce, studio production, software, strategy, content, and SEO.',
    canonicalPath: '/the-8-arms',
    ogImagePath: '/og/the-8-arms.jpg',
    ogImageAltAr: 'منظومة الأذرع الثمانية المتكاملة - Pulse OCTO',
    ogImageAltEn: 'The 8-Arm Integrated Growth System - Pulse OCTO',
    ogType: 'website',
  },
  services: {
    titleAr: 'خدماتنا | Pulse OCTO — وكالة تسويق رقمي وحلول تقنية متكاملة',
    titleEn: 'Our 8 Integrated Arms & Services | Pulse OCTO Agency',
    descAr: 'اكتشف خدمات Pulse OCTO وكالة تسويق رقمي وحلول تقنية متكاملة: الهوية وبناء العلامة، التسويق الرقمي والإعلانات الممولة، المواقع والتجارة الإلكترونية، الاستوديو، الحلول التقنية، الاستراتيجية، صناعة المحتوى، والـ SEO.',
    descEn: 'Explore our 8 multidisciplinary arms: Branding, Digital Marketing, Web & E-Commerce, Creative Studio, Digital Products, Brand Strategy, Content Creation, and SEO & Growth.',
    canonicalPath: '/services',
    ogImagePath: '/og/services.jpg',
    ogImageAltAr: 'خدمات Pulse OCTO وكالة تسويق رقمي وحلول تقنية متكاملة',
    ogImageAltEn: 'Pulse OCTO Integrated Digital Services & 8 Arms',
    ogType: 'website',
  },
  portfolio: {
    titleAr: 'أعمالنا وشركاء النجاح | Pulse OCTO — وكالة تسويق رقمي وحلول تقنية متكاملة',
    titleEn: 'Portfolio & Case Studies | Pulse OCTO Agency',
    descAr: 'شاهد دراسات الحالة ومشروعات العلامات التجارية والمتاجر الإلكترونية التي طورتها منظومة الأذرع الثمانية في وكالة Pulse OCTO.',
    descEn: 'Explore real-world case studies and brand ecosystems engineered across our 8 integrated disciplines at Pulse OCTO.',
    canonicalPath: '/portfolio',
    ogImagePath: '/og/portfolio.jpg',
    ogImageAltAr: 'سابقة أعمال ودراسات حالة وكالة Pulse OCTO',
    ogImageAltEn: 'Pulse OCTO Portfolio & Brand Case Studies',
    ogType: 'website',
  },
  projects: {
    titleAr: 'أعمالنا وشركاء النجاح | Pulse OCTO — وكالة تسويق رقمي وحلول تقنية متكاملة',
    titleEn: 'Portfolio & Case Studies | Pulse OCTO Agency',
    descAr: 'شاهد دراسات الحالة ومشروعات العلامات التجارية والمتاجر الإلكترونية التي طورتها منظومة الأذرع الثمانية في وكالة Pulse OCTO.',
    descEn: 'Explore real-world case studies and brand ecosystems engineered across our 8 integrated disciplines at Pulse OCTO.',
    canonicalPath: '/portfolio',
    ogImagePath: '/og/portfolio.jpg',
    ogImageAltAr: 'سابقة أعمال ودراسات حالة وكالة Pulse OCTO',
    ogImageAltEn: 'Pulse OCTO Portfolio & Brand Case Studies',
    ogType: 'website',
  },
  blog: {
    titleAr: 'المدونة والرؤى الرقمية | Pulse OCTO — وكالة تسويق رقمي وحلول تقنية متكاملة',
    titleEn: 'Digital Insights & Growth Playbooks | Pulse OCTO Blog',
    descAr: 'أحدث الرؤى والاستراتيجيات في التسويق الرقمي، الإعلانات الممولة، بناء العلامات التجارية، وتحسين معدل التحويل في التجارة الإلكترونية.',
    descEn: 'Latest articles, tactical growth guides, paid advertising benchmarks, and e-commerce conversion optimization playbooks.',
    canonicalPath: '/blog',
    ogImagePath: '/og/blog.jpg',
    ogImageAltAr: 'المدونة والرؤى الرقمية - Pulse OCTO',
    ogImageAltEn: 'Digital Insights & Strategy Blog - Pulse OCTO',
    ogType: 'article',
  },
  insights: {
    titleAr: 'المدونة والرؤى الرقمية | Pulse OCTO — وكالة تسويق رقمي وحلول تقنية متكاملة',
    titleEn: 'Digital Insights & Growth Playbooks | Pulse OCTO Blog',
    descAr: 'أحدث الرؤى والاستراتيجيات في التسويق الرقمي، الإعلانات الممولة، بناء العلامات التجارية، وتحسين معدل التحويل في التجارة الإلكترونية.',
    descEn: 'Latest articles, tactical growth guides, paid advertising benchmarks, and e-commerce conversion optimization playbooks.',
    canonicalPath: '/blog',
    ogImagePath: '/og/blog.jpg',
    ogImageAltAr: 'المدونة والرؤى الرقمية - Pulse OCTO',
    ogImageAltEn: 'Digital Insights & Strategy Blog - Pulse OCTO',
    ogType: 'article',
  },
  'tech-stack': {
    titleAr: 'الترسانة التقنية والبرمجية | Pulse OCTO — وكالة تسويق رقمي وحلول تقنية متكاملة',
    titleEn: 'Technology Stack & Digital Arsenal | Pulse OCTO',
    descAr: 'نوظف أحدث منصات التجارة (سلة، زد، شوبيفاي)، أدوات التتبع السيرفري CAPI، والأنظمة البرمجية لبناء حلول رقمية فائقة السرعة.',
    descEn: 'We leverage enterprise e-commerce platforms (Salla, Zid, Shopify), server-side tracking (CAPI, GTM), and modern software stacks.',
    canonicalPath: '/',
    ogImagePath: '/og/arm-5.jpg',
    ogImageAltAr: 'الترسانة التقنية والبرمجية - Pulse OCTO',
    ogImageAltEn: 'Technology Stack & Digital Products - Pulse OCTO',
    ogType: 'website',
  },
  'roi-calculator': {
    titleAr: 'حاسبة العائد الإعلاني التفاعلية | Pulse OCTO — وكالة تسويق رقمي وحلول تقنية متكاملة',
    titleEn: 'Interactive ROI & Ad Budget Calculator | Pulse OCTO',
    descAr: 'احسب العائد الاستثماري المتوقع لحملاتك الإعلانية، وتعرف على حجم المبيعات والأرباح التقديرية بناءً على ميزانيتك وقطاع تجارتك.',
    descEn: 'Calculate your projected return on ad spend (ROAS), orders, and revenue based on your marketing budget and business industry.',
    canonicalPath: '/',
    ogImagePath: '/og/arm-2.jpg',
    ogImageAltAr: 'حاسبة العائد الإعلاني التفاعلية - Pulse OCTO',
    ogImageAltEn: 'Interactive ROI Calculator - Pulse OCTO',
    ogType: 'website',
  },
  faq: {
    titleAr: 'الأسئلة الشائعة | Pulse OCTO — وكالة تسويق رقمي وحلول تقنية متكاملة',
    titleEn: 'Frequently Asked Questions & Answers | Pulse OCTO FAQ',
    descAr: 'إجابات شاملة ومفصلة حول تكلفة الحملات، خطة العمل، نماذج العقود، وتكامل الأذرع الثمانية لتحقيق أعلى عائد تسويقي لمشروعك.',
    descEn: 'Clear, transparent answers regarding campaign scaling, pricing tiers, performance metrics, and our 8-arm workflow methodologies.',
    canonicalPath: '/',
    ogImagePath: '/og/home.jpg',
    ogImageAltAr: 'الأسئلة الشائعة - وكالة Pulse OCTO',
    ogImageAltEn: 'Frequently Asked Questions - Pulse OCTO',
    ogType: 'website',
  },
  contact: {
    titleAr: 'تواصل معنا وابدأ نبض مشروعك | Pulse OCTO — وكالة تسويق رقمي وحلول تقنية متكاملة',
    titleEn: 'Contact Us & Start Your Digital Pulse | Pulse OCTO',
    descAr: 'تواصل مباشرة مع فريق Pulse OCTO وكالة تسويق رقمي وحلول تقنية متكاملة لبدء خطة نمو مخصصة لعلامتك التجارية أو متجرك الإلكتروني.',
    descEn: 'Connect with Pulse OCTO growth architects in Banha, Egypt to craft a tailored scaling proposal for your brand via WhatsApp or direct inquiry.',
    canonicalPath: '/contact',
    ogImagePath: '/og/contact.jpg',
    ogImageAltAr: 'تواصل مع وكالة Pulse OCTO وابدأ نبض مشروعك',
    ogImageAltEn: 'Contact Pulse OCTO Digital Agency',
    ogType: 'website',
  },
  card: {
    titleAr: 'م. طارق وجيه | بطاقة الأعمال الرقمية — Pulse OCTO',
    titleEn: 'Eng. Tarek Wagih | Digital Business Card — Pulse OCTO',
    descAr: 'بطاقة التواصل الرقمية الخاصة بـ م. طارق وجيه — المؤسس والمدير التنفيذي لوكالة Pulse OCTO للتسويق الرقمي والحلول المتكاملة.',
    descEn: 'Official digital business card for Eng. Tarek Wagih — Founder & CEO of Pulse OCTO Digital Marketing & Tech Solutions Agency.',
    canonicalPath: '/card',
    ogImagePath: '/og/who-we-are.jpg',
    ogImageAltAr: 'م. طارق وجيه - بطاقة الأعمال الرقمية Pulse OCTO',
    ogImageAltEn: 'Eng. Tarek Wagih - Pulse OCTO Digital Business Card',
    ogType: 'website',
  },

  // --- The 8 Arms in Official Order (01 to 08) ---
  'arm-1': {
    titleAr: '01 الهوية وبناء العلامة (Branding) | وكالة Pulse OCTO للتسويق الرقمي والحلول المتكاملة',
    titleEn: '01 Branding & Visual Identity | Pulse OCTO Digital Agency',
    descAr: 'تصميم الشعارات، الهوية البصرية المتكاملة، أدلة العلامة التجارية (Brand Guidelines)، وتصميم التغليف والمطبوعات التي تمنح علامتك حضوراً قوياً.',
    descEn: 'Strategic logo design, comprehensive visual identity systems, brand guidelines, and packaging by Pulse OCTO.',
    canonicalPath: '/branding',
    ogImagePath: '/og/arm-1.jpg',
    ogImageAltAr: '01 الهوية وبناء العلامة التجارية - Pulse OCTO',
    ogImageAltEn: '01 Branding & Visual Identity - Pulse OCTO',
    ogType: 'website',
  },
  'arm-2': {
    titleAr: '02 التسويق الرقمي والإعلانات الممولة | وكالة Pulse OCTO للتسويق الرقمي والحلول المتكاملة',
    titleEn: '02 Digital Marketing & Paid Media | Pulse OCTO Digital Agency',
    descAr: 'إدارة الحملات الإعلانية الممولة على فيسبوك، إنستجرام، جوجل، تيك توك، وسناب شات، وإدارة حسابات التواصل الاجتماعي لزيادة المبيعات.',
    descEn: 'High-converting performance media buying across Meta, Google, TikTok, and Snapchat, plus social media management by Pulse OCTO.',
    canonicalPath: '/digital-marketing',
    ogImagePath: '/og/arm-2.jpg',
    ogImageAltAr: '02 التسويق الرقمي والإعلانات الممولة - Pulse OCTO',
    ogImageAltEn: '02 Digital Marketing & Paid Media - Pulse OCTO',
    ogType: 'website',
  },
  'arm-3': {
    titleAr: 'تصميم وبرمجة المواقع المخصصة وتطوير المتاجر الإلكترونية (Custom Web & E-commerce Development) | وكالة Pulse OCTO للتسويق الرقمي والحلول المتكاملة',
    titleEn: 'Custom Web & E-commerce Development | Pulse OCTO Digital Agency',
    descAr: 'نحن لا نقتصر على منصات التجارة الإلكترونية الجاهزة فحسب، بل نصمم ونبرمج المواقع وتطبيقات الويب والمتاجر الإلكترونية المخصصة (Custom Development) بالكامل للشركات والعلامات التجارية من الصفر. نقدم حلول برمجة متكاملة وتخصيص احترافي (Customization) يلبى كافة الاحتياجات المعقدة بعيداً عن القوالب التقليدية، مع إدارة البنية التحتية والدومينات وربط بوابات الدفع وشحن المتاجر (سلة، زد، Shopify Plus، وووكومرس) بجودة عالمية وسرعة فائقة تضمن تفوقك الرقمي.',
    descEn: 'We do not limit ourselves to ready-made e-commerce platforms; we design and develop fully custom websites, web applications, and e-commerce stores from scratch for companies and brands. We deliver end-to-end development and advanced customization beyond traditional templates, managing infrastructure, domains, payment gateways, and shipping integrations (Salla, Zid, Shopify Plus, WooCommerce) with world-class quality and ultra-fast performance.',
    canonicalPath: '/web-ecommerce',
    ogImagePath: '/og/arm-3.jpg',
    ogImageAltAr: '03 تصميم وبرمجة المواقع والمتاجر الإلكترونية - Pulse OCTO',
    ogImageAltEn: '03 Custom Web & E-Commerce Development - Pulse OCTO',
    ogType: 'website',
  },
  'arm-4': {
    titleAr: '04 الاستوديو والإنتاج الإبداعي | وكالة Pulse OCTO للتسويق الرقمي والحلول المتكاملة',
    titleEn: '04 Creative Studio & Production | Pulse OCTO Digital Agency',
    descAr: 'الإنتاج الإعلاني والسينمائي، تصوير المنتجات الفوتوغرافي، الموشن جرافيك، صناعة الـ Reels، وتصميمات الـ 3D والـ CGI الاحترافية.',
    descEn: 'Commercial video production, studio product photography, motion graphics, Reels/Shorts editing, and 3D CGI visuals by Pulse OCTO.',
    canonicalPath: '/creative-studio',
    ogImagePath: '/og/arm-4.jpg',
    ogImageAltAr: '04 الاستوديو والإنتاج الإبداعي - Pulse OCTO',
    ogImageAltEn: '04 Creative Studio & Production - Pulse OCTO',
    ogType: 'website',
  },
  'arm-5': {
    titleAr: '05 المنتجات والحلول الرقمية | وكالة Pulse OCTO للتسويق الرقمي والحلول المتكاملة',
    titleEn: '05 Digital Products & Automation | Pulse OCTO Digital Agency',
    descAr: 'تطوير تطبيقات الموبايل (iOS & Android)، أنظمة الويب المخصصة، لوحات التحكم التفاعلية، وحلول الأتمتة وربط الأنظمة البرمجية API.',
    descEn: 'iOS & Android mobile apps, custom web platforms, interactive dashboards, and workflow API automation by Pulse OCTO.',
    canonicalPath: '/digital-products',
    ogImagePath: '/og/arm-5.jpg',
    ogImageAltAr: '05 المنتجات والحلول الرقمية والأتمتة - Pulse OCTO',
    ogImageAltEn: '05 Digital Products & Automation - Pulse OCTO',
    ogType: 'website',
  },
  'arm-6': {
    titleAr: '06 الاستراتيجية ودراسة السوق | وكالة Pulse OCTO للتسويق الرقمي والحلول المتكاملة',
    titleEn: '06 Brand Strategy & Market Research | Pulse OCTO Digital Agency',
    descAr: 'دراسات السوق وتحليل المنافسين، تحديد التموضع التسويقي، بناء شرائح العملاء ورحلة المشتري، وخطط الإطلاق والتوسع المدروسة.',
    descEn: 'Comprehensive market and competitor analysis, brand positioning, customer journey mapping, and go-to-market growth roadmaps.',
    canonicalPath: '/brand-strategy',
    ogImagePath: '/og/arm-6.jpg',
    ogImageAltAr: '06 الاستراتيجية ودراسة السوق - Pulse OCTO',
    ogImageAltEn: '06 Brand Strategy & Market Research - Pulse OCTO',
    ogType: 'website',
  },
  'arm-7': {
    titleAr: '07 صناعة المحتوى والكتابة الإعلانية | وكالة Pulse OCTO للتسويق الرقمي والحلول المتكاملة',
    titleEn: '07 Content Creation & Copywriting | Pulse OCTO Digital Agency',
    descAr: 'الكتابة الإعلانية البيعية (Copywriting)، خطط المحتوى الإبداعي، كتابة سيناريوهات الفيديو والإعلانات، والمحتوى المتخصص المتوافق مع محركات البحث.',
    descEn: 'Persuasive conversion copywriting, creative content calendars, video scriptwriting, and authority articles by Pulse OCTO.',
    canonicalPath: '/content-creation',
    ogImagePath: '/og/arm-7.jpg',
    ogImageAltAr: '07 صناعة المحتوى والكتابة الإعلانية - Pulse OCTO',
    ogImageAltEn: '07 Content Creation & Copywriting - Pulse OCTO',
    ogType: 'website',
  },
  'arm-8': {
    titleAr: '08 النمو وتصدر محركات البحث (SEO) | وكالة Pulse OCTO للتسويق الرقمي والحلول المتكاملة',
    titleEn: '08 SEO & Growth Optimization | Pulse OCTO Digital Agency',
    descAr: 'تحسين محركات البحث الداخلي والتقني (SEO)، تحسين معدل التحويل (CRO)، وتتبع البيانات والتحليلات المتقدمة (GA4 & Server-Side CAPI).',
    descEn: 'Technical and organic SEO dominance, Conversion Rate Optimization (CRO), and advanced GA4 & CAPI analytics by Pulse OCTO.',
    canonicalPath: '/seo-growth',
    ogImagePath: '/og/arm-8.jpg',
    ogImageAltAr: '08 النمو وتصدر محركات البحث SEO - Pulse OCTO',
    ogImageAltEn: '08 SEO & Growth Optimization - Pulse OCTO',
    ogType: 'website',
  },
};

// Routing & Clean Slug Aliases
VIEW_SEO_DATA['arms'] = VIEW_SEO_DATA['the-8-arms'];
VIEW_SEO_DATA['branding'] = VIEW_SEO_DATA['arm-1'];
VIEW_SEO_DATA['digital-marketing'] = VIEW_SEO_DATA['arm-2'];
VIEW_SEO_DATA['web-ecommerce'] = VIEW_SEO_DATA['arm-3'];
VIEW_SEO_DATA['creative-studio'] = VIEW_SEO_DATA['arm-4'];
VIEW_SEO_DATA['digital-products'] = VIEW_SEO_DATA['arm-5'];
VIEW_SEO_DATA['brand-strategy'] = VIEW_SEO_DATA['arm-6'];
VIEW_SEO_DATA['content-creation'] = VIEW_SEO_DATA['arm-7'];
VIEW_SEO_DATA['seo-growth'] = VIEW_SEO_DATA['arm-8'];

/**
 * Normalizes any URL, pathname, or route slug (e.g. "https://www.pulseocto.com/portfolio", "/branding", "arm-3")
 * into a known key in VIEW_SEO_DATA.
 */
export function resolveViewFromUrlOrSlug(rawInput: string): string {
  if (!rawInput) return 'home';
  let cleaned = rawInput.trim();
  try {
    if (/^https?:\/\//i.test(cleaned)) {
      const parsed = new URL(cleaned);
      cleaned = parsed.pathname || parsed.hash || '/';
    }
  } catch {
    // Fallback to string stripping if partial URL
    cleaned = cleaned.replace(/^https?:\/\/[^/]+/i, '');
  }

  const token = cleaned
    .replace(/^[#/]+|\/+$/g, '')
    .split(/[?#]/)[0]
    .trim()
    .toLowerCase();

  if (!token || token === 'home' || token === 'hero' || token === 'index.html') return 'home';
  if (VIEW_SEO_DATA[token]) return token;
  if (token === 'about') return 'who-we-are';
  if (token === 'our-services' || token === 'services-accordion-wrapper' || token === 'tech-stack') return 'services';
  if (token === 'eight-arms' || token === 'arms-3d-orbit' || token === 'arms-3d-showcase') return 'the-8-arms';
  if (token === 'work' || token === 'case-studies' || token === 'projects' || token === 'portfolio-section' || token === 'trust-partners-section') return 'portfolio';
  if (token === 'insights' || token === 'insights-section') return 'blog';
  if (token === 'faq' || token === 'faq-section-wrapper' || token === 'wizard-section' || token === 'roi-calculator') return 'contact';
  if (
    token === 'card' ||
    token === 'vcard' ||
    token === 'tarek' ||
    token === 'ceo' ||
    token === 'id' ||
    token === 'business-card'
  ) {
    return 'card';
  }

  const serviceMatch = token.match(/^(?:arm-|service-|0?)([1-8])$/i);
  if (serviceMatch) {
    const id = parseInt(serviceMatch[1], 10);
    if (id >= 1 && id <= 8) return `arm-${id}`;
  }

  return 'home';
}

export function getCanonicalUrlForView(view: string): string {
  const resolved = resolveViewFromUrlOrSlug(view);
  const meta = VIEW_SEO_DATA[resolved] || VIEW_SEO_DATA.home;
  const path = meta.canonicalPath || '/';
  return path === '/' ? `${DEFAULT_SITE_URL}/` : `${DEFAULT_SITE_URL}${path}`;
}

/**
 * Ensures strictly ONE self-referencing `<link rel="canonical">` tag exists in `document.head`
 * pointing to `canonicalUrl`, removing any duplicates, and keeps hreflang alternates in sync.
 */
export function syncDocumentCanonical(canonicalUrl: string): void {
  if (typeof document === 'undefined' || !canonicalUrl) return;

  const canonicalLinks = Array.from(document.head.querySelectorAll('link[rel="canonical"]'));
  if (canonicalLinks.length === 0) {
    const canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    canonicalLink.setAttribute('href', canonicalUrl);
    document.head.appendChild(canonicalLink);
  } else {
    canonicalLinks[0].setAttribute('href', canonicalUrl);
    for (let i = 1; i < canonicalLinks.length; i++) {
      canonicalLinks[i].remove();
    }
  }

  const alternateLinks = document.head.querySelectorAll(
    'link[rel="alternate"][hreflang="ar"], link[rel="alternate"][hreflang="en"], link[rel="alternate"][hreflang="x-default"]'
  );
  alternateLinks.forEach((link) => {
    link.setAttribute('href', canonicalUrl);
  });
}

export function getOgImageForView(view: string, customOgImage?: string): {
  fullUrl: string;
  localPath: string;
  altAr: string;
  altEn: string;
} {
  if (customOgImage) {
    const isAbsolute = /^https?:\/\//i.test(customOgImage);
    const localPath = isAbsolute
      ? customOgImage.replace(/^https?:\/\/[^/]+/i, '') || '/og/home.jpg'
      : customOgImage.startsWith('/')
        ? customOgImage
        : `/${customOgImage}`;
    const fullUrl = isAbsolute ? customOgImage : `${DEFAULT_SITE_URL}${localPath}`;
    return {
      fullUrl,
      localPath,
      altAr: 'Pulse OCTO | وكالة تسويق رقمي وحلول تقنية متكاملة',
      altEn: 'Pulse OCTO | Integrated Digital Marketing & Tech Solutions Agency',
    };
  }

  const resolved = resolveViewFromUrlOrSlug(view);
  const meta = VIEW_SEO_DATA[resolved] || VIEW_SEO_DATA.home;
  const localPath = meta.ogImagePath || '/og/home.jpg';
  return {
    fullUrl: `${DEFAULT_SITE_URL}${localPath}`,
    localPath,
    altAr: meta.ogImageAltAr || meta.titleAr,
    altEn: meta.ogImageAltEn || meta.titleEn,
  };
}

export interface SocialCardResolvedMetadata {
  viewKey: string;
  title: string;
  description: string;
  canonicalUrl: string;
  ogImageUrl: string;
  localImagePath: string;
  ogImageAlt: string;
  ogType: string;
  siteName: string;
  domain: string;
}

export function getSocialCardMetadataForView(
  viewOrUrl: string,
  lang: 'ar' | 'en' = 'ar'
): SocialCardResolvedMetadata {
  const viewKey = resolveViewFromUrlOrSlug(viewOrUrl);
  const meta = VIEW_SEO_DATA[viewKey] || VIEW_SEO_DATA.home;
  const isAr = lang === 'ar';
  const title = isAr ? meta.titleAr : meta.titleEn;
  const description = isAr ? meta.descAr : meta.descEn;
  const canonicalUrl = getCanonicalUrlForView(viewKey);
  const ogImg = getOgImageForView(viewKey);

  return {
    viewKey,
    title,
    description,
    canonicalUrl,
    ogImageUrl: ogImg.fullUrl,
    localImagePath: ogImg.localPath,
    ogImageAlt: isAr ? ogImg.altAr : ogImg.altEn,
    ogType: meta.ogType || 'website',
    siteName: isAr
      ? 'Pulse OCTO | وكالة تسويق رقمي وحلول تقنية متكاملة'
      : 'Pulse OCTO | Integrated Digital Marketing & Tech Solutions Agency',
    domain: 'www.pulseocto.com',
  };
}

export interface UseSEOOptions {
  customTitle?: string;
  customDescription?: string;
  canonicalUrl?: string;
  ogImage?: string;
}

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Dispatches a real-time section/arm change event so App.tsx and SEOHead.tsx
 * immediately synchronize `currentSection` and update `og:image` and `og:title` in the DOM
 * without requiring a page reload.
 */
export function notifySectionChange(section: string) {
  if (typeof window === 'undefined' || !section) return;
  window.dispatchEvent(
    new CustomEvent('pulse-octo:section-change', {
      detail: { section },
    })
  );
}

/**
 * Custom hook to dynamically manage and centralize document title,
 * meta descriptions, OpenGraph, Twitter tags, and clean canonical URLs.
 */
export function useSEO(currentView: string = 'home', options?: UseSEOOptions) {
  const { lang, isAr } = useLanguage();

  const metadata = useMemo(() => {
    const resolvedKey = resolveViewFromUrlOrSlug(currentView);
    const raw = VIEW_SEO_DATA[resolvedKey] || VIEW_SEO_DATA.home;
    const title = options?.customTitle || (isAr ? raw.titleAr : raw.titleEn);
    const description = options?.customDescription || (isAr ? raw.descAr : raw.descEn);
    const canonicalUrl = options?.canonicalUrl || getCanonicalUrlForView(resolvedKey);
    const imageInfo = getOgImageForView(resolvedKey, options?.ogImage);
    const ogImageAlt = isAr ? imageInfo.altAr : imageInfo.altEn;
    const ogType = raw.ogType || 'website';
    return {
      resolvedKey,
      title,
      description,
      canonicalUrl,
      ogImageUrl: imageInfo.fullUrl,
      localImagePath: imageInfo.localPath,
      ogImageAlt,
      ogType,
      raw,
    };
  }, [currentView, isAr, options?.customTitle, options?.customDescription, options?.canonicalUrl, options?.ogImage]);

  useIsomorphicLayoutEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const {
      resolvedKey,
      title,
      description,
      canonicalUrl,
      ogImageUrl,
      localImagePath,
      ogImageAlt,
      ogType,
    } = metadata;

    // 1. Update Document Title
    document.title = title;

    // Helper to safely set or create a meta tag across all matching elements in document.head
    const setMetaTag = (attributeName: 'name' | 'property', attributeValue: string, content: string) => {
      const elements = document.head.querySelectorAll(`meta[${attributeName}="${attributeValue}"]`);
      if (elements.length === 0) {
        const element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        element.setAttribute('content', content);
        document.head.appendChild(element);
      } else {
        elements.forEach((el) => {
          el.setAttribute('content', content);
        });
      }
    };

    // 2. Standard Meta Description
    setMetaTag('name', 'title', title);
    setMetaTag('name', 'description', description);

    // 3. OpenGraph Tags (WhatsApp, Facebook, Messenger, LinkedIn)
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag(
      'property',
      'og:site_name',
      isAr ? 'Pulse OCTO | وكالة تسويق رقمي وحلول تقنية متكاملة' : 'Pulse OCTO | Integrated Digital Marketing & Tech Solutions Agency'
    );
    setMetaTag('property', 'og:locale', isAr ? 'ar_EG' : 'en_US');
    setMetaTag('property', 'og:image', ogImageUrl);
    setMetaTag('property', 'og:image:secure_url', ogImageUrl);
    setMetaTag('property', 'og:image:type', 'image/jpeg');
    setMetaTag('property', 'og:image:width', '1200');
    setMetaTag('property', 'og:image:height', '630');
    setMetaTag('property', 'og:image:alt', ogImageAlt);

    // 4. Twitter / X Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:url', canonicalUrl);
    setMetaTag('name', 'twitter:image', ogImageUrl);
    setMetaTag('name', 'twitter:image:alt', ogImageAlt);

    // 5. Single self-referencing Canonical Link (always clean https://www.pulseocto.com/... URL without #)
    syncDocumentCanonical(canonicalUrl);

    // 6. Dedicated Service Schema JSON-LD when viewing any of the 8 Arms
    const activeArmSchema = generateSingleArmServiceSchema(resolvedKey, isAr ? 'ar' : 'en');
    if (activeArmSchema) {
      injectJsonLdScript(SCRIPT_ID_ACTIVE_SERVICE, activeArmSchema);
    } else {
      removeJsonLdScript(SCRIPT_ID_ACTIVE_SERVICE);
    }

    // 7. Notify developer tools / Social Preview Simulator that live meta tags updated
    window.dispatchEvent(
      new CustomEvent('pulse-octo:seo-updated', {
        detail: {
          viewKey: resolvedKey,
          title,
          description,
          canonicalUrl,
          ogImageUrl,
          localImagePath,
          ogImageAlt,
          ogType,
        },
      })
    );
  }, [metadata, isAr]);

  return {
    title: metadata.title,
    description: metadata.description,
    canonicalUrl: metadata.canonicalUrl,
    ogImageUrl: metadata.ogImageUrl,
    localImagePath: metadata.localImagePath,
    ogImageAlt: metadata.ogImageAlt,
    currentView: metadata.resolvedKey,
    isAr,
    lang,
  };
}


