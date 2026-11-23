/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { SEOHead } from './components/SEOHead';
import { PageTransitionBar } from './components/PageTransitionBar';
import { ErrorBoundary } from './components/ErrorBoundary';
import { initGlobalImageLazyLoader } from './utils/lazyLoad';
import { pageChunkLoaders, initQuicklinkPrefetch } from './utils/routePrefetch';
import { initWebVitalsListener } from './utils/webVitals';
import { initImageAltEnforcer, scanAndEnforceImageAlts } from './utils/imageAltEnforcer';
import { useSEO, notifySectionChange, getCanonicalUrlForView } from './hooks/useSEO';
import { getLocalizedArms } from './data/agencyData';
import type { ArmData } from './types';

// Primary Home Page
import { HomePage } from './pages/HomePage';

// Non-critical global shell components (mounted after initial paint via isDeferredShellReady to keep TBT near 0ms)
import { GlobalMasterVideoBackground } from './components/GlobalMasterVideoBackground';
import { CustomCursor } from './components/CustomCursor';
import { Footer } from './components/Footer';
import { StickyActions } from './components/StickyActions';
import { ScrollToTop } from './components/ScrollToTop';
import { ConversionTracker } from './components/ConversionTracker';
import { PerformanceMonitor } from './components/PerformanceMonitor';
import { ArmDetailStandaloneView } from './components/ArmDetailStandaloneView';

// Lazy-loaded secondary pages (drastically cuts initial bundle size & load time, warmed via Quicklink prefetcher)
const WhoWeArePage = React.lazy(pageChunkLoaders['who-we-are']);
const EightArmsPage = React.lazy(pageChunkLoaders['the-8-arms']);
const ServicesPage = React.lazy(pageChunkLoaders['services']);
const PortfolioPage = React.lazy(pageChunkLoaders['portfolio']);
const BlogPage = React.lazy(pageChunkLoaders['blog']);
const ContactPage = React.lazy(pageChunkLoaders['contact']);
const DigitalBusinessCardPage = React.lazy(pageChunkLoaders['card']);
const OwnerStudioDock = React.lazy(() =>
  import('./components/OwnerStudioDock').then((m) => ({
    default: m.OwnerStudioDock,
  }))
);

// Official clean SEO path slugs for the 8 Arms (1..8)
export const ARM_ID_TO_CLEAN_SLUG: Record<number, string> = {
  1: 'branding',
  2: 'digital-marketing',
  3: 'web-ecommerce',
  4: 'creative-studio',
  5: 'digital-products',
  6: 'brand-strategy',
  7: 'content-creation',
  8: 'seo-growth',
};

// Map of clean SEO slugs and legacy arm identifiers to arm IDs (1..8) in official order
const CLEAN_ARM_SLUG_TO_ID: Record<string, number> = {
  'branding': 1,
  'arm-1': 1,
  'service-1': 1,
  'digital-marketing': 2,
  'arm-2': 2,
  'service-2': 2,
  'web-ecommerce': 3,
  'arm-3': 3,
  'service-3': 3,
  'creative-studio': 4,
  'arm-4': 4,
  'service-4': 4,
  'digital-products': 5,
  'arm-5': 5,
  'service-5': 5,
  'brand-strategy': 6,
  'arm-6': 6,
  'service-6': 6,
  'content-creation': 7,
  'arm-7': 7,
  'service-7': 7,
  'seo-growth': 8,
  'arm-8': 8,
  'service-8': 8,
};

// Helper to push a clean URL path without any '#' hash
function pushCleanUrl(cleanPath: string, replace = false): void {
  if (typeof window === 'undefined') return;
  const normalized = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
  if (window.location.pathname !== normalized || window.location.hash !== '') {
    if (replace) {
      window.history.replaceState({}, '', normalized);
    } else {
      window.history.pushState({}, '', normalized);
    }
  }
}

// Helper to extract the current route token from pathname (primary) or legacy hash (fallback)
function getActiveRouteToken(): string {
  if (typeof window === 'undefined') return '';
  const rawPath = window.location.pathname.replace(/^\/+|\/+$/g, '').trim().toLowerCase();
  const rawHash = window.location.hash.replace(/^#\/?/, '').replace(/\/+$/, '').trim().toLowerCase();
  return rawPath || rawHash;
}

// Helper to determine initial page from clean pathname (or legacy hash)
function getPageFromPathname(): string {
  const routeToken = getActiveRouteToken();

  if (routeToken === 'who-we-are' || routeToken === 'about') return 'who-we-are';
  if (routeToken === 'services' || routeToken === 'our-services') return 'services';
  if (routeToken === 'backgrounds' || routeToken === 'backgrounds-lab' || routeToken === 'background-lab') return 'the-8-arms';
  if (routeToken === 'the-8-arms' || routeToken === 'eight-arms' || routeToken === 'arms') return 'the-8-arms';
  if (CLEAN_ARM_SLUG_TO_ID[routeToken] || routeToken.match(/^(?:arm|service)-(\d+)$/i)) return 'the-8-arms';
  if (routeToken === 'portfolio' || routeToken === 'projects') return 'portfolio';
  if (routeToken === 'blog' || routeToken === 'insights') return 'blog';
  if (routeToken === 'contact') return 'contact';
  if (
    routeToken === 'card' ||
    routeToken === 'vcard' ||
    routeToken === 'tarek' ||
    routeToken === 'ceo' ||
    routeToken === 'id' ||
    routeToken === 'business-card'
  ) {
    return 'card';
  }

  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    if (params.get('card') === '1' || params.get('page') === 'card') {
      return 'card';
    }
  }

  return 'home';
}

function getArmIdFromPathname(): number | null {
  const routeToken = getActiveRouteToken();
  if (!routeToken) return null;

  if (CLEAN_ARM_SLUG_TO_ID[routeToken]) {
    return CLEAN_ARM_SLUG_TO_ID[routeToken];
  }

  const match = routeToken.match(/^(?:arm|service)-(\d+)$/i);
  if (match) {
    const id = parseInt(match[1], 10);
    if (id >= 1 && id <= 8) return id;
  }

  return null;
}

export default function App() {
  const { dir, isAr, lang } = useLanguage();
  const [currentPage, setCurrentPage] = useState<string>(getPageFromPathname);
  const [activeSubSection, setActiveSubSection] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string>('');
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [isDeferredShellReady, setIsDeferredShellReady] = useState<boolean>(false);
  const [isDesktopViewport, setIsDesktopViewport] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 768 : false
  );
  const [standaloneArm, setStandaloneArm] = useState<ArmData | null>(() => {
    const armId = getArmIdFromPathname();
    if (armId) {
      const all = getLocalizedArms(isAr ? 'ar' : 'en');
      return all.find((a) => a.id === armId) || null;
    }
    return null;
  });

  const handleSectionChange = useCallback((section: string) => {
    setActiveSubSection(section || null);
  }, []);

  // Normalize any legacy '#' URLs to clean HTML5 paths on initial load
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.location.hash) {
      const armId = getArmIdFromPathname();
      if (armId && ARM_ID_TO_CLEAN_SLUG[armId]) {
        pushCleanUrl(`/${ARM_ID_TO_CLEAN_SLUG[armId]}`, true);
      } else {
        const page = getPageFromPathname();
        pushCleanUrl(page === 'home' ? '/' : `/${page}`, true);
      }
    }
  }, []);

  // Defer non-critical global widgets (StickyActions, ConversionTracker, CustomCursor, VideoBackground) until after initial paint
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const updateDesktop = (e: MediaQueryListEvent | MediaQueryList) => setIsDesktopViewport(e.matches);
    updateDesktop(mq);
    mq.addEventListener('change', updateDesktop);

    let timer: ReturnType<typeof setTimeout> | null = null;
    const activateDeferred = () => {
      setIsDeferredShellReady(true);
    };

    if ('requestIdleCallback' in window) {
      (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => void }).requestIdleCallback(
        activateDeferred,
        { timeout: 1200 }
      );
    } else {
      timer = setTimeout(activateDeferred, 600);
    }

    return () => {
      mq.removeEventListener('change', updateDesktop);
      if (timer) clearTimeout(timer);
    };
  }, []);

  // Keep standalone arm localized on language switch
  useEffect(() => {
    if (standaloneArm) {
      const all = getLocalizedArms(lang);
      const updated = all.find((a) => a.id === standaloneArm.id);
      if (updated) {
        setStandaloneArm(updated);
      }
    }
  }, [lang]);

  // Synchronize browser history routing (popstate & legacy hashchange)
  useEffect(() => {
    const handleRouteChange = () => {
      const armId = getArmIdFromPathname();
      if (armId) {
        const all = getLocalizedArms(lang);
        const found = all.find((a) => a.id === armId);
        if (found) {
          setStandaloneArm(found);
          setActiveSubSection(`arm-${found.id}`);
          setCurrentPage('the-8-arms');
          if (window.location.hash && ARM_ID_TO_CLEAN_SLUG[armId]) {
            pushCleanUrl(`/${ARM_ID_TO_CLEAN_SLUG[armId]}`, true);
          }
          return;
        }
      } else {
        setStandaloneArm(null);
        setActiveSubSection(null);
      }

      const page = getPageFromPathname();
      if (window.location.hash) {
        pushCleanUrl(page === 'home' ? '/' : `/${page}`, true);
      }
      setCurrentPage((prev) => {
        if (prev !== page) {
          setIsNavigating(true);
        }
        return page;
      });
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, [lang]);

  // Listen for custom events to open an arm standalone view or switch active section/arm in real time
  useEffect(() => {
    const handleOpenArmEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ armId?: number; arm?: ArmData }>;
      const all = getLocalizedArms(lang);
      const arm = customEvent.detail?.arm || all.find((a) => a.id === customEvent.detail?.armId);
      if (arm) {
        setStandaloneArm(arm);
        setActiveSubSection(`arm-${arm.id}`);
        const cleanSlug = ARM_ID_TO_CLEAN_SLUG[arm.id] || `arm-${arm.id}`;
        pushCleanUrl(`/${cleanSlug}`);
      }
    };

    const handleResetArmEvent = () => {
      setStandaloneArm(null);
      setActiveSubSection(null);
    };

    const handleSectionChangeEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ section?: string }>;
      const nextSec = customEvent.detail?.section;
      if (nextSec) {
        setActiveSubSection(nextSec);
      }
    };

    window.addEventListener('pulse-octo:open-arm', handleOpenArmEvent);
    window.addEventListener('pulse-octo:reset-arm-detail', handleResetArmEvent);
    window.addEventListener('pulse-octo:section-change', handleSectionChangeEvent);
    return () => {
      window.removeEventListener('pulse-octo:open-arm', handleOpenArmEvent);
      window.removeEventListener('pulse-octo:reset-arm-detail', handleResetArmEvent);
      window.removeEventListener('pulse-octo:section-change', handleSectionChangeEvent);
    };
  }, [lang]);

  // Defer global observers (Quicklink, Web Vitals, Image Alt Enforcer) until after initial paint to keep TBT near 0ms
  useEffect(() => {
    if (!isDeferredShellReady) return;
    const cleanupLazyLoader = initGlobalImageLazyLoader();
    const cleanupQuicklink = initQuicklinkPrefetch();
    const cleanupWebVitals = initWebVitalsListener();
    const cleanupAltEnforcer = initImageAltEnforcer();
    return () => {
      cleanupLazyLoader();
      cleanupQuicklink();
      cleanupWebVitals();
      cleanupAltEnforcer();
    };
  }, [isDeferredShellReady]);

  // Re-evaluate auto-generated image alt attributes when language or active page changes
  useEffect(() => {
    if (!isDeferredShellReady) return;
    scanAndEnforceImageAlts();
  }, [isDeferredShellReady, lang, currentPage, standaloneArm]);

  // Handler to navigate across separate pages using clean URLs (no '#' hash)
  const handleNavigate = useCallback((pageId: string) => {
    setStandaloneArm(null);
    setActiveSubSection(null);
    setCurrentPage((prev) => {
      if (prev !== pageId) {
        setIsNavigating(true);
      }
      return pageId;
    });
    notifySectionChange(pageId);
    if (pageId === 'home') {
      pushCleanUrl('/');
    } else {
      pushCleanUrl(`/${pageId}`);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Secret keyboard shortcut (Alt + Shift + C) for owner to quickly preview the hidden Digital Business Card
  useEffect(() => {
    const handleSecretShortcut = (e: KeyboardEvent) => {
      if (e.altKey && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleNavigate(currentPage === 'card' ? 'home' : 'card');
      }
    };
    window.addEventListener('keydown', handleSecretShortcut);
    return () => window.removeEventListener('keydown', handleSecretShortcut);
  }, [currentPage, handleNavigate]);

  const handleOpenArm = useCallback((arm: ArmData) => {
    setStandaloneArm(arm);
    setActiveSubSection(`arm-${arm.id}`);
    notifySectionChange(`arm-${arm.id}`);
    const cleanSlug = ARM_ID_TO_CLEAN_SLUG[arm.id] || `arm-${arm.id}`;
    pushCleanUrl(`/${cleanSlug}`);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleOpenConsultation = useCallback(() => {
    setStandaloneArm(null);
    setActiveSubSection(null);
    handleNavigate('contact');
  }, [handleNavigate]);

  const handleSelectServiceForConsultation = useCallback((serviceTitle: string) => {
    setStandaloneArm(null);
    setActiveSubSection(null);
    setSelectedService(serviceTitle);
    handleNavigate('contact');
  }, [handleNavigate]);

  // Centralized dynamic SEO management based on active view/arm and language in real time
  const currentSection = standaloneArm
    ? `arm-${standaloneArm.id}`
    : activeSubSection || currentPage;
  const canonicalRouteKey = standaloneArm ? `arm-${standaloneArm.id}` : currentPage;
  const pageCanonicalUrl = getCanonicalUrlForView(canonicalRouteKey);
  useSEO(currentSection, { canonicalUrl: pageCanonicalUrl });

  return (
    <div
      dir={dir}
      className={`relative min-h-screen bg-[#030108] text-slate-100 overflow-x-clip overscroll-none touch-pan-y ${
        isAr ? "font-['Cairo',sans-serif]" : "font-['Plus_Jakarta_Sans',sans-serif]"
      } selection:bg-purple-600 selection:text-white`}
    >
      {/* 0. Mobile Static CSS Gradient Base + Desktop Deferred Video Background */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden bg-[#030108] bg-[radial-gradient(ellipse_90%_70%_at_50%_35%,rgba(138,43,226,0.2)_0%,rgba(15,7,38,0.75)_55%,#030108_100%)]"
      />
      {isDeferredShellReady && isDesktopViewport && (
        <ErrorBoundary fallback={null}>
          <React.Suspense fallback={null}>
            <GlobalMasterVideoBackground currentPage={currentPage} />
          </React.Suspense>
        </ErrorBoundary>
      )}

      {/* Deferred Analytics & Custom Cursor */}
      {isDeferredShellReady && (
        <ErrorBoundary fallback={null}>
          <React.Suspense fallback={null}>
            <ConversionTracker currentPage={currentSection} />
            {isDesktopViewport && <CustomCursor />}
          </React.Suspense>
        </ErrorBoundary>
      )}

      {/* Thin Animated Page Transition Progress Bar */}
      <PageTransitionBar isNavigating={isNavigating} pageKey={currentPage} />

      {/* Dynamic SEO Meta Tags & OpenGraph synced with active page/arm view in real time */}
      <SEOHead
        currentSection={currentSection}
        activeSection={currentSection}
        canonicalUrl={pageCanonicalUrl}
      />

      {/* Main Glassmorphism Fixed Navigation Bar (Hidden on standalone Digital Business Card page) */}
      {currentPage !== 'card' && (
        <Navbar
          currentPage={currentPage}
          currentSection={currentSection}
          onNavigate={handleNavigate}
          onSectionChange={handleSectionChange}
          onOpenConsultation={handleOpenConsultation}
          onSelectArm={handleOpenArm}
        />
      )}

      {/* Dedicated Separate Pages — initial={false} ensures zero opacity/blur delay on initial FCP/LCP paint */}
      <main className="relative z-10 pb-28 sm:pb-32 md:pb-0 touch-pan-y overscroll-none">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentPage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.22,
              ease: 'easeOut',
            }}
            onAnimationComplete={() => {
              setIsNavigating(false);
            }}
            className="w-full"
          >
            <ErrorBoundary resetKey={currentPage}>
              <React.Suspense fallback={<div className="min-h-screen bg-[#030108]" />}>
              {currentPage === 'home' && (
                <HomePage
                  onNavigate={handleNavigate}
                  onSectionChange={handleSectionChange}
                  onOpenConsultation={handleOpenConsultation}
                  onSelectServiceForConsultation={handleSelectServiceForConsultation}
                />
              )}

              {currentPage === 'who-we-are' && (
                <WhoWeArePage
                  onNavigate={handleNavigate}
                  onOpenConsultation={handleOpenConsultation}
                  onSelectServiceForConsultation={handleSelectServiceForConsultation}
                />
              )}

              {currentPage === 'the-8-arms' && (
                <EightArmsPage
                  onNavigate={handleNavigate}
                  onSectionChange={handleSectionChange}
                  onOpenConsultation={handleOpenConsultation}
                  onSelectServiceForConsultation={handleSelectServiceForConsultation}
                />
              )}

              {currentPage === 'services' && (
                <ServicesPage
                  onNavigate={handleNavigate}
                  onSectionChange={handleSectionChange}
                  onOpenConsultation={handleOpenConsultation}
                  onSelectServiceForConsultation={handleSelectServiceForConsultation}
                />
              )}

              {currentPage === 'portfolio' && (
                <PortfolioPage
                  onNavigate={handleNavigate}
                  onOpenConsultation={handleOpenConsultation}
                />
              )}

              {currentPage === 'blog' && (
                <BlogPage
                  onNavigate={handleNavigate}
                  onOpenConsultation={handleOpenConsultation}
                />
              )}

              {currentPage === 'contact' && (
                <ContactPage
                  onNavigate={handleNavigate}
                  preselectedService={selectedService}
                />
              )}

              {currentPage === 'card' && (
                <DigitalBusinessCardPage onNavigate={handleNavigate} />
              )}
              </React.Suspense>
            </ErrorBoundary>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Shared Footer & Floating Controls (Hidden on standalone Digital Business Card page) */}
      {currentPage !== 'card' && (
        <ErrorBoundary fallback={null}>
          <React.Suspense fallback={null}>
            <Footer onNavigate={handleNavigate} />
            {isDeferredShellReady && (
              <>
                <ScrollToTop />
                <StickyActions
                  currentPage={currentPage}
                  onNavigate={handleNavigate}
                  onOpenConsultation={handleOpenConsultation}
                />
                <PerformanceMonitor
                  currentSection={currentSection}
                  onNavigate={handleNavigate}
                />
              </>
            )}
          </React.Suspense>
        </ErrorBoundary>
      )}

      {/* Owner-Only Floating Card & Projects Studio Dock (100% hidden from public visitors on pulseocto.com) */}
      <ErrorBoundary fallback={null}>
        <React.Suspense fallback={null}>
          <OwnerStudioDock
            currentPage={currentPage}
            onNavigate={handleNavigate}
          />
        </React.Suspense>
      </ErrorBoundary>

      {/* Standalone Full-Screen Service View */}
      <AnimatePresence>
        {standaloneArm && (
          <ErrorBoundary fallback={null}>
            <React.Suspense fallback={null}>
              <ArmDetailStandaloneView
                arm={standaloneArm}
                allArms={getLocalizedArms(lang)}
                onGoHome={() => {
                  handleNavigate('home');
                }}
                onBack={() => {
                  setStandaloneArm(null);
                  setActiveSubSection(null);
                  const returnPath = currentPage === 'home' ? '/' : '/the-8-arms';
                  notifySectionChange(currentPage === 'home' ? 'home' : 'the-8-arms');
                  pushCleanUrl(returnPath);
                }}
                onSelectArm={(newArm) => {
                  handleOpenArm(newArm);
                }}
                onOpenConsultation={() => {
                  const armTitle = standaloneArm.title;
                  setStandaloneArm(null);
                  setActiveSubSection(null);
                  handleSelectServiceForConsultation(armTitle);
                }}
              />
            </React.Suspense>
          </ErrorBoundary>
        )}
      </AnimatePresence>
    </div>
  );
}
