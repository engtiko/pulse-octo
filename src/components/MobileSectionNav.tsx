import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import {
  Layers,
  Sparkles,
  Briefcase,
  TrendingUp,
  Sliders,
  CheckCircle2,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface SectionItem {
  id: string;
  labelAr: string;
  labelEn: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SECTIONS: SectionItem[] = [
  { id: 'arms-3d-orbit', labelAr: 'الأذرع', labelEn: 'The Arms', icon: Sparkles },
  { id: 'trust-partners-section', labelAr: 'الشركاء', labelEn: 'Partners', icon: ShieldCheck },
  { id: 'portfolio-section', labelAr: 'الأعمال', labelEn: 'Portfolio', icon: Briefcase },
  { id: 'insights-section', labelAr: 'المدونة', labelEn: 'Insights', icon: BookOpen },
  { id: 'wizard-section', labelAr: 'نطاق المشروع', labelEn: 'Scope Wizard', icon: Sliders },
];

export const MobileSectionNav: React.FC = () => {
  const { isAr, dir } = useLanguage();
  const [activeSection, setActiveSection] = useState<string>('arms-3d-orbit');
  const [isVisible, setIsVisible] = useState(false);

  // Show only after scrolling past hero
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 280);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver to sync active pill with visible section
  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '-30% 0px -60% 0px',
      threshold: 0,
    });

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch {
        // Fallback
      }
    }
  };

  const scrollToSection = (sectionId: string) => {
    triggerHaptic();
    setActiveSection(sectionId);
    const target = document.getElementById(sectionId);
    if (target) {
      const navOffset = 90;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="lg:hidden sticky top-16 sm:top-20 z-30 inset-x-0 px-2.5 py-2 pointer-events-none transition-all duration-300">
      <nav
        className="pointer-events-auto max-w-lg mx-auto flex items-center gap-1.5 overflow-x-auto overscroll-x-contain no-scrollbar py-1.5 px-2.5 rounded-2xl backdrop-blur-2xl bg-gradient-to-b from-[#130a2e]/80 via-[#0a061b]/85 to-[#05030e]/90 border border-purple-500/35 shadow-[0_12px_36px_rgba(0,0,0,0.7),0_0_20px_rgba(138,43,226,0.2),inset_0_1px_1px_rgba(255,255,255,0.22)] touch-manipulation transition-all"
        aria-label={isAr ? 'أزرار التنقل السريع بين أقسام الصفحة' : 'Section quick navigation'}
      >
        {SECTIONS.map((sec) => {
          const isActive = activeSection === sec.id;
          const Icon = sec.icon;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => scrollToSection(sec.id)}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer min-h-[36px] ${
                isActive
                  ? 'backdrop-blur-xl bg-gradient-to-r from-purple-600/70 via-indigo-600/60 to-purple-600/70 text-white border border-purple-400/70 shadow-[0_2px_15px_rgba(138,43,226,0.4),inset_0_1px_1.5px_rgba(255,255,255,0.4)] scale-[1.02]'
                  : 'backdrop-blur-md bg-white/[0.04] hover:bg-white/[0.09] active:bg-purple-950/40 text-slate-300 hover:text-white border border-white/[0.1] hover:border-purple-400/40'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-purple-100' : 'text-purple-300/80'}`} />
              <span>{isAr ? sec.labelAr : sec.labelEn}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
