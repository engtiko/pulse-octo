/**
 * Accessibility & SEO Image Alt-Text Enforcer (`imageAltEnforcer.ts`)
 *
 * Scans the DOM (and observes dynamic SPA route transitions/modals) for any `<img>`
 * elements missing an `alt` attribute or containing non-descriptive placeholder values,
 * and automatically generates a meaningful, context-aware `alt` description from:
 *   1. Explicit semantic attributes (`data-alt`, `title`, `aria-label`)
 *   2. Surrounding DOM context (`<figcaption>`, card/section `<h1>`–`<h6>` headings, parent link labels)
 *   3. Image filename semantics (known PULSE OCTO brand/service keywords or humanized slug)
 *   4. Page/Brand fallback for opaque URLs
 *
 * Strictly preserves intentional decorative images (`aria-hidden="true"`, `role="presentation"`, `role="none"`)
 * by ensuring they carry `alt=""` per WCAG 2.1 AA guidelines.
 */

const GENERIC_ALT_PATTERNS = /^(?:img|image|photo|picture|pic|graphic|banner|icon|untitled|placeholder|default|dsc_?\d+|img_?\d+|screenshot.*|\d+|\s*)$/i;

const KNOWN_KEYWORD_MAP_AR: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /logo|pulse[-_]?octo[-_]?logo/i, label: 'شعار وكالة PULSE OCTO للحلول الرقمية وبناء العلامات التجارية' },
  { pattern: /octopus|octo[-_]?core|hero/i, label: 'النظام الرقمي المتكامل لوكالة PULSE OCTO — ثمانية أذرع بنبض واحد' },
  { pattern: /branding|identity|arm[-_]?1/i, label: 'تصميم الهوية البصرية وبناء العلامة التجارية — PULSE OCTO' },
  { pattern: /marketing|ads|campaign|arm[-_]?2/i, label: 'التسويق الرقمي وإدارة الحملات الإعلانية الممولة — PULSE OCTO' },
  { pattern: /web|ecommerce|store|shopify|salla|arm[-_]?3/i, label: 'تصميم وبرمجة المواقع المخصصة وتطوير المتاجر الإلكترونية — PULSE OCTO' },
  { pattern: /studio|production|video|shoot|arm[-_]?4/i, label: 'الاستوديو والإنتاج الإبداعي والتصوير الاحترافي — PULSE OCTO' },
  { pattern: /product|saas|app|ui[-_]?ux|arm[-_]?5/i, label: 'تطوير المنتجات والحلول الرقمية وتجربة المستخدم — PULSE OCTO' },
  { pattern: /strategy|research|market|arm[-_]?6/i, label: 'الاستراتيجية الرقمية ودراسة السوق ونمو الأعمال — PULSE OCTO' },
  { pattern: /content|copywriting|social|arm[-_]?7/i, label: 'صناعة المحتوى الإبداعي والكتابة الإعلانية — PULSE OCTO' },
  { pattern: /seo|growth|search|arm[-_]?8/i, label: 'النمو الرقمي وتصدر نتائج محركات البحث SEO — PULSE OCTO' },
];

const KNOWN_KEYWORD_MAP_EN: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /logo|pulse[-_]?octo[-_]?logo/i, label: 'PULSE OCTO Integrated Digital Agency Logo' },
  { pattern: /octopus|octo[-_]?core|hero/i, label: 'PULSE OCTO Integrated Growth System — 8 Arms One Pulse' },
  { pattern: /branding|identity|arm[-_]?1/i, label: 'Brand Identity & Visual System Design — PULSE OCTO' },
  { pattern: /marketing|ads|campaign|arm[-_]?2/i, label: 'Digital Marketing & Performance Campaigns — PULSE OCTO' },
  { pattern: /web|ecommerce|store|shopify|salla|arm[-_]?3/i, label: 'Custom Web & E-Commerce Development — PULSE OCTO' },
  { pattern: /studio|production|video|shoot|arm[-_]?4/i, label: 'Creative Studio & Commercial Production — PULSE OCTO' },
  { pattern: /product|saas|app|ui[-_]?ux|arm[-_]?5/i, label: 'Digital Products & UI/UX Engineering — PULSE OCTO' },
  { pattern: /strategy|research|market|arm[-_]?6/i, label: 'Brand Strategy & Market Intelligence — PULSE OCTO' },
  { pattern: /content|copywriting|social|arm[-_]?7/i, label: 'Content Creation & Creative Copywriting — PULSE OCTO' },
  { pattern: /seo|growth|search|arm[-_]?8/i, label: 'SEO Authority & Organic Digital Growth — PULSE OCTO' },
];

function isArabicDocument(): boolean {
  if (typeof document === 'undefined') return true;
  const lang = (document.documentElement.lang || 'ar').toLowerCase();
  return lang.startsWith('ar');
}

/**
 * Checks whether an image is explicitly marked as decorative per WCAG standards.
 */
function isDecorativeImage(img: HTMLImageElement): boolean {
  const role = img.getAttribute('role');
  const ariaHidden = img.getAttribute('aria-hidden');
  const dataDecorative = img.getAttribute('data-decorative');
  return (
    role === 'presentation' ||
    role === 'none' ||
    ariaHidden === 'true' ||
    dataDecorative === 'true'
  );
}

/**
 * Extracts a clean, human-readable phrase from an image URL or filename.
 */
export function extractReadableNameFromSrc(rawSrc: string): string {
  if (!rawSrc || rawSrc.startsWith('data:') || rawSrc.startsWith('blob:')) {
    return '';
  }

  try {
    const cleanUrl = rawSrc.split('?')[0].split('#')[0];
    const segments = cleanUrl.split('/').filter(Boolean);
    const lastSegment = decodeURIComponent(segments[segments.length - 1] || '');

    // Remove file extension
    const withoutExt = lastSegment.replace(/\.[a-z0-9]{2,5}$/i, '');

    // Strip common build hashes, dimensions (e.g., 1920x1080), and UUID-like suffixes
    const cleaned = withoutExt
      .replace(/[-_.]?[0-9a-f]{8,}$/i, '')
      .replace(/[-_.]?\d{2,4}x\d{2,4}/gi, '')
      .replace(/^(?:photo|image|img|asset|media)[-_]?/i, '')
      .replace(/[-_]+/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\s+/g, ' ')
      .trim();

    // Ignore purely numeric or very short cryptic tokens
    if (!cleaned || cleaned.length < 3 || /^\d+[\s\d-]*$/.test(cleaned)) {
      return '';
    }

    // Title-case Latin words while preserving Arabic characters
    return cleaned
      .split(' ')
      .map((word) =>
        /^[a-z]/i.test(word) ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : word
      )
      .join(' ');
  } catch {
    return '';
  }
}

/**
 * Inspects nearby DOM nodes (figcaption, card headings, section headings, parent links)
 * to infer semantic context for an image.
 */
function extractContextFromDOM(img: HTMLImageElement): string {
  // 1. Explicit attributes on the image itself
  const explicit =
    img.getAttribute('data-alt')?.trim() ||
    img.getAttribute('title')?.trim() ||
    img.getAttribute('aria-label')?.trim();
  if (explicit && !GENERIC_ALT_PATTERNS.test(explicit)) {
    return explicit;
  }

  // 2. Inside a <figure> with <figcaption>
  const figure = img.closest('figure');
  if (figure) {
    const figcaption = figure.querySelector('figcaption');
    const captionText = figcaption?.textContent?.replace(/\s+/g, ' ').trim();
    if (captionText && captionText.length >= 3) {
      return captionText.slice(0, 125);
    }
  }

  // 3. Inside an interactive link or button with aria-label or text
  const interactiveParent = img.closest('a, button');
  if (interactiveParent) {
    const parentLabel =
      interactiveParent.getAttribute('aria-label')?.trim() ||
      interactiveParent.getAttribute('title')?.trim() ||
      interactiveParent.textContent?.replace(/\s+/g, ' ').trim();
    if (parentLabel && parentLabel.length >= 2 && parentLabel.length <= 100) {
      return parentLabel;
    }
  }

  // 4. Inside a card/article/container with a heading (h1-h6)
  const container = img.closest('article, [data-card], li, section, div');
  if (container) {
    const heading = container.querySelector('h1, h2, h3, h4, h5, h6');
    const headingText = heading?.textContent?.replace(/\s+/g, ' ').trim();
    if (headingText && headingText.length >= 3) {
      return headingText.slice(0, 110);
    }
  }

  // 5. Nearest section heading in the page
  const section = img.closest('section, main');
  if (section) {
    const sectionHeading = section.querySelector('h1, h2, h3');
    const sectionHeadingText = sectionHeading?.textContent?.replace(/\s+/g, ' ').trim();
    if (sectionHeadingText && sectionHeadingText.length >= 3) {
      return sectionHeadingText.slice(0, 110);
    }
  }

  return '';
}

/**
 * Generates a descriptive, SEO-friendly `alt` text for a given `HTMLImageElement`
 * based on its filename, attributes, and surrounding DOM context.
 */
export function generateDescriptiveAlt(img: HTMLImageElement): string {
  const isAr = isArabicDocument();
  const rawSrc =
    img.getAttribute('src') ||
    img.getAttribute('data-lazy-src') ||
    img.currentSrc ||
    '';

  // 1. Check DOM context first (headings, captions, labels provide the richest context)
  const domContext = extractContextFromDOM(img);

  // 2. Check known brand/service keywords in URL or class names
  const combinedHint = `${rawSrc} ${img.className || ''}`;
  const keywordMap = isAr ? KNOWN_KEYWORD_MAP_AR : KNOWN_KEYWORD_MAP_EN;
  for (const entry of keywordMap) {
    if (entry.pattern.test(combinedHint)) {
      if (domContext && !entry.label.includes(domContext)) {
        return `${domContext} — ${entry.label}`;
      }
      return entry.label;
    }
  }

  // 3. Extract readable name from image filename
  const readableFilename = extractReadableNameFromSrc(rawSrc);

  if (domContext && readableFilename && !domContext.toLowerCase().includes(readableFilename.toLowerCase())) {
    return `${domContext} (${readableFilename}) — PULSE OCTO`;
  }

  if (domContext) {
    return domContext.includes('PULSE OCTO') ? domContext : `${domContext} — PULSE OCTO`;
  }

  if (readableFilename) {
    return isAr
      ? `${readableFilename} — وكالة PULSE OCTO للحلول الرقمية`
      : `${readableFilename} — PULSE OCTO Digital Agency`;
  }

  // 4. Final fallback using document title or brand line
  return isAr
    ? 'عرض بصري من منظومة PULSE OCTO للحلول الرقمية المتكاملة'
    : 'Visual showcase from PULSE OCTO Integrated Digital Growth System';
}

/**
 * Evaluates a single `<img>` element and populates a descriptive `alt` attribute
 * if missing or generic.
 */
export function enforceImageAltOnElement(img: HTMLImageElement): void {
  // Ensure explicit width and height attributes exist to prevent Cumulative Layout Shift (CLS)
  if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
    const w = img.naturalWidth || Math.round(img.getBoundingClientRect().width) || 640;
    const h = img.naturalHeight || Math.round(img.getBoundingClientRect().height) || 400;
    if (!img.hasAttribute('width')) {
      img.setAttribute('width', String(w));
    }
    if (!img.hasAttribute('height')) {
      img.setAttribute('height', String(h));
    }
  }

  if (isDecorativeImage(img)) {
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', '');
    }
    return;
  }

  const currentAlt = img.getAttribute('alt');
  const isAutoGenerated = img.getAttribute('data-auto-alt') === 'true';
  const needsAlt =
    isAutoGenerated ||
    currentAlt === null ||
    currentAlt.trim() === '' ||
    GENERIC_ALT_PATTERNS.test(currentAlt.trim());

  if (needsAlt) {
    const generatedAlt = generateDescriptiveAlt(img);
    if (currentAlt !== generatedAlt) {
      img.setAttribute('alt', generatedAlt);
    }
    img.setAttribute('data-auto-alt', 'true');
  }
}

/**
 * Scans all `<img>` tags currently in the document and enforces descriptive `alt` text.
 */
export function scanAndEnforceImageAlts(root: ParentNode = document): void {
  if (typeof document === 'undefined') return;
  const runScan = () => {
    const images = root.querySelectorAll<HTMLImageElement>('img');
    images.forEach(enforceImageAltOnElement);
  };

  if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(runScan, { timeout: 1200 });
  } else if (typeof window !== 'undefined') {
    setTimeout(runScan, 120);
  } else {
    runScan();
  }
}

/**
 * Initializes a global observer that automatically scans all existing and
 * dynamically rendered `<img>` tags across route transitions, ensuring 100%
 * accessibility and SEO `alt` attribute compliance.
 */
export function initImageAltEnforcer(): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }

  // Initial scan scheduled during browser idle time
  scanAndEnforceImageAlts(document);

  // Observe dynamically mounted components, lazy-loaded images, and language changes
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== Node.ELEMENT_NODE) return;
          const el = node as Element;
          if (el.tagName === 'IMG') {
            enforceImageAltOnElement(el as HTMLImageElement);
          } else {
            scanAndEnforceImageAlts(el);
          }
        });
      } else if (
        mutation.type === 'attributes' &&
        mutation.target.nodeType === Node.ELEMENT_NODE &&
        (mutation.target as Element).tagName === 'IMG'
      ) {
        enforceImageAltOnElement(mutation.target as HTMLImageElement);
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src', 'data-lazy-src'],
  });

  return () => {
    observer.disconnect();
  };
}
