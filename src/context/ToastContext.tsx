import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  Info,
  AlertTriangle,
  AlertCircle,
  X,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from './LanguageContext';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: ToastAction;
  icon?: React.ReactNode;
}

export interface ToastContextType {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, 'id'>) => string;
  success: (
    title: string,
    message?: string,
    options?: Partial<Omit<ToastItem, 'id' | 'title' | 'message' | 'type'>>
  ) => string;
  info: (
    title: string,
    message?: string,
    options?: Partial<Omit<ToastItem, 'id' | 'title' | 'message' | 'type'>>
  ) => string;
  warning: (
    title: string,
    message?: string,
    options?: Partial<Omit<ToastItem, 'id' | 'title' | 'message' | 'type'>>
  ) => string;
  error: (
    title: string,
    message?: string,
    options?: Partial<Omit<ToastItem, 'id' | 'title' | 'message' | 'type'>>
  ) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastCardProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

const ToastCard: React.FC<ToastCardProps> = ({ toast, onDismiss }) => {
  const { dir } = useLanguage();
  const [isPaused, setIsPaused] = useState(false);
  const duration = toast.duration ?? 4500;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remainingTimeRef = useRef<number>(duration);
  const startTimeRef = useRef<number>(Date.now());

  const startTimer = useCallback(() => {
    if (duration <= 0 || duration === Infinity) return;
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      onDismiss(toast.id);
    }, remainingTimeRef.current);
  }, [duration, onDismiss, toast.id]);

  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const elapsed = Date.now() - startTimeRef.current;
    remainingTimeRef.current = Math.max(remainingTimeRef.current - elapsed, 0);
    setIsPaused(true);
  }, []);

  const resumeTimer = useCallback(() => {
    setIsPaused(false);
    startTimer();
  }, [startTimer]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [startTimer]);

  const config = {
    success: {
      borderColor: 'border-emerald-500/40',
      glow: 'shadow-[0_10px_35px_rgba(0,0,0,0.85),0_0_25px_rgba(16,185,129,0.3)]',
      iconBg: 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400',
      defaultIcon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      progressGradient: 'from-emerald-400 via-teal-400 to-[#8A2BE2]',
      tagBg: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
    },
    info: {
      borderColor: 'border-cyan-500/40',
      glow: 'shadow-[0_10px_35px_rgba(0,0,0,0.85),0_0_25px_rgba(6,182,212,0.3)]',
      iconBg: 'bg-cyan-950/80 border-cyan-500/50 text-cyan-400',
      defaultIcon: <Sparkles className="w-5 h-5 text-cyan-400" />,
      progressGradient: 'from-cyan-400 via-blue-500 to-[#8A2BE2]',
      tagBg: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30'
    },
    warning: {
      borderColor: 'border-amber-500/40',
      glow: 'shadow-[0_10px_35px_rgba(0,0,0,0.85),0_0_25px_rgba(245,158,11,0.3)]',
      iconBg: 'bg-amber-950/80 border-amber-500/50 text-amber-400',
      defaultIcon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
      progressGradient: 'from-amber-400 via-orange-500 to-rose-500',
      tagBg: 'bg-amber-950/60 text-amber-300 border-amber-500/30'
    },
    error: {
      borderColor: 'border-rose-500/40',
      glow: 'shadow-[0_10px_35px_rgba(0,0,0,0.85),0_0_25px_rgba(244,63,94,0.3)]',
      iconBg: 'bg-rose-950/80 border-rose-500/50 text-rose-400',
      defaultIcon: <AlertCircle className="w-5 h-5 text-rose-400" />,
      progressGradient: 'from-rose-500 via-pink-500 to-purple-600',
      tagBg: 'bg-rose-950/60 text-rose-300 border-rose-500/30'
    }
  }[toast.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.92, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 0.9, y: -15, filter: 'blur(4px)', transition: { duration: 0.22 } }}
      transition={{ type: 'spring', damping: 25, stiffness: 350 }}
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}
      className={`pointer-events-auto relative w-full overflow-hidden rounded-2xl bg-[#0b0c1b]/95 backdrop-blur-xl border ${config.borderColor} ${config.glow} p-4 transition-all`}
      role="alert"
      aria-live="polite"
      dir={dir}
    >
      {/* Ambient Neon Reflection Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#8A2BE2]/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />

      <div className="flex items-start gap-3.5 relative z-10">
        {/* Type Icon */}
        <div
          className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-inner ${config.iconBg}`}
        >
          {toast.icon || config.defaultIcon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-bold text-white tracking-tight leading-snug">
              {toast.title}
            </h4>
          </div>

          {toast.message && (
            <p className="text-xs text-slate-300 leading-relaxed break-words font-medium">
              {toast.message}
            </p>
          )}

          {/* Action button if present */}
          {toast.action && (
            <button
              onClick={() => {
                toast.action?.onClick();
                onDismiss(toast.id);
              }}
              className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold text-white transition-all hover:scale-105 active:scale-95"
            >
              <span>{toast.action.label}</span>
              <ExternalLink className="w-3 h-3 text-slate-300" />
            </button>
          )}
        </div>

        {/* Dismiss Button */}
        <button
          onClick={() => onDismiss(toast.id)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0 -mr-1 -mt-1"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Auto-Dismiss Countdown Progress Bar */}
      {duration > 0 && duration !== Infinity && (
        <div className="absolute bottom-0 inset-x-0 h-1 bg-white/[0.06] overflow-hidden">
          <motion.div
            initial={{ width: '100%' }}
            animate={{ width: isPaused ? undefined : '0%' }}
            transition={{
              duration: duration / 1000,
              ease: 'linear'
            }}
            className={`h-full bg-gradient-to-r ${config.progressGradient}`}
          />
        </div>
      )}
    </motion.div>
  );
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const { dir } = useLanguage();

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const showToast = useCallback(
    (toast: Omit<ToastItem, 'id'>) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newToast: ToastItem = { ...toast, id };
      setToasts((prev) => {
        // Limit to max 4 concurrent toasts to avoid screen crowding
        const updated = [...prev, newToast];
        return updated.length > 4 ? updated.slice(updated.length - 4) : updated;
      });
      return id;
    },
    []
  );

  const success = useCallback(
    (
      title: string,
      message?: string,
      options?: Partial<Omit<ToastItem, 'id' | 'title' | 'message' | 'type'>>
    ) => {
      return showToast({ type: 'success', title, message, ...options });
    },
    [showToast]
  );

  const info = useCallback(
    (
      title: string,
      message?: string,
      options?: Partial<Omit<ToastItem, 'id' | 'title' | 'message' | 'type'>>
    ) => {
      return showToast({ type: 'info', title, message, ...options });
    },
    [showToast]
  );

  const warning = useCallback(
    (
      title: string,
      message?: string,
      options?: Partial<Omit<ToastItem, 'id' | 'title' | 'message' | 'type'>>
    ) => {
      return showToast({ type: 'warning', title, message, ...options });
    },
    [showToast]
  );

  const error = useCallback(
    (
      title: string,
      message?: string,
      options?: Partial<Omit<ToastItem, 'id' | 'title' | 'message' | 'type'>>
    ) => {
      return showToast({ type: 'error', title, message, ...options });
    },
    [showToast]
  );

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        success,
        info,
        warning,
        error,
        removeToast,
        clearToasts
      }}
    >
      {children}

      {/* Floating Toast Notification Container */}
      <aside
        aria-label="Notifications"
        className={`fixed top-20 sm:top-24 z-[9999] pointer-events-none flex flex-col gap-3 w-full max-w-sm sm:max-w-md px-4 sm:px-0 ${
          dir === 'rtl' ? 'left-4 sm:left-6' : 'right-4 sm:right-6'
        }`}
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastCard key={toast.id} toast={toast} onDismiss={removeToast} />
          ))}
        </AnimatePresence>
      </aside>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
