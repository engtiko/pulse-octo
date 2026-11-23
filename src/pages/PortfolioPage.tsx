import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageHeader } from '../components/PageHeader';
import { ProjectDetailModal } from '../components/ProjectDetailModal';
import { CaseStudiesGlassSection } from '../components/CaseStudiesGlassSection';
import { ScrollReveal } from '../components/ScrollReveal';
import { LiquidGlassButton } from '../components/LiquidGlassButton';
import { useLanguage } from '../context/LanguageContext';
import { useProjects } from '../context/ProjectsContext';
import { getOptimizedImageProps } from '../utils/imageOptimizer';
import { ProjectItem } from '../types';
import {
  ArrowRight,
  Palette,
  Globe,
  Megaphone,
  LayoutGrid,
  ExternalLink,
  ArrowUpRight,
} from 'lucide-react';

export type PortfolioFilterCategory = 'all' | 'brand' | 'storefront' | 'poster';

interface PortfolioPageProps {
  onNavigate: (page: string) => void;
  onOpenConsultation: () => void;
}

interface FilterCategoryItem {
  id: PortfolioFilterCategory;
  label: string;
  description: string;
  icon: React.FC<{ className?: string }>;
}

/**
 * Tall Glass Door Shimmer Skeleton Card displayed while filtering projects by category.
 */
const GlassDoorSkeletonCard: React.FC = () => (
  <div
    aria-hidden="true"
    className="relative aspect-[4/5] rounded-[32px] overflow-hidden bg-white/[0.02] border border-white/10 p-7 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.65)]"
  >
    {/* Sweeping Shimmer Beam */}
    <div className="absolute inset-0 -translate-x-full animate-shimmer-sweep bg-gradient-to-r from-transparent via-white/[0.06] to-transparent pointer-events-none z-10" />

    {/* Top Meta Placeholder */}
    <div className="flex items-center justify-between">
      <div className="h-3.5 w-12 rounded-full bg-white/10 animate-pulse" />
      <div className="flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-white/15 animate-pulse" />
        <div className="w-2.5 h-2.5 rounded-full bg-white/10 animate-pulse" />
        <div className="w-2.5 h-2.5 rounded-full bg-white/10 animate-pulse" />
      </div>
    </div>

    {/* Center Emblem Placeholder */}
    <div className="my-auto flex flex-col items-center justify-center py-8">
      <div className="w-36 h-36 rounded-3xl bg-white/[0.04] border border-white/10 animate-pulse" />
    </div>

    {/* Bottom Info Placeholder */}
    <div className="space-y-3 pt-4 border-t border-white/[0.08]">
      <div className="h-5 w-40 rounded-lg bg-white/15 animate-pulse" />
      <div className="h-3.5 w-52 rounded-md bg-white/[0.08] animate-pulse" />
    </div>
  </div>
);

/**
 * Returns the custom Glass Door visual theme for each client project so that
 * every card strictly respects the client's authentic logo & brand colors
 * (e.g., Royal Navy #08193B for Zeyad Optical, Rose Gold/Neutral Crystal for Ladies Shop with zero purple).
 */
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

function getGlassDoorStyle(project: ProjectItem) {
  switch (project.id) {
    case 'zeyad-optical':
      return {
        isSolidBrandBg: true,
        doorBgClass:
          'bg-[#08193B]/95 hover:bg-[#0A1E46] backdrop-blur-2xl',
        borderClass:
          'border-[#D4AF37]/30 hover:border-[#D4AF37]/70',
        topRimClass:
          'via-[#D4AF37]/60',
        ambientGlowStyle:
          'radial-gradient(circle at 50% 42%, rgba(212, 175, 55, 0.16), rgba(8, 25, 59, 0.96) 72%)',
        badgeTextClass: 'text-[#F5E6C8]',
        accentDotColor: '#D4AF37',
      };
    case 'ladies-shop':
      return {
        isSolidBrandBg: false,
        doorBgClass:
          'bg-white/[0.03] hover:bg-white/[0.05] backdrop-blur-2xl',
        borderClass:
          'border-[#D4A397]/25 hover:border-[#D4A397]/65',
        topRimClass:
          'via-[#D4A397]/60',
        ambientGlowStyle:
          'radial-gradient(circle at 50% 42%, rgba(212, 163, 151, 0.14), rgba(10, 9, 12, 0.4) 70%)',
        badgeTextClass: 'text-[#F8BBD0]',
        accentDotColor: '#E91E63',
      };
    case 'namaa-academy':
      return {
        isSolidBrandBg: false,
        doorBgClass:
          'bg-white/[0.03] hover:bg-white/[0.05] backdrop-blur-2xl',
        borderClass:
          'border-white/15 hover:border-[#D49B35]/60',
        topRimClass:
          'via-[#D49B35]/55',
        ambientGlowStyle:
          'radial-gradient(circle at 50% 42%, rgba(15, 76, 58, 0.22), rgba(8, 12, 10, 0.4) 70%)',
        badgeTextClass: 'text-[#F4F1EA]',
        accentDotColor: '#D49B35',
      };
    case 'halan-delivery':
      return {
        isSolidBrandBg: false,
        doorBgClass:
          'bg-white/[0.03] hover:bg-white/[0.05] backdrop-blur-2xl',
        borderClass:
          'border-white/15 hover:border-[#9ACA3C]/60',
        topRimClass:
          'via-[#9ACA3C]/55',
        ambientGlowStyle:
          'radial-gradient(circle at 50% 42%, rgba(154, 202, 60, 0.14), rgba(10, 12, 10, 0.4) 70%)',
        badgeTextClass: 'text-zinc-200',
        accentDotColor: '#9ACA3C',
      };
    case 'athar':
      return {
        isSolidBrandBg: false,
        doorBgClass:
          'bg-[#13090b]/85 hover:bg-[#1a0c0f]/90 backdrop-blur-2xl',
        borderClass:
          'border-[#C8A46B]/35 hover:border-[#C8A46B]/75',
        topRimClass:
          'via-[#C8A46B]/75',
        ambientGlowStyle:
          'radial-gradient(circle at 50% 42%, rgba(74, 18, 25, 0.36), rgba(14, 9, 10, 0.72) 72%)',
        badgeTextClass: 'text-[#F4ECE0]',
        accentDotColor: '#C8A46B',
      };
    case 'adamco':
      return {
        isSolidBrandBg: false,
        doorBgClass:
          'bg-white/[0.03] hover:bg-white/[0.05] backdrop-blur-2xl',
        borderClass:
          'border-white/15 hover:border-[#C0C5CE]/55',
        topRimClass:
          'via-[#C0C5CE]/55',
        ambientGlowStyle:
          'radial-gradient(circle at 50% 42%, rgba(158, 27, 30, 0.15), rgba(10, 10, 14, 0.4) 70%)',
        badgeTextClass: 'text-zinc-200',
        accentDotColor: '#9E1B1E',
      };
    default: {
      const primaryHex = project.brandColors?.[0]?.hex || '#8A2BE2';
      return {
        isSolidBrandBg: false,
        doorBgClass:
          'bg-white/[0.03] hover:bg-white/[0.05] backdrop-blur-2xl',
        borderClass:
          'border-white/15 hover:border-white/35',
        topRimClass:
          'via-white/40',
        ambientGlowStyle: `radial-gradient(circle at 50% 42%, ${hexToRgba(primaryHex, 0.22)}, rgba(8, 7, 14, 0.6) 72%)`,
        badgeTextClass: 'text-zinc-200',
        accentDotColor: primaryHex,
      };
    }
  }
}

/**
 * Returns the concise list of disciplines executed by Pulse OCTO for the given project.
 */
function getExecutedDisciplines(proj: ProjectItem, isAr: boolean): string[] {
  const list: string[] = [];

  if (proj.id === 'athar' || proj.isBrandInCreation) {
    list.push(isAr ? 'الشعار والهيدر' : 'Logo & Header');
    list.push(isAr ? 'دليل الهوية PDF' : 'Brand Book PDF');
    list.push(isAr ? 'أزياء محجبات مصرية 100%' : '100% Egyptian Modest Fashion');
    return list;
  }

  list.push(isAr ? 'الهوية البصرية' : 'Brand Identity');

  const hasPosters = Boolean(proj.assetShowcase?.some((a) => a.type === 'poster'));
  if (hasPosters) {
    list.push(isAr ? 'سوشيال ميديا' : 'Social Media');
  }

  if (proj.id === 'zeyad-optical') {
    list.push(isAr ? 'تصوير وموديلينج' : 'Studio & Modeling');
  }

  if (proj.websiteUrl) {
    list.push(isAr ? 'موقع إلكتروني' : 'Website');
  }

  if (proj.videos && proj.videos.length > 0) {
    list.push(isAr ? 'إنتاج مرئي' : 'Video Production');
  }

  return list;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  onNavigate,
  onOpenConsultation,
}) => {
  const { lang, isAr, dir } = useLanguage();
  const [modalProject, setModalProject] = useState<ProjectItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<PortfolioFilterCategory>('all');
  const [isFiltering, setIsFiltering] = useState<boolean>(false);
  const filterTimerRef = useRef<number | null>(null);

  const { getProjects } = useProjects();
  const allProjects = useMemo(() => getProjects(lang), [getProjects, lang]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const projectQuery = params.get('project');
    if (projectQuery) {
      const found = allProjects.find(
        (p) => p.slug === projectQuery || p.id === projectQuery
      );
      if (found) {
        setModalProject(found);
      }
    }
  }, [allProjects]);

  useEffect(() => {
    return () => {
      if (filterTimerRef.current) {
        window.clearTimeout(filterTimerRef.current);
      }
    };
  }, []);

  const handleSelectFilter = useCallback(
    (newFilter: PortfolioFilterCategory) => {
      if (newFilter === activeFilter) return;
      setActiveFilter(newFilter);
      setIsFiltering(true);
      if (filterTimerRef.current) {
        window.clearTimeout(filterTimerRef.current);
      }
      filterTimerRef.current = window.setTimeout(() => {
        setIsFiltering(false);
      }, 360);
    },
    [activeFilter]
  );

  const filterCategories = useMemo<FilterCategoryItem[]>(
    () => [
      {
        id: 'all',
        label: isAr ? 'الكل' : 'All Projects',
        description: isAr
          ? 'جميع المشاريع والعلامات التجارية'
          : 'All client brand systems and digital projects',
        icon: LayoutGrid,
      },
      {
        id: 'brand',
        label: isAr ? 'تصميم هوية' : 'Brand Identity',
        description: isAr
          ? 'الشعارات، الهويات البصرية، وأنظمة الألوان'
          : 'Logos, visual identity systems, and brand guidelines',
        icon: Palette,
      },
      {
        id: ' poster' as PortfolioFilterCategory, // normalized below
        label: '',
        description: '',
        icon: Megaphone,
      },
    ].filter(() => false), // replaced cleanly below
    [isAr]
  );

  const categoriesList = useMemo<FilterCategoryItem[]>(
    () => [
      {
        id: 'all',
        label: isAr ? 'الكل' : 'All',
        description: isAr
          ? 'جميع مشاريع الهوية البصرية والسوشيال ميديا والمواقع'
          : 'All brand identity, social media, and web development projects',
        icon: LayoutGrid,
      },
      {
        id: 'brand',
        label: isAr ? 'تصميم هوية' : 'Brand Identity',
        description: isAr
          ? 'تصميم الشعارات والأنظمة البصرية الكاملة'
          : 'Logo design, brandmarks, and complete visual systems',
        icon: Palette,
      },
      {
        id: 'poster',
        label: isAr ? 'تسويق رقمي' : 'Social & Marketing',
        description: isAr
          ? 'تصميمات السوشيال ميديا، الحملات الإعلانية، وصناعة المحتوى'
          : 'Social media designs, ad creatives, and campaign production',
        icon: Megaphone,
      },
      {
        id: 'storefront',
        label: isAr ? 'مواقع إلكترونية' : 'Websites',
        description: isAr
          ? 'المتاجر والمواقع الإلكترونية التي قمنا بتصميمها وبرمجتها بالكامل'
          : 'Custom e-commerce stores and websites engineered by Pulse OCTO',
        icon: Globe,
      },
    ],
    [isAr]
  );

  // Filter agency projects based on selected category (strictly accurate per client deliverables)
  const filteredProjects = useMemo(() => {
    if (activeFilter === 'all') return allProjects;
    return allProjects.filter((proj) => {
      if (activeFilter === 'storefront') {
        // Only show projects where Pulse OCTO actually built the website
        return Boolean(proj.websiteUrl);
      }
      if (activeFilter === 'brand') {
        return (
          Boolean(proj.logo) ||
          Boolean(proj.brandNarrative) ||
          Boolean(proj.brandGuidelinesPdf) ||
          Boolean(
            proj.assetShowcase?.some(
              (a) => a.type === 'brand' || a.type === 'cover' || a.type === 'mockup'
            )
          )
        );
      }
      if (activeFilter === 'poster') {
        return Boolean(proj.assetShowcase?.some((a) => a.type === 'poster'));
      }
      return true;
    });
  }, [allProjects, activeFilter]);

  return (
    <div className="relative min-h-screen bg-[#050408] text-white">
      {/* 1. Minimalist Luxury Page Header: "Projects" / "مشاريعنا" */}
      <PageHeader
        title={isAr ? 'مشاريعنا' : 'Projects'}
        sectionType="portfolio"
        videoSrc="/videos/pulse-video-7.mp4"
        description={
          isAr
            ? 'نخبة من العلامات التجارية التي بنينا هويتها البصرية، تصميماتها الإبداعية، ومنصاتها الرقمية.'
            : 'Selected brands powered by Pulse OCTO across visual identity, social media design, and web development.'
        }
        onGoHome={() => onNavigate('home')}
        ctaText={isAr ? 'ابدأ نبض مشروعك' : 'Ignite Your Pulse'}
        onCtaClick={() => onNavigate('contact')}
        secondaryCtaText={isAr ? 'تواصل معنا' : 'Contact Us'}
        onSecondaryCtaClick={onOpenConsultation}
      />

      {/* 2. Calm Luxury Filter Bar + Glass Door Portals Grid */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Category Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 mb-10 border-b border-white/[0.08]">
          <div
            role="tablist"
            aria-label={isAr ? 'تصنيفات المشاريع' : 'Project Categories'}
            className="flex flex-wrap items-center gap-2 sm:gap-2.5"
          >
            {categoriesList.map((cat) => {
              const Icon = cat.icon;
              const isSelected = activeFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => handleSelectFilter(cat.id)}
                  className={`group relative inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer border ${
                    isSelected
                      ? 'bg-white/[0.10] text-white border-white/30 shadow-[0_8px_24px_rgba(0,0,0,0.5)]'
                      : 'bg-white/[0.02] hover:bg-white/[0.05] text-zinc-400 hover:text-white border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isSelected ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'
                    }`}
                  />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3 text-xs text-zinc-400">
            <span className="hidden lg:inline-block">
              {categoriesList.find((c) => c.id === activeFilter)?.description}
            </span>
            <a
              href="#case-studies"
              className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.10] border border-white/10 text-zinc-200 hover:text-white font-semibold transition-colors whitespace-nowrap shrink-0"
            >
              {isAr ? 'دراسات الحالة التفصيلية' : 'Interactive Case Studies'}
            </a>
            <span className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 font-mono tabular-nums text-zinc-200 whitespace-nowrap shrink-0">
              {isFiltering
                ? isAr
                  ? 'جارٍ التحميل...'
                  : 'Loading...'
                : isAr
                ? `${filteredProjects.length} مشاريع`
                : `${filteredProjects.length} Projects`}
            </span>
          </div>
        </div>

        {/* 3. Glass Door Portals Grid (Option B — الأبواب الزجاجية الطولية) */}
        {isFiltering ? (
          <div
            role="status"
            aria-label={isAr ? 'جارٍ تحميل المشاريع...' : 'Loading projects...'}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {Array.from({ length: 3 }).map((_, idx) => (
              <GlassDoorSkeletonCard key={idx} />
            ))}
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((proj, index) => {
                const doorStyle = getGlassDoorStyle(proj);
                const disciplines = getExecutedDisciplines(proj, isAr);
                const logoOpt = proj.logo
                  ? getOptimizedImageProps(proj.logo, { isLogo: true })
                  : null;
                const heroOpt = getOptimizedImageProps(proj.heroImage, { isLogo: true });

                return (
                  <motion.article
                    layout
                    key={proj.id}
                    initial={{ opacity: 0, y: 20, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      duration: 0.42,
                      delay: index * 0.06,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    onClick={() => setModalProject(proj)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setModalProject(proj);
                      }
                    }}
                    aria-label={
                      isAr
                        ? `استعراض مشروع ${proj.client}`
                        : `Explore ${proj.client} case study`
                    }
                    className={`group relative aspect-[4/5] rounded-[32px] overflow-hidden border ${doorStyle.borderClass} ${doorStyle.doorBgClass} p-6 sm:p-8 flex flex-col justify-between transition-all duration-500 cursor-pointer shadow-[0_24px_60px_rgba(0,0,0,0.75)] hover:-translate-y-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40`}
                  >
                    {/* Top Specular Rim */}
                    <div
                      className={`absolute top-0 inset-x-10 h-px bg-gradient-to-r from-transparent ${doorStyle.topRimClass} to-transparent pointer-events-none z-20`}
                    />

                    {/* Subtle Diffused Glimpse Behind the Frosted Glass Door (only for transparent glass doors with a hero visual) */}
                    {!doorStyle.isSolidBrandBg && Boolean(proj.heroImage) && (
                      <img
                        src={heroOpt.src}
                        alt=""
                        aria-hidden="true"
                        width={360}
                        height={450}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover scale-110 blur-3xl opacity-[0.14] group-hover:opacity-[0.22] transition-opacity duration-700 pointer-events-none select-none"
                      />
                    )}

                    {/* Brand-Authentic Ambient Lighting Layer */}
                    <div
                      className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-85 group-hover:opacity-100"
                      style={{ background: doorStyle.ambientGlowStyle }}
                    />

                    {/* Frosted Glass Door Inner Frame Line */}
                    <div className="absolute inset-3 rounded-[24px] border border-white/[0.05] group-hover:border-white/[0.10] pointer-events-none transition-colors duration-500 z-10" />

                    {/* Top Bar: Index Number + Authentic Brand Color Dots */}
                    <div className="relative z-20 flex items-center justify-between gap-3">
                      <span className="font-mono text-xs tracking-widest text-white/45 group-hover:text-white/75 transition-colors">
                        0{index + 1}
                      </span>

                      <div className="flex items-center gap-2">
                        {proj.brandColors && proj.brandColors.length > 0 && (
                          <div
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-md border border-white/10"
                            title={isAr ? 'ألوان الهوية البصرية' : 'Brand Color Palette'}
                          >
                            {proj.brandColors.slice(0, 3).map((c, cIdx) => (
                              <span
                                key={cIdx}
                                className="w-2.5 h-2.5 rounded-full border border-white/25"
                                style={{ backgroundColor: c.hex }}
                              />
                            ))}
                          </div>
                        )}

                        {proj.websiteUrl && (
                          <a
                            href={proj.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            title={isAr ? 'زيارة الموقع المباشر' : 'Visit Live Website'}
                            className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/[0.16] border border-white/15 text-white flex items-center justify-center transition-all"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Center Stage: Official Client Logo Floating Directly on the Glass Door (Zero White Box!) */}
                    <div className="relative z-20 my-auto py-6 flex items-center justify-center">
                      {logoOpt ? (
                        <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center transition-transform duration-700 ease-out group-hover:scale-105">
                          <img
                            src={logoOpt.src}
                            srcSet={logoOpt.srcSet}
                            sizes="(max-width: 640px) 176px, 208px"
                            alt={
                              isAr
                                ? `شعار ${proj.client}`
                                : `${proj.client} Official Logo`
                            }
                            width={208}
                            height={208}
                            loading={index < 3 ? 'eager' : 'lazy'}
                            decoding="async"
                            className={`w-full h-full object-contain ${
                              proj.id === 'athar'
                                ? 'rounded-2xl border border-[#C8A46B]/45 shadow-[0_18px_45px_rgba(0,0,0,0.75)]'
                                : doorStyle.isSolidBrandBg
                                  ? 'rounded-2xl'
                                  : 'drop-shadow-[0_16px_36px_rgba(0,0,0,0.65)]'
                            }`}
                          />
                        </div>
                      ) : (
                        <div className="relative w-52 h-52 sm:w-56 sm:h-56 rounded-3xl border border-[#D6B88D]/25 bg-gradient-to-b from-[#17120e]/80 to-[#0a0807]/90 flex flex-col items-center justify-center p-5 text-center transition-transform duration-700 ease-out group-hover:scale-105 shadow-[0_18px_40px_rgba(0,0,0,0.65)]">
                          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D6B88D]/85 mb-2">
                            {proj.id === 'athar' ? 'ATHAR • 100% EGYPTIAN' : 'BRAND IN CREATION'}
                          </span>
                          <span className="text-4xl sm:text-5xl font-black text-[#F3ECE2] tracking-tight leading-none">
                            {proj.id === 'athar' ? 'أثـر' : proj.client}
                          </span>
                          <span className="mt-3 px-3 py-1 rounded-full bg-[#D6B88D]/10 border border-[#D6B88D]/30 text-[11px] font-semibold text-[#D6B88D]">
                            {isAr ? 'أزياء محجبات • قيد التأسيس' : 'Modest Fashion • In Creation'}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Bottom Reveal Bar: Client Name + Executed Disciplines + Portal Action */}
                    <div className="relative z-20 pt-5 border-t border-white/[0.08] flex items-end justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5 mb-2">
                          {disciplines.map((disc, dIdx) => (
                            <React.Fragment key={disc}>
                              <span className="text-[11px] font-medium text-zinc-300/90">
                                {disc}
                              </span>
                              {dIdx < disciplines.length - 1 && (
                                <span
                                  aria-hidden="true"
                                  className="text-white/25 text-[10px]"
                                >
                                  •
                                </span>
                              )}
                            </React.Fragment>
                          ))}
                        </div>

                        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight truncate group-hover:text-white transition-colors">
                          {isAr ? proj.client : proj.clientEn || proj.client}
                        </h2>
                      </div>

                      <div className="w-10 h-10 rounded-2xl bg-white/[0.05] group-hover:bg-white/[0.14] border border-white/15 flex items-center justify-center text-zinc-300 group-hover:text-white transition-all duration-300 shrink-0">
                        <ArrowUpRight
                          className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${
                            dir === 'rtl' ? '-scale-x-100' : ''
                          }`}
                        />
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* 3.5 Interactive Glassmorphism Case Studies Section (Challenge, Solution & Result) */}
      <CaseStudiesGlassSection
        projects={filteredProjects}
        onSelectProject={(proj) => setModalProject(proj)}
      />

      {/* 4. Interactive Modular Client Case Study Modal (Brand Identity -> Social Media -> Website) */}
      <AnimatePresence>
        {modalProject && (
          <ProjectDetailModal
            key={modalProject.id}
            project={modalProject}
            onClose={() => setModalProject(null)}
            onOpenConsultation={onOpenConsultation}
          />
        )}
      </AnimatePresence>

      {/* 5. Calm Luxury Bottom Conversion CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <ScrollReveal variant="scale-up" threshold={0.2}>
          <div className="rounded-3xl bg-white/[0.02] backdrop-blur-2xl border border-white/10 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className={dir === 'rtl' ? 'text-right' : 'text-left'}>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                {isAr
                  ? 'هل أنت مستعد لبناء هوية ومنظومة رقمية متكاملة لعلامتك؟'
                  : 'Ready to Build an Integrated Brand & Digital System?'}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 max-w-xl">
                {isAr
                  ? 'نجمع بين تصميم الهوية البصرية، المحتوى الإبداعي، وتطوير المواقع في منظومة واحدة مترابطة.'
                  : 'We unite brand identity, social media design, and custom web development under one roof.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <LiquidGlassButton
                onClick={() => onNavigate('contact')}
                variant="primary"
                size="md"
              >
                <span>{isAr ? 'ابدأ نبض مشروعك' : 'Ignite Your Pulse'}</span>
                <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              </LiquidGlassButton>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};

