import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { ScrollHeaderReveal } from './ScrollReveal';
import { LiquidGlassButton } from './LiquidGlassButton';
import {
  ShoppingBag,
  Building2,
  Rocket,
  Smartphone,
  Palette,
  TrendingUp,
  Video,
  FileText,
  BarChart3,
  Compass,
  Layout,
  Cpu,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  MessageCircle,
  Copy,
  RotateCcw
} from 'lucide-react';

interface ProjectScopeWizardProps {
  onComplete?: (summary: ProjectScopeSummary) => void;
  onOpenConsultation?: () => void;
  className?: string;
}

export interface ProjectScopeSummary {
  projectType: string;
  projectTypeTitle: string;
  selectedArms: string[];
  selectedArmsTitles: string[];
  budgetTier: string;
  budgetLabel: string;
  targetTimeline: string;
  targetTimelineTitle: string;
  generatedNote: string;
}

export const ProjectScopeWizard: React.FC<ProjectScopeWizardProps> = ({
  onComplete,
  className = '',
}) => {
  const { isAr, dir } = useLanguage();
  const { success } = useToast();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedType, setSelectedType] = useState<string>('ecommerce');
  const [selectedArms, setSelectedArms] = useState<string[]>([
    'branding',
    'marketing',
    'web-ecommerce',
  ]);
  const [selectedBudget, setSelectedBudget] = useState<string>('growth');
  const [selectedTimeline, setSelectedTimeline] = useState<string>('month');
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // 1. Project Types
  const projectTypes = useMemo(
    () => [
      {
        id: 'ecommerce',
        icon: ShoppingBag,
        titleAr: 'متجر إلكتروني متكامل',
        titleEn: 'E-Commerce Store',
        descAr: 'شوبيفاي، سلة، زد، أو ووكومرس مع مضاعفة المبيعات والـ ROAS',
        descEn: 'Shopify, Salla, Zid, WooCommerce with high conversion focus',
      },
      {
        id: 'b2b-corporate',
        icon: Building2,
        titleAr: 'شركة خدمية / B2B',
        titleEn: 'Corporate & B2B',
        descAr: 'استقطاب عملاء محتملين مؤهلين (Qualified B2B Leads) وهوية رائدة',
        descEn: 'High-ticket lead generation and authoritative corporate brand',
      },
      {
        id: 'startup',
        icon: Rocket,
        titleAr: 'علامة تجارية ناشئة (Startup)',
        titleEn: 'Emerging Startup / DTC',
        descAr: 'إطلاق هجومي سريع في السوق وبناء وعي جماهيري استثنائي',
        descEn: 'Rapid market entry, brand validation, and aggressive launch',
      },
      {
        id: 'tech-platform',
        icon: Smartphone,
        titleAr: 'منصة رقمية / تطبيق ويب',
        titleEn: 'Digital Platform / SaaS',
        descAr: 'تصميم تجربة مستخدم UX فائقة، نمو مستمر وتتبع بيانات دقيق',
        descEn: 'Superior product UX, product-led growth, and deep funnels',
      },
    ],
    []
  );

  // 2. The 8 OCTO Arms (Multi-select)
  const armsOptions = useMemo(
    () => [
      {
        id: 'branding',
        number: 1,
        icon: Palette,
        titleAr: 'الهوية وبناء العلامة',
        titleEn: 'BRANDING',
        shortDescAr: 'الهوية، التسمية، التمركز، بناء العلامة',
        shortDescEn: 'Identity, Naming, Positioning, Brand System',
      },
      {
        id: 'marketing',
        number: 2,
        icon: TrendingUp,
        titleAr: 'التسويق الرقمي',
        titleEn: 'MARKETING',
        shortDescAr: 'التسويق الرقمي، الحملات، الميديا باينج، الأداء',
        shortDescEn: 'Digital Marketing, Campaigns, Paid Media, Performance',
      },
      {
        id: 'web-ecommerce',
        number: 3,
        icon: Layout,
        titleAr: 'المواقع والتجارة الإلكترونية',
        titleEn: 'WEB & E-COMMERCE',
        shortDescAr: 'المواقع، صفحات الهبوط، شوبيفاي، UI/UX',
        shortDescEn: 'Websites, Landing Pages, Shopify, E-commerce, UI/UX',
      },
      {
        id: 'studio',
        number: 4,
        icon: Video,
        titleAr: 'الاستوديو والإنتاج الإبداعي',
        titleEn: 'STUDIO',
        shortDescAr: 'تصوير المنتجات، فوتو وفيديو، ريلز، موشن',
        shortDescEn: 'Product Photography, Video, Reels, Commercials',
      },
      {
        id: 'digital-products',
        number: 5,
        icon: Cpu,
        titleAr: 'المنتجات والحلول الرقمية',
        titleEn: 'DIGITAL PRODUCTS',
        shortDescAr: 'تطبيقات الويب، البوابات، لوحات التحكم، الأدوات',
        shortDescEn: 'Web Apps, Portals, Dashboards, Custom Tools',
      },
      {
        id: 'strategy',
        number: 6,
        icon: Compass,
        titleAr: 'الاستراتيجية',
        titleEn: 'STRATEGY',
        shortDescAr: 'دراسة السوق، التمركز التنافسي، خطة النمو',
        shortDescEn: 'Market Research, Positioning, Growth Roadmap',
      },
      {
        id: 'content',
        number: 7,
        icon: FileText,
        titleAr: 'صناعة المحتوى',
        titleEn: 'CONTENT',
        shortDescAr: 'كتابة الإعلانات، سيناريوهات الفيديو، السرد القصصي',
        shortDescEn: 'Content, Copywriting, Video Scripts, Storytelling',
      },
      {
        id: 'growth',
        number: 8,
        icon: BarChart3,
        titleAr: 'النمو والتحسين',
        titleEn: 'GROWTH',
        shortDescAr: 'SEO، تحسين التحويل، التحليلات، التوسع',
        shortDescEn: 'SEO, CRO, Analytics, Optimization, Retention',
      },
    ],
    []
  );

  // 3. Budgets & Timelines
  const budgetOptions = useMemo(
    () => [
      {
        id: 'starter',
        labelAr: '١٥,٠٠٠ - ٣٠,٠٠٠ ج.م (~ ١,٥٠٠ - ٣,٠٠٠ ر.س)',
        labelEn: '15,000 - 30,000 EGP (~ 1,500 - 3,000 SAR)',
        tagAr: 'باقة الانطلاق المركزة',
        tagEn: 'Focused Starter',
      },
      {
        id: 'growth',
        labelAr: '٣٠,٠٠٠ - ٦٠,٠٠٠ ج.م (~ ٣,٠٠٠ - ٦,٠٠٠ ر.س)',
        labelEn: '30,000 - 60,000 EGP (~ 3,000 - 6,000 SAR)',
        tagAr: 'الأكثر طلباً للنمو ومضاعفة المبيعات',
        tagEn: 'Most Popular Scaling Tier',
      },
      {
        id: 'scale',
        labelAr: '٦٠,٠٠٠ - ١٢٠,٠٠٠+ ج.م (~ ٦,٠٠٠ - ١٢,٠٠٠+ ر.س)',
        labelEn: '60,000 - 120,000+ EGP (~ 6,000 - 12,000+ SAR)',
        tagAr: 'الهيمنة التوسعية الشاملة',
        tagEn: 'Omni-Channel Dominance',
      },
      {
        id: 'enterprise',
        labelAr: 'ميزانية مؤسسات مخصصة (Enterprise Bespoke)',
        labelEn: 'Enterprise Bespoke Tier',
        tagAr: 'عقود سنوية ومشاريع ضخمة',
        tagEn: 'Full Ecosystem Scale',
      },
    ],
    []
  );

  const timelineOptions = useMemo(
    () => [
      {
        id: 'urgent',
        icon: Calendar,
        titleAr: 'فوري - خلال أسبوعين',
        titleEn: 'Immediate Launch (Within 2 Weeks)',
        descAr: 'انطلاق فوري وسريع للفرص الموسمية والحملات العاجلة',
        descEn: 'Rapid mobilization for critical opportunities',
      },
      {
        id: 'month',
        icon: Calendar,
        titleAr: 'خلال ٣٠ يوماً (الموصى به)',
        titleEn: 'Within 30 Days (Recommended)',
        descAr: 'بناء استراتيجي متكامل وفحص تقني لكافة الأذرع',
        descEn: 'Ideal runway for thorough setup & optimization',
      },
      {
        id: 'quarter',
        icon: Rocket,
        titleAr: 'تخطيط استراتيجي للربع القادم',
        titleEn: 'Next Quarter Strategic Rollout',
        descAr: 'إعداد خطة متقدمة وتأسيس بنية تسويقية طويلة الأجل',
        descEn: 'Long-term foundational architecture',
      },
    ],
    []
  );

  // Arm toggle
  const toggleArm = (armId: string) => {
    setSelectedArms((prev) =>
      prev.includes(armId)
        ? prev.length > 1
          ? prev.filter((id) => id !== armId)
          : prev
        : [...prev, armId]
    );
  };

  // Compile Summary Data
  const summaryData = useMemo<ProjectScopeSummary>(() => {
    const currentTypeObj = projectTypes.find((t) => t.id === selectedType) || projectTypes[0];
    const currentBudgetObj = budgetOptions.find((b) => b.id === selectedBudget) || budgetOptions[1];
    const currentTimelineObj = timelineOptions.find((t) => t.id === selectedTimeline) || timelineOptions[1];
    const chosenArmsList = armsOptions.filter((a) => selectedArms.includes(a.id));

    const note = isAr
      ? `ملخص طلب عرض السعر عبر معالج Pulse OCTO:
- نوع المشروع: ${currentTypeObj.titleAr}
- الأذرع المطلوبة (${chosenArmsList.length}): ${chosenArmsList.map((a) => a.titleAr).join(' + ')}
- الميزانية التقديرية: ${currentBudgetObj.labelAr}
- الموعد المستهدف للانطلاق: ${currentTimelineObj.titleAr}`
      : `Pulse OCTO Scope Brief:
- Project Archetype: ${currentTypeObj.titleEn}
- Required Arms (${chosenArmsList.length}): ${chosenArmsList.map((a) => a.titleEn).join(', ')}
- Budget Tier: ${currentBudgetObj.labelEn}
- Target Timeline: ${currentTimelineObj.titleEn}`;

    return {
      projectType: selectedType,
      projectTypeTitle: isAr ? currentTypeObj.titleAr : currentTypeObj.titleEn,
      selectedArms,
      selectedArmsTitles: chosenArmsList.map((a) => (isAr ? a.titleAr : a.titleEn)),
      budgetTier: selectedBudget,
      budgetLabel: isAr ? currentBudgetObj.labelAr : currentBudgetObj.labelEn,
      targetTimeline: selectedTimeline,
      targetTimelineTitle: isAr ? currentTimelineObj.titleAr : currentTimelineObj.titleEn,
      generatedNote: note,
    };
  }, [selectedType, selectedArms, selectedBudget, selectedTimeline, projectTypes, budgetOptions, timelineOptions, armsOptions, isAr]);

  // WhatsApp Link
  const whatsappUrl = useMemo(() => {
    const message = isAr
      ? `مرحباً فريق Pulse OCTO، قمت بتحديد نطاق مشروعي عبر المعالج التفاعلي:
• نوع المشروع: ${summaryData.projectTypeTitle}
• الأذرع المطلوبة (${summaryData.selectedArms.length}): ${summaryData.selectedArmsTitles.join(' + ')}
• الميزانية التقديرية: ${summaryData.budgetLabel}
• الموعد المستهدف: ${summaryData.targetTimelineTitle}

أود معرفة تفاصيل خطة العمل واستلام عرض السعر المخصص لمشروعي.`
      : `Hello Pulse OCTO Team, I generated my project scope using the interactive wizard:
• Project Archetype: ${summaryData.projectTypeTitle}
• Required Arms (${summaryData.selectedArms.length}): ${summaryData.selectedArmsTitles.join(', ')}
• Estimated Budget: ${summaryData.budgetLabel}
• Target Launch: ${summaryData.targetTimelineTitle}

I would like to discuss our launch roadmap and tailored quotation.`;

    return `https://wa.me/201116066968?text=${encodeURIComponent(message)}`;
  }, [summaryData, isAr]);

  const handleCopySummary = () => {
    navigator.clipboard.writeText(summaryData.generatedNote);
    setCopiedSummary(true);
    success(
      isAr ? 'تم نسخ ملخص المشروع إلى الحافظة بنجاح' : 'Scope summary copied to clipboard',
      isAr ? 'يمكنك لصقه مباشرة في رسائل واتساب أو البريد الإلكتروني' : 'You can paste it directly into WhatsApp or email'
    );
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setSelectedType('ecommerce');
    setSelectedArms(['branding', 'marketing', 'web-ecommerce']);
    setSelectedBudget('growth');
    setSelectedTimeline('month');
  };

  return (
    <div
      id="project-scope-wizard"
      className={`relative w-full rounded-2xl sm:rounded-3xl bg-[#09080f] border border-white/10 p-5 sm:p-8 lg:p-10 shadow-[0_24px_60px_rgba(0,0,0,0.85)] overflow-hidden ${className}`}
    >
      {/* Top Architectural Hairline */}
      <div className="absolute top-0 inset-x-12 h-px bg-gradient-to-r from-transparent via-purple-500/35 to-transparent pointer-events-none" />

      {/* Header & Step Tracker */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-white/10">
        <ScrollHeaderReveal>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            {isAr ? 'حدد نطاق مشروعك واستلم ملخص النبض في دقيقة' : 'Scope Your Launch & Get Instant Proposal'}
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            {isAr
              ? '٣ خطوات سريعة تختصر ساعات التفاوض وترسم مسار النجاح المباشر'
              : '3 quick questions to eliminate ad-waste and engineer your bespoke growth matrix'}
          </p>
        </ScrollHeaderReveal>

        {/* Step Progress Indicators */}
        <div className="flex items-center gap-1.5 sm:gap-2 self-stretch sm:self-auto justify-center">
          {[1, 2, 3, 4].map((step) => {
            const isCompleted = currentStep > step;
            const isCurrent = currentStep === step;
            return (
              <div key={step} className="flex items-center gap-1 sm:gap-1.5">
                <button
                  type="button"
                  onClick={() => step < currentStep && setCurrentStep(step)}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-mono text-xs font-bold flex items-center justify-center transition-colors touch-manipulation active:scale-95 ${
                    isCompleted
                      ? 'bg-purple-500/15 border border-purple-500/40 text-purple-300 cursor-pointer'
                      : isCurrent
                      ? 'bg-[#7c3aed] text-white border border-purple-400/50'
                      : 'bg-[#06050a] border border-white/10 text-zinc-500 cursor-not-allowed'
                  }`}
                  aria-label={`Step ${step}`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-300" /> : step}
                </button>
                {step < 4 && (
                  <div
                    className={`w-3 sm:w-6 h-[1.5px] transition-colors ${
                      isCompleted ? 'bg-purple-500/50' : 'bg-white/10'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Wizard Interactive Body */}
      <AnimatePresence mode="wait">
        {/* STEP 1: PROJECT ARCHETYPE */}
        {currentStep === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: dir === 'rtl' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir === 'rtl' ? 20 : -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h4 className="text-lg sm:text-xl font-black text-white mt-1">
                {isAr ? 'ما هو نوع مشروعك أو نموذج عملك التجاري؟' : 'What is your core business model?'}
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projectTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;
                return (
                  <div
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`relative p-5 sm:p-6 rounded-2xl border transition-colors duration-200 cursor-pointer flex items-start gap-4 overflow-hidden ${
                      isSelected
                        ? 'bg-[#120d24] border-[#7c3aed]'
                        : 'bg-[#06050a] border-white/10 hover:border-purple-500/35'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#7c3aed] text-white'
                          : 'bg-white/[0.04] text-purple-300 border border-white/10'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="text-base font-bold text-white">
                          {isAr ? type.titleAr : type.titleEn}
                        </h5>
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-[#7c3aed] border-[#7c3aed] text-white'
                              : 'border-white/20 bg-black/40'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
                        {isAr ? type.descAr : type.descEn}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-end pt-4">
              <LiquidGlassButton
                onClick={() => setCurrentStep(2)}
                variant="primary"
                size="md"
              >
                <span>{isAr ? 'متابعة: اختيار الخدمات المطلوبة' : 'Continue: Select Services'}</span>
                <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              </LiquidGlassButton>
            </div>
          </motion.div>
        )}

        {/* STEP 2: THE 8 ARMS SELECTION */}
        {currentStep === 2 && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, x: dir === 'rtl' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir === 'rtl' ? 20 : -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h4 className="text-lg sm:text-xl font-black text-white mt-1">
                {isAr
                  ? 'ما هي الخدمات التي يحتاجها مشروعك؟ (تحديد متعدد)'
                  : 'Which services does your project require?'}
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {armsOptions.map((arm) => {
                const Icon = arm.icon;
                const isSelected = selectedArms.includes(arm.id);
                return (
                  <div
                    key={arm.id}
                    onClick={() => toggleArm(arm.id)}
                    className={`relative p-4 rounded-2xl border transition-colors duration-200 cursor-pointer flex flex-col justify-between overflow-hidden ${
                      isSelected
                        ? 'bg-[#120d24] border-[#7c3aed]'
                        : 'bg-[#06050a] border-white/10 hover:border-purple-500/35'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            isSelected
                              ? 'bg-[#7c3aed] text-white'
                              : 'bg-white/[0.04] text-zinc-300 border border-white/10'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                            isSelected
                              ? 'bg-[#7c3aed] border-[#7c3aed] text-white'
                              : 'border-white/20 bg-black/40'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                        </div>
                      </div>

                      <h5 className="text-sm font-bold text-white leading-snug">
                        {isAr ? arm.titleAr : arm.titleEn}
                      </h5>
                      <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                        {isAr ? arm.shortDescAr : arm.shortDescEn}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4">
              <LiquidGlassButton
                onClick={() => setCurrentStep(1)}
                variant="secondary"
                size="sm"
              >
                <ArrowLeft className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                <span>{isAr ? 'الرجوع لنوع المشروع' : 'Back'}</span>
              </LiquidGlassButton>

              <LiquidGlassButton
                onClick={() => setCurrentStep(3)}
                variant="primary"
                size="md"
              >
                <span>{isAr ? 'متابعة: الميزانية والموعد' : 'Continue: Budget & Timeline'}</span>
                <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              </LiquidGlassButton>
            </div>
          </motion.div>
        )}

        {/* STEP 3: BUDGET & TIMELINE */}
        {currentStep === 3 && (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, x: dir === 'rtl' ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir === 'rtl' ? 20 : -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <h4 className="text-lg sm:text-xl font-black text-white mt-1">
                {isAr ? 'الميزانية التقديرية والموعد المستهدف للانطلاق' : 'Target Budget & Launch Horizon'}
              </h4>
            </div>

            {/* Budget options */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-purple-300 uppercase tracking-wider block">
                {isAr ? 'الميزانية الشهرية المقترحة للمشروع / الحملات:' : 'Estimated Monthly Project/Media Budget:'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {budgetOptions.map((b) => {
                  const isSelected = selectedBudget === b.id;
                  return (
                    <div
                      key={b.id}
                      onClick={() => setSelectedBudget(b.id)}
                      className={`relative p-4 rounded-2xl border transition-colors cursor-pointer flex items-center justify-between overflow-hidden ${
                        isSelected
                          ? 'bg-[#120d24] border-[#7c3aed]'
                          : 'bg-[#06050a] border-white/10 hover:border-purple-500/35'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-mono font-bold text-white block">
                          {isAr ? b.labelAr : b.labelEn}
                        </span>
                        <span className="text-[11px] text-purple-300 font-medium">
                          {isAr ? b.tagAr : b.tagEn}
                        </span>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-[#7c3aed] border-[#7c3aed] text-white'
                            : 'border-white/20 bg-black/40'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Timeline options */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-purple-300 uppercase tracking-wider block">
                {isAr ? 'الموعد المستهدف لبدء التنفيذ:' : 'Target Launch Horizon:'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {timelineOptions.map((time) => {
                  const isSelected = selectedTimeline === time.id;
                  return (
                    <div
                      key={time.id}
                      onClick={() => setSelectedTimeline(time.id)}
                      className={`relative p-4 rounded-2xl border transition-colors cursor-pointer flex flex-col justify-between overflow-hidden ${
                        isSelected
                          ? 'bg-[#120d24] border-[#7c3aed]'
                          : 'bg-[#06050a] border-white/10 hover:border-purple-500/35'
                      }`}
                    >
                      <div>
                        <h6 className="text-xs sm:text-sm font-bold text-white mb-1">
                          {isAr ? time.titleAr : time.titleEn}
                        </h6>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          {isAr ? time.descAr : time.descEn}
                        </p>
                      </div>
                      <div className="mt-3 flex justify-end">
                        <span
                          className={`text-[10px] font-mono font-bold ${
                            isSelected ? 'text-purple-300' : 'text-zinc-500'
                          }`}
                        >
                          {isSelected ? (isAr ? 'محدد ✓' : 'Selected ✓') : ''}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <LiquidGlassButton
                onClick={() => setCurrentStep(2)}
                variant="secondary"
                size="sm"
              >
                <ArrowLeft className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                <span>{isAr ? 'الرجوع للخدمات' : 'Back'}</span>
              </LiquidGlassButton>

              <LiquidGlassButton
                onClick={() => {
                  setCurrentStep(4);
                  if (onComplete) onComplete(summaryData);
                }}
                variant="primary"
                size="md"
              >
                <span>{isAr ? 'توليد ملخص النبض وعرض السعر' : 'Generate Scope Brief'}</span>
                <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              </LiquidGlassButton>
            </div>
          </motion.div>
        )}

        {/* STEP 4: INSTANT SCOPE BRIEF & DIRECT ACTION */}
        {currentStep === 4 && (
          <motion.div
            key="step-4"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="space-y-6"
          >
            {/* Header Badge */}
            <div className="text-center max-w-xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/35 text-purple-300 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>{isAr ? 'تم تجهيز ملخص النبض بنجاح' : 'Scope Brief Ready'}</span>
              </div>
              <h4 className="text-2xl sm:text-3xl font-black text-white">
                {isAr ? 'خارطة طريق مخصصة لتحقيق أعلى عائد' : 'Your Tailored Scaling Matrix'}
              </h4>
              <p className="text-xs sm:text-sm text-zinc-400">
                {isAr
                  ? 'تمت مواءمة الخدمات والميزانية لتقليص زمن التفاوض والانطلاق فوراً.'
                  : 'Synthesized directly into a ready-to-execute roadmap to eliminate overhead.'}
              </p>
            </div>

            {/* Generated Brief Card */}
            <div className="relative p-6 sm:p-7 rounded-2xl bg-[#06050a] border border-white/10 space-y-4 overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
                <div className="p-3.5 rounded-xl bg-[#09080f] border border-white/10">
                  <span className="text-[11px] text-zinc-400 block mb-1">
                    {isAr ? 'نوع المشروع' : 'Project Model'}
                  </span>
                  <span className="text-sm font-bold text-white">{summaryData.projectTypeTitle}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#09080f] border border-white/10">
                  <span className="text-[11px] text-zinc-400 block mb-1">
                    {isAr ? 'الخدمات المختارة' : 'Selected Services'}
                  </span>
                  <span className="text-sm font-bold text-purple-300">
                    {summaryData.selectedArms.length} {isAr ? 'خدمات' : 'Services'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#09080f] border border-white/10">
                  <span className="text-[11px] text-zinc-400 block mb-1">
                    {isAr ? 'الميزانية التقديرية' : 'Budget Band'}
                  </span>
                  <span className="text-xs font-bold text-white">{summaryData.budgetLabel}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#09080f] border border-white/10">
                  <span className="text-[11px] text-zinc-400 block mb-1">
                    {isAr ? 'موعد الانطلاق' : 'Launch Target'}
                  </span>
                  <span className="text-xs font-bold text-purple-300">{summaryData.targetTimelineTitle}</span>
                </div>
              </div>

              {/* Selected Arms Pills */}
              <div className="pt-2 relative z-10">
                <span className="text-xs text-zinc-400 block mb-2 font-medium">
                  {isAr ? 'الخدمات التسويقية والتقنية المختارة:' : 'Included Execution Matrix:'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {summaryData.selectedArmsTitles.map((title, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-200 text-xs font-bold"
                    >
                      {title}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Direct High-Converting Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <LiquidGlassButton
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="primary"
                size="lg"
                className="w-full justify-center"
              >
                <MessageCircle className="w-5 h-5 text-white" />
                <span>{isAr ? 'إرسال الملخص لواتساب وبدء النقاش' : 'Send Scope via WhatsApp'}</span>
              </LiquidGlassButton>

              <div className="flex items-center gap-2">
                <LiquidGlassButton
                  onClick={handleCopySummary}
                  variant="secondary"
                  size="md"
                  className="flex-1 justify-center"
                >
                  {copiedSummary ? <CheckCircle2 className="w-4 h-4 text-purple-300" /> : <Copy className="w-4 h-4 text-purple-300" />}
                  <span>{copiedSummary ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ الملخص' : 'Copy Brief')}</span>
                </LiquidGlassButton>

                <LiquidGlassButton
                  onClick={handleReset}
                  variant="secondary"
                  size="md"
                  title={isAr ? 'إعادة ضبط المعالج' : 'Reset Wizard'}
                  className="px-4"
                >
                  <RotateCcw className="w-4 h-4 text-purple-300" />
                </LiquidGlassButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
