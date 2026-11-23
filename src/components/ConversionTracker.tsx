import React, { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & {
      callMethod?: (...args: unknown[]) => void;
      queue?: unknown[];
      loaded?: boolean;
      version?: string;
      push?: (...args: unknown[]) => void;
    };
    _fbq?: unknown;
  }
}

export interface ConversionTrackerProps {
  currentPage?: string;
  gaMeasurementId?: string;
  metaPixelId?: string;
}

const metaEnv = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;

const DEFAULT_GA_ID = metaEnv?.VITE_GA_MEASUREMENT_ID?.trim() || 'G-MR348F9WVB';

const DEFAULT_PIXEL_ID = metaEnv?.VITE_META_PIXEL_ID?.trim() || '108492038492018';

/**
 * Helper to dispatch custom events to both Google Analytics 4 and Meta Pixel
 */
export const trackConversionEvent = (
  eventName: string,
  params: Record<string, unknown> = {},
  metaStandardEvent?: string
) => {
  if (typeof window === 'undefined') return;

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }

  if (typeof window.fbq === 'function') {
    if (metaStandardEvent) {
      window.fbq('track', metaStandardEvent, params);
    }
    window.fbq('trackCustom', eventName, params);
  }
};

export const ConversionTracker: React.FC<ConversionTrackerProps> = ({
  currentPage = 'home',
  gaMeasurementId = DEFAULT_GA_ID,
  metaPixelId = DEFAULT_PIXEL_ID,
}) => {
  // 1. Initialize Google Analytics 4 (GA4) & Meta Pixel on mount
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    // --- Google Analytics 4 Initialization ---
    if (!window.dataLayer) {
      window.dataLayer = [];
    }
    if (!window.gtag) {
      window.gtag = function gtag(...args: unknown[]) {
        window.dataLayer?.push(args);
      };
      window.gtag('js', new Date());
      window.gtag('config', gaMeasurementId, {
        send_page_view: true,
        anonymize_ip: true,
      });
    }

    // --- Meta Pixel Initialization ---
    if (!window.fbq) {
      const fbqStub: Window['fbq'] = function (...args: unknown[]) {
        if (fbqStub.callMethod) {
          fbqStub.callMethod(...args);
        } else {
          fbqStub.queue?.push(args);
        }
      };
      fbqStub.push = fbqStub;
      fbqStub.loaded = true;
      fbqStub.version = '2.0';
      fbqStub.queue = [];
      window.fbq = fbqStub;
      if (!window._fbq) {
        window._fbq = fbqStub;
      }

      window.fbq('init', metaPixelId);
      window.fbq('track', 'PageView');
    }

    let scriptsInjected = false;
    const injectThirdPartyScripts = () => {
      if (scriptsInjected) return;
      scriptsInjected = true;

      const gaScriptId = 'pulse-octo-ga4-script';
      const existingGtagScript = document.querySelector('script[src*="googletagmanager.com/gtag/js"]');
      if (!document.getElementById(gaScriptId) && !existingGtagScript) {
        const script = document.createElement('script');
        script.id = gaScriptId;
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaMeasurementId)}`;
        document.head.appendChild(script);
      }

      const pixelScriptId = 'pulse-octo-meta-pixel-script';
      if (!document.getElementById(pixelScriptId)) {
        const script = document.createElement('script');
        script.id = pixelScriptId;
        script.async = true;
        script.src = 'https://connect.facebook.net/en_US/fbevents.js';
        document.head.appendChild(script);
      }
    };

    const timer = window.setTimeout(() => {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(injectThirdPartyScripts, { timeout: 2500 });
      } else {
        injectThirdPartyScripts();
      }
    }, 2200);

    const interactionEvents = ['scroll', 'pointerdown', 'touchstart', 'keydown'] as const;
    interactionEvents.forEach((evt) => {
      window.addEventListener(evt, injectThirdPartyScripts, { once: true, passive: true });
    });

    return () => {
      window.clearTimeout(timer);
      interactionEvents.forEach((evt) => {
        window.removeEventListener(evt, injectThirdPartyScripts);
      });
    };
  }, [gaMeasurementId, metaPixelId]);

  // 2. Track Page / View Transitions
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: `/${currentPage}`,
      });
    }

    if (typeof window.fbq === 'function') {
      window.fbq('track', 'PageView');
    }
  }, [currentPage]);

  // 3. Track Contact Form Submissions & Clicks on the 8 Arms Buttons
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    // A. Contact Form Submit Listener
    const handleFormSubmit = (event: SubmitEvent) => {
      const form = event.target as HTMLFormElement | null;
      if (!form) return;

      const sectionEl = form.closest('section');
      const formId =
        form.id ||
        sectionEl?.id ||
        form.getAttribute('aria-label') ||
        'agency_contact_form';

      const payload = {
        form_id: formId,
        page_path: `/${currentPage}`,
        currency: 'USD',
        value: 1,
      };

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', payload);
        window.gtag('event', 'contact_form_submit', payload);
      }

      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Lead', {
          content_name: formId,
          content_category: 'Contact Form',
        });
        window.fbq('track', 'Contact', {
          content_name: formId,
        });
      }
    };

    // B. Custom Event Listener for 8 Arms Selection ('pulse-octo:open-arm')
    const handleOpenArmEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{
        armId?: number;
        arm?: { id?: number; title?: string; enTitle?: string };
      }>;
      const armId = customEvent.detail?.armId ?? customEvent.detail?.arm?.id ?? 0;
      const armName =
        customEvent.detail?.arm?.enTitle ||
        customEvent.detail?.arm?.title ||
        `Arm ${armId}`;

      const payload = {
        arm_id: armId,
        arm_name: armName,
        content_type: 'eight_arm',
        item_id: `arm_${armId}`,
        page_path: `/${currentPage}`,
      };

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'eight_arm_click', payload);
        window.gtag('event', 'select_content', {
          content_type: 'eight_arm',
          item_id: `arm_${armId}`,
          item_name: armName,
        });
      }

      if (typeof window.fbq === 'function') {
        window.fbq('track', 'ViewContent', {
          content_name: armName,
          content_category: 'The 8 Arms',
          content_ids: [`arm_${armId}`],
          content_type: 'service_arm',
        });
        window.fbq('trackCustom', 'EightArmClick', payload);
      }
    };

    // C. Delegated Click Listener for 8 Arms Buttons & Contact CTAs
    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      // 1) Check if clicked element is an 8 Arms button or card
      const armElement = target.closest<HTMLElement>(
        '[data-arm-id], [id^="service-arm-"], a[href^="#arm-"]'
      );

      if (armElement) {
        const dataArmId = armElement.getAttribute('data-arm-id');
        const idAttr = armElement.getAttribute('id') || '';
        const hrefAttr = armElement.getAttribute('href') || '';

        const parsedId =
          dataArmId ||
          idAttr.replace('service-arm-', '') ||
          hrefAttr.replace('#arm-', '') ||
          'unknown';

        const armName =
          armElement.getAttribute('data-arm-title') ||
          armElement.textContent?.trim().slice(0, 80) ||
          `Arm ${parsedId}`;

        const payload = {
          arm_id: parsedId,
          arm_name: armName,
          page_path: `/${currentPage}`,
        };

        if (typeof window.gtag === 'function') {
          window.gtag('event', 'eight_arm_click', payload);
          window.gtag('event', 'select_content', {
            content_type: 'eight_arm',
            item_id: `arm_${parsedId}`,
            item_name: armName,
          });
        }

        if (typeof window.fbq === 'function') {
          window.fbq('track', 'ViewContent', {
            content_name: armName,
            content_category: 'The 8 Arms',
            content_ids: [`arm_${parsedId}`],
            content_type: 'service_arm',
          });
          window.fbq('trackCustom', 'EightArmClick', payload);
        }
        return;
      }

      // 2) Check if clicked element is a Contact CTA button or link (WhatsApp, Email, Proposal submit)
      const contactElement = target.closest<HTMLElement>(
        '#submit-proposal-btn, #submit-email-btn, a[href^="mailto:"], a[href*="wa.me"], a[href^="tel:"]'
      );

      if (contactElement) {
        const href = contactElement.getAttribute('href') || '';
        const buttonId = contactElement.id || '';
        let channel = 'form_button';
        if (href.startsWith('mailto:')) channel = 'email';
        else if (href.includes('wa.me')) channel = 'whatsapp';
        else if (href.startsWith('tel:')) channel = 'phone';
        else if (buttonId) channel = buttonId;

        const payload = {
          contact_channel: channel,
          page_path: `/${currentPage}`,
        };

        if (typeof window.gtag === 'function') {
          window.gtag('event', 'contact_action_click', payload);
        }

        if (typeof window.fbq === 'function') {
          window.fbq('track', 'Contact', {
            content_name: channel,
            content_category: 'Direct Contact',
          });
        }
      }
    };

    // D. PWA App Installed Listener ('appinstalled' & 'pulse-octo:pwa-installed')
    const handlePwaInstalled = () => {
      const payload = {
        page_path: `/${currentPage}`,
        install_source: 'sticky_actions_pwa',
      };

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'pwa_app_installed', payload);
      }

      if (typeof window.fbq === 'function') {
        window.fbq('trackCustom', 'PWAAppInstalled', payload);
      }
    };

    document.addEventListener('submit', handleFormSubmit, true);
    document.addEventListener('click', handleDocumentClick, true);
    window.addEventListener('pulse-octo:open-arm', handleOpenArmEvent);
    window.addEventListener('pulse-octo:pwa-installed', handlePwaInstalled);

    return () => {
      document.removeEventListener('submit', handleFormSubmit, true);
      document.removeEventListener('click', handleDocumentClick, true);
      window.removeEventListener('pulse-octo:open-arm', handleOpenArmEvent);
      window.removeEventListener('pulse-octo:pwa-installed', handlePwaInstalled);
    };
  }, [currentPage]);

  return null;
};
