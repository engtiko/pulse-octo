import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { OctoLogo } from './OctoLogo';
import {
  ArrowUp,
  MessageCircle,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  X,
  Facebook,
  Instagram,
  FileText,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { ThemeToggle } from './ThemeToggle';
import { prefetchRoute } from '../utils/routePrefetch';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t, isAr, dir } = useLanguage();
  const [activeLegalModal, setActiveLegalModal] = useState<'privacy' | 'terms' | null>(null);
  const [isClosingModal, setIsClosingModal] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (e: React.MouseEvent, page: string) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCloseLegalModal = () => {
    if (isClosingModal) return;
    setIsClosingModal(true);
    setTimeout(() => {
      setActiveLegalModal(null);
      setIsClosingModal(false);
    }, 280);
  };

  return (
    <footer
      className={`relative bg-[#050308] text-white pt-16 sm:pt-24 pb-28 sm:pb-16 overflow-hidden select-none ${
        isAr ? 'text-right' : 'text-left'
      }`}
      dir={dir}
    >
      {/* ============================================================
          1. BACKGROUND TYPOGRAPHIC WATERMARK & SUBTLE AMBIENT GLOW
         ============================================================ */}
      <div className="absolute top-2 inset-x-0 flex items-center justify-center pointer-events-none select-none overflow-hidden h-44 sm:h-64 z-0">
        <span
          className="font-black text-[17vw] lg:text-[15vw] uppercase tracking-tighter text-[#e6e2f2]/[0.03] leading-none whitespace-nowrap font-['Orbitron',sans-serif] will-change-transform"
          dir="ltr"
        >
          PULSE OCTO
        </span>
      </div>

      {/* Brand Watermark Emblem */}
      <div className="absolute -top-12 left-4 sm:left-12 lg:left-24 w-48 h-48 sm:w-72 sm:h-72 rounded-full opacity-[0.04] pointer-events-none select-none z-0 border border-white/15 flex items-center justify-center">
        <OctoLogo variant="iconOnly" className="w-28 h-28 sm:w-44 sm:h-44" />
      </div>

      {/* Subsurface Royal Amethyst & Silver Glow behind the curve */}
      <div className="absolute top-12 inset-x-0 mx-auto w-[75%] max-w-3xl h-36 sm:h-44 rounded-full bg-[#9d65f5]/16 blur-[100px] pointer-events-none z-0" />

      {/* ============================================================
          2. CENTRAL SCROLL-TO-TOP BUTTON (FROSTED CRYSTAL MEDALLION)
         ============================================================ */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center -mb-5 sm:-mb-6">
        <button
          type="button"
          onClick={scrollToTop}
          className="group relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-white/[0.12] via-[#2b184a]/45 to-[#090612]/80 hover:from-white/[0.18] hover:via-[#5e2ec0]/45 hover:to-[#120b22]/90 backdrop-blur-[12px] backdrop-saturate-[180%] [-webkit-backdrop-filter:blur(12px)_saturate(180%)] border border-white/[0.18] hover:border-[#c9b3ff]/55 text-[#f4f1fb] shadow-[0_14px_34px_rgba(0,0,0,0.68),inset_0_1px_1px_rgba(255,255,255,0.28)] transition-all duration-300 active:scale-95 cursor-pointer"
          aria-label={t('footer.backToTop')}
          title={t('footer.backToTop')}
        >
          <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-[#e6e2f2] group-hover:-translate-y-0.5 group-hover:text-white transition-transform duration-300" />
          <span className="absolute -bottom-8 scale-0 group-hover:scale-100 transition-all text-[10px] font-medium px-2.5 py-0.5 rounded-md bg-[#090612]/90 backdrop-blur-[12px] text-[#e6e2f2] border border-white/15 whitespace-nowrap shadow-xl pointer-events-none">
            {isAr ? 'للأعلى' : 'Scroll to top'}
          </span>
        </button>
      </div>

      {/* ============================================================
          3. MAIN CURVED FROSTED GLASS FRAME CHASSIS
         ============================================================ */}
      <div className="relative z-20 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="relative rounded-t-[36px] sm:rounded-t-[52px] lg:rounded-t-[64px] overflow-hidden border-t border-x border-white/[0.15] bg-[#090612]/85 backdrop-blur-[16px] backdrop-saturate-[180%] [-webkit-backdrop-filter:blur(16px)_saturate(180%)] shadow-[0_-24px_80px_rgba(0,0,0,0.88),inset_0_1px_1px_rgba(255,255,255,0.2)]">
          {/* Top Brushed Silver & Royal Amethyst Specular Rim */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#c9b3ff]/65 to-transparent pointer-events-none z-10" />

          {/* Pods Canvas Wrapper */}
          <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* --------------------------------------------------------
                  POD 1: MAIN PAGES (أقسام المنظومة) — FROSTED GLASS POD
                 -------------------------------------------------------- */}
              <div className="group relative rounded-[28px] sm:rounded-[32px] overflow-hidden bg-gradient-to-br from-white/[0.07] via-[#1a0f2e]/40 to-[#090612]/75 backdrop-blur-[12px] backdrop-saturate-[180%] [-webkit-backdrop-filter:blur(12px)_saturate(180%)] border border-white/[0.14] hover:border-[#c9b3ff]/45 shadow-[0_16px_42px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.2)] p-6 sm:p-8 lg:p-10 transition-all duration-300 flex flex-col justify-between gap-8">
                {/* Ambient corner refraction */}
                <div className="absolute -bottom-10 -end-10 w-36 h-36 rounded-full bg-[#9d65f5]/15 blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-start justify-between gap-6 sm:gap-8">
                  {/* Left / Title Column */}
                  <div className="shrink-0 space-y-2">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c9b3ff] block">
                      {isAr ? 'خريطة الموقع' : 'Navigation'}
                    </span>
                    <h3 className="font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight bg-gradient-to-b from-white via-[#f2effa] to-[#c9b3ff] bg-clip-text text-transparent leading-[1.1] uppercase">
                      {isAr ? (
                        <>
                          الصفحات<br />الرئيسية
                        </>
                      ) : (
                        <>
                          MAIN<br />PAGES
                        </>
                      )}
                    </h3>
                  </div>

                  {/* Right / Nav Links Columns */}
                  <div className="w-full md:w-auto flex-1 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs sm:text-sm">
                    {/* Column 1 */}
                    <div className="space-y-3">
                      <span className="text-[11px] text-[#a39bb5] font-semibold uppercase tracking-wider block">
                        {isAr ? 'المنظومة' : 'Ecosystem'}
                      </span>
                      <ul className="space-y-2.5">
                        <li>
                          <button
                            type="button"
                            data-prefetch-route="home"
                            onClick={(e) => handleLinkClick(e, 'home')}
                            className="text-[#e6e2f2] hover:text-white transition-colors cursor-pointer font-medium"
                          >
                            {isAr ? 'الرئيسية' : 'Home'}
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            data-prefetch-route="who-we-are"
                            onMouseEnter={() => prefetchRoute('who-we-are')}
                            onFocus={() => prefetchRoute('who-we-are')}
                            onTouchStart={() => prefetchRoute('who-we-are')}
                            onClick={(e) => handleLinkClick(e, 'who-we-are')}
                            className="text-[#e6e2f2] hover:text-white transition-colors cursor-pointer font-medium"
                          >
                            {isAr ? 'من نحن' : 'About'}
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            data-prefetch-route="the-8-arms"
                            onMouseEnter={() => prefetchRoute('the-8-arms')}
                            onFocus={() => prefetchRoute('the-8-arms')}
                            onTouchStart={() => prefetchRoute('the-8-arms')}
                            onClick={(e) => handleLinkClick(e, 'the-8-arms')}
                            className="text-[#e6e2f2] hover:text-white transition-colors cursor-pointer font-medium"
                          >
                            {isAr ? 'الأذرع الثمانية' : 'The 8 Arms'}
                          </button>
                        </li>
                      </ul>
                    </div>

                    {/* Column 2 */}
                    <div className="space-y-3">
                      <span className="text-[11px] text-[#a39bb5] font-semibold uppercase tracking-wider block">
                        {isAr ? 'الأعمال والخدمات' : 'Work & Services'}
                      </span>
                      <ul className="space-y-2.5">
                        <li>
                          <button
                            type="button"
                            data-prefetch-route="services"
                            onMouseEnter={() => prefetchRoute('services')}
                            onFocus={() => prefetchRoute('services')}
                            onTouchStart={() => prefetchRoute('services')}
                            onClick={(e) => handleLinkClick(e, 'services')}
                            className="text-[#e6e2f2] hover:text-white transition-colors cursor-pointer font-medium"
                          >
                            {isAr ? 'الخدمات المتكاملة' : 'Disciplines'}
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            data-prefetch-route="portfolio"
                            onMouseEnter={() => prefetchRoute('portfolio')}
                            onFocus={() => prefetchRoute('portfolio')}
                            onTouchStart={() => prefetchRoute('portfolio')}
                            onClick={(e) => handleLinkClick(e, 'portfolio')}
                            className="text-[#e6e2f2] hover:text-white transition-colors cursor-pointer font-medium"
                          >
                            {isAr ? 'معرض الأعمال' : 'Portfolio'}
                          </button>
                        </li>
                        <li>
                          <a
                            href="/Pulse-OCTO-Company-Profile.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#c9b3ff] hover:text-white transition-colors cursor-pointer font-semibold inline-flex items-center gap-1"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>{isAr ? 'ملف الشركة (PDF)' : 'Company Profile'}</span>
                          </a>
                        </li>
                      </ul>
                    </div>

                    {/* Column 3 */}
                    <div className="space-y-3 col-span-2 sm:col-span-1">
                      <span className="text-[11px] text-[#a39bb5] font-semibold uppercase tracking-wider block">
                        {isAr ? 'الرؤى والاستشارة' : 'Advisory'}
                      </span>
                      <ul className="space-y-2.5">
                        <li>
                          <button
                            type="button"
                            data-prefetch-route="blog"
                            onMouseEnter={() => prefetchRoute('blog')}
                            onFocus={() => prefetchRoute('blog')}
                            onTouchStart={() => prefetchRoute('blog')}
                            onClick={(e) => handleLinkClick(e, 'blog')}
                            className="text-[#e6e2f2] hover:text-white transition-colors cursor-pointer font-medium"
                          >
                            {isAr ? 'الرؤى والمدونة' : 'Insights'}
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            data-prefetch-route="contact"
                            onMouseEnter={() => prefetchRoute('contact')}
                            onFocus={() => prefetchRoute('contact')}
                            onTouchStart={() => prefetchRoute('contact')}
                            onClick={(e) => handleLinkClick(e, 'contact')}
                            className="text-[#e6e2f2] hover:text-white transition-colors cursor-pointer font-medium"
                          >
                            {isAr ? 'تواصل معنا' : 'Contact Us'}
                          </button>
                        </li>
                        <li className="pt-1">
                          <a
                            href="https://wa.me/201116066968"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-br from-[#9d65f5]/85 via-[#5e2ec0]/80 to-[#2b145c]/90 hover:from-[#b082ff]/90 hover:via-[#723ce0]/85 hover:to-[#371a75]/95 backdrop-blur-[12px] border border-[#d6c5ff]/45 text-white shadow-[0_8px_22px_rgba(94,46,192,0.4),inset_0_1px_1px_rgba(255,255,255,0.3)] transition-all text-xs font-semibold group cursor-pointer"
                          >
                            <span>{isAr ? 'ابدأ نبض مشروعك' : 'Start Your Project'}</span>
                            <ArrowRight className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Bottom Brand Philosophy Line */}
                <div className="pt-4 border-t border-white/[0.1] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#a39bb5] font-mono tracking-wider">
                  <span>ONE BRAND. ONE SYSTEM. ONE PULSE.</span>
                  <span className="text-[#c9b3ff] font-semibold">8 ARMS. ONE SYSTEM.</span>
                </div>
              </div>

              {/* --------------------------------------------------------
                  POD 2: CONTACT & LEGAL STANDARDS — FROSTED GLASS POD
                 -------------------------------------------------------- */}
              <div className="group relative rounded-[28px] sm:rounded-[32px] overflow-hidden bg-gradient-to-br from-white/[0.07] via-[#1a0f2e]/40 to-[#090612]/75 backdrop-blur-[12px] backdrop-saturate-[180%] [-webkit-backdrop-filter:blur(12px)_saturate(180%)] border border-white/[0.14] hover:border-[#c9b3ff]/45 shadow-[0_16px_42px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.2)] p-6 sm:p-8 lg:p-10 transition-all duration-300 flex flex-col justify-between gap-8">
                {/* Ambient corner refraction */}
                <div className="absolute -bottom-10 -end-10 w-36 h-36 rounded-full bg-[#c9b3ff]/12 blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-start justify-between gap-6 sm:gap-8">
                  {/* Left / Title Column */}
                  <div className="shrink-0 space-y-2">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#c9b3ff] block">
                      {isAr ? 'الاتصال المباشر' : 'Direct Channels'}
                    </span>
                    <h3 className="font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight bg-gradient-to-b from-white via-[#f2effa] to-[#c9b3ff] bg-clip-text text-transparent leading-[1.1] uppercase">
                      {isAr ? (
                        <>
                          قنوات<br />التواصل
                        </>
                      ) : (
                        <>
                          CONTACT &<br />LEGAL
                        </>
                      )}
                    </h3>
                  </div>

                  {/* Right / Links Columns */}
                  <div className="w-full md:w-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
                    {/* Column 1: Direct Real Communication */}
                    <div className="space-y-3">
                      <span className="text-[11px] text-[#a39bb5] font-semibold uppercase tracking-wider block">
                        {isAr ? 'قنوات الاتصال' : 'Direct Reach'}
                      </span>
                      <ul className="space-y-2.5">
                        <li>
                          <button
                            type="button"
                            data-prefetch-route="contact"
                            onMouseEnter={() => prefetchRoute('contact')}
                            onFocus={() => prefetchRoute('contact')}
                            onTouchStart={() => prefetchRoute('contact')}
                            onClick={(e) => handleLinkClick(e, 'contact')}
                            className="text-[#e6e2f2] hover:text-white transition-colors cursor-pointer font-medium"
                          >
                            {isAr ? 'صفحة التواصل والموقع' : 'Contact Headquarters'}
                          </button>
                        </li>
                        <li>
                          <a
                            href="https://wa.me/201116066968"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-[#e6e2f2] hover:text-white transition-colors font-mono"
                            dir="ltr"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-[#c9b3ff] shrink-0" />
                            <span>01116066968</span>
                          </a>
                        </li>
                        <li>
                          <a
                            href="tel:01112998882"
                            className="flex items-center gap-2 text-[#e6e2f2] hover:text-white transition-colors font-mono"
                            dir="ltr"
                          >
                            <Phone className="w-3.5 h-3.5 text-[#c9b3ff] shrink-0" />
                            <span>01112998882</span>
                          </a>
                        </li>
                        <li>
                          <a
                            href="mailto:contact@pulseocto.com"
                            className="flex items-center gap-2 text-[#e6e2f2] hover:text-white transition-colors font-mono truncate"
                            dir="ltr"
                          >
                            <Mail className="w-3.5 h-3.5 text-[#c9b3ff] shrink-0" />
                            <span>contact@pulseocto.com</span>
                          </a>
                        </li>
                        <li>
                          <a
                            href="mailto:CEO@pulseOCTO.com"
                            className="flex items-center gap-2 text-[#e6e2f2] hover:text-white transition-colors font-mono truncate"
                            dir="ltr"
                          >
                            <Mail className="w-3.5 h-3.5 text-[#c9b3ff] shrink-0" />
                            <span>CEO@pulseOCTO.com</span>
                          </a>
                        </li>
                      </ul>
                    </div>

                    {/* Column 2: System, FAQ & Legal */}
                    <div className="space-y-3">
                      <span className="text-[11px] text-[#a39bb5] font-semibold uppercase tracking-wider block">
                        {isAr ? 'المعايير القانونية' : 'Legal Standards'}
                      </span>
                      <ul className="space-y-2.5">
                        <li>
                          <button
                            type="button"
                            data-prefetch-route="contact"
                            onMouseEnter={() => prefetchRoute('contact')}
                            onFocus={() => prefetchRoute('contact')}
                            onTouchStart={() => prefetchRoute('contact')}
                            onClick={(e) => handleLinkClick(e, 'contact')}
                            className="text-[#e6e2f2] hover:text-white transition-colors cursor-pointer font-medium"
                          >
                            {isAr ? 'الأسئلة الشائعة' : 'FAQs'}
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            onClick={() => setActiveLegalModal('privacy')}
                            className="text-[#e6e2f2] hover:text-white transition-colors cursor-pointer font-medium flex items-center gap-1.5"
                          >
                            <Lock className="w-3.5 h-3.5 text-[#c9b3ff]" />
                            <span>{isAr ? 'سياسة الخصوصية والبيانات' : 'Privacy Policy'}</span>
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            onClick={() => setActiveLegalModal('terms')}
                            className="text-[#e6e2f2] hover:text-white transition-colors cursor-pointer font-medium flex items-center gap-1.5"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#c9b3ff]" />
                            <span>{isAr ? 'الشروط والأحكام' : 'Terms of Service'}</span>
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Bottom Location & Website Tag */}
                <div className="pt-4 border-t border-white/[0.1] flex flex-wrap items-center justify-between gap-2 text-xs text-[#a39bb5] font-mono">
                  <a
                    href="https://www.google.com/maps/place/Pulse+Octo/@30.4574003,31.1810751,17z/data=!3m1!4b1!4m6!3m5!1s0x145875003b5da767:0x5aa42ce07917feb1!8m2!3d30.4574003!4d31.1810751"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 hover:text-white transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#c9b3ff]" />
                    <span>BANHA, AL QALYUBIA, EGYPT</span>
                  </a>
                  <a
                    href="https://pulseocto.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#e6e2f2] hover:text-white transition-colors"
                    dir="ltr"
                  >
                    pulseocto.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================
              4. THE FOUNDATION BASE TRAY (FROSTED GLASS SOCIAL MEDALLIONS)
             ============================================================ */}
          <div className="relative rounded-t-[24px] sm:rounded-t-[32px] bg-[#050308]/90 backdrop-blur-[12px] border-t border-white/[0.12] px-6 sm:px-10 py-5 sm:py-6 flex flex-col md:flex-row items-center justify-between gap-5 text-xs">
            {/* Left: Brand Philosophy Signature */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-white/[0.1] via-[#2b184a]/45 to-[#090612]/80 backdrop-blur-[12px] border border-white/[0.16] shadow-[inset_0_1px_1px_rgba(255,255,255,0.22)] flex items-center justify-center">
                <OctoLogo variant="iconOnly" className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-white tracking-wide text-xs sm:text-sm font-['Orbitron',sans-serif]">
                  PULSE OCTO
                </span>
                <span className="text-[10px] text-[#c9b3ff] font-mono tracking-wider">
                  {isAr ? 'نبض نجاحك الرقمي' : 'YOUR DIGITAL PULSE.'}
                </span>
              </div>
            </div>

            {/* Center: Real Copyright Notice */}
            <div className="text-center text-[#a39bb5] text-xs sm:text-[13px] font-medium">
              <span>
                © {new Date().getFullYear()} <strong className="text-white">PULSE OCTO</strong>. {isAr ? 'جميع الحقوق محفوظة.' : 'All Rights Reserved.'}
              </span>
            </div>

            {/* Right: Real Verified Social Channels (Frosted Crystal Medallions, No Usernames underneath) & Theme Switcher */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                {
                  title: 'Facebook',
                  href: 'https://www.facebook.com/profile.php?id=61589519280210',
                  icon: <Facebook className="w-4 h-4" />,
                },
                {
                  title: 'Instagram',
                  href: 'https://www.instagram.com/pulse.octo/',
                  icon: <Instagram className="w-4 h-4" />,
                },
                {
                  title: 'YouTube',
                  href: 'https://www.youtube.com/@pulseocto',
                  icon: (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  ),
                },
                {
                  title: 'TikTok',
                  href: 'https://www.tiktok.com/@tarekakl',
                  icon: (
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                    </svg>
                  ),
                },
                {
                  title: 'Telegram',
                  href: 'https://t.me/pulseocto0o',
                  icon: (
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                    </svg>
                  ),
                },
                {
                  title: 'Behance',
                  href: 'https://www.behance.net/tarekwagih2',
                  icon: (
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
                    </svg>
                  ),
                },
                {
                  title: 'CEO@pulseOCTO.com',
                  href: 'mailto:CEO@pulseOCTO.com',
                  icon: <Mail className="w-4 h-4" />,
                },
              ].map((social) => (
                <a
                  key={social.title}
                  href={social.href}
                  target={social.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={social.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  className="group relative w-9 h-9 rounded-xl bg-gradient-to-br from-white/[0.11] via-[#2b184a]/40 to-[#090612]/75 hover:from-white/[0.18] hover:via-[#5e2ec0]/45 hover:to-[#120b22]/85 backdrop-blur-[12px] backdrop-saturate-[180%] [-webkit-backdrop-filter:blur(12px)_saturate(180%)] border border-white/[0.16] hover:border-[#c9b3ff]/55 shadow-[0_8px_20px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.25)] flex items-center justify-center text-[#e6e2f2] hover:text-white transition-all duration-300 hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                  title={social.title}
                  aria-label={social.title}
                >
                  {social.icon}
                </a>
              ))}

              <div className="w-px h-5 bg-white/15 mx-1" />

              {/* Theme Switcher Pill */}
              <ThemeToggle variant="pill" id="footer-theme-toggle" />
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          5. INTERACTIVE LEGAL & UTILITIES MODAL (PRIVACY & TERMS)
         ============================================================ */}
      <AnimatePresence>
        {activeLegalModal && (
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
            role="dialog"
            aria-modal="true"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isClosingModal ? 0 : 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
              onClick={handleCloseLegalModal}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl"
            />

            {/* Modal Body Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={
                isClosingModal
                  ? { opacity: 0, scale: 0.96, y: 16, transition: { duration: 0.22 } }
                  : { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }
              }
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              className="relative w-full max-w-2xl bg-[#090612]/90 backdrop-blur-[16px] backdrop-saturate-[180%] [-webkit-backdrop-filter:blur(16px)_saturate(180%)] border border-white/[0.16] rounded-3xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.22)] text-white z-10 my-auto"
            >
              {/* Header Bar */}
              <div className="flex items-center justify-between pb-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.08] backdrop-blur-md border border-[#c9b3ff]/35 flex items-center justify-center text-[#c9b3ff]">
                    {activeLegalModal === 'privacy' ? (
                      <Lock className="w-5 h-5" />
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">
                      {activeLegalModal === 'privacy'
                        ? isAr
                          ? 'سياسة الخصوصية وحماية البيانات'
                          : 'Privacy & Data Protection Policy'
                        : isAr
                        ? 'الشروط والأحكام ومستوى الخدمة'
                        : 'Terms of Service & Standards'}
                    </h4>
                    <span className="text-xs text-[#c9b3ff] font-mono">
                      PULSE OCTO — {isAr ? 'المعايير المعتمدة' : 'Official Standards'}
                    </span>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  onClick={handleCloseLegalModal}
                  className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-[#c9b3ff]/50 text-[#e6e2f2] hover:text-white transition-all cursor-pointer active:scale-95"
                  title={isAr ? 'إغلاق (Esc)' : 'Close (Esc)'}
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                  <span className="text-xs font-semibold">{isAr ? 'إغلاق' : 'Close'}</span>
                </button>
              </div>

              {/* Content Body */}
              <div className="py-6 space-y-4 text-xs sm:text-sm text-[#e6e2f2] leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
                {activeLegalModal === 'privacy' ? (
                  <>
                    <p>
                      {isAr
                        ? 'في وكالة Pulse OCTO، نعتبر سرية بيانات شركائنا واستراتيجياتهم التسويقية أمانة مطلقة. نلتزم بأعلى معايير حماية البيانات والشفافية الرقمية وفق المعايير العالمية.'
                        : 'At Pulse OCTO, partner confidentiality and proprietary campaign data are treated with unconditional integrity. We uphold the strictest standards of digital transparency and security.'}
                    </p>
                    <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/12 space-y-2">
                      <h5 className="font-bold text-white flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#c9b3ff]" />
                        <span>{isAr ? '١. ملكية البيانات والأصول' : '1. Asset & Data Ownership'}</span>
                      </h5>
                      <p className="text-xs text-[#a39bb5]">
                        {isAr
                          ? 'كافة التصاميم، الشيفرات البرمجية، والمواد الإعلانية المطورة لصالح شريكنا هي ملكية حصرية وخاصة له بمجرد تسليمها واعتمادها.'
                          : 'All created brandmarks, digital collateral, codebases, and media creatives belong exclusively to our client upon delivery and sign-off.'}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/12 space-y-2">
                      <h5 className="font-bold text-white flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#c9b3ff]" />
                        <span>{isAr ? '٢. اتفاقيات عدم الإفصاح (NDA)' : '2. Non-Disclosure Agreements'}</span>
                      </h5>
                      <p className="text-xs text-[#a39bb5]">
                        {isAr
                          ? 'نوفر اتفاقيات سرية معتمدة قبل البدء بأي حملة أو مشروع لحماية الخطط التشغيلية والأرقام المالية لشريك النجاح.'
                          : 'Formal non-disclosure agreements are available prior to engagement commencement to secure strategic intelligence and financial metrics.'}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <p>
                      {isAr
                        ? 'تُبنى علاقتنا مع الشركاء على وضوح الالتزامات وسرعة التنفيذ والتنسيق التام بين الأذرع الثمانية دون أي تعارض أو إبطاء.'
                        : 'Our partner engagements are governed by explicit milestones, disciplined execution, and synchronized coordination across all eight arms.'}
                    </p>
                    <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/12 space-y-2">
                      <h5 className="font-bold text-white flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#c9b3ff]" />
                        <span>{isAr ? '١. التزام الجودة والجاهزية' : '1. Service Level Commitment'}</span>
                      </h5>
                      <p className="text-xs text-[#a39bb5]">
                        {isAr
                          ? 'استجابة مباشرة ومتابعة حية عبر مدير حساب مخصص، مع تقارير دورية تقيس مؤشرات الأداء الحقيقية.'
                          : 'Direct communication via dedicated client leadership, backed by regular verifiable analytics tracking real campaign performance.'}
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/12 space-y-2">
                      <h5 className="font-bold text-white flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#c9b3ff]" />
                        <span>{isAr ? '٢. منهجية التكامل الرقمي' : '2. Integrated Ecosystem Methodology'}</span>
                      </h5>
                      <p className="text-xs text-[#a39bb5]">
                        {isAr
                          ? 'نعمل كنظام رقمي واحد متصل بدلاً من خدمات منفصلة لضمان أقصى كفاءة مالية وتسويقية لمشروعك.'
                          : 'Pulse OCTO functions as a singular unified growth system rather than fragmented services, guaranteeing peak fiscal and creative impact.'}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Footer Modal Action */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="mailto:contact@pulseocto.com"
                    className="text-xs font-mono text-[#e6e2f2] hover:text-white transition-colors flex items-center gap-1.5"
                    dir="ltr"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#c9b3ff]" />
                    <span>contact@pulseocto.com</span>
                  </a>
                  <span className="text-white/20">•</span>
                  <a
                    href="mailto:CEO@pulseOCTO.com"
                    className="text-xs font-mono text-[#e6e2f2] hover:text-white transition-colors flex items-center gap-1.5"
                    dir="ltr"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#c9b3ff]" />
                    <span>CEO@pulseOCTO.com</span>
                  </a>
                </div>
                <button
                  type="button"
                  onClick={handleCloseLegalModal}
                  className="px-5 py-2 rounded-xl bg-gradient-to-br from-[#9d65f5] via-[#5e2ec0] to-[#2b145c] text-white text-xs font-bold border border-[#d6c5ff]/45 shadow-[0_8px_20px_rgba(94,46,192,0.4)] transition-all cursor-pointer active:scale-95"
                >
                  {isAr ? 'فهمت وأوافق' : 'Acknowledge & Close'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
};
