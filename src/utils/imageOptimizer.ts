/**
 * Local Responsive WebP Image Optimizer
 *
 * Serves locally compressed WebP images (`-sm.webp` 640w for mobile, `.webp` 1280w for desktop)
 * directly from the `/public` directory without any external cloud services or environment variables.
 */

export interface ResponsiveImageOptions {
  width?: number;
  quality?: number;
  sizes?: string;
  isLogo?: boolean;
}

export interface OptimizedImageResult {
  src: string;
  srcSet?: string;
  sizes?: string;
  fallbackSrc: string;
}

/**
 * Checks whether a local path belongs to our pre-compressed WebP asset directories in `/public`:
 * - `/posters/...`
 * - `/projects/...`
 * - `/1.webp` .. `/8.webp` (or `.jpeg`)
 * - `/12.webp`, `/CEO.webp` (or `.png`)
 */
function isLocalConvertibleAsset(src: string): boolean {
  if (!src || src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return false;
  }
  const clean = decodeURIComponent(src.split('?')[0]);
  if (!/\.(jpe?g|png|webp)$/i.test(clean)) return false;

  return (
    clean.startsWith('/posters/') ||
    clean.startsWith('/projects/') ||
    /^\/[1-8](-sm)?\.(jpe?g|webp)$/i.test(clean) ||
    /^\/(12|CEO|pulse-octo-banner)(-sm)?\.(png|jpe?g|webp)$/i.test(clean)
  );
}

/**
 * Converts a local asset path (e.g. `/projects/logo L.webp` or `/1.webp`)
 * into its desktop `.webp` and mobile `-sm.webp` paths, preserving URL encoding for spaces.
 */
function getLocalWebpVariants(src: string): {
  desktopWebp: string;
  mobileWebp: string;
  original: string;
} {
  const clean = decodeURIComponent(src.split('?')[0]);
  const baseNoExt = clean.replace(/(-sm)?\.(jpe?g|png|webp)$/i, '');

  const encodeSegments = (p: string) =>
    p
      .split('/')
      .map((seg) => encodeURIComponent(seg))
      .join('/');

  const desktopWebp = encodeSegments(`${baseNoExt}.webp`);
  const mobileWebp = encodeSegments(`${baseNoExt}-sm.webp`);

  return {
    desktopWebp,
    mobileWebp,
    original: desktopWebp,
  };
}

/**
 * Returns locally optimized WebP `src`, `srcSet`, `sizes`, and `fallbackSrc` for any image in the app.
 */
export function getOptimizedImageProps(
  rawSrc: string,
  options: ResponsiveImageOptions = {}
): OptimizedImageResult {
  if (!rawSrc) {
    return { src: '', fallbackSrc: '' };
  }

  const isMobileViewport =
    typeof window !== 'undefined' && window.innerWidth < 768;
  const defaultSizes =
    options.sizes ??
    (options.isLogo
      ? '(max-width: 767px) 96px, 160px'
      : '(max-width: 767px) 100vw, (max-width: 1200px) 50vw, 33vw');

  if (isLocalConvertibleAsset(rawSrc)) {
    const { desktopWebp, mobileWebp, original } = getLocalWebpVariants(rawSrc);
    const preferredSrc = isMobileViewport ? mobileWebp : desktopWebp;
    const srcSet = options.isLogo
      ? `${mobileWebp} 200w, ${desktopWebp} 400w`
      : `${mobileWebp} 640w, ${desktopWebp} 1280w`;
    return {
      src: preferredSrc,
      srcSet,
      sizes: defaultSizes,
      fallbackSrc: original,
    };
  }

  return {
    src: rawSrc,
    fallbackSrc: rawSrc,
  };
}
