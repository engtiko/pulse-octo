import React from 'react';
import { motion } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface ThemeToggleProps {
  className?: string;
  variant?: 'compact' | 'pill' | 'expanded';
  id?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  variant = 'compact',
  id = 'theme-toggle-btn',
}) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { isAr } = useLanguage();

  const titleText = isDark
    ? isAr
      ? 'التبديل إلى المظهر الفاتح (Light Mode)'
      : 'Switch to Light Mode'
    : isAr
    ? 'التبديل إلى المظهر الليلي (Dark Mode)'
    : 'Switch to Dark Mode';

  if (variant === 'pill') {
    return (
      <button
        id={id}
        type="button"
        onClick={toggleTheme}
        className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 backdrop-blur-md active:scale-95 cursor-pointer ${
          isDark
            ? 'bg-purple-950/40 hover:bg-purple-900/60 border-purple-500/30 text-purple-200 hover:text-white shadow-[0_0_12px_rgba(138,43,226,0.2)]'
            : 'bg-white/80 hover:bg-white border-purple-300/80 text-purple-900 shadow-[0_2px_10px_rgba(138,43,226,0.15)]'
        } ${className}`}
        aria-label={titleText}
        title={titleText}
      >
        <div className="relative w-4 h-4 flex items-center justify-center">
          <motion.div
            key={theme}
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {isDark ? (
              <Moon className="w-3.5 h-3.5 text-purple-300" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-500" />
            )}
          </motion.div>
        </div>
        <span className="text-[11px] font-medium font-sans">
          {isDark
            ? isAr
              ? 'مظهر ليلي'
              : 'Dark'
            : isAr
            ? 'مظهر ناصع'
              : 'Light'}
        </span>
      </button>
    );
  }

  // Compact circular button ideal for header and navigation bars
  return (
    <button
      id={id}
      type="button"
      onClick={toggleTheme}
      className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md active:scale-90 cursor-pointer shrink-0 border ${
        isDark
          ? 'bg-white/[0.05] hover:bg-purple-950/70 border-purple-500/30 hover:border-purple-400/70 text-purple-300 hover:text-white shadow-[0_0_14px_rgba(138,43,226,0.2)]'
          : 'bg-slate-100 hover:bg-white border-purple-300/80 text-purple-800 shadow-[0_2px_8px_rgba(138,43,226,0.18)]'
      } ${className}`}
      aria-label={titleText}
      title={titleText}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -70, scale: 0.5, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        exit={{ rotate: 70, scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex items-center justify-center"
      >
        {isDark ? (
          <Moon className="w-4 h-4 text-purple-300 hover:text-purple-200 drop-shadow-[0_0_6px_rgba(168,85,247,0.5)] transition-colors" />
        ) : (
          <Sun className="w-4 h-4 text-amber-500 hover:text-amber-600 transition-colors" />
        )}
      </motion.div>
    </button>
  );
};
