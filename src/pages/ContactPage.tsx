import React from 'react';
import { motion } from 'motion/react';
import { PageHeader } from '../components/PageHeader';
import { ContactSection } from '../components/ContactSection';
import { FAQSection } from '../components/FAQSection';
import { SectionDivider } from '../components/SectionDivider';
import {
  ScrollStagger,
  staggerItemVariants,
} from '../components/ScrollReveal';
import { useLanguage } from '../context/LanguageContext';
import { MessageCircle, Phone, Mail, MapPin } from 'lucide-react';

interface ContactPageProps {
  onNavigate: (page: string) => void;
  preselectedService?: string;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onNavigate,
  preselectedService,
}) => {
  const { isAr } = useLanguage();

  const whatsappUrl = `https://wa.me/201116066968?text=${encodeURIComponent(
    isAr
      ? 'مرحباً فريق Pulse OCTO، أود حجز استشارة رقمية والحديث حول مشروعي الجديد.'
      : 'Hello Pulse OCTO Team, I would like to book a digital consultation for my new project.'
  )}`;

  return (
    <div className="relative min-h-screen">
      {/* 1. Page Header */}
      <PageHeader
        badge={isAr ? 'قنوات الاتصال المباشرة' : 'Direct Channels'}
        title={isAr ? 'تواصل معنا وابدأ' : 'Contact Us & Start'}
        highlightedTitle={isAr ? 'نبض مشروعك اليوم' : 'Your Brand Pulse'}
        sectionType="contact"
        videoSrc="/videos/pulse-video-10.mp4"
        description={
          isAr
            ? 'سواء كنت ترغب في بناء علامة تجارية جديدة، أو إطلاق منصة رقمية متكاملة، أو تنمية مبيعاتك عبر منظومة الأذرع الثمانية، فريقنا مستعد للانطلاق معك.'
            : 'Whether you are launching a brand identity, deploying a digital platform, or scaling growth across our 8 integrated arms, our team is ready.'
        }
        onGoHome={() => onNavigate('home')}
        ctaText={isAr ? 'ابدأ نبض مشروعك' : 'Start Your Project'}
        onCtaClick={() => window.open(whatsappUrl, '_blank')}
        secondaryCtaText="CEO@pulseOCTO.com"
        onSecondaryCtaClick={() => {
          window.location.href = 'mailto:CEO@pulseOCTO.com';
        }}
      />

      {/* 2. Direct Channels Quick Grid */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <ScrollStagger stagger={0.08} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.a
            variants={staggerItemVariants}
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-2xl bg-[#09080f] border border-white/10 hover:border-purple-500/40 transition-colors group flex items-start gap-4 cursor-pointer"
          >
            <div className="w-11 h-11 rounded-xl bg-[#0e0b18] border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-purple-400 font-semibold uppercase tracking-wider">
                {isAr ? 'واتساب مباشر' : 'Direct WhatsApp'}
              </div>
              <div className="text-sm font-extrabold text-white mt-0.5 font-mono" dir="ltr">
                01116066968
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {isAr ? 'تواصل فوري ومباشر' : 'Direct communication'}
              </div>
            </div>
          </motion.a>

          <motion.a
            variants={staggerItemVariants}
            href="tel:01112998882"
            className="p-5 rounded-2xl bg-[#09080f] border border-white/10 hover:border-purple-500/40 transition-colors group flex items-start gap-4 cursor-pointer"
          >
            <div className="w-11 h-11 rounded-xl bg-[#0e0b18] border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-purple-400 font-semibold uppercase tracking-wider">
                {isAr ? 'الاتصال الهاتفي' : 'Direct Phone'}
              </div>
              <div className="text-sm font-extrabold text-white mt-0.5 font-mono" dir="ltr">
                01112998882
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {isAr ? 'متاح طوال أيام الأسبوع' : 'Available all week'}
              </div>
            </div>
          </motion.a>

          <motion.div
            variants={staggerItemVariants}
            className="p-5 rounded-2xl bg-[#09080f] border border-white/10 hover:border-purple-500/40 transition-colors group flex items-start gap-4"
          >
            <div className="w-11 h-11 rounded-xl bg-[#0e0b18] border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-purple-400 font-semibold uppercase tracking-wider">
                {isAr ? 'البريد الرسمي' : 'Official Email'}
              </div>
              <div className="mt-0.5 space-y-0.5">
                <a
                  href="mailto:contact@pulseocto.com"
                  className="block text-sm font-extrabold text-white hover:text-purple-300 transition-colors font-mono truncate"
                  dir="ltr"
                >
                  contact@pulseocto.com
                </a>
                <a
                  href="mailto:CEO@pulseOCTO.com"
                  className="block text-xs font-bold text-slate-300 hover:text-purple-300 transition-colors font-mono truncate"
                  dir="ltr"
                >
                  CEO@pulseOCTO.com
                </a>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {isAr ? 'استقبال العروض والشراكات' : 'Proposals & Partnerships'}
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={staggerItemVariants}
            className="p-5 rounded-2xl bg-[#09080f] border border-white/10 flex items-start gap-4"
          >
            <div className="w-11 h-11 rounded-xl bg-[#0e0b18] border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-purple-400 font-semibold uppercase tracking-wider">
                {isAr ? 'المقر والنطاق' : 'HQ & Operations'}
              </div>
              <div className="text-sm font-extrabold text-white mt-0.5">
                {isAr ? 'بنها، مصر' : 'Banha, Egypt'}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {isAr ? 'مصر والشرق الأوسط' : 'Serving MENA Region'}
              </div>
            </div>
          </motion.div>
        </ScrollStagger>
      </section>

      <SectionDivider variant="gold" />

      {/* 3. Full Contact & Proposal Form Section */}
      <ContactSection preselectedService={preselectedService} />

      <SectionDivider variant="gold" />

      {/* 4. Strategic FAQ Reassurance */}
      <FAQSection onOpenConsultation={() => window.scrollTo({ top: 400, behavior: 'smooth' })} />
    </div>
  );
};
