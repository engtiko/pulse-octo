import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useProjects } from '../context/ProjectsContext';
import { ProjectItem } from '../types';
import { ProjectDetailModal } from './ProjectDetailModal';
import { PortfolioCardSkeleton } from './CardSkeletons';
import { LiquidGlassButton } from './LiquidGlassButton';
import { BlurUpImage } from './BlurUpImage';
import {
  ArrowRight,
  CheckCircle2,
  Maximize2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface CaseStudyShowcaseProps {
  onNavigate?: (page: string) => void;
  onOpenConsultation?: () => void;
  limit?: number;
  showAllButton?: boolean;
}

interface CardContentProps {
  project: ProjectItem;
  currentVisual: string;
  previewAssets: string[];
  isAr: boolean;
  dir: string;
  onAssetSelect: (projectId: string, assetUrl: string) => void;
  onOpenCaseStudy: (project: ProjectItem) => void;
}

/**
 * Shared, perfectly-proportioned Case Study Card Content.
 * Strictly aligned with zero clipping across desktop, tablet, and mobile.
 */
const CaseStudyCardContent: React.FC<CardContentProps> = ({
  project,
  currentVisual,
  previewAssets,
  isAr,
  dir,
  onAssetSelect,
  onOpenCaseStudy,
}) => {
  const defaultBullets = isAr
    ? [
        'بناء الهوية البصرية الكاملة وتطبيقاتها للبراند',
        'جلسات تصوير احترافية وتوجيه الموديلينج بالاستوديو',
        'إدارة الحملات الإعلانية الممولة ومضاعفة المبيعات',
      ]
    : [
        'Bespoke brand architecture and identity guidelines',
        'Commercial studio photography and live modeling',
        'Data-driven performance media scaling ROAS',
      ];

  const rawScope = isAr ? project.scopeOfWork : (project.scopeOfWorkEn || project.scopeOfWork);
  const keyBullets = rawScope && rawScope.length > 0 ? rawScope.slice(0, 3) : defaultBullets;

  return (
    <article
      style={{
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
      }}
      className="relative w-full h-[440px] sm:h-[470px] lg:h-[490px] max-h-[calc(100dvh-130px)] rounded-2xl sm:rounded-3xl bg-[#09080f] border border-white/10 hover:border-purple-500/35 p-4 sm:p-6 lg:p-8 shadow-[0_-20px_60px_rgba(0,0,0,0.95),0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col justify-center group snap-start snap-always scroll-snap-strict-child transition-colors duration-300"
    >
      {/* 100% Solid Opaque Backing Plate (Guarantees zero transparency or bleed-through) */}
      <div className="absolute inset-0 bg-[#09080f] pointer-events-none -z-10" />

      {/* Top Architectural Hairline */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent pointer-events-none z-20" />

      {/* 2-Column Responsive Layout (Visual on one side, Details on the other) */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 items-center h-full">
        {/* Column 1: Image Showcase */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden bg-[#06050a] border border-white/10 shadow-[0_12px_30px_rgba(0,0,0,0.75)] aspect-[16/10] sm:aspect-[16/11] max-h-[145px] sm:max-h-[225px] lg:max-h-[270px] w-full group/img">
            {/* Ambient Dark Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent z-10 pointer-events-none" />

            {/* Real Client Image Asset */}
            <BlurUpImage
              src={currentVisual}
              alt={
                isAr
                  ? `بوستر وعرض مشروع ${project.client} — ${project.title} من تنفيذ وكالة Pulse OCTO`
                  : `${project.client} — ${project.title} showcase by Pulse OCTO`
              }
              className="w-full h-full"
              imgClassName="object-cover object-center transform group-hover/img:scale-[1.03] transition-transform duration-700 ease-out"
            />

            {/* Client Brand Emblem / Logo Badge */}
            {project.logo && (
              <div
                className={`absolute top-2.5 start-2.5 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-lg backdrop-blur-md border flex items-center justify-center shadow-md overflow-hidden ${
                  project.id === 'athar'
                    ? 'bg-[#F4ECE0] border-[#C8A46B]/60 p-0.5'
                    : project.id === 'zeyad-optical'
                      ? 'bg-[#08193B]/95 border-[#D4AF37]/40 p-1'
                      : 'bg-[#09080f]/90 border-white/10 p-1'
                }`}
              >
                <BlurUpImage
                  src={project.logo}
                  alt={
                    isAr
                      ? `شعار ${project.client} الرسمي — ${project.category}`
                      : `${project.client} official logo — ${project.category}`
                  }
                  className="w-full h-full"
                  imgClassName={project.id === 'athar' ? 'object-cover rounded' : 'object-contain'}
                />
              </div>
            )}

            {/* Micro Gallery Asset Switcher & Expand Badge */}
            <div className="absolute bottom-2 inset-x-2 z-20 flex items-center justify-between gap-1.5">
              {previewAssets.length > 1 ? (
                <div className="flex items-center gap-1 p-1 rounded-lg bg-[#09080f]/90 backdrop-blur-md border border-white/10 overflow-x-auto no-scrollbar">
                  {previewAssets.map((assetUrl, assetIndex) => {
                    const isSelected = currentVisual === assetUrl;
                    return (
                      <button
                        key={assetUrl}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAssetSelect(project.id, assetUrl);
                        }}
                        className={`relative w-7 h-5 sm:w-8 sm:h-6 rounded overflow-hidden border transition-all cursor-pointer shrink-0 ${
                          isSelected
                            ? 'border-[#7c3aed] ring-1 ring-purple-500/40 scale-105'
                            : 'border-white/15 opacity-60 hover:opacity-100'
                        }`}
                        title={`${project.client} 0${assetIndex + 1}`}
                        aria-label={
                          isAr
                            ? `عرض لقطة ${assetIndex + 1} لمشروع ${project.client}`
                            : `View asset 0${assetIndex + 1}`
                        }
                      >
                        <BlurUpImage
                          src={assetUrl}
                          alt={
                            isAr
                              ? `لقطة ${assetIndex + 1} من بوسترات وأعمال مشروع ${project.client}`
                              : `${project.client} poster preview ${assetIndex + 1}`
                          }
                          className="w-full h-full"
                          imgClassName="object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={() => onOpenCaseStudy(project)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#09080f]/90 backdrop-blur-md border border-white/15 hover:border-purple-500/40 text-zinc-200 hover:text-white text-[10px] sm:text-[11px] font-semibold transition-colors cursor-pointer shrink-0"
                title={isAr ? 'عرض بكامل الشاشة' : 'Expand full case study'}
              >
                <Maximize2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-purple-400" />
                <span>{isAr ? 'عرض مكبر' : 'Expand'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Column 2: Project Details & Primary Action */}
        <div className="lg:col-span-7 flex flex-col justify-between h-full py-0.5">
          <div>
            {/* Editorial Client & Category Overline */}
            <div className="flex flex-wrap items-center gap-2 mb-1.5 text-[11px] sm:text-xs font-medium text-zinc-400">
              <span className="text-purple-300 font-semibold">{project.client}</span>
              <span className="text-white/20">•</span>
              <span>{project.category}</span>
            </div>

            {/* Project Headline */}
            <h3 className="text-base sm:text-xl lg:text-2xl font-black text-white leading-snug tracking-tight mb-2 group-hover:text-purple-200 transition-colors">
              {project.title}
            </h3>

            {/* Project Summary / Challenge */}
            <p className="text-[11px] sm:text-xs lg:text-sm text-zinc-300 leading-relaxed font-normal mb-3 line-clamp-2">
              {project.challenge || project.summary}
            </p>

            {/* 3 Key Bullet Points */}
            <div className="space-y-1.5 sm:space-y-2 mb-3">
              {keyBullets.map((bullet, bIdx) => (
                <div key={bIdx} className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-300 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </div>
                  <span className="text-[11px] sm:text-xs lg:text-sm text-zinc-200 leading-snug line-clamp-1">
                    {bullet}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Single Clear Primary CTA */}
          <div className="mt-1 flex items-center self-start">
            <LiquidGlassButton
              onClick={() => onOpenCaseStudy(project)}
              variant="primary"
              size="sm"
            >
              <Eye className="w-3.5 h-3.5 text-purple-100" />
              <span>{isAr ? 'عرض دراسة الحالة' : 'View Case Study'}</span>
              <ArrowRight className={`w-3.5 h-3.5 text-purple-100 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            </LiquidGlassButton>
          </div>
        </div>
      </div>
    </article>
  );
};

interface DeckCardItemProps {
  project: ProjectItem;
  index: number;
  total: number;
  scrollYProgress: any;
  isAr: boolean;
  dir: string;
  currentVisual: string;
  previewAssets: string[];
  onAssetSelect: (projectId: string, assetUrl: string) => void;
  onOpenCaseStudy: (project: ProjectItem) => void;
}

/**
 * Deck Card Item with smooth slide-up, scale, and opacity transforms
 * synced to strict CSS scroll-snap positions.
 */
const DeckCardItem: React.FC<DeckCardItemProps> = ({
  project,
  index,
  total,
  scrollYProgress,
  isAr,
  dir,
  currentVisual,
  previewAssets,
  onAssetSelect,
  onOpenCaseStudy,
}) => {
  const isFirst = index === 0;
  const isLast = index === total - 1;

  // Dynamic step corresponding to 100vh scroll-snap anchors
  const step = 1 / Math.max(1, total - 1);
  const enterStart = isFirst ? 0 : (index - 1) * step;
  const enterEnd = isFirst ? 0 : index * step;
  const nextEnterStart = index * step;
  const nextEnterEnd = (index + 1) * step;

  // Upward slide from below: starts fully below the container and slides up over the previous card
  const y = useTransform(
    scrollYProgress,
    isFirst
      ? [0, 1]
      : [0, enterStart, enterEnd, 1],
    isFirst
      ? [0, 0]
      : [560, 560, 0, 0],
    { clamp: true }
  );

  // Subtle scale-down when covered by next card
  const scale = useTransform(
    scrollYProgress,
    isLast
      ? [0, 1]
      : [0, nextEnterStart, nextEnterEnd, 1],
    isLast
      ? [1, 1]
      : [1, 1, 0.97, 0.97],
    { clamp: true }
  );

  // 100% Solid Opacity: Never transparent while moving or sliding up, cleanly covers the card underneath
  const opacity = useTransform(
    scrollYProgress,
    isFirst
      ? [0, 1]
      : [0, Math.max(0, enterStart - 0.0001), enterStart, 1],
    isFirst
      ? [1, 1]
      : [0, 0, 1, 1],
    { clamp: true }
  );

  return (
    <motion.div
      style={{
        y,
        scale,
        opacity,
        zIndex: 10 + index,
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
      }}
      className="absolute inset-0 w-full h-full flex items-center justify-center will-change-transform snap-start snap-always scroll-snap-strict-child"
    >
      <CaseStudyCardContent
        project={project}
        currentVisual={currentVisual}
        previewAssets={previewAssets}
        isAr={isAr}
        dir={dir}
        onAssetSelect={onAssetSelect}
        onOpenCaseStudy={onOpenCaseStudy}
      />
    </motion.div>
  );
};

export const CaseStudyShowcase: React.FC<CaseStudyShowcaseProps> = ({
  onNavigate,
  onOpenConsultation,
  limit,
  showAllButton = true,
}) => {
  const { lang, isAr, dir } = useLanguage();
  const { getProjects } = useProjects();
  const allProjects = React.useMemo(() => getProjects(lang), [getProjects, lang]);
  const homeOrderedProjects = React.useMemo(() => {
    const withoutHalan = allProjects.filter((p) => p.id !== 'halan-delivery');
    const featuredIds = ['ladies-shop', 'zeyad-optical', 'namaa-academy', 'athar'];
    const featured = featuredIds
      .map((id) => withoutHalan.find((p) => p.id === id))
      .filter((p): p is ProjectItem => Boolean(p));

    if (limit) {
      return featured.length >= limit ? featured.slice(0, limit) : withoutHalan.slice(0, limit);
    }
    return featured.length > 0 ? featured : withoutHalan.slice(0, 4);
  }, [allProjects, limit]);
  const projects = homeOrderedProjects;

  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);
  const [selectedAssetMap, setSelectedAssetMap] = useState<Record<string, string>>({});
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 380);
    return () => clearTimeout(timer);
  }, [lang]);

  // Calculate dynamic container height based on total cards: 100vh per card ensures strict alignment and zero clipping
  const cardCount = Math.max(1, projects.length);
  const totalContainerHeight = `${cardCount * 100}vh`;

  // Pinned scroll progress across the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });

  // Subtle vertical parallax moving slightly slower than the scroll speed
  const headerParallaxY = useTransform(smoothProgress, [0, 0.5, 1], [-14, 0, 16]);
  const cardParallaxY = useTransform(smoothProgress, [0, 0.5, 1], [-18, 0, 22]);

  // Track active slide dynamically with scroll for the counter and indicators
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const step = 1 / Math.max(1, projects.length - 1);
    const rawIdx = Math.round(latest / step);
    const clamped = Math.min(projects.length - 1, Math.max(0, rawIdx));
    if (clamped !== activeIndex) {
      setActiveIndex(clamped);
    }
  });

  // Smooth click navigation to any card in the deck
  const handleSelectCard = (targetIdx: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const sectionTop = window.scrollY + rect.top;
    const totalScroll = containerRef.current.offsetHeight - window.innerHeight;
    const step = 1 / Math.max(1, projects.length - 1);
    const targetProgress = targetIdx * step;
    const targetY = sectionTop + targetProgress * totalScroll;
    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    });
    setActiveIndex(targetIdx);
  };

  // Touch handlers for horizontal swipe navigation on mobile/tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Swiped left
        if (isAr) {
          handleSelectCard(Math.max(0, activeIndex - 1));
        } else {
          handleSelectCard(Math.min(projects.length - 1, activeIndex + 1));
        }
      } else {
        // Swiped right
        if (isAr) {
          handleSelectCard(Math.min(projects.length - 1, activeIndex + 1));
        } else {
          handleSelectCard(Math.max(0, activeIndex - 1));
        }
      }
    }
    setTouchStartX(null);
  };

  const handleAssetSelect = (projectId: string, assetUrl: string) => {
    setSelectedAssetMap((prev) => ({
      ...prev,
      [projectId]: assetUrl,
    }));
  };

  const handleOpenCaseStudy = (project: ProjectItem) => {
    setActiveModalProject(project);
  };

  return (
    <>
      {/* Main Showcase Section with Strict CSS scroll-snap applied across Desktop, Tablet, and Mobile */}
      <section
        id="portfolio-section"
        ref={containerRef}
        style={{
          height: totalContainerHeight,
          scrollSnapType: 'y mandatory',
        }}
        className="relative bg-transparent snap-y snap-mandatory scroll-snap-strict-container scroll-smooth"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        aria-label={isAr ? 'الأعمال المختارة ودراسات الحالة' : 'Selected Works & Case Studies'}
      >
        {/* Dynamic Snap Anchors Track enforcing strict alignment for each card */}
        <div className="absolute inset-0 pointer-events-none flex flex-col z-0">
          {projects.map((proj, i) => (
            <div
              key={`snap-anchor-${proj.id}`}
              style={{
                height: '100vh',
                scrollSnapAlign: 'start',
                scrollSnapStop: 'always',
              }}
              className="w-full shrink-0 snap-start snap-always scroll-snap-strict-child"
              data-snap-card={i}
              aria-hidden="true"
            />
          ))}
        </div>

        {/* Stationary Viewport Stage */}
        <div className="sticky top-0 h-screen min-h-screen-dynamic max-h-screen w-full flex flex-col justify-between overflow-hidden pt-14 sm:pt-16 lg:pt-20 pb-3 sm:pb-4 lg:pb-6 z-20">
          {/* Dark Vignette */}
          <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-[#06050a]/80 via-transparent to-[#06050a]/90" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-between relative z-10">
            {/* Stage Header with vertical parallax moving slower than scroll */}
            <motion.div
              style={{ y: headerParallaxY }}
              className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-2 sm:mb-4 shrink-0 will-change-transform"
            >
              <div>
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                  {isAr ? (
                    <>
                      نماذج حقيقية.{' '}
                      <span className="text-purple-300">
                        صنعت الفارق في السوق.
                      </span>
                    </>
                  ) : (
                    <>
                      Selected Works.{' '}
                      <span className="text-purple-300">
                        Measurable Market Shift.
                      </span>
                    </>
                  )}
                </h2>

                <p className="mt-1 text-zinc-400 max-w-xl text-xs sm:text-sm leading-relaxed line-clamp-1">
                  {isAr
                    ? 'استعرض دراسات الحالة المتكاملة التي صاغتها أذرعنا: من الهوية والتصوير إلى المتاجر والحملات الإعلانية.'
                    : 'Deep-dive case studies engineered by Pulse OCTO: from brand architecture to high-velocity storefronts.'}
                </p>
              </div>

              {/* Interactive Navigation Control Suite: Pill Dots + Arrows + Archive Button */}
              <div className="flex flex-wrap items-center gap-2.5 self-start md:self-end">
                {/* Pill Dots */}
                <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-[#09080f]/90 border border-white/10">
                  {projects.map((_, i) => {
                    const isActive = i === activeIndex;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelectCard(i)}
                        className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                          isActive
                            ? 'w-6 sm:w-7 bg-[#7c3aed]'
                            : 'w-2 bg-white/20 hover:bg-white/45'
                        }`}
                        aria-label={`Go to case study 0${i + 1}`}
                      />
                    );
                  })}
                </div>

                {/* Arrow Controls (Previous / Next) */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSelectCard(Math.max(0, activeIndex - 1))}
                    disabled={activeIndex === 0}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border border-white/10 hover:border-purple-500/40 bg-[#09080f]/90 hover:bg-[#120e22] text-zinc-300 hover:text-white disabled:opacity-25 disabled:pointer-events-none transition-colors cursor-pointer active:scale-95"
                    aria-label="Previous card"
                  >
                    <ChevronLeft className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectCard(Math.min(projects.length - 1, activeIndex + 1))}
                    disabled={activeIndex === projects.length - 1}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border border-white/10 hover:border-purple-500/40 bg-[#09080f]/90 hover:bg-[#120e22] text-zinc-300 hover:text-white disabled:opacity-25 disabled:pointer-events-none transition-colors cursor-pointer active:scale-95"
                    aria-label="Next card"
                  >
                    <ChevronRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {showAllButton && onNavigate && (
                  <LiquidGlassButton
                    onClick={() => onNavigate('portfolio')}
                    variant="secondary"
                    size="sm"
                    className="px-3 min-h-[34px] text-xs"
                  >
                    <span>{isAr ? 'الأرشيف' : 'Archive'}</span>
                    <ArrowRight className={`w-3.5 h-3.5 text-purple-300 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                  </LiquidGlassButton>
                )}
              </div>
            </motion.div>

            {/* Stationary Cards Deck Stage: All cards stacked at exact location with snap alignment */}
            <motion.div
              style={{ y: cardParallaxY }}
              className="relative w-full max-w-5xl mx-auto h-[440px] sm:h-[470px] lg:h-[490px] max-h-[calc(100dvh-130px)] flex items-center justify-center my-auto will-change-transform"
            >
              {isInitializing ? (
                <div className="w-full h-full">
                  <PortfolioCardSkeleton className="w-full h-full" aspectRatio="wide" />
                </div>
              ) : (
                projects.map((proj, index) => {
                  const currentVisual = selectedAssetMap[proj.id] || proj.heroImage;
                  const previewAssets = [
                    proj.heroImage,
                    ...(proj.gallery || []).slice(0, 4),
                  ].filter((v, i, a) => Boolean(v) && a.indexOf(v) === i);

                  return (
                    <DeckCardItem
                      key={proj.id}
                      project={proj}
                      index={index}
                      total={projects.length}
                      scrollYProgress={scrollYProgress}
                      isAr={isAr}
                      dir={dir}
                      currentVisual={currentVisual}
                      previewAssets={previewAssets}
                      onAssetSelect={handleAssetSelect}
                      onOpenCaseStudy={handleOpenCaseStudy}
                    />
                  );
                })
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bottom Closing Callout (تظهر بعد فك التثبيت والانتقال السلس لأسفل) */}
      <div className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-white/[0.08] text-center max-w-4xl mx-auto z-10">
        <p className="text-base sm:text-lg font-bold text-white">
          {isAr
            ? 'كل مشروع في Pulse OCTO يُبنى كمنظومة متصلة — لا كخدمات منفصلة.'
            : 'Every milestone at Pulse OCTO is engineered as one unified system — not disjointed services.'}
        </p>
        <p className="mt-2 text-xs sm:text-sm text-zinc-400">
          {isAr
            ? '8 أذرع متناسقة تعمل معاً لربط هويتك، متجرك، وحملاتك الرقمية في نبض واحد مستمر.'
            : '8 synchronized disciplines operating in unison to ignite continuous brand momentum.'}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
          <LiquidGlassButton
            onClick={() => {
              if (onOpenConsultation) {
                onOpenConsultation();
              } else if (onNavigate) {
                onNavigate('contact');
              }
            }}
            variant="primary"
            size="md"
          >
            <span>{isAr ? 'ابدأ نبض مشروعك' : 'Ignite Your Brand Pulse'}</span>
            <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
          </LiquidGlassButton>

          {onNavigate && (
            <LiquidGlassButton
              onClick={() => onNavigate('portfolio')}
              variant="secondary"
              size="md"
            >
              <span>{isAr ? 'تصفح كافة دراسات الحالة' : 'Explore All Case Studies'}</span>
            </LiquidGlassButton>
          )}
        </div>
      </div>

      {/* Interactive Case Study Detail Modal with Reverse Exit Animation */}
      <AnimatePresence>
        {activeModalProject && (
          <ProjectDetailModal
            key={activeModalProject.id}
            project={activeModalProject}
            onClose={() => setActiveModalProject(null)}
            onOpenConsultation={() => {
              setActiveModalProject(null);
              if (onOpenConsultation) {
                onOpenConsultation();
              } else if (onNavigate) {
                onNavigate('contact');
              }
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};
