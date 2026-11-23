import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { DigitalInsightsSection } from '../components/DigitalInsightsSection';
import { ScrollReveal } from '../components/ScrollReveal';
import { LiquidGlassButton } from '../components/LiquidGlassButton';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, BookOpen, Sparkles, MessageCircle } from 'lucide-react';

interface BlogPageProps {
  onNavigate: (page: string) => void;
  onOpenConsultation: () => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({
  onNavigate,
  onOpenConsultation,
}) => {
  const { isAr, dir } = useLanguage();

  return (
    <div className="relative min-h-screen">
      {/* 1. Page Header */}
      <PageHeader
        badge={isAr ? 'المدونة والمعرفة الاستراتيجية' : 'Digital Intelligence & Blog'}
        title={isAr ? 'المدونة والتحليلات' : 'Strategic Insights &'}
        highlightedTitle={isAr ? 'الرقمية المعمقة' : 'Market Intel'}
        sectionType="blog"
        videoSrc="/videos/pulse-video-6.mp4"
        description={
          isAr
            ? 'دراسات سوقية حصرية، نصائح في التجارة الإلكترونية، وتحليلات عميقة لسلوك المستهلك وخوارزميات المنصات الإعلانية يقدمها خبراء أذرع Pulse OCTO.'
            : 'Exclusive market audits, e-commerce playbooks, and in-depth analyses of consumer psychology and platform algorithms authored by Pulse OCTO strategists.'
        }
        onGoHome={() => onNavigate('home')}
        ctaText={isAr ? 'احجز استشارة رقمية' : 'Book Strategic Audit'}
        onCtaClick={() => onNavigate('contact')}
        secondaryCtaText={isAr ? 'عن المنظومة' : 'About The Core'}
        onSecondaryCtaClick={() => onNavigate('who-we-are')}
      />

      {/* 2. Full Digital Insights Section */}
      <DigitalInsightsSection onOpenConsultation={() => onNavigate('contact')} />

      {/* 3. Bottom CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <ScrollReveal variant="scale-up" threshold={0.2}>
          <div className="p-8 rounded-3xl bg-[#09080f] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
            <div className={dir === 'rtl' ? 'text-right' : 'text-left'}>
              <h3 className="text-xl font-bold text-white">
                {isAr ? 'تريد تطبيق هذه الاستراتيجيات في متجرك أو شركتك؟' : 'Ready to Deploy These Playbooks In Your Business?'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {isAr
                  ? 'تواصل معنا مباشرة لنضع خطة تسويقية قائمة على بيانات السوق الفعالة.'
                  : 'Connect with our team to formulate a tailor-made roadmap based on active market data.'}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <LiquidGlassButton
                onClick={() => onNavigate('contact')}
                variant="primary"
                size="md"
              >
                <span>{isAr ? 'تواصل معنا' : 'Contact Us'}</span>
                <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              </LiquidGlassButton>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};

