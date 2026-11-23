import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ScrollToTop: React.FC = () => {
  const { isAr } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    lastScrollYRef.current = typeof window !== 'undefined' ? window.scrollY : 0;

    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      window.requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const deltaY = currentY - lastScrollYRef.current;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? Math.min(1, Math.max(0, currentY / docHeight)) : 0;

        setScrollProgress(progress);

        // Show on mobile when scrolling down past 300px; hide near top or when scrolling sharply up
        if (currentY <= 280) {
          setIsVisible(false);
        } else if (deltaY > 4) {
          setIsVisible(true);
        } else if (deltaY < -18) {
          setIsVisible(false);
        }

        lastScrollYRef.current = currentY;
        tickingRef.current = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(10);
      } catch {
        // Ignore vibration errors
      }
    }
    setIsVisible(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - scrollProgress * circumference;

  return (
    <div className="md:hidden fixed bottom-[124px] left-3 sm:left-4 z-30 pointer-events-none select-none">
      <AnimatePresence>
        {isVisible && (
          <motion.button
            key="mobile-scroll-to-top"
            type="button"
            initial={{ opacity: 0, scale: 0.7, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 14 }}
            transition={{ type: 'spring', stiffness: 360, damping: 26 }}
            onClick={scrollToTop}
            id="mobile-scroll-to-top-btn"
            className="pointer-events-auto relative w-11 h-11 rounded-full bg-[#090518]/92 border border-purple-500/45 text-cyan-300 shadow-[0_8px_22px_rgba(0,0,0,0.85),0_0_16px_rgba(138,43,226,0.35),inset_0_1px_1.5px_rgba(255,255,255,0.25)] backdrop-blur-xl flex items-center justify-center active:scale-90 transition-transform cursor-pointer touch-manipulation"
            aria-label={isAr ? 'العودة إلى الأعلى' : 'Scroll to top'}
            title={isAr ? 'العودة إلى الأعلى' : 'Scroll to top'}
          >
            {/* Subtle Circular Scroll Progress Ring */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
              viewBox="0 0 44 44"
            >
              <circle
                cx="22"
                cy="22"
                r={radius}
                fill="none"
                stroke="rgba(168, 85, 247, 0.18)"
                strokeWidth="2"
              />
              <circle
                cx="22"
                cy="22"
                r={radius}
                fill="none"
                stroke="#22d3ee"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-[stroke-dashoffset] duration-150 ease-out"
              />
            </svg>

            <ArrowUp className="w-4 h-4 text-cyan-300 relative z-10 pointer-events-none" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScrollToTop;
