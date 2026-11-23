import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { ScrollHeaderReveal } from './ScrollReveal';
import { FAQ_ITEMS } from '../data/faqData';
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

  // Extract and synchronize data with index.html FAQPage JSON-LD schema
  const schemaFaqs = useMemo<ParsedSchemaFAQ[]>(() => {
    const fallbackList: ParsedSchemaFAQ[] = [
      {
        id: 'faq-schema-1',
        questionAr: 'كيف تختلف وكالة Pulse OCTO ومنظومة الأذرع الثمانية عن الوكالات التقليدية؟',
        questionEn: "How does Pulse OCTO's 8-arm ecosystem differ from traditional digital agencies?",
        answerAr: 'نوظف منظومة الأذرع الثمانية المتزامنة لتغطية الإعلانات المدفوعة، الهويات البصرية، المتاجر الإلكترونية، والمحتوى دون وسطاء وتحت سقف استراتيجي واحد لتعظيم العائد وبناء أصول رقمية مستدامة.',
        answerEn: 'Pulse OCTO eliminates departmental silos and middlemen through our synchronized 8-Arm ecosystem (Paid Media, Brand Identity, High-Converting Stores, Studio Production, SEO, and Custom Growth Blueprints) under one strategic roof.',
        category: isAr ? 'المنظومة والاستراتيجية' : 'System & Strategy',
      },
      {
        id: 'faq-schema-2',
        questionAr: 'ما هي الميزانية الإعلانية المناسبة للبدء في الحملات الممولة؟',
        questionEn: 'What advertising budget is recommended to launch high-converting paid campaigns?',
        answerAr: 'نبدأ بدراسة هوية علامتك وحجم السوق المستهدف ومعدل التحويل المتوقع بميزانية اختبارية لاكتشاف أفضل الزوايا الإعلانية ثم مضاعفة الحملات الرابحة بشكل مدروس.',
        answerEn: 'We tailor advertising spend to your sector, market maturity, and target unit economics rather than imposing rigid quotas. We start with a focused test budget to validate winning creative angles, then systematically scale winning ad campaigns.',
        category: isAr ? 'الميزانيات والعائد' : 'Budgets & ROAS',
      },
      {
        id: 'faq-schema-3',
        questionAr: 'أين يقع مقر وكالة Pulse OCTO وهل تقدمون خدمات خارج مصر؟',
        questionEn: 'Where is Pulse OCTO located and do you provide services outside Egypt?',
        answerAr: 'يقع مقرنا الرئيسي في مدينة بنها بمحافظة القليوبية، مصر، وندير علامات تجارية ومتاجر إلكترونية ناجحة في السعودية، الإمارات، الكويت، قطر، والأسواق العالمية.',
        answerEn: 'Our headquarters is located in Banha City, Qalyubia, Egypt, while our arms actively scale successful e-commerce brands and advertising campaigns across Saudi Arabia, UAE, Kuwait, Qatar, and international markets.',
        category: isAr ? 'النطاق الجغرافي' : 'Territory & Presence',
      },
      {
        id: 'faq-schema-4',
        questionAr: 'كم يستغرق وقت إطلاق وتطوير متجر إلكتروني احترافي أو بناء هوية بصرية؟',
        questionEn: 'What is the turnaround timeline for an e-commerce store or brand identity?',
        answerAr: 'بفضل منهجية العمل المتزامنة: الهويات البصرية تستغرق بين 7 إلى 14 يوم عمل، بينما المتاجر الإلكترونية السريعة تكتمل خلال 10 إلى 21 يوماً شاملة بوابات الدفع والشحن والبكسلات التحليلية.',
        answerEn: 'Through our synchronized workflow: Brand identities take 7 to 14 business days, while conversion-ready e-commerce platforms deploy within 10 to 21 business days with integrated payment gateways, shipping APIs, and tracking analytics.',
        category: isAr ? 'المدة والتسليم' : 'Timeline & Delivery',
      },
      {
        id: 'faq-schema-5',
        questionAr: 'هل يمكنني طلب ذراع واحدة محددة (مثل إدارة الإعلانات فقط) أم يشترط باقة كاملة؟',
        questionEn: 'Can I hire a single specialized arm or is a full package required?',
        answerAr: 'نعم بالتأكيد. صممنا منظومة "الأذرع الثمانية" بنظام معياري مرن (Modular). يمكنك البدء بذراع واحدة وتفعيل باقي الأذرع تدريجياً مع نمو مبيعاتك وتوسع علامتك التجارية.',
        answerEn: 'Absolutely. Our 8-arm ecosystem is modular. You can engage a single arm (such as Meta/Google ad scaling or store optimization) and dynamically activate additional arms as your revenue grows.',
        category: isAr ? 'مرونة التعاقد' : 'Modular Retainers',
      },
      {
        id: 'faq-schema-6',
        questionAr: 'كيف تضمنون تحقيق مبيعات حقيقية وعائد استثماري وليس مجرد مشاهدات؟',
        questionEn: 'How do you safeguard genuine sales conversions rather than hollow engagement?',
        answerAr: 'نعتمد استراتيجية Conversion-First: نقوم بربط لوحات تتبع دقيقة (Google Analytics 4, Meta Conversions API CAPI) مع تحسين سرعة صفحات الهبوط واختبار زوايا إعلانية متجددة باستمرار لمنع تسرب العملاء.',
        answerEn: 'We implement a strict Conversion-First architecture with server-side tracking (Meta CAPI, GA4), continuous creative hook testing, and conversion-rate optimization to maximize Average Order Value and net profit.',
        category: isAr ? 'مؤشرات الأداء' : 'Conversion & Analytics',
      }
    ];

    if (typeof document !== 'undefined') {
      const script = document.getElementById('pulseocto-jsonld-faqpage');
      if (script && script.textContent) {
        try {
          const parsed = JSON.parse(script.textContent);
          if (parsed && Array.isArray(parsed.mainEntity) && parsed.mainEntity.length > 0) {
            return parsed.mainEntity.map((entity: { name?: string; acceptedAnswer?: { text?: string } }, idx: number) => {
              const matchedFaqItem = FAQ_ITEMS.find(
                (item) => item.question.ar === entity.name || item.question.en === entity.name
              );

              return {
                id: `faq-schema-${idx + 1}`,
                questionAr: matchedFaqItem?.question.ar || entity.name || '',
                questionEn: matchedFaqItem?.question.en || entity.name || '',
                answerAr: matchedFaqItem?.answer.ar || entity.acceptedAnswer?.text || '',
                answerEn: matchedFaqItem?.answer.en || entity.acceptedAnswer?.text || '',
                category: fallbackList[idx]?.category || (isAr ? 'منظومة Pulse OCTO' : 'Pulse OCTO Core'),
              };
            });
          }
        } catch {
          // If JSON parse fails, cleanly use fallback structured list
        }
      }
    }

    return fallbackList;
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
