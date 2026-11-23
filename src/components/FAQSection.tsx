import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { FAQ_ITEMS, FAQItem } from '../data/faqData';
import { MagneticButton } from './MagneticButton';
import { injectJsonLdScript, removeJsonLdScript } from '../utils/seoStructuredData';
import {
  HelpCircle,
  ChevronDown,
  Search,
  X,
  Sparkles,
  MessageCircle,
  ArrowUpRight,
  Plus,
  Minus,
  CheckCircle2,
} from 'lucide-react';

interface FAQSectionProps {
  onOpenConsultation: () => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ onOpenConsultation }) => {
  const { lang, t, isAr, dir } = useLanguage();
  const [openIds, setOpenIds] = useState<string[]>(['faq-1']); // First question opened by default
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: t('faq.categoryAll') || (isAr ? 'جميع الأسئلة' : 'All Questions') },
    { id: 'general', label: t('faq.categoryGeneral') || (isAr ? 'عام والمنظومة' : 'General & System') },
    { id: 'budgets', label: t('faq.categoryBudgets') || (isAr ? 'الميزانيات والعائد' : 'Budgets & ROAS') },
    { id: 'timeline', label: t('faq.categoryTimeline') || (isAr ? 'المدة والتسليم' : 'Timeline & Delivery') },
    { id: 'support', label: t('faq.categorySupport') || (isAr ? 'الدعم والتقارير' : 'Support & Reporting') },
  ];

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleExpandAll = () => {
    if (openIds.length === filteredFaqs.length) {
      setOpenIds([]);
    } else {
      setOpenIds(filteredFaqs.map((f) => f.id));
    }
  };

  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const questionText = (
        isAr ? item.question.ar : item.question.en
      ).toLowerCase();
      const answerText = (
        isAr ? item.answer.ar : item.answer.en
      ).toLowerCase();
      const tags = item.tags ? item.tags.join(' ').toLowerCase() : '';

      return (
        questionText.includes(q) ||
        answerText.includes(q) ||
        tags.includes(q)
      );
    });
  }, [selectedCategory, searchQuery, isAr]);

  const getCategoryName = (cat: FAQItem['category']) => {
    switch (cat) {
      case 'general':
        return t('faq.categoryGeneral') || (isAr ? 'عام والمنظومة' : 'General & System');
      case 'budgets':
        return t('faq.categoryBudgets') || (isAr ? 'الميزانيات والعائد' : 'Budgets & ROAS');
      case 'timeline':
        return t('faq.categoryTimeline') || (isAr ? 'المدة والتسليم' : 'Timeline & Delivery');
      case 'support':
        return t('faq.categorySupport') || (isAr ? 'الدعم والتقارير' : 'Support & Reporting');
      default:
        return isAr ? 'عام' : 'General';
    }
  };

  // Structured JSON-LD Data for each FAQ item conforming to Google Search Central Schema
  const faqJsonLd = useMemo(() => {
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://pulseocto.com';
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${siteUrl}/#faq-schema`,
      name: isAr ? 'الأسئلة الشائعة - Pulse OCTO' : 'Pulse OCTO Frequently Asked Questions',
      description: isAr
        ? 'إجابات شاملة حول منظومة الأذرع الثمانية، الميزانيات الإعلانية، وتطوير المتاجر الإلكترونية.'
        : 'Comprehensive answers regarding the 8-arm digital marketing system, ad budgets, and e-commerce growth.',
      mainEntity: FAQ_ITEMS.map((item) => ({
        '@type': 'Question',
        name: isAr ? item.question.ar : item.question.en,
        acceptedAnswer: {
          '@type': 'Answer',
          text: isAr ? item.answer.ar : item.answer.en,
        },
      })),
    };
  }, [isAr]);

  // Inject structured data into document.head for rich snippet indexing
  useEffect(() => {
    const scriptId = 'pulseocto-faq-page-jsonld';
    injectJsonLdScript(scriptId, faqJsonLd);
    return () => {
      removeJsonLdScript(scriptId);
    };
  }, [faqJsonLd]);

  return (
    <section
      id="faq"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#030308]/90 text-white overflow-hidden select-none"
    >
      {/* Embedded Schema.org JSON-LD structured data for search engine crawlers */}
      <script
        id="faq-inline-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Background ambient lighting */}
      <div className="absolute top-1/3 -right-24 w-[500px] h-[500px] bg-[#8A2BE2]/12 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-[450px] h-[450px] bg-purple-950/25 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4 leading-tight">
            {t('faq.title') || (isAr ? 'إجابات واضحة لكل ما يشغل بالك' : 'Clear Answers to Every Question')}
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            {t('faq.subtitle') || (isAr
              ? 'كل ما تحتاج معرفته عن نماذج العمل، الميزانيات، الضمانات، وتكامل الأذرع الثمانية مع مبيعاتك.'
              : 'Everything you need to know about our workflows, budgets, guarantees, and the 8-Arm synergy.')}
          </p>
        </motion.div>

        {/* Filter Controls & Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 space-y-4"
        >
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="relative flex items-center">
              <Search
                className={`absolute ${
                  isAr ? 'right-4' : 'left-4'
                } w-4 h-4 text-purple-400 pointer-events-none`}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('faq.searchPlaceholder') || (isAr ? 'ابحث في الأسئلة الشائعة (ميزانية، أذرع، ROAS، مدة)...' : 'Search FAQ (budget, arms, ROAS, timeline)...')}
                className={`w-full ${
                  isAr ? 'pr-11 pl-10' : 'pl-11 pr-10'
                } py-3.5 rounded-2xl bg-[#090915] border border-purple-900/40 focus:border-[#8A2BE2] focus:outline-none focus:ring-2 focus:ring-[#8A2BE2]/30 text-white placeholder-slate-500 text-sm shadow-[0_8px_25px_rgba(0,0,0,0.6)] transition-all`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute ${
                    isAr ? 'left-3.5' : 'right-3.5'
                  } p-1 rounded-full text-slate-400 hover:text-white hover:bg-purple-950/60 transition-colors`}
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs & Expand/Collapse Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => {
                const isActive = selectedCategory === cat.id;
                const count =
                  cat.id === 'all'
                    ? FAQ_ITEMS.length
                    : FAQ_ITEMS.filter((i) => i.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#8A2BE2] text-white shadow-[0_0_15px_rgba(138,43,226,0.5)] scale-105'
                        : 'bg-[#0a0a16] text-slate-400 hover:text-white border border-purple-900/30 hover:border-purple-700/50'
                    }`}
                    data-cursor="pointer"
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? 'bg-purple-900/80 text-purple-200'
                          : 'bg-purple-950/40 text-purple-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {filteredFaqs.length > 0 && (
              <button
                onClick={handleExpandAll}
                className="text-xs font-bold text-[#c084fc] hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-950/30 hover:bg-purple-900/40 border border-purple-900/30"
                data-cursor="pointer"
              >
                {openIds.length === filteredFaqs.length ? (
                  <>
                    <Minus className="w-3.5 h-3.5" />
                    <span>{isAr ? 'طي الكل' : 'Collapse All'}</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAr ? 'فتح الكل' : 'Expand All'}</span>
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>

        {/* Dynamic Accordion List */}
        <div id="faq-accordion" role="region" aria-label="FAQ Accordion" className="space-y-3 sm:space-y-4">
          {filteredFaqs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 px-4 rounded-2xl bg-[#070714] border border-purple-900/30"
            >
              <HelpCircle className="w-10 h-10 text-purple-400/60 mx-auto mb-3" />
              <p className="text-slate-300 text-sm font-medium mb-4">
                {t('faq.notFound') || (isAr ? 'لم نعثر على نتائج مطابقة للبحث' : 'No matching questions found')}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 rounded-xl bg-[#8A2BE2] hover:bg-[#7b22cc] text-white text-xs font-bold transition-all shadow-[0_0_20px_rgba(138,43,226,0.4)]"
                data-cursor="pointer"
              >
                {isAr ? 'إعادة ضبط البحث' : 'Reset Filters'}
              </button>
            </motion.div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isOpen = openIds.includes(faq.id);
              const question = isAr ? faq.question.ar : faq.question.en;
              const answer = isAr ? faq.answer.ar : faq.answer.en;
              const categoryLabel = getCategoryName(faq.category);
              const itemNumber = (index + 1).toString().padStart(2, '0');

              return (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.45,
                    delay: Math.min(index * 0.05, 0.3),
                  }}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'bg-[#090918] border-[#8A2BE2] shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_25px_rgba(138,43,226,0.25)]'
                      : 'bg-[#060611] border-purple-900/30 hover:border-purple-700/60 shadow-[0_4px_20px_rgba(0,0,0,0.6)]'
                  }`}
                >
                  {/* Question Header (Trigger) */}
                  <button
                    type="button"
                    onClick={() => toggleAccordion(faq.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${faq.id}`}
                    className={`w-full py-4 sm:py-5 px-4 sm:px-6 flex items-center justify-between gap-4 text-left transition-colors duration-200 cursor-pointer ${
                      isAr ? 'text-right' : 'text-left'
                    }`}
                    data-cursor="pointer"
                  >
                    <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 flex-grow">
                      {/* Numeric Badge */}
                      <span
                        className={`shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-['Orbitron',sans-serif] text-xs font-black transition-colors ${
                          isOpen
                            ? 'bg-[#8A2BE2] text-white shadow-[0_0_15px_rgba(138,43,226,0.6)]'
                            : 'bg-purple-950/40 text-purple-400 border border-purple-900/40'
                        }`}
                        dir="ltr"
                      >
                        {itemNumber}
                      </span>

                      {/* Question Text & Category Tag */}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] sm:text-[11px] font-bold text-[#c084fc] px-2 py-0.5 rounded-full bg-purple-950/60 border border-purple-900/30">
                            {categoryLabel}
                          </span>
                        </div>
                        <h3
                          className={`text-sm sm:text-base md:text-lg font-black transition-colors ${
                            isOpen
                              ? 'text-white'
                              : 'text-slate-200 hover:text-white'
                          }`}
                        >
                          {question}
                        </h3>
                      </div>
                    </div>

                    {/* Expand/Collapse Chevron */}
                    <div
                      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${
                        isOpen
                          ? 'bg-[#8A2BE2] text-white border-white/30 rotate-180 shadow-[0_0_15px_rgba(138,43,226,0.5)]'
                          : 'bg-[#0d0d20] text-purple-400 border-purple-900/40 hover:text-white'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4 transition-transform duration-300" />
                    </div>
                  </button>

                  {/* Accordion Answer Content */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-${faq.id}`}
                        key={`content-${faq.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: 'auto',
                          opacity: 1,
                          transition: {
                            height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                            opacity: { duration: 0.25, delay: 0.05 },
                          },
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                          transition: {
                            height: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
                            opacity: { duration: 0.15 },
                          },
                        }}
                        className="overflow-hidden border-t border-purple-900/30"
                      >
                        <div className="p-4 sm:p-6 bg-[#04040c]/80 text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
                          <p className="whitespace-pre-line">{answer}</p>

                          {/* Tags row */}
                          {faq.tags && faq.tags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {faq.tags.map((tag, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="text-[10px] px-2 py-0.5 rounded-md bg-purple-950/40 text-purple-300 border border-purple-900/30 font-mono"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Interactive Footer inside the opened answer */}
                          <div className="mt-4 pt-3 border-t border-purple-950/60 flex flex-wrap items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-1.5 text-purple-400 font-bold">
                              <Sparkles className="w-3.5 h-3.5 text-[#8A2BE2]" />
                              <span>Pulse OCTO Guarantee</span>
                            </div>

                            <button
                              type="button"
                              onClick={onOpenConsultation}
                              className="inline-flex items-center gap-1.5 text-[#c084fc] hover:text-white transition-colors font-bold group cursor-pointer"
                              data-cursor="pointer"
                            >
                              <span>
                                {isAr
                                  ? 'طلب مناقشة تفصيلية لهذه النقطة'
                                  : 'Discuss this with our team'}
                              </span>
                              <ArrowUpRight className="w-3.5 h-3.5 text-[#8A2BE2] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Bottom CTA Banner: Still have questions? */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-14 sm:mt-18 p-6 sm:p-8 rounded-[28px] bg-gradient-to-r from-[#120625] via-[#090918] to-[#04040a] border border-[#8A2BE2]/40 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(138,43,226,0.2)] flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-right"
        >
          <div className="space-y-2 max-w-xl">
            <span className="inline-block px-3 py-1 rounded-full bg-[#8A2BE2]/20 border border-[#8A2BE2]/40 text-xs font-bold text-[#c084fc]">
              {t('faq.ctaBadge') || (isAr ? 'استشارة استراتيجية فورية' : 'Instant Strategic Consultation')}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {t('faq.ctaTitle') || (isAr ? 'هل لديك سؤال غير مدرج هنا؟' : 'Have a Question Not Listed Here?')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t('faq.ctaDesc') || (isAr
                ? 'فريقنا الاستشاري متواجد للرد على استفسارك ومناقشة تفاصيل مشروعك مباشرة خلال دقائق عبر واتساب.'
                : 'Our strategy team is ready to answer your questions and discuss your project directly via WhatsApp.')}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <MagneticButton strength={14}>
              <a
                href="https://wa.me/201116066968?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D9%84%D8%AF%D9%8A%20%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%AD%D9%88%D9%84%20%D8%AE%D8%AF%D9%85%D8%A7%D8%AA%20Pulse%20OCTO"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all hover:scale-105 active:scale-95"
                data-cursor="pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{t('faq.chatWhatsApp') || (isAr ? 'تواصل عبر واتساب ⚡' : 'Chat via WhatsApp ⚡')}</span>
              </a>
            </MagneticButton>

            <MagneticButton strength={14}>
              <a
                href="mailto:CEO@pulseOCTO.com"
                className="px-5 py-3 rounded-full bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-400/50 text-cyan-200 hover:text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all hover:scale-105 active:scale-95"
                data-cursor="pointer"
              >
                <span>CEO@pulseOCTO.com</span>
              </a>
            </MagneticButton>

            <MagneticButton strength={14}>
              <button
                type="button"
                onClick={onOpenConsultation}
                className="px-5 py-3 rounded-full bg-[#8A2BE2] hover:bg-[#7822cc] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(138,43,226,0.4)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
                data-cursor="pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t('faq.bookConsultation') || (isAr ? 'حجز جلسة استشارية' : 'Book Strategic Audit')}</span>
              </button>
            </MagneticButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
