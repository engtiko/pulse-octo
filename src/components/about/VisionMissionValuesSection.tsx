import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { ScrollReveal, ScrollStagger, staggerItemVariants } from '../ScrollReveal';
import {
  Eye,
  Target,
  Sparkles,
  Cpu,
  Zap,
  TrendingUp,
  ShieldCheck,
  Award,
  Layers
} from 'lucide-react';

export const VisionMissionValuesSection: React.FC = () => {
  const { isAr, dir } = useLanguage();

  const coreValues = [
    {
      icon: Cpu,
      titleAr: 'الابتكار الموجه بالتكنولوجيا',
      titleEn: 'Tech-Driven Innovation',
      descAr: 'تطويع الذكاء الاصطناعي وأحدث التقنيات لخدمة الفكرة، وبناء حلول مستقبلية تسبق السوق بخطوات.',
      descEn: 'Leveraging cutting-edge AI and engineering to serve the vision and construct forward-thinking solutions that outperform trends.'
    },
    {
      icon: Zap,
      titleAr: 'التأثير البصري الفائق',
      titleEn: 'Visual Impact',
      descAr: 'الاعتماد على التضاد البصري والجماليات السينمائية المتقنة لخطف العين فوراً وترسيخ مكانة العلامة.',
      descEn: 'Harnessing cinematic aesthetics and refined visual tension to instantly command attention across digital platforms.'
    },
    {
      icon: Target,
      titleAr: 'الدقة الإبداعية',
      titleEn: 'Creative Precision',
      descAr: 'هندسة مرئية تسويقية تعامل كل عنصر تصميمي كأداة بيع مدروسة بعناية فائقة لتعظيم معدلات التحويل.',
      descEn: 'Precision visual engineering where every typographic, spatial, and motion asset is tuned as a high-conversion sales engine.'
    },
    {
      icon: TrendingUp,
      titleAr: 'النمو الموجه بالأرقام',
      titleEn: 'Growth-Oriented Strategy',
      descAr: 'قرارات مبنية على البيانات الدقيقة ومؤشرات الأداء الحية لتحقيق نتائج ملموسة بعيداً عن العشوائية والتخمين.',
      descEn: 'Decisions anchored strictly in telemetry, KPIs, and algorithmic performance to generate verifiable bottom-line revenue.'
    }
  ];

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <ScrollReveal variant="fade-up" threshold={0.15}>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
            {isAr ? (
              <>
                بوصلتنا نحو{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-purple-400">
                  الهيمنة الرقمية
                </span>
              </>
            ) : (
              <>
                Our Compass Toward{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-200 to-purple-400">
                  Digital Dominance
                </span>
              </>
            )}
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 mt-3">
            {isAr
              ? 'المبادئ الاستراتيجية التي تقود نبض Pulse OCTO وتحدد كيف نصنع الفارق لكل علامة تجارية'
              : 'The core tenets driving the pulse of Pulse OCTO and shaping exponential growth for our partners.'}
          </p>
        </ScrollReveal>
      </div>

      {/* Two Pillars: Vision & Mission Cards - Liquid Glass */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* 1. Our Vision */}
        <ScrollReveal variant="fade-up" delay={0.1} threshold={0.15}>
          <div className="h-full p-7 sm:p-8 rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-[#120a2e]/75 via-[#0b061c]/80 to-[#070414]/85 border border-purple-500/30 hover:border-purple-400/50 shadow-[0_16px_40px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15),0_0_30px_rgba(138,43,226,0.2)] relative overflow-hidden group transition-all">
            <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/15 rounded-full blur-2xl pointer-events-none" />
            
            <div className="flex items-center gap-3.5 mb-5">
              <div className="relative overflow-hidden w-12 h-12 rounded-2xl backdrop-blur-xl bg-gradient-to-b from-white/[0.12] via-white/[0.04] to-purple-500/[0.08] border border-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_1.5px_rgba(255,255,255,0.35)] flex items-center justify-center text-white group-hover:border-purple-400/60 group-hover:bg-purple-900/30 group-hover:text-purple-200 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all">
                <div className="absolute top-0 inset-x-1.5 h-[1px] bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none" />
                <Eye className="w-6 h-6 text-white group-hover:text-purple-200 relative z-10 transition-transform duration-300 group-hover:scale-110" />
              </div>
              <h3 className="text-xl font-bold text-white">
                {isAr ? 'الهندسة البصرية والريادة' : 'Visual Engineering & Regional Leadership'}
              </h3>
            </div>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              {isAr
                ? 'أن نكون القاطرة الرائدة في "الهندسة البصرية" والنمو الرقمي المتكامل في المنطقة، عبر استبدال القوالب التقليدية المستهلكة بهويات سينمائية مستقبلية وأنظمة تكنولوجية تمنح العلامات التجارية سيطرة كاملة على أسواقها.'
                : 'To become the pioneering powerhouse of "Visual Engineering" and integrated digital growth across the region, replacing obsolete generic templates with futuristic cinematic identities and technological platforms that give brands unchallenged market command.'}
            </p>
          </div>
        </ScrollReveal>

        {/* 2. Our Mission */}
        <ScrollReveal variant="fade-up" delay={0.2} threshold={0.15}>
          <div className="h-full p-7 sm:p-8 rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-[#0c0926]/75 via-[#070517]/80 to-[#04030d]/85 border border-purple-500/30 hover:border-purple-400/50 shadow-[0_16px_40px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15),0_0_30px_rgba(138,43,226,0.2)] relative overflow-hidden group transition-all">
            <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
            <div className="absolute top-0 left-0 w-32 h-32 bg-purple-600/15 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-3.5 mb-5">
              <div className="relative overflow-hidden w-12 h-12 rounded-2xl backdrop-blur-xl bg-gradient-to-b from-white/[0.12] via-white/[0.04] to-purple-500/[0.08] border border-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_1.5px_rgba(255,255,255,0.35)] flex items-center justify-center text-white group-hover:border-purple-400/60 group-hover:bg-purple-900/30 group-hover:text-purple-200 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all">
                <div className="absolute top-0 inset-x-1.5 h-[1px] bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none" />
                <Target className="w-6 h-6 text-white group-hover:text-purple-200 relative z-10 transition-transform duration-300 group-hover:scale-110" />
              </div>
              <h3 className="text-xl font-bold text-white">
                {isAr ? 'تمكين الشركات وفرض الهيمنة' : 'Empowering Enterprises & Dominating Presence'}
              </h3>
            </div>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              {isAr
                ? 'تمكين الشركات الطموحة من بناء حضور رقمي يفرض هيمنته البصرية، عبر دقة التصميم التكنولوجي، وتطوير منصات ويب سريعة، واستراتيجيات تسويق موجهة بالبيانات تحول الزيارات الرقمية إلى نمو ملموس وأرباح حقيقية.'
                : 'Empowering forward-thinking companies to establish an authoritative digital presence through precise technological design, blazing-fast web engines, and data-steered marketing funnels that convert digital visits into tangible, sustainable revenue.'}
            </p>
          </div>
        </ScrollReveal>
      </div>

      {/* Core Values Sub-Header & 4 Pillars Grid - Liquid Glass */}
      <div className="pt-4">
        <div className="text-center mb-8">
          <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
            {isAr ? 'معايير لا نساوم عليها' : 'Non-Negotiable Standards'}
          </h3>
        </div>

        <ScrollStagger stagger={0.12} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {coreValues.map((v, i) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={i}
                variants={staggerItemVariants}
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl backdrop-blur-2xl bg-gradient-to-b from-[#130a2e]/70 via-[#0a061b]/75 to-[#05030e]/80 border border-purple-500/30 hover:border-purple-400/60 shadow-[0_12px_32px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all duration-300 relative group flex flex-col justify-between overflow-hidden"
              >
                {/* Top Specular Line for Liquid Glass */}
                <div className="absolute top-0 inset-x-4 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-5">
                    {/* Liquid Glass Icon Badge */}
                    <div className="relative overflow-hidden w-12 h-12 rounded-xl backdrop-blur-xl bg-gradient-to-b from-white/[0.12] via-white/[0.04] to-purple-500/[0.08] border border-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_1.5px_rgba(255,255,255,0.35)] flex items-center justify-center text-white group-hover:border-purple-400/60 group-hover:bg-purple-900/30 group-hover:text-purple-200 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all">
                      <div className="absolute top-0 inset-x-1.5 h-[1px] bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none" />
                      <Icon className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-white mb-2 group-hover:text-purple-100 transition-colors">
                    {isAr ? v.titleAr : v.titleEn}
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {isAr ? v.descAr : v.descEn}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </ScrollStagger>
      </div>
    </section>
  );
};
