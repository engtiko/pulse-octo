import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Palette,
  Compass,
  Layout,
  Target,
  Feather,
  Video,
  Cpu,
  TrendingUp,
  ChevronRight,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedArms } from '../data/agencyData';
import { prefetchRoute } from '../utils/routePrefetch';
import type { ArmData } from '../types';

export interface EightArmsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectArm: (arm: ArmData) => void;
  onExploreSystem?: () => void;
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const getArmIcon = (iconName?: string) => {
  switch (iconName) {
    case 'Sparkles':
      return Palette;
    case 'Compass':
      return Compass;
    case 'Layout':
      return Layout;
    case 'Target':
      return Target;
    case 'Feather':
      return Feather;
    case 'Video':
      return Video;
    case 'Cpu':
      return Cpu;
    case 'TrendingUp':
      return TrendingUp;
    default:
      return Layers;
  }
};

export const EightArmsDropdown: React.FC<EightArmsDropdownProps> = ({
  isOpen,
  onClose,
  onSelectArm,
  onExploreSystem,
  className = '',
  onMouseEnter,
  onMouseLeave,
}) => {
  const { lang, dir, isAr } = useLanguage();
  const armsList = React.useMemo(() => getLocalizedArms(lang), [lang]);

  const whatsappUrl = `https://wa.me/201116066968?text=${encodeURIComponent(
    isAr
      ? 'مرحباً فريق Pulse OCTO، أود استكشاف منظومة الـ 8 أذرع وبدء نبض مشروعي.'
      : 'Hello Pulse OCTO Team, I would like to explore the 8 Arms system and ignite my project.'
  )}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.98 }}
          transition={{
            duration: 0.2,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={`absolute top-full mt-2.5 ${
            dir === 'rtl'
              ? 'right-1/2 translate-x-1/2 sm:right-0 sm:translate-x-0'
              : 'left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0'
          } w-[310px] sm:w-[335px] z-50 pointer-events-auto before:absolute before:-top-3.5 before:inset-x-0 before:h-3.5 before:content-[''] select-none ${className}`}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          dir={dir}
        >
          {/* Luxury Obsidian & Frosted Glass Floating Menu Canvas */}
          <div className="relative rounded-2xl bg-[#090612]/92 backdrop-blur-[16px] backdrop-saturate-[180%] border border-white/[0.16] shadow-[0_28px_70px_rgba(0,0,0,0.92),inset_0_1px_1.5px_rgba(255,255,255,0.28)] p-2.5 overflow-hidden">
            {/* Ambient Sub-Glass Light Orb */}
            <div className="pointer-events-none absolute -top-10 left-1/3 w-40 h-28 rounded-full bg-[#8b5cf6]/20 blur-2xl" />
            {/* Specular Top Hairline */}
            <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-white/55 to-transparent pointer-events-none" />

            {/* Vertically Stacked Services */}
            <div className="relative z-10 flex flex-col space-y-1 max-h-[min(450px,68vh)] overflow-y-auto overflow-x-hidden overscroll-contain pr-0.5 custom-scrollbar">
              {armsList.map((arm) => {
                const Icon = getArmIcon(arm.iconName);

                return (
                  <button
                    key={arm.id}
                    type="button"
                    data-arm-id={arm.id}
                    data-prefetch-route={`arm-${arm.id}`}
                    data-arm-title={arm.enTitle || arm.title}
                    onMouseEnter={() => prefetchRoute(`arm-${arm.id}`)}
                    onFocus={() => prefetchRoute(`arm-${arm.id}`)}
                    onTouchStart={() => prefetchRoute(`arm-${arm.id}`)}
                    onClick={() => {
                      onSelectArm(arm);
                      onClose();
                    }}
                    className="group relative w-full flex items-center justify-between p-2 rounded-xl text-start transition-all duration-200 bg-transparent hover:bg-gradient-to-r hover:from-white/[0.1] hover:to-[#6b34c9]/[0.2] border border-transparent hover:border-[#d8c4ff]/40 cursor-pointer"
                  >
                    <div className="relative z-10 flex items-center gap-3 min-w-0 flex-1">
                      {/* Inner Frosted Crystal Medallion */}
                      <div className="w-8 h-8 rounded-xl shrink-0 flex items-center justify-center bg-gradient-to-br from-white/[0.14] via-white/[0.05] to-white/[0.02] group-hover:from-white/[0.22] group-hover:to-[#9d65f5]/[0.25] backdrop-blur-[12px] border border-white/[0.18] group-hover:border-[#e9dcff]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_4px_12px_rgba(0,0,0,0.45)] transition-all duration-200">
                        <Icon className="w-4 h-4 text-[#e6e2f2] group-hover:text-white transition-colors" />
                      </div>

                      {/* Clean Arm Title */}
                      <div className="min-w-0 flex-1">
                        <div className="text-xs sm:text-sm font-semibold text-[#d8d4e4] group-hover:text-white truncate transition-colors">
                          {isAr ? arm.title : arm.enTitle || arm.title}
                        </div>
                      </div>
                    </div>

                    {/* Trailing Micro-Indicator */}
                    <div className="relative z-10 flex items-center gap-1 shrink-0 ps-2 opacity-50 group-hover:opacity-100 transition-opacity">
                      <ChevronRight
                        className={`w-3.5 h-3.5 text-[#c9b3ff] group-hover:text-white transition-colors ${
                          dir === 'rtl' ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Dropdown Bottom Bar */}
            <div className="relative z-10 mt-2 pt-2 border-t border-white/[0.1] flex items-center justify-between gap-2 px-1">
              <button
                type="button"
                data-prefetch-route="the-8-arms"
                onMouseEnter={() => prefetchRoute('the-8-arms')}
                onFocus={() => prefetchRoute('the-8-arms')}
                onTouchStart={() => prefetchRoute('the-8-arms')}
                onClick={() => {
                  onClose();
                  if (onExploreSystem) {
                    onExploreSystem();
                  }
                }}
                className="flex items-center gap-1.5 text-[11px] font-bold text-[#d8d4e4] hover:text-white transition-colors cursor-pointer py-1.5 px-2.5 rounded-lg hover:bg-white/[0.06]"
              >
                <Layers className="w-3.5 h-3.5 text-[#c9b3ff]" />
                <span>{isAr ? 'عرض المنظومة بالكامل' : 'Explore Entire System'}</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="flex items-center gap-1 text-[11px] font-bold text-[#c9b3ff] hover:text-white transition-colors cursor-pointer py-1.5 px-2.5 rounded-lg hover:bg-[#8247e5]/25"
              >
                <span>{isAr ? 'ابدأ نبض مشروعك' : 'Start Your Pulse'}</span>
                <ArrowRight className={`w-3 h-3 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
