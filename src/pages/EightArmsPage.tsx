import React, { useMemo, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, type Variants } from 'motion/react';
import { PageHeader } from '../components/PageHeader';
import { SectionDivider } from '../components/SectionDivider';
import { TiltCard } from '../components/TiltCard';
import { MagneticButton } from '../components/MagneticButton';
import { Orbit3DCarousel } from '../components/Orbit3DCarousel';
import { CoverflowMotionCarousel, type CoverflowCardItem } from '../components/CoverflowMotionCarousel';
import { AppleServicePreviewModal } from '../components/AppleServicePreviewModal';
import { getLocalizedCoverflowServices } from '../data/serviceCardsData';
import { ArmDetailStandaloneView } from '../components/ArmDetailStandaloneView';
import { AssemblingFrameCTA } from '../components/AssemblingFrameCTA';
import type { ArmData } from '../types';
import {
  ScrollReveal,
  ScrollStagger,
  staggerItemVariants,
  ScrollTextReveal
} from '../components/ScrollReveal';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedArms } from '../data/agencyData';
import {
  Sparkles,
  Compass,
  Layout,
  Layers,
  Target,
  Feather,
  Video,
  Cpu,
  TrendingUp,
  PhoneCall,
  MessageSquare,
  Globe,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Zap,
  Check,
  Activity,
  Award
} from 'lucide-react';

// Staggered 3D perspective entrance animation variants for the 8 Arms service card grid
const serviceGridContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.08,
    },
  },
};

const serviceCardItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 34,
    scale: 0.91,
    rotateX: 15,
    rotateY: -4,
    transformPerspective: 1100,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    rotateY: 0,
    transformPerspective: 1100,
    transition: {
      duration: 0.68,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

interface EightArmsPageProps {
  onNavigate: (page: string) => void;
  onSectionChange?: (section: string) => void;
  onOpenConsultation: () => void;
  onSelectServiceForConsultation?: (serviceTitle: string) => void;
}

export const EightArmsPage: React.FC<EightArmsPageProps> = ({
  onNavigate,
  onSectionChange,
  onOpenConsultation,
  onSelectServiceForConsultation,
}) => {
  const { isAr, dir, lang } = useLanguage();
  const armsList = useMemo(() => getLocalizedArms(lang), [lang]);
  const [selectedArmDetail, setSelectedArmDetail] = useState<ArmData | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // 3D Coverflow Showcase items matching the 8 Arms
  const serviceCards: CoverflowCardItem[] = useMemo(() => getLocalizedCoverflowServices(isAr), [isAr]);
  const [previewCard, setPreviewCard] = useState<CoverflowCardItem | null>(null);
  const [previewIndex, setPreviewIndex] = useState<number>(0);
  const [activeArmId, setActiveArmId] = useState<number>(1);

  const emitArmSection = (armId: number) => {
    setActiveArmId(armId);
    const sec = `arm-${armId}`;
    onSectionChange?.(sec);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('pulse-octo:section-change', {
          detail: { section: sec },
        })
      );
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleConsultForArm = (armTitle: string) => {
    if (onSelectServiceForConsultation) {
      onSelectServiceForConsultation(armTitle);
    } else {
      onOpenConsultation();
    }
  };

  // Reset arm detail when navigation occurs or reset event is fired
  useEffect(() => {
    const handleReset = () => setSelectedArmDetail(null);
    window.addEventListener('pulse-octo:reset-arm-detail', handleReset);
    return () => window.removeEventListener('pulse-octo:reset-arm-detail', handleReset);
  }, []);

  const getArmIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Sparkles':
        return Sparkles;
      case 'Compass':
        return Compass;
      case 'Layout':
        return Layout;
      case 'Target':
        return Target;
      case 'Feather':
        return Feather;
      case 'Video':
        return Video;
      case 'Cpu':
        return Cpu;
      case 'TrendingUp':
        return TrendingUp;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* 1. Page Header: Clean, quiet, and focused on core brand line */}
      <PageHeader
        badge={isAr ? 'المنظومة الرقمية' : 'Digital Synergy'}
        title={isAr ? 'ثماني أذرع • عقل واحد • نبض واحد' : '8 Arms • One Mind • One Pulse'}
        highlightedTitle={isAr ? 'المنظومة المتكاملة' : 'Integrated System'}
        sectionType="arms"
        videoSrc="/videos/pulse-video-1.mp4"
        showStats={false}
        onGoHome={() => onNavigate('home')}
        ctaText={isAr ? 'احجز استشارة رقمية' : 'Book Strategic Consultation'}
        onCtaClick={onOpenConsultation}
        secondaryCtaText={isAr ? 'معرض المشروعات' : 'View Portfolio'}
        onSecondaryCtaClick={() => onNavigate('portfolio')}
      />

      {/* 2. Scroll-Reveal System Philosophy Card */}
      <section className="relative -mt-10 sm:-mt-16 z-20 max-w-4xl mx-auto px-4 sm:px-6">
        <ScrollReveal variant="fade-up" threshold={0.15}>
          <div className="relative rounded-2xl sm:rounded-3xl bg-[#09080f] border border-white/10 p-6 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.85)] text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-400 mb-3 block">
              {isAr ? 'العقل المركزي • The Core' : 'Central Architecture • The Core'}
            </span>
            <p className="text-sm sm:text-base md:text-lg text-slate-200 leading-relaxed font-normal max-w-2xl mx-auto">
              {isAr
                ? 'لا نقدم حلولاً مجزأة أو خدمات عشوائية؛ استراتيجيتنا تعمل كـ العقل المركزي الذي يدير 8 أذرع متخصصة ومترابطة تحرك مشروعك بنفس النبض نحو التميز الرقمي والنمو المستدام.'
                : 'We do not deliver fragmented solutions or random services; our strategy functions as The Core—orchestrating 8 synchronized disciplines moving as one cohesive system.'}
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* 3. The 3D Coverflow Motion Showcase for 8 Arms */}
      <section className="pt-20 sm:pt-28 pb-12 sm:pb-16 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="arms-3d-showcase">
        <ScrollReveal variant="fade-up" threshold={0.15}>
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-400 mb-2 block">
              {isAr ? 'العرض التفاعلي' : 'Interactive Showcase'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white mb-3">
              {isAr ? 'منظومة الأذرع الثمانية المترابطة' : 'The 8 Connected Disciplines'}
            </h2>
            <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
              {isAr
                ? 'استكشف بطاقات الأذرع الثمانية بالتفصيل؛ انقر على أي ذراع لمعاينة تفاصيل الخدمة وقدراتها الاستراتيجية.'
                : 'Explore the 8 arms in detail; click any card to preview tactical capabilities and strategic synergy.'}
            </p>
          </div>
        </ScrollReveal>

        {/* 3D Coverflow Motion Carousel with Scroll-Triggered Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="w-full my-4 sm:my-6 px-2 overflow-visible"
        >
          <CoverflowMotionCarousel
            items={serviceCards}
            onActiveChange={(idx) => emitArmSection(idx + 1)}
            onCardClick={(item, idx) => {
              setPreviewCard(item);
              setPreviewIndex(idx);
              emitArmSection(idx + 1);
            }}
          />
        </motion.div>

        {/* Scroll-Triggered Main 8 Service Cards Grid with 3D Perspective Entry & Progressive Zoom */}
        <motion.div
          variants={serviceGridContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          style={{ perspective: 1200 }}
          className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
        >
          {armsList.map((arm) => {
            const IconComponent = getArmIcon(arm.iconName);
            const isActiveArm = activeArmId === arm.id;
            return (
              <motion.div
                key={arm.id}
                variants={serviceCardItemVariants}
                whileHover={{
                  y: -6,
                  scale: 1.022,
                  rotateX: 2.5,
                  rotateY: dir === 'rtl' ? 2.5 : -2.5,
                  transition: { duration: 0.24, ease: [0.16, 1, 0.3, 1] },
                }}
                whileTap={{ scale: 0.985 }}
                onMouseEnter={() => setActiveArmId(arm.id)}
                onClick={() => {
                  emitArmSection(arm.id);
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
                data-arm-id={arm.id}
                data-arm-title={arm.enTitle || arm.title}
                className="h-full"
              >
                <TiltCard maxTilt={5} perspective={1100} className="h-full">
                  <div
                    className={`group relative h-full rounded-2xl sm:rounded-3xl bg-[#09080f] border p-5 sm:p-6 shadow-[0_16px_40px_rgba(0,0,0,0.75)] transition-colors duration-300 cursor-pointer flex flex-col justify-between overflow-hidden ${
                      isActiveArm
                        ? 'border-purple-500/55 shadow-[0_20px_50px_rgba(124,58,237,0.22)]'
                        : 'border-white/10 hover:border-purple-500/45'
                    }`}
                  >
                    {/* Subtle Top 3D Light Sheen Sweep */}
                    <div
                      className={`absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent transition-opacity duration-300 pointer-events-none ${
                        isActiveArm ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                    />
                    <div className="
                      absolute -top-16 -right-16 w-36 h-36 rounded-full bg-purple-600/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none
                    " />

                    <div className="relative z-10">
                      {/* Header Row: Arm Editorial Index & Icon */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono tabular-nums font-bold text-purple-300 tracking-wider">
                          0{arm.id} <span aria-hidden="true" className="text-white/25">/</span> 08
                        </span>
                        <div
                          className={`w-10 h-10 rounded-xl bg-[#0e0b18] border flex items-center justify-center transition-all duration-300 ${
                            isActiveArm
                              ? 'border-purple-400/60 text-white bg-purple-600/25 scale-105'
                              : 'border-purple-500/30 text-purple-300 group-hover:text-white group-hover:bg-purple-600/25 group-hover:scale-105'
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>
                      </div>

                      {/* Service Title & Subtitle */}
                      <h3 className="text-lg sm:text-xl font-extrabold text-white group-hover:text-purple-200 transition-colors mb-1.5">
                        {arm.title}
                      </h3>
                      <p className="text-[11px] font-mono text-purple-400 mb-3">
                        {arm.enTitle}
                      </p>
                      <p className="text-xs sm:text-sm text-zinc-300/90 line-clamp-3 leading-relaxed">
                        {arm.shortDesc || arm.philosophy}
                      </p>
                    </div>

                    {/* Action Footer */}
                    <div className="relative z-10 mt-5 pt-3.5 border-t border-white/[0.08] flex items-center justify-between text-xs font-bold text-purple-300 group-hover:text-white transition-colors">
                      <span>{isAr ? 'استكشف تفاصيل الذراع' : 'Explore Discipline'}</span>
                      <ArrowRight
                        className={`w-4 h-4 text-purple-400 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform ${
                          dir === 'rtl' ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* 4. The Scroll-Triggered Assembling Square Frame CTA (Placed directly below 3D Orbit) */}
      <AssemblingFrameCTA
        onOpenConsultation={() => onNavigate('contact')}
      />

      <SectionDivider variant="gold" />

      {/* 5. خاتمة الصفحة ورابط النبض (The Official CTA Bar) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <ScrollReveal variant="scale-up" threshold={0.2}>
          <div className="relative rounded-3xl bg-gradient-to-b from-[#0f0922] via-[#080515] to-[#040309] border border-white/[0.08] p-8 sm:p-12 overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.85)] text-center">
            {/* Ambient Video Background Layer: Video 12 (Electro-Octopus with 8 Energy Streams) */}
            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
              <video
                src="/videos/pulse-video-12.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                className="w-full h-full object-cover object-center opacity-35 mix-blend-screen"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0f0922]/85 via-[#080515]/80 to-[#040309]" />
            </div>

            {/* Ambient Studio Lighting Orbs */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-purple-900/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-purple-950/20 rounded-full blur-[120px] pointer-events-none" />

            {/* Title */}
            <ScrollTextReveal delay={0.1}>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
                {isAr
                  ? 'جاهز تحرك مشروعك بقوة الـ 8 أذرع؟'
                  : 'Ready to Propel Your Business With the 8 Arms?'}
              </h2>
            </ScrollTextReveal>

            <ScrollTextReveal delay={0.2}>
              <p className="text-base sm:text-lg text-zinc-300 max-w-3xl mx-auto mb-8 leading-relaxed font-normal">
                {isAr
                  ? 'احجز جلسة الاستشارة الرقمية مع المهندس طارق وجيه اليوم لوضع استراتيجية متكاملة تضمن لك الهيمنة على مجالك.'
                  : 'Book your strategic digital consultation session with Eng. Tarek Wageeh today to architect your brand’s digital dominance.'}
              </p>
            </ScrollTextReveal>

            {/* Booking Button */}
            <ScrollReveal variant="fade-up" delay={0.25}>
              <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
                <MagneticButton strength={20}>
                  <button
                    type="button"
                    onClick={onOpenConsultation}
                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#7a38e8] to-[#5e22c0] hover:from-[#8846f5] hover:to-[#6a2ad0] text-white font-bold text-base sm:text-lg shadow-[0_6px_24px_rgba(122,56,232,0.35)] hover:scale-[1.02] active:scale-95 transition-all duration-300 cursor-pointer flex items-center gap-3"
                  >
                    <Sparkles className="w-5 h-5 text-purple-200" />
                    <span>{isAr ? 'احجز جلسة الاستشارة الرقمية مع المهندس طارق وجيه' : 'Book Strategic Session with Eng. Tarek'}</span>
                    <ArrowRight className={`w-5 h-5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                  </button>
                </MagneticButton>
              </div>
            </ScrollReveal>

            {/* Direct Communication Channels (Phone, WhatsApp, Website) */}
            <ScrollStagger stagger={0.1} delay={0.3} className="pt-8 border-t border-purple-900/40 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {/* Phone */}
              <motion.a
                variants={staggerItemVariants}
                href="tel:01112998882"
                className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-purple-950/30 hover:bg-purple-900/50 border border-purple-500/30 hover:border-purple-400 transition-all text-white group cursor-pointer shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center text-purple-300 group-hover:text-white transition-colors">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div className={isAr ? 'text-right' : 'text-left'}>
                  <div className="text-[11px] text-purple-300 font-bold">
                    {isAr ? 'تواصل معنا (اتصال مباشر)' : 'Direct Phone'}
                  </div>
                  <div className="text-sm font-black font-['Orbitron',sans-serif] tracking-wider text-white" dir="ltr">
                    01112998882
                  </div>
                </div>
              </motion.a>

              {/* WhatsApp */}
              <motion.a
                variants={staggerItemVariants}
                href="https://wa.me/201116066968"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-purple-950/30 hover:bg-purple-900/50 border border-purple-500/30 hover:border-purple-400 transition-all text-white group cursor-pointer shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300 group-hover:text-white transition-colors">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className={isAr ? 'text-right' : 'text-left'}>
                  <div className="text-[11px] text-emerald-300 font-bold">
                    {isAr ? 'واتساب مباشر' : 'WhatsApp'}
                  </div>
                  <div className="text-sm font-black font-['Orbitron',sans-serif] tracking-wider text-white" dir="ltr">
                    01116066968
                  </div>
                </div>
              </motion.a>

              {/* Website */}
              <motion.a
                variants={staggerItemVariants}
                href="https://pulseocto.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-purple-950/30 hover:bg-purple-900/50 border border-purple-500/30 hover:border-purple-400 transition-all text-white group cursor-pointer shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-600/30 border border-cyan-400/40 flex items-center justify-center text-cyan-300 group-hover:text-white transition-colors">
                  <Globe className="w-5 h-5" />
                </div>
                <div className={isAr ? 'text-right' : 'text-left'}>
                  <div className="text-[11px] text-cyan-300 font-bold">
                    {isAr ? 'الموقع الرسمي' : 'Official Portal'}
                  </div>
                  <div className="text-sm font-black font-['Orbitron',sans-serif] tracking-wider text-white" dir="ltr">
                    pulseOCTO.com
                  </div>
                </div>
              </motion.a>
            </ScrollStagger>
          </div>
        </ScrollReveal>
      </section>

      {/* Apple-Style Liquid Glass Preview Window for Service Details */}
      <AppleServicePreviewModal
        isOpen={!!previewCard}
        item={previewCard}
        itemIndex={previewIndex}
        totalItems={serviceCards.length}
        onClose={() => setPreviewCard(null)}
        onExploreInAccordion={(item, index) => {
          setPreviewCard(null);
          const arm = armsList[index];
          if (arm) {
            if (typeof window !== 'undefined') {
              window.dispatchEvent(
                new CustomEvent('pulse-octo:open-arm', {
                  detail: { armId: arm.id, arm },
                })
              );
            } else {
              setSelectedArmDetail(arm);
            }
          }
        }}
        onOpenFullServicePage={(item, index) => {
          setPreviewCard(null);
          const arm = armsList[index];
          if (arm) {
            if (typeof window !== 'undefined') {
              window.dispatchEvent(
                new CustomEvent('pulse-octo:open-arm', {
                  detail: { armId: arm.id, arm },
                })
              );
            } else {
              setSelectedArmDetail(arm);
            }
          }
        }}
        onNavigatePrev={() => {
          const nextIdx = (previewIndex - 1 + serviceCards.length) % serviceCards.length;
          setPreviewIndex(nextIdx);
          setPreviewCard(serviceCards[nextIdx]);
          emitArmSection(nextIdx + 1);
        }}
        onNavigateNext={() => {
          const nextIdx = (previewIndex + 1) % serviceCards.length;
          setPreviewIndex(nextIdx);
          setPreviewCard(serviceCards[nextIdx]);
          emitArmSection(nextIdx + 1);
        }}
      />

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
                onOpenConsultation={() => handleConsultForArm(selectedArmDetail.title)}
              />
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
};

