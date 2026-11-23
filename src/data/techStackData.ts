export type CapabilityPillar = 'create' | 'build' | 'automate' | 'measure' | 'infrastructure';

export interface TechItem {
  id: string;
  name: string;
  pillar: CapabilityPillar;
  roleAr: string;
  roleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  systemFunctionAr: string;
  systemFunctionEn: string;
  iconType: string;
}

export interface CapabilityPillarMeta {
  id: CapabilityPillar;
  number: string;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  description: string;
  descriptionAr: string;
}

export const CAPABILITY_PILLARS: CapabilityPillarMeta[] = [
  {
    id: 'create',
    number: '01',
    title: 'CREATE',
    titleAr: 'الابتكار والتصميم',
    subtitle: 'Design and creative production',
    subtitleAr: 'التصميم والإنتاج الإبداعي',
    description: 'Engineering bespoke visual systems, brand tokens, and thumb-stopping cinematic assets that command audience attention.',
    descriptionAr: 'هندسة لغات بصرية متماسكة، وأدلة هوية رقمية، ومحتوى سينمائي مصمم خصيصاً لإيقاف التمرير وترسيخ مكانة العلامة.'
  },
  {
    id: 'build',
    number: '02',
    title: 'BUILD',
    titleAr: 'البناء والتطوير',
    subtitle: 'Web and digital experiences',
    subtitleAr: 'الويب والتجارب الرقمية',
    description: 'Developing high-velocity web platforms, resilient e-commerce architectures, and fluid responsive interfaces.',
    descriptionAr: 'تطوير منصات ويب فائقة السرعة، ومعماريات تجارة إلكترونية متينة، وتجارب مستخدم انسيابية ترفع معدلات التحويل.'
  },
  {
    id: 'automate',
    number: '03',
    title: 'AUTOMATE',
    titleAr: 'الأتمتة والربط',
    subtitle: 'Workflows and integrations',
    subtitleAr: 'أتمتة دورات العمل والربط',
    description: 'Connecting fragmented digital touchpoints into self-governing pipelines that reduce manual friction and sync real-time data.',
    descriptionAr: 'ربط نقاط التماس الرقمية في مسارات عمل ذاتية الإدارة تلغي العمل اليدوي وتزامن بيانات الطلبات والعملاء لحظياً.'
  },
  {
    id: 'measure',
    number: '04',
    title: 'MEASURE',
    titleAr: 'القياس والتحليل',
    subtitle: 'Analytics and performance',
    subtitleAr: 'التحليلات وقياس الأداء',
    description: 'Deploying server-side telemetry, acquisition attribution, and data models to direct capital where it generates maximum ROI.',
    descriptionAr: 'تفعيل أنظمة التتبع السيرفري، ونماذج عزو المبيعات، ومراقبة مسارات القمع لتوجيه الميزانيات بدقة نحو أعلى عائد استثماري.'
  },
  {
    id: 'infrastructure',
    number: '05',
    title: 'INFRASTRUCTURE',
    titleAr: 'البنية والسحابة',
    subtitle: 'Cloud and delivery',
    subtitleAr: 'السحابة والأداء المستقر',
    description: 'Fortifying platforms with global edge distribution, perimeter security shields, and enterprise microservices.',
    descriptionAr: 'تأمين المنصات بشبكات التوزيع السحابي اللامركزي، ودفاعات الأمان المحيطية، والخدمات البرمجية الدقيقة عالية الاستقرار.'
  }
];

export const TECH_STACK_ITEMS: TechItem[] = [
  // ==========================================
  // CREATE — Design and creative production
  // ==========================================
  {
    id: 'figma',
    name: 'Figma Pro',
    pillar: 'create',
    roleAr: 'هندسة الواجهات والأنظمة البصرية',
    roleEn: 'UI/UX & Design Systems',
    descriptionAr: 'تصميم واجهات المستخدم (UI/UX)، النماذج التفاعلية، ودلائل الهوية الرقمية المتكاملة مع توحيد عناصر التصميم (Design Tokens).',
    descriptionEn: 'Architecting bespoke UI/UX design systems, component tokens, responsive grids, and clickable high-fidelity prototypes.',
    systemFunctionAr: 'حجر الأساس لتجربة المستخدم قبل الانتقال للترميز البرمجي',
    systemFunctionEn: 'Foundational interface blueprint before frontend engineering',
    iconType: 'figma'
  },
  {
    id: 'after-effects',
    name: 'Adobe After Effects',
    pillar: 'create',
    roleAr: 'الموشن جرافيك والمؤثرات البصرية',
    roleEn: 'Kinetic Motion & Visual FX',
    descriptionAr: 'تحريك الشعارات، هندسة الإيقاع الحركي (Kinetic Typography)، والمؤثرات البصرية التي تضفي حيوية رقمية على أصول البراند.',
    descriptionEn: 'High-end 2D/3D motion graphics, brand identity motion systems, dynamic transitions, and commercial visual effects.',
    systemFunctionAr: 'بث النبض الحركي في هوية العلامة التجارية عبر كافة الشاشات',
    systemFunctionEn: 'Infusing kinetic pulse and dimensional life into digital touchpoints',
    iconType: 'aftereffects'
  },
  {
    id: 'premiere-pro',
    name: 'Adobe Premiere Pro',
    pillar: 'create',
    roleAr: 'المونتاج التجاري وصناعة الفيديو',
    roleEn: 'Commercial Video Editorial',
    descriptionAr: 'مونتاج فيديو إعلاني إيقاعي مصمم خصيصاً لإيقاف التمرير (Thumb-stopping) مع تدريج الألوان وهندسة الصوت السينمائي.',
    descriptionEn: 'Precision-paced advertising edits engineered for initial 3-second hook retention, color grading, and sonic impact.',
    systemFunctionAr: 'تحويل المشاهد المصورة إلى أسلحة جذب تحويلية في الحملات',
    systemFunctionEn: 'Crafting high-retention video narratives for paid acquisition',
    iconType: 'premiere'
  },
  {
    id: 'midjourney',
    name: 'Midjourney & ComfyUI',
    pillar: 'create',
    roleAr: 'التوليد البصري السينمائي',
    roleEn: 'Generative Visual Synthesis',
    descriptionAr: 'توليد أصول بصرية واقعية ومفاهيم سينمائية فائقة الدقة تُعجّل إنتاج الحملات دون الاعتماد على الصور الجاهزة المكررة.',
    descriptionEn: 'Cinematic visual synthesis, commercial photorealistic product staging, and rapid creative exploration without generic stock imagery.',
    systemFunctionAr: 'تسريع الابتكار البصري وصياغة لقطات تصويرية مستحيلة',
    systemFunctionEn: 'Accelerating concept ideation with photorealistic custom imagery',
    iconType: 'midjourney'
  },

  // ==========================================
  // BUILD — Web and digital experiences
  // ==========================================
  {
    id: 'react-next',
    name: 'React & Next.js',
    pillar: 'build',
    roleAr: 'معمارية الويب فائقة السرعة',
    roleEn: 'Reactive SSR Web Engine',
    descriptionAr: 'بناء تطبيقات ويب فائقة الأداء بواجهات تفاعلية تدعم العرض من جانب الخادم (SSR) وسرعة استثنائية في تحميل الصفحات.',
    descriptionEn: 'Cutting-edge reactive web applications with server-side rendering, instant hydration, and optimal Core Web Vitals.',
    systemFunctionAr: 'تحقيق أداء 100% في مقاييس جوجل وتجربة تصفح فورية',
    systemFunctionEn: 'Delivering sub-second load times and flawless technical SEO foundations',
    iconType: 'react'
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    pillar: 'build',
    roleAr: 'البرمجة متينة الأنماط',
    roleEn: 'Enterprise Type-Safe Architecture',
    descriptionAr: 'كتابة كود برمجي متين وخالٍ من الأخطاء يضمن استقرار المنظومة البرمجية وقابلية التوسع دون مفاجآت تشغيلية.',
    descriptionEn: 'Type-safe enterprise software architecture preventing edge-case bugs and ensuring long-term code maintainability.',
    systemFunctionAr: 'ضمان موثوقية الأنظمة ومنع الأعطال البرمجية في بيئة الإنتاج',
    systemFunctionEn: 'Eliminating runtime anomalies across mission-critical flows',
    iconType: 'typescript'
  },
  {
    id: 'tailwind-motion',
    name: 'Tailwind CSS & Motion',
    pillar: 'build',
    roleAr: 'التصميم التفاعلي المتجاوب',
    roleEn: 'Fluid Responsive Styling',
    descriptionAr: 'هندسة حركات سلسة وتصاميم حديثة متجاوبة مع كافة الشاشات وأجهزة الجوال مع تجنب زيادة حجم الحزم البرمجية.',
    descriptionEn: 'Pixel-perfect responsive utility architectures paired with fluid, spring-physics micro-interactions and low footprint.',
    systemFunctionAr: 'تجربة بصرية مريحة ومتسقة عبر كل أجهزة الهواتف والشاشات',
    systemFunctionEn: 'Unified cross-device aesthetics with zero layout shift',
    iconType: 'tailwind'
  },
  {
    id: 'shopify',
    name: 'Shopify Plus',
    pillar: 'build',
    roleAr: 'التجارة العالمية وتطوير Liquid',
    roleEn: 'Global E-Commerce Architecture',
    descriptionAr: 'تطوير متاجر شوبيفاي المخصصة، ثيمات Liquid متطورة، وتكاملات تطبيقات الدفع والشحن لخدمة الأسواق الإقليمية والدولية.',
    descriptionEn: 'Custom Shopify Plus stores, bespoke Liquid architecture, headless commerce integrations, and high-velocity checkout scaling.',
    systemFunctionAr: 'بنية تحتية لتوسيع المبيعات وتجارة عابرة للحدود',
    systemFunctionEn: 'High-converting checkout engine built for scaling volume',
    iconType: 'shopify'
  },
  {
    id: 'salla',
    name: 'سلة (Salla)',
    pillar: 'build',
    roleAr: 'التجارة الإلكترونية المحلية (السعودية والخليج)',
    roleEn: 'Localized MENA Commerce Engine',
    descriptionAr: 'تطوير وتخصيص متاجر سلة المتقدمة مع ربط الثيمات المخصصة، بوابات الدفع المحلية (مدى، تابي، تمارا) وإدارة الطلبات السلسة.',
    descriptionEn: 'Advanced Salla merchant customization, bespoke CSS themes, local payment gateway wiring, and automated order fulfillment hooks.',
    systemFunctionAr: 'توفير تجربة شراء محلية مألوفة وسريعة للمستهلك العربي',
    systemFunctionEn: 'Frictionless checkout adapted to regional buying behaviors',
    iconType: 'salla'
  },
  {
    id: 'zid',
    name: 'زد (Zid)',
    pillar: 'build',
    roleAr: 'حلول التجارة المؤسسية وربط ERP',
    roleEn: 'Enterprise Retail Operations',
    descriptionAr: 'بناء وتخصيص متاجر زد للمؤسسات مع تفعيل أنظمة الشحن السريع وإدارة المخزون والربط مع أنظمة إدارة الموارد (ERP).',
    descriptionEn: 'Enterprise Zid store engineering, fast shipping matrix, ERP database sync, and high-converting retail checkout flows.',
    systemFunctionAr: 'إدارة العمليات التجارية الضخمة وسلاسل الإمداد بدقة',
    systemFunctionEn: 'Synchronizing high-volume catalog inventory and logistics',
    iconType: 'zid'
  },
  {
    id: 'woocommerce',
    name: 'WooCommerce',
    pillar: 'build',
    roleAr: 'المتاجر المفتوحة والمخصصة برمجياً',
    roleEn: 'Open-Source Custom Commerce',
    descriptionAr: 'حلول التجارة الإلكترونية المفتوحة المصدر المخصصة مع تأمين قواعد البيانات، وتطوير إضافات برمجية مخصصة بدون قيود.',
    descriptionEn: 'Custom open-source e-commerce solutions with hardened database security, custom plugin development, and unconstrained control.',
    systemFunctionAr: 'مرونة برمجية مطلقة لربط الأنظمة الداخلية غير التقليدية',
    systemFunctionEn: 'Full data ownership and tailored transactional business logic',
    iconType: 'woocommerce'
  },

  // ==========================================
  // AUTOMATE — Workflows and integrations
  // ==========================================
  {
    id: 'make-automation',
    name: 'Make & Zapier',
    pillar: 'automate',
    roleAr: 'أتمتة مسارات العمل والربط الفوري',
    roleEn: 'Autonomous Workflow Pipelines',
    descriptionAr: 'أتمتة دورات العمل، ربط طلبات المتاجر بإشعارات الواتساب المباشرة، ومزامنة بيانات العملاء الجدد في أنظمة CRM تلقائياً.',
    descriptionEn: 'Autonomous workflow pipelines, instant WhatsApp/SMS order notifications, CRM sync, and multi-step lead routing.',
    systemFunctionAr: 'إلغاء العمل اليدوي المتكرر وتسريع استجابة فريق المبيعات',
    systemFunctionEn: 'Zero-latency data handoffs between commercial platforms',
    iconType: 'automation'
  },
  {
    id: 'gemini-ai',
    name: 'Google Gemini & Claude',
    pillar: 'automate',
    roleAr: 'الذكاء التحليلي وصياغة المحتوى',
    roleEn: 'AI Reasoning & Language Workflows',
    descriptionAr: 'دمج نماذج الذكاء الاصطناعي في مسارات التدقيق التسويقي، صياغة النصوص المخصصة وفق نبرة البراند، وتحليل بيانات المستهلكين.',
    descriptionEn: 'Generative AI workflows for localized marketing copy, predictive customer modeling, operational summarization, and workflow automation.',
    systemFunctionAr: 'مضاعفة سرعة إنتاج المحتوى التخصصي والتحليل المعمق',
    systemFunctionEn: 'Scaling intellectual production and automated insight generation',
    iconType: 'gemini'
  },

  // ==========================================
  // MEASURE — Analytics and performance
  // ==========================================
  {
    id: 'ga4',
    name: 'Google Analytics 4 & GTM',
    pillar: 'measure',
    roleAr: 'التتبع السيرفري وتحليل المسارات',
    roleEn: 'Server-Side Telemetry & GTM',
    descriptionAr: 'إعداد أنظمة القياس المتقدمة عبر Server-Side GTM، تتبع مسارات القمع (Funnels)، وتحليل رحلة العميل بالتفصيل مع احترام الخصوصية.',
    descriptionEn: 'Server-side GTM deployment, multi-touch attribution modeling, enhanced e-commerce event logging, and full funnel telemetry.',
    systemFunctionAr: 'توثيق كل حركة في المتجر لكشف نقاط التسرب والفرص المفقودة',
    systemFunctionEn: 'Unfiltered, privacy-compliant attribution tracking',
    iconType: 'analytics'
  },
  {
    id: 'meta-ads',
    name: 'Meta Ads Manager',
    pillar: 'measure',
    roleAr: 'إدارة الحملات الموجهة وConversions API',
    roleEn: 'Paid Acquisition & Conversions API',
    descriptionAr: 'إدارة وتوسيع ميزانيات إعلانات فيسبوك وإنستغرام مع ربط Conversions API بدقة متناهية لتجاوز قيود ملفات تعريف الارتباط.',
    descriptionEn: 'Hyper-targeted Meta ad scaling, custom lookalike modeling, pixel governance, and resilient CAPI server-side tracking.',
    systemFunctionAr: 'تغذية خوارزميات المنصة ببيانات التحويل الحقيقية لتحقيق أعلى عائد',
    systemFunctionEn: 'Directing machine learning toward highest-margin purchase signals',
    iconType: 'meta'
  },
  {
    id: 'google-ads',
    name: 'Google Ads & Performance Max',
    pillar: 'measure',
    roleAr: 'استهداف نوايا البحث المباشرة',
    roleEn: 'High-Intent Search & Shopping',
    descriptionAr: 'حملات بحث وجوجل شوبينج وPMax للسيطرة على الكلمات المفتاحية الأكثر ربحية والتقاط العملاء في لحظة اتخاذ قرار الشراء.',
    descriptionEn: 'High-intent Search, Google Shopping, and Performance Max campaigns dominating top transactional keywords.',
    systemFunctionAr: 'اصطياد الطلب القائم في السوق وتحويله إلى مبيعات فورية',
    systemFunctionEn: 'Capturing active commercial intent at the exact point of search',
    iconType: 'google'
  },
  {
    id: 'tiktok-ads',
    name: 'TikTok Ads & Spark',
    pillar: 'measure',
    roleAr: 'الإعلانات التفاعلية السريعة',
    roleEn: 'Short-Form Performance Media',
    descriptionAr: 'إعلانات تيك توك الفيروسية وإدارة Spark Ads للمنتجات الرائجة مع تحقيق وصول واسع وتفاعل فوري مع الفئات الشبابية.',
    descriptionEn: 'Viral TikTok ad creative strategies, Spark Ads optimization, and rapid Gen-Z trend hijacking with measured conversion loops.',
    systemFunctionAr: 'توسيع رقعة الوعي بالبراند واكتساب عملاء جدد بتكلفة منخفضة',
    systemFunctionEn: 'High-frequency creative testing and rapid audience expansion',
    iconType: 'tiktok'
  },

  // ==========================================
  // INFRASTRUCTURE — Cloud and delivery
  // ==========================================
  {
    id: 'cloud-security',
    name: 'Cloudflare & AWS',
    pillar: 'infrastructure',
    roleAr: 'التوزيع السحابي والحماية المحيطية',
    roleEn: 'Global Edge Shield & CDN',
    descriptionAr: 'حماية المتاجر من هجمات DDoS وتوزيع المحتوى عبر شبكات CDN لتوفير سرعة تصفح فائقة مع استقرار بنسبة 99.99%.',
    descriptionEn: 'Global edge caching, DDoS perimeter defense, SSL TLS encryption, and high-availability DNS clusters.',
    systemFunctionAr: 'حماية المنظومة من التوقف وضمان صمود المتجر أثناء ذروة المواسم',
    systemFunctionEn: 'Bulletproof uptime and lightning-fast worldwide delivery',
    iconType: 'cloudflare'
  },
  {
    id: 'node-cloud',
    name: 'Node.js & Express',
    pillar: 'infrastructure',
    roleAr: 'الخدمات البرمجية الخلفية والربط',
    roleEn: 'Backend APIs & Microservices',
    descriptionAr: 'خدمات خلفية برمجية مخصصة (APIs)، تكامل بوابات الدفع، وإدارة البيانات بسرعة قصوى واستقرار كامل.',
    descriptionEn: 'High-throughput microservices, custom webhook dispatchers, secure API gateways, and robust payment protocol relays.',
    systemFunctionAr: 'معالجة العمليات الحساسة وربط قواعد البيانات بكفاءة وأمان',
    systemFunctionEn: 'High-velocity transactional relay powering application logic',
    iconType: 'nodejs'
  }
];

// Backwards compatibility export
export const TECH_CATEGORIES = CAPABILITY_PILLARS.map(p => ({
  id: p.id,
  labelAr: p.titleAr,
  labelEn: p.title
}));
