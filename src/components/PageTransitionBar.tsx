import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useSpring } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { preloadPageImages, PreloadProgress } from '../utils/imagePreloader';

interface PageTransitionBarProps {
  isNavigating: boolean;
  pageKey: string;
}

/**
 * Enhanced PageTransitionBar Component
 * Delivers a sophisticated loading progress animation using Framer Motion,
 * seamlessly synchronized with real-time image preloading for each page route.
 */
export const PageTransitionBar: React.FC<PageTransitionBarProps> = ({
  isNavigating,
  pageKey,
}) => {
  const { dir } = useLanguage();
  const isRtl = dir === 'rtl';

  const [visible, setVisible] = useState<boolean>(true);
  const [displayProgress, setDisplayProgress] = useState<number>(0);
  const [isCompleting, setIsCompleting] = useState<boolean>(false);
  const activePreloadRef = useRef<{ cancel: () => void } | null>(null);

  // Smooth spring-driven width for organic physical momentum
  const springProgress = useSpring(0, {
    stiffness: 140,
    damping: 22,
    mass: 0.8,
  });

  // Keep spring updated with target display progress
  useEffect(() => {
    springProgress.set(displayProgress);
  }, [displayProgress, springProgress]);

  // Handle navigation & page image preloading synchronization
  useEffect(() => {
    if (activePreloadRef.current) {
      activePreloadRef.current.cancel();
    }

    setVisible(true);
    setIsCompleting(false);
    setDisplayProgress(35);

    // Fast completion in background
    const timer1 = setTimeout(() => {
      setDisplayProgress(100);
      setIsCompleting(true);
    }, 120);

    const timer2 = setTimeout(() => {
      setVisible(false);
      setIsCompleting(false);
      setDisplayProgress(0);
    }, 280);

    // Preload in background without blocking navigation
    const preload = preloadPageImages(pageKey, undefined, 600);
    activePreloadRef.current = preload;

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      preload.cancel();
    };
  }, [pageKey, isNavigating]);

  if (!visible && displayProgress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[120] h-[3px] pointer-events-none select-none overflow-visible"
    >
      {/* Background track aura */}
      <div className="relative w-full h-full bg-white/[0.04] backdrop-blur-[2px]">
        <motion.div
          style={{
            width: `${displayProgress}%`,
          }}
          transition={{
            duration: isCompleting ? 0.22 : 0.35,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={`absolute top-0 h-full ${
            isRtl ? 'right-0 bg-gradient-to-l' : 'left-0 bg-gradient-to-r'
          } from-[#8A2BE2] via-[#06b6d4] to-[#f43f5e] shadow-[0_0_15px_rgba(6,182,212,0.9),0_0_30px_rgba(138,43,226,0.7)]`}
        >
          {/* Animated holographic cyber-scanline overlay */}
          <div className="absolute inset-0 w-full h-full opacity-60 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-pulse" />

          {/* Glowing leading head gradient */}
          <div
            className={`absolute top-0 ${
              isRtl ? 'left-0' : 'right-0'
            } h-full w-28 bg-gradient-to-r from-transparent via-white/60 to-white opacity-95`}
          />

          {/* Intense neon energy spark particle at tip */}
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.85, 1, 0.85],
            }}
            transition={{
              repeat: Infinity,
              duration: 0.8,
              ease: 'easeInOut',
            }}
            className={`absolute -top-[3.5px] ${
              isRtl ? '-left-1.5' : '-right-1.5'
            } w-3.5 h-3.5 rounded-full bg-cyan-200 blur-[1px] shadow-[0_0_14px_#22d3ee,0_0_24px_#8A2BE2,0_0_35px_#f43f5e]`}
          />

          {/* Micro trailing energy spark */}
          <div
            className={`absolute top-[0.5px] ${
              isRtl ? '-left-0.5' : '-right-0.5'
            } w-2 h-2 rounded-full bg-white`}
          />
        </motion.div>
      </div>
    </div>
  );
};
