import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  ArrowUpRight,
  Play,
  Pause,
  X,
  CheckCircle2,
  Cpu,
  BarChart3,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { BlurUpImage } from './BlurUpImage';

export interface CardMetric {
  label: string;
  value: string;
  sub?: string;
}

export interface CoverflowCardItem {
  id: string;
  title: string;
  titleEn?: string;
  category?: string;
  categoryEn?: string;
  tag?: string;
  tagEn?: string;
  description?: string;
  image: string;
  badge?: string;
  accentColor?: string;
  // Detailed technical and case study data for 'click-to-expand' interaction
  technicalDetails?: string[];
  deliverables?: string[];
  metricsHighlight?: string;
  caseStudyMetrics?: CardMetric[];
  techStack?: string[];
  caseStudyQuote?: {
    text: string;
    client: string;
  };
}

export interface CoverflowMotionCarouselProps {
  items: CoverflowCardItem[];
  className?: string;
  onCardClick?: (item: CoverflowCardItem, index: number) => void;
  onActiveChange?: (index: number, item: CoverflowCardItem) => void;
  autoPlayInterval?: number; // ms, 0 for off
}

/**
 * CoverflowMotionCarousel:
 * - 3D Coverflow animation matching the provided reference video.
 * - Interactive 'click-to-expand' mode: Clicking the center card opens an in-place cinematic detail modal/overlay
 *   revealing technical details, verified case study metrics, and deliverables, while preserving smooth 3D transforms.
 */
export const CoverflowMotionCarousel: React.FC<CoverflowMotionCarouselProps> = ({
  items,
  className = '',
  onCardClick,
  onActiveChange,
  autoPlayInterval = 4000,
}) => {
  const { isAr, dir } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Drag & Swipe gesture state (mouse and mobile touch)
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartXRef = useRef(0);
  const dragStartYRef = useRef(0);
  const dragStartTimeRef = useRef(0);
  const isPointerDownRef = useRef(false);
  const hasMovedFarRef = useRef(false);
  const isHorizontalDragRef = useRef(false);

  const total = items.length;

  const selectIndex = useCallback(
    (nextIdx: number, notifySeo = true) => {
      setActiveIndex(nextIdx);
      if (notifySeo && items[nextIdx]) {
        onActiveChange?.(nextIdx, items[nextIdx]);
      }
    },
    [items, onActiveChange]
  );

  const nextSlide = useCallback(() => {
    if (isDragging) return;
    setActiveIndex((prev) => {
      const next = (prev + 1) % total;
      if (items[next]) onActiveChange?.(next, items[next]);
      return next;
    });
  }, [isDragging, total, items, onActiveChange]);

  const prevSlide = useCallback(() => {
    if (isDragging) return;
    setActiveIndex((prev) => {
      const next = (prev - 1 + total) % total;
      if (items[next]) onActiveChange?.(next, items[next]);
      return next;
    });
  }, [isDragging, total, items, onActiveChange]);

  // Autoplay handler with pause on hover or dragging
  useEffect(() => {
    if (autoPlayInterval <= 0 || isPaused || isDragging || total <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % total);
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlayInterval, isPaused, isDragging, total]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current) return;
      if (e.key === 'ArrowRight') {
        dir === 'rtl' ? prevSlide() : nextSlide();
      } else if (e.key === 'ArrowLeft') {
        dir === 'rtl' ? nextSlide() : prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dir, nextSlide, prevSlide]);

  // Unified Mouse & Mobile Touch Pointer Drag Event Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    isPointerDownRef.current = true;
    hasMovedFarRef.current = false;
    isHorizontalDragRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartYRef.current = e.clientY;
    dragStartTimeRef.current = performance.now();
    setIsPaused(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;

    const deltaX = e.clientX - dragStartXRef.current;
    const deltaY = e.clientY - dragStartYRef.current;

    if (!hasMovedFarRef.current) {
      if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) {
        hasMovedFarRef.current = true;
        // Determine gesture intent: horizontal dragging vs vertical page scrolling
        if (Math.abs(deltaX) >= Math.abs(deltaY) * 0.75) {
          isHorizontalDragRef.current = true;
          setIsDragging(true);
          try {
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          } catch {}
        } else {
          // Vertical scrolling takes precedence
          isPointerDownRef.current = false;
          return;
        }
      }
    }

    if (isHorizontalDragRef.current) {
      setDragOffset(deltaX);
    }
  };

  const handlePointerUpOrCancel = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current && !isDragging) return;
    isPointerDownRef.current = false;

    try {
      if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      }
    } catch {}

    if (isHorizontalDragRef.current) {
      const deltaX = e.clientX - dragStartXRef.current;
      const elapsed = Math.max(1, performance.now() - dragStartTimeRef.current);
      const velocity = deltaX / elapsed; // px per ms

      const stepPx = typeof window !== 'undefined' && window.innerWidth < 640 ? 140 : 180;
      const threshold = 35;

      // When dragging left (deltaX < 0) -> advance to next card
      // When dragging right (deltaX > 0) -> move back to previous card
      if (deltaX < -threshold || velocity < -0.3) {
        const steps = Math.min(3, Math.max(1, Math.round(-deltaX / stepPx)));
        setActiveIndex((prev) => (prev + steps) % total);
      } else if (deltaX > threshold || velocity > 0.3) {
        const steps = Math.min(3, Math.max(1, Math.round(deltaX / stepPx)));
        setActiveIndex((prev) => (prev - steps + total * 10) % total);
      }
    }

    setDragOffset(0);
    setIsDragging(false);
    isHorizontalDragRef.current = false;
    setTimeout(() => {
      hasMovedFarRef.current = false;
    }, 120);
    setIsPaused(false);
  };

  if (!items || items.length === 0) return null;

  const stepWidth = typeof window !== 'undefined' && window.innerWidth < 640 ? 140 : 180;
  const dragProgress = dragOffset / stepWidth;

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        if (!isDragging) setIsPaused(false);
      }}
      className={`relative w-full max-w-6xl mx-auto flex flex-col items-center select-none ${className}`}
      dir="ltr" // Symmetric 3D math in LTR
    >
      {/* 3D Perspective Stage with Full Touch & Mouse Drag Support */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUpOrCancel}
        onPointerCancel={handlePointerUpOrCancel}
        className={`relative w-full h-[340px] sm:h-[420px] md:h-[460px] lg:h-[490px] flex items-center justify-center overflow-visible touch-pan-y ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{ perspective: 1200 }}
      >
        {items.map((item, idx) => {
          // Circular offset calculation relative to active card
          let offset = idx - activeIndex;
          if (offset > total / 2) offset -= total;
          if (offset < -total / 2) offset += total;

          // Incorporate real-time drag progress
          const effectiveOffset = offset + dragProgress;
          const isCenter = Math.abs(effectiveOffset) < 0.45;
          const absOffset = Math.abs(effectiveOffset);

          // Render only within visible radius
          const isVisible = absOffset <= 3.2;
          if (!isVisible) return null;

          // 3D Coverflow positioning parameters
          const xOffset = effectiveOffset * stepWidth;
          const rotateY = Math.max(-50, Math.min(50, -effectiveOffset * 38));
          const scale = isCenter ? 1.08 : Math.max(0.66, 1 - absOffset * 0.16);
          const translateZ = isCenter ? 120 : -absOffset * 100;
          const opacity = isCenter ? 1 : Math.max(0.28, 1 - absOffset * 0.28);
          const zIndex = Math.round(50 - absOffset * 10);

          return (
            <motion.div
              key={item.id}
              data-arm-id={idx + 1}
              data-arm-title={item.titleEn || item.title}
              onClick={() => {
                // If user dragged, ignore click
                if (hasMovedFarRef.current || isDragging) return;

                if (isCenter) {
                  selectIndex(idx);
                  onCardClick?.(item, idx);
                } else {
                  selectIndex(idx);
                }
              }}
              initial={false}
              animate={{
                x: xOffset,
                rotateY,
                scale,
                z: translateZ,
                opacity,
              }}
              transition={
                isDragging
                  ? { duration: 0 }
                  : {
                      type: 'spring',
                      stiffness: 280,
                      damping: 28,
                      mass: 0.8,
                    }
              }
              style={{
                position: 'absolute',
                zIndex,
                transformStyle: 'preserve-3d',
                cursor: isDragging ? 'grabbing' : 'pointer',
              }}
              whileHover={
                isCenter
                  ? {
                      scale: 1.12,
                      y: -8,
                      transition: { duration: 0.25 },
                    }
                  : {
                      opacity: 0.9,
                      scale: scale + 0.04,
                      transition: { duration: 0.2 },
                    }
              }
              className="w-[240px] sm:w-[290px] md:w-[330px] lg:w-[360px] aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-b from-[#140f29] via-[#0d091a] to-[#06040c] border border-purple-800/40 hover:border-purple-400/80 shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(138,43,226,0.3)] backdrop-blur-xl group transition-colors duration-300 will-change-transform"
            >
              {/* Image Container with Ambient Reflection and Depth Glow */}
              <div className="relative w-full h-[60%] sm:h-[63%] overflow-hidden bg-purple-950/40">
                <BlurUpImage
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108 group-hover:filter brightness-105"
                />

                {/* Dark Vignette Overlay for Contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d091a] via-[#0d091a]/30 to-transparent pointer-events-none z-10" />

                {/* Top Corner Pill Badge - Clean Tag without any numbers */}
                {item.tag && (
                  <div className="absolute top-3 end-3 pointer-events-none z-10">
                    <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-sans font-medium bg-black/60 border border-purple-500/40 text-purple-200 backdrop-blur-md">
                      {item.tag}
                    </span>
                  </div>
                )}
              </div>

              {/* Card Meta & Typography */}
              <div
                className="relative p-4 sm:p-5 flex flex-col justify-between h-[40%] sm:h-[37%] text-left"
                dir={isAr ? 'rtl' : 'ltr'}
              >
                <div>
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-white group-hover:text-purple-200 transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-slate-300/80 mt-1 line-clamp-2 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Bottom Interactive Row */}
                <div className="flex items-center justify-between pt-2 border-t border-purple-900/30">
                  <span className="text-[11px] font-mono text-purple-400/80 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    <span>PULSE OCTO</span>
                  </span>

                  <div className="flex items-center gap-1 text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                    <span>{isAr ? 'عرض المنظومة' : 'View Scope'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-purple-400 group-hover:text-purple-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </div>

              {/* Bottom Mirror Reflection Highlight */}
              <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#8A2BE2] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          );
        })}
      </div>

      {/* Floating Bottom Navigation Controls & Pagination Dots */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 z-20">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={prevSlide}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-black/50 hover:bg-[#150f2e] border border-white/[0.08] hover:border-purple-500/40 text-white transition-all shadow-sm active:scale-90 cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 border border-white/[0.06] backdrop-blur-md">
            {items.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => selectIndex(dotIdx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  activeIndex === dotIdx
                    ? 'w-6 h-1.5 bg-purple-500'
                    : 'w-2 h-1.5 bg-zinc-700 hover:bg-zinc-500'
                }`}
                aria-label={`Go to slide ${dotIdx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={nextSlide}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-black/50 hover:bg-[#150f2e] border border-white/[0.08] hover:border-purple-500/40 text-white transition-all shadow-sm active:scale-90 cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsPaused(!isPaused)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-[11px] font-mono text-purple-200 transition-colors cursor-pointer"
        >
          {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3 text-purple-300" />}
          <span>{isPaused ? (isAr ? 'تشغيل تلقائي' : 'Auto Play') : isAr ? 'إيقاف مؤقت' : 'Pause'}</span>
        </button>
      </div>
    </div>
  );
};
