import { ServiceItem, ProjectItem, ArmData, Language } from '../types';

export const SERVICES_DATA: ServiceItem[] = [
 {
 id: 'branding',
 number: '01',
 arabicNumber: '٠١',
 title: 'الهوية وبناء العلامة',
 titleEn: 'BRANDING',
 shortDesc: 'تصميم هويات وأنظمة بصرية متكاملة تعبر عن جوهر علامتك وتمنحها تميزاً راسخاً في السوق.',
 fullDesc: 'نصنع هويات بصرية وأنظمة علامات تجارية متكاملة تعبر عن جوهر مشروعك وتترك انطباعاً دائماً في أذهان عملائك، بدءاً من الشعار وتحديد نبرة الصوت وحتى الأدلة الإرشادية وتطبيقات الهوية الكاملة.',
 iconName: 'Sparkles',
 bgImage: '/1.webp',
 deliverables: ['تصميم الشعار والأنظمة البصرية (Brand System)', 'دليل الهوية البصرية (Brand Guidelines)', 'هندسة التسمية ونبرة الصوت (Naming & Tone)', 'تصميم المطبوعات والأصول الرقمية'],
 metricsHighlight: '+120 براند متوج',
 tag: 'الهوية، التسمية، التمركز',
 innerImages: [
 '/1.webp',
 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop'
 ]
 },
 {
 id: 'marketing',
 number: '02',
 arabicNumber: '٠٢',
 title: 'التسويق الرقمي',
 titleEn: 'MARKETING',
 shortDesc: 'إدارة حملات ممولة ذكية ومحتوى جذاب يضمن وصول علامتك لجمهورك المستهدف وتحقيق أعلى عائد (ROAS).',
 fullDesc: 'ندير حملات تسويقية وإعلانية ممولة عبر كافة المنصات لتحقيق أعلى عائد على الاستثمار الإعلاني (ROAS)، مع توظيف خوارزميات الاستهداف الدقيقة التي تخاطب العميل المناسب في الوقت المثالي.',
 iconName: 'Target',
 bgImage: '/2.webp',
 deliverables: ['إدارة ميزانيات الإعلانات الممولة (Meta, TikTok, Google)', 'حملات الأداء وتحسين تكلفة الاكتساب (Performance)', 'إعادة الاستهداف الذكي (Retargeting)', 'تقارير أداء دورية مع لوحات تحكم حية'],
 metricsHighlight: '5.4x عائد استثمار',
 tag: 'الحملات والإعلانات الممولة',
 innerImages: [
 '/2.webp',
 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop'
 ]
 },
 {
 id: 'web-ecommerce',
 number: '03',
 arabicNumber: '٠٣',
 title: 'المواقع والتجارة الإلكترونية',
 titleEn: 'WEB & E-COMMERCE',
 shortDesc: 'نطور مواقع ومتاجر إلكترونية فائقة السرعة، بتجربة مستخدم سلسة وواجهات عصرية متوافقة مع كافة الأجهزة.',
 fullDesc: 'نطور مواقع ومتاجر إلكترونية فائقة السرعة، بتجربة مستخدم (UX/UI) مخصصة ومتوافقة تماماً مع Shopify والمنصات السحابية والحلول البرمجية الخاصة، لترجمة كل زيارة إلى عملية بيع ناجحة.',
 iconName: 'Layout',
 bgImage: '/3.webp',
 deliverables: ['تصميم واجهات UI/UX مخصصة وعصرية', 'متاجر Shopify ومنصات التجارة المخصصة', 'صفحات هبوط عالية التحويل (Landing Pages)', 'تكامل بوابات الدفع والشحن وأنظمة التتبع'],
 metricsHighlight: '99.9% جاهزية وسرعة',
 tag: 'المواقع وشوبيفاي وUI/UX',
 innerImages: [
 '/3.webp',
 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop'
 ]
 },
 {
 id: 'studio',
 number: '04',
 arabicNumber: '٠٤',
 title: 'الاستوديو والإنتاج الإبداعي',
 titleEn: 'STUDIO',
 shortDesc: 'نجهز لك استوديو احترافي لتصوير المنتجات وصناعة فيديوهات قصيرة (Reels) وإعلانات سينمائية تخطف الأنظار.',
 fullDesc: 'نجهز لك استوديو احترافي لتصوير المنتجات بأعلى جودة سينمائية، وصناعة فيديوهات قصيرة (Reels) وإعلانات تجارية عصرية وديناميكية تخطف الأنظار وتزيد من تفاعل جمهورك على منصات التواصل بأحدث معدات الإضاءة والصوت.',
 iconName: 'Video',
 bgImage: '/4.webp',
 deliverables: ['تصوير فوتوغرافي تجاري وسينمائي للمنتجات', 'إنتاج ريلز وتيك توك ديناميكي مع إيقاع جذاب', 'إعلانات تجارية سينمائية (Commercials)', 'مونتاج ومؤثرات بصرية وموشن جرافيكس'],
 metricsHighlight: '+2.5M مشاهدة عضوية',
 tag: 'تصوير المنتجات والريلز',
 innerImages: [
 '/4.webp',
 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop'
 ]
 },
 {
 id: 'digital-products',
 number: '05',
 arabicNumber: '٠٥',
 title: 'المنتجات والحلول الرقمية',
 titleEn: 'DIGITAL PRODUCTS',
 shortDesc: 'بناء وتطوير تطبيقات ويب ولوحات تحكم مخصصة وأدوات رقمية متقدمة ترتقي بتجربة عملائك وتشغيلك.',
 fullDesc: 'نبني منصات رقمية تفاعلية، تطبيقات ويب مخصصة، لوحات تحكم إدارية، وحلول برمجية متطورة تلبي احتياجات نمو أعمالك وتمنح عملائك تجارب رقمية حصرية واستثنائية.',
 iconName: 'Cpu',
 bgImage: '/5.webp',
 deliverables: ['تطبيقات ويب متقدمة (Web Apps & SaaS)', 'لوحات تحكم وبوابات مخصصة (Dashboards & Portals)', 'أدوات رقمية وتجارب تفاعلية مخصصة', 'بنية سحابية آمنة وعالية الأداء والتوسع'],
 metricsHighlight: 'دقة وكفاءة برمجية',
 tag: 'تطبيقات الويب ولوحات التحكم',
 innerImages: [
 '/5.webp',
 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop'
 ]
 },
 {
 id: 'strategy',
 number: '06',
 arabicNumber: '٠٦',
 title: 'الاستراتيجية',
 titleEn: 'STRATEGY',
 shortDesc: 'صياغة استراتيجيات أعمال وخطط تمركز تنافسية مبنية على تحليل عميق للسوق لكشف الفرص المهدرة.',
 fullDesc: 'نضع خطط عمل تفصيلية مبنية على تحليل دقيق للبيانات. ندرس السوق والمنافسين لنضمن لك خطوات استباقية ومدروسة تكشف الفرص المهدرة وتحدد القنوات الأكثر ربحية وتمركزاً لعلامتك.',
 iconName: 'Compass',
 bgImage: '/6.webp',
 deliverables: ['تحليل متعمق للمنافسين والفجوات السوقية', 'استراتيجية التمركز وبناء الميزة التنافسية', 'خارطة طريق النمو الربع سنوية والسنوية', 'هندسة تسعير المنتجات وحزم العروض'],
 metricsHighlight: 'رؤية استباقية 360°',
 tag: 'دراسة السوق والتمركز',
 innerImages: [
 '/6.webp',
 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop'
 ]
 },
 {
 id: 'content',
 number: '07',
 arabicNumber: '٠٧',
 title: 'صناعة المحتوى',
 titleEn: 'CONTENT',
 shortDesc: 'كتابة محتوى إبداعي ونصوص إعلانية وسيناريوهات مؤثرة تمس اهتمامات الجمهور وتحفزهم على اتخاذ القرار.',
 fullDesc: 'نكتب نصوصاً تسويقية وسيناريوهات فيديو تخاطب وجدان الجمهور بذكاء عاطفي، وتترجم مميزات منتجاتك إلى فوائد ملموسة تحفز الرغبة الشرائية وتعزز الولاء للعلامة التجارية وتمنع السكرول العشوائي.',
 iconName: 'Feather',
 bgImage: '/7.webp',
 deliverables: ['سيناريوهات إعلانات الريلز والتيك توك الإبداعية', 'كتابة نصوص صفحات الهبوط المقنعة (Copywriting)', 'استراتيجية المحتوى والتقويم التحريري', 'صياغة القصص والرسائل الإعلانية المؤثرة'],
 metricsHighlight: '+15K نص وسيناريو',
 tag: 'الكتابة الإعلانية والسيناريوهات',
 innerImages: [
 '/7.webp',
 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=800&auto=format&fit=crop'
 ]
 },
 {
 id: 'growth',
 number: '08',
 arabicNumber: '٠٨',
 title: 'النمو والتحسين',
 titleEn: 'GROWTH',
 shortDesc: 'منظومة تحسين مستمر تجمع تصدر محركات البحث (SEO) وتحسين التحويل (CRO) وتدفقات الأتمتة لنمو متصاعد.',
 fullDesc: 'نقدم حلولاً مستدامة لتوسيع نطاق أعمالك. نركز على تصدر محركات البحث (SEO)، تحسين معدل التحويل (CRO)، واستراتيجيات الاحتفاظ بالعملاء وزيادة القيمة الدائمة (LTV) لضمان تطور علامتك بخطوات واثقة.',
 iconName: 'TrendingUp',
 bgImage: '/8.webp',
 deliverables: ['تهيئة محركات البحث (SEO) وتصدر الكلمات التنافسية', 'تحسين معدل التحويل (CRO) وتجربة الشراء', 'تحليلات سلوك الزوار المتقدمة (Analytics & Heatmaps)', 'استراتيجيات الاحتفاظ بالعملاء وزيادة LTV'],
 metricsHighlight: '+380% متوسط التوسع',
 tag: 'SEO ومعدل التحويل والنمو',
 innerImages: [
 '/8.webp',
 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop'
 ]
 }
];

export const PROJECTS_DATA: ProjectItem[] = [
 {
 id: 'ladies-shop',
 slug: 'ladies-shop',
 title: 'ليديز شوب (Ladies Shop)',
 titleEn: 'Ladies Shop',
 category: 'الهوية البصرية والتجارة الإلكترونية',
 tag: 'العناية والتجميل',
 summary: 'شراكة استراتيجية مستمرة مع براند Ladies Shop للعناية والجمال: صممنا الهوية البصرية الكاملة من الشعار وحتى أدق التفاصيل، وبرمجنا المتجر الإلكتروني الرسمي (www.ladiesshop-store.com)، مع تصوير المنتجات باحترافية وتصميم بوسترات السوشيال ميديا وإدارة الحملات الإعلانية الممولة واستراتيجية الانتشار.',
 heroImage: '/projects/ladies-caver1.webp',
 logo: '/projects/logo L.webp',
 websiteUrl: 'https://www.ladiesshop-store.com',
 brandColors: [
   { hex: '#E91E63', name: 'وردي ليديز', nameEn: 'Signature Rose Pink' },
   { hex: '#D4A397', name: 'روز جولد', nameEn: 'Warm Rose Gold' },
   { hex: '#F8BBD0', name: 'بلش ناعم', nameEn: 'Soft Petal Blush' },
   { hex: '#141218', name: 'أسود مخملي', nameEn: 'Velvet Obsidian' }
 ],
 gallery: [
 '/projects/LW1.webp',
 '/projects/Lw2.webp',
 '/projects/L1.webp',
 '/projects/L2.webp',
 '/projects/L3.webp',
 '/projects/L4.webp'
 ],
 client: 'ليديز شوب (Ladies Shop)',
 clientEn: 'Ladies Shop',
 duration: 'شراكة استراتيجية مستمرة حتى الآن',
 location: 'جمهورية مصر العربية',
 year: '2025 - 2026',
 metricHighlight: {
 value: '+340%',
 label: 'نمو المبيعات الشهرية'
 },
 metricsRow: {
 val1: '+340%',
 lbl1: 'نمو المبيعات',
 val2: 'مستمر',
 lbl2: 'الشراكة',
 val3: 'مصر',
 lbl3: 'الموقع'
 },
 scopeOfWork: [
 'تصميم الهوية البصرية الكاملة من الصفر (بما في ذلك تصميم الشعار وتطبيقاته)',
 'تطوير وبرمجة المتجر الإلكتروني الرسمي (www.ladiesshop-store.com)',
 'تصوير واقعي احترافي للمنتجات وعمل تصميمات إبداعية لها',
 'تصميم بوسترات احترافية لحملات السوشيال ميديا ',
 'إدارة الحملات الإعلانية الممولة على منصات التواصل الاجتماعي',
 'وضع استراتيجية تسويق وانتشار شاملة ومتابعة النمو المستمر'
 ],
 challenge: 'تأسيس حضور رقمي فاخر لبراند العناية والتجميل، وبناء متجر إلكتروني عالي الأداء مع تصوير منتجات جذاب وبوسترات تفاعلية تضاعف المبيعات وتبني ثقة العملاء.',
 solution: 'قدمنا منظومة متكاملة من الشعار وحتى المتجر الإلكتروني والحملات الممولة والتصوير المخصص، محققين نمواً سريعاً في المبيعات وتجربة تسوق راقية وشراكة ممتدة وناجحة.',
 stats: [
 { label: 'نمو المبيعات الشهرية', value: '+340%', sublabel: 'خلال أول ٩٠ يوماً' },
 { label: 'معدل التحويل بالمتجر', value: '4.8%', sublabel: 'تجربة مستخدم سريعة' },
 { label: 'عائد الإنفاق الإعلاني', value: '5.4x', sublabel: 'ROAS عبر منصات التواصل' },
 { label: 'استمرارية الشراكة', value: 'مستمرة', sublabel: 'دعم ونمو متواصل حتى الآن' }
 ],
 deliverables: [
 'الهوية البصرية المتكاملة والشعار المعتمد ',
 'المتجر الإلكتروني الرسمي (www.ladiesshop-store.com)',
 'جلسات تصوير المنتجات وتصميم بوسترات السوشيال ميديا',
 'إدارة الحملات الإعلانية الممولة واستراتيجية الانتشار'
 ],
 quote: {
 text: 'شراكتنا مع Pulse OCTO من تصميم اللوجو للمتجر والحملات صنعت الفارق الحقيقي في انتشار ومبيعات Ladies Shop.',
 author: 'إدارة Ladies Shop',
 role: 'العلامة التجارية'
 },
 techStack: [
 {
 name: 'React & High-Speed E-Commerce Engine',
 category: 'تطوير المتجر والبنية التحتية',
 iconName: 'Code2',
 description: 'بناء متجر إلكتروني عالي الكفاءة يدعم تجربة شراء سريعة بدون تعقيد مع استجابة تامة للهواتف الذكية.',
 descriptionEn: 'High-performance web storefront ensuring instant checkout and seamless mobile-first responsiveness.'
 },
 {
 name: 'Adobe Creative Suite & Figma',
 category: 'تصميم الهوية البصرية والمطبوعات',
 iconName: 'Palette',
 description: 'تصميم الشعار الرسمي، نظام الألوان، الخطوط، وبوسترات السوشيال ميديا وحزم التغليف.',
 descriptionEn: 'Created official brandmark, premium color palette, typography systems, and social banners.'
 },
 {
 name: 'Professional Studio Optics & Macro Gear',
 category: 'تصوير المنتجات وصناعة المحتوى',
 iconName: 'Camera',
 description: 'جلسات تصوير سينمائي واقعي للمنتجات لإظهار نقاء المكونات وملمس العبوات لتعزيز القيمة وثقة المشتري.',
 descriptionEn: 'Commercial studio product photography showcasing pristine skincare textures and luxury package appeal.'
 },
 {
 name: 'Meta Ads Manager & TikTok Marketing',
 category: 'الإعلانات الممولة والاستهداف المتقدم',
 iconName: 'TrendingUp',
 description: 'إطلاق مسارات إعلانية تستهدف جمهور العناية والجمال بدقة مع استراتيجيات إعادة الاستهداف لتحقيق ROAS 5.4x.',
 descriptionEn: 'Full-funnel paid advertising targeting beauty enthusiasts with multi-tiered retargeting generating 5.4x ROAS.'
 },
 {
 name: 'Google Analytics 4 & Conversion Tracking',
 category: 'التحليلات ومعدلات التحويل CRO',
 iconName: 'BarChart3',
 description: 'تتبع دقيق لمسار الزائر وخرائط التفاعل واختبارات A/B لرفع معدل التحويل إلى 4.8%.',
 descriptionEn: 'Conversion rate optimization, heatmaps, and funnel telemetry elevating conversion rate to 4.8%.'
 }
 ],
 strategyDetails: [
 {
 phase: 'المرحلة الأولى',
 phaseEn: 'Phase 01',
 title: 'بناء الهوية البصرية والشعار المعتمد ',
 titleEn: 'Visual Identity & Official Brandmark',
 description: 'دراسة السوق ومنافسي منتجات العناية بالبشرة والجمال، وابتكار هوية تدمج الأناقة الكلاسيكية مع العصرية، واختيار باليت ألوان دافئة تعكس الفخامة والنقاء.',
 bullets: [
 'تصميم الشعار الأيقوني المعتمد واستخلاص الرموز البصرية',
 'تحديد الخطوط والنسق الطباعي الرسمي للبراند',
 'إعداد دليل الإرشادات البصرية (Brand Guidelines) الكامل'
 ]
 },
 {
 phase: 'المرحلة الثانية',
 phaseEn: 'Phase 02',
 title: 'تطوير وبرمجة المتجر الإلكتروني الرسمي',
 titleEn: 'E-Commerce Storefront Development',
 description: 'هندسة وبرمجة متجر متكامل (www.ladiesshop-store.com) يتميز بسهولة التصفح، سرعة الاستجابة، وتجربة مستخدم تركز على إتمام الطلبات بأقل خطوات ممكنة.',
 bullets: [
 'تكامل بوابات الدفع الإلكتروني وخيارات الدفع عند الاستلام',
 'تصنيف ديناميكي للمنتجات (عناية، شعر، عطور، إكسسوارات)',
 'تحسين سرعة التصفح وتجربة الهواتف الذكية بنسبة 100%'
 ]
 },
 {
 phase: 'المرحلة الثالثة',
 phaseEn: 'Phase 03',
 title: 'جلسات تصوير المنتجات وتصميم بوسترات السوشيال ميديا',
 titleEn: 'Product Photography & Social Posters',
 description: 'جلسات تصوير بالاستوديو لجميع تشكيلات المنتجات وتجهيز بوسترات احترافية مجهزة للنشر المباشر والإعلانات الممولة.',
 bullets: [
 'تصوير واقعي عالي الدقة يبرز تفاصيل وجودة المنتجات',
 'تصميم بوسترات ترويجية مبتكرة مع نصوص تسويقية جذابة',
 'إعداد قوالب تصميم موحدة لحسابات التواصل الاجتماعي'
 ]
 },
 {
 phase: 'المرحلة الرابعة',
 phaseEn: 'Phase 04',
 title: 'إدارة الحملات الإعلانية الممولة واستراتيجية الانتشار',
 titleEn: 'Performance Media Buying & Scaling',
 description: 'بناء حملات إعلانية متعددة المستويات على إنستغرام، فيسبوك وتيك توك مع قياس دقيق للعائد على الإنفاق وتوسيع قاعدة العملاء.',
 bullets: [
 'استهداف دقيق للمهتمين بمنتجات العناية والتجميل الفاخرة',
 'إعلانات إعادة الاستهداف لزوار المتجر وسلات الشراء المتروكة',
 'تحقيق زيادة شهرية مستمرة في المبيعات بأكثر من 340%'
 ]
 },
 {
 phase: 'المرحلة الخامسة',
 phaseEn: 'Phase 05',
 title: 'الشراكة الاستراتيجية والنمو المستمر (حتى الآن)',
 titleEn: 'Long-Term Growth & Continuous Scaling',
 description: 'علاقة استراتيجية مستمرة مع فريق Ladies Shop تشمل إدارة العروض الموسمية، تحديثات المتجر، والتحسين المستمر لمعدلات التحويل.',
 bullets: [
 'متابعة دورية وتطوير دائم للمتجر والحملات الرقمية',
 'خطط تسويقية شهرية للمواسم والأعياد',
 'دعم إبداعي وتقني مستمر 24/7'
 ]
 }
 ],
 assetShowcase: [
 {
 url: '/projects/ladies-caver1.webp',
 title: 'غلاف المشروع والهوية البصرية',
 titleEn: 'Project Hero & Brand Identity Cover',
 type: 'cover',
 description: 'التكوين البصري الرئيسي المعتمد الذي يمثل فخامة ورقي براند Ladies Shop.',
 descriptionEn: 'The primary approved key-visual representing Ladies Shop luxury positioning.'
 },
 {
 url: '/projects/logo L.webp',
 title: 'الشعار الرسمي المعتمد ',
 titleEn: 'Official Approved Brandmark ',
 type: 'brand',
 description: 'الشعار المصمم خصيصاً ليعكس الانسيابية والجمال وسهولة التطبيق على المنتجات والواجهات.',
 descriptionEn: 'Custom brandmark designed for timeless beauty, seamless product embossing, and digital clarity.'
 },
 {
 url: '/projects/LW1.webp',
 title: 'واجهة المتجر الإلكتروني - العرض الرئيسي',
 titleEn: 'E-Commerce Storefront - Main Banner & Catalog',
 type: 'storefront',
 description: 'تصميم واجهة المتجر الرئيسية وسرعة التصفح وتجربة استعراض المنتجات المتميزة.',
 descriptionEn: 'Custom online store interface with optimized hero catalog layout and rapid navigation.'
 },
 {
 url: '/projects/Lw2.webp',
 title: 'واجهة المتجر الإلكتروني - تفاصيل الشراء والتصنيفات',
 titleEn: 'E-Commerce Storefront - Categories & Shopping Flow',
 type: 'storefront',
 description: 'صفحة استعراض التشكيلات وسهولة إضافة المنتجات للسلة والدفع السريع.',
 descriptionEn: 'Streamlined category discovery and frictionless add-to-cart purchasing flow.'
 },
 {
 url: '/projects/L1.webp',
 title: 'حملة العناية الفائقة بالبشرة',
 titleEn: 'Luxury Skincare Radiance Campaign',
 type: 'poster',
 platform: 'Instagram',
 postUrl: 'https://www.ladiesshop-store.com',
 description: 'تصميم دعائي يركز على نقاء المكونات وإبراز العناية الفاخرة للعملاء.',
 descriptionEn: 'High-converting advertising creative highlighting key skincare benefits.'
 },
 {
 url: '/projects/L2.webp',
 title: 'تشكيلة الجمال والأنوثة المتكاملة',
 titleEn: 'Signature Beauty & Elegance Collection',
 type: 'poster',
 platform: 'Facebook',
 postUrl: 'https://www.ladiesshop-store.com',
 description: 'تكوين بصري يدمج تناغم الروز جولد مع تصوير واقعي للمنتجات.',
 descriptionEn: 'Artistic campaign banner pairing brand color harmony with vivid photography.'
 },
 {
 url: '/projects/L3.webp',
 title: 'إشراقة يومية — روتين العناية المتكامل',
 titleEn: 'Daily Glow Routine — Essential Care',
 type: 'poster',
 platform: 'Instagram',
 postUrl: 'https://www.ladiesshop-store.com',
 description: 'تصميم إعلاني مخصص لرفع معدل التفاعل والنقر المباشر للمتجر.',
 descriptionEn: 'Engagement-driven poster optimized for click-through rate across social channels.'
 },
 {
 url: '/projects/L4.webp',
 title: 'عروض المواسم والباقات الحصرية',
 titleEn: 'Seasonal Offers & Exclusive Bundles',
 type: 'poster',
 platform: 'Facebook',
 postUrl: 'https://www.ladiesshop-store.com',
 description: 'تصميم ترويجي يدعم باقات التوفير وتوسيع قاعدة المبيعات.',
 descriptionEn: 'Promotional sales creative engineered to maximize conversion volume.'
 }
 ],
 externalPostLinks: [
   {
     id: 'ls-post-1',
     title: 'منشور إطلاق تشكيلة العناية الفاخرة — تفاعل ومبيعات مباشرة',
     titleEn: 'Luxury Skincare Collection Launch Post — Live Feed',
     platform: 'Instagram',
     url: 'https://www.ladiesshop-store.com',
     tag: 'حملة إنستغرام الرسمية',
     tagEn: 'Official Instagram Campaign'
   },
   {
     id: 'ls-post-2',
     title: 'بوست باقات التوفير والعروض الموسمية — أعلى معدل تحويل',
     titleEn: 'Seasonal Beauty Bundles Promotional Post — High ROAS',
     platform: 'Facebook',
     url: 'https://www.ladiesshop-store.com',
     tag: 'إعلان فيسبوك ممول',
     tagEn: 'Sponsored Facebook Post'
   },
   {
     id: 'ls-post-3',
     title: 'كتالوج المنتجات والمتجر الإلكتروني الرسمي — تصفح مباشر',
     titleEn: 'Official Online Storefront & Product Catalog',
     platform: 'Website',
     url: 'https://www.ladiesshop-store.com',
     tag: 'المتجر الرسمي',
     tagEn: 'Live Storefront'
   }
 ]
 },
 {
 id: 'zeyad-optical',
 slug: 'zeyad-optical',
 title: 'نظارات زياد (Zeyad Optical)',
 titleEn: 'Zeyad Optical',
 category: 'الهوية البصرية وتصوير المنتجات والإعلانات',
 tag: 'نظارات وبصريات',
 summary: 'مشروع متكامل لبراند نظارات زياد: قمنا بتصميم الهوية البصرية الكاملة من الصفر، وتنفيذ جلسات تصوير احترافية للنظارات مع الظهور كموديل لعرض الإطارات بواقعية، وتصميم بوسترات السوشيال ميديا وصياغة المحتوى والكابشن التسويقي، مع تدريب العميل عملياً على أسرار تصوير النظارات وإدارة الحملات الإعلانية الممولة.',
 heroImage: '/projects/ZCover.webp',
 logo: '/projects/zeyad-logo.webp',
 brandColors: [
   { hex: '#08193B', name: 'كحلي ملكي', nameEn: 'Royal Navy' },
   { hex: '#D4AF37', name: 'ذهبي معدني', nameEn: 'Metallic Gold' },
   { hex: '#F5E6C8', name: 'شامبين دافئ', nameEn: 'Warm Champagne' },
   { hex: '#040D21', name: 'كحلي عميق', nameEn: 'Deep Midnight Navy' }
 ],
 gallery: [
 '/projects/zeyad-logo.webp',
 '/projects/ZS1.webp',
 '/projects/ZS2.webp',
 '/projects/ZS3.webp',
 '/projects/ZP (1).webp',
 '/projects/ZP (2).webp',
 '/projects/ZP (3).webp',
 '/projects/ZP (4).webp',
 '/projects/ZP (6).webp',
 '/projects/ZP (7).webp',
 '/projects/ZP (8).webp',
 '/projects/ZP (9).webp'
 ],
 client: 'نظارات زياد (Zeyad Optical)',
 duration: 'تنفيذ متكامل وتدريب عملي',
 location: 'جمهورية مصر العربية',
 year: '2025 - 2026',
 metricHighlight: {
 value: '720+',
 label: 'نظارة مباعة خلال الحملة'
 },
 metricsRow: {
 val1: '720+',
 lbl1: 'نظارة مباعة',
 val2: '11 أصل',
 lbl2: 'أصول إبداعية',
 val3: 'مصر',
 lbl3: 'الموقع'
 },
 scopeOfWork: [
 'تصميم الهوية البصرية الكاملة وتطبيقاتها لبراند النظارات',
 'جلسات تصوير احترافية للنظارات الطبية والشمسية ',
 'الظهور كـ موديلينج (Modeling) رسمي لارتداء النظارات وإبراز تناسقها مع الوجه',
 'تصميم سلسلة بوسترات احترافية متكاملة لحملات السوشيال ميديا',
 'صياغة نصوص المحتوى التسويقي والكابشن الإبداعي المقنع لكل منشور',
 'تدريب العميل عملياً على كيفية تصوير النظارات والمنتجات بزوايا احترافية توضح تفاصيلها للمشتري',
 'إدارة وتوجيه الحملات الإعلانية الممولة على منصات السوشيال ميديا'
 ],
 challenge: 'إبراز جودة وخامات النظارات الطبية والشمسية بطريقة واقعية تجذب العميل للشراء أونلاين وزيارة الفروع، مع بناء ثقافة تصوير احترافية مستدامة لدى العميل نفسه.',
 solution: 'قدمنا حلاً شاملاً يجمع بين الهوية البصرية الأنيقة، التصوير الواقعي مع الموديلينج لإظهار ملاءمة النظارة للوجه، وتصميم بوسترات تسويقية مرافقة لكابشن إبداعي، وتدريب العميل شخصياً على احتراف تصوير منتجاته.',
 stats: [
 { label: 'المبيعات خلال الحملة', value: '720+', sublabel: 'نظارة طبية وشمسية' },
 { label: 'الوصول والتفاعل', value: '1.4M', sublabel: 'حملات ممولة وتفاعل عضوي' },
 { label: 'معدل الحجوزات بالفروع', value: '+410%', sublabel: 'خلال فترة إطلاق الحملة' },
 { label: 'رضا العميل والتدريب', value: '100%', sublabel: 'اكتساب مهارات التصوير' }
 ],
 deliverables: [
 'الهوية البصرية الكاملة والدليل الإرشادي المعتمد',
 'جلسات تصوير احترافية مع الموديلينج الحي',
 'سلسلة بوسترات السوشيال ميديا والكابشن التسويقي',
 'دليل وتدريب العميل العملي على تصوير المنتجات',
 'إدارة الحملات الإعلانية الممولة'
 ],
 quote: {
 text: 'التصوير والموديلينج والبوسترات أحدثوا نقلة نوعية في مبيعاتنا، وتدريبهم لي على كيفية تصوير النظارات بنفسي كان له أثر مستمر في كل كولكشن جديد!',
 author: 'إدارة نظارات زياد',
 role: 'Zeyad Optical'
 },
 techStack: [
 {
 name: 'Studio Lighting & Anti-Reflection Optics',
 category: 'تصوير المنتجات وتوزيع الإضاءة',
 iconName: 'Camera',
 description: 'استخدام إضاءات استوديو احترافية مخصصة للأسطح العاكسة والعدسات الزجاجية لإظهار نقاء ولون العدسات بدون لمعان مشتت.',
 descriptionEn: 'Specialized studio lighting and polarization rigs capturing lens tint and frame textures without harsh glares.'
 },
 {
 name: 'Live Eyewear Modeling & Lifestyle Framing',
 category: 'الموديلينج والتصوير الواقعي',
 iconName: 'Palette',
 description: 'الظهور الشخصي كموديل لارتداء النظارات الشمسية والطبية، وتصويرها بزوايا حية تتيح للعميل تخيل مظهر النظارة عليه.',
 descriptionEn: 'Live modeling of optical and sunglasses styles, providing customers with authentic facial fit perspective.'
 },
 {
 name: 'Adobe Photoshop & Illustrator',
 category: 'الهوية البصرية وتصميم البوسترات',
 iconName: 'Code2',
 description: 'بناء الهوية البصرية، وتصميم بوسترات السوشيال ميديا بأسلوب عصري يواكب أحدث صيحات الموضة والأناقة.',
 descriptionEn: 'Engineered full brand identity and social media poster series matching contemporary fashion aesthetics.'
 },
 {
 name: 'Strategic Copywriting & Caption Engineering',
 category: 'كتابة المحتوى والكابشن الإعلاني',
 iconName: 'TrendingUp',
 description: 'صياغة نصوص وكابشن تسويقي يوضح مميزات العدسات وحماية العين والموديلات المناسبة لكل شكل وجه.',
 descriptionEn: 'High-converting ad copy and social captions detailing UV protection, frame ergonomics, and style tips.'
 },
 {
 name: 'Client Photography Mentorship Workshop',
 category: 'التدريب ونقل الخبرة للعميل',
 iconName: 'BarChart3',
 description: 'تدريب عملي لصاحب البراند على زوايا تصوير النظارات، ضبط الإضاءة، وكيفية إبراز ذراع النظارة وتفاصيل الإطار بدقة.',
 descriptionEn: 'Hands-on practical training enabling the client to photograph future optical collections with commercial precision.'
 }
 ],
 strategyDetails: [
 {
 phase: 'المرحلة الأولى',
 phaseEn: 'Phase 01',
 title: 'تطوير الهوية البصرية للبراند (Visual Identity)',
 titleEn: 'Visual Identity & Optical Branding',
 description: 'بناء هوية بصرية عصرية تبرز فخامة النظارات وجودة تصنيعها، واختيار ألوان تعكس الثقة والوضوح البصري.',
 bullets: [
 'تصميم الشعار وتطبيقاته على العلب والجرابات والمطبوعات',
 'تحديد الألوان والخطوط الرسمية المعتمدة للحملات',
 'توحيد نمط الظهور البصري على منصات التواصل'
 ]
 },
 {
 phase: 'المرحلة الثانية',
 phaseEn: 'Phase 02',
 title: 'جلسات التصوير الاحترافي والموديلينج الحي',
 titleEn: 'Commercial Product Shoots & Live Modeling',
 description: 'تصوير المنتجات في استوديو مجهز مع ارتداء النظارات كموديل لتقديم تجربة بصرية واقعية للعملاء قبل الشراء.',
 bullets: [
 'تصوير ثابت عالي الدقة يبرز مفاصل وخامات الإطارات',
 'جلسات موديلينج حية توضح تناسق النظارة مع ملامح الوجه',
 'معالجة الصور الرقمية وتنقية العدسات من الانعكاسات'
 ]
 },
 {
 phase: 'المرحلة الثالثة',
 phaseEn: 'Phase 03',
 title: 'تصميم بوسترات السوشيال ميديا وكتابة الكابشن',
 titleEn: 'Social Media Posters & Strategic Copywriting',
 description: 'تصميم حزمة بوسترات إعلانية متكاملة متوافقة مع إنستغرام وفيسبوك، مصحوبة بنصوص تسويقية وكابشن مقنع.',
 bullets: [
 'تصميم سلسلة بوسترات إعلانية بتكوينات بصرية جاذبة للانتباه',
 'كتابة كابشن تسويقي يركز على العروض وحماية العين والأناقة',
 'تجهيز قوالب للنشر الدوري للإعلانات والحملات'
 ]
 },
 {
 phase: 'المرحلة الرابعة',
 phaseEn: 'Phase 04',
 title: 'تدريب العميل عملياً على التصوير الاحترافي',
 titleEn: 'Client Product Photography Coaching',
 description: 'جلسات تدريب عملية مكثفة لصاحب البراند لتعليمه كيفية التقاط صور احترافية لمنتجاته بنفسه باستخدام معدات متاحة.',
 bullets: [
 'شرح زوايا التصوير المثالية للنظارات الطبية والشمسية',
 'كيفية التحكم في الإضاءة لمنع اللمعان غير المرغوب على الزجاج',
 'خطوات إبراز تفاصيل الذراع وخامة الإطار لإقناع المشتري'
 ]
 },
 {
 phase: 'المرحلة الخامسة',
 phaseEn: 'Phase 05',
 title: 'إطلاق الإعلانات الممولة ومضاعفة المبيعات',
 titleEn: 'Performance Ads & Blitz Sales Launch',
 description: 'إدارة وتوجيه الحملات الإعلانية الممولة باستهداف جغرافي وديموغرافي دقيق لتحقيق مبيعات قياسية في الفروع وأونلاين.',
 bullets: [
 'استهداف المهتمين بالموضة والراحة البصرية وفحص النظر',
 'حملة عروض خاطفة حققت أكثر من 720 نظارة مباعة',
 'متابعة تفاعل الزبائن وزيادة التردد على الفروع بنسبة +410%'
 ]
 }
 ],
 assetShowcase: [
 {
 url: '/projects/zeyad-logo.webp',
 title: 'الشعار الرسمي المعتمد لنظارات زياد',
 titleEn: 'Official Zeyad Optical Brandmark',
 type: 'brand',
 description: 'الشعار الرسمي الذهبي المعتمد لبراند نظارات زياد (Zeyad Optical Shop) بتصميم يدمج اسم العلامة داخل إطار النظارة الفاخر.',
 descriptionEn: 'Official gold-on-navy emblem for Zeyad Optical Shop seamlessly integrating the brand name within a signature eyewear frame.'
 },
 {
 url: '/projects/ZCover.webp',
 title: 'غلاف المشروع والحملة الرسمية ',
 titleEn: 'Official Campaign Cover & Visual Showcase',
 type: 'cover',
 description: 'الغلاف السينمائي الرئيسي المعتمد لحملة نظارات زياد والمستعرض للتشكيلة والهوية.',
 descriptionEn: 'The primary cinematic key visual cover representing the Zeyad Optical eyewear campaign.'
 },
 {
 url: '/projects/ZS1.webp',
 title: 'جلسة تصوير منتجات النظارات - الإطار الكلاسيكي',
 titleEn: 'Eyewear Studio Product Photography',
 type: 'storefront',
 description: 'لقطة تصوير احترافية بالاستوديو تبرز لمعان الإطار وتفاصيل العدسات بدقة فائقة.',
 descriptionEn: 'High-detail commercial studio shot highlighting frame reflections and lens purity.'
 },
 {
 url: '/projects/ZS2.webp',
 title: 'جلسة تصوير منتجات النظارات - التفاصيل الجانبية',
 titleEn: 'Eyewear Studio Product Photography',
 type: 'storefront',
 description: 'تصوير بزاوية مدروسة للنظارة توضح تصميم الذراع ودقة الصناعة بدون انعكاسات.',
 descriptionEn: 'Precision angled photography displaying temple curvature and frame craftsmanship.'
 },
 {
 url: '/projects/ZS3.webp',
 title: 'جلسة تصوير منتجات النظارات - المنظور الديناميكي',
 titleEn: 'Eyewear Studio Product Photography',
 type: 'storefront',
 description: 'تصوير سينمائي يركز على جاذبية اللون وخفة وزن النظارة والراحة أثناء الارتداء.',
 descriptionEn: 'Cinematic studio framing emphasizing color vibrance, lightweight frame, and ergonomic comfort.'
 },
 {
 url: '/projects/ZP (1).webp',
 title: 'تشكيلة النظارات الشمسية الفاخرة',
 titleEn: 'Signature Sunglasses Collection',
 type: 'poster',
 platform: 'Facebook',
 description: 'تصميم دعائي يركز على أناقة النظارة الشمسية وجاذبية الإطار.',
 descriptionEn: 'High-impact promotional poster spotlighting designer sunglasses appeal.'
 },
 {
 url: '/projects/ZP (2).webp',
 title: 'الإطارات الطبية العصرية خفيفة الوزن',
 titleEn: 'Lightweight Modern Prescription Frames',
 type: 'poster',
 platform: 'Instagram',
 description: 'تصميم متناسق مع ألوان الكحلي الملكي والذهبي يبرز دقة الإطارات الطبية.',
 descriptionEn: 'Contemporary social graphic harmonizing brand aesthetic with optical frame styles.'
 },
 {
 url: '/projects/ZP (3).webp',
 title: 'حماية فائقة للعين وعدسات نقية',
 titleEn: 'UV400 Protection & Crystal Lens Clarity',
 type: 'poster',
 platform: 'Facebook',
 description: 'بوستر يدمج التصوير الاحترافي مع الكابشن التسويقي الموجه.',
 descriptionEn: 'Marketing poster combining professional photography with persuasive conversion copy.'
 },
 {
 url: '/projects/ZP (4).webp',
 title: 'إطلالة كلاسيكية تناسب ملامح الوجه',
 titleEn: 'Timeless Frame Fit & Lifestyle',
 type: 'poster',
 platform: 'Instagram',
 description: 'تصميم يعرض تفاصيل النظارات من زاوية ديناميكية مع الموديلينج الحي.',
 descriptionEn: 'Dynamic social visual framed to emphasize frame curves and customer lifestyle.'
 },
 {
 url: '/projects/ZP (6).webp',
 title: 'حملة العروض الحصرية على الكولكشن الجديد',
 titleEn: 'New Arrival Blitz Campaign',
 type: 'poster',
 platform: 'Facebook',
 description: 'بوستر إعلاني مخصص لحملات السوشيال ميديا لرفع معدلات الحجز والزيارات.',
 descriptionEn: 'Engagement-driven poster tailored for social feed conversion and retail inquiries.'
 },
 {
 url: '/projects/ZP (7).webp',
 title: 'أناقة يومية للعمل والدراسة',
 titleEn: 'Everyday Executive Optical Elegance',
 type: 'poster',
 platform: 'Instagram',
 description: 'تكوين هادئ يبرز الأناقة اليومية للنظارات الطبية بجودة ووضوح عالٍ.',
 descriptionEn: 'Refined creative composition highlighting daily elegance of prescription eyewear.'
 },
 {
 url: '/projects/ZP (8).webp',
 title: 'تألق بإطلالة استثنائية — نظارات زياد',
 titleEn: 'Stand Out in Style — Zeyad Optical',
 type: 'poster',
 platform: 'Facebook',
 description: 'بوستر ترويجي موجه لزيادة مبيعات الفروع والطلبات أونلاين.',
 descriptionEn: 'Sales activation poster designed to accelerate new collection bookings.'
 },
 {
 url: '/projects/ZP (9).webp',
 title: 'التميز البصري والفخامة في كل تفصيلة',
 titleEn: 'Craftsmanship in Every Optical Detail',
 type: 'poster',
 platform: 'Instagram',
 description: 'تصميم ختامي للحملة يلخص فخامة تشكيلات نظارات زياد.',
 descriptionEn: 'Culminating promotional showcase summarizing Zeyad Optical premier collection.'
 }
 ],
 externalPostLinks: [
   {
     id: 'zo-post-1',
     title: 'منشور حملة الكولكشن الجديد والموديلينج الحي — نظارات زياد',
     titleEn: 'New Collection & Live Modeling Campaign Post — Zeyad Optical',
     platform: 'Facebook',
     url: 'https://www.facebook.com',
     tag: 'حملة 720+ نظارة مباعة',
     tagEn: '720+ Frames Sold Campaign'
   },
   {
     id: 'zo-post-2',
     title: 'سلسلة بوستات استوديو تصوير النظارات الطبية والشمسية',
     titleEn: 'Studio Optical & Sunglasses Showcase Carousel',
     platform: 'Instagram',
     url: 'https://www.instagram.com',
     tag: 'تفاعل 1.4M وصول',
     tagEn: '1.4M Reach Showcase'
   }
 ]
 },
 {
 id: 'namaa-academy',
 slug: 'namaa-academy',
 title: 'أكاديمية النماء للتربية الخاصة',
 titleEn: 'Al-Namaa Academy for Special Education',
 category: 'الهوية البصرية والاستراتيجية الرقمية',
 categoryEn: 'Visual Identity & Special Education Strategy',
 tag: 'تأهيل الأطفال ورعاية وحضانة متخصصة',
 tagEn: 'Child Rehabilitation & Specialized Daycare',
 summary: 'شراكة استراتيجية وهوية بصرية متكاملة لأكاديمية النماء للتربية الخاصة؛ المؤسسة المتخصصة في تأهيل وتعليم الأطفال ذوي الاحتياجات الخاصة لدمجهم كالأطفال الطبيعيين في التعامل والتعليم وتوجيه أولياء الأمور لكيفية التعامل مع أبنائهم بالشكل السليم، مع تشغيل حضانة صباحية متخصصة وكورسات تفاعلية. تم إنجاز الشعار الجديد والهوية البصرية والبانر والبوستر، ويجري العمل على دراسة استراتيجية العمل وتحليل المنافسين بالمناطق المحيطة، وتصميم صفحة هبوط تليها منصة وموقع إلكتروني متكامل.',
 summaryEn: 'Strategic branding, positioning, and digital roadmap for Al-Namaa Academy for Special Education—a specialized institution dedicated to educating and rehabilitating children with special needs toward natural integration, guiding parents on effective nurturing, and operating a specialized morning nursery alongside interactive skill-building courses. The engagement delivered a brand-new logo, visual identity system, official banner, and promotional poster, with ongoing execution on operational strategy, competitor intelligence in surrounding regions, and high-conversion landing page followed by a comprehensive educational web platform.',
 heroImage: '/projects/n-paner.webp',
 logo: '/projects/n-logo.webp',
 brandColors: [
   { hex: '#0F4C3A', name: 'أخضر زمردي', nameEn: 'Deep Emerald' },
   { hex: '#D49B35', name: 'ذهبي دافئ', nameEn: 'Warm Gold' },
   { hex: '#2E7D5B', name: 'أخضر النماء', nameEn: 'Growth Sage' },
   { hex: '#F4F1EA', name: 'كريمي هادئ', nameEn: 'Soft Ivory' }
 ],
 gallery: [
 '/projects/n-paner.webp',
 '/projects/n-poster.webp',
 '/projects/n-logo.webp'
 ],
 client: 'أكاديمية النماء (Al-Namaa Academy)',
 clientEn: 'Al-Namaa Academy',
 duration: 'شراكة تطوير استراتيجية مستمرة',
 durationEn: 'Ongoing Strategic Partnership',
 location: 'جمهورية مصر العربية',
 locationEn: 'Egypt',
 year: '2026',
 metricHighlight: {
 value: '100%',
 label: 'هوية بصرية واستراتيجية تأهيل متكاملة',
 labelEn: 'Complete Identity & Child Rehabilitation System'
 },
 metricsRow: {
 val1: '100%',
 lbl1: 'هوية وشعار جديد',
 lbl1En: 'Brand Identity',
 val2: 'حضانة وكورسات',
 lbl2: 'البرامج التفاعلية',
 lbl2En: 'Nursery & Courses',
 val3: 'دراسة منافسين',
 lbl3: 'الاستراتيجية',
 lbl3En: 'Market Strategy'
 },
 scopeOfWork: [
 'تصميم لوجو جديد وهوية بصرية كاملة للأكاديمية تعبر عن الاحتواء والنمو والتعليم الإيجابي',
 'تصميم البانر والبوستر الإعلاني والترويجي الرسمي ',
 'دراسة استراتيجية العمل وتحليل المنافسين ومراكز التأهيل بالمناطق المحيطة',
 'هيكلة برامج الحضانة الصباحية المتخصصة لرعاية وتأهيل الأطفال ذوي الاحتياجات الخاصة',
 'إعداد وتطوير الكورسات التفاعلية لتنمية المهارات، النطق والتخاطب، وتعديل السلوك',
 'تصميم وتنفيذ لاندينج بيدج تفاعلية يعقبها موقع إلكتروني متكامل للكورسات وإرشاد الآباء'
 ],
 scopeOfWorkEn: [
 'Brand-new logo design and comprehensive visual identity reflecting warmth and development',
 'Official promotional banner and campaign poster design ',
 'Operational business strategy and competitor intelligence across surrounding areas',
 'Structuring specialized morning daycare / nursery programs for special needs children',
 'Developing interactive curricula for speech therapy, behavioral modification, and cognitive skills',
 'Designing and launching high-converting landing page followed by a comprehensive web platform for courses and parental guidance'
 ],
 challenge: 'بناء هوية بصرية موثوقة ومحببة لمؤسسة تربية خاصة وحضانة تأهيلية تخاطب مشاعر أولياء الأمور بطمأنينة علمية وإنسانية راقية، مع دراسة السوق المحلي وتحليل المنافسين بالمناطق المحيطة لتحديد المزايا التنافسية للأكاديمية، والتمهيد لمنصة إلكترونية تخدم أولياء الأمور وتقدم كورسات تأهيلية تفاعلية.',
 challengeEn: 'Building an authoritative yet comforting brand identity for a special education academy and daycare; reassuring concerned parents with scientific and compassionate messaging, analyzing local competitors to carve out distinct value advantages, and constructing an accessible digital pathway for admissions and interactive training.',
 solution: 'ابتكرنا هوية بصرية دافئة ومبهجة بشعار جديد يرمز للاحتواء والتطور الطبيعي للطفل، مع تصاميم بانر وبوستر فائقة الجودة. وتتواصل الشراكة بدراسة استراتيجية دقيقة للمنافسين المحيطين، وتطوير برامج الحضانة الصباحية التفاعلية، بالتوازي مع تصميم وبرمجة لاندينج بيدج وموقع متكامل لبوابة الكورسات ودليل إرشاد أولياء الأمور.',
 solutionEn: 'Engineered a warm, inspiring visual identity and logo radiating growth and security, accompanied by high-impact banners and posters. The partnership actively progresses with comprehensive competitor research in neighboring zones, structured nursery and course offerings, and the deployment of a strategic landing page transitioning into a full parental guidance and interactive course web portal.',
 stats: [
 { label: 'اكتمال الهوية البصرية', labelEn: 'Visual Identity Completion', value: '100%', sublabel: 'شعار جديد، بانر، وبوستر ترويجي', sublabelEn: 'New logo, banner, and campaign poster' },
 { label: 'البرامج التأهيلية للطفل', labelEn: 'Interactive Rehabilitation Tracks', value: 'تأهيل ودمج', sublabel: 'حضانة صباحية متخصصة وكورسات تفاعلية', sublabelEn: 'Morning daycare and specialized courses' },
 { label: 'إرشاد وتوجيه أولياء الأمور', labelEn: 'Parental Guidance System', value: 'دعم شامل', sublabel: 'أدلة إرشادية وتثقيفية للتعامل المنزلي', sublabelEn: 'Continuous counseling & handling guidance' },
 { label: 'المرحلة الرقمية الحالية', labelEn: 'Active Digital Phase', value: 'لاندينج بيدج', sublabel: 'جارٍ التنفيذ تمهيداً للموقع الكامل والكورسات', sublabelEn: 'Landing page in progress, full portal to follow' }
 ],
 deliverables: [
 'الشعار الرسمي المعتمد الجديد مع نظام الهوية البصرية',
 'البانر الإعلاني والترويجي الرسمي للأكاديمية ',
 'البوستر التسويقي للبرامج التأهيلية والحضانة ',
 'دراسة استراتيجية العمل وتحليل المنافسين بالمناطق المحيطة (جارٍ العمل)',
 'تصميم وبرمجة صفحة الهبوط Landing Page للتحويل والحجز (جارٍ التنفيذ)',
 'موقع إلكتروني متكامل للكورسات التفاعلية وبوابة إرشاد الآباء (المرحلة القادمة)'
 ],
 deliverablesEn: [
 'Official new logo emblem & complete brand identity guidelines',
 'High-resolution flagship academy banner ',
 'Promotional programs and nursery poster ',
 'Business operational strategy and regional competitor analysis (In-progress)',
 'Interactive Landing page design and development (In-progress)',
 'Full-featured web portal with interactive courses & parental guidance library (Upcoming)'
 ],
 techStack: [
 {
 name: 'Modern Visual Identity & Vector Systems',
 category: 'Branding & Graphic Systems',
 iconName: 'Palette',
 description: 'نظام تصميم وهوية بصرية مصممة خصيصاً لمجال التربية الخاصة بألوان نفسية مريحة تعزز الثقة والأمان لدى الطفل والأسرة.',
 descriptionEn: 'Tailored visual identity designed specifically for special education, utilizing comforting psychology-backed palettes.'
 },
 {
 name: 'Competitor Intelligence & Market Mapping',
 category: 'Strategic Research',
 iconName: 'BarChart3',
 description: 'دراسة ميدانية لتحليل منافسي التربية الخاصة والحضانات بالمناطق المجاورة وتحديد فجوات الخدمة والأسعار.',
 descriptionEn: 'Field research analyzing special education competitors in neighboring areas to identify service and pricing opportunities.'
 },
 {
 name: 'Interactive Child Curricula & Daycare',
 category: 'Curriculum & Program Design',
 iconName: 'Compass',
 description: 'هيكلة البرامج التأهيلية للدمج الطبيعي مع الأطفال وتصميم جلسات التخاطب وتعديل السلوك التفاعلية.',
 descriptionEn: 'Structuring natural integration curricula, speech therapy workflows, and interactive behavioral modification tracks.'
 },
 {
 name: 'High-Conversion Landing Page & Web Portal',
 category: 'Digital Platforms & UX',
 iconName: 'Zap',
 description: 'بناء صفحة هبوط تفاعلية سريعة للتسجيل والاستفسارات، تمهيداً لإطلاق المنصة الرقمية الكاملة للكورسات وإرشاد الآباء.',
 descriptionEn: 'Developing a responsive lead-generation landing page leading to an all-in-one educational portal for courses and parental advice.'
 }
 ],
 strategyDetails: [
 {
 phase: 'المرحلة الأولى // مكتملة بنجاح',
 phaseEn: 'PHASE 01 // COMPLETED',
 title: 'بناء الشعار الجديد والهوية البصرية الرسمية',
 titleEn: 'New Logo Design & Official Visual Identity',
 description: 'إعادة صياغة الهوية بالكامل وتصميم الشعار الرسمي الجديد الذي يرمز للنمو والاحتواء والتعليم، مع تصميم البانر والبوستر الميداني والرقمي.',
 descriptionEn: 'Complete redesign of brand identity with an inspiring emblem symbolizing growth, care, and learning, complemented by official banners and posters.',
 bullets: [
 'تصميم الشعار الجديد للأكاديمية بدقة عالية ',
 'تصميم البانر الرسمي المعبر عن رسالة الأكاديمية ',
 'تصميم البوستر الترويجي للخدمات والحضانة '
 ],
 bulletsEn: [
 'Official high-resolution new logo design ',
 'Official flagship academy banner reflecting noble mission ',
 'Promotional poster for specialized services and daycare '
 ]
 },
 {
 phase: 'المرحلة الثانية // جاري العمل',
 phaseEn: 'PHASE 02 // IN-PROGRESS',
 title: 'دراسة استراتيجية العمل وتحليل المنافسين في المناطق المحيطة',
 titleEn: 'Operational Strategy & Regional Competitor Analysis',
 description: 'إجراء مسح تحليلي شامل للمراكز المتخصصة والحضانات المجاورة، وتحديد نقاط التميز والأسعار ونقاط الضعف لدى المنافسين لضمان الريادة المؤسسية.',
 descriptionEn: 'Conducting comprehensive competitor mapping across surrounding zones, defining unique differentiators, pricing models, and service gaps.',
 bullets: [
 'تحليل عروض وأسعار مراكز التربية الخاصة والحضانات المحيطة',
 'تحديد نقاط التميز التنافسية لأكاديمية النماء ورسالتها الإنسانية',
 'صياغة خطة تسعير وباقات مرنة وميسرة لأولياء الأمور'
 ],
 bulletsEn: [
 'Analyzing offerings and price points of surrounding special education centers',
 'Defining Al-Namaa Academy unique competitive edge and humanitarian mission',
 'Structuring flexible, accessible pricing packages for families'
 ]
 },
 {
 phase: 'المرحلة الثالثة // هيكلة البرامج',
 phaseEn: 'PHASE 03 // PROGRAM DESIGN',
 title: 'هيكلة برامج الحضانة الصباحية والكورسات وتوجيه الآباء',
 titleEn: 'Morning Nursery, Interactive Courses & Parental Guidance',
 description: 'تنظيم مسارات التأهيل لمساعدة الأطفال على الاندماج الطبيعي في المجتمع والتعليم، وتوجيه أولياء الأمور لكيفية التعامل مع أبنائهم.',
 descriptionEn: 'Organizing rehabilitation paths to help children naturally integrate into schooling and society, backed by intensive parental guidance.',
 bullets: [
 'تشغيل الحضانة الصباحية المتخصصة لتنمية المهارات اليومية والسلوكية',
 'تقديم كورسات تفاعلية في النطق والتخاطب وتنمية المهارات العقلية والاجتماعية',
 'تخصيص جلسات وكتيبات إرشادية للآباء لتعزيز سبل التعامل مع الطفل في المنزل'
 ],
 bulletsEn: [
 'Operating specialized morning daycare for daily and behavioral development',
 'Providing interactive speech, cognitive, and social communication courses',
 'Dedicated parent counseling sessions and home handling guides'
 ]
 },
 {
 phase: 'المرحلة الرابعة // جاري التنفيذ',
 phaseEn: 'PHASE 04 // IN-PROGRESS',
 title: 'تصميم وتنفيذ صفحة الهبوط التفاعلية (Landing Page)',
 titleEn: 'Landing Page Design & Implementation',
 description: 'بناء صفحة هبوط ذات تحويل عالي توضح مميزات الأكاديمية وبرامج الحضانة والكورسات وتمكن أولياء الأمور من الاستفسار وحجز التقييم المبدئي.',
 descriptionEn: 'Developing a high-conversion landing page detailing programs, nursery admissions, and interactive courses with direct booking forms.',
 bullets: [
 'واجهة عصرية سريعة ومتوافقة مع الهواتف الذكية بنسبة 100%',
 'نموذج حجز فوري وتواصل مباشر مع أخصائيي الأكاديمية عبر واتساب وهاتف',
 'عرض الأثر الإيجابي وقصص نجاح تأهيل الأطفال'
 ],
 bulletsEn: [
 'Modern, fast interface 100% optimized for mobile screens',
 'Direct consultation booking and WhatsApp integration with specialists',
 'Highlighting positive transformation stories and rehabilitation impact'
 ]
 },
 {
 phase: 'المرحلة الخامسة // قادمة',
 phaseEn: 'PHASE 05 // UPCOMING',
 title: 'إطلاق الموقع والمنصة الإلكترونية الكاملة (Web Portal)',
 titleEn: 'Full Web Platform, Online Courses & Parent Knowledge Hub',
 description: 'تطوير منصة رقمية متكاملة تضم كورسات تفاعلية للأطفال، وبنك معلومات ومقالات استشارية للأمهات والآباء لمتابعة التطور اليومي.',
 descriptionEn: 'Developing a comprehensive digital portal featuring interactive courses for children and a knowledge bank for parents.',
 bullets: [
 'بوابة إلكترونية للكورسات التعليمية والتأهيلية عن بعد وحضورياً',
 'مكتبة رقمية مجانية تشتمل على مقالات وإرشادات التعامل مع مختلف الحالات',
 'لوحة متابعة لتقدم مهارات الطفل وتواصل دوري مع الأخصائيين'
 ],
 bulletsEn: [
 'Online portal for interactive rehabilitation courses (hybrid & on-site)',
 'Free digital library containing case-handling guides and parent advice',
 'Child skill development tracker and continuous specialist communication'
 ]
 }
 ],
 assetShowcase: [
 {
 url: '/projects/n-paner.webp',
 title: 'البانر الرسمي لأكاديمية النماء للتربية الخاصة',
 titleEn: 'Official Al-Namaa Academy Special Education Banner',
 type: 'cover',
 description: 'البانر الإعلاني والترويجي الرسمي الذي يبرز هوية الأكاديمية والرسالة الإنسانية في تأهيل ودمج الأطفال.',
 descriptionEn: 'The flagship promotional banner presenting the academy brand identity, values, and inclusion mission.'
 },
 {
 url: '/projects/n-poster.webp',
 title: 'البوستر الترويجي لخدمات التأهيل والحضانة المتخصصة',
 titleEn: 'Specialized Nursery & Rehabilitation Programs Poster',
 type: 'poster',
 description: 'بوستر تسويقي يعلن عن خدمات الحضانة الصباحية والكورسات التفاعلية وإرشاد أولياء الأمور للتعامل الأمثل.',
 descriptionEn: 'Promotional poster communicating specialized morning daycare, interactive courses, and parental guidance.'
 },
 {
 url: '/projects/n-logo.webp',
 title: 'الشعار الرسمي المعتمد لأكاديمية النماء',
 titleEn: 'Official Al-Namaa Academy Logo & Crest',
 type: 'brand',
 description: 'تصميم الشعار الجديد الذي يرمز للنماء، الاحتواء، والنمو الإيجابي للطفل في بيئة تعليمية داعمة ومريحة.',
 descriptionEn: 'New official emblem symbolizing nurturing, growth, and positive child development in a caring environment.'
 }
 ],
 externalPostLinks: [
   {
     id: 'na-post-1',
     title: 'منشور الإعلان عن الحضانة الصباحية وبرامج التأهيل والتخاطب',
     titleEn: 'Morning Specialized Daycare & Speech Therapy Announcement Post',
     platform: 'Facebook',
     url: 'https://www.facebook.com',
     tag: 'بوست انطلاق الأكاديمية',
     tagEn: 'Official Launch Post'
   }
 ],
 quote: {
 text: 'عملنا مع Pulse OCTO وضع حجر الأساس الحقيقي لانطلاقة أكاديمية النماء؛ من اللوجو المبهج والهوية البصرية حتى البانر والبوستر، ودراسة السوق والمنصات الرقمية التي تمنح أولياء الأمور أقصى درجات الثقة والأمان لأبنائهم.',
 author: 'إدارة أكاديمية النماء للتربية الخاصة',
 role: 'إدارة الأكاديمية والحضانة التأهيلية'
 }
 },
 {
 id: 'halan-delivery',
 slug: 'halan-delivery',
 title: 'حالا دليفري (Halan Delivery)',
 titleEn: 'Halan Delivery',
 category: 'الهوية البصرية وتطبيقات الأسطول والدعاية',
 categoryEn: 'Visual Identity, Fleet Branding & Advertising',
 tag: 'دليفري وتوصيل سريع',
 tagEn: 'Fast Delivery & Fleet',
 summary: 'مشروع متكامل لخدمات حالا دليفري (Halan Delivery): تصميم اللوجو المعتمد وهوية بصرية كاملة تنبض بالسرعة والحيوية، وتصميم بوستر واستيكرات مخصصة للصق على موتوسيكلات أسطول التوصيل الميداني لتعزيز الحضور البصري في الشوارع، بالإضافة إلى تصميم كافر رسمي واحترافي لصفحة الفيسبوك للتواصل السريع وبناء الثقة الفورية مع العملاء.',
 summaryEn: 'Comprehensive branding and fleet identity for Halan Delivery: crafting the official logo and high-energy visual identity system, designing specialized transit posters and stickers for the motorcycle courier fleet, and creating a branded Facebook cover for rapid digital customer engagement.',
 heroImage: '/projects/h-cover.webp',
 logo: '/projects/h-logo.webp',
 brandColors: [
   { hex: '#9ACA3C', name: 'أخضر لايم حيوي', nameEn: 'Velocity Lime' },
   { hex: '#E52521', name: 'أحمر ناري', nameEn: 'Signal Red' },
   { hex: '#2B2B2B', name: 'رمادي أسفلتي', nameEn: 'Asphalt Charcoal' },
   { hex: '#FFFFFF', name: 'أبيض نقي', nameEn: 'Pure White' }
 ],
 gallery: [
 '/projects/h-cover.webp',
 '/projects/h-poster.webp',
 '/projects/h-logo.webp'
 ],
 client: 'حالا دليفري (Halan Delivery)',
 clientEn: 'Halan Delivery',
 duration: 'تنفيذ هوية بصرية وتطبيقات ميدانية',
 durationEn: 'Visual Identity & Fleet Execution',
 location: 'جمهورية مصر العربية',
 locationEn: 'Egypt',
 year: '2026',
 metricHighlight: {
 value: '100%',
 label: 'هوية بصرية وتطبيقات أسطول متكاملة',
 labelEn: 'Complete Identity & Fleet Signage'
 },
 metricsRow: {
 val1: '100%',
 lbl1: 'لوجو وهوية كاملة',
 lbl1En: 'Brand Identity',
 val2: 'ميداني',
 lbl2: 'بوستر الموتوسيكلات',
 lbl2En: 'Fleet Posters',
 val3: 'فيسبوك',
 lbl3: 'كافر رسمي',
 lbl3En: 'Social Cover'
 },
 scopeOfWork: [
 'تصميم اللوجو الجديد وهوية بصرية كاملة تعبر عن السرعة والانطلاق ',
 'تصميم بوستر واستيكر مخصص للصق على موتوسيكلات أسطول التوصيل ',
 'تصميم كافر رسمي لصفحة الفيسبوك لتعزيز الثقة والتواصل المباشر ',
 'تحديد لوحة الألوان الحيوية والخطوط العصرية المناسبة للمجال اللوجستي',
 'معايرة أبعاد ونسب الطباعة الميدانية للموتوسيكلات لضمان وضوح الشعار والبيانات أثناء الحركة',
 'تجهيز حزم الأصول الرقمية لشبكات التواصل الاجتماعي وتطبيقات الهواتف'
 ],
 scopeOfWorkEn: [
 'Designing official brandmark and dynamic visual identity system ',
 'Designing specialized motorcycle fleet posters & transit decals ',
 'Designing official high-resolution Facebook cover for social engagement ',
 'Defining vibrant color palette and modern typography engineered for logistics',
 'Calibrating print dimensions and high-contrast styling for moving motorcycles',
 'Exporting production-ready digital assets for social channels and mobile usage'
 ],
 challenge: 'بناء علامة تجارية سريعة التمييز والرسوخ في الأذهان لخدمة دليفري فورية في سوق تنافسي؛ تتطلب مظهراً حيوياً ينقل إحساس السرعة والمصداقية، وتصميماً مخصصاً للموتوسيكلات يلفت الأنظار فوراً في الطرقات، مع واجهة رقمية احترافية عبر كافر الفيسبوك.',
 challengeEn: 'Carving out an instantly recognizable identity in a competitive on-demand delivery market; delivering a vibrant presence that communicates velocity and reliability, on-vehicle decals that command attention on the go, and an authoritative Facebook digital storefront.',
 solution: 'صممنا هوية بصرية متكاملة وشعاراً ديناميكياً يرمز للسرعة والانسيابية، مع بوستر واستيكر للموتوسيكلات بألوان عالية التباين ووضوح فائق لبيانات التواصل أثناء القيادة، وغلاف فيسبوك سينمائي يعزز ثقة الجمهور ويحفزهم على طلب الخدمة فوراً.',
 solutionEn: 'Created a cohesive visual identity with a dynamic aerodynamic logo, accompanied by high-contrast motorcycle decals optimized for legibility at speed, and an eye-catching Facebook cover engineered to drive inquiries and orders.',
 stats: [
 { label: 'اكتمال الهوية والشعار', labelEn: 'Visual Identity', value: '100%', sublabel: 'لوجو وهوية متكاملة ', sublabelEn: 'Official logo & guidelines' },
 { label: 'تطبيقات الموتوسيكلات', labelEn: 'Motorcycle Fleet Decals', value: 'ميداني', sublabel: 'بوستر واستيكر الأسطول ', sublabelEn: 'On-vehicle fleet decals' },
 { label: 'الواجهة الرقمية الرسمية', labelEn: 'Digital Channel Cover', value: 'فيسبوك', sublabel: 'كافر رسمي معتمد ', sublabelEn: 'Official Facebook cover' },
 { label: 'سرعة التمييز البصري', labelEn: 'Visual Recognition', value: '< 2 ثانية', sublabel: 'وضوح الشعار والتواصل في الشارع', sublabelEn: 'Instant on-street recall' }
 ],
 deliverables: [
 'الشعار الرسمي المعتمد لحالا دليفري ',
 'بوستر واستيكر الموتوسيكلات الميداني لأفراد التوصيل ',
 'كافر وغلاف صفحة الفيسبوك الرسمية ',
 'لوحة الألوان المعتمدة ودليل استخدام الهوية البصرية',
 'ملفات الطباعة الميدانية بدقة متناهية المقاومة للشمس والعوامل الجوية'
 ],
 deliverablesEn: [
 'Official approved Hala Delivery logo ',
 'Motorcycle fleet advertising poster & stickers ',
 'Official flagship Facebook cover graphic ',
 'Color palette specifications and brand typography manual',
 'High-resolution outdoor print-ready assets tailored for vehicle surfaces'
 ],
 techStack: [
 {
 name: 'Dynamic Logo & Identity Engineering',
 category: 'Branding & Vector Design',
 iconName: 'Palette',
 description: 'تصميم شعار رياضي وحيوي يعبر عن السرعة والأمان بألوان لافتة تعزز مكانة العلامة في أذهان العملاء.',
 descriptionEn: 'Engineered a bold, dynamic brandmark projecting speed and safety with high-recall color harmonies.'
 },
 {
 name: 'Outdoor Transit Signage & Decal Specs',
 category: 'Fleet & Print Production',
 iconName: 'Compass',
 description: 'معايرة مقاييس البوستر والاستيكرات المخصصة للموتوسيكلات لتلائم خوذات وحقائب وصناديق الموتوسيكلات بدقة.',
 descriptionEn: 'Calibrated exterior decal sizing and typography for motorcycles, delivery boxes, and courier equipment.'
 },
 {
 name: 'Social Media & Conversion Graphics',
 category: 'Digital Media & Marketing',
 iconName: 'Zap',
 description: 'تصميم كافر الفيسبوك وبانرات الترويج بأبعاد مدروسة لعرض خدمات التوصيل وأرقام التواصل بأعلى وضوح.',
 descriptionEn: 'Formulated Facebook cover graphics and social collateral optimized for swift contact information discovery.'
 }
 ],
 strategyDetails: [
 {
 phase: 'المرحلة الأولى // اللوجو والهوية البصرية',
 phaseEn: 'PHASE 01 // BRANDING & LOGO',
 title: 'ابتكار الشعار الرسمي وهوية حالا دليفري',
 titleEn: 'Official Logo Design & Visual Identity',
 description: 'صياغة هوية بصرية مفعمة بالطاقة ترمز للحركة والوصول السريع، وبناء الشعار الرسمي بدقة متناهية.',
 descriptionEn: 'Crafting a high-energy visual identity symbolizing mobility and rapid courier delivery.',
 bullets: [
 'تصميم الشعار المعتمد لحالا دليفري بدقة فائقة ',
 'اختيار درجات ألوان متباينة تلفت الانتباه وتعبر عن الحيوية والمصداقية',
 'تصميم التطبيقات الأساسية للهوية على المطبوعات والأصول الرقمية'
 ],
 bulletsEn: [
 'High-resolution official Hala Delivery logo design ',
 'Vibrant high-contrast color scheme built for instant on-street visibility',
 'Core visual identity guidelines across physical and digital touchpoints'
 ]
 },
 {
 phase: 'المرحلة الثانية // الدعاية الميدانية والأسطول',
 phaseEn: 'PHASE 02 // FLEET BRANDING',
 title: 'تصميم بوستر واستيكر موتوسيكلات التوصيل',
 titleEn: 'Motorcycle Fleet Decals & Transit Poster',
 description: 'تصميم بوستر واستيكر مخصص للصقه على موتوسيكلات المناديب ليكون إعلاناً متحركاً في كافة شوارع المدينة.',
 descriptionEn: 'Designing high-impact motorcycle decals and stickers transforming the delivery fleet into rolling city billboards.',
 bullets: [
 'تصميم بوستر مخصص لصناديق وموتوسيكلات التوصيل ',
 'إبراز أرقام التواصل واللوجو بوضوح للقراءة أثناء القيادة وحركة السير',
 'مراعاة معايير الطباعة المقاومة للعوامل الجوية وأشعة الشمس'
 ],
 bulletsEn: [
 'Custom poster & decal optimized for delivery motorcycles ',
 'Prominent contact number and logo positioning for instantaneous readability',
 'Calibrated for UV-proof and weather-resistant outdoor vinyl production'
 ]
 },
 {
 phase: 'المرحلة الثالثة // الحضور الرقمي والسوشيال',
 phaseEn: 'PHASE 03 // DIGITAL PRESENCE',
 title: 'تصميم كافر الفيسبوك والانتشار الرقمي',
 titleEn: 'Facebook Brand Cover & Social Footprint',
 description: 'تصميم كافر احترافي لصفحة الفيسبوك لتوحيد الصورة الذهنية وتسهيل استقبال طلبات العملاء عبر وسائل التواصل.',
 descriptionEn: 'Crafting the official Facebook cover to unify brand perception and streamline inbound customer orders.',
 bullets: [
 'تصميم كافر فيسبوك متناسق بدقة عالية ',
 'تضمين رسائل الحث على اتخاذ القرار وأرقام الطلب المباشر',
 'تحسين المظهر البصري لصفحة الفيسبوك لتعزيز ثقة المتابعين والعملاء'
 ],
 bulletsEn: [
 'High-resolution branded Facebook cover ',
 'Strategic call-to-action layout highlighting quick ordering channels',
 'Polished aesthetic establishing immediate trust and credibility'
 ]
 }
 ],
 assetShowcase: [
 {
 url: '/projects/h-cover.webp',
 title: 'كافر الفيسبوك الرسمي - حالا دليفري ',
 titleEn: 'Official Facebook Cover - Halan Delivery',
 type: 'cover',
 description: 'تصميم كافر احترافي لصفحة الفيسبوك الرسمية يعكس سرعة تلبية الطلبات والتواجد الرقمي الموثوق.',
 descriptionEn: 'Flagship Facebook brand cover communicating rapid on-demand courier velocity and reliability.'
 },
 {
 url: '/projects/h-poster.webp',
 title: 'بوستر واستيكر الموتوسيكلات الميداني ',
 titleEn: 'Motorcycle Fleet Decal & Poster',
 type: 'poster',
 description: 'بوستر إعلاني مخصص للصق على موتوسيكلات المناديب ليكون بمثابة لافتة إعلانية متنقلة في الشوارع تجذب العملاء.',
 descriptionEn: 'Custom fleet sticker & poster engineered for delivery motorcycles ensuring instant recognition in traffic.'
 },
 {
 url: '/projects/h-logo.webp',
 title: 'الشعار الرسمي المعتمد - حالا دليفري ',
 titleEn: 'Official Brand Logo - Halan Delivery',
 type: 'brand',
 description: 'تصميم الشعار الجديد وهوية بصرية كاملة تنبض بالحيوية والانسيابية لتعزيز هوية البراند في السوق.',
 descriptionEn: 'Approved official logo and brand crest expressing agility, speed, and trusted on-demand courier fulfillment.'
 }
 ],
 externalPostLinks: [
   {
     id: 'hd-post-1',
     title: 'منشور إطلاق هوية أسطول حالا دليفري والغلاف الرسمي على فيسبوك',
     titleEn: 'Halan Delivery Fleet Identity & Official Facebook Cover Post',
     platform: 'Facebook',
     url: 'https://www.facebook.com',
     tag: 'الصفحة الرسمية',
     tagEn: 'Official Facebook Page'
   }
 ],
 quote: {
 text: 'اللوجو وهوية الموتوسيكلات وكافر الفيسبوك حولوا أسطولنا إلى علامة تجارية حقيقية يراها الجميع ويثق بها في كل مكان!',
 author: 'إدارة حالا دليفري',
 role: 'خدمات التوصيل والدليفري السريع'
 }
 },
 {
 id: 'adamco',
 slug: 'adamco',
 title: 'شركة أدمكو لنقل الموظفين وعمال المصانع',
 titleEn: 'Adamco Corporate & Industrial Transport',
 category: 'نقل الموظفين والعمال والتعاقدات اللوجستية',
 categoryEn: 'Corporate Commute & Industrial Logistics',
 tag: 'نقل الموظفين والرحلات',
 tagEn: 'Fleet Logistics & Commute',
 summary: 'شراكة تسويقية وتشغيلية استراتيجية مع شركة أدمكو الرائدة في نقل الموظفين وعمال المصانع، حيث تتعاقد مع كبرى المصانع والشركات لتتكفل بنقل الموظفين والعمال من منازلهم إلى مقار عملهم والعكس. تضمنت الشراكة صياغة استراتيجية التشغيل، تصميم البوسترات الدعائية، إنتاج فيديوهات تسويقية ميدانية، ودراسة خطة التسويق الميداني والمنافسين في العاشر من رمضان والسويس.',
 summaryEn: 'Strategic marketing and operations partnership with Adamco, a premier provider specializing in enterprise employee and factory workforce transit. Serving leading factories across 10th of Ramadan and Suez, the engagement delivered operational positioning, strategic campaign poster suites, cinematic video ads, and in-depth competitive intelligence.',
 heroImage: '/projects/a7.webp',
 logo: '/projects/Adamco logo.webp',
 brandColors: [
   { hex: '#9E1B1E', name: 'أحمر قرمزي', nameEn: 'Industrial Crimson' },
   { hex: '#222222', name: 'فحمي معدني', nameEn: 'Steel Charcoal' },
   { hex: '#C0C5CE', name: 'فضي كروم', nameEn: 'Chrome Silver' },
   { hex: '#0D0D11', name: 'أسود داكن', nameEn: 'Deep Carbon' }
 ],
 gallery: [
 '/projects/a7.webp',
 '/projects/Adamco logo.webp',
 '/projects/a1.webp',
 '/projects/a2.webp',
 '/projects/a3.webp',
 '/projects/a4.webp',
 '/projects/a5.webp',
 '/projects/a6.webp'
 ],
 videos: [
 {
 url: '/projects/a-v ads (1).mp4',
 title: 'إدارة حركة النقل مبقتش عبء عليك | الجودة والاحترافية',
 titleEn: 'Commute Management Is No Longer a Burden | Quality & Reliability',
 description: 'إعلان فيديو موجه لأصحاب الشركات ومسؤولي الموارد البشرية يوضح كيف تتكفل أدمكو بإدارة حركة النقل بالكامل بأعلى معايير الاحترافية.',
 descriptionEn: 'Targeted commercial addressing corporate heads and HR directors on seamless workforce commute delegation.',
 duration: '0:10'
 },
 {
 url: '/projects/a-v ads (2).mp4',
 title: 'أدمكو شريكك المثالي لنقل الموظفين وعمال الشركات والمصانع',
 titleEn: 'Adamco - Your Premier Workforce Transport Partner',
 description: 'استعراض ميداني واقعي لأسطول حافلات أدمكو الحديثة وخدمات التعاقد المباشر مع المصانع الكبرى.',
 descriptionEn: 'Real-world fleet presentation showcasing readiness for enterprise factory shift contracts.',
 duration: '0:10'
 }
 ],
 branches: ['العاشر من رمضان', 'السويس'],
 branchesEn: ['10th of Ramadan City', 'Suez'],
 contactPhones: ['01030036062', '01023444237'],
 client: 'أدمكو للنقل والرحلات (قاسم الحواتمي)',
 clientEn: 'Adamco Transport & Fleet Services',
 duration: 'شراكة تشغيل وتسويق مستمرة',
 durationEn: 'Ongoing Strategic Partnership',
 location: 'العاشر من رمضان والسويس، مصر',
 locationEn: '10th of Ramadan & Suez, Egypt',
 year: '2026',
 metricHighlight: {
 value: '99.8%',
 label: 'انضباط مواعيد ورديات المصانع',
 labelEn: 'Factory Shift Punctuality Rate'
 },
 metricsRow: {
 val1: '99.8%',
 lbl1: 'انضباط الورديات',
 lbl1En: 'Shift Punctuality',
 val2: '100% GPS',
 lbl2: 'تتبع ومراقبة لحظية',
 lbl2En: 'Live Telematics',
 val3: 'العاشر والسويس',
 lbl3: 'الفروع الصناعية',
 lbl3En: 'Industrial Hubs'
 },
 scopeOfWork: [
 'صياغة استراتيجية التشغيل الميداني لتعاقدات المصانع والشركات',
 'دراسة ميدانية للمصانع المستهدفة والمنافسين بالعاشر من رمضان والسويس',
 'تصميم سلسلة البوسترات الإعلانية الشاملة وهوية الأسطول ',
 'إنتاج وإخراج الفيديوهات الإعلانية الترويجية بدقة عالية',
 'إعداد استراتيجية الترويج الرقمي واستهداف مديري الموارد البشرية والعمليات'
 ],
 scopeOfWorkEn: [
 'Field operations and corporate contract acquisition strategy',
 'Industrial census and competitive landscape research across 10th of Ramadan & Suez',
 'Comprehensive promotional poster suite & fleet brand identity',
 'Cinematic 4K promotional commercial video production',
 'Targeted B2B campaign architecture addressing HR & Plant Managers'
 ],
 challenge: 'احتدام المنافسة في المدن الصناعية، مع شكاوى المصانع المستمرة من تأخر ورديات العمال وغياب الرقابة الحية على خطوط السير، مما يكلف خطوط الإنتاج خسائر فادحة.',
 challengeEn: 'Intense regional competition in industrial zones, alongside factory heads facing severe production downtime due to delayed workers and absence of live vehicle tracking.',
 solution: 'إعادة صياغة تموضع أدمكو كشريك تشغيلي ذكي يضمن وصول العمال قبل بداية الوردية مع تتبع GPS مباشر، مدعوماً بحملة بوسترات وفيديوهات إعلانية احترافية ودراسة ميدانية لجميع المصانع والشركات المستهدفة.',
 solutionEn: 'Positioned Adamco as a mission-critical logistics partner guaranteeing punctual shift arrivals with real-time GPS telematics, reinforced by multi-touch B2B video ads and industrial posters.',
 stats: [
 { label: 'انضباط مواعيد الورديات', labelEn: 'Shift Punctuality Rate', value: '99.8%', sublabel: 'وصول مؤكد قبل بدء خط الإنتاج', sublabelEn: 'Guaranteed arrival before production line starts' },
 { label: 'تغطية المدن الصناعية', labelEn: 'Industrial Coverage', value: '10th & Suez', sublabel: 'العاشر من رمضان والسويس', sublabelEn: '10th of Ramadan City & Suez corridor' },
 { label: 'توفير التكاليف التشغيلية', labelEn: 'Commute Cost Savings', value: '-28%', sublabel: 'مقارنة بإدارة أسطول داخلي للمصنع', sublabelEn: 'Versus managing internal factory buses' },
 { label: 'جاهزية وتتبع GPS', labelEn: 'Live Telematics & GPS', value: '100%', sublabel: 'مراقبة حية على مدار الساعة', sublabelEn: 'Real-time telemetry and geofencing' }
 ],
 deliverables: [
 'استراتيجية التشغيل وخطة التسويق الميداني للشركات والمصانع',
 'سلسلة البوسترات التسويقية لتعاقدات الشركات (11 تصميماً معتمداً)',
 'فيديوهان تسويقيان رسميان عالي الجودة بحجم كامل',
 'دراسة المنافسين وحصر العملاء والمصانع المحتملة في العاشر والسويس',
 'نماذج عروض الأسعار والتعاقدات المؤسسية المرنة'
 ],
 deliverablesEn: [
 'Operational strategy and field B2B marketing roadmap',
 'Complete 11-piece promotional campaign poster suite',
 'Two high-impact commercial video spots for corporate outreach',
 'Competitor intelligence and factory lead mapping in 10th of Ramadan & Suez',
 'Flexible corporate quotation models & SLA contract frameworks'
 ],
 techStack: [
 {
 name: 'GPS Telematics & IoT Tracking',
 category: 'الأنظمة واللوجستيات',
 iconName: 'Zap',
 description: 'أنظمة تتبع جغرافي لحظية تتيح لمسؤولي الشركات متابعة خطوط سير الحافلات ومواعيد الوصول بدقة.',
 descriptionEn: 'Live GPS tracking and telemetry for instantaneous route visibility and punctuality tracking.'
 },
 {
 name: 'Cinematic Video Production & Sound Design',
 category: 'الإنتاج المرئي والمحتوى',
 iconName: 'Camera',
 description: 'إنتاج إعلانات فيديو احترافية مع تعليق صوتي واثق يعزز المصداقية لدى إدارات الشركات والمصانع.',
 descriptionEn: 'High-end commercial video production paired with authoritative voiceover inspiring corporate trust.'
 },
 {
 name: 'Industrial B2B Poster Suite',
 category: 'الهوية والمواد التسويقية',
 iconName: 'Palette',
 description: 'سلسلة بوسترات تجارية مصممة هندسياً لمخاطبة أصحاب المصانع ومديري العمليات وعرض خيارات الأسطول.',
 descriptionEn: 'Engineered B2B poster suite communicating reliability, contractual flexibility, and fleet breadth.'
 },
 {
 name: 'Competitive Intelligence & Geo-Targeting',
 category: 'أبحاث السوق والاستراتيجية',
 iconName: 'BarChart3',
 description: 'دراسة الشركات المنافسة في قطاع النقل وتحديد المصانع والعملاء المحتملين في العاشر من رمضان والسويس.',
 descriptionEn: 'Targeted competitive analysis identifying enterprise industrial prospects in key economic zones.'
 }
 ],
 strategyDetails: [
 {
 phase: 'المرحلة 01',
 phaseEn: 'PHASE 01',
 title: 'دراسة السوق الميداني وحصر المصانع والشركات',
 titleEn: 'Field Market Research & Industrial Census',
 description: 'تحليل دقيق لخارطة المصانع في مدينة العاشر من رمضان ومنطقة السويس، ودراسة احتياجات الورديات وأسعار المنافسين لبناء عرض قيمة لا يُقاوم.',
 descriptionEn: 'Comprehensive mapping of factories in 10th of Ramadan and Suez, analyzing shift patterns and competitor pricing.',
 bullets: [
 'حصر مصانع الأدوية، النسيج، الصناعات الغذائية والهندسية',
 'تحليل نقاط الضعف لدى شركات النقل التقليدية (التأخير، غياب التتبع)',
 'تحديد فجوات الأسعار وتصميم باقات تعاقد مرنة للمصانع'
 ],
 bulletsEn: [
 'Mapping pharmaceutical, textile, food, and engineering plants',
 'Analyzing traditional transporter vulnerabilities (delays, zero telemetry)',
 'Identifying pricing gaps and formulating flexible factory SLA tiers'
 ]
 },
 {
 phase: 'المرحلة 02',
 phaseEn: 'PHASE 02',
 title: 'بناء استراتيجية التشغيل وتأكيد ميزة الـ GPS والانضباط',
 titleEn: 'Operational Roadmap & GPS Telematics Advantage',
 description: 'صياغة رسالة تسويقية محورية: "مصنعك لا يتوقف.. خطوط إنتاجك مبيستناش"، مع ربط كل حافلة بنظام تتبع رقمي حي.',
 descriptionEn: 'Formulating the core value proposition: "Production lines never halt", backed by mandatory live GPS telemetry.',
 bullets: [
 'إبراز أسطول تويوتا هايس والميني باصات والحافلات المكيفة',
 'ضمان وصول العمال قبل بداية الوردية بنصف ساعة',
 'نظام تقارير حضور وانصراف إلكتروني دوري لإدارة الموارد البشرية'
 ],
 bulletsEn: [
 'Highlighting Toyota HiAce vans, mini-buses, and full luxury coaches',
 'Punctual drop-off 30 minutes before manufacturing shift starts',
 'Automated electronic route and arrival logs for HR departments'
 ]
 },
 {
 phase: 'المرحلة 03',
 phaseEn: 'PHASE 03',
 title: 'تصميم البوسترات التسويقية وسلسلة المحتوى الإعلاني',
 titleEn: 'B2B Creative Suite & Strategic Poster Series',
 description: 'إنتاج 11 تصميماً إعلانيا استراتيجياً متنوعاً يغطي كل جوانب القوة: أمان العمال، انضباط المواعيد، تنوع الأسطول، والعقود المرنة.',
 descriptionEn: 'Production of 11 targeted high-impact creatives addressing safety, punctuality, fleet versatility, and contract terms.',
 bullets: [
 'بوسترات متخصصة في أمان الموظفين وتتبع الـ GPS',
 'تصاميم تستعرض أسطول التويوتا أمام المجمعات الإدارية',
 'أغلفة بانورامية رسمية للربط بين العاشر من رمضان والسويس'
 ],
 bulletsEn: [
 'Dedicated creatives focusing on employee safety and GPS shields',
 'Fleet showcases positioning Toyota HiAce vans at corporate parks',
 'Highway panoramic banners linking Suez and 10th of Ramadan corridors'
 ]
 },
 {
 phase: 'المرحلة 04',
 phaseEn: 'PHASE 04',
 title: 'إنتاج الفيديوهات التسويقية الميدانية',
 titleEn: 'Commercial Video Production & Fleet Showcase',
 description: 'تصوير وإخراج فيديوهين إعلانيين بدقة عالية: الأول يركز على راحة بال صاحب العمل وسهولة إدارة النقل، والثاني يستعرض الأسطول على أرض الواقع.',
 descriptionEn: 'Directing two high-converting commercial spots highlighting operational ease and real-world fleet readiness.',
 bullets: [
 'فيديو إدارة النقل وسهولة التشغيل لأصحاب الشركات',
 'فيديو استعراض أسطول الحافلات والميكروباصات المجهزة',
 'تعليق صوتي سينمائي قوي وهوية صوتية مميزة'
 ],
 bulletsEn: [
 'Corporate narrative video highlighting frictionless transport delegation',
 'Real-world fleet showcase video demonstrating modern buses and vans',
 'Authoritative sound design, voiceover, and brand audio signature'
 ]
 },
 {
 phase: 'المرحلة 05',
 phaseEn: 'PHASE 05',
 title: 'إطلاق الحملات الممولة والتسويق الميداني المباشر',
 titleEn: 'Targeted Paid Campaigns & B2B Direct Sales',
 description: 'توجيه الحملات الإعلانية على المنصات الرقمية لمديري الموارد البشرية والعمليات (HR & Plant Managers) بالتوازي مع خطة الزيارات الميدانية.',
 descriptionEn: 'Deploying hyper-targeted digital media campaigns targeting HR and Operations executives alongside field sales visits.',
 bullets: [
 'استهداف جغرافي مخصص لمدينة العاشر من رمضان والمنطقة الصناعية بالسويس',
 'توليد استفسارات وطلبات عروض أسعار (RFQs) لتعاقدات كبرى',
 'متابعة أداء الحملات وقياس تكلفة اكتساب التعاقد المؤسسي'
 ],
 bulletsEn: [
 'Hyper-local geotargeting across 10th of Ramadan & Suez industrial estates',
 'Generating verified inbound RFQ leads for high-value annual contracts',
 'Continuous campaign optimization measuring enterprise client CAC'
 ]
 }
 ],
 assetShowcase: [
 {
 url: '/projects/a7.webp',
 title: 'اصطفاف أسطول أدمكو لتعاقدات الشركات',
 titleEn: 'Adamco Fleet Lineup for Corporate Contracts',
 type: 'cover',
 description: 'اصطفاف أسطول الحافلات والميني باصات الحديثة في ساحة التسليم، جاهزة لنقل عمال وموظفي كبرى الشركات.',
 descriptionEn: 'Flagship modern fleet showcase lined up for enterprise transport contracts.'
 },
 {
 url: '/projects/a1.webp',
 title: 'مصنعكم لا يتوقف... ونوباتكم آمنة مع آدمكو',
 titleEn: 'Your Factory Never Stops - Safe Shifts with Adamco',
 type: 'poster',
 description: 'بوستر تسويقي يبرز حلول النقل الذكية المصممة لتلبية احتياجات المدن والمناطق الصناعية.',
 descriptionEn: 'Smart transit solutions tailored to high-capacity industrial cities.'
 },
 {
 url: '/projects/a2.webp',
 title: 'أسطول تويوتا هايس أمام المجمعات الإدارية',
 titleEn: 'Toyota HiAce Fleet at Modern Business Campuses',
 type: 'poster',
 description: 'حملة استقطاب الشركات الكبرى وعرض التشكيل الدائري لأسطول الميكروباصات الحديثة.',
 descriptionEn: 'Corporate acquisition creative showing circular deployment at business campuses.'
 },
 {
 url: '/projects/a3.webp',
 title: 'خط إنتاجك مبيستناش! العمال قبل الوردية',
 titleEn: 'Production Lines Wait For No One - Punctual Shifts',
 type: 'poster',
 description: 'التزام حديدي بالمواعيد وورديات المصانع الكبرى لتفادي أي توقف في خطوط الإنتاج.',
 descriptionEn: 'Rigid punctuality guarantees zero downtime for high-volume manufacturing lines.'
 },
 {
 url: '/projects/a4.webp',
 title: 'أسطول متكامل: ملاكي وميكروباص وميني باص ودبل كابينة',
 titleEn: 'Comprehensive Fleet Mix: Sedans, Vans, Buses & Pickups',
 type: 'poster',
 description: 'استعراض تنوع أسطول أدمكو أمام المقر التجاري للشركة مع باقات الرحلات والتعاقدات.',
 descriptionEn: 'Multi-category fleet options tailored for corporate contracts and private executive transit.'
 },
 {
 url: '/projects/a5.webp',
 title: 'بانوراما الطريق السريع وبوابة العاشر من رمضان',
 titleEn: 'Highway Skyline Panorama - 10th of Ramadan Corridor',
 type: 'cover',
 description: 'غلاف بانورامي رسمي يوضح جاهزية الأسطول على الطرق السريعة ومحاور النقل الصناعي.',
 descriptionEn: 'Panoramic highway banner demonstrating cross-city connectivity between Suez and 10th of Ramadan.'
 },
 {
 url: '/projects/a6.webp',
 title: 'عقود مرنة تناسب ميزانية وحجم شركتك',
 titleEn: 'Flexible Contracts Matching Corporate Scale & Budget',
 type: 'poster',
 description: 'حلول تعاقدية مخصصة للشركات والمصانع مصممة هندسياً لتقليل تكاليف النقل التشغيلية.',
 descriptionEn: 'Tailored contractual packages designed to reduce operational commute overhead.'
 },
 {
 url: '/projects/a8.webp',
 title: 'دعنا نتولى الحركة - شبكة الشراكات الصناعية',
 titleEn: 'Leave The Motion To Us - Industrial Ecosystem',
 type: 'brand',
 description: 'شعار أدمكو ثلاثي الأبعاد مع تروس الصناعة وشبكة الربط بين المصانع والمؤسسات العالمية.',
 descriptionEn: '3D metallic identity emblem surrounded by industrial network hubs and global enterprise partnerships.'
 },
 {
 url: '/projects/a9.webp',
 title: 'أمان موظفيك أولويتنا - أحدث تقنيات السلامة والتتبع',
 titleEn: 'Employee Safety First - Cutting-edge Telematics & GPS',
 type: 'poster',
 description: 'حافلات مجهزة بأنظمة استشعار ومراقبة مسارات لحظية تضمن سلامة الكوادر البشرية على الطرق.',
 descriptionEn: 'Equipped with live IoT telematics and active safety sensors protecting corporate workforce.'
 },
 {
 url: '/projects/a10.webp',
 title: 'الهوية البصرية الرسمية وشعار أدمكو ثلاثي الأبعاد',
 titleEn: 'Official 3D Adamco Crest & Brand Identity',
 type: 'brand',
 description: 'شعار الأسد المعدني ثلاثي الأبعاد داخل الحرف A مع النجوم الثلاثة التي ترمز للجودة والريادة والأمان.',
 descriptionEn: 'Official 3D metallic lion shield inside the letter A emblem symbolizing leadership, safety, and prestige.'
 },
 {
 url: '/projects/a11.webp',
 title: 'فريقك في أيدٍ أمينة ومُراقب لحظة بلحظة - درع الأمان GPS',
 titleEn: 'Your Team in Safe Hands - Real-Time GPS Shield',
 type: 'poster',
 platform: 'Facebook',
 description: 'تتبع مباشر على مدار الساعة يمنح إدارات المصانع راحة بال تامة بشأن وصول العمال في الموعد.',
 descriptionEn: '24/7 direct GPS geofencing and monitoring providing operations managers total peace of mind.'
 }
 ],
 externalPostLinks: [
   {
     id: 'ad-post-1',
     title: 'منشور حملة تعاقدات نقل موظفي وعمال المصانع — العاشر من رمضان والسويس',
     titleEn: 'Enterprise Factory Workforce Transport Campaign Post',
     platform: 'Facebook',
     url: 'https://www.facebook.com',
     tag: 'حملة B2B للشركات',
     tagEn: 'B2B Corporate Campaign'
   },
   {
     id: 'ad-post-2',
     title: 'منشور نظام التتبع اللحظي GPS وانضباط مواعيد الورديات 99.8%',
     titleEn: 'Real-Time GPS Fleet Tracking & 99.8% Shift Punctuality Post',
     platform: 'Facebook',
     url: 'https://www.facebook.com',
     tag: 'بوست التتبع والأمان',
     tagEn: 'Safety & Telematics Post'
   }
 ],
 quote: {
 text: 'شراكتنا مع Pulse OCTO نقلت أدمكو لمستوى احترافي غير مسبوق.. البوسترات والفيديوهات الإعلانية واستراتيجية دراسة السوق منحت عملاءنا من كبرى المصانع ثقة تامة في التزامنا وجاهزية أسطولنا.',
 author: 'إدارة شركة أدمكو (قاسم الحواتمي)',
 role: 'العاشر من رمضان والسويس'
 }
 },
 {
 id: 'athar',
 slug: 'athar',
 title: 'أثر (Athar)',
 titleEn: 'Athar — The Imprint of Luxury',
 category: 'الهوية البصرية وتصميم أزياء المحجبات',
 categoryEn: 'Brand Identity & Modest Fashion',
 tag: 'لِكُلِّ تَفصيلةٍ.. أَثَرٌ مِن الأناقَة',
 tagEn: 'The Imprint of Luxury',
 originBadge: 'أزياء محجبات مصرية 100% • قيد التأسيس',
 originBadgeEn: '100% Egyptian Modest Fashion • Brand in Creation',
 isBrandInCreation: true,
 summary: '«لِكُلِّ تَفصيلةٍ.. أَثَرٌ مِن الأناقَة» — براند أزياء مصري 100% قيد التأسيس والإطلاق، متخصص في تصميم وتنفيذ ملابس المحجبات الراقية بخامات مختارة وقصّات متقنة تجمع بين الحشمة والفخامة المعاصرة.',
 summaryEn: '“The Imprint of Luxury” — A 100% Egyptian modest fashion house currently in creation, specializing in designing and tailoring contemporary hijab apparel with refined silhouettes and authentic craftsmanship.',
 heroImage: '/assets/aistudio/ATHAR_2_fd5b93fd.jpg',
 logo: '/assets/aistudio/Logo_AThar_52ab6b2b.jpg',
 gallery: [
 '/assets/aistudio/ATHAR_2_fd5b93fd.jpg',
 '/assets/aistudio/Logo_AThar_52ab6b2b.jpg'
 ],
 brandColors: [
 { name: 'العنابي الملكي (Royal Burgundy)', nameEn: 'Royal Burgundy', hex: '#4A1219' },
 { name: 'الذهبي المعتّق (Antique Gold)', nameEn: 'Antique Gold', hex: '#C8A46B' },
 { name: 'الكريمي العاجي (Warm Ivory)', nameEn: 'Warm Ivory', hex: '#F4ECE0' },
 { name: 'الرملي الحجري (Limestone Sand)', nameEn: 'Limestone Sand', hex: '#DFD2C0' }
 ],
 client: 'أثر (Athar)',
 clientEn: 'Athar',
 duration: 'تأسيس العلامة وبناء الهوية والتشكيلة',
 durationEn: 'Brand Creation, Identity & Collection Launch',
 location: 'جمهورية مصر العربية',
 locationEn: 'Egypt',
 year: '2026',
 metricHighlight: {
 value: '100% مصري',
 label: 'تصميم وتنفيذ ملابس محجبات',
 labelEn: 'Egyptian Design & Tailoring'
 },
 metricsRow: {
 val1: '100% مصري',
 lbl1: 'تصميم وتنفيذ',
 lbl1En: 'Craftsmanship',
 val2: 'قيد التأسيس',
 lbl2: 'حالة البراند',
 lbl2En: 'Stage',
 val3: 'ملابس محجبات',
 lbl3: 'التخصص',
 lbl3En: 'Modest Fashion'
 },
 scopeOfWork: [
 'تصميم الشعار الرسمي والهيدر المعماري ودليل الهوية البصرية (Brand Book PDF)',
 'تجهيز عروض الموك اب (Mockups) الخاصة بالعلامة والتغليف والأزياء',
 'توثيق وعرض التشكيلة الكاملة لأزياء المحجبات في معرض بصري مخصص',
 'صياغة القصة الإبداعية للبراند ورؤية التأسيس بأسلوب تحريري راقٍ'
 ],
 scopeOfWorkEn: [
 'Official Brandmark, Architectural Boutique Header & Brand Guidelines PDF',
 'Custom brand, apparel, and packaging mockup presentation',
 'Dedicated editorial lookbook showcase for the modest fashion collection',
 'Refined brand storytelling and founder vision narrative'
 ],
 challenge: 'تأسيس دار أزياء محجبات مصرية 100% بهوية بصرية فاخرة تحمل شعار «لكل تفصيلة.. أثر من الأناقة»، وتجمع بين الأصالة والفخامة الهادئة في الصناعة المصرية.',
 challengeEn: 'Establishing a 100% Egyptian modest fashion label under “The Imprint of Luxury” with a refined visual identity matching its bespoke tailoring quality.',
 solution: 'تصميم الشعار الخطي والهيدر المعماري للدار باللونين العنابي الملكي والذهبي المعتّق، مع تخصيص مساحة عرض متكاملة لدليل الهوية البصرية (PDF) والموك اب ومعرض التشكيلة.',
 solutionEn: 'Crafted the calligraphic brandmark and limestone atelier header in royal burgundy and antique gold, paired with a dedicated Brand Book PDF showcase, mockup stage, and lookbook gallery.',
 stats: [
 { label: 'أصل العلامة والتصنيع', labelEn: 'Brand Origin', value: '100% مصري', sublabel: 'تصميم وتنفيذ محلي متكامل', sublabelEn: 'Designed & tailored in Egypt' },
 { label: 'التخصص', labelEn: 'Specialization', value: 'ملابس محجبات', sublabel: 'أزياء محتشمة بتصاميم خاصة', sublabelEn: 'Bespoke modest & hijab fashion' },
 { label: 'المرحلة الحالية', labelEn: 'Current Stage', value: 'قيد التأسيس', sublabel: 'تم اعتماد الشعار والهيدر وجارٍ استكمال التشكيلة', sublabelEn: 'Logo & header live; preparing PDF & collection' }
 ],
 deliverables: [
 'الشعار الرسمي للعلامة والهيدر المعماري للدار',
 'ملف الهوية البصرية الكامل (Brand Guidelines PDF)',
 'عرض الموك اب الرسمي للعلامة',
 'معرض صور التشكيلة وتصاميم الأزياء'
 ],
 deliverablesEn: [
 'Official Brandmark & Architectural Boutique Header',
 'Official Brand Identity Guidelines (PDF)',
 'Brand & Packaging Mockup Presentation',
 'Modest Fashion Collection Lookbook Archive'
 ],
 brandNarrative: {
 eyebrow: 'قصة التأسيس والهوية المصرية • ATHAR — THE IMPRINT OF LUXURY',
 eyebrowEn: 'BRAND STORY & EGYPTIAN CRAFTSMANSHIP • THE IMPRINT OF LUXURY',
 headline: 'أثر — لِكُلِّ تَفصيلةٍ.. أَثَرٌ مِن الأناقَة في صناعة مصرية 100%',
 headlineEn: 'Athar — The Imprint of Luxury in 100% Egyptian Modest Fashion',
 founderQuote: 'لِكُلِّ تَفصيلةٍ.. أَثَرٌ مِن الأناقَة — لأن كل قطعة محجبات تستحق أن تُصمَّم وتُنفَّذ بعناية تترك أثراً راقياً يدوم.',
 founderQuoteEn: 'The Imprint of Luxury — Crafted in every silhouette, stitch, and subtle detail.',
 paragraphs: [
 'تُبنى علامة «أثر» لتقدم مفهوماً راقياً لملابس المحجبات المصممة والمنفذة بالكامل في مصر 100%، انطلاقاً من شغف حقيقي بالتفاصيل وجودة الأقمشة والقصّات التي تمنح المرأة المحجبة حضوراً هادئاً ومتفرّداً.',
 'انطلقت الهوية البصرية للدار من مزيج العنابي الملكي والذهبي المعتّق على خلفية عاجية دافئة تعكس الوقار والأناقة الكلاسيكية المعاصرة، ويجري حالياً استكمال إرفاق دليل الهوية البصرية (PDF)، الموك اب الرسمي، وتشكيلة الأزياء الكاملة في هذا القسم المخصص.'
 ],
 paragraphsEn: [
 'Athar is being built as a 100% Egyptian modest fashion house dedicated to designing and tailoring contemporary hijab attire with meticulous attention to fabric, drape, and understated elegance.',
 'Anchored in a palette of royal burgundy, antique gold, and warm limestone ivory, the showcase now presents the official brandmark and architectural boutique header while the Brand Guidelines PDF, mockup, and collection photography are being prepared.'
 ],
 pillars: [
 {
 title: 'تصميم وتنفيذ مصري 100%',
 titleEn: '100% Egyptian Craft',
 detail: 'كل قطعة تُصمَّم وتُنفَّذ بأيدٍ مصرية متخصصة مع عناية فائقة بالتفصيل والتشطيب.',
 detailEn: 'Every garment is conceived, patterned, and tailored in Egypt with refined finishing.'
 },
 {
 title: 'أزياء محجبات بهوية خاصة',
 titleEn: 'Bespoke Modest Silhouettes',
 detail: 'توازن دقيق بين الحشمة الأصيلة والخطوط العصرية المريحة للاستخدام اليومي والمناسبات.',
 detailEn: 'Balanced proportions uniting timeless modesty with contemporary sophistication.'
 },
 {
 title: 'لِكُلِّ تَفصيلةٍ أَثَرٌ مِن الأناقَة',
 titleEn: 'The Imprint of Luxury',
 detail: 'نظام بصري متناغم يجمع بين الشعار والهيدر المعماري ودليل الهوية والموك اب والتشكيلة.',
 detailEn: 'A cohesive visual architecture uniting brandmark, boutique header, Brand Book, and lookbook.'
 }
 ]
 },
 assetShowcase: [
 {
 url: '/assets/aistudio/ATHAR_2_fd5b93fd.jpg',
 title: 'الهيدر المعماري الرسمي لدار أثر — لكُلِّ تفصيلةٍ أثر من الأناقة',
 titleEn: 'Official Architectural Boutique Header — Athar: The Imprint of Luxury',
 type: 'cover',
 description: 'هيدر الدار الرسمي بشعار أثر ثلاثي الأبعاد باللونين العنابي الملكي والذهبي المعتّق على جدار الحجر الجيري الدافئ.',
 descriptionEn: 'Official boutique limestone header showcasing the sculpted 3D burgundy-and-gold Athar emblem overlooking draped couture curtains.'
 }
 ]
 }
];

export const EIGHT_ARMS_DATA: ArmData[] = [
 {
 id: 1,
 title: 'الهوية وبناء العلامة',
 enTitle: 'BRANDING',
 tag: 'الهوية والتمركز',
 iconName: 'Sparkles',
 philosophy: 'بناء هويات بصرية متكاملة تعكس شخصية البراند وتتركه عالقاً في أذهان العملاء. نعتمد على "الهندسة البصرية" (Visual Engineering) لاستبدال القوالب المستهلكة بهويات ذات طابع مستقبلي وتكنولوجي فاخر.',
 deliverables: [
 'تصميم الشعارات المتجهة والرمزيات ثلاثية الأبعاد (3D Emblems).',
 'بناء دليل ألوان الهوية (Color Palette) والنمط البصري الكامل.',
 'اختيار وتنسيق نظام الخطوط الهندسية والتطبيعية (Typography System).',
 'تصميم المطبوعات والتطبيقات الرقمية وتصميمات السوشيال ميديا.'
 ],
 goal: 'ترسيخ هوية لا تُنسى في ذهن العميل بالهندسة البصرية والتصميم المستقبلي',
 impact: 'رفع إدراك القيمة السوقية للعلامة بنسبة تتجاوز 70% وخلق ولاء دائم.',
 metric: '+120 براند',
 angle: 0,
 color: '#8A2BE2',
 image: '/1.webp'
 },
 {
 id: 2,
 title: 'التسويق الرقمي',
 enTitle: 'MARKETING',
 tag: 'الحملات والإعلانات الممولة',
 iconName: 'Target',
 philosophy: 'إدارة حملات إعلانية ذكية وموجهة بدقة (Media Buying) تعتمد على البيانات والأرقام لضمان أعلى عائد على الاستثمار (ROI) عبر كافة المنصات الإعلانية.',
 deliverables: [
 'تخطيط وتنفيذ الإعلانات الممولة على (Meta, TikTok, Google, LinkedIn).',
 'استهداف الجماهير بدقة ومنع هدر الميزانيات في وصول غير فعال.',
 'إعادة الاستهداف الذكي (Retargeting) لمضاعفة معدلات التحويل.',
 'تقارير أداء دورية توضح تكلفة الاستحواذ على العميل والمبيعات المحققة.'
 ],
 goal: 'إدارة حملات إعلانية ذكية بالأرقام لتحقيق أعلى عائد استثماري ROAS',
 impact: 'خفض تكلفة الاستحواذ على العميل (CAC) بنسبة 35% ومضاعفة المبيعات المحققة.',
 metric: '5.4x ROAS',
 angle: 45,
 color: '#9333ea',
 image: '/2.webp'
 },
 {
 id: 3,
 title: 'المواقع والتجارة الإلكترونية',
 enTitle: 'WEB & E-COMMERCE',
 tag: 'المواقع وشوبيفاي وUI/UX',
 iconName: 'Layout',
 philosophy: 'برمجة وتصميم متاجر إلكترونية ومواقع تعريفية (UI/UX) سريعة، ذكية، ومصممة خصيصاً لتحويل الزوار إلى عملاء حقيقيين.',
 deliverables: [
 'تصميم واجهات مستخدم مخصصة (Custom UI/UX Design) تلائم الهوية البصرية.',
 'برمجة المتاجر الإلكترونية (Shopify / Custom E-commerce).',
 'تحسين سرعة التحميل وتجربة التصفح على مختلف الأجهزة الهواتف واللابتوب.',
 'ربط بوابات الدفع الإلكتروني وأنظمة إدارة المبيعات والتتبع.'
 ],
 goal: 'تحويل الزوار إلى عملاء فعليين عبر منصات فائقة السرعة وسلسة الشراء',
 impact: 'تقليل التخلي عن السلة بنسبة 45% وضمان زمن تحميل استثنائي متوافق مع كافة الأجهزة.',
 metric: '99.9% جاهزية',
 angle: 90,
 color: '#a855f7',
 image: '/3.webp'
 },
 {
 id: 4,
 title: 'الاستوديو والإنتاج الإبداعي',
 enTitle: 'STUDIO',
 tag: 'تصوير المنتجات والريلز',
 iconName: 'Video',
 philosophy: 'تصوير تجاري سينمائي للمنتجات، إنتاج ريلز وفيديوهات إعلانية ديناميكية داخل الاستوديو المجهز بأحدث تقنيات الإضاءة والمونتاج.',
 deliverables: [
 'التصوير التجاري والسينمائي للمنتجات والخدمات والمحلات التجارية.',
 'إنتاج ريلز وتيك توك ديناميكي وسريع يجذب ملايين المشاهدات.',
 'المونتاج الديناميكي وإضافة المؤثرات البصرية والموشن جرافيكس.',
 'تصحيح ألوان سينمائي (Color Grading) بدقة 4K فائقة.'
 ],
 goal: 'إنتاج سينمائي عالي الطاقة داخل استوديو مجهز بأحدث معدات الإضاءة والمونتاج',
 impact: 'خلق انطباع بصري فاخر يرسخ مكانة البراند ويحقق ملايين المشاهدات.',
 metric: '+2.5M مشاهدة',
 angle: 135,
 color: '#c084fc',
 image: '/4.webp'
 },
 {
 id: 5,
 title: 'المنتجات والحلول الرقمية',
 enTitle: 'DIGITAL PRODUCTS',
 tag: 'تطبيقات الويب ولوحات التحكم',
 iconName: 'Cpu',
 philosophy: 'بناء وتطوير تطبيقات ويب سحابية، بوابات إلكترونية، ولوحات تحكم مخصصة وأدوات رقمية متطورة تلبي احتياجات نمو أعمالك.',
 deliverables: [
 'تطوير تطبيقات الويب التفاعلية (Full-Stack Web Apps).',
 'تصميم وبرمجة لوحات التحكم والبوابات الإدارية المخصصة.',
 'أدوات رقمية وحلول تقنية مخصصة لأتمتة تجارب العملاء والعمليات.',
 'بنية سحابية آمنة وعالية الأداء وقابلة للتوسع المستمر.'
 ],
 goal: 'بناء منتجات وأدوات رقمية ترتقي بتشغيل مشروعك وتجربة عملائك',
 impact: 'رفع الكفاءة التشغيلية بنسبة تتجاوز 60% وتوفير تجارب رقمية لا تُنسى.',
 metric: 'Custom Engines',
 angle: 180,
 color: '#8A2BE2',
 image: '/5.webp'
 },
 {
 id: 6,
 title: 'الاستراتيجية',
 enTitle: 'STRATEGY',
 tag: 'دراسة السوق والتمركز',
 iconName: 'Compass',
 philosophy: 'تخطيط المسار ودراسة السوق وتحليل المنافسين لوضع خريطة طريق واضحة تضمن تحقيق الأهداف التجارية والتفوق التنافسي المستدام.',
 deliverables: [
 'تحليل التمركز التنافسي في السوق (Competitive Landscape Analysis).',
 'تحديد رحلة العميل واستهداف الشرائح المربحة (Audience Targeting).',
 'صياغة الرسائل التسويقية الموجهة بالدوافع الوظيفية والعاطفية للعميل.',
 'بناء خطط وباقات النمو الرقمي الشامل لتفادي تشتت الميزانية.'
 ],
 goal: 'تخطيط المسار وتحليل المنافسين لوضع خريطة طريق للتفوق التنافسي',
 impact: 'توجيه الميزانيات بدقة ومنع الهدر التسويقي مع مضاعفة كفاءة التحويل.',
 metric: '360° رؤية',
 angle: 225,
 color: '#9333ea',
 image: '/6.webp'
 },
 {
 id: 7,
 title: 'صناعة المحتوى',
 enTitle: 'CONTENT',
 tag: 'الكتابة الإعلانية والسيناريوهات',
 iconName: 'Feather',
 philosophy: 'كتابة وإبداع محتوى يتحدث بلغة جمهورك، يخلق التفاعل، ويبني الثقة لمنع السكرول العشوائي وصياغة نصوص إعلانية تحفز قرار الشراء.',
 deliverables: [
 'صياغة نصوص إعلانات تخاطب نقاط الألم لدى العميل في أول 3 ثوانٍ.',
 'كتابة سكريبتات الفيديوهات القصيرة (Reels / TikTok / Shorts).',
 'إعداد جداول المحتوى التسويقي والاستراتيجية التحريرية.',
 'صياغة كتابات المواقع والملفات التعريفية للشركات (Company Profiles).'
 ],
 goal: 'صناعة محتوى إبداعي يوقف السكرول ويخاطب نقاط الألم في أول 3 ثوانٍ',
 impact: 'مضاعفة معدلات التفاعل العضوي ومعدلات التحويل الإعلاني.',
 metric: '+15K نص وسيناريو',
 angle: 270,
 color: '#a855f7',
 image: '/7.webp'
 },
 {
 id: 8,
 title: 'النمو والتحسين',
 enTitle: 'GROWTH',
 tag: 'SEO ومعدل التحويل',
 iconName: 'TrendingUp',
 philosophy: 'منظومة توسع مستدامة تجمع بين تصدر محركات البحث (SEO)، تحسين معدل التحويل (CRO)، واستراتيجيات الاحتفاظ بالعملاء لتحقيق نمو تراكمي مستمر.',
 deliverables: [
 'تهيئة المواقع لمحركات البحث (SEO) للتصدر في نتائج البحث الأولى.',
 'تحسين معدل التحويل (CRO) وتجربة الشراء وقمع المبيعات.',
 'تحليل سلوك الزوار على الموقع وخرائط الحرارة والبيانات الحية.',
 'التطوير والتعديل المستمر للاستراتيجيات للحفاظ على الصدارة التنافسية.'
 ],
 goal: 'قراءة الأرقام وتطوير محركات البحث (SEO) ومسارات المبيعات لتحقيق نمو تراكمي مستمر',
 impact: 'تصدر نتائج البحث الأولى وزيادة القيمة الدائمة للعميل (LTV).',
 metric: '+380% نمو مستدام',
 angle: 315,
 color: '#c084fc',
 image: '/8.webp'
 }
];

export const AGENCY_METRICS = [
 { value: '+120', label: 'علامة تجارية تم بناؤها', sub: 'في مصر والشرق الأوسط' },
 { value: '4.8x', label: 'متوسط عائد الإنفاق الإعلاني', sub: 'ROAS مستدام' },
 { value: '+35M', label: 'مشاهدة عضوية وممولة', sub: 'أنتجتها أذرعنا' },
 { value: '98.5%', label: 'نسبة رضا شركاء النجاح', sub: 'علاقات شراكة ممتدة' }
];

export const AGENCY_METRICS_EN = [
 { value: '+120', label: 'Distinguished Brands Built', sub: 'In Egypt & Middle East' },
 { value: '4.8x', label: 'Average Advertising ROAS', sub: 'Sustained Capital Growth' },
 { value: '+35M', label: 'Organic & Paid Reach', sub: 'Crafted by Our 8 Arms' },
 { value: '98.5%', label: 'Partner Satisfaction Rate', sub: 'Enduring Client Trust' }
];

export const SERVICES_DATA_EN: ServiceItem[] = [
 {
 id: 'branding',
 number: '01',
 arabicNumber: '01',
 title: 'BRANDING',
 titleEn: 'Identity, Naming & Brand System',
 shortDesc: 'We craft comprehensive visual identities expressing your core essence, from logos to precision design systems.',
 fullDesc: 'We build end-to-end visual identities that engrave an unforgettable impression in your customers’ minds—from bespoke logo design and exclusive color systems to comprehensive typography guidelines.',
 iconName: 'Sparkles',
 bgImage: '/1.webp',
 deliverables: [
 'Comprehensive Logo Architecture & Scaled Assets',
 'Complete Brand Guidelines Manual',
 'Brand Voice & Persona Engineering',
 'Print & Digital Collateral Suite'
 ],
 metricsHighlight: '+120 Crowning Brands',
 tag: 'Identity & Brand System',
 innerImages: [
 '/1.webp',
 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop'
 ]
 },
 {
 id: 'marketing',
 number: '02',
 arabicNumber: '02',
 title: 'MARKETING',
 titleEn: 'Digital Marketing & Paid Media',
 shortDesc: 'We manage algorithmic paid advertising and high-engagement content ensuring top ROAS across all major platforms.',
 fullDesc: 'We steer intelligent paid campaigns across Meta, TikTok, Google, and Snapchat, fusing emotional storytelling with algorithmic targeting to achieve record ROAS.',
 iconName: 'Target',
 bgImage: '/2.webp',
 deliverables: [
 'Paid Media Management (Meta, TikTok, Google, Snap)',
 'Monthly Publishing & Creative Content Calendars',
 'High-Converting Direct Response Copy',
 'Live Dashboard Reports & Transparent Analytics'
 ],
 metricsHighlight: '5.4x Average ROAS',
 tag: 'Paid Media & Campaigns',
 innerImages: [
 '/2.webp',
 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop'
 ]
 },
 {
 id: 'web-ecommerce',
 number: '03',
 arabicNumber: '03',
 title: 'WEB & E-COMMERCE',
 titleEn: 'Websites, Shopify & UI/UX',
 shortDesc: 'Ultra-fast web platforms and digital storefronts engineered for seamless UX and peak conversion rates.',
 fullDesc: 'We engineer blazingly fast digital storefronts and web platforms (Shopify, Custom Stack, Salla, Zid) optimized for frictionless checkout, turning traffic into loyal paying customers.',
 iconName: 'Layout',
 bgImage: '/3.webp',
 deliverables: [
 'Custom UI/UX Designed for High Conversions',
 'Full Payment Gateway & Shipping Logistics Integration',
 'Core Web Vitals & Technical SEO Optimization',
 'Analytics Pixel & Server-Side Event Tracking'
 ],
 metricsHighlight: '99.9% Uptime & Velocity',
 tag: 'Websites & E-Commerce',
 innerImages: [
 '/3.webp',
 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop'
 ]
 },
 {
 id: 'studio',
 number: '04',
 arabicNumber: '04',
 title: 'STUDIO',
 titleEn: 'Product Photo, Video & Reels',
 shortDesc: 'State-of-the-art studio setup for commercial product photography, cinematic brand commercials, and viral dynamic reels.',
 fullDesc: 'Full studio capabilities for cinematic product photography, commercial video production, and high-energy vertical video (Reels, TikTok) equipped with broadcast optics and lighting.',
 iconName: 'Video',
 bgImage: '/4.webp',
 deliverables: [
 'Commercial & Cinematic Product Photography',
 'Fast-Paced, Engaging Reels & TikTok Production',
 'Professional Post-Production & Color Grading',
 'High-Energy Sound Design & VFX'
 ],
 metricsHighlight: '+2.5M Organic Views',
 tag: 'Commercial Studio',
 innerImages: [
 '/4.webp',
 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=800&auto=format&fit=crop'
 ]
 },
 {
 id: 'digital-products',
 number: '05',
 arabicNumber: '05',
 title: 'DIGITAL PRODUCTS',
 titleEn: 'Web Apps, Dashboards & Portals',
 shortDesc: 'Bespoke web applications, interactive enterprise portals, administrative dashboards, and custom digital experiences.',
 fullDesc: 'We architect and build full-stack web applications, SaaS platforms, high-performance dashboards, and custom digital tools streamlining business operations and user experiences.',
 iconName: 'Cpu',
 bgImage: '/5.webp',
 deliverables: [
 'Full-Stack Web Applications (Web Apps & SaaS)',
 'Admin Dashboards & Enterprise Portals',
 'Custom Interactive Digital Experiences',
 'Scalable & Secure Cloud Infrastructure'
 ],
 metricsHighlight: 'Custom Web Engines',
 tag: 'Digital Products & Tools',
 innerImages: [
 '/5.webp',
 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=800&auto=format&fit=crop'
 ]
 },
 {
 id: 'strategy',
 number: '06',
 arabicNumber: '06',
 title: 'STRATEGY',
 titleEn: 'Market Research & Positioning',
 shortDesc: 'Data-backed business strategies, competitor recon, and market positioning providing unfair market advantage.',
 fullDesc: 'We construct exhaustive roadmaps grounded in rigorous data analysis and competitor recon, identifying untapped blue ocean opportunities and your most profitable channels.',
 iconName: 'Compass',
 bgImage: '/6.webp',
 deliverables: [
 'In-Depth Competitor Gap & Market Analysis',
 'Brand Positioning & Value Proposition Architecture',
 'Quarterly Strategic Growth & Scaling Roadmaps',
 'Pricing Architecture & Offer Packaging'
 ],
 metricsHighlight: '360° Predictive Vision',
 tag: 'Strategy & Positioning',
 innerImages: [
 '/6.webp',
 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop'
 ]
 },
 {
 id: 'content',
 number: '07',
 arabicNumber: '07',
 title: 'CONTENT',
 titleEn: 'Copywriting & Scriptwriting',
 shortDesc: 'Persuasive marketing copy, viral short-form video scripts, and brand storytelling engineered to convert.',
 fullDesc: 'We craft high-converting copy and director-ready video scripts connecting emotionally with your audience, turning random scrollers into dedicated brand advocates.',
 iconName: 'Feather',
 bgImage: '/7.webp',
 deliverables: [
 'Viral Reels & TikTok Video Scriptwriting',
 'Persuasive Landing Page Copywriting',
 'Omnichannel Editorial Calendars & Storytelling',
 'High-Impact Direct Response Ad Copy'
 ],
 metricsHighlight: '+15K Scripts & Texts',
 tag: 'Creative Copywriting',
 innerImages: [
 '/7.webp',
 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=800&auto=format&fit=crop'
 ]
 },
 {
 id: 'growth',
 number: '08',
 arabicNumber: '08',
 title: 'GROWTH',
 titleEn: 'SEO, CRO & Retention',
 shortDesc: 'Continuous full-funnel expansion combining high-intent SEO, conversion rate optimization (CRO), and retention loops.',
 fullDesc: 'Continuous performance optimization and growth hacking frameworks designed to expand your market footprint, maximize LTV, and maintain high capital efficiency.',
 iconName: 'TrendingUp',
 bgImage: '/8.webp',
 deliverables: [
 'Advanced Search Engine Optimization (SEO)',
 'Conversion Rate Optimization (CRO)',
 'Retention Systems & LTV Expansion',
 'Automated Sales & Follow-Up Funnels'
 ],
 metricsHighlight: '+380% Average Expansion',
 tag: 'Growth & Optimization',
 innerImages: [
 '/8.webp',
 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop',
 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop'
 ]
 }
];

export const EIGHT_ARMS_DATA_EN: ArmData[] = [
 {
 id: 1,
 title: 'First Arm: BRANDING',
 enTitle: 'BRANDING',
 tag: 'Identity & Brand System',
 iconName: 'Sparkles',
 philosophy: 'Building integrated visual identities that capture brand personality and linger in consumer minds. We employ "Visual Engineering" replacing obsolete templates with futuristic, high-tech aesthetics.',
 deliverables: [
 '3D Emblems & marks integrated with digital brand assets.',
 'Brand Color Palette & High-Tech visual guidelines.',
 'Precision Typography Systems & architectural font hierarchy.',
 'Commercial print, collateral, packaging, and social media kits.'
 ],
 goal: 'Engrave an indelible brand identity in customer minds via visual engineering',
 impact: 'Elevate perceived market valuation by over 70% and foster long-term loyalty.',
 metric: '+120 Brands',
 angle: 0,
 color: '#8A2BE2',
 image: '/1.webp'
 },
 {
 id: 2,
 title: 'Second Arm: MARKETING',
 enTitle: 'MARKETING',
 tag: 'Digital Marketing & Paid Media',
 iconName: 'Target',
 philosophy: 'Managing intelligent, data-driven paid advertising (Media Buying) optimizing algorithms for peak Return on Investment (ROI) across Meta, TikTok, Google, and beyond.',
 deliverables: [
 'Full-funnel paid campaigns across Meta, TikTok, Google, and LinkedIn.',
 'Precision audience targeting eliminating ad spend waste.',
 'Smart multi-tier retargeting multiplying conversion rates.',
 'Periodic analytical reports detailing Customer Acquisition Cost & ROAS.'
 ],
 goal: 'Drive algorithmic advertising maximizing ROAS and scaling revenue',
 impact: 'Slash CAC by 35% while expanding qualified transaction volume.',
 metric: '5.4x ROAS',
 angle: 45,
 color: '#9333ea',
 image: '/2.webp'
 },
 {
 id: 3,
 title: 'Third Arm: WEB & E-COMMERCE',
 enTitle: 'WEB & E-COMMERCE',
 tag: 'Websites & E-Commerce',
 iconName: 'Layout',
 philosophy: 'Engineering lightning-fast online stores and conversion-focused websites (UI/UX) custom-built to convert visitors into paying customers.',
 deliverables: [
 'Bespoke UI/UX design matching brand aesthetic guidelines.',
 'Custom storefront development (Shopify / Custom Stacks).',
 'Core Web Vitals acceleration across mobile and desktop devices.',
 'Seamless payment gateway, tracking, and order fulfillment integration.'
 ],
 goal: 'Turn traffic into recurring buyers with ultra-responsive UX',
 impact: 'Cut cart abandonment by 45% with sub-second page loads.',
 metric: '99.9% Uptime',
 angle: 90,
 color: '#a855f7',
 image: '/3.webp'
 },
 {
 id: 4,
 title: 'Fourth Arm: STUDIO',
 enTitle: 'STUDIO',
 tag: 'Commercial Studio & Reels',
 iconName: 'Video',
 philosophy: 'Commercial product photography, high-energy dynamic reels, and cinematic brand commercials produced inside our broadcast studio.',
 deliverables: [
 'Cinematic commercial and macro product photography.',
 'Fast-paced, dynamic Reels and TikTok video productions.',
 'Dynamic post-production, sound engineering, and visual effects.',
 'Pristine 4K DaVinci color grading delivering broadcast masters.'
 ],
 goal: 'Cinematic visual assets produced inside our specialized studio',
 impact: 'Cultivate elite brand prestige generating millions of organic impressions.',
 metric: '+2.5M Views',
 angle: 135,
 color: '#c084fc',
 image: '/4.webp'
 },
 {
 id: 5,
 title: 'Fifth Arm: DIGITAL PRODUCTS',
 enTitle: 'DIGITAL PRODUCTS',
 tag: 'Web Apps & Portals',
 iconName: 'Cpu',
 philosophy: 'Engineering bespoke web applications, enterprise portals, dashboards, and digital tools tailored for operational excellence and custom user experiences.',
 deliverables: [
 'Full-stack interactive web application architecture (Web Apps & SaaS).',
 'Live data administration dashboards and enterprise portals.',
 'Custom digital tools automating unique business workflows.',
 'Scalable and secure cloud infrastructure with enterprise-grade auth.'
 ],
 goal: 'Architect digital products elevating business execution and customer satisfaction',
 impact: 'Accelerate operational output by 60% with tailored digital tools.',
 metric: 'Custom Engines',
 angle: 180,
 color: '#8A2BE2',
 image: '/5.webp'
 },
 {
 id: 6,
 title: 'Sixth Arm: STRATEGY',
 enTitle: 'STRATEGY',
 tag: 'Market Strategy & Positioning',
 iconName: 'Compass',
 philosophy: 'Trajectory planning, competitor recon, and market analysis establishing a crystal-clear roadmap ensuring business objectives and competitive supremacy.',
 deliverables: [
 'Competitive Landscape Analysis & market positioning.',
 'Customer Journey Mapping & high-intent audience targeting.',
 'Strategic value proposition & emotionally resonant messaging.',
 'Comprehensive digital growth blueprints avoiding budget dispersion.'
 ],
 goal: 'Plot exact trajectory and outmaneuver competitors with data clarity',
 impact: 'Direct allocation precision preventing ad waste while doubling conversion.',
 metric: '360° Vision',
 angle: 225,
 color: '#9333ea',
 image: '/6.webp'
 },
 {
 id: 7,
 title: 'Seventh Arm: CONTENT',
 enTitle: 'CONTENT',
 tag: 'Copywriting & Scriptwriting',
 iconName: 'Feather',
 philosophy: 'Crafting content that speaks your audience’s language, sparks genuine engagement, and builds trust to stop random scrolling and trigger buying decisions.',
 deliverables: [
 'Direct-response ad copy addressing pain points within 3 seconds.',
 'Viral short-form video scripts (Reels / TikTok / YouTube Shorts).',
 'Comprehensive weekly and monthly editorial content calendars.',
 'High-impact company profiles and website storytelling.'
 ],
 goal: 'Craft scroll-stopping words that address pain points in 3 seconds',
 impact: 'Double engagement rates and amplify ad conversion velocity.',
 metric: '+15K Scripts',
 angle: 270,
 color: '#a855f7',
 image: '/7.webp'
 },
 {
 id: 8,
 title: 'Eighth Arm: GROWTH',
 enTitle: 'GROWTH',
 tag: 'SEO, CRO & Retention',
 iconName: 'TrendingUp',
 philosophy: 'Continuously reading data signals and analyzing performance combined with SEO and CRO to amplify results and compound brand expansion.',
 deliverables: [
 'Comprehensive Search Engine Optimization (SEO) for top SERP rankings.',
 'Conversion Rate Optimization (CRO) and sales funnel architecture.',
 'On-site behavioral heatmaps and analytics telemetry.',
 'Retention loops and Customer Lifetime Value (LTV) maximization.'
 ],
 goal: 'Interpret real data and optimize SEO & funnels for compounding growth',
 impact: 'Secure top search positions and substantially increase Lifetime Value (LTV).',
 metric: '+380% Scaling',
 angle: 315,
 color: '#c084fc',
 image: '/8.webp'
 }
];

export const PROJECTS_DATA_EN: ProjectItem[] = [
 {
 id: 'ladies-shop',
 slug: 'ladies-shop',
 title: 'Ladies Shop',
 titleEn: 'Ladies Shop',
 category: 'Brand Identity & E-Commerce',
 tag: 'Beauty & Skincare',
 summary: 'An ongoing strategic partnership with Ladies Shop luxury beauty brand: We crafted the entire visual identity from the original logo design onward, developed the custom e-commerce storefront (www.ladiesshop-store.com), executed professional product photography and social media poster designs, and managed paid advertising and market growth strategies.',
 heroImage: '/projects/ladies-caver1.webp',
 logo: '/projects/logo L.webp',
 websiteUrl: 'https://www.ladiesshop-store.com',
 brandColors: [
   { hex: '#E91E63', name: 'وردي ليديز', nameEn: 'Signature Rose Pink' },
   { hex: '#D4A397', name: 'روز جولد', nameEn: 'Warm Rose Gold' },
   { hex: '#F8BBD0', name: 'بلش ناعم', nameEn: 'Soft Petal Blush' },
   { hex: '#141218', name: 'أسود مخملي', nameEn: 'Velvet Obsidian' }
 ],
 gallery: [
 '/projects/LW1.webp',
 '/projects/Lw2.webp',
 '/projects/L1.webp',
 '/projects/L2.webp',
 '/projects/L3.webp',
 '/projects/L4.webp'
 ],
 client: 'Ladies Shop',
 duration: 'Ongoing Strategic Partnership',
 location: 'Egypt',
 year: '2025 - 2026',
 metricHighlight: {
 value: '+340%',
 label: 'Monthly Sales Growth'
 },
 metricsRow: {
 val1: '+340%',
 lbl1: 'Sales Growth',
 val2: 'Ongoing',
 lbl2: 'Partnership',
 val3: 'Egypt',
 lbl3: 'Location'
 },
 scopeOfWork: [
 'Full visual brand identity created from scratch (including official logo & guidelines)',
 'High-performance e-commerce website development (www.ladiesshop-store.com)',
 'Professional product photography and creative artistic compositions',
 'Social media poster campaigns and visual banners ',
 'Paid advertising campaigns across social media channels',
 'Market expansion strategy and continuous long-term growth management'
 ],
 challenge: 'Establishing a prestigious brand presence in the competitive skincare and beauty sector, backed by a frictionless e-commerce shop, compelling product visuals, and high-converting campaigns.',
 solution: 'Engineered an end-to-end ecosystem from the ground up: distinctive logo identity, lightning-fast online store, striking photography, and targeted ad funnels that multiplied monthly sales.',
 stats: [
 { label: 'Monthly Sales Growth', value: '+340%', sublabel: 'Within the first 90 days' },
 { label: 'Store Conversion Rate', value: '4.8%', sublabel: 'Frictionless checkout UX' },
 { label: 'Return on Ad Spend', value: '5.4x', sublabel: 'ROAS across social campaigns' },
 { label: 'Partnership Status', value: 'Active', sublabel: 'Continuous growth & support' }
 ],
 deliverables: [
 'Complete brand identity system & official logo ',
 'Official e-commerce storefront (www.ladiesshop-store.com)',
 'Professional product photography and social campaign posters',
 'Performance marketing management & expansion blueprint'
 ],
 quote: {
 text: 'Our strategic partnership with Pulse OCTO from logo design to store launch and ongoing campaigns has been the definitive catalyst for Ladies Shop growth.',
 author: 'Ladies Shop Executive Team',
 role: 'Brand Leadership'
 },
 techStack: [
 {
 name: 'React & High-Speed E-Commerce Engine',
 category: 'Storefront Engineering & Infra',
 iconName: 'Code2',
 description: 'High-performance web storefront ensuring instant checkout and seamless mobile-first responsiveness.',
 descriptionEn: 'High-performance web storefront ensuring instant checkout and seamless mobile-first responsiveness.'
 },
 {
 name: 'Adobe Creative Suite & Figma',
 category: 'Brand Identity & Design System',
 iconName: 'Palette',
 description: 'Created official brandmark, premium color palette, typography systems, and social banners.',
 descriptionEn: 'Created official brandmark, premium color palette, typography systems, and social banners.'
 },
 {
 name: 'Professional Studio Optics & Macro Gear',
 category: 'Product Photography & Content Production',
 iconName: 'Camera',
 description: 'Commercial studio product photography showcasing pristine skincare textures and luxury package appeal.',
 descriptionEn: 'Commercial studio product photography showcasing pristine skincare textures and luxury package appeal.'
 },
 {
 name: 'Meta Ads Manager & TikTok Marketing',
 category: 'Paid Performance Media Buying',
 iconName: 'TrendingUp',
 description: 'Full-funnel paid advertising targeting beauty enthusiasts with multi-tiered retargeting generating 5.4x ROAS.',
 descriptionEn: 'Full-funnel paid advertising targeting beauty enthusiasts with multi-tiered retargeting generating 5.4x ROAS.'
 },
 {
 name: 'Google Analytics 4 & Conversion Tracking',
 category: 'CRO Analytics & Heatmaps',
 iconName: 'BarChart3',
 description: 'Conversion rate optimization, heatmaps, and funnel telemetry elevating conversion rate to 4.8%.',
 descriptionEn: 'Conversion rate optimization, heatmaps, and funnel telemetry elevating conversion rate to 4.8%.'
 }
 ],
 strategyDetails: [
 {
 phase: 'Phase 01',
 phaseEn: 'Phase 01',
 title: 'Brand Discovery & Visual Brandmark ',
 titleEn: 'Brand Discovery & Visual Brandmark ',
 description: 'In-depth market research of regional skincare and luxury cosmetics, formulating a timeless visual identity that radiates sophistication.',
 bullets: [
 'Design of the signature brandmark and responsive digital variants',
 'Selection of luxury typography pairing and warm neutral palette',
 'Full brand guideline documentation for packaging and merchandising'
 ]
 },
 {
 phase: 'Phase 02',
 phaseEn: 'Phase 02',
 title: 'E-Commerce Architecture (www.ladiesshop-store.com)',
 titleEn: 'E-Commerce Architecture (www.ladiesshop-store.com)',
 description: 'Engineering a high-performance storefront optimized for rapid loading, intuitive category browsing, and friction-free checkout.',
 bullets: [
 'Electronic payment gateways and verified cash-on-delivery integration',
 'Dynamic multi-category filtering (skincare, hair care, fragrance, beauty tools)',
 '100% mobile-first checkout workflow optimization'
 ]
 },
 {
 phase: 'Phase 03',
 phaseEn: 'Phase 03',
 title: 'Commercial Product Photography & Campaign Posters',
 titleEn: 'Commercial Product Photography & Campaign Posters',
 description: 'High-end studio photography capturing ingredient clarity and elegant packaging, paired with high-converting social media creatives.',
 bullets: [
 'High-resolution macro studio captures highlighting pristine product details',
 'Strategic promotional banners with compelling value propositions',
 'Harmonized social media aesthetic and feed templates'
 ]
 },
 {
 phase: 'Phase 04',
 phaseEn: 'Phase 04',
 title: 'Paid Acquisition Funnel & Audience Scaling',
 titleEn: 'Paid Acquisition Funnel & Audience Scaling',
 description: 'Multi-tiered advertising funnels across Instagram, Facebook, and TikTok targeting high-intent beauty shoppers with data-driven retargeting.',
 bullets: [
 'Precision demographic and interest targeting in cosmetics & self-care',
 'Dynamic retargeting for store visitors and abandoned cart recovery',
 'Over 340% sustained monthly sales increase within initial launch window'
 ]
 },
 {
 phase: 'Phase 05',
 phaseEn: 'Phase 05',
 title: 'Continuous Strategic Scaling (Active Today)',
 titleEn: 'Continuous Strategic Scaling (Active Today)',
 description: 'Long-term partnership managing seasonal promotions, storefront feature enhancements, and continuous conversion rate optimization.',
 bullets: [
 'Ongoing agile iterations on storefront UI and marketing collateral',
 'Seasonal campaign playbooks for holidays and peak retail cycles',
 '24/7 dedicated creative and technical engineering support'
 ]
 }
 ],
 assetShowcase: [
 {
 url: '/projects/ladies-caver1.webp',
 title: 'Project Hero & Brand Identity Cover',
 titleEn: 'Project Hero & Brand Identity Cover',
 type: 'cover',
 description: 'The primary approved key-visual representing Ladies Shop luxury positioning.',
 descriptionEn: 'The primary approved key-visual representing Ladies Shop luxury positioning.'
 },
 {
 url: '/projects/logo L.webp',
 title: 'Official Approved Brandmark ',
 titleEn: 'Official Approved Brandmark ',
 type: 'brand',
 description: 'Custom brandmark designed for timeless beauty, seamless product embossing, and digital clarity.',
 descriptionEn: 'Custom brandmark designed for timeless beauty, seamless product embossing, and digital clarity.'
 },
 {
 url: '/projects/LW1.webp',
 title: 'E-Commerce Storefront - Main Banner & Catalog',
 titleEn: 'E-Commerce Storefront - Main Banner & Catalog',
 type: 'storefront',
 description: 'Custom online store interface with optimized hero catalog layout and rapid navigation.',
 descriptionEn: 'Custom online store interface with optimized hero catalog layout and rapid navigation.'
 },
 {
 url: '/projects/Lw2.webp',
 title: 'E-Commerce Storefront - Categories & Shopping Flow',
 titleEn: 'E-Commerce Storefront - Categories & Shopping Flow',
 type: 'storefront',
 description: 'Streamlined category discovery and frictionless add-to-cart purchasing flow.',
 descriptionEn: 'Streamlined category discovery and frictionless add-to-cart purchasing flow.'
 },
 {
 url: '/projects/L1.webp',
 title: 'Luxury Skincare Radiance Campaign',
 titleEn: 'Luxury Skincare Radiance Campaign',
 type: 'poster',
 platform: 'Instagram',
 postUrl: 'https://www.ladiesshop-store.com',
 description: 'High-converting advertising creative highlighting key skincare benefits.',
 descriptionEn: 'High-converting advertising creative highlighting key skincare benefits.'
 },
 {
 url: '/projects/L2.webp',
 title: 'Signature Beauty & Elegance Collection',
 titleEn: 'Signature Beauty & Elegance Collection',
 type: 'poster',
 platform: 'Facebook',
 postUrl: 'https://www.ladiesshop-store.com',
 description: 'Artistic campaign banner pairing brand color harmony with vivid photography.',
 descriptionEn: 'Artistic campaign banner pairing brand color harmony with vivid photography.'
 },
 {
 url: '/projects/L3.webp',
 title: 'Daily Glow Routine — Essential Care',
 titleEn: 'Daily Glow Routine — Essential Care',
 type: 'poster',
 platform: 'Instagram',
 postUrl: 'https://www.ladiesshop-store.com',
 description: 'Engagement-driven poster optimized for click-through rate across social channels.',
 descriptionEn: 'Engagement-driven poster optimized for click-through rate across social channels.'
 },
 {
 url: '/projects/L4.webp',
 title: 'Seasonal Offers & Exclusive Bundles',
 titleEn: 'Seasonal Offers & Exclusive Bundles',
 type: 'poster',
 platform: 'Facebook',
 postUrl: 'https://www.ladiesshop-store.com',
 description: 'Promotional sales creative engineered to maximize conversion volume.',
 descriptionEn: 'Promotional sales creative engineered to maximize conversion volume.'
 }
 ],
 externalPostLinks: [
   {
     id: 'ls-post-1',
     title: 'منشور إطلاق تشكيلة العناية الفاخرة — تفاعل ومبيعات مباشرة',
     titleEn: 'Luxury Skincare Collection Launch Post — Live Feed',
     platform: 'Instagram',
     url: 'https://www.ladiesshop-store.com',
     tag: 'حملة إنستغرام الرسمية',
     tagEn: 'Official Instagram Campaign'
   },
   {
     id: 'ls-post-2',
     title: 'بوست باقات التوفير والعروض الموسمية — أعلى معدل تحويل',
     titleEn: 'Seasonal Beauty Bundles Promotional Post — High ROAS',
     platform: 'Facebook',
     url: 'https://www.ladiesshop-store.com',
     tag: 'إعلان فيسبوك ممول',
     tagEn: 'Sponsored Facebook Post'
   },
   {
     id: 'ls-post-3',
     title: 'كتالوج المنتجات والمتجر الإلكتروني الرسمي — تصفح مباشر',
     titleEn: 'Official Online Storefront & Product Catalog',
     platform: 'Website',
     url: 'https://www.ladiesshop-store.com',
     tag: 'المتجر الرسمي',
     tagEn: 'Live Storefront'
   }
 ]
 },
 {
 id: 'zeyad-optical',
 slug: 'zeyad-optical',
 title: 'Zeyad Optical',
 titleEn: 'Zeyad Optical',
 category: 'Brand Identity, Eyewear Photography & Media Buying',
 tag: 'Eyewear & Optics',
 summary: 'A comprehensive brand transformation for Zeyad Optical: We engineered the entire visual identity system from scratch, executed commercial studio eyewear photography with live modeling to exhibit frame aesthetics on face, created engaging social media posters with strategic copy & captions, and trained the client directly on professional eyewear photography while directing high-converting paid campaigns.',
 heroImage: '/projects/ZCover.webp',
 logo: '/projects/zeyad-logo.webp',
 brandColors: [
   { hex: '#08193B', name: 'كحلي ملكي', nameEn: 'Royal Navy' },
   { hex: '#D4AF37', name: 'ذهبي معدني', nameEn: 'Metallic Gold' },
   { hex: '#F5E6C8', name: 'شامبين دافئ', nameEn: 'Warm Champagne' },
   { hex: '#040D21', name: 'كحلي عميق', nameEn: 'Deep Midnight Navy' }
 ],
 gallery: [
 '/projects/zeyad-logo.webp',
 '/projects/ZS1.webp',
 '/projects/ZS2.webp',
 '/projects/ZS3.webp',
 '/projects/ZP (1).webp',
 '/projects/ZP (2).webp',
 '/projects/ZP (3).webp',
 '/projects/ZP (4).webp',
 '/projects/ZP (6).webp',
 '/projects/ZP (7).webp',
 '/projects/ZP (8).webp',
 '/projects/ZP (9).webp'
 ],
 client: 'Zeyad Optical',
 duration: 'Full Turnkey Execution & Coaching',
 location: 'Egypt',
 year: '2025 - 2026',
 metricHighlight: {
 value: '720+',
 label: 'Frames Sold During Campaign'
 },
 metricsRow: {
 val1: '720+',
 lbl1: 'Eyewear Sold',
 val2: '11 Assets',
 lbl2: 'Verified Assets',
 val3: 'Egypt',
 lbl3: 'Location'
 },
 scopeOfWork: [
 'Complete visual brand identity system created from the ground up',
 'Commercial studio product photography for prescription and sunglasses ',
 'Live in-house modeling wearing eyewear styles to demonstrate authentic fit and appeal',
 'High-impact social media campaign poster designs',
 'Strategic copywriting and engaging conversion captions for social posts',
 'Hands-on photography coaching enabling the client to photograph future collections',
 'Targeted paid advertising management across Instagram and Facebook'
 ],
 challenge: 'Showcasing luxury eyewear materials and lens clarity without reflective glare, demonstrating true facial fit to motivate orders, and instilling permanent photography expertise within the client’s team.',
 solution: 'Delivered an integrated package: sophisticated brand styling, glare-free optical photography paired with live modeling, persuasive posters with high-converting captions, and one-on-one client training.',
 stats: [
 { label: 'Campaign Sales Volume', value: '720+', sublabel: 'Frames and lenses sold' },
 { label: 'Audience Reach', value: '1.4M', sublabel: 'Targeted ads and organic buzz' },
 { label: 'Branch In-Store Visits', value: '+410%', sublabel: 'During launch period' },
 { label: 'Client Training Mastery', value: '100%', sublabel: 'Self-sufficient photography' }
 ],
 deliverables: [
 'Full visual brand identity guideline and design kit',
 'Commercial eyewear studio photography & live modeling',
 'Complete social media poster series & strategic copywriting',
 'Hands-on product photography training for the client',
 'Paid social media advertising management'
 ],
 quote: {
 text: 'The photography, live modeling, and social posters transformed our revenue, and the personal training on how to shoot glasses ourselves gave us skills we use every single week!',
 author: 'Management Team',
 role: 'Zeyad Optical'
 },
 techStack: [
 {
 name: 'Studio Lighting & Anti-Reflection Optics',
 category: 'Product Photography & Lighting Rigs',
 iconName: 'Camera',
 description: 'Specialized studio lighting and polarization rigs capturing lens tint and frame textures without harsh glares.',
 descriptionEn: 'Specialized studio lighting and polarization rigs capturing lens tint and frame textures without harsh glares.'
 },
 {
 name: 'Live Eyewear Modeling & Lifestyle Framing',
 category: 'Live Modeling & Human Styling',
 iconName: 'Palette',
 description: 'Live modeling of optical and sunglasses styles, providing customers with authentic facial fit perspective.',
 descriptionEn: 'Live modeling of optical and sunglasses styles, providing customers with authentic facial fit perspective.'
 },
 {
 name: 'Adobe Photoshop & Illustrator',
 category: 'Visual Identity & Creative Posters',
 iconName: 'Code2',
 description: 'Engineered full brand identity and social media poster series matching contemporary fashion aesthetics.',
 descriptionEn: 'Engineered full brand identity and social media poster series matching contemporary fashion aesthetics.'
 },
 {
 name: 'Strategic Copywriting & Caption Engineering',
 category: 'Creative Copywriting & Captions',
 iconName: 'TrendingUp',
 description: 'High-converting ad copy and social captions detailing UV protection, frame ergonomics, and style tips.',
 descriptionEn: 'High-converting ad copy and social captions detailing UV protection, frame ergonomics, and style tips.'
 },
 {
 name: 'Client Photography Mentorship Workshop',
 category: 'Knowledge Transfer & Skill Training',
 iconName: 'BarChart3',
 description: 'Hands-on practical training enabling the client to photograph future optical collections with commercial precision.',
 descriptionEn: 'Hands-on practical training enabling the client to photograph future optical collections with commercial precision.'
 }
 ],
 strategyDetails: [
 {
 phase: 'Phase 01',
 phaseEn: 'Phase 01',
 title: 'Brand Identity Architecture & Visual System',
 titleEn: 'Brand Identity Architecture & Visual System',
 description: 'Constructing an elegant visual identity showcasing frame craftsmanship and premium optical clarity.',
 bullets: [
 'Brandmark formulation and packaging applications on cases and cloths',
 'Standardized color palette and high-fashion typography rules',
 'Harmonized visual guidelines across all digital and retail touchpoints'
 ]
 },
 {
 phase: 'Phase 02',
 phaseEn: 'Phase 02',
 title: 'Eyewear Studio Shoots & Live Modeling Sessions',
 titleEn: 'Eyewear Studio Shoots & Live Modeling Sessions',
 description: 'High-definition studio product captures along with live modeling to provide real-world perspective for buyers.',
 bullets: [
 'Anti-reflection photography detailing hinges, nose pads, and finishes',
 'Live facial modeling exhibiting frame ergonomics and style aesthetics',
 'High-end color grading and digital lens retouching'
 ]
 },
 {
 phase: 'Phase 03',
 phaseEn: 'Phase 03',
 title: 'Social Media Poster Design & Strategic Copywriting',
 titleEn: 'Social Media Poster Design & Strategic Copywriting',
 description: 'Designing a dynamic promotional poster collection optimized for Instagram and Facebook feeds with conversion copy.',
 bullets: [
 'Series of engaging creative posters with striking visual hierarchy',
 'Compelling social captions addressing UV protection, face shapes, and offers',
 'Modular social media templates for repeatable promotional launches'
 ]
 },
 {
 phase: 'Phase 04',
 phaseEn: 'Phase 04',
 title: 'Client Photography Coaching & Skill Transfer',
 titleEn: 'Client Photography Coaching & Skill Transfer',
 description: 'Direct interactive workshop teaching the store owner and team how to photograph new arrivals with commercial quality.',
 bullets: [
 'Optimal camera and smartphone angles for optical frames and shades',
 'Diffusion and lighting techniques to banish unwanted glass glare',
 'Composition secrets to emphasize temple detailing and frame build'
 ]
 },
 {
 phase: 'Phase 05',
 phaseEn: 'Phase 05',
 title: 'Paid Acquisition & Retail Branch Growth Blitz',
 titleEn: 'Paid Acquisition & Retail Branch Growth Blitz',
 description: 'Precision geo-targeted and demographic advertising campaigns driving orders online and high-foot-traffic branch bookings.',
 bullets: [
 'Targeted ad funnels appealing to luxury sunglasses and prescription seekers',
 'High-tempo promotional campaign generating 720+ sales',
 'Over 410% surge in optical branch consultation bookings'
 ]
 }
 ],
 assetShowcase: [
 {
 url: '/projects/zeyad-logo.webp',
 title: 'Official Zeyad Optical Brandmark',
 titleEn: 'Official Zeyad Optical Brandmark',
 type: 'brand',
 description: 'Official gold-on-navy emblem for Zeyad Optical Shop seamlessly integrating the brand name within a signature eyewear frame.',
 descriptionEn: 'Official gold-on-navy emblem for Zeyad Optical Shop seamlessly integrating the brand name within a signature eyewear frame.'
 },
 {
 url: '/projects/ZCover.webp',
 title: 'Official Campaign Cover & Visual Showcase ',
 titleEn: 'Official Campaign Cover & Visual Showcase ',
 type: 'cover',
 description: 'The primary cinematic key visual cover representing the Zeyad Optical eyewear campaign.',
 descriptionEn: 'The primary cinematic key visual cover representing the Zeyad Optical eyewear campaign.'
 },
 {
 url: '/projects/ZS1.webp',
 title: 'Eyewear Studio Product Photography',
 titleEn: 'Eyewear Studio Product Photography',
 type: 'storefront',
 description: 'High-detail commercial studio shot highlighting frame reflections and lens purity.',
 descriptionEn: 'High-detail commercial studio shot highlighting frame reflections and lens purity.'
 },
 {
 url: '/projects/ZS2.webp',
 title: 'Eyewear Studio Product Photography',
 titleEn: 'Eyewear Studio Product Photography',
 type: 'storefront',
 description: 'Precision angled photography displaying temple curvature and frame craftsmanship.',
 descriptionEn: 'Precision angled photography displaying temple curvature and frame craftsmanship.'
 },
 {
 url: '/projects/ZS3.webp',
 title: 'Eyewear Studio Product Photography',
 titleEn: 'Eyewear Studio Product Photography',
 type: 'storefront',
 description: 'Cinematic studio framing emphasizing color vibrance, lightweight frame, and ergonomic comfort.',
 descriptionEn: 'Cinematic studio framing emphasizing color vibrance, lightweight frame, and ergonomic comfort.'
 },
 {
 url: '/projects/ZP (1).webp',
 title: 'Signature Sunglasses Collection',
 titleEn: 'Signature Sunglasses Collection',
 type: 'poster',
 platform: 'Facebook',
 description: 'High-impact promotional poster spotlighting designer sunglasses appeal.',
 descriptionEn: 'High-impact promotional poster spotlighting designer sunglasses appeal.'
 },
 {
 url: '/projects/ZP (2).webp',
 title: 'Lightweight Modern Prescription Frames',
 titleEn: 'Lightweight Modern Prescription Frames',
 type: 'poster',
 platform: 'Instagram',
 description: 'Contemporary social graphic harmonizing brand aesthetic with optical frame styles.',
 descriptionEn: 'Contemporary social graphic harmonizing brand aesthetic with optical frame styles.'
 },
 {
 url: '/projects/ZP (3).webp',
 title: 'UV400 Protection & Crystal Lens Clarity',
 titleEn: 'UV400 Protection & Crystal Lens Clarity',
 type: 'poster',
 platform: 'Facebook',
 description: 'Marketing poster combining professional photography with persuasive conversion copy.',
 descriptionEn: 'Marketing poster combining professional photography with persuasive conversion copy.'
 },
 {
 url: '/projects/ZP (4).webp',
 title: 'Timeless Frame Fit & Lifestyle',
 titleEn: 'Timeless Frame Fit & Lifestyle',
 type: 'poster',
 platform: 'Instagram',
 description: 'Dynamic social visual framed to emphasize frame curves and customer lifestyle.',
 descriptionEn: 'Dynamic social visual framed to emphasize frame curves and customer lifestyle.'
 },
 {
 url: '/projects/ZP (6).webp',
 title: 'New Arrival Blitz Campaign',
 titleEn: 'New Arrival Blitz Campaign',
 type: 'poster',
 platform: 'Facebook',
 description: 'Engagement-driven poster tailored for Instagram feed conversion and retail inquiries.',
 descriptionEn: 'Engagement-driven poster tailored for Instagram feed conversion and retail inquiries.'
 },
 {
 url: '/projects/ZP (7).webp',
 title: 'Everyday Executive Optical Elegance',
 titleEn: 'Everyday Executive Optical Elegance',
 type: 'poster',
 platform: 'Instagram',
 description: 'Refined creative composition highlighting daily elegance of prescription eyewear.',
 descriptionEn: 'Refined creative composition highlighting daily elegance of prescription eyewear.'
 },
 {
 url: '/projects/ZP (8).webp',
 title: 'Stand Out in Style — Zeyad Optical',
 titleEn: 'Stand Out in Style — Zeyad Optical',
 type: 'poster',
 platform: 'Facebook',
 description: 'Sales activation poster designed to accelerate new collection bookings.',
 descriptionEn: 'Sales activation poster designed to accelerate new collection bookings.'
 },
 {
 url: '/projects/ZP (9).webp',
 title: 'Craftsmanship in Every Optical Detail',
 titleEn: 'Craftsmanship in Every Optical Detail',
 type: 'poster',
 platform: 'Instagram',
 description: 'Culminating promotional showcase summarizing Zeyad Optical premier collection.',
 descriptionEn: 'Culminating promotional showcase summarizing Zeyad Optical premier collection.'
 }
 ],
 externalPostLinks: [
   {
     id: 'zo-post-1',
     title: 'منشور حملة الكولكشن الجديد والموديلينج الحي — نظارات زياد',
     titleEn: 'New Collection & Live Modeling Campaign Post — Zeyad Optical',
     platform: 'Facebook',
     url: 'https://www.facebook.com',
     tag: 'حملة 720+ نظارة مباعة',
     tagEn: '720+ Frames Sold Campaign'
   },
   {
     id: 'zo-post-2',
     title: 'سلسلة بوستات استوديو تصوير النظارات الطبية والشمسية',
     titleEn: 'Studio Optical & Sunglasses Showcase Carousel',
     platform: 'Instagram',
     url: 'https://www.instagram.com',
     tag: 'تفاعل 1.4M وصول',
     tagEn: '1.4M Reach Showcase'
   }
 ]
 },
 {
 id: 'namaa-academy',
 slug: 'namaa-academy',
 title: 'Al-Namaa Academy',
 titleEn: 'Al-Namaa Academy',
 category: 'Visual Identity & Special Education Strategy',
 categoryEn: 'Visual Identity & Special Education Strategy',
 tag: 'Child Rehabilitation & Specialized Daycare',
 tagEn: 'Child Rehabilitation & Specialized Daycare',
 summary: 'Strategic branding, positioning, and digital roadmap for Al-Namaa Academy for Special Education—a specialized institution dedicated to educating and rehabilitating children with special needs toward natural integration, guiding parents on effective nurturing, and operating a specialized morning nursery alongside interactive skill-building courses. The engagement delivered a brand-new logo, visual identity system, official banner, and promotional poster, with ongoing execution on operational strategy, competitor intelligence in surrounding regions, and high-conversion landing page followed by a comprehensive educational web platform.',
 summaryEn: 'Strategic branding, positioning, and digital roadmap for Al-Namaa Academy for Special Education—a specialized institution dedicated to educating and rehabilitating children with special needs toward natural integration, guiding parents on effective nurturing, and operating a specialized morning nursery alongside interactive skill-building courses. The engagement delivered a brand-new logo, visual identity system, official banner, and promotional poster, with ongoing execution on operational strategy, competitor intelligence in surrounding regions, and high-conversion landing page followed by a comprehensive educational web platform.',
 heroImage: '/projects/n-paner.webp',
 logo: '/projects/n-logo.webp',
 brandColors: [
   { hex: '#0F4C3A', name: 'أخضر زمردي', nameEn: 'Deep Emerald' },
   { hex: '#D49B35', name: 'ذهبي دافئ', nameEn: 'Warm Gold' },
   { hex: '#2E7D5B', name: 'أخضر النماء', nameEn: 'Growth Sage' },
   { hex: '#F4F1EA', name: 'كريمي هادئ', nameEn: 'Soft Ivory' }
 ],
 gallery: [
 '/projects/n-paner.webp',
 '/projects/n-poster.webp',
 '/projects/n-logo.webp'
 ],
 client: 'Al-Namaa Academy',
 clientEn: 'Al-Namaa Academy',
 duration: 'Ongoing Strategic Partnership',
 durationEn: 'Ongoing Strategic Partnership',
 location: 'Egypt',
 locationEn: 'Egypt',
 year: '2026',
 metricHighlight: {
 value: '100%',
 label: 'Complete Identity & Child Rehabilitation System',
 labelEn: 'Complete Identity & Child Rehabilitation System'
 },
 metricsRow: {
 val1: '100%',
 lbl1: 'Brand Identity',
 lbl1En: 'Brand Identity',
 val2: 'Daycare & Courses',
 lbl2: 'Interactive Tracks',
 lbl2En: 'Interactive Tracks',
 val3: 'Competitor Intel',
 lbl3: 'Strategic Roadmap',
 lbl3En: 'Strategic Roadmap'
 },
 scopeOfWork: [
 'Brand-new logo design and comprehensive visual identity reflecting warmth and development',
 'Official promotional banner and campaign poster design ',
 'Operational business strategy and competitor intelligence across surrounding areas',
 'Structuring specialized morning daycare / nursery programs for special needs children',
 'Developing interactive curricula for speech therapy, behavioral modification, and cognitive skills',
 'Designing and launching high-converting landing page followed by a comprehensive web platform for courses and parental guidance'
 ],
 scopeOfWorkEn: [
 'Brand-new logo design and comprehensive visual identity reflecting warmth and development',
 'Official promotional banner and campaign poster design ',
 'Operational business strategy and competitor intelligence across surrounding areas',
 'Structuring specialized morning daycare / nursery programs for special needs children',
 'Developing interactive curricula for speech therapy, behavioral modification, and cognitive skills',
 'Designing and launching high-converting landing page followed by a comprehensive web platform for courses and parental guidance'
 ],
 challenge: 'Building an authoritative yet comforting brand identity for a special education academy and daycare; reassuring concerned parents with scientific and compassionate messaging, analyzing local competitors to carve out distinct value advantages, and constructing an accessible digital pathway for admissions and interactive training.',
 challengeEn: 'Building an authoritative yet comforting brand identity for a special education academy and daycare; reassuring concerned parents with scientific and compassionate messaging, analyzing local competitors to carve out distinct value advantages, and constructing an accessible digital pathway for admissions and interactive training.',
 solution: 'Engineered a warm, inspiring visual identity and logo radiating growth and security, accompanied by high-impact banners and posters. The partnership actively progresses with comprehensive competitor research in neighboring zones, structured nursery and course offerings, and the deployment of a strategic landing page transitioning into a full parental guidance and interactive course web portal.',
 solutionEn: 'Engineered a warm, inspiring visual identity and logo radiating growth and security, accompanied by high-impact banners and posters. The partnership actively progresses with comprehensive competitor research in neighboring zones, structured nursery and course offerings, and the deployment of a strategic landing page transitioning into a full parental guidance and interactive course web portal.',
 stats: [
 { label: 'Visual Identity Completion', labelEn: 'Visual Identity Completion', value: '100%', sublabel: 'New logo, banner, and campaign poster', sublabelEn: 'New logo, banner, and campaign poster' },
 { label: 'Interactive Child Tracks', labelEn: 'Interactive Child Tracks', value: 'Full Inclusion', sublabel: 'Morning daycare and specialized courses', sublabelEn: 'Morning daycare and specialized courses' },
 { label: 'Parental Guidance System', labelEn: 'Parental Guidance System', value: 'Comprehensive', sublabel: 'Continuous counseling & handling guidance', sublabelEn: 'Continuous counseling & handling guidance' },
 { label: 'Active Digital Phase', labelEn: 'Active Digital Phase', value: 'Landing Page', sublabel: 'Landing page in progress, full portal to follow', sublabelEn: 'Landing page in progress, full portal to follow' }
 ],
 deliverables: [
 'Official new logo emblem & complete brand identity guidelines',
 'High-resolution flagship academy banner ',
 'Promotional programs and nursery poster ',
 'Business operational strategy and regional competitor analysis (In-progress)',
 'Interactive Landing page design and development (In-progress)',
 'Full-featured web portal with interactive courses & parental guidance library (Upcoming)'
 ],
 deliverablesEn: [
 'Official new logo emblem & complete brand identity guidelines',
 'High-resolution flagship academy banner ',
 'Promotional programs and nursery poster ',
 'Business operational strategy and regional competitor analysis (In-progress)',
 'Interactive Landing page design and development (In-progress)',
 'Full-featured web portal with interactive courses & parental guidance library (Upcoming)'
 ],
 techStack: [
 {
 name: 'Modern Visual Identity & Vector Systems',
 category: 'Branding & Graphic Systems',
 iconName: 'Palette',
 description: 'Tailored visual identity designed specifically for special education, utilizing comforting psychology-backed palettes.',
 descriptionEn: 'Tailored visual identity designed specifically for special education, utilizing comforting psychology-backed palettes.'
 },
 {
 name: 'Competitor Intelligence & Market Mapping',
 category: 'Strategic Research',
 iconName: 'BarChart3',
 description: 'Field research analyzing special education competitors in neighboring areas to identify service and pricing opportunities.',
 descriptionEn: 'Field research analyzing special education competitors in neighboring areas to identify service and pricing opportunities.'
 },
 {
 name: 'Interactive Child Curricula & Daycare',
 category: 'Curriculum & Program Design',
 iconName: 'Compass',
 description: 'Structuring natural integration curricula, speech therapy workflows, and interactive behavioral modification tracks.',
 descriptionEn: 'Structuring natural integration curricula, speech therapy workflows, and interactive behavioral modification tracks.'
 },
 {
 name: 'High-Conversion Landing Page & Web Portal',
 category: 'Digital Platforms & UX',
 iconName: 'Zap',
 description: 'Developing a responsive lead-generation landing page leading to an all-in-one educational portal for courses and parental advice.',
 descriptionEn: 'Developing a responsive lead-generation landing page leading to an all-in-one educational portal for courses and parental advice.'
 }
 ],
 strategyDetails: [
 {
 phase: 'PHASE 01 // COMPLETED',
 phaseEn: 'PHASE 01 // COMPLETED',
 title: 'New Logo Design & Official Visual Identity',
 titleEn: 'New Logo Design & Official Visual Identity',
 description: 'Complete redesign of brand identity with an inspiring emblem symbolizing growth, care, and learning, complemented by official banners and posters.',
 descriptionEn: 'Complete redesign of brand identity with an inspiring emblem symbolizing growth, care, and learning, complemented by official banners and posters.',
 bullets: [
 'Official high-resolution new logo design ',
 'Official flagship academy banner reflecting noble mission ',
 'Promotional poster for specialized services and daycare '
 ],
 bulletsEn: [
 'Official high-resolution new logo design ',
 'Official flagship academy banner reflecting noble mission ',
 'Promotional poster for specialized services and daycare '
 ]
 },
 {
 phase: 'PHASE 02 // IN-PROGRESS',
 phaseEn: 'PHASE 02 // IN-PROGRESS',
 title: 'Operational Strategy & Regional Competitor Analysis',
 titleEn: 'Operational Strategy & Regional Competitor Analysis',
 description: 'Conducting comprehensive competitor mapping across surrounding zones, defining unique differentiators, pricing models, and service gaps.',
 descriptionEn: 'Conducting comprehensive competitor mapping across surrounding zones, defining unique differentiators, pricing models, and service gaps.',
 bullets: [
 'Analyzing offerings and price points of surrounding special education centers',
 'Defining Al-Namaa Academy unique competitive edge and humanitarian mission',
 'Structuring flexible, accessible pricing packages for families'
 ],
 bulletsEn: [
 'Analyzing offerings and price points of surrounding special education centers',
 'Defining Al-Namaa Academy unique competitive edge and humanitarian mission',
 'Structuring flexible, accessible pricing packages for families'
 ]
 },
 {
 phase: 'PHASE 03 // PROGRAM DESIGN',
 phaseEn: 'PHASE 03 // PROGRAM DESIGN',
 title: 'Morning Nursery, Interactive Courses & Parental Guidance',
 titleEn: 'Morning Nursery, Interactive Courses & Parental Guidance',
 description: 'Organizing rehabilitation paths to help children naturally integrate into schooling and society, backed by intensive parental guidance.',
 descriptionEn: 'Organizing rehabilitation paths to help children naturally integrate into schooling and society, backed by intensive parental guidance.',
 bullets: [
 'Operating specialized morning daycare for daily and behavioral development',
 'Providing interactive speech, cognitive, and social communication courses',
 'Dedicated parent counseling sessions and home handling guides'
 ],
 bulletsEn: [
 'Operating specialized morning daycare for daily and behavioral development',
 'Providing interactive speech, cognitive, and social communication courses',
 'Dedicated parent counseling sessions and home handling guides'
 ]
 },
 {
 phase: 'PHASE 04 // IN-PROGRESS',
 phaseEn: 'PHASE 04 // IN-PROGRESS',
 title: 'Landing Page Design & Implementation',
 titleEn: 'Landing Page Design & Implementation',
 description: 'Developing a high-conversion landing page detailing programs, nursery admissions, and interactive courses with direct booking forms.',
 descriptionEn: 'Developing a high-conversion landing page detailing programs, nursery admissions, and interactive courses with direct booking forms.',
 bullets: [
 'Modern, fast interface 100% optimized for mobile screens',
 'Direct consultation booking and WhatsApp integration with specialists',
 'Highlighting positive transformation stories and rehabilitation impact'
 ],
 bulletsEn: [
 'Modern, fast interface 100% optimized for mobile screens',
 'Direct consultation booking and WhatsApp integration with specialists',
 'Highlighting positive transformation stories and rehabilitation impact'
 ]
 },
 {
 phase: 'PHASE 05 // UPCOMING',
 phaseEn: 'PHASE 05 // UPCOMING',
 title: 'Full Web Platform, Online Courses & Parent Knowledge Hub',
 titleEn: 'Full Web Platform, Online Courses & Parent Knowledge Hub',
 description: 'Developing a comprehensive digital portal featuring interactive courses for children and a knowledge bank for parents.',
 descriptionEn: 'Developing a comprehensive digital portal featuring interactive courses for children and a knowledge bank for parents.',
 bullets: [
 'Online portal for interactive rehabilitation courses (hybrid & on-site)',
 'Free digital library containing case-handling guides and parent advice',
 'Child skill development tracker and continuous specialist communication'
 ],
 bulletsEn: [
 'Online portal for interactive rehabilitation courses (hybrid & on-site)',
 'Free digital library containing case-handling guides and parent advice',
 'Child skill development tracker and continuous specialist communication'
 ]
 }
 ],
 assetShowcase: [
 {
 url: '/projects/n-paner.webp',
 title: 'Official Al-Namaa Academy Special Education Banner',
 titleEn: 'Official Al-Namaa Academy Special Education Banner',
 type: 'cover',
 description: 'The flagship promotional banner presenting the academy brand identity, values, and inclusion mission.',
 descriptionEn: 'The flagship promotional banner presenting the academy brand identity, values, and inclusion mission.'
 },
 {
 url: '/projects/n-poster.webp',
 title: 'Specialized Nursery & Rehabilitation Programs Poster',
 titleEn: 'Specialized Nursery & Rehabilitation Programs Poster',
 type: 'poster',
 description: 'Promotional poster communicating specialized morning daycare, interactive courses, and parental guidance.',
 descriptionEn: 'Promotional poster communicating specialized morning daycare, interactive courses, and parental guidance.'
 },
 {
 url: '/projects/n-logo.webp',
 title: 'Official Al-Namaa Academy Logo & Crest',
 titleEn: 'Official Al-Namaa Academy Logo & Crest',
 type: 'brand',
 description: 'New official emblem symbolizing nurturing, growth, and positive child development in a caring environment.',
 descriptionEn: 'New official emblem symbolizing nurturing, growth, and positive child development in a caring environment.'
 }
 ],
 externalPostLinks: [
   {
     id: 'na-post-1',
     title: 'منشور الإعلان عن الحضانة الصباحية وبرامج التأهيل والتخاطب',
     titleEn: 'Morning Specialized Daycare & Speech Therapy Announcement Post',
     platform: 'Facebook',
     url: 'https://www.facebook.com',
     tag: 'بوست انطلاق الأكاديمية',
     tagEn: 'Official Launch Post'
   }
 ],
 quote: {
 text: 'Working with Pulse OCTO established the foundational pillar for Al-Namaa Academy; from the inspiring new logo and visual identity to the banner and poster, and the market strategy paving the way for digital dominance.',
 author: 'Al-Namaa Academy Administration',
 role: 'Special Education & Nursery Leadership'
 }
 },
 {
 id: 'halan-delivery',
 slug: 'halan-delivery',
 title: 'Halan Delivery',
 titleEn: 'Halan Delivery',
 category: 'Visual Identity, Fleet Branding & Advertising',
 categoryEn: 'Visual Identity, Fleet Branding & Advertising',
 tag: 'Fast Delivery & Fleet',
 tagEn: 'Fast Delivery & Fleet',
 summary: 'Comprehensive branding and fleet identity for Halan Delivery: crafting the official logo and high-energy visual identity system, designing specialized transit posters and stickers for the motorcycle courier fleet, and creating a branded Facebook cover for rapid digital customer engagement.',
 summaryEn: 'Comprehensive branding and fleet identity for Halan Delivery: crafting the official logo and high-energy visual identity system, designing specialized transit posters and stickers for the motorcycle courier fleet, and creating a branded Facebook cover for rapid digital customer engagement.',
 heroImage: '/projects/h-cover.webp',
 logo: '/projects/h-logo.webp',
 brandColors: [
   { hex: '#9ACA3C', name: 'أخضر لايم حيوي', nameEn: 'Velocity Lime' },
   { hex: '#E52521', name: 'أحمر ناري', nameEn: 'Signal Red' },
   { hex: '#2B2B2B', name: 'رمادي أسفلتي', nameEn: 'Asphalt Charcoal' },
   { hex: '#FFFFFF', name: 'أبيض نقي', nameEn: 'Pure White' }
 ],
 gallery: [
 '/projects/h-cover.webp',
 '/projects/h-poster.webp',
 '/projects/h-logo.webp'
 ],
 client: 'Halan Delivery',
 clientEn: 'Halan Delivery',
 duration: 'Visual Identity & Fleet Execution',
 durationEn: 'Visual Identity & Fleet Execution',
 location: 'Egypt',
 locationEn: 'Egypt',
 year: '2026',
 metricHighlight: {
 value: '100%',
 label: 'Complete Identity & Fleet Signage',
 labelEn: 'Complete Identity & Fleet Signage'
 },
 metricsRow: {
 val1: '100%',
 lbl1: 'Brand Identity',
 lbl1En: 'Brand Identity',
 val2: 'Fleet',
 lbl2: 'Motorcycle Decals',
 lbl2En: 'Motorcycle Decals',
 val3: 'Facebook',
 lbl3: 'Social Cover',
 lbl3En: 'Social Cover'
 },
 scopeOfWork: [
 'Designing official brandmark and dynamic visual identity system ',
 'Designing specialized motorcycle fleet posters & transit decals ',
 'Designing official high-resolution Facebook cover for social engagement ',
 'Defining vibrant color palette and modern typography engineered for logistics',
 'Calibrating print dimensions and high-contrast styling for moving motorcycles',
 'Exporting production-ready digital assets for social channels and mobile usage'
 ],
 scopeOfWorkEn: [
 'Designing official brandmark and dynamic visual identity system ',
 'Designing specialized motorcycle fleet posters & transit decals ',
 'Designing official high-resolution Facebook cover for social engagement ',
 'Defining vibrant color palette and modern typography engineered for logistics',
 'Calibrating print dimensions and high-contrast styling for moving motorcycles',
 'Exporting production-ready digital assets for social channels and mobile usage'
 ],
 challenge: 'Carving out an instantly recognizable identity in a competitive on-demand delivery market; delivering a vibrant presence that communicates velocity and reliability, on-vehicle decals that command attention on the go, and an authoritative Facebook digital storefront.',
 challengeEn: 'Carving out an instantly recognizable identity in a competitive on-demand delivery market; delivering a vibrant presence that communicates velocity and reliability, on-vehicle decals that command attention on the go, and an authoritative Facebook digital storefront.',
 solution: 'Created a cohesive visual identity with a dynamic aerodynamic logo, accompanied by high-contrast motorcycle decals optimized for legibility at speed, and an eye-catching Facebook cover engineered to drive inquiries and orders.',
 solutionEn: 'Created a cohesive visual identity with a dynamic aerodynamic logo, accompanied by high-contrast motorcycle decals optimized for legibility at speed, and an eye-catching Facebook cover engineered to drive inquiries and orders.',
 stats: [
 { label: 'Visual Identity', labelEn: 'Visual Identity', value: '100%', sublabel: 'Official logo & guidelines', sublabelEn: 'Official logo & guidelines' },
 { label: 'Motorcycle Fleet Decals', labelEn: 'Motorcycle Fleet Decals', value: 'Active', sublabel: 'On-vehicle fleet decals ', sublabelEn: 'On-vehicle fleet decals ' },
 { label: 'Digital Channel Cover', labelEn: 'Digital Channel Cover', value: 'Facebook', sublabel: 'Official Facebook cover ', sublabelEn: 'Official Facebook cover ' },
 { label: 'Visual Recognition', labelEn: 'Visual Recognition', value: '< 2 Secs', sublabel: 'Instant on-street recall', sublabelEn: 'Instant on-street recall' }
 ],
 deliverables: [
 'Official approved Hala Delivery logo ',
 'Motorcycle fleet advertising poster & stickers ',
 'Official flagship Facebook cover graphic ',
 'Color palette specifications and brand typography manual',
 'High-resolution outdoor print-ready assets tailored for vehicle surfaces'
 ],
 deliverablesEn: [
 'Official approved Hala Delivery logo ',
 'Motorcycle fleet advertising poster & stickers ',
 'Official flagship Facebook cover graphic ',
 'Color palette specifications and brand typography manual',
 'High-resolution outdoor print-ready assets tailored for vehicle surfaces'
 ],
 techStack: [
 {
 name: 'Dynamic Logo & Identity Engineering',
 category: 'Branding & Vector Design',
 iconName: 'Palette',
 description: 'Engineered a bold, dynamic brandmark projecting speed and safety with high-recall color harmonies.',
 descriptionEn: 'Engineered a bold, dynamic brandmark projecting speed and safety with high-recall color harmonies.'
 },
 {
 name: 'Outdoor Transit Signage & Decal Specs',
 category: 'Fleet & Print Production',
 iconName: 'Compass',
 description: 'Calibrated exterior decal sizing and typography for motorcycles, delivery boxes, and courier equipment.',
 descriptionEn: 'Calibrated exterior decal sizing and typography for motorcycles, delivery boxes, and courier equipment.'
 },
 {
 name: 'Social Media & Conversion Graphics',
 category: 'Digital Media & Marketing',
 iconName: 'Zap',
 description: 'Formulated Facebook cover graphics and social collateral optimized for swift contact information discovery.',
 descriptionEn: 'Formulated Facebook cover graphics and social collateral optimized for swift contact information discovery.'
 }
 ],
 strategyDetails: [
 {
 phase: 'PHASE 01 // BRANDING & LOGO',
 phaseEn: 'PHASE 01 // BRANDING & LOGO',
 title: 'Official Logo Design & Visual Identity',
 titleEn: 'Official Logo Design & Visual Identity',
 description: 'Crafting a high-energy visual identity symbolizing mobility and rapid courier delivery.',
 descriptionEn: 'Crafting a high-energy visual identity symbolizing mobility and rapid courier delivery.',
 bullets: [
 'High-resolution official Hala Delivery logo design ',
 'Vibrant high-contrast color scheme built for instant on-street visibility',
 'Core visual identity guidelines across physical and digital touchpoints'
 ],
 bulletsEn: [
 'High-resolution official Hala Delivery logo design ',
 'Vibrant high-contrast color scheme built for instant on-street visibility',
 'Core visual identity guidelines across physical and digital touchpoints'
 ]
 },
 {
 phase: 'PHASE 02 // FLEET BRANDING',
 phaseEn: 'PHASE 02 // FLEET BRANDING',
 title: 'Motorcycle Fleet Decals & Transit Poster',
 titleEn: 'Motorcycle Fleet Decals & Transit Poster',
 description: 'Designing high-impact motorcycle decals and stickers transforming the delivery fleet into rolling city billboards.',
 descriptionEn: 'Designing high-impact motorcycle decals and stickers transforming the delivery fleet into rolling city billboards.',
 bullets: [
 'Custom poster & decal optimized for delivery motorcycles ',
 'Prominent contact number and logo positioning for instantaneous readability',
 'Calibrated for UV-proof and weather-resistant outdoor vinyl production'
 ],
 bulletsEn: [
 'Custom poster & decal optimized for delivery motorcycles ',
 'Prominent contact number and logo positioning for instantaneous readability',
 'Calibrated for UV-proof and weather-resistant outdoor vinyl production'
 ]
 },
 {
 phase: 'PHASE 03 // DIGITAL PRESENCE',
 phaseEn: 'PHASE 03 // DIGITAL PRESENCE',
 title: 'Facebook Brand Cover & Social Footprint',
 titleEn: 'Facebook Brand Cover & Social Footprint',
 description: 'Crafting the official Facebook cover to unify brand perception and streamline inbound customer orders.',
 descriptionEn: 'Crafting the official Facebook cover to unify brand perception and streamline inbound customer orders.',
 bullets: [
 'High-resolution branded Facebook cover ',
 'Strategic call-to-action layout highlighting quick ordering channels',
 'Polished aesthetic establishing immediate trust and credibility'
 ],
 bulletsEn: [
 'High-resolution branded Facebook cover ',
 'Strategic call-to-action layout highlighting quick ordering channels',
 'Polished aesthetic establishing immediate trust and credibility'
 ]
 }
 ],
 assetShowcase: [
 {
 url: '/projects/h-cover.webp',
 title: 'Official Facebook Cover - Halan Delivery',
 titleEn: 'Official Facebook Cover - Halan Delivery',
 type: 'cover',
 description: 'Flagship Facebook brand cover communicating rapid on-demand courier velocity and reliability.',
 descriptionEn: 'Flagship Facebook brand cover communicating rapid on-demand courier velocity and reliability.'
 },
 {
 url: '/projects/h-poster.webp',
 title: 'Motorcycle Fleet Decal & Poster',
 titleEn: 'Motorcycle Fleet Decal & Poster',
 type: 'poster',
 description: 'Custom fleet sticker & poster engineered for delivery motorcycles ensuring instant recognition in traffic.',
 descriptionEn: 'Custom fleet sticker & poster engineered for delivery motorcycles ensuring instant recognition in traffic.'
 },
 {
 url: '/projects/h-logo.webp',
 title: 'Official Brand Logo - Halan Delivery',
 titleEn: 'Official Brand Logo - Halan Delivery',
 type: 'brand',
 description: 'Approved official logo and brand crest expressing agility, speed, and trusted on-demand courier fulfillment.',
 descriptionEn: 'Approved official logo and brand crest expressing agility, speed, and trusted on-demand courier fulfillment.'
 }
 ],
 externalPostLinks: [
   {
     id: 'hd-post-1',
     title: 'منشور إطلاق هوية أسطول حالا دليفري والغلاف الرسمي على فيسبوك',
     titleEn: 'Halan Delivery Fleet Identity & Official Facebook Cover Post',
     platform: 'Facebook',
     url: 'https://www.facebook.com',
     tag: 'الصفحة الرسمية',
     tagEn: 'Official Facebook Page'
   }
 ],
 quote: {
 text: 'Working with Pulse OCTO gave Halan Delivery an impactful, trustworthy market presence across both physical streets and digital feeds.',
 author: 'Halan Delivery Leadership',
 role: 'On-Demand Delivery Operations'
 }
 },
 {
 id: 'adamco',
 slug: 'adamco',
 title: 'Adamco Corporate & Factory Transport',
 titleEn: 'Adamco Corporate & Factory Transport',
 category: 'Corporate Commute & Industrial Logistics',
 categoryEn: 'Corporate Commute & Industrial Logistics',
 tag: 'Fleet Logistics & Commute',
 tagEn: 'Fleet Logistics & Commute',
 summary: 'Strategic marketing and operational partnership with Adamco, a premier provider specializing in enterprise employee and factory workforce transit. Serving leading industrial factories across 10th of Ramadan City and Suez, the engagement delivered operational positioning, strategic campaign poster suites, cinematic commercial videos, and in-depth competitive intelligence.',
 summaryEn: 'Strategic marketing and operational partnership with Adamco, a premier provider specializing in enterprise employee and factory workforce transit. Serving leading industrial factories across 10th of Ramadan City and Suez, the engagement delivered operational positioning, strategic campaign poster suites, cinematic commercial videos, and in-depth competitive intelligence.',
 heroImage: '/projects/a7.webp',
 logo: '/projects/Adamco logo.webp',
 brandColors: [
   { hex: '#9E1B1E', name: 'أحمر قرمزي', nameEn: 'Industrial Crimson' },
   { hex: '#222222', name: 'فحمي معدني', nameEn: 'Steel Charcoal' },
   { hex: '#C0C5CE', name: 'فضي كروم', nameEn: 'Chrome Silver' },
   { hex: '#0D0D11', name: 'أسود داكن', nameEn: 'Deep Carbon' }
 ],
 gallery: [
 '/projects/a7.webp',
 '/projects/Adamco logo.webp',
 '/projects/a1.webp',
 '/projects/a2.webp',
 '/projects/a3.webp',
 '/projects/a4.webp',
 '/projects/a5.webp',
 '/projects/a6.webp'
 ],
 videos: [
 {
 url: '/projects/a-v ads (1).mp4',
 title: 'Zero Burden Commute Management | Quality & Professionalism',
 titleEn: 'Zero Burden Commute Management | Quality & Professionalism',
 description: 'Targeted commercial for corporate leaders and HR heads, emphasizing stress-free workforce commute management.',
 descriptionEn: 'Targeted commercial for corporate leaders and HR heads, emphasizing stress-free workforce commute management.',
 duration: '0:10'
 },
 {
 url: '/projects/a-v ads (2).mp4',
 title: 'Adamco - Your Premier Workforce Transport Partner',
 titleEn: 'Adamco - Your Premier Workforce Transport Partner',
 description: 'Real-world fleet presentation showcasing readiness for enterprise factory shift contracts.',
 descriptionEn: 'Real-world fleet presentation showcasing readiness for enterprise factory shift contracts.',
 duration: '0:10'
 }
 ],
 branches: ['10th of Ramadan City', 'Suez'],
 branchesEn: ['10th of Ramadan City', 'Suez'],
 contactPhones: ['01030036062', '01023444237'],
 client: 'Adamco Fleet & Corporate Commute (Kassem El Hawatmy)',
 clientEn: 'Adamco Fleet & Corporate Commute (Kassem El Hawatmy)',
 duration: 'Ongoing Strategic Partnership',
 durationEn: 'Ongoing Strategic Partnership',
 location: '10th of Ramadan & Suez, Egypt',
 locationEn: '10th of Ramadan & Suez, Egypt',
 year: '2026',
 metricHighlight: {
 value: '99.8%',
 label: 'Factory Shift Punctuality Rate',
 labelEn: 'Factory Shift Punctuality Rate'
 },
 metricsRow: {
 val1: '99.8%',
 lbl1: 'Shift Punctuality',
 lbl1En: 'Shift Punctuality',
 val2: '100% GPS',
 lbl2: 'Live Telematics',
 lbl2En: 'Live Telematics',
 val3: '10th & Suez',
 lbl3: 'Industrial Hubs',
 lbl3En: 'Industrial Hubs'
 },
 scopeOfWork: [
 'Field operations and corporate contract acquisition strategy',
 'Industrial census and competitive landscape research across 10th of Ramadan & Suez',
 'Comprehensive promotional poster suite & fleet brand identity',
 'Cinematic 4K promotional commercial video production',
 'Targeted B2B campaign architecture addressing HR & Plant Managers'
 ],
 scopeOfWorkEn: [
 'Field operations and corporate contract acquisition strategy',
 'Industrial census and competitive landscape research across 10th of Ramadan & Suez',
 'Comprehensive promotional poster suite & fleet brand identity',
 'Cinematic 4K promotional commercial video production',
 'Targeted B2B campaign architecture addressing HR & Plant Managers'
 ],
 challenge: 'Intense regional competition in industrial zones, alongside factory heads facing severe production downtime due to delayed workers and absence of live vehicle tracking.',
 challengeEn: 'Intense regional competition in industrial zones, alongside factory heads facing severe production downtime due to delayed workers and absence of live vehicle tracking.',
 solution: 'Positioned Adamco as a mission-critical logistics partner guaranteeing punctual shift arrivals with real-time GPS telematics, reinforced by multi-touch B2B video ads, poster suites, and factory outreach in 10th of Ramadan and Suez.',
 solutionEn: 'Positioned Adamco as a mission-critical logistics partner guaranteeing punctual shift arrivals with real-time GPS telematics, reinforced by multi-touch B2B video ads, poster suites, and factory outreach in 10th of Ramadan and Suez.',
 stats: [
 { label: 'Shift Punctuality Rate', labelEn: 'Shift Punctuality Rate', value: '99.8%', sublabel: 'Guaranteed arrival before production line starts', sublabelEn: 'Guaranteed arrival before production line starts' },
 { label: 'Industrial Hub Coverage', labelEn: 'Industrial Hub Coverage', value: '10th & Suez', sublabel: '10th of Ramadan City & Suez corridor', sublabelEn: '10th of Ramadan City & Suez corridor' },
 { label: 'Corporate Transport Cost Savings', labelEn: 'Corporate Transport Cost Savings', value: '-28%', sublabel: 'Versus managing internal factory buses', sublabelEn: 'Versus managing internal factory buses' },
 { label: 'Live Telematics & GPS', labelEn: 'Live Telematics & GPS', value: '100%', sublabel: 'Real-time telemetry and geofencing', sublabelEn: 'Real-time telemetry and geofencing' }
 ],
 deliverables: [
 'Operational strategy and field B2B marketing roadmap',
 'Complete 11-piece promotional campaign poster suite',
 'Two high-impact commercial video spots for corporate outreach',
 'Competitor intelligence and factory lead mapping in 10th of Ramadan & Suez',
 'Flexible corporate quotation models & SLA contract frameworks'
 ],
 deliverablesEn: [
 'Operational strategy and field B2B marketing roadmap',
 'Complete 11-piece promotional campaign poster suite',
 'Two high-impact commercial video spots for corporate outreach',
 'Competitor intelligence and factory lead mapping in 10th of Ramadan & Suez',
 'Flexible corporate quotation models & SLA contract frameworks'
 ],
 techStack: [
 {
 name: 'GPS Telematics & IoT Tracking',
 category: 'Systems & Fleet Logistics',
 iconName: 'Zap',
 description: 'Live GPS tracking and telemetry for instantaneous route visibility and punctuality tracking.',
 descriptionEn: 'Live GPS tracking and telemetry for instantaneous route visibility and punctuality tracking.'
 },
 {
 name: 'Cinematic Video Production & Sound Design',
 category: 'Visual Production & Ads',
 iconName: 'Camera',
 description: '4K commercial video production paired with authoritative voiceover inspiring corporate trust.',
 descriptionEn: '4K commercial video production paired with authoritative voiceover inspiring corporate trust.'
 },
 {
 name: 'Industrial B2B Poster Suite',
 category: 'Branding & Marketing Collateral',
 iconName: 'Palette',
 description: 'Engineered B2B poster suite communicating reliability, contractual flexibility, and fleet breadth.',
 descriptionEn: 'Engineered B2B poster suite communicating reliability, contractual flexibility, and fleet breadth.'
 },
 {
 name: 'Competitive Intelligence & Geo-Targeting',
 category: 'Market Research & Strategy',
 iconName: 'BarChart3',
 description: 'Targeted competitive analysis identifying enterprise industrial prospects in key economic zones.',
 descriptionEn: 'Targeted competitive analysis identifying enterprise industrial prospects in key economic zones.'
 }
 ],
 strategyDetails: [
 {
 phase: 'PHASE 01',
 phaseEn: 'PHASE 01',
 title: 'Field Market Research & Industrial Census',
 titleEn: 'Field Market Research & Industrial Census',
 description: 'Comprehensive mapping of factories in 10th of Ramadan and Suez, analyzing shift patterns and competitor pricing.',
 descriptionEn: 'Comprehensive mapping of factories in 10th of Ramadan and Suez, analyzing shift patterns and competitor pricing.',
 bullets: [
 'Mapping pharmaceutical, textile, food, and engineering plants',
 'Analyzing traditional transporter vulnerabilities (delays, zero telemetry)',
 'Identifying pricing gaps and formulating flexible factory SLA tiers'
 ],
 bulletsEn: [
 'Mapping pharmaceutical, textile, food, and engineering plants',
 'Analyzing traditional transporter vulnerabilities (delays, zero telemetry)',
 'Identifying pricing gaps and formulating flexible factory SLA tiers'
 ]
 },
 {
 phase: 'PHASE 02',
 phaseEn: 'PHASE 02',
 title: 'Operational Roadmap & GPS Telematics Advantage',
 titleEn: 'Operational Roadmap & GPS Telematics Advantage',
 description: 'Formulating the core value proposition: "Production lines never halt", backed by mandatory live GPS telemetry.',
 descriptionEn: 'Formulating the core value proposition: "Production lines never halt", backed by mandatory live GPS telemetry.',
 bullets: [
 'Highlighting Toyota HiAce vans, mini-buses, and full luxury coaches',
 'Punctual drop-off 30 minutes before manufacturing shift starts',
 'Automated electronic route and arrival logs for HR departments'
 ],
 bulletsEn: [
 'Highlighting Toyota HiAce vans, mini-buses, and full luxury coaches',
 'Punctual drop-off 30 minutes before manufacturing shift starts',
 'Automated electronic route and arrival logs for HR departments'
 ]
 },
 {
 phase: 'PHASE 03',
 phaseEn: 'PHASE 03',
 title: 'B2B Creative Suite & Strategic Poster Series',
 titleEn: 'B2B Creative Suite & Strategic Poster Series',
 description: 'Production of 11 targeted high-impact creatives addressing safety, punctuality, fleet versatility, and contract terms.',
 descriptionEn: 'Production of 11 targeted high-impact creatives addressing safety, punctuality, fleet versatility, and contract terms.',
 bullets: [
 'Dedicated creatives focusing on employee safety and GPS shields',
 'Fleet showcases positioning Toyota HiAce vans at corporate parks',
 'Highway panoramic banners linking Suez and 10th of Ramadan corridors'
 ],
 bulletsEn: [
 'Dedicated creatives focusing on employee safety and GPS shields',
 'Fleet showcases positioning Toyota HiAce vans at corporate parks',
 'Highway panoramic banners linking Suez and 10th of Ramadan corridors'
 ]
 },
 {
 phase: 'PHASE 04',
 phaseEn: 'PHASE 04',
 title: 'Commercial Video Production & Fleet Showcase',
 titleEn: 'Commercial Video Production & Fleet Showcase',
 description: 'Directing two high-converting commercial spots highlighting operational ease and real-world fleet readiness.',
 descriptionEn: 'Directing two high-converting commercial spots highlighting operational ease and real-world fleet readiness.',
 bullets: [
 'Corporate narrative video highlighting frictionless transport delegation',
 'Real-world fleet showcase video demonstrating modern buses and vans',
 'Authoritative sound design, voiceover, and brand audio signature'
 ],
 bulletsEn: [
 'Corporate narrative video highlighting frictionless transport delegation',
 'Real-world fleet showcase video demonstrating modern buses and vans',
 'Authoritative sound design, voiceover, and brand audio signature'
 ]
 },
 {
 phase: 'PHASE 05',
 phaseEn: 'PHASE 05',
 title: 'Targeted Paid Campaigns & B2B Direct Sales',
 titleEn: 'Targeted Paid Campaigns & B2B Direct Sales',
 description: 'Deploying hyper-targeted digital media campaigns targeting HR and Operations executives alongside field sales visits.',
 descriptionEn: 'Deploying hyper-targeted digital media campaigns targeting HR and Operations executives alongside field sales visits.',
 bullets: [
 'Hyper-local geotargeting across 10th of Ramadan & Suez industrial estates',
 'Generating verified inbound RFQ leads for high-value annual contracts',
 'Continuous campaign optimization measuring enterprise client CAC'
 ],
 bulletsEn: [
 'Hyper-local geotargeting across 10th of Ramadan & Suez industrial estates',
 'Generating verified inbound RFQ leads for high-value annual contracts',
 'Continuous campaign optimization measuring enterprise client CAC'
 ]
 }
 ],
 assetShowcase: [
 {
 url: '/projects/a7.webp',
 title: 'Adamco Fleet Lineup for Corporate Contracts',
 titleEn: 'Adamco Fleet Lineup for Corporate Contracts',
 type: 'cover',
 description: 'Flagship modern fleet showcase lined up for enterprise transport contracts.',
 descriptionEn: 'Flagship modern fleet showcase lined up for enterprise transport contracts.'
 },
 {
 url: '/projects/a1.webp',
 title: 'Your Factory Never Stops - Safe Shifts with Adamco',
 titleEn: 'Your Factory Never Stops - Safe Shifts with Adamco',
 type: 'poster',
 description: 'Smart transit solutions tailored to high-capacity industrial cities.',
 descriptionEn: 'Smart transit solutions tailored to high-capacity industrial cities.'
 },
 {
 url: '/projects/a2.webp',
 title: 'Toyota HiAce Fleet at Modern Business Campuses',
 titleEn: 'Toyota HiAce Fleet at Modern Business Campuses',
 type: 'poster',
 description: 'Corporate acquisition creative showing circular deployment at business campuses.',
 descriptionEn: 'Corporate acquisition creative showing circular deployment at business campuses.'
 },
 {
 url: '/projects/a3.webp',
 title: 'Production Lines Wait For No One - Punctual Shifts',
 titleEn: 'Production Lines Wait For No One - Punctual Shifts',
 type: 'poster',
 description: 'Rigid punctuality guarantees zero downtime for high-volume manufacturing lines.',
 descriptionEn: 'Rigid punctuality guarantees zero downtime for high-volume manufacturing lines.'
 },
 {
 url: '/projects/a4.webp',
 title: 'Comprehensive Fleet Mix: Sedans, Vans, Buses & Pickups',
 titleEn: 'Comprehensive Fleet Mix: Sedans, Vans, Buses & Pickups',
 type: 'poster',
 description: 'Multi-category fleet options tailored for corporate contracts and private executive transit.',
 descriptionEn: 'Multi-category fleet options tailored for corporate contracts and private executive transit.'
 },
 {
 url: '/projects/a5.webp',
 title: 'Highway Skyline Panorama - 10th of Ramadan Corridor',
 titleEn: 'Highway Skyline Panorama - 10th of Ramadan Corridor',
 type: 'cover',
 description: 'Panoramic highway banner demonstrating cross-city connectivity between Suez and 10th of Ramadan.',
 descriptionEn: 'Panoramic highway banner demonstrating cross-city connectivity between Suez and 10th of Ramadan.'
 },
 {
 url: '/projects/a6.webp',
 title: 'Flexible Contracts Matching Corporate Scale & Budget',
 titleEn: 'Flexible Contracts Matching Corporate Scale & Budget',
 type: 'poster',
 description: 'Tailored contractual packages designed to reduce operational commute overhead.',
 descriptionEn: 'Tailored contractual packages designed to reduce operational commute overhead.'
 },
 {
 url: '/projects/a8.webp',
 title: 'Leave The Motion To Us - Industrial Ecosystem',
 titleEn: 'Leave The Motion To Us - Industrial Ecosystem',
 type: 'brand',
 description: '3D metallic identity emblem surrounded by industrial network hubs and global enterprise partnerships.',
 descriptionEn: '3D metallic identity emblem surrounded by industrial network hubs and global enterprise partnerships.'
 },
 {
 url: '/projects/a9.webp',
 title: 'Employee Safety First - Cutting-edge Telematics & GPS',
 titleEn: 'Employee Safety First - Cutting-edge Telematics & GPS',
 type: 'poster',
 description: 'Equipped with live IoT telematics and active safety sensors protecting corporate workforce.',
 descriptionEn: 'Equipped with live IoT telematics and active safety sensors protecting corporate workforce.'
 },
 {
 url: '/projects/a10.webp',
 title: 'Official 3D Adamco Crest & Brand Identity',
 titleEn: 'Official 3D Adamco Crest & Brand Identity',
 type: 'brand',
 description: 'Official 3D metallic lion shield inside the letter A emblem symbolizing leadership, safety, and prestige.',
 descriptionEn: 'Official 3D metallic lion shield inside the letter A emblem symbolizing leadership, safety, and prestige.'
 },
 {
 url: '/projects/a11.webp',
 title: 'Your Team in Safe Hands - Real-Time GPS Shield',
 titleEn: 'Your Team in Safe Hands - Real-Time GPS Shield',
 type: 'poster',
 platform: 'Facebook',
 description: '24/7 direct GPS geofencing and monitoring providing operations managers total peace of mind.',
 descriptionEn: '24/7 direct GPS geofencing and monitoring providing operations managers total peace of mind.'
 }
 ],
 externalPostLinks: [
   {
     id: 'ad-post-1',
     title: 'منشور حملة تعاقدات نقل موظفي وعمال المصانع — العاشر من رمضان والسويس',
     titleEn: 'Enterprise Factory Workforce Transport Campaign Post',
     platform: 'Facebook',
     url: 'https://www.facebook.com',
     tag: 'حملة B2B للشركات',
     tagEn: 'B2B Corporate Campaign'
   },
   {
     id: 'ad-post-2',
     title: 'منشور نظام التتبع اللحظي GPS وانضباط مواعيد الورديات 99.8%',
     titleEn: 'Real-Time GPS Fleet Tracking & 99.8% Shift Punctuality Post',
     platform: 'Facebook',
     url: 'https://www.facebook.com',
     tag: 'بوست التتبع والأمان',
     tagEn: 'Safety & Telematics Post'
   }
 ],
 quote: {
 text: 'Working with Pulse OCTO scaled Adamco to an unprecedented level of professionalism. The creative posters, videos, and strategic market mapping gave enterprise factories full confidence in our fleet readiness.',
 author: 'Adamco Leadership (Kassem El Hawatmy)',
 role: '10th of Ramadan & Suez Operations'
 }
 },
 {
 id: 'athar',
 slug: 'athar',
 title: 'Athar — The Imprint of Luxury',
 titleEn: 'Athar — The Imprint of Luxury',
 category: 'Brand Identity & Modest Fashion',
 categoryEn: 'Brand Identity & Modest Fashion',
 tag: 'The Imprint of Luxury',
 tagEn: 'The Imprint of Luxury',
 originBadge: '100% Egyptian Modest Fashion • Brand in Creation',
 originBadgeEn: '100% Egyptian Modest Fashion • Brand in Creation',
 isBrandInCreation: true,
 summary: '“The Imprint of Luxury” — A 100% Egyptian modest fashion house currently in creation, specializing in designing and tailoring contemporary hijab apparel with refined silhouettes and authentic craftsmanship.',
 summaryEn: '“The Imprint of Luxury” — A 100% Egyptian modest fashion house currently in creation, specializing in designing and tailoring contemporary hijab apparel with refined silhouettes and authentic craftsmanship.',
 heroImage: '/assets/aistudio/ATHAR_2_fd5b93fd.jpg',
 logo: '/assets/aistudio/Logo_AThar_52ab6b2b.jpg',
 gallery: [
 '/assets/aistudio/ATHAR_2_fd5b93fd.jpg',
 '/assets/aistudio/Logo_AThar_52ab6b2b.jpg'
 ],
 brandColors: [
 { name: 'Royal Burgundy', nameEn: 'Royal Burgundy', hex: '#4A1219' },
 { name: 'Antique Gold', nameEn: 'Antique Gold', hex: '#C8A46B' },
 { name: 'Warm Ivory Parchment', nameEn: 'Warm Ivory Parchment', hex: '#F4ECE0' },
 { name: 'Limestone Sand', nameEn: 'Limestone Sand', hex: '#DFD2C0' }
 ],
 client: 'Athar (أثر)',
 clientEn: 'Athar',
 duration: 'Brand Creation, Identity & Collection Launch',
 durationEn: 'Brand Creation, Identity & Collection Launch',
 location: 'Egypt',
 locationEn: 'Egypt',
 year: '2026',
 metricHighlight: {
 value: '100% Egyptian',
 label: 'Design & Tailoring',
 labelEn: 'Design & Tailoring'
 },
 metricsRow: {
 val1: '100% Egyptian',
 lbl1: 'Craftsmanship',
 lbl1En: 'Craftsmanship',
 val2: 'In Creation',
 lbl2: 'Brand Stage',
 lbl2En: 'Brand Stage',
 val3: 'Modest Wear',
 lbl3: 'Specialization',
 lbl3En: 'Specialization'
 },
 scopeOfWork: [
 'Official Brandmark, Architectural Boutique Header & Brand Guidelines PDF',
 'Custom brand, apparel, and packaging mockup presentation',
 'Dedicated editorial lookbook showcase for the modest fashion collection',
 'Refined brand storytelling and founder vision narrative'
 ],
 scopeOfWorkEn: [
 'Official Brandmark, Architectural Boutique Header & Brand Guidelines PDF',
 'Custom brand, apparel, and packaging mockup presentation',
 'Dedicated editorial lookbook showcase for the modest fashion collection',
 'Refined brand storytelling and founder vision narrative'
 ],
 challenge: 'Establishing a 100% Egyptian modest fashion label under “The Imprint of Luxury” with a refined visual identity matching its bespoke tailoring quality.',
 challengeEn: 'Establishing a 100% Egyptian modest fashion label under “The Imprint of Luxury” with a refined visual identity matching its bespoke tailoring quality.',
 solution: 'Crafted the calligraphic brandmark and limestone atelier header in royal burgundy and antique gold, paired with a dedicated Brand Book PDF showcase, mockup stage, and lookbook gallery.',
 solutionEn: 'Crafted the calligraphic brandmark and limestone atelier header in royal burgundy and antique gold, paired with a dedicated Brand Book PDF showcase, mockup stage, and lookbook gallery.',
 stats: [
 { label: 'Brand Origin', labelEn: 'Brand Origin', value: '100% Egyptian', sublabel: 'Designed & tailored in Egypt', sublabelEn: 'Designed & tailored in Egypt' },
 { label: 'Specialization', labelEn: 'Specialization', value: 'Modest Fashion', sublabel: 'Bespoke modest & hijab fashion', sublabelEn: 'Bespoke modest & hijab fashion' },
 { label: 'Current Stage', labelEn: 'Current Stage', value: 'In Creation', sublabel: 'Logo & header live; preparing PDF & collection', sublabelEn: 'Logo & header live; preparing PDF & collection' }
 ],
 deliverables: [
 'Official Brandmark & Architectural Boutique Header',
 'Official Brand Identity Guidelines (PDF)',
 'Brand & Packaging Mockup Presentation',
 'Modest Fashion Collection Lookbook Archive'
 ],
 deliverablesEn: [
 'Official Brandmark & Architectural Boutique Header',
 'Official Brand Identity Guidelines (PDF)',
 'Brand & Packaging Mockup Presentation',
 'Modest Fashion Collection Lookbook Archive'
 ],
 brandNarrative: {
 eyebrow: 'BRAND STORY & EGYPTIAN CRAFTSMANSHIP • THE IMPRINT OF LUXURY',
 eyebrowEn: 'BRAND STORY & EGYPTIAN CRAFTSMANSHIP • THE IMPRINT OF LUXURY',
 headline: 'Athar — The Imprint of Luxury in 100% Egyptian Modest Fashion',
 headlineEn: 'Athar — The Imprint of Luxury in 100% Egyptian Modest Fashion',
 founderQuote: 'The Imprint of Luxury — Crafted in every silhouette, stitch, and subtle detail.',
 founderQuoteEn: 'The Imprint of Luxury — Crafted in every silhouette, stitch, and subtle detail.',
 paragraphs: [
 'Athar is being built as a 100% Egyptian modest fashion house dedicated to designing and tailoring contemporary hijab attire with meticulous attention to fabric, drape, and understated elegance.',
 'Anchored in a palette of royal burgundy, antique gold, and warm limestone ivory, the showcase now presents the official brandmark and architectural boutique header while the Brand Guidelines PDF, mockup, and collection photography are being prepared.'
 ],
 paragraphsEn: [
 'Athar is being built as a 100% Egyptian modest fashion house dedicated to designing and tailoring contemporary hijab attire with meticulous attention to fabric, drape, and understated elegance.',
 'Anchored in a palette of royal burgundy, antique gold, and warm limestone ivory, the showcase now presents the official brandmark and architectural boutique header while the Brand Guidelines PDF, mockup, and collection photography are being prepared.'
 ],
 pillars: [
 {
 title: '100% Egyptian Craft',
 titleEn: '100% Egyptian Craft',
 detail: 'Every garment is conceived, patterned, and tailored in Egypt with refined finishing.',
 detailEn: 'Every garment is conceived, patterned, and tailored in Egypt with refined finishing.'
 },
 {
 title: 'Bespoke Modest Silhouettes',
 titleEn: 'Bespoke Modest Silhouettes',
 detail: 'Balanced proportions uniting timeless modesty with contemporary sophistication.',
 detailEn: 'Balanced proportions uniting timeless modesty with contemporary sophistication.'
 },
 {
 title: 'The Imprint of Luxury',
 titleEn: 'The Imprint of Luxury',
 detail: 'A cohesive visual architecture uniting brandmark, boutique header, Brand Book, and lookbook.',
 detailEn: 'A cohesive visual architecture uniting brandmark, boutique header, Brand Book, and lookbook.'
 }
 ]
 },
 assetShowcase: [
 {
 url: '/assets/aistudio/ATHAR_2_fd5b93fd.jpg',
 title: 'Official Architectural Boutique Header — Athar: The Imprint of Luxury',
 titleEn: 'Official Architectural Boutique Header — Athar: The Imprint of Luxury',
 type: 'cover',
 description: 'Warm limestone atelier key visual showcasing the sculpted 3D burgundy-and-gold Athar emblem overlooking draped couture curtains.',
 descriptionEn: 'Warm limestone atelier key visual showcasing the sculpted 3D burgundy-and-gold Athar emblem overlooking draped couture curtains.'
 }
 ]
 }
];

export const getLocalizedServices = (lang: Language): ServiceItem[] => {
 return lang === 'en' ? SERVICES_DATA_EN : SERVICES_DATA;
};

export const getLocalizedArms = (lang: Language): ArmData[] => {
 return lang === 'en' ? EIGHT_ARMS_DATA_EN : EIGHT_ARMS_DATA;
};

export const getLocalizedProjects = (lang: Language): ProjectItem[] => {
 return lang === 'en' ? PROJECTS_DATA_EN : PROJECTS_DATA;
};

export const getLocalizedMetrics = (lang: Language): { value: string; label: string; sub: string }[] => {
 return lang === 'en' ? AGENCY_METRICS_EN : AGENCY_METRICS;
};

