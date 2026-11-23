import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { ProjectItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useProjects } from '../context/ProjectsContext';
import { getOptimizedImageProps } from '../utils/imageOptimizer';
import { LiquidGlassButton } from './LiquidGlassButton';
import { ProjectGallery } from './ProjectGallery';
import {
  ArrowRight,
  ArrowLeft,
  X,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Globe,
  Film,
  Copy,
  Check,
  Link2,
} from 'lucide-react';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  onClose: () => void;
  onOpenConsultation: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project: initialProject,
  onClose,
  onOpenConsultation,
}) => {
  const { lang, isAr, dir } = useLanguage();
  const [currentProject, setCurrentProject] = useState<ProjectItem | null>(initialProject);
  const [isMounted, setIsMounted] = useState(false);
  const [externalLightboxUrl, setExternalLightboxUrl] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedExternalId, setCopiedExternalId] = useState<string | null>(null);

  const mainContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (initialProject) {
      setCurrentProject(initialProject);
    }
  }, [initialProject]);

  const { getProjects } = useProjects();
  const allProjects = useMemo(() => getProjects(lang), [getProjects, lang]);
  const selectedRef = currentProject || initialProject;
  const project = useMemo(
    () =>
      selectedRef
        ? allProjects.find((p) => p.id === selectedRef.id) || selectedRef
        : null,
    [allProjects, selectedRef]
  );

  const currentProjectIndex = useMemo(() => {
    if (!project) return 0;
    const idx = allProjects.findIndex((p) => p.id === project.id);
    return idx >= 0 ? idx : 0;
  }, [allProjects, project]);

  const prevProject =
    allProjects[(currentProjectIndex - 1 + allProjects.length) % allProjects.length];
  const nextProject = allProjects[(currentProjectIndex + 1) % allProjects.length];

  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 320);
  }, [isClosing, onClose]);

  const handleCopyProjectLink = useCallback(() => {
    if (!project) return;
    const shareUrl =
      project.websiteUrl ||
      `${window.location.origin}/portfolio?project=${project.slug || project.id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    });
  }, [project]);

  const handleCopyExternalPostUrl = useCallback((id: string, url: string) => {
    navigator.clipboard?.writeText(url).then(() => {
      setCopiedExternalId(id);
      setTimeout(() => setCopiedExternalId(null), 1800);
    });
  }, []);

  const handleSwitchProject = useCallback((targetProject: ProjectItem) => {
    setCurrentProject(targetProject);
    setExternalLightboxUrl(null);
    if (mainContainerRef.current) {
      mainContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Lock background body scroll while modal is open
  useEffect(() => {
    if (!project) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [project]);

  // Strict Zero-Duplication Asset Partitioning:
  // 1. Brand Identity Visuals (Official Logo + Brand Covers + 3D Brand Emblems)
  // 2. Mockup Visuals (type === 'mockup')
  // 3. Collection Lookbook Visuals (type === 'lookbook' or extra gallery items for fashion collections)
  // 4. Studio Product Photography (for Zeyad Optical ZS1..ZS3)
  // 5. Social Media Posts (type === 'poster', deduplicated)
  // 6. External Post Links (project.externalPostLinks)
  // 7. Website Storefront Visuals (ONLY if project.websiteUrl exists, deduplicated)
  const {
    brandVisuals,
    mockupVisuals,
    lookbookVisuals,
    studioProductVisuals,
    socialPosters,
    externalPostLinks,
    websiteVisuals,
  } = useMemo(() => {
    if (!project) {
      return {
        brandVisuals: [],
        mockupVisuals: [],
        lookbookVisuals: [],
        studioProductVisuals: [],
        socialPosters: [],
        externalPostLinks: [],
        websiteVisuals: [],
      };
    }

    const seenUrls = new Set<string>();
    if (project.logo) {
      seenUrls.add(project.logo);
    }

    const showcase = project.assetShowcase || [];

    const brandItems: NonNullable<ProjectItem['assetShowcase']> = [];
    if (project.heroImage && !seenUrls.has(project.heroImage)) {
      const matchingCover = showcase.find((a) => a.url === project.heroImage);
      brandItems.push(
        matchingCover || {
          url: project.heroImage,
          title: project.client,
          type: 'cover',
          description: project.summary,
        }
      );
      seenUrls.add(project.heroImage);
    }

    showcase.forEach((item) => {
      if ((item.type === 'cover' || item.type === 'brand') && !seenUrls.has(item.url)) {
        brandItems.push(item);
        seenUrls.add(item.url);
      }
    });

    const mockupItems: NonNullable<ProjectItem['assetShowcase']> = [];
    showcase.forEach((item) => {
      if (item.type === 'mockup' && !seenUrls.has(item.url)) {
        mockupItems.push(item);
        seenUrls.add(item.url);
      }
    });

    const lookbookItems: NonNullable<ProjectItem['assetShowcase']> = [];
    showcase.forEach((item) => {
      if (item.type === 'lookbook' && !seenUrls.has(item.url)) {
        lookbookItems.push(item);
        seenUrls.add(item.url);
      }
    });

    if (project.id === 'athar' && project.gallery && project.gallery.length > 0) {
      project.gallery.forEach((url, idx) => {
        if (!url || seenUrls.has(url)) return;
        seenUrls.add(url);
        lookbookItems.push({
          url,
          title: `أثر — تصميم ${idx + 1}`,
          titleEn: `Athar — Look ${idx + 1}`,
          type: 'lookbook',
          description: 'تصميم وتنفيذ ملابس محجبات مصرية 100%',
          descriptionEn: '100% Egyptian modest fashion design and tailoring',
        });
      });
    }

    const studioItems: NonNullable<ProjectItem['assetShowcase']> = [];
    if (project.id === 'zeyad-optical') {
      showcase.forEach((item) => {
        if (item.type === 'storefront' && !seenUrls.has(item.url)) {
          studioItems.push(item);
          seenUrls.add(item.url);
        }
      });
    }

    const posterItems: NonNullable<ProjectItem['assetShowcase']> = [];
    showcase.forEach((item) => {
      if (item.type === 'poster' && !seenUrls.has(item.url)) {
        posterItems.push(item);
        seenUrls.add(item.url);
      }
    });

    const webItems: NonNullable<ProjectItem['assetShowcase']> = [];
    if (project.websiteUrl) {
      showcase.forEach((item) => {
        if (item.type === 'storefront' && !seenUrls.has(item.url)) {
          webItems.push(item);
          seenUrls.add(item.url);
        }
      });
    }

    return {
      brandVisuals: brandItems,
      mockupVisuals: mockupItems,
      lookbookVisuals: lookbookItems,
      studioProductVisuals: studioItems,
      socialPosters: posterItems,
      externalPostLinks: project.externalPostLinks || [],
      websiteVisuals: webItems,
    };
  }, [project]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(`cs-sec-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Esc to close modal (when Lightbox in ProjectGallery is not open, ProjectGallery stops propagation in capture phase)
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, handleClose]);

  if (!isMounted || !project || typeof document === 'undefined') return null;

  const primaryAccentHex = project.brandColors?.[0]?.hex || '#D4AF37';
  const secondaryAccentHex = project.brandColors?.[1]?.hex || '#ffffff';

  const whatsappInquiryUrl = `https://wa.me/201116066968?text=${encodeURIComponent(
    isAr
      ? `مرحباً Pulse OCTO، أود الاستفسار حول تنفيذ مشروع مشابه لـ (${project.client}).`
      : `Hello Pulse OCTO, I would like to inquire about a project similar to (${project.client}).`
  )}`;

  return createPortal(
    <motion.div
      ref={mainContainerRef}
      initial={{ opacity: 0, scale: 0.92, filter: 'blur(16px)', y: 24 }}
      animate={
        isClosing
          ? {
              opacity: 0,
              scale: 0.94,
              filter: 'blur(14px)',
              y: 18,
              transition: { duration: 0.32, ease: [0.32, 0, 0.67, 0] },
            }
          : {
              opacity: 1,
              scale: 1,
              filter: 'blur(0px)',
              y: 0,
              transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
            }
      }
      exit={{
        opacity: 0,
        scale: 0.94,
        filter: 'blur(14px)',
        y: 18,
        transition: { duration: 0.32, ease: [0.32, 0, 0.67, 0] },
      }}
      className="fixed inset-0 z-[1000] overflow-y-auto bg-[#050408] text-white selection:bg-white/20 selection:text-white will-change-[transform,opacity,filter]"
      dir={dir}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.client} Case Study`}
    >
      {/* ============================================================
          1. LUXURY MINIMALIST STICKY TOP NAVIGATION BAR
         ============================================================ */}
      <header className="sticky top-0 z-50 w-full px-4 sm:px-8 py-3.5 bg-[#050408]/90 backdrop-blur-2xl border-b border-white/[0.08] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] border border-white/10 hover:border-white/25 text-xs sm:text-sm font-semibold text-white transition-all cursor-pointer active:scale-95 shrink-0"
          >
            <ArrowLeft
              className={`w-4 h-4 text-zinc-300 group-hover:-translate-x-0.5 ${
                dir === 'rtl' ? 'rotate-180 group-hover:translate-x-0.5' : ''
              } transition-transform`}
            />
            <span>{isAr ? 'العودة للمشاريع' : 'Back to Projects'}</span>
          </button>

          {/* Project Switcher */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-xl bg-white/[0.03] border border-white/[0.08]">
            <button
              type="button"
              onClick={() => handleSwitchProject(prevProject)}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title={isAr ? `السابق: ${prevProject.client}` : `Previous: ${prevProject.client}`}
            >
              <ChevronRight
                className={`w-3.5 h-3.5 ${dir === 'rtl' ? '' : 'rotate-180'}`}
              />
            </button>
            <span className="text-[11px] font-mono text-zinc-300 px-1.5 whitespace-nowrap">
              {currentProjectIndex + 1} / {allProjects.length}
            </span>
            <button
              type="button"
              onClick={() => handleSwitchProject(nextProject)}
              className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title={isAr ? `التالي: ${nextProject.client}` : `Next: ${nextProject.client}`}
            >
              <ChevronLeft
                className={`w-3.5 h-3.5 ${dir === 'rtl' ? '' : 'rotate-180'}`}
              />
            </button>
          </div>
        </div>

        {/* Dynamic Section Anchors: Story -> Brand Identity -> Mockup -> Lookbook -> Social Media -> External Links -> Website -> Videos */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-medium text-zinc-400">
          {project.brandNarrative && (
            <button
              type="button"
              onClick={() => scrollToSection('story')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {isAr ? 'قصة البراند' : 'Brand Story'}
            </button>
          )}
          <button
            type="button"
            onClick={() => scrollToSection('identity')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            {isAr ? 'الهوية البصرية' : 'Brand Identity'}
          </button>
          {(mockupVisuals.length > 0 || project.isBrandInCreation) && (
            <button
              type="button"
              onClick={() => scrollToSection('mockup')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {isAr ? 'الموك اب' : 'Mockup'}
            </button>
          )}
          {(lookbookVisuals.length > 0 || project.isBrandInCreation) && (
            <button
              type="button"
              onClick={() => scrollToSection('lookbook')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {isAr ? 'تشكيلة الأزياء' : 'Lookbook'}
            </button>
          )}
          {socialPosters.length > 0 && (
            <button
              type="button"
              onClick={() => scrollToSection('social')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {isAr ? 'منشورات التواصل' : 'Social Media Posts'}
            </button>
          )}
          {externalPostLinks.length > 0 && (
            <button
              type="button"
              onClick={() => scrollToSection('links')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {isAr ? 'الروابط الخارجية للبوستات' : 'External Post Links'}
            </button>
          )}
          {project.websiteUrl && (
            <button
              type="button"
              onClick={() => scrollToSection('website')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {isAr ? 'الموقع الإلكتروني' : 'Website'}
            </button>
          )}
          {project.videos && project.videos.length > 0 && (
            <button
              type="button"
              onClick={() => scrollToSection('videos')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              {isAr ? 'الإنتاج المرئي' : 'Media Production'}
            </button>
          )}
        </nav>

        {/* Actions: Visit Live Project (Only if websiteUrl exists) + Copy Link + Close */}
        <div className="flex items-center gap-2">
          {project.websiteUrl && (
            <a
              href={project.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 font-bold text-xs transition-all cursor-pointer shrink-0"
              title={isAr ? 'زيارة الموقع المباشر' : 'Visit Live Website'}
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {isAr ? 'زيارة الموقع المباشر' : 'Visit Live Project'}
              </span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}

          <button
            type="button"
            onClick={handleCopyProjectLink}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer shrink-0 ${
              copiedLink
                ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-200'
                : 'bg-white/[0.04] hover:bg-white/[0.09] border-white/10 text-zinc-300 hover:text-white'
            }`}
            title={isAr ? 'نسخ رابط المشروع' : 'Copy Link'}
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">{isAr ? 'تم النسخ' : 'Copied'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-zinc-400" />
                <span className="hidden sm:inline">{isAr ? 'نسخ الرابط' : 'Copy Link'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleClose}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.10] border border-white/10 text-zinc-300 hover:text-white text-xs font-semibold transition-all cursor-pointer shrink-0"
            aria-label={isAr ? 'إغلاق' : 'Close'}
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">{isAr ? 'إغلاق' : 'Close'}</span>
          </button>
        </div>
      </header>

      {/* ============================================================
          MAIN LUXURY MINIMALIST CASE STUDY CANVAS (ZERO DUPLICATION)
         ============================================================ */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-10 py-12 sm:py-20 space-y-24 sm:space-y-28">
        {/* ============================================================
            CONCISE PROJECT INTRO HEADER
           ============================================================ */}
        <section className="text-center max-w-3xl mx-auto">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-medium text-zinc-300 mb-5">
            <span
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor:
                  project.id === 'athar' ? '#D6B88D' : primaryAccentHex,
              }}
            />
            <span>{project.tag}</span>
            {(project.originBadge || project.originBadgeEn) && (
              <>
                <span className="text-white/25">•</span>
                <span className="text-[#D6B88D] font-semibold">
                  {isAr
                    ? project.originBadge
                    : project.originBadgeEn || project.originBadge}
                </span>
              </>
            )}
            <span className="text-white/25">•</span>
            <span className="font-mono">{project.year || '2026'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.12]">
            {isAr ? project.client : project.clientEn || project.client}
          </h1>

          <p className="mt-5 text-sm sm:text-lg text-zinc-400 leading-relaxed font-normal">
            {project.summary}
          </p>
        </section>

        {/* ============================================================
            SECTION 00: BRAND STORY & FOUNDER VISION (قصة العلامة ورؤية التأسيس)
            Rendered when project.brandNarrative exists (e.g., Athar Modest Fashion)
           ============================================================ */}
        {project.brandNarrative && (
          <section id="cs-sec-story" className="scroll-mt-24">
            <div className="rounded-3xl bg-gradient-to-b from-[#130f0c]/85 via-[#0a0807] to-[#060508] border border-[#D6B88D]/25 p-7 sm:p-12 shadow-[0_24px_60px_rgba(0,0,0,0.75)]">
              <div className="max-w-4xl space-y-6">
                <div className="text-[11px] font-mono uppercase tracking-[0.22em] text-[#D6B88D]">
                  {isAr
                    ? project.brandNarrative.eyebrow
                    : project.brandNarrative.eyebrowEn || project.brandNarrative.eyebrow}
                </div>

                <h2 className="text-2xl sm:text-4xl font-black text-[#F3ECE2] tracking-tight leading-snug">
                  {isAr
                    ? project.brandNarrative.headline
                    : project.brandNarrative.headlineEn || project.brandNarrative.headline}
                </h2>

                {(project.brandNarrative.founderQuote || project.brandNarrative.founderQuoteEn) && (
                  <blockquote className="ps-5 border-s-2 border-[#D6B88D] text-base sm:text-xl font-medium text-white/95 leading-relaxed">
                    “
                    {isAr
                      ? project.brandNarrative.founderQuote
                      : project.brandNarrative.founderQuoteEn ||
                        project.brandNarrative.founderQuote}
                    ”
                  </blockquote>
                )}

                <div className="space-y-4">
                  {(isAr
                    ? project.brandNarrative.paragraphs
                    : project.brandNarrative.paragraphsEn || project.brandNarrative.paragraphs
                  ).map((para, pIdx) => (
                    <p
                      key={pIdx}
                      className="text-sm sm:text-base text-zinc-300 leading-relaxed"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              {project.brandNarrative.pillars && project.brandNarrative.pillars.length > 0 && (
                <div className="mt-10 pt-8 border-t border-white/[0.08] grid grid-cols-1 md:grid-cols-3 gap-5">
                  {project.brandNarrative.pillars.map((pillar, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl bg-black/40 border border-white/[0.07] p-5 space-y-2"
                    >
                      <span className="text-[11px] font-mono text-[#D6B88D]/85">
                        0{idx + 1}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-white">
                        {isAr ? pillar.title : pillar.titleEn || pillar.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                        {isAr ? pillar.detail : pillar.detailEn || pillar.detail}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ============================================================
            PROJECT GALLERY BENTO GRID (01: الهوية البصرية + الموك اب + التشكيلة + 02: منشورات السوشيال ميديا)
            Includes Full-Screen Lightbox Viewer on click
           ============================================================ */}
        <ProjectGallery
          project={project}
          brandVisuals={brandVisuals}
          mockupVisuals={mockupVisuals}
          lookbookVisuals={lookbookVisuals}
          studioProductVisuals={studioProductVisuals}
          socialPosters={socialPosters}
          extraLightboxItems={websiteVisuals.map((w) => ({
            url: w.url,
            caption: isAr ? w.title : w.titleEn || w.title,
          }))}
          externalActiveUrl={externalLightboxUrl}
          onClearExternalActiveUrl={() => setExternalLightboxUrl(null)}
        />

        {/* ============================================================
            SECTION 03: EXTERNAL POST LINKS (قسم الروابط الخارجية للبوستات)
            Dedicated Luxury Minimalist Link Hub — Zero Image Duplication
           ============================================================ */}
        {externalPostLinks.length > 0 && (
          <section id="cs-sec-links" className="scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 sm:mb-10 border-b border-white/[0.08]">
              <div>
                <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 mb-2">
                  <Link2 className="w-3.5 h-3.5" style={{ color: primaryAccentHex }} />
                  <span>03 // EXTERNAL POST LINKS</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                  {isAr
                    ? 'الروابط الخارجية للبوستات والحملات'
                    : 'External Post Links & Live Channels'}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-md">
                {isAr
                  ? 'روابط مباشرة لتصفح البوستات المنشورة والتفاعل الحي على منصات التواصل الاجتماعي.'
                  : 'Direct external links to inspect live published posts and real-time audience engagement.'}
              </p>
            </div>

            <div className="space-y-3.5">
              {externalPostLinks.map((linkItem, idx) => {
                const isCopied = copiedExternalId === linkItem.id;
                const displayTitle = isAr
                  ? linkItem.title
                  : linkItem.titleEn || linkItem.title;
                const displayTag = isAr ? linkItem.tag : linkItem.tagEn || linkItem.tag;

                return (
                  <div
                    key={linkItem.id}
                    className="group rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 hover:border-white/25 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-300"
                  >
                    <div className="flex items-start sm:items-center gap-4 min-w-0">
                      <span
                        className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-xs font-mono font-bold shrink-0"
                        style={{ color: primaryAccentHex }}
                      >
                        {String(idx + 1).padStart(2, '0')}
                      </span>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[10px] font-mono uppercase tracking-wider text-zinc-300">
                            {linkItem.platform}
                          </span>
                          {displayTag && (
                            <span className="text-[11px] text-zinc-400">
                              • {displayTag}
                            </span>
                          )}
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-white truncate">
                          {displayTitle}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopyExternalPostUrl(linkItem.id, linkItem.url)}
                        className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          isCopied
                            ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-200'
                            : 'bg-white/[0.04] hover:bg-white/[0.09] border-white/10 text-zinc-300 hover:text-white'
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{isAr ? 'تم نسخ الرابط' : 'Copied'}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-zinc-400" />
                            <span>{isAr ? 'نسخ الرابط' : 'Copy Link'}</span>
                          </>
                        )}
                      </button>

                      <a
                        href={linkItem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black hover:bg-zinc-200 text-xs font-bold transition-all cursor-pointer"
                      >
                        <span>
                          {isAr ? 'فتح البوست الخارجي' : 'Open External Post'}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ============================================================
            SECTION 04: WEBSITE DEVELOPMENT (تطوير الموقع الإلكتروني)
            Rendered ONLY when Pulse OCTO built the client's website (project.websiteUrl)
           ============================================================ */}
        {project.websiteUrl && (
          <section id="cs-sec-website" className="scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 sm:mb-10 border-b border-white/[0.08]">
              <div>
                <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 mb-2">
                  <Globe className="w-3.5 h-3.5" style={{ color: primaryAccentHex }} />
                  <span>04 // WEBSITE DEVELOPMENT</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                  {isAr
                    ? 'تطوير الموقع والمتجر الإلكتروني'
                    : 'Website & Storefront Development'}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-md">
                {isAr
                  ? 'واجهة رقمية متكاملة تجمع بين الفخامة وسرعة الأداء وتجربة الشراء السلسة.'
                  : 'Custom-engineered digital storefront combining luxury aesthetics with rapid conversion.'}
              </p>
            </div>

            <div className="rounded-3xl bg-white/[0.02] border border-white/10 p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Text & Full-Width Direct Website Button (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs font-mono text-zinc-300">
                  <Globe className="w-3.5 h-3.5" style={{ color: primaryAccentHex }} />
                  <span>{project.websiteUrl.replace(/^https?:\/\//, '')}</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                  {isAr
                    ? `المنصة والمتجر الإلكتروني الرسمي لـ ${project.client}`
                    : `Official Web Platform & Storefront for ${project.client}`}
                </h3>

                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                  {isAr
                    ? 'قمنا بتصميم وبرمجة الموقع الإلكتروني الرسمي ليعكس الهوية البصرية للعلامة، مع هيكلة أقسام المنتجات وتجربة مستخدم سريعة ومتجاوبة بالكامل على الهواتف الذكية وأجهزة الكمبيوتر.'
                    : 'We designed and developed a dedicated web platform reflecting the brand’s visual identity, featuring intuitive product discovery, fast performance, and seamless mobile checkout.'}
                </p>

                <div className="pt-2">
                  <a
                    href={project.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl text-sm font-bold text-white transition-all duration-300 shadow-[0_12px_30px_rgba(0,0,0,0.5)] hover:opacity-95 cursor-pointer"
                    style={{
                      background: `linear-gradient(135deg, ${primaryAccentHex}, ${secondaryAccentHex})`,
                    }}
                  >
                    <span>
                      {isAr ? 'زيارة الموقع المباشر — Website' : 'Visit Live Website'}
                    </span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Website Preview Visuals (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                {websiteVisuals.length > 0 && (
                  <>
                    <div
                      onClick={() => setExternalLightboxUrl(websiteVisuals[0].url)}
                      className="group relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#08070c] border border-white/15 cursor-pointer shadow-2xl"
                    >
                      <img
                        src={getOptimizedImageProps(websiteVisuals[0].url).src}
                        alt={`${project.client} Website Preview`}
                        width={900}
                        height={560}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
                      />
                    </div>

                    {websiteVisuals.length > 1 && (
                      <div className="grid grid-cols-2 gap-4">
                        {websiteVisuals.slice(1).map((wItem, wIdx) => (
                          <div
                            key={wItem.url}
                            onClick={() => setExternalLightboxUrl(wItem.url)}
                            className="group relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#08070c] border border-white/10 hover:border-white/25 cursor-pointer"
                          >
                            <img
                              src={getOptimizedImageProps(wItem.url).src}
                              alt={`${project.client} Website Screen ${wIdx + 2}`}
                              width={450}
                              height={280}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ============================================================
            SECTION 05: MEDIA & VIDEO PRODUCTION (الإنتاج المرئي)
            Rendered ONLY when project.videos is non-empty
           ============================================================ */}
        {project.videos && project.videos.length > 0 && (
          <section id="cs-sec-videos" className="scroll-mt-24">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 sm:mb-10 border-b border-white/[0.08]">
              <div>
                <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 mb-2">
                  <Film className="w-3.5 h-3.5" style={{ color: primaryAccentHex }} />
                  <span>05 // MEDIA PRODUCTION</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                  {isAr
                    ? 'الإنتاج المرئي والإعلانات المصورة'
                    : 'Media & Commercial Video Production'}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-md">
                {isAr
                  ? 'فيديوهات إعلانية وترويجية عالية الجودة تعكس قوة العلامة التجارية.'
                  : 'High-impact promotional video commercials produced for the brand.'}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {project.videos.map((vid) => (
                <div
                  key={vid.url}
                  className="rounded-3xl bg-white/[0.02] border border-white/10 overflow-hidden flex flex-col shadow-2xl"
                >
                  <div className="relative aspect-video w-full bg-black">
                    <video
                      src={vid.url}
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      {isAr ? vid.title : vid.titleEn || vid.title}
                    </h3>
                    {vid.description && (
                      <p className="mt-1.5 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                        {isAr ? vid.description : vid.descriptionEn || vid.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ============================================================
            BOTTOM SECTION: NEXT/PREV PROJECT + CALM CONVERSION CTA
           ============================================================ */}
        <section className="pt-14 pb-8 border-t border-white/[0.08] space-y-12">
          {/* Next & Previous Project Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleSwitchProject(prevProject)}
              className="group p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-white/25 transition-all text-start cursor-pointer flex items-center gap-4"
            >
              {prevProject.logo ? (
                <div
                  className={`w-14 h-14 rounded-xl p-2 flex items-center justify-center shrink-0 border border-white/10 ${
                    prevProject.id === 'zeyad-optical' ? 'bg-[#08193B]' : 'bg-black/50'
                  }`}
                >
                  <img
                    src={getOptimizedImageProps(prevProject.logo, { isLogo: true }).src}
                    alt={prevProject.client}
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-xl bg-[#120e0b] border border-[#D6B88D]/30 flex items-center justify-center shrink-0 text-base font-black text-[#D6B88D]">
                  {prevProject.id === 'athar' ? 'أثـر' : prevProject.client.slice(0, 2)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-mono text-zinc-400 block mb-0.5">
                  {isAr ? '← المشروع السابق' : '← Previous Project'}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white truncate">
                  {isAr ? prevProject.client : prevProject.clientEn || prevProject.client}
                </h4>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchProject(nextProject)}
              className="group p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-white/25 transition-all text-start cursor-pointer flex items-center gap-4"
            >
              {nextProject.logo ? (
                <div
                  className={`w-14 h-14 rounded-xl p-2 flex items-center justify-center shrink-0 border border-white/10 ${
                    nextProject.id === 'zeyad-optical' ? 'bg-[#08193B]' : 'bg-black/50'
                  }`}
                >
                  <img
                    src={getOptimizedImageProps(nextProject.logo, { isLogo: true }).src}
                    alt={nextProject.client}
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-xl bg-[#120e0b] border border-[#D6B88D]/30 flex items-center justify-center shrink-0 text-base font-black text-[#D6B88D]">
                  {nextProject.id === 'athar' ? 'أثـر' : nextProject.client.slice(0, 2)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <span className="text-[11px] font-mono text-zinc-400 block mb-0.5">
                  {isAr ? 'المشروع التالي →' : 'Next Project →'}
                </span>
                <h4 className="text-sm sm:text-base font-bold text-white truncate">
                  {isAr ? nextProject.client : nextProject.clientEn || nextProject.client}
                </h4>
              </div>
            </button>
          </div>

          {/* Calm Luxury CTA Box */}
          <div className="rounded-3xl bg-white/[0.02] border border-white/10 p-8 sm:p-12 text-center max-w-3xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              {isAr ? 'هل ترغب في بناء مشروع مماثل لعلامتك؟' : 'Ready to Build Your Brand Ecosystem?'}
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
              {isAr
                ? 'تواصل معنا لبدء تصميم الهوية البصرية، المحتوى الرقمي، أو موقعك الإلكتروني.'
                : 'Get in touch with Pulse OCTO to craft your visual identity, social media presence, or website.'}
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <LiquidGlassButton
                onClick={() => {
                  onClose();
                  onOpenConsultation();
                }}
                variant="primary"
                size="md"
              >
                <span>{isAr ? 'ابدأ نبض مشروعك' : 'Ignite Your Pulse'}</span>
                <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              </LiquidGlassButton>

              <LiquidGlassButton
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                variant="secondary"
                size="md"
              >
                <span>{isAr ? 'تواصل معنا عبر واتساب' : 'Chat on WhatsApp'}</span>
              </LiquidGlassButton>
            </div>
          </div>
        </section>
      </main>
    </motion.div>,
    document.body
  );
};
