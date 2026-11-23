import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Activity,
  ChevronDown,
  ChevronUp,
  X,
  Share2,
  RefreshCw,
  CheckCircle2,
  Link2,
  Code2,
  Copy,
  Check,
  Globe,
  ExternalLink,
} from 'lucide-react';
import {
  subscribeToWebVitals,
  type WebVitalMetric,
  type WebVitalMetricName,
  type WebVitalRating,
} from '../utils/webVitals';
import {
  getSocialCardMetadataForView,
  resolveViewFromUrlOrSlug,
  notifySectionChange,
} from '../hooks/useSEO';
import { useLanguage } from '../context/LanguageContext';

const SESSION_ENABLED_KEY = 'pulseocto_qa_perf_monitor_enabled';

function isExplicitlyEnabledByDeveloper(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const params = new URLSearchParams(window.location.search);
    if (
      params.get('preview') === '1' ||
      params.get('qa') === '1' ||
      params.get('debug') === '1'
    ) {
      sessionStorage.setItem(SESSION_ENABLED_KEY, '1');
      return true;
    }
    if (
      params.get('preview') === '0' ||
      params.get('qa') === '0'
    ) {
      sessionStorage.removeItem(SESSION_ENABLED_KEY);
      return false;
    }
    return sessionStorage.getItem(SESSION_ENABLED_KEY) === '1';
  } catch {
    return false;
  }
}

const RATING_STYLES: Record<
  WebVitalRating | 'pending',
  { dot: string; text: string; badge: string; label: string }
> = {
  good: {
    dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.75)]',
    text: 'text-emerald-300',
    badge: 'border-emerald-500/30 bg-emerald-950/40 text-emerald-300',
    label: 'GOOD',
  },
  'needs-improvement': {
    dot: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.75)]',
    text: 'text-amber-300',
    badge: 'border-amber-500/30 bg-amber-950/40 text-amber-300',
    label: 'WARN',
  },
  poor: {
    dot: 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.75)]',
    text: 'text-rose-300',
    badge: 'border-rose-500/30 bg-rose-950/40 text-rose-300',
    label: 'POOR',
  },
  pending: {
    dot: 'bg-zinc-500',
    text: 'text-zinc-400',
    badge: 'border-white/10 bg-white/5 text-zinc-400',
    label: 'IDLE',
  },
};

const QUICK_TEST_ROUTES: Array<{ label: string; sectionKey: string; url: string }> = [
  { label: 'Home /', sectionKey: 'home', url: 'https://www.pulseocto.com/' },
  { label: '/services', sectionKey: 'services', url: 'https://www.pulseocto.com/services' },
  { label: '/portfolio', sectionKey: 'portfolio', url: 'https://www.pulseocto.com/portfolio' },
  { label: '/who-we-are', sectionKey: 'who-we-are', url: 'https://www.pulseocto.com/who-we-are' },
  { label: '01 Branding', sectionKey: 'arm-1', url: 'https://www.pulseocto.com/branding' },
  { label: '02 Marketing', sectionKey: 'arm-2', url: 'https://www.pulseocto.com/digital-marketing' },
  { label: '03 Web/E-Com', sectionKey: 'arm-3', url: 'https://www.pulseocto.com/web-ecommerce' },
  { label: '04 Studio', sectionKey: 'arm-4', url: 'https://www.pulseocto.com/creative-studio' },
  { label: '05 Products', sectionKey: 'arm-5', url: 'https://www.pulseocto.com/digital-products' },
  { label: '06 Strategy', sectionKey: 'arm-6', url: 'https://www.pulseocto.com/brand-strategy' },
  { label: '07 Content', sectionKey: 'arm-7', url: 'https://www.pulseocto.com/content-creation' },
  { label: '08 SEO', sectionKey: 'arm-8', url: 'https://www.pulseocto.com/seo-growth' },
  { label: '/blog', sectionKey: 'blog', url: 'https://www.pulseocto.com/blog' },
  { label: '/contact', sectionKey: 'contact', url: 'https://www.pulseocto.com/contact' },
];

export interface LiveMetaSnapshot {
  documentTitle: string;
  title: string;
  description: string;
  ogImage: string;
  ogImageSecureUrl: string;
  ogImageType: string;
  ogImageWidth: string;
  ogImageHeight: string;
  ogImageAlt: string;
  localPreviewImage: string;
  ogUrl: string;
  canonicalHref: string;
  siteName: string;
  ogType: string;
  ogLocale: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  domain: string;
  lastSyncedAt: string;
}

/**
 * Reads the real, live `<meta>` and `<link>` elements currently mounted in `document.head`.
 * If multiple tags exist (e.g. static HTML + dynamic Helmet), picks the latest non-empty value.
 */
function readDomMetaTags(fallbackLang: 'ar' | 'en', cacheBustToken?: number): LiveMetaSnapshot {
  const nowStr = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  if (typeof document === 'undefined') {
    const def = getSocialCardMetadataForView('home', fallbackLang);
    return {
      documentTitle: def.title,
      title: def.title,
      description: def.description,
      ogImage: def.ogImageUrl,
      ogImageSecureUrl: def.ogImageUrl,
      ogImageType: 'image/jpeg',
      ogImageWidth: '1200',
      ogImageHeight: '630',
      ogImageAlt: def.ogImageAlt,
      localPreviewImage: def.localImagePath,
      ogUrl: def.canonicalUrl,
      canonicalHref: def.canonicalUrl,
      siteName: def.siteName,
      ogType: def.ogType,
      ogLocale: fallbackLang === 'ar' ? 'ar_EG' : 'en_US',
      twitterCard: 'summary_large_image',
      twitterTitle: def.title,
      twitterDescription: def.description,
      twitterImage: def.ogImageUrl,
      domain: def.domain,
      lastSyncedAt: nowStr,
    };
  }

  const getMeta = (attr: 'property' | 'name', key: string): string => {
    const nodes = document.head.querySelectorAll(`meta[${attr}="${key}"]`);
    for (let i = nodes.length - 1; i >= 0; i--) {
      const val = nodes[i].getAttribute('content');
      if (val && val.trim()) {
        return val.trim();
      }
    }
    return '';
  };

  const getCanonical = (): string => {
    const links = document.head.querySelectorAll('link[rel="canonical"]');
    for (let i = links.length - 1; i >= 0; i--) {
      const href = links[i].getAttribute('href');
      if (href && href.trim()) {
        return href.trim();
      }
    }
    return '';
  };

  const documentTitle = document.title || '';
  const ogTitle = getMeta('property', 'og:title') || getMeta('name', 'title') || documentTitle;
  const ogDesc = getMeta('property', 'og:description') || getMeta('name', 'description');
  const ogImage = getMeta('property', 'og:image') || 'https://www.pulseocto.com/og/home.jpg';
  const ogImageSecureUrl = getMeta('property', 'og:image:secure_url') || ogImage;
  const ogImageType = getMeta('property', 'og:image:type') || 'image/jpeg';
  const ogImageWidth = getMeta('property', 'og:image:width') || '1200';
  const ogImageHeight = getMeta('property', 'og:image:height') || '630';
  const ogImageAlt = getMeta('property', 'og:image:alt') || ogTitle;
  const canonicalHref = getCanonical() || 'https://www.pulseocto.com/';
  const ogUrl = getMeta('property', 'og:url') || canonicalHref;
  const siteName =
    getMeta('property', 'og:site_name') || 'وكالة Pulse OCTO للتسويق الرقمي والحلول المتكاملة';
  const ogType = getMeta('property', 'og:type') || 'website';
  const ogLocale = getMeta('property', 'og:locale') || (fallbackLang === 'ar' ? 'ar_EG' : 'en_US');
  const twitterCard = getMeta('name', 'twitter:card') || 'summary_large_image';
  const twitterTitle = getMeta('name', 'twitter:title') || ogTitle;
  const twitterDescription = getMeta('name', 'twitter:description') || ogDesc;
  const twitterImage = getMeta('name', 'twitter:image') || ogImage;

  // Map https://www.pulseocto.com/og/... to local path /og/... so the preview loads from the workspace public folder
  const rawLocalPath =
    ogImage.replace(/^https?:\/\/(?:www\.)?pulseocto\.com/i, '') || '/og/home.jpg';
  const localPreviewImage = cacheBustToken
    ? `${rawLocalPath}${rawLocalPath.includes('?') ? '&' : '?'}v=${cacheBustToken}`
    : rawLocalPath;

  let domain = 'pulseocto.com';
  try {
    domain = new URL(ogUrl).hostname.replace(/^www\./i, '');
  } catch {
    domain = 'pulseocto.com';
  }

  return {
    documentTitle,
    title: ogTitle,
    description: ogDesc,
    ogImage,
    ogImageSecureUrl,
    ogImageType,
    ogImageWidth,
    ogImageHeight,
    ogImageAlt,
    localPreviewImage,
    ogUrl,
    canonicalHref,
    siteName,
    ogType,
    ogLocale,
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImage,
    domain,
    lastSyncedAt: nowStr,
  };
}

function formatVitalValue(name: 'LCP' | 'CLS' | 'INP', metric?: WebVitalMetric): string {
  if (!metric) {
    return name === 'CLS' ? '0.000' : '—';
  }
  if (name === 'CLS') {
    return metric.value.toFixed(3);
  }
  if (name === 'LCP') {
    return metric.value >= 1000
      ? `${(metric.value / 1000).toFixed(2)}s`
      : `${Math.round(metric.value)}ms`;
  }
  return `${Math.round(metric.value)}ms`;
}

export interface PerformanceMonitorProps {
  currentSection?: string;
  onNavigate?: (pageId: string) => void;
}

/**
 * Lightweight QA Performance Monitor & Real-Time DOM OpenGraph / Social Card Simulator
 * - Tab 1 ("CWV"): Real-time Core Web Vitals (LCP, CLS, INP)
 * - Tab 2 ("OG Preview"): Reads live `<meta>` tags directly from `document.head` via MutationObserver
 *   and renders 1:1 authentic WhatsApp & Facebook link preview cards.
 * Keyboard shortcut `Alt + Shift + P` toggles visibility at any time.
 */
export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  currentSection,
  onNavigate,
}) => {
  const { lang, isAr } = useLanguage();
  const [metrics, setMetrics] = useState<Partial<Record<WebVitalMetricName, WebVitalMetric>>>({});
  const [activeTab, setActiveTab] = useState<'cwv' | 'social'>('social');
  const [socialPlatform, setSocialPlatform] = useState<'whatsapp' | 'facebook'>('whatsapp');
  const [urlInput, setUrlInput] = useState<string>('');
  const [cacheBustToken, setCacheBustToken] = useState<number>(() => Date.now());
  const [liveMeta, setLiveMeta] = useState<LiveMetaSnapshot>(() =>
    readDomMetaTags(lang, Date.now())
  );
  const [showRawDomTags, setShowRawDomTags] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [imageStats, setImageStats] = useState<{
    width: number;
    height: number;
    sizeKb: number | null;
    loaded: boolean;
  }>({
    width: 1200,
    height: 630,
    sizeKb: null,
    loaded: false,
  });
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(
    () => !isExplicitlyEnabledByDeveloper()
  );

  const isTypingUrlRef = useRef<boolean>(false);

  // Subscribe to Core Web Vitals
  useEffect(() => {
    if (isDismissed) return;
    const unsubscribe = subscribeToWebVitals((updated) => {
      setMetrics(updated);
    });
    return unsubscribe;
  }, [isDismissed]);

  // Read live `<meta>` tags directly from `document.head`
  const syncFromLiveDom = useCallback(
    (forceNewCacheToken = false) => {
      const nextToken = forceNewCacheToken ? Date.now() : cacheBustToken;
      if (forceNewCacheToken) {
        setCacheBustToken(nextToken);
      }
      const snap = readDomMetaTags(lang, nextToken);
      setLiveMeta(snap);
      if (!isTypingUrlRef.current) {
        setUrlInput(snap.ogUrl);
      }
    },
    [cacheBustToken, lang]
  );

  // Observe `document.head` mutations + custom `pulse-octo:seo-updated` events so the simulator
  // always reflects the exact `<meta>` tags currently in the DOM.
  useEffect(() => {
    if (isDismissed) return;
    syncFromLiveDom();

    const handleSeoUpdated = () => {
      // Read immediately after synchronous DOM update
      syncFromLiveDom();
    };

    window.addEventListener('pulse-octo:seo-updated', handleSeoUpdated);
    window.addEventListener('popstate', handleSeoUpdated);

    let observer: MutationObserver | null = null;
    if (typeof MutationObserver !== 'undefined' && typeof document !== 'undefined' && document.head) {
      observer = new MutationObserver(() => {
        syncFromLiveDom();
      });
      observer.observe(document.head, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['content', 'href'],
      });
    }

    return () => {
      window.removeEventListener('pulse-octo:seo-updated', handleSeoUpdated);
      window.removeEventListener('popstate', handleSeoUpdated);
      if (observer) {
        observer.disconnect();
      }
    };
  }, [currentSection, isDismissed, lang, syncFromLiveDom]);

  // Probe the active og:image file size in KB via fetch HEAD/GET so the developer can verify WhatsApp <300KB compliance
  useEffect(() => {
    if (isDismissed) return;
    let cancelled = false;
    const cleanPath = liveMeta.localPreviewImage.split('?')[0];
    setImageStats((prev) => ({ ...prev, loaded: false }));

    fetch(liveMeta.localPreviewImage, { method: 'HEAD', cache: 'no-cache' })
      .then((res) => {
        if (cancelled) return;
        const len = res.headers.get('content-length');
        if (len) {
          const kb = Math.round(parseInt(len, 10) / 1024);
          if (!Number.isNaN(kb) && kb > 0) {
            setImageStats((prev) => ({ ...prev, sizeKb: kb }));
            return;
          }
        }
        // Fallback to blob size if content-length header is omitted
        return fetch(cleanPath)
          .then((r) => r.blob())
          .then((blob) => {
            if (!cancelled && blob.size > 0) {
              setImageStats((prev) => ({ ...prev, sizeKb: Math.round(blob.size / 1024) }));
            }
          });
      })
      .catch(() => {
        // Ignore network probe errors
      });

    return () => {
      cancelled = true;
    };
  }, [isDismissed, liveMeta.localPreviewImage]);

  // Allow developer/owner to toggle the monitor on/off with Alt + Shift + P
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.shiftKey && (e.key === 'P' || e.key === 'p')) {
        e.preventDefault();
        setIsDismissed((prev) => {
          const next = !prev;
          try {
            if (next) {
              sessionStorage.removeItem(SESSION_ENABLED_KEY);
            } else {
              sessionStorage.setItem(SESSION_ENABLED_KEY, '1');
            }
          } catch {
            // Ignore storage errors
          }
          return next;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  /**
   * When the user enters a URL or clicks a quick-test route chip:
   * 1. Triggers `notifySectionChange(resolvedKey)` so `SEOHead` and `useSEO` dynamically update
   *    the REAL `<meta>` tags in `document.head`.
   * 2. Reads the updated `<meta>` tags directly from `document.head`.
   */
  const handleInspectUrlOrSection = (rawUrlOrSection: string, fromInput = false) => {
    isTypingUrlRef.current = fromInput;
    if (fromInput) {
      setUrlInput(rawUrlOrSection);
    }
    if (!rawUrlOrSection.trim()) {
      isTypingUrlRef.current = false;
      if (currentSection) {
        notifySectionChange(currentSection);
      }
      setTimeout(() => syncFromLiveDom(true), 16);
      return;
    }

    const resolvedKey = resolveViewFromUrlOrSlug(rawUrlOrSection);
    // Notify SEOHead & App so the real DOM <meta> tags update dynamically
    notifySectionChange(resolvedKey);

    // Read the newly generated DOM <meta> tags on the next frame
    requestAnimationFrame(() => {
      const snap = readDomMetaTags(lang, Date.now());
      setLiveMeta(snap);
      if (!fromInput) {
        setUrlInput(snap.ogUrl);
      }
      isTypingUrlRef.current = false;
    });
  };

  const handleCopyShareUrl = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard
        .writeText(liveMeta.ogUrl)
        .then(() => {
          setCopiedUrl(true);
          setTimeout(() => setCopiedUrl(false), 1800);
        })
        .catch(() => {});
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.removeItem(SESSION_ENABLED_KEY);
    } catch {
      // Ignore storage errors
    }
  };

  if (isDismissed) {
    return null;
  }

  const items: Array<{
    key: 'LCP' | 'CLS' | 'INP';
    target: string;
    metric?: WebVitalMetric;
  }> = [
    { key: 'LCP', target: '<2.5s', metric: metrics.LCP },
    { key: 'CLS', target: '<0.10', metric: metrics.CLS },
    { key: 'INP', target: '<200ms', metric: metrics.INP },
  ];

  // Overall status dot for collapsed pill
  const ratings = items.map((i) => i.metric?.rating).filter(Boolean) as WebVitalRating[];
  const overallRating: WebVitalRating | 'pending' = ratings.includes('poor')
    ? 'poor'
    : ratings.includes('needs-improvement')
      ? 'needs-improvement'
      : ratings.length > 0
        ? 'good'
        : 'pending';

  const activeRouteKey = resolveViewFromUrlOrSlug(liveMeta.ogUrl);

  return (
    <aside
      dir="ltr"
      aria-label="Core Web Vitals & Live DOM Social Preview Simulator"
      className="fixed bottom-4 left-4 z-[85] select-none font-mono text-[11px] pointer-events-auto max-w-[calc(100vw-2rem)]"
    >
      {isCollapsed ? (
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#070412]/90 backdrop-blur-md border border-purple-500/25 shadow-[0_8px_24px_rgba(0,0,0,0.75)] text-zinc-200">
          <button
            type="button"
            onClick={() => setIsCollapsed(false)}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
            title="Expand QA & Live Social Preview Simulator"
          >
            <span className={`w-2 h-2 rounded-full ${RATING_STYLES[overallRating].dot}`} />
            <span className="font-bold tracking-wider text-[10px] text-purple-200">CWV & OG QA</span>
            <ChevronUp className="w-3 h-3 text-zinc-400" />
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss Performance Monitor"
            title="Dismiss (Alt+Shift+P to reopen)"
            className="ml-1 p-0.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <div
          className={`${
            activeTab === 'social' ? 'w-[356px] sm:w-[392px]' : 'w-[268px]'
          } rounded-2xl bg-[#070412]/95 backdrop-blur-xl border border-purple-500/30 shadow-[0_16px_44px_rgba(0,0,0,0.92)] overflow-hidden transition-all duration-200`}
        >
          {/* Header Bar with Tab Switcher */}
          <div className="flex items-center justify-between px-2.5 py-1.5 bg-white/[0.03] border-b border-white/[0.08]">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('cwv')}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-colors cursor-pointer ${
                  activeTab === 'cwv'
                    ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                }`}
              >
                <Activity className="w-3 h-3 text-purple-400" />
                <span>CWV</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('social');
                  syncFromLiveDom(true);
                }}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-colors cursor-pointer ${
                  activeTab === 'social'
                    ? 'bg-purple-600/30 text-purple-200 border border-purple-500/40'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                }`}
              >
                <Share2 className="w-3 h-3 text-emerald-400" />
                <span>OG Preview</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              </button>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsCollapsed(true)}
                aria-label="Minimize Performance Monitor"
                title="Minimize"
                className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <ChevronDown className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                aria-label="Dismiss Performance Monitor"
                title="Dismiss (Alt+Shift+P to reopen)"
                className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>

          {activeTab === 'cwv' ? (
            <div>
              {/* Metrics Grid (LCP, CLS, INP) */}
              <div className="grid grid-cols-3 divide-x divide-white/[0.06] px-1 py-2.5">
                {items.map(({ key, target, metric }) => {
                  const ratingKey: WebVitalRating | 'pending' = metric ? metric.rating : 'pending';
                  const style = RATING_STYLES[ratingKey];
                  return (
                    <div key={key} className="px-2 flex flex-col items-center text-center">
                      <div className="flex items-center gap-1 mb-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                        <span className="text-[10px] font-bold text-zinc-300">{key}</span>
                      </div>
                      <span className={`text-xs font-extrabold tracking-tight ${style.text}`}>
                        {formatVitalValue(key, metric)}
                      </span>
                      <span className="text-[9px] text-zinc-500 mt-0.5">{target}</span>
                    </div>
                  );
                })}
              </div>
              {/* Quick Link to Social Card Simulator */}
              <div className="px-3 py-1.5 bg-white/[0.02] border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[9px] text-zinc-400 truncate max-w-[140px]">
                  DOM Meta: <strong className="text-purple-300">{activeRouteKey}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('social');
                    syncFromLiveDom(true);
                  }}
                  className="text-[9px] font-semibold text-emerald-300 hover:text-emerald-200 underline underline-offset-2 cursor-pointer"
                >
                  محاكي المعاينة الحية →
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 space-y-2.5 max-h-[80vh] overflow-y-auto">
              {/* Live DOM Status Header & URL Inspector */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-semibold text-zinc-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    <span>Live DOM &lt;meta&gt; Reader</span>
                    <span className="text-[9px] text-zinc-500 font-normal">
                      ({liveMeta.lastSyncedAt})
                    </span>
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (currentSection) {
                          notifySectionChange(currentSection);
                        }
                        setTimeout(() => syncFromLiveDom(true), 16);
                      }}
                      title="إعادة قراءة وسوم الـ Meta الحقيقية من الصفحة الحالية"
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-500/15 hover:bg-purple-500/25 text-purple-200 border border-purple-500/30 text-[9px] transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-2.5 h-2.5" />
                      <span>Sync DOM</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyShareUrl}
                      title="Copy og:url"
                      className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 text-[9px] transition-colors cursor-pointer"
                    >
                      {copiedUrl ? (
                        <Check className="w-2.5 h-2.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-2.5 h-2.5" />
                      )}
                      <span>{copiedUrl ? 'Copied' : 'URL'}</span>
                    </button>
                  </div>
                </div>

                {/* URL Input Box with optional Go-To-Page trigger */}
                <div className="relative flex items-center gap-1">
                  <div className="relative flex-1">
                    <Link2 className="w-3 h-3 text-purple-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={urlInput}
                      onChange={(e) => handleInspectUrlOrSection(e.target.value, true)}
                      placeholder="https://www.pulseocto.com/portfolio"
                      className="w-full pl-7 pr-2.5 py-1.5 rounded-lg bg-black/60 border border-white/15 focus:border-purple-500/60 focus:outline-none text-[10px] text-zinc-100 placeholder:text-zinc-600"
                    />
                  </div>
                  {onNavigate && (
                    <button
                      type="button"
                      onClick={() => {
                        const targetView = resolveViewFromUrlOrSlug(urlInput || liveMeta.ogUrl);
                        if (targetView.startsWith('arm-')) {
                          const armNum = parseInt(targetView.replace('arm-', ''), 10);
                          window.dispatchEvent(
                            new CustomEvent('pulse-octo:open-arm', { detail: { armId: armNum } })
                          );
                        } else {
                          onNavigate(targetView);
                        }
                      }}
                      title="الانتقال الفعلي إلى هذه الصفحة في الموقع"
                      className="shrink-0 p-1.5 rounded-lg bg-purple-600/25 hover:bg-purple-600/40 border border-purple-500/35 text-purple-200 transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Quick Route Presets (Triggers real SEOHead DOM update + reads live <meta> tags) */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
                  {QUICK_TEST_ROUTES.map((item) => {
                    const isSelected =
                      liveMeta.ogUrl === item.url || activeRouteKey === item.sectionKey;
                    return (
                      <button
                        key={item.url}
                        type="button"
                        onClick={() => handleInspectUrlOrSection(item.sectionKey, false)}
                        className={`shrink-0 px-2 py-0.5 rounded-md text-[9px] border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-purple-600/35 border-purple-400/60 text-white font-semibold'
                            : 'bg-white/[0.03] border-white/10 text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.07]'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Platform Switcher: WhatsApp vs Facebook */}
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-black/50 border border-white/[0.07]">
                <button
                  type="button"
                  onClick={() => setSocialPlatform('whatsapp')}
                  className={`py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                    socialPlatform === 'whatsapp'
                      ? 'bg-[#005c4b] text-white shadow'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  WhatsApp Card
                </button>
                <button
                  type="button"
                  onClick={() => setSocialPlatform('facebook')}
                  className={`py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                    socialPlatform === 'facebook'
                      ? 'bg-[#1877F2] text-white shadow'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Facebook Card
                </button>
              </div>

              {/* 1:1 Authentic Simulated Social Card */}
              {socialPlatform === 'whatsapp' ? (
                /* Authentic WhatsApp Chat Link Preview Bubble */
                <div className="rounded-xl bg-[#0b141a] p-2.5 border border-emerald-500/25 font-sans shadow-inner">
                  {/* Outgoing WhatsApp Message Bubble */}
                  <div className="relative rounded-xl rounded-tr-none bg-[#005c4b] p-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.45)] text-[#e9edef]">
                    {/* Link Preview Container inside WhatsApp Bubble */}
                    <div className="rounded-lg bg-[#025144] overflow-hidden border-l-[3.5px] border-[#25d366]">
                      {/* 1200x630 (1.91:1) OG Image */}
                      <div className="relative w-full aspect-[1200/630] bg-[#061217] overflow-hidden">
                        <img
                          key={liveMeta.localPreviewImage}
                          src={liveMeta.localPreviewImage}
                          alt={liveMeta.ogImageAlt || liveMeta.title}
                          width={1200}
                          height={630}
                          onLoad={(e) => {
                            const img = e.currentTarget;
                            if (img.naturalWidth && img.naturalHeight) {
                              setImageStats((prev) => ({
                                ...prev,
                                width: img.naturalWidth,
                                height: img.naturalHeight,
                                loaded: true,
                              }));
                            }
                          }}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* WhatsApp Preview Text Metadata (og:title, og:description, domain) */}
                      <div
                        dir={isAr ? 'rtl' : 'ltr'}
                        className="px-2.5 py-2 space-y-0.5 text-start bg-black/15"
                      >
                        <p className="text-[12px] font-bold text-[#e9edef] line-clamp-2 leading-[1.35]">
                          {liveMeta.title}
                        </p>
                        <p className="text-[11px] text-[#e9edef]/75 line-clamp-2 leading-[1.35]">
                          {liveMeta.description}
                        </p>
                        <p
                          dir="ltr"
                          className="text-[10px] text-[#e9edef]/55 truncate pt-0.5 font-normal"
                        >
                          {liveMeta.domain}
                        </p>
                      </div>
                    </div>

                    {/* Shared Message Link & WhatsApp Read Receipt Timestamp */}
                    <div className="px-1.5 pt-1.5 pb-0.5 flex items-end justify-between gap-2">
                      <span className="text-[11.5px] text-[#53bdeb] underline truncate">
                        {liveMeta.ogUrl}
                      </span>
                      <span className="text-[9.5px] text-[#e9edef]/65 shrink-0 flex items-center gap-1">
                        <span>{liveMeta.lastSyncedAt.slice(0, 5)}</span>
                        <span className="text-[#53bdeb] font-bold tracking-tighter">✓✓</span>
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Authentic Facebook / Messenger Feed Link Share Card */
                <div className="rounded-xl bg-[#18191a] p-2.5 border border-blue-500/25 font-sans shadow-inner">
                  {/* Post Author Header */}
                  <div className="flex items-center justify-between mb-2 px-0.5">
                    <div className="flex items-center gap-2">
                      <img
                        src="/12-sm.webp"
                        alt="Pulse OCTO"
                        width={28}
                        height={28}
                        className="w-7 h-7 rounded-full object-contain bg-black border border-white/15 p-0.5"
                      />
                      <div>
                        <p className="text-[11px] font-bold text-[#e4e6eb] leading-tight">
                          Pulse OCTO
                        </p>
                        <p className="text-[9px] text-[#b0b3b8] flex items-center gap-1">
                          <span>Just now</span>
                          <span>•</span>
                          <Globe className="w-2.5 h-2.5 inline" />
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#4599ff] truncate max-w-[150px]">
                      {liveMeta.ogUrl}
                    </span>
                  </div>

                  {/* Facebook Attachment Card */}
                  <div className="rounded-lg bg-[#242526] overflow-hidden border border-[#3e4042] shadow-md">
                    <div className="relative w-full aspect-[1200/630] bg-black overflow-hidden border-b border-[#3e4042]">
                      <img
                        key={liveMeta.localPreviewImage}
                        src={liveMeta.localPreviewImage}
                        alt={liveMeta.ogImageAlt || liveMeta.title}
                        width={1200}
                        height={630}
                        onLoad={(e) => {
                          const img = e.currentTarget;
                          if (img.naturalWidth && img.naturalHeight) {
                            setImageStats((prev) => ({
                              ...prev,
                              width: img.naturalWidth,
                              height: img.naturalHeight,
                              loaded: true,
                            }));
                          }
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      dir={isAr ? 'rtl' : 'ltr'}
                      className="px-3 py-2.5 bg-[#3a3b3c] space-y-0.5 text-start"
                    >
                      <p
                        dir="ltr"
                        className="text-[10px] uppercase tracking-wider text-[#b0b3b8] truncate font-normal"
                      >
                        {liveMeta.domain}
                      </p>
                      <p className="text-[12.5px] font-bold text-[#e4e6eb] line-clamp-1 leading-snug">
                        {liveMeta.title}
                      </p>
                      <p className="text-[11px] text-[#b0b3b8] line-clamp-1 leading-relaxed">
                        {liveMeta.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Live DOM Meta Tag Diagnostics & Expandable Raw <meta> Inspector */}
              <div className="rounded-lg bg-white/[0.03] border border-white/[0.08] p-2 space-y-1.5 text-[9px] text-zinc-400">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-emerald-300 font-semibold">
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    <span>
                      {imageStats.width}×{imageStats.height} JPEG
                      {imageStats.sizeKb ? ` • ${imageStats.sizeKb} KB` : ''} (WhatsApp Ready)
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowRawDomTags((prev) => !prev)}
                    className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-500/15 hover:bg-purple-500/25 text-purple-200 border border-purple-500/30 font-semibold cursor-pointer"
                  >
                    <Code2 className="w-2.5 h-2.5" />
                    <span>{showRawDomTags ? 'إخفاء الوسوم' : 'وسوم الـ DOM'}</span>
                  </button>
                </div>

                <div className="truncate text-zinc-400" title={liveMeta.ogImage}>
                  <span className="text-purple-300 font-semibold">og:image:</span>{' '}
                  {liveMeta.ogImage}
                </div>

                {showRawDomTags && (
                  <div className="pt-1.5 mt-1 border-t border-white/[0.08] space-y-1 text-[8.5px] font-mono text-zinc-300 bg-black/50 p-2 rounded-md overflow-x-auto">
                    <div>
                      <span className="text-emerald-400">&lt;title&gt;</span>
                      {liveMeta.documentTitle}
                      <span className="text-emerald-400">&lt;/title&gt;</span>
                    </div>
                    <div>
                      <span className="text-purple-400">og:title</span> = &quot;{liveMeta.title}&quot;
                    </div>
                    <div>
                      <span className="text-purple-400">og:description</span> = &quot;
                      {liveMeta.description}&quot;
                    </div>
                    <div>
                      <span className="text-purple-400">og:url</span> = &quot;{liveMeta.ogUrl}&quot;
                    </div>
                    <div>
                      <span className="text-purple-400">og:image</span> = &quot;{liveMeta.ogImage}
                      &quot;
                    </div>
                    <div>
                      <span className="text-purple-400">og:image:width</span> = &quot;
                      {liveMeta.ogImageWidth}&quot; |{' '}
                      <span className="text-purple-400">height</span> = &quot;
                      {liveMeta.ogImageHeight}&quot;
                    </div>
                    <div>
                      <span className="text-purple-400">og:type</span> = &quot;{liveMeta.ogType}
                      &quot; | <span className="text-purple-400">og:locale</span> = &quot;
                      {liveMeta.ogLocale}&quot;
                    </div>
                    <div>
                      <span className="text-sky-400">twitter:card</span> = &quot;
                      {liveMeta.twitterCard}&quot;
                    </div>
                    <div>
                      <span className="text-sky-400">twitter:image</span> = &quot;
                      {liveMeta.twitterImage}&quot;
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};

export default PerformanceMonitor;
