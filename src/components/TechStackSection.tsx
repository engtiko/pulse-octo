import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import {
  CAPABILITY_PILLARS,
  TECH_STACK_ITEMS,
  CapabilityPillar,
  TechItem,
} from '../data/techStackData';
import {
  Layers,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { LiquidGlassButton } from './LiquidGlassButton';

interface TechStackSectionProps {
  onOpenConsultation?: () => void;
}

// Minimal, authentic monochrome SVG logo marks for the technology wall
const TechLogoMark: React.FC<{ iconType: string; className?: string }> = ({ iconType, className = "w-5 h-5" }) => {
  switch (iconType) {
    case 'figma':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
          <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
          <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z" />
          <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" />
          <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" />
        </svg>
      );
    case 'aftereffects':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <path d="M7 16l2.5-7 2.5 7" />
          <path d="M8 13.5h3" />
          <path d="M14 13h3c.5 0 1-.5 1-1.5s-.5-1.5-1-1.5h-3v5h3" />
        </svg>
      );
    case 'premiere':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <path d="M7 16V9h3a2 2 0 0 1 0 4H7" />
          <path d="M14 11v5" />
          <path d="M14 12.5a2 2 0 0 1 3-1.5" />
        </svg>
      );
    case 'midjourney':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <path d="M12 3L4 18h16L12 3z" />
          <path d="M12 8l4 8H8l4-8z" />
          <circle cx="12" cy="19.5" r="1.5" />
        </svg>
      );
    case 'react':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <ellipse cx="12" cy="12" rx="10" ry="4.2" />
          <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      );
    case 'typescript':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <path d="M6 10h4" />
          <path d="M8 10v6" />
          <path d="M13 14.5c.5.8 1.5 1.5 2.5 1.5 1.2 0 2-.6 2-1.5 0-1.2-1.5-1.5-2.5-2-.8-.4-1.8-1-1.8-2 0-1 .8-1.8 2-1.8 1 0 1.8.5 2.2 1.2" />
        </svg>
      );
    case 'tailwind':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <path d="M6 11c1.5-2.5 4-3.5 6-2 1.5 1.2 2 3.5 4 4 1.5.3 3.5-.5 5-2-1.5 2.5-4 3.5-6 2-1.5-1.2-2-3.5-4-4-1.5-.3-3.5.5-5 2z" />
          <path d="M3 17c1.5-2.5 4-3.5 6-2 1.5 1.2 2 3.5 4 4 1.5.3 3.5-.5 5-2-1.5 2.5-4 3.5-6 2-1.5-1.2-2-3.5-4-4-1.5-.3-3.5.5-5 2z" />
        </svg>
      );
    case 'shopify':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <path d="M6 7l1.5-4h9L18 7" />
          <path d="M4 7l2 14h12l2-14H4z" />
          <path d="M12 11c-1.5 0-2 .8-2 1.5 0 1.2 2 1.2 2 2.2 0 .8-.6 1.3-1.5 1.3-1 0-1.8-.6-2-1.3" />
        </svg>
      );
    case 'salla':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <path d="M5 8h14l-1.5 12h-11L5 8z" />
          <path d="M8 8V5a4 4 0 0 1 8 0v3" />
          <path d="M10 13c1 1 3 1 4 0" />
        </svg>
      );
    case 'zid':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <rect x="3" y="3" width="18" height="18" rx="4" />
          <path d="M8 8h8l-8 8h8" />
        </svg>
      );
    case 'woocommerce':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <rect x="3" y="5" width="18" height="14" rx="4" />
          <path d="M6 10l2 5 2-5 2 5 2-5" />
          <circle cx="17.5" cy="14.5" r="1" fill="currentColor" />
        </svg>
      );
    case 'automation':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <circle cx="6" cy="6" r="3" />
          <circle cx="18" cy="6" r="3" />
          <circle cx="12" cy="18" r="3" />
          <path d="M8.5 7.5l7 7" />
          <path d="M15.5 7.5l-7 7" />
        </svg>
      );
    case 'gemini':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <path d="M12 2c0 5.5-4.5 10-10 10 5.5 0 10 4.5 10 10 0-5.5 4.5-10 10-10-5.5 0-10-4.5-10-10z" />
        </svg>
      );
    case 'analytics':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <path d="M4 20h16" />
          <rect x="6" y="12" width="3" height="8" rx="1" />
          <rect x="11" y="8" width="3" height="12" rx="1" />
          <rect x="16" y="4" width="3" height="16" rx="1" />
          <path d="M7.5 10l4-4 4 3 3.5-5" />
        </svg>
      );
    case 'meta':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <path d="M12 13c-2-2.5-4-4-6.5-4A4.5 4.5 0 0 0 1 13.5 4.5 4.5 0 0 0 5.5 18c2.5 0 4.5-1.5 6.5-4 2 2.5 4 4 6.5 4a4.5 4.5 0 0 0 4.5-4.5A4.5 4.5 0 0 0 18.5 9c-2.5 0-4.5 1.5-6.5 4z" />
        </svg>
      );
    case 'google':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v8" />
          <path d="M8 12h8" />
          <path d="M12 12l5-5" />
        </svg>
      );
    case 'tiktok':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
        </svg>
      );
    case 'cloudflare':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <path d="M6 18h12a4 4 0 0 0 2.5-7.1 5 5 0 0 0-8.9-3.4A4.5 4.5 0 0 0 6 11a4 4 0 0 0 0 7z" />
          <path d="M12 11v4" />
          <path d="M10 13l2 2 2-2" />
        </svg>
      );
    case 'nodejs':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <path d="M12 2l8 4.5v9L12 20l-8-4.5v-9L12 2z" />
          <path d="M12 7v10" />
          <path d="M12 12l5-3" />
          <path d="M12 12l-5-3" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      );
  }
};

export const TechStackSection: React.FC<TechStackSectionProps> = ({ onOpenConsultation }) => {
  const { isAr, dir } = useLanguage();
  const [activePillar, setActivePillar] = useState<CapabilityPillar | 'all'>('all');
  const [selectedTech, setSelectedTech] = useState<TechItem | null>(null);

  // Filtered capability groups
  const displayPillars = useMemo(() => {
    if (activePillar === 'all') {
      return CAPABILITY_PILLARS;
    }
    return CAPABILITY_PILLARS.filter(p => p.id === activePillar);
  }, [activePillar]);

  return (
    <section
      id="tech-stack"
      className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-[#030308]/60 backdrop-blur-sm text-white overflow-hidden border-t border-purple-950/40"
      dir={dir}
    >
      {/* Subtle atmospheric ambient glow — restrained 7% purple */}
      <div className="absolute top-1/3 start-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 end-1/4 w-[400px] h-[400px] bg-indigo-950/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* ============================================================
            Editorial Section Header
            "We use technology to build the system."
           ============================================================ */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
            {isAr ? 'نوظف التكنولوجيا لبناء المنظومة.' : 'We use technology to build the system.'}
          </h2>

          <p className="mt-6 text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            {isAr
              ? 'الأدوات وُجدت لتخدم الرؤية وتدعم المنظومة لا لتكون هي القصة. ترسانة تقنية مدروسة لبناء علامات مستقرة، وهندسة تجارب رقمية سريعة، وأتمتة العمليات، وقياس العائد بدقة.'
              : 'Tools should support the story, not become the story. A disciplined capability ecosystem curated to engineer resilient brand foundations, automated operations, and measurable growth.'}
          </p>
        </div>

        {/* ============================================================
            Capability Pillar Filter Bar (Zero-Pill Minimalist Tabs)
           ============================================================ */}
        <div className="flex items-center flex-wrap gap-x-6 gap-y-3 pb-6 mb-16 border-b border-purple-950/60 text-xs font-mono">
          {CAPABILITY_PILLARS.map((p) => {
            const isActive = activePillar === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setActivePillar(activePillar === p.id ? 'all' : p.id)}
                className={`transition-all duration-200 cursor-pointer py-1.5 flex items-center gap-2 ${
                  isActive
                    ? 'text-white font-bold border-b-2 border-purple-400 drop-shadow-[0_0_12px_rgba(168,85,247,0.6)]'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span>{isAr ? p.titleAr : p.title}</span>
              </button>
            );
          })}
        </div>

        {/* ============================================================
            Clean Editorial Technology Wall
            Organized into the 5 pillars without arbitrary percentages
           ============================================================ */}
        <div className="space-y-20 sm:space-y-24">
          {displayPillars.map((pillar) => {
            const pillarTools = TECH_STACK_ITEMS.filter((item) => item.pillar === pillar.id);

            return (
              <div key={pillar.id} className="relative">
                {/* Pillar Editorial Header */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 pb-6 mb-8 border-b border-purple-950/40 items-baseline">
                  <div className="lg:col-span-4 flex items-baseline gap-3">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {isAr ? pillar.titleAr : pillar.title}
                    </h3>
                  </div>

                  <div className="lg:col-span-8 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                    <span className="text-sm font-semibold text-purple-300">
                      {isAr ? pillar.subtitleAr : pillar.subtitle}
                    </span>
                    <p className="text-xs text-zinc-300 max-w-xl font-normal leading-relaxed">
                      {isAr ? pillar.descriptionAr : pillar.description}
                    </p>
                  </div>
                </div>

                {/* Editorial Technology Wall Grid - Liquid Glass Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {pillarTools.map((tech) => {
                    const isSelected = selectedTech?.id === tech.id;

                    return (
                      <div
                        key={tech.id}
                        onClick={() => setSelectedTech(isSelected ? null : tech)}
                        className={`group relative p-5 rounded-2xl transition-all duration-300 cursor-pointer border backdrop-blur-2xl overflow-hidden ${
                          isSelected
                            ? 'bg-gradient-to-b from-[#1f0d47]/85 via-[#0e0724]/90 to-[#070414]/95 border-purple-400/80 shadow-[0_16px_40px_rgba(138,43,226,0.35),inset_0_1px_1.5px_rgba(255,255,255,0.25)]'
                            : 'bg-gradient-to-b from-[#130a2e]/70 via-[#0a061b]/75 to-[#05030e]/80 border-purple-500/30 hover:border-purple-400/60 hover:-translate-y-1 shadow-[0_12px_32px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:shadow-[0_20px_45px_rgba(138,43,226,0.25),inset_0_1px_2px_rgba(255,255,255,0.25)]'
                        }`}
                      >
                        {/* Top Specular Line for Liquid Glass */}
                        <div className="absolute top-0 inset-x-4 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

                        {/* Top: Liquid Glass Icon Badge + Ecosystem Role */}
                        <div className="flex items-center justify-between gap-3 mb-4">
                          <div className="relative overflow-hidden w-11 h-11 rounded-xl backdrop-blur-xl bg-gradient-to-b from-white/[0.12] via-white/[0.04] to-purple-500/[0.08] border border-white/20 shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_1.5px_rgba(255,255,255,0.35)] flex items-center justify-center text-white group-hover:text-purple-200 group-hover:border-purple-400/60 group-hover:bg-purple-900/30 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all">
                            {/* Inner specular line on icon */}
                            <div className="absolute top-0 inset-x-1.5 h-[1px] bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none" />
                            <TechLogoMark iconType={tech.iconType} className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:scale-110" />
                          </div>

                          <span className="text-[11px] font-mono text-purple-300 group-hover:text-white transition-colors truncate text-end">
                            {isAr ? tech.roleAr : tech.roleEn}
                          </span>
                        </div>

                        {/* Tool Name */}
                        <h4 className="text-base font-bold text-white group-hover:text-purple-100 transition-colors mb-2">
                          {tech.name}
                        </h4>

                        {/* Real System Function (Business Value, Not Hype) */}
                        <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed mb-3">
                          {isAr ? tech.descriptionAr : tech.descriptionEn}
                        </p>

                        {/* System Delivery Footnote */}
                        <div className="pt-3 border-t border-purple-500/20 flex items-start gap-1.5 text-[11px] font-mono text-zinc-400">
                          <span className="text-purple-400 shrink-0">↳</span>
                          <span className="line-clamp-1 text-zinc-300">
                            {isAr ? tech.systemFunctionAr : tech.systemFunctionEn}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* ============================================================
            System Integration Footnote & Strategic Callout - Liquid Glass
           ============================================================ */}
        <div className="mt-20 p-8 sm:p-10 rounded-3xl backdrop-blur-2xl bg-gradient-to-b from-[#130a2e]/75 via-[#0a061b]/80 to-[#05030e]/85 border border-purple-500/30 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
          <div className="max-w-2xl">
            <div className="text-xs font-mono text-purple-300 uppercase tracking-wider mb-2">
              {isAr ? 'تكامل المنظومة الحالية' : 'Custom Stack Integration'}
            </div>
            <h4 className="text-xl sm:text-2xl font-bold text-white mb-2">
              {isAr
                ? 'هل تمتلك أدوات أو متجراً قائماً بالفعل؟'
                : 'Already have an existing tech stack or platform?'}
            </h4>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              {isAr
                ? 'نحن لا نفرض أدوات محددة لمجرد الاستعراض. أذرع Pulse OCTO تندمج بسلاسة مع منصتك الحالية لتنظيم مسارات التحويل، تدقيق أداء التتبع، وتوجيه الميزانيات بدقة.'
                : 'We do not force tools for display. Pulse OCTO audits and connects with your existing setup to eliminate conversion friction, calibrate telemetry, and drive real business outcomes.'}
            </p>
          </div>

          {onOpenConsultation && (
            <LiquidGlassButton
              onClick={onOpenConsultation}
              variant="primary"
              size="md"
              className="shrink-0"
            >
              <span>{isAr ? 'طلب تدقيق المنظومة التقنية' : 'Request Architecture Audit'}</span>
              <ArrowRight className={`w-4 h-4 text-purple-200 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            </LiquidGlassButton>
          )}
        </div>
      </div>
    </section>
  );
};

TechStackSection.displayName = 'TechStackSection';
