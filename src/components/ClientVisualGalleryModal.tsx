import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ProjectItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useProjects } from '../context/ProjectsContext';
import { getOptimizedImageProps } from '../utils/imageOptimizer';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Film,
  Sparkles,
  ExternalLink,
  Layers,
  ArrowRight,
  Play,
  Image as ImageIcon
} from 'lucide-react';

export type ClientGalleryAssetCategory = 'all' | 'brand' | 'poster' | 'storefront' | 'video';

export interface ClientGalleryMediaItem {
  id: string;
  url: string;
  title: string;
  description: string;
  category: Exclude<ClientGalleryAssetCategory, 'all'>;
  categoryLabel: string;
  isVideo: boolean;
}

interface ClientVisualGalleryModalProps {
  project: ProjectItem | null;
  initialAssetUrl?: string;
  onClose: () => void;
  onOpenFullCaseStudy?: (project: ProjectItem) => void;
  onOpenConsultation?: () => void;
}

const cleanText = (text: string): string => {
  return (text || '')
    .replace(/\s*\([a-zA-Z0-9_\-. ]+\.(png|jpe?g|webp|svg|mp4)\)/gi, '')
    .replace(
      /\s*\((?:h-logo|h-poster|h-cover|n-logo|n-paner|n-poster|ZS\d|ZP\s*\d|ZCover|Logo L|L\d(?:,\s*L\d)*|a\d(?:,\s*a\d)*|a1\s*[-–to ]+\s*a11)\)/gi,
      ''
    )
    .trim();
};

export const ClientVisualGalleryModal: React.FC<ClientVisualGalleryModalProps> = ({
  project: initialProject,
  initialAssetUrl,
  onClose,
  onOpenFullCaseStudy,
  onOpenConsultation,
}) => {
  const { lang, isAr, dir } = useLanguage();
  const { getProjects } = useProjects();
  const allProjects = useMemo(() => getProjects(lang), [getProjects, lang]);

  const [activeClientId, setActiveClientId] = useState<string>(
    initialProject?.id || allProjects[0]?.id || ''
  );
  const [selectedCategory, setSelectedCategory] = useState<ClientGalleryAssetCategory>('all');
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [slideDirection, setSlideDirection] = useState<number>(1);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const filmstripRef = useRef<HTMLDivElement>(null);
  const thumbnailRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (initialProject?.id) {
      setActiveClientId(initialProject.id);
    }
  }, [initialProject]);

  const activeProject = useMemo(
    () => allProjects.find((p) => p.id === activeClientId) || initialProject || allProjects[0],
    [allProjects, activeClientId, initialProject]
  );

  // Build normalized media list for the active client
  const clientMediaItems = useMemo<ClientGalleryMediaItem[]>(() => {
    if (!activeProject) return [];
    const items: ClientGalleryMediaItem[] = [];
    const seenUrls = new Set<string>();

    const getCategoryLabel = (cat: Exclude<ClientGalleryAssetCategory, 'all'>) => {
      switch (cat) {
        case 'brand':
          return isAr ? 'الهوية والشعار' : 'Brand Identity';
        case 'storefront':
          return isAr ? 'واجهات المتجر والويب' : 'Web & Storefront';
        case 'video':
          return isAr ? 'إنتاج مرئي وفيديو' : 'Motion & Video';
        case 'poster':
        default:
          return isAr ? 'تصميم إعلاني وسوشيال' : 'Campaign & Social';
      }
    };

    // 1. Curated assetShowcase items
    if (activeProject.assetShowcase && activeProject.assetShowcase.length > 0) {
      activeProject.assetShowcase.forEach((asset, idx) => {
        if (!asset.url || seenUrls.has(asset.url)) return;
        seenUrls.add(asset.url);
        const rawType = asset.type;
        const cat: Exclude<ClientGalleryAssetCategory, 'all'> =
          rawType === 'brand' || rawType === 'cover' || rawType === 'mockup'
            ? 'brand'
            : rawType === 'storefront'
            ? 'storefront'
            : 'poster';

        items.push({
          id: `${activeProject.id}-showcase-${idx}`,
          url: asset.url,
          title: cleanText(isAr ? asset.title : asset.titleEn || asset.title),
          description: cleanText(
            isAr
              ? asset.description || 'أصل بصري معتمد ضمن المنظومة الإبداعية للمشروع.'
              : asset.descriptionEn || asset.description || 'Verified visual deliverable crafted for the brand ecosystem.'
          ),
          category: cat,
          categoryLabel: getCategoryLabel(cat),
          isVideo: /\.(mp4|webm|mov)$/i.test(asset.url),
        });
      });
    }

    // 2. Hero cover if not already included
    if (activeProject.heroImage && !seenUrls.has(activeProject.heroImage)) {
      seenUrls.add(activeProject.heroImage);
      items.push({
        id: `${activeProject.id}-hero`,
        url: activeProject.heroImage,
        title: cleanText(
          isAr ? `الواجهة الرئيسية — ${activeProject.title}` : `Key Visual — ${activeProject.title}`
        ),
        description: cleanText(activeProject.summary),
        category: 'brand',
        categoryLabel: getCategoryLabel('brand'),
        isVideo: false,
      });
    }

    // 3. Additional gallery images
    if (activeProject.gallery && activeProject.gallery.length > 0) {
      activeProject.gallery.forEach((url, idx) => {
        if (!url || seenUrls.has(url)) return;
        seenUrls.add(url);
        const lower = url.toLowerCase();
        const cat: Exclude<ClientGalleryAssetCategory, 'all'> =
          lower.includes('logo') || lower.includes('cover')
            ? 'brand'
            : lower.includes('lw') || lower.includes('zs') || lower.includes('web')
            ? 'storefront'
            : 'poster';

        items.push({
          id: `${activeProject.id}-gallery-${idx}`,
          url,
          title: cleanText(
            isAr
              ? `${activeProject.client} — تصميم ${idx + 1}`
              : `${activeProject.client} — Creative Asset ${idx + 1}`
          ),
          description: isAr
            ? `أحد التصميمات المعتمدة ضمن دراسة حالة ${activeProject.client}.`
            : `Approved visual asset from the ${activeProject.client} case study.`,
          category: cat,
          categoryLabel: getCategoryLabel(cat),
          isVideo: /\.(mp4|webm|mov)$/i.test(url),
        });
      });
    }

    // 4. Campaign videos if available
    if (activeProject.videos && activeProject.videos.length > 0) {
      activeProject.videos.forEach((v, idx) => {
        if (!v.url || seenUrls.has(v.url)) return;
        seenUrls.add(v.url);
        items.push({
          id: `${activeProject.id}-video-${idx}`,
          url: v.url,
          title: cleanText(isAr ? v.title : v.titleEn || v.title),
          description: cleanText(
            isAr
              ? v.description || 'إنتاج فيديو إعلاني خاص بالحملة التسويقية.'
              : v.descriptionEn || v.description || 'Campaign motion & commercial video production.'
          ),
          category: 'video',
          categoryLabel: getCategoryLabel('video'),
          isVideo: true,
        });
      });
    }

    return items;
  }, [activeProject, isAr]);

  // Jump to initialAssetUrl when opened from a specific image
  useEffect(() => {
    if (!initialAssetUrl) return;
    const foundIdx = clientMediaItems.findIndex((item) => item.url === initialAssetUrl);
    if (foundIdx >= 0) {
      setSelectedCategory('all');
      setActiveSlideIndex(foundIdx);
    }
  }, [initialAssetUrl, clientMediaItems]);

  const filteredItems = useMemo(() => {
    if (selectedCategory === 'all') return clientMediaItems;
    return clientMediaItems.filter((item) => item.category === selectedCategory);
  }, [clientMediaItems, selectedCategory]);

  // Available category tabs with counts
  const categoryTabs = useMemo(() => {
    const counts: Record<ClientGalleryAssetCategory, number> = {
      all: clientMediaItems.length,
      brand: clientMediaItems.filter((i) => i.category === 'brand').length,
      poster: clientMediaItems.filter((i) => i.category === 'poster').length,
      storefront: clientMediaItems.filter((i) => i.category === 'storefront').length,
      video: clientMediaItems.filter((i) => i.category === 'video').length,
    };

    const allTabs: { id: ClientGalleryAssetCategory; label: string; count: number }[] = [
      { id: 'all', label: isAr ? 'كل التصميمات' : 'All Works', count: counts.all },
      { id: 'brand', label: isAr ? 'الهوية والشعار' : 'Brand Identity', count: counts.brand },
      { id: 'poster', label: isAr ? 'البوسترات والحملات' : 'Social & Posters', count: counts.poster },
      { id: 'storefront', label: isAr ? 'واجهات المتجر' : 'Web & Storefront', count: counts.storefront },
      { id: 'video', label: isAr ? 'الفيديو والإعلانات' : 'Video Reels', count: counts.video },
    ];

    return allTabs.filter((tab) => tab.id === 'all' || tab.count > 0);
  }, [clientMediaItems, isAr]);

  const safeSlideIndex =
    filteredItems.length > 0
      ? Math.min(activeSlideIndex, Math.max(0, filteredItems.length - 1))
      : 0;
  const activeItem = filteredItems[safeSlideIndex] || null;

  // Auto-scroll active thumbnail into center of bottom filmstrip
  useEffect(() => {
    const btn = thumbnailRefs.current[safeSlideIndex];
    if (btn) {
      btn.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [safeSlideIndex, activeClientId, selectedCategory]);

  // Lock background scroll
  useEffect(() => {
    if (!initialProject) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [initialProject]);

  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 260);
  }, [isClosing, onClose]);

  const handleSelectClient = useCallback((clientId: string) => {
    setActiveClientId(clientId);
    setSelectedCategory('all');
    setActiveSlideIndex(0);
    setZoomScale(1);
  }, []);

  const handleSelectCategory = useCallback((cat: ClientGalleryAssetCategory) => {
    setSelectedCategory(cat);
    setActiveSlideIndex(0);
    setZoomScale(1);
  }, []);

  const handleNextSlide = useCallback(() => {
    if (filteredItems.length <= 1) return;
    setSlideDirection(1);
    setZoomScale(1);
    setActiveSlideIndex((prev) => (prev + 1) % filteredItems.length);
  }, [filteredItems.length]);

  const handlePrevSlide = useCallback(() => {
    if (filteredItems.length <= 1) return;
    setSlideDirection(-1);
    setZoomScale(1);
    setActiveSlideIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  }, [filteredItems.length]);

  const handleToggleZoom = useCallback(() => {
    setZoomScale((prev) => (prev === 1 ? 1.75 : prev === 1.75 ? 2.5 : 1));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (zoomScale > 1) {
          setZoomScale(1);
        } else {
          handleClose();
        }
      } else if (e.key === 'ArrowRight') {
        if (isAr) handlePrevSlide();
        else handleNextSlide();
      } else if (e.key === 'ArrowLeft') {
        if (isAr) handleNextSlide();
        else handlePrevSlide();
      } else if (e.key === '+' || e.key === '=') {
        setZoomScale((prev) => Math.min(2.5, Number((prev + 0.5).toFixed(2))));
      } else if (e.key === '-' || e.key === '_') {
        setZoomScale((prev) => Math.max(1, Number((prev - 0.5).toFixed(2))));
      } else if (e.key === '0') {
        setZoomScale(1);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [zoomScale, isAr, handleClose, handleNextSlide, handlePrevSlide]);

  if (!isMounted || !initialProject || !activeProject || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <motion.div
      initial={{ opacity: 0, scale: 0.92, filter: 'blur(16px)', y: 20 }}
      animate={
        isClosing
          ? { opacity: 0, scale: 0.94, filter: 'blur(14px)', y: 16 }
          : { opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }
      }
      exit={{ opacity: 0, scale: 0.94, filter: 'blur(14px)', y: 16 }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[1050] bg-[#040309]/98 backdrop-blur-2xl text-white flex flex-col justify-between select-none overflow-hidden will-change-[transform,opacity,filter]"
      dir={dir}
      role="dialog"
      aria-modal="true"
      aria-label={
        isAr
          ? `معرض التصميمات المستقل — ${activeProject.client}`
          : `Standalone Visual Gallery — ${activeProject.client}`
      }
    >
      {/* Ambient Subtle Violet Studio Glow */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[620px] h-[260px] bg-purple-700/15 rounded-full blur-[150px] pointer-events-none" />

      {/* =====================================================================
          1. TOP HEADER BAR: Client Switcher + Asset Category Filters + Actions
         ===================================================================== */}
      <header className="relative z-30 w-full bg-[#070510]/90 border-b border-white/10 px-3 sm:px-6 py-3 flex flex-col gap-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.65)]">
        {/* Top Row: Active Client Identity, Client Switcher Strip & Close */}
        <div className="flex items-center justify-between gap-3">
          {/* Active Client Lockup */}
          <div className="flex items-center gap-3 min-w-0">
            {activeProject.logo ? (
              <div className="w-9 h-9 rounded-xl bg-white/95 p-1 border border-white/20 flex items-center justify-center shrink-0 shadow-md">
                {(() => {
                  const logoOpt = getOptimizedImageProps(activeProject.logo, { isLogo: true });
                  return (
                    <img
                      src={logoOpt.src}
                      srcSet={logoOpt.srcSet}
                      sizes={logoOpt.sizes}
                      alt={isAr ? `شعار ${activeProject.client}` : `${activeProject.client} logo`}
                      width={36}
                      height={36}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  );
                })()}
              </div>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
                <Layers className="w-4 h-4" />
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-semibold text-purple-300 truncate">
                  {isAr ? 'معرض أعمال العميل' : 'Client Lookbook'}
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums text-cyan-300 font-bold">
                  {String(safeSlideIndex + 1).padStart(2, '0')} / {String(filteredItems.length).padStart(2, '0')}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-black text-white truncate">
                {activeProject.title}
              </h2>
            </div>
          </div>

          {/* Client Switcher Bar (Desktop Center) */}
          <div className="hidden lg:flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.03] border border-white/[0.08] overflow-x-auto max-w-xl">
            {allProjects.map((proj) => {
              const isCurrentClient = proj.id === activeProject.id;
              return (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => handleSelectClient(proj.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    isCurrentClient
                      ? 'bg-[#7c3aed] text-white shadow-[0_2px_12px_rgba(124,58,237,0.45)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  <span>{proj.client}</span>
                </button>
              );
            })}
          </div>

          {/* Right Controls: Full Case Study + Zoom + Close */}
          <div className="flex items-center gap-2 shrink-0">
            {activeItem && !activeItem.isVideo && (
              <button
                type="button"
                onClick={handleToggleZoom}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-mono font-bold text-slate-200 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                title={isAr ? 'تكبير / تصغير (+ / -)' : 'Toggle Zoom (+ / -)'}
              >
                {zoomScale > 1 ? <ZoomOut className="w-3.5 h-3.5 text-cyan-400" /> : <ZoomIn className="w-3.5 h-3.5 text-purple-300" />}
                <span className="tabular-nums">{zoomScale}x</span>
              </button>
            )}

            {onOpenFullCaseStudy && (
              <button
                type="button"
                onClick={() => {
                  const target = activeProject;
                  handleClose();
                  setTimeout(() => {
                    onOpenFullCaseStudy(target);
                  }, 270);
                }}
                className="px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 text-xs font-bold text-purple-200 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>{isAr ? 'دراسة الحالة الكاملة' : 'Full Case Study'}</span>
                <ExternalLink className="w-3.5 h-3.5 text-purple-300" />
              </button>
            )}

            <button
              type="button"
              onClick={handleClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-rose-950/70 border border-white/15 hover:border-rose-500/40 text-xs font-bold text-white transition-all cursor-pointer active:scale-95 whitespace-nowrap shrink-0"
              aria-label={isAr ? 'إغلاق المعرض' : 'Close Gallery'}
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">{isAr ? 'إغلاق' : 'Close'}</span>
            </button>
          </div>
        </div>

        {/* Second Row: Mobile Client Switcher + Asset Category Segmented Controls */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pt-1 border-t border-white/[0.06]">
          {/* Asset Type Filter Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {categoryTabs.map((tab) => {
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleSelectCategory(tab.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white/15 text-white border border-purple-400/50 shadow-sm'
                      : 'text-slate-400 hover:text-white bg-white/[0.02] hover:bg-white/[0.06] border border-transparent'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="text-[11px] font-mono tabular-nums text-purple-300">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Mobile Client Selector Pills */}
          <div className="flex lg:hidden items-center gap-1 shrink-0 ps-2 border-s border-white/10">
            {allProjects.map((proj) => {
              const isCurrent = proj.id === activeProject.id;
              return (
                <button
                  key={proj.id}
                  type="button"
                  onClick={() => handleSelectClient(proj.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap shrink-0 cursor-pointer ${
                    isCurrent
                      ? 'bg-[#7c3aed] text-white'
                      : 'bg-white/[0.03] text-slate-400 hover:text-white'
                  }`}
                >
                  {proj.client}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* =====================================================================
          2. MAIN STAGE VIEWER (Large Focal Canvas + Arrows + Caption Bar)
         ===================================================================== */}
      <div
        className="relative flex-1 w-full flex flex-col items-center justify-center px-3 sm:px-12 py-3 overflow-hidden"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const deltaX = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
          touchStartX.current = null;
          if (Math.abs(deltaX) > 45) {
            if (deltaX > 0) {
              if (isAr) handleNextSlide();
              else handlePrevSlide();
            } else {
              if (isAr) handlePrevSlide();
              else handleNextSlide();
            }
          }
        }}
      >
        {/* Previous Slide Button */}
        {filteredItems.length > 1 && (
          <button
            type="button"
            onClick={dir === 'rtl' ? handleNextSlide : handlePrevSlide}
            className={`absolute ${
              dir === 'rtl' ? 'right-2 sm:right-5' : 'left-2 sm:left-5'
            } top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#0b0818]/90 hover:bg-[#7c3aed] border border-white/15 hover:border-purple-300 text-white flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.85)] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer`}
            aria-label={isAr ? 'التصميم السابق' : 'Previous Asset'}
          >
            {dir === 'rtl' ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        )}

        {/* Next Slide Button */}
        {filteredItems.length > 1 && (
          <button
            type="button"
            onClick={dir === 'rtl' ? handlePrevSlide : handleNextSlide}
            className={`absolute ${
              dir === 'rtl' ? 'left-2 sm:left-5' : 'right-2 sm:right-5'
            } top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#0b0818]/90 hover:bg-[#7c3aed] border border-white/15 hover:border-purple-300 text-white flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.85)] transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer`}
            aria-label={isAr ? 'التصميم التالي' : 'Next Asset'}
          >
            {dir === 'rtl' ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
        )}

        {/* Active Stage Frame */}
        <div className="relative w-full max-w-5xl flex-1 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            {activeItem ? (
              <motion.div
                key={activeItem.id}
                initial={{
                  opacity: 0,
                  scale: 0.94,
                  x: slideDirection * (dir === 'rtl' ? -36 : 36),
                  rotateY: slideDirection * -4,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: 0,
                  rotateY: 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                  x: slideDirection * (dir === 'rtl' ? 36 : -36),
                }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformPerspective: 1200 }}
                className="relative w-full h-full flex items-center justify-center"
              >
                {activeItem.isVideo ? (
                  <div className="relative max-w-full max-h-[56vh] sm:max-h-[60vh] rounded-2xl overflow-hidden border border-white/15 bg-black shadow-[0_24px_70px_rgba(0,0,0,0.95)]">
                    <video
                      src={activeItem.url}
                      controls
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="max-w-full max-h-[56vh] sm:max-h-[60vh] object-contain"
                    />
                  </div>
                ) : imageErrorMap[activeItem.id] ? (
                  <div className="w-full max-w-lg h-64 rounded-2xl bg-[#0c0918] border border-white/10 flex flex-col items-center justify-center gap-3 p-6 text-center">
                    <ImageIcon className="w-10 h-10 text-purple-400" />
                    <p className="text-sm font-bold text-white">{activeItem.title}</p>
                    <p className="text-xs text-slate-400">{activeItem.description}</p>
                  </div>
                ) : (
                  <div
                    onClick={handleToggleZoom}
                    className={`relative max-w-full max-h-[56vh] sm:max-h-[60vh] rounded-2xl overflow-auto border border-white/12 bg-[#070510] shadow-[0_24px_70px_rgba(0,0,0,0.95)] transition-transform duration-300 ${
                      zoomScale > 1 ? 'cursor-zoom-out' : 'cursor-zoom-in'
                    }`}
                  >
                    {(() => {
                      const stageOpt = getOptimizedImageProps(activeItem.url);
                      return (
                        <img
                          src={stageOpt.src}
                          srcSet={stageOpt.srcSet}
                          sizes="(max-width: 1024px) 100vw, 80vw"
                          alt={`${activeProject.client} — ${activeItem.categoryLabel}`}
                          width={1200}
                          height={800}
                          decoding="async"
                          referrerPolicy="no-referrer"
                          onError={() =>
                            setImageErrorMap((prev) => ({ ...prev, [activeItem.id]: true }))
                          }
                          style={{
                            transform: `scale(${zoomScale})`,
                            transformOrigin: 'center center',
                          }}
                          className="max-w-full max-h-[56vh] sm:max-h-[60vh] w-auto h-auto object-contain transition-transform duration-300 ease-out"
                        />
                      );
                    })()}
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="w-full max-w-xl rounded-3xl bg-gradient-to-b from-[#14100c] to-[#080706] border border-[#D6B88D]/30 p-8 sm:p-10 text-center space-y-4 shadow-2xl">
                <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-[#D6B88D]">
                  {activeProject.originBadge || (isAr ? 'براند قيد التأسيس' : 'BRAND IN CREATION')}
                </span>
                <h3 className="text-3xl font-black text-[#F3ECE2]">{activeProject.client}</h3>
                <p className="text-sm text-zinc-300 leading-relaxed">{activeProject.summary}</p>
                {onOpenFullCaseStudy && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        const target = activeProject;
                        handleClose();
                        setTimeout(() => onOpenFullCaseStudy(target), 270);
                      }}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D6B88D] hover:bg-[#e5cba5] text-black font-bold text-xs transition-all cursor-pointer"
                    >
                      <span>{isAr ? 'فتح ملف العلامة الكامل' : 'Open Full Brand Showcase'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Stage Caption & Context Bar (Clean Unboxed Metadata with · Separators — No Image Filenames/Titles) */}
        {activeItem && (
          <div className="w-full max-w-4xl mt-2.5 px-4 py-2.5 rounded-2xl bg-[#090714]/90 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
                <span className="text-white font-bold">{activeProject.client}</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#bdbdbd]">{activeItem.categoryLabel}</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#bdbdbd]">{activeProject.category}</span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-300 line-clamp-1 mt-1">
                {activeItem.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              {zoomScale > 1 && (
                <button
                  type="button"
                  onClick={() => setZoomScale(1)}
                  className="px-2.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs text-slate-200 flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{isAr ? 'إعادة الضبط' : 'Reset Zoom'}</span>
                </button>
              )}

              {onOpenConsultation && (
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    setTimeout(() => {
                      onOpenConsultation();
                    }, 270);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>{isAr ? 'ابدأ نبض مشروعك' : 'Start Your Pulse'}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* =====================================================================
          3. SYNCHRONIZED BOTTOM FILMSTRIP DECK
         ===================================================================== */}
      <footer className="relative z-30 w-full bg-[#070510]/95 border-t border-white/10 px-3 sm:px-6 py-2.5">
        <div
          ref={filmstripRef}
          className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1 max-w-6xl mx-auto"
        >
          {filteredItems.map((item, idx) => {
            const isSelected = idx === safeSlideIndex;
            return (
              <button
                key={item.id}
                ref={(el) => {
                  thumbnailRefs.current[idx] = el;
                }}
                type="button"
                onClick={() => {
                  setSlideDirection(idx > safeSlideIndex ? 1 : -1);
                  setZoomScale(1);
                  setActiveSlideIndex(idx);
                }}
                className={`group relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden shrink-0 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-[#8A2BE2] scale-105 opacity-100 shadow-[0_0_20px_rgba(138,43,226,0.5)]'
                    : 'opacity-50 hover:opacity-85 border border-white/10'
                }`}
                aria-label={`${activeProject.client} ${idx + 1}`}
              >
                {item.isVideo ? (
                  <div className="w-full h-full bg-[#120b29] flex flex-col items-center justify-center gap-1 text-purple-300">
                    <Play className="w-4 h-4 fill-current" />
                    <span className="text-[9px] font-mono uppercase">Video</span>
                  </div>
                ) : (
                  <img
                    src={getOptimizedImageProps(item.url, { isLogo: true }).src}
                    alt={
                      isAr
                        ? `صورة مصغرة ${idx + 1} — ${activeProject.client}`
                        : `${activeProject.client} thumbnail ${idx + 1}`
                    }
                    width={96}
                    height={64}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                )}

                {/* Index Counter Overlay */}
                <span className="absolute bottom-1 right-1 px-1.5 py-0.2 rounded bg-black/75 text-[9px] font-mono tabular-nums font-bold text-white">
                  {String(idx + 1).padStart(2, '0')}
                </span>
              </button>
            );
          })}
        </div>
      </footer>
    </motion.div>,
    document.body
  );
};
