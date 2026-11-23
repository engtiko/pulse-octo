import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { MagneticButton } from './MagneticButton';
import { LiquidGlassButton } from './LiquidGlassButton';

interface AssemblingFrameCTAProps {
  onOpenConsultation: () => void;
  title?: string;
  subtitle?: string;
  badge?: string;
  buttonText?: string;
}

export const AssemblingFrameCTA: React.FC<AssemblingFrameCTAProps> = ({
  onOpenConsultation,
  title,
  subtitle,
  buttonText,
}) => {
  const { isAr, dir } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll-linked convergence of the 4 corner brackets
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'center center'],
  });

  // Corner translations: start spread out, assemble smoothly as user scrolls into center
  const topLeftX = useTransform(scrollYProgress, [0, 1], [-64, 0]);
  const topLeftY = useTransform(scrollYProgress, [0, 1], [-64, 0]);

  const topRightX = useTransform(scrollYProgress, [0, 1], [64, 0]);
  const topRightY = useTransform(scrollYProgress, [0, 1], [-64, 0]);

  const bottomLeftX = useTransform(scrollYProgress, [0, 1], [-64, 0]);
  const bottomLeftY = useTransform(scrollYProgress, [0, 1], [64, 0]);

  const bottomRightX = useTransform(scrollYProgress, [0, 1], [64, 0]);
  const bottomRightY = useTransform(scrollYProgress, [0, 1], [64, 0]);

  // Frame scale and opacity
  const frameOpacity = useTransform(scrollYProgress, [0, 0.4, 1], [0.25, 0.85, 1]);
  const contentOpacity = useTransform(scrollYProgress, [0.3, 0.9], [0, 1]);
  const contentScale = useTransform(scrollYProgress, [0.3, 0.9], [0.95, 1]);

  // Subtle vertical parallax
  const frameParallaxY = useTransform(scrollYProgress, [0, 1], [-16, 16]);
  const contentParallaxY = useTransform(scrollYProgress, [0, 1], [-10, 10]);

  const defaultTitle = isAr
    ? 'جاهز للارتقاء؟ احصل على خارطة نمو مخصصة لعلامتك'
    : 'Ready to scale? Get your Custom Marketing Roadmap';

  const defaultSubtitle = isAr
    ? 'نظام متكامل يربط أذرع التسويق، الإنتاج المرئي، والتكنولوجيا لضمان السيادة الرقمية لعلامتك التجارية.'
    : 'An integrated growth system connecting marketing, visual production, and technology around your brand.';

  const defaultBtnText = isAr ? 'ابدأ نبض مشروعك' : 'IGNITE YOUR PULSE';

  return (
    <div
      ref={containerRef}
      className="relative py-24 sm:py-32 px-4 sm:px-6 flex items-center justify-center overflow-hidden bg-transparent"
      dir={dir}
    >
      {/* Restrained Ambient Plum Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[360px] bg-purple-950/20 rounded-full blur-[140px]" />
      </div>

      {/* The Assembling Architectural Frame Container */}
      <motion.div
        style={{
          y: frameParallaxY,
        }}
        whileHover={{
          scale: 1.01,
          transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
        }}
        className="group/frame relative w-full max-w-2xl min-h-[360px] sm:min-h-[410px] flex items-center justify-center p-8 sm:p-14 rounded-2xl transition-all duration-500 will-change-transform"
      >
        {/* CORNER 1: TOP-LEFT BRACKET ┌ */}
        <motion.div
          style={{
            x: topLeftX,
            y: topLeftY,
            opacity: frameOpacity,
          }}
          className="absolute top-0 left-0 w-10 sm:w-14 h-10 sm:h-14 pointer-events-none"
        >
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-purple-400/75 via-purple-300/35 to-transparent" />
          <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-purple-400/75 via-purple-300/35 to-transparent" />
          <div className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 bg-purple-400/70" />
        </motion.div>

        {/* CORNER 2: TOP-RIGHT BRACKET ┐ */}
        <motion.div
          style={{
            x: topRightX,
            y: topRightY,
            opacity: frameOpacity,
          }}
          className="absolute top-0 right-0 w-10 sm:w-14 h-10 sm:h-14 pointer-events-none"
        >
          <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-l from-purple-400/75 via-purple-300/35 to-transparent" />
          <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-purple-400/75 via-purple-300/35 to-transparent" />
          <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-purple-400/70" />
        </motion.div>

        {/* CORNER 3: BOTTOM-LEFT BRACKET └ */}
        <motion.div
          style={{
            x: bottomLeftX,
            y: bottomLeftY,
            opacity: frameOpacity,
          }}
          className="absolute bottom-0 left-0 w-10 sm:w-14 h-10 sm:h-14 pointer-events-none"
        >
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-purple-400/75 via-purple-300/35 to-transparent" />
          <div className="absolute bottom-0 left-0 w-px h-full bg-gradient-to-t from-purple-400/75 via-purple-300/35 to-transparent" />
          <div className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 bg-purple-400/70" />
        </motion.div>

        {/* CORNER 4: BOTTOM-RIGHT BRACKET ┘ */}
        <motion.div
          style={{
            x: bottomRightX,
            y: bottomRightY,
            opacity: frameOpacity,
          }}
          className="absolute bottom-0 right-0 w-10 sm:w-14 h-10 sm:h-14 pointer-events-none"
        >
          <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-purple-400/75 via-purple-300/35 to-transparent" />
          <div className="absolute bottom-0 right-0 w-px h-full bg-gradient-to-t from-purple-400/75 via-purple-300/35 to-transparent" />
          <div className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 bg-purple-400/70" />
        </motion.div>

        {/* Central Assembled Box Backdrop */}
        <motion.div
          style={{ opacity: frameOpacity }}
          className="absolute inset-0 rounded-[24px] bg-[#09080f]/92 border border-white/10 group-hover/frame:border-purple-500/35 shadow-[0_24px_60px_rgba(0,0,0,0.88)] transition-all duration-500 pointer-events-none overflow-hidden"
        >
          <div className="absolute top-0 inset-x-12 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-36 bg-purple-900/15 rounded-full blur-3xl pointer-events-none" />
        </motion.div>

        {/* Central Assembled Content */}
        <motion.div
          style={{
            opacity: contentOpacity,
            scale: contentScale,
            y: contentParallaxY,
          }}
          className="relative z-10 text-center flex flex-col items-center justify-center max-w-lg mx-auto will-change-transform"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
            {title || defaultTitle}
          </h2>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-8 max-w-md">
            {subtitle || defaultSubtitle}
          </p>

          <MagneticButton strength={12}>
            <LiquidGlassButton
              id="cta-frame-consultation"
              onClick={onOpenConsultation}
              variant="primary"
              size="lg"
            >
              <span>{buttonText || defaultBtnText}</span>
              <ArrowRight className={`w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 ${dir === 'rtl' ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
            </LiquidGlassButton>
          </MagneticButton>
        </motion.div>
      </motion.div>
    </div>
  );
};

