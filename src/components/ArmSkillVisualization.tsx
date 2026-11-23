import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Activity,
  Award,
  CheckCircle2,
  Sparkles,
  Zap,
  TrendingUp,
  BarChart3,
  Radar,
  Sliders,
  ShieldCheck,
  Layers,
  ArrowUpRight,
  Info,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import type { ArmData } from '../types';

export interface SkillDimension {
  id: string;
  nameAr: string;
  nameEn: string;
  score: number;
  benchmark: number; // Typical market baseline
  descriptionAr: string;
  descriptionEn: string;
  metricLabelAr: string;
  metricLabelEn: string;
}

export interface ArmSkillData {
  armId: number;
  categoryAr: string;
  categoryEn: string;
  overallScore: number;
  summaryAr: string;
  summaryEn: string;
  dimensions: SkillDimension[];
}

export const ARM_SKILLS_DATA: Record<number, ArmSkillData> = {
  1: {
    armId: 1,
    categoryAr: 'الهوية وبناء العلامة',
    categoryEn: 'BRANDING',
    overallScore: 98,
    summaryAr: 'بناء هويات بصرية متكاملة تعتمد على الدقة المعمارية، الرموز ثلاثية الأبعاد، والتميز التنافسي المستدام.',
    summaryEn: 'Architectural brand identity engineering featuring 3D emblems, comprehensive guidelines, and lasting market prestige.',
    dimensions: [
      {
        id: 'emblems-3d',
        nameAr: 'الشعارات والمجسمات ثلاثية الأبعاد',
        nameEn: '3D Emblems & Crests',
        score: 98,
        benchmark: 68,
        descriptionAr: 'تصميم مجسمات وشعارات 3D تحاكي الخامات الحقيقية وتعكس فخامة استثنائية.',
        descriptionEn: 'Engineering photorealistic 3D emblems reflecting luxurious metallic and glass textures.',
        metricLabelAr: 'إتقان استثنائي',
        metricLabelEn: 'Elite Mastery',
      },
      {
        id: 'guidelines',
        nameAr: 'أدلة الهوية البصرية الشاملة',
        nameEn: 'Brand Guidelines Systems',
        score: 99,
        benchmark: 70,
        descriptionAr: 'توثيق دقيق لكافة اشتراطات الاستخدام، المسافات، ونسب الأمان للبراند.',
        descriptionEn: 'Rigid brand guidelines covering clear-space, contrast, and scaling specifications.',
        metricLabelAr: 'معيار قياسي',
        metricLabelEn: 'Benchmark Standard',
      },
      {
        id: 'typography',
        nameAr: 'الأنظمة الطباعية والمعمارية',
        nameEn: 'Architectural Typography',
        score: 96,
        benchmark: 65,
        descriptionAr: 'تنسيق متناسق للخطوط العربية والإنجليزية لضمان القراءة السلسة والشخصية البصرية.',
        descriptionEn: 'Harmonized Arabic and Latin typographical hierarchy for seamless brand legibility.',
        metricLabelAr: 'توافق كامل',
        metricLabelEn: 'Full Cohesion',
      },
      {
        id: 'chromatics',
        nameAr: 'علم وتناسق الألوان',
        nameEn: 'Chromatic Harmony & Space',
        score: 97,
        benchmark: 72,
        descriptionAr: 'تحديد درجات ألوان حصرية للطباعة والشاشات الرقمية مع مراعاة السيكولوجيا التسويقية.',
        descriptionEn: 'Bespoke digital and print color palettes engineered for psychological retention.',
        metricLabelAr: 'دقة لونية 100%',
        metricLabelEn: '100% Color Precision',
      },
      {
        id: 'digital-assets',
        nameAr: 'الأصول الرقمية وحزم السوشيال',
        nameEn: 'Digital Collateral & Assets',
        score: 98,
        benchmark: 69,
        descriptionAr: 'تطوير قوالب وتصميمات تفاعلية جاهزة لكافة المنصات تحافظ على اتساق العلامة.',
        descriptionEn: 'Cross-platform interactive templates preserving strict brand integrity.',
        metricLabelAr: 'جاهزية فورية',
        metricLabelEn: 'Instant Readiness',
      },
      {
        id: 'brand-reengineering',
        nameAr: 'إعادة هيكلة وتطوير البراند',
        nameEn: 'Brand Re-Engineering',
        score: 95,
        benchmark: 64,
        descriptionAr: 'تحديث الهويات القائمة ونقلها للمستوى المستقبلي دون خسارة الجمهور المخلص.',
        descriptionEn: 'Modernizing legacy brand identities to futuristic standards while retaining equity.',
        metricLabelAr: 'تحول سلس',
        metricLabelEn: 'Smooth Evolution',
      },
    ],
  },
  2: {
    armId: 2,
    categoryAr: 'التسويق الرقمي',
    categoryEn: 'MARKETING',
    overallScore: 97,
    summaryAr: 'إدارة استثمارية ذكية للحملات الإعلانية الممولة بالبيانات الحية لخفض تكلفة الاستحواذ ومضاعفة ROAS.',
    summaryEn: 'Algorithmic performance media buying across Meta, TikTok, and Google generating proven high-yield ROAS.',
    dimensions: [
      {
        id: 'meta-tiktok-ads',
        nameAr: 'إعلانات Meta وTikTok الموجهة',
        nameEn: 'Data-Driven Meta & TikTok Ads',
        score: 98,
        benchmark: 70,
        descriptionAr: 'توظيف خوارزميات الاستهداف بالذكاء الاصطناعي لاستهداف الفئات الأكثر طلباً.',
        descriptionEn: 'Algorithmic demographic and behavioral audience targeting yielding high engagement.',
        metricLabelAr: 'كفاءة استهداف',
        metricLabelEn: 'Pinpoint Reach',
      },
      {
        id: 'google-intent',
        nameAr: 'إعلانات محركات البحث والنية',
        nameEn: 'Google Search & Intent Ads',
        score: 97,
        benchmark: 68,
        descriptionAr: 'استقطاب العملاء في لحظة البحث الفعلي عن الخدمة لتحقيق أعلى معدل تحويل فوري.',
        descriptionEn: 'Capturing active high-intent customer demand at the moment of search intent.',
        metricLabelAr: 'نية شرائية عالية',
        metricLabelEn: 'High Intent',
      },
      {
        id: 'retargeting',
        nameAr: 'إعادة الاستهداف الذكي متعدد الطبقات',
        nameEn: 'Multi-Tier Smart Retargeting',
        score: 96,
        benchmark: 64,
        descriptionAr: 'بناء سلاسل إعادة استهداف تقنع الزوار المترددين وتخفض التخلي عن سلة الشراء.',
        descriptionEn: 'Sophisticated sequential retargeting workflows rescuing abandoned checkouts.',
        metricLabelAr: 'استرداد مبيعات',
        metricLabelEn: 'Cart Recovery',
      },
      {
        id: 'cac-reduction',
        nameAr: 'خفض تكلفة الاستحواذ (CAC)',
        nameEn: 'CAC Optimization & Reduction',
        score: 97,
        benchmark: 63,
        descriptionAr: 'تحسين مستمر للكلفة لكل عميل محتمل من خلال تنقيح الإعلانات وتصفية الزيارات غير المجدية.',
        descriptionEn: 'Continuous bid and audience optimization driving down customer acquisition cost.',
        metricLabelAr: 'تكلفة منخفضة',
        metricLabelEn: 'Optimized CAC',
      },
      {
        id: 'ab-testing',
        nameAr: 'اختبارات A/B الإبداعية المستمرة',
        nameEn: 'A/B Creative Experimentation',
        score: 95,
        benchmark: 65,
        descriptionAr: 'اختبار مئات الزوايا الإعلانية، العناوين، والتصميمات لمعرفة الأفضل أداءً بالأرقام.',
        descriptionEn: 'Systematic multivariate testing discovering highest-yield creative combinations.',
        metricLabelAr: 'اختبار علمي',
        metricLabelEn: 'Scientific Testing',
      },
      {
        id: 'roas-scaling',
        nameAr: 'مضاعفة العائد الإعلاني (ROAS)',
        nameEn: 'ROAS Multiplication & Scaling',
        score: 98,
        benchmark: 69,
        descriptionAr: 'توسيع الميزانيات بأمان مع الحفاظ على هوامش الربحية العالية وتجنب إرهاق الإعلانات.',
        descriptionEn: 'Scaling ad spend vertically while maintaining healthy return on advertising investment.',
        metricLabelAr: '5.4x متوسط مضاعف',
        metricLabelEn: '5.4x Average ROAS',
      },
    ],
  },
  3: {
    armId: 3,
    categoryAr: 'المواقع والتجارة الإلكترونية',
    categoryEn: 'WEB & E-COMMERCE',
    overallScore: 99,
    summaryAr: 'تطوير منصات ومتاجر إلكترونية فائقة السرعة بتجربة مستخدم سلسة تحقق أعلى معدلات إتمام الشراء.',
    summaryEn: 'Sub-second digital storefronts engineered for fluid UX, zero friction, and high checkout conversion.',
    dimensions: [
      {
        id: 'ui-ux-design',
        nameAr: 'واجهات وتجربة المستخدم المخصصة',
        nameEn: 'Bespoke UI/UX Engineering',
        score: 99,
        benchmark: 70,
        descriptionAr: 'تصميم واجهات حصرية من الصفر تلائم سلوك الزائر العربي والعالمي بسلاسة مطلقة.',
        descriptionEn: 'Custom-crafted UI/UX architecture designed specifically for regional purchase habits.',
        metricLabelAr: 'سلاسة استثنائية',
        metricLabelEn: 'Flawless Fluidity',
      },
      {
        id: 'ecommerce-engine',
        nameAr: 'برمجة المتاجر وبنية الدفع',
        nameEn: 'Custom E-Commerce & Storefronts',
        score: 98,
        benchmark: 68,
        descriptionAr: 'تطوير متاجر متوافقة مع منصات شوبيفاي، المنصات السحابية، وحلول برمجية مخصصة.',
        descriptionEn: 'Multi-platform integration across Shopify, headless commerce, and bespoke fullstack engines.',
        metricLabelAr: 'بنية متقدمة',
        metricLabelEn: 'Advanced Stack',
      },
      {
        id: 'core-web-vitals',
        nameAr: 'سرعة التحميل وCore Web Vitals',
        nameEn: 'Sub-Second Load Performance',
        score: 99,
        benchmark: 63,
        descriptionAr: 'تحسين كود الواجهة والضغط الذكي للوصول لسرعة تحميل قياسية تقل عن ثانية واحدة.',
        descriptionEn: 'Extreme sub-second load times fulfilling all green Core Web Vitals parameters.',
        metricLabelAr: '< 0.8 ثانية',
        metricLabelEn: '< 0.8s Load',
      },
      {
        id: 'gateways-tracking',
        nameAr: 'ربط بوابات الدفع والشحن',
        nameEn: 'Payment & Logistics Gateways',
        score: 97,
        benchmark: 69,
        descriptionAr: 'تكامل آمن وسريع مع بوابات الدفع الإلكتروني وشركات الشحن الرائدة.',
        descriptionEn: 'Frictionless checkout integrations with payment providers and fulfillment logistics.',
        metricLabelAr: 'تكامل مؤكد',
        metricLabelEn: 'Rock-Solid Sync',
      },
      {
        id: 'responsive-stack',
        nameAr: 'التجاوب التام مع الهواتف',
        nameEn: 'Mobile-First Architecture',
        score: 99,
        benchmark: 72,
        descriptionAr: 'بناء واجهات تتكيف بذكاء مع كافة الشاشات مع استجابة لمسية عالية الدقة.',
        descriptionEn: 'Dynamic adaptive viewport scaling with native tactile micro-interactions.',
        metricLabelAr: 'تجاوب 100%',
        metricLabelEn: '100% Adaptive',
      },
      {
        id: 'analytics-infra',
        nameAr: 'بنية التتبع والبكسل التحليلي',
        nameEn: 'CAPI & Analytics Infrastructure',
        score: 98,
        benchmark: 65,
        descriptionAr: 'تثبيت بكسل التحويلات وخوادم Conversions API لرصد كل إجراء بدون فقدان للبيانات.',
        descriptionEn: 'Server-side CAPI and data attribution infrastructure capturing 99.9% of user signals.',
        metricLabelAr: 'دقة تتبع 99.9%',
        metricLabelEn: '99.9% Signal Match',
      },
    ],
  },
  4: {
    armId: 4,
    categoryAr: 'الاستوديو والإنتاج الإبداعي',
    categoryEn: 'STUDIO',
    overallScore: 98,
    summaryAr: 'تصوير احترافي داخل استوديو مجهز بأحدث تقنيات الإضاءة والمونتاج السينمائي لخلق انطباع بصري فاخر.',
    summaryEn: 'State-of-the-art studio cinematography, product commercial photography, and dynamic short-form video.',
    dimensions: [
      {
        id: 'commercial-shoots',
        nameAr: 'تصوير المنتجات التجاري بالاستوديو',
        nameEn: 'Commercial Studio Shoots',
        score: 99,
        benchmark: 70,
        descriptionAr: 'جلسات تصوير مخصصة للمنتجات والأزياء تبرز أدق التفاصيل بدون لمعان مشتت.',
        descriptionEn: 'High-end studio product and lifestyle sessions capturing pristine commercial texture.',
        metricLabelAr: 'دقة سينمائية',
        metricLabelEn: 'Cinema Grade',
      },
      {
        id: 'lighting-optics',
        nameAr: 'توزيع الإضاءة والعدسات الاحترافية',
        nameEn: 'Lighting & Optical Engineering',
        score: 98,
        benchmark: 68,
        descriptionAr: 'استخدام إضاءات استوديو مخصصة للأسطح العاكسة والزجاج والمواد الفاخرة.',
        descriptionEn: 'Polarized studio lighting arrays isolating reflections on metallic and glossy materials.',
        metricLabelAr: 'إضاءة محسوبة',
        metricLabelEn: 'Calibrated Light',
      },
      {
        id: 'reels-production',
        nameAr: 'إنتاج الريلز والفيديوهات القصيرة',
        nameEn: 'Dynamic Reels & Short-Form Video',
        score: 98,
        benchmark: 69,
        descriptionAr: 'إنتاج فيديوهات ريلز سريعة وجذابة تتماشى مع إيقاع السوشيال ميديا وتخطف العين.',
        descriptionEn: 'High-energy vertical video engineered with rhythmic soundscapes and viral pacing.',
        metricLabelAr: '+2.5M مشاهدة',
        metricLabelEn: '+2.5M Views',
      },
      {
        id: 'motion-editing',
        nameAr: 'المونتاج الديناميكي وتصحيح الألوان',
        nameEn: 'Dynamic Editing & Color Grading',
        score: 98,
        benchmark: 71,
        descriptionAr: 'مونتاج سريع الإيقاع مع تصحيح ألوان احترافي 4K يمنح الفيديوهات طابعاً سينمائياً راقياً.',
        descriptionEn: 'Paced commercial cutting with Hollywood-grade 4K DaVinci color grading.',
        metricLabelAr: 'مونتاج فاخر 4K',
        metricLabelEn: '4K Editorial Polish',
      },
      {
        id: '3d-vfx',
        nameAr: 'المؤثرات البصرية وتصميم الـ Motion',
        nameEn: '3D Visuals & Motion Graphics',
        score: 97,
        benchmark: 66,
        descriptionAr: 'دمج المجسمات ثلاثية الأبعاد والمؤثرات البصرية لإبهار المشاهد وتعزيز القيمة.',
        descriptionEn: 'Integrating CGI motion graphics and 3D product visual treatments.',
        metricLabelAr: 'إبهار بصري',
        metricLabelEn: 'Visual Wow',
      },
      {
        id: 'campaign-direction',
        nameAr: 'الإخراج الفني للإعلانات التجارية',
        nameEn: 'Commercial Film Art Direction',
        score: 98,
        benchmark: 69,
        descriptionAr: 'إشراف فني وإخراجي كامل يضمن توحيد الرؤية البصرية مع أهداف التسويق.',
        descriptionEn: 'Comprehensive creative direction ensuring visual artistry serves commercial goals.',
        metricLabelAr: 'رؤية موحدة',
        metricLabelEn: 'Unified Vision',
      },
    ],
  },
  5: {
    armId: 5,
    categoryAr: 'المنتجات والحلول الرقمية',
    categoryEn: 'DIGITAL PRODUCTS',
    overallScore: 97,
    summaryAr: 'بناء وتطوير تطبيقات ويب سحابية ولوحات تحكم مخصصة وأدوات رقمية ترتقي بتشغيل مشروعك وتجربة عملائك.',
    summaryEn: 'Engineering bespoke web applications, enterprise portals, dashboards, and digital tools tailored for operational excellence.',
    dimensions: [
      {
        id: 'web-apps',
        nameAr: 'تطبيقات الويب التفاعلية (Web Apps)',
        nameEn: 'Interactive Full-Stack Web Apps',
        score: 98,
        benchmark: 68,
        descriptionAr: 'هندسة وبرمجة تطبيقات ويب تفاعلية متطورة وسريعة الاستجابة بأحدث أطر العمل.',
        descriptionEn: 'High-performance interactive web application development built for massive concurrency.',
        metricLabelAr: 'بنية متطورة',
        metricLabelEn: 'Modern Stack',
      },
      {
        id: 'admin-dashboards',
        nameAr: 'لوحات التحكم والبوابات الإدارية',
        nameEn: 'Custom Dashboards & Enterprise Portals',
        score: 97,
        benchmark: 67,
        descriptionAr: 'تصميم لوحات تحكم متقدمة لإدارة البيانات والعمليات بسهولة وأمان.',
        descriptionEn: 'Bespoke administrative portals and operational data visualization systems.',
        metricLabelAr: 'كفاءة تشغيلية',
        metricLabelEn: 'Operational Lift',
      },
      {
        id: 'custom-tools',
        nameAr: 'الأدوات والحلول الرقمية المخصصة',
        nameEn: 'Custom Digital Tools & Engines',
        score: 96,
        benchmark: 65,
        descriptionAr: 'أدوات رقمية مخصصة لأتمتة سير العمل الداخلي وتحسين تجربة العميل.',
        descriptionEn: 'Tailor-made digital engines automating specialized business logic and user interactions.',
        metricLabelAr: 'حلول ذكية',
        metricLabelEn: 'Tailored Logic',
      },
      {
        id: 'cloud-infrastructure',
        nameAr: 'البنية السحابية وقواعد البيانات',
        nameEn: 'Scalable Cloud & Database Architecture',
        score: 98,
        benchmark: 70,
        descriptionAr: 'تجهيز خوادم سحابية آمنة وقواعد بيانات فائقة السرعة تضمن جاهزية 99.9%.',
        descriptionEn: 'Enterprise-grade cloud architectures, managed databases, and microservices.',
        metricLabelAr: 'جهوزية 99.9%',
        metricLabelEn: '99.9% Uptime',
      },
      {
        id: 'api-integrations',
        nameAr: 'تكامل واجهات البرمجة (APIs)',
        nameEn: 'API Orchestration & Webhooks',
        score: 97,
        benchmark: 66,
        descriptionAr: 'ربط أنظمة الـ CRM، بوابات الدفع، والتطبيقات الخارجية بدون تعقيد.',
        descriptionEn: 'Seamless integrations connecting CRM, ERP, and third-party APIs.',
        metricLabelAr: 'ربط لحظي',
        metricLabelEn: 'Real-Time Sync',
      },
      {
        id: 'security-auth',
        nameAr: 'أمن البيانات وإدارة الصلاحيات',
        nameEn: 'Enterprise Security & RBAC',
        score: 99,
        benchmark: 72,
        descriptionAr: 'تطبيق أعلى معايير التشفير وحماية البيانات وإدارة صلاحيات المستخدمين بأمان.',
        descriptionEn: 'Rigid encryption protocols, role-based access control, and audited security hygiene.',
        metricLabelAr: 'حماية فائقة',
        metricLabelEn: 'Fortified Security',
      },
    ],
  },
  6: {
    armId: 6,
    categoryAr: 'الاستراتيجية',
    categoryEn: 'STRATEGY',
    overallScore: 96,
    summaryAr: 'دراسة دقيقة للمنافسين والأسواق لبناء خرائط طريق رقمية تمنع هدر الميزانيات وتضمن التفوق التنافسي.',
    summaryEn: 'Deep-market intelligence and customer journey architecture guaranteeing maximum capital efficiency.',
    dimensions: [
      {
        id: 'market-recon',
        nameAr: 'تحليل المنافسين ودراسة السوق',
        nameEn: 'Competitor & Market Recon',
        score: 97,
        benchmark: 66,
        descriptionAr: 'رصد نقاط ضعف المنافسين واكتشاف الفرص غير المستغلة في السوق المستهدف.',
        descriptionEn: 'Systematic reconnaissance identifying competitor gaps and untapped market vectors.',
        metricLabelAr: 'رؤية 360°',
        metricLabelEn: '360° Insight',
      },
      {
        id: 'funnel-mapping',
        nameAr: 'هندسة رحلة العميل (Funnels)',
        nameEn: 'Customer Journey Mapping',
        score: 96,
        benchmark: 67,
        descriptionAr: 'رسم مسار تدفق العميل من نقطة الوعي الأولى حتى تكرار الشراء والولاء.',
        descriptionEn: 'Designing multi-touchpoint funnels converting cold prospects into recurring advocates.',
        metricLabelAr: 'مسار عالي التحويل',
        metricLabelEn: 'High-Converting Flow',
      },
      {
        id: 'positioning',
        nameAr: 'صياغة الميزة التنافسية',
        nameEn: 'Value Proposition Architecture',
        score: 98,
        benchmark: 65,
        descriptionAr: 'تحديد الموقع الذهني للعلامة في عقول الجمهور لتمييزها عن أي منافس تقليدي.',
        descriptionEn: 'Formulating undisputed positioning that cements mental market dominance.',
        metricLabelAr: 'تمركز حصري',
        metricLabelEn: 'Exclusive Moat',
      },
      {
        id: 'budget-alloc',
        nameAr: 'توزيع الميزانيات ومنع الهدر',
        nameEn: 'Budget Allocation Efficiency',
        score: 95,
        benchmark: 62,
        descriptionAr: 'توزيع مالي ذكي يعتمد على الأرقام الحقيقية لتحقيق أعلى عائد على الإنفاق.',
        descriptionEn: 'Mathematical budget allocation maximizing ROAS while minimizing redundant spend.',
        metricLabelAr: 'أقصى كفاءة',
        metricLabelEn: 'Max Efficiency',
      },
      {
        id: 'audience-profiling',
        nameAr: 'تحديد الشرائح المربحة',
        nameEn: 'Audience Profiling & ICP',
        score: 97,
        benchmark: 69,
        descriptionAr: 'بناء ملف العميل المثالي (ICP) واستهداف الفئات الأكثر استعداداً للشراء.',
        descriptionEn: 'Pinpoint definition of ideal customer profiles (ICP) with high willingness to pay.',
        metricLabelAr: 'استهداف دقيق',
        metricLabelEn: 'Pinpoint Targeting',
      },
      {
        id: 'kpi-frameworks',
        nameAr: 'أطر قياس الأداء (KPIs)',
        nameEn: 'KPI & Growth Frameworks',
        score: 96,
        benchmark: 64,
        descriptionAr: 'وضع مؤشرات واضحة لقياس التقدم الحقيقي وربط النتائج بالمبيعات والأرباح.',
        descriptionEn: 'Rigid scorecard frameworks tying marketing activity directly to top-line revenue.',
        metricLabelAr: 'قياس دقيق',
        metricLabelEn: 'Rigid Measurement',
      },
    ],
  },
  7: {
    armId: 7,
    categoryAr: 'صناعة المحتوى',
    categoryEn: 'CONTENT',
    overallScore: 96,
    summaryAr: 'صياغة نصوص تسويقية وسيناريوهات إبداعية تخاطب عواطف الجمهور وتدفعهم لاتخاذ القرار في ثوانٍ.',
    summaryEn: 'High-conversion sales copy, viral short-form scripts, and persuasive brand narratives that stop the scroll.',
    dimensions: [
      {
        id: 'sales-copy',
        nameAr: 'نصوص الإعلانات الإقناعية (Direct)',
        nameEn: 'Direct-Response Sales Copy',
        score: 97,
        benchmark: 67,
        descriptionAr: 'كتابة إعلانية تركز على معالجة اعتراضات العميل وإبراز القيمة الفعلية للمنتج.',
        descriptionEn: 'Persuasive psychological copy addressing customer friction and igniting desire.',
        metricLabelAr: 'تحويل سريع',
        metricLabelEn: 'Direct Conversion',
      },
      {
        id: 'video-scripts',
        nameAr: 'سيناريوهات الريلز والفيديوهات القصيرة',
        nameEn: 'Viral Reels & TikTok Scripts',
        score: 98,
        benchmark: 69,
        descriptionAr: 'صناعة خطافات بصرية ونصية (Hooks) توقف السكرول العشوائي في أول 3 ثوانٍ.',
        descriptionEn: 'Crafting scroll-stopping 3-second hooks and dynamic narrative pacing.',
        metricLabelAr: 'خطافات قوية',
        metricLabelEn: 'Scroll-Stopping',
      },
      {
        id: 'landing-copy',
        nameAr: 'محتوى صفحات الهبوط البيعية',
        nameEn: 'High-Converting Landing Pages',
        score: 96,
        benchmark: 66,
        descriptionAr: 'هيكلة النصوص في صفحات الهبوط بأسلوب يقود القارئ بسلاسة حتى زر الشراء.',
        descriptionEn: 'Hierarchical copy architecture guiding prospects effortlessly to call-to-action.',
        metricLabelAr: 'إقناع متكامل',
        metricLabelEn: 'Full Persuasion',
      },
      {
        id: 'tone-of-voice',
        nameAr: 'هندسة نبرة الصوت وشخصية البراند',
        nameEn: 'Brand Voice & Tone Architecture',
        score: 95,
        benchmark: 63,
        descriptionAr: 'تحديد شخصية فريدة للبراند تعكس الهيبة والودية وتخلق ألفة مع الجمهور.',
        descriptionEn: 'Defining unmistakable tone of voice balancing prestige with emotional accessibility.',
        metricLabelAr: 'نبرة متفردة',
        metricLabelEn: 'Distinct Voice',
      },
      {
        id: 'editorial-calendar',
        nameAr: 'خطط النشر والتقويم الشهري',
        nameEn: 'Editorial Calendar Strategy',
        score: 96,
        benchmark: 68,
        descriptionAr: 'تنظيم المحتوى في محاور مدروسة توازن بين التثقيف، الترفيه، والتسويق المباشر.',
        descriptionEn: 'Strategic content pillars balancing brand authority, engagement, and conversion.',
        metricLabelAr: 'جدولة منتظمة',
        metricLabelEn: 'Consistent Pulse',
      },
      {
        id: 'corporate-profiles',
        nameAr: 'الملفات التعريفية والمقالات المهنية',
        nameEn: 'Corporate Profiles & Editorial',
        score: 94,
        benchmark: 62,
        descriptionAr: 'صياغة بروفايلات شركات فخمة ومقالات تعزز مكانة العلامة كمرجع رائد في مجالها.',
        descriptionEn: 'Authoritative company profiles establishing institutional credibility and thought leadership.',
        metricLabelAr: 'مصداقية مؤسسية',
        metricLabelEn: 'Institutional Moat',
      },
    ],
  },
  8: {
    armId: 8,
    categoryAr: 'النمو والتحسين',
    categoryEn: 'GROWTH',
    overallScore: 97,
    summaryAr: 'قراءة الأرقام الحقيقية وتطوير استراتيجيات تحسين محركات البحث وقمع المبيعات لتحقيق نمو تراكمي مستدام.',
    summaryEn: 'Algorithmic search engine optimization, funnel CRO, and live data telemetry engineering compounding business growth.',
    dimensions: [
      {
        id: 'seo-dominance',
        nameAr: 'تصدر نتائج Google العضوية (SEO)',
        nameEn: 'Organic SEO Dominance',
        score: 97,
        benchmark: 66,
        descriptionAr: 'تهيئة البنية التقنية والمحتوى للظهور في الصفحة الأولى للكلمات المفتاحية الأكثر ربحية.',
        descriptionEn: 'Architectural technical SEO and content clustering securing tier-1 Google rankings.',
        metricLabelAr: 'صدارة البحث',
        metricLabelEn: 'Rank 1 Dominance',
      },
      {
        id: 'cro-optimization',
        nameAr: 'تحسين معدلات التحويل (CRO)',
        nameEn: 'Conversion Rate Optimization (CRO)',
        score: 98,
        benchmark: 68,
        descriptionAr: 'تعديل نقاط الاحتكاك في المتجر والموقع لتحويل نسبة أكبر من الزوار إلى مشترين فعليين.',
        descriptionEn: 'Micro-friction elimination across the checkout flow converting more traffic to buyers.',
        metricLabelAr: 'تحويل مضاعف',
        metricLabelEn: 'Multiplied CRO',
      },
      {
        id: 'live-telemetry',
        nameAr: 'لوحات تحكم الأداء الحية (Dashboards)',
        nameEn: 'Live Intelligence Dashboards',
        score: 96,
        benchmark: 65,
        descriptionAr: 'تصميم لوحات بيانات مباشرة تمنح الإدارة رؤية لحظية للمبيعات، الإعلانات، والأرباح.',
        descriptionEn: 'Live executive BI dashboards synchronizing ad spend, revenues, and net margins.',
        metricLabelAr: 'رؤية لحظية',
        metricLabelEn: 'Real-Time Telemetry',
      },
      {
        id: 'funnel-analytics',
        nameAr: 'تحليل سلوك الزوار وقمع المبيعات',
        nameEn: 'Funnel & Behavioral Analytics',
        score: 97,
        benchmark: 67,
        descriptionAr: 'دراسة الخرائط الحرارية (Heatmaps) وسجلات التصفح لمعرفة مواضع التردد والتخلي.',
        descriptionEn: 'Deep-dive session recordings and heatmaps decoding exact shopper drop-off points.',
        metricLabelAr: 'فهم عميق',
        metricLabelEn: 'Behavioral Clarity',
      },
      {
        id: 'retention-ltv',
        nameAr: 'رفع القيمة الدائمة للعميل (LTV)',
        nameEn: 'Retention & Lifetime Value (LTV)',
        score: 96,
        benchmark: 63,
        descriptionAr: 'استراتيجيات إعادة الشراء وحملات البريد والواتساب لرفع إنفاق العميل على المدى الطويل.',
        descriptionEn: 'Post-purchase automated sequences driving repeat order frequency and customer retention.',
        metricLabelAr: 'أرباح مستدامة',
        metricLabelEn: 'Compounding LTV',
      },
      {
        id: 'technical-audits',
        nameAr: 'الفحص والتدقيق التقني الشامل',
        nameEn: 'Full Technical Auditing',
        score: 98,
        benchmark: 69,
        descriptionAr: 'مراجعة أسبوعية مستمرة لكفاءة الأكواد، سرعة الخوادم، ومؤشرات الأمان لتفادي أي خلل.',
        descriptionEn: 'Automated architectural diagnostics ensuring peak server uptime and code hygiene.',
        metricLabelAr: 'فحص استباقي',
        metricLabelEn: 'Proactive Health',
      },
    ],
  },
};

interface ArmSkillVisualizationProps {
  arm: ArmData;
  className?: string;
  onOpenConsultation?: () => void;
}

export const ArmSkillVisualization: React.FC<ArmSkillVisualizationProps> = ({
  arm,
  className = '',
  onOpenConsultation,
}) => {
  const { isAr, dir } = useLanguage();
  const [activeTab, setActiveTab] = useState<'radar' | 'matrix'>('radar');
  const [hoveredDimensionIndex, setHoveredDimensionIndex] = useState<number | null>(null);

  // Retrieve skill data for this arm, with safe fallback to arm 1
  const skillData = useMemo(() => {
    return ARM_SKILLS_DATA[arm.id] || ARM_SKILLS_DATA[1];
  }, [arm.id]);

  const dimensions = skillData.dimensions;
  const numDimensions = dimensions.length;

  // D3-inspired Radar Chart Geometry
  const size = 360;
  const center = size / 2;
  const radius = size * 0.38;
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Helper to compute (x, y) coordinates on polar grid
  const getCoordinates = (index: number, value: number, maxRadius = radius) => {
    const angle = (index / numDimensions) * 2 * Math.PI - Math.PI / 2;
    const r = (value / 100) * maxRadius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, angle };
  };

  // Build SVG polygon points string for Agency (PULSE OCTO)
  const agencyPolygonPoints = useMemo(() => {
    return dimensions
      .map((d, i) => {
        const { x, y } = getCoordinates(i, d.score);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }, [dimensions]);

  // Build SVG polygon points string for Market Baseline
  const benchmarkPolygonPoints = useMemo(() => {
    return dimensions
      .map((d, i) => {
        const { x, y } = getCoordinates(i, d.benchmark);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }, [dimensions]);

  const hoveredDimension =
    hoveredDimensionIndex !== null ? dimensions[hoveredDimensionIndex] : null;

  return (
    <div
      className={`relative rounded-3xl bg-gradient-to-b from-[#110827]/90 via-[#0a061b]/95 to-[#04020b]/98 border border-purple-500/30 p-6 sm:p-10 overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.85),0_0_35px_rgba(138,43,226,0.18)] ${className}`}
      dir={dir}
    >
      {/* Ambient background lighting */}
      <div className="absolute top-0 inset-x-12 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-600/15 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Header bar: Badge, Headline, and Tab Switcher */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
              {isAr ? 'مصفوفة الكفاءة التنفيذية' : 'OPERATIONAL CAPABILITY MATRIX'}
            </span>
            <span className="text-[10px] font-mono text-purple-300 px-2 py-0.5 rounded-full bg-purple-950/70 border border-purple-500/40">
              {skillData.overallScore}% {isAr ? 'مستوى الاحتراف' : 'Overall Mastery'}
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
            {isAr
              ? `الكفاءة الرقمية لـ ${arm.title}`
              : `${arm.enTitle} Mastery Visualization`}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-xl font-light">
            {isAr ? skillData.summaryAr : skillData.summaryEn}
          </p>
        </div>

        {/* View Mode Toggle: Radar Chart vs Detailed Matrix */}
        <div className="flex items-center p-1 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-xl shrink-0 self-stretch sm:self-auto justify-center">
          <button
            type="button"
            onClick={() => setActiveTab('radar')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'radar'
                ? 'bg-gradient-to-r from-purple-700 to-indigo-600 text-white shadow-[0_0_15px_rgba(138,43,226,0.5)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Radar className="w-3.5 h-3.5" />
            <span>{isAr ? 'الرادار الشامل' : 'Radar Core'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'matrix'
                ? 'bg-gradient-to-r from-purple-700 to-indigo-600 text-white shadow-[0_0_15px_rgba(138,43,226,0.5)]'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{isAr ? 'مصفوفة المهارات' : 'Skill Matrix'}</span>
          </button>
        </div>
      </div>

      {/* Main Visualization Content */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Interactive D3 Radar / Spider Graph */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[380px] aspect-square flex items-center justify-center">
            {/* SVG Radar Chart Canvas */}
            <svg
              viewBox={`0 0 ${size} ${size}`}
              className="w-full h-full overflow-visible select-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
            >
              <defs>
                {/* Radial Glow Filter for Agency Polygon */}
                <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>

                {/* Linear Gradient for Agency Polygon Fill */}
                <linearGradient id="agencyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8A2BE2" stopOpacity="0.45" />
                  <stop offset="50%" stopColor="#6366f1" stopOpacity="0.30" />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.20" />
                </linearGradient>

                <linearGradient id="marketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#475569" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#334155" stopOpacity="0.05" />
                </linearGradient>
              </defs>

              {/* 1. Concentric Radial Grid Rings (20%, 40%, 60%, 80%, 100%) */}
              {levels.map((level, lvlIdx) => {
                const ringPoints = dimensions
                  .map((_, i) => {
                    const { x, y } = getCoordinates(i, level * 100);
                    return `${x.toFixed(1)},${y.toFixed(1)}`;
                  })
                  .join(' ');

                return (
                  <g key={`level-${lvlIdx}`}>
                    <polygon
                      points={ringPoints}
                      fill={lvlIdx === levels.length - 1 ? 'rgba(255,255,255,0.02)' : 'none'}
                      stroke="rgba(255,255,255,0.10)"
                      strokeWidth={lvlIdx === levels.length - 1 ? '1.5' : '1'}
                      strokeDasharray={lvlIdx === levels.length - 1 ? 'none' : '3 3'}
                    />
                    {/* Ring Label on Top Axis */}
                    <text
                      x={center + 5}
                      y={center - level * radius + 11}
                      fill="rgba(255,255,255,0.35)"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {level * 100}%
                    </text>
                  </g>
                );
              })}

              {/* 2. Radial Spoke Axes radiating from center to each skill vertex */}
              {dimensions.map((dim, i) => {
                const { x, y } = getCoordinates(i, 100);
                const isHovered = hoveredDimensionIndex === i;

                return (
                  <line
                    key={`spoke-${i}`}
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    stroke={isHovered ? 'rgba(34,211,238,0.8)' : 'rgba(255,255,255,0.12)'}
                    strokeWidth={isHovered ? '1.8' : '1'}
                    className="transition-colors duration-200"
                  />
                );
              })}

              {/* 3. Market Baseline Comparison Polygon (65-72%) */}
              <polygon
                points={benchmarkPolygonPoints}
                fill="url(#marketGrad)"
                stroke="#64748b"
                strokeWidth="1.2"
                strokeDasharray="4 4"
                opacity="0.8"
              />

              {/* 4. PULSE OCTO Agency Mastery Polygon (95-99%) */}
              <motion.polygon
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                points={agencyPolygonPoints}
                fill="url(#agencyGrad)"
                stroke="#a855f7"
                strokeWidth="2.5"
                filter="url(#radarGlow)"
              />

              {/* 5. Center Core Pulse Node */}
              <circle cx={center} cy={center} r="4" fill="#22d3ee" />
              <circle
                cx={center}
                cy={center}
                r="8"
                fill="none"
                stroke="#22d3ee"
                strokeWidth="1"
                className="animate-ping opacity-60"
              />

              {/* 6. Interactive Skill Vertex Nodes */}
              {dimensions.map((dim, i) => {
                const { x, y } = getCoordinates(i, dim.score);
                const isHovered = hoveredDimensionIndex === i;

                return (
                  <g
                    key={`vertex-${dim.id}`}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredDimensionIndex(i)}
                    onMouseLeave={() => setHoveredDimensionIndex(null)}
                  >
                    {/* Hit area */}
                    <circle cx={x} cy={y} r="16" fill="transparent" />

                    {/* Outer glow ring on hover */}
                    {isHovered && (
                      <circle
                        cx={x}
                        cy={y}
                        r="11"
                        fill="rgba(34,211,238,0.25)"
                        stroke="#22d3ee"
                        strokeWidth="1.5"
                      />
                    )}

                    {/* Main vertex circle */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isHovered ? '6' : '4.5'}
                      fill={isHovered ? '#22d3ee' : '#ffffff'}
                      stroke="#8A2BE2"
                      strokeWidth="2"
                      className="transition-all duration-200"
                    />
                  </g>
                );
              })}

              {/* 7. Axis Label Nodes outside the radar */}
              {dimensions.map((dim, i) => {
                const { x, y, angle } = getCoordinates(i, 118);
                const isHovered = hoveredDimensionIndex === i;

                // Adjust text anchor based on angle
                let textAnchor = 'middle';
                if (Math.cos(angle) > 0.3) textAnchor = 'start';
                else if (Math.cos(angle) < -0.3) textAnchor = 'end';

                return (
                  <text
                    key={`label-${dim.id}`}
                    x={x}
                    y={y + 4}
                    textAnchor={textAnchor}
                    fontSize="10"
                    fontWeight={isHovered ? 'bold' : 'normal'}
                    fill={isHovered ? '#22d3ee' : 'rgba(255,255,255,0.75)'}
                    className="cursor-pointer transition-colors duration-200"
                    onMouseEnter={() => setHoveredDimensionIndex(i)}
                    onMouseLeave={() => setHoveredDimensionIndex(null)}
                  >
                    {isAr ? dim.nameAr.split(' ')[0] : dim.nameEn.split(' ')[0]}
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Radar Legend */}
          <div className="flex items-center justify-center gap-6 mt-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-gradient-to-r from-[#8A2BE2] to-[#22d3ee] shadow-[0_0_8px_#8A2BE2]" />
              <span className="text-white font-bold">
                {isAr ? 'كفاءة PULSE OCTO (95-99%)' : 'PULSE OCTO (95-99%)'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 border-t border-dashed border-slate-400" />
              <span className="text-zinc-400">
                {isAr ? 'المعيار التقليدي للسوق (~65%)' : 'Market Avg (~65%)'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Deep-Dive Dimension Card or Breakdown Matrix */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {activeTab === 'radar' && (
              <motion.div
                key="radar-details"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {/* Active Dimension Spotlight (Interactive on vertex hover) */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1a0e38]/80 via-[#0d0822]/90 to-[#050212]/95 border border-purple-400/40 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider">
                      {isAr ? 'المحور المختار' : 'FOCUSED DIMENSION'}
                    </span>
                    <span className="text-xs font-mono font-extrabold text-white px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/40">
                      {hoveredDimension ? `${hoveredDimension.score}%` : `${skillData.overallScore}%`}
                    </span>
                  </div>

                  <h4 className="text-lg font-black text-white mb-2">
                    {hoveredDimension
                      ? (isAr ? hoveredDimension.nameAr : hoveredDimension.nameEn)
                      : (isAr ? 'مرر على أي زاوية في الرادار' : 'Hover over any radar vertex')}
                  </h4>

                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-light mb-4">
                    {hoveredDimension
                      ? (isAr ? hoveredDimension.descriptionAr : hoveredDimension.descriptionEn)
                      : (isAr
                          ? 'يوضح هذا المخطط الدائري التفاعلي كفاءة وكالتنا في 6 محاور رئيسية مقارنة بالمعايير التقليدية في السوق المصري والإقليمي.'
                          : 'This interactive spider-radar demonstrates our verified operational precision across 6 specialized dimensions against regional market averages.')}
                  </p>

                  {/* Benchmark Comparison Micro Bar */}
                  {hoveredDimension && (
                    <div className="pt-3 border-t border-white/[0.08] space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-purple-300 font-bold">
                          {isAr ? 'تفوق PULSE OCTO' : 'PULSE OCTO Index'}: {hoveredDimension.score}%
                        </span>
                        <span className="text-zinc-400">
                          {isAr ? 'المعيار التقليدي' : 'Regional Baseline'}: {hoveredDimension.benchmark}%
                        </span>
                      </div>
                      <div className="relative h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
                        {/* Market Baseline Marker */}
                        <div
                          className="absolute inset-y-0 start-0 bg-slate-600/70"
                          style={{ width: `${hoveredDimension.benchmark}%` }}
                        />
                        {/* Agency Actual */}
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${hoveredDimension.score}%` }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                          className="absolute inset-y-0 start-0 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 shadow-[0_0_10px_#22d3ee]"
                        />
                      </div>
                      <div className="text-[10px] font-mono text-cyan-300 flex items-center justify-between pt-1">
                        <span>{isAr ? 'فارق تفوق قياسي' : 'Performance Premium'}: +{hoveredDimension.score - hoveredDimension.benchmark}%</span>
                        <span>{isAr ? hoveredDimension.metricLabelAr : hoveredDimension.metricLabelEn}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3 Quick Capability Badges */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] text-center">
                    <span className="text-[10px] font-mono text-purple-400 block mb-0.5">
                      {isAr ? 'جاهزية التنفيذ' : 'Readiness'}
                    </span>
                    <span className="text-sm font-black font-['Orbitron',sans-serif] text-white">
                      100%
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] text-center">
                    <span className="text-[10px] font-mono text-cyan-400 block mb-0.5">
                      {isAr ? 'متوسط الأداء' : 'Avg Score'}
                    </span>
                    <span className="text-sm font-black font-['Orbitron',sans-serif] text-cyan-300">
                      {skillData.overallScore}%
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] text-center">
                    <span className="text-[10px] font-mono text-emerald-400 block mb-0.5">
                      {isAr ? 'الرقابة المستمرة' : 'QA Audited'}
                    </span>
                    <span className="text-sm font-black font-['Orbitron',sans-serif] text-emerald-300">
                      24/7
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'matrix' && (
              <motion.div
                key="matrix-details"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.25 }}
                className="space-y-2.5 max-h-[380px] overflow-y-auto overscroll-contain pr-1 custom-scrollbar"
              >
                {dimensions.map((dim, idx) => (
                  <div
                    key={dim.id}
                    onMouseEnter={() => setHoveredDimensionIndex(idx)}
                    onMouseLeave={() => setHoveredDimensionIndex(null)}
                    className="p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-purple-500/40 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-white">
                        {isAr ? dim.nameAr : dim.nameEn}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-zinc-400">
                          {isAr ? 'السوق' : 'Market'}: {dim.benchmark}%
                        </span>
                        <span className="text-xs font-mono font-bold text-cyan-300">
                          {dim.score}%
                        </span>
                      </div>
                    </div>

                    {/* Animated Progress Bar */}
                    <div className="relative h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${dim.score}%` }}
                        transition={{ duration: 0.6, delay: idx * 0.05 }}
                        className="h-full rounded-full bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-400"
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Row */}
          {onOpenConsultation && (
            <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between">
              <span className="text-xs text-zinc-400">
                {isAr
                  ? 'تريد تطبيق هذه المعايير في مشروعك؟'
                  : 'Deploy this capability in your business?'}
              </span>

              <button
                type="button"
                onClick={onOpenConsultation}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(138,43,226,0.35)] transition-all active:scale-95 cursor-pointer"
              >
                <span>{isAr ? 'حجز جلسة استراتيجية' : 'Book Strategic Session'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
