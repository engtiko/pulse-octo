import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

interface StaticRouteSEO {
  slug: string;
  title: string;
  description: string;
  ogImagePath: string;
  serviceType?: string;
  serviceName?: string;
}

const STATIC_ROUTES_SEO: StaticRouteSEO[] = [
  {
    slug: 'branding',
    title: '01 الهوية وبناء العلامة (Branding) | وكالة Pulse OCTO للتسويق الرقمي والحلول المتكاملة',
    description: 'تصميم الشعارات، الهوية البصرية المتكاملة، أدلة العلامة التجارية (Brand Guidelines)، وتصميم التغليف والمطبوعات التي تمنح علامتك حضوراً قوياً.',
    ogImagePath: '/og/arm-1.jpg',
    serviceName: '01 الهوية وبناء العلامة (Branding & Identity)',
    serviceType: 'تصميم الهوية البصرية وبناء العلامات التجارية',
  },
  {
    slug: 'digital-marketing',
    title: '02 التسويق الرقمي والإعلانات الممولة | وكالة Pulse OCTO للتسويق الرقمي والحلول المتكاملة',
    description: 'إدارة الحملات الإعلانية الممولة على فيسبوك، إنستجرام، جوجل، تيك توك، وسناب شات، وإدارة حسابات التواصل الاجتماعي لزيادة المبيعات.',
    ogImagePath: '/og/arm-2.jpg',
    serviceName: '02 التسويق الرقمي والإعلانات الممولة (Digital Marketing & Paid Media)',
    serviceType: 'إدارة الحملات الإعلانية الممولة والتسويق الرقمي',
  },
  {
    slug: 'web-ecommerce',
    title: 'تصميم وبرمجة المواقع المخصصة وتطوير المتاجر الإلكترونية (Custom Web & E-commerce Development) | وكالة Pulse OCTO للتسويق الرقمي والحلول المتكاملة',
    description: 'نحن لا نقتصر على منصات التجارة الإلكترونية الجاهزة فحسب، بل نصمم ونبرمج المواقع وتطبيقات الويب والمتاجر الإلكترونية المخصصة (Custom Development) بالكامل للشركات والعلامات التجارية من الصفر. نقدم حلول برمجة متكاملة وتخصيص احترافي (Customization) يلبى كافة الاحتياجات المعقدة بعيداً عن القوالب التقليدية، مع إدارة البنية التحتية والدومينات وربط بوابات الدفع وشحن المتاجر (سلة، زد، Shopify Plus، وووكومرس) بجودة عالمية وسرعة فائقة تضمن تفوقك الرقمي.',
    ogImagePath: '/og/arm-3.jpg',
    serviceName: 'تصميم وبرمجة المواقع المخصصة وتطوير المتاجر الإلكترونية (Custom Web & E-commerce Development)',
    serviceType: 'تصميم وبرمجة المواقع المخصصة وتطوير المتاجر الإلكترونية',
  },
  {
    slug: 'creative-studio',
    title: '04 الاستوديو والإنتاج الإبداعي | وكالة Pulse OCTO للتسويق الرقمي والحلول المتكاملة',
    description: 'الإنتاج الإعلاني والسينمائي، تصوير المنتجات الفوتوغرافي، الموشن جرافيك، صناعة الـ Reels، وتصميمات الـ 3D والـ CGI الاحترافية.',
    ogImagePath: '/og/arm-4.jpg',
    serviceName: '04 الاستوديو والإنتاج الإبداعي (Creative Studio & Production)',
    serviceType: 'الإنتاج الإعلاني والسينمائي والموشن جرافيك والـ 3D',
  },
  {
    slug: 'digital-products',
    title: '05 المنتجات والحلول الرقمية | وكالة Pulse OCTO للتسويق الرقمي والحلول المتكاملة',
    description: 'تطوير تطبيقات الموبايل (iOS & Android)، أنظمة الويب المخصصة، لوحات التحكم التفاعلية، وحلول الأتمتة وربط الأنظمة البرمجية API.',
    ogImagePath: '/og/arm-5.jpg',
    serviceName: '05 المنتجات والحلول الرقمية (Digital Products & Automation)',
    serviceType: 'تطوير تطبيقات الموبايل والأنظمة الرقمية والأتمتة',
  },
  {
    slug: 'brand-strategy',
    title: '06 الاستراتيجية ودراسة السوق | وكالة Pulse OCTO للتسويق الرقمي والحلول المتكاملة',
    description: 'دراسات السوق وتحليل المنافسين، تحديد التموضع التسويقي، بناء شرائح العملاء ورحلة المشتري، وخطط الإطلاق والتوسع المدروسة.',
    ogImagePath: '/og/arm-6.jpg',
    serviceName: '06 الاستراتيجية ودراسة السوق (Brand Strategy & Market Research)',
    serviceType: 'دراسات السوق واستراتيجيات العلامة التجارية والنمو',
  },
  {
    slug: 'content-creation',
    title: '07 صناعة المحتوى والكتابة الإعلانية | وكالة Pulse OCTO للتسويق الرقمي والحلول المتكاملة',
    description: 'الكتابة الإعلانية البيعية (Copywriting)، خطط المحتوى الإبداعي، كتابة سيناريوهات الفيديو والإعلانات، والمحتوى المتخصص المتوافق مع محركات البحث.',
    ogImagePath: '/og/arm-7.jpg',
    serviceName: '07 صناعة المحتوى والكتابة الإعلانية (Content Creation & Copywriting)',
    serviceType: 'صناعة المحتوى الإبداعي والكتابة الإعلانية البيعية',
  },
  {
    slug: 'seo-growth',
    title: '08 النمو وتصدر محركات البحث (SEO) | وكالة Pulse OCTO للتسويق الرقمي والحلول المتكاملة',
    description: 'تحسين محركات البحث الداخلي والتقني (SEO)، تحسين معدل التحويل (CRO)، وتتبع البيانات والتحليلات المتقدمة (GA4 & Server-Side CAPI).',
    ogImagePath: '/og/arm-8.jpg',
    serviceName: '08 النمو وتصدر محركات البحث (SEO & Growth Optimization)',
    serviceType: 'تحسين محركات البحث SEO ومعدل التحويل CRO والتحليلات',
  },
  {
    slug: 'who-we-are',
    title: 'من نحن | وكالة Pulse OCTO للتسويق الرقمي والحلول المتكاملة',
    description: 'تعرف على قصة ورؤية وكالة Pulse OCTO للتسويق الرقمي والحلول المتكاملة ومنظومة الأذرع الثمانية. نصنع الفارق للعلامات التجارية بأعلى كفاءة استراتيجية وتنفيذية.',
    ogImagePath: '/og/who-we-are.jpg',
  },
  {
    slug: 'the-8-arms',
    title: 'منظومة الأذرع الثمانية | وكالة Pulse OCTO للتسويق الرقمي والحلول المتكاملة',
    description: 'منظومة متكاملة تعمل فيها الأذرع الثمانية (الهوية، التسويق، المواقع، الاستوديو، البرمجيات، الاستراتيجية، المحتوى، والـ SEO) في تناغم متصل كالنبض العصبي.',
    ogImagePath: '/og/the-8-arms.jpg',
  },
  {
    slug: 'services',
    title: 'خدماتنا | وكالة Pulse OCTO للتسويق الرقمي والحلول المتكاملة',
    description: 'اكتشف خدمات وكالة Pulse OCTO المتكاملة: الهوية وبناء العلامة، التسويق الرقمي والإعلانات الممولة، المواقع والتجارة الإلكترونية، الاستوديو، الحلول الرقمية، الاستراتيجية، صناعة المحتوى، والـ SEO.',
    ogImagePath: '/og/services.jpg',
  },
  {
    slug: 'portfolio',
    title: 'أعمالنا وشركاء النجاح | وكالة Pulse OCTO للتسويق الرقمي والحلول المتكاملة',
    description: 'شاهد دراسات الحالة ومشروعات العلامات التجارية والمتاجر الإلكترونية التي طورتها منظومة الأذرع الثمانية في وكالة Pulse OCTO.',
    ogImagePath: '/og/portfolio.jpg',
  },
  {
    slug: 'blog',
    title: 'المدونة والرؤى الرقمية | وكالة Pulse OCTO للتسويق الرقمي والحلول المتكاملة',
    description: 'أحدث الرؤى والاستراتيجيات في التسويق الرقمي، الإعلانات الممولة، بناء العلامات التجارية، وتحسين معدل التحويل في التجارة الإلكترونية.',
    ogImagePath: '/og/blog.jpg',
  },
  {
    slug: 'contact',
    title: 'تواصل معنا وابدأ نبض مشروعك | وكالة Pulse OCTO للتسويق الرقمي والحلول المتكاملة',
    description: 'تواصل مباشرة مع فريق وكالة Pulse OCTO للتسويق الرقمي والحلول المتكاملة لبدء خطة نمو مخصصة لعلامتك التجارية أو متجرك الإلكتروني.',
    ogImagePath: '/og/contact.jpg',
  },
  {
    slug: 'card',
    title: 'م. طارق وجيه | بطاقة الأعمال الرقمية — Pulse OCTO',
    description: 'بطاقة التواصل الرقمية الخاصة بـ م. طارق وجيه — المؤسس والمدير التنفيذي لوكالة Pulse OCTO للتسويق الرقمي والحلول المتكاملة.',
    ogImagePath: '/og/who-we-are.jpg',
  },
];

function pulseOctoRouteMetaPlugin(): Plugin {
  return {
    name: 'pulseocto-static-route-meta',
    apply: 'build',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const baseIndexHtmlPath = path.join(distDir, 'index.html');
      if (!fs.existsSync(baseIndexHtmlPath)) return;

      const baseHtml = fs.readFileSync(baseIndexHtmlPath, 'utf-8');
      const siteUrl = 'https://www.pulseocto.com';

      for (const route of STATIC_ROUTES_SEO) {
        const canonicalUrl = `${siteUrl}/${route.slug}`;
        const ogImageUrl = `${siteUrl}${route.ogImagePath}`;
        let routeHtml = baseHtml
          .replace(/<title>.*?<\/title>/s, `<title>${route.title}</title>`)
          .replace(
            /<meta name="description" content=".*?"\s*\/>/,
            `<meta name="description" content="${route.description}" />`
          )
          .replace(
            /<link rel="canonical" href="https:\/\/www\.pulseocto\.com\/"\s*\/>/,
            `<link rel="canonical" href="${canonicalUrl}" />`
          )
          .replace(
            /<link rel="alternate" hreflang="ar" href="https:\/\/www\.pulseocto\.com\/"\s*\/>/,
            `<link rel="alternate" hreflang="ar" href="${canonicalUrl}" />`
          )
          .replace(
            /<link rel="alternate" hreflang="en" href="https:\/\/www\.pulseocto\.com\/"\s*\/>/,
            `<link rel="alternate" hreflang="en" href="${canonicalUrl}" />`
          )
          .replace(
            /<link rel="alternate" hreflang="x-default" href="https:\/\/www\.pulseocto\.com\/"\s*\/>/,
            `<link rel="alternate" hreflang="x-default" href="${canonicalUrl}" />`
          )
          .replace(
            /<meta property="og:url" content="https:\/\/www\.pulseocto\.com\/"\s*\/>/,
            `<meta property="og:url" content="${canonicalUrl}" />`
          )
          .replace(
            /<meta property="og:title" content=".*?"\s*\/>/,
            `<meta property="og:title" content="${route.title}" />`
          )
          .replace(
            /<meta property="og:description" content=".*?"\s*\/>/,
            `<meta property="og:description" content="${route.description}" />`
          )
          .replace(
            /<meta property="og:image" content=".*?"\s*\/>/,
            `<meta property="og:image" content="${ogImageUrl}" />`
          )
          .replace(
            /<meta property="og:image:secure_url" content=".*?"\s*\/>/,
            `<meta property="og:image:secure_url" content="${ogImageUrl}" />`
          )
          .replace(
            /<meta property="og:image:alt" content=".*?"\s*\/>/,
            `<meta property="og:image:alt" content="${route.title}" />`
          )
          .replace(
            /<meta name="twitter:url" content="https:\/\/www\.pulseocto\.com\/"\s*\/>/,
            `<meta name="twitter:url" content="${canonicalUrl}" />`
          )
          .replace(
            /<meta name="twitter:title" content=".*?"\s*\/>/,
            `<meta name="twitter:title" content="${route.title}" />`
          )
          .replace(
            /<meta name="twitter:description" content=".*?"\s*\/>/,
            `<meta name="twitter:description" content="${route.description}" />`
          )
          .replace(
            /<meta name="twitter:image" content=".*?"\s*\/>/,
            `<meta name="twitter:image" content="${ogImageUrl}" />`
          )
          .replace(
            /<meta name="twitter:image:alt" content=".*?"\s*\/>/,
            `<meta name="twitter:image:alt" content="${route.title}" />`
          );

        if (route.serviceName && route.serviceType) {
          const serviceSchema = {
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Service',
                '@id': `${canonicalUrl}#service`,
                name: route.serviceName,
                serviceType: route.serviceType,
                description: route.description,
                url: canonicalUrl,
                provider: {
                  '@id': `${siteUrl}/#organization`,
                },
                areaServed: [
                  { '@type': 'Country', name: 'Egypt' },
                  { '@type': 'Country', name: 'Saudi Arabia' },
                  { '@type': 'Country', name: 'United Arab Emirates' },
                  { '@type': 'Country', name: 'Kuwait' },
                  { '@type': 'Country', name: 'Qatar' },
                ],
                availableChannel: {
                  '@type': 'ServiceChannel',
                  serviceUrl: canonicalUrl,
                  servicePhone: '+201112998882',
                  availableLanguage: ['Arabic', 'English'],
                },
              },
              {
                '@type': 'BreadcrumbList',
                '@id': `${canonicalUrl}#breadcrumb`,
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'الرئيسية - Pulse OCTO',
                    item: `${siteUrl}/`,
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: route.serviceName,
                    item: canonicalUrl,
                  },
                ],
              },
            ],
          };

          const scriptTag = `    <script id="pulseocto-jsonld-active-service" type="application/ld+json">\n${JSON.stringify(serviceSchema, null, 2)}\n    </script>\n  </head>`;
          routeHtml = routeHtml.replace('  </head>', scriptTag);
        }

        const routeOutDir = path.join(distDir, route.slug);
        fs.mkdirSync(routeOutDir, { recursive: true });
        fs.writeFileSync(path.join(routeOutDir, 'index.html'), routeHtml, 'utf-8');
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      pulseOctoRouteMetaPlugin(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr:
        process.env.DISABLE_HMR === 'true'
          ? false
          : {
              clientPort: 443,
            },
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    esbuild: {
      target: 'esnext',
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'esnext',
      },
    },
    build: {
      target: 'esnext',
      cssCodeSplit: true,
      minify: 'esbuild',
      chunkSizeWarningLimit: 500,
      modulePreload: {
        resolveDependencies: (_filename, deps) => {
          // Prevent preloading heavy visual/3D chunks on initial page load for weak devices
          return deps.filter(
            (dep) =>
              !dep.includes('vendor-three') &&
              !dep.includes('vendor-particles') &&
              !dep.includes('vendor-effects')
          );
        },
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // 3D & WebGL engine (heavy, loaded on demand)
              if (id.includes('/three/') || id.includes('three')) {
                return 'vendor-three';
              }
              // Particle system engine & React wrapper
              if (id.includes('@tsparticles')) {
                return 'vendor-particles';
              }
              // Animation engine (Framer Motion / Motion) into core vs dom utilities
              if (id.includes('motion-dom') || id.includes('motion-utils')) {
                return 'vendor-motion-dom';
              }
              if (id.includes('framer-motion') || id.includes('/motion/')) {
                return 'vendor-motion';
              }
              // Icon library
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              // Visual effects & utilities
              if (id.includes('canvas-confetti')) {
                return 'vendor-effects';
              }
              // SEO & Document Head management
              if (id.includes('react-helmet-async')) {
                return 'vendor-seo';
              }
              // Core React runtime (strict matching to avoid capturing other react-* plugins)
              if (
                id.includes('/node_modules/react/') ||
                id.includes('/node_modules/react-dom/') ||
                id.includes('/node_modules/scheduler/')
              ) {
                return 'vendor-react';
              }
              // Remaining smaller third-party dependencies
              return 'vendor-commons';
            }
          },
        },
      },
    },
  };
});
