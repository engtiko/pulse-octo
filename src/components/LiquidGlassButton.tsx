import React from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';

export interface LiquidGlassButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  variant?: 'primary' | 'secondary' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  id?: string;
  href?: string;
  target?: string;
  rel?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;
  title?: string;
}

/**
 * LiquidGlassButton:
 * Signature PULSE OCTO luxury Frosted Glassmorphism interactive button:
 * - Multi-layered frosted glass core (backdrop-blur-[12px] backdrop-saturate-[180%])
 * - Brushed Platinum Silver & Royal Amethyst specular rim (#d8c4ff / #9d65f5)
 * - Diagonal specular sheen & inner crystal refraction
 */
export const LiquidGlassButton: React.FC<LiquidGlassButtonProps> = ({
  children,
  className = '',
  onClick,
  variant = 'primary',
  size = 'md',
  id,
  href,
  target,
  rel,
  disabled = false,
  type = 'button',
  'aria-label': ariaLabel,
  title,
}) => {
  const sizeClasses = {
    sm: 'text-xs px-4 sm:px-5 py-1.5 sm:py-2 min-h-[36px]',
    md: 'text-xs sm:text-sm px-6 sm:px-8 py-2.5 sm:py-3 min-h-[44px]',
    lg: 'text-sm sm:text-base px-8 sm:px-10 py-3.5 sm:py-4 min-h-[52px]',
  }[size];

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-[#8247e5]/90 via-[#6b34c9]/90 to-[#4c1f99]/90 group-hover:from-[#9258f5] group-hover:via-[#7c42d6] group-hover:to-[#5b27b5] border-[#d8c4ff]/45 group-hover:border-[#e9dcff]/80 shadow-[0_14px_34px_-6px_rgba(110,52,205,0.5),inset_0_1px_1.5px_rgba(255,255,255,0.42),inset_0_-1px_2px_rgba(184,140,255,0.28)] group-hover:shadow-[0_18px_40px_-4px_rgba(130,71,229,0.65),inset_0_1.5px_2px_rgba(255,255,255,0.58)]',
    secondary:
      'bg-gradient-to-b from-white/[0.12] via-white/[0.045] to-[#1a0d2e]/[0.42] group-hover:from-[#b88cff]/[0.22] group-hover:via-white/[0.09] group-hover:to-[#4c1f99]/[0.45] border-white/[0.18] group-hover:border-[#d8c4ff]/65 shadow-[0_14px_32px_-6px_rgba(0,0,0,0.85),inset_0_1px_1.5px_rgba(255,255,255,0.36),inset_0_-1px_2px_rgba(157,101,245,0.2)] group-hover:shadow-[0_18px_38px_-6px_rgba(124,66,214,0.45),inset_0_1.5px_2px_rgba(255,255,255,0.5)]',
    purple:
      'bg-gradient-to-r from-[#7c42d6] to-[#56259e] group-hover:from-[#8d52e8] group-hover:to-[#662eb8] border-[#d8c4ff]/50 group-hover:border-white/75 shadow-[0_14px_32px_-6px_rgba(124,66,214,0.5),inset_0_1px_1.5px_rgba(255,255,255,0.4)]',
  }[variant];

  const motionProps: HTMLMotionProps<'button'> = {
    whileHover: disabled ? undefined : { scale: 1.02 },
    whileTap: disabled ? undefined : { scale: 0.97 },
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 22,
      mass: 0.5,
    },
  };

  const sharedClassName = `group relative inline-flex items-center justify-center rounded-full text-center font-semibold text-white select-none cursor-pointer touch-manipulation transition-all duration-300 ease-out ${
    disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
  } ${className}`;

  const innerContent = (
    <div
      className={`relative w-full h-full rounded-full border backdrop-blur-[12px] backdrop-saturate-[180%] transition-all duration-300 ease-out overflow-hidden flex items-center justify-center ${variantStyles} ${sizeClasses}`}
    >
      {/* Top Frosted Specular Sheen */}
      <div className="absolute top-0 inset-x-4 h-[1px] bg-gradient-to-r from-transparent via-white/65 to-transparent opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none" />
      {/* Subtle Diagonal Glass Reflection */}
      <div className="absolute -top-8 -left-8 w-20 h-20 bg-white/[0.08] rotate-45 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-500 pointer-events-none blur-[2px]" />

      {/* Clean Typography */}
      <span className="relative z-10 font-bold tracking-wide text-[#f6f4fb] group-hover:text-white transition-colors duration-200 whitespace-nowrap flex items-center justify-center gap-2">
        {children}
      </span>
    </div>
  );

  if (href) {
    return (
      <motion.a
        id={id}
        href={href}
        target={target}
        rel={rel}
        onClick={onClick as any}
        className={sharedClassName}
        aria-label={ariaLabel}
        title={title}
        {...(motionProps as any)}
      >
        {innerContent}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      id={id}
      onClick={onClick as any}
      disabled={disabled}
      className={sharedClassName}
      aria-label={ariaLabel}
      title={title}
      {...motionProps}
    >
      {innerContent}
    </motion.button>
  );
};
