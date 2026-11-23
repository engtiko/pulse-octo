import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Direction } from '../types';

export interface Translations {
  [key: string]: {
    ar: string;
    en: string;
  };
}

export const TRANSLATIONS: Translations = {
  // Navigation
  'nav.home': { ar: 'الرئيسية', en: 'Home' },
  'nav.whoWeAre': { ar: 'عن الوكالة', en: 'Who We Are' },
  'nav.arms': { ar: 'منظومة الـ 8 أذرع', en: 'The 8 Arms' },
  'nav.portfolio': { ar: 'مشاريعنا', en: 'Projects' },
  'nav.blog': { ar: 'المدونة', en: 'Blog' },
  'nav.contact': { ar: 'تواصل معنا', en: 'Contact' },
  'nav.cta': { ar: 'ابدأ نبض مشروعك', en: 'Ignite Your Pulse' },
  'nav.solutions': { ar: 'القدرات والحلول', en: 'Solutions' },
  'nav.services': { ar: 'الخدمات الـ 8', en: 'The 8 Arms' },
  'nav.projects': { ar: 'مشاريعنا', en: 'Projects' },
  'nav.techStack': { ar: 'الترسانة التقنية', en: 'Tech Stack' },
  'nav.insights': { ar: 'المدونة والتحليلات', en: 'Blog & Insights' },
  'nav.roiCalculator': { ar: 'حاسبة العائد', en: 'ROI Calculator' },
  'nav.faq': { ar: 'الأسئلة الشائعة', en: 'FAQ' },
  'nav.methodology': { ar: 'منهجيتنا', en: 'Methodology' },
  'nav.consultation': { ar: 'تواصل معنا', en: 'Contact Us' },

  // Hero Section
  'hero.ticker1': { ar: 'جاهزون للتنفيذ الفوري', en: 'Ready for Immediate Deployment' },
  'hero.ticker2': { ar: 'المقر: مدينة بنها، مصر', en: 'HQ: Banha City, Egypt' },
  'hero.ticker3': { ar: 'استجابة مباشرة 24/7', en: 'Direct Response 24/7' },
  'hero.tagline': { ar: 'نبض نجاحك الرقمي', en: 'The Pulse of Digital Triumph' },
  'hero.subtitle': {
    ar: 'بأذرع ثمانية ممتدة في كل اتجاه، نصنع لك حضوراً رقمياً لا يُنسى. من الاستراتيجية إلى التنفيذ، ندمج الإبداع بالتكنولوجيا لنقود علامتك التجارية نحو الصدارة.',
    en: 'With eight specialized arms reaching across all digital frontiers, we forge unforgettable digital footprints. From strategic formulation to surgical execution, we blend creative vision with cutting-edge tech to propel your brand to the pinnacle.'
  },
  'hero.exploreBtn': { ar: 'ابدأ نبض مشروعك', en: 'Ignite Your Pulse' },
  'hero.consultationBtn': { ar: 'تواصل معنا', en: 'Contact Us' },

  // Agency Metrics
  'metrics.m1Val': { ar: '+120', en: '+120' },
  'metrics.m1Lbl': { ar: 'علامة تجارية تم بناؤها', en: 'Distinguished Brands Built' },
  'metrics.m1Sub': { ar: 'في مصر والشرق الأوسط', en: 'In Egypt & Middle East' },
  'metrics.m2Val': { ar: '4.8x', en: '4.8x' },
  'metrics.m2Lbl': { ar: 'متوسط عائد الإنفاق الإعلاني', en: 'Average Advertising ROAS' },
  'metrics.m2Sub': { ar: 'ROAS مستدام', en: 'Sustained Capital Growth' },
  'metrics.m3Val': { ar: '+35M', en: '+35M' },
  'metrics.m3Lbl': { ar: 'مشاهدة عضوية وممولة', en: 'Organic & Paid Reach' },
  'metrics.m3Sub': { ar: 'أنتجتها أذرعنا', en: 'Crafted by Our 8 Arms' },
  'metrics.m4Val': { ar: '98.5%', en: '98.5%' },
  'metrics.m4Lbl': { ar: 'نسبة رضا شركاء النجاح', en: 'Partner Satisfaction Rate' },
  'metrics.m4Sub': { ar: 'علاقات شراكة ممتدة', en: 'Enduring Client Trust' },

  // Services Section
  'services.badge': { ar: 'خدماتنا المتكاملة', en: 'Our Integrated Services' },
  'services.core': { ar: 'Pulse OCTO Core', en: 'Pulse OCTO Core' },
  'services.title': { ar: 'خدماتنا المتكاملة', en: 'Our Integrated Services' },
  'services.subtitle': {
    ar: 'منظومة متكاملة من 8 أذرع رقمية متخصصة تعمل بتناغم كامل لتحقيق أقصى نمو وعائد استثماري لعلامتك التجارية.',
    en: 'An integrated ecosystem of 8 specialized disciplines working in perfect synergy to maximize your brand growth and ROI.'
  },
  'services.mobileTip': { ar: 'اضغط على أي ذراع لعرض تفاصيل الخدمة بالكامل', en: 'Tap any arm to view complete service details' },
  'services.exploreMore': { ar: 'اكتشف تفاصيل الخدمة', en: 'Explore Arm Deliverables' },
  'services.requestService': { ar: 'طلب دراسة لهذه الخدمة', en: 'Request Consultation for This Arm' },
  'services.deliverablesHeader': { ar: 'أهم المخرجات والحلول:', en: 'Key Deliverables & Solutions:' },
  'services.metricHeader': { ar: 'مؤشر التميز:', en: 'Excellence Benchmark:' },
  'services.closeModal': { ar: 'إغلاق التفاصيل', en: 'Close Details' },

  // Eight Arms Section
  'arms.badge': { ar: 'آلية عمل استثنائية (Octopus Core Synergy)', en: 'Octopus Core Synergy Engine' },
  'arms.title': { ar: 'منهجية الأذرع الثمانية', en: 'The Eight-Arm Methodology' },
  'arms.subtitle': {
    ar: 'كيف تربط Pulse OCTO بين طموحات علامتك والنتائج الاستثمارية القياسية عبر شبكة أذرع ممتدة تنبض بالذكاء والإبداع.',
    en: 'How Pulse OCTO orchestrates your brand ambitions into record ROI through a synchronized network of intelligent, high-velocity arms.'
  },
  'arms.armLabel': { ar: 'الذراع', en: 'Arm' },
  'arms.goalLabel': { ar: 'الهدف الاستراتيجي:', en: 'Strategic Objective:' },
  'arms.impactLabel': { ar: 'التأثير الملموس:', en: 'Measurable Impact:' },
  'arms.metricLabel': { ar: 'المؤشر القياسي:', en: 'Benchmark Metric:' },
  'arms.intervention': { ar: 'تدخل أذرع Pulse OCTO:', en: 'Pulse OCTO Intervention:' },
  'arms.compTraditional': { ar: 'الوكالات التقليدية', en: 'Traditional Agencies' },
  'arms.compOcto': { ar: 'وكالة Pulse OCTO', en: 'Pulse OCTO Agency' },
  'arms.comp1Trad': { ar: 'أقسام معزولة وتأخير في دورة التسليم', en: 'Siloed departments & delayed turnarounds' },
  'arms.comp1Octo': { ar: 'شبكة أذرع متصلة ومزامنة فورية 24/7', en: 'Synchronized 8-arm network with instant execution' },
  'arms.comp2Trad': { ar: 'تركيز على المشاهدات دون مبيعات حقيقية', en: 'Vanity metrics with zero bottom-line focus' },
  'arms.comp2Octo': { ar: 'استهداف مباشر للـ ROAS والربحية المستدامة', en: 'Laser focus on ROAS & long-term brand equity' },
  'arms.comp3Trad': { ar: 'تكاليف مرتفعة وبطء في التعديل والمواكبة', en: 'Bloated retainers & rigid, sluggish workflows' },
  'arms.comp3Octo': { ar: 'مرونة تامة وأعلى عائد استثماري على كل قرش', en: 'Adaptive agility with maximum capital efficiency' },

  // Projects Section
  'projects.badge': { ar: 'مشاريع Pulse OCTO', en: 'Pulse OCTO Projects' },
  'projects.title': { ar: 'مشاريعنا', en: 'Projects' },
  'projects.masonry': { ar: 'معرض المشاريع والأعمال', en: 'Projects Showcase' },
  'projects.subtitle': {
    ar: 'مشاريع حقيقية نفذنا فيها الهويات البصرية، تصميمات السوشيال ميديا، وتطوير المتاجر والمواقع الإلكترونية.',
    en: 'Verified real-world projects showcasing brand identity systems, social media campaigns, and custom web development.'
  },
  'projects.filterAll': { ar: 'الكل', en: 'All' },
  'projects.filterStores': { ar: 'متاجر وهويات', en: 'E-Commerce & Brands' },
  'projects.filterCampaigns': { ar: 'حملات وسوشيال', en: 'Campaigns & Growth' },
  'projects.filterAI': { ar: 'ذكاء اصطناعي وإنتاج', en: 'AI & Visual Production' },
  'projects.viewDetails': { ar: 'استعراض المشروع', en: 'Explore Project' },
  'projects.viewCaseStudy': { ar: 'استعراض المشروع', en: 'Explore Project' },
  'projects.location': { ar: 'الموقع', en: 'Location' },
  'projects.year': { ar: 'السنة', en: 'Year' },
  'projects.duration': { ar: 'المدة', en: 'Duration' },
  'projects.client': { ar: 'العميل', en: 'Client' },

  // Project Modal
  'modal.overview': { ar: 'نظرة عامة على الشراكة', en: 'Partnership Overview' },
  'modal.challenge': { ar: 'التحدي السوقي', en: 'The Strategic Challenge' },
  'modal.solution': { ar: 'حل وتدخل Pulse OCTO', en: 'Pulse OCTO Solution & Intervention' },
  'modal.scope': { ar: 'نطاق العمل والتسليمات', en: 'Scope of Work & Deliverables' },
  'modal.testimonial': { ar: 'رأي الشريك', en: 'Partner Testimonial' },
  'modal.cta': { ar: 'ابدأ مشروعاً مشابهاً لعلامتك', en: 'Launch a Similar Project for Your Brand' },
  'modal.close': { ar: 'إغلاق', en: 'Close' },

  // Contact Section
  'contact.badge': { ar: 'جاهز لإطلاق نبض نجاحك؟', en: 'Ready to Ignite Your Digital Pulse?' },
  'contact.title': { ar: 'ابدأ رحلة التفوق مع Pulse OCTO', en: 'Initiate Your Dominance with Pulse OCTO' },
  'contact.subtitle': {
    ar: 'حدد الأذرع التي تحتاجها علامتك وسيقوم فريقنا بدراسة مشروعك وإعداد خطة تنفيذية مخصصة خلال ساعتين فقط.',
    en: 'Select the arms your brand requires and our strategists will engineer a customized action blueprint within 2 hours.'
  },
  'contact.whyChooseUs': { ar: 'لماذا يختارنا الشركاء؟', en: 'Why Partners Choose Us' },
  'contact.point1Title': { ar: 'منظومة موحدة بدون وسطاء', en: 'Unified Ecosystem, Zero Intermediaries' },
  'contact.point1Desc': {
    ar: 'لا حاجة للتعامل مع عدة شركات؛ ٨ أذرع تحت سقف واحد تنسق بينها بسلاسة تامة.',
    en: 'No dealing with fragmented agencies; 8 specialized arms under one roof collaborating with total synergy.'
  },
  'contact.point2Title': { ar: 'سرعة تنفيذ فائقة (Velocity)', en: 'Hyper-Velocity Execution' },
  'contact.point2Desc': {
    ar: 'نطلق حملاتك ومتجرك بجودة سينمائية قياسية في وقت يسبق منافسيك بخطوات.',
    en: 'Launching high-converting stores and campaigns with cinematic precision steps ahead of the competition.'
  },
  'contact.point3Title': { ar: 'تواصل مباشر ومستمر', en: 'Direct & Transparent Partnership' },
  'contact.point3Desc': {
    ar: 'مدير حساب مخصص وتقارير أداء أسبوعية حية تقيس العائد على الاستثمار بكل شفافية.',
    en: 'Dedicated account director and live weekly dashboards verifying real ROI and sustained capital growth.'
  },
  'contact.step1': { ar: '١. حدد الأذرع التي تحتاجها لعلامتك التجارية:', en: '1. Select the arms required for your brand:' },
  'contact.brandLabel': { ar: 'اسم العلامة التجارية / المشروع *', en: 'Brand / Project Name *' },
  'contact.brandPlaceholder': { ar: 'مثال: متجر لافندر للعطور', en: 'e.g. Lavender Perfumes' },
  'contact.contactLabel': { ar: 'اسمك الكريم *', en: 'Your Name *' },
  'contact.contactPlaceholder': { ar: 'مثال: أحمد السعيد', en: 'e.g. Ahmed El-Sayed' },
  'contact.phoneLabel': { ar: 'رقم الجوال أو الواتساب *', en: 'Mobile / WhatsApp Number *' },
  'contact.phonePlaceholder': { ar: '01116066968', en: '+20 111 606 6968' },
  'contact.budgetLabel': { ar: 'الميزانية الاستثمارية التقريبية', en: 'Estimated Investment Budget' },
  'contact.detailsLabel': { ar: 'تفاصيل وأهداف إضافية (اختياري)', en: 'Additional Goals & Scope (Optional)' },
  'contact.detailsPlaceholder': {
    ar: 'حدثنا عن أهدافك، التحديات الحالية، أو موعد إطلاقك المفضل...',
    en: 'Tell us about your objectives, current challenges, or target launch timeline...'
  },
  'contact.submitWhatsApp': { ar: 'إرسال الطلب ومناقشته فوراً عبر واتساب', en: 'Submit Brief & Launch via WhatsApp' },
  'contact.whatsappSuccess': {
    ar: 'تم فتح محادثة الواتساب بنجاح، فريقنا بانتظار رسالتك الآن!',
    en: 'WhatsApp chat opened successfully! Our team is awaiting your message.'
  },
  'contact.emailTitle': { ar: 'البريد الإلكتروني:', en: 'Direct Email:' },
  'contact.phoneTitle': { ar: 'رقم الاتصال المباشر:', en: 'Direct Phone:' },
  'contact.whatsappTitle': { ar: 'الواتساب المباشر:', en: 'Official WhatsApp:' },
  'contact.hqTitle': { ar: 'المقر الرئيسي:', en: 'Headquarters:' },
  'contact.hqVal': { ar: 'جمهورية مصر العربية — القليوبية — مدينة بنها', en: 'Banha City, Al Qalyubia, Egypt' },

  // FAQ Section
  'faq.badge': { ar: 'إجابات مباشرة وشفافة', en: 'Direct & Transparent Answers' },
  'faq.title': { ar: 'الأسئلة الأكثر شيوعاً', en: 'Frequently Asked Questions' },
  'faq.subtitle': {
    ar: 'كل ما تحتاج معرفته عن خدماتنا التسويقية، الميزانيات، المنهجية، وضمانات تحقيق العائد المالي على الاستثمار.',
    en: 'Everything you need to know about our digital marketing services, budgets, timelines, and verifiable ROI.'
  },
  'faq.searchPlaceholder': { ar: 'ابحث عن سؤالك (مثال: ميزانية، ROAS، مدة التسليم، متجر)...', en: 'Search questions (e.g. budget, ROAS, timeline, store)...' },
  'faq.categoryAll': { ar: 'جميع الأسئلة', en: 'All Questions' },
  'faq.categoryGeneral': { ar: 'الخدمات والمنهجية', en: 'Services & Methods' },
  'faq.categoryBudgets': { ar: 'الميزانيات والـ ROAS', en: 'Budgets & ROI' },
  'faq.categoryTimeline': { ar: 'المدة والتسليم', en: 'Timelines & Delivery' },
  'faq.categorySupport': { ar: 'المتابعة والتقارير', en: 'Reporting & Support' },
  'faq.notFound': { ar: 'لم يتم العثور على سؤال يطابق بحثك. تواصل معنا مباشرة للإجابة الفورية.', en: 'No matching questions found. Contact our team directly for instant clarification.' },
  'faq.ctaBadge': { ar: 'لم تجد إجابة سؤالك؟', en: 'Still Have Unanswered Questions?' },
  'faq.ctaTitle': { ar: 'تحدث مباشرة مع مستشارنا الرقمي', en: 'Speak Directly With Our Lead Strategist' },
  'faq.ctaDesc': {
    ar: 'فريق Pulse OCTO جاهز لدراسة مشروعك وتقديم استشارة استراتيجية مجانية وتقدير فني خلال ساعتين.',
    en: 'The Pulse OCTO team is on standby to audit your brand, evaluate growth potential, and provide a complimentary roadmap within 2 hours.'
  },
  'faq.chatWhatsApp': { ar: 'استفسر فوراً عبر واتساب', en: 'Chat on WhatsApp' },
  'faq.bookConsultation': { ar: 'طلب دراسة استشارية مجانية', en: 'Book Free Consultation' },

  // Sticky Actions
  'sticky.whatsappTooltip': { ar: 'تحدث مع خبير رقمي عبر واتساب', en: 'Chat with a Digital Strategist on WhatsApp' },
  'sticky.phoneTooltip': { ar: 'اتصال هاتفي مباشر', en: 'Direct Phone Call' },
  'sticky.modalTitle': { ar: 'تواصل هاتفي مباشر', en: 'Direct Telephone Inquiries' },
  'sticky.modalSubtitle': {
    ar: 'مستشارونا في Pulse OCTO متواجدون لمناقشة علامتك وتحديد الأذرع الأنسب لتحقيق أهدافك.',
    en: 'Our strategists at Pulse OCTO are ready to discuss your brand and tailor the optimal arms for your targets.'
  },
  'sticky.callBtn': { ar: 'اتصال هاتفي', en: 'Direct Call' },
  'sticky.whatsappBtn': { ar: 'واتساب', en: 'WhatsApp' },

  // Footer
  'footer.bio': {
    ar: 'وكالة رقمية متقدمة تدمج الإبداع بالتكنولوجيا عبر أذرع ثمانية متخصصة. نبني الهويات المؤثرة، نطلق المتاجر فائقة السرعة، ونقود حملات النمو لضمان تصدر علامتك في السوق.',
    en: 'An advanced digital agency fusing creative instinct with technology through eight synchronized arms. We build impactful identities, deploy high-speed e-commerce, and command growth campaigns to ensure market dominance.'
  },
  'footer.hq': {
    ar: 'المقر الرئيسي: جمهورية مصر العربية — القليوبية — مدينة بنها',
    en: 'Headquarters: Banha City, Al Qalyubia, Arab Republic of Egypt'
  },
  'footer.creativeArms': { ar: 'أذرع الإبداع والتنفيذ', en: 'Creative & Execution Arms' },
  'footer.growthArms': { ar: 'أذرع النمو والذكاء', en: 'Growth & Intelligence Arms' },
  'footer.quickLinks': { ar: 'التنقل السريع', en: 'Quick Navigation' },
  'footer.home': { ar: 'الواجهة الرئيسية', en: 'Main Interface' },
  'footer.methodology': { ar: 'منهجية الأذرع الثمانية', en: 'Eight-Arm Methodology' },
  'footer.partners': { ar: 'شركاء النجاح', en: 'Success Partners' },
  'footer.consultation': { ar: 'طلب استشارة مجانية', en: 'Request Free Consultation' },
  'footer.rights': { ar: 'جميع الحقوق محفوظة.', en: 'All rights reserved.' },
  'footer.agency': { ar: 'وكالة', en: 'Agency' },
  'footer.verified': { ar: 'شراكة رقمية موثوقة', en: 'Trusted Digital Partnership' },
  'footer.tagline': { ar: 'نبض نجاحك الرقمي', en: 'The Pulse of Digital Triumph' },
  'footer.backToTop': { ar: 'العودة للأعلى', en: 'Back to Top' },

  // Language Toggle
  'lang.switch': { ar: 'English', en: 'العربية' },
  'lang.ar': { ar: 'عربي', en: 'AR' },
  'lang.en': { ar: 'إنجليزي', en: 'EN' }
};

interface LanguageContextType {
  lang: Language;
  dir: Direction;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: string) => string;
  isAr: boolean;
  isEn: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check localStorage or default to 'ar'
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('pulse_octo_lang') as Language;
      return saved === 'en' || saved === 'ar' ? saved : 'ar';
    } catch {
      return 'ar';
    }
  });

  const dir: Direction = lang === 'ar' ? 'rtl' : 'ltr';

  // Synchronize document dir and lang attributes
  useEffect(() => {
    try {
      localStorage.setItem('pulse_octo_lang', lang);
    } catch {
      // ignore
    }

    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [lang, dir]);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
  };

  const toggleLang = () => {
    setLangState((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const t = (key: string): string => {
    const item = TRANSLATIONS[key];
    if (!item) return key;
    return item[lang] || item.ar || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        dir,
        setLang,
        toggleLang,
        t,
        isAr: lang === 'ar',
        isEn: lang === 'en'
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
