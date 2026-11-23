import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Layers,
  ChevronLeft,
  X,
  RotateCcw,
  Zap,
  ShieldCheck,
  Compass,
  MessageCircle
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import type { ArmData } from '../types';
import { OctoLogo } from './OctoLogo';
import { ArmSkillVisualization } from './ArmSkillVisualization';
import { LiquidGlassButton } from './LiquidGlassButton';
import { BlurUpImage } from './BlurUpImage';

interface ArmDetailStandaloneViewProps {
  arm: ArmData;
  allArms: ArmData[];
  onBack: () => void;
  onGoHome?: () => void;
  onSelectArm: (arm: ArmData) => void;
  onOpenConsultation: () => void;
}

export const ArmDetailStandaloneView: React.FC<ArmDetailStandaloneViewProps> = ({
  arm,
  allArms,
  onBack,
  onGoHome,
  onSelectArm,
  onOpenConsultation,
}) => {
  const { isAr, dir } = useLanguage();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Lock body scroll while full-screen standalone service view is active
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // When switching between services, smoothly scroll container to top and synchronize SEOHead in real time
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
    if (typeof window !== 'undefined' && arm?.id) {
      window.dispatchEvent(
        new CustomEvent('pulse-octo:section-change', {
          detail: { section: `arm-${arm.id}` },
        })
      );
    }
  }, [arm.id]);

  // Handle ESC key to return
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  // Find next arm in the 8 arms loop
  const currentIndex = allArms && allArms.length > 0 ? allArms.findIndex((a) => a.id === arm.id) : 0;
  const nextArm = allArms && allArms.length > 0 ? allArms[(currentIndex + 1) % allArms.length] : arm;

  const whatsappMessage = encodeURIComponent(
    isAr
      ? `مرحباً فريق Pulse OCTO، أود حجز استشارة استراتيجية لخدمة "${arm.title}".`
      : `Hello Pulse OCTO Team, I would like to book a strategic consultation for "${arm.title}".`
  );

  return (
    <motion.div
      ref={scrollContainerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[99999] overflow-y-auto overscroll-contain bg-[#030109] text-white selection:bg-purple-600 selection:text-white"
      dir={dir}
    >
      {/* ========================================================================= */}
      {/* 0. DEDICATED TOP LUXURY GLASS NAVIGATION BAR (دائماً ظاهر وثابت في الأعلى) */}
      {/* ========================================================================= */}
      <header className="sticky top-0 inset-x-0 z-50 bg-[#070414]/94 backdrop-blur-2xl border-b border-purple-500/25 px-4 sm:px-8 py-3 transition-all shadow-[0_10px_35px_rgba(0,0,0,0.85)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Right Section (in RTL): Brand Logo + Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onGoHome || onBack}
              className="cursor-pointer bg-transparent border-0 p-0 text-left hover:opacity-85 transition-opacity"
              title={isAr ? 'الرجوع للرئيسية' : 'Return to Home'}
            >
              <OctoLogo variant="compact" />
            </button>

            <span className="hidden sm:inline-block text-zinc-600 font-mono">|</span>

            {/* Breadcrumb Trail */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={onBack}
                className="text-zinc-400 hover:text-purple-300 transition-colors cursor-pointer"
              >
                {isAr ? 'منظومة الـ 8 أذرع' : 'The 8 Arms System'}
              </button>
              <span className="text-zinc-600">/</span>
              <span className="text-cyan-300 font-semibold truncate max-w-[200px] md:max-w-none">
                {arm.title}
              </span>
            </div>
          </div>

          {/* Left Section (in RTL): High-Visibility Back Button */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-purple-700/90 via-purple-900/90 to-[#0e0824]/95 hover:from-purple-600 hover:to-purple-900 border border-purple-400/50 hover:border-purple-300 text-white font-bold text-xs sm:text-sm shadow-[0_0_22px_rgba(138,43,226,0.45)] hover:shadow-[0_0_30px_rgba(138,43,226,0.65)] transition-all cursor-pointer group active:scale-95"
              aria-label={isAr ? 'الرجوع لمنظومة الخدمات' : 'Back to Services System'}
            >
              <ArrowLeft className={`w-4 h-4 text-cyan-300 transition-transform duration-300 group-hover:-translate-x-1 ${dir === 'rtl' ? 'rotate-180 group-hover:translate-x-1' : ''}`} />
              <span className="tracking-wide">
                {isAr ? 'العودة لمنظومة الخدمات' : 'Back to Services'}
              </span>
              <span className="hidden md:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/10 text-purple-200">
                ESC
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 1. CINEMATIC HERO HEADER WITH SMOOTH CARD-TO-HEADER EXPANSION             */}
      {/* ========================================================================= */}
      <section className="relative w-full h-[65vh] sm:h-[78vh] min-h-[500px] flex items-end sm:items-center justify-center overflow-hidden">
        {/* Expanding Hero Image Container: Starts with card proportions and expands into full-width header */}
        <motion.div
          key={`hero-img-${arm.id}`}
          initial={{ scale: 0.65, opacity: 0.35, borderRadius: '32px', y: 50 }}
          animate={{ scale: 1, opacity: 1, borderRadius: '0px', y: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-0 overflow-hidden"
        >
          {/* Inner Image with Smooth High-End Zoom Reveal */}
          <motion.img
            src={arm.image}
            alt={arm.title}
            initial={{ scale: 1.35, filter: 'blur(10px)' }}
            animate={{ scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full object-cover object-center"
          />

          {/* Ambient Synaptic Energy Video Layer: Video 12 (High-Voltage Electro-Octopus) */}
          <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none opacity-25 mix-blend-screen">
            <video
              src="/videos/pulse-video-12.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Layered Vignette Overlays for Maximum Legibility & Cinematic Atmosphere */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#030109] via-[#030109]/75 to-[#030109]/45" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#030109]/90 via-transparent to-[#030109]/90" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(88,28,135,0.28)_0%,rgba(3,1,9,0.85)_80%)] pointer-events-none" />
        </motion.div>

        {/* Ambient Top Tag Pill */}
        <div className="absolute top-6 inset-x-4 sm:inset-x-8 z-20 flex items-center justify-end max-w-7xl mx-auto pointer-events-none">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-[#09080f]/90 border border-white/15 text-purple-300 backdrop-blur-md shadow-lg">
            PULSE OCTO — {arm.tag || ('ARM 0' + arm.id)}
          </span>
        </div>

        {/* Hero Title & Teaser Content with Staggered Fade Up */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-12 sm:pb-0 text-center flex flex-col items-center"
        >
          {/* Large Editorial Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white mb-4 leading-tight tracking-tight drop-shadow-lg">
            {arm.title}
          </h1>

          <div className="text-xs sm:text-sm font-mono text-purple-300/80 mb-5 tracking-wide">
            {arm.enTitle}
          </div>

          {/* Short Narrative Teaser */}
          <p className="text-sm sm:text-base text-zinc-200 leading-relaxed max-w-2xl font-light drop-shadow">
            {arm.philosophy}
          </p>
        </motion.div>

        {/* Ambient Bottom Fade to Pure Black */}
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#030109] to-transparent pointer-events-none z-10" />
      </section>

      {/* ========================================================================= */}
      {/* 2. IN-DEPTH STRATEGIC & OPERATIONAL BLUEPRINT                             */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto relative z-20">
        {/* Narrative Section 1: Building With Purpose */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-20 items-start">
          <div className="md:col-span-4">
            <div className="sticky top-24">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-400 block mb-2">
                {isAr ? 'الفلسفة والمنهجية' : 'Doctrine & Philosophy'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {isAr ? 'البناء الاستراتيجي الهادف' : 'Building With Purpose'}
              </h2>
            </div>
          </div>

          <div className="md:col-span-8 space-y-4 text-zinc-300 text-sm sm:text-base leading-relaxed">
            <p>
              {isAr
                ? `لا تعمل خدمة "${arm.title}" كخدمة منفردة أو معزولة داخل PULSE OCTO. فلسفتنا تقوم على ربطها مباشرة بالعقل المركزي (The Core)، بحيث تتكامل في الزمن الفعلي مع باقي خدمات الإنتاج والتسويق والتطوير، مما يمنح علامتك التجارية حضوراً مهيباً وتأثيراً تراكمياً مضاعفاً.`
                : `The "${arm.title}" service does not operate as an isolated silo. Our philosophy connects this discipline directly into The Core, ensuring seamless synchronization with visual production, performance marketing, and technological execution.`}
            </p>
            <p className="text-zinc-400 text-sm">
              {arm.philosophy}
            </p>
          </div>
        </div>

        {/* Narrative Section 2: Real Imagery Gallery (صور حقيقية وأصول بصرية) */}
        <div className="mb-24">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-400 block mb-1">
                {isAr ? 'الأصول البصرية' : 'Visual Assets'}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                {isAr ? 'الأصول البصرية والتنفيذ الواقعي' : 'Real Visual Assets & Production'}
              </h3>
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-mono text-purple-300 bg-[#09080f] border border-white/10">
              {arm.metric}
            </span>
          </div>

          {/* Grid of Real Images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="relative rounded-2xl overflow-hidden aspect-[16/10] border border-white/10 group bg-black/60 shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
              <BlurUpImage
                src={arm.image}
                alt={arm.title}
                className="w-full h-full"
                imgClassName="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none z-10" />
              <div className="absolute bottom-3 inset-x-3 flex items-center justify-between z-20">
                <span className="text-xs font-mono text-white bg-black/80 px-2.5 py-1 rounded-md border border-white/10">
                  {arm.tag || 'OCTO'} — 01
                </span>
                <span className="text-xs text-purple-300 font-medium">PULSE OCTO REAL WORK</span>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden aspect-[16/10] border border-white/10 group bg-black/60 shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
              <BlurUpImage
                src={(arm as any).bgImage || arm.image}
                alt={arm.title}
                className="w-full h-full"
                imgClassName="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none z-10" />
              <div className="absolute bottom-3 inset-x-3 flex items-center justify-between z-20">
                <span className="text-xs font-mono text-white bg-black/80 px-2.5 py-1 rounded-md border border-white/10">
                  {arm.tag || 'OCTO'} — 02
                </span>
                <span className="text-xs text-purple-300 font-medium">{arm.metric}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Narrative Section 3: Interactive Animated Skill-Level Visualization */}
        <div className="mb-24">
          <div className="mb-8">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-400 block mb-1">
              {isAr ? 'الكفاءة التشغيلية' : 'Operational Mastery'}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              {isAr ? 'مصفوفة الكفاءة الرقمية ونسب الإتقان' : 'Capability Radar & Skill-Level Matrix'}
            </h3>
          </div>

          <ArmSkillVisualization
            arm={arm}
            onOpenConsultation={onOpenConsultation}
          />
        </div>

        {/* Narrative Section 4: Deliverables Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-24 items-start">
          <div className="md:col-span-4">
            <div className="sticky top-24">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-400 block mb-2">
                {isAr ? 'المخرجات التنفيذية' : 'Deliverables Matrix'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {isAr ? 'الاستراتيجية قبل التنفيذ' : 'Strategy Before Execution'}
              </h2>
              <p className="text-xs text-zinc-400 mt-2">
                {isAr ? 'المخرجات التنفيذية التي نلتزم بتسليمها بدقة واحترافية.' : 'Exact operational deliverables delivered with zero compromise.'}
              </p>
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {arm.deliverables && arm.deliverables.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#09080f] border border-white/[0.08] hover:border-purple-500/40 transition-colors flex items-start gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-[#0e0b18] border border-purple-500/30 flex items-center justify-center shrink-0 mt-0.5 text-purple-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm text-zinc-200 leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Dual Navigation: Return to 8-Arms Orbit & Next Service */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#09080f] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          {/* Prominent Bottom Back Button */}
          <LiquidGlassButton
            onClick={onBack}
            variant="secondary"
            size="md"
            className="w-full sm:w-auto"
          >
            <ArrowLeft className={`w-4 h-4 text-purple-300 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            <span>{isAr ? 'العودة لمدار المنظومة الـ ٨' : 'Return to 8-Arms System'}</span>
          </LiquidGlassButton>

          {/* Next Service Preview & Link */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-black/60 hidden sm:block">
              <BlurUpImage
                src={nextArm.image}
                alt={nextArm.title}
                className="w-full h-full"
                imgClassName="w-full h-full object-cover"
              />
            </div>
            <div className="text-center sm:text-start">
              <span className="text-[11px] font-mono text-purple-400 block mb-0.5">
                {isAr ? 'الخدمة التالية في المنظومة' : 'Next Service in the System'}
              </span>
              <h4 className="text-base sm:text-lg font-bold text-white">
                {nextArm.title}
              </h4>
            </div>

            <LiquidGlassButton
              onClick={() => onSelectArm(nextArm)}
              variant="primary"
              size="sm"
            >
              <span>{isAr ? 'استكشف' : 'Explore'}</span>
              <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            </LiquidGlassButton>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. BESPOKE STRATEGIC CONSULTATION CTA BAR                                  */}
      {/* ========================================================================= */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center relative z-20">
        <div className="relative rounded-3xl bg-[#09080f] border border-white/10 p-8 sm:p-14 overflow-hidden shadow-[0_24px_70px_rgba(0,0,0,0.9)]">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-purple-900/15 rounded-full blur-[120px] pointer-events-none" />

          <h3 className="text-2xl sm:text-4xl font-black text-white mb-4 leading-tight">
            {isAr ? `جاهز لإطلاق ${arm.title} في مشروعك؟` : `Ready to Deploy ${arm.title}?`}
          </h3>

          <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto mb-8 leading-relaxed font-light">
            {isAr
              ? 'احجز استشارة استراتيجية مباشرة لبناء منظومة متكاملة تربط هذا الذراع بباقي الأذرع لتحقيق أعلى عائد ونمو مستدام.'
              : 'Book a strategic consultation to integrate this operational arm seamlessly into your business system for sustained growth.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <LiquidGlassButton
              onClick={onOpenConsultation}
              variant="primary"
              size="lg"
            >
              <span>{isAr ? 'ابدأ نبض مشروعك' : 'Start Your Project Pulse'}</span>
              <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            </LiquidGlassButton>

            <LiquidGlassButton
              href={`https://wa.me/201116066968?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              size="lg"
            >
              <MessageCircle className="w-4 h-4 text-purple-300" />
              <span>{isAr ? 'واتساب مباشر' : 'Direct WhatsApp'}</span>
            </LiquidGlassButton>

            <LiquidGlassButton
              onClick={onBack}
              variant="secondary"
              size="lg"
            >
              <ArrowLeft className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              <span>{isAr ? 'العودة لمنظومة الخدمات' : 'Return to Services System'}</span>
            </LiquidGlassButton>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. PERSISTENT FLOATING 'BACK' BUTTON                                      */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.35, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="fixed bottom-6 start-6 sm:bottom-8 sm:start-8 z-[100005] pointer-events-auto"
      >
        <button
          type="button"
          onClick={onBack}
          className="group relative flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-[#09080f]/95 backdrop-blur-xl border border-white/15 hover:border-purple-500/50 text-white font-bold text-xs sm:text-sm shadow-[0_12px_40px_rgba(0,0,0,0.85)] transition-all duration-300 cursor-pointer active:scale-95 select-none"
          aria-label={isAr ? 'الرجوع لمنظومة الخدمات' : 'Back to Services'}
        >
          <div className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#7c3aed] text-white shrink-0 transition-transform duration-300 group-hover:-translate-x-0.5">
            <ArrowLeft className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 ${dir === 'rtl' ? 'rotate-180 group-hover:translate-x-0.5' : ''}`} />
          </div>

          <span className="relative z-10 tracking-wide font-medium">
            {isAr ? 'الرجوع للخدمات' : 'Back to Services'}
          </span>

          <span className="relative z-10 hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/10 text-slate-300 border border-white/10">
            ESC
          </span>
        </button>
      </motion.div>
    </motion.div>
  );
};
