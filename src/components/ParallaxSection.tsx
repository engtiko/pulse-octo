import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, type MotionValue } from 'motion/react';

export interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  /**
   * Vertical parallax intensity in pixels.
   * Default: 26px
   */
  range?: number;
  /**
   * Movement speed relative to scroll.
   * 'slower' (default): Content moves slightly slower than scroll speed (lags behind, creating 3D depth).
   * 'faster': Content glides upward faster than scroll speed.
   */
  speed?: 'slower' | 'faster';
  /**
   * Smooth physics spring damping.
   * Default: 26
   */
  damping?: number;
  stiffness?: number;
  as?: React.ElementType;
}

/**
 * ParallaxSection:
 * Creates a subtle, luxurious vertical parallax scroll relationship between
 * foreground content overlays (headings, cards, texts) and the fixed master video background.
 * Elements move slightly slower than the original scrolling speed to enhance depth.
 */
export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  className = '',
  id,
  range = 26,
  speed = 'slower',
  damping = 26,
  stiffness = 140,
  as: Component = 'div',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(media.matches);

      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Soft spring to remove any scroll wheel micro-jitters
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: stiffness,
    damping: damping,
    restDelta: 0.001,
  });

  // 'slower': start at -range and transition to +range as user scrolls down,
  // resisting the scroll displacement so content moves slightly slower than scroll speed.
  const rawY = useTransform(
    smoothProgress,
    [0, 1],
    speed === 'slower' ? [-range, range] : [range, -range]
  );
  const y = prefersReducedMotion ? 0 : rawY;

  return (
    <div ref={containerRef} id={id} className={`relative ${className}`}>
      <motion.div
        style={{
          y,
          willChange: 'transform',
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </div>
  );
};

export interface ParallaxLayerProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Relative depth multiplier (e.g. 0.6 for subtle headings, 1.2 for floating cards)
   */
  depth?: number;
  /**
   * Maximum pixel shift across the viewport scroll.
   * Default: 24px
   */
  maxShift?: number;
  /**
   * 'slower' (default): moves slightly slower than scroll speed (depth feel).
   */
  speed?: 'slower' | 'faster';
}

/**
 * ParallaxLayer:
 * Place inside a section or container to provide an independent floating layer depth
 * for specific typographic headlines, badges, or interactive cards.
 */
export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  children,
  className = '',
  depth = 1.0,
  maxShift = 24,
  speed = 'slower',
}) => {
  const layerRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(media.matches);
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: layerRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 28,
    restDelta: 0.001,
  });

  const shift = maxShift * depth;
  const rawY = useTransform(
    smoothProgress,
    [0, 1],
    speed === 'slower' ? [-shift, shift] : [shift, -shift]
  );
  const y = prefersReducedMotion ? 0 : rawY;

  return (
    <motion.div
      ref={layerRef}
      style={{
        y,
        willChange: 'transform',
      }}
      className={`will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
};

export interface ParallaxTextProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Subtle lag range in pixels (default 16px).
   */
  range?: number;
}

/**
 * ParallaxText:
 * Lightweight wrapper specifically tuned for typographic headlines and titles,
 * ensuring words float gently slower than the scroll without any text distortion.
 */
export const ParallaxText: React.FC<ParallaxTextProps> = ({
  children,
  className = '',
  range = 16,
}) => {
  return (
    <ParallaxLayer depth={0.7} maxShift={range} speed="slower" className={className}>
      {children}
    </ParallaxLayer>
  );
};

export interface ParallaxCardProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Lag range in pixels (default 24px).
   */
  range?: number;
}

/**
 * ParallaxCard:
 * Tuned for cards, containers, buttons, and visual cards floating above the master video background.
 */
export const ParallaxCard: React.FC<ParallaxCardProps> = ({
  children,
  className = '',
  range = 24,
}) => {
  return (
    <ParallaxLayer depth={1.1} maxShift={range} speed="slower" className={className}>
      {children}
    </ParallaxLayer>
  );
};
