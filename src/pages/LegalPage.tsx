import React from 'react';
import { CheckCircle2, FileText, Lock, Mail, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface LegalPageProps {
  mode: 'privacy' | 'terms';
  onNavigate?: (page: string) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ mode, onNavigate }) => {
  const { isAr, dir } = useLanguage();
  const isPrivacy = mode === 'privacy';

  const handleNav = (e: React.MouseEvent, target: string) => {
    if (!onNavigate) return;
    e.preventDefault();
    onNavigate(target);
  };

  return (
    <section
      dir={dir}
      className="relative min-h-[82vh] pt-28 sm:pt-36 pb-20 px-4 sm:px-6 lg:px-8 bg-[#030108] text-white"
    >
      <div className="max-w-4xl mx-auto">
        <div className="rounded-3xl bg-[#090612]/90 border border-white/[0.14] p-6 sm:p-10 lg:p-12 shadow-[0_24px_80px_rgba(0,0,0,0.75)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-white/[0.06] border border-purple-400/35 flex items-center justify-center text-[#c9b3ff]">
              {isPrivacy ? <Lock className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#c9b3ff] block">
                PULSE OCTO — {isAr ? 'المعايير القانونية المعتمدة' : 'OFFICIAL LEGAL STANDARDS'}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mt-1 leading-tight">
                {isPrivacy
                  ? isAr
                    ? 'سياسة الخصوصية وحماية البيانات'
                    : 'Privacy & Data Protection Policy'
                  : isAr
                    ? 'الشروط والأحكام ومستوى الخدمة'
                    : 'Terms of Service & Standards'}
              </h1>
            </div>
          </div>

          <div className="space-y-5 text-sm sm:text-base text-[#e6e2f2] leading-relaxed">
            {isPrivacy ? (
              <>
                <p>
                  {isAr
                    ? 'في وكالة Pulse OCTO، نعتبر سرية بيانات شركائنا واستراتيجياتهم التسويقية أمانة مطلقة. نلتزم بأعلى معايير حماية البيانات والشفافية الرقمية وفق المعايير العالمية.'
                    : 'At Pulse OCTO, partner confidentiality and proprietary campaign data are treated with unconditional integrity. We uphold the strictest standards of digital transparency and security.'}
                </p>

                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#c9b3ff] shrink-0" />
                    <span>{isAr ? '١. ملكية البيانات والأصول' : '1. Asset & Data Ownership'}</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-[#a39bb5]">
                    {isAr
                      ? 'كافة التصاميم، الشيفرات البرمجية، والمواد الإعلانية المطورة لصالح شريكنا هي ملكية حصرية وخاصة له بمجرد تسليمها واعتمادها.'
                      : 'All created brandmarks, digital collateral, codebases, and media creatives belong exclusively to our client upon delivery and sign-off.'}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#c9b3ff] shrink-0" />
                    <span>{isAr ? '٢. اتفاقيات عدم الإفصاح (NDA)' : '2. Non-Disclosure Agreements (NDA)'}</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-[#a39bb5]">
                    {isAr
                      ? 'نوفر اتفاقيات سرية معتمدة قبل البدء بأي حملة أو مشروع لحماية الخطط التشغيلية والأرقام المالية لشريك النجاح.'
                      : 'Formal non-disclosure agreements are available prior to engagement commencement to secure strategic intelligence and financial metrics.'}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#c9b3ff] shrink-0" />
                    <span>{isAr ? '٣. استخدام بيانات التواصل والاستشارات' : '3. Consultation & Contact Data Usage'}</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-[#a39bb5]">
                    {isAr
                      ? 'تُستخدم بيانات التواصل المُرسلة عبر الموقع أو واتساب حصراً للرد على استفسارات مشروعك وإعداد خطط العمل المقترحة، ولا يتم بيعها أو مشاركتها مع أي طرف ثالث.'
                      : 'Contact details submitted through our website or WhatsApp are used solely to respond to your project inquiries and prepare tailored proposals, and are never sold or shared with third parties.'}
                  </p>
                </div>
              </>
            ) : (
              <>
                <p>
                  {isAr
                    ? 'تُبنى علاقتنا مع الشركاء على وضوح الالتزامات وسرعة التنفيذ والتنسيق التام بين الأذرع الثمانية دون أي تعارض أو إبطاء.'
                    : 'Our partner engagements are governed by explicit milestones, disciplined execution, and synchronized coordination across all eight arms.'}
                </p>

                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#c9b3ff] shrink-0" />
                    <span>{isAr ? '١. التزام الجودة والجاهزية' : '1. Service Level Commitment'}</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-[#a39bb5]">
                    {isAr
                      ? 'استجابة مباشرة ومتابعة حية عبر مدير حساب مخصص، مع تقارير دورية تقيس مؤشرات الأداء الحقيقية.'
                      : 'Direct communication via dedicated client leadership, backed by regular verifiable analytics tracking real campaign performance.'}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#c9b3ff] shrink-0" />
                    <span>{isAr ? '٢. منهجية التكامل الرقمي' : '2. Integrated Ecosystem Methodology'}</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-[#a39bb5]">
                    {isAr
                      ? 'نعمل كنظام رقمي واحد متصل بدلاً من خدمات منفصلة لضمان أقصى كفاءة مالية وتسويقية لمشروعك.'
                      : 'Pulse OCTO functions as a singular unified growth system rather than fragmented services, guaranteeing peak fiscal and creative impact.'}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#c9b3ff] shrink-0" />
                    <span>{isAr ? '٣. شفافية النطاق والميزانيات' : '3. Scope & Ad Spend Transparency'}</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-[#a39bb5]">
                    {isAr
                      ? 'تُحدد المخرجات والمواعيد النهائية بوضوح قبل بدء التنفيذ، وتبقى الحسابات الإعلانية والإنفاق الإعلاني تحت ملكية العميل المباشرة.'
                      : 'Deliverables and schedules are explicitly agreed prior to execution, and ad accounts and direct platform media spend remain under full client ownership.'}
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="mailto:CEO@pulseOCTO.com"
                className="inline-flex items-center gap-1.5 font-mono text-[#e6e2f2] hover:text-white transition-colors"
                dir="ltr"
              >
                <Mail className="w-4 h-4 text-[#c9b3ff]" />
                <span>CEO@pulseOCTO.com</span>
              </a>
              <a
                href={isPrivacy ? '/terms' : '/privacy'}
                onClick={(e) => handleNav(e, isPrivacy ? 'terms' : 'privacy')}
                className="text-[#c9b3ff] hover:text-white font-semibold transition-colors"
              >
                {isPrivacy
                  ? isAr
                    ? 'الانتقال إلى الشروط والأحكام'
                    : 'View Terms of Service'
                  : isAr
                    ? 'الانتقال إلى سياسة الخصوصية'
                    : 'View Privacy Policy'}
              </a>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="/contact"
                onClick={(e) => handleNav(e, 'contact')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-br from-[#9d65f5] via-[#5e2ec0] to-[#2b145c] text-white font-bold border border-[#d6c5ff]/40 transition-all"
              >
                <span>{isAr ? 'تواصل معنا' : 'Contact Us'}</span>
                <ArrowRight className={`w-3.5 h-3.5 ${isAr ? 'rotate-180' : ''}`} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
