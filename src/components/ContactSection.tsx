import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getLocalizedServices } from '../data/agencyData';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import {
  MessageCircle,
  Mail,
  Clock,
  CheckCircle2,
  MapPin,
  RotateCcw
} from 'lucide-react';

interface ContactSectionProps {
  preselectedService?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ preselectedService }) => {
  const { lang, t, isAr } = useLanguage();
  const toast = useToast();
  const services = getLocalizedServices(lang);

  const [selectedServices, setSelectedServices] = useState<string[]>([
    isAr ? 'الهوية وبناء العلامة' : 'BRANDING'
  ]);
  const [brandName, setBrandName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [budget, setBudget] = useState(isAr ? '٢٥,٠٠٠ - ٥٠,٠٠٠ ج.م' : 'EGP 25,000 - 50,000');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const triggerCelebrationConfetti = () => {
    const brandColors = ['#7c3aed', '#a855f7', '#ffffff'];

    import('canvas-confetti')
      .then((mod) => {
        const confetti = mod.default;
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: brandColors,
          disableForReducedMotion: true,
        });
      })
      .catch(() => {});
  };

  useEffect(() => {
    setSelectedServices([services[0]?.title || (isAr ? 'الهوية وبناء العلامة' : 'BRANDING')]);
    setBudget(isAr ? '٢٥,٠٠٠ - ٥٠,٠٠٠ ج.م' : 'EGP 25,000 - 50,000');
  }, [lang]);

  useEffect(() => {
    if (preselectedService && !selectedServices.includes(preselectedService)) {
      setSelectedServices((prev) => [...prev, preselectedService]);
    }
  }, [preselectedService]);

  const toggleService = (title: string) => {
    if (selectedServices.includes(title)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter((s) => s !== title));
      }
    } else {
      setSelectedServices([...selectedServices, title]);
    }
  };

  const getWhatsAppMessage = () => {
    return isAr
      ? `*طلب دراسة مشروع جديد - وكالة Pulse OCTO*\n\n` +
        `• اسم العلامة / النشاط: ${brandName || 'غير محدد'}\n` +
        `• اسم المسؤول: ${contactName || 'غير محدد'}\n` +
        `• رقم التواصل: ${phone || 'غير محدد'}\n` +
        `• الأذرع والخدمات المطلوبة:\n${selectedServices.map((s) => `  - ${s}`).join('\n')}\n` +
        `• الميزانية المتوقعة: ${budget}\n` +
        `• ملاحظات إضافية: ${details || 'لا توجد ملاحظات إضافية'}`
      : `*New Project Consultation Request - Pulse OCTO Agency*\n\n` +
        `• Brand / Project Name: ${brandName || 'Not specified'}\n` +
        `• Contact Person: ${contactName || 'Not specified'}\n` +
        `• Direct Phone / WhatsApp: ${phone || 'Not specified'}\n` +
        `• Required Arms & Services:\n${selectedServices.map((s) => `  - ${s}`).join('\n')}\n` +
        `• Estimated Budget: ${budget}\n` +
        `• Additional Details: ${details || 'None provided'}`;
  };

  const handleWhatsAppDirect = (e: React.FormEvent) => {
    e.preventDefault();
    const message = getWhatsAppMessage();
    const url = `https://wa.me/201116066968?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setSubmitted(true);
    triggerCelebrationConfetti();

    toast.success(
      isAr ? 'تم إرسال الطلب بنجاح' : 'Brief Submitted Successfully',
      isAr
        ? `تم تجهيز ملف استشارة ${brandName ? `(${brandName})` : 'مشروعك'} وفتح محادثة الواتساب المباشرة مع فريقنا.`
        : `Consultation dossier ${brandName ? `for ${brandName}` : ''} prepared and direct WhatsApp chat launched.`,
      { duration: 6000 }
    );
  };

  const handleReopenWhatsApp = () => {
    const message = getWhatsAppMessage();
    const url = `https://wa.me/201116066968?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');

    toast.success(
      isAr ? 'تم فتح محادثة الواتساب المباشرة' : 'WhatsApp Chat Opened',
      isAr ? 'فريقنا في انتظار رسالتك لمناقشة الخطة الاستراتيجية.' : 'Our team is ready to discuss all details of your project strategy.'
    );
  };

  const handleResetForm = () => {
    setSubmitted(false);
    setBrandName('');
    setContactName('');
    setPhone('');
    setDetails('');

    toast.info(
      isAr ? 'تمت إعادة تعيين النموذج' : 'Form Reset',
      isAr ? 'يمكنك الآن إدخال تفاصيل طلب استشارة جديد.' : 'You can now enter details for a new project brief.'
    );
  };

  const budgetOptions = isAr
    ? [
        '١٠,٠٠٠ - ٢٥,٠٠٠ ج.م',
        '٢٥,٠٠٠ - ٥٠,٠٠٠ ج.م',
        '٥٠,٠٠٠ - ١٠٠,٠٠٠ ج.م',
        '+١٠٠,٠٠٠ ج.م (حملة كبرى / متجر متكامل)',
        'غير محدد / استشارة أولية'
      ]
    : [
        'EGP 10,000 - 25,000',
        'EGP 25,000 - 50,000',
        'EGP 50,000 - 100,000',
        '+EGP 100,000 (Major Campaign / Full Store)',
        'Undecided / Exploratory Consultation'
      ];

  return (
    <section
      id="contact"
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#06050a] overflow-hidden"
    >
      {/* Restrained Ambient Lighting */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[160px] pointer-events-none" />

      <div className={`max-w-6xl mx-auto relative z-10 ${isAr ? 'text-right' : 'text-left'}`}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-400 mb-3 block">
            {t('contact.badge')}
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            {isAr ? (
              <>ابدأ نبض مشروعك مع <bdi dir="ltr" className="text-purple-300">Pulse OCTO</bdi></>
            ) : (
              <>Start Your Project Pulse with <bdi dir="ltr" className="text-purple-300">Pulse OCTO</bdi></>
            )}
          </h2>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            {t('contact.subtitle')}
          </p>
        </motion.div>

        <div id="consultation-form-wrapper" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Info Panel (Credentials & Trust) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="p-7 rounded-3xl bg-[#09080f] border border-white/10 shadow-xl space-y-6">
              <h3 className="text-xl font-bold text-white">
                {t('contact.whyChooseUs')}
              </h3>

              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0e0b18] border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{t('contact.point1Title')}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {t('contact.point1Desc')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0e0b18] border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{t('contact.point2Title')}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {t('contact.point2Desc')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#0e0b18] border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{t('contact.point3Title')}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {t('contact.point3Desc')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Direct Quick Contacts */}
              <div className="pt-4 border-t border-white/10 space-y-2.5 text-xs text-slate-400">
                <div className="p-3 rounded-xl bg-[#0c0a14] border border-white/[0.08] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-300">{t('contact.emailTitle')}</span>
                    <a
                      href="mailto:contact@pulseocto.com"
                      className="text-purple-300 font-mono font-bold hover:text-white transition-colors"
                      dir="ltr"
                    >
                      contact@pulseocto.com
                    </a>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-white/[0.05]">
                    <span className="text-[11px] text-slate-400">CEO</span>
                    <a
                      href="mailto:CEO@pulseOCTO.com"
                      className="text-purple-300/90 font-mono font-bold hover:text-white transition-colors"
                      dir="ltr"
                    >
                      CEO@pulseOCTO.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#0c0a14] border border-white/[0.08]">
                  <span className="font-semibold text-slate-300">{t('contact.phoneTitle')}</span>
                  <a href="tel:01112998882" className="text-purple-300 font-mono font-bold hover:text-white transition-colors" dir="ltr">01112998882</a>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#0c0a14] border border-white/[0.08]">
                  <span className="font-semibold text-slate-300">{t('contact.whatsappTitle')}</span>
                  <a href="https://wa.me/201116066968" target="_blank" rel="noopener noreferrer" className="text-purple-300 font-mono font-bold hover:text-white transition-colors" dir="ltr">01116066968</a>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#0c0a14] border border-white/[0.08]">
                  <span className="font-semibold text-slate-300 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-purple-400" />
                    {t('contact.hqTitle')}
                  </span>
                  <span className="text-slate-300 font-medium text-[11px] sm:text-xs">{t('contact.hqVal')}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form (Builds Instant WhatsApp Brief) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <div className="p-7 sm:p-9 rounded-3xl bg-[#09080f] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success-card"
                    initial={{ opacity: 0, scale: 0.96, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -12 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                    className="flex flex-col items-center text-center py-6 sm:py-8 space-y-6"
                  >
                    <div className="relative w-16 h-16 rounded-full bg-[#0e0b18] border border-purple-500/40 flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-purple-400" />
                    </div>

                    <div className="space-y-2 max-w-lg">
                      <h3 className="text-2xl sm:text-3xl font-black text-white">
                        {isAr ? 'تم تجهيز طلب استشارتك مع Pulse OCTO' : 'Your Brief is Ready'}
                      </h3>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {isAr
                          ? 'تم فتح محادثة الواتساب المباشرة وتجهيز كامل تفاصيل طلبك. فريقنا المتخصص يبدأ الآن دراسة مشروعك وسنوافيك بالرد فوراً.'
                          : 'WhatsApp chat has been launched with your customized project brief. Our strategists are reviewing your requirements.'}
                      </p>
                    </div>

                    {/* Brief Summary Dossier Card */}
                    <div className="w-full text-start p-5 rounded-2xl bg-[#0c0a14] border border-white/10 space-y-3.5 text-xs text-slate-300">
                      <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                        <span className="font-bold text-purple-300">
                          {isAr ? 'ملخص تفاصيل الاستشارة' : 'CONSULTATION BRIEF SUMMARY'}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <span className="text-slate-400 block text-[11px] font-semibold">{t('contact.brandLabel')}</span>
                          <span className="text-white font-bold">{brandName || (isAr ? 'غير محدد' : 'Not specified')}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px] font-semibold">{t('contact.contactLabel')}</span>
                          <span className="text-white font-bold">{contactName || (isAr ? 'غير محدد' : 'Not specified')}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px] font-semibold">{t('contact.phoneLabel')}</span>
                          <span className="text-purple-300 font-mono font-bold" dir="ltr">{phone || (isAr ? 'غير محدد' : 'Not specified')}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px] font-semibold">{t('contact.budgetLabel')}</span>
                          <span className="text-purple-300 font-bold">{budget}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/10">
                        <span className="text-slate-400 block text-[11px] font-semibold mb-1.5">{isAr ? 'الأذرع المطلوبة:' : 'Requested Arms:'}</span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedServices.map((srv, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-lg bg-[#0e0b18] border border-purple-500/30 text-[11px] font-medium text-purple-200"
                            >
                              ✓ {srv}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Interactive Action Buttons */}
                    <div className="w-full flex flex-col sm:flex-row items-center gap-3 pt-2">
                      <button
                        onClick={handleReopenWhatsApp}
                        className="w-full sm:flex-1 py-3.5 px-5 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{isAr ? 'متابعة المحادثة في واتساب' : 'Re-open WhatsApp Chat'}</span>
                      </button>

                      <a
                        href={`mailto:CEO@pulseOCTO.com?subject=${encodeURIComponent(
                          isAr
                            ? `طلب استشارة رقمية - ${brandName || 'Pulse OCTO'}`
                            : `Project Consultation Request - ${brandName || 'Pulse OCTO'}`
                        )}&body=${encodeURIComponent(getWhatsAppMessage())}`}
                        className="w-full sm:w-auto py-3.5 px-5 rounded-xl bg-[#0e0b18] hover:bg-purple-950/60 border border-white/15 hover:border-purple-500/40 text-white font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        <Mail className="w-4 h-4 text-purple-400" />
                        <span>{isAr ? 'إرسال عبر البريد الرسمي' : 'Email Brief Directly'}</span>
                      </a>

                      <button
                        onClick={handleResetForm}
                        className="w-full sm:w-auto py-3.5 px-4 rounded-xl bg-[#0c0a14] hover:bg-white/[0.06] border border-white/10 text-slate-300 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{isAr ? 'طلب جديد' : 'New Request'}</span>
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <form
                    key="consultation-form"
                    onSubmit={handleWhatsAppDirect}
                    className="space-y-6"
                    {...({
                      toolname: 'submit_project_inquiry',
                      tooldescription:
                        'Submit a digital marketing, brand identity, web/e-commerce, or growth consultation inquiry to Pulse OCTO.',
                    } as React.FormHTMLAttributes<HTMLFormElement>)}
                  >
                    {/* Step 1: Select Services (The 8 Arms) */}
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <label className="block text-sm font-bold text-white">
                          {t('contact.step1')}
                        </label>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {services.map((srv) => {
                          const isSelected = selectedServices.includes(srv.title);
                          return (
                            <button
                              type="button"
                              key={srv.id}
                              onClick={() => toggleService(srv.title)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-[#7c3aed] text-white border border-purple-400/50'
                                  : 'bg-[#0c0a14] text-slate-400 hover:text-slate-200 border border-white/10'
                              }`}
                              data-cursor="pointer"
                            >
                              {isSelected && '✓ '}
                              {srv.title}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Step 2: Brand & Contact Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">
                          {t('contact.brandLabel')}
                        </label>
                        <input
                          type="text"
                          required
                          value={brandName}
                          onChange={(e) => setBrandName(e.target.value)}
                          placeholder={t('contact.brandPlaceholder')}
                          className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-[#0c0a14] border border-white/10 focus:border-purple-500 text-base sm:text-sm text-white placeholder-slate-500 outline-none transition-colors touch-manipulation"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">
                          {t('contact.contactLabel')}
                        </label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder={t('contact.contactPlaceholder')}
                          className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-[#0c0a14] border border-white/10 focus:border-purple-500 text-base sm:text-sm text-white placeholder-slate-500 outline-none transition-colors touch-manipulation"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">
                          {t('contact.phoneLabel')}
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder={isAr ? '01116066968' : '+20 111 606 6968'}
                          dir="ltr"
                          className={`w-full min-h-[48px] px-4 py-3 rounded-xl bg-[#0c0a14] border border-white/10 focus:border-purple-500 text-base sm:text-sm text-white placeholder-slate-500 outline-none transition-colors touch-manipulation ${isAr ? 'text-right' : 'text-left'}`}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1.5">
                          {t('contact.budgetLabel')}
                        </label>
                        <select
                          value={budget}
                          onChange={(e) => setBudget(e.target.value)}
                          className="w-full min-h-[48px] px-4 py-3 rounded-xl bg-[#0c0a14] border border-white/10 focus:border-purple-500 text-base sm:text-sm text-white outline-none transition-colors touch-manipulation cursor-pointer"
                        >
                          {budgetOptions.map((b, bIdx) => (
                            <option key={bIdx} value={b} className="bg-[#09080f] text-white">
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Step 3: Additional Notes */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        {t('contact.detailsLabel')}
                      </label>
                      <textarea
                        rows={3}
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        placeholder={t('contact.detailsPlaceholder')}
                        className="w-full px-4 py-3 rounded-xl bg-[#0c0a14] border border-white/10 focus:border-purple-500 text-base sm:text-sm text-white placeholder-slate-500 outline-none transition-colors resize-none touch-manipulation"
                      />
                    </div>

                    {/* Submit & Direct Email Buttons */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                      <button
                        type="submit"
                        className="w-full sm:flex-1 py-4 px-5 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-colors active:scale-[0.99] cursor-pointer"
                        data-cursor="pointer"
                        id="submit-proposal-btn"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span>{t('contact.submitWhatsApp')}</span>
                      </button>

                      <a
                        href={`mailto:CEO@pulseOCTO.com?subject=${encodeURIComponent(
                          isAr
                            ? `طلب استشارة رقمية - ${brandName || 'Pulse OCTO'}`
                            : `Project Consultation Request - ${brandName || 'Pulse OCTO'}`
                        )}&body=${encodeURIComponent(getWhatsAppMessage())}`}
                        className="w-full sm:w-auto py-4 px-5 rounded-xl bg-[#0c0a14] hover:bg-[#120e20] border border-white/12 hover:border-purple-500/40 text-slate-200 hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
                        data-cursor="pointer"
                        id="submit-email-btn"
                      >
                        <Mail className="w-4 h-4 text-purple-400 shrink-0" />
                        <span>{isAr ? 'مراسلة عبر البريد الرسمي' : 'Email: CEO@pulseOCTO.com'}</span>
                      </a>
                    </div>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
