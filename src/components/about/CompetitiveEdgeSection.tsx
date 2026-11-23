import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { ScrollReveal } from '../ScrollReveal';
import { LiquidGlassButton } from '../LiquidGlassButton';
import {
  XCircle,
  CheckCircle2,
  Zap,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu,
  Flame,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';

interface CompetitiveEdgeSectionProps {
  onNavigate?: (page: string) => void;
  onOpenConsultation?: () => void;
}

export const CompetitiveEdgeSection: React.FC<CompetitiveEdgeSectionProps> = ({
  onNavigate,
  onOpenConsultation
}) => {
  const { isAr, dir } = useLanguage();

  const comparisons = [
    {
      id: 1,
      badTitleAr: 'تشتت الموردين وفقدان البوصلة',
      badTitleEn: 'Fragmented Vendors & Lost Identity',
      badTextAr: 'التعامل مع فريلانسرز ومطابع يعتمدون قوالب مستهلكة تشتت هويتك وتخلق فوضى في التواصل والنتائج.',
      badTextEn: 'Dealing with unvetted freelancers and print shops using generic tired templates that dilute your identity and scatter communication.',
      octoTitleAr: 'نظام واحد متكامل (One System)',
      octoTitleEn: 'Unified Synchronized System',
      octoTextAr: 'كل أذرع النمو الرقمي تحت سقف واحد، استراتيجية مركزية واحدة، وحساب تنفيذي موحد يدير كل التفاصيل.',
      octoTextEn: 'All 8 digital growth arms under one roof, unified strategic governance, and a singular execution pipeline.',
      badgeAr: 'تكامل كامل 100%',
      badgeEn: '100% Unified Synergy'
    },
    {
      id: 2,
      badTitleAr: 'بطء تقني وتصميمات باهتة',
      badTitleEn: 'Sluggish Platforms & Dull Design',
      badTextAr: 'مواقع بطيئة، تصميمات تجارية معتادة، غياب التحليل الرقمي وتجربة مستخدم تفقدك عملاءك قبل اكتمال التحميل.',
      badTextEn: 'Laggy websites, commoditized graphics, zero telemetry analytics, and broken UX that bleeds visitors before pages even load.',
      octoTitleAr: 'هندسة بصرية وسرعة خارقة',
      octoTitleEn: 'Visual Engineering & Blazing Speed',
      octoTextAr: 'منصات عصرية فائقة السرعة مخصصة بالكامل، وطابع نيون مستقبلي يخطف الأنظار ويفرض هيبة براندك.',
      octoTextEn: 'Custom, cutting-edge high-velocity platforms paired with futuristic cyberpunk visual aesthetics that command instant respect.',
      badgeAr: 'سرعة البرق + هوية سينمائية',
      badgeEn: 'Ultra Fast + Cinematic'
    },
    {
      id: 3,
      badTitleAr: 'إعلانات عشوائية تحرق الميزانية',
      badTitleEn: 'Blind Ad Spending & Burning Budgets',
      badTextAr: 'حملات ممولة مبنية على التخمين، ميزانيات مهدرة على استهدافات غير دقيقة وبدون تتبع حقيقي للعائد.',
      badTextEn: 'Speculative ad boosts burning ad budgets across untargeted demographics with zero attribution or accountability.',
      octoTitleAr: 'قرارات بالذكاء الاصطناعي والبيانات',
      octoTitleEn: 'AI & Data-Driven Precision',
      octoTextAr: 'حملات مدفوعة بخوارزميات ذكية وتحليلات فورية تضمن توجيه كل مليم لتحقيق أعلى عائد استثماري (ROI).',
      octoTextEn: 'Algorithmic targeting driven by AI models and real-time telemetry, ensuring every dollar maximizes genuine ROAS and conversions.',
      badgeAr: 'أقصى عائد ROI موثق',
      badgeEn: 'Verified High ROAS'
    }
  ];

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Background Neon Blurs */}
      <div className="absolute top-1/2 left-1/4 w-[400px] h-[300px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-1/4 w-[450px] h-[350px] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <ScrollReveal variant="fade-up" threshold={0.15}>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
            {isAr ? (
              <>
                الفارق الحاسم بين{' '}
                <span className="text-rose-400/90">التشتت</span> و{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-purple-400 to-purple-200">
                  المنظومة المتكاملة
                </span>
              </>
            ) : (
              <>
                The Decisive Gap: <span className="text-rose-400/90">Fragmented Chaos</span> vs{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-purple-400 to-purple-200">
                  Pulse OCTO Powerhouse
                </span>
              </>
            )}
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 mt-3">
            {isAr
              ? 'مقارنة شفافة توضح لماذا تختار الشركات الرائدة شراكة Pulse OCTO بدلاً من الحلول التقليدية المجهدة'
              : 'A transparent breakdown illustrating why forward-looking brands partner with Pulse OCTO over fragmented alternatives.'}
          </p>
        </ScrollReveal>
      </div>

      {/* Comparison Grid */}
      <div className="space-y-6">
        {comparisons.map((item, index) => (
          <ScrollReveal key={item.id} variant="fade-up" delay={index * 0.1} threshold={0.15}>
            <div className="rounded-3xl border border-white/[0.08] overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.7)] bg-[#070512] backdrop-blur-xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-white/[0.06]">
                {/* 1. Left Side: The Old/Fragmented Approach (❌) */}
                <div className="p-6 sm:p-8 bg-rose-950/[0.08] relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-rose-950/60 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-sm">
                        <XCircle className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                        {isAr ? 'الحلول التقليدية والمشتتة ❌' : 'Fragmented Traditional Flaws ❌'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/40 text-rose-300 border border-rose-800/30">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-zinc-200 mb-2">
                    {isAr ? item.badTitleAr : item.badTitleEn}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    {isAr ? item.badTextAr : item.badTextEn}
                  </p>
                </div>

                {/* 2. Right Side: Pulse OCTO Integrated System (⚡) */}
                <div className="p-6 sm:p-8 bg-gradient-to-br from-[#0e0922]/60 via-[#080515]/80 to-[#04030a] relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                        {isAr ? 'منظومة Pulse OCTO المتكاملة ⚡' : 'Pulse OCTO Synchronized System ⚡'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 font-semibold shadow-sm">
                      {isAr ? item.badgeAr : item.badgeEn}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                    {isAr ? item.octoTitleAr : item.octoTitleEn}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                    {isAr ? item.octoTextAr : item.octoTextEn}
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Bottom Summary Action Strip */}
      <ScrollReveal variant="scale-up" delay={0.3} threshold={0.15}>
        <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0e0922]/95 via-[#080515]/95 to-[#04030a]/98 border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-white">
              {isAr ? 'جاهز للارتقاء من الفوضى إلى المنظومة المتكاملة؟' : 'Ready to Transition From Chaos to Full Systemization?'}
            </h4>
            <p className="text-xs sm:text-sm text-zinc-300 mt-1">
              {isAr
                ? 'دعنا نضع استراتيجية موحدة تجمع كافة أذرع مشروعك تحت إدارة واحدة ونبض استثنائي.'
                : 'Let us build a unified strategy synchronizing every arm of your business under singular leadership.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {onOpenConsultation && (
              <LiquidGlassButton
                onClick={onOpenConsultation}
                variant="primary"
                size="md"
              >
                <span>{isAr ? 'احجز استشارتك الآن' : 'Book Strategic Session'}</span>
                <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              </LiquidGlassButton>
            )}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};
