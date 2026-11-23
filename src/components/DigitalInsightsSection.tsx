import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { InsightItem } from '../types';
import {
  INSIGHT_CATEGORIES,
  RAW_INSIGHTS,
  fetchDigitalInsights
} from '../data/insightsData';
import { InsightDetailModal } from './InsightDetailModal';
import { LiquidGlassButton } from './LiquidGlassButton';
import { BlurUpImage } from './BlurUpImage';
import {
  Sparkles,
  TrendingUp,
  Clock,
  Calendar,
  Share2,
  Heart,
  Bookmark,
  Check,
  Search,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Filter,
  CheckCircle2,
  ExternalLink,
  Flame,
  Zap
} from 'lucide-react';

interface DigitalInsightsSectionProps {
  onOpenConsultation?: (topic?: string) => void;
}

export const DigitalInsightsSection: React.FC<DigitalInsightsSectionProps> = React.memo(({
  onOpenConsultation,
}) => {
  const { isAr, dir, t } = useLanguage();

  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState<boolean>(false);

  // Active modal state
  const [activeModalInsight, setActiveModalInsight] = useState<InsightItem | null>(null);

  // Local storage bookmarks & likes state
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pulse_octo_bookmarked_insights');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [likedIds, setLikedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pulse_octo_liked_insights');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [likeCounts, setLikeCounts] = useState<{ [id: string]: number }>(() => {
    const initial: { [id: string]: number } = {};
    RAW_INSIGHTS.forEach((item) => {
      initial[item.id] = item.likesCount;
    });
    return initial;
  });

  const [shareToastId, setShareToastId] = useState<string | null>(null);

  // Initial fetch
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchDigitalInsights(selectedCategory, searchQuery).then((data) => {
      if (isMounted) {
        setInsights(data);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, searchQuery]);

  // Handle manual refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    const data = await fetchDigitalInsights(selectedCategory, searchQuery);
    setInsights(data);
    setIsRefreshing(false);
  }, [selectedCategory, searchQuery]);

  // Toggle bookmark handler
  const handleToggleBookmark = useCallback((id: string) => {
    setBookmarkedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('pulse_octo_bookmarked_insights', JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save bookmarks', e);
      }
      return next;
    });
  }, []);

  // Toggle like handler
  const handleToggleLike = useCallback((id: string) => {
    let wasLiked = false;
    setLikedIds((prev) => {
      wasLiked = prev.includes(id);
      const next = wasLiked ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('pulse_octo_liked_insights', JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save likes', e);
      }
      return next;
    });

    setLikeCounts((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + (wasLiked ? -1 : 1),
    }));
  }, []);

  // Share link handler
  const handleShare = useCallback((insight: InsightItem) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setShareToastId(insight.id);
      setTimeout(() => {
        setShareToastId(null);
      }, 2200);
    }
  }, []);

  // Filter for display (e.g. if bookmarks-only filter active)
  const displayedInsights = useMemo(() => {
    if (showOnlyBookmarked) {
      return insights.filter((item) => bookmarkedIds.includes(item.id));
    }
    return insights;
  }, [insights, showOnlyBookmarked, bookmarkedIds]);

  // Featured spotlight insight (top trending item)
  const spotlightInsight = useMemo(() => {
    return RAW_INSIGHTS.find((item) => item.isFeatured) || RAW_INSIGHTS[0];
  }, []);

  return (
    <section
      id="blog"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#030308]/90 overflow-hidden select-none scroll-mt-20"
    >
      {/* Anchor alias for backward compatibility */}
      <div id="insights" className="absolute -top-24 left-0 pointer-events-none" />
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#8A2BE2]/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4"
          >
            {isAr ? (
              <>
                رؤى استراتيجية تقود <span className="bg-gradient-to-r from-purple-400 via-[#8A2BE2] to-cyan-400 bg-clip-text text-transparent">نمو علامتك</span>
              </>
            ) : (
              <>
                Actionable Intelligence for <span className="bg-gradient-to-r from-purple-400 via-[#8A2BE2] to-cyan-400 bg-clip-text text-transparent">Exponential Growth</span>
              </>
            )}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-base sm:text-lg leading-relaxed"
          >
            {isAr
              ? 'دراسات دورية مباشرة من غرف عمليات Pulse OCTO: أحدث مستجدات تتبع CAPI، تحولات خوارزميات الميديا بايينج، وسيكولوجية تحويل زوار المتاجر إلى مشترين دائمين.'
              : 'Direct from the Pulse OCTO telemetry lab: field-tested protocols for CAPI tracking, automated auction algorithms, and high-conversion e-commerce architecture.'}
          </motion.p>
        </div>

        {/* Featured Spotlight Card */}
        {spotlightInsight && !searchQuery && !showOnlyBookmarked && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14"
          >
            <div className="relative rounded-3xl bg-gradient-to-r from-[#0b051e] via-[#12072e] to-[#080415] border border-purple-500/40 p-6 sm:p-8 lg:p-10 overflow-hidden shadow-[0_0_50px_rgba(138,43,226,0.2)]">
              {/* Glowing Corner Badge */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#8A2BE2]/20 rounded-bl-full blur-2xl pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Visual Media with Trending Tag */}
                <div className="lg:col-span-6 relative rounded-2xl overflow-hidden aspect-[16/10] border border-purple-500/30 group">
                  <BlurUpImage
                    src={spotlightInsight.coverImage}
                    alt={isAr ? spotlightInsight.titleAr : spotlightInsight.titleEn}
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#070414] via-transparent to-transparent opacity-80 pointer-events-none z-10" />

                  {/* Spotlight Pill Badge */}
                  <div className={`absolute top-4 ${dir === 'rtl' ? 'right-4' : 'left-4'} flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#8A2BE2]/90 text-white text-xs font-bold font-mono tracking-wide shadow-lg backdrop-blur-md`}>
                    <Flame className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 animate-pulse" />
                    <span>{isAr ? 'التقرير الأكثر قراءة هذا الشهر' : 'FEATURED SPOTLIGHT'}</span>
                  </div>

                  {/* Impact Stat Pill */}
                  <div className={`absolute bottom-4 ${dir === 'rtl' ? 'right-4' : 'left-4'} px-4 py-2 rounded-xl bg-black/80 border border-purple-500/50 backdrop-blur-md flex items-center gap-2.5`}>
                    <span className="text-xl font-mono font-black text-cyan-300">
                      {spotlightInsight.statsHighlight.value}
                    </span>
                    <span className="text-xs text-slate-300 font-medium">
                      {isAr ? spotlightInsight.statsHighlight.labelAr : spotlightInsight.statsHighlight.labelEn}
                    </span>
                  </div>
                </div>

                {/* Insight Narrative */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="px-3 py-1 rounded-full bg-purple-900/40 text-purple-300 border border-purple-500/30 font-semibold font-mono">
                      {spotlightInsight.tag}
                    </span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      {isAr ? spotlightInsight.readTime : spotlightInsight.readTimeEn}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-purple-400" />
                      {spotlightInsight.publishDate}
                    </span>
                  </div>

                  <h3
                    onClick={() => setActiveModalInsight(spotlightInsight)}
                    className="text-2xl sm:text-3xl font-black text-white hover:text-purple-300 transition-colors cursor-pointer leading-snug"
                  >
                    {isAr ? spotlightInsight.titleAr : spotlightInsight.titleEn}
                  </h3>

                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-3">
                    {isAr ? spotlightInsight.excerptAr : spotlightInsight.excerptEn}
                  </p>

                  {/* Author Strip */}
                  <div className="flex items-center justify-between pt-2 border-t border-purple-900/30">
                    <div className="flex items-center gap-3">
                      <img
                        src={spotlightInsight.author.avatar}
                        alt={isAr ? spotlightInsight.author.nameAr : spotlightInsight.author.nameEn}
                        width={40}
                        height={40}
                        loading="lazy"
                        decoding="async"
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-xl object-cover border border-purple-500/30"
                      />
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-white">
                          {isAr ? spotlightInsight.author.nameAr : spotlightInsight.author.nameEn}
                        </div>
                        <div className="text-[11px] text-purple-300/80">
                          {isAr ? spotlightInsight.author.roleAr : spotlightInsight.author.roleEn}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setActiveModalInsight(spotlightInsight)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-700 to-[#8A2BE2] hover:from-purple-600 hover:to-purple-500 text-white text-xs sm:text-sm font-bold shadow-[0_0_15px_rgba(138,43,226,0.4)] transition-all flex items-center gap-2 group"
                    >
                      <span>{isAr ? 'قراءة التحليل الكامل' : 'Read Full Study'}</span>
                      {dir === 'rtl' ? (
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      ) : (
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filter Controls: Search, Categories & Bookmarks */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="w-full md:w-auto flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {INSIGHT_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id && !showOnlyBookmarked;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setShowOnlyBookmarked(false);
                  }}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-700 to-[#8A2BE2] text-white shadow-[0_0_20px_rgba(138,43,226,0.35)] border border-purple-400/50'
                      : 'bg-white/[0.03] hover:bg-white/[0.06] text-slate-400 hover:text-slate-200 border border-white/[0.08]'
                  }`}
                >
                  {isAr ? cat.labelAr : cat.labelEn}
                </button>
              );
            })}

            {/* Saved Bookmarks Filter Tab */}
            <button
              onClick={() => setShowOnlyBookmarked(!showOnlyBookmarked)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                showOnlyBookmarked
                  ? 'bg-purple-600 text-white shadow-[0_0_20px_rgba(138,43,226,0.5)] border border-purple-400'
                  : 'bg-white/[0.03] hover:bg-white/[0.06] text-slate-400 hover:text-slate-200 border border-white/[0.08]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isAr ? 'المحفوظات' : 'Saved'}</span>
              {bookmarkedIds.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-cyan-400 text-black text-[10px] font-bold flex items-center justify-center">
                  {bookmarkedIds.length}
                </span>
              )}
            </button>
          </div>

          {/* Search Bar & Refresh Trigger */}
          <div className="w-full md:w-auto flex items-center gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className={`absolute top-1/2 -translate-y-1/2 ${dir === 'rtl' ? 'right-3' : 'left-3'} w-4 h-4 text-slate-400`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? 'ابحث عن موضوع أو خوارزمية...' : 'Search insights, CAPI, CRO...'}
                className={`w-full ${dir === 'rtl' ? 'pr-9 pl-4' : 'pl-9 pr-4'} py-2 rounded-xl bg-white/[0.04] border border-purple-500/20 text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-purple-400/80 transition-colors`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute top-1/2 -translate-y-1/2 ${dir === 'rtl' ? 'left-3' : 'right-3'} text-xs text-slate-400 hover:text-white`}
                >
                  ✕
                </button>
              )}
            </div>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              title={isAr ? 'تحديث الاتجاهات' : 'Refresh Insights'}
              aria-label="Refresh Insights"
              className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-400 hover:text-white transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Dynamic Content Grid with Skeleton Loader */}
        {isLoading ? (
          /* Cards Skeleton Loading State */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="rounded-3xl border border-white/[0.06] bg-[#070514]/70 p-5 space-y-4 overflow-hidden"
              >
                {/* Media Shimmer */}
                <div className="aspect-[16/10] rounded-2xl bg-purple-950/40 border border-purple-900/20" />
                {/* Tag & Time */}
                <div className="flex items-center justify-between">
                  <div className="h-4 w-20 rounded-full bg-purple-900/30" />
                  <div className="h-3 w-16 rounded-full bg-white/[0.04]" />
                </div>
                {/* Title */}
                <div className="h-5 w-full rounded-md bg-white/[0.07]" />
                <div className="h-5 w-3/4 rounded-md bg-white/[0.07]" />
                {/* Excerpt */}
                <div className="h-3 w-full rounded bg-white/[0.03]" />
                <div className="h-3 w-4/5 rounded bg-white/[0.03]" />
                {/* Footer Strip */}
                <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.05]" />
                    <div className="h-3 w-20 rounded bg-white/[0.05]" />
                  </div>
                  <div className="h-8 w-24 rounded-xl bg-purple-900/30" />
                </div>
              </div>
            ))}
          </div>
        ) : displayedInsights.length === 0 ? (
          /* Empty State */
          <div className="py-16 text-center max-w-md mx-auto p-8 rounded-3xl bg-[#0a0518]/60 border border-purple-500/20">
            <BookOpen className="w-12 h-12 text-purple-400/50 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-white mb-2">
              {isAr ? 'لم يتم العثور على تحليلات مطابقة' : 'No matching insights found'}
            </h4>
            <p className="text-xs text-slate-400 mb-5">
              {isAr
                ? 'جرب البحث بكلمات أخرى أو اختر فئة مختلفة لمتابعة أحدث التقارير.'
                : 'Try adjusting your search criteria or explore other categories.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setShowOnlyBookmarked(false);
              }}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all"
            >
              {isAr ? 'إعادة ضبط الفلاتر' : 'Reset All Filters'}
            </button>
          </div>
        ) : (
          /* Real Insights Cards Grid */
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {displayedInsights.map((insight) => {
                const title = isAr ? insight.titleAr : insight.titleEn;
                const excerpt = isAr ? insight.excerptAr : insight.excerptEn;
                const authorName = isAr ? insight.author.nameAr : insight.author.nameEn;
                const statLabel = isAr ? insight.statsHighlight.labelAr : insight.statsHighlight.labelEn;
                const readTime = isAr ? insight.readTime : insight.readTimeEn;
                const isBookmarked = bookmarkedIds.includes(insight.id);
                const hasLiked = likedIds.includes(insight.id);
                const likes = likeCounts[insight.id] || insight.likesCount;
                const isCopied = shareToastId === insight.id;

                return (
                  <motion.article
                    layout
                    key={insight.id}
                    initial={{ opacity: 0, scale: 0.92, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="group relative rounded-3xl bg-[#080415]/90 border border-purple-500/20 hover:border-purple-400/60 p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_0_35px_rgba(138,43,226,0.3)] hover:-translate-y-1.5 overflow-hidden"
                  >
                    <div>
                      {/* Media Container with Badges */}
                      <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden mb-4 border border-purple-900/30">
                        <BlurUpImage
                          src={insight.coverImage}
                          alt={title}
                          className="w-full h-full"
                          imgClassName="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#070414] via-transparent to-transparent opacity-80 pointer-events-none z-10" />

                        {/* Category Tag Pill */}
                        <div className={`absolute top-3 ${dir === 'rtl' ? 'right-3' : 'left-3'} px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-purple-500/30 text-[10px] font-mono font-bold text-purple-300`}>
                          {insight.tag}
                        </div>

                        {/* Interactive Micro Actions (Like & Bookmark) */}
                        <div className={`absolute top-3 ${dir === 'rtl' ? 'left-3' : 'right-3'} flex items-center gap-1.5`}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleBookmark(insight.id);
                            }}
                            className={`p-1.5 rounded-full backdrop-blur-md transition-all ${
                              isBookmarked
                                ? 'bg-[#8A2BE2] text-white shadow-md'
                                : 'bg-black/60 text-slate-300 hover:text-white hover:bg-black/80'
                            }`}
                            aria-label="Bookmark this article"
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShare(insight);
                            }}
                            className="p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-slate-300 hover:text-white backdrop-blur-md transition-colors relative"
                            aria-label="Share article"
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Share2 className="w-3.5 h-3.5" />
                            )}
                            {isCopied && (
                              <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded bg-purple-900 text-[10px] text-white shadow">
                                {isAr ? 'تم النسخ' : 'Copied'}
                              </span>
                            )}
                          </button>
                        </div>

                        {/* Metric Highlight Floating Pill */}
                        <div className={`absolute bottom-3 ${dir === 'rtl' ? 'right-3' : 'left-3'} px-3 py-1 rounded-xl bg-purple-950/90 border border-purple-500/40 backdrop-blur-md flex items-center gap-2`}>
                          <span className="text-sm font-mono font-black text-cyan-300">
                            {insight.statsHighlight.value}
                          </span>
                          <span className="text-[10px] text-slate-300 font-medium">
                            {statLabel}
                          </span>
                        </div>
                      </div>

                      {/* Meta Information Bar */}
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          {readTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-purple-400" />
                          {insight.publishDate}
                        </span>
                      </div>

                      {/* Article Title */}
                      <h4
                        onClick={() => setActiveModalInsight(insight)}
                        className="text-base sm:text-lg font-bold text-white hover:text-purple-300 transition-colors cursor-pointer leading-snug mb-2 line-clamp-2"
                      >
                        {title}
                      </h4>

                      {/* Excerpt */}
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4 line-clamp-3">
                        {excerpt}
                      </p>
                    </div>

                    {/* Bottom Author & Engagement Bar */}
                    <div className="pt-3 border-t border-purple-900/25 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={insight.author.avatar}
                          alt={authorName}
                          width={32}
                          height={32}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-lg object-cover border border-purple-500/30"
                        />
                        <div className="text-[11px]">
                          <div className="font-bold text-slate-200 leading-none">{authorName}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Claps / Likes Button */}
                        <button
                          onClick={() => handleToggleLike(insight.id)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-all ${
                            hasLiked
                              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                              : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
                          }`}
                          aria-label="Like article"
                        >
                          <Heart className={`w-3 h-3 ${hasLiked ? 'fill-red-400 text-red-400' : ''}`} />
                          <span className="text-[11px] font-mono">{likes}</span>
                        </button>

                        {/* Read Link */}
                        <button
                          onClick={() => setActiveModalInsight(insight)}
                          className="p-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/30 transition-all flex items-center gap-1 text-xs font-semibold"
                          aria-label="Read full article"
                        >
                          {dir === 'rtl' ? (
                            <ArrowLeft className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowRight className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Bottom Consultation Link Banner */}
        <div className="mt-16 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/60 via-[#14062a] to-[#0a051a] border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_40px_rgba(138,43,226,0.18)]">
          <div className="space-y-1 text-center md:text-start">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 font-bold tracking-wider uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAr ? 'تطبيق عملي لا نظري' : 'EXECUTION OVER THEORY'}</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-white">
              {isAr
                ? 'هل تريد تدقيقاً شاملاً لخطة حملاتك ومتجرك على يد خبرائنا؟'
                : 'Need a customized audit based on these market trends?'}
            </h4>
            <p className="text-xs sm:text-sm text-slate-400">
              {isAr
                ? 'نحلل ميزانيتك الإعلانية، ونقاط التسريب في المتجر، ونقدم لك خطة نمو تفصيلية مجاناً.'
                : 'We dissect your ad metrics, detect CAPI leakage points, and deliver a tailored growth roadmap.'}
            </p>
          </div>

          {onOpenConsultation && (
            <LiquidGlassButton
              onClick={() => onOpenConsultation('Digital Insights & Market Intelligence')}
              variant="primary"
              size="md"
              className="shrink-0 whitespace-nowrap"
            >
              <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              <span>{isAr ? 'طلب جلسة فحص استراتيجي' : 'Request Strategy Audit'}</span>
            </LiquidGlassButton>
          )}
        </div>
      </div>

      {/* Full Article Modal */}
      <InsightDetailModal
        insight={activeModalInsight}
        onClose={() => setActiveModalInsight(null)}
        onOpenConsultation={onOpenConsultation}
        isBookmarked={activeModalInsight ? bookmarkedIds.includes(activeModalInsight.id) : false}
        onToggleBookmark={handleToggleBookmark}
        likes={activeModalInsight ? (likeCounts[activeModalInsight.id] || activeModalInsight.likesCount) : 0}
        hasLiked={activeModalInsight ? likedIds.includes(activeModalInsight.id) : false}
        onToggleLike={handleToggleLike}
      />
    </section>
  );
});

DigitalInsightsSection.displayName = 'DigitalInsightsSection';

