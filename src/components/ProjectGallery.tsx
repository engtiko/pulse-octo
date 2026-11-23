import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ProjectItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { getOptimizedImageProps } from '../utils/imageOptimizer';
import {
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  ChevronLeft,
  ChevronRight,
  Palette,
  Camera,
  Sparkles,
  Heart,
  MessageCircle,
  Send,
  ExternalLink,
  Bookmark,
  FileText,
  Download,
  Eye,
  Layers,
  Sparkles as BrandSparkles,
  ImagePlus,
} from 'lucide-react';

export interface ProjectGalleryAsset {
  url: string;
  title: string;
  titleEn?: string;
  type: 'cover' | 'storefront' | 'poster' | 'brand' | 'mockup' | 'lookbook';
  description: string;
  descriptionEn?: string;
  postUrl?: string;
  platform?: 'Facebook' | 'Instagram' | 'TikTok';
  collectionTag?: string;
  collectionTagEn?: string;
}

interface LightboxItem {
  url: string;
  caption: string;
  categoryLabel: string;
}

interface ProjectGalleryProps {
  project: ProjectItem;
  brandVisuals: ProjectGalleryAsset[];
  studioProductVisuals: ProjectGalleryAsset[];
  mockupVisuals?: ProjectGalleryAsset[];
  lookbookVisuals?: ProjectGalleryAsset[];
  socialPosters: ProjectGalleryAsset[];
  extraLightboxItems?: { url: string; caption: string }[];
  externalActiveUrl?: string | null;
  onClearExternalActiveUrl?: () => void;
}

const INITIAL_LOOKBOOK_VISIBLE = 12;

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({
  project,
  brandVisuals,
  studioProductVisuals,
  mockupVisuals = [],
  lookbookVisuals = [],
  socialPosters,
  extraLightboxItems = [],
  externalActiveUrl = null,
  onClearExternalActiveUrl,
}) => {
  const { isAr } = useLanguage();
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreenMode, setIsFullscreenMode] = useState<boolean>(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [showAllLookbook, setShowAllLookbook] = useState<boolean>(false);
  const [showInlinePdfPreview, setShowInlinePdfPreview] = useState<boolean>(false);

  const primaryAccentHex = project.brandColors?.[0]?.hex || (project.id === 'athar' ? '#D6B88D' : '#D4AF37');
  const isZeyad = project.id === 'zeyad-optical';
  const isAthar = project.id === 'athar' || Boolean(project.isBrandInCreation);

  // Reset per-project gallery expansion toggles when switching projects
  useEffect(() => {
    setShowAllLookbook(false);
    setShowInlinePdfPreview(false);
  }, [project.id]);

  // Build unified, strictly deduplicated Lightbox asset list
  const lightboxAssets = useMemo<LightboxItem[]>(() => {
    const list: LightboxItem[] = [];
    const addUnique = (url?: string, caption?: string, categoryLabel?: string) => {
      if (!url || list.some((item) => item.url === url)) return;
      list.push({
        url,
        caption: caption || project.client,
        categoryLabel: categoryLabel || (isAr ? 'الهوية البصرية' : 'Brand Identity'),
      });
    };

    if (project.logo) {
      addUnique(
        project.logo,
        isAr ? `الشعار الرسمي — ${project.client}` : `Official Brandmark — ${project.client}`,
        isAr ? 'الشعار الرسمي' : 'Official Brandmark'
      );
    }

    brandVisuals.forEach((b) =>
      addUnique(
        b.url,
        isAr ? b.title : b.titleEn || b.title,
        isAr ? 'الهوية البصرية' : 'Brand Identity'
      )
    );

    mockupVisuals.forEach((m) =>
      addUnique(
        m.url,
        isAr ? m.title : m.titleEn || m.title,
        isAr ? 'الموك اب الرسمي' : 'Brand Mockup'
      )
    );

    lookbookVisuals.forEach((l, idx) =>
      addUnique(
        l.url,
        isAr
          ? l.title || `${project.client} — قطعة ${idx + 1}`
          : l.titleEn || l.title || `${project.client} — Look ${idx + 1}`,
        isAr ? 'تشكيلة أزياء المحجبات' : 'Modest Fashion Lookbook'
      )
    );

    studioProductVisuals.forEach((s) =>
      addUnique(
        s.url,
        isAr ? s.title : s.titleEn || s.title,
        isAr ? 'تصوير الاستوديو' : 'Studio Photography'
      )
    );

    socialPosters.forEach((p) =>
      addUnique(
        p.url,
        isAr ? p.title : p.titleEn || p.title,
        isAr ? 'منشورات السوشيال ميديا' : 'Social Media Post'
      )
    );

    extraLightboxItems.forEach((extra) =>
      addUnique(
        extra.url,
        extra.caption,
        isAr ? 'واجهة الموقع' : 'Website Interface'
      )
    );

    return list;
  }, [
    project.logo,
    project.client,
    brandVisuals,
    mockupVisuals,
    lookbookVisuals,
    studioProductVisuals,
    socialPosters,
    extraLightboxItems,
    isAr,
  ]);

  const openLightboxByUrl = useCallback(
    (url: string) => {
      const idx = lightboxAssets.findIndex((item) => item.url === url);
      setActiveLightboxIndex(idx >= 0 ? idx : 0);
      setZoomLevel(1);
    },
    [lightboxAssets]
  );

  // Allow parent sections (like Website preview images) to trigger this lightbox by URL
  useEffect(() => {
    if (externalActiveUrl) {
      openLightboxByUrl(externalActiveUrl);
      if (onClearExternalActiveUrl) {
        onClearExternalActiveUrl();
      }
    }
  }, [externalActiveUrl, openLightboxByUrl, onClearExternalActiveUrl]);

  const closeLightbox = useCallback(() => {
    setActiveLightboxIndex(null);
    setZoomLevel(1);
    setIsFullscreenMode(false);
  }, []);

  const handleNext = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      if (activeLightboxIndex === null || lightboxAssets.length === 0) return;
      setActiveLightboxIndex((activeLightboxIndex + 1) % lightboxAssets.length);
      setZoomLevel(1);
    },
    [activeLightboxIndex, lightboxAssets.length]
  );

  const handlePrev = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      if (activeLightboxIndex === null || lightboxAssets.length === 0) return;
      setActiveLightboxIndex(
        (activeLightboxIndex - 1 + lightboxAssets.length) % lightboxAssets.length
      );
      setZoomLevel(1);
    },
    [activeLightboxIndex, lightboxAssets.length]
  );

  const handleZoomIn = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setZoomLevel((prev) => Math.min(Number((prev + 0.5).toFixed(1)), 3));
  }, []);

  const handleZoomOut = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setZoomLevel((prev) => Math.max(Number((prev - 0.5).toFixed(1)), 1));
  }, []);

  const handleResetZoom = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setZoomLevel(1);
  }, []);

  const toggleFullscreenMode = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsFullscreenMode((prev) => !prev);
  }, []);

  const handleCopyHex = useCallback((hex: string) => {
    navigator.clipboard?.writeText(hex).then(() => {
      setCopiedHex(hex);
      setTimeout(() => setCopiedHex(null), 1600);
    });
  }, []);

  // Keyboard shortcuts when lightbox is active
  useEffect(() => {
    if (activeLightboxIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        if (isAr) handlePrev();
        else handleNext();
      } else if (e.key === 'ArrowLeft') {
        if (isAr) handleNext();
        else handlePrev();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        handleZoomOut();
      } else if (e.key === '0') {
        handleResetZoom();
      } else if (e.key.toLowerCase() === 'f') {
        toggleFullscreenMode();
      }
    };

    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [
    activeLightboxIndex,
    isAr,
    closeLightbox,
    handlePrev,
    handleNext,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
    toggleFullscreenMode,
  ]);

  // Compute Bento Grid column span classes for Social Media Posts so the layout feels architectural
  const getSocialBentoSpanClass = (index: number, total: number): string => {
    if (total === 1) return 'md:col-span-12 max-w-2xl mx-auto w-full';
    if (total === 2) return 'md:col-span-6';
    if (total === 4) {
      // 2x2 asymmetric luxury bento: row 1 (7 + 5), row 2 (5 + 7)
      if (index === 0) return 'md:col-span-7';
      if (index === 1) return 'md:col-span-5';
      if (index === 2) return 'md:col-span-5';
      return 'md:col-span-7';
    }
    if (total === 8) {
      // 8 items (e.g., Zeyad Optical / Adamco): alternating 3-col (4+4+4) and 2-col (6+6) rhythm
      if (index < 3) return 'md:col-span-4';
      if (index < 5) return 'md:col-span-6';
      return 'md:col-span-4';
    }
    return 'md:col-span-4';
  };

  return (
    <div className="space-y-24 sm:space-y-28">
      {/* ============================================================
          SECTION 01: BRAND IDENTITY BENTO GRID (قسم الهوية البصرية)
         ============================================================ */}
      <section id="cs-sec-identity" className="scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 sm:mb-10 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 mb-2">
              <Palette className="w-3.5 h-3.5" style={{ color: primaryAccentHex }} />
              <span>01 // BRAND IDENTITY BENTO</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              {isAr ? 'الهوية البصرية ونظام العلامة' : 'Brand Identity & Visual System'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md">
            {isAr
              ? 'اضغط على أي عنصر بصري لفتحه بملء الشاشة واستعراض أدق تفاصيل الشعار والهوية.'
              : 'Click any visual tile to inspect the brandmark and identity applications in full screen.'}
          </p>
        </div>

        {/* Main Brand Identity Bento Grid (12 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
          {/* Bento Tile 1: Official Brandmark OR Editorial Fashion Monogram (5 columns) */}
          {project.logo ? (
            <motion.div
              key={`logo-${project.id}`}
              initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.65, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => openLightboxByUrl(project.logo!)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openLightboxByUrl(project.logo!);
                }
              }}
              className={`md:col-span-5 rounded-3xl overflow-hidden border p-8 sm:p-10 flex flex-col items-center justify-between min-h-[340px] sm:min-h-[400px] cursor-pointer group relative transition-colors duration-500 ${
                isZeyad
                  ? 'bg-[#08193B] border-[#D4AF37]/35 hover:border-[#D4AF37]/70 shadow-[0_24px_60px_rgba(8,25,59,0.75)]'
                  : isAthar
                    ? 'bg-gradient-to-b from-[#190b0e] via-[#10080a] to-[#080506] border-[#C8A46B]/40 hover:border-[#C8A46B]/75 shadow-[0_24px_60px_rgba(74,18,25,0.45)]'
                    : 'bg-white/[0.025] border-white/10 hover:border-white/25 shadow-[0_24px_60px_rgba(0,0,0,0.65)]'
              }`}
            >
              <div className="w-full flex items-center justify-between text-[11px] font-mono text-white/50">
                <span>{isAr ? 'الشعار الرسمي المعتمد' : 'OFFICIAL BRANDMARK'}</span>
                <span className="inline-flex items-center gap-1 text-zinc-300 opacity-75 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5" />
                </span>
              </div>

              <div className="my-auto py-6 flex items-center justify-center w-full">
                <img
                  src={getOptimizedImageProps(project.logo, { isLogo: true }).src}
                  alt={`${project.client} Official Logo`}
                  width={240}
                  height={240}
                  loading="eager"
                  decoding="async"
                  className={`w-48 h-48 sm:w-56 sm:h-56 object-contain transition-transform duration-700 group-hover:scale-105 ${
                    isAthar ? 'rounded-2xl border border-[#C8A46B]/40 shadow-2xl' : ''
                  }`}
                />
              </div>

              <div className="w-full pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-zinc-300">
                <span className="font-bold">
                  {isAr ? project.client : project.clientEn || project.client}
                </span>
                <span className="text-[11px] text-zinc-400">
                  {isAr ? 'فتح بملء الشاشة' : 'Full Screen'}
                </span>
              </div>
            </motion.div>
          ) : isAthar ? (
            <motion.div
              key={`monogram-${project.id}`}
              initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.65, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-5 rounded-3xl overflow-hidden border border-[#D6B88D]/25 bg-gradient-to-b from-[#14100c] via-[#0b0907] to-[#070605] p-8 sm:p-10 flex flex-col items-center justify-between min-h-[340px] sm:min-h-[400px] shadow-[0_24px_60px_rgba(0,0,0,0.75)]"
            >
              <div className="w-full flex items-center justify-between text-[11px] font-mono text-[#D6B88D]/75">
                <span>{isAr ? 'الهوية البصرية للدار' : 'FASHION HOUSE MONOGRAM'}</span>
                <span className="px-2.5 py-0.5 rounded-full bg-[#D6B88D]/10 border border-[#D6B88D]/25 text-[10px] text-[#D6B88D]">
                  {isAr ? '100% مصري' : '100% EGYPTIAN'}
                </span>
              </div>

              <div className="my-auto py-8 flex flex-col items-center justify-center text-center">
                <div className="text-6xl sm:text-7xl font-black text-[#F3ECE2] tracking-tight leading-none">
                  {project.id === 'athar' ? 'أثـر' : project.client}
                </div>
                <span className="mt-3 text-xs font-mono uppercase tracking-[0.35em] text-[#D6B88D]/85">
                  ATHAR • MODEST COUTURE
                </span>
              </div>

              <div className="w-full pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-zinc-400">
                <span className="font-semibold text-[#F3ECE2]">
                  {isAr ? project.client : project.clientEn || project.client}
                </span>
                <span className="text-[11px] text-[#D6B88D]/85">
                  {isAr ? 'الشعار المعتمد قيد الإرفاق' : 'Logo Ready for Attachment'}
                </span>
              </div>
            </motion.div>
          ) : null}

          {/* Bento Tile 2: Primary Brand Cover / Key Visual (7 columns) */}
          {brandVisuals.length > 0 && (
            <motion.div
              key={`cover-${brandVisuals[0].url}`}
              initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.68, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => openLightboxByUrl(brandVisuals[0].url)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openLightboxByUrl(brandVisuals[0].url);
                }
              }}
              className={`${
                project.logo ? 'md:col-span-7' : 'md:col-span-12'
              } rounded-3xl overflow-hidden bg-white/[0.02] border border-white/10 hover:border-white/25 flex flex-col justify-between min-h-[340px] sm:min-h-[400px] cursor-pointer group relative transition-colors duration-500 shadow-[0_24px_60px_rgba(0,0,0,0.65)]`}
            >
              <div className="relative flex-1 w-full overflow-hidden flex items-center justify-center bg-[#08070c]">
                <img
                  src={getOptimizedImageProps(brandVisuals[0].url).src}
                  alt={`${project.client} Brand Cover`}
                  width={960}
                  height={600}
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent flex items-end justify-between p-5 sm:p-6">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">
                      {isAthar
                        ? isAr
                          ? 'الهيدر المعماري الرسمي للعلامة'
                          : 'OFFICIAL BRAND HEADER'
                        : isAr
                          ? 'الواجهة البصرية الرئيسية'
                          : 'PRIMARY BRAND COVER'}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white mt-0.5">
                      {isAr
                        ? brandVisuals[0].title
                        : brandVisuals[0].titleEn || brandVisuals[0].title}
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/15 text-xs font-semibold text-white">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">
                      {isAr ? 'ملء الشاشة' : 'Full Screen'}
                    </span>
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Bento Tiles 3+: Additional Brand Applications / 3D Emblems */}
          {brandVisuals.slice(1).map((bItem, bIdx) => {
            const extraCount = brandVisuals.length - 1;
            const spanClass =
              extraCount === 1
                ? 'md:col-span-12 aspect-[21/9]'
                : extraCount === 2
                  ? 'md:col-span-6 aspect-[16/10]'
                  : bIdx === 0
                    ? 'md:col-span-6 aspect-[16/10]'
                    : 'md:col-span-3 aspect-square';

            return (
              <motion.div
                key={bItem.url}
                initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.62,
                  delay: Math.min(0.2 + bIdx * 0.08, 0.45),
                  ease: [0.16, 1, 0.3, 1],
                }}
                onClick={() => openLightboxByUrl(bItem.url)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightboxByUrl(bItem.url);
                  }
                }}
                className={`${spanClass} group relative rounded-3xl overflow-hidden bg-[#08070c] border border-white/10 hover:border-white/25 cursor-pointer transition-colors duration-500`}
              >
                <img
                  src={getOptimizedImageProps(bItem.url).src}
                  alt={`${project.client} — ${bItem.title}`}
                  width={640}
                  height={400}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-4 sm:p-5 flex items-end justify-between">
                  <span className="text-xs sm:text-sm font-bold text-white truncate">
                    {isAr ? bItem.title : bItem.titleEn || bItem.title}
                  </span>
                  <span className="w-8 h-8 rounded-full bg-black/75 border border-white/20 flex items-center justify-center text-white shrink-0">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.div>
            );
          })}

          {/* Bento Tile: Brand Color Palette Strip (12 columns) */}
          {project.brandColors && project.brandColors.length > 0 && (
            <motion.div
              key={`palette-${project.id}`}
              initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.65, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="md:col-span-12 rounded-3xl bg-white/[0.02] border border-white/10 p-5 sm:p-6"
            >
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-xs font-semibold text-zinc-300">
                  {isAr ? 'لوحة ألوان الهوية البصرية المعتمدة' : 'Approved Brand Color Palette'}
                </span>
                <span className="text-[11px] font-mono text-zinc-500">
                  {isAr ? 'اضغط على اللون لنسخ الكود (HEX)' : 'Click swatch to copy HEX'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {project.brandColors.map((swatch) => (
                  <button
                    key={swatch.hex}
                    type="button"
                    onClick={() => handleCopyHex(swatch.hex)}
                    className="group flex items-center gap-3.5 p-3 rounded-2xl bg-[#09080e] hover:bg-white/[0.05] border border-white/[0.08] hover:border-white/20 transition-all text-start cursor-pointer"
                  >
                    <span
                      className="w-11 h-11 rounded-xl shrink-0 border border-white/20 shadow-inner transition-transform group-hover:scale-105"
                      style={{ backgroundColor: swatch.hex }}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate">
                        {isAr ? swatch.name : swatch.nameEn || swatch.name}
                      </div>
                      <div className="text-[11px] font-mono text-zinc-400 mt-0.5 uppercase">
                        {copiedHex === swatch.hex
                          ? isAr
                            ? 'تم النسخ!'
                            : 'Copied!'
                          : swatch.hex}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Studio Product Photography Bento Row (For Zeyad Optical eyewear studio shoots) */}
          {studioProductVisuals.length > 0 && (
            <div className="md:col-span-12 pt-2">
              <div className="flex items-center justify-between gap-2 text-xs font-semibold text-zinc-300 mb-4">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-[#D4AF37]" />
                  <span>
                    {isAr
                      ? 'جلسات تصوير المنتجات بالاستوديو (Studio Product Photography)'
                      : 'Commercial Studio Product Photography'}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-zinc-500">
                  {isAr ? 'اضغط للتكبير بملء الشاشة' : 'Click to inspect full screen'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
                {studioProductVisuals.map((item, idx) => (
                  <motion.div
                    key={item.url}
                    initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{
                      duration: 0.62,
                      delay: 0.1 + idx * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    onClick={() => openLightboxByUrl(item.url)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openLightboxByUrl(item.url);
                      }
                    }}
                    className="sm:col-span-4 group relative aspect-[4/3] rounded-3xl overflow-hidden bg-[#08070c] border border-white/10 hover:border-[#D4AF37]/50 cursor-pointer transition-colors duration-500"
                  >
                    <img
                      src={getOptimizedImageProps(item.url).src}
                      alt={`${project.client} Studio Product Shot ${idx + 1}`}
                      width={520}
                      height={390}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 end-3 w-8 h-8 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
          {/* Bento Tile: Brand Guidelines PDF Book Card (Shown when PDF exists OR project is awaiting Brand PDF upload) */}
          {(project.brandGuidelinesPdf?.url || isAthar) && (
            <motion.div
              key={`brand-pdf-${project.id}`}
              initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.65, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className={`${
                !project.logo && isAthar && brandVisuals.length === 0
                  ? 'md:col-span-7 min-h-[340px] sm:min-h-[400px]'
                  : 'md:col-span-12'
              } rounded-3xl bg-white/[0.02] border border-[#C8A46B]/30 p-6 sm:p-8 flex flex-col justify-between shadow-[0_24px_60px_rgba(0,0,0,0.65)]`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
                <div className="inline-flex items-center gap-2.5">
                  <span className="w-10 h-10 rounded-xl bg-[#D6B88D]/10 border border-[#D6B88D]/30 flex items-center justify-center text-[#D6B88D]">
                    <FileText className="w-5 h-5" />
                  </span>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D6B88D]/85 block">
                      BRAND IDENTITY GUIDELINES • PDF
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {project.brandGuidelinesPdf
                        ? isAr
                          ? project.brandGuidelinesPdf.title
                          : project.brandGuidelinesPdf.titleEn || project.brandGuidelinesPdf.title
                        : isAr
                          ? 'ملف دليل الهوية البصرية (Brand Book PDF)'
                          : 'Official Brand Guidelines (PDF)'}
                    </h3>
                  </div>
                </div>

                {(project.brandGuidelinesPdf?.pageCount || project.brandGuidelinesPdf?.fileSize) && (
                  <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                    {project.brandGuidelinesPdf.pageCount && (
                      <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10">
                        {project.brandGuidelinesPdf.pageCount} {isAr ? 'صفحة' : 'Pages'}
                      </span>
                    )}
                    {project.brandGuidelinesPdf.fileSize && (
                      <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10">
                        {project.brandGuidelinesPdf.fileSize}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="my-auto py-6 space-y-4">
                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                  {project.brandGuidelinesPdf
                    ? isAr
                      ? project.brandGuidelinesPdf.description
                      : project.brandGuidelinesPdf.descriptionEn ||
                        project.brandGuidelinesPdf.description
                    : isAr
                      ? 'منصة مخصصة لاستعراض وتصفح وتحميل ملف الـ PDF الكامل للهوية البصرية الخاصة بعلامة أثر (الشعار، الألوان، الخطوط، قواعد الاستخدام، وتطبيقات البراند).'
                      : 'Dedicated interactive slot engineered to preview, open, and download Athar’s complete Brand Guidelines PDF once uploaded.'}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-zinc-400">
                  <div className="px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.07]">
                    {isAr ? 'توثيق الشعار والخطوط' : 'Logo & Typography System'}
                  </div>
                  <div className="px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.07]">
                    {isAr ? 'نظام الألوان والخامات' : 'Color & Fabric Direction'}
                  </div>
                  <div className="px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/[0.07]">
                    {isAr ? 'تطبيقات المطبوعات والتغليف' : 'Packaging & Label Rules'}
                  </div>
                </div>
              </div>

              {project.brandGuidelinesPdf?.url ? (
                <div className="space-y-4 pt-4 border-t border-white/[0.08]">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowInlinePdfPreview((prev) => !prev)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D6B88D] hover:bg-[#e5cba5] text-black font-bold text-xs transition-all cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      <span>
                        {showInlinePdfPreview
                          ? isAr
                            ? 'إخفاء المعاينة المباشرة'
                            : 'Hide Inline Preview'
                          : isAr
                            ? 'معاينة ملف الـ PDF هنا'
                            : 'Preview PDF Inline'}
                      </span>
                    </button>

                    <a
                      href={project.brandGuidelinesPdf.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-white font-semibold text-xs transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{isAr ? 'فتح في نافذة جديدة' : 'Open PDF'}</span>
                    </a>

                    <a
                      href={project.brandGuidelinesPdf.url}
                      download
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-zinc-300 hover:text-white font-semibold text-xs transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isAr ? 'تحميل الدليل' : 'Download PDF'}</span>
                    </a>
                  </div>

                  {showInlinePdfPreview && (
                    <div className="rounded-2xl overflow-hidden border border-white/15 bg-black/70 h-[480px] sm:h-[620px]">
                      <iframe
                        src={project.brandGuidelinesPdf.url}
                        title={`${project.client} Brand Guidelines PDF`}
                        className="w-full h-full"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-zinc-400">
                  <span className="inline-flex items-center gap-2 text-[#D6B88D]">
                    <span className="w-2 h-2 rounded-full bg-[#D6B88D]" />
                    <span>
                      {isAr
                        ? 'جاهز لإرفاق ملف الـ PDF الخاص بالهوية البصرية'
                        : 'Ready for Brand Identity PDF upload'}
                    </span>
                  </span>
                  <span className="font-mono text-[11px] text-zinc-500">PDF VIEWER</span>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* ============================================================
          SECTION 01B: BRAND MOCKUP SHOWCASE (قسم الموك اب الرسمي)
          Displayed when mockupVisuals exist OR project.isBrandInCreation
         ============================================================ */}
      {(mockupVisuals.length > 0 || isAthar) && (
        <section id="cs-sec-mockup" className="scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 sm:mb-10 border-b border-white/[0.08]">
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 mb-2">
                <Layers className="w-3.5 h-3.5" style={{ color: primaryAccentHex }} />
                <span>MOCKUP PRESENTATION</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                {isAr ? 'الموك اب والتطبيقات الواقعية' : 'Official Brand Mockup Showcase'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md">
              {isAr
                ? 'استعراض تطبيقات الهوية البصرية على التغليف، البطاقات، وملابس المحجبات بصورة واقعية.'
                : 'Real-world brand identity presentation across packaging, garment labels, and apparel mockups.'}
            </p>
          </div>

          {mockupVisuals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
              {mockupVisuals.map((mItem, mIdx) => {
                const spanClass =
                  mockupVisuals.length === 1
                    ? 'md:col-span-12 aspect-[16/9]'
                    : mockupVisuals.length === 2
                      ? 'md:col-span-6 aspect-[16/10]'
                      : mIdx === 0
                        ? 'md:col-span-12 aspect-[21/9]'
                        : 'md:col-span-6 aspect-[16/10]';

                return (
                  <motion.div
                    key={mItem.url}
                    initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    viewport={{ once: true, amount: 0.15 }}
                    transition={{
                      duration: 0.65,
                      delay: Math.min(mIdx * 0.08, 0.3),
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    onClick={() => openLightboxByUrl(mItem.url)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openLightboxByUrl(mItem.url);
                      }
                    }}
                    className={`${spanClass} group relative rounded-3xl overflow-hidden bg-[#08070c] border border-white/10 hover:border-[#D6B88D]/50 cursor-pointer transition-colors duration-500 shadow-[0_24px_60px_rgba(0,0,0,0.65)]`}
                  >
                    <img
                      src={getOptimizedImageProps(mItem.url).src}
                      alt={
                        isAr
                          ? `${project.client} — ${mItem.title}`
                          : `${project.client} — ${mItem.titleEn || mItem.title}`
                      }
                      width={1200}
                      height={720}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent p-5 sm:p-7 flex items-end justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[#D6B88D]/90 block">
                          {isAr ? 'الموك اب الرسمي للعلامة' : 'OFFICIAL BRAND MOCKUP'}
                        </span>
                        <h3 className="text-sm sm:text-lg font-bold text-white mt-0.5">
                          {isAr ? mItem.title : mItem.titleEn || mItem.title}
                        </h3>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-white/15 text-xs font-semibold text-white">
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">
                          {isAr ? 'ملء الشاشة' : 'Full Screen'}
                        </span>
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl bg-white/[0.02] border border-dashed border-[#D6B88D]/25 p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-start">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#D6B88D]/10 border border-[#D6B88D]/25 flex items-center justify-center text-[#D6B88D] shrink-0">
                  <ImagePlus className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {isAr
                      ? 'منصة عرض الموك اب الرسمي لعلامة أثر'
                      : 'Dedicated Mockup Showcase Frame'}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
                    {isAr
                      ? 'قسم مخصص لعرض صورة الموك اب الكاملة بدقة عالية وتكبير بملء الشاشة بمجرد إرفاق الصورة.'
                      : 'Engineered to present the brand mockup artwork at full fidelity with Lightbox inspection once attached.'}
                  </p>
                </div>
              </div>
              <span className="px-3.5 py-1.5 rounded-full bg-[#D6B88D]/10 border border-[#D6B88D]/25 text-[11px] font-mono text-[#D6B88D] shrink-0">
                {isAr ? 'بانتظار إرفاق الموك اب' : 'Awaiting Mockup Asset'}
              </span>
            </div>
          )}
        </section>
      )}

      {/* ============================================================
          SECTION 01C: MODEST FASHION COLLECTION LOOKBOOK (~40+ IMAGES)
          Supports progressive loading + full Lightbox gallery navigation
         ============================================================ */}
      {(lookbookVisuals.length > 0 || isAthar) && (
        <section id="cs-sec-lookbook" className="scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 sm:mb-10 border-b border-white/[0.08]">
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 mb-2">
                <BrandSparkles className="w-3.5 h-3.5" style={{ color: primaryAccentHex }} />
                <span>
                  MODEST FASHION LOOKBOOK
                  {lookbookVisuals.length > 0 ? ` // ${lookbookVisuals.length} PIECES` : ''}
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                {isAr
                  ? 'تشكيلة تصميم وتنفيذ ملابس المحجبات'
                  : 'Egyptian Modest Fashion Lookbook'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md">
              {isAr
                ? 'تصاميم وتنفيذ مصري 100% — معرض بصري مهيأ لاستيعاب التشكيلة الكاملة مع التصفح السريع ووضع ملء الشاشة.'
                : '100% Egyptian designed & tailored hijab fashion archive with progressive reveal and full-screen Lightbox.'}
            </p>
          </div>

          {lookbookVisuals.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-12 gap-4 sm:gap-6">
                {(showAllLookbook
                  ? lookbookVisuals
                  : lookbookVisuals.slice(0, INITIAL_LOOKBOOK_VISIBLE)
                ).map((item, idx) => {
                  const optLook = getOptimizedImageProps(item.url);
                  const lookTitle = isAr
                    ? item.title || `${project.client} — قطعة ${idx + 1}`
                    : item.titleEn || item.title || `${project.client} — Look ${idx + 1}`;
                  const colSpanClass = idx === 0 && lookbookVisuals.length >= 4
                    ? 'col-span-2 md:col-span-6 aspect-[3/4]'
                    : idx === 1 && lookbookVisuals.length >= 4
                      ? 'col-span-2 md:col-span-6 aspect-[3/4]'
                      : 'col-span-1 md:col-span-4 aspect-[3/4]';

                  return (
                    <motion.article
                      key={item.url}
                      initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
                      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      viewport={{ once: true, amount: 0.1 }}
                      transition={{
                        duration: 0.58,
                        delay: Math.min((idx % 6) * 0.05, 0.25),
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      onClick={() => openLightboxByUrl(item.url)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          openLightboxByUrl(item.url);
                        }
                      }}
                      className={`${colSpanClass} group relative rounded-3xl overflow-hidden bg-[#0a0807] border border-white/10 hover:border-[#D6B88D]/55 cursor-pointer transition-colors duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.65)]`}
                    >
                      <img
                        src={optLook.src}
                        srcSet={optLook.srcSet}
                        sizes="(max-width: 768px) 50vw, 33vw"
                        alt={lookTitle}
                        width={600}
                        height={800}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-4 sm:p-5 flex items-end justify-between gap-2">
                        <div className="min-w-0">
                          {(item.collectionTag || item.collectionTagEn) && (
                            <span className="text-[10px] font-mono uppercase tracking-wider text-[#D6B88D] block mb-0.5 truncate">
                              {isAr
                                ? item.collectionTag
                                : item.collectionTagEn || item.collectionTag}
                            </span>
                          )}
                          <h3 className="text-xs sm:text-sm font-bold text-white truncate">
                            {lookTitle}
                          </h3>
                          {(item.description || item.descriptionEn) && (
                            <p className="text-[11px] text-zinc-300/90 line-clamp-2 mt-1 leading-relaxed">
                              {isAr
                                ? item.description
                                : item.descriptionEn || item.description}
                            </p>
                          )}
                        </div>
                        <span className="w-8 h-8 rounded-full bg-black/75 border border-white/20 flex items-center justify-center text-white shrink-0 opacity-85 group-hover:opacity-100">
                          <Maximize2 className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </motion.article>
                  );
                })}
              </div>

              {lookbookVisuals.length > INITIAL_LOOKBOOK_VISIBLE && (
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setShowAllLookbook((prev) => !prev)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.09] border border-[#D6B88D]/35 text-xs sm:text-sm font-bold text-[#F3ECE2] transition-all cursor-pointer"
                  >
                    <span>
                      {showAllLookbook
                        ? isAr
                          ? 'عرض عدد أقل'
                          : 'Show Fewer Pieces'
                        : isAr
                          ? `عرض التشكيلة بالكامل (${lookbookVisuals.length} صورة)`
                          : `View Full Collection (${lookbookVisuals.length} Pieces)`}
                    </span>
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  num: '01',
                  title: isAr ? 'أزياء محجبات عملية يومية' : 'Everyday Modest Tailoring',
                  sub: isAr
                    ? 'قصّات انسيابية وخامات طبيعية مريحة بتنفيذ مصري متقن'
                    : 'Breathable everyday silhouettes cut and stitched in Egypt',
                },
                {
                  num: '02',
                  title: isAr ? 'إطلالات راقية للمناسبات' : 'Refined Evening & Occasion',
                  sub: isAr
                    ? 'تصاميم محتشمة تجمع بين الوقار والأناقة الهادئة'
                    : 'Understated modest couture crafted for elevated occasions',
                },
                {
                  num: '03',
                  title: isAr ? 'معرض التشكيلة الكاملة (~40 صورة)' : 'Full Lookbook Archive (~40 Photos)',
                  sub: isAr
                    ? 'شبكة Portrait 3:4 مهيأة لعرض جميع صور التشكيلة بوضوح وفتحها بملء الشاشة'
                    : 'Portrait 3:4 Bento archive ready to showcase all ~40 collection images',
                },
              ].map((slot) => (
                <div
                  key={slot.num}
                  className="rounded-3xl bg-gradient-to-b from-[#130f0c]/75 to-[#080706] border border-[#D6B88D]/20 p-6 sm:p-7 flex flex-col justify-between min-h-[210px]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-[#D6B88D]/85">{slot.num}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#D6B88D]/10 border border-[#D6B88D]/20 text-[10px] font-mono text-[#D6B88D]">
                      3:4 LOOKBOOK
                    </span>
                  </div>
                  <div className="mt-8">
                    <h3 className="text-base sm:text-lg font-bold text-[#F3ECE2]">{slot.title}</h3>
                    <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                      {slot.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ============================================================
          SECTION 02: SOCIAL MEDIA POSTS BENTO GRID (قسم منشورات التواصل الاجتماعي)
         ============================================================ */}
      {socialPosters.length > 0 && (
        <section id="cs-sec-social" className="scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 sm:mb-10 border-b border-white/[0.08]">
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 mb-2">
                <Sparkles className="w-3.5 h-3.5" style={{ color: primaryAccentHex }} />
                <span>02 // SOCIAL MEDIA BENTO</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                {isAr
                  ? 'منشورات وتصميمات التواصل الاجتماعي'
                  : 'Social Media Posts & Creatives'}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md">
              {isAr
                ? 'شبكة Bento تفاعلية لمنشورات السوشيال ميديا مع دعم العرض بملء الشاشة عند النقر.'
                : 'Interactive Bento grid of social media posts with full-screen inspection on click.'}
            </p>
          </div>

          {/* Asymmetric Bento Grid for Social Media Posts */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-7">
            {socialPosters.map((poster, pIdx) => {
              const optPoster = getOptimizedImageProps(poster.url);
              const posterTitle = isAr ? poster.title : poster.titleEn || poster.title;
              const bentoSpan = getSocialBentoSpanClass(pIdx, socialPosters.length);

              return (
                <motion.article
                  key={poster.url}
                  initial={{ opacity: 0, y: 22, filter: 'blur(6px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, amount: 0.12 }}
                  transition={{
                    duration: 0.65,
                    delay: Math.min((pIdx % 3) * 0.09, 0.25),
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className={`${bentoSpan} group rounded-[28px] bg-white/[0.025] border border-white/10 hover:border-white/25 p-3.5 sm:p-4 flex flex-col justify-between transition-colors duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.65)] hover:-translate-y-1`}
                >
                  {/* Minimal Card Top Header */}
                  <div className="pb-3 px-1 flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-zinc-200 truncate">
                      {posterTitle}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/10 text-[10px] font-mono text-zinc-400 shrink-0">
                      {poster.platform || 'Social'}
                    </span>
                  </div>

                  {/* Poster Visual Frame — Click opens Full-Screen Lightbox */}
                  <div
                    onClick={() => openLightboxByUrl(poster.url)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openLightboxByUrl(poster.url);
                      }
                    }}
                    className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-[#08070c] flex items-center justify-center cursor-pointer"
                  >
                    <img
                      src={optPoster.src}
                      srcSet={optPoster.srcSet}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      alt={`${project.client} — ${posterTitle}`}
                      width={600}
                      height={750}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-700"
                    />

                    <div className="absolute top-3 end-3 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-[11px] font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>{isAr ? 'ملء الشاشة' : 'Full Screen'}</span>
                    </div>
                  </div>

                  {/* Subtle Social Card Footer + Action Button */}
                  <div className="pt-3.5 px-1 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-zinc-400">
                      <Heart
                        className="w-4 h-4 fill-current"
                        style={{ color: primaryAccentHex }}
                      />
                      <MessageCircle className="w-4 h-4" />
                      <Send className="w-4 h-4" />
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openLightboxByUrl(poster.url)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 text-[11px] font-medium text-zinc-300 hover:text-white transition-all cursor-pointer"
                      >
                        <span>{isAr ? 'تكبير الصورة' : 'Inspect'}</span>
                        <Bookmark className="w-3 h-3" />
                      </button>

                      {poster.postUrl && (
                        <a
                          href={poster.postUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.16] border border-white/15 text-[11px] font-semibold text-white transition-all"
                        >
                          <span>{isAr ? 'فتح البوست' : 'View Post'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>
      )}

      {/* ============================================================
          FULL-SCREEN LIGHTBOX VIEWER (عرض الصور بملء الشاشة عند النقر)
         ============================================================ */}
      <AnimatePresence>
        {activeLightboxIndex !== null && lightboxAssets[activeLightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-[1100] bg-black/95 flex flex-col justify-between backdrop-blur-2xl select-none overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label={lightboxAssets[activeLightboxIndex].caption}
          >
            {/* Top Fullscreen Control Bar */}
            <header
              onClick={(e) => e.stopPropagation()}
              className="w-full px-4 sm:px-6 py-3.5 bg-[#06050a]/90 border-b border-white/10 flex items-center justify-between gap-3 shrink-0 z-30"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="px-2.5 py-1 rounded-lg bg-white/10 text-xs font-mono font-bold text-white shrink-0">
                  {activeLightboxIndex + 1} / {lightboxAssets.length}
                </span>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-[11px] text-zinc-400 shrink-0">
                  {lightboxAssets[activeLightboxIndex].categoryLabel}
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-white truncate">
                  {lightboxAssets[activeLightboxIndex].caption}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center rounded-xl bg-white/[0.06] border border-white/10 p-0.5">
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 1}
                    className="p-1.5 rounded-lg text-zinc-300 hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
                    title={isAr ? 'تصغير' : 'Zoom Out'}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="px-2 text-[11px] font-mono font-bold text-white">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 3}
                    className="p-1.5 rounded-lg text-zinc-300 hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
                    title={isAr ? 'تكبير' : 'Zoom In'}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  {zoomLevel > 1 && (
                    <button
                      type="button"
                      onClick={handleResetZoom}
                      className="p-1.5 rounded-lg text-zinc-300 hover:text-white transition-colors cursor-pointer"
                      title={isAr ? 'إعادة ضبط' : 'Reset Zoom'}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={toggleFullscreenMode}
                  className="p-2 rounded-xl bg-white/[0.06] border border-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                  title={isAr ? 'ملء الشاشة' : 'Toggle Fullscreen'}
                >
                  {isFullscreenMode ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={closeLightbox}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.14] border border-white/15 text-white transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span className="text-[11px] font-semibold">
                    {isAr ? 'إغلاق' : 'Close'}
                  </span>
                </button>
              </div>
            </header>

            {/* Center Fullscreen Image Stage */}
            <div
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  if (zoomLevel > 1) setZoomLevel(1);
                  else closeLightbox();
                }
              }}
              className="relative flex-1 w-full overflow-auto flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
            >
              <motion.div
                key={lightboxAssets[activeLightboxIndex].url}
                initial={{ opacity: 0, scale: 0.94, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                onClick={(e) => e.stopPropagation()}
                onDoubleClick={() => setZoomLevel((prev) => (prev === 1 ? 2 : 1))}
                className="relative max-w-full max-h-full flex items-center justify-center transition-transform duration-300 ease-out"
                style={{
                  transform: `scale(${zoomLevel})`,
                  cursor: zoomLevel > 1 ? 'grab' : 'zoom-in',
                }}
              >
                {(() => {
                  const lbOpt = getOptimizedImageProps(
                    lightboxAssets[activeLightboxIndex].url
                  );
                  return (
                    <img
                      src={lbOpt.src}
                      srcSet={lbOpt.srcSet}
                      sizes="92vw"
                      alt={lightboxAssets[activeLightboxIndex].caption}
                      width={1280}
                      height={800}
                      decoding="async"
                      className={`max-w-[92vw] ${
                        isFullscreenMode ? 'max-h-[88vh]' : 'max-h-[78vh]'
                      } object-contain rounded-xl drop-shadow-[0_15px_50px_rgba(0,0,0,0.95)]`}
                    />
                  );
                })()}
              </motion.div>

              {lightboxAssets.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    className={`fixed top-1/2 -translate-y-1/2 ${
                      isAr ? 'right-4 sm:right-8' : 'left-4 sm:left-8'
                    } z-40 w-11 h-11 rounded-full bg-black/80 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer`}
                    aria-label={isAr ? 'الصورة السابقة' : 'Previous Image'}
                  >
                    {isAr ? (
                      <ChevronRight className="w-5 h-5" />
                    ) : (
                      <ChevronLeft className="w-5 h-5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className={`fixed top-1/2 -translate-y-1/2 ${
                      isAr ? 'left-4 sm:left-8' : 'right-4 sm:right-8'
                    } z-40 w-11 h-11 rounded-full bg-black/80 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer`}
                    aria-label={isAr ? 'الصورة التالية' : 'Next Image'}
                  >
                    {isAr ? (
                      <ChevronLeft className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
