import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { OctoLogo } from './OctoLogo';
import { MagneticButton } from './MagneticButton';
import { LiquidGlassButton } from './LiquidGlassButton';
import {
  Menu,
  X,
  Palette,
  Globe,
  Home,
  Users,
  Layers,
  Briefcase,
  BookOpen,
  Mail,
  ChevronRight,
  ChevronDown,
  MessageCircle,
  Compass,
  Layout,
  Target,
  Feather,
  Video,
  Cpu,
  TrendingUp,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedArms } from '../data/agencyData';
import { prefetchRoute } from '../utils/routePrefetch';
import { notifySectionChange } from '../hooks/useSEO';
import type { ArmData } from '../types';
import { EightArmsDropdown } from './EightArmsDropdown';

interface NavbarProps {
  currentPage?: string;
  currentSection?: string;
  onNavigate?: (page: string) => void;
  onSectionChange?: (section: string) => void;
  onOpenConsultation?: () => void;
  onSelectArm?: (arm: ArmData) => void;
}

const getArmIcon = (iconName?: string) => {
  switch (iconName) {
    case 'Sparkles':
      return Palette;
    case 'Compass':
      return Compass;
    case 'Layout':
      return Layout;
    case 'Target':
      return Target;
    case 'Feather':
      return Feather;
    case 'Video':
      return Video;
    case 'Cpu':
      return Cpu;
    case 'TrendingUp':
      return TrendingUp;
    default:
      return Layers;
  }
};

export const Navbar: React.FC<NavbarProps> = ({
  currentPage = 'home',
  currentSection,
  onNavigate,
  onSectionChange,
  onSelectArm,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [armsDropdownOpen, setArmsDropdownOpen] = useState(false);
  const [mobileArmsExpanded, setMobileArmsExpanded] = useState(false);
  const dropdownTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { lang, t, dir, isAr, toggleLang } = useLanguage();

  const armsList = useMemo(() => getLocalizedArms(lang), [lang]);

  // Pre-configured WhatsApp message for the primary header CTA
  const whatsappUrl = `https://wa.me/201116066968?text=${encodeURIComponent(
    isAr
      ? 'مرحباً فريق Pulse OCTO، أود أن أبدأ نبض مشروعي معكم واستكشاف الخطة الرقمية الاستراتيجية.'
      : 'Hello Pulse OCTO Team, I would like to ignite my project pulse with you and explore the strategic digital roadmap.'
  )}`;

  const navItems = [
    {
      id: 'home',
      label: t('nav.home'),
      icon: Home,
    },
    {
      id: 'who-we-are',
      label: t('nav.whoWeAre'),
      icon: Users,
    },
    {
      id: 'the-8-arms',
      label: t('nav.arms'),
      icon: Layers,
    },
    {
      id: 'portfolio',
      label: t('nav.portfolio'),
      icon: Briefcase,
    },
    {
      id: 'blog',
      label: t('nav.blog'),
      icon: BookOpen,
    },
    {
      id: 'contact',
      label: t('nav.contact'),
      icon: Mail,
    },
  ];

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Track scroll position efficiently: only re-render when crossing the threshold
  useEffect(() => {
    let lastScrolled = window.scrollY > 45;
    setScrolled(lastScrolled);

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isNowScrolled = window.scrollY > 45;
          if (isNowScrolled !== lastScrolled) {
            lastScrolled = isNowScrolled;
            setScrolled(isNowScrolled);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle page switch
  const handlePageClick = (pageId: string) => {
    setArmsDropdownOpen(false);
    setMobileMenuOpen(false);
    onSectionChange?.(pageId);
    notifySectionChange(pageId);
    if (onNavigate) {
      onNavigate(pageId);
    }
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('pulse-octo:reset-arm-detail'));
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Handle direct standalone arm click from the dropdown
  const handleArmClick = (arm: ArmData) => {
    setArmsDropdownOpen(false);
    setMobileMenuOpen(false);
    const armSec = `arm-${arm.id}`;
    onSectionChange?.(armSec);
    notifySectionChange(armSec);
    if (onSelectArm) {
      onSelectArm(arm);
    } else {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('pulse-octo:open-arm', {
            detail: { armId: arm.id, arm },
          })
        );
      }
      if (onNavigate) {
        onNavigate('the-8-arms');
      }
    }
  };

  const handleDropdownMouseEnter = () => {
    if (dropdownTimerRef.current) {
      clearTimeout(dropdownTimerRef.current);
      dropdownTimerRef.current = null;
    }
    prefetchRoute('the-8-arms');
    setArmsDropdownOpen(true);
  };

  const handleDropdownMouseLeave = () => {
    if (dropdownTimerRef.current) {
      clearTimeout(dropdownTimerRef.current);
    }
    dropdownTimerRef.current = setTimeout(() => {
      setArmsDropdownOpen(false);
    }, 180);
  };

  // Close dropdown on outside click or ESC key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const navEl = document.getElementById('main-navigation');
      if (navEl && !navEl.contains(e.target as Node)) {
        setArmsDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setArmsDropdownOpen(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('click', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <header
      id="main-navigation"
      className="fixed top-0 inset-x-0 z-50 pointer-events-none select-none transition-all duration-300"
    >
      <div className="w-full flex justify-center pt-2 sm:pt-3 lg:pt-4 px-2.5 sm:px-4 lg:px-6">
        <div
          className={`pointer-events-auto flex items-center transition-[background-color,border-color,box-shadow,padding,width,max-width] duration-300 relative ${
            scrolled
              ? 'w-auto max-w-[96vw] rounded-full bg-[#090612]/90 border border-white/[0.16] shadow-[0_18px_50px_rgba(0,0,0,0.88),inset_0_1px_1.5px_rgba(255,255,255,0.28)] backdrop-blur-[12px] backdrop-saturate-[180%] p-1 sm:p-1.5 lg:p-2 gap-1 sm:gap-1.5 lg:gap-2.5 overflow-visible'
              : 'w-full max-w-7xl justify-between bg-transparent border-transparent gap-2 sm:gap-3 lg:gap-4'
          }`}
        >
          {/* Subtle top specular edge highlight when scrolled */}
          {scrolled && (
            <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-white/55 to-transparent pointer-events-none rounded-full z-10" />
          )}

          {/* 1. START EDGE: LOGO + BRAND NAME */}
          <motion.div
            layout="position"
            className="flex items-center shrink-0"
          >
            <button
              type="button"
              onClick={() => handlePageClick('home')}
              dir="ltr"
              className={`relative flex items-center group cursor-pointer bg-transparent border-0 p-0 text-left transition-all duration-300 ease-out hover:opacity-90 active:scale-95 ${
                scrolled ? 'gap-0 ps-0.5' : 'gap-2 sm:gap-2.5 ps-0'
              }`}
              data-cursor="pointer"
              aria-label="Pulse OCTO"
            >
              {/* Circular Logo Emblem */}
              <motion.div
                layout
                transition={{ type: 'spring', stiffness: 350, damping: 26 }}
                className={`relative shrink-0 flex items-center justify-center transition-all duration-300 ${
                  scrolled ? 'w-7 h-7 sm:w-8 sm:h-8' : 'w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10'
                }`}
              >
                <OctoLogo
                  variant="iconOnly"
                  className={`transition-all duration-300 ${
                    scrolled
                      ? 'w-7 h-7 sm:w-8 sm:h-8 max-w-[28px] max-h-[28px] sm:max-w-[32px] sm:max-h-[32px]'
                      : 'w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 max-w-[32px] max-h-[32px] sm:max-w-[36px] sm:max-h-[36px] lg:max-w-[40px] lg:max-h-[40px]'
                  }`}
                />
              </motion.div>

              {/* Brand Typography */}
              <AnimatePresence initial={false} mode="wait">
                {!scrolled && (
                  <motion.div
                    key={`navbar-brand-typography-${currentPage === 'the-8-arms' ? 'arms' : 'general'}`}
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{
                      duration: 0.3,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    dir="ltr"
                    className="flex items-center leading-none select-none overflow-hidden whitespace-nowrap"
                  >
                    <motion.div
                      layout
                      dir="ltr"
                      className="flex flex-row items-center gap-1.5 sm:gap-2 font-black text-sm sm:text-base md:text-lg lg:text-xl font-['Orbitron',sans-serif] tracking-normal leading-none transition-all duration-300 ps-1.5"
                    >
                      <span className="bg-gradient-to-b from-white via-[#e6e2f2] to-[#b5afc4] bg-clip-text text-transparent inline-block">
                        Pulse
                      </span>
                      <span className="bg-gradient-to-r from-[#d8c4ff] via-[#b88cff] to-[#8247e5] bg-clip-text text-transparent tracking-normal inline-block">
                        OCTO
                      </span>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </motion.div>

          {/* 2. CENTER: NAVIGATION LINKS (Desktop >= 1024px) */}
          <motion.nav
            layout="position"
            className={`hidden lg:flex items-center gap-0.5 xl:gap-1 transition-all duration-300 ${
              scrolled
                ? 'px-1 py-0.5 bg-transparent border-transparent'
                : 'px-2.5 xl:px-4 py-1.5 xl:py-2 rounded-full bg-gradient-to-b from-white/[0.11] via-[#090612]/80 to-[#090612]/90 border border-white/[0.16] backdrop-blur-[12px] backdrop-saturate-[180%] shadow-[0_14px_36px_rgba(0,0,0,0.75),inset_0_1px_1.5px_rgba(255,255,255,0.28)]'
            }`}
            aria-label="القائمة الرئيسية / Main Navigation"
          >
            {scrolled && (
              <div className="w-px h-4 bg-white/15 mx-1 shrink-0" />
            )}

            {navItems.map((item) => {
              const isActive =
                currentPage === item.id ||
                (item.id === 'services' && (currentPage === 'the-8-arms' || currentPage === 'services')) ||
                (item.id === 'the-8-arms' && (currentPage === 'services' || currentPage === 'the-8-arms'));

              if (item.id === 'the-8-arms') {
                return (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={handleDropdownMouseEnter}
                    onMouseLeave={handleDropdownMouseLeave}
                  >
                    <button
                      type="button"
                      data-prefetch-route={item.id}
                      onMouseEnter={() => prefetchRoute(item.id)}
                      onFocus={() => prefetchRoute(item.id)}
                      onTouchStart={() => prefetchRoute(item.id)}
                      onClick={() => handlePageClick(item.id)}
                      className={`relative px-2.5 xl:px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-semibold transition-colors duration-200 flex items-center gap-1 xl:gap-1.5 cursor-pointer border-0 bg-transparent whitespace-nowrap ${
                        isActive || armsDropdownOpen
                          ? 'text-white'
                          : 'text-[#cbc5d8] hover:text-white'
                      }`}
                      data-cursor="pointer"
                      aria-expanded={armsDropdownOpen}
                      aria-haspopup="true"
                    >
                      {isActive && (
                        <motion.span
                          layoutId="active-nav-indicator"
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-[#8247e5]/35 via-white/[0.12] to-[#56259e]/35 border border-[#d8c4ff]/45 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] -z-10"
                          transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                        />
                      )}
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-[#cbc5d8] transition-transform duration-200 ${
                          armsDropdownOpen ? 'rotate-180 text-[#c9b3ff]' : ''
                        }`}
                      />
                    </button>

                    <EightArmsDropdown
                      isOpen={armsDropdownOpen}
                      onClose={() => setArmsDropdownOpen(false)}
                      onSelectArm={handleArmClick}
                      onExploreSystem={() => handlePageClick('the-8-arms')}
                      onMouseEnter={handleDropdownMouseEnter}
                      onMouseLeave={handleDropdownMouseLeave}
                    />
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  data-prefetch-route={item.id}
                  onMouseEnter={() => prefetchRoute(item.id)}
                  onFocus={() => prefetchRoute(item.id)}
                  onTouchStart={() => prefetchRoute(item.id)}
                  onClick={() => handlePageClick(item.id)}
                  className={`relative px-2.5 xl:px-3.5 py-1.5 rounded-full text-xs xl:text-sm font-semibold transition-colors duration-200 flex items-center gap-1 xl:gap-1.5 cursor-pointer border-0 bg-transparent whitespace-nowrap ${
                    isActive
                      ? 'text-white'
                      : 'text-[#cbc5d8] hover:text-white'
                  }`}
                  data-cursor="pointer"
                >
                  {isActive && (
                    <motion.span
                      layoutId="active-nav-indicator"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-[#8247e5]/35 via-white/[0.12] to-[#56259e]/35 border border-[#d8c4ff]/45 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span>{item.label}</span>
                </button>
              );
            })}

            {scrolled && (
              <div className="w-px h-4 bg-white/15 mx-1 shrink-0" />
            )}
          </motion.nav>

          {/* 3. END EDGE: LANGUAGE SWITCHER + PRIMARY CTA + MOBILE MENU */}
          <motion.div
            layout="position"
            className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 shrink-0"
          >
            {/* Language Toggle Button — Frosted Glass Medallion */}
            <button
              type="button"
              onClick={toggleLang}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full bg-gradient-to-b from-white/[0.12] via-white/[0.045] to-[#1a0d2e]/[0.38] hover:from-[#b88cff]/[0.22] hover:to-[#4c1f99]/[0.42] backdrop-blur-[12px] backdrop-saturate-[180%] border border-white/[0.18] hover:border-[#d8c4ff]/65 shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_8px_20px_rgba(0,0,0,0.5)] text-xs font-bold text-[#e6e2f2] hover:text-white transition-all active:scale-95 cursor-pointer shrink-0 min-h-[34px] sm:min-h-[36px]"
              aria-label={isAr ? 'Switch language to English' : 'التحويل إلى اللغة العربية'}
              title={isAr ? 'Switch language to English' : 'التحويل إلى اللغة العربية'}
              id="header-lang-toggle"
            >
              <Globe className="w-3.5 h-3.5 text-[#c9b3ff]" />
              <span className="font-mono text-[10.5px] sm:text-[11px] lg:text-xs font-bold">
                {isAr ? 'EN' : 'عربي'}
              </span>
            </button>

            {/* Desktop & Tablet Header CTA Button */}
            <div className="hidden sm:block shrink-0">
              <MagneticButton strength={6}>
                <LiquidGlassButton
                  id="header-cta-whatsapp"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="sm"
                  variant="primary"
                  aria-label={t('nav.cta')}
                >
                  <span>{t('nav.cta')}</span>
                </LiquidGlassButton>
              </MagneticButton>
            </div>

            {/* Mobile & Tablet Hamburger Menu Toggle — Frosted Glass Medallion */}
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && 'vibrate' in navigator) {
                  try { navigator.vibrate(10); } catch {}
                }
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="lg:hidden w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full text-[#f2effa] hover:text-white bg-gradient-to-b from-white/[0.12] via-white/[0.05] to-[#1a0d2e]/[0.4] backdrop-blur-[12px] backdrop-saturate-[180%] border border-white/[0.18] hover:border-[#d8c4ff]/65 shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_8px_18px_rgba(0,0,0,0.5)] flex items-center justify-center transition-all active:scale-95 touch-manipulation cursor-pointer shrink-0"
              aria-label="القائمة / Menu"
              aria-expanded={mobileMenuOpen}
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 text-white" /> : <Menu className="w-4 h-4" />}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Mobile & Tablet Menu via Portal */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {mobileMenuOpen && (
              <div
                className="fixed inset-0 z-[999] lg:hidden flex flex-col justify-start items-center p-3 sm:p-5 overflow-y-auto overscroll-none touch-pan-y"
                dir={dir}
              >
                {/* Frosted Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="fixed inset-0 bg-[#050308]/85 backdrop-blur-[12px] touch-manipulation overscroll-none"
                />

                {/* Luxury Frosted Obsidian & Amethyst Menu Panel */}
                <motion.div
                  initial={{ opacity: 0, y: -16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, scale: 0.98 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-10 w-full max-w-[420px] my-auto sm:my-6 rounded-[28px] bg-[#090612]/92 backdrop-blur-[16px] backdrop-saturate-[180%] border border-white/[0.16] p-4 sm:p-5 shadow-[0_28px_70px_rgba(0,0,0,0.95),inset_0_1px_1.5px_rgba(255,255,255,0.28)] flex flex-col overflow-hidden"
                >
                  {/* Top Specular Hairline */}
                  <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-white/55 to-transparent pointer-events-none" />

                  {/* Top Bar inside Menu: Logo + Language Toggle + Close Button */}
                  <div className="relative z-10 flex items-center justify-between pb-3.5 border-b border-white/[0.1]">
                    <button
                      type="button"
                      onClick={() => handlePageClick('home')}
                      className="cursor-pointer bg-transparent border-0 p-0 text-left"
                    >
                      <OctoLogo variant="compact" />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          toggleLang();
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] backdrop-blur-[12px] border border-white/[0.16] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] text-xs font-bold text-[#e6e2f2] hover:text-white transition-colors cursor-pointer"
                      >
                        <Globe className="w-3.5 h-3.5 text-[#c9b3ff]" />
                        <span>{isAr ? 'English' : 'العربية'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] backdrop-blur-[12px] border border-white/[0.16] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] text-[#d8d4e4] hover:text-white text-xs font-bold transition-colors cursor-pointer"
                        aria-label={t('common.close')}
                      >
                        <X className="w-4 h-4 text-[#c9b3ff]" />
                        <span>{isAr ? 'إغلاق' : 'Close'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Navigation List */}
                  <div className="relative z-10 flex flex-col space-y-1.5 my-3.5">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive =
                        currentPage === item.id ||
                        (item.id === 'services' && (currentPage === 'the-8-arms' || currentPage === 'services')) ||
                        (item.id === 'the-8-arms' && (currentPage === 'services' || currentPage === 'the-8-arms'));

                      if (item.id === 'the-8-arms') {
                        return (
                          <div key={item.id} className="flex flex-col space-y-1.5">
                            <div
                              className={`group relative w-full flex items-center justify-between p-3 rounded-2xl border backdrop-blur-[12px] transition-all duration-200 ${
                                isActive
                                  ? 'bg-gradient-to-r from-[#8247e5]/25 to-[#4c1f99]/25 border-[#d8c4ff]/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.28)] text-white'
                                  : 'bg-white/[0.035] hover:bg-white/[0.08] border-white/[0.12] text-[#e6e2f2] hover:text-white'
                              }`}
                            >
                              <button
                                type="button"
                                data-prefetch-route={item.id}
                                onMouseEnter={() => prefetchRoute(item.id)}
                                onFocus={() => prefetchRoute(item.id)}
                                onTouchStart={() => prefetchRoute(item.id)}
                                onClick={() => handlePageClick(item.id)}
                                className="flex items-center gap-3 flex-1 text-start cursor-pointer bg-transparent border-0 p-0 text-inherit relative z-10"
                              >
                                <div
                                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all backdrop-blur-[12px] border shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)] ${
                                    isActive
                                      ? 'bg-gradient-to-br from-[#8247e5] to-[#56259e] border-[#e9dcff]/60 text-white'
                                      : 'bg-white/[0.07] text-[#e6e2f2] border-white/[0.16]'
                                  }`}
                                >
                                  <Icon className="w-4 h-4" />
                                </div>
                                <span className="text-sm sm:text-base font-bold block">
                                  {item.label}
                                </span>
                              </button>

                              <div className="flex items-center gap-2 relative z-10">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    prefetchRoute('the-8-arms');
                                    setMobileArmsExpanded((prev) => !prev);
                                  }}
                                  className="p-1.5 px-2.5 rounded-full text-[#e6e2f2] hover:text-white bg-white/[0.06] border border-white/[0.14] transition-colors cursor-pointer flex items-center gap-1"
                                  aria-label={isAr ? 'عرض الأذرع الثمانية' : 'Expand 8 arms'}
                                >
                                  <ChevronDown
                                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                      mobileArmsExpanded ? 'rotate-180 text-[#c9b3ff]' : ''
                                    }`}
                                  />
                                </button>
                              </div>
                            </div>

                            {/* Expandable services sub-list for mobile */}
                            <AnimatePresence>
                              {mobileArmsExpanded && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                  className="overflow-hidden"
                                >
                                  <div className="ps-2 sm:ps-3 pe-1 py-2 flex flex-col space-y-1 rounded-2xl bg-white/[0.03] backdrop-blur-[12px] border border-white/[0.1]">
                                    {armsList.map((arm) => {
                                      const ArmIcon = getArmIcon(arm.iconName);

                                      return (
                                        <button
                                          key={arm.id}
                                          type="button"
                                          data-prefetch-route={`arm-${arm.id}`}
                                          onMouseEnter={() => prefetchRoute(`arm-${arm.id}`)}
                                          onFocus={() => prefetchRoute(`arm-${arm.id}`)}
                                          onTouchStart={() => prefetchRoute(`arm-${arm.id}`)}
                                          onClick={() => handleArmClick(arm)}
                                          className="group relative w-full flex items-center justify-between p-2 rounded-xl bg-transparent hover:bg-white/[0.07] text-start transition-colors cursor-pointer"
                                        >
                                          <div className="flex items-center gap-2.5 min-w-0 relative z-10">
                                            <div className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center bg-white/[0.07] backdrop-blur-[12px] border border-white/[0.15] group-hover:border-[#d8c4ff]/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] transition-colors">
                                              <ArmIcon className="w-3.5 h-3.5 text-[#e6e2f2] group-hover:text-white" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                              <div className="text-xs sm:text-sm font-semibold text-[#d8d4e4] group-hover:text-white truncate">
                                                {isAr ? arm.title : arm.enTitle || arm.title}
                                              </div>
                                            </div>
                                          </div>
                                          <ChevronRight
                                            className={`w-3.5 h-3.5 text-[#a8a2b8] group-hover:text-[#c9b3ff] transition-colors shrink-0 ${
                                              dir === 'rtl' ? 'rotate-180' : ''
                                            }`}
                                          />
                                        </button>
                                      );
                                    })}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      }

                      return (
                        <button
                          key={item.id}
                          type="button"
                          data-prefetch-route={item.id}
                          onMouseEnter={() => prefetchRoute(item.id)}
                          onFocus={() => prefetchRoute(item.id)}
                          onTouchStart={() => prefetchRoute(item.id)}
                          onClick={() => handlePageClick(item.id)}
                          className={`group relative w-full flex items-center justify-between p-3 rounded-2xl border backdrop-blur-[12px] transition-all duration-200 cursor-pointer text-start ${
                            isActive
                              ? 'bg-gradient-to-r from-[#8247e5]/25 to-[#4c1f99]/25 border-[#d8c4ff]/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.28)] text-white'
                              : 'bg-white/[0.035] hover:bg-white/[0.08] border-white/[0.12] text-[#e6e2f2] hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-3 relative z-10">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all backdrop-blur-[12px] border shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)] ${
                                isActive
                                  ? 'bg-gradient-to-br from-[#8247e5] to-[#56259e] border-[#e9dcff]/60 text-white'
                                  : 'bg-white/[0.07] text-[#e6e2f2] border-white/[0.16]'
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-sm sm:text-base font-bold block">
                              {item.label}
                            </span>
                          </div>

                          <ChevronRight
                            className={`w-4 h-4 text-[#a8a2b8] group-hover:text-white transition-colors ${
                              dir === 'rtl' ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>

                  {/* Single Primary Action in Mobile Drawer */}
                  <div className="relative z-10 pt-3 border-t border-white/[0.1]">
                    <LiquidGlassButton
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                      variant="primary"
                      size="md"
                      className="w-full"
                    >
                      <MessageCircle className="w-4 h-4 text-[#e9dcff]" />
                      <span>{t('nav.cta')}</span>
                    </LiquidGlassButton>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </header>
  );
};

