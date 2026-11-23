import React from 'react';

export const ProjectShowcaseSkeleton: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="w-full max-w-[1600px] mx-auto animate-pulse select-none"
    >
      {/* Header Placeholder */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        {/* Shimmer Badge */}
        <div className="h-7 w-56 rounded-full bg-purple-950/50 border border-purple-800/30 mb-4" />
        {/* Shimmer Title */}
        <div className="h-10 sm:h-12 w-80 sm:w-96 rounded-2xl bg-white/[0.06] mb-3" />
        {/* Shimmer Subtitle */}
        <div className="h-4 w-64 sm:w-80 rounded-full bg-white/[0.04]" />
      </div>

      {/* Category Pills Shimmer */}
      <div className="flex items-center justify-center gap-2 flex-wrap mb-12 px-2">
        {[100, 120, 90, 110, 130, 95].map((w, i) => (
          <div
            key={i}
            style={{ width: `${w}px` }}
            className="h-9 rounded-full bg-purple-950/30 border border-purple-900/20"
          />
        ))}
      </div>

      {/* 3D Carousel Skeleton Layout */}
      <div className="relative w-full max-w-6xl mx-auto flex items-center justify-center min-h-[580px] sm:min-h-[620px] py-4">
        {/* Nav Buttons Skeletons */}
        <div className="absolute left-2 sm:left-4 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#0a0a16]/80 border border-purple-900/30" />
        <div className="absolute right-2 sm:right-4 z-20 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#0a0a16]/80 border border-purple-900/30" />

        <div className="relative w-full flex items-center justify-center">
          {/* Side Card Left (Ghost) */}
          <div className="hidden md:block absolute -left-12 lg:-left-20 w-[420px] h-[520px] rounded-3xl bg-[#090514]/60 border border-purple-900/20 opacity-30 scale-90 blur-[1px]" />

          {/* Center Main Spotlight Card Skeleton */}
          <div className="relative z-10 w-full max-w-4xl rounded-3xl bg-[#0a0618]/90 border border-purple-500/30 overflow-hidden shadow-[0_0_50px_rgba(138,43,226,0.15)] p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Media Shimmer Area */}
              <div className="lg:col-span-7 aspect-[4/3] rounded-2xl bg-purple-950/40 border border-purple-900/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              </div>

              {/* Information Column Shimmer */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                <div className="space-y-2.5">
                  {/* Category & Year Tag */}
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-24 rounded-full bg-purple-900/40" />
                    <div className="h-6 w-16 rounded-full bg-white/[0.05]" />
                  </div>

                  {/* Main Title Bar */}
                  <div className="h-8 w-3/4 rounded-xl bg-white/[0.08]" />

                  {/* Paragraph lines */}
                  <div className="space-y-1.5 pt-1">
                    <div className="h-3.5 w-full rounded-full bg-white/[0.04]" />
                    <div className="h-3.5 w-5/6 rounded-full bg-white/[0.04]" />
                    <div className="h-3.5 w-2/3 rounded-full bg-white/[0.04]" />
                  </div>
                </div>

                {/* 3 Metric Mini Cards Shimmer */}
                <div className="grid grid-cols-3 gap-2 pt-3">
                  {[1, 2, 3].map((m) => (
                    <div
                      key={m}
                      className="p-3 rounded-xl bg-white/[0.02] border border-purple-900/30 flex flex-col items-center gap-1.5"
                    >
                      <div className="h-5 w-12 rounded-md bg-purple-700/30" />
                      <div className="h-2.5 w-14 rounded-full bg-white/[0.05]" />
                    </div>
                  ))}
                </div>

                {/* Action CTA Button Shimmer */}
                <div className="h-12 w-full rounded-2xl bg-gradient-to-r from-purple-900/50 to-purple-800/40 border border-purple-500/20 mt-2" />
              </div>
            </div>
          </div>

          {/* Side Card Right (Ghost) */}
          <div className="hidden md:block absolute -right-12 lg:-right-20 w-[420px] h-[520px] rounded-3xl bg-[#090514]/60 border border-purple-900/20 opacity-30 scale-90 blur-[1px]" />
        </div>
      </div>
    </div>
  );
};
