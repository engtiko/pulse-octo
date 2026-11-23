/**
 * High-performance IntersectionObserver utility for lazy-loading images
 * and deferring below-the-fold asset execution across the application.
 * Ensures fast initial paint (FCP & LCP) and prevents unnecessary bandwidth consumption.
 */

export interface LazyLoadOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

const DEFAULT_OPTIONS: LazyLoadOptions = {
  root: null,
  rootMargin: '200px 0px 200px 0px', // Pre-fetch 200px before scrolling into view
  threshold: 0.01,
};

type IntersectionCallback = (entry: IntersectionObserverEntry, observer: IntersectionObserver) => void;

class GlobalIntersectionManager {
  private observer: IntersectionObserver | null = null;
  private callbacks: WeakMap<Element, IntersectionCallback> = new WeakMap();

  constructor() {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cb = this.callbacks.get(entry.target);
            if (cb) {
              cb(entry, obs);
              // Clean up once intersected to avoid memory leaks
              this.unobserve(entry.target);
            }
          }
        });
      }, DEFAULT_OPTIONS);
    }
  }

  public observe(element: Element, callback: IntersectionCallback): void {
    if (!this.observer) {
      // Fallback for environments lacking IntersectionObserver
      callback(
        { isIntersecting: true, target: element } as unknown as IntersectionObserverEntry,
        null as unknown as IntersectionObserver
      );
      return;
    }

    this.callbacks.set(element, callback);
    this.observer.observe(element);
  }

  public unobserve(element: Element): void {
    if (this.observer) {
      this.observer.unobserve(element);
      this.callbacks.delete(element);
    }
  }
}

let globalManager: GlobalIntersectionManager | null = null;

export function getGlobalIntersectionManager(): GlobalIntersectionManager {
  if (!globalManager) {
    globalManager = new GlobalIntersectionManager();
  }
  return globalManager;
}

/**
 * Attaches lazy-loading logic to a specific HTMLImageElement.
 * Swaps `data-lazy-src` to `src` when scrolled within 200px of viewport.
 */
export function lazyLoadImageElement(
  img: HTMLImageElement,
  options?: LazyLoadOptions
): () => void {
  if (typeof window === 'undefined') return () => {};

  const manager = getGlobalIntersectionManager();

  const handleIntersect: IntersectionCallback = () => {
    const dataSrc = img.getAttribute('data-lazy-src');
    if (dataSrc) {
      img.src = dataSrc;
      img.removeAttribute('data-lazy-src');
    }

    const dataSrcSet = img.getAttribute('data-lazy-srcset');
    if (dataSrcSet) {
      img.srcset = dataSrcSet;
      img.removeAttribute('data-lazy-srcset');
    }

    img.setAttribute('data-lazy-loaded', 'true');
    img.classList.remove('opacity-0');
    img.classList.add('opacity-100');
  };

  manager.observe(img, handleIntersect);

  return () => {
    manager.unobserve(img);
  };
}

/**
 * Initializes automatic global observation for all images with `data-lazy-src`
 * or `loading="lazy"` across the DOM, including dynamically inserted nodes.
 */
export function initGlobalImageLazyLoader(): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }

  const manager = getGlobalIntersectionManager();

  const scanAndObserve = () => {
    const images = document.querySelectorAll<HTMLImageElement>(
      'img[data-lazy-src]:not([data-lazy-observed="true"])'
    );

    images.forEach((img) => {
      img.setAttribute('data-lazy-observed', 'true');
      lazyLoadImageElement(img);
    });
  };

  // Initial scan
  scanAndObserve();

  // Watch for dynamic DOM updates (e.g. client-side page transitions, carousels)
  const mutationObserver = new MutationObserver(() => {
    scanAndObserve();
  });

  mutationObserver.observe(document.body, {
    childList: true,
    subtree: true,
  });

  return () => {
    mutationObserver.disconnect();
  };
}
