import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { InsightItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { BlurUpImage } from './BlurUpImage';
import {
  X,
  Clock,
  Calendar,
  Share2,
  Heart,
  Bookmark,
  Check,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Zap,
  CheckCircle2,
  BookOpen
} from 'lucide-react';

interface InsightDetailModalProps {
  insight: InsightItem | null;
  onClose: () => void;
  onOpenConsultation?: (topic?: string) => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  likes: number;
  hasLiked: boolean;
  onToggleLike: (id: string) => void;
}

export const InsightDetailModal: React.FC<InsightDetailModalProps> = ({
  insight,
  onClose,
  onOpenConsultation,
  isBookmarked,
  onToggleBookmark,
  likes,
  hasLiked,
  onToggleLike,
}) => {
  const { isAr, dir } = useLanguage();
  const [copied, setCopied] = useState<boolean>(false);
  const [readingProgress, setReadingProgress] = useState<number>(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    const maxScroll = scrollHeight - clientHeight;
    if (maxScroll > 0) {
      const progress = Math.min(Math.max((scrollTop / maxScroll) * 100, 0), 100);
      setReadingProgress(progress);
    }
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll, insight]);

  if (!insight) return null;

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const title = isAr ? insight.titleAr : insight.titleEn;
  const content = isAr ? insight.contentAr : insight.contentEn;
  const takeaways = isAr ? insight.takeawaysAr : insight.takeawaysEn;
  const categoryLabel = isAr ? insight.categoryAr : insight.categoryEn;
  const authorName = isAr ? insight.author.nameAr : insight.author.nameEn;
  const authorRole = isAr ? insight.author.roleAr : insight.author.roleEn;
  const readTime = isAr ? insight.readTime : insight.readTimeEn;
  const statLabel = isAr ? insight.statsHighlight.labelAr : insight.statsHighlight.labelEn;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 overflow-y-auto"
        dir={dir}
        role="dialog"
        aria-modal="true"
        aria-labelledby="insight-modal-title"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl -z-10"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 25 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl max-h-[92vh] bg-[#070414] border border-purple-500/30 rounded-3xl shadow-[0_0_80px_rgba(138,43,226,0.35)] overflow-hidden flex flex-col my-auto"
        >
          {/* Header Bar */}
          <div className="sticky top-0 z-20 flex items-center justify-between px-5 sm:px-8 py-4 bg-[#070414]/95 backdrop-blur-md border-b border-purple-900/30">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold tracking-wider">
                {insight.tag}
              </span>
              <span className="text-slate-400 text-xs hidden sm:inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                {readTime}
              </span>
              {readingProgress > 2 && (
                <span className="px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold">
                  {Math.round(readingProgress)}%
                </span>
              )}
            </div>

            {/* Quick Actions (Share, Bookmark, Close) */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleLike(insight.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  hasLiked
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.08]'
                }`}
                aria-label="Like insight"
              >
                <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-red-400 text-red-400' : ''}`} />
                <span>{likes}</span>
              </button>

              <button
                onClick={() => onToggleBookmark(insight.id)}
                className={`p-2 rounded-full text-xs transition-all ${
                  isBookmarked
                    ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(138,43,226,0.5)]'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.08]'
                }`}
                aria-label="Bookmark insight"
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={handleShare}
                className="p-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-400 hover:text-white transition-colors relative"
                aria-label="Share article"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
                {copied && (
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded bg-purple-900 text-[10px] text-white shadow-lg">
                    {isAr ? 'تم نسخ الرابط' : 'Copied!'}
                  </span>
                )}
              </button>

              <button
                onClick={onClose}
                className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.12] border border-white/[0.08] hover:border-purple-400/40 text-slate-300 hover:text-white transition-all cursor-pointer active:scale-95 shadow-sm"
                aria-label={isAr ? 'إغلاق' : 'Close'}
                title={isAr ? 'إغلاق (Esc)' : 'Close (Esc)'}
              >
                <X className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-300 text-slate-300 group-hover:text-white" />
                <span className="text-xs font-semibold">{isAr ? 'إغلاق' : 'Close'}</span>
              </button>
            </div>
            {/* Reading Progress Bar (Neon OCTO gradient with glow) */}
            <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-white/[0.06] overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 via-[#8A2BE2] to-fuchsia-400 shadow-[0_0_10px_rgba(138,43,226,0.9)]"
                style={{
                  width: `${readingProgress}%`,
                  transformOrigin: dir === 'rtl' ? 'right' : 'left',
                }}
                transition={{ ease: 'easeOut', duration: 0.1 }}
              />
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div
            ref={scrollContainerRef}
            className="overflow-y-auto p-5 sm:p-8 space-y-6"
          >
            {/* Cover Media Banner with Stat Badge */}
            <div className="relative aspect-[21/9] sm:aspect-[2.4/1] w-full rounded-2xl overflow-hidden border border-purple-500/20 bg-purple-950/40">
              <BlurUpImage
                src={insight.coverImage}
                alt={title}
                className="w-full h-full"
                imgClassName="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070414] via-[#070414]/40 to-transparent pointer-events-none z-10" />

              {/* Floating Stat Banner */}
              <div className={`absolute bottom-4 ${dir === 'rtl' ? 'right-4' : 'left-4'} p-3 sm:p-4 rounded-xl bg-[#0a051d]/90 backdrop-blur-md border border-purple-500/40 shadow-[0_0_25px_rgba(138,43,226,0.4)] flex items-center gap-3`}>
                <div className="p-2 rounded-lg bg-gradient-to-tr from-purple-700 to-cyan-500 text-white">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black font-mono text-white tracking-tight">
                    {insight.statsHighlight.value}
                  </div>
                  <div className="text-[11px] sm:text-xs text-purple-300 font-medium">
                    {statLabel}
                  </div>
                </div>
              </div>
            </div>

            {/* Title & Meta */}
            <div>
              <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{categoryLabel}</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-purple-400" />
                  {insight.publishDate}
                </span>
              </div>

              <h1 id="insight-modal-title" className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight mb-4">
                {title}
              </h1>

              {/* Author Strip */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <img
                  src={insight.author.avatar}
                  alt={authorName}
                  width={44}
                  height={44}
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-xl object-cover border border-purple-500/40"
                />
                <div>
                  <div className="text-sm font-bold text-white">{authorName}</div>
                  <div className="text-xs text-purple-300/80">{authorRole}</div>
                </div>
              </div>
            </div>

            {/* In-Depth Content */}
            <div className="space-y-4 text-slate-300 text-base sm:text-lg leading-relaxed">
              <p className="font-semibold text-white/95 text-lg sm:text-xl border-l-4 border-r-4 border-purple-500 px-4 py-2 bg-purple-950/20 rounded-lg">
                {isAr ? insight.excerptAr : insight.excerptEn}
              </p>
              <p>{content}</p>
            </div>

            {/* Strategic Action Checklist (Takeaways) */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-purple-950/30 to-[#0c061e] border border-purple-500/30">
              <div className="flex items-center gap-2 text-sm font-bold font-mono text-purple-300 uppercase tracking-wider mb-4">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{isAr ? 'الخلاصة الاستراتيجية وخارطة التنفيذ' : 'STRATEGIC TAKEAWAYS & ACTION PLAN'}</span>
              </div>

              <div className="space-y-3">
                {takeaways.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-purple-900/60 border border-purple-500/40 text-purple-200 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-sm sm:text-base text-slate-200 font-medium">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Banner: Apply with Pulse OCTO */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-purple-950/80 via-[#190933] to-[#0d0722] border border-purple-500/50 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_30px_rgba(138,43,226,0.25)]">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                  {isAr
                    ? 'هل ترغب في تطبيق هذه الاستراتيجية على علامتك التجارية؟'
                    : 'Ready to deploy this exact strategy for your brand?'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  {isAr
                    ? 'فريق Pulse OCTO جاهز لمراجعة حساباتك الإعلانية أو متجرك وتطبيق أفضل الممارسات فوراً.'
                    : 'Our team will audit your current setup and implement high-yield protocols within 48 hours.'}
                </p>
              </div>

              {onOpenConsultation && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenConsultation(title);
                  }}
                  className="whitespace-nowrap px-6 py-3 rounded-xl bg-gradient-to-r from-[#8A2BE2] to-cyan-500 hover:from-purple-600 hover:to-cyan-400 text-white text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(138,43,226,0.5)] transition-all flex items-center gap-2 group shrink-0"
                >
                  <Zap className="w-4 h-4 text-yellow-300" />
                  <span>{isAr ? 'حجز جلسة عمل استراتيجية' : 'Book Strategic Audit'}</span>
                  {dir === 'rtl' ? (
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  ) : (
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  )}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
