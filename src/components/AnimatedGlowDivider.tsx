import React from 'react';

export interface AnimatedGlowDividerProps {
  id?: string;
  variant?: 'pulse' | 'gold' | 'cyan' | 'minimal';
  className?: string;
  maxWidth?: string;
  withNode?: boolean;
}

/**
 * AnimatedGlowDivider - Restrained luxury architectural hairline divider.
 * Separates core sections with a clean editorial rule and optional subtle node.
 */
export const AnimatedGlowDivider: React.FC<AnimatedGlowDividerProps> = ({
  id,
  variant = 'pulse',
  className = '',
  maxWidth = 'max-w-7xl',
  withNode = true,
}) => {
  const hairlineColor =
    variant === 'minimal'
      ? 'via-white/[0.08]'
      : variant === 'cyan'
        ? 'via-cyan-500/25'
        : variant === 'gold'
          ? 'via-amber-500/25'
          : 'via-purple-500/25';

  const sweepGradient =
    variant === 'minimal'
      ? 'from-transparent via-white/25 to-transparent'
      : variant === 'cyan'
        ? 'from-transparent via-cyan-400/55 to-transparent'
        : variant === 'gold'
          ? 'from-transparent via-amber-300/55 to-transparent'
          : 'from-transparent via-purple-400/65 to-transparent';

  return (
    <div
      id={id}
      aria-hidden="true"
      className={`relative w-full py-6 sm:py-10 flex items-center justify-center overflow-hidden select-none pointer-events-none ${className}`}
    >
      <div className={`relative w-full ${maxWidth} px-4 sm:px-6 lg:px-8 flex items-center justify-center`}>
        {/* Base architectural hairline */}
        <div className="relative flex-1 h-px overflow-hidden">
          <div className={`w-full h-full bg-gradient-to-r from-transparent ${hairlineColor} to-white/[0.08]`} />
          <div
            className={`absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r ${sweepGradient} animate-divider-glow`}
          />
        </div>

        {/* Subtle Central Architectural Node */}
        {withNode && (
          <div className="relative mx-4 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rotate-45 border border-purple-400/40 bg-[#09080f] shadow-[0_0_10px_rgba(168,85,247,0.35)]" />
          </div>
        )}

        {/* Right architectural hairline */}
        <div className="relative flex-1 h-px overflow-hidden">
          <div className={`w-full h-full bg-gradient-to-l from-transparent ${hairlineColor} to-white/[0.08]`} />
          <div
            className={`absolute inset-y-0 right-0 w-1/2 bg-gradient-to-r ${sweepGradient} animate-divider-glow`}
          />
        </div>
      </div>
    </div>
  );
};

export default AnimatedGlowDivider;

