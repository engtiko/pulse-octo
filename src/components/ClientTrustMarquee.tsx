import React, { useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ScrollReveal } from './ScrollReveal';
import { ArrowUpRight, Pause, Play } from 'lucide-react';
import { getOptimizedImageProps } from '../utils/imageOptimizer';

export interface ClientLogoItem {
  id: string;
  nameAr: string;
  nameEn: string;
  sectorAr: string;
  sectorEn: string;
  deliverableAr: string;
  deliverableEn: string;
  logo: string;
  websiteUrl?: string;
  projectSlug: string;
}

/**
 * Verified real client companies from PULSE OCTO's portfolio.
 */
export const CLIENT_TRUST_LOGOS: ClientLogoItem[] = [
  {
    id: 'ladies-shop',
    nameAr: 'ليديز شوب (Ladies Shop)',
    nameEn: 'Ladies Shop',
    sectorAr: 'العناية والجمال',
    sectorEn: 'Luxury Beauty',
    deliverableAr: 'هوية بصرية ومتجر إلكتروني',
    deliverableEn: 'Brand System & E-Commerce',
    logo: '/projects/logo%20L.webp',
    websiteUrl: 'https://www.ladiesshop-store.com',
    projectSlug: 'ladies-shop',
  },
  {
    id: 'zeyad-optical',
    nameAr: 'نظارات زياد (Zeyad Optical)',
    nameEn: 'Zeyad Optical',
    sectorAr: 'بصريات ونظارات',
    sectorEn: 'Eyewear & Optics',
    deliverableAr: 'هوية بصرية واستوديو تصوير',
    deliverableEn: 'Identity & Commercial Studio',
    logo: '/projects/zeyad-logo.webp',
    projectSlug: 'zeyad-optical',
  },
  {
    id: 'namaa-academy',
    nameAr: 'أكاديمية النماء للتربية الخاصة',
    nameEn: 'Al-Namaa Academy',
    sectorAr: 'تأهيل وتعليم متخصص',
    sectorEn: 'Special Education',
    deliverableAr: 'هوية بصرية ومنصة رقمية',
    deliverableEn: 'Visual Identity & Web Portal',
    logo: '/projects/n-logo.webp',
    projectSlug: 'namaa-academy',
  },
  {
    id: 'halan-delivery',
    nameAr: 'حالا دليفري (Halan Delivery)',
    nameEn: 'Halan Delivery',
    sectorAr: 'الخدمات اللوجستية والتوصيل',
    sectorEn: 'On-Demand Logistics',
    deliverableAr: 'هوية بصرية وتطبيقات الأسطول',
    deliverableEn: 'Brand Identity & Fleet Decals',
    logo: '/projects/h-logo.webp',
    projectSlug: 'halan-delivery',
  },
  {
    id: 'adamco-fleet',
    nameAr: 'أدمكو للنقل والرحلات (Adamco)',
    nameEn: 'Adamco Transport',
    sectorAr: 'نقل الموظفين والقطاع الصناعي',
    sectorEn: 'Corporate & Industrial Transit',
    deliverableAr: 'هوية بصرية وتصميمات وإنتاج مرئي',
    deliverableEn: 'Brand Identity & Video Production',
    logo: '/projects/Adamco%20logo.webp',
    projectSlug: 'adamco',
  },
  {
    id: 'athar',
    nameAr: 'أثر (Athar) — أزياء محجبات مصرية 100%',
    nameEn: 'Athar — Egyptian Modest Fashion',
    sectorAr: 'تصميم وتنفيذ ملابس المحجبات',
    sectorEn: 'Modest Fashion & Tailoring',
    deliverableAr: 'الشعار والهيدر والهوية البصرية',
    deliverableEn: 'Brandmark, Header & Visual System',
    logo: '/assets/aistudio/Logo_AThar_52ab6b2b.jpg',
    projectSlug: 'athar',
  },
];

interface ClientTrustMarqueeProps {
  onNavigate?: (page: string) => void;
  onOpenConsultation?: () => void;
}

export const ClientTrustMarquee: React.FC<ClientTrustMarqueeProps> = ({
  onNavigate,
  onOpenConsultation,
}) => {
  const { isAr, dir } = useLanguage();
  const [isPaused, setIsPaused] = useState(false);

  // Repeat list enough times for a seamless 50% CSS marquee loop across ultra-wide viewports
  const marqueeTrackItems = useMemo(() => {
    const singleHalf = [
      ...CLIENT_TRUST_LOGOS,
      ...CLIENT_TRUST_LOGOS,
      ...CLIENT_TRUST_LOGOS,
    ];
    return [...singleHalf, ...singleHalf];
  }, []);

  const handleSelectClient = () => {
    if (typeof document !== 'undefined') {
      const portfolioEl = document.getElementById('portfolio-section');
      if (portfolioEl) {
        portfolioEl.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    if (onNavigate) {
      onNavigate('portfolio');
    } else if (onOpenConsultation) {
      onOpenConsultation();
    }
  };

  return (
    <section
      id="client-trust-marquee"
      aria-label={
        isAr
          ? 'شعارات الشركات والعلامات التجارية التي عملت معها الوكالة'
          : 'Client Companies & Brands Trusted By Pulse Octo'
      }
      className="relative w-full py-12 sm:py-16 bg-[#06050a] border-y border-white/[0.07] overflow-hidden"
    >
      {/* Restrained Ambient Violet Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[180px] bg-purple-900/10 blur-[120px] rounded-full"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <ScrollReveal variant="fade-up" threshold={0.1}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-wider text-purple-400 mb-2">
                {isAr
                  ? 'شركاء النجاح · علامات تجارية حقيقية'
                  : 'Verified Client Roster · Proven Brand Partnerships'}
              </p>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight text-balance">
                {isAr
                  ? 'علامات تجارية وشركات بنينا منظومتها الرقمية'
                  : 'Companies Scaling With Our Integrated Growth System'}
              </h2>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                aria-label={
                  isPaused
                    ? isAr
                      ? 'تشغيل شريط الشعارات'
                      : 'Resume client logo marquee'
                    : isAr
                      ? 'إيقاف شريط الشعارات مؤقتاً'
                      : 'Pause client logo marquee'
                }
                title={
                  isPaused
                    ? isAr
                      ? 'تشغيل الحركة'
                      : 'Resume marquee'
                    : isAr
                      ? 'إيقاف الحركة مؤقتاً'
                      : 'Pause marquee'
                }
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#09080f] border border-white/10 hover:border-purple-500/40 text-xs font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer min-h-[40px]"
              >
                {isPaused ? (
                  <Play className="w-3.5 h-3.5 text-purple-400" />
                ) : (
                  <Pause className="w-3.5 h-3.5 text-zinc-400" />
                )}
                <span>
                  {isPaused
                    ? isAr
                      ? 'تشغيل'
                      : 'Play'
                    : isAr
                      ? 'إيقاف مؤقت'
                      : 'Pause'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleSelectClient}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#09080f] border border-white/10 hover:border-purple-500/40 text-xs font-semibold text-purple-300 hover:text-white transition-colors cursor-pointer min-h-[40px]"
              >
                <span>
                  {isAr ? 'استعراض سابقة الأعمال' : 'Explore Case Studies'}
                </span>
                <ArrowUpRight
                  className={`w-3.5 h-3.5 ${dir === 'rtl' ? '-scale-x-100' : ''}`}
                />
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Continuous Logo Marquee Viewport */}
      <div
        dir="ltr"
        className="relative w-full overflow-hidden select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Edge Gradient Masks */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-14 sm:w-28 bg-gradient-to-r from-[#06050a] via-[#06050a]/85 to-transparent z-10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-14 sm:w-28 bg-gradient-to-l from-[#06050a] via-[#06050a]/85 to-transparent z-10"
        />

        {/* Marquee Track */}
        <div
          className={`flex items-stretch gap-4 sm:gap-5 py-2 ${
            isAr ? 'animate-marquee-right' : 'animate-marquee-left'
          } ${isPaused ? 'carousel-paused' : ''}`}
        >
          {marqueeTrackItems.map((client, idx) => {
            const isDuplicate = idx >= CLIENT_TRUST_LOGOS.length;
            const clientName = isAr ? client.nameAr : client.nameEn;
            const clientSector = isAr ? client.sectorAr : client.sectorEn;
            const clientDeliverable = isAr
              ? client.deliverableAr
              : client.deliverableEn;
            const logoOpt = getOptimizedImageProps(client.logo, {
              isLogo: true,
              sizes: '56px',
            });

            return (
              <button
                key={`${client.id}-${idx}`}
                type="button"
                dir={isAr ? 'rtl' : 'ltr'}
                aria-hidden={isDuplicate ? 'true' : undefined}
                tabIndex={isDuplicate ? -1 : 0}
                onClick={handleSelectClient}
                className="group relative flex items-center gap-4 px-5 py-4 rounded-2xl bg-[#09080f]/90 border border-white/[0.08] hover:border-purple-500/40 hover:bg-[#0d0b18] transition-all duration-300 shrink-0 text-start cursor-pointer min-w-[260px] sm:min-w-[295px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/70"
              >
                {/* Logo Emblem Frame */}
                <div className="w-14 h-14 rounded-xl bg-black/60 border border-white/10 group-hover:border-purple-500/35 p-2.5 flex items-center justify-center shrink-0 transition-colors">
                  {client.logo ? (
                    <img
                      src={logoOpt.src}
                      srcSet={logoOpt.srcSet}
                      sizes={logoOpt.sizes}
                      alt={
                        isAr
                          ? `شعار ${client.nameAr} — ${client.deliverableAr} من تنفيذ وكالة Pulse OCTO`
                          : `${client.nameEn} logo — ${client.deliverableEn} by Pulse OCTO`
                      }
                      loading="lazy"
                      decoding="async"
                      width={48}
                      height={48}
                      className="w-full h-full object-contain opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                    />
                  ) : (
                    <span className="text-base font-black text-[#D6B88D] tracking-tight">
                      {client.id === 'athar' ? 'أثـر' : clientName.slice(0, 2)}
                    </span>
                  )}
                </div>

                {/* Unboxed Editorial Client Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm sm:text-base font-bold text-white group-hover:text-purple-200 transition-colors truncate">
                      {clientName}
                    </p>
                    <ArrowUpRight
                      className={`w-3.5 h-3.5 text-zinc-500 group-hover:text-purple-300 transition-colors shrink-0 ${
                        dir === 'rtl' ? '-scale-x-100' : ''
                      }`}
                    />
                  </div>

                  <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-400 truncate">
                    <span className="text-purple-300/90 font-medium truncate">
                      {clientSector}
                    </span>
                    <span aria-hidden="true" className="text-zinc-600">
                      ·
                    </span>
                    <span className="truncate">{clientDeliverable}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
