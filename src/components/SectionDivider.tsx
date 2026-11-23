import React from 'react';
import { motion } from 'motion/react';
import { AnimatedGlowDivider } from './AnimatedGlowDivider';

export { AnimatedGlowDivider };

export interface SectionDividerProps {
  id?: string;
  variant?: 'gold' | 'pulse' | 'glow' | 'minimal' | 'gradient-glow';
  className?: string;
  maxWidth?: string;
}

export const SectionDivider: React.FC<SectionDividerProps> = ({
  id,
  variant = 'gold',
  className = '',
  maxWidth = 'max-w-7xl',
}) => {
  // If gradient-glow or pulse or glow is selected, render the animated gradient glow divider
  if (variant === 'gradient-glow' || variant === 'pulse' || variant === 'glow') {
    return (
      <AnimatedGlowDivider
        id={id}
        variant={variant === 'glow' ? 'cyan' : 'pulse'}
        className={className}
        maxWidth={maxWidth}
      />
    );
  }

  return (
    <div
      id={id}
      aria-hidden="true"
      className={`relative w-full py-8 sm:py-12 flex items-center justify-center overflow-hidden select-none pointer-events-none ${className}`}
    >
      {/* Background ambient soft gold glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-64 sm:w-128 h-12 bg-gradient-to-r from-transparent via-[#ffb829]/5 to-transparent blur-2xl transform-gpu" />
      </div>

      {/* Center structural golden hairline */}
      <div className={`relative w-full ${maxWidth} px-4 sm:px-6 lg:px-8 flex items-center justify-center`}>
        {/* Left feathering golden line */}
        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#ffb829]/15 to-[#ffb829]/20" />

        {/* Central focal node */}
        {variant === 'gold' && (
          <div className="relative mx-3.5 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rotate-45 border border-[#ffb829]/50 bg-[#090616] shadow-[0_0_8px_rgba(255,184,41,0.15)]" />
          </div>
        )}

        {variant === 'minimal' && (
          <div className="relative mx-2.5 flex items-center justify-center">
            <span className="w-1 h-1 rounded-full bg-[#ffb829]/40" />
          </div>
        )}

        {/* Right feathering golden line */}
        <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#ffb829]/15 to-[#ffb829]/20" />
      </div>
    </div>
  );
};

/**
 * Pure, uninterrupted elegant golden hairline divider line (`h-[1px] bg-[#ffb829]/20`)
 * Designed for high-end editorial section rhythm.
 */
export const GoldenDivider: React.FC<{
  id?: string;
  className?: string;
  maxWidth?: string;
  withNode?: boolean;
}> = ({
  id,
  className = '',
  maxWidth = 'max-w-7xl',
  withNode = true,
}) => {
  return (
    <div
      id={id}
      aria-hidden="true"
      className={`relative w-full py-8 sm:py-12 flex items-center justify-center select-none pointer-events-none ${className}`}
    >
      <div className={`relative w-full ${maxWidth} px-4 sm:px-6 lg:px-8 flex items-center justify-center`}>
        {withNode ? (
          <>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#ffb829]/15 to-[#ffb829]/25" />
            <div className="mx-3.5 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rotate-45 border border-[#ffb829]/50 bg-[#090616] shadow-[0_0_8px_rgba(255,184,41,0.15)]" />
            </div>
            <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#ffb829]/15 to-[#ffb829]/25" />
          </>
        ) : (
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#ffb829]/20 to-transparent" />
        )}
      </div>
    </div>
  );
};

