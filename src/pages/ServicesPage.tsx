import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedArms } from '../data/agencyData';
const ThreeDalaMorphCanvas = React.lazy(() =>
  import('../components/ThreeDalaMorphCanvas').then((m) => ({ default: m.ThreeDalaMorphCanvas }))
);
import { ServiceParticleController } from '../components/ServiceParticleController';
import { SectionDivider, AnimatedGlowDivider } from '../components/SectionDivider';
import { EightArmsSkeletonGrid } from '../components/CardSkeletons';
import { ArmDetailStandaloneView } from '../components/ArmDetailStandaloneView';
import { LiquidGlassButton } from '../components/LiquidGlassButton';
import { BlurUpImage } from '../components/BlurUpImage';
import type { ArmData } from '../types';

// Staggered entrance animation variants for the service system integration matrix
const phaseGridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const phaseCardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};
import {
  Sparkles,
  Compass,
  Layout,
  Target,
  Feather,
  Video,
  Cpu,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Check,
  MessageCircle,
  Phone,
  Zap,
  RotateCcw,
} from 'lucide-react';

interface ServicesPageProps {
  onNavigate: (page: string) => void;
  onSectionChange?: (section: string) => void;
  onOpenConsultation: () => void;
  onSelectServiceForConsultation?: (serviceTitle: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onNavigate,
  onSectionChange,
  onOpenConsultation,
  onSelectServiceForConsultation,
}) => {
  const { isAr, dir, lang } = useLanguage();
  const armsList = useMemo(() => getLocalizedArms(lang), [lang]);

  // Active step (0 to 7)
  const [activeStep, setActiveStep] = useState<number>(0);
  // Continuous scroll progress passed to 3D canvas (dissolves during transitions)
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  // Selected arm detail view (Full-Screen expanding transition with zero scroll jump)
  const [selectedArmDetail, setSelectedArmDetail] = useState<ArmData | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isLoadingArms, setIsLoadingArms] = useState<boolean>(true);

  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => {
      setIsLoadingArms(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [lang]);

  // Reset arm detail when navigation occurs or reset event is fired
  useEffect(() => {
    const handleReset = () => setSelectedArmDetail(null);
    window.addEventListener('pulse-octo:reset-arm-detail', handleReset);
    return () => window.removeEventListener('pulse-octo:reset-arm-detail', handleReset);
  }, []);

  // Transition lock to ensure clean step-by-step morphing
  const isTransitioningRef = useRef<boolean>(false);
  const animTimerRef = useRef<number | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);

  const getDisciplineIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Sparkles': return Sparkles;
      case 'Compass': return Compass;
      case 'Layout': return Layout;
      case 'Target': return Target;
      case 'Feather': return Feather;
      case 'Video': return Video;
      case 'Cpu': return Cpu;
      case 'TrendingUp': return TrendingUp;
      default: return Sparkles;
    }
  };

  /**
   * Smooth step transition function
   * Animate progress smoothly through the midpoint (where dissolution peaks),
   * then reassembles into the target shape, and immediately updates `currentSection` in SEOHead.
   */
  const goToStep = useCallback(
    (targetIndex: number) => {
      const safeTarget = Math.min(Math.max(targetIndex, 0), 7);
      const nextArmSection = `arm-${safeTarget + 1}`;
      onSectionChange?.(nextArmSection);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('pulse-octo:section-change', {
            detail: { section: nextArmSection },
          })
        );
      }

      if (safeTarget === activeStep || isTransitioningRef.current) return;

      isTransitioningRef.current = true;
      const startIndex = activeStep;
      const startTime = performance.now();
      const duration = 650; // ms for full dissolve & reassemble cycle

      if (animTimerRef.current) cancelAnimationFrame(animTimerRef.current);

      const stepAnimation = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);

        // Smooth cubic ease in-out
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        const currentProg = startIndex + (safeTarget - startIndex) * ease;
        setScrollProgress(currentProg);

        if (t >= 0.45 && activeStep !== safeTarget) {
          setActiveStep(safeTarget);
        }

        if (t < 1) {
          animTimerRef.current = requestAnimationFrame(stepAnimation);
        } else {
          setScrollProgress(safeTarget);
          setActiveStep(safeTarget);
          setTimeout(() => {
            isTransitioningRef.current = false;
          }, 100);
        }
      };

      animTimerRef.current = requestAnimationFrame(stepAnimation);
    },
    [activeStep, onSectionChange]
  );

  // ─────────────────────────────────────────────────────────────
  // STEP-LOCKED WHEEL & TOUCH CONTROLLER
  // When cursor/touch is over the interactive stage:
  // Scroll down -> dissolves particles, slides text, reassembles into next icon!
  // Scroll up -> dissolves particles, reassembles into prev icon!
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let wheelCooldown = false;

    const onWheel = (e: WheelEvent) => {
      // Check if mouse is hovering over the stage
      const rect = stage.getBoundingClientRect();
      const inView = rect.top <= 100 && rect.bottom >= window.innerHeight - 100;
      if (!inView) return;

      // Scroll Down -> Next Service
      if (e.deltaY > 25) {
        if (activeStep < 7) {
          e.preventDefault();
          if (wheelCooldown || isTransitioningRef.current) return;
          wheelCooldown = true;
          goToStep(activeStep + 1);
          setTimeout(() => {
            wheelCooldown = false;
          }, 600);
        }
        // If at step 7, do not preventDefault: user can scroll naturally down to the matrix!
      }
      // Scroll Up -> Prev Service
      else if (e.deltaY < -25) {
        if (activeStep > 0) {
          e.preventDefault();
          if (wheelCooldown || isTransitioningRef.current) return;
          wheelCooldown = true;
          goToStep(activeStep - 1);
          setTimeout(() => {
            wheelCooldown = false;
          }, 600);
        }
        // If at step 0, do not preventDefault: user can scroll naturally up to the hero!
      }
    };

    // Touch Swipe Detection for mobile
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      const rect = stage.getBoundingClientRect();
      const inView = rect.top <= 120 && rect.bottom >= window.innerHeight - 120;
      if (!inView) return;

      const deltaY = touchStartY - e.changedTouches[0].clientY;
      if (deltaY > 40 && activeStep < 7) {
        goToStep(activeStep + 1);
      } else if (deltaY < -40 && activeStep > 0) {
        goToStep(activeStep - 1);
      }
    };

    // Keyboard Arrow navigation
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        if (activeStep < 7) {
          e.preventDefault();
          goToStep(activeStep + 1);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (activeStep > 0) {
          e.preventDefault();
          goToStep(activeStep - 1);
        }
      }
    };

    stage.addEventListener('wheel', onWheel, { passive: false });
    stage.addEventListener('touchstart', onTouchStart, { passive: true });
    stage.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKeyDown);

    return () => {
      stage.removeEventListener('wheel', onWheel);
      stage.removeEventListener('touchstart', onTouchStart);
      stage.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKeyDown);
      if (animTimerRef.current) cancelAnimationFrame(animTimerRef.current);
    };
  }, [activeStep, goToStep]);

  const handleBookArm = (armTitle: string) => {
    if (onSelectServiceForConsultation) {
      onSelectServiceForConsultation(armTitle);
    } else {
      onOpenConsultation();
    }
  };

  const scrollToStage = () => {
    stageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const currentArm = armsList[activeStep] || armsList[0];
  const CurrentIcon = getDisciplineIcon(currentArm.iconName);
  const cleanTitle = currentArm.title.replace(/^الذراع\s+[^\:]+\:\s*/, '');

  return (
    <div
      dir={dir}
      className={`min-h-screen bg-transparent text-[#ffffff] selection:bg-[#8052ff] selection:text-white ${
        isAr ? "font-['Cairo',sans-serif]" : "font-['Inter',sans-serif]"
      }`}
    >
      {/* ─────────────────────────────────────────────────────────────
          TOP BANNER: SWITCH TO CLASSIC FULL VIEW IF USER PREFERS
          ───────────────────────────────────────────────────────────── */}
      <div className="pt-24 pb-2 px-4 max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="inline-flex items-center gap-2 text-[12px] font-mono text-[#9a9a9a]">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          <span>{isAr ? 'وضع العرض التفاعلي' : 'Interactive Mode'}</span>
        </div>

        <button
          onClick={() => onNavigate('the-8-arms')}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[12px] font-mono text-purple-300 hover:text-white transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-purple-400" />
          <span>{isAr ? 'العودة للعرض الكامل الأصلي' : 'Back to Classic Full View'}</span>
        </button>
      </div>

      {/* Dynamic Service Particle Controller connected to ParticleBackground */}
      <ServiceParticleController activeSectionIndex={activeStep} />

      {/* ─────────────────────────────────────────────────────────────
          1. INTRO HERO HEADER (Full-Width Video Background, Frosted Glass Card)
          ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-12 pb-16 px-4 sm:px-8 lg:px-12 max-w-[1280px] mx-auto text-center overflow-hidden rounded-3xl my-6">
        {/* Ambient edge vignettes blending with GlobalMasterVideoBackground */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#000000]/60 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#000000] to-transparent" />
        </div>

        {/* Frosted Transparent Glass Card */}
        <div className="group/glass-card relative z-10 max-w-[880px] mx-auto rounded-3xl p-6 sm:p-10 md:p-12 shadow-[0_24px_60px_rgba(0,0,0,0.65),0_0_25px_rgba(138,43,226,0.12)] transition-shadow duration-500">
          {/* Ambient Glow Bloom on Hover */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-600/15 via-cyan-500/10 to-purple-600/15 blur-xl opacity-0 group-hover/glass-card:opacity-100 transition-opacity duration-700 pointer-events-none -z-10" />

          {/* Frosted Glass Inner Mask Surface Layer */}
          <div
            style={{ backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
            className="absolute inset-[1px] rounded-[23px] bg-[#070414]/40 group-hover/glass-card:bg-[#070414]/50 border border-white/[0.12] group-hover/glass-card:border-purple-400/40 pointer-events-none transition-all duration-500 z-0"
          />

          {/* Inner Content Wrapper */}
          <div className="relative z-10 w-full space-y-5">
            {/* Saffron Spark Uppercase Label */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08]">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span className="text-[12px] font-mono tracking-[0.2em] uppercase text-purple-300">
                {isAr ? 'منظومة الأذرع الثمانية' : '8 ARMS · INTERACTIVE STAGE'}
              </span>
            </div>

            {/* Outsized Monolithic Headline */}
            <h1 className="text-[36px] sm:text-[54px] lg:text-[72px] font-normal leading-[1.08] tracking-[-0.03em] text-[#ffffff]">
              {isAr ? (
                <>
                  8 أذرع. نظام واحد. <br />
                  <span className="text-[#c084fc]">نبض رقمي متصل.</span>
                </>
              ) : (
                <>
                  8 Arms. One System. <br />
                  <span className="text-[#c084fc]">One Digital Pulse.</span>
                </>
              )}
            </h1>

            {/* Ultra-Light Signature Body Copy */}
            <p className="text-zinc-300 font-normal text-[15px] sm:text-[17px] leading-[1.65] max-w-[660px] mx-auto">
              {isAr
                ? 'نظام نمو رقمي متكامل يجمع ثمانية تخصصات مترابطة، تصمم وتنفذ لتبني لعلامتك التجارية حضوراً استثنائياً ونتائج ملموسة في السوق.'
                : 'An integrated digital growth system combining eight interconnected disciplines, engineered to build lasting brand equity and market leadership.'}
            </p>

            {/* Action Trigger Button */}
            <div className="pt-2 flex flex-col items-center gap-2">
              <button
                onClick={scrollToStage}
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#7a38e8] to-[#5e22c0] hover:from-[#8846f5] hover:to-[#6a2ad0] active:scale-[0.98] text-white text-[14px] font-semibold tracking-[0.025em] transition-all duration-300 shadow-[0_4px_20px_rgba(122,56,232,0.3)] cursor-pointer"
              >
                <span>{isAr ? 'استكشف المنظومة' : 'Explore System'}</span>
                <ChevronDown className="w-4 h-4 text-purple-200" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider variant="gold" />

      {/* ─────────────────────────────────────────────────────────────
          2. THE PINNED FULLSCREEN STAGE (FIXED SECTION)
          The user stays on this screen.
          Every scroll gesture triggers the dissolve & reassemble animation!
          ───────────────────────────────────────────────────────────── */}
      <section
        ref={stageRef}
        id="interactive-morph-stage"
        className="min-h-screen w-full relative flex flex-col justify-between py-6 px-4 sm:px-8 lg:px-14 bg-[#000000] border-y border-white/[0.08] overflow-hidden"
        aria-label="Pinned Morphing Particle Services Stage"
      >
        {/* Ambient background glow behind active arm */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-b from-[#8052ff]/10 via-[#06b6d4]/5 to-transparent blur-[160px] pointer-events-none -z-10" />

        {/* Top Control Dock */}
        <div className="max-w-[1280px] w-full mx-auto flex items-center justify-between gap-4 border-b border-white/[0.08] pb-4 shrink-0">
          {/* Active Step Counter */}
          <div className="flex items-center gap-3">
            <span className="text-[14px] font-mono text-purple-300 font-semibold">
              ARM 0{activeStep + 1}
            </span>
            <span className="text-white/20 font-mono">·</span>
            <span className="text-[12px] font-mono text-[#9a9a9a]">
              08 TOTAL DISCIPLINES
            </span>
          </div>

          {/* Quick-Jump Step Tabs (01 to 08) */}
          <div className="flex items-center gap-1 sm:gap-2">
            {armsList.map((arm, i) => (
              <button
                key={arm.id}
                onClick={() => goToStep(i)}
                className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] font-mono transition-all duration-300 cursor-pointer ${
                  activeStep === i
                    ? 'bg-purple-600 text-white font-semibold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.05]'
                }`}
                aria-label={`Jump to arm 0${i + 1}`}
              >
                <span>0{i + 1}</span>
              </button>
            ))}
          </div>

          {/* Direct Consultation Link */}
          <button
            onClick={onOpenConsultation}
            className="text-[12px] font-mono text-[#06b6d4] hover:text-white uppercase tracking-wider hidden md:inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-[#06b6d4]" />
            <span>{isAr ? 'حجز المنظومة' : 'Book System'}</span>
          </button>
        </div>

        {/* Main Central Stage: Two Columns
            Column 1: Active Service Text (Smooth Crossfade & Slide)
            Column 2: 3D Three.js Dissolving & Reassembling Particle Pyramids
        */}
        <div className="max-w-[1280px] w-full mx-auto my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center py-6">
          {/* Column 1: Active Service Content (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center text-start">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentArm.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                {/* Outsized Monolithic Number + Discipline Icon Badge */}
                <div className="flex items-center gap-4">
                  <span className="text-[64px] sm:text-[88px] font-extralight text-[#9a9a9a]/40 leading-none select-none tracking-tight font-mono">
                    0{currentArm.id}
                  </span>
                  <div className="p-3.5 rounded-full bg-[#8052ff]/10 border border-[#8052ff]/30 text-[#8052ff] shadow-[0_0_25px_rgba(128,82,255,0.3)]">
                    <CurrentIcon className="w-6 h-6 text-[#8052ff]" />
                  </div>
                  <div className="text-start">
                    <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#06b6d4] block">
                      {currentArm.enTitle}
                    </span>
                    <span className="text-[12px] font-mono uppercase text-[#ffb829] tracking-wider font-semibold">
                      {isAr ? 'الأثر المعتمد:' : 'PROVEN OUTCOME:'} {currentArm.metric}
                    </span>
                  </div>
                </div>

                {/* Headline: Weight 400, Negative Tracking (-0.035em), Outsized Scale */}
                <h2 className="text-[34px] sm:text-[46px] lg:text-[54px] font-normal tracking-[-0.035em] text-[#ffffff] leading-[1.12]">
                  {cleanTitle}
                </h2>

                {/* Ultra-Light Body Text (Weight 200, 18px, Line-height 1.65) */}
                <p className="text-[#bdbdbd] font-extralight text-[17px] sm:text-[18px] leading-[1.65] max-w-[580px]">
                  {currentArm.philosophy}
                </p>

                {/* Core Objective */}
                <div className="flex items-start gap-3 text-start py-2 border-y border-white/[0.06]">
                  <span className="w-2 h-2 rounded-full bg-[#ffb829] mt-2 shrink-0 animate-pulse" />
                  <p className="text-[14px] sm:text-[15px] text-slate-300 font-extralight leading-relaxed">
                    <strong className="text-white font-normal">
                      {isAr ? 'الهدف المحوري: ' : 'Core Objective: '}
                    </strong>
                    {currentArm.goal}
                  </p>
                </div>

                {/* Executive Deliverables List */}
                <div className="pt-1">
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#9a9a9a] block mb-2.5">
                    {isAr ? 'المخرجات التنفيذية:' : 'KEY DELIVERABLES:'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentArm.deliverables?.slice(0, 4).map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 py-1 text-start"
                      >
                        <Check className="w-4 h-4 text-[#8052ff] shrink-0 mt-0.5" />
                        <span className="text-[13px] sm:text-[14px] text-slate-300 font-extralight leading-snug">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual Card Preview for the active arm (Clickable to trigger smooth Framer Motion expanding transition) */}
                <div
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(
                        new CustomEvent('pulse-octo:open-arm', {
                          detail: { armId: currentArm.id, arm: currentArm },
                        })
                      );
                    } else {
                      setSelectedArmDetail(currentArm);
                    }
                  }}
                  className="group/card relative rounded-2xl overflow-hidden border border-white/[0.1] hover:border-purple-400/60 aspect-[16/7] max-h-44 bg-black/60 cursor-pointer shadow-[0_12px_30px_rgba(0,0,0,0.7)] transition-all duration-300"
                >
                  <BlurUpImage
                    src={currentArm.image}
                    alt={currentArm.title}
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover/card:scale-106"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080515]/90 via-[#080515]/30 to-transparent pointer-events-none z-10" />
                  <div className="absolute bottom-3 inset-x-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-[11px] font-mono text-purple-200">
                      ARM 0{currentArm.id} · {currentArm.tag || currentArm.enTitle}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600/85 group-hover/card:bg-purple-500 text-white text-[11px] font-semibold backdrop-blur-md shadow-md transition-colors">
                      <span>{isAr ? 'توسيع إلى صفحة الخدمة الكاملة' : 'Expand Full Service Page'}</span>
                      <ArrowRight className={`w-3 h-3 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.dispatchEvent(
                          new CustomEvent('pulse-octo:open-arm', {
                            detail: { armId: currentArm.id, arm: currentArm },
                          })
                        );
                      } else {
                        setSelectedArmDetail(currentArm);
                      }
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-purple-400 text-purple-200 hover:text-white text-[13px] font-semibold transition-all cursor-pointer active:scale-95 shadow-sm"
                  >
                    <span>{isAr ? 'عرض وتكبير صفحة الخدمة' : 'View Full Service Page'}</span>
                    <ArrowRight className={`w-3.5 h-3.5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                  </button>

                  <button
                    onClick={() => handleBookArm(currentArm.title)}
                    className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-[#8052ff] hover:bg-[#7042f0] active:scale-[0.98] text-white text-[13px] font-semibold tracking-wider uppercase transition-all duration-300 shadow-[0_0_25px_rgba(128,82,255,0.4)] cursor-pointer"
                  >
                    <span>{isAr ? 'حجز هذه الخدمة' : 'Deploy This Service'}</span>
                  </button>

                  <button
                    onClick={() => onNavigate('contact')}
                    className="inline-flex items-center gap-2 text-[#9a9a9a] hover:text-white text-[13px] font-medium py-2 px-3 transition-colors cursor-pointer group"
                  >
                    <span>{isAr ? 'طلب استشارة' : 'Consultation'}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#06b6d4] transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Column 2: 3D Visual Centerpiece on Desktop (>= 768px), Pure CSS Gradient Stage on Mobile (< 768px) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative w-full">
            {typeof window !== 'undefined' && window.innerWidth >= 768 ? (
              <React.Suspense
                fallback={
                  <div className="w-full aspect-square max-w-[580px] mx-auto rounded-3xl bg-white/[0.01] border border-white/5 animate-pulse" />
                }
              >
                <ThreeDalaMorphCanvas
                  progress={scrollProgress}
                  activeIndex={activeStep}
                  isAr={isAr}
                />
              </React.Suspense>
            ) : (
              <div
                aria-hidden="true"
                className="w-full aspect-[4/3] max-w-[420px] mx-auto rounded-3xl border border-purple-500/20 flex flex-col items-center justify-center relative overflow-hidden bg-[#06040e] bg-[radial-gradient(circle_at_50%_45%,rgba(128,82,255,0.28)_0%,rgba(6,182,212,0.08)_45%,rgba(3,1,8,0.96)_85%)]"
              >
                <div className="w-20 h-20 rounded-2xl bg-[#120b29] border border-purple-400/35 flex items-center justify-center shadow-[0_0_40px_rgba(128,82,255,0.35)]">
                  <CurrentIcon className="w-10 h-10 text-purple-300" />
                </div>
                <span className="mt-4 text-xs font-mono tracking-widest uppercase text-purple-300/80">
                  ARM 0{currentArm.id} · {currentArm.enTitle}
                </span>
              </div>
            )}

            {/* Direct Step Trigger Bar on mobile & desktop */}
            <div className="flex items-center gap-3 pt-3">
              <button
                onClick={() => goToStep(Math.max(activeStep - 1, 0))}
                disabled={activeStep === 0}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/10 hover:border-[#8052ff] text-slate-300 hover:text-white text-[12px] font-mono disabled:opacity-20 transition-all cursor-pointer"
              >
                <ChevronUp className="w-3.5 h-3.5" />
                <span>{isAr ? 'الخدمة السابقة' : 'Previous'}</span>
              </button>

              <button
                onClick={() => goToStep(Math.min(activeStep + 1, 7))}
                disabled={activeStep === 7}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#8052ff] hover:bg-[#7042f0] text-white text-[12px] font-mono font-semibold shadow-[0_0_20px_rgba(128,82,255,0.3)] disabled:opacity-20 transition-all cursor-pointer"
              >
                <span>{isAr ? 'الخدمة التالية' : 'Next Arm'}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Continuous Progress Bar & Status */}
        <div className="max-w-[1280px] w-full mx-auto flex items-center justify-between gap-6 border-t border-white/[0.08] pt-3 shrink-0">
          {/* Scroll Guidance Indicator */}
          <div className="flex items-center gap-2 text-[12px] font-mono text-[#9a9a9a]">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            <span>
              {isAr
                ? 'مرر بالماوس أو اللمس للانتقال بين الخدمات'
                : 'Scroll or swipe to navigate between disciplines'}
            </span>
          </div>

          {/* Continuous Progress Bar */}
          <div className="flex-1 max-w-xs h-[3px] rounded-full bg-white/[0.08] overflow-hidden hidden sm:block">
            <div
              className="h-full bg-gradient-to-r from-[#8052ff] via-[#ffb829] to-[#06b6d4] transition-all duration-200"
              style={{ width: `${Math.min(Math.max(((scrollProgress + 0.1) / 7.0) * 100, 2), 100)}%` }}
            />
          </div>

          {/* Arm position tracker */}
          <div className="text-[12px] font-mono text-purple-300">
            {activeStep + 1} / 8
          </div>
        </div>
      </section>

      <SectionDivider variant="gold" />

      {/* ─────────────────────────────────────────────────────────────
          3. POST-SCROLL: SYSTEM INTEGRATION MATRIX
          ───────────────────────────────────────────────────────────── */}
      <section className="relative py-28 sm:py-36 px-6 sm:px-10 lg:px-16 max-w-[1280px] mx-auto border-t border-white/[0.08]">
        <div className="text-center max-w-[780px] mx-auto mb-16 space-y-4">
          <span className="text-[12px] font-mono tracking-[0.25em] uppercase text-purple-300">
            {isAr ? 'التآزر الحيوي · SYSTEM SYNTHESIS' : 'SYSTEM SYNTHESIS · ONE PULSE'}
          </span>
          <h2 className="text-[36px] sm:text-[52px] font-normal tracking-[-0.035em] text-white leading-tight">
            {isAr ? 'كيف تتكامل الأذرع الثمانية في نبض واحد؟' : 'How the 8 arms loop into compounding growth.'}
          </h2>
          <p className="text-[#bdbdbd] font-extralight text-[17px] sm:text-[18px] leading-relaxed">
            {isAr
              ? 'كل ذراع يمهد الطريق للذراع الذي يليه ويغذيه بالبيانات، ليتحول مشروعك من مجرد حملات عابرة إلى محرك نمو ذاتي الدفع.'
              : 'Every discipline paves the runway for the next and feeds it real-time data, converting your brand from isolated campaigns into a self-sustaining growth machine.'}
          </p>
        </div>

        {/* 4 Connected Phases with Staggered Entrance */}
        <motion.div
          variants={phaseGridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <motion.div
            variants={phaseCardVariants}
            className="p-6 rounded-2xl bg-[#09080f] hover:bg-[#0e0b18] border border-white/[0.08] hover:border-purple-500/30 transition-all duration-300 text-start space-y-3"
          >
            <span className="text-[11px] font-mono tracking-wider text-purple-300 block font-semibold">
              {isAr ? '01. مرحلة التأسيس' : '01. FOUNDATION'}
            </span>
            <h4 className="text-[18px] font-semibold text-white">
              {isAr ? 'الهوية والاستراتيجية' : 'Identity & Strategy'}
            </h4>
            <p className="text-[13px] text-zinc-300 font-normal leading-relaxed">
              {isAr
                ? 'خدمات الهوية والاستراتيجية تؤسسان الرسالة، النبرة، والموقع التنافسي للبراند.'
                : 'Identity & Strategy define the core narrative, voice, and market positioning.'}
            </p>
            <div className="text-[11px] font-mono text-purple-400 font-medium">
              01 + 02
            </div>
          </motion.div>

          <motion.div
            variants={phaseCardVariants}
            className="p-6 rounded-2xl bg-[#09080f] hover:bg-[#0e0b18] border border-white/[0.08] hover:border-purple-500/30 transition-all duration-300 text-start space-y-3"
          >
            <span className="text-[11px] font-mono tracking-wider text-purple-300 block font-semibold">
              {isAr ? '02. مرحلة الإنتاج' : '02. PRODUCTION'}
            </span>
            <h4 className="text-[18px] font-semibold text-white">
              {isAr ? 'المحتوى والاستوديو' : 'Content & Studio'}
            </h4>
            <p className="text-[13px] text-zinc-300 font-normal leading-relaxed">
              {isAr
                ? 'خدمات الاستوديو وصناعة المحتوى تنتج الفيديوهات السينمائية والكتابة الإعلانية التي توقف التمرير.'
                : 'Content & Studio craft scroll-stopping cinematic visuals and direct-response copy.'}
            </p>
            <div className="text-[11px] font-mono text-purple-400 font-medium">
              03 + 04
            </div>
          </motion.div>

          <motion.div
            variants={phaseCardVariants}
            className="p-6 rounded-2xl bg-[#09080f] hover:bg-[#0e0b18] border border-white/[0.08] hover:border-purple-500/30 transition-all duration-300 text-start space-y-3"
          >
            <span className="text-[11px] font-mono tracking-wider text-purple-300 block font-semibold">
              {isAr ? '03. مرحلة الاستحواذ' : '03. ACQUISITION'}
            </span>
            <h4 className="text-[18px] font-semibold text-white">
              {isAr ? 'الإعلانات والمنصات' : 'Paid Media & Web'}
            </h4>
            <p className="text-[13px] text-zinc-300 font-normal leading-relaxed">
              {isAr
                ? 'الحملات الممولة تضخ حركة الزوار المستهدفة نحو المنصات المصممة للتحويل الفوري.'
                : 'Targeted media buying channels traffic straight into conversion engines.'}
            </p>
            <div className="text-[11px] font-mono text-purple-400 font-medium">
              05 + 06
            </div>
          </motion.div>

          <motion.div
            variants={phaseCardVariants}
            className="p-6 rounded-2xl bg-[#09080f] hover:bg-[#0e0b18] border border-white/[0.08] hover:border-purple-500/30 transition-all duration-300 text-start space-y-3"
          >
            <span className="text-[11px] font-mono tracking-wider text-purple-300 block font-semibold">
              {isAr ? '04. مرحلة التوسع' : '04. COMPOUNDING'}
            </span>
            <h4 className="text-[18px] font-semibold text-white">
              {isAr ? 'البيانات و SEO' : 'AI Automation & SEO'}
            </h4>
            <p className="text-[13px] text-zinc-300 font-normal leading-relaxed">
              {isAr
                ? 'حلول الأتمتة وهندسة النمو تضاعف النتائج عبر البيانات وتحسين SEO التراكمي.'
                : 'AI automates operations and Growth Engineering scales recurring organic supremacy.'}
            </p>
            <div className="text-[11px] font-mono text-purple-400 font-medium">
              07 + 08
            </div>
          </motion.div>
        </motion.div>

        {/* ─────────────────────────────────────────────────────────────
            3.5. THE 8 CONNECTED SERVICE CARDS DIRECTORY
            Clicking any service card smoothly expands the card image via
            Framer Motion into the full-page header with zero scroll jump.
            ───────────────────────────────────────────────────────────── */}
        <div className="mt-20 sm:mt-28">
          <AnimatedGlowDivider variant="cyan" className="mb-12" />

          <div className="text-center max-w-[780px] mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-mono font-semibold text-purple-300">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span>{isAr ? 'منظومة الأذرع الثمانية' : 'THE 8 ARMS · FULL SERVICE SUITE'}</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-normal text-white tracking-tight">
              {isAr ? 'استكشف بطاقات الأذرع الثمانية بالتفصيل' : 'Explore the 8 Connected Disciplines'}
            </h3>
            <p className="text-zinc-400 text-sm sm:text-base font-light max-w-2xl mx-auto">
              {isAr
                ? 'منظومة متكاملة من ٨ تخصصات استراتيجية تعمل بتناغم كامل لتحقيق النمو المستدام لعلامتك التجارية.'
                : 'An integrated ecosystem of 8 strategic disciplines operating in complete harmony for your brand growth.'}
            </p>
          </div>

          {isLoadingArms ? (
            <EightArmsSkeletonGrid count={8} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {armsList.map((arm) => (
                <motion.div
                  key={arm.id}
                  whileHover={{ y: -6, scale: 1.015 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.dispatchEvent(
                        new CustomEvent('pulse-octo:open-arm', {
                          detail: { armId: arm.id, arm },
                        })
                      );
                    } else {
                      setSelectedArmDetail(arm);
                    }
                  }}
                  className="group/service-card relative rounded-2xl bg-[#09080f] border border-white/[0.08] hover:border-purple-500/40 p-4 sm:p-5 flex flex-col justify-between overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.85)] transition-all cursor-pointer"
                >
                  {/* Visual Image Container with subtle zoom on hover */}
                  <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-black/60 border border-white/10 group-hover/service-card:border-purple-400/40 mb-4 transition-colors">
                    <BlurUpImage
                      src={arm.image}
                      alt={arm.title}
                      className="w-full h-full"
                      imgClassName="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover/service-card:scale-108"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a071a]/85 via-transparent to-transparent pointer-events-none z-10" />
                    
                    {/* Top Arm Tag Badge */}
                    <div className="absolute top-2.5 start-2.5 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-mono text-purple-200">
                      ARM 0{arm.id}
                    </div>

                    {/* Hover Overlay Prompt */}
                    <div className="absolute inset-0 bg-purple-950/40 backdrop-blur-[2px] opacity-0 group-hover/service-card:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-3 py-1.5 rounded-full bg-black/85 border border-purple-400 text-xs font-semibold text-white shadow-xl flex items-center gap-1.5">
                        <span>{isAr ? 'توسيع وعرض الصفحة' : 'Expand Service'}</span>
                        <ArrowRight className={`w-3.5 h-3.5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="space-y-2 mb-4 text-start">
                    <span className="text-[11px] font-mono uppercase text-cyan-300 block tracking-wider">
                      {arm.enTitle}
                    </span>
                    <h4 className="text-base sm:text-lg font-bold text-white group-hover/service-card:text-purple-200 transition-colors leading-snug line-clamp-2">
                      {arm.title}
                    </h4>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {arm.philosophy}
                    </p>
                  </div>

                  {/* Card Footer: Metric & Expand Button */}
                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-purple-300/90 font-medium">
                      {arm.metric}
                    </span>
                    <span className="text-xs text-cyan-400 group-hover/service-card:text-white font-semibold inline-flex items-center gap-1 transition-colors">
                      <span>{isAr ? 'تفاصيل' : 'Details'}</span>
                      <ArrowRight className={`w-3 h-3 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <AnimatedGlowDivider variant="pulse" />

      {/* ─────────────────────────────────────────────────────────────
          4. BOTTOM CALL TO ACTION — Pure Void & Electric Violet Pill
          ───────────────────────────────────────────────────────────── */}
      <section className="relative py-28 sm:py-36 px-6 sm:px-10 lg:px-16 max-w-[1280px] mx-auto text-center border-t border-white/[0.08] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-[#8052ff]/15 blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-[760px] mx-auto space-y-8">
          <span className="text-[12px] font-mono tracking-[0.25em] uppercase text-[#ffb829]">
            {isAr ? 'جاهز لربط علامتك بالمنظومة؟' : 'READY TO PLUG INTO THE SYSTEM?'}
          </span>

          <h2 className="text-[44px] sm:text-[68px] lg:text-[76px] font-normal tracking-[-0.04em] text-white leading-[1.08]">
            {isAr ? (
              <>
                علامتك التجارية تستحق <br />
                <span className="text-[#8052ff]">منظومة كاملة</span>، لا أنصاف حلول.
              </>
            ) : (
              <>
                Your brand demands <br />
                <span className="text-[#8052ff]">one system</span>, not half measures.
              </>
            )}
          </h2>

          <p className="text-[#bdbdbd] font-extralight text-[18px] sm:text-[20px] leading-relaxed max-w-[560px] mx-auto">
            {isAr
              ? 'تحدث مباشرة مع مستشاري النمو في Pulse OCTO، لنرسم معاً خريطة الربط الاستراتيجي بين الأذرع الثمانية لمشروعك.'
              : 'Consult directly with Pulse OCTO growth architects to map out the bespoke 8-arm synergy roadmap for your enterprise.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-4">
            <LiquidGlassButton
              onClick={onOpenConsultation}
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
            >
              <span>{isAr ? 'ابدأ نبض مشروعك الآن' : 'Ignite Your Pulse Now'}</span>
            </LiquidGlassButton>

            <LiquidGlassButton
              href={`https://wa.me/201116066968?text=${encodeURIComponent(
                isAr
                  ? 'مرحباً Pulse OCTO، أود حجز جلسة استشارية لاستكشاف منظومة الـ 8 أذرع لعلامتي التجارية.'
                  : 'Hello Pulse OCTO, I would like to book a strategic audit for the 8 Arms system.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>{isAr ? 'محادثة فورية على واتساب' : 'Direct WhatsApp'}</span>
            </LiquidGlassButton>
          </div>

          <div className="pt-4">
            <a
              href="tel:+201112998882"
              className="inline-flex items-center gap-2 text-[12px] font-mono text-slate-500 hover:text-purple-300 transition-colors"
              dir="ltr"
            >
              <Phone className="w-3.5 h-3.5 text-purple-400" />
              <span>+20 111 299 8882 · BANHA HQ</span>
            </a>
          </div>
        </div>
      </section>

      {/* Standalone Full-Screen Service View (Portaled directly to document.body for zero-scroll-jump & true viewport fixing) */}
      {isMounted &&
        typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {selectedArmDetail && (
              <ArmDetailStandaloneView
                arm={selectedArmDetail}
                allArms={armsList}
                onBack={() => setSelectedArmDetail(null)}
                onSelectArm={(newArm) => setSelectedArmDetail(newArm)}
                onOpenConsultation={() => handleBookArm(selectedArmDetail.title)}
              />
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
};
