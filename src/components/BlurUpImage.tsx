import React, { useState, useEffect, useMemo } from 'react';
import { getOptimizedImageProps } from '../utils/imageOptimizer';

export interface BlurUpImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  placeholderClassName?: string;
  lowResSrc?: string;
  priority?: boolean;
  aspectRatio?: string;
  onImageLoaded?: () => void;
}

/**
 * BlurUpImage:
 * High-performance responsive image component featuring native `loading='lazy'`,
 * asynchronous decoding, Cloudinary/Imgix/WebP responsive `srcSet`, and a
 * glass-shimmer blur-up effect.
 */
export const BlurUpImage: React.FC<BlurUpImageProps> = ({
  src,
  alt,
  className = '',
  imgClassName = '',
  placeholderClassName = '',
  lowResSrc,
  priority = false,
  aspectRatio,
  onImageLoaded,
  style,
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [useFallbackOriginal, setUseFallbackOriginal] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const optimized = useMemo(() => {
    const isLogo = /logo/i.test(src) || src.includes('ZS2');
    return getOptimizedImageProps(src, { isLogo });
  }, [src]);

  // Reset loading state when src changes
  useEffect(() => {
    setIsLoaded(false);
    setUseFallbackOriginal(false);
    setHasError(false);

    if (typeof window !== 'undefined' && optimized.src) {
      const img = new Image();
      img.src = optimized.src;
      if (img.complete && img.naturalWidth > 0) {
        setIsLoaded(true);
      }
    }
  }, [optimized.src]);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onImageLoaded) {
      onImageLoaded();
    }
  };

  const handleError = () => {
    if (!useFallbackOriginal && optimized.fallbackSrc && optimized.src !== optimized.fallbackSrc) {
      setUseFallbackOriginal(true);
      return;
    }
    setHasError(true);
    setIsLoaded(true);
  };

  const resolvedSrc = hasError
    ? '/posters/hero-poster.webp'
    : useFallbackOriginal
      ? optimized.fallbackSrc
      : optimized.src;

  return (
    <div
      className={`relative overflow-hidden bg-[#0a0618] ${aspectRatio ? aspectRatio : ''} ${className}`}
      style={style}
    >
      {/* 1. Low-Resolution Placeholder / Shimmer Ambient Layer (Active while loading) */}
      <div
        className={`absolute inset-0 z-0 transition-opacity duration-700 pointer-events-none ${
          isLoaded ? 'opacity-0' : 'opacity-100'
        } ${placeholderClassName}`}
        aria-hidden="true"
      >
        {lowResSrc ? (
          <img
            src={lowResSrc}
            alt=""
            width={80}
            height={50}
            aria-hidden="true"
            className="w-full h-full object-cover filter blur-xl scale-110 transform-gpu opacity-60"
            loading="eager"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-[#0d0722] via-[#1a0f3d] to-[#0b061c] animate-pulse relative overflow-hidden">
            {/* Liquid glass light sheen */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>
        )}
      </div>

      {/* 2. Main Full-Resolution Responsive WebP Image with Smooth Blur-Up Unveiling */}
      <img
        src={resolvedSrc}
        srcSet={!useFallbackOriginal && !hasError ? optimized.srcSet : undefined}
        sizes={!useFallbackOriginal && !hasError ? optimized.sizes : undefined}
        alt={alt}
        width={rest.width ?? 800}
        height={rest.height ?? 500}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`relative z-10 w-full h-full object-cover transform-gpu transition-all duration-700 ease-out ${
          isLoaded
            ? 'opacity-100 blur-0 scale-100'
            : 'opacity-0 blur-md scale-105'
        } ${imgClassName}`}
        {...rest}
      />
    </div>
  );
};

export default BlurUpImage;
