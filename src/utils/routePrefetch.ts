/**
 * Lightweight Quicklink + Vite Route Chunk Prefetching Engine
 * Prefetches secondary route chunks and clean URLs in the background when:
 * 1. A user hovers over, focuses, or touches navigation links (45ms hover intent)
 * 2. Navigation links enter the viewport during browser idle time (IntersectionObserver + requestIdleCallback)
 *
 * Strictly respects Data Saver (`navigator.connection.saveData`) and slow connections (`slow-2g`, `2g`).
 */

import React from 'react';

type ChunkLoader = () => Promise<unknown>;

interface NetworkInformationLike {
  saveData?: boolean;
  effectiveType?: string;
}

const EmptyFallbackComponent: React.FC = () => null;

/**
 * Wraps a dynamic import factory with automatic retry logic and a safe fallback component
 * to prevent "Uncaught TypeError: Failed to fetch dynamically imported module" in preview/HMR environments.
 */
export function importWithRetry<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  retries = 2,
  intervalMs = 350
): () => Promise<{ default: T }> {
  return () =>
    new Promise<{ default: T }>((resolve) => {
      const attempt = (remaining: number) => {
        factory()
          .then(resolve)
          .catch(() => {
            if (remaining > 0) {
              setTimeout(() => attempt(remaining - 1), intervalMs);
            } else {
              resolve({ default: EmptyFallbackComponent as unknown as T });
            }
          });
      };
      attempt(retries);
    });
}

export function lazyWithRetry<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return React.lazy(importWithRetry(factory));
}

// Shared dynamic import factories used by both React.lazy() in App.tsx and the prefetcher
export const pageChunkLoaders = {
  'who-we-are': importWithRetry(() => import('../pages/WhoWeArePage').then((m) => ({ default: m.WhoWeArePage }))),
  'the-8-arms': importWithRetry(() => import('../pages/EightArmsPage').then((m) => ({ default: m.EightArmsPage }))),
  'services': importWithRetry(() => import('../pages/ServicesPage').then((m) => ({ default: m.ServicesPage }))),
  'portfolio': importWithRetry(() => import('../pages/PortfolioPage').then((m) => ({ default: m.PortfolioPage }))),
  'blog': importWithRetry(() => import('../pages/BlogPage').then((m) => ({ default: m.BlogPage }))),
  'contact': importWithRetry(() => import('../pages/ContactPage').then((m) => ({ default: m.ContactPage }))),
  'card': importWithRetry(() => import('../pages/DigitalBusinessCardPage').then((m) => ({ default: m.DigitalBusinessCardPage }))),
} as const;

// Map clean slugs, route IDs, and arm identifiers to their canonical chunk key and clean path
const ROUTE_TO_CHUNK_KEY: Record<string, keyof typeof pageChunkLoaders> = {
  'who-we-are': 'who-we-are',
  'about': 'who-we-are',
  'the-8-arms': 'the-8-arms',
  'eight-arms': 'the-8-arms',
  'arms': 'the-8-arms',
  'services': 'services',
  'our-services': 'services',
  'portfolio': 'portfolio',
  'projects': 'portfolio',
  'blog': 'blog',
  'insights': 'blog',
  'contact': 'contact',
  'card': 'card',
  'vcard': 'card',
  'tarek': 'card',
  'ceo': 'card',
  'id': 'card',
  // The 8 Arms clean slugs & IDs also warm the 8-arms chunk for instant transitions
  'branding': 'the-8-arms',
  'digital-marketing': 'the-8-arms',
  'web-ecommerce': 'the-8-arms',
  'creative-studio': 'the-8-arms',
  'digital-products': 'the-8-arms',
  'brand-strategy': 'the-8-arms',
  'content-creation': 'the-8-arms',
  'seo-growth': 'the-8-arms',
  'arm-1': 'the-8-arms',
  'arm-2': 'the-8-arms',
  'arm-3': 'the-8-arms',
  'arm-4': 'the-8-arms',
  'arm-5': 'the-8-arms',
  'arm-6': 'the-8-arms',
  'arm-7': 'the-8-arms',
  'arm-8': 'the-8-arms',
};

const prefetchedChunks = new Set<string>();
const prefetchedDocumentPaths = new Set<string>();

/**
 * Checks whether the user's network connection permits background prefetching.
 */
function canPrefetch(): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  const conn = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
  if (conn) {
    if (conn.saveData) return false;
    if (conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g') return false;
  }
  return true;
}

/**
 * Normalizes a route ID, clean path, or URL into a clean route token (e.g. 'portfolio', 'branding').
 */
function normalizeRouteToken(rawTarget: string): string {
  if (!rawTarget) return '';
  let cleaned = rawTarget.trim();
  try {
    if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
      const url = new URL(cleaned);
      if (typeof window !== 'undefined' && url.origin !== window.location.origin) {
        return '';
      }
      cleaned = url.pathname;
    }
  } catch {
    return '';
  }
  return cleaned.replace(/^[#/]+|\/+$/g, '').trim().toLowerCase();
}

/**
 * Injects a low-priority <link rel="prefetch"> tag for clean route paths once per session.
 */
function injectLinkPrefetch(token: string): void {
  if (typeof document === 'undefined' || !token || token === 'home') return;
  const cleanPath = `/${token}`;
  if (prefetchedDocumentPaths.has(cleanPath)) return;
  if (typeof window !== 'undefined' && window.location.pathname === cleanPath) return;

  prefetchedDocumentPaths.add(cleanPath);
  try {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = cleanPath;
    link.as = 'document';
    document.head.appendChild(link);
  } catch {
    // Ignore if DOM head manipulation is restricted
  }
}

/**
 * Prefetches the JS/CSS chunk and document hint for a given route identifier or clean URL.
 * Safe to call repeatedly; each chunk is only fetched once.
 */
export function prefetchRoute(routeOrPath: string): void {
  if (!canPrefetch()) return;

  const token = normalizeRouteToken(routeOrPath);
  if (!token || token === 'home') return;

  const chunkKey = ROUTE_TO_CHUNK_KEY[token];
  if (chunkKey && !prefetchedChunks.has(chunkKey)) {
    prefetchedChunks.add(chunkKey);
    const loader: ChunkLoader = pageChunkLoaders[chunkKey];
    if (loader) {
      // Trigger Vite dynamic import to cache the module in memory before navigation click
      loader().catch(() => {
        // Allow retry later if a transient network glitch occurred
        prefetchedChunks.delete(chunkKey);
      });
    }
  }

  // Also inject browser-level prefetch hint for known clean routes
  if (chunkKey) {
    injectLinkPrefetch(token);
  }
}

/**
 * Schedules a non-blocking callback during browser idle periods.
 */
function scheduleIdle(cb: () => void, timeout = 2000): void {
  if (typeof window === 'undefined') return;
  const win = window as Window & {
    requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
  };
  if (typeof win.requestIdleCallback === 'function') {
    win.requestIdleCallback(cb, { timeout });
  } else {
    window.setTimeout(cb, 350);
  }
}

/**
 * Extracts a prefetchable route token from a DOM element or its closest interactive ancestor.
 */
function getRouteTokenFromElement(target: EventTarget | null): string {
  if (!(target instanceof Element)) return '';

  const prefetchEl = target.closest('[data-prefetch-route]');
  if (prefetchEl) {
    const attr = prefetchEl.getAttribute('data-prefetch-route');
    if (attr) return attr;
  }

  const armEl = target.closest('[data-arm-id]');
  if (armEl) {
    const armId = armEl.getAttribute('data-arm-id');
    if (armId) return `arm-${armId}`;
  }

  const anchorEl = target.closest('a[href]') as HTMLAnchorElement | null;
  if (anchorEl && anchorEl.href) {
    const rawHref = anchorEl.getAttribute('href') || '';
    if (
      rawHref.startsWith('/') &&
      !rawHref.startsWith('//') &&
      !anchorEl.target &&
      !anchorEl.hasAttribute('download')
    ) {
      return rawHref;
    }
  }

  return '';
}

/**
 * Initializes the global Quicklink-style route prefetcher:
 * 1. Delegated hover-intent (45ms), focusin, and touchstart listeners for instant chunk warming
 * 2. Viewport IntersectionObserver during idle time for visible navigation elements
 */
export function initQuicklinkPrefetch(): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }

  let hoverTimer: number | null = null;
  let lastHoveredToken = '';

  const handleMouseOver = (e: MouseEvent) => {
    const token = getRouteTokenFromElement(e.target);
    if (!token || token === lastHoveredToken) return;
    lastHoveredToken = token;

    if (hoverTimer !== null) {
      window.clearTimeout(hoverTimer);
    }
    hoverTimer = window.setTimeout(() => {
      prefetchRoute(token);
      hoverTimer = null;
    }, 45);
  };

  const handleMouseOut = () => {
    lastHoveredToken = '';
    if (hoverTimer !== null) {
      window.clearTimeout(hoverTimer);
      hoverTimer = null;
    }
  };

  const handleFocusOrTouch = (e: Event) => {
    const token = getRouteTokenFromElement(e.target);
    if (token) {
      prefetchRoute(token);
    }
  };

  document.addEventListener('mouseover', handleMouseOver, { passive: true });
  document.addEventListener('mouseout', handleMouseOut, { passive: true });
  document.addEventListener('focusin', handleFocusOrTouch, { passive: true });
  document.addEventListener('touchstart', handleFocusOrTouch, { passive: true });

  // Quicklink Viewport IntersectionObserver: observe [data-prefetch-route] and internal links during idle time
  let io: IntersectionObserver | null = null;

  scheduleIdle(() => {
    if (!canPrefetch() || typeof IntersectionObserver === 'undefined') return;

    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            io?.unobserve(el);
            const token = getRouteTokenFromElement(el);
            if (token) {
              scheduleIdle(() => prefetchRoute(token), 1500);
            }
          }
        });
      },
      { rootMargin: '150px' }
    );

    const candidates = document.querySelectorAll('[data-prefetch-route], a[href^="/"]');
    candidates.forEach((el) => io?.observe(el));
  }, 1800);

  return () => {
    if (hoverTimer !== null) {
      window.clearTimeout(hoverTimer);
    }
    document.removeEventListener('mouseover', handleMouseOver);
    document.removeEventListener('mouseout', handleMouseOut);
    document.removeEventListener('focusin', handleFocusOrTouch);
    document.removeEventListener('touchstart', handleFocusOrTouch);
    if (io) {
      io.disconnect();
      io = null;
    }
  };
}
