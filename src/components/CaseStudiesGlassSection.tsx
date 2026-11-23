import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
  useReducedMotion,
  type PanInfo,
} from 'motion/react';
import { ProjectItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getOptimizedImageProps } from '../utils/imageOptimizer';
import {
  Target,
  Lightbulb,
  TrendingUp,
  ArrowUpRight,
  ExternalLink,
  CheckCircle2,
  Layers,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export type CaseStudyPillar = 'all' | 'challenge' | 'solution' | 'result';
type SinglePillar = 'challenge' | 'solution' | 'result';

interface CaseStudiesGlassSectionProps {
  projects: ProjectItem[];
  onSelectProject: (project: ProjectItem) => void;
}

interface CarouselMetrics {
  viewportWidth: number;
  slideWidth: number;
  gap: number;
  pad: number;
}

const MOBILE_MEDIA_QUERY = '(max-width: 767px)';
const SLIDE_GAP_PX = 16;
const TRACK_PAD_PX = 16;

function hexToRgba(hex: string, alpha: number): string {
  const clean = (hex || '').replace('#', '');
  if (clean.length !== 6) return `rgba(147, 51, 234, ${alpha})`;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    return `rgba(147, 51, 234, ${alpha})`;
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getBrandGlassTheme(project: ProjectItem) {
  switch (project.id) {
    case 'zeyad-optical':
      return {
        surfaceClass: 'bg-[#08193B]/80 hover:bg-[#0A1E46]/90 backdrop-blur-2xl',
        borderClass: 'border-[#D4AF37]/30 hover:border-[#D4AF37]/65',
        topRimClass: 'via-[#D4AF37]/65',
        accentTextClass: 'text-[#F5E6C8]',
        ambientGlow:
          'radial-gradient(circle at 85% 15%, rgba(212, 175, 55, 0.16), rgba(8, 25, 59, 0.92) 70%)',
      };
    case 'ladies-shop':
      return {
        surfaceClass: 'bg-white/[0.03] hover:bg-white/[0.05] backdrop-blur-2xl',
        borderClass: 'border-[#D4A397]/30 hover:border-[#D4A397]/65',
        topRimClass: 'via-[#D4A397]/65',
        accentTextClass: 'text-[#F8BBD0]',
        ambientGlow:
          'radial-gradient(circle at 85% 15%, rgba(212, 163, 151, 0.16), rgba(12, 10, 14, 0.65) 70%)',
      };
    case 'namaa-academy':
      return {
        surfaceClass: 'bg-white/[0.03] hover:bg-white/[0.05] backdrop-blur-2xl',
        borderClass: 'border-white/15 hover:border-[#D49B35]/60',
        topRimClass: 'via-[#D49B35]/60',
        accentTextClass: 'text-[#F4F1EA]',
        ambientGlow:
          'radial-gradient(circle at 85% 15%, rgba(15, 76, 58, 0.24), rgba(8, 12, 10, 0.65) 70%)',
      };
    case 'halan-delivery':
      return {
        surfaceClass: 'bg-white/[0.03] hover:bg-white/[0.05] backdrop-blur-2xl',
        borderClass: 'border-white/15 hover:border-[#9ACA3C]/60',
        topRimClass: 'via-[#9ACA3C]/60',
        accentTextClass: 'text-[#E3F5B8]',
        ambientGlow:
          'radial-gradient(circle at 85% 15%, rgba(154, 202, 60, 0.16), rgba(10, 12, 10, 0.65) 70%)',
      };
    case 'athar':
      return {
        surfaceClass: 'bg-[#13090b]/85 hover:bg-[#1a0c0f]/90 backdrop-blur-2xl',
        borderClass: 'border-[#C8A46B]/35 hover:border-[#C8A46B]/75',
        topRimClass: 'via-[#C8A46B]/75',
        accentTextClass: 'text-[#F4ECE0]',
        ambientGlow:
          'radial-gradient(circle at 85% 15%, rgba(74, 18, 25, 0.42), rgba(14, 9, 10, 0.78) 72%)',
      };
    case 'adamco':
      return {
        surfaceClass: 'bg-white/[0.03] hover:bg-white/[0.05] backdrop-blur-2xl',
        borderClass: 'border-white/15 hover:border-[#C0C5CE]/60',
        topRimClass: 'via-[#C0C5CE]/60',
        accentTextClass: 'text-zinc-100',
        ambientGlow:
          'radial-gradient(circle at 85% 15%, rgba(158, 27, 30, 0.18), rgba(10, 10, 14, 0.65) 70%)',
      };
    default: {
      const primaryHex = project.brandColors?.[0]?.hex || '#8A2BE2';
      return {
        surfaceClass: 'bg-white/[0.03] hover:bg-white/[0.05] backdrop-blur-2xl',
        borderClass: 'border-white/15 hover:border-white/35',
        topRimClass: 'via-white/45',
        accentTextClass: 'text-zinc-100',
        ambientGlow: `radial-gradient(circle at 85% 15%, ${hexToRgba(primaryHex, 0.22)}, rgba(8, 7, 14, 0.68) 72%)`,
      };
    }
  }
}

export const CaseStudiesGlassSection: React.FC<CaseStudiesGlassSectionProps> = ({
  projects,
  onSelectProject,
}) => {
  const { isAr, dir } = useLanguage();
  const prefersReducedMotion = useReducedMotion();

  const [selectedClientId, setSelectedClientId] = useState<string>('all');
  const [globalPillar, setGlobalPillar] = useState<CaseStudyPillar>('all');
  const [cardActivePillar, setCardActivePillar] = useState<
    Record<string, SinglePillar>
  >({});
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(() =>
    typeof window !== 'undefined'
      ? window.matchMedia(MOBILE_MEDIA_QUERY).matches
      : false
  );
  const [metrics, setMetrics] = useState<CarouselMetrics>({
    viewportWidth: 390,
    slideWidth: 335,
    gap: SLIDE_GAP_PX,
    pad: TRACK_PAD_PX,
  });

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const wasDraggedRef = useRef<boolean>(false);
  const dragResetTimerRef = useRef<number | null>(null);
  const dragX = useMotionValue(0);

  const visibleProjects = useMemo(() => {
    if (selectedClientId === 'all') return projects;
    const found = projects.filter((p) => p.id === selectedClientId);
    return found.length > 0 ? found : projects;
  }, [projects, selectedClientId]);

  const isMultiSlide = visibleProjects.length > 1;
  const isDragEnabled = isMobileViewport && isMultiSlide;

  // Listen for viewport breakpoint changes (< 768px vs >= 768px)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(MOBILE_MEDIA_QUERY);
    const updateMatch = () => setIsMobileViewport(mql.matches);
    updateMatch();

    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', updateMatch);
      return () => mql.removeEventListener('change', updateMatch);
    }
    mql.addListener(updateMatch);
    return () => mql.removeListener(updateMatch);
  }, []);

  // Measure carousel viewport and first slide dimensions for exact RTL/LTR drag snap coordinates
  const measureCarousel = useCallback(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const viewportWidth = vp.clientWidth || window.innerWidth || 390;
    const firstSlide = slideRefs.current[0];
    const measuredSlideWidth =
      firstSlide && firstSlide.offsetWidth > 0
        ? firstSlide.offsetWidth
        : Math.min(Math.round(viewportWidth * 0.86), 360);

    setMetrics((prev) => {
      if (
        Math.abs(prev.viewportWidth - viewportWidth) < 1 &&
        Math.abs(prev.slideWidth - measuredSlideWidth) < 1
      ) {
        return prev;
      }
      return {
        viewportWidth,
        slideWidth: measuredSlideWidth,
        gap: SLIDE_GAP_PX,
        pad: TRACK_PAD_PX,
      };
    });
  }, []);

  useEffect(() => {
    slideRefs.current = slideRefs.current.slice(0, visibleProjects.length);
    if (!isMobileViewport) {
      dragX.set(0);
      return;
    }

    measureCarousel();
    const vp = viewportRef.current;
    if (!vp || typeof ResizeObserver === 'undefined') return;

    const ro = new ResizeObserver(() => measureCarousel());
    ro.observe(vp);
    if (slideRefs.current[0]) {
      ro.observe(slideRefs.current[0]);
    }
    return () => ro.disconnect();
  }, [isMobileViewport, visibleProjects.length, measureCarousel, dragX]);

  // Compute exact max horizontal travel & target X coordinate per slide (RTL & LTR safe)
  const maxTravel = useMemo(() => {
    const count = visibleProjects.length;
    if (count <= 1) return 0;
    const totalTrackWidth =
      metrics.pad * 2 +
      count * metrics.slideWidth +
      (count - 1) * metrics.gap;
    return Math.max(0, totalTrackWidth - metrics.viewportWidth);
  }, [visibleProjects.length, metrics]);

  const getTargetXForSlide = useCallback(
    (slideIndex: number): number => {
      const count = visibleProjects.length;
      if (count <= 1 || maxTravel === 0) return 0;

      const clamped = Math.max(0, Math.min(count - 1, slideIndex));
      const directionSign = dir === 'rtl' ? 1 : -1;

      if (clamped === 0) return 0;
      if (clamped === count - 1) return directionSign * maxTravel;

      const slideStart = metrics.pad + clamped * (metrics.slideWidth + metrics.gap);
      const centerShift = (metrics.viewportWidth - metrics.slideWidth) / 2;
      const offset = Math.max(0, Math.min(maxTravel, slideStart - centerShift));
      return directionSign * offset;
    },
    [visibleProjects.length, maxTravel, dir, metrics]
  );

  const dragConstraints = useMemo(() => {
    if (!isDragEnabled) return { left: 0, right: 0 };
    return dir === 'rtl'
      ? { left: 0, right: maxTravel }
      : { left: -maxTravel, right: 0 };
  }, [isDragEnabled, dir, maxTravel]);

  // Ref keeps latest metrics fresh for the real-time Royal Amethyst progress bar transform
  const progressMetaRef = useRef({
    count: visibleProjects.length,
    maxTravel,
    isRtl: dir === 'rtl',
  });
  progressMetaRef.current = {
    count: visibleProjects.length,
    maxTravel,
    isRtl: dir === 'rtl',
  };

  const progressScaleX = useTransform(dragX, (latestX) => {
    const { count, maxTravel: travel, isRtl } = progressMetaRef.current;
    const safeCount = Math.max(1, count);
    const minFraction = 1 / safeCount;
    if (safeCount <= 1 || travel <= 0) return minFraction;
    const directionalX = isRtl ? latestX : -latestX;
    const normalized = Math.max(0, Math.min(1, directionalX / travel));
    return minFraction + normalized * (1 - minFraction);
  });

  // Animate track to a target slide index with crisp spring physics
  const goToSlide = useCallback(
    (targetIndex: number, instant = false) => {
      const clamped = Math.max(
        0,
        Math.min(visibleProjects.length - 1, targetIndex)
      );
      setActiveSlideIndex(clamped);

      if (!isDragEnabled) {
        dragX.set(0);
        return;
      }

      const targetX = getTargetXForSlide(clamped);
      if (instant) {
        dragX.set(targetX);
        return;
      }

      animate(
        dragX,
        targetX,
        prefersReducedMotion
          ? { type: 'tween', duration: 0.16, ease: 'easeOut' }
          : {
              type: 'spring',
              stiffness: 320,
              damping: 34,
              mass: 0.9,
            }
      );
    },
    [
      visibleProjects.length,
      isDragEnabled,
      getTargetXForSlide,
      dragX,
      prefersReducedMotion,
    ]
  );

  // Reset mobile carousel to the first slide whenever filtered projects change
  useEffect(() => {
    setActiveSlideIndex(0);
    dragX.set(0);
  }, [selectedClientId, projects, dragX]);

  // Keep track aligned on viewport resize or language/direction toggle
  useEffect(() => {
    if (!isDragEnabled) {
      dragX.set(0);
      return;
    }
    const targetX = getTargetXForSlide(activeSlideIndex);
    dragX.set(targetX);
  }, [isDragEnabled, dir, metrics, activeSlideIndex, getTargetXForSlide, dragX]);

  useEffect(() => {
    return () => {
      if (dragResetTimerRef.current) {
        window.clearTimeout(dragResetTimerRef.current);
      }
    };
  }, []);

  const handleDragStart = () => {
    setIsDragging(true);
    wasDraggedRef.current = true;
    if (dragResetTimerRef.current) {
      window.clearTimeout(dragResetTimerRef.current);
    }
  };

  const handleDragEnd = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    setIsDragging(false);

    // Clear click-suppression flag shortly after gesture release
    dragResetTimerRef.current = window.setTimeout(() => {
      wasDraggedRef.current = false;
    }, 80);

    if (!isDragEnabled) return;

    // Normalize swipe direction to logical "next" (+1) vs "previous" (-1)
    // LTR: dragging left (offset.x < 0) moves to next slide
    // RTL: dragging right (offset.x > 0) pulls the next slide from the left into view
    const directionalOffset = dir === 'rtl' ? info.offset.x : -info.offset.x;
    const directionalVelocity =
      dir === 'rtl' ? info.velocity.x : -info.velocity.x;

    const swipeThreshold = Math.max(44, metrics.slideWidth * 0.16);
    const velocityThreshold = 320;

    let nextIndex = activeSlideIndex;

    if (
      directionalOffset > swipeThreshold ||
      directionalVelocity > velocityThreshold
    ) {
      nextIndex = Math.min(visibleProjects.length - 1, activeSlideIndex + 1);
    } else if (
      directionalOffset < -swipeThreshold ||
      directionalVelocity < -velocityThreshold
    ) {
      nextIndex = Math.max(0, activeSlideIndex - 1);
    } else {
      // Snap to nearest slide if the user slowly dragged past halfway across multiple slides
      const currentX = dragX.get();
      let closestIdx = activeSlideIndex;
      let closestDist = Infinity;
      for (let i = 0; i < visibleProjects.length; i += 1) {
        const dist = Math.abs(currentX - getTargetXForSlide(i));
        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = i;
        }
      }
      nextIndex = closestIdx;
    }

    goToSlide(nextIndex);
  };

  const handleTrackClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (wasDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleCarouselKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isDragEnabled) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      goToSlide(dir === 'rtl' ? activeSlideIndex - 1 : activeSlideIndex + 1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goToSlide(dir === 'rtl' ? activeSlideIndex + 1 : activeSlideIndex - 1);
    }
  };

  const handleCardPillarSelect = (projectId: string, pillar: SinglePillar) => {
    setCardActivePillar((prev) => ({
      ...prev,
      [projectId]: pillar,
    }));
  };

  const pillarTabs: {
    id: CaseStudyPillar;
    label: string;
    icon: React.FC<{ className?: string }>;
  }[] = [
    {
      id: 'all',
      label: isAr ? 'العرض الثلاثي الكامل' : 'Full 3-Pillar View',
      icon: Layers,
    },
    {
      id: 'challenge',
      label: isAr ? '01. التحدي' : '01. The Challenge',
      icon: Target,
    },
    {
      id: 'solution',
      label: isAr ? '02. الحل' : '02. The Solution',
      icon: Lightbulb,
    },
    {
      id: 'result',
      label: isAr ? '03. النتيجة والأثر' : '03. The Result',
      icon: TrendingUp,
    },
  ];

  const mobileCardPillarTabs: {
    id: SinglePillar;
    shortLabel: string;
    icon: React.FC<{ className?: string }>;
  }[] = [
    {
      id: 'challenge',
      shortLabel: isAr ? '01. التحدي' : '01. Challenge',
      icon: Target,
    },
    {
      id: 'solution',
      shortLabel: isAr ? '02. الحل' : '02. Solution',
      icon: Lightbulb,
    },
    {
      id: 'result',
      shortLabel: isAr ? '03. النتيجة' : '03. Result',
      icon: TrendingUp,
    },
  ];

  if (projects.length === 0) return null;

  const formattedCurrentSlide = String(activeSlideIndex + 1).padStart(2, '0');
  const formattedTotalSlides = String(visibleProjects.length).padStart(2, '0');

  return (
    <section
      id="case-studies"
      aria-labelledby="case-studies-heading"
      className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 border-t border-white/[0.08] overflow-x-clip"
    >
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 sm:mb-10">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-3">
            <span>{isAr ? 'دراسات الحالة الموثقة' : 'Documented Case Studies'}</span>
            <span aria-hidden="true">·</span>
            <span>
              {isAr
                ? 'منهجية التحدي والحل والنتيجة'
                : 'Challenge, Solution & Result Methodology'}
            </span>
          </div>
          <h2
            id="case-studies-heading"
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight"
            style={{ textWrap: 'balance' }}
          >
            {isAr
              ? 'دراسات الحالة التفاعلية: من التحدي إلى النتيجة القابلة للقياس'
              : 'Interactive Case Studies: From Business Challenge to Measurable Impact'}
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 mt-3 leading-relaxed">
            {isAr
              ? 'استكشف كيف عالجت منظومة Pulse OCTO التحديات التسويقية والبصرية لكل علامة تجارية، والحلول المنفذة، والنتائج المحققة على أرض الواقع.'
              : 'Explore how Pulse OCTO diagnosed each brand challenge, engineered tailored creative and technical solutions, and delivered verifiable business outcomes.'}
          </p>
        </div>

        {/* Global Pillar Lens Selector (Desktop / Tablet; on Mobile each card has a compact thumb-zone pillar bar) */}
        <div
          role="group"
          aria-label={isAr ? 'زاوية تركيز دراسة الحالة' : 'Case Study Focus Lens'}
          className="hidden md:flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 self-start lg:self-auto"
        >
          {pillarTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = globalPillar === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setGlobalPillar(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-white/[0.12] text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Brand Filter Strip */}
      <div
        role="tablist"
        aria-label={isAr ? 'اختيار العلامة التجارية' : 'Select Brand Case Study'}
        className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 md:mb-8 no-scrollbar border-b border-white/[0.06]"
      >
        <button
          type="button"
          role="tab"
          aria-selected={selectedClientId === 'all'}
          onClick={() => setSelectedClientId('all')}
          className={`px-4 py-2.5 md:py-2 min-h-[44px] md:min-h-0 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 border ${
            selectedClientId === 'all'
              ? 'bg-white/[0.10] text-white border-white/30'
              : 'bg-white/[0.02] text-zinc-400 hover:text-white border-white/[0.08] hover:border-white/20'
          }`}
        >
          {isAr
            ? `جميع دراسات الحالة (${projects.length})`
            : `All Case Studies (${projects.length})`}
        </button>

        {projects.map((proj) => {
          const isSelected = selectedClientId === proj.id;
          const label = isAr ? proj.client : proj.clientEn || proj.client;
          return (
            <button
              key={proj.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelectedClientId(proj.id)}
              className={`px-4 py-2.5 md:py-2 min-h-[44px] md:min-h-0 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 border ${
                isSelected
                  ? 'bg-white/[0.10] text-white border-white/30'
                  : 'bg-white/[0.02] text-zinc-400 hover:text-white border-white/[0.08] hover:border-white/20'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Mobile Swipe Hint & Live Counter (Mobile Only) */}
      {isMultiSlide && (
        <div className="flex md:hidden items-center justify-between gap-3 mb-4 text-xs text-zinc-400">
          <span>
            {isAr
              ? 'اسحب أفقياً لاستعراض دراسات الحالة'
              : 'Swipe horizontally to browse case studies'}
          </span>
          <span
            dir="ltr"
            aria-live="polite"
            className="font-mono tabular-nums text-zinc-200 shrink-0"
          >
            {formattedCurrentSlide} / {formattedTotalSlides}
          </span>
        </div>
      )}

      {/* Glassmorphism Case Study Cards Viewport:
          - Mobile (< md): Framer Motion drag="x" spring-physics swipeable carousel
          - Tablet / Desktop (>= md): Full-width stacked 3-pillar Glassmorphism showcase */}
      <div
        ref={viewportRef}
        role={isMultiSlide ? 'region' : undefined}
        aria-roledescription={isMultiSlide ? 'carousel' : undefined}
        aria-label={
          isMultiSlide
            ? isAr
              ? 'معرض دراسات الحالة القابل للسحب'
              : 'Swipeable Case Studies Carousel'
            : undefined
        }
        tabIndex={isMultiSlide ? 0 : undefined}
        onKeyDown={handleCarouselKeyDown}
        className="overflow-hidden md:overflow-visible -mx-4 md:mx-0 pb-2 md:pb-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 rounded-[28px]"
      >
        <motion.div
          drag={isDragEnabled ? 'x' : false}
          dragDirectionLock
          dragConstraints={dragConstraints}
          dragElastic={0.18}
          dragMomentum={false}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onClickCapture={handleTrackClickCapture}
          style={isDragEnabled ? { x: dragX } : undefined}
          className={`flex md:block gap-4 md:gap-0 md:space-y-8 px-4 md:px-0 ${
            isDragEnabled
              ? 'touch-pan-y select-none cursor-grab active:cursor-grabbing will-change-transform'
              : ''
          }`}
        >
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((proj, index) => {
              const theme = getBrandGlassTheme(proj);
              const logoOpt = proj.logo
                ? getOptimizedImageProps(proj.logo, { isLogo: true })
                : null;

              const activeCardTab: SinglePillar =
                cardActivePillar[proj.id] || 'result';
              const focusedPillar: SinglePillar =
                globalPillar === 'all' ? activeCardTab : globalPillar;

              const localizedClient = isAr
                ? proj.client
                : proj.clientEn || proj.client;
              const localizedCategory = isAr
                ? proj.category
                : proj.categoryEn || proj.category;
              const localizedDuration = isAr
                ? proj.duration
                : proj.durationEn || proj.duration;
              const localizedChallenge = isAr
                ? proj.challenge
                : proj.challengeEn || proj.challenge;
              const localizedSolution = isAr
                ? proj.solution
                : proj.solutionEn || proj.solution;
              const deliverablesList =
                (isAr
                  ? proj.deliverables
                  : proj.deliverablesEn || proj.deliverables) || [];
              const statsList = proj.stats || [];

              return (
                <motion.article
                  layout={!isMobileViewport}
                  key={proj.id}
                  ref={(el) => {
                    slideRefs.current[index] = el;
                  }}
                  data-slide-index={index}
                  role={isMultiSlide ? 'group' : undefined}
                  aria-roledescription={isMultiSlide ? 'slide' : undefined}
                  aria-label={
                    isMultiSlide
                      ? `${index + 1} / ${visibleProjects.length} — ${localizedClient}`
                      : undefined
                  }
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{
                    duration: 0.35,
                    delay: index * 0.04,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`relative rounded-[28px] overflow-hidden border ${theme.borderClass} ${theme.surfaceClass} p-5 sm:p-7 md:p-8 lg:p-10 transition-[border-color,background-color,transform] duration-200 shadow-[0_24px_60px_rgba(0,0,0,0.65)] flex flex-col justify-between md:block shrink-0 ${
                    isDragEnabled && isDragging ? 'scale-[0.992]' : 'scale-100'
                  } ${
                    isMultiSlide
                      ? 'w-[86vw] max-w-[360px] sm:w-[78vw] sm:max-w-[460px] md:w-full md:max-w-none'
                      : 'w-full'
                  }`}
                >
                  {/* Top Specular Rim */}
                  <div
                    className={`absolute top-0 inset-x-10 sm:inset-x-12 h-px bg-gradient-to-r from-transparent ${theme.topRimClass} to-transparent pointer-events-none z-20`}
                  />

                  {/* Brand Ambient Radial Glow */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-85"
                    style={{ background: theme.ambientGlow }}
                  />

                  {/* Card Top Header */}
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 md:pb-6 border-b border-white/[0.08]">
                    <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                      {logoOpt ? (
                        <img
                          src={logoOpt.src}
                          alt={localizedClient}
                          width={56}
                          height={56}
                          loading="lazy"
                          decoding="async"
                          draggable={false}
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 sm:w-14 sm:h-14 object-contain rounded-xl shrink-0 pointer-events-none"
                        />
                      ) : (
                        <span className="font-mono text-base font-bold text-white/75 shrink-0 tabular-nums">
                          0{index + 1}
                        </span>
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-zinc-400 mb-1">
                          <span className="font-mono tabular-nums text-white/60">
                            0{index + 1}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="truncate">{localizedCategory}</span>
                          {localizedDuration && (
                            <span className="hidden md:inline-flex items-center gap-2">
                              <span aria-hidden="true">·</span>
                              <span>{localizedDuration}</span>
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight truncate">
                          {localizedClient}
                        </h3>
                      </div>
                    </div>

                    {/* Mobile Compact Highlight Metric Strip (Always visible at a glance on mobile) */}
                    {proj.metricHighlight && (
                      <div className="flex md:hidden items-baseline justify-between gap-3 pt-1">
                        <span className="text-xs text-zinc-400 truncate">
                          {isAr
                            ? proj.metricHighlight.label
                            : proj.metricHighlight.labelEn ||
                              proj.metricHighlight.label}
                        </span>
                        <span
                          className={`text-lg font-extrabold font-mono tabular-nums shrink-0 ${theme.accentTextClass}`}
                        >
                          {proj.metricHighlight.value}
                        </span>
                      </div>
                    )}

                    {/* Card Actions (Desktop/Tablet Top Bar) */}
                    <div className="hidden md:flex flex-wrap items-center gap-2.5 shrink-0">
                      {proj.websiteUrl && (
                        <a
                          href={proj.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.10] text-xs font-semibold text-zinc-200 hover:text-white transition-colors whitespace-nowrap shrink-0"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>{isAr ? 'الموقع المباشر' : 'Live Site'}</span>
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => onSelectProject(proj)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.10] hover:bg-white/[0.18] text-xs font-semibold text-white transition-all cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <span>
                          {isAr
                            ? 'فتح معرض المشروع الكامل'
                            : 'Open Full Project Showcase'}
                        </span>
                        <ArrowUpRight
                          className={`w-3.5 h-3.5 ${
                            dir === 'rtl' ? '-scale-x-100' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Mobile Compact Segmented Switcher (Challenge | Solution | Result) */}
                  <div
                    role="tablist"
                    aria-label={
                      isAr
                        ? `أقسام دراسة حالة ${localizedClient}`
                        : `${localizedClient} case study pillars`
                    }
                    className="relative z-10 grid grid-cols-3 gap-1 p-1 mt-4 rounded-xl bg-black/35 border border-white/10 md:hidden"
                  >
                    {mobileCardPillarTabs.map((tab) => {
                      const isTabActive = focusedPillar === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          role="tab"
                          aria-selected={isTabActive}
                          onClick={() => handleCardPillarSelect(proj.id, tab.id)}
                          className={`min-h-[40px] px-2 py-2 rounded-lg text-[11px] font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap truncate ${
                            isTabActive
                              ? 'bg-white/[0.14] text-white shadow-sm'
                              : 'text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          {tab.shortLabel}
                        </button>
                      );
                    })}
                  </div>

                  {/* Three Interactive Pillars Separated by Hairline Dividers (Challenge | Solution | Result) */}
                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 divide-y-0 md:divide-y lg:divide-y-0 lg:divide-x lg:rtl:divide-x-reverse divide-white/[0.08] pt-4 md:pt-6 flex-1">
                    {/* Pillar 1: The Challenge (التحدي) */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => handleCardPillarSelect(proj.id, 'challenge')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleCardPillarSelect(proj.id, 'challenge');
                        }
                      }}
                      className={`${
                        focusedPillar === 'challenge' ? 'flex' : 'hidden md:flex'
                      } py-2 md:py-4 lg:py-2 lg:pe-7 transition-opacity duration-200 cursor-pointer flex-col justify-between ${
                        globalPillar !== 'all' && focusedPillar !== 'challenge'
                          ? 'md:opacity-50 md:hover:opacity-95'
                          : 'opacity-100'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span
                            className={`text-xs font-semibold tracking-wide ${
                              focusedPillar === 'challenge'
                                ? theme.accentTextClass
                                : 'text-zinc-300'
                            }`}
                          >
                            {isAr
                              ? '01. التحدي التسويقي والبصري'
                              : '01. The Challenge'}
                          </span>
                          <Target className="w-4 h-4 text-zinc-400 shrink-0" />
                        </div>

                        <p className="text-sm text-zinc-200 leading-relaxed">
                          {localizedChallenge}
                        </p>
                      </div>

                      <div className="mt-5 md:mt-6 pt-3.5 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
                        <span>
                          {isAr ? 'نطاق السوق' : 'Market Scope'}:{' '}
                          <strong className="text-zinc-200 font-medium">
                            {isAr
                              ? proj.location || 'جمهورية مصر العربية'
                              : proj.locationEn || proj.location || 'Egypt'}
                          </strong>
                        </span>
                        {proj.year && (
                          <span className="font-mono tabular-nums text-zinc-400">
                            {proj.year}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Pillar 2: The Solution (الحل) */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => handleCardPillarSelect(proj.id, 'solution')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleCardPillarSelect(proj.id, 'solution');
                        }
                      }}
                      className={`${
                        focusedPillar === 'solution' ? 'flex' : 'hidden md:flex'
                      } py-2 md:py-5 lg:py-2 lg:px-7 transition-opacity duration-200 cursor-pointer flex-col justify-between ${
                        globalPillar !== 'all' && focusedPillar !== 'solution'
                          ? 'md:opacity-50 md:hover:opacity-95'
                          : 'opacity-100'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span
                            className={`text-xs font-semibold tracking-wide ${
                              focusedPillar === 'solution'
                                ? theme.accentTextClass
                                : 'text-zinc-300'
                            }`}
                          >
                            {isAr ? '02. الحل المنفّذ' : '02. The Solution'}
                          </span>
                          <Lightbulb className="w-4 h-4 text-zinc-400 shrink-0" />
                        </div>

                        <p className="text-sm text-zinc-200 leading-relaxed">
                          {localizedSolution}
                        </p>

                        {deliverablesList.length > 0 && (
                          <ul className="mt-4 space-y-2 pt-3.5 border-t border-white/[0.06]">
                            {deliverablesList.slice(0, 3).map((item, dIdx) => (
                              <li
                                key={dIdx}
                                className="flex items-start gap-2 text-xs text-zinc-300"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                                <span className="leading-snug">{item}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-zinc-400">
                        <span>
                          {isAr ? 'المخرجات المعتمدة' : 'Verified Deliverables'}
                        </span>
                        <span className="font-mono tabular-nums text-zinc-200">
                          {deliverablesList.length}
                        </span>
                      </div>
                    </div>

                    {/* Pillar 3: The Result (النتيجة والأثر) */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => handleCardPillarSelect(proj.id, 'result')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleCardPillarSelect(proj.id, 'result');
                        }
                      }}
                      className={`${
                        focusedPillar === 'result' ? 'flex' : 'hidden md:flex'
                      } py-2 md:pt-5 lg:py-2 lg:ps-7 transition-opacity duration-200 cursor-pointer flex-col justify-between ${
                        globalPillar !== 'all' && focusedPillar !== 'result'
                          ? 'md:opacity-50 md:hover:opacity-95'
                          : 'opacity-100'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span
                            className={`text-xs font-semibold tracking-wide ${
                              focusedPillar === 'result'
                                ? theme.accentTextClass
                                : 'text-zinc-300'
                            }`}
                          >
                            {isAr
                              ? '03. النتيجة والأثر المحقق'
                              : '03. The Result & Impact'}
                          </span>
                          <TrendingUp className="w-4 h-4 text-zinc-400 shrink-0" />
                        </div>

                        {/* Primary Highlight Metric (Shown inside pillar on Tablet/Desktop; already in mobile header) */}
                        {proj.metricHighlight && (
                          <div className="hidden md:block mb-4 pb-3.5 border-b border-white/[0.08]">
                            <div
                              className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-mono tabular-nums ${theme.accentTextClass}`}
                            >
                              {proj.metricHighlight.value}
                            </div>
                            <div className="text-xs text-zinc-300 mt-1">
                              {isAr
                                ? proj.metricHighlight.label
                                : proj.metricHighlight.labelEn ||
                                  proj.metricHighlight.label}
                            </div>
                          </div>
                        )}

                        {/* Key Quantified Outcomes Grid (Unboxed with Hairline Separators) */}
                        {statsList.length > 0 && (
                          <div className="grid grid-cols-2 gap-x-5 gap-y-3.5">
                            {statsList.slice(0, 4).map((st, sIdx) => (
                              <div key={sIdx}>
                                <div className="text-sm sm:text-base font-bold text-white font-mono tabular-nums">
                                  {st.value}
                                </div>
                                <div className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                                  {isAr ? st.label : st.labelEn || st.label}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {proj.quote && (
                        <div className="mt-5 pt-3 border-t border-white/[0.06] text-xs text-zinc-300 italic leading-relaxed">
                          “
                          {isAr
                            ? proj.quote.text
                            : proj.quote.textEn || proj.quote.text}
                          ”
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mobile Card Footer Actions (Thumb-friendly >=44px tap targets) */}
                  <div className="relative z-10 flex md:hidden items-center gap-2 pt-4 mt-4 border-t border-white/[0.08]">
                    <button
                      type="button"
                      onClick={() => onSelectProject(proj)}
                      className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/[0.10] hover:bg-white/[0.18] active:scale-[0.99] text-xs font-semibold text-white transition-all cursor-pointer whitespace-nowrap"
                    >
                      <span>
                        {isAr ? 'فتح معرض المشروع' : 'Open Full Showcase'}
                      </span>
                      <ArrowUpRight
                        className={`w-3.5 h-3.5 ${
                          dir === 'rtl' ? '-scale-x-100' : ''
                        }`}
                      />
                    </button>

                    {proj.websiteUrl && (
                      <a
                        href={proj.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={
                          isAr ? 'زيارة الموقع المباشر' : 'Visit Live Site'
                        }
                        className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.10] text-zinc-200 hover:text-white transition-colors shrink-0"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Mobile Swipe Visual Indicator: Royal Amethyst Progress Bar, Interactive Dots & Controls */}
      {isMultiSlide && (
        <div className="md:hidden mt-5 space-y-3">
          {/* Continuous GPU-Accelerated Royal Amethyst Progress Track */}
          <div className="space-y-2">
            <div
              aria-hidden="true"
              className="relative h-1 w-full rounded-full bg-white/[0.08] overflow-hidden"
            >
              <motion.div
                style={{ scaleX: progressScaleX }}
                className={`h-full w-full rounded-full bg-gradient-to-r from-[#8052ff] via-[#a78bfa] to-[#8052ff] shadow-[0_0_12px_rgba(128,82,255,0.6)] ${
                  dir === 'rtl' ? 'origin-right' : 'origin-left'
                }`}
              />
            </div>

            <div className="flex items-center justify-between gap-2 text-[11px] text-[#bdbdbd]">
              <span className="inline-flex items-center gap-1.5">
                <span className="text-[#8052ff]" aria-hidden="true">
                  {dir === 'rtl' ? '←' : '→'}
                </span>
                <span>
                  {isAr ? 'اسحب لاستعراض المشاريع' : 'Swipe to explore projects'}
                </span>
              </span>
              <span
                dir="ltr"
                className="font-mono tabular-nums text-white/80"
              >
                {formattedCurrentSlide} / {formattedTotalSlides}
              </span>
            </div>
          </div>

          {/* Interactive Royal Amethyst Dots + Prev / Next Buttons (>= 44px Touch Targets) */}
          <div className="flex items-center justify-between gap-3">
            <div
              role="tablist"
              aria-label={
                isAr ? 'مؤشرات شرائح دراسات الحالة' : 'Case study slide indicators'
              }
              className="flex items-center gap-0.5"
            >
              {visibleProjects.map((proj, idx) => {
                const isCurrent = idx === activeSlideIndex;
                const label = isAr ? proj.client : proj.clientEn || proj.client;
                return (
                  <button
                    key={proj.id}
                    type="button"
                    role="tab"
                    aria-selected={isCurrent}
                    aria-label={
                      isAr
                        ? `الانتقال إلى دراسة حالة ${label}`
                        : `Go to ${label} case study`
                    }
                    onClick={() => goToSlide(idx)}
                    className="min-h-[44px] px-1.5 flex items-center justify-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8052ff]/70 rounded-lg"
                  >
                    <span
                      className={`block h-1.5 rounded-full transition-all duration-300 ${
                        isCurrent
                          ? 'w-7 bg-[#8052ff] shadow-[0_0_10px_rgba(128,82,255,0.7)]'
                          : 'w-1.5 bg-[#8052ff]/30 hover:bg-[#8052ff]/60'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Prev / Next Arrows */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => goToSlide(activeSlideIndex - 1)}
                disabled={activeSlideIndex === 0}
                aria-label={isAr ? 'دراسة الحالة السابقة' : 'Previous case study'}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-[#8052ff]/[0.08] hover:bg-[#8052ff]/[0.18] border border-[#8052ff]/35 hover:border-[#8052ff]/70 flex items-center justify-center text-white disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8052ff]/70"
              >
                <ChevronLeft
                  className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`}
                />
              </button>
              <button
                type="button"
                onClick={() => goToSlide(activeSlideIndex + 1)}
                disabled={activeSlideIndex >= visibleProjects.length - 1}
                aria-label={isAr ? 'دراسة الحالة التالية' : 'Next case study'}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-[#8052ff]/[0.08] hover:bg-[#8052ff]/[0.18] border border-[#8052ff]/35 hover:border-[#8052ff]/70 flex items-center justify-center text-white disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8052ff]/70"
              >
                <ChevronRight
                  className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`}
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
