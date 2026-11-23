import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { HeroSection } from '../components/HeroSection';
import { ServicesAccordion } from '../components/ServicesAccordion';
import { ClientTrustMarquee } from '../components/ClientTrustMarquee';
import { AssemblingFrameCTA } from '../components/AssemblingFrameCTA';
import { AnimatedGlowDivider } from '../components/AnimatedGlowDivider';
import { ParallaxSection, ParallaxLayer } from '../components/ParallaxSection';
import { LiquidGlassButton } from '../components/LiquidGlassButton';
import { MobileSectionNav } from '../components/MobileSectionNav';
import {
  ScrollReveal,
  ScrollStagger,
  staggerItemVariants,
} from '../components/ScrollReveal';
import { getLocalizedServices, getLocalizedArms } from '../data/agencyData';
import type { ArmData } from '../types';
import { RAW_INSIGHTS } from '../data/insightsData';
import { useLanguage } from '../context/LanguageContext';
import {
  ArrowRight,
} from 'lucide-react';
import { lazyWithRetry } from '../utils/routePrefetch';
import { ArmDetailStandaloneView } from '../components/ArmDetailStandaloneView';

// Lazy-load below-the-fold sections & modals after Hero & 8 Arms to reduce initial bundle weight on mobile
const TrustPartnersSection = lazyWithRetry(() =>
  import('../components/TrustPartnersSection').then((m) => ({ default: m.TrustPartnersSection }))
);
const CaseStudyShowcase = lazyWithRetry(() =>
  import('../components/CaseStudyShowcase').then((m) => ({ default: m.CaseStudyShowcase }))
);
const ProjectScopeWizard = lazyWithRetry(() =>
  import('../components/ProjectScopeWizard').then((m) => ({ default: m.ProjectScopeWizard }))
);
const HomeFAQ = lazyWithRetry(() =>
  import('../components/HomeFAQ').then((m) => ({ default: m.HomeFAQ }))
);
const HomeQuickContact = lazyWithRetry(() =>
  import('../components/HomeQuickContact').then((m) => ({ default: m.HomeQuickContact }))
);

interface HomePageProps {
  onNavigate: (page: string) => void;
  onSectionChange?: (section: string) => void;
  onOpenConsultation: () => void;
  onSelectServiceForConsultation?: (serviceTitle: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSectionChange,
  onOpenConsultation,
  onSelectServiceForConsultation,
}) => {
  const { lang, t, dir, isAr } = useLanguage();
  const services = getLocalizedServices(lang);
  const armsList = useMemo(() => getLocalizedArms(lang), [lang]);
  const insights = RAW_INSIGHTS.slice(0, 3);

  // Standalone Full Dedicated Service View State (matching header image /1.jpeg to /8.jpeg)
  const [selectedArmDetail, setSelectedArmDetail] = useState<ArmData | null>(null);
  const [selectedAccordionIndex, setSelectedAccordionIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection
        onExplore={() => {
          const el = document.getElementById('services-accordion-wrapper') || document.getElementById('who-we-are');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          } else {
            onNavigate('services');
          }
        }}
        onOpenConsultation={() => onNavigate('contact')}
      />

      {/* Curtain Layer: Slides up smoothly over the fixed/sticky Hero Section as the user scrolls */}
      <div className="relative z-30 w-full bg-[#050308] rounded-t-[28px] sm:rounded-t-[48px] lg:rounded-t-[60px] shadow-[0_-28px_80px_rgba(0,0,0,0.98)]">
        {/* 2. The 8 Arms Services Accordion */}
        <div
          id="services-accordion-wrapper"
          className="relative z-40 w-full bg-[#050308] scroll-mt-20 rounded-t-[28px] sm:rounded-t-[48px] lg:rounded-t-[60px] border-t border-white/[0.15] overflow-x-clip"
        >
          {/* Brushed Silver & Royal Amethyst Curtain Edge */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#c9b3ff]/60 to-transparent z-50 pointer-events-none" />

          <div id="arms-3d-orbit" className="sr-only pointer-events-none" />
          <ServicesAccordion
            selectedArmIndex={selectedAccordionIndex}
            onSectionChange={onSectionChange}
            onSelectServiceForConsultation={(serviceName) => {
              if (onSelectServiceForConsultation) {
                onSelectServiceForConsultation(serviceName);
              } else {
                onNavigate('contact');
              }
            }}
            onOpenFullServicePage={(serviceIndex) => {
              const arm = armsList[serviceIndex];
              if (arm) {
                onSectionChange?.(`arm-${arm.id}`);
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(
                    new CustomEvent('pulse-octo:open-arm', {
                      detail: { armId: arm.id, arm },
                    })
                  );
                } else {
                  setSelectedArmDetail(arm);
                }
              }
            }}
          />
        </div>

        {/* 2.5 Client Trust Marquee — Verified Client Companies Social Proof Strip */}
        <ClientTrustMarquee
          onNavigate={onNavigate}
          onOpenConsultation={onOpenConsultation}
        />

        {/* Subtle Animated Gradient Horizontal Divider */}
        <AnimatedGlowDivider variant="pulse" />

        {/* 3. The Scroll-Triggered Assembling Square Frame CTA (Immediately After The 8 Arms) */}
        <AssemblingFrameCTA
          onOpenConsultation={() => onNavigate('contact')}
        />

        <AnimatedGlowDivider variant="pulse" />

        <React.Suspense fallback={<div className="min-h-[320px]" />}>
          {/* 4. Trust Partners Section (شركاء الثقة وقصص النجاح - Scrolling Carousel) */}
          <div id="trust-partners-section">
            <TrustPartnersSection
              onNavigate={onNavigate}
              onOpenConsultation={onOpenConsultation}
            />
          </div>

          {/* Mobile Section Quick Navigation Bar (أزرار التنقل السريع بين أقسام الموبايل) */}
          <MobileSectionNav />

          <AnimatedGlowDivider variant="pulse" />

          {/* 5. Selected Work & Case Studies Showcase (Editorial Showcase) */}
          <div id="portfolio-section">
            <CaseStudyShowcase
              onNavigate={onNavigate}
              onOpenConsultation={onOpenConsultation}
            />
          </div>

          <AnimatedGlowDivider variant="pulse" />

          {/* 6. Teaser: المدونة والتحليلات (Digital Insights) — Luxury Frosted Glass Editorial Layout */}
          <ParallaxSection id="insights-section" range={24} className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <ParallaxLayer depth={0.65} maxShift={16}>
              <ScrollReveal variant="fade-up" threshold={0.1}>
                <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 mb-10 border-b border-white/[0.12] gap-6">
                  <div>
                    <span className="block text-xs font-semibold tracking-widest uppercase text-[#c9b3ff] mb-2">
                      {isAr ? 'رؤى وتحليلات استراتيجية' : 'Strategic Perspectives'}
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold bg-gradient-to-b from-white via-[#f2effa] to-[#c9b3ff] bg-clip-text text-transparent tracking-tight">
                      {isAr ? 'أحدث التحليلات والتوجهات في السوق الرقمي' : 'Actionable Market Intel & Insights'}
                    </h2>
                  </div>

                  <LiquidGlassButton
                    onClick={() => onNavigate('blog')}
                    variant="secondary"
                    size="sm"
                  >
                    <span>{isAr ? 'عرض جميع مقالات المدونة' : 'Browse All Articles'}</span>
                    <ArrowRight className={`w-4 h-4 text-[#c9b3ff] ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                  </LiquidGlassButton>
                </div>
              </ScrollReveal>
            </ParallaxLayer>

            <ParallaxLayer depth={1.15} maxShift={20}>
              <ScrollStagger stagger={0.12} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {insights.map((item) => (
                  <motion.article
                    key={item.id}
                    variants={staggerItemVariants}
                    onClick={() => onNavigate('blog')}
                    className="group relative p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-white/[0.08] via-[#1e1035]/40 to-[#090612]/80 backdrop-blur-[12px] backdrop-saturate-[180%] [-webkit-backdrop-filter:blur(12px)_saturate(180%)] border border-white/[0.15] hover:border-[#c9b3ff]/50 shadow-[0_16px_40px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.22)] transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden"
                  >
                    {/* Subsurface corner glow */}
                    <div className="absolute -bottom-8 -end-8 w-28 h-28 rounded-full bg-[#9d65f5]/18 blur-2xl pointer-events-none transition-opacity duration-300 group-hover:opacity-100 opacity-60" />

                    {/* Top Specular Accent Line */}
                    <div className="w-10 h-0.5 bg-gradient-to-r from-[#c9b3ff] to-[#9d65f5] group-hover:w-16 transition-all duration-300 mb-6" />

                    <div className="relative z-10">
                      <div className="flex items-center gap-2 text-xs text-[#a39bb5] mb-3">
                        <span className="text-[#c9b3ff] font-semibold">
                          {isAr ? item.categoryAr : item.categoryEn}
                        </span>
                        {item.readTime && (
                          <>
                            <span className="text-white/20">•</span>
                            <span>{item.readTime}</span>
                          </>
                        )}
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-[#f4f1fb] group-hover:text-white transition-colors leading-snug">
                        {isAr ? item.titleAr : item.titleEn}
                      </h3>

                      <p className="mt-3 text-xs sm:text-sm text-[#b0a8c2] line-clamp-3 leading-relaxed">
                        {isAr ? item.excerptAr : item.excerptEn}
                      </p>
                    </div>

                    <div className="relative z-10 mt-8 pt-4 border-t border-white/[0.1] flex items-center justify-between text-xs font-semibold text-[#e6e2f2] group-hover:text-[#c9b3ff] transition-colors">
                      <span>{isAr ? 'قراءة التحليل' : 'Read Article'}</span>
                      <ArrowRight className={`w-4 h-4 text-[#c9b3ff] transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                    </div>
                  </motion.article>
                ))}
              </ScrollStagger>
            </ParallaxLayer>
          </ParallaxSection>

          <AnimatedGlowDivider variant="pulse" />

          {/* 7. Interactive Project Scope Wizard (معالج تحديد نطاق المشروع) with subtle vertical parallax */}
          <ParallaxSection id="wizard-section" range={22} className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <ProjectScopeWizard onCompleteConsultation={() => onNavigate('contact')} />
          </ParallaxSection>

          <AnimatedGlowDivider variant="pulse" />

          {/* 8. Dedicated FAQ Accordion Synchronized with index.html Schema.org FAQPage */}
          <ParallaxSection id="faq-section-wrapper" range={24}>
            <HomeFAQ onOpenConsultation={() => onNavigate('contact')} />
          </ParallaxSection>

          <AnimatedGlowDivider variant="pulse" />

          {/* 9. Simple & Concise Quick Contact Form (نموذج التواصل السريع والمختصر) */}
          <HomeQuickContact onNavigate={onNavigate} />
        </React.Suspense>
      </div>

      {/* Standalone Full-Screen Dedicated Service Page (Portaled directly to document.body for zero-scroll-jump) */}
      {isMounted &&
        typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {selectedArmDetail && (
              <React.Suspense fallback={null}>
                <ArmDetailStandaloneView
                  arm={selectedArmDetail}
                  allArms={armsList}
                  onBack={() => setSelectedArmDetail(null)}
                  onSelectArm={(newArm) => setSelectedArmDetail(newArm)}
                  onOpenConsultation={() => {
                    const title = selectedArmDetail.title;
                    setSelectedArmDetail(null);
                    if (onSelectServiceForConsultation) {
                      onSelectServiceForConsultation(title);
                    } else {
                      onNavigate('contact');
                    }
                  }}
                />
              </React.Suspense>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
};
