/**
 * Image Preloader Utility for Page Transitions.
 * Preloads critical images for the target page to ensure zero layout shift
 * and silky-smooth rendering. Provides real-time percentage progress callback
 * to power the PageTransitionBar loading animation.
 */

// Critical image paths mapped by page route
export const CRITICAL_PAGE_IMAGES: Record<string, string[]> = {
  home: [
    '/12.webp',
    '/posters/hero-poster.webp',
  ],
  'who-we-are': [
    '/12.webp',
    '/CEO.webp',
  ],
  'the-8-arms': [
    '/12.webp',
    '/1.webp',
  ],
  portfolio: [
    '/projects/ladies-caver1.webp',
    '/projects/ZCover.webp',
    '/projects/n-paner.webp',
    '/projects/h-cover.webp',
  ],
  blog: [
    '/12.webp',
  ],
  contact: [
    '/12.webp',
  ],
};

export interface PreloadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export type ProgressCallback = (progress: PreloadProgress) => void;

/**
 * Preloads the critical images for a given pageKey.
 * Calls onProgress as each image successfully loads or errors.
 * Returns a cancel function.
 */
export function preloadPageImages(
  pageKey: string,
  onProgress?: ProgressCallback,
  timeoutMs: number = 1800
): { cancel: () => void; promise: Promise<void> } {
  let isCancelled = false;
  const urls = CRITICAL_PAGE_IMAGES[pageKey] || ['/12.webp'];
  const total = urls.length;

  let loadedCount = 0;

  const cancel = () => {
    isCancelled = true;
  };

  const promise = new Promise<void>((resolve) => {
    if (total === 0) {
      if (onProgress) onProgress({ loaded: 0, total: 0, percentage: 100 });
      resolve();
      return;
    }

    // Safety timeout: never hang the progress bar if an image request stalls
    const timeoutId = setTimeout(() => {
      if (!isCancelled) {
        if (onProgress) onProgress({ loaded: total, total, percentage: 100 });
        resolve();
      }
    }, timeoutMs);

    const checkComplete = () => {
      loadedCount++;
      const pct = Math.min(100, Math.round((loadedCount / total) * 100));

      if (!isCancelled && onProgress) {
        onProgress({
          loaded: loadedCount,
          total,
          percentage: pct,
        });
      }

      if (loadedCount >= total) {
        clearTimeout(timeoutId);
        if (!isCancelled) {
          resolve();
        }
      }
    };

    urls.forEach((url) => {
      if (typeof window === 'undefined') {
        checkComplete();
        return;
      }

      const img = new Image();
      img.referrerPolicy = 'no-referrer';

      img.onload = () => {
        checkComplete();
      };

      img.onerror = () => {
        // Even on error, we count it as finished so the progress bar doesn't hang
        checkComplete();
      };

      img.src = url;
    });
  });

  return { cancel, promise };
}
