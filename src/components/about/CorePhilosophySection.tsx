import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { ScrollReveal, ScrollStagger, staggerItemVariants } from '../ScrollReveal';
import { AnimatedCounter } from '../AnimatedCounter';
import {
  Compass,
  Cpu,
  Sparkles,
  Zap,
  Activity,
  Layers,
  Palette,
  Code2,
  Share2,
  FileText,
  Video,
  Bot,
  Compass as StrategyIcon,
  LineChart
} from 'lucide-react';

export const CorePhilosophySection: React.FC = () => {
  const { isAr, dir } = useLanguage();

  const arms = [
    {
      icon: Palette,
      nameAr: 'الهوية وبناء العلامة',
      nameEn: 'BRANDING',
      code: 'ARM 01'
    },
    {
      icon: Share2,
      nameAr: 'التسويق الرقمي',
      nameEn: 'MARKETING',
      code: 'ARM 02'
    },
    {
      icon: Code2,
      nameAr: 'المواقع والتجارة الإلكترونية',
      nameEn: 'WEB & E-COMMERCE',
      code: 'ARM 03'
    },
    {
      icon: Video,
      nameAr: 'الاستوديو والإنتاج الإبداعي',
      nameEn: 'STUDIO',
      code: 'ARM 04'
    },
    {
      icon: Bot,
      nameAr: 'المنتجات والحلول الرقمية',
      nameEn: 'DIGITAL PRODUCTS',
      code: 'ARM 05'
    },
    {
      icon: StrategyIcon,
      nameAr: 'الاستراتيجية',
      nameEn: 'STRATEGY',
      code: 'ARM 06'
    },
    {
      icon: FileText,
      nameAr: 'صناعة المحتوى',
      nameEn: 'CONTENT',
      code: 'ARM 07'
    },
    {
      icon: LineChart,
      nameAr: 'النمو والتحسين',
      nameEn: 'GROWTH',
      code: 'ARM 08'
    }
  ];

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Philosophy Narrative */}
        <div className="lg:col-span-7 space-y-6">
          <ScrollReveal variant="fade-up" threshold={0.15}>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
              {isAr ? (
                <>
                  8 أذرع.. عقل واحد..{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-purple-400">
                    نبض واحد
                  </span>
                </>
              ) : (
                <>
                  8 Arms.. One Mind..{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-purple-400">
                    One Pulse
                  </span>
                </>
              )}
            </h2>
          </ScrollReveal>

          {/* Inspirational Highlight Quote */}
          <ScrollReveal variant="fade-up" delay={0.1} threshold={0.15}>
            <div className="p-4 sm:p-5 rounded-2xl backdrop-blur-2xl bg-gradient-to-r from-purple-950/60 via-[#0d0822] to-purple-950/60 border-r-4 border-r-purple-500 border border-purple-800/30 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 inset-x-4 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
              <p className="text-base sm:text-lg font-bold text-purple-200 leading-relaxed italic">
                {isAr
                  ? '"استوحينا هويتنا من \'الأخطبوط\'.. كائن رقمي ذو ذكاء مركزي فائق يتحكم في 8 أذرع تشغيلية قوية ومرنة"'
                  : '"We drew our identity from the \'Octopus\'.. a digital organism endowed with superior central intelligence governing 8 powerful, agile operational arms."'}
              </p>
            </div>
          </ScrollReveal>

          {/* Detailed Narrative */}
          <ScrollReveal variant="fade-up" delay={0.2} threshold={0.15}>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              {isAr
                ? 'نحن نؤمن أن النجاح الرقمي لا يأتي من خدمات منفصلة أو التعامل مع جهات عشوائية مشتتة، بل من اندماجها في كيان واحد يعمل بتناغم تام. في Pulse OCTO، تعمل استراتيجيتنا كـ العقل المركزي (The Core) الذي يوجه 8 أذرع متخصصة (الهوية وبناء العلامة، التسويق الرقمي، المواقع والتجارة الإلكترونية، الاستوديو والإنتاج الإبداعي، المنتجات والحلول الرقمية، الاستراتيجية، صناعة المحتوى، والنمو والتحسين) لتتحرك جميعها في اتجاه واحد وبنفس النبض لتحقيق أهداف مشروعك.'
                : 'We believe digital dominance is never forged through isolated services or disjointed third parties, but through organic fusion into a single cohesive organism. At Pulse OCTO, our strategic framework operates as The Core—orchestrating 8 specialized arms (Branding, Marketing, Web & E-Commerce, Studio, Digital Products, Strategy, Content, and Growth) to move as one unified force beating at the exact same pulse toward your goals.'}
            </p>
          </ScrollReveal>

          {/* Stats Bar - Uniform Liquid Glass */}
          <ScrollReveal variant="fade-up" delay={0.3} threshold={0.15}>
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 sm:p-4 rounded-2xl backdrop-blur-2xl bg-gradient-to-b from-[#130a2e]/70 via-[#0a061b]/75 to-[#05030e]/80 border border-purple-500/30 shadow-[0_8px_25px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.12)] flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 inset-x-2 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none" />
                <div className="text-xl sm:text-2xl font-black text-white font-mono">
                  <AnimatedCounter value={120} prefix="+" duration={1.6} />
                </div>
                <div className="text-[11px] sm:text-xs text-purple-300 font-semibold mt-1">
                  {isAr ? 'براند تم بناؤه' : 'Brands Scaled'}
                </div>
              </div>
              <div className="p-3.5 sm:p-4 rounded-2xl backdrop-blur-2xl bg-gradient-to-b from-[#130a2e]/70 via-[#0a061b]/75 to-[#05030e]/80 border border-purple-500/30 shadow-[0_8px_25px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.12)] flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 inset-x-2 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none" />
                <div className="text-xl sm:text-2xl font-black text-white font-mono">
                  <AnimatedCounter value={4.8} suffix="x" decimals={1} duration={1.6} />
                </div>
                <div className="text-[11px] sm:text-xs text-purple-300 font-semibold mt-1">
                  {isAr ? 'متوسط ROAS' : 'Avg Client ROAS'}
                </div>
              </div>
              <div className="p-3.5 sm:p-4 rounded-2xl backdrop-blur-2xl bg-gradient-to-b from-[#130a2e]/70 via-[#0a061b]/75 to-[#05030e]/80 border border-purple-500/30 shadow-[0_8px_25px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.12)] flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 inset-x-2 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none" />
                <div className="text-xl sm:text-2xl font-black text-white font-mono">
                  <AnimatedCounter value={98} prefix="+" suffix="%" duration={1.6} />
                </div>
                <div className="text-[11px] sm:text-xs text-purple-300 font-semibold mt-1">
                  {isAr ? 'رضى العملاء' : 'Satisfaction Rate'}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Right Column: Central Brain & 8 Arms Interactive Visual Matrix */}
        <div className="lg:col-span-5">
          <ScrollReveal variant="fade-up" delay={0.2} threshold={0.15}>
            <div className="relative p-6 sm:p-8 rounded-3xl backdrop-blur-2xl bg-gradient-to-b from-[#130a2e]/75 via-[#090518]/80 to-[#04020c]/85 border border-purple-500/30 hover:border-purple-400/45 shadow-[0_16px_40px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15),0_0_35px_rgba(138,43,226,0.2)] transition-all overflow-hidden">
              <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

              {/* Central Brain Hub Tag */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-xl bg-purple-950/60 border border-purple-400/30 text-white shadow-[0_4px_20px_rgba(138,43,226,0.25),inset_0_1px_1px_rgba(255,255,255,0.15)]">
                  <Cpu className="w-4 h-4 text-purple-300 animate-pulse" />
                  <span className="text-xs font-black tracking-wider uppercase">
                    {isAr ? 'العقل المركزي • THE CORE' : 'THE NEURAL CORE'}
                  </span>
                </div>
                <p className="text-xs text-zinc-300 mt-2">
                  {isAr
                    ? '8 أذرع تشغيلية متزامنة تنبض من عقل استراتيجي واحد'
                    : '8 Synchronized Operational Arms Beating in Harmony'}
                </p>
              </div>

              {/* Grid of the 8 Arms with Staggered Scroll Reveal - Liquid Glass */}
              <ScrollStagger stagger={0.08} delay={0.1} threshold={0.15} className="grid grid-cols-2 gap-2.5">
                {arms.map((arm, index) => {
                  const Icon = arm.icon;
                  return (
                    <motion.div
                      key={index}
                      variants={staggerItemVariants}
                      whileHover={{ scale: 1.03, y: -2 }}
                      className="p-3.5 rounded-2xl backdrop-blur-2xl bg-gradient-to-b from-[#130a2e]/70 via-[#0a061b]/75 to-[#05030e]/80 border border-purple-500/30 hover:border-purple-400/60 shadow-[0_8px_25px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all group flex items-center gap-3 relative overflow-hidden"
                    >
                      {/* Top Specular Line for Liquid Glass */}
                      <div className="absolute top-0 inset-x-2 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none" />

                      {/* Liquid Glass Icon Badge */}
                      <div className="relative overflow-hidden w-9 h-9 rounded-xl backdrop-blur-xl bg-gradient-to-b from-white/[0.12] via-white/[0.04] to-purple-500/[0.08] border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.4),inset_0_1px_1.5px_rgba(255,255,255,0.35)] flex items-center justify-center text-white group-hover:border-purple-400/60 group-hover:bg-purple-900/30 group-hover:text-purple-200 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all shrink-0">
                        <div className="absolute top-0 inset-x-1 h-[1px] bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none" />
                        <Icon className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                      </div>

                      <div className="min-w-0">
                        <span className="text-[10px] font-mono text-purple-300 font-bold block leading-none">
                          {arm.code}
                        </span>
                        <span className="text-xs font-bold text-white group-hover:text-purple-100 transition-colors block truncate mt-1">
                          {isAr ? arm.nameAr : arm.nameEn}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </ScrollStagger>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
