import React from 'react';

/**
 * Shimmering reflection beam component that gracefully sweeps across skeleton cards.
 */
const SkeletonShimmer: React.FC = () => (
  <div
    aria-hidden="true"
    className="absolute inset-0 -translate-x-full animate-shimmer-sweep bg-gradient-to-r from-transparent via-purple-400/[0.08] to-transparent pointer-events-none z-10"
  />
);

/**
 * Luxury Skeleton loading state for individual 'Eight Arms' service cards.
 * Closely mirrors the structure of the active 8 Arms card and the 8 Arms directory grid.
 */
export const EightArmsCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      aria-hidden="true"
      className={`relative rounded-2xl bg-gradient-to-b from-[#110a28]/90 via-[#0a071a]/95 to-[#04020b]/98 border border-white/[0.08] p-4 sm:p-5 flex flex-col justify-between overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.8)] ${className}`}
    >
      <SkeletonShimmer />

      {/* 1. Visual Thumbnail Skeleton */}
      <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-purple-950/30 border border-white/[0.06] mb-4 flex items-center justify-center">
        <div className="w-8 h-8 rounded-lg bg-purple-800/20 animate-pulse" />
        {/* Top Tag Placeholder */}
        <div className="absolute top-2.5 start-2.5 h-4 w-14 rounded bg-black/60 border border-white/[0.06]" />
      </div>

      {/* 2. English Subtitle & Arabic Title */}
      <div className="space-y-2.5 mb-4">
        <div className="h-3 w-28 rounded bg-cyan-500/20 animate-pulse" />
        <div className="h-5 w-4/5 rounded bg-purple-800/30 animate-pulse" />
        <div className="h-4 w-3/5 rounded bg-purple-900/20" />
      </div>

      {/* 3. Description Lines */}
      <div className="space-y-2 mb-4">
        <div className="h-3 w-full rounded bg-white/[0.04]" />
        <div className="h-3 w-10/12 rounded bg-white/[0.04]" />
      </div>

      {/* 4. Footer Metric & Detail Arrow */}
      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
        <div className="h-3.5 w-24 rounded bg-purple-400/20 animate-pulse" />
        <div className="h-3.5 w-12 rounded bg-cyan-400/20" />
      </div>
    </div>
  );
};

/**
 * Responsive Grid of Eight Arms Skeletons matching the directory view.
 */
export const EightArmsSkeletonGrid: React.FC<{ count?: number; className?: string }> = ({
  count = 8,
  className = '',
}) => {
  return (
    <div
      role="status"
      aria-label="Loading eight arms cards..."
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}
    >
      {Array.from({ length: count }).map((_, idx) => (
        <EightArmsCardSkeleton key={idx} />
      ))}
      <span className="sr-only">Loading eight arms...</span>
    </div>
  );
};

/**
 * Luxury Skeleton loading state for individual 'Portfolio' / Case Study cards.
 */
export const PortfolioCardSkeleton: React.FC<{ className?: string; aspectRatio?: 'standard' | 'tall' | 'wide' }> = ({
  className = '',
  aspectRatio = 'standard',
}) => {
  const aspectClass =
    aspectRatio === 'tall'
      ? 'aspect-[3/4]'
      : aspectRatio === 'wide'
      ? 'aspect-[16/9]'
      : 'aspect-[16/10]';

  return (
    <div
      aria-hidden="true"
      className={`relative rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#110a28]/90 via-[#0a071a]/95 to-[#04020b]/98 border border-white/[0.08] overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.8)] flex flex-col justify-between ${className}`}
    >
      <SkeletonShimmer />

      {/* 1. Visual Cover Skeleton */}
      <div className={`relative w-full ${aspectClass} bg-purple-950/30 border-b border-white/[0.06] flex items-center justify-center overflow-hidden`}>
        <div className="w-10 h-10 rounded-xl bg-purple-900/30 animate-pulse" />
        <div className="absolute top-3 end-3 h-5 w-16 rounded bg-black/60 border border-white/[0.08]" />
      </div>

      {/* 2. Card Content Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata (Zero-Pill discipline) */}
          <div className="flex items-center gap-2 text-xs text-purple-300/70 mb-3">
            <div className="h-3.5 w-20 rounded bg-purple-800/30 animate-pulse" />
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <div className="h-3 w-14 rounded bg-white/[0.06]" />
          </div>

          {/* Project Title */}
          <div className="h-6 w-3/4 rounded bg-purple-700/30 mb-3 animate-pulse" />

          {/* Scope / Excerpt Bullets */}
          <div className="space-y-2 mb-5">
            <div className="h-3 w-full rounded bg-white/[0.04]" />
            <div className="h-3 w-11/12 rounded bg-white/[0.04]" />
            <div className="h-3 w-4/5 rounded bg-white/[0.04]" />
          </div>
        </div>

        {/* Footer Metrics / Client line */}
        <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
          <div className="h-3 w-28 rounded bg-white/[0.08]" />
          <div className="h-8 w-24 rounded-lg bg-gradient-to-r from-purple-900/40 to-purple-800/30 border border-purple-500/20 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

/**
 * Responsive Grid of Portfolio Card Skeletons.
 */
export const PortfolioSkeletonGrid: React.FC<{ count?: number; className?: string }> = ({
  count = 6,
  className = '',
}) => {
  return (
    <div
      role="status"
      aria-label="Loading portfolio cards..."
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
    >
      {Array.from({ length: count }).map((_, idx) => (
        <PortfolioCardSkeleton key={idx} />
      ))}
      <span className="sr-only">Loading portfolio...</span>
    </div>
  );
};

/**
 * Masonry Columns Grid of Portfolio Card Skeletons for the Visual Asset Gallery.
 */
export const PortfolioMasonrySkeletonGrid: React.FC<{ count?: number; className?: string }> = ({
  count = 8,
  className = '',
}) => {
  const aspectRatios: ('standard' | 'tall' | 'wide')[] = ['tall', 'standard', 'wide', 'standard', 'tall', 'wide', 'standard', 'tall'];

  return (
    <div
      role="status"
      aria-label="Loading gallery visuals..."
      className={`columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6 space-y-4 sm:space-y-6 ${className}`}
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="break-inside-avoid">
          <PortfolioCardSkeleton aspectRatio={aspectRatios[idx % aspectRatios.length]} />
        </div>
      ))}
      <span className="sr-only">Loading visual gallery...</span>
    </div>
  );
};
