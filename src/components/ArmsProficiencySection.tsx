import React, { useState } from 'react';
import { motion, type Variants } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { TiltCard } from './TiltCard';
import { AnimatedCounter } from './AnimatedCounter';
import { LiquidGlassButton } from './LiquidGlassButton';
import { ArmsProficiency3DCarousel } from './ArmsProficiency3DCarousel';
import {
  Sparkles,
  Compass,
  Layout,
  Target,
  Feather,
  Video,
  Cpu,
  TrendingUp,
  CheckCircle2,
  Award,
  ShieldCheck,
  Activity,
  Zap,
  Check,
} from 'lucide-react';

// Staggered entrance animation variants for the service proficiency cards grid
const proficiencyGridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.1,
    },
  },
};

const proficiencyCardVariants: Variants = {
  hidden: { opacity: 0, y: 35, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export interface ArmProficiency {
  id: number;
  number: string;
  titleAr: string;
  titleEn: string;
  categoryAr: string;
  categoryEn: string;
  levelAr: string;
  levelEn: string;
  percentage: number;
  icon: React.ComponentType<{ className?: string }>;
  gradientFrom: string;
  gradientTo: string;
  neonColor: string;
  skillsAr: string[];
  skillsEn: string[];
  highlightAr: string;
  highlightEn: string;
}

export const ARMS_PROFICIENCY_DATA: ArmProficiency[] = [
  {
    id: 1,
    number: '01',
    titleAr: 'الهوية وبناء العلامة',
    titleEn: 'BRANDING',
    categoryAr: 'الهندسة البصرية',
    categoryEn: 'Visual Engineering',
    levelAr: 'احتراف استثنائي',
    levelEn: 'Elite Mastery',
    percentage: 98,
    icon: Sparkles,
    gradientFrom: '#8A2BE2',
    gradientTo: '#b57cff',
    neonColor: 'rgba(138, 43, 226, 0.25)',
    skillsAr: ['تصميم الشعارات و3D Emblems', 'أدلة الهوية المتكاملة (Guidelines)', 'الطباعة المعمارية والتنسيق البصري', 'حزم المطبوعات والأصول الرقمية'],
    skillsEn: ['3D Emblems & Brandmarks', 'Complete Brand Guidelines', 'Architectural Typography Systems', 'Print & Digital Asset Kits'],
    highlightAr: '+120 براند متوج بهوية فريدة',
    highlightEn: '+120 Unique Brands Engineered',
  },
  {
    id: 2,
    number: '02',
    titleAr: 'التسويق الرقمي',
    titleEn: 'MARKETING',
    categoryAr: 'الحملات والإعلانات',
    categoryEn: 'Performance Media',
    levelAr: 'عائد استثماري فائق',
    levelEn: 'High-ROI Mastery',
    percentage: 97,
    icon: Target,
    gradientFrom: '#7042f0',
    gradientTo: '#9d68ff',
    neonColor: 'rgba(112, 66, 240, 0.25)',
    skillsAr: ['إعلانات Meta وTikTok الموجهة بالبيانات', 'إعلانات Google Search & YouTube', 'إعادة الاستهداف الذكي متعدد الطبقات', 'خفض تكلفة الاستحواذ ومضاعفة ROAS'],
    skillsEn: ['Data-Driven Meta & TikTok Ads', 'Google Search & YouTube Ads', 'Multi-Tier Smart Retargeting', 'CAC Reduction & ROAS Multiplication'],
    highlightAr: '5.4x متوسط مضاعف ROAS',
    highlightEn: '5.4x Average Return on Ad Spend',
  },
  {
    id: 3,
    number: '03',
    titleAr: 'المواقع والتجارة الإلكترونية',
    titleEn: 'WEB & E-COMMERCE',
    categoryAr: 'البنية البرمجية',
    categoryEn: 'Code & Architecture',
    levelAr: 'كفاءة قياسية',
    levelEn: 'Architectural Elite',
    percentage: 99,
    icon: Layout,
    gradientFrom: '#6366f1',
    gradientTo: '#818cf8',
    neonColor: 'rgba(99, 102, 241, 0.25)',
    skillsAr: ['واجهات UI/UX مخصصة وفائقة السرعة', 'متاجر Shopify ومنصات مخصصة', 'تحسين مؤشرات Core Web Vitals', 'تكامل بوابات الدفع والبكسل'],
    skillsEn: ['Custom High-Speed UI/UX', 'Shopify & Bespoke Storefronts', 'Core Web Vitals Sub-Second Load', 'Payment & Pixel Tracking Gateways'],
    highlightAr: '99.9% جاهزية وسرعة استجابة',
    highlightEn: '99.9% Uptime & Sub-Second Speed',
  },
  {
    id: 4,
    number: '04',
    titleAr: 'الاستوديو والإنتاج الإبداعي',
    titleEn: 'STUDIO',
    categoryAr: 'الإنتاج السينمائي',
    categoryEn: 'Commercial Cinematography',
    levelAr: 'جودة سينمائية',
    levelEn: 'Cinema Grade',
    percentage: 98,
    icon: Video,
    gradientFrom: '#7c3aed',
    gradientTo: '#a78bfa',
    neonColor: 'rgba(124, 58, 237, 0.25)',
    skillsAr: ['تصوير المنتجات التجاري داخل الاستوديو', 'فيديوهات الريلز والتيك توك الديناميكية', 'المونتاج الديناميكي والمؤثرات الصوتية', 'تصحيح ألوان سينمائي 4K'],
    skillsEn: ['Studio Commercial Product Shoots', 'Dynamic Short-Form Reels & Video', 'Dynamic Editing & Sound Engineering', 'Cinema-Grade 4K Color Grading'],
    highlightAr: '+2.5M مشاهدة عضوية للمحتوى',
    highlightEn: '+2.5M Organic Video Views',
  },
  {
    id: 5,
    number: '05',
    titleAr: 'المنتجات والحلول الرقمية',
    titleEn: 'DIGITAL PRODUCTS',
    categoryAr: 'التطبيقات والأدوات',
    categoryEn: 'Apps & Dashboards',
    levelAr: 'هندسة متطورة',
    levelEn: 'Engineering Mastery',
    percentage: 96,
    icon: Cpu,
    gradientFrom: '#8b5cf6',
    gradientTo: '#c4b5fd',
    neonColor: 'rgba(139, 92, 246, 0.25)',
    skillsAr: ['تطبيقات ويب متكاملة (Web Apps & SaaS)', 'لوحات تحكم وبوابات إدارية مخصصة', 'أدوات رقمية لأتمتة العمليات', 'بنية سحابية آمنة وعالية الأداء'],
    skillsEn: ['Interactive Web Applications & SaaS', 'Custom Dashboards & Enterprise Portals', 'Automated Digital Workflow Tools', 'High-Performance Scalable Cloud'],
    highlightAr: 'محركات برمجية مخصصة ومبتكرة',
    highlightEn: 'Custom Digital Software Engines',
  },
  {
    id: 6,
    number: '06',
    titleAr: 'الاستراتيجية',
    titleEn: 'STRATEGY',
    categoryAr: 'التخطيط والتحليل',
    categoryEn: 'Strategic Recon',
    levelAr: 'دقة استراتيجية',
    levelEn: 'Precision Mastery',
    percentage: 96,
    icon: Compass,
    gradientFrom: '#9333ea',
    gradientTo: '#c084fc',
    neonColor: 'rgba(147, 51, 234, 0.25)',
    skillsAr: ['أبحاث المنافسين وتحليل السوق', 'رسم مسار رحلة العميل (Funnel)', 'صياغة الميزة التنافسية للبراند', 'توزيع الميزانيات ومنع الهدر'],
    skillsEn: ['Competitor & Market Recon', 'Customer Journey Funnel Mapping', 'Value Proposition Architecture', 'Budget Optimization & Allocation'],
    highlightAr: 'رؤية استراتيجية شاملة 360°',
    highlightEn: '360° Comprehensive Vision',
  },
  {
    id: 7,
    number: '07',
    titleAr: 'صناعة المحتوى',
    titleEn: 'CONTENT',
    categoryAr: 'السرد الإقناعي',
    categoryEn: 'Persuasive Storytelling',
    levelAr: 'تأثير نفسي عميق',
    levelEn: 'Psychological Copy',
    percentage: 95,
    icon: Feather,
    gradientFrom: '#7042f0',
    gradientTo: '#38bdf8',
    neonColor: 'rgba(112, 66, 240, 0.25)',
    skillsAr: ['نصوص إعلانية موجهة للتحويل السريع', 'سيناريوهات الريلز والفيديوهات القصيرة', 'كتابة محتوى صفحات الهبوط المقنعة', 'هندسة نبرة الصوت وشخصية البراند'],
    skillsEn: ['Direct-Response Sales Copy', 'Viral Reels & Short-form Scripts', 'High-Converting Landing Pages', 'Brand Voice & Tone Architecture'],
    highlightAr: '+15K سيناريو ونص إعلاني ناجح',
    highlightEn: '+15K High-Converting Scripts',
  },
  {
    id: 8,
    number: '08',
    titleAr: 'النمو والتحسين',
    titleEn: 'GROWTH',
    categoryAr: 'التوسع الرقمي',
    categoryEn: 'Compounding Growth',
    levelAr: 'توسع مستدام',
    levelEn: 'Growth Engineering',
    percentage: 97,
    icon: TrendingUp,
    gradientFrom: '#6d28d9',
    gradientTo: '#a855f7',
    neonColor: 'rgba(109, 40, 217, 0.25)',
    skillsAr: ['تهيئة محركات البحث المتقدمة (SEO)', 'تحسين معدلات التحويل وقمع المبيعات (CRO)', 'خرائط الحرارة وتتبع سلوك الزائر', 'لوحات تحليلات GA4 وقرارات فورية'],
    skillsEn: ['Advanced Search Engine SEO', 'Conversion Rate & Funnel CRO', 'Behavioral Heatmaps & Telemetry', 'Real-Time GA4 Data Dashboards'],
    highlightAr: '+380% نمو وتوسع تراكمي للشركاء',
    highlightEn: '+380% Compounded Client Scaling',
  }
];

interface CircularProgressProps {
  percentage: number;
  gradientId: string;
  gradientFrom: string;
  gradientTo: string;
  number: string;
  index: number;
  isHovered: boolean;
}

const CircularProgressBar: React.FC<CircularProgressProps> = ({
  percentage,
  gradientId,
  gradientFrom,
  gradientTo,
  number,
  index,
  isHovered,
}) => {
  const size = 112;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (circumference * percentage) / 100;

  return (
    <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
      <svg className="w-full h-full transform -rotate-90 origin-center" viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradientFrom} />
            <stop offset="100%" stopColor={gradientTo} />
          </linearGradient>
          <filter id={`glow-${gradientId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background Track Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.07)"
          strokeWidth={strokeWidth}
        />

        {/* Outer Glow Circle (Subtle) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={gradientFrom}
          strokeWidth={1}
          opacity={isHovered ? 0.4 : 0.15}
          strokeDasharray="4 4"
        />

        {/* Animated Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: targetOffset }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 1.5,
            delay: 0.15 + index * 0.08,
            ease: [0.16, 1, 0.3, 1],
          }}
          strokeLinecap="round"
          filter={isHovered ? `url(#glow-${gradientId})` : undefined}
        />
      </svg>

      {/* Center Percentage & Arm Indicator */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 + index * 0.08 }}
          className="flex flex-col items-center"
        >
          <span className="text-[10px] font-mono font-semibold text-zinc-400">
            ARM {number}
          </span>
          <span className="text-xl font-bold font-mono text-white tracking-tight leading-none my-0.5">
            <AnimatedCounter value={percentage} suffix="%" duration={1.5} />
          </span>
          <span
            className="text-[9px] font-semibold font-mono uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{
              color: gradientTo,
              backgroundColor: 'rgba(255,255,255,0.06)',
            }}
          >
            MASTER
          </span>
        </motion.div>
      </div>
    </div>
  );
};

interface ArmsProficiencySectionProps {
  onOpenConsultation?: () => void;
}

export const ArmsProficiencySection: React.FC<ArmsProficiencySectionProps> = ({
  onOpenConsultation,
}) => {
  const { isAr, dir } = useLanguage();
  const [hoveredArmId, setHoveredArmId] = useState<number | null>(null);

  // Overall aggregate proficiency calculation
  const overallMastery = Math.round(
    ARMS_PROFICIENCY_DATA.reduce((acc, curr) => acc + curr.percentage, 0) /
      ARMS_PROFICIENCY_DATA.length
  );

  return (
    <section
      id="arms-proficiency"
      className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Ambient background glow orbs */}
      <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-purple-900/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-[420px] h-[420px] bg-purple-950/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-5"
        >
          {isAr ? (
            <>
              <span className="block">مستويات الاحتراف التقني</span>
              <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-white to-purple-400 font-sans">
                لـ Pulse Octo
              </span>
            </>
          ) : (
            <>
              <span className="block">Technical Proficiency</span>
              <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-white to-purple-400">
                of Pulse Octo
              </span>
            </>
          )}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto"
        >
          {isAr
            ? 'لا نعتمد على أطراف ثالثة أو عمالة وسيطة؛ فريقنا يمتلك إتقاناً هندسياً متكاملاً في كافة مجالات التصميم والبرمجة والتسويق والذكاء الاصطناعي مع قياس دقيق لمستوى الإنجاز.'
            : 'Zero outsourcing or third-party bottlenecks. Every operational arm operates at elite in-house proficiency spanning branding, architectural code, performance marketing, and generative AI.'}
        </motion.p>

        {/* Global Average Proficiency Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 relative overflow-hidden inline-flex flex-wrap items-center justify-center gap-4 sm:gap-8 px-6 py-3.5 rounded-2xl backdrop-blur-2xl bg-gradient-to-b from-[#130a2e]/75 via-[#0a061b]/80 to-[#05030e]/85 border border-purple-500/30 shadow-[0_16px_40px_rgba(0,0,0,0.7),inset_0_1px_1.5px_rgba(255,255,255,0.2)]"
        >
          {/* Top Specular Line */}
          <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span className="text-xs sm:text-sm font-semibold text-zinc-200">
              {isAr ? 'معدل الكفاءة الشامل للمنظومة:' : 'Overall Agency Core Efficiency:'}
            </span>
            <span className="text-lg sm:text-xl font-bold font-mono text-purple-200">
              <AnimatedCounter value={overallMastery} suffix="%" duration={1.6} />
            </span>
          </div>

          <div className="hidden sm:block w-px h-5 bg-white/10" />

          <div className="flex items-center gap-2 text-xs font-semibold text-purple-300 font-mono">
            <Zap className="w-4 h-4 text-purple-400" />
            <span>8 SYNCHRONIZED ARMS</span>
          </div>

          <div className="hidden sm:block w-px h-5 bg-white/10" />

          <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-medium">
            <Award className="w-4 h-4 text-purple-400" />
            <span>{isAr ? '100% تنفيذ داخلي معتمد' : '100% In-House Execution'}</span>
          </div>
        </motion.div>
      </div>

      {/* Main Dynamic View: 3D Cylinder Carousel */}
      <ArmsProficiency3DCarousel onOpenConsultation={onOpenConsultation} />

      {/* Interactive Bottom Action Strip */}
      {onOpenConsultation && (
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-14 relative z-10 p-6 sm:p-8 rounded-[30px] backdrop-blur-2xl bg-gradient-to-b from-[#130a2e]/80 via-[#0a061b]/85 to-[#05030e]/90 border border-purple-500/30 hover:border-purple-400/60 shadow-[0_24px_60px_rgba(0,0,0,0.9),0_0_35px_rgba(138,43,226,0.2),inset_0_1px_1.5px_rgba(255,255,255,0.22)] flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden transition-all duration-400"
        >
          {/* Top Specular Sheen Line */}
          <div className="absolute top-0 inset-x-12 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

          {/* Ambient Glow */}
          <div className="absolute -top-16 -right-16 w-44 h-44 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className={`relative z-10 ${isAr ? 'text-right' : 'text-left'}`}>
            <h4 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span>
                {isAr
                  ? 'تريد تفعيل قوة الأذرع الـ 8 لمشروعك؟'
                  : 'Ready to Deploy the 8 Arms for Your Brand?'}
              </span>
            </h4>
            <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-2xl font-normal">
              {isAr
                ? 'احجز جلسة استشارية مباشرة مع المهندس طارق وجيه لتحليل جاهزية علامتك التجارية وتحديد الأذرع الأنسب للبدء فوراً.'
                : 'Book an executive strategy consultation with Eng. Tarek Wageeh to analyze your brand readiness and configure the optimal arms.'}
            </p>
          </div>

          <LiquidGlassButton
            onClick={onOpenConsultation}
            variant="primary"
            size="md"
            className="shrink-0 relative z-10"
          >
            <span>{isAr ? 'طلب استشارة رقمية مخصصة' : 'Book Strategic Consultation'}</span>
            <Zap className="w-4 h-4 text-purple-200" />
          </LiquidGlassButton>
        </motion.div>
      )}
    </section>
  );
};
