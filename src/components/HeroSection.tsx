import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { MagneticButton } from './MagneticButton';
import { LiquidGlassButton } from './LiquidGlassButton';
import { ChevronDown } from 'lucide-react';

interface HeroSectionProps {
  onExplore: () => void;
  onOpenConsultation: () => void;
  onSelectServiceToAccordion?: (serviceIndex: number) => void;
  onOpenFullServicePage?: (serviceIndex: number) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExplore,
  onOpenConsultation,
}) => {
  const { isAr } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  const rafIdRef = useRef<number | null>(null);
  const isPrimedRef = useRef(false);

  // Detect mobile viewport (< 768px) to switch between Mobile Autoplay & Desktop Scroll-Scrub
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const updateMobile = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
    };
    updateMobile(mq);
    mq.addEventListener('change', updateMobile);
    return () => mq.removeEventListener('change', updateMobile);
  }, []);

  // Track scroll progress across the sticky Hero runway (Desktop only)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Subtle depth transition ONLY after the video finishes (0.58 -> 1.0) on Desktop
  const stageScale = useTransform(scrollYProgress, [0, 0.58, 1], [1, 1, 0.96]);
  const stageOpacity = useTransform(scrollYProgress, [0, 0.65, 1], [1, 1, 0.35]);
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  // Smooth rAF loop to scrub video frames on Desktop
  const startScrubLoop = () => {
    if (isMobile || rafIdRef.current !== null) return;

    const tick = () => {
      const video = videoRef.current;
      const diff = targetProgressRef.current - currentProgressRef.current;

      if (Math.abs(diff) > 0.0008) {
        currentProgressRef.current += diff * 0.24;
        if (video && Number.isFinite(video.duration) && video.duration > 0 && !video.seeking) {
          const nextTime = Math.min(
            video.duration - 0.02,
            Math.max(0, currentProgressRef.current * video.duration)
          );
          if (Math.abs(video.currentTime - nextTime) > 0.012) {
            try {
              video.currentTime = nextTime;
            } catch {
              // Ignore transient seek errors
            }
          }
        }
        rafIdRef.current = requestAnimationFrame(tick);
      } else {
        currentProgressRef.current = targetProgressRef.current;
        if (video && Number.isFinite(video.duration) && video.duration > 0 && !video.seeking) {
          const finalTime = Math.min(
            video.duration - 0.02,
            Math.max(0, currentProgressRef.current * video.duration)
          );
          if (Math.abs(video.currentTime - finalTime) > 0.012) {
            try {
              video.currentTime = finalTime;
            } catch {
              // Ignore transient seek errors
            }
          }
        }
        rafIdRef.current = null;
      }
    };

    rafIdRef.current = requestAnimationFrame(tick);
  };

  // Map scroll progress (0 -> 0.58) to full video completion on Desktop only
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (isMobile) return;
    const normalizedVideoProgress = Math.min(1, Math.max(0, latest / 0.58));
    targetProgressRef.current = normalizedVideoProgress;
    startScrubLoop();
  });

  // Mobile Mode: Normal Autoplay + Loop + Auto-pause when scrolled out of view to save battery/GPU
  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !isMobile) return;

    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    video.loop = true;
    const startMobilePlayback = () => {
      setIsVideoReady(true);
      video.play().catch(() => {
        setIsVideoReady(true);
      });
    };

    if (video.readyState >= 1) {
      startMobilePlayback();
    } else {
      video.addEventListener('loadedmetadata', startMobilePlayback, { once: true });
      video.addEventListener('canplay', startMobilePlayback, { once: true });
    }

    // Pause video automatically when Hero is completely covered by the scrolling Services curtain on mobile
    const handleScrollVisibility = () => {
      if (!section) return;
      const heroHeight = section.offsetHeight || 340;
      if (window.scrollY > heroHeight + 40) {
        if (!video.paused) video.pause();
      } else if (video.paused) {
        video.play().catch(() => {});
      }
    };
    window.addEventListener('scroll', handleScrollVisibility, { passive: true });

    // Fallback unlock on first touch for strict mobile browsers
    const handleTouchUnlock = () => {
      if (video.paused && section) {
        const heroHeight = section.offsetHeight || 340;
        if (window.scrollY <= heroHeight + 40) {
          video.play().catch(() => {});
        }
      }
    };
    window.addEventListener('touchstart', handleTouchUnlock, { once: true, passive: true });

    return () => {
      video.removeEventListener('loadedmetadata', startMobilePlayback);
      video.removeEventListener('canplay', startMobilePlayback);
      window.removeEventListener('scroll', handleScrollVisibility);
      window.removeEventListener('touchstart', handleTouchUnlock);
    };
  }, [isMobile]);

  // Desktop Mode: Prime video for hardware-accelerated frame scrubbing
  useEffect(() => {
    const video = videoRef.current;
    if (!video || isMobile) return;

    video.loop = false;
    isPrimedRef.current = false;

    const unlockAndPrimeVideo = () => {
      if (isPrimedRef.current) return;
      isPrimedRef.current = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            video.pause();
            if (Number.isFinite(video.duration) && video.duration > 0) {
              video.currentTime = Math.min(
                video.duration - 0.02,
                Math.max(0.001, targetProgressRef.current * video.duration)
              );
            }
            setIsVideoReady(true);
          })
          .catch(() => {
            setIsVideoReady(true);
          });
      }
    };

    const onReady = () => {
      setIsVideoReady(true);
      if (!isPrimedRef.current) {
        unlockAndPrimeVideo();
      }
    };

    if (video.readyState >= 1) {
      onReady();
    } else {
      video.addEventListener('loadedmetadata', onReady, { once: true });
      video.addEventListener('loadeddata', onReady, { once: true });
      video.addEventListener('canplay', onReady, { once: true });
    }

    window.addEventListener('scroll', unlockAndPrimeVideo, { once: true, passive: true });

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      video.removeEventListener('loadedmetadata', onReady);
      video.removeEventListener('loadeddata', onReady);
      video.removeEventListener('canplay', onReady);
      window.removeEventListener('scroll', unlockAndPrimeVideo);
    };
  }, [isMobile]);

  return (
    <motion.section
      ref={sectionRef}
      id="hero-stage"
      className={
        isMobile
          ? 'sticky top-[3.75rem] w-full h-auto mt-[3.75rem] select-none z-10 bg-[#030108] overflow-hidden'
          : 'relative w-full md:h-[300dvh] lg:h-[320dvh] md:-mb-[100dvh] select-none z-10 bg-[#030108]'
      }
    >
      {/* Viewport Stage: Tightly framed 4:3 video stage on Mobile (matching reference crop), Sticky scroll-runway on Desktop */}
      <motion.div
        style={
          isMobile
            ? undefined
            : {
                scale: stageScale,
                opacity: stageOpacity,
              }
        }
        className={
          isMobile
            ? 'hero-stage-viewport relative w-full aspect-[4/3] min-h-[290px] max-h-[78vw] overflow-hidden flex flex-col justify-center bg-[#030108]'
            : 'hero-stage-viewport sticky top-0 left-0 w-full h-[100dvh] min-h-[100dvh] overflow-hidden flex flex-col justify-between bg-[#030108] will-change-transform'
        }
      >
        {/* 1. Cinematic Background Video Layer (Autoplay Loop on Mobile, Scroll-Scrubbed on Desktop) */}
        <div className="hero-video-frame absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 flex items-center justify-center">
          {/* Ambient Radial Purple Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(138,43,226,0.24)_0%,transparent_75%)] pointer-events-none z-10" />

          {/* High-Fidelity WebP Poster Layer (<37KB desktop / <17KB mobile, explicit dimensions for zero CLS) */}
          <img
            src="/posters/hero-poster.webp"
            srcSet="/posters/hero-poster-sm.webp 720w, /posters/hero-poster.webp 1280w"
            sizes="100vw"
            alt="Pulse OCTO"
            width={1280}
            height={720}
            fetchPriority="high"
            className="hero-video-media absolute inset-0 m-auto w-full h-full object-cover object-center filter brightness-[0.94] contrast-[1.05]"
            loading="eager"
            decoding="sync"
          />

          {/* Hero Video: Autoplay & Loop on Mobile, Scroll-Controlled on Desktop — preload="metadata" so video stream never blocks LCP poster on Slow 4G */}
          <video
            ref={videoRef}
            src="/videos/hero-scrub.mp4"
            poster="/posters/hero-poster.webp"
            autoPlay={isMobile}
            loop={isMobile}
            muted
            playsInline
            preload="metadata"
            disablePictureInPicture
            disableRemotePlayback
            controls={false}
            className={`hero-video-media relative z-[5] w-full h-full object-cover object-center filter brightness-[0.94] contrast-[1.04] transition-opacity duration-700 ease-out ${
              isVideoReady ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              transform: 'translateZ(0)',
            }}
          >
            <source src="/videos/hero-scrub.mp4" type="video/mp4" />
          </video>

          {/* Deep Contrast Vignettes to keep the visual balanced and seamless */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#030108] via-transparent to-[#030108]/55 z-10" />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#030108]/60 via-transparent to-[#030108]/35 z-10" />
        </div>

        {/* 2. Top Header Clearance (Desktop only; mobile stage is framed directly below navbar) */}
        <div className="hidden sm:block w-full sm:h-24 lg:h-28 shrink-0 pointer-events-none" />

        {/* 3. Central Brand Stage: Title & Call To Actions (Vertically Centered on Left) */}
        <div
          dir="ltr"
          className="hero-content-stage relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-10 lg:px-16 my-auto flex flex-col justify-center items-start text-left py-3 sm:py-6"
        >
          <div className="w-full max-w-2xl flex flex-col items-start text-left">
            {/* Title 1: Pulse Octo (Immediate paint for zero LCP/FCP delay) */}
            <h1
              className="hero-title-main text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-none font-['Orbitron',sans-serif] text-left drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]"
            >
              <span className="inline-block bg-gradient-to-r from-white via-zinc-100 to-purple-200 bg-clip-text text-transparent">
                Pulse Octo
              </span>
            </h1>

            {/* Title 2 / Subtitle: Your Digital Pulse */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.75, ease: 'easeOut', delay: 0.12 }}
              className="mt-1.5 sm:mt-3.5 flex items-center justify-start text-left"
            >
              <span className="hero-title-sub font-['Orbitron',sans-serif] text-[10px] sm:text-base md:text-xl lg:text-2xl font-bold tracking-[0.16em] sm:tracking-[0.26em] text-purple-200/90 uppercase select-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                Your Digital Pulse
              </span>
            </motion.div>
          </div>

          {/* Action CTAs: Stacked on left on Mobile (matching screenshot), Row on Desktop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.22 }}
            className="mt-4 sm:mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-center sm:justify-start gap-2.5 sm:gap-4 flex-wrap w-auto max-w-full z-30"
          >
            {/* Primary CTA: ابدأ نبض مشروعك (Liquid Glass Pill) */}
            <MagneticButton strength={10} className="shrink-0">
              <LiquidGlassButton
                id="hero-primary-cta"
                onClick={onExplore}
                className="text-xs sm:text-sm px-5 sm:px-7 py-2.5 sm:py-3.5"
              >
                <span>{isAr ? 'ابدأ نبض مشروعك' : 'Start Your Pulse'}</span>
              </LiquidGlassButton>
            </MagneticButton>

            {/* Secondary CTA: تواصل معنا (Liquid Glass Pill) */}
            <MagneticButton strength={10} className="shrink-0">
              <LiquidGlassButton
                id="hero-secondary-cta"
                onClick={onOpenConsultation}
                variant="secondary"
                className="text-xs sm:text-sm px-5 sm:px-7 py-2.5 sm:py-3.5"
              >
                <span>{isAr ? 'تواصل معنا' : 'Contact Us'}</span>
              </LiquidGlassButton>
            </MagneticButton>
          </motion.div>
        </div>

        {/* 4. Bottom Scroll to Explore Indicator (Desktop only) */}
        <motion.div
          style={isMobile ? undefined : { opacity: indicatorOpacity }}
          className="hidden sm:flex relative z-20 w-full justify-center pb-3 sm:pb-7"
        >
          <button
            type="button"
            onClick={onExplore}
            className="group flex flex-col items-center gap-1 sm:gap-1.5 text-zinc-400 hover:text-white transition-all cursor-pointer bg-transparent border-0 p-1.5 sm:p-2"
            aria-label={isAr ? 'استكشف المنظومة' : 'Explore System'}
          >
            <div className="w-8 h-8 rounded-full bg-white/[0.03] group-hover:bg-purple-600/20 border border-white/10 group-hover:border-purple-400/40 flex items-center justify-center transition-all duration-300">
              <ChevronDown className="w-4 h-4 text-zinc-300 group-hover:text-white group-hover:translate-y-0.5 transition-all duration-300" />
            </div>
          </button>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};
export default HeroSection;

