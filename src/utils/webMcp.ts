/**
 * WebMCP (navigator.modelContext) Tool Registration for Pulse OCTO
 * Exposes safe, read-only agency discovery and in-browser navigation tools
 * to WebMCP-capable browser agents on page load.
 */

export interface WebMcpToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (input?: Record<string, unknown>) => Promise<unknown> | unknown;
}

interface ModelContextLike {
  registerTool?: (tool: WebMcpToolDefinition) => void;
  provideContext?: (context: { tools: WebMcpToolDefinition[] }) => void;
}

declare global {
  interface Navigator {
    modelContext?: ModelContextLike;
  }
}

const PULSE_OCTO_ARMS_SUMMARY = [
  {
    id: 1,
    slug: 'branding',
    url: 'https://www.pulseocto.com/branding',
    nameAr: '01 الهوية وبناء العلامة',
    nameEn: '01 Branding & Visual Identity',
    summaryAr: 'تصميم الشعارات، الهوية البصرية المتكاملة، أدلة العلامة التجارية، والتغليف.',
    summaryEn: 'Logo design, visual identity systems, brand guidelines, and packaging.',
  },
  {
    id: 2,
    slug: 'digital-marketing',
    url: 'https://www.pulseocto.com/digital-marketing',
    nameAr: '02 التسويق الرقمي والإعلانات الممولة',
    nameEn: '02 Digital Marketing & Paid Media',
    summaryAr: 'إدارة الحملات الممولة على Meta وGoogle وTikTok وSnapchat وإدارة السوشيال ميديا.',
    summaryEn: 'Performance media buying on Meta, Google, TikTok, Snapchat, and social media management.',
  },
  {
    id: 3,
    slug: 'web-ecommerce',
    url: 'https://www.pulseocto.com/web-ecommerce',
    nameAr: '03 برمجة المواقع والمتاجر الإلكترونية',
    nameEn: '03 Custom Web & E-Commerce Development',
    summaryAr: 'تطوير مواقع ومتاجر إلكترونية مخصصة بالكامل ومنصات Shopify وSalla وZid وWooCommerce.',
    summaryEn: 'Custom websites, web applications, and high-converting e-commerce stores.',
  },
  {
    id: 4,
    slug: 'creative-studio',
    url: 'https://www.pulseocto.com/creative-studio',
    nameAr: '04 الاستوديو والإنتاج الإبداعي',
    nameEn: '04 Creative Studio & Production',
    summaryAr: 'الإنتاج الإعلاني والسينمائي، تصوير المنتجات، الموشن جرافيك، Reels، و3D/CGI.',
    summaryEn: 'Commercial video production, product photography, motion graphics, Reels, and 3D/CGI.',
  },
  {
    id: 5,
    slug: 'digital-products',
    url: 'https://www.pulseocto.com/digital-products',
    nameAr: '05 المنتجات والحلول الرقمية والأتمتة',
    nameEn: '05 Digital Products & Automation',
    summaryAr: 'تطبيقات الموبايل، أنظمة الويب المخصصة، لوحات التحكم، وأتمتة الأعمال وربط API.',
    summaryEn: 'Mobile apps, custom web platforms, dashboards, and CRM/API workflow automation.',
  },
  {
    id: 6,
    slug: 'brand-strategy',
    url: 'https://www.pulseocto.com/brand-strategy',
    nameAr: '06 الاستراتيجية ودراسة السوق',
    nameEn: '06 Brand Strategy & Market Research',
    summaryAr: 'دراسات السوق والمنافسين، تحديد التموضع التسويقي، وبناء رحلة العميل وخطط الإطلاق.',
    summaryEn: 'Market research, competitor analysis, brand positioning, and go-to-market strategy.',
  },
  {
    id: 7,
    slug: 'content-creation',
    url: 'https://www.pulseocto.com/content-creation',
    nameAr: '07 صناعة المحتوى والكتابة الإعلانية',
    nameEn: '07 Content Creation & Copywriting',
    summaryAr: 'الكتابة الإعلانية البيعية (Copywriting)، خطط المحتوى، وكتابة سيناريوهات الإعلانات.',
    summaryEn: 'Conversion copywriting, creative content systems, and commercial scriptwriting.',
  },
  {
    id: 8,
    slug: 'seo-growth',
    url: 'https://www.pulseocto.com/seo-growth',
    nameAr: '08 النمو وتصدر محركات البحث SEO',
    nameEn: '08 SEO & Growth Optimization',
    summaryAr: 'تحسين محركات البحث الداخلي والتقني SEO، تحسين معدل التحويل CRO، وتحليلات GA4 وCAPI.',
    summaryEn: 'Technical SEO, conversion rate optimization (CRO), and GA4/CAPI tracking.',
  },
];

const PULSE_OCTO_PORTFOLIO_SUMMARY = [
  { id: 'ladies-shop', client: 'ليديز شوب (Ladies Shop)', scope: 'Brand Identity & E-Commerce' },
  { id: 'zeyad-optical', client: 'نظارات زياد (Zeyad Optical)', scope: 'Brand Identity & Studio Product Photography' },
  { id: 'al-namaa', client: 'أكاديمية النماء للتربية الخاصة (Al-Namaa Academy)', scope: 'Brand Identity & Digital Platform' },
  { id: 'halan-delivery', client: 'حالا دليفري (Halan Delivery)', scope: 'Brand Identity & Fleet Applications' },
  { id: 'adamco', client: 'أدمكو للنقل والرحلات (Adamco)', scope: 'Brand Identity, Design & Media Production' },
  { id: 'athar', client: 'أثر (Athar)', scope: 'Modest Fashion Brand Identity & Lookbook' },
];

const VALID_NAVIGATION_TARGETS = new Set([
  'home',
  'about',
  'who-we-are',
  'the-8-arms',
  'services',
  'portfolio',
  'blog',
  'contact',
  'privacy',
  'terms',
  'branding',
  'digital-marketing',
  'web-ecommerce',
  'creative-studio',
  'digital-products',
  'brand-strategy',
  'content-creation',
  'seo-growth',
]);

let webMcpRegistered = false;

export function registerPulseOctoWebMcpTools(): void {
  if (webMcpRegistered || typeof navigator === 'undefined') return;
  const modelContext = navigator.modelContext;
  if (!modelContext) return;

  const tools: WebMcpToolDefinition[] = [
    {
      name: 'get_agency_overview',
      description:
        'Get Pulse OCTO agency profile, brand philosophy, Benha Egypt location, verified phone/WhatsApp/email contact info, and legal page URLs.',
      inputSchema: {
        type: 'object',
        properties: {
          lang: {
            type: 'string',
            enum: ['ar', 'en'],
            description: 'Preferred language for summary text (ar or en).',
          },
        },
        additionalProperties: false,
      },
      execute: async (input) => {
        const lang = input?.lang === 'en' ? 'en' : 'ar';
        return {
          name: 'Pulse OCTO',
          tagline: 'YOUR DIGITAL PULSE.',
          philosophy: 'ONE BRAND. ONE SYSTEM. ONE PULSE. (8 ARMS. ONE SYSTEM.)',
          summary:
            lang === 'en'
              ? 'Pulse OCTO is an integrated Egyptian digital marketing, branding, software, and growth agency headquartered in Benha, Qalyubia, Egypt.'
              : 'Pulse OCTO وكالة تسويق رقمي وحلول برمجية متكاملة في بنها ومصر، تعمل بمنظومة الأذرع الثمانية المتصلة.',
          website: 'https://www.pulseocto.com/',
          location: 'Farid Nada Street, New Benha, Qalyubia, Egypt',
          contact: {
            phone: '+201112998882',
            whatsapp: 'https://wa.me/201116066968',
            email: 'CEO@pulseOCTO.com',
          },
          pages: {
            about: 'https://www.pulseocto.com/about',
            services: 'https://www.pulseocto.com/services',
            portfolio: 'https://www.pulseocto.com/portfolio',
            contact: 'https://www.pulseocto.com/contact',
            privacy: 'https://www.pulseocto.com/privacy',
            terms: 'https://www.pulseocto.com/terms',
          },
        };
      },
    },
    {
      name: 'list_pulse_octo_arms',
      description: 'List all 8 integrated digital agency arms of Pulse OCTO with descriptions and URLs.',
      inputSchema: {
        type: 'object',
        properties: {
          lang: {
            type: 'string',
            enum: ['ar', 'en'],
            description: 'Preferred response language (ar or en).',
          },
        },
        additionalProperties: false,
      },
      execute: async (input) => {
        const isEn = input?.lang === 'en';
        return {
          system: '8 ARMS. ONE SYSTEM.',
          arms: PULSE_OCTO_ARMS_SUMMARY.map((arm) => ({
            id: arm.id,
            slug: arm.slug,
            url: arm.url,
            name: isEn ? arm.nameEn : arm.nameAr,
            summary: isEn ? arm.summaryEn : arm.summaryAr,
          })),
        };
      },
    },
    {
      name: 'list_portfolio_projects',
      description: 'List real verified portfolio projects built by Pulse OCTO.',
      inputSchema: {
        type: 'object',
        properties: {},
        additionalProperties: false,
      },
      execute: async () => ({
        portfolioUrl: 'https://www.pulseocto.com/portfolio',
        projects: PULSE_OCTO_PORTFOLIO_SUMMARY,
      }),
    },
    {
      name: 'navigate_to_section',
      description:
        'Navigate the current Pulse OCTO browser tab to a specific agency page or one of the 8 arm pages.',
      inputSchema: {
        type: 'object',
        properties: {
          page: {
            type: 'string',
            enum: Array.from(VALID_NAVIGATION_TARGETS),
            description: 'Target route slug (e.g. home, about, services, portfolio, contact, terms, privacy, branding, seo-growth).',
          },
        },
        required: ['page'],
        additionalProperties: false,
      },
      execute: async (input) => {
        const rawPage = typeof input?.page === 'string' ? input.page.trim().toLowerCase() : 'home';
        const target = VALID_NAVIGATION_TARGETS.has(rawPage) ? rawPage : 'home';
        const path = target === 'home' ? '/' : `/${target}`;
        if (typeof window !== 'undefined') {
          window.history.pushState({}, '', path);
          window.dispatchEvent(new PopStateEvent('popstate'));
        }
        return {
          navigated: true,
          path,
          url: `https://www.pulseocto.com${path}`,
        };
      },
    },
  ];

  try {
    if (typeof modelContext.registerTool === 'function') {
      for (const tool of tools) {
        modelContext.registerTool(tool);
      }
      webMcpRegistered = true;
    } else if (typeof modelContext.provideContext === 'function') {
      modelContext.provideContext({ tools });
      webMcpRegistered = true;
    }
  } catch {
    // Gracefully ignore if browser WebMCP shim rejects registration
  }
}
