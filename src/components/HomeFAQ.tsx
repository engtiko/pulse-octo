import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { ScrollHeaderReveal } from './ScrollReveal';
import { HOME_FAQ_SCHEMA_ITEMS } from '../data/faqData';
import {
  generateFAQPageSchema,
  injectJsonLdScript,
  SCRIPT_ID_FAQ_PAGE,
} from '../utils/seoStructuredData';
import {
  ChevronDown,
  Copy,
  Check,
} from 'lucide-react';

interface HomeFAQProps {
  onOpenConsultation?: () => void;
}

interface ParsedSchemaFAQ {
  id: string;
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
  category: string;
}

// Authentic WhatsApp icon SVG helper
const WhatsAppMiniIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413z" />
  </svg>
);

export const HomeFAQ: React.FC<HomeFAQProps> = () => {
  const { isAr } = useLanguage();
  const [openIds, setOpenIds] = useState<string[]>(['faq-schema-1']); // First accordion open by default
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Single source of truth shared between the rendered FAQ section and the FAQPage JSON-LD schema
  const schemaFaqs = useMemo<ParsedSchemaFAQ[]>(
    () =>
      HOME_FAQ_SCHEMA_ITEMS.map((item) => ({
        id: item.id,
        questionAr: item.question.ar,
        questionEn: item.question.en,
        answerAr: item.answer.ar,
        answerEn: item.answer.en,
        category: isAr ? item.categoryLabel.ar : item.categoryLabel.en,
      })),
    [isAr]
  );

  // Dynamically synchronize the <head> FAQPage JSON-LD script with the exact displayed Q&As
  useEffect(() => {
    const faqSchema = generateFAQPageSchema({
      lang: isAr ? 'ar' : 'en',
      customFaqs: HOME_FAQ_SCHEMA_ITEMS,
    });
    injectJsonLdScript(SCRIPT_ID_FAQ_PAGE, faqSchema);
  }, [isAr]);

  const toggleAccordion = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCopyAnswer = (faq: ParsedSchemaFAQ, e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = `${isAr ? faq.questionAr : faq.questionEn}\n\n${isAr ? faq.answerAr : faq.answerEn}\n\n- Pulse OCTO (pulseocto.com)`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedId(faq.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <section
      id="faq"
      itemScope
      itemType="https://schema.org/FAQPage"
      className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#06050a] text-white overflow-hidden select-none scroll-mt-20"
      aria-label={isAr ? 'قسم الأسئلة الشائعة وهيكلة البيانات' : 'FAQ and Schema.org Structured Data Section'}
    >
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <ScrollHeaderReveal className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3 leading-tight">
            {isAr ? (
              <>
                إجابات صريحة عن <span className="text-purple-300">منظومة الأذرع</span>
              </>
            ) : (
              <>
                Direct Answers About the <span className="text-purple-300">8-Arm System</span>
              </>
            )}
          </h2>

          <p className="text-zinc-400 text-xs sm:text-sm md:text-base leading-relaxed">
            {isAr
              ? 'كل ما يهمك معرفته حول آلية التعاقد، الميزانيات، وضمان تحقيق العائد الحقيقي على الاستثمار الرقمي.'
              : 'Everything you need to know about our operational model, advertising budgets, and performance benchmarks.'}
          </p>
        </ScrollHeaderReveal>

        {/* Semantic Definition List for Maximum Crawlability and Accessibility */}
        <dl className="space-y-3">
          {schemaFaqs.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            const questionText = isAr ? faq.questionAr : faq.questionEn;
            const answerText = isAr ? faq.answerAr : faq.answerEn;

            const encodedWaQuestion = encodeURIComponent(
              isAr
                ? `مرحباً فريق Pulse OCTO،\nلدي استفسار بخصوص هذا السؤال من موقعكم:\n"${faq.questionAr}"`
                : `Hello Pulse OCTO Team,\nI have an inquiry regarding this question from your website:\n"${faq.questionEn}"`
            );
            const waQuestionUrl = `https://wa.me/201116066968?text=${encodedWaQuestion}`;

            return (
              <div
                key={faq.id}
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
                className={`relative rounded-2xl transition-colors duration-300 border overflow-hidden ${
                  isOpen
                    ? 'bg-[#0e0b18] border-purple-500/40'
                    : 'bg-[#09080f] border-white/10 hover:border-purple-500/30'
                }`}
              >
                <dt>
                  <button
                    type="button"
                    onClick={() => toggleAccordion(faq.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${faq.id}`}
                    id={`faq-btn-${faq.id}`}
                    className="w-full text-start p-4 sm:p-5 flex items-center justify-between gap-3 sm:gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-2xl select-none"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 flex-1">
                      <span
                        itemProp="name"
                        className={`text-sm sm:text-base font-bold transition-colors leading-snug ${isOpen ? 'text-white' : 'text-zinc-100'}`}
                      >
                        {questionText}
                      </span>
                    </div>

                    {/* Expand/Collapse Chevron Indicator */}
                    <div
                      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${
                        isOpen
                          ? 'bg-[#7c3aed] border-purple-400/50 text-white rotate-180'
                          : 'bg-[#06050a] border-white/10 text-zinc-400'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4 transition-transform duration-300" />
                    </div>
                  </button>
                </dt>

                {/* Collapsible Answer Region */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.dd
                      id={`faq-answer-${faq.id}`}
                      role="region"
                      aria-labelledby={`faq-btn-${faq.id}`}
                      itemScope
                      itemProp="acceptedAnswer"
                      itemType="https://schema.org/Answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-white/10">
                        {/* Answer text */}
                        <p itemProp="text" className="text-xs sm:text-sm text-zinc-300 leading-relaxed pt-3">
                          {answerText}
                        </p>

                        {/* Interactive Action Footnote */}
                        <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-xs">
                          {/* Ask via WhatsApp context button */}
                          <a
                            href={waQuestionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-200 font-semibold transition-colors"
                            title={isAr ? 'استفسر عن هذه النقطة عبر واتساب' : 'Inquire about this on WhatsApp'}
                          >
                            <WhatsAppMiniIcon className="w-3.5 h-3.5 text-purple-300" />
                            <span>{isAr ? 'استفسار مباشر حول هذا السؤال' : 'Ask on WhatsApp'}</span>
                          </a>

                          {/* Copy answer button */}
                          <button
                            type="button"
                            onClick={(e) => handleCopyAnswer(faq, e)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-zinc-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] transition-colors cursor-pointer"
                            title={isAr ? 'نسخ الإجابة' : 'Copy answer'}
                          >
                            {copiedId === faq.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-purple-300" />
                                <span className="text-purple-300 font-bold">{isAr ? 'تم النسخ' : 'Copied'}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>{isAr ? 'نسخ الإجابة' : 'Copy'}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.dd>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
};
