import React from 'react';
import { PageHeader } from '../components/PageHeader';
import { CorePhilosophySection } from '../components/about/CorePhilosophySection';
import { VisionMissionValuesSection } from '../components/about/VisionMissionValuesSection';
import { CeoLeadershipSection } from '../components/about/CeoLeadershipSection';
import { CompetitiveEdgeSection } from '../components/about/CompetitiveEdgeSection';
import { ArmsProficiencySection } from '../components/ArmsProficiencySection';
import { TechStackSection } from '../components/TechStackSection';
import { HomeFAQ } from '../components/HomeFAQ';
import { SectionDivider } from '../components/SectionDivider';
import { ScrollReveal } from '../components/ScrollReveal';
import { LiquidGlassButton } from '../components/LiquidGlassButton';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight } from 'lucide-react';

interface WhoWeArePageProps {
  onNavigate: (page: string) => void;
  onOpenConsultation: () => void;
  onSelectServiceForConsultation?: (serviceTitle: string) => void;
}

export const WhoWeArePage: React.FC<WhoWeArePageProps> = ({
  onNavigate,
  onOpenConsultation,
  onSelectServiceForConsultation,
}) => {
  const { isAr, dir } = useLanguage();

  return (
    <div className="relative min-h-screen">
      {/* 1. Page Header */}
      <PageHeader
        badge={isAr ? 'عن Pulse OCTO — الهوية والرسالة' : 'Pulse OCTO Identity & Mission'}
        title={isAr ? 'وكالة تسويق رقمية برؤية' : 'A Digital Agency Powered by'}
        highlightedTitle={isAr ? 'الأخطبوط المتكامل' : 'Octopus Synergy'}
        sectionType="about"
        videoSrc="/videos/pulse-video-9.mp4"
        description={
          isAr
            ? 'نحن Pulse OCTO، وكالة تسويق وهندسة رقمية تأسست لنحدث ثورة في نمو العلامات التجارية عبر 8 أذرع متخصصة تعمل معاً ككيان واحد ومركزي في بنها ومصر والشرق الأوسط.'
            : 'We are Pulse OCTO, a digital marketing and visual engineering agency architected to spark exponential brand momentum across 8 synchronized specialized arms operating from Egypt across the MENA region.'
        }
        onGoHome={() => onNavigate('home')}
        ctaText={isAr ? 'ابدأ نبض مشروعك' : 'Ignite Your Project'}
        onCtaClick={() => onNavigate('contact')}
        secondaryCtaText={isAr ? 'استكشف الـ 8 أذرع' : 'Explore 8 Arms'}
        onSecondaryCtaClick={() => onNavigate('the-8-arms')}
      />

      {/* 2. فلسفة المنظومة: 8 أذرع.. عقل واحد.. نبض واحد (The Core Philosophy) */}
      <CorePhilosophySection />

      <SectionDivider variant="gold" />

      {/* 3. الرؤية والرسالة والقيم الجوهرية (Vision, Mission & Values) */}
      <VisionMissionValuesSection />

      <SectionDivider variant="gold" />

      {/* 4. خلف النبض: القيادة والاستوديو (Behind the Pulse - م. طارق وجيه) */}
      <CeoLeadershipSection
        onOpenConsultation={onOpenConsultation}
        onNavigate={onNavigate}
      />

      <SectionDivider variant="gold" />

      {/* 5. لماذا Pulse Octo؟ (The Competitive Edge - المقارنة الحاسمة) */}
      <CompetitiveEdgeSection
        onNavigate={onNavigate}
        onOpenConsultation={onOpenConsultation}
      />

      <SectionDivider variant="gold" />

      {/* 6. Technical Proficiency Across the 8 Arms (الكفاءة التشغيلية والبرمجية) */}
      <ArmsProficiencySection onOpenConsultation={onOpenConsultation} />

      <SectionDivider variant="gold" />

      {/* 7. Tech Stack & Digital Arsenal (الترسانة التكنولوجية) */}
      <TechStackSection onOpenConsultation={onOpenConsultation} />

      <SectionDivider variant="gold" />

      {/* 8. Dynamic JSON-LD FAQ Section (الأسئلة الشائعة وهيكلة البيانات) */}
      <HomeFAQ onOpenConsultation={onOpenConsultation} />

      {/* 9. Bottom Navigation Strip */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <ScrollReveal variant="scale-up" threshold={0.2}>
          <div className="p-8 rounded-3xl bg-[#09080f] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
            <div className={dir === 'rtl' ? 'text-right' : 'text-left'}>
              <h3 className="text-xl font-bold text-white">
                {isAr ? 'تريد رؤية آلية عمل الأذرع بالكامل؟' : 'Explore The Synchronized 8 Arms System'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {isAr
                  ? 'تعرف على التكامل بين التخصصات الثمانية وكيف تعمل كنظام واحد لعلامتك.'
                  : 'Discover how all 8 disciplines operate as one unified system for your brand.'}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <LiquidGlassButton
                onClick={() => onNavigate('the-8-arms')}
                variant="primary"
                size="md"
              >
                <span>{isAr ? 'منظومة الـ 8 أذرع' : 'The 8 Arms System'}</span>
                <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              </LiquidGlassButton>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
};
