import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'motion/react';
import { ImageOff } from 'lucide-react';
import { getOptimizedImageProps } from '../utils/imageOptimizer';

export interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: string; // e.g. '16/9', '4/3', '1/1'
  placeholderBg?: string;
  rootMargin?: string;
  onLoaded?: () => void;
}

/**
 * LazyImage Component
 * Uses IntersectionObserver to defer fetching the image until it is within 200px of viewport,
 * and serves responsive WebP variants automatically based on device screen size.
 */
export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  aspectRatio,
  placeholderBg = 'bg-[#080816]',
  rootMargin = '200px 0px',
  onLoaded,
  ...props
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [useFallbackOriginal, setUseFallbackOriginal] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const optimized = useMemo(() => {
    const isLogo = /logo/i.test(src) || src.includes('ZS2');
    return getOptimizedImageProps(src, { isLogo });
  }, [src]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              observer.unobserve(el);
            }
          });
        },
        { rootMargin, threshold: 0.01 }
      );

      observer.observe(el);
      return () => {
        observer.unobserve(el);
      };
    } else {
      setIsInView(true);
    }
  }, [rootMargin]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    if (onLoaded) {
      onLoaded();
    }
  };

  const handleImageError = () => {
    if (!useFallbackOriginal && optimized.fallbackSrc && optimized.src !== optimized.fallbackSrc) {
      setUseFallbackOriginal(true);
      return;
    }
    setHasError(true);
    setIsLoaded(true);
  };

  const resolvedSrc = useFallbackOriginal ? optimized.fallbackSrc : optimized.src;

  return (
    <div
      ref={containerRef}
      style={{ aspectRatio }}
      className={`relative overflow-hidden ${placeholderBg} ${containerClassName}`}
    >
      {/* Skeleton Shimmer Placeholder while not yet loaded */}
      {!isLoaded && (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="w-full h-full bg-gradient-to-r from-purple-950/20 via-purple-800/15 to-purple-950/20 animate-pulse" />
        </div>
      )}

      {/* Actual Responsive WebP Image rendered only when in view */}
      {isInView && !hasError && (
        <motion.img
          src={resolvedSrc}
          srcSet={!useFallbackOriginal ? optimized.srcSet : undefined}
          sizes={!useFallbackOriginal ? optimized.sizes : undefined}
          alt={alt}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={handleImageLoad}
          onError={handleImageError}
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{
            opacity: isLoaded ? 1 : 0,
            scale: isLoaded ? 1 : 1.02,
          }}
          transition={{
            opacity: { duration: 0.45, ease: 'easeOut' },
            scale: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
          }}
          className={`w-full h-full object-cover will-change-transform ${className}`}
          {...props}
        />
      )}

      {/* Fallback state in case of image load error */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-[#080814] text-purple-400/60 border border-purple-900/30 text-center">
          <ImageOff className="w-8 h-8 mb-2 opacity-50 text-[#8A2BE2]" />
          <span className="text-[11px] font-mono text-slate-400">{alt || 'Asset'}</span>
        </div>
      )}
    </div>
  );
};
