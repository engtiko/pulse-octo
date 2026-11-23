import { CoverflowCardItem } from '../components/CoverflowMotionCarousel';

export const getLocalizedCoverflowServices = (isAr: boolean): CoverflowCardItem[] => [
  {
    id: 'branding',
    title: isAr ? 'الهوية وبناء العلامة' : 'BRANDING',
    category: isAr ? 'الهوية وبناء العلامة' : 'BRANDING',
    tag: isAr ? 'الهوية وبناء العلامة' : 'Branding & Identity',
    description: isAr
      ? 'تصميم شعارات وأنظمة بصرية متكاملة تعبر عن جوهر علامتك وتمنحها تميزاً راسخاً في السوق.'
      : 'Crafting distinctive brand marks and strategic identity systems that build enduring market presence.',
    image: '/1.webp',
    technicalDetails: isAr
      ? [
          'هندسة الشعار المتجهي والنسب الذهبية (Golden Ratio Architecture)',
          'دليل الهوية الشامل (Brand Guidelines & Visual Typography)',
          'تحديد الألوان الحصرية وتطبيقات الطباعة الفاخرة (Pantone C/U)',
          'تصميم الأصول الرقمية ونماذج التعبئة والتغليف ثلاثية الأبعاد',
        ]
      : [
          'Vector geometry & golden-ratio brandmark architecture',
          'Comprehensive brand guidelines & visual typography',
          'Exclusive color psychology & luxury print palettes (Pantone)',
          'Digital assets design & 3D packaging mockups',
        ],
    techStack: ['Figma', 'Adobe Illustrator', 'Photoshop', 'Brand Architecture'],
  },
  {
    id: 'marketing',
    title: isAr ? 'التسويق الرقمي' : 'MARKETING',
    category: isAr ? 'التسويق الرقمي' : 'MARKETING',
    tag: isAr ? 'حملات وإعلانات ممولة' : 'Campaigns & Paid Media',
    description: isAr
      ? 'إدارة حملات ممولة باستهداف فائق الدقة لتحقيق أعلى عائد على الإنفاق الإعلاني (ROAS).'
      : 'High-converting targeted media buying across Meta, TikTok, and Google.',
    image: '/2.webp',
    technicalDetails: isAr
      ? [
          'هندسة مسارات الشراء (Full-Funnel Acquisition & Retargeting)',
          'تثبيت البكسل والـ CAPI للتحويلات النظيفة على الخوادم',
          'اختبارات A/B مستمرة للنصوص الإعلانية والجمهور المشابه (Lookalikes)',
          'لوحات تحكم مباشرة لمتابعة تكلفة الاكتساب (CPA & ROAS)',
        ]
      : [
          'Full-funnel acquisition & dynamic retargeting matrices',
          'Server-side Conversion API (CAPI) & clean tracking',
          'Continuous multivariate A/B testing of hooks and lookalikes',
          'Real-time automated ROAS & acquisition telemetry dashboards',
        ],
    techStack: ['Meta Ads Manager', 'TikTok for Business', 'Google Ads', 'Server CAPI'],
  },
  {
    id: 'web-ecommerce',
    title: isAr ? 'المواقع والتجارة الإلكترونية' : 'WEB & E-COMMERCE',
    category: isAr ? 'المواقع والتجارة الإلكترونية' : 'WEB & E-COMMERCE',
    tag: isAr ? 'متاجر ومواقع' : 'Websites, Shopify & UI/UX',
    description: isAr
      ? 'بناء متاجر ومواقع فائقة السرعة بتجربة مستخدم مخصصة ترفع معدلات التحويل والمبيعات وتضمن استقرار 99.9%.'
      : 'Next-gen lightning storefronts and custom websites optimized for effortless checkouts.',
    image: '/3.webp',
    technicalDetails: isAr
      ? [
          'واجهات مستخدم سريعة الاستجابة ومحسنة للهواتف الذكية (Mobile-First)',
          'تكامل بوابات الدفع الإلكتروني وشركات الشحن والتتبع اللحظي',
          'تحسين مؤشرات Core Web Vitals وسرعة التحميل بأقل من 1.2 ثانية',
          'هيكلة قواعد البيانات وسلة الشراء السريعة بخطوة واحدة (One-Step Checkout)',
        ]
      : [
          'Responsive mobile-first component systems with zero layout shift',
          'Native payment gateways & carrier tracking API integrations',
          'Core Web Vitals sub-second loading optimizations',
          'Frictionless one-page checkout reducing drop-off rates',
        ],
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'REST & GraphQL'],
  },
  {
    id: 'studio',
    title: isAr ? 'الاستوديو والإنتاج الإبداعي' : 'STUDIO',
    category: isAr ? 'الاستوديو والإنتاج الإبداعي' : 'STUDIO',
    tag: isAr ? 'تصوير وريلز' : 'Photo, Video, Reels, Motion',
    description: isAr
      ? 'تصوير تجاري سينمائي للمنتجات ومونتاج ريلز ديناميكي جذاب يجلب ملايين المشاهدات العضوية.'
      : 'Editorial commercial photography, high-energy dynamic reels, and cinematic brand visuals.',
    image: '/4.webp',
    technicalDetails: isAr
      ? [
          'تصوير فوتوغرافي ماكرو وسينمائي لإبراز جودة المنتجات والتفاصيل',
          'إضاءة ستوديو متخصصة مع تحكم بالألوان الحرارية والدرامية',
          'مونتاج ديناميكي سريع مع مؤثرات صوتية وبصرية تخطف العين',
          'تصحيح وتدريج لوني سينمائي (Cinematic Color Grading) بدقة 4K',
        ]
      : [
          'Macro & anamorphic commercial product optics',
          'Studio volumetric lighting with custom RGB ambient moods',
          'Paced high-energy micro-edits with rhythmic sound design',
          'Professional DaVinci color grading delivering pristine 4K master files',
        ],
    techStack: ['Sony Cinema Line', 'DaVinci Resolve Studio', 'Macro Optics', 'Aputure Lighting'],
  },
  {
    id: 'digital-products',
    title: isAr ? 'المنتجات والحلول الرقمية' : 'DIGITAL PRODUCTS',
    category: isAr ? 'المنتجات والحلول الرقمية' : 'DIGITAL PRODUCTS',
    tag: isAr ? 'تطبيقات وبوابات' : 'Web Apps, Portals, Dashboards',
    description: isAr
      ? 'بناء وتطوير تطبيقات ويب ولوحات تحكم مخصصة وأدوات رقمية متقدمة ترتقي بتجربة عملائك وتشغيلك.'
      : 'Bespoke web applications, enterprise portals, dashboards, digital tools, and custom interactive experiences.',
    image: '/5.webp',
    technicalDetails: isAr
      ? [
          'هندسة تطبيقات الويب التفاعلية (Full-Stack Web Apps)',
          'لوحات تحكم وتحليل بيانات حية (Admin Dashboards & Portals)',
          'أدوات رقمية وحلول مخصصة لأتمتة تجارب العملاء',
          'بنية سحابية آمنة وقابلة للتوسع بأعلى معايير الحماية',
        ]
      : [
          'Full-stack interactive web application architecture',
          'Live data administration dashboards and enterprise portals',
          'Custom digital tools automating unique business workflows',
          'Scalable and secure cloud infrastructure with enterprise-grade auth',
        ],
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Next.js'],
  },
  {
    id: 'strategy',
    title: isAr ? 'الاستراتيجية' : 'STRATEGY',
    category: isAr ? 'الاستراتيجية' : 'STRATEGY',
    tag: isAr ? 'دراسة وتمركز' : 'Market Research & Roadmap',
    description: isAr
      ? 'خطط نمو وتمركز تنافسي مبنية على دراسة عميقة لسلوك السوق والمنافسين لكشف الفرص المهدرة.'
      : 'Actionable market telemetry and competitive roadmaps driving sustainable business supremacy.',
    image: '/6.webp',
    technicalDetails: isAr
      ? [
          'تحليل متعمق لحصص السوق ونقاط ضعف المنافسين المباشرين',
          'تحديد شرائح العملاء الأكثر ربحية ورفع القيمة الدائمة للعميل (LTV)',
          'إعداد خرائط طريق النمو ربع السنوية وتوزيع الميزانيات بدقة',
          'هندسة تسعير المنتجات وحزم العروض الموسمية الأكثر إقبالاً',
        ]
      : [
          'Competitor matrix scraping & untapped market opportunity mapping',
          'High-value audience clustering optimizing Customer Lifetime Value (LTV)',
          'Quarterly strategic scaling roadmaps & intelligent capital allocation',
          'Psychological offer structuring & seasonal bundling architectures',
        ],
    techStack: ['Looker Studio', 'Google Analytics 4', 'Hotjar', 'Market Scrapers'],
  },
  {
    id: 'content',
    title: isAr ? 'صناعة المحتوى' : 'CONTENT',
    category: isAr ? 'صناعة المحتوى' : 'CONTENT',
    tag: isAr ? 'كتابة وسيناريوهات' : 'Copywriting & Scriptwriting',
    description: isAr
      ? 'سيناريوهات فيديو ونصوص بيعية تمس اهتمامات العميل وتحفز اتخاذ قرار الشراء بذكاء.'
      : 'Persuasive hooks, viral video scripts, and narrative storytelling engineered to convert.',
    image: '/7.webp',
    technicalDetails: isAr
      ? [
          'هندسة الهوك الإعلاني الأول لاقتناص الانتباه في أول 3 ثوانٍ',
          'صياغة نصوص صفحات الهبوط المقنعة وفق أطر AIDA و PAS',
          'سيناريوهات فيديو كاملة مع توجيه الممثلين وزوايا التصوير',
          'نصوص حملات إعادة الاستهداف الترويجية ورسائل الواتساب والبريد',
        ]
      : [
          'High-retention 3-second visual hooks capturing prime attention',
          'Psychological landing page frameworks (AIDA, PAS, StoryBrand)',
          'Director-ready video scripts complete with shot-list cues',
          'Multi-touch SMS, WhatsApp, and email conversion sequences',
        ],
    techStack: ['StoryBrand Framework', 'Persuasion Architecture', 'Behavioral Psychology'],
  },
  {
    id: 'growth',
    title: isAr ? 'النمو والتحسين' : 'GROWTH',
    category: isAr ? 'النمو والتحسين' : 'GROWTH',
    tag: isAr ? 'SEO وتحسين النمو' : 'SEO, CRO & Retention',
    description: isAr
      ? 'منظومة توسع مستدامة تجمع تصدر محركات البحث (SEO) وتحسين التحويل (CRO) وتدفقات الأتمتة لنمو متصاعد.'
      : 'Full-funnel retention, SEO, CRO analytics, and multi-channel scale architectures.',
    image: '/8.webp',
    technicalDetails: isAr
      ? [
          'تهيئة المواقع لمحركات البحث (SEO) للتصدر في الكلمات المفتاحية الأكثر ربحية',
          'تحسين معدل التحويل (CRO) وتجربة المستخدم لتقليل الهدر',
          'تحليل سلوك الزوار وقمع المبيعات (Analytics & Funnel Optimization)',
          'استراتيجيات إعادة الشراء والاحتفاظ بالعملاء (Retention & LTV)',
        ]
      : [
          'Advanced Search Engine Optimization (SEO) dominating high-intent keywords',
          'Continuous Conversion Rate Optimization (CRO) eliminating leaky funnels',
          'Behavioral analytics, heatmaps, and checkout optimization',
          'Retention loops and customer lifetime value (LTV) maximization',
        ],
    techStack: ['Google Search Console', 'Ahrefs', 'Klaviyo', 'CRO Frameworks'],
  },
];
