import React, { useState, useEffect } from 'react';
import {
  Phone,
  MessageCircle,
  X,
  Home,
  Layers,
  Briefcase,
  Users,
  Zap,
  ArrowUp,
  Globe,
  Share2,
  Check,
  CalendarCheck,
  Compass,
  BookOpen,
  Mail,
  FileText,
  Download,
  Smartphone,
  PlusSquare,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { MagneticButton } from './MagneticButton';
import { prefetchRoute } from '../utils/routePrefetch';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { trackConversionEvent } from './ConversionTracker';

// Authentic Official WhatsApp Brand Logo SVG
const WhatsAppOfficialIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413z" />
  </svg>
);

interface StickyActionsProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
  onOpenConsultation?: () => void;
}

export const StickyActions: React.FC<StickyActionsProps> = ({
  currentPage = 'home',
  onNavigate,
  onOpenConsultation,
}) => {
  const { lang, t, isAr, dir, toggleLang } = useLanguage();
  const { isNativePromptReady, isInstalled, isIOS, triggerInstall } = usePWAInstall();
  const [showCallModal, setShowCallModal] = useState(false);
  const [showMobileHub, setShowMobileHub] = useState(false);
  const [showInstallGuideModal, setShowInstallGuideModal] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Monitor scroll for Back-To-Top button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 320);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock background page scroll when Mobile Hub, Call Modal, or Install Guide Modal is open
  useEffect(() => {
    if (showMobileHub || showCallModal || showInstallGuideModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showMobileHub, showCallModal, showInstallGuideModal]);

  const whatsappMessage = encodeURIComponent(
    isAr
      ? 'مرحباً فريق Pulse OCTO،\nأود الاستفسار عن باقات الخدمات الرقمية وكيف يمكن لأذرعكم الثمانية دعم مشروعي.'
      : 'Hello Pulse OCTO Team,\nI would like to inquire about your digital service packages and how your eight arms can accelerate my project.'
  );

  const whatsappUrl = `https://wa.me/201116066968?text=${whatsappMessage}`;

  // Context-aware Quick Quote tailored to the current page
  const getPageQuoteDetails = (page: string, arabic: boolean) => {
    switch (page) {
      case 'the-8-arms':
        return {
          title: arabic ? 'عرض سعر: الأذرع الـ 8' : 'Quote: 8 Arms',
          badge: arabic ? 'خدمات رقمية' : 'Services',
          message: arabic
            ? 'مرحباً فريق Pulse OCTO،\nأود الحصول على عرض سعر سريع (Quick Quote) لباقات الأذرع الرقمية الـ 8 (التسويق، البرمجة، أو بناء الهوية والتصميم).\nأرجو تزويدي بالباقات والأسعار المتاحة لمشروعي.'
            : 'Hello Pulse OCTO Team,\nI would like to request a Quick Quote for your 8 Arms digital services (Digital Marketing, Web/Tech Development, or Branding).\nPlease share the packages and pricing details for my project.'
        };
      case 'portfolio':
        return {
          title: arabic ? 'عرض سعر: مشروع مماثل' : 'Quote: Portfolio',
          badge: arabic ? 'معرض الأعمال' : 'Portfolio',
          message: arabic
            ? 'مرحباً فريق Pulse OCTO،\nشاهدت نماذج أعمالكم المميزة في معرض المشاريع، وأود الحصول على عرض سعر سريع لتنفيذ مشروع مماثل لأعمالي.\nأتطلع لمناقشة التفاصيل والبدء معكم!'
            : 'Hello Pulse OCTO Team,\nI browsed your portfolio works and case studies, and I would like a Quick Quote to execute a similar project for my business.\nLooking forward to collaborating!'
        };
      case 'who-we-are':
        return {
          title: arabic ? 'عرض سعر: شراكة استراتيجية' : 'Quote: Partnership',
          badge: arabic ? 'عن الوكالة' : 'About',
          message: arabic
            ? 'مرحباً فريق Pulse OCTO،\nأود طلب عرض سعر سريع واستكشاف سبل التعاون الاستراتيجي مع فريقكم لدعم نمو علامتي التجارية.\nكيف يمكننا البدء؟'
            : 'Hello Pulse OCTO Team,\nI would like to request a Quick Quote and explore strategic collaboration with the Pulse OCTO team to elevate my brand.\nHow can we get started?'
        };
      case 'blog':
        return {
          title: arabic ? 'عرض سعر: خطة تسويق' : 'Quote: Marketing Plan',
          badge: arabic ? 'المدونة' : 'Blog Insights',
          message: arabic
            ? 'مرحباً فريق Pulse OCTO،\nتابعت مقالاتكم التسويقية، وأرغب في الحصول على عرض سعر سريع لخطة تسويق رقمي ونمو مخصصة لمشروعي.'
            : 'Hello Pulse OCTO Team,\nI enjoyed reading your marketing insights and would like a Quick Quote for an integrated digital growth strategy for my business.'
        };
      case 'contact':
        return {
          title: arabic ? 'عرض سعر فوري ومباشر' : 'Direct RFQ',
          badge: arabic ? 'تواصل فوري' : 'Instant RFQ',
          message: arabic
            ? 'مرحباً فريق Pulse OCTO،\nأود طلب عرض سعر سريع وفوري لمشروعي، ومناقشة تفاصيل المتطلبات والميزانية لبدء التنفيذ.'
            : 'Hello Pulse OCTO Team,\nI would like an instant Quick Quote for my project scope, budget estimation, and immediate kickoff.'
        };
      case 'home':
      default:
        return {
          title: arabic ? 'عرض سعر سريع' : 'Quick Quote',
          badge: arabic ? 'تسعير فوري' : 'Instant Quote',
          message: arabic
            ? 'مرحباً فريق Pulse OCTO،\nأود الحصول على عرض سعر سريع (Quick Quote) لخدمات التسويق الرقمي وبناء الهوية وتطوير الأعمال لمشروعي.\nأرجو إفادتي بأفضل الباقات المتاحة.'
            : 'Hello Pulse OCTO Team,\nI would like to request a Quick Quote for your digital marketing, branding, and development services.\nPlease let me know the best available packages.'
        };
    }
  };

  const currentQuote = getPageQuoteDetails(currentPage, isAr);
  const quickQuoteUrl = `https://wa.me/201116066968?text=${encodeURIComponent(currentQuote.message)}`;

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch {
        // Ignored if device does not permit vibration
      }
    }
  };

  const handleMobileNavClick = (pageId: string) => {
    triggerHaptic();
    setShowMobileHub(false);
    if (onNavigate) {
      onNavigate(pageId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    triggerHaptic();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShareOrCopy = async () => {
    triggerHaptic();
    const shareData = {
      title: 'Pulse OCTO | وكالة التسويق الرقمي بالأذرع الـ 8',
      text: isAr
        ? '8 أذرع.. عقل واحد.. نبض واحد. استكشف منظومة Pulse OCTO الرقمية المتكاملة.'
        : '8 Arms. One Mind. One Pulse. Explore the synchronized Pulse OCTO digital ecosystem.',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // Fallback or user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2200);
      } catch {
        // Clipboard error fallback
      }
    }
  };

  const handleInstallApp = async (
    source: 'desktop_floating' | 'mobile_floating' | 'mobile_quick_hub' = 'desktop_floating'
  ) => {
    triggerHaptic();
    trackConversionEvent('pwa_install_button_click', {
      source,
      page_path: `/${currentPage}`,
      native_prompt_ready: isNativePromptReady,
      is_ios: isIOS,
    });

    const outcome = await triggerInstall();
    if (outcome === 'accepted') {
      trackConversionEvent(
        'pwa_install_prompt_accepted',
        {
          source,
          page_path: `/${currentPage}`,
        },
        'Lead'
      );
    } else if (outcome === 'dismissed') {
      trackConversionEvent('pwa_install_prompt_dismissed', {
        source,
        page_path: `/${currentPage}`,
      });
    } else if (outcome === 'manual-guide') {
      trackConversionEvent('pwa_install_guide_opened', {
        source,
        page_path: `/${currentPage}`,
        is_ios: isIOS,
      });
      setShowMobileHub(false);
      setShowInstallGuideModal(true);
    }
  };

  // Mobile Bottom Dock Items
  const mobileDockItems = [
    { id: 'home', label: t('nav.home'), icon: Home },
    { id: 'the-8-arms', label: isAr ? 'الأذرع' : '8 Arms', icon: Layers },
    // Center pulse hub handled separately
    { id: 'portfolio', label: isAr ? 'الأعمال' : 'Works', icon: Briefcase },
    { id: 'who-we-are', label: isAr ? 'عن الوكالة' : 'About', icon: Users },
  ];

  return (
    <>
      {/* 
        =========================================================
        1. DESKTOP FLOATING BUTTONS (Hidden on Mobile < md)
        Restrained, architectural controls without distracting ping rings
        =========================================================
      */}
      <div className="hidden md:flex fixed bottom-6 inset-x-0 px-6 sm:px-8 justify-between items-center pointer-events-none z-40">
        {/* Call button: sleek dark charcoal with subtle purple accent */}
        <MagneticButton strength={12} className="pointer-events-auto">
          <button
            onClick={() => {
              triggerHaptic();
              setShowCallModal(true);
            }}
            className="relative group flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#0d0a18]/92 border border-purple-500/30 text-purple-200 hover:bg-[#7c3aed] hover:border-purple-400/60 hover:text-white shadow-[0_8px_24px_rgba(0,0,0,0.75)] backdrop-blur-xl transition-all duration-300 active:scale-95 cursor-pointer"
            aria-label={t('sticky.phoneTooltip')}
            title={t('sticky.phoneTooltip')}
            data-cursor="pointer"
          >
            <Phone className="w-4 h-4 sm:w-5 sm:h-5 relative z-10 transition-transform duration-200 group-hover:scale-105" />

            <span
              className={`absolute ${
                dir === 'rtl' ? 'right-full mr-3' : 'left-full ml-3'
              } px-3 py-1.5 rounded-lg bg-[#09080f]/95 text-xs font-medium text-zinc-100 whitespace-nowrap shadow-xl border border-white/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
            >
              {t('sticky.phoneTooltip')}
            </span>
          </button>
        </MagneticButton>

        {/* Actions Cluster: Deferred PWA Install + Direct WhatsApp */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {!isInstalled && (
            <MagneticButton strength={12} className="pointer-events-auto">
              <button
                type="button"
                onClick={() => handleInstallApp('desktop_floating')}
                id="sticky-pwa-install-desktop"
                className="relative group flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#0d0a18]/92 border border-purple-500/35 text-purple-300 hover:bg-[#7c3aed] hover:border-purple-400/60 hover:text-white shadow-[0_8px_24px_rgba(0,0,0,0.75)] backdrop-blur-xl transition-all duration-300 active:scale-95 cursor-pointer"
                aria-label={isAr ? 'تثبيت تطبيق Pulse OCTO' : 'Install Pulse OCTO App'}
                title={isAr ? 'تثبيت تطبيق Pulse OCTO' : 'Install Pulse OCTO App'}
                data-cursor="pointer"
              >
                <Download className="w-4.5 h-4.5 sm:w-5 sm:h-5 relative z-10 transition-transform duration-200 group-hover:scale-105" />

                <span
                  className={`absolute ${
                    dir === 'rtl' ? 'left-full ml-3' : 'right-full mr-3'
                  } px-3 py-1.5 rounded-lg bg-[#09080f]/95 text-xs font-medium text-zinc-100 whitespace-nowrap shadow-xl border border-white/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
                >
                  {isAr ? 'تثبيت تطبيق Pulse OCTO' : 'Install Pulse OCTO App'}
                </span>
              </button>
            </MagneticButton>
          )}

          <MagneticButton strength={12} className="pointer-events-auto">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={triggerHaptic}
              id="sticky-whatsapp-desktop"
              className="relative group flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#0d0a18]/92 border border-emerald-500/35 text-emerald-400 hover:bg-[#1f9d55] hover:border-emerald-400/60 hover:text-white shadow-[0_8px_24px_rgba(0,0,0,0.75)] backdrop-blur-xl transition-all duration-300 active:scale-95 cursor-pointer"
              aria-label={t('sticky.whatsappTooltip')}
              title={t('sticky.whatsappTooltip')}
              data-cursor="pointer"
            >
              <WhatsAppOfficialIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5 relative z-10 transition-transform duration-200 group-hover:scale-105" />

              <span
                className={`absolute ${
                  dir === 'rtl' ? 'left-full ml-3' : 'right-full mr-3'
                } px-3 py-1.5 rounded-lg bg-[#09080f]/95 text-xs font-medium text-zinc-100 whitespace-nowrap shadow-xl border border-white/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
              >
                {t('sticky.whatsappTooltip')}
              </span>
            </a>
          </MagneticButton>
        </div>
      </div>

      {/* 
        =========================================================
        2. DESKTOP BACK TO TOP BUTTON (Hidden on Mobile < md)
        =========================================================
      */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            key="universal-back-to-top"
            initial={{ opacity: 0, scale: 0.85, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 12 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            className="hidden md:flex fixed bottom-20 left-6 sm:left-8 z-40 w-10 h-10 rounded-full bg-[#09080f]/90 border border-white/10 hover:border-purple-500/40 text-zinc-300 hover:text-white shadow-[0_8px_20px_rgba(0,0,0,0.75)] backdrop-blur-xl items-center justify-center active:scale-95 transition-all cursor-pointer touch-manipulation pointer-events-auto"
            aria-label={isAr ? 'العودة للأعلى' : 'Back to top'}
            title={isAr ? 'العودة للأعلى' : 'Back to top'}
          >
            <ArrowUp className="w-4 h-4 pointer-events-none" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 
        =========================================================
        3. MOBILE FLOATING ACTIONS (Left: Quick Hub & PWA Install · Right: WhatsApp)
        Subtle, low-profile dark controls
        =========================================================
      */}
      <div className="md:hidden fixed bottom-[68px] left-3 sm:left-4 z-40 flex flex-col gap-2 pointer-events-none">
        {!isInstalled && (
          <button
            type="button"
            onClick={() => handleInstallApp('mobile_floating')}
            id="sticky-pwa-install-mobile"
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-[#0d0a18]/92 border border-purple-500/40 text-purple-200 shadow-[0_6px_18px_rgba(0,0,0,0.8)] backdrop-blur-xl active:scale-95 transition-all cursor-pointer pointer-events-auto touch-manipulation select-none"
            aria-label={isAr ? 'تثبيت تطبيق Pulse OCTO' : 'Install Pulse OCTO App'}
            title={isAr ? 'تثبيت تطبيق Pulse OCTO' : 'Install Pulse OCTO App'}
          >
            <Download className="w-4 h-4 text-purple-300 relative z-10 pointer-events-none" />
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            triggerHaptic();
            setShowMobileHub(true);
          }}
          id="sticky-quick-hub-mobile"
          className="group flex items-center justify-center w-10 h-10 rounded-full bg-[#0d0a18]/92 border border-purple-500/35 text-purple-200 shadow-[0_6px_18px_rgba(0,0,0,0.8)] backdrop-blur-xl active:scale-95 transition-all cursor-pointer pointer-events-auto touch-manipulation select-none"
          aria-label={isAr ? 'مركز النبض السريع' : 'Quick Hub'}
          title={isAr ? 'مركز النبض السريع' : 'Quick Hub'}
        >
          <Phone className="w-4 h-4 text-purple-300 relative z-10 pointer-events-none" />
        </button>
      </div>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={triggerHaptic}
        id="sticky-whatsapp-mobile"
        className="md:hidden fixed bottom-[68px] right-3 sm:right-4 z-40 group flex items-center justify-center w-10 h-10 rounded-full bg-[#0d0a18]/92 border border-emerald-500/35 text-emerald-400 shadow-[0_6px_18px_rgba(0,0,0,0.8)] backdrop-blur-xl active:scale-95 transition-all cursor-pointer pointer-events-auto touch-manipulation select-none"
        aria-label={t('sticky.whatsappTooltip')}
        title={t('sticky.whatsappTooltip')}
      >
        <WhatsAppOfficialIcon className="w-4.5 h-4.5 text-emerald-400 relative z-10 pointer-events-none" />
      </a>

      {/* 
        =========================================================
        4. PRIMARY MOBILE BOTTOM NAVIGATION BAR
        =========================================================
      */}
      <aside className="md:hidden fixed bottom-2 inset-x-2 z-40 pointer-events-none max-w-lg mx-auto pb-safe overscroll-none">
        <nav
          className="pointer-events-auto relative px-1.5 py-1 rounded-2xl bg-[#09080f]/95 border border-white/10 backdrop-blur-2xl shadow-[0_12px_36px_rgba(0,0,0,0.92)] flex items-center justify-around gap-1 touch-manipulation overscroll-none select-none"
          aria-label={isAr ? 'أزرار التنقل الرئيسية لتجربة الموبايل' : 'Primary Mobile Navigation Bar'}
        >
          {[
            { id: 'home', label: isAr ? 'الرئيسية' : 'Home', icon: Home },
            { id: 'the-8-arms', label: isAr ? 'الـ 8 أذرع' : '8 Arms', icon: Layers },
            { id: 'portfolio', label: isAr ? 'الأعمال' : 'Works', icon: Briefcase },
            { id: 'who-we-are', label: isAr ? 'عن الوكالة' : 'About', icon: Users },
            { id: 'contact', label: isAr ? 'تواصل' : 'Contact', icon: CalendarCheck },
          ].map((item) => {
            const isActive = currentPage === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                data-prefetch-route={item.id}
                onMouseEnter={() => prefetchRoute(item.id)}
                onFocus={() => prefetchRoute(item.id)}
                onTouchStart={() => prefetchRoute(item.id)}
                onClick={() => handleMobileNavClick(item.id)}
                className={`relative flex flex-col items-center justify-center flex-1 min-h-[48px] py-1 px-1 rounded-xl transition-all duration-200 active:scale-95 cursor-pointer touch-manipulation ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 font-medium'
                }`}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeMobileNavTab"
                    className="absolute inset-0 rounded-xl bg-purple-600/15 border border-purple-500/30"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}

                <div className="relative z-10 flex items-center justify-center">
                  <Icon
                    className={`w-4.5 h-4.5 transition-all duration-200 ${
                      isActive ? 'text-purple-300' : 'text-zinc-400'
                    }`}
                  />
                </div>

                <span
                  className={`relative z-10 text-[10px] sm:text-[11px] mt-1 truncate leading-none ${
                    isActive ? 'text-white font-semibold' : 'text-zinc-400'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* 
        =========================================================
        4. MOBILE QUICK ACTION BOTTOM SHEET (نافذة النبض السريعة)
        =========================================================
      */}
      <AnimatePresence>
        {showMobileHub && (
          <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end overscroll-none">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileHub(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md touch-none overscroll-none"
            />

            {/* Bottom Sheet Card with Native Swipe-to-Dismiss Gesture */}
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.6 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 75 || info.velocity.y > 350) {
                  setShowMobileHub(false);
                }
              }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className={`relative z-10 w-full rounded-t-3xl bg-[#09080f]/98 backdrop-blur-2xl border-t border-white/10 p-5 pb-8 shadow-[0_-16px_50px_rgba(0,0,0,0.95)] max-h-[85vh] overflow-y-auto overscroll-contain touch-pan-y ${
                isAr ? 'text-right' : 'text-left'
              }`}
              id="mobile-quick-sheet"
            >
              {/* Tactile Drag Handle Bar */}
              <div className="w-12 h-1.5 rounded-full bg-white/20 mx-auto mb-4 cursor-grab active:cursor-grabbing transition-colors" />

              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-purple-300">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      {isAr ? 'التواصل السريع' : 'Quick Contact'}
                    </h3>
                    <p className="text-[11px] text-zinc-400 font-medium">
                      {isAr ? 'قنوات التواصل المباشرة مع فريقنا' : 'Direct channels with our team'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowMobileHub(false)}
                  className="p-2 rounded-full text-zinc-400 hover:text-white bg-white/5 border border-white/10"
                  aria-label={t('common.close')}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Contextual Quick Quote Highlight Banner */}
              <a
                href={quickQuoteUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  triggerHaptic();
                  setShowMobileHub(false);
                }}
                id="sticky-quick-quote-sheet"
                className="w-full p-3.5 rounded-2xl bg-[#120e24] border border-purple-500/30 hover:border-purple-400/50 flex items-center justify-between gap-3 text-white active:scale-98 transition-all mb-3 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-300 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold block text-white">
                        {isAr ? 'طلب عرض سعر سريع' : 'Quick Quote Request'}
                      </span>
                      <span className="text-[10px] text-purple-300 font-medium">
                        · {currentQuote.badge}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 line-clamp-1">
                      {isAr ? `رسالة واتساب مجهزة لـ: ${currentQuote.title}` : `WhatsApp inquiry pre-filled for: ${currentQuote.title}`}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] px-3 py-1.5 rounded-xl bg-[#7c3aed] text-white font-semibold whitespace-nowrap flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{isAr ? 'واتساب' : 'WhatsApp'}</span>
                </span>
              </a>

              {/* Fast Action Grid */}
              <div className="grid grid-cols-2 gap-2.5 mb-3">
                {/* 1. Direct WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    triggerHaptic();
                    setShowMobileHub(false);
                  }}
                  className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/40 flex flex-col items-start justify-between gap-2 text-white active:scale-98 transition-all"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">{isAr ? 'واتساب مباشر' : 'Live WhatsApp'}</span>
                    <span className="text-[10px] text-zinc-400">
                      {isAr ? 'رد فوري خلال دقائق' : 'Instant response'}
                    </span>
                  </div>
                </a>

                {/* 2. Direct Call Line */}
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic();
                    setShowMobileHub(false);
                    setShowCallModal(true);
                  }}
                  className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/40 flex flex-col items-start justify-between gap-2 text-white active:scale-98 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 flex items-center justify-center">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">{isAr ? 'اتصال هاتفي' : 'Phone Call'}</span>
                    <span className="text-[10px] text-zinc-400">
                      {isAr ? 'خط استشارات مباشر' : 'Direct advisory line'}
                    </span>
                  </div>
                </button>
              </div>

              {/* Direct Official Email Banners in Mobile Hub */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                <a
                  href="mailto:CEO@pulseOCTO.com"
                  onClick={() => {
                    triggerHaptic();
                    setShowMobileHub(false);
                  }}
                  className="w-full p-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/35 flex items-center justify-between gap-2.5 text-white active:scale-98 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/10 text-purple-300 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] font-bold block text-white">
                        {isAr ? 'البريد التنفيذي' : 'Executive Email'}
                      </span>
                      <span className="text-[11px] font-mono text-zinc-300 truncate block" dir="ltr">
                        CEO@pulseOCTO.com
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded-lg bg-white/[0.06] border border-white/10 text-zinc-200 font-semibold shrink-0">
                    {isAr ? 'إيميل' : 'Email'}
                  </span>
                </a>

                <a
                  href="mailto:contact@pulseocto.com"
                  onClick={() => {
                    triggerHaptic();
                    setShowMobileHub(false);
                  }}
                  className="w-full p-3 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-purple-500/35 flex items-center justify-between gap-2.5 text-white active:scale-98 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-white/[0.05] border border-white/10 text-purple-300 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] font-bold block text-white">
                        {isAr ? 'بريد خدمة العملاء' : 'Client Contact Email'}
                      </span>
                      <span className="text-[11px] font-mono text-zinc-300 truncate block" dir="ltr">
                        contact@pulseocto.com
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded-lg bg-white/[0.06] border border-white/10 text-zinc-200 font-semibold shrink-0">
                    {isAr ? 'إيميل' : 'Email'}
                  </span>
                </a>
              </div>

              {/* Quick Page Jump Navigation Buttons */}
              <div className="mb-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <div className="text-[11px] font-semibold text-zinc-400 mb-2 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-purple-400" />
                  <span>{isAr ? 'التنقل السريع بالصفحات' : 'Quick Page Navigation'}</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: 'home', label: isAr ? 'الرئيسية' : 'Home', icon: Home },
                    { id: 'who-we-are', label: isAr ? 'عن الوكالة' : 'About', icon: Users },
                    { id: 'the-8-arms', label: isAr ? 'الـ 8 أذرع' : '8 Arms', icon: Layers },
                    { id: 'portfolio', label: isAr ? 'الأعمال' : 'Works', icon: Briefcase },
                    { id: 'blog', label: isAr ? 'المدونة' : 'Blog', icon: BookOpen },
                    { id: 'contact', label: isAr ? 'تواصل' : 'Contact', icon: Mail },
                  ].map((navItem) => {
                    const isCur = currentPage === navItem.id;
                    const NavIcon = navItem.icon;
                    return (
                      <button
                        key={navItem.id}
                        type="button"
                        data-prefetch-route={navItem.id}
                        onMouseEnter={() => prefetchRoute(navItem.id)}
                        onFocus={() => prefetchRoute(navItem.id)}
                        onTouchStart={() => prefetchRoute(navItem.id)}
                        onClick={() => handleMobileNavClick(navItem.id)}
                        className={`flex items-center justify-center gap-1.5 p-2 rounded-xl text-[10px] sm:text-[11px] font-semibold transition-all active:scale-95 cursor-pointer min-h-[38px] ${
                          isCur
                            ? 'bg-purple-600/20 text-white border border-purple-500/40'
                            : 'bg-white/[0.03] text-zinc-300 hover:text-white border border-white/5'
                        }`}
                      >
                        <NavIcon className={`w-3.5 h-3.5 ${isCur ? 'text-purple-300' : 'text-zinc-400'}`} />
                        <span className="truncate">{navItem.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Consultation Full-Width Banner Action */}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic();
                  setShowMobileHub(false);
                  if (onOpenConsultation) {
                    onOpenConsultation();
                  } else if (onNavigate) {
                    onNavigate('contact');
                  }
                }}
                className="w-full p-3.5 rounded-2xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-xs sm:text-sm flex items-center justify-between mb-3 shadow-[0_10px_24px_rgba(124,58,237,0.3)] active:scale-98 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <CalendarCheck className="w-4 h-4 text-purple-100" />
                  <span>{isAr ? 'ابدأ نبض مشروعك' : 'Start Your Project Pulse'}</span>
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/15">
                  {isAr ? 'ابدأ الآن' : 'Start Now'}
                </span>
              </button>

              {/* PWA Home Screen App Install Card inside Mobile Hub */}
              {!isInstalled && (
                <button
                  type="button"
                  onClick={() => handleInstallApp('mobile_quick_hub')}
                  id="sticky-pwa-install-sheet"
                  className="w-full p-3 rounded-2xl bg-purple-950/35 border border-purple-500/35 hover:border-purple-400/60 flex items-center justify-between gap-3 text-white active:scale-98 transition-all mb-3 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src="/apple-touch-icon.png"
                      alt="Pulse OCTO App Icon"
                      width={36}
                      height={36}
                      className="w-9 h-9 rounded-xl object-cover border border-purple-400/30 shrink-0"
                    />
                    <div className="min-w-0 text-start">
                      <span className="text-xs font-bold block text-white">
                        {isAr ? 'تثبيت تطبيق Pulse OCTO' : 'Install Pulse OCTO App'}
                      </span>
                      <span className="text-[10px] text-purple-200/80 truncate block">
                        {isAr
                          ? 'أضف التطبيق إلى شاشة هاتفك للوصول السريع'
                          : 'Add the web app to your phone home screen'}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] px-2.5 py-1.5 rounded-xl bg-purple-600/30 border border-purple-400/40 text-purple-100 font-semibold shrink-0 flex items-center gap-1">
                    <Download className="w-3.5 h-3.5" />
                    <span>{isAr ? 'تثبيت' : 'Install'}</span>
                  </span>
                </button>
              )}

              {/* Utility Tools: Language & Share */}
              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic();
                    toggleLang();
                  }}
                  className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] flex items-center justify-center gap-2 text-xs font-semibold text-zinc-200 active:scale-95 transition-all cursor-pointer"
                >
                  <Globe className="w-4 h-4 text-purple-300" />
                  <span>{isAr ? 'English Language' : 'اللغة العربية'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleShareOrCopy}
                  className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.06] flex items-center justify-center gap-2 text-xs font-semibold text-zinc-200 active:scale-95 transition-all cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">{isAr ? 'تم النسخ!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-purple-300" />
                      <span>{isAr ? 'مشاركة الموقع' : 'Share Site'}</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 
        =========================================================
        5. DIRECT PHONE CALL DIALOG (Universal Mobile & Desktop)
        =========================================================
      */}
      <AnimatePresence>
        {showCallModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overscroll-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className={`relative w-full max-w-md p-6 rounded-2xl bg-[#09080f] border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.9)] ${
                isAr ? 'text-right' : 'text-left'
              }`}
              id="call-modal"
            >
              <button
                onClick={() => setShowCallModal(false)}
                className={`absolute top-4 ${
                  isAr ? 'left-4' : 'right-4'
                } p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer`}
                aria-label={t('common.close')}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-center text-purple-300">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{t('sticky.modalTitle')}</h3>
                  <p className="text-xs text-zinc-400 font-medium">
                    {isAr ? 'خط الاستشارات الرقمية المباشر' : 'Direct Consultation Line'}
                  </p>
                </div>
              </div>

              <p className="text-sm text-zinc-300 mb-6 leading-relaxed">
                {t('sticky.modalSubtitle')}
              </p>

              <div className="space-y-2.5">
                <a
                  href="tel:+201112998882"
                  onClick={triggerHaptic}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-purple-500/40 transition-all text-white group active:scale-98"
                >
                  <span
                    className="font-mono text-base font-bold text-zinc-100 group-hover:text-white transition-colors"
                    dir="ltr"
                  >
                    +20 111 299 8882
                  </span>
                  <span className="text-xs px-3 py-1 rounded-lg bg-[#7c3aed] text-white font-semibold">
                    {t('sticky.callBtn')}
                  </span>
                </a>

                <a
                  href={`https://wa.me/201116066968?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={triggerHaptic}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/40 transition-all text-white group active:scale-98"
                >
                  <span
                    className="font-mono text-base font-bold text-zinc-100 group-hover:text-white transition-colors"
                    dir="ltr"
                  >
                    +20 111 606 6968
                  </span>
                  <span className="text-xs px-3 py-1 rounded-lg bg-[#1f9d55] text-white font-semibold flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5" />
                    {t('sticky.whatsappBtn')}
                  </span>
                </a>

                <a
                  href="mailto:CEO@pulseOCTO.com"
                  onClick={triggerHaptic}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-purple-500/40 transition-all text-white group active:scale-98"
                >
                  <span
                    className="font-mono text-sm sm:text-base font-bold text-zinc-200 group-hover:text-white transition-colors truncate"
                    dir="ltr"
                  >
                    CEO@pulseOCTO.com
                  </span>
                  <span className="text-xs px-3 py-1 rounded-lg bg-white/10 text-white font-semibold flex items-center gap-1.5 shrink-0">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{isAr ? 'مراسلة بريدية' : 'Send Email'}</span>
                  </span>
                </a>

                <a
                  href="mailto:contact@pulseocto.com"
                  onClick={triggerHaptic}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-purple-500/40 transition-all text-white group active:scale-98"
                >
                  <span
                    className="font-mono text-sm sm:text-base font-bold text-zinc-200 group-hover:text-white transition-colors truncate"
                    dir="ltr"
                  >
                    contact@pulseocto.com
                  </span>
                  <span className="text-xs px-3 py-1 rounded-lg bg-white/10 text-white font-semibold flex items-center gap-1.5 shrink-0">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{isAr ? 'تواصل مباشر' : 'Send Email'}</span>
                  </span>
                </a>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-zinc-400">
                <span>
                  {isAr ? 'أوقات العمل: ٩ ص - ١٠ م' : 'Working Hours: 9 AM - 10 PM'}
                </span>
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {isAr ? 'متاحون للتواصل' : 'Available'}
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 
        =========================================================
        6. PWA HOME SCREEN INSTALL GUIDE MODAL (iOS Safari / Fallback)
        =========================================================
      */}
      <AnimatePresence>
        {showInstallGuideModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overscroll-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className={`relative w-full max-w-md p-6 rounded-2xl bg-[#09080f] border border-purple-500/30 shadow-[0_24px_60px_rgba(0,0,0,0.92)] ${
                isAr ? 'text-right' : 'text-left'
              }`}
              id="pwa-install-guide-modal"
            >
              <button
                type="button"
                onClick={() => setShowInstallGuideModal(false)}
                className={`absolute top-4 ${
                  isAr ? 'left-4' : 'right-4'
                } p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer`}
                aria-label={t('common.close')}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3.5 mb-5">
                <img
                  src="/apple-touch-icon.png"
                  alt="Pulse OCTO App Icon"
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-2xl object-cover border border-purple-500/40 shadow-[0_8px_20px_rgba(124,58,237,0.3)] shrink-0"
                />
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {isAr ? 'تثبيت تطبيق Pulse OCTO' : 'Install Pulse OCTO App'}
                  </h3>
                  <p className="text-xs text-purple-300 font-medium">
                    {isAr
                      ? 'أضف التطبيق إلى شاشة هاتفك الرئيسية'
                      : 'Add the web app to your device home screen'}
                  </p>
                </div>
              </div>

              {isIOS ? (
                <div className="space-y-3 text-xs sm:text-sm text-zinc-300">
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <p className="leading-relaxed">
                      {isAr
                        ? '1. اضغط على زر المشاركة (Share) في شريط متصفح Safari بالأسفل.'
                        : '1. Tap the Share button in the bottom Safari toolbar.'}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
                      <PlusSquare className="w-4 h-4" />
                    </div>
                    <p className="leading-relaxed">
                      {isAr
                        ? '2. مرر للأسفل واختر "إضافة إلى الشاشة الرئيسية" (Add to Home Screen).'
                        : '2. Scroll down and tap "Add to Home Screen".'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs sm:text-sm text-zinc-300">
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <p className="leading-relaxed">
                      {isAr
                        ? '1. افتح قائمة المتصفح (⋮) في أعلى الشاشة أو اضغط على أيقونة التثبيت في شريط العنوان.'
                        : '1. Open the browser menu (⋮) or click the install icon in the address bar.'}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
                      <Download className="w-4 h-4" />
                    </div>
                    <p className="leading-relaxed">
                      {isAr
                        ? '2. اختر "تثبيت التطبيق" (Install App) أو "إضافة إلى الشاشة الرئيسية".'
                        : '2. Select "Install App" or "Add to Home Screen".'}
                    </p>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowInstallGuideModal(false)}
                className="mt-5 w-full py-2.5 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer"
              >
                {isAr ? 'حسناً، فهمت' : 'Got It'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
