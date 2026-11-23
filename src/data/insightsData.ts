import { InsightItem } from '../types';

export interface InsightCategoryTab {
  id: string;
  labelAr: string;
  labelEn: string;
}

export const INSIGHT_CATEGORIES: InsightCategoryTab[] = [
  { id: 'all', labelAr: 'جميع التحليلات', labelEn: 'All Trends' },
  { id: 'media-buying', labelAr: 'الإعلانات الممولة وROAS', labelEn: 'Media Buying' },
  { id: 'e-commerce', labelAr: 'التجارة الإلكترونية ومتاجر الويب', labelEn: 'E-Commerce CRO' },
  { id: 'ai-workflows', labelAr: 'الذكاء الاصطناعي والأتمتة', labelEn: 'AI Workflows' },
  { id: 'tracking-capi', labelAr: 'التتبع السيرفري CAPI', labelEn: 'CAPI & Analytics' },
  { id: 'branding-cro', labelAr: 'الهوية البصرية وسيكولوجية الشراء', labelEn: 'Branding & CRO' },
];

export const RAW_INSIGHTS: InsightItem[] = [
  {
    id: 'insight-1',
    slug: 'ai-creative-scaling-ugc',
    titleAr: 'هندسة المحتوى الإعلاني بالذكاء الاصطناعي: إنتاج 50 زاوية إعلانية في 48 ساعة دون استنزاف الميزانية',
    titleEn: 'AI-Augmented Creative Velocity: Engineering 50 Ad Angles in 48 Hours with High-ROAS Precision',
    excerptAr: 'كيف غيرت أدوات التوليد الصوري والنصي المدعومة بنماذج Gemini وMidjourney معادلة الاختبار الإعلاني، لترفع معدلات النقر وتخفض كلفة الاستحواذ بنسبة تتجاوز 40%.',
    excerptEn: 'How generative vision and tactical copy algorithms redefine creative testing, slashing acquisition costs by over 40% while unlocking exponential ad scalability.',
    contentAr: `في سوق إعلانات اليوم، لم تعد الاستهدافات الديموغرافية وحدها كافية للتفوق على المنافسين؛ المحتوى الإبداعي (Creative) هو الاستهداف الجديد. من خلال أسلوبنا في Pulse OCTO، نبني خطوط إنتاج مؤتمتة تجمع بين السيناريوهات الموجهة سيكولوجياً والتوليد البصري الفائق. هذا يتيح للمعلن اختبار عشرات الخطافات البصرية (Hooks) والمقدمات في أول 3 ثوانٍ قبل ضخ الميزانية الكبرى.`,
    contentEn: `In contemporary paid advertising, demographics alone no longer yield sustainable moats—creative is the new targeting algorithm. At Pulse OCTO, we deploy automated neuro-creative pipelines combining psychographic hook architectures with generative visuals, enabling brands to test 50+ iterations rapidly before deploying primary capital.`,
    category: 'ai-workflows',
    categoryAr: 'الذكاء الاصطناعي والأتمتة',
    categoryEn: 'AI Workflows',
    tag: 'GenAI & Creative',
    author: {
      nameAr: 'م. أحمد نبيل',
      nameEn: 'Eng. Ahmed Nabil',
      roleAr: 'كبير مهندسي الذكاء الاصطناعي والإبداع',
      roleEn: 'Lead AI & Creative Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
    publishDate: '2026-03-15',
    readTime: '4 دقائق',
    readTimeEn: '4 min read',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    statsHighlight: {
      value: '4.8x',
      labelAr: 'مضاعفة سرعة إنتاج الزوايا الإعلانية',
      labelEn: 'Creative Production Velocity',
    },
    takeawaysAr: [
      'اختبار 3 ثوانٍ الأولى يحدد 80% من نجاح الحملة الإعلانية.',
      'دمج الذكاء الاصطناعي يقلل تكلفة تصوير المحتوى بنسبة تصل إلى 65%.',
      'التغذية العكسية المباشرة من خوارزميات المنصات تجدد الإعلانات قبل وصولها للإرهاق الإعلاني (Ad Fatigue).'
    ],
    takeawaysEn: [
      'The initial 3-second hook accounts for 80% of campaign ROAS outcomes.',
      'AI-assisted pre-visualization lowers physical production overheads by up to 65%.',
      'Dynamic creative refreshment prevents ad fatigue before audience saturation occurs.'
    ],
    likesCount: 142,
    trendingScore: 99,
    isFeatured: true,
  },
  {
    id: 'insight-2',
    slug: 'meta-tiktok-capi-protocol',
    titleAr: 'بروتوكول تتبع CAPI السيرفري: كيف تحمي إعلاناتك من تسريب 35% من بيانات الشراء؟',
    titleEn: 'Server-Side CAPI Protocol: How to Prevent 35% Conversion Attribution Leakage in 2026',
    excerptAr: 'مع تشديد قيود المتصفحات وسياسات الخصوصية، يفقد البكسل التقليدي ثلث عمليات الشراء. إليك كيف يعيد الربط السيرفري المباشر دقة الخوارزميات.',
    excerptEn: 'As browser-side cookies degrade, legacy client-side pixels lose over a third of transactional telemetry. Discover how server-to-server CAPI restores algorithmic mastery.',
    contentAr: `الاعتماد على بكسل المتصفح العادي (Browser Pixel) في عام 2026 يشبه قيادة سيارة سباق بعين واحدة مغلقة. حواجب الإعلانات وتحديثات الخصوصية تتسبب في إسقاط أحداث الشراء، مما يمنع خوارزمية ميتا وتيك توك من معرفة مشتريك الحقيقيين. الربط السيرفري CAPI عبر Cloudflare أو GCP يرسل بيانات المعاملات مباشرة من سيرفر المتجر إلى سيرفر المنصة بدقة تفوق 98%.`,
    contentEn: `Relying on browser-only client pixels in 2026 blinds platform machine learning engines. Privacy sandboxes drop up to 35% of purchase events. Implementing resilient server-side Conversion API (CAPI) on Edge Cloud delivers encrypted, 100% deduplicated data streams that fuel automated bidding optimizations.`,
    category: 'tracking-capi',
    categoryAr: 'التتبع السيرفري CAPI',
    categoryEn: 'CAPI & Analytics',
    tag: 'CAPI & Infrastructure',
    author: {
      nameAr: 'كريم عثمان',
      nameEn: 'Karim Othman',
      roleAr: 'خبير التتبع وتحليل البيانات السيرفرية',
      roleEn: 'CAPI & Telemetry Specialist',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    },
    publishDate: '2026-03-12',
    readTime: '5 دقائق',
    readTimeEn: '5 min read',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop',
    statsHighlight: {
      value: '+38%',
      labelAr: 'ارتفاع دقة نسب التحويلات للمبيعات',
      labelEn: 'Conversion Match Quality Surge',
    },
    takeawaysAr: [
      'تفعيل التتبع السيرفري يرفع تقييم جودة مطابقة الأحداث (EMQ) إلى أكثر من 8.8/10.',
      'إلغاء تكرار الأحداث (Deduplication) يحمي الحملات من المزايدة المفرطة.',
      'تحديث سرعة إرسال أحداث Offline Purchase يمنح المنصة قوة تحسينية مضاعفة.'
    ],
    takeawaysEn: [
      'Server-side telemetry elevates Event Match Quality (EMQ) scores above 8.8/10.',
      'Precision deduplication prevents artificial bid inflation on ad auctions.',
      'Real-time purchase payloads stabilize algorithmic lookalike and broad audience clusters.'
    ],
    likesCount: 118,
    trendingScore: 94,
  },
  {
    id: 'insight-3',
    slug: 'salla-zid-cro-architecture',
    titleAr: 'معمارية تحسين معدل التحويل (CRO) لمتاجر سلة وزد: كيف ضاعفنا سرعة الدفع ونسبة الشراء؟',
    titleEn: 'E-Commerce CRO Architecture: Streamlining Salla & Zid Checkout for Peak Conversions',
    excerptAr: 'تحليل دقيق لرحلة العميل العربي من الصفحة الرئيسية حتى إتمام الدفع: أين تضيع السلات المتروكة وكيفية تقليل خطوات الشراء لرفع الأرباح الصافية.',
    excerptEn: 'Granular behavioral analysis of Middle Eastern e-commerce checkouts: pinpointing friction points, cart abandonment drop-offs, and 1-click optimization.',
    contentAr: `كل ثانية تأخير في تحميل صفحة المنتج في منطقة الشرق الأوسط تكلف المتجر الإلكتروني خسارة 7% من مبيعاته المحتملة. قمنا بتطوير قوالب مخصصة خفيفة الوزن تدمج الدفع الفوري، وعرض محفزات الثقة (Trust Badges)، وشارات الشحن السريع في أماكن بصرية مدروسة، مما رفع معدل التحويل من 1.2% إلى 3.4% للعديد من شركاء النجاح.`,
    contentEn: `Every 100ms of friction on mobile e-commerce storefronts dampens conversion propensity. By restructuring UX information hierarchy, implementing one-tap sticky checkout triggers, and strategic local payment badges (Mada, Apple Pay, Tabby, Tamara), partner stores achieved an average 62% jump in completed transactions.`,
    category: 'e-commerce',
    categoryAr: 'التجارة الإلكترونية ومتاجر الويب',
    categoryEn: 'E-Commerce CRO',
    tag: 'E-Commerce Architecture',
    author: {
      nameAr: 'طارق الدسوقي',
      nameEn: 'Tarek El-Desouky',
      roleAr: 'مدير نمو المتاجر الإلكترونية وتجربة المستخدم',
      roleEn: 'E-Commerce Growth & CRO Director',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    },
    publishDate: '2026-03-10',
    readTime: '6 دقائق',
    readTimeEn: '6 min read',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
    statsHighlight: {
      value: '+62%',
      labelAr: 'إكمال عمليات الشراء الناجحة',
      labelEn: 'Checkout Completion Surge',
    },
    takeawaysAr: [
      'تفعيل الدفع بضغطة زر واحدة (Apple Pay) يرفع مبيعات الجوال بنسبة 35%.',
      'إظهار تكلفة الشحن وموعد الوصول بوضوح يقضي على 45% من السلات المتروكة.',
      'التصميم المتجاوب المخصص لشاشات الهواتف هو المعيار الأول في قرارات المستهلك.'
    ],
    takeawaysEn: [
      'Instant mobile one-tap checkouts boost mobile transaction volume by 35%.',
      'Transparent upfront delivery timelines extinguish 45% of cart drop-offs.',
      'Mobile-first responsive layout architecture is the prime determinant of conversion velocity.'
    ],
    likesCount: 97,
    trendingScore: 91,
  },
  {
    id: 'insight-4',
    slug: 'tiktok-vs-meta-algo-shift',
    titleAr: 'تحولات خوارزميات تيك توك وميتا لعام 2026: استراتيجيات الـ Broad Targeting والفوز بالمزايدة',
    titleEn: 'Meta & TikTok 2026 Algorithm Shifts: Broad Targeting & Auction Dominance Rules',
    excerptAr: 'لماذا فشلت الاستهدافات الضيقة التقليدية؟ وكيف تستخدم خوارزميات الـ Advantage+ وSmart Performance لتوسيع نطاق حملاتك بربحية عالية.',
    excerptEn: 'Why hyper-segmented audiences are obsolete: mastering broad contextual targeting and winning the bidding auction with superior creative relevance.',
    contentAr: `التحول الجذري في عام 2026 يكمن في إعطاء الذكاء الاصطناعي للمنصات الإعلانية حرية البحث الكاملة بدون استهدافات مقيدة (No-Targeting / Broad). المنصة تقرأ النص، والفيديو، وأول ردود الفعل، ثم تحدد الشريحة الأكثر رغبة في الشراء. الفائز الحقيقي هو من يمتلك زوايا تسويقية متنوعة ومؤشرات تتبع CAPI دقيقة تُعلم المنصة بقيمة كل عملية شراء.`,
    contentEn: `The defining ad trend of 2026 is unconstrained broad targeting. Meta and TikTok machine-learning clusters parse multi-modal creative signals directly to identify high-intent buyer segments. The victor in this auction ecosystem is whoever feeds the bidding engine with richer telemetry and diversified creative hooks.`,
    category: 'media-buying',
    categoryAr: 'الإعلانات الممولة وROAS',
    categoryEn: 'Media Buying',
    tag: 'Media Buying & ROAS',
    author: {
      nameAr: 'م. أحمد نبيل',
      nameEn: 'Eng. Ahmed Nabil',
      roleAr: 'كبير مهندسي الذكاء الاصطناعي والإبداع',
      roleEn: 'Lead AI & Creative Architect',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    },
    publishDate: '2026-03-07',
    readTime: '4 دقائق',
    readTimeEn: '4 min read',
    coverImage: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?q=80&w=1200&auto=format&fit=crop',
    statsHighlight: {
      value: '-28%',
      labelAr: 'انخفاض تكلفة الاستحواذ على المشتري الجديد',
      labelEn: 'CPA Reduction via Broad Targeting',
    },
    takeawaysAr: [
      'الاستهداف الواسع (Broad) يتفوق على الاهتمامات الضيقة بنسبة 3 إلى 1 في الاستقرار.',
      'توزيع الميزانية على مجموعات إعلانية متعددة ذات زوايا مختلفة يمنع التنافس الداخلي.',
      'مراقبة معدل النقر الفريد (Unique CTR) تعطي دلالة فورية على جاذبية العرض الإعلاني.'
    ],
    takeawaysEn: [
      'Broad automated targeting out-scales restricted interest clusters 3-to-1.',
      'Distributing spend across distinct psychographic angles prevents self-auction cannibalization.',
      'Unique Outbound CTR provides immediate diagnosis of hook viability.'
    ],
    likesCount: 89,
    trendingScore: 88,
  },
  {
    id: 'insight-5',
    slug: 'brand-psychology-premium-pricing',
    titleAr: 'سيكولوجية الهوية البصرية الفاخرة: لماذا يدفع العميل 3 أضعاف السعر بنفس المنتج؟',
    titleEn: 'The Neuroscience of Luxury Branding: Commanding 3x Price Multiples in Competitive Markets',
    excerptAr: 'كيف تحول علامتك التجارية من سلعة عادية تقارن بالأسعار إلى رمز للمكانة الاجتماعية عبر نظام هوية بصرية مبرمج سيكولوجياً.',
    excerptEn: 'Transforming commodity products into high-status consumer emblems: unpacking visual cadence, typography hierarchy, and perceived value mechanics.',
    contentAr: `العميل لا يشتري المنتج، بل يشتري النسخة الأفضل من نفسه عند استخدام هذا المنتج. الهوية البصرية المتكاملة—من لوحة الألوان ودرجات التباين إلى خطوط الطباعة والتغليف الفاخر—ترسل إشارات عصبية فورية لدماغ المشتري تفيد بأن هذا العرض ذو قيمة استثنائية لا تخضع للمساومة على السعر. هذا بالضبط ما نفعله عند صياغة الهويات في Pulse OCTO.`,
    contentEn: `Consumers do not simply purchase goods; they acquire elevated representations of identity. Cohesive visual brand architecture—from chromatic precision to micro-interactions and tactile unboxing—delivers subconscious cues of scarcity and premier status that insulate businesses from cut-throat price wars.`,
    category: 'branding-cro',
    categoryAr: 'الهوية البصرية وسيكولوجية الشراء',
    categoryEn: 'Branding & CRO',
    tag: 'Brand Psychology',
    author: {
      nameAr: 'دينا الشريف',
      nameEn: 'Dina El-Sherif',
      roleAr: 'مديرة الهوية البصرية والتصميم الاستراتيجي',
      roleEn: 'Brand Strategy & Identity Director',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
    },
    publishDate: '2026-03-03',
    readTime: '5 دقائق',
    readTimeEn: '5 min read',
    coverImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop',
    statsHighlight: {
      value: '3.2x',
      labelAr: 'مرونة رفع السعر دون فقدان الطلب',
      labelEn: 'Pricing Power Multiplier',
    },
    takeawaysAr: [
      'التناسق البصري عبر جميع القنوات يرفع ثقة العميل بنسبة تفوق 70%.',
      'استخدام الخطوط ذات الطابع المميز يمنح انطباعاً بالفخامة والمصداقية العالية.',
      'تصوير المنتجات بزوايا سينمائية يعزز القيمة المدركة فوراً في عين المستهلك.'
    ],
    takeawaysEn: [
      'Omnichannel aesthetic coherence amplifies client purchase confidence by 70%.',
      'Bespoke typographic pairing establishes institutional authority and distinction.',
      'Cinematic product staging fundamentally elevates instant perceived valuation.'
    ],
    likesCount: 133,
    trendingScore: 92,
  },
  {
    id: 'insight-6',
    slug: 'omnichannel-retention-retargeting',
    titleAr: 'استراتيجية الـ Retention التكراري: مضاعفة القيمة الدائمة للعميل (LTV) عبر واتساب والإيميل',
    titleEn: 'Omnichannel Retention Loops: Scaling Customer LTV via WhatsApp & Automated Precision Email',
    excerptAr: 'تكلفة الاستحواذ على عميل جديد أعلى بـ 7 أضعاف من إعادة تنشيط عميل سابق. كيف تبني مسارات آلية تعيد المشترين أوتوماتيكياً كل 30 يوماً.',
    excerptEn: 'Acquiring a net-new buyer costs up to 7x more than retaining an existing one. Building predictive lifecycle re-engagement triggers to maximize repeat gross revenue.',
    contentAr: `المعادلة الربحية الحقيقية للمتاجر الكبرى لا تعتمد على الشراء لمرة واحدة فقط؛ بل على تحويل أول طلب إلى سلسلة طلبات مستمرة طوال العام. نقوم بربط متاجر سلة وزد وشوبيفاي بمسارات واتساب المؤتمتة ورسائل تذكير إعادة الشراء الذكية عند اقتراب نفاد المنتج، محققين عائداً فورياً بدون أي تكلفة إعلانية إضافية.`,
    contentEn: `Sustainable e-commerce scalability hinges upon lifetime customer valuation rather than one-off transactions. By wiring transactional events into predictive WhatsApp reminders, automated VIP tier alerts, and personalized replenishment loops, brands unlock compounding secondary cashflow at zero incremental ad acquisition cost.`,
    category: 'e-commerce',
    categoryAr: 'التجارة الإلكترونية ومتاجر الويب',
    categoryEn: 'E-Commerce CRO',
    tag: 'Retention & LTV',
    author: {
      nameAr: 'طارق الدسوقي',
      nameEn: 'Tarek El-Desouky',
      roleAr: 'مدير نمو المتاجر الإلكترونية وتجربة المستخدم',
      roleEn: 'E-Commerce Growth & CRO Director',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    },
    publishDate: '2026-02-28',
    readTime: '4 دقائق',
    readTimeEn: '4 min read',
    coverImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1200&auto=format&fit=crop',
    statsHighlight: {
      value: '+84%',
      labelAr: 'ارتفاع نسبة الطلبات المتكررة شهرياً',
      labelEn: 'Repeat Customer Frequency Jump',
    },
    takeawaysAr: [
      'رسائل الواتساب تحقق معدل فتح يتجاوز 92% خلال أول 15 دقيقة.',
      'توقيت رسالة إعادة الطلب بناءً على دورة استهلاك المنتج يضاعف نسبة الاستجابة.',
      'برامج الولاء البسيطة والنقاط الفورية تعزز تمسك العميل بعلامتك التجارية.'
    ],
    takeawaysEn: [
      'WhatsApp interactive transactional messages achieve 92%+ open rates within 15 minutes.',
      'Aligning replenishment reminders with customer consumption cycles doubles reorder velocity.',
      'Frictionless instant reward tiers solidify brand loyalty against competing offerings.'
    ],
    likesCount: 104,
    trendingScore: 86,
  },
];

/**
 * Simulates an asynchronous data fetch with network latency and realistic caching
 */
export async function fetchDigitalInsights(category = 'all', searchQuery = ''): Promise<InsightItem[]> {
  // Artificial network roundtrip for smooth perception
  await new Promise((resolve) => setTimeout(resolve, 600));

  let results = [...RAW_INSIGHTS];

  if (category !== 'all') {
    results = results.filter((item) => item.category === category);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    results = results.filter(
      (item) =>
        item.titleAr.toLowerCase().includes(q) ||
        item.titleEn.toLowerCase().includes(q) ||
        item.excerptAr.toLowerCase().includes(q) ||
        item.excerptEn.toLowerCase().includes(q) ||
        item.tag.toLowerCase().includes(q)
    );
  }

  return results;
}
