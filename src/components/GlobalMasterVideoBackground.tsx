import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useVelocity } from 'motion/react';

interface GlobalMasterVideoBackgroundProps {
  currentPage: string;
}

const PAGE_VIDEO_MAP: Record<
  string,
  { src: string; poster: string; id: number; titleAr: string; titleEn: string }
> = {
  home: {
    src: '/videos/video-7.mp4',
    poster: '/posters/video-7-poster.webp',
    id: 7,
    titleAr: 'فيديو الخلفية الرئيسي (7)',
    titleEn: 'Main Background Video (7)',
  },
  'the-8-arms': {
    src: '/videos/pulse-video-1.mp4',
    poster: '/posters/pulse-video-1-poster.webp',
    id: 1,
    titleAr: 'الأذرع الانسيابية في الفضاء المعماري مع خط النبض',
    titleEn: 'Architectural Chamber Fluid Tentacles',
  },
  services: {
    src: '/videos/pulse-video-4.mp4',
    poster: '/posters/pulse-video-4-poster.webp',
    id: 4,
    titleAr: 'المونوغرام المحاط بمسارات الدوائر والشبكات الإلكترونية',
    titleEn: 'Cyber Tech Circuits & Network Monogram',
  },
  portfolio: {
    src: '/videos/pulse-video-7.mp4',
    poster: '/posters/pulse-video-7-poster.webp',
    id: 7,
    titleAr: 'المونوغرام ثلاثي الأبعاد يدور على أرضية عاكسة فاخرة',
    titleEn: 'Rotating 3D Monogram on Reflective Floor',
  },
  'who-we-are': {
    src: '/videos/pulse-video-9.mp4',
    poster: '/posters/pulse-video-9-poster.webp',
    id: 9,
    titleAr: 'دوامة الكروم السائلة وانبثاق المونوغرام الدائري',
    titleEn: 'Chrome Liquid Vortex & Monogram Reveal',
  },
  blog: {
    src: '/videos/pulse-video-6.mp4',
    poster: '/posters/pulse-video-6-poster.webp',
    id: 6,
    titleAr: 'المونوغرام مع موجات الطاقة الهادئة والجزيئات العائمة',
    titleEn: 'Calm Energy Waves & Floating Star Dust',
  },
  contact: {
    src: '/videos/pulse-video-10.mp4',
    poster: '/posters/pulse-video-10-poster.webp',
    id: 10,
    titleAr: 'خلفية داكنة مينيمال مع خط نبض أرجواني انسيابي',
    titleEn: 'Minimal Obsidian Pulse Line',
  },
};

export const GlobalMasterVideoBackground: React.FC<GlobalMasterVideoBackgroundProps> = ({ currentPage }) => {
  const activeVideo = PAGE_VIDEO_MAP[currentPage] || PAGE_VIDEO_MAP.home;
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : true
  );
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);
  const [hasVideoError, setHasVideoError] = useState<boolean>(false);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);

  const scrollStopTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const onChange = (e: MediaQueryListEvent | MediaQueryList) => setIsMobile(e.matches);
    onChange(mq);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Framer Motion Scroll Tracking
  const { scrollY } = useScroll();

  // Reset video ready state when route/page video changes
  useEffect(() => {
    setIsVideoLoaded(false);
    setHasVideoError(false);
  }, [activeVideo.src]);

  // Framer Motion Scroll-Linked Video Playback Control (Desktop only)
  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (isMobile) return;
    const video = videoRef.current;
    if (!video || hasVideoError) return;

    if (currentPage === 'home' && latest < window.innerHeight * 0.7) {
      if (!video.paused) {
        video.pause();
      }
      return;
    }

    if (!isScrolling) {
      setIsScrolling(true);
    }

    if (video.paused) {
      video.play().catch(() => {});
    }

    if (scrollStopTimerRef.current) {
      clearTimeout(scrollStopTimerRef.current);
    }

    scrollStopTimerRef.current = setTimeout(() => {
      setIsScrolling(false);
      const vid = videoRef.current;
      if (vid && !vid.paused) {
        vid.pause();
      }
    }, 420);
  });

  // Pause playback when tab is in background to preserve battery and memory
  useEffect(() => {
    if (isMobile) return;
    const handleVisibility = () => {
      const video = videoRef.current;
      if (!video) return;

      if (document.hidden) {
        video.pause();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      if (scrollStopTimerRef.current) {
        clearTimeout(scrollStopTimerRef.current);
      }
    };
  }, [isMobile]);

  // Mobile Performance Mode (< 768px): Pure lightweight static CSS gradient with zero video/image overhead
  if (isMobile) {
    return (
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden bg-[#030108]"
      >
        <div className="absolute inset-0 bg-[#030108] bg-[radial-gradient(ellipse_90%_70%_at_50%_35%,rgba(138,43,226,0.2)_0%,rgba(15,7,38,0.75)_55%,#030108_100%)]" />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden bg-[#030108]"
    >
      {/* 0. Cinematic Luxury Ambient Background Underlayer (Guarantees brand violet aura at all times) */}
      <div className="absolute inset-0 bg-[#030108] bg-[radial-gradient(ellipse_90%_70%_at_50%_35%,rgba(138,43,226,0.22)_0%,rgba(15,7,38,0.75)_55%,#030108_100%)] pointer-events-none" />

      {/* 1. Dedicated Poster Image Layer (Always visible on load, during video buffering, or on video fallback) */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={activeVideo.poster}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={activeVideo.poster}
            alt="Pulse OCTO Atmospheric Visual"
            width={1280}
            height={720}
            className="w-full h-full object-cover object-center transform scale-100 filter brightness-[0.88] contrast-[1.08] transition-all duration-700"
            loading="eager"
            decoding="async"
          />
        </motion.div>
      </AnimatePresence>

      {/* 2. Scroll-Linked Hardware-Accelerated Video Layer (Smoothly fades in once ready) */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={activeVideo.src}
          initial={{ opacity: 0 }}
          animate={{ opacity: isVideoLoaded && !hasVideoError ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute inset-0 w-full h-full flex items-center justify-center"
        >
          <video
            ref={videoRef}
            src={activeVideo.src}
            poster={activeVideo.poster}
            loop
            muted
            playsInline
            preload="metadata"
            disablePictureInPicture
            disableRemotePlayback
            controls={false}
            onLoadedData={() => {
              setIsVideoLoaded(true);
            }}
            onCanPlay={() => {
              setIsVideoLoaded(true);
            }}
            onError={() => {
              setHasVideoError(true);
              setIsVideoLoaded(false);
            }}
            className="w-full h-full object-cover object-center"
            style={{
              transform: 'translateZ(0)',
            }}
          >
            <source src={activeVideo.src} type="video/mp4" />
          </video>
        </motion.div>
      </AnimatePresence>

      {/* 3. Soft Dark Vignette Layer (Ensures maximum contrast & legibility for all editorial text & glass cards) */}
      <div className="absolute inset-0 pointer-events-none bg-black/45" />

      {/* 4. Soft Center Glow focused on brand violet core */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(138,43,226,0.14)_0%,rgba(3,1,8,0.4)_80%)] pointer-events-none" />

      {/* 5. Subtle Vertical Top & Bottom Fades for Seamless Header/Footer Blending */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#030108]/85 via-[#030108]/40 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-[#030108]/90 via-[#030108]/50 to-transparent pointer-events-none" />
    </div>
  );
};

