import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ArrowDown,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { CoverflowCardItem } from './CoverflowMotionCarousel';
import { useLanguage } from '../context/LanguageContext';
import { BlurUpImage } from './BlurUpImage';

export interface AppleServicePreviewModalProps {
  isOpen: boolean;
  item: CoverflowCardItem | null;
  itemIndex: number;
  totalItems?: number;
  onClose: () => void;
  onExploreInAccordion: (item: CoverflowCardItem, index: number) => void;
  onOpenFullServicePage: (item: CoverflowCardItem, index: number) => void;
  onNavigatePrev?: () => void;
  onNavigateNext?: () => void;
}

export const AppleServicePreviewModal: React.FC<AppleServicePreviewModalProps> = ({
  isOpen,
  item,
  itemIndex,
  totalItems = 8,
  onClose,
  onExploreInAccordion,
  onOpenFullServicePage,
  onNavigatePrev,
  onNavigateNext,
}) => {
  const { isAr, dir } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Lock body scroll while modal is active
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        if (dir === 'rtl') onNavigatePrev?.();
        else onNavigateNext?.();
      } else if (e.key === 'ArrowLeft') {
        if (dir === 'rtl') onNavigateNext?.();
        else onNavigatePrev?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onNavigatePrev, onNavigateNext, dir]);

  if (!isMounted || !isOpen || !item) return null;

  const modalContent = (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 md:p-8 overflow-y-auto overscroll-contain select-none"
        style={{ perspective: 1200 }}
      >
        {/* Apple-style Ultra-Frosted Translucent Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={onClose}
          className="fixed inset-0 bg-[#03010a]/70 backdrop-blur-2xl transition-all duration-300"
        />

        {/* Apple Liquid Glass Floating Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24, rotateX: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16, rotateX: -4 }}
          transition={{
            type: 'spring',
            stiffness: 340,
            damping: 28,
            mass: 0.85,
          }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-[28px] sm:rounded-[34px] overflow-hidden bg-gradient-to-b from-[#120d2c]/85 via-[#0a071b]/80 to-[#05030e]/90 border border-white/[0.18] shadow-[0_30px_90px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.35),0_0_40px_rgba(138,43,226,0.22)] backdrop-blur-3xl text-white my-auto z-10"
          dir={dir}
        >
          {/* 1. Specular Glass Surface Sheen Stripe */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/[0.04] via-transparent to-transparent z-0" />
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent z-20 pointer-events-none" />

          {/* 2. Top Window Controls Bar (macOS / Apple Style) */}
          <div className="relative z-20 flex items-center justify-between px-5 sm:px-7 py-4 border-b border-white/[0.08] bg-white/[0.02]">
            {/* Left: Apple Window Dots & Arm Badge */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-3.5 h-3.5 rounded-full bg-[#ff5f57] hover:brightness-110 transition-all flex items-center justify-center group cursor-pointer"
                  title={isAr ? 'إغلاق' : 'Close'}
                  aria-label="Close"
                >
                  <X className="w-2 h-2 text-black/70 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <span className="w-3.5 h-3.5 rounded-full bg-[#febc2e]/70" />
                <span className="w-3.5 h-3.5 rounded-full bg-[#28c840]/70" />
              </div>

              <span className="h-4 w-px bg-white/10 mx-1" />

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-purple-500/20 text-purple-200 border border-purple-400/30">
                  {item.badge ? `ARM 0${parseInt(item.badge, 10)}` : `ARM 0${itemIndex + 1}`}
                </span>
                {item.tag && (
                  <span className="text-xs text-zinc-400 font-mono hidden sm:inline-block">
                    // {item.tag}
                  </span>
                )}
              </div>
            </div>

            {/* Right: Close Pill & Prev/Next Arrows */}
            <div className="flex items-center gap-2">
              {onNavigatePrev && onNavigateNext && (
                <div className="flex items-center gap-1 bg-white/[0.04] p-0.5 rounded-lg border border-white/[0.08]">
                  <button
                    type="button"
                    onClick={onNavigatePrev}
                    className="p-1 rounded hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    title={isAr ? 'الخدمة السابقة' : 'Previous Service'}
                  >
                    <ChevronRight className={`w-4 h-4 ${dir === 'rtl' ? '' : 'rotate-180'}`} />
                  </button>
                  <span className="text-[10px] font-mono px-1 text-zinc-400">
                    {itemIndex + 1} / {totalItems}
                  </span>
                  <button
                    type="button"
                    onClick={onNavigateNext}
                    className="p-1 rounded hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    title={isAr ? 'الخدمة التالية' : 'Next Service'}
                  >
                    <ChevronLeft className={`w-4 h-4 ${dir === 'rtl' ? '' : 'rotate-180'}`} />
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={onClose}
                className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-purple-400/40 text-zinc-300 hover:text-white transition-all cursor-pointer active:scale-95 shadow-sm"
                aria-label={isAr ? 'إغلاق' : 'Close'}
                title={isAr ? 'إغلاق (Esc)' : 'Close (Esc)'}
              >
                <X className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-300 text-zinc-300 group-hover:text-white" />
                <span className="text-xs font-medium">{isAr ? 'إغلاق' : 'Close'}</span>
              </button>
            </div>
          </div>

          {/* 3. Main Body Content (Two-Column Layout) */}
          <div className="relative z-10 flex-1 overflow-y-auto p-5 sm:p-7 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
              {/* Column 1: Cinematic Visual Asset Preview */}
              <div className="md:col-span-5 relative">
                <div className="group/preview relative aspect-[4/5] sm:aspect-square md:aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/20 shadow-[0_15px_40px_rgba(0,0,0,0.7),0_0_25px_rgba(138,43,226,0.3)] bg-purple-950/30">
                  <BlurUpImage
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover transition-transform duration-700 group-hover/preview:scale-106"
                  />
                  {/* Subtle Gradient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080515]/90 via-transparent to-transparent pointer-events-none z-10" />

                  {/* Corner Brand Watermark */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-black/70 backdrop-blur-md text-cyan-300 border border-white/10">
                      PULSE OCTO // SYSTEM
                    </span>
                    {item.metricsHighlight && (
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-mono font-semibold bg-purple-950/80 backdrop-blur-md text-purple-200 border border-purple-500/30">
                        {item.metricsHighlight}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Column 2: Editorial Details & Strategic Overview */}
              <div className="md:col-span-7 flex flex-col justify-center">
                {/* Category & English Identifier */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                    {item.category || item.tag}
                  </span>
                  {item.titleEn && (
                    <>
                      <span className="text-zinc-600 font-mono">/</span>
                      <span className="text-xs font-mono text-purple-300" dir="ltr">
                        {item.titleEn}
                      </span>
                    </>
                  )}
                </div>

                {/* Editorial Headline */}
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-3 tracking-tight">
                  {item.title}
                </h3>

                {/* Narrative Summary */}
                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-5 font-normal">
                  {item.description}
                </p>

                {/* Key Deliverables & Highlights Grid */}
                {item.technicalDetails && item.technicalDetails.length > 0 && (
                  <div className="mb-6 space-y-2">
                    <span className="text-[11px] font-mono font-semibold text-purple-300/80 block uppercase tracking-wider">
                      {isAr ? 'أبرز مخرجات هذه الخدمة:' : 'Core Deliverables:'}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {item.technicalDetails.slice(0, 4).map((tech, tIdx) => (
                        <div
                          key={tIdx}
                          className="flex items-start gap-2 p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-zinc-200"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{tech}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metrics Highlight Strip */}
                {item.caseStudyMetrics && item.caseStudyMetrics.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                    {item.caseStudyMetrics.slice(0, 4).map((m, mIdx) => (
                      <div key={mIdx} className="text-center">
                        <span className="text-[10px] text-zinc-400 block line-clamp-1">{m.label}</span>
                        <span className="text-base font-bold font-mono text-cyan-300" dir="ltr">
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4. Action Bar (Interactive Buttons) */}
          <div className="relative z-20 px-5 sm:px-7 py-4 border-t border-white/[0.08] bg-black/40 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Hint text */}
            <span className="text-xs text-zinc-400 font-mono flex items-center gap-1.5 text-center sm:text-start">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span>
                {isAr
                  ? 'اختر استكشاف الخدمة بالأكورديون أو فتح الصفحة الكاملة'
                  : 'Explore in accordion or open full service page'}
              </span>
            </span>

            {/* Interactive Action Buttons */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              {/* Secondary CTA: Full Dedicated Service Page */}
              <button
                type="button"
                onClick={() => onOpenFullServicePage(item, itemIndex)}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.12] hover:border-purple-400/50 text-zinc-200 hover:text-white text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-sm"
              >
                <span>{isAr ? 'صفحة الخدمة الكاملة' : 'Full Service Page'}</span>
                <ArrowUpRight className="w-4 h-4 text-cyan-300" />
              </button>

              {/* Primary Interactive CTA: Explore in Accordion (يرجع الكارت مكانه ويظهر الخدمات بالتدريج) */}
              <button
                type="button"
                onClick={() => onExploreInAccordion(item, itemIndex)}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7a38e8] via-[#8846f5] to-[#5e22c0] hover:from-[#8846f5] hover:to-[#6a2ad0] text-white text-xs sm:text-sm font-bold shadow-[0_4px_20px_rgba(122,56,232,0.45)] hover:shadow-[0_6px_25px_rgba(122,56,232,0.65)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isAr ? 'استكشف الخدمة في المنظومة' : 'Explore in System'}</span>
                <ArrowDown className="w-4 h-4 animate-bounce" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};
