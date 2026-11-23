import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';
import { OctoLogo } from '../components/OctoLogo';
import { generateQRMatrix } from '../utils/qrCodeGenerator';
import { trackConversionEvent } from '../components/ConversionTracker';
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  UserPlus,
  Share2,
  QrCode,
  Copy,
  Check,
  Download,
  Wallet,
  Banknote,
  ArrowUpRight,
  ExternalLink,
  MessageCircle,
  X,
  Facebook,
  Instagram,
  Linkedin,
  Github,
  ShieldCheck,
  Smartphone,
  User,
  Building2,
  Calendar,
  FileText,
  Youtube,
} from 'lucide-react';

interface DigitalBusinessCardPageProps {
  onNavigate: (page: string) => void;
}

const CARD_CONTACT_DATA = {
  nameAr: 'م. طارق وجيه',
  nameEn: 'Eng. Tarek Wagieh',
  roleAr: 'المؤسس والمدير التنفيذي | مستشار النمو الرقمي والبرمجيات',
  roleEn: 'Founder, CEO & Digital Growth Consultant',
  company: 'Pulse OCTO',
  tagline: 'ONE BRAND. ONE SYSTEM. ONE PULSE.',
  bannerImage: '/pulse-octo-banner.png',
  phonePrimary: '01112998882',
  phonePrimaryIntl: '+201112998882',
  whatsapp: '01116066968',
  whatsappIntl: '+201116066968',
  // Personal Profiles (م. طارق وجيه)
  personalFacebook: 'https://www.facebook.com/tarek.akl.5/',
  personalInstagram: 'https://www.instagram.com/tarekakl91/',
  personalLinkedin: 'https://www.linkedin.com/in/tarekakl91',
  personalGithub: 'https://github.com/engtiko',
  personalTiktok: 'https://www.tiktok.com/@tarekakl',
  personalTelegram: 'https://t.me/pulseocto0o',
  personalTwitterX: 'https://x.com/tarekakl91',
  personalThreads: 'https://www.threads.net/@tarekakl91',
  personalYoutube: 'https://www.youtube.com/@pulseocto',
  personalBehance: 'https://www.behance.net/tarekwagih2',
  emailCeo: 'CEO@pulseOCTO.com',
  // InstaPay & Mobile Wallet (Only 01112998882 has a mobile wallet)
  instapayUrl: 'https://ipn.eg/S/tarekturk91/instapay/56DD3y',
  instapayHandle: 'tarekturk91@instapay',
  instapayNumber: '01112998882',
  walletNumber: '01112998882',
  // Pulse OCTO Agency Profiles & Assets
  agencyWebsite: 'https://pulseocto.com',
  agencyFacebook: 'https://www.facebook.com/profile.php?id=61589519280210',
  agencyInstagram: 'https://www.instagram.com/pulse.octo/',
  agencyYoutube: 'https://www.youtube.com/@pulseocto',
  agencyMapsUrl:
    'https://www.google.com/maps/place/Pulse+Octo/@30.4574003,31.1810751,17z/data=!3m1!4b1!4m6!3m5!1s0x145875003b5da767:0x5aa42ce07917feb1!8m2!3d30.4574003!4d31.1810751',
  agencyMapsEmbedSrc:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3439.248447395615!2d31.1810751246383!3d30.457400274718285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145875003b5da767%3A0x5aa42ce07917feb1!2sPulse%20Octo!5e0!3m2!1sar!2seg!4v1793583878876!5m2!1sar!2seg',
  companyProfilePdfUrl: '/Pulse-OCTO-Company-Profile.pdf',
  emailContact: 'contact@pulseocto.com',
  cardCanonicalUrl: 'https://pulseocto.com/card',
  locationAr: 'بنها، القليوبية، مصر',
  locationEn: 'Banha, Al Qalyubia, Egypt',
};

function buildVCardContent(): string {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:Wagieh;Tarek;;Eng.;',
    'FN:Eng. Tarek Wagieh | م. طارق وجيه (Pulse OCTO)',
    'ORG:Pulse OCTO Digital Agency',
    'TITLE:Founder, CEO & Digital Growth Consultant | المؤسس والمدير التنفيذي',
    `TEL;TYPE=CELL,VOICE,PREF:${CARD_CONTACT_DATA.phonePrimaryIntl}`,
    `TEL;TYPE=WORK,VOICE,MSG:${CARD_CONTACT_DATA.whatsappIntl}`,
    `EMAIL;TYPE=INTERNET,WORK,PREF:${CARD_CONTACT_DATA.emailCeo}`,
    `EMAIL;TYPE=INTERNET,WORK:${CARD_CONTACT_DATA.emailContact}`,
    `URL;TYPE=WORK:${CARD_CONTACT_DATA.agencyWebsite}`,
    `URL;TYPE=PREF:${CARD_CONTACT_DATA.cardCanonicalUrl}`,
    `URL:${CARD_CONTACT_DATA.personalLinkedin}`,
    `URL:${CARD_CONTACT_DATA.personalGithub}`,
    `URL:${CARD_CONTACT_DATA.personalBehance}`,
    `URL:${CARD_CONTACT_DATA.personalFacebook}`,
    `URL:${CARD_CONTACT_DATA.personalInstagram}`,
    `URL:${CARD_CONTACT_DATA.personalTwitterX}`,
    `URL:${CARD_CONTACT_DATA.personalTelegram}`,
    `URL:${CARD_CONTACT_DATA.instapayUrl}`,
    'ADR;TYPE=WORK:;;Farid Nada Street, New Banha;Banha;Qalyubia;13511;Egypt',
    `NOTE:Eng. Tarek Wagieh (Founder & CEO of Pulse OCTO) | Phone & Wallet: ${CARD_CONTACT_DATA.phonePrimary} | WhatsApp: ${CARD_CONTACT_DATA.whatsapp} | InstaPay: ${CARD_CONTACT_DATA.instapayUrl}`,
    'END:VCARD',
  ];
  return lines.join('\r\n');
}

function buildCompactQrVCard(): string {
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:Wagieh;Tarek;;Eng.;',
    'FN:Eng. Tarek Wagieh - Pulse OCTO',
    'ORG:Pulse OCTO',
    'TITLE:Founder & CEO',
    `TEL;TYPE=CELL:${CARD_CONTACT_DATA.phonePrimaryIntl}`,
    `TEL;TYPE=WORK:${CARD_CONTACT_DATA.whatsappIntl}`,
    `EMAIL:${CARD_CONTACT_DATA.emailCeo}`,
    `URL:${CARD_CONTACT_DATA.cardCanonicalUrl}`,
    'END:VCARD',
  ].join('\n');
}

const TikTokIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={`${className} fill-current`} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

const TelegramIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={`${className} fill-current`} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

const XTwitterIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={`${className} fill-current`} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const ThreadsIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={`${className} fill-current`} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M14.82 11.3c-.14-.07-.29-.13-.44-.19-.26-2.19-1.57-3.44-3.82-3.46-1.45-.01-2.67.59-3.34 1.66l1.46.98c.41-.66 1.11-.99 1.88-.98 1.29.01 2.02.67 2.16 1.94-.67-.13-1.4-.18-2.17-.15-2.37.09-3.86 1.24-3.78 2.94.04.88.49 1.65 1.25 2.15.69.46 1.59.67 2.57.62 1.26-.07 2.26-.56 2.9-1.42.49-.65.79-1.5.9-2.55.54.32.94.75 1.16 1.31.35.91.38 2.38-.75 3.51-1.01 1.01-2.26 1.45-4.13 1.47-2.16-.02-3.8-.72-4.88-2.09-1.02-1.3-1.54-3.15-1.56-5.51.02-2.36.54-4.21 1.56-5.51 1.08-1.37 2.72-2.07 4.88-2.09 2.18.02 3.85.73 4.97 2.11.54.67.94 1.49 1.19 2.44l1.72-.46c-.31-1.19-.83-2.22-1.55-3.11C15.54 2.89 13.42 2.02 10.65 2c-2.76.02-4.86.9-6.26 2.68-1.27 1.62-1.92 3.83-1.94 6.57.02 2.74.67 4.95 1.94 6.57 1.4 1.78 3.5 2.66 6.26 2.68 2.39-.02 4.08-.64 5.39-1.95 1.78-1.78 1.72-4.01 1.14-5.49-.41-1.06-1.21-1.91-2.36-2.46zm-4.12 3.83c-1.06.06-1.97-.39-2.01-1.21-.03-.67.54-1.26 1.97-1.32.6-.02 1.18.02 1.72.12-.12 1.54-.79 2.36-1.68 2.41z" />
  </svg>
);

const BehanceIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={`${className} fill-current`} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z" />
  </svg>
);

export const DigitalBusinessCardPage: React.FC<DigitalBusinessCardPageProps> = ({
  onNavigate,
}) => {
  const { isAr, dir, lang, setLang } = useLanguage();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [savedContactToast, setSavedContactToast] = useState<boolean>(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);
  const [qrMode, setQrMode] = useState<'url' | 'vcard' | 'instapay'>('url');

  // Shareable live link
  const shareableCardUrl = useMemo(() => {
    if (typeof window !== 'undefined' && window.location.origin) {
      return `${window.location.origin}/card`;
    }
    return CARD_CONTACT_DATA.cardCanonicalUrl;
  }, []);

  const qrPayload = useMemo(() => {
    if (qrMode === 'vcard') {
      return buildCompactQrVCard();
    }
    if (qrMode === 'instapay') {
      return CARD_CONTACT_DATA.instapayUrl;
    }
    return shareableCardUrl;
  }, [qrMode, shareableCardUrl]);

  const qrMatrix = useMemo(() => generateQRMatrix(qrPayload), [qrPayload]);

  const handleCopy = useCallback((value: string, key: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(value).catch(() => {});
    }
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey((prev) => (prev === key ? null : prev));
    }, 2200);
  }, []);

  // Save vCard (.vcf) directly to mobile phone contacts
  const handleSaveVCard = useCallback(() => {
    const vcf = buildVCardContent();
    const blob = new Blob([vcf], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Tarek-Wagieh-Pulse-OCTO.vcf');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 2000);

    setSavedContactToast(true);
    setTimeout(() => setSavedContactToast(false), 3500);

    trackConversionEvent('contact_submit', {
      event_label: 'digital_business_card_save_vcf',
      location: 'hidden_business_card',
    });
  }, []);

  // Share Digital Business Card via Web Share API or Copy Link
  const handleShareCard = useCallback(async () => {
    const shareData = {
      title: isAr
        ? 'م. طارق وجيه | البطاقة الرقمية — Pulse OCTO'
        : 'Eng. Tarek Wagieh | Digital Business Card — Pulse OCTO',
      text: isAr
        ? 'بطاقة التواصل الرقمية الخاصة بـ م. طارق وجيه — المؤسس والمدير التنفيذي لوكالة Pulse OCTO'
        : 'Digital Executive Card — Eng. Tarek Wagieh, Founder & CEO of Pulse OCTO',
      url: shareableCardUrl,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Fallback to copy
      }
    }
    handleCopy(shareableCardUrl, 'card-link');
  }, [isAr, shareableCardUrl, handleCopy]);

  // Download High-Res PNG QR Code Card
  const handleDownloadQrPng = useCallback(() => {
    const canvas = document.createElement('canvas');
    const size = 1080;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Deep obsidian background matching brand identity
    ctx.fillStyle = '#06040a';
    ctx.fillRect(0, 0, size, size);

    // Metallic amethyst-silver frame
    ctx.strokeStyle = '#9d65f5';
    ctx.lineWidth = 5;
    ctx.strokeRect(36, 36, size - 72, size - 72);

    // Header Title
    ctx.fillStyle = '#f4f3f8';
    ctx.font = 'bold 42px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('ENG. TAREK WAGIEH — PULSE OCTO', size / 2, 115);

    ctx.fillStyle = '#b88cff';
    ctx.font = '600 25px monospace';
    ctx.fillText(
      qrMode === 'url'
        ? 'SCAN FOR DIGITAL BUSINESS CARD'
        : qrMode === 'instapay'
        ? 'SCAN FOR DIRECT INSTAPAY TRANSFER'
        : 'SCAN TO SAVE CONTACT DIRECTLY',
      size / 2,
      160
    );

    // White rounded QR container
    const qrBoxSize = 680;
    const qrBoxX = (size - qrBoxSize) / 2;
    const qrBoxY = 210;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 36);
    ctx.fill();

    // Draw QR modules
    const matrixSize = qrMatrix.length;
    const quietZone = 4;
    const totalModules = matrixSize + quietZone * 2;
    const cellSize = qrBoxSize / totalModules;

    ctx.fillStyle = '#06040a';
    for (let r = 0; r < matrixSize; r++) {
      for (let c = 0; c < matrixSize; c++) {
        if (qrMatrix[r][c]) {
          const x = qrBoxX + (c + quietZone) * cellSize;
          const y = qrBoxY + (r + quietZone) * cellSize;
          ctx.fillRect(x, y, Math.ceil(cellSize), Math.ceil(cellSize));
        }
      }
    }

    // Footer Phone & Website
    ctx.fillStyle = '#d8d6e2';
    ctx.font = 'bold 28px monospace';
    ctx.fillText(`${CARD_CONTACT_DATA.phonePrimary}  •  pulseocto.com/card`, size / 2, 965);

    const pngUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = pngUrl;
    a.download = `Tarek-Wagieh-Pulse-OCTO-QR-${qrMode}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [qrMatrix, qrMode]);

  const transferConfirmWhatsappUrl = `https://wa.me/201116066968?text=${encodeURIComponent(
    isAr
      ? 'مرحباً م. طارق وجيه، قمت بإجراء تحويل عبر (InstaPay / المحفظة الإلكترونية) ومرفق إشعار التحويل للتأكيد.'
      : 'Hello Eng. Tarek Wagieh, I have completed a transfer via (InstaPay / Mobile Wallet) and attached the receipt for confirmation.'
  )}`;

  const directWhatsappUrl = `https://wa.me/201116066968?text=${encodeURIComponent(
    isAr
      ? 'مرحباً م. طارق وجيه، تشرفت بالتواصل معك عبر بطاقة الأعمال الرقمية الخاصة بك.'
      : 'Hello Eng. Tarek Wagieh, connecting with you via your Digital Business Card.'
  )}`;

  const bookMeetingWhatsappUrl = `https://wa.me/201116066968?text=${encodeURIComponent(
    isAr
      ? 'مرحباً م. طارق وجيه، أود تنسيق وحجز موعد اجتماع استشاري بخصوص مشروعي.'
      : 'Hello Eng. Tarek Wagieh, I would like to schedule an executive consultation meeting.'
  )}`;

  // Luxury Glassy Social Icons for Eng. Tarek Wagieh (No account usernames written underneath)
  const personalSocialLinks = [
    {
      id: 'facebook',
      label: 'Facebook',
      href: CARD_CONTACT_DATA.personalFacebook,
      icon: <Facebook className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
    {
      id: 'instagram',
      label: 'Instagram',
      href: CARD_CONTACT_DATA.personalInstagram,
      icon: <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
    {
      id: 'tiktok',
      label: 'TikTok',
      href: CARD_CONTACT_DATA.personalTiktok,
      icon: <TikTokIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      href: CARD_CONTACT_DATA.personalLinkedin,
      icon: <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
    {
      id: 'github',
      label: 'GitHub',
      href: CARD_CONTACT_DATA.personalGithub,
      icon: <Github className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
    {
      id: 'behance',
      label: 'Behance',
      href: CARD_CONTACT_DATA.personalBehance,
      icon: <BehanceIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
    {
      id: 'telegram',
      label: 'Telegram',
      href: CARD_CONTACT_DATA.personalTelegram,
      icon: <TelegramIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
    {
      id: 'x-twitter',
      label: 'X',
      href: CARD_CONTACT_DATA.personalTwitterX,
      icon: <XTwitterIcon className="w-5 h-5 sm:w-5 sm:h-5" />,
    },
    {
      id: 'threads',
      label: 'Threads',
      href: CARD_CONTACT_DATA.personalThreads,
      icon: <ThreadsIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
    {
      id: 'youtube',
      label: 'YouTube',
      href: CARD_CONTACT_DATA.personalYoutube,
      icon: <Youtube className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
  ];

  // Luxury Glassy Social & Executive Actions for Pulse OCTO Agency
  const agencySocialLinks = [
    {
      id: 'agency-web',
      label: isAr ? 'الموقع الرسمي' : 'Website',
      href: CARD_CONTACT_DATA.agencyWebsite,
      icon: <Globe className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
    {
      id: 'agency-fb',
      label: 'Facebook',
      href: CARD_CONTACT_DATA.agencyFacebook,
      icon: <Facebook className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
    {
      id: 'agency-ig',
      label: 'Instagram',
      href: CARD_CONTACT_DATA.agencyInstagram,
      icon: <Instagram className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
    {
      id: 'agency-yt',
      label: 'YouTube',
      href: CARD_CONTACT_DATA.agencyYoutube,
      icon: <Youtube className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
    {
      id: 'agency-maps',
      label: 'Google Maps',
      href: CARD_CONTACT_DATA.agencyMapsUrl,
      icon: <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
    {
      id: 'agency-meeting',
      label: isAr ? 'حجز اجتماع' : 'Book Meeting',
      href: bookMeetingWhatsappUrl,
      icon: <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
    {
      id: 'agency-profile',
      label: 'Company Profile',
      href: CARD_CONTACT_DATA.companyProfilePdfUrl,
      icon: <FileText className="w-5 h-5 sm:w-6 sm:h-6" />,
    },
  ];

  return (
    <div
      dir={dir}
      className="relative min-h-screen bg-[#050308] text-[#f3f1f8] pb-24 selection:bg-[#8a4fff] selection:text-white overflow-x-hidden"
    >
      {/* Keep hidden from public search engine indexing — accessible only via link or QR code */}
      <Helmet>
        <title>
          {isAr
            ? 'م. طارق وجيه | البطاقة الرقمية — Pulse OCTO'
            : 'Eng. Tarek Wagieh | Digital Business Card — Pulse OCTO'}
        </title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Subtle Ambient Lighting Matched to Brand Banner (#050308 + Deep Velvet Amethyst #1f0e38) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-44 left-1/2 -translate-x-1/2 w-[780px] h-[420px] bg-[#5e27b8]/15 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 right-1/4 w-[520px] h-[360px] bg-[#36156e]/15 rounded-full blur-[150px]" />
      </div>

      {/* =====================================================================
          1. SLEEK SMOKED-GLASS TOP HEADER BAR
         ===================================================================== */}
      <header className="sticky top-0 z-40 w-full bg-[#07040d]/80 backdrop-blur-2xl border-b border-white/[0.08]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Signature */}
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 text-left group cursor-pointer whitespace-nowrap shrink-0"
            title={isAr ? 'الانتقال إلى موقع Pulse OCTO الرسمي' : 'Visit Pulse OCTO Website'}
          >
            <div className="w-9 h-9 rounded-xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.14] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center group-hover:border-[#b88cff]/50 transition-colors">
              <OctoLogo variant="iconOnly" className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs sm:text-sm font-black tracking-wider text-white font-['Orbitron',sans-serif]">
                PULSE OCTO
              </span>
              <span className="block text-[10px] font-mono tracking-widest text-[#c2a6ff]">
                {isAr ? 'البطاقة الرقمية الخاصة' : 'EXECUTIVE PASS'}
              </span>
            </div>
          </button>

          {/* Right Quick Actions: QR Code Modal + Language Toggle + Website Link */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsQrModalOpen(true)}
              className="min-h-[40px] px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] backdrop-blur-xl border border-white/[0.14] hover:border-[#b88cff]/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.18)] text-xs font-bold text-[#e9e4f5] hover:text-white flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 whitespace-nowrap shrink-0"
              aria-label="QR Code"
            >
              <QrCode className="w-4 h-4 text-[#c2a6ff]" />
              <span>QR Code</span>
            </button>

            <button
              type="button"
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className="min-h-[40px] px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] backdrop-blur-xl border border-white/[0.1] text-xs font-mono font-bold text-[#d8d4e4] hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {lang === 'ar' ? 'EN' : 'عربي'}
            </button>

            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="hidden sm:inline-flex min-h-[40px] px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.09] backdrop-blur-xl border border-white/[0.1] text-xs font-bold text-[#d8d4e4] hover:text-white items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <span>{isAr ? 'الموقع الرسمي' : 'Main Website'}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#c2a6ff]" />
            </button>
          </div>
        </div>
      </header>

      {/* =====================================================================
          2. LUXURY EXECUTIVE CARD CONTAINER
         ===================================================================== */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-5 sm:pt-8 space-y-6">
        {/* ===================================================================
            HERO IDENTITY CARD: OFFICIAL BRAND BANNER + FOUNDER PORTRAIT
           =================================================================== */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[28px] bg-[#090612]/90 backdrop-blur-2xl border border-white/[0.12] shadow-[0_28px_80px_rgba(0,0,0,0.92),inset_0_1px_1px_rgba(255,255,255,0.16)] overflow-hidden"
        >
          {/* Top Panoramic Brand Identity Cover (Uploaded Image) */}
          <div className="relative w-full aspect-[16/7] sm:aspect-[21/7] bg-[#06030b] overflow-hidden">
            <img
              src={CARD_CONTACT_DATA.bannerImage}
              alt="Pulse OCTO — One Brand. One System. One Pulse."
              className="w-full h-full object-cover object-center select-none"
            />
            {/* Seamless Bottom Blending Vignette so Portrait & Cover harmonize */}
            <div className="absolute inset-x-0 bottom-0 h-20 sm:h-28 bg-gradient-to-t from-[#090612] via-[#090612]/65 to-transparent pointer-events-none" />
            <div className="absolute inset-0 ring-1 ring-inset ring-white/10 pointer-events-none" />
          </div>

          {/* Founder Portrait + Identity Details + Primary Save CTA */}
          <div className="px-5 sm:px-8 pb-7 sm:pb-8 -mt-12 sm:-mt-16 relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
              {/* Portrait + Name + Role */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-5 text-center sm:text-start">
                {/* Brushed Platinum & Smoked Glass Portrait Frame */}
                <div className="relative shrink-0">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl p-[2px] bg-gradient-to-b from-[#e4e2ec]/70 via-[#a87ffb]/50 to-[#391c66]/70 shadow-[0_18px_45px_rgba(0,0,0,0.95),0_0_30px_rgba(157,101,245,0.28)]">
                    <div className="w-full h-full rounded-[22px] overflow-hidden bg-[#080510]">
                      <img
                        src="/CEO.webp"
                        alt={isAr ? CARD_CONTACT_DATA.nameAr : CARD_CONTACT_DATA.nameEn}
                        width={260}
                        height={260}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  </div>
                  <div
                    className="absolute -bottom-1.5 -right-1.5 w-8 h-8 rounded-xl bg-gradient-to-br from-[#9d65f5] to-[#5826a6] border-2 border-[#090612] flex items-center justify-center text-white shadow-lg"
                    title={isAr ? 'الحساب الرسمي الموثق' : 'Verified Executive'}
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>

                {/* Name, Role, Location */}
                <div className="pb-1">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {isAr ? CARD_CONTACT_DATA.nameAr : CARD_CONTACT_DATA.nameEn}
                  </h1>
                  <p className="mt-1 text-xs sm:text-sm font-semibold text-[#c9b3ff]">
                    {isAr ? CARD_CONTACT_DATA.roleAr : CARD_CONTACT_DATA.roleEn}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-[#a8a2b8]">
                    <span className="font-semibold text-[#e6e3f0]">Pulse OCTO</span>
                    <span aria-hidden="true">·</span>
                    <a
                      href={CARD_CONTACT_DATA.agencyMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:text-white transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#b88cff]" />
                      <span>{isAr ? CARD_CONTACT_DATA.locationAr : CARD_CONTACT_DATA.locationEn}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Mini Glass QR Trigger on Desktop/Mobile */}
              <button
                type="button"
                onClick={() => setIsQrModalOpen(true)}
                className="self-center sm:self-end p-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-2xl border border-white/[0.14] hover:border-[#b88cff]/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_10px_25px_rgba(0,0,0,0.6)] flex items-center gap-3 transition-all cursor-pointer group shrink-0"
                title={isAr ? 'عرض وتحميل الـ QR Code' : 'Show & Download QR Code'}
              >
                <div className="p-1.5 rounded-xl bg-white">
                  <svg
                    viewBox={`0 0 ${qrMatrix.length + 4} ${qrMatrix.length + 4}`}
                    className="w-11 h-11"
                    shapeRendering="crispEdges"
                  >
                    <rect width="100%" height="100%" fill="#ffffff" />
                    {qrMatrix.map((row, rIdx) =>
                      row.map((cell, cIdx) =>
                        cell ? (
                          <rect
                            key={`${rIdx}-${cIdx}`}
                            x={cIdx + 2}
                            y={rIdx + 2}
                            width={1}
                            height={1}
                            fill="#06040a"
                          />
                        ) : null
                      )
                    )}
                  </svg>
                </div>
                <div className={`${dir === 'rtl' ? 'text-right' : 'text-left'} pe-1`}>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#c9b3ff] block">
                    QR PASS
                  </span>
                  <span className="text-xs font-bold text-white group-hover:text-[#d8c8ff] transition-colors block">
                    {isAr ? 'تكبير الكود' : 'Enlarge QR'}
                  </span>
                </div>
              </button>
            </div>

            {/* Primary Action Bar: Save Contact (.vcf) + Direct WhatsApp + Share Card */}
            <div className="mt-6 pt-6 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-12 gap-3">
              <button
                type="button"
                onClick={handleSaveVCard}
                className="sm:col-span-7 min-h-[52px] px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#8247e5] via-[#6b34c9] to-[#4c1f99] hover:from-[#9258f5] hover:to-[#5b27b5] border border-[#c7a6ff]/35 shadow-[0_12px_32px_rgba(110,52,205,0.4),inset_0_1px_1px_rgba(255,255,255,0.3)] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all cursor-pointer active:scale-[0.98]"
              >
                <UserPlus className="w-5 h-5 text-[#f2ebff] shrink-0" />
                <span>
                  {isAr ? 'حفظ رقمي وبياناتي في موبايلك' : 'Save My Contact to Your Phone'}
                </span>
              </button>

              <a
                href={directWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="sm:col-span-3 min-h-[52px] px-4 py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.09] backdrop-blur-2xl border border-white/[0.14] hover:border-[#b88cff]/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.18)] text-[#f3f1f8] hover:text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 text-[#c9b3ff] shrink-0" />
                <span>{isAr ? 'واتساب مباشر' : 'WhatsApp'}</span>
              </a>

              <button
                type="button"
                onClick={handleShareCard}
                className="sm:col-span-2 min-h-[52px] px-4 py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.09] backdrop-blur-2xl border border-white/[0.14] hover:border-[#b88cff]/50 shadow-[inset_0_1px_1px_rgba(255,255,255,0.18)] text-[#f3f1f8] hover:text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
                title={isAr ? 'مشاركة رابط الكارت' : 'Share Card Link'}
              >
                {copiedKey === 'card-link' ? (
                  <>
                    <Check className="w-4 h-4 text-[#c9b3ff] shrink-0" />
                    <span>{isAr ? 'تم النسخ' : 'Copied'}</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-[#c9b3ff] shrink-0" />
                    <span>{isAr ? 'مشاركة' : 'Share'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Confirmation Toast when vCard is downloaded */}
            <AnimatePresence>
              {savedContactToast && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-3 p-3 rounded-xl bg-white/[0.06] backdrop-blur-2xl border border-[#b88cff]/40 text-[#efeaff] text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4 text-[#c9b3ff] shrink-0" />
                  <span>
                    {isAr
                      ? 'تم تحميل بطاقة جهة الاتصال (.vcf) — افتحها لحفظ الرقم فوراً!'
                      : 'Contact file (.vcf) downloaded — tap to save to Contacts!'}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* ===================================================================
            SECTION 1: PERSONAL PROFILE & LUXURY GLASSY SOCIAL DOCK (م. طارق وجيه)
           =================================================================== */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
          className="p-6 sm:p-8 rounded-[28px] bg-[#090612]/90 backdrop-blur-2xl border border-white/[0.12] shadow-[0_24px_65px_rgba(0,0,0,0.88),inset_0_1px_1px_rgba(255,255,255,0.14)] space-y-6"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#b88cff] block">
                {isAr ? 'الحسابات والبيانات الشخصية' : 'PERSONAL IDENTITY & CHANNELS'}
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                {isAr ? 'م. طارق وجيه — التواصل الشخصي' : 'Eng. Tarek Wagieh — Personal Channels'}
              </h2>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.14] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center text-[#c9b3ff] shrink-0">
              <User className="w-5 h-5" />
            </div>
          </div>

          {/* Luxury Frosted Glassmorphism Social Media Icons Dock (backdrop-filter: blur(12px)) */}
          <div className="relative">
            <span className="text-xs text-[#a8a2b8] font-medium block mb-3.5">
              {isAr ? 'منصات التواصل الاجتماعي الشخصية' : 'Personal Social Networks'}
            </span>

            {/* Ambient Sub-Glass Light Orbs for Authentic Frosted Refraction */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-4 top-8 bottom-2 -z-0 overflow-hidden rounded-3xl opacity-80"
            >
              <div className="absolute -top-6 left-1/4 w-44 h-28 rounded-full bg-[#8b5cf6]/25 blur-2xl" />
              <div className="absolute -bottom-6 right-1/4 w-48 h-28 rounded-full bg-[#c4b5fd]/15 blur-2xl" />
            </div>

            <div className="relative z-10 grid grid-cols-5 sm:grid-cols-5 gap-2.5 sm:gap-3.5">
              {personalSocialLinks.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  title={item.label}
                  className="group relative h-24 sm:h-28 rounded-2xl bg-gradient-to-b from-white/[0.12] via-white/[0.045] to-[#1a0d2e]/[0.38] hover:from-[#b88cff]/[0.22] hover:via-white/[0.09] hover:to-[#4c1f99]/[0.42] backdrop-blur-[12px] backdrop-saturate-[180%] border border-white/[0.18] hover:border-[#d8c4ff]/65 shadow-[0_16px_36px_-6px_rgba(0,0,0,0.85),inset_0_1px_1.5px_rgba(255,255,255,0.38),inset_0_-1px_2px_rgba(157,101,245,0.22)] hover:shadow-[0_20px_42px_-6px_rgba(124,66,214,0.45),inset_0_1.5px_2px_rgba(255,255,255,0.55),inset_0_-2px_6px_rgba(184,140,255,0.35)] flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer overflow-hidden px-1"
                >
                  {/* Top Diagonal Frosted Specular Sheen */}
                  <div className="absolute inset-x-2 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/65 to-transparent opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <div className="absolute -top-10 -left-10 w-24 h-24 bg-white/[0.07] rotate-45 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-500 pointer-events-none blur-[2px]" />
                  {/* Subsurface Amethyst Hover Glow */}
                  <div className="absolute -bottom-5 w-16 h-16 rounded-full bg-[#9d65f5]/15 group-hover:bg-[#b88cff]/35 blur-xl transition-all duration-300 pointer-events-none" />

                  {/* Inner Frosted Crystal Medallion */}
                  <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-white/[0.14] via-white/[0.05] to-white/[0.02] group-hover:from-white/[0.22] group-hover:to-[#9d65f5]/[0.2] backdrop-blur-[12px] border border-white/[0.2] group-hover:border-[#e9dcff]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_18px_rgba(0,0,0,0.5)] flex items-center justify-center text-[#f2effa] group-hover:text-white group-hover:scale-110 transition-all duration-300">
                    {item.icon}
                  </div>

                  <span className="relative text-[10px] sm:text-[11px] font-bold tracking-wide text-[#cbc5d8] group-hover:text-white transition-colors truncate max-w-full">
                    {item.label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Personal Phone Numbers & Direct Executive Email */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {/* Primary Phone */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.1] hover:border-white/[0.2] shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] flex items-center justify-between gap-2 transition-colors">
              <a
                href={`tel:${CARD_CONTACT_DATA.phonePrimaryIntl}`}
                className="flex items-center gap-3 min-w-0 flex-1 group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.14] flex items-center justify-center text-[#c9b3ff] group-hover:bg-[#7c42d6] group-hover:text-white transition-colors shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] text-[#a8a2b8] block">
                    {isAr ? 'موبايل شخصي (اتصال)' : 'Personal Mobile'}
                  </span>
                  <span
                    className="text-sm font-mono tabular-nums font-extrabold text-white group-hover:text-[#d8c4ff] transition-colors block"
                    dir="ltr"
                  >
                    {CARD_CONTACT_DATA.phonePrimary}
                  </span>
                </div>
              </a>
              <button
                type="button"
                onClick={() => handleCopy(CARD_CONTACT_DATA.phonePrimary, 'phone-1')}
                className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] text-[#c9c4d6] hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title={isAr ? 'نسخ الرقم' : 'Copy Number'}
              >
                {copiedKey === 'phone-1' ? (
                  <Check className="w-4 h-4 text-[#c9b3ff]" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Secondary Mobile & WhatsApp */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.1] hover:border-white/[0.2] shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] flex items-center justify-between gap-2 transition-colors">
              <a
                href={directWhatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 min-w-0 flex-1 group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.14] flex items-center justify-center text-[#c9b3ff] group-hover:bg-[#7c42d6] group-hover:text-white transition-colors shrink-0">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] text-[#a8a2b8] block">
                    {isAr ? 'موبايل وواتساب' : 'WhatsApp & Mobile'}
                  </span>
                  <span
                    className="text-sm font-mono tabular-nums font-extrabold text-white group-hover:text-[#d8c4ff] transition-colors block"
                    dir="ltr"
                  >
                    {CARD_CONTACT_DATA.whatsapp}
                  </span>
                </div>
              </a>
              <button
                type="button"
                onClick={() => handleCopy(CARD_CONTACT_DATA.whatsapp, 'whatsapp-1')}
                className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] text-[#c9c4d6] hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title={isAr ? 'نسخ الرقم' : 'Copy Number'}
              >
                {copiedKey === 'whatsapp-1' ? (
                  <Check className="w-4 h-4 text-[#c9b3ff]" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Direct CEO Email */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.1] hover:border-white/[0.2] shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] flex items-center justify-between gap-2 transition-colors">
              <a
                href={`mailto:${CARD_CONTACT_DATA.emailCeo}`}
                className="flex items-center gap-3 min-w-0 flex-1 group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.14] flex items-center justify-center text-[#c9b3ff] group-hover:bg-[#7c42d6] group-hover:text-white transition-colors shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] text-[#a8a2b8] block">
                    {isAr ? 'البريد المباشر' : 'Executive Email'}
                  </span>
                  <span
                    className="text-xs sm:text-sm font-mono font-extrabold text-white group-hover:text-[#d8c4ff] transition-colors truncate block"
                    dir="ltr"
                  >
                    {CARD_CONTACT_DATA.emailCeo}
                  </span>
                </div>
              </a>
              <button
                type="button"
                onClick={() => handleCopy(CARD_CONTACT_DATA.emailCeo, 'email-ceo')}
                className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.08] text-[#c9c4d6] hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                title={isAr ? 'نسخ الإيميل' : 'Copy Email'}
              >
                {copiedKey === 'email-ceo' ? (
                  <Check className="w-4 h-4 text-[#c9b3ff]" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </motion.section>

        {/* ===================================================================
            SECTION 2: INSTAPAY & MOBILE WALLET (01112998882 ONLY FOR WALLET)
           =================================================================== */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="p-6 sm:p-8 rounded-[28px] bg-[#090612]/90 backdrop-blur-2xl border border-white/[0.12] shadow-[0_24px_65px_rgba(0,0,0,0.88),inset_0_1px_1px_rgba(255,255,255,0.14)] space-y-5"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#b88cff] block">
                {isAr ? 'الدفع والتحويل السريع' : 'INSTANT PAYMENT & TRANSFER'}
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                {isAr ? 'إنستا باي والمحفظة الإلكترونية' : 'InstaPay & Mobile Wallet'}
              </h2>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.14] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center text-[#c9b3ff] shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Official InstaPay Card */}
            <div className="p-5 rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.13] shadow-[inset_0_1px_1px_rgba(255,255,255,0.16)] flex flex-col justify-between gap-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white tracking-wide">InstaPay</span>
                    <span className="text-xs text-[#c9b3ff] font-mono" dir="ltr">
                      @tarekturk91
                    </span>
                  </div>
                  <p className="text-xs text-[#a8a2b8] mt-1">
                    {isAr
                      ? 'تحويل فوري عبر رابط إنستا باي الرسمي أو نسخ الرقم'
                      : 'Instant transfer via official InstaPay link or phone number'}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.14] flex items-center justify-center text-[#c9b3ff] shrink-0">
                  <Banknote className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-2.5">
                <a
                  href={CARD_CONTACT_DATA.instapayUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8247e5] to-[#56259e] hover:from-[#9258f5] hover:to-[#662eb8] border border-[#c7a6ff]/30 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
                >
                  <span>{isAr ? 'فتح رابط الدفع عبر InstaPay' : 'Pay via Official InstaPay Link'}</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                </a>

                <div className="px-3.5 py-2.5 rounded-xl bg-black/45 border border-white/[0.1] flex items-center justify-between gap-2">
                  <span
                    className="text-sm font-mono tabular-nums font-extrabold text-white tracking-wider"
                    dir="ltr"
                  >
                    {CARD_CONTACT_DATA.instapayNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(CARD_CONTACT_DATA.instapayNumber, 'instapay-num')}
                    className="px-3 py-1 rounded-lg bg-white/[0.07] hover:bg-white/[0.15] text-xs font-bold text-[#d8c4ff] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedKey === 'instapay-num' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#c9b3ff]" />
                        <span>{isAr ? 'تم النسخ' : 'Copied'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{isAr ? 'نسخ الرقم' : 'Copy'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Mobile Wallet Card (ONLY 01112998882) */}
            <div className="p-5 rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.13] shadow-[inset_0_1px_1px_rgba(255,255,255,0.16)] flex flex-col justify-between gap-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-sm font-black text-white block">
                    {isAr ? 'المحفظة الإلكترونية' : 'Mobile Cash Wallet'}
                  </span>
                  <p className="text-xs text-[#a8a2b8] mt-1">
                    {isAr
                      ? 'الرقم المعتمد للتحويل عبر المحفظة الإلكترونية'
                      : 'Verified number for mobile wallet transfers'}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.14] flex items-center justify-center text-[#c9b3ff] shrink-0">
                  <Smartphone className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="px-4 py-3 rounded-xl bg-black/45 border border-white/[0.1] flex items-center justify-between gap-2">
                  <span
                    className="text-base font-mono tabular-nums font-extrabold text-white tracking-wider"
                    dir="ltr"
                  >
                    {CARD_CONTACT_DATA.walletNumber}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(CARD_CONTACT_DATA.walletNumber, 'wallet-1')}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.07] hover:bg-white/[0.15] text-xs font-bold text-[#d8c4ff] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedKey === 'wallet-1' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#c9b3ff]" />
                        <span>{isAr ? 'تم النسخ' : 'Copied'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{isAr ? 'نسخ الرقم' : 'Copy No.'}</span>
                      </>
                    )}
                  </button>
                </div>

                <a
                  href={transferConfirmWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-[42px] px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/[0.12] text-xs font-bold text-[#e2dcf0] hover:text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-[#c9b3ff]" />
                  <span>{isAr ? 'إرسال تأكيد التحويل واتساب' : 'Send Transfer Receipt'}</span>
                </a>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ===================================================================
            SECTION 3: PULSE OCTO OFFICIAL AGENCY ACCOUNTS (حسابات وكالة Pulse OCTO)
           =================================================================== */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="p-6 sm:p-8 rounded-[28px] bg-[#090612]/90 backdrop-blur-2xl border border-white/[0.12] shadow-[0_24px_65px_rgba(0,0,0,0.88),inset_0_1px_1px_rgba(255,255,255,0.14)] space-y-6"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-mono tracking-widest uppercase text-[#b88cff] block">
                {isAr ? 'منظومة الوكالة الرقمية' : 'AGENCY ECOSYSTEM'}
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                {isAr ? 'حسابات وقنوات وكالة Pulse OCTO' : 'Pulse OCTO Official Channels'}
              </h2>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.14] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] flex items-center justify-center text-[#c9b3ff] shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
          </div>

          {/* Luxury Frosted Glassmorphism Icons for Pulse OCTO Agency (backdrop-filter: blur(12px)) */}
          <div className="relative">
            {/* Ambient Sub-Glass Light Orbs for Authentic Frosted Refraction */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-4 top-2 bottom-2 -z-0 overflow-hidden rounded-3xl opacity-80"
            >
              <div className="absolute -top-4 left-1/3 w-48 h-24 rounded-full bg-[#8b5cf6]/25 blur-2xl" />
              <div className="absolute -bottom-4 right-1/4 w-44 h-24 rounded-full bg-[#c4b5fd]/15 blur-2xl" />
            </div>

            <div className="relative z-10 grid grid-cols-3 sm:grid-cols-7 gap-2.5 sm:gap-3">
              {agencySocialLinks.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  target={item.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel={item.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  aria-label={item.label}
                  title={item.label}
                  className="group relative h-24 sm:h-28 rounded-2xl bg-gradient-to-b from-white/[0.12] via-white/[0.045] to-[#1a0d2e]/[0.38] hover:from-[#b88cff]/[0.22] hover:via-white/[0.09] hover:to-[#4c1f99]/[0.42] backdrop-blur-[12px] backdrop-saturate-[180%] border border-white/[0.18] hover:border-[#d8c4ff]/65 shadow-[0_16px_36px_-6px_rgba(0,0,0,0.85),inset_0_1px_1.5px_rgba(255,255,255,0.38),inset_0_-1px_2px_rgba(157,101,245,0.22)] hover:shadow-[0_20px_42px_-6px_rgba(124,66,214,0.45),inset_0_1.5px_2px_rgba(255,255,255,0.55),inset_0_-2px_6px_rgba(184,140,255,0.35)] flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer overflow-hidden px-1 text-center"
                >
                  <div className="absolute inset-x-2 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/65 to-transparent opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <div className="absolute -top-10 -left-10 w-24 h-24 bg-white/[0.07] rotate-45 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform duration-500 pointer-events-none blur-[2px]" />
                  <div className="absolute -bottom-5 w-16 h-16 rounded-full bg-[#9d65f5]/15 group-hover:bg-[#b88cff]/35 blur-xl transition-all duration-300 pointer-events-none" />

                  <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-white/[0.14] via-white/[0.05] to-white/[0.02] group-hover:from-white/[0.22] group-hover:to-[#9d65f5]/[0.2] backdrop-blur-[12px] border border-white/[0.2] group-hover:border-[#e9dcff]/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_18px_rgba(0,0,0,0.5)] flex items-center justify-center text-[#f2effa] group-hover:text-white group-hover:scale-110 transition-all duration-300">
                    {item.icon}
                  </div>

                  <span className="relative text-[10px] sm:text-[11px] font-bold tracking-wide text-[#cbc5d8] group-hover:text-white transition-colors truncate max-w-full">
                    {item.label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Official Pulse OCTO Company Profile PDF Showcase Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.035] backdrop-blur-2xl border border-white/[0.14] shadow-[inset_0_1px_1px_rgba(255,255,255,0.18),0_14px_35px_rgba(0,0,0,0.7)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8247e5]/30 to-[#4c1f99]/30 border border-[#c7a6ff]/35 flex items-center justify-center text-[#d8c4ff] shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <span className="text-xs sm:text-sm font-black text-white block truncate">
                  {isAr
                    ? 'الملف التعريفي الرسمي — Pulse OCTO Company Profile (PDF)'
                    : 'Official Pulse OCTO Company Profile (PDF)'}
                </span>
                <span className="text-xs text-[#a8a2b8] block mt-0.5">
                  {isAr
                    ? 'الأذرع الثمانية، منهجية العمل، ونماذج المشاريع وسابقة الأعمال'
                    : 'The 8 Arms Ecosystem, Methodology & Featured Case Studies'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <a
                href={CARD_CONTACT_DATA.companyProfilePdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial min-h-[42px] px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.14] text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
              >
                <ExternalLink className="w-3.5 h-3.5 text-[#c9b3ff]" />
                <span>{isAr ? 'استعراض الملف' : 'View PDF'}</span>
              </a>

              <a
                href={CARD_CONTACT_DATA.companyProfilePdfUrl}
                download="Pulse-OCTO-Company-Profile.pdf"
                className="flex-1 sm:flex-initial min-h-[42px] px-4 py-2 rounded-xl bg-gradient-to-r from-[#8247e5] to-[#56259e] hover:from-[#9258f5] hover:to-[#662eb8] border border-[#c7a6ff]/30 text-xs font-extrabold text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isAr ? 'تحميل PDF' : 'Download PDF'}</span>
              </a>
            </div>
          </div>

          {/* Interactive Official Pulse Octo Google Maps Embed */}
          <div className="rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.13] shadow-[inset_0_1px_1px_rgba(255,255,255,0.16)] overflow-hidden">
            <div className="px-4 py-3 border-b border-white/[0.08] flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <MapPin className="w-4 h-4 text-[#c9b3ff] shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-white truncate">
                  {isAr ? 'موقع مقر Pulse OCTO على الخريطة' : 'Pulse OCTO Headquarters Location'}
                </span>
              </div>
              <a
                href={CARD_CONTACT_DATA.agencyMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#c9b3ff] hover:text-white inline-flex items-center gap-1 shrink-0 transition-colors"
              >
                <span>{isAr ? 'فتح الاتجاهات' : 'Get Directions'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="relative w-full h-56 sm:h-64 bg-[#07040d]">
              <iframe
                src={CARD_CONTACT_DATA.agencyMapsEmbedSrc}
                title="Pulse Octo Location on Google Maps"
                width="100%"
                height="100%"
                loading="lazy"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                className="w-full h-full border-0 contrast-[1.05] brightness-[0.92]"
              />
            </div>
          </div>

          {/* Explore Full Portfolio & 8 Arms Quick Links */}
          <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => onNavigate('portfolio')}
              className="text-xs font-bold text-[#d4cee3] hover:text-white inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>{isAr ? 'تصفح سابقة أعمال Pulse OCTO' : 'Explore Pulse OCTO Portfolio'}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#c9b3ff]" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('the-8-arms')}
              className="text-xs font-bold text-[#c9b3ff] hover:text-white inline-flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>{isAr ? 'استكشف منظومة الأذرع الثمانية' : 'Discover The 8 Arms System'}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#c9b3ff]" />
            </button>
          </div>
        </motion.section>
      </div>

      {/* =====================================================================
          3. FULL-SCREEN QR CODE PASS MODAL (Web Link QR / InstaPay QR / Direct vCard QR)
         ===================================================================== */}
      <AnimatePresence>
        {isQrModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4"
            onClick={() => setIsQrModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 14 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl bg-[#090612] border border-white/[0.15] p-6 shadow-[0_25px_80px_rgba(0,0,0,0.95),inset_0_1px_1px_rgba(255,255,255,0.2)] text-center space-y-5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-[#c9b3ff]" />
                  <h3 className="text-base font-black text-white">
                    {isAr ? 'كود البطاقة الرقمية (QR Code)' : 'Executive QR Code Pass'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsQrModalOpen(false)}
                  className="w-9 h-9 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] flex items-center justify-center text-[#c9c4d6] hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mode Selector: Page Link QR vs InstaPay Link QR vs Direct vCard Contact QR */}
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-black/50 border border-white/[0.1]">
                <button
                  type="button"
                  onClick={() => setQrMode('url')}
                  className={`py-2 px-2 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    qrMode === 'url'
                      ? 'bg-[#7c42d6] text-white'
                      : 'text-[#a8a2b8] hover:text-white'
                  }`}
                >
                  {isAr ? 'رابط الكارت' : 'Card Link'}
                </button>
                <button
                  type="button"
                  onClick={() => setQrMode('instapay')}
                  className={`py-2 px-2 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    qrMode === 'instapay'
                      ? 'bg-[#7c42d6] text-white'
                      : 'text-[#a8a2b8] hover:text-white'
                  }`}
                >
                  {isAr ? 'إنستا باي' : 'InstaPay'}
                </button>
                <button
                  type="button"
                  onClick={() => setQrMode('vcard')}
                  className={`py-2 px-2 rounded-lg text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                    qrMode === 'vcard'
                      ? 'bg-[#7c42d6] text-white'
                      : 'text-[#a8a2b8] hover:text-white'
                  }`}
                >
                  {isAr ? 'حفظ الرقم' : 'Save vCard'}
                </button>
              </div>

              {/* Large Crisp SVG QR Code */}
              <div className="p-5 rounded-3xl bg-white mx-auto inline-block shadow-[0_0_40px_rgba(124,66,214,0.3)]">
                <svg
                  viewBox={`0 0 ${qrMatrix.length + 4} ${qrMatrix.length + 4}`}
                  className="w-56 h-56 sm:w-64 sm:h-64 mx-auto"
                  shapeRendering="crispEdges"
                >
                  <rect width="100%" height="100%" fill="#ffffff" />
                  {qrMatrix.map((row, rIdx) =>
                    row.map((cell, cIdx) =>
                      cell ? (
                        <rect
                          key={`${rIdx}-${cIdx}`}
                          x={cIdx + 2}
                          y={rIdx + 2}
                          width={1}
                          height={1}
                          fill="#06040a"
                        />
                      ) : null
                    )
                  )}
                </svg>
              </div>

              <p className="text-xs text-[#c9c4d6]">
                {qrMode === 'url'
                  ? isAr
                    ? 'امسح الكود بكاميرا الموبايل لفتح صفحة الكارت الرقمي الكاملة.'
                    : 'Scan with any phone camera to open this full Digital Business Card page.'
                  : qrMode === 'instapay'
                  ? isAr
                    ? 'امسح الكود لفتح رابط التحويل المباشر عبر تطبيق InstaPay.'
                    : 'Scan to open the direct InstaPay payment link.'
                  : isAr
                  ? 'امسح الكود لإضافة رقم وبيانات م. طارق وجيه مباشرة إلى جهات الاتصال.'
                  : 'Scan to immediately add Eng. Tarek Wagieh to Contacts.'}
              </p>

              {/* Download QR PNG & Copy Direct Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleDownloadQrPng}
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8247e5] to-[#56259e] hover:from-[#9258f5] hover:to-[#662eb8] text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{isAr ? 'تحميل صورة الـ QR' : 'Download QR PNG'}</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleCopy(
                      qrMode === 'instapay' ? CARD_CONTACT_DATA.instapayUrl : shareableCardUrl,
                      'modal-link'
                    )
                  }
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.12] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {copiedKey === 'modal-link' ? (
                    <>
                      <Check className="w-4 h-4 text-[#c9b3ff]" />
                      <span className="text-[#e6d9ff]">
                        {isAr ? 'تم نسخ الرابط!' : 'Link Copied!'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#c9b3ff]" />
                      <span>{isAr ? 'نسخ الرابط' : 'Copy Link'}</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
