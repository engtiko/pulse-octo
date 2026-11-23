import React, { useState, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { ScrollHeaderReveal } from './ScrollReveal';
import { getOptimizedImageProps } from '../utils/imageOptimizer';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  TrendingUp,
  Layers,
  ShoppingBag,
} from 'lucide-react';

export interface TrustPartner {
  id: string;
  nameAr: string;
  nameEn: string;
  categoryAr: string;
  categoryEn: string;
  logo: string;
  type: 'client' | 'platform';
  badgeAr: string;
  badgeEn: string;
  projectSlug?: string;
}

export const TRUST_PARTNERS: TrustPartner[] = [
  {
    id: 'ladies-shop',
    nameAr: 'ليديز شوب (Ladies Shop)',
    nameEn: 'Ladies Shop Luxury Apparel',
    categoryAr: 'أزياء فاخرة وتجارة إلكترونية',
    categoryEn: 'Luxury Fashion & E-Commerce',
    logo: '/projects/logo%20L.webp',
    type: 'client',
    badgeAr: 'شراكة استراتيجية مستمرة',
    badgeEn: 'Ongoing Strategic Partner',
    projectSlug: 'ladies-shop',
  },
  {
    id: 'zeyad-optical',
    nameAr: 'نظارات زياد (Zeyad Optical)',
    nameEn: 'Zeyad Optical Eyewear',
    categoryAr: 'بصريات ونظارات طبية وشمسية',
    categoryEn: 'Luxury Eyewear & Optics',
    logo: '/projects/zeyad-logo.webp',
    type: 'client',
    badgeAr: 'تصميم هوية وتصوير وتدريب',
    badgeEn: 'Brand Identity, Studio & Training',
    projectSlug: 'zeyad-optical',
  },
  {
    id: 'al-namaa-academy',
    nameAr: 'أكاديمية النماء للتربية الخاصة',
    nameEn: 'Al-Namaa Academy for Special Education',
    categoryAr: 'تأهيل ورعاية وتنمية مهارات الأطفال',
    categoryEn: 'Special Education & Child Rehab',
    logo: '/projects/n-logo.webp',
    type: 'client',
    badgeAr: 'شراكة تطوير استراتيجية',
    badgeEn: 'Strategic Development Partner',
    projectSlug: 'al-namaa-academy',
  },
  {
    id: 'halan-delivery',
    nameAr: 'حالا دليفري (Halan Delivery)',
    nameEn: 'Halan Delivery',
    categoryAr: 'خدمات التوصيل السريع والأسطول',
    categoryEn: 'Fast Courier & Logistics',
    logo: '/projects/h-logo.webp',
    type: 'client',
    badgeAr: 'هوية بصرية وتطبيقات أسطول',
    badgeEn: 'Visual Identity & Transit Decals',
    projectSlug: 'halan-delivery',
  },
  {
    id: 'adamco-fleet',
    nameAr: 'أدمكو للنقل والرحلات (قاسم الحواتمي)',
    nameEn: 'Adamco Fleet & Corporate Commute',
    categoryAr: 'نقل جماعي وأساطيل سياحية',
    categoryEn: 'Corporate Commute & Transit',
    logo: '/projects/Adamco%20logo.webp',
    type: 'client',
    badgeAr: 'شراكة إدارة أسطول وتسويق',
    badgeEn: 'Fleet Systems & Marketing',
    projectSlug: 'adamco-fleet',
  },
  {
    id: 'athar',
    nameAr: 'أثر (Athar) — أزياء محجبات مصرية 100%',
    nameEn: 'Athar — Egyptian Modest Fashion',
    categoryAr: 'تصميم وتنفيذ ملابس محجبات مصرية 100%',
    categoryEn: '100% Egyptian Modest Fashion',
    logo: '/assets/aistudio/Logo_AThar_52ab6b2b.jpg',
    type: 'client',
    badgeAr: 'الشعار والهيدر وهوية الدار',
    badgeEn: 'Brandmark, Header & Identity',
    projectSlug: 'athar',
  },
  {
    id: 'salla',
    nameAr: 'منصة سلة (Salla)',
    nameEn: 'Salla E-Commerce',
    categoryAr: 'تطوير وتخصيص متاجر متقدمة',
    categoryEn: 'Advanced E-Commerce Architecture',
    logo: '/projects/logo L.webp',
    type: 'platform',
    badgeAr: 'تكامل المتاجر',
    badgeEn: 'Store Integration',
  },
  {
    id: 'zid',
    nameAr: 'منصة زد (Zid)',
    nameEn: 'Zid Retail Platform',
    categoryAr: 'حلول التجارة الإلكترونية المتكاملة',
    categoryEn: 'Enterprise Retail Solutions',
    logo: '/projects/logo L.webp',
    type: 'platform',
    badgeAr: 'حلول التجزئة',
    badgeEn: 'Retail Ecosystem',
  },
  {
    id: 'shopify-plus',
    nameAr: 'Shopify Plus',
    nameEn: 'Shopify Plus',
    categoryAr: 'متاجر سريعة وتجارة بلا رأس (Headless)',
    categoryEn: 'High-Velocity Headless Stores',
    logo: '/projects/logo L.webp',
    type: 'platform',
    badgeAr: 'تجارة عالمية',
    badgeEn: 'Global Commerce',
  },
  {
    id: 'meta-partner',
    nameAr: 'Meta Business & CAPI',
    nameEn: 'Meta Business & CAPI',
    categoryAr: 'إعلانات ممولة وتتبع سيرفري متقدم',
    categoryEn: 'Performance Media & Server Tracking',
    logo: '/projects/logo L.webp',
    type: 'platform',
    badgeAr: 'إعلانات الأداء',
    badgeEn: 'Performance Media',
  },
  {
    id: 'google-marketing',
    nameAr: 'Google Marketing Platform',
    nameEn: 'Google Marketing Platform',
    categoryAr: 'حملات البحث و Performance Max',
    categoryEn: 'Search & Performance Max',
    logo: '/projects/logo L.webp',
    type: 'platform',
    badgeAr: 'محركات البحث',
    badgeEn: 'Search & P-Max',
  },
];

interface TrustPartnersSectionProps {
  onNavigate?: (page: string) => void;
  onOpenConsultation?: () => void;
}

export const TrustPartnersSection: React.FC<TrustPartnersSectionProps> = ({
  onNavigate,
  onOpenConsultation,
}) => {
  const { isAr, dir } = useLanguage();
  const [isPaused, setIsPaused] = useState(false);
  const [filter, setFilter] = useState<'all' | 'client' | 'platform'>('all');
  const [activeDirection, setActiveDirection] = useState<'left' | 'right' | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 25,
    restDelta: 0.001,
  });
  const headerParallaxY = useTransform(smoothProgress, [0, 1], [-12, 12]);
  const carouselParallaxY = useTransform(smoothProgress, [0, 1], [-18, 18]);

  const filteredPartners = useMemo(() => {
    if (filter === 'all') return TRUST_PARTNERS;
    return TRUST_PARTNERS.filter((partner) => partner.type === filter);
  }, [filter]);

  const carouselItems = useMemo(() => {
    const list = filteredPartners.length > 0 ? filteredPartners : TRUST_PARTNERS;
    const repeatCount = Math.max(2, Math.ceil(8 / list.length));
    const singleHalf = Array.from({ length: repeatCount }, () => list).flat();
    return [...singleHalf, ...singleHalf];
  }, [filteredPartners]);

  const activeMarqueeClass = useMemo(() => {
    if (activeDirection) {
      return activeDirection === 'right' ? 'animate-marquee-right' : 'animate-marquee-left';
    }
    return isAr ? 'animate-marquee-right' : 'animate-marquee-left';
  }, [activeDirection, isAr]);

  const handleManualDirectionChange = (direction: 'left' | 'right') => {
    setActiveDirection(direction);
    setIsPaused(false);
  };

  const handlePartnerClick = (partner: TrustPartner) => {
    if (partner.projectSlug && onNavigate) {
      onNavigate('portfolio');
    } else if (onOpenConsultation) {
      onOpenConsultation();
    }
  };

  return (
    <section
      ref={sectionRef}
      id="trust-partners-section"
      className="relative py-16 sm:py-24 overflow-hidden bg-[#06050a] border-y border-white/[0.06]"
      aria-label={isAr ? 'شركاء الثقة وقصص النجاح' : 'Trust Partners & Proven Alliances'}
    >
      {/* Subtle Ambient Plum Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] bg-purple-950/15 blur-[140px] rounded-full pointer-events-none" />

      {/* Header and Controls */}
      <motion.div style={{ y: headerParallaxY }} className="will-change-transform">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <ScrollHeaderReveal>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {isAr ? (
                  <>
                    شركات وعلامات تجارية{' '}
                    <span className="bg-gradient-to-r from-white via-zinc-200 to-purple-300 bg-clip-text text-transparent">
                      وثقت بمنظومتنا الرقمية
                    </span>
                  </>
                ) : (
                  <>
                    Pioneering Brands{' '}
                    <span className="bg-gradient-to-r from-white via-zinc-200 to-purple-300 bg-clip-text text-transparent">
                      Scaling Through Our Digital Pulse
                    </span>
                  </>
                )}
              </h2>

              <p className="mt-3 text-zinc-400 max-w-2xl text-xs sm:text-sm leading-relaxed">
                {isAr
                  ? 'ندمج أذرع الهوية البصرية، الحملات الإعلانية، والمنظومات البرمجية لبناء نمو حقيقي ومتكامل بدون فجوات تشغيلية.'
                  : 'Powering market leaders across retail, logistics, eyewear, and e-commerce through synchronized branding, performance marketing, and software architecture.'}
              </p>
            </ScrollHeaderReveal>

            {/* Interactive Controls & Category Filter */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
              <div className="inline-flex p-1 rounded-xl bg-[#09080f] border border-white/10 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer font-semibold ${
                    filter === 'all'
                      ? 'bg-[#7c3aed] text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {isAr ? 'الكل' : 'All'}
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('client')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer font-semibold ${
                    filter === 'client'
                      ? 'bg-[#7c3aed] text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {isAr ? 'العملاء وقصص النجاح' : 'Client Brands'}
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('platform')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer font-semibold ${
                    filter === 'platform'
                      ? 'bg-[#7c3aed] text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {isAr ? 'المنصات والتقنيات' : 'Platforms'}
                </button>
              </div>

              {/* Play / Pause Toggle Button */}
              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                title={isPaused ? (isAr ? 'تشغيل الحركة' : 'Resume carousel') : (isAr ? 'إيقاف الحركة مؤقتاً' : 'Pause carousel')}
                aria-label={isPaused ? 'Resume carousel' : 'Pause carousel'}
                className="p-2.5 rounded-xl bg-[#09080f] border border-white/10 text-zinc-400 hover:text-white hover:border-purple-500/40 transition-all cursor-pointer"
              >
                {isPaused ? <Play className="w-4 h-4 text-purple-300" /> : <Pause className="w-4 h-4 text-zinc-300" />}
              </button>

              {/* Manual Slide Navigation Arrows */}
              <div className="inline-flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleManualDirectionChange('left')}
                  title={isAr ? 'تحريك لليسار' : 'Scroll Left'}
                  aria-label={isAr ? 'تحريك لليسار' : 'Scroll Left'}
                  className="p-2.5 rounded-xl bg-[#09080f] border border-white/10 text-zinc-400 hover:text-white hover:border-purple-500/40 transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleManualDirectionChange('right')}
                  title={isAr ? 'تحريك لليمين' : 'Scroll Right'}
                  aria-label={isAr ? 'تحريك لليمين' : 'Scroll Right'}
                  className="p-2.5 rounded-xl bg-[#09080f] border border-white/10 text-zinc-400 hover:text-white hover:border-purple-500/40 transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Marquee Carousel Track */}
      <motion.div style={{ y: carouselParallaxY }} className="will-change-transform">
        <div
          className="relative w-full overflow-hidden group select-none"
          dir="ltr"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {/* Left & Right Edge Fade Masks */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[#06050a] via-[#06050a]/90 to-transparent z-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[#06050a] via-[#06050a]/90 to-transparent z-20" />

          {/* Smooth Continuous Scrolling Track */}
          <div
            ref={scrollContainerRef}
            className={`flex gap-5 py-4 shrink-0 ${activeMarqueeClass} ${isPaused ? 'carousel-paused' : ''}`}
            style={{
              willChange: 'transform',
            }}
          >
            {carouselItems.map((partner, index) => {
              const isClient = partner.type === 'client';
              const uniqueKey = `${partner.id}-${index}`;
              const baseLength = filteredPartners.length > 0 ? filteredPartners.length : TRUST_PARTNERS.length;
              const isDuplicateCopy = index >= baseLength;
              const logoOpt = isClient
                ? getOptimizedImageProps(partner.logo, { isLogo: true, sizes: '52px' })
                : null;

              return (
                <div
                  key={uniqueKey}
                  dir={isAr ? 'rtl' : 'ltr'}
                  aria-hidden={isDuplicateCopy ? 'true' : undefined}
                  onClick={() => handlePartnerClick(partner)}
                  role="button"
                  tabIndex={isDuplicateCopy ? -1 : 0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handlePartnerClick(partner);
                    }
                  }}
                  className="group/card relative rounded-2xl bg-[#09080f]/95 border border-white/[0.08] hover:border-purple-500/35 p-5 sm:p-6 flex flex-col justify-between w-[270px] sm:w-[300px] shrink-0 transition-all duration-300 shadow-[0_12px_32px_rgba(0,0,0,0.65)] hover:-translate-y-1 cursor-pointer select-none overflow-hidden"
                >
                  {/* Card Top Row: Logo or Platform Icon */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="w-13 h-13 rounded-xl bg-black/50 border border-white/10 p-2 flex items-center justify-center shrink-0 group-hover/card:border-purple-500/30 transition-colors">
                      {isClient && partner.logo && logoOpt ? (
                        <img
                          src={logoOpt.src}
                          srcSet={logoOpt.srcSet}
                          sizes={logoOpt.sizes}
                          width={44}
                          height={44}
                          alt={isAr ? partner.nameAr : partner.nameEn}
                          className="w-full h-full object-contain transition-opacity duration-300"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : isClient ? (
                        <span className="text-sm font-black text-[#D6B88D] tracking-tight">
                          {partner.id === 'athar' ? 'أثـر' : partner.nameAr.slice(0, 2)}
                        </span>
                      ) : (
                        <div className="w-full h-full rounded-lg flex items-center justify-center bg-purple-950/30">
                          {partner.id.includes('salla') || partner.id.includes('zid') || partner.id.includes('shopify') ? (
                            <ShoppingBag className="w-5 h-5 text-purple-300" />
                          ) : partner.id.includes('meta') ? (
                            <Layers className="w-5 h-5 text-purple-300" />
                          ) : (
                            <TrendingUp className="w-5 h-5 text-purple-300" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Middle: Partner Name & Category */}
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-white group-hover/card:text-purple-200 transition-colors line-clamp-1">
                      {isAr ? partner.nameAr : partner.nameEn}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-400 line-clamp-1">
                      {isAr ? partner.categoryAr : partner.categoryEn}
                    </p>
                  </div>

                  {/* Card Bottom Row: Interactive Link */}
                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-end text-xs">
                    <span className="inline-flex items-center gap-1 text-[11px] text-purple-300 group-hover/card:text-white font-semibold transition-colors">
                      <span>{isClient ? (isAr ? 'عرض المشروع' : 'View Project') : (isAr ? 'استفسر الآن' : 'Inquire')}</span>
                      <ArrowRight className={`w-3 h-3 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

