import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, type Variants } from 'motion/react';
import { getLocalizedServices } from '../data/agencyData';
import { ServiceItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { LiquidGlassButton } from './LiquidGlassButton';
import { getOptimizedImageProps } from '../utils/imageOptimizer';

// Staggered scroll-triggered entrance animation variants for the eight service cards
const serviceCardsContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.1,
    },
  },
};

const serviceCardItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 32,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};
import {
  Palette,
  Target,
  Layout,
  Feather,
  Video,
  Cpu,
  Compass,
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
  X,
  Layers,
} from 'lucide-react';

interface AccordionServiceCardProps {
  service: ServiceItem;
  index: number;
  isActive: boolean;
  highlightedIndex: number | null;
  onHover: () => void;
  onClick: () => void;
  onOpenModal: (service: ServiceItem) => void;
  onOpenFullServicePage?: (serviceIndex: number) => void;
  onSelectServiceForConsultation?: (serviceTitle: string) => void;
  getServiceIcon: (iconName: string, className?: string) => React.ReactNode;
  isAr: boolean;
  t: (key: string) => string;
}

const AccordionServiceCard: React.FC<AccordionServiceCardProps> = ({
  service,
  index,
  isActive,
  highlightedIndex,
  onHover,
  onClick,
  onOpenModal,
  onOpenFullServicePage,
  getServiceIcon,
  isAr,
  t,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const bgOptimized = getOptimizedImageProps(service.bgImage, {
    sizes: '(max-width: 767px) 220px, 420px',
  });

  // Subtle spring physics for smooth lift
  const rotateXSpring = useSpring(0, { stiffness: 280, damping: 26, mass: 0.35 });
  const rotateYSpring = useSpring(0, { stiffness: 280, damping: 26, mass: 0.35 });
  const yLiftSpring = useSpring(0, { stiffness: 320, damping: 26, mass: 0.3 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    const maxTilt = isActive ? 2.5 : 4;
    rotateXSpring.set(-y * maxTilt);
    rotateYSpring.set(x * maxTilt);

    const gx = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const gy = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    cardRef.current.style.setProperty('--glare-x', `${gx}%`);
    cardRef.current.style.setProperty('--glare-y', `${gy}%`);
  }, [isActive, rotateXSpring, rotateYSpring]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    yLiftSpring.set(-6);
    onHover();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    yLiftSpring.set(0);
    rotateXSpring.set(0);
    rotateYSpring.set(0);
  };

  return (
    <div className="relative w-full h-full [perspective:1000px]">
      {/* Restrained focus highlight when targeted */}
      {highlightedIndex === index && (
        <div className="absolute -inset-1.5 rounded-[24px] border border-purple-400/60 pointer-events-none z-30" />
      )}

      {/* Card Container */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        style={{
          y: yLiftSpring,
          rotateX: rotateXSpring,
          rotateY: rotateYSpring,
          transformStyle: 'preserve-3d',
        }}
        className={`relative h-full rounded-[20px] overflow-hidden cursor-pointer transition-[border-color,background-color,box-shadow] duration-500 flex flex-col justify-between touch-manipulation border will-change-transform ${
          isActive
            ? 'border-purple-500/50 shadow-[0_24px_60px_rgba(0,0,0,0.9),0_0_28px_rgba(124,58,237,0.18)] bg-[#0c0918]'
            : 'border-white/[0.08] hover:border-purple-500/35 bg-[#09080f] shadow-[0_10px_30px_rgba(0,0,0,0.65)]'
        }`}
        data-cursor="pointer"
        data-arm-id={index + 1}
        data-arm-title={service.titleEn || service.title}
        id={`service-arm-${index + 1}`}
      >
        {/* Top subtle hairline */}
        <div className="absolute top-0 inset-x-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none z-30" />

        {/* Subtle Cursor Spotlight */}
        <div
          aria-hidden="true"
          style={{
            opacity: isHovered ? 0.55 : 0,
            background: 'radial-gradient(circle 220px at var(--glare-x, 50%) var(--glare-y, 50%), rgba(168,85,247,0.14) 0%, transparent 75%)',
          }}
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-30"
        />

        {/* Layer 1: Background Image (Responsive WebP) */}
        <div
          style={{ transform: 'translateZ(-10px)', transformStyle: 'preserve-3d' }}
          className="absolute inset-0 pointer-events-none overflow-hidden"
        >
          <img
            src={bgOptimized.src}
            srcSet={bgOptimized.srcSet}
            sizes={bgOptimized.sizes}
            alt={service.title}
            width={640}
            height={580}
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover transition-all duration-700 ease-out ${
              isActive
                ? 'scale-105 brightness-[0.52]'
                : 'scale-110 brightness-[0.38] group-hover:scale-105 group-hover:brightness-[0.5]'
            }`}
          />
          <div
            className={`absolute inset-0 transition-opacity duration-700 ${
              isActive
                ? 'bg-gradient-to-t from-[#07060c] via-[#07060c]/82 to-black/25'
                : 'bg-gradient-to-t from-[#07060c]/95 via-[#07060c]/70 to-[#07060c]/80'
            }`}
          />
        </div>

        {/* Layer 2: COLLAPSED STATE */}
        {!isActive && (
          <div
            style={{ transform: 'translateZ(18px)', transformStyle: 'preserve-3d' }}
            className="relative z-10 w-full h-full flex flex-col items-center justify-between py-6 px-1 select-none"
          >
            <div className="flex flex-col items-center gap-2 transition-transform duration-300 group-hover:scale-105">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-white/[0.12] via-[#2b184a]/50 to-[#090612]/80 backdrop-blur-[12px] backdrop-saturate-[180%] [-webkit-backdrop-filter:blur(12px)_saturate(180%)] border border-white/[0.18] flex items-center justify-center text-[#e6e2f2] group-hover:border-[#c9b3ff]/55 group-hover:text-white shadow-[0_8px_20px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.25)] transition-all duration-300">
                {getServiceIcon(service.iconName, 'w-5 h-5')}
              </div>
            </div>

            <div className="flex-1 flex items-center justify-center my-3 overflow-hidden">
              <span
                style={{ writingMode: 'vertical-rl' }}
                className="text-xs sm:text-sm font-semibold tracking-wider text-[#e6e2f2] select-none rotate-180 transition-colors duration-300 group-hover:text-white whitespace-nowrap"
              >
                {service.title}
              </span>
            </div>

            <span className="w-1.5 h-1.5 rounded-full bg-[#c9b3ff]/60 group-hover:bg-[#c9b3ff] transition-colors" />
          </div>
        )}

        {/* Layer 3: EXPANDED STATE */}
        {isActive && (
          <div
            style={{ transform: 'translateZ(16px)', transformStyle: 'preserve-3d' }}
            className={`relative z-20 w-full h-full p-5 sm:p-7 flex flex-col justify-between overflow-y-auto scrollbar-none ${isAr ? 'text-right' : 'text-left'}`}
          >
            {/* Top Bar: Frosted Crystal Icon + Category Tag */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-white/[0.16] via-[#5e2ec0]/45 to-[#120b22]/85 backdrop-blur-[12px] backdrop-saturate-[180%] [-webkit-backdrop-filter:blur(12px)_saturate(180%)] border border-[#c9b3ff]/45 flex items-center justify-center text-[#f4f1fb] shadow-[0_8px_24px_rgba(94,46,192,0.35),inset_0_1px_1px_rgba(255,255,255,0.28)]">
                  {getServiceIcon(service.iconName, 'w-5 h-5')}
                </div>
                <span className="px-3.5 py-1 rounded-full bg-white/[0.08] backdrop-blur-[12px] border border-white/[0.18] text-xs font-medium text-[#e6e2f2]">
                  {service.tag}
                </span>
              </div>
            </div>

            {/* Bottom Content Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
              className="mt-auto pt-4"
            >
              {isAr && (
                <span
                  className="text-[11px] tracking-widest text-purple-300/90 font-mono uppercase font-medium block mb-1"
                  dir="ltr"
                >
                  {service.titleEn}
                </span>
              )}

              <h3 className="text-xl sm:text-3xl font-bold text-white mb-2">
                {service.title}
              </h3>

              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed mb-3.5 max-w-2xl line-clamp-2">
                {service.fullDesc}
              </p>

              {/* Inner Showcase Images Gallery */}
              {service.innerImages && service.innerImages.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.15 }}
                  className="mb-3.5 p-2.5 rounded-xl bg-black/40 border border-white/10"
                >
                  <div className="grid grid-cols-3 gap-2">
                    {service.innerImages.map((imgUrl, imgIdx) => {
                      const thumbOpt = getOptimizedImageProps(imgUrl, {
                        width: 360,
                        sizes: '120px',
                      });
                      return (
                        <div
                          key={imgIdx}
                          className="group/thumb relative h-16 sm:h-20 rounded-lg overflow-hidden border border-white/10 hover:border-purple-400/50 transition-all duration-300"
                        >
                          <img
                            src={thumbOpt.src}
                            srcSet={thumbOpt.srcSet}
                            sizes={thumbOpt.sizes}
                            alt={`${service.title} - ${imgIdx + 1}`}
                            width={240}
                            height={160}
                            loading="lazy"
                            decoding="async"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover/thumb:scale-105 brightness-90 group-hover/thumb:brightness-100"
                          />
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Deliverables Grid */}
              <div className="grid grid-cols-2 gap-1.5 mb-4">
                {service.deliverables.slice(0, 4).map((del, dIdx) => (
                  <div key={dIdx} className="flex items-center gap-1.5 text-xs text-zinc-200 bg-white/[0.03] p-1.5 rounded-lg border border-white/[0.06]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="truncate">{del}</span>
                  </div>
                ))}
              </div>

              {/* Single Clear Primary Action per Card */}
              <div className="flex items-center pt-3 border-t border-white/[0.08]">
                <LiquidGlassButton
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onOpenFullServicePage) {
                      onOpenFullServicePage(index);
                    } else {
                      onOpenModal(service);
                    }
                  }}
                  variant="primary"
                  size="sm"
                >
                  <span>{isAr ? 'استكشف الخدمة بالتفصيل' : t('services.exploreMore')}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </LiquidGlassButton>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

interface ServicesAccordionProps {
  onSelectServiceForConsultation?: (serviceName: string) => void;
  selectedArmIndex?: number | null;
  onOpenFullServicePage?: (serviceIndex: number) => void;
  onSectionChange?: (section: string) => void;
}

export const ServicesAccordion: React.FC<ServicesAccordionProps> = ({
  onSelectServiceForConsultation,
  selectedArmIndex,
  onOpenFullServicePage,
  onSectionChange,
}) => {
  const { lang, t, isAr } = useLanguage();
  const services = getLocalizedServices(lang);

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [modalService, setModalService] = useState<ServiceItem | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const emitArmSelection = useCallback(
    (armZeroIndex: number | null) => {
      if (armZeroIndex === null || armZeroIndex < 0) return;
      const sectionKey = `arm-${armZeroIndex + 1}`;
      onSectionChange?.(sectionKey);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('pulse-octo:section-change', {
            detail: { section: sectionKey },
          })
        );
      }
    },
    [onSectionChange]
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 25,
    restDelta: 0.001,
  });
  const headerParallaxY = useTransform(smoothProgress, [0, 1], [-14, 14]);
  const accordionParallaxY = useTransform(smoothProgress, [0, 1], [-20, 20]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (selectedArmIndex !== undefined && selectedArmIndex !== null) {
      setActiveIndex(selectedArmIndex);
      setHighlightedIndex(selectedArmIndex);
      emitArmSelection(selectedArmIndex);

      const scrollTimer = setTimeout(() => {
        const cardEl = document.getElementById(`service-arm-${selectedArmIndex + 1}`);
        if (cardEl) {
          cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      }, 350);

      const clearHighlightTimer = setTimeout(() => {
        setHighlightedIndex(null);
      }, 4000);

      return () => {
        clearTimeout(scrollTimer);
        clearTimeout(clearHighlightTimer);
      };
    }
  }, [selectedArmIndex, emitArmSelection]);

  const handleArmClick = (index: number) => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch {
        // Ignored
      }
    }
    const nextIndex = activeIndex === index ? null : index;
    setActiveIndex(nextIndex);
    emitArmSelection(index);

    if (nextIndex !== null && scrollContainerRef.current) {
      const cardEl = document.getElementById(`service-arm-${index + 1}`);
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  };

  // Distinct icon for each of the 8 services (no generic AI Sparkles)
  const getServiceIcon = (iconName: string, className: string = 'w-6 h-6') => {
    switch (iconName) {
      case 'Sparkles':
        return <Palette className={className} />;
      case 'Target':
        return <Target className={className} />;
      case 'Layout':
        return <Layout className={className} />;
      case 'Feather':
        return <Feather className={className} />;
      case 'Video':
        return <Video className={className} />;
      case 'Cpu':
        return <Cpu className={className} />;
      case 'Compass':
        return <Compass className={className} />;
      case 'TrendingUp':
        return <TrendingUp className={className} />;
      default:
        return <Layers className={className} />;
    }
  };

  return (
    <section
      ref={sectionRef}
      id="who-we-are"
      className="services-section relative z-30 py-20 sm:py-28 px-3 sm:px-6 lg:px-8 bg-[#06050a] text-white overflow-hidden select-none scroll-mt-20 rounded-t-[32px] sm:rounded-t-[44px] md:rounded-t-[56px] lg:rounded-t-[64px]"
    >
      {/* Anchor aliases for backward compatibility */}
      <div id="services" className="absolute -top-24 left-0 pointer-events-none" />
      <div id="about" className="absolute -top-24 left-0 pointer-events-none" />

      {/* Restrained Ambient Lighting (Charcoal dominant with subtle deep plum core) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[760px] h-[420px] bg-purple-950/20 rounded-full blur-[160px]" />
      </div>

      <div className="max-w-[1600px] mx-auto">
        {/* Section Header */}
        <motion.div
          style={{ y: headerParallaxY }}
          className="will-change-transform"
        >
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-3xl mx-auto mb-10 sm:mb-14"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
              {t('services.title')}
            </h2>

            {/* Quick Mobile / Tablet Navigation Selector Pills */}
            <div className="mt-4 md:hidden">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none touch-manipulation">
                {services.map((svc, idx) => {
                  const isSelected = activeIndex === idx;
                  return (
                    <button
                      key={svc.id}
                      type="button"
                      data-arm-id={idx + 1}
                      data-arm-title={svc.titleEn || svc.title}
                      onClick={() => handleArmClick(idx)}
                      className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 border active:scale-95 cursor-pointer ${
                        isSelected
                          ? 'bg-[#7c3aed] text-white border-purple-400/50 shadow-[0_6px_18px_rgba(124,58,237,0.3)]'
                          : 'bg-white/[0.03] text-zinc-300 border-white/10 hover:bg-white/[0.07]'
                      }`}
                    >
                      <span className="max-w-[110px] truncate">{svc.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* HORIZONTAL SIDE-BY-SIDE VERTICAL ACCORDION */}
        <motion.div
          style={{ y: accordionParallaxY }}
          className="will-change-transform relative"
        >
          <motion.div
            ref={scrollContainerRef}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full overflow-x-auto pb-6 scrollbar-none scroll-smooth px-1 sm:px-2"
          >
            <motion.div
              variants={serviceCardsContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              onMouseLeave={() => setActiveIndex(null)}
              className="relative min-w-[840px] xl:min-w-full flex w-full h-[580px] sm:h-[630px] rounded-[28px] overflow-hidden border border-white/[0.16] bg-[#090612]/80 backdrop-blur-[12px] backdrop-saturate-[180%] [-webkit-backdrop-filter:blur(12px)_saturate(180%)] shadow-[0_24px_70px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.2)] p-2.5 sm:p-3 gap-2 sm:gap-3"
            >
              <div className="absolute top-0 inset-x-12 h-px bg-gradient-to-r from-transparent via-[#c9b3ff]/55 to-transparent pointer-events-none z-30" />
              {services.map((service, index) => {
                const isActive = activeIndex === index;

                return (
                  <div
                    key={service.id}
                    className={`group relative h-full transition-[flex] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                      isActive
                        ? 'flex-[5] min-w-[340px] sm:min-w-[420px]'
                        : 'flex-[1] min-w-[65px] sm:min-w-[75px]'
                    }`}
                  >
                    <motion.div
                      variants={serviceCardItemVariants}
                      className="w-full h-full will-change-[transform,opacity]"
                    >
                      <AccordionServiceCard
                        service={service}
                        index={index}
                        isActive={isActive}
                        highlightedIndex={highlightedIndex}
                        onHover={() => {
                          setActiveIndex(index);
                          emitArmSelection(index);
                        }}
                        onClick={() => handleArmClick(index)}
                        onOpenModal={(s) => {
                          setModalService(s);
                          emitArmSelection(index);
                        }}
                        onOpenFullServicePage={onOpenFullServicePage}
                        onSelectServiceForConsultation={onSelectServiceForConsultation}
                        getServiceIcon={getServiceIcon}
                        isAr={isAr}
                        t={t}
                      />
                    </motion.div>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Detailed Modal / Mobile Bottom Sheet */}
        {isMounted && typeof document !== 'undefined' && createPortal(
          <AnimatePresence>
            {modalService && (
              <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-xl">
                <div className="relative w-full max-w-2xl">
                  <motion.div
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    dragElastic={{ top: 0, bottom: 0.5 }}
                    onDragEnd={(_, info) => {
                      if (info.offset.y > 80 || info.velocity.y > 400) {
                        setModalService(null);
                      }
                    }}
                    initial={{ opacity: 0, y: 40, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 40, scale: 0.96 }}
                    className={`relative w-full rounded-t-[28px] sm:rounded-[26px] bg-[#09080f] border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.95)] p-6 sm:p-8 max-h-[90vh] overflow-y-auto touch-pan-y ${isAr ? 'text-right' : 'text-left'}`}
                  >
                    <div className="sm:hidden w-12 h-1.5 rounded-full bg-white/20 mx-auto mb-4 cursor-grab" />

                    {/* Close Button */}
                    <button
                      onClick={() => setModalService(null)}
                      className={`absolute top-5 ${isAr ? 'left-5' : 'right-5'} w-10 h-10 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-zinc-300 hover:text-white flex items-center justify-center transition-all cursor-pointer active:scale-95`}
                    >
                      <X className="w-5 h-5" />
                    </button>

                    {/* Modal Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-13 h-13 rounded-2xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center text-purple-200">
                        {getServiceIcon(modalService.iconName, 'w-7 h-7')}
                      </div>
                      <div>
                        {isAr && (
                          <span className="text-xs font-semibold text-purple-300 font-mono" dir="ltr">
                            {modalService.titleEn}
                          </span>
                        )}
                        <h3 className="text-2xl sm:text-3xl font-bold text-white">
                          {modalService.title}
                        </h3>
                      </div>
                    </div>

                    {/* Image Banner */}
                    <div className="relative h-44 rounded-2xl overflow-hidden mb-6 border border-white/10">
                      <img
                        src={modalService.bgImage}
                        alt={modalService.title}
                        width={640}
                        height={360}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover brightness-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#09080f] via-transparent to-transparent" />
                    </div>

                    {/* Description */}
                    <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-5">
                      {modalService.fullDesc}
                    </p>

                    {/* Inner Images Gallery in Modal */}
                    {modalService.innerImages && modalService.innerImages.length > 0 && (
                      <div className="mb-5">
                        <h4 className="text-xs font-semibold text-zinc-300 mb-2.5">
                          {isAr ? 'نماذج من مخرجات الخدمة:' : 'Featured Deliverable Assets:'}
                        </h4>
                        <div className="grid grid-cols-3 gap-2.5">
                          {modalService.innerImages.map((img, idx) => (
                            <div key={idx} className="relative h-20 sm:h-24 rounded-xl overflow-hidden border border-white/10">
                              <img
                                src={img}
                                alt={`${modalService.title} preview ${idx + 1}`}
                                width={240}
                                height={160}
                                loading="lazy"
                                decoding="async"
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Deliverables */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-zinc-200 mb-3">
                        {isAr ? 'أبرز المخرجات والنتائج:' : 'Key Deliverables & Outcomes:'}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {modalService.deliverables.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-zinc-200">
                            <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Modal Actions */}
                    <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
                      {onOpenFullServicePage && (
                        <LiquidGlassButton
                          onClick={() => {
                            const activeIdx = services.findIndex((s) => s.id === modalService.id);
                            setModalService(null);
                            if (activeIdx !== -1) {
                              onOpenFullServicePage(activeIdx);
                            }
                          }}
                          variant="secondary"
                          size="sm"
                        >
                          <span>{isAr ? 'صفحة الخدمة الكاملة' : 'Full Dedicated Page'}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </LiquidGlassButton>
                      )}
                      <LiquidGlassButton
                        onClick={() => {
                          const title = modalService.title;
                          setModalService(null);
                          if (onSelectServiceForConsultation) {
                            onSelectServiceForConsultation(title);
                          }
                        }}
                        variant="primary"
                        size="sm"
                      >
                        {t('services.requestNow')}
                      </LiquidGlassButton>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
      </div>
    </section>
  );
};

