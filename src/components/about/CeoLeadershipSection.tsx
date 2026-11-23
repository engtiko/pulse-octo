import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { ScrollReveal, ScrollStagger, staggerItemVariants } from '../ScrollReveal';
import { LiquidGlassButton } from '../LiquidGlassButton';
import { BlurUpImage } from '../BlurUpImage';
import {
  Quote,
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  MessageCircle,
  Award,
  Terminal,
  CheckCircle2
} from 'lucide-react';

interface CeoLeadershipSectionProps {
  onOpenConsultation?: () => void;
  onNavigate?: (page: string) => void;
}

export const CeoLeadershipSection: React.FC<CeoLeadershipSectionProps> = ({
  onOpenConsultation,
  onNavigate
}) => {
  const { isAr, dir } = useLanguage();

  const ceoWhatsappMessage = isAr
    ? encodeURIComponent('مرحباً م. طارق وجيه،\nأود طلب استشارة استراتيجية ومناقشة مشروع رقمي مع إدارة وكالة Pulse OCTO.')
    : encodeURIComponent('Hello Eng. Tarek Wagieh,\nI would like to request a strategic consultation and discuss a digital project with Pulse OCTO executive leadership.');

  const ceoWhatsappUrl = `https://wa.me/201116066968?text=${ceoWhatsappMessage}`;

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Cinematic Ambient Glow (Tech-Noir Studio Atmosphere) */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-[450px] h-[350px] bg-purple-950/20 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Main Studio Frame Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative rounded-3xl bg-gradient-to-b from-[#0e0922]/70 via-[#080515]/75 to-[#04030a]/80 border border-purple-500/25 hover:border-purple-400/40 p-6 sm:p-10 lg:p-12 shadow-[0_24px_60px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.12)] backdrop-blur-2xl transition-all"
      >
        {/* Subtle Ambient Accent Line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column (Desktop): Founder Portrait in Tech-Noir Studio Setting */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <ScrollReveal variant="fade-up" delay={0.1} threshold={0.15}>
              <div className="relative group">
                {/* Subtle Studio Backlight Glow */}
                <div className="absolute -inset-2 rounded-3xl bg-[#8052ff]/15 blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-500 pointer-events-none" />

                {/* Studio Portrait Container */}
                <div className="relative w-72 sm:w-80 lg:w-96 rounded-3xl overflow-hidden bg-[#0a0518] shadow-2xl border border-white/[0.12]">
                  <BlurUpImage
                    src="/CEO.webp"
                    alt={
                      isAr
                        ? 'م. طارق وجيه | مؤسس ومدير وكالة Pulse OCTO'
                        : 'Eng. Tarek Wagieh | Founder & CEO of Pulse OCTO'
                    }
                    width={512}
                    height={512}
                    className="w-full h-auto aspect-square"
                    imgClassName="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Dark Gradient Overlay at Bottom of Image for Overlay Text */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090518] via-transparent to-transparent opacity-80 pointer-events-none z-10" />

                  {/* Operational Status Tag Overlay */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.35, duration: 0.5, ease: 'easeOut' }}
                    className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/70 border border-white/[0.1] backdrop-blur-md flex items-center gap-2 shadow-lg"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-[11px] font-mono text-zinc-300 font-semibold uppercase tracking-wider">
                      {isAr ? 'القيادة التنفيذية' : 'Executive Lead'}
                    </span>
                  </motion.div>

                  {/* Bottom Image Overlay Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className={`absolute bottom-4 inset-x-4 p-3 rounded-2xl bg-black/80 border border-white/[0.1] backdrop-blur-md ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          {isAr ? 'م. طارق وجيه' : 'Eng. Tarek Wagieh'}
                        </h4>
                        <p className="text-[11px] text-purple-300 font-medium">
                          {isAr
                            ? 'المؤسس، المدير التنفيذي والمستشار الرقمي'
                            : 'Founder, CEO & Digital Consultant'}
                        </p>
                      </div>
                      <div className="w-8 h-8 rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-purple-300 shadow-sm">
                        <Cpu className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Founder Statement & Strategic Pillars */}
          <div className="lg:col-span-7 space-y-6">
            <ScrollReveal variant="fade-up" delay={0.15} threshold={0.15}>
              <div className="space-y-2">
                <span className="text-xs font-mono font-semibold tracking-widest text-purple-300 uppercase">
                  FOUNDER, CEO & DIGITAL CONSULTANT
                </span>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-snug">
                  {isAr ? (
                    <>
                      م. طارق وجيه{' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-purple-400 to-purple-200 block sm:inline">
                        | كلمة المؤسس
                      </span>
                    </>
                  ) : (
                    <>
                      Eng. Tarek Wagieh{' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-purple-400 to-purple-200 block sm:inline">
                        | Founder Note
                      </span>
                    </>
                  )}
                </h3>
              </div>
            </ScrollReveal>

            {/* Founder's Actual Direct Quotation Block */}
            <ScrollReveal variant="fade-up" delay={0.2} threshold={0.15}>
              <div className="relative p-6 sm:p-7 rounded-3xl bg-white/[0.03] border border-white/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.6)]">
                <Quote className="w-10 h-10 text-purple-400/20 absolute top-4 left-4 pointer-events-none" />

                <p className="text-base sm:text-lg font-normal text-zinc-200 leading-relaxed relative z-10">
                  {isAr ? (
                    <>
                      "أهدافي دائماً هي بناء حلول رقمية تجمع بين{' '}
                      <span className="text-purple-300 font-semibold">الاستراتيجية، التصميم، التكنولوجيا والتسويق</span>{' '}
                      في منظومة واحدة. في Pulse OCTO، نحن لا نقدم خدمات مجزأة..{' '}
                      <span className="text-white font-medium">
                        نحن نكون شركاء في رحلة تحويل الأفكار إلى علامات تجارية تنبض بالحياة وتنمو بقوة
                      </span>
                      ."
                    </>
                  ) : (
                    <>
                      "My driving objective has always been architecting digital ecosystems that unite{' '}
                      <span className="text-cyan-300 font-bold">Strategy, Design, Technology, and Marketing</span>{' '}
                      into a single powerhouse. At Pulse OCTO, we never deliver fragmented stubs..{' '}
                      <span className="text-purple-300 font-bold">
                        we stand as dedicated partners transforming ambitious visions into living, breathing brands that scale with authority
                      </span>
                      ."
                    </>
                  )}
                </p>

                <div className="mt-5 pt-4 border-t border-purple-800/40 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold text-white">
                    {isAr ? 'م. طارق وجيه' : 'Eng. Tarek Wagieh'}
                  </span>
                  <span className="text-purple-300 font-mono">
                    Pulse OCTO Studio • Cairo & Benha, Egypt
                  </span>
                </div>
              </div>
            </ScrollReveal>

            {/* Executive Strategic Pillars */}
            <ScrollStagger stagger={0.1} delay={0.25} threshold={0.15} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <motion.div variants={staggerItemVariants} className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/30 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-200">
                  {isAr ? 'هندسة الحلول الرقمية الشاملة' : 'Holistic Digital Architecture'}
                </span>
              </motion.div>
              <motion.div variants={staggerItemVariants} className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/30 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-200">
                  {isAr ? 'استشارات نمو العلامات التجارية' : 'Strategic Brand Growth'}
                </span>
              </motion.div>
              <motion.div variants={staggerItemVariants} className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-800/30 flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-200">
                  {isAr ? 'دمج التكنولوجيا والذكاء الاصطناعي' : 'AI & Tech Orchestration'}
                </span>
              </motion.div>
            </ScrollStagger>

            {/* Action Buttons: Direct Dialogue & Strategic Session */}
            <ScrollReveal variant="fade-up" delay={0.3} threshold={0.15}>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <LiquidGlassButton
                  href={ceoWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                  size="md"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>
                    {isAr ? 'تواصل استراتيجي مع المؤسس' : 'Executive WhatsApp Dialogue'}
                  </span>
                </LiquidGlassButton>

                {onOpenConsultation && (
                  <LiquidGlassButton
                    onClick={onOpenConsultation}
                    variant="primary"
                    size="md"
                  >
                    <Sparkles className="w-4 h-4 text-purple-200" />
                    <span>
                      {isAr ? 'طلب دراسة وتحليل مشروع' : 'Request Project Blueprint'}
                    </span>
                  </LiquidGlassButton>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
