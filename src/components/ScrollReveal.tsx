import React from 'react';
import { motion, Variants } from 'motion/react';

export type RevealVariant =
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'scale-up'
  | 'blur-in'
  | 'zoom-in';

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  threshold?: number;
  once?: boolean;
  className?: string;
  distance?: number;
  id?: string;
}

const getVariantConfig = (variant: RevealVariant | string, distance: number): Variants => {
  switch (variant) {
    case 'fade-up':
      return {
        hidden: { opacity: 0, y: distance },
        visible: { opacity: 1, y: 0 },
      };
    case 'fade-down':
      return {
        hidden: { opacity: 0, y: -distance },
        visible: { opacity: 1, y: 0 },
      };
    case 'fade-left':
      return {
        hidden: { opacity: 0, x: -distance },
        visible: { opacity: 1, x: 0 },
      };
    case 'fade-right':
      return {
        hidden: { opacity: 0, x: distance },
        visible: { opacity: 1, x: 0 },
      };
    case 'scale-up':
      return {
        hidden: { opacity: 0, scale: 0.9, y: 15 },
        visible: { opacity: 1, scale: 1, y: 0 },
      };
    case 'zoom-in':
      return {
        hidden: { opacity: 0, scale: 0.85 },
        visible: { opacity: 1, scale: 1 },
      };
    case 'blur-in':
      return {
        hidden: { opacity: 0, filter: 'blur(12px)', y: distance / 1.5 },
        visible: { opacity: 1, filter: 'blur(0px)', y: 0 },
      };
    default:
      return {
        hidden: { opacity: 0, y: distance },
        visible: { opacity: 1, y: 0 },
      };
  }
};

/**
 * Universal Scroll Reveal Wrapper for text, cards, and sections
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 0.65,
  threshold = 0.15,
  once = true,
  className = '',
  distance = 22,
  id,
}) => {
  const variants = getVariantConfig(variant, distance);

  return (
    <motion.div
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface ScrollHeaderRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  threshold?: number;
}

/**
 * Editorial Section Header & Text Container Reveal
 * Features a gentle upward fade-in (framer-motion) with high-end storytelling easing.
 */
export const ScrollHeaderReveal: React.FC<ScrollHeaderRevealProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 0.65,
  threshold = 0.15,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: threshold }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface ScrollStaggerProps {
  children: React.ReactNode;
  stagger?: number;
  delay?: number;
  className?: string;
  threshold?: number;
  once?: boolean;
}

/**
 * Parent container that automatically staggers child elements when entering the viewport
 */
export const ScrollStagger: React.FC<ScrollStaggerProps> = ({
  children,
  stagger = 0.1,
  delay = 0,
  className = '',
  threshold = 0.15,
  once = true,
}) => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: threshold }}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 25, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  },
};

interface ScrollImageRevealProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  aspectRatio?: string;
  priority?: boolean;
  threshold?: number;
}

/**
 * Image container that reveals with a smooth zoom-out and subtle glow mask upon scrolling
 */
export const ScrollImageReveal: React.FC<ScrollImageRevealProps> = ({
  src,
  alt,
  className = '',
  imgClassName = '',
  aspectRatio = 'aspect-[16/10]',
  priority = false,
  threshold = 0.15,
}) => {
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.05 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: threshold }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden bg-[#090417] ${aspectRatio} ${className}`}
    >
      {/* Low-Res Ambient Placeholder */}
      <div
        className={`absolute inset-0 bg-gradient-to-tr from-[#0e0826] via-[#1c0f42] to-[#0a051d] transition-opacity duration-700 pointer-events-none ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        }`}
      />

      <img
        src={src}
        alt={alt}
        width={800}
        height={500}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        className={`relative z-10 w-full h-full object-cover transform-gpu transition-all duration-700 ease-out hover:scale-105 ${
          isLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-md scale-105'
        } ${imgClassName}`}
      />
      {/* Subtle shine gleam on viewport enter */}
      <motion.div
        initial={{ x: '-100%', opacity: 0.4 }}
        whileInView={{ x: '200%', opacity: 0 }}
        viewport={{ once: true, amount: threshold }}
        transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.2 }}
        className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 pointer-events-none z-20"
      />
    </motion.div>
  );
};

interface ScrollTextRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

/**
 * Text reveal that slides cleanly into view with opacity and slight vertical lift
 */
export const ScrollTextReveal: React.FC<ScrollTextRevealProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
