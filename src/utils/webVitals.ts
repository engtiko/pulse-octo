/**
 * Google Core Web Vitals Listener (LCP, FID, INP, CLS) for GA4 & Internal QA Monitor
 *
 * Captures real-world Core Web Vitals using native PerformanceObserver APIs
 * (zero runtime bundle bloat) and dispatches them as custom events to the
 * existing Google Analytics 4 (GA4) tracking setup (`window.gtag` / `window.dataLayer`)
 * as well as live subscribers (such as the QA PerformanceMonitor overlay).
 */

export type WebVitalMetricName = 'LCP' | 'FID' | 'INP' | 'CLS';
export type WebVitalRating = 'good' | 'needs-improvement' | 'poor';

export interface WebVitalMetric {
  name: WebVitalMetricName;
  value: number;
  delta: number;
  rating: WebVitalRating;
  id: string;
}

interface LayoutShiftAttribution {
  node?: Node | null;
}

interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
  sources?: LayoutShiftAttribution[];
}

interface PerformanceEventTimingWithInteraction extends PerformanceEventTiming {
  interactionId?: number;
}

export const WEB_VITAL_THRESHOLDS: Record<WebVitalMetricName, [number, number]> = {
  LCP: [2500, 4000],
  FID: [100, 300],
  INP: [200, 500],
  CLS: [0.1, 0.25],
};

export function getMetricRating(name: WebVitalMetricName, value: number): WebVitalRating {
  const [good, poor] = WEB_VITAL_THRESHOLDS[name];
  if (value <= good) return 'good';
  if (value <= poor) return 'needs-improvement';
  return 'poor';
}

function generateMetricId(prefix: WebVitalMetricName): string {
  return `v4-${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
}

// Live state store for real-time QA overlay inspection
const liveMetricsStore: Partial<Record<WebVitalMetricName, WebVitalMetric>> = {};
const liveSubscribers = new Set<(metrics: Partial<Record<WebVitalMetricName, WebVitalMetric>>) => void>();

function notifyLiveSubscribers(metric: WebVitalMetric): void {
  liveMetricsStore[metric.name] = metric;
  const snapshot = { ...liveMetricsStore };
  liveSubscribers.forEach((listener) => listener(snapshot));
}

/**
 * Subscribes to live Core Web Vitals updates (LCP, CLS, INP, FID) as they are observed.
 */
export function subscribeToWebVitals(
  callback: (metrics: Partial<Record<WebVitalMetricName, WebVitalMetric>>) => void
): () => void {
  liveSubscribers.add(callback);
  callback({ ...liveMetricsStore });
  return () => {
    liveSubscribers.delete(callback);
  };
}

/**
 * Sends a captured Core Web Vital metric to the existing GA4 setup.
 */
export function sendWebVitalToGA4(metric: WebVitalMetric): void {
  if (typeof window === 'undefined') return;

  const eventPayload = {
    value: Math.round(metric.name === 'CLS' ? metric.delta * 1000 : metric.delta),
    event_category: 'Web Vitals',
    event_label: metric.id,
    metric_id: metric.id,
    metric_value: Number(metric.value.toFixed(metric.name === 'CLS' ? 4 : 2)),
    metric_delta: Number(metric.delta.toFixed(metric.name === 'CLS' ? 4 : 2)),
    metric_rating: metric.rating,
    page_path: window.location.pathname,
    page_location: window.location.href,
    non_interaction: true,
  };

  if (typeof window.gtag === 'function') {
    window.gtag('event', metric.name, eventPayload);
  } else {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(['event', metric.name, eventPayload]);
  }
}

/**
 * Initializes listeners for LCP, FID, INP, and CLS and reports them to GA4 and live subscribers.
 * Returns a cleanup function that disconnects active observers.
 */
export function initWebVitalsListener(
  onReport: (metric: WebVitalMetric) => void = sendWebVitalToGA4
): () => void {
  if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') {
    return () => {};
  }

  const cleanups: Array<() => void> = [];
  const supportedEntryTypes = PerformanceObserver.supportedEntryTypes || [];

  // Initialize CLS at 0.000 immediately so QA monitors show baseline 0 shift
  const initialClsId = generateMetricId('CLS');
  notifyLiveSubscribers({
    name: 'CLS',
    value: 0,
    delta: 0,
    rating: 'good',
    id: initialClsId,
  });

  // 1. Largest Contentful Paint (LCP)
  if (supportedEntryTypes.includes('largest-contentful-paint')) {
    try {
      let lcpValue = 0;
      let lcpReported = false;
      const lcpId = generateMetricId('LCP');

      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          lcpValue = lastEntry.startTime;
          notifyLiveSubscribers({
            name: 'LCP',
            value: lcpValue,
            delta: lcpValue,
            rating: getMetricRating('LCP', lcpValue),
            id: lcpId,
          });
        }
      });

      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      const reportLCP = () => {
        if (lcpReported || lcpValue <= 0) return;
        lcpReported = true;
        lcpObserver.disconnect();
        const metric: WebVitalMetric = {
          name: 'LCP',
          value: lcpValue,
          delta: lcpValue,
          rating: getMetricRating('LCP', lcpValue),
          id: lcpId,
        };
        notifyLiveSubscribers(metric);
        onReport(metric);
      };

      const onVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
          reportLCP();
        }
      };

      window.addEventListener('keydown', reportLCP, { once: true, passive: true, capture: true });
      window.addEventListener('pointerdown', reportLCP, { once: true, passive: true, capture: true });
      document.addEventListener('visibilitychange', onVisibilityChange, { passive: true });
      window.addEventListener('pagehide', reportLCP, { once: true, passive: true });

      cleanups.push(() => {
        lcpObserver.disconnect();
        window.removeEventListener('keydown', reportLCP, true);
        window.removeEventListener('pointerdown', reportLCP, true);
        document.removeEventListener('visibilitychange', onVisibilityChange);
        window.removeEventListener('pagehide', reportLCP);
      });
    } catch {
      // Ignore observer errors on unsupported browsers
    }
  }

  // 2. First Input Delay (FID)
  if (supportedEntryTypes.includes('first-input')) {
    try {
      let fidReported = false;
      const fidId = generateMetricId('FID');

      const fidObserver = new PerformanceObserver((entryList) => {
        if (fidReported) return;
        const firstEntry = entryList.getEntries()[0] as PerformanceEventTiming | undefined;
        if (!firstEntry) return;

        fidReported = true;
        const fidValue = Math.max(0, firstEntry.processingStart - firstEntry.startTime);
        fidObserver.disconnect();

        const metric: WebVitalMetric = {
          name: 'FID',
          value: fidValue,
          delta: fidValue,
          rating: getMetricRating('FID', fidValue),
          id: fidId,
        };
        notifyLiveSubscribers(metric);
        onReport(metric);

        // Also seed INP if no event timing interaction has been recorded yet
        if (!liveMetricsStore.INP) {
          const inpFallback = Math.max(fidValue, firstEntry.duration || 0);
          notifyLiveSubscribers({
            name: 'INP',
            value: inpFallback,
            delta: inpFallback,
            rating: getMetricRating('INP', inpFallback),
            id: generateMetricId('INP'),
          });
        }
      });

      fidObserver.observe({ type: 'first-input', buffered: true });
      cleanups.push(() => fidObserver.disconnect());
    } catch {
      // Ignore observer errors on unsupported browsers
    }
  }

  // 3. Interaction to Next Paint (INP)
  if (supportedEntryTypes.includes('event')) {
    try {
      const inpId = generateMetricId('INP');
      const interactionDurations = new Map<number, number>();
      let maxInpValue = 0;
      let lastReportedInp = 0;

      const inpObserver = new PerformanceObserver((entryList) => {
        for (const rawEntry of entryList.getEntries()) {
          const entry = rawEntry as PerformanceEventTimingWithInteraction;
          const interactionId = entry.interactionId;
          if (!interactionId && entry.entryType !== 'first-input') continue;

          const key = interactionId || 1;
          const prev = interactionDurations.get(key) || 0;
          if (entry.duration > prev) {
            interactionDurations.set(key, entry.duration);
          }
        }

        if (interactionDurations.size > 0) {
          const sorted = Array.from(interactionDurations.values()).sort((a, b) => b - a);
          // 98th percentile interaction (top interaction for <50 interactions)
          const p98Index = Math.min(sorted.length - 1, Math.floor(sorted.length / 50));
          const candidateInp = sorted[p98Index];

          if (candidateInp >= maxInpValue) {
            const delta = candidateInp - maxInpValue;
            maxInpValue = candidateInp;
            notifyLiveSubscribers({
              name: 'INP',
              value: maxInpValue,
              delta,
              rating: getMetricRating('INP', maxInpValue),
              id: inpId,
            });
          }
        }
      });

      inpObserver.observe({
        type: 'event',
        buffered: true,
        // @ts-expect-error durationThreshold is part of Event Timing API
        durationThreshold: 16,
      });

      const reportINP = () => {
        if (maxInpValue <= 0 || maxInpValue === lastReportedInp) return;
        const delta = maxInpValue - lastReportedInp;
        lastReportedInp = maxInpValue;
        onReport({
          name: 'INP',
          value: maxInpValue,
          delta,
          rating: getMetricRating('INP', maxInpValue),
          id: inpId,
        });
      };

      const onVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
          reportINP();
        }
      };

      document.addEventListener('visibilitychange', onVisibilityChange, { passive: true });
      window.addEventListener('pagehide', reportINP, { passive: true });

      cleanups.push(() => {
        inpObserver.disconnect();
        document.removeEventListener('visibilitychange', onVisibilityChange);
        window.removeEventListener('pagehide', reportINP);
      });
    } catch {
      // Ignore observer errors on unsupported browsers
    }
  }

  // 4. Cumulative Layout Shift (CLS) — Session Window Algorithm (max 5s window, 1s gap)
  if (supportedEntryTypes.includes('layout-shift')) {
    try {
      let clsValue = 0;
      let clsReportedValue = 0;
      let sessionValue = 0;
      let sessionEntries: LayoutShiftEntry[] = [];
      const clsId = initialClsId;

      const clsObserver = new PerformanceObserver((entryList) => {
        for (const rawEntry of entryList.getEntries()) {
          const entry = rawEntry as LayoutShiftEntry;
          if (entry.hadRecentInput) continue;

          const firstSessionEntry = sessionEntries[0];
          const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

          if (
            sessionValue &&
            lastSessionEntry &&
            firstSessionEntry &&
            entry.startTime - lastSessionEntry.startTime < 1000 &&
            entry.startTime - firstSessionEntry.startTime < 5000
          ) {
            sessionValue += entry.value;
            sessionEntries.push(entry);
          } else {
            sessionValue = entry.value;
            sessionEntries = [entry];
          }

          if (sessionValue > clsValue) {
            const delta = sessionValue - clsValue;
            clsValue = sessionValue;
            notifyLiveSubscribers({
              name: 'CLS',
              value: clsValue,
              delta,
              rating: getMetricRating('CLS', clsValue),
              id: clsId,
            });
          }
        }
      });

      clsObserver.observe({ type: 'layout-shift', buffered: true });

      const reportCLS = () => {
        const delta = clsValue - clsReportedValue;
        if (delta <= 0 && clsReportedValue > 0) return;
        if (clsValue >= 0 && (delta > 0 || clsReportedValue === 0)) {
          const currentDelta = clsReportedValue === 0 ? clsValue : delta;
          clsReportedValue = clsValue;
          onReport({
            name: 'CLS',
            value: clsValue,
            delta: currentDelta,
            rating: getMetricRating('CLS', clsValue),
            id: clsId,
          });
        }
      };

      const onVisibilityChange = () => {
        if (document.visibilityState === 'hidden') {
          reportCLS();
        }
      };

      document.addEventListener('visibilitychange', onVisibilityChange, { passive: true });
      window.addEventListener('pagehide', reportCLS, { passive: true });

      cleanups.push(() => {
        clsObserver.disconnect();
        document.removeEventListener('visibilitychange', onVisibilityChange);
        window.removeEventListener('pagehide', reportCLS);
      });
    } catch {
      // Ignore observer errors on unsupported browsers
    }
  }

  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
}
