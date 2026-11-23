import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { LiquidGlassButton } from './LiquidGlassButton';
import { ScrollReveal } from './ScrollReveal';
import {
  Phone,
  Mail,
  User,
  CheckCircle2,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

interface HomeQuickContactProps {
  onNavigate?: (page: string) => void;
}

// Authentic WhatsApp SVG icon
const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413z" />
  </svg>
);

export const HomeQuickContact: React.FC<HomeQuickContactProps> = ({ onNavigate }) => {
  const { isAr, dir } = useLanguage();
  const toast = useToast();

  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const triggerCelebration = () => {
    const brandColors = ['#7c3aed', '#a855f7', '#ffffff'];
    import('canvas-confetti')
      .then((mod) => {
        const confetti = mod.default;
        confetti({
          particleCount: 55,
          spread: 65,
          origin: { y: 0.7 },
          colors: brandColors,
          disableForReducedMotion: true,
        });
      })
      .catch(() => {});
  };

  const getWhatsAppUrl = () => {
    const prefilledText = isAr
      ? `مرحباً فريق Pulse OCTO\n\nالاسم: ${name.trim()}\nرقم الواتساب: ${whatsapp.trim()}\n\nأود بدء نبض مشروعي والتواصل معكم لمناقشة بناء المنظومة الرقمية المتكاملة لعلامتي التجارية.`
      : `Hello Pulse OCTO Team\n\nName: ${name.trim()}\nWhatsApp: ${whatsapp.trim()}\n\nI would like to ignite my brand pulse and connect directly to explore building an integrated digital growth system.`;

    return `https://wa.me/201116066968?text=${encodeURIComponent(prefilledText)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedName = name.trim();
    const cleanPhone = whatsapp.replace(/\s+/g, '');

    if (!trimmedName) {
      setErrorMessage(isAr ? 'يرجى إدخال اسمك الكريم' : 'Please enter your name');
      return;
    }

    if (!cleanPhone || cleanPhone.length < 8) {
      setErrorMessage(
        isAr ? 'يرجى إدخال رقم واتساب صحيح للتواصل' : 'Please enter a valid WhatsApp number'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      triggerCelebration();
      setIsSubmitted(true);

      toast.success(
        isAr ? 'تم تجهيز طلب التواصل السريع بنجاح' : 'Fast Contact Request Prepared',
        isAr
          ? `أهلاً بك يا ${trimmedName}، جاري فتح محادثة الواتساب المباشرة مع خبرائنا.`
          : `Welcome ${trimmedName}, opening direct WhatsApp chat with our strategists.`
      );

      // Open WhatsApp directly
      const url = getWhatsAppUrl();
      window.open(url, '_blank');
    } catch {
      // Fallback
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReopenChat = () => {
    const url = getWhatsAppUrl();
    window.open(url, '_blank');
  };

  const handleReset = () => {
    setName('');
    setWhatsapp('');
    setIsSubmitted(false);
    setErrorMessage('');
  };

  return (
    <section
      id="quick-contact"
      className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#050308] overflow-hidden"
    >
      {/* Ambient Royal Amethyst subsurface glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[280px] rounded-full bg-[#9d65f5]/12 blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <ScrollReveal variant="fade-up" threshold={0.15}>
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
              {isAr ? (
                <>
                  ابدأ نبض مشروعك في <span className="bg-gradient-to-r from-[#e6e2f2] via-[#c9b3ff] to-[#9d65f5] bg-clip-text text-transparent">لحظات</span>
                </>
              ) : (
                <>
                  Ignite Your Brand Pulse in <span className="bg-gradient-to-r from-[#e6e2f2] via-[#c9b3ff] to-[#9d65f5] bg-clip-text text-transparent">Seconds</span>
                </>
              )}
            </h2>

            <p className="text-sm sm:text-base text-[#b8b0c8] max-w-2xl mx-auto leading-relaxed">
              {isAr
                ? 'أدخل اسمك ورقم الواتساب فقط، وسيتواصل معك فريقنا الاستراتيجي فوراً لدراسة أهداف علامتك التجارية وتفعيل المنظومة الرقمية الأنسب لك.'
                : 'Enter your name and WhatsApp number only. Our strategy team will reach out directly to audit your brand goals and activate your growth system.'}
            </p>
          </div>
        </ScrollReveal>

        {/* The Quick Contact Frosted Glass Card Container */}
        <ScrollReveal variant="fade-up" delay={0.12} threshold={0.15}>
          <div className="relative p-6 sm:p-10 md:p-12 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/[0.08] via-[#1a0f2e]/45 to-[#090612]/80 backdrop-blur-[12px] backdrop-saturate-[180%] [-webkit-backdrop-filter:blur(12px)_saturate(180%)] border border-white/[0.16] shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.22)] overflow-hidden">
            {/* Top Brushed Silver & Royal Amethyst Specular Rim */}
            <div className="absolute top-0 inset-x-10 h-px bg-gradient-to-r from-transparent via-[#c9b3ff]/65 to-transparent pointer-events-none" />

            <AnimatePresence mode="wait">
              {isSubmitted ? (
                /* Success State */
                <motion.div
                  key="quick-contact-success"
                  initial={{ opacity: 0, scale: 0.97, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center text-center py-6 sm:py-8 space-y-6"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.08] backdrop-blur-md border border-[#c9b3ff]/45 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.25)]">
                    <CheckCircle2 className="w-8 h-8 text-[#c9b3ff]" />
                  </div>

                  <div className="space-y-2 max-w-md">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-[#c9b3ff]/35 text-[#e6e2f2] text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#c9b3ff]" />
                      <span>{isAr ? 'تم استلام بياناتك بنجاح' : 'Request Received Successfully'}</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                      {isAr ? `أهلاً بك، ${name}!` : `Welcome, ${name}!`}
                    </h3>

                    <p className="text-sm text-[#e6e2f2] leading-relaxed">
                      {isAr
                        ? 'تم تجهيز محادثة الواتساب المباشرة مع مستشار Pulse OCTO. في حال لم تفتح المحادثة تلقائياً، يمكنك الضغط على الزر أدناه للمتابعة فوراً.'
                        : 'Your direct WhatsApp chat with Pulse OCTO strategists is ready. If it did not open automatically, tap below to continue.'}
                    </p>
                  </div>

                  {/* Summary Tag */}
                  <div className="px-5 py-3 rounded-xl bg-[#050308]/80 backdrop-blur-md border border-white/[0.15] flex items-center gap-3 text-xs text-[#e6e2f2]">
                    <span className="text-[#a39bb5]">{isAr ? 'رقم الواتساب المسجل:' : 'Registered WhatsApp:'}</span>
                    <span className="text-[#c9b3ff] font-mono font-bold text-sm" dir="ltr">
                      {whatsapp}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-center gap-4 pt-2 w-full">
                    <LiquidGlassButton
                      onClick={handleReopenChat}
                      variant="primary"
                      size="md"
                    >
                      <WhatsAppIcon className="w-4 h-4 text-white" />
                      <span>{isAr ? 'متابعة المحادثة في واتساب' : 'Continue on WhatsApp'}</span>
                    </LiquidGlassButton>

                    <LiquidGlassButton
                      href="mailto:CEO@pulseOCTO.com"
                      variant="secondary"
                      size="md"
                    >
                      <Mail className="w-4 h-4 text-[#c9b3ff]" />
                      <span>CEO@pulseOCTO.com</span>
                    </LiquidGlassButton>

                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-[#e6e2f2] hover:text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{isAr ? 'إرسال طلب آخر' : 'Send Another Request'}</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* The Simple & Concise Form: ONLY Name and WhatsApp Number */
                <form
                  key="quick-contact-form"
                  onSubmit={handleSubmit}
                  noValidate
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    {/* 1. Field: Name (الاسم) */}
                    <div className="space-y-2 group/field">
                      <label
                        htmlFor="quick-contact-name"
                        className="block text-xs sm:text-sm font-bold text-[#e6e2f2] group-focus-within/field:text-[#c9b3ff] transition-colors"
                      >
                        {isAr ? 'الاسم الكريم' : 'Your Name'}
                        <span className="text-[#c9b3ff] ms-1">*</span>
                      </label>
                      <div className="relative group/input">
                        <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none text-[#a39bb5] group-focus-within/input:text-[#c9b3ff] transition-colors z-10">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          id="quick-contact-name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (errorMessage) setErrorMessage('');
                          }}
                          placeholder={isAr ? 'مثال: أحمد محمود' : 'e.g. John Doe'}
                          className="relative w-full min-h-[52px] ps-11 pe-4 py-3.5 rounded-xl bg-[#050308]/80 backdrop-blur-md border border-white/[0.15] hover:border-white/[0.25] focus:border-[#c9b3ff] focus:ring-1 focus:ring-[#9d65f5]/45 text-base sm:text-sm text-white placeholder-[#7d7490] outline-none transition-colors touch-manipulation cursor-text"
                          autoComplete="name"
                        />
                      </div>
                    </div>

                    {/* 2. Field: WhatsApp Number (رقم الواتساب) */}
                    <div className="space-y-2 group/field">
                      <label
                        htmlFor="quick-contact-whatsapp"
                        className="block text-xs sm:text-sm font-bold text-[#e6e2f2] group-focus-within/field:text-[#c9b3ff] transition-colors"
                      >
                        {isAr ? 'رقم الواتساب' : 'WhatsApp Number'}
                        <span className="text-[#c9b3ff] ms-1">*</span>
                      </label>
                      <div className="relative group/input">
                        <div className="absolute inset-y-0 start-0 ps-4 flex items-center pointer-events-none text-[#a39bb5] group-focus-within/input:text-[#c9b3ff] transition-colors z-10">
                          <WhatsAppIcon className="w-4 h-4" />
                        </div>
                        <input
                          id="quick-contact-whatsapp"
                          type="tel"
                          required
                          value={whatsapp}
                          onChange={(e) => {
                            setWhatsapp(e.target.value);
                            if (errorMessage) setErrorMessage('');
                          }}
                          placeholder={isAr ? '01116066968' : '+20 111 606 6968'}
                          dir="ltr"
                          className={`relative w-full min-h-[52px] ps-11 pe-4 py-3.5 rounded-xl bg-[#050308]/80 backdrop-blur-md border border-white/[0.15] hover:border-white/[0.25] focus:border-[#c9b3ff] focus:ring-1 focus:ring-[#9d65f5]/45 text-base sm:text-sm text-white placeholder-[#7d7490] outline-none transition-colors touch-manipulation font-mono cursor-text ${
                            isAr ? 'text-right' : 'text-left'
                          }`}
                          autoComplete="tel"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Validation Error Message if any */}
                  {errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      <span>{errorMessage}</span>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-5">
                    <div className="w-full sm:w-auto">
                      <LiquidGlassButton
                        type="submit"
                        disabled={isSubmitting}
                        variant="primary"
                        size="lg"
                        className="w-full sm:w-auto min-w-[240px]"
                      >
                        <WhatsAppIcon className="w-5 h-5 text-white" />
                        <span>{isAr ? 'ابدأ نبض مشروعك' : 'Start Your Pulse'}</span>
                      </LiquidGlassButton>
                    </div>
                  </div>
                </form>
              )}
            </AnimatePresence>

            {/* Direct Channels Quick Bar below form */}
            <div className="mt-8 pt-6 border-t border-white/[0.12] flex flex-wrap items-center justify-between gap-4 text-xs">
              <div className="flex flex-wrap items-center gap-4 text-[#a39bb5]">
                <a
                  href="tel:+201112998882"
                  className="font-mono font-bold text-[#e6e2f2] hover:text-white transition-colors inline-flex items-center gap-1.5"
                  dir="ltr"
                >
                  <Phone className="w-3.5 h-3.5 text-[#c9b3ff]" />
                  01112998882
                </a>
                <span className="text-white/20">•</span>
                <a
                  href="mailto:contact@pulseocto.com"
                  className="font-mono font-bold text-[#e6e2f2] hover:text-white transition-colors inline-flex items-center gap-1.5"
                  dir="ltr"
                >
                  <Mail className="w-3.5 h-3.5 text-[#c9b3ff]" />
                  contact@pulseocto.com
                </a>
                <span className="text-white/20">•</span>
                <a
                  href="mailto:CEO@pulseOCTO.com"
                  className="font-mono font-bold text-[#e6e2f2] hover:text-white transition-colors inline-flex items-center gap-1.5"
                  dir="ltr"
                >
                  <Mail className="w-3.5 h-3.5 text-[#c9b3ff]" />
                  CEO@pulseOCTO.com
                </a>
              </div>

              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="inline-flex items-center gap-1.5 font-bold text-[#c9b3ff] hover:text-white transition-colors cursor-pointer"
                >
                  <span>{isAr ? 'تفاصيل استشارة مخصصة أكثر' : 'Detailed Project Audit Brief'}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
