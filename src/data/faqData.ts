export interface FAQItem {
  id: string;
  category: 'general' | 'budgets' | 'timeline' | 'support';
  question: {
    ar: string;
    en: string;
  };
  answer: {
    ar: string;
    en: string;
  };
  tags?: string[];
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'general',
    question: {
      ar: 'كيف تختلف وكالة Pulse OCTO ومنظومة الأذرع الثمانية عن الوكالات التقليدية؟',
      en: "How does Pulse OCTO's 8-arm ecosystem differ from traditional digital agencies?"
    },
    answer: {
      ar: 'في Pulse OCTO لا نعتمد على العمل بأقسام منعزلة أو وسطاء؛ بل نوظف منظومة "الأذرع الثمانية" المتزامنة (إعلانات مدفوعة، هويات بصرية، متاجر سريعة، إنتاج سينمائي بالذكاء الاصطناعي، تحسين محركات البحث SEO، إدارة مجتمعات ومحتوى، واستراتيجيات نمو مخصصة). كل ذراع يعمل بتناغم فوري 24/7 تحت سقف استراتيجي واحد، مع تركيز مطلق على العائد المالي (ROAS) وبناء أصول رقمية مستدامة بدلاً من المشاهدات الوهمية.',
      en: 'Pulse OCTO eliminates departmental silos and sluggish middlemen through our synchronized 8-Arm Synergy Engine (Paid Media, Brand Identity, High-Converting Stores, AI Cinematic Production, Technical SEO, Social Engagement, and Custom Growth Blueprints). Every arm works synchronously around the clock under one strategic roof, focusing purely on verified bottom-line ROAS and brand equity rather than vanity metrics.'
    },
    tags: ['أذرع', 'منهجية', 'وكالة', 'مقارنة', 'arms', 'synergy', 'agency']
  },
  {
    id: 'faq-2',
    category: 'budgets',
    question: {
      ar: 'ما هي الميزانية الإعلانية المناسبة للبدء في الحملات الممولة (Meta, Google, TikTok)؟',
      en: 'What advertising budget is recommended to launch high-converting paid campaigns?'
    },
    answer: {
      ar: 'لا نلزم شركاءنا برقم ثابت غير مدروس. نبدأ بدراسة هوية علامتك وحجم السوق المستهدف ومعدل التحويل المتوقع. كقاعدة عامة للنمو الفعال، نوصي بميزانية تجريبية تبدأ من ميزانيات معتدلة لاختبار الجماهير والابتكارات الإعلانية (Creatives Testing)، ثم نقوم بمضاعفة الميزانية (Scaling) تلقائياً فقط على الحملات التي تثبت كفاءتها وتحقق عائداً مستهدفاً (Target ROAS يتجاوز عادة 3x - 5x).',
      en: 'We tailor advertising spend to your sector, market maturity, and target unit economics rather than imposing rigid quotas. We typically recommend an initial test budget focused on audience discovery and creative validation. Once winning angles and unit economics prove profitable (usually scaling past 3x–5x ROAS), we systematically scale ad spend to maximize net return.'
    },
    tags: ['ميزانية', 'إعلانات', 'تمويل', 'تكلفة', 'budget', 'ads', 'cost', 'spend']
  },
  {
    id: 'faq-3',
    category: 'timeline',
    question: {
      ar: 'كم يستغرق وقت إطلاق وتطوير متجر إلكتروني احترافي أو بناء هوية بصرية متكاملة؟',
      en: 'What is the typical turnaround timeline for an e-commerce store or brand identity?'
    },
    answer: {
      ar: 'بفضل منهجية Velocity والأتمتة الحديثة: الهويات البصرية المتكاملة ونماذج البراندينج تتراوح بين 7 إلى 14 يوم عمل شاملة الكتيب الإرشادي ونماذج التطبيقات. أما المتاجر الإلكترونية السريعة (Shopify, Salla, Zid, Custom) فتجهز خلال 10 إلى 21 يوماً كاملة الربط ببوابات الدفع، الشحن، وبكسلات التتبع والتحليل المتقدم. بينما الحملات الإعلانية الممولة تبدأ التحضيرات ودراسة المنافسين وإعداد المواد الإعلانية خلال 48 إلى 72 ساعة.',
      en: 'Through our high-velocity workflow and agile arm coordination: Full Brand Identity & Guidelines take 7 to 14 business days including 3D mockups and typography systems. High-Speed E-commerce Platforms take 10 to 21 business days with integrated payment gateways, logistics APIs, and tracking pixels. Paid ad campaigns launch rapidly within 48 to 72 hours from asset finalization and audience architecture.'
    },
    tags: ['مدة', 'وقت', 'تسليم', 'متجر', 'هوية', 'timeline', 'duration', 'store', 'branding']
  },
  {
    id: 'faq-4',
    category: 'budgets',
    question: {
      ar: 'كيف تضمنون تحقيق مبيعات حقيقية وعائد استثماري (ROAS) وليس مجرد أرقام مشاهدات؟',
      en: 'How do you safeguard genuine sales conversions and profitable ROAS rather than hollow engagement?'
    },
    answer: {
      ar: 'نعتمد استراتيجية Conversion-First: نقوم بربط لوحات تتبع دقيقة (Google Analytics 4, Meta Conversions API CAPI, Heatmaps) لرصد كل خطوة في مسار العميل من أول نقرة حتى إتمام الدفع. كما نختبر عشرات الـ Hooks والزوايا الإعلانية أسبوعياً مع تحسين سرعة صفحات الهبوط وصفحة الدفع لمنع تسرب العملاء ورفع قيمة السلة الشرائية (AOV).',
      en: 'We implement a strict Conversion-First architecture. By configuring server-side tracking (Meta Conversions API, GA4, Heatmaps), we measure user intent at every funnel step. We continuously split-test creative hooks, optimize landing page velocity, and introduce post-purchase upselling to increase Average Order Value (AOV).'
    },
    tags: ['roas', 'مبيعات', 'عائد', 'تحويل', 'أرباح', 'conversions', 'sales', 'roi']
  },
  {
    id: 'faq-5',
    category: 'general',
    question: {
      ar: 'هل يمكنني طلب ذراع واحدة محددة (مثل إدارة الإعلانات فقط) أم يشترط باقة كاملة؟',
      en: 'Can I hire a single specialized arm (e.g., Paid Media or E-commerce) or is a full package required?'
    },
    answer: {
      ar: 'نعم بالتأكيد! صممنا "الأذرع الثمانية" كمنظومة معيارية مرنة (Modular). يمكنك البدء بذراع واحدة محددة (مثل إطلاق وتطوير المتجر أو إدارة الحملات الممولة فقط)، ومع نمو مبيعاتك وتوسع علامتك، يمكنك تفعيل أي من الأذرع الإضافية بسلاسة ودون الحاجة لإعادة هيكلة تعاقدك.',
      en: 'Absolutely. Our 8-arm ecosystem is fully modular. You can engage a single specialized arm (such as Meta/Google ad scaling, conversion store optimization, or SEO) and activate additional arms dynamically as your revenues grow and demand scales.'
    },
    tags: ['باقة', 'خدمة واحدة', 'تخصيص', 'ذراع', 'modular', 'custom', 'package']
  },
  {
    id: 'faq-6',
    category: 'support',
    question: {
      ar: 'كيف يتم متابعة أداء الحملات ومشاركة التقارير الدورية مع مدير الحساب المخصص؟',
      en: 'How do you manage project communication and ongoing campaign reporting?'
    },
    answer: {
      ar: 'نخصص لكل شريك مدير حساب خبير (Dedicated Account Director) متواجد على مدار الساعة عبر مجموعة واتساب مخصصة لمتابعة التحديثات اليومية. بالإضافة إلى ذلك، نوفر لوحة بيانات تفاعلية حية (Live Dashboard) تتيح لك متابعة المبيعات والإنفاق والـ ROAS لحظة بلحظة، مع تقرير تحليلي أسبوعي واجتماع استراتيجي شهري.',
      en: 'Every partner is paired with a dedicated Account Director reachable 24/7 via a private communication channel. You receive access to a real-time live performance dashboard tracking ad spend, revenue, and ROAS in real time, accompanied by weekly analytical recaps and monthly strategy alignment calls.'
    },
    tags: ['تقارير', 'مدير حساب', 'متابعة', 'واتساب', 'reports', 'account manager', 'support']
  },
  {
    id: 'faq-7',
    category: 'general',
    question: {
      ar: 'هل يتضمن عملكم إنتاج وتصوير المحتوى المرئي والإعلاني (UGC والمقاطع السينمائية)؟',
      en: 'Do your services include visual creative production, photography, and high-impact UGC video ads?'
    },
    answer: {
      ar: 'نعم، ذراع "الإنتاج المرئي والذكاء الاصطناعي (AI Studio & Content Engine)" مسؤول عن إنتاج فيديوهات إعلانية قصيرة (Reels / TikTok Ads)، تصوير احترافي للمنتجات، واستخدام أحدث أدوات التوليد البصري بالذكاء الاصطناعي لخلق إعلانات سينمائية باهرة توقف تصفح المستخدم (Scroll-Stopping) وتضاعف معدلات النقر (CTR).',
      en: 'Yes. Our visual production arm crafts high-velocity short-form video ads (TikTok/Reels), high-resolution studio product photoshoots, and cutting-edge generative AI visual assets designed to stop scrolling and maximize Click-Through Rates (CTR).'
    },
    tags: ['تصوير', 'محتوى', 'فيديو', 'ذكاء اصطناعي', 'ugc', 'video', 'production', 'ai']
  },
  {
    id: 'faq-8',
    category: 'general',
    question: {
      ar: 'هل تقتصر خدماتكم على السوق المصري، أم تديرون مشاريع في الخليج والأسواق العالمية؟',
      en: 'Are your services limited to Egypt, or do you manage campaigns in the GCC and global markets?'
    },
    answer: {
      ar: 'على الرغم من أن مقرنا الرئيسي يقع في مدينة بنها بجمهورية مصر العربية، إلا أن أذرعنا تدير وتطلق حملات ومتاجر إلكترونية بنجاح في المملكة العربية السعودية، الإمارات العربية المتحدة، الكويت، قطر، والولايات المتحدة، مع فهم متعمق لسلوك المستهلك، اللهجات الإعلانية، وبوابات الدفع المحلية في كل بلد.',
      en: 'While our headquarters is located in Banha City, Egypt, our arms successfully spearhead e-commerce brands and ad campaigns across Saudi Arabia, UAE, Kuwait, Qatar, and international markets, incorporating localized consumer psychology, native dialects, and regional payment gateways.'
    },
    tags: ['مصر', 'الخليج', 'السعودية', 'الإمارات', 'عالمي', 'egypt', 'gcc', 'saudi', 'uae', 'international']
  },
  {
    id: 'faq-9',
    category: 'budgets',
    question: {
      ar: 'ما هو الفرق بين أتعاب إدارة الحملات والإنفاق الإعلاني المدفوع للمنصات؟',
      en: 'What is the difference between agency management retainers and direct platform ad spend?'
    },
    answer: {
      ar: 'هناك شفافية مالية مطلقة: ميزانية الإنفاق الإعلاني (Media Spend) تدفع مباشرة إلى المنصات الإعلانية (Meta, Google, TikTok, Snapchat) عبر بطاقتك الائتمانية أو حسابك الإعلاني التجاري وتبقى ملكيتك للحسابات كاملة 100%. أما أتعاب وكالة Pulse OCTO فتغطي الاستراتيجية وصناعة وتصميم الإعلانات وإدارة المزايدات والتحسين اليومي والتقارير التحليلية.',
      en: 'Total financial transparency: Media ad spend is billed directly by ad platforms (Meta, Google, TikTok, Snapchat) using your own payment credentials, ensuring 100% account ownership. Pulse OCTO’s retainer covers strategic direction, copywriting, creative production, continuous bidding optimization, and daily monitoring.'
    },
    tags: ['شفافية', 'أتعاب', 'إدارة', 'إنفاق', 'retainer', 'fees', 'transparency']
  },
  {
    id: 'faq-10',
    category: 'timeline',
    question: {
      ar: 'ما هي الخطوات الأولى للتعاقد وبدء التعاون الفعلي مع Pulse OCTO؟',
      en: 'What are the first steps to onboard and begin collaborating with Pulse OCTO?'
    },
    answer: {
      ar: 'العملية تبدأ في ٤ خطوات بسيطة: ١) تضغط على "ابدأ مشروعك" أو تتواصل معنا عبر واتساب. ٢) نحدد جلسة استكشافية سريعة (Audit Call) لدراسة علامتك وأهدافك. ٣) نرسل لك مقترحاً وخطة عمل مخصصة (Action Blueprint) تشمل الأذرع والميزانيات والتوقعات. ٤) فور اعتماد الخطة، يبدأ التنفيذ واستلام الأصول الرقمية فوراً.',
      en: 'Onboarding is streamlined into 4 straightforward stages: 1) Submit your request via our contact form or direct WhatsApp. 2) We conduct a complimentary strategic audit call to review your current funnel. 3) You receive a customized Action Blueprint detailing recommended arms, budgets, and milestones. 4) Upon approval, execution begins immediately.'
    },
    tags: ['خطوات', 'تعاقد', 'بدء', 'استشارة', 'onboarding', 'process', 'steps']
  }
];
