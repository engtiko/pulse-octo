import React, { useRef } from 'react';
import {
  motion,
  type Variants,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { OctoLogo } from './OctoLogo';
import { MagneticButton } from './MagneticButton';
import { LiquidGlassButton } from './LiquidGlassButton';
import { ArrowDown } from 'lucide-react';

export type PageSectionType = 'arms' | 'portfolio' | 'about' | 'blog' | 'contact' | 'default';

export interface PageHeaderProps {
  badge?: string;
  title: string;
  highlightedTitle?: string;
  description?: string;
  onGoHome: () => void;
  ctaText?: string;
  onCtaClick?: () => void;
  secondaryCtaText?: string;
  onSecondaryCtaClick?: () => void;
  sectionType?: PageSectionType;
  videoSrc?: string;
  customStats?: Array<{ label: string; value: string; sub?: string }>;
  showStats?: boolean;
}

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    scale: 0.99,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1],
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const textFadeItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 14,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  highlightedTitle,
  description,
  onGoHome,
  ctaText,
  onCtaClick,
  secondaryCtaText,
  onSecondaryCtaClick,
  customStats,
  showStats = false,
}) => {
  const { isAr } = useLanguage();
  const headerRef = useRef<HTMLElement>(null);

  const defaultStats = [
    {
      value: '8',
      label: isAr ? 'أذرع تخصصية متكاملة' : 'Integrated Disciplines',
      sub: isAr ? 'منظومة عمل موحدة' : 'One Unified System',
    },
    {
      value: '1',
      label: isAr ? 'عقل استراتيجي مركزي' : 'Central Strategic Core',
      sub: isAr ? 'رؤية متناغمة للنمو' : 'Synchronized Direction',
    },
    {
      value: '360°',
      label: isAr ? 'تغطية رقمية شاملة' : 'Full-Spectrum Coverage',
      sub: isAr ? 'من التأسيس إلى التوسع' : 'Foundation to Scale',
    },
    {
      value: 'MENA',
      label: isAr ? 'نطاق العمل والتشغيل' : 'Regional Operations',
      sub: isAr ? 'مصر والشرق الأوسط' : 'Egypt & Middle East',
    },
  ];

  const activeStats = customStats && customStats.length > 0 ? customStats : defaultStats;

  // Motion values for subtle 3D mouse parallax tracking on the header
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 120, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 20 });

  const octopusRotateX = useTransform(springY, [-0.5, 0.5], [6, -6]);
  const octopusRotateY = useTransform(springX, [-0.5, 0.5], [-8, 8]);
  const octopusTranslateX = useTransform(springX, [-0.5, 0.5], [-10, 10]);
  const octopusTranslateY = useTransform(springY, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!headerRef.current) return;
    const rect = headerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <header
      ref={headerRef}
      role="banner"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[480px] sm:min-h-[520px] w-full flex flex-col items-center justify-center pt-24 sm:pt-28 pb-10 sm:pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#050308] border-b border-[#bdbdbd]/15"
    >
      {/* Official Panoramic Brand Identity Banner Background (/pulse-octo-banner.webp) */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
        <img
          src="/pulse-octo-banner.webp"
          srcSet="/pulse-octo-banner-sm.webp 640w, /pulse-octo-banner.webp 1280w"
          sizes="100vw"
          alt=""
          width={1280}
          height={720}
          decoding="async"
          className="w-full h-full object-cover object-center opacity-45 scale-105 filter contrast-[1.08]"
          loading="eager"
        />
        {/* Luxury Obsidian & Royal Amethyst (#8052ff) Multi-Stop Vignette Blend */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050308]/85 via-[#090612]/65 to-[#050308]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_50%_45%,rgba(128,82,255,0.22)_0%,rgba(9,6,18,0.75)_65%,#050308_100%)]" />
      </div>

      <div className="max-w-5xl mx-auto flex flex-col items-center text-center relative z-10 w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative w-full max-w-4xl mx-auto rounded-[28px] sm:rounded-[34px] p-6 sm:p-10 md:p-12 bg-gradient-to-b from-[#bdbdbd]/[0.1] via-[#090612]/82 to-[#090612]/92 backdrop-blur-[12px] backdrop-saturate-[180%] border border-[#bdbdbd]/25 shadow-[0_28px_80px_rgba(0,0,0,0.9),inset_0_1px_1.5px_rgba(189,189,189,0.35),inset_0_-1px_2px_rgba(128,82,255,0.25)] flex flex-col items-center text-center z-10 overflow-hidden"
        >
          {/* Top Frosted Silver Mist Specular Hairline */}
          <div className="absolute top-0 inset-x-10 h-[1px] bg-gradient-to-r from-transparent via-[#bdbdbd]/70 to-transparent pointer-events-none" />
          {/* Ambient Sub-Glass Refraction Orbs */}
          <div className="pointer-events-none absolute -top-16 left-1/4 w-56 h-36 rounded-full bg-[#8052ff]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 right-1/4 w-56 h-36 rounded-full bg-[#bdbdbd]/12 blur-3xl" />

          <div className="relative z-10 w-full flex flex-col items-center text-center">
            {/* Core Pulse Octopus Emblem */}
            <motion.div
              variants={textFadeItemVariants}
              style={{
                x: octopusTranslateX,
                y: octopusTranslateY,
                rotateX: octopusRotateX,
                rotateY: octopusRotateY,
                perspective: 800,
              }}
              className="relative mb-5 cursor-pointer group will-change-transform select-none"
              whileHover={{ scale: 1.04 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              onClick={onGoHome}
            >
              <div className="absolute inset-0 rounded-full bg-[#8052ff]/25 blur-2xl pointer-events-none" />
              <OctoLogo
                variant="emblem"
                glow={false}
                showPlate={false}
                className="w-20 h-20 sm:w-24 sm:h-24 relative z-10"
              />
            </motion.div>

            {/* Headline (No redundant kicker/badge above it) */}
            <motion.h1
              variants={textFadeItemVariants}
              className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.2] mb-4 text-white"
            >
              <bdi dir="ltr" className="inline-block font-extrabold tracking-tight bg-gradient-to-b from-white via-[#e6e2f2] to-[#bdbdbd] bg-clip-text text-transparent">
                Pulse OCTO
              </bdi>
              <span className="mx-2 sm:mx-3 text-[#bdbdbd]/35 font-light text-xl sm:text-3xl">|</span>
              <span className="inline-block bg-gradient-to-r from-white via-[#bdbdbd] to-[#8052ff] bg-clip-text text-transparent">
                {title} {highlightedTitle ? highlightedTitle : ''}
              </span>
            </motion.h1>

            {/* Description */}
            {description && (
              <motion.p
                variants={textFadeItemVariants}
                className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-[#bdbdbd] font-normal leading-relaxed mb-8"
              >
                {description}
              </motion.p>
            )}

            {/* Call To Action Buttons */}
            <motion.div
              variants={textFadeItemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto"
            >
              {ctaText && onCtaClick && (
                <MagneticButton strength={14} className="w-full sm:w-auto">
                  <LiquidGlassButton
                    onClick={onCtaClick}
                    variant="primary"
                    size="md"
                    className="w-full sm:w-auto"
                  >
                    <span>{ctaText}</span>
                    <ArrowDown className="w-4 h-4 text-white transition-transform group-hover:translate-y-0.5" />
                  </LiquidGlassButton>
                </MagneticButton>
              )}

              <MagneticButton strength={14} className="w-full sm:w-auto">
                <LiquidGlassButton
                  onClick={() => {
                    if (secondaryCtaText && onSecondaryCtaClick) {
                      onSecondaryCtaClick();
                    } else {
                      onGoHome();
                    }
                  }}
                  variant="secondary"
                  size="md"
                  className="w-full sm:w-auto"
                >
                  <span>
                    {secondaryCtaText || (isAr ? 'العودة للرئيسية' : 'Back to Home')}
                  </span>
                </LiquidGlassButton>
              </MagneticButton>
            </motion.div>
          </div>
        </motion.div>

        {/* Optional Verified Section Pillars Strip — Frosted Glassmorphism Tiles */}
        {showStats && activeStats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
            className="mt-4 w-full grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 relative z-10"
          >
            {activeStats.map((metric, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-white/[0.11] via-[#090612]/80 to-[#090612]/90 backdrop-blur-[12px] backdrop-saturate-[180%] border border-white/[0.16] hover:border-[#d8c4ff]/60 shadow-[0_16px_36px_rgba(0,0,0,0.8),inset_0_1px_1.5px_rgba(255,255,255,0.3)] transition-all flex flex-col items-center justify-center text-center"
              >
                <span
                  className="text-xl sm:text-2xl font-black font-['Orbitron',sans-serif] bg-gradient-to-b from-white to-[#d8c4ff] bg-clip-text text-transparent tabular-nums"
                  dir="ltr"
                >
                  {metric.value}
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#f2effa] mt-1">
                  {metric.label}
                </span>
                {metric.sub && (
                  <span className="text-[11px] text-[#c9b3ff] font-medium mt-0.5">
                    {metric.sub}
                  </span>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </header>
  );
};
