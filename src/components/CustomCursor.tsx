import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

export const CustomCursor: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // High-performance springs that run on the compositor thread without re-rendering React
  const springX = useSpring(mouseX, { damping: 28, stiffness: 380 });
  const springY = useSpring(mouseY, { damping: 28, stiffness: 380 });

  // Direct transform offsets for the center dot
  const dotX = useTransform(mouseX, (x) => x - 5);
  const dotY = useTransform(mouseY, (y) => y - 5);

  // Offsets for the follower ring
  const ringX = useTransform(springX, (x) => isHovered ? x - 30 : x - 16);
  const ringY = useTransform(springY, (y) => isHovered ? y - 30 : y - 16);

  useEffect(() => {
    // Only enable custom cursor for precise pointer devices (desktop)
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const onMouseEnter = () => setIsVisible(true);
    const onMouseLeave = () => setIsVisible(false);

    // Interactive target detection
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[data-cursor="pointer"]') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('img') ||
        target.closest('[role="button"]')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseenter', onMouseEnter);
    window.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible, mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Center Core Dot - updates directly via motion values */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full bg-purple-400 z-50 shadow-[0_0_8px_#c084fc] pointer-events-none will-change-transform"
        style={{
          x: dotX,
          y: dotY,
        }}
        animate={{
          scale: isHovered ? 0 : 1,
          opacity: isHovered ? 0 : 1,
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Outer Reactive Hollow Circle Ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-purple-400/80 z-40 bg-purple-600/10 backdrop-blur-[1px] pointer-events-none will-change-transform"
        style={{
          x: ringX,
          y: ringY,
        }}
        animate={{
          width: isHovered ? 60 : 32,
          height: isHovered ? 60 : 32,
          borderColor: isHovered ? 'rgba(168, 85, 247, 0.95)' : 'rgba(216, 180, 254, 0.4)',
          boxShadow: isHovered
            ? '0 0 20px rgba(138, 43, 226, 0.6), inset 0 0 12px rgba(168, 85, 247, 0.3)'
            : '0 0 6px rgba(138, 43, 226, 0.2)',
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ duration: 0.2 }}
      />
    </div>
  );
};
