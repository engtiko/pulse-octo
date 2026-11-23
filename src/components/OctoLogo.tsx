import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Upload, Image as ImageIcon, Sparkles } from 'lucide-react';

interface OctoLogoProps {
  variant?: 'compact' | 'hero' | 'emblem' | 'icon' | 'iconOnly';
  className?: string;
  glow?: boolean;
  showPlate?: boolean;
  showText?: boolean;
}

export const OctoLogo: React.FC<OctoLogoProps> = ({
  variant = 'compact',
  className = '',
  glow = true,
  showPlate = true,
  showText = true,
}) => {
  // Prioritize ultra-light WebP logo (/12.webp = 16KB, /12-sm.webp = 6KB), then /12.png fallback
  const LOGO_CANDIDATES = ['/12.webp', '/12.png', '/logo.png', '/projects/12.png', '/1.png'];
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [useFallbackSvg, setUseFallbackSvg] = useState(false);
  const [customStorageUrl, setCustomStorageUrl] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('pulse_octo_custom_logo');
      if (saved) {
        setCustomStorageUrl(saved);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const handleImageError = () => {
    if (candidateIndex + 1 < LOGO_CANDIDATES.length) {
      setCandidateIndex(prev => prev + 1);
    } else {
      setUseFallbackSvg(true);
    }
  };

  const activeLogoUrl = customStorageUrl || (useFallbackSvg ? null : LOGO_CANDIDATES[candidateIndex]);
  const isLogoAvailable = Boolean(activeLogoUrl);

  // 1. Compact Navbar / Header Logo or Icon Only
  if (variant === 'compact' || variant === 'icon' || variant === 'iconOnly') {
    const isIconVariant = variant === 'icon' || variant === 'iconOnly';
    return (
      <div
        className={`flex items-center select-none ${
          isIconVariant ? 'justify-center' : 'gap-2.5 sm:gap-3.5'
        } ${className || (isIconVariant ? 'w-8 h-8' : '')}`}
        id="brand-logo-compact"
      >
        {/* If custom logo image available, render it directly */}
        {isLogoAvailable && activeLogoUrl ? (
          <div
            className={`relative shrink-0 flex items-center justify-center overflow-hidden rounded-full ${
              isIconVariant ? 'w-full h-full max-w-full max-h-full' : 'w-9 h-9 sm:w-11 sm:h-11 max-w-[36px] max-h-[36px] sm:max-w-[44px] sm:max-h-[44px]'
            }`}
          >
            <img
              src={activeLogoUrl}
              srcSet={activeLogoUrl === '/12.webp' ? '/12-sm.webp 128w, /12.webp 256w' : undefined}
              sizes="44px"
              width={44}
              height={44}
              alt="Pulse OCTO | وكالة تسويق رقمي وحلول تقنية متكاملة"
              loading="eager"
              decoding="async"
              onError={handleImageError}
              className="w-full h-full max-w-full max-h-full object-contain rounded-full filter drop-shadow-[0_0_12px_rgba(128,82,255,0.65)]"
            />
          </div>
        ) : (
          <div
            className={`relative flex items-center justify-center shrink-0 overflow-hidden ${
              isIconVariant ? 'w-full h-full max-w-full max-h-full' : 'w-8 h-8 sm:w-10 sm:h-10 max-w-[32px] max-h-[32px] sm:max-w-[40px] sm:max-h-[40px]'
            }`}
          >
            {glow && (
              <>
                {/* Rhythmic Ambient Glow */}
                <motion.div
                  animate={{
                    scale: [1, 1.25, 1],
                    opacity: [0.35, 0.7, 0.35],
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute inset-0 rounded-full bg-[#8A2BE2]/50 blur-md pointer-events-none"
                />

                {/* Subtle Ripple Waves simulating the Octo Pulse */}
                <motion.div
                  animate={{
                    scale: [0.9, 1.6],
                    opacity: [0.6, 0],
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                  className="absolute inset-0 rounded-full border border-purple-400/50 pointer-events-none"
                />
              </>
            )}
            {/* SVG Circular Chrome Shield (from 12.png) */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full relative z-10 drop-shadow-[0_0_12px_rgba(138,43,226,0.9)]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="navSilver" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="30%" stopColor="#cbd5e1" />
                  <stop offset="60%" stopColor="#334155" />
                  <stop offset="100%" stopColor="#94a3b8" />
                </linearGradient>
                <linearGradient id="navPurple" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d8b4fe" />
                  <stop offset="50%" stopColor="#8A2BE2" />
                  <stop offset="100%" stopColor="#3b0764" />
                </linearGradient>
              </defs>

              {/* Chrome Circular Ring */}
              <circle cx="50" cy="50" r="44" stroke="url(#navSilver)" strokeWidth="4.5" />
              <circle cx="50" cy="50" r="39" stroke="url(#navPurple)" strokeWidth="2" strokeDasharray="6 4" />

              {/* Center Vertical Spear */}
              <line x1="50" y1="10" x2="50" y2="90" stroke="url(#navSilver)" strokeWidth="4.5" strokeLinecap="round" />

              {/* Purple Tentacles wrapping around */}
              <path
                d="M48 24 C40 32 35 48 38 66 C40 78 50 82 52 70 C54 58 48 44 60 36 C72 28 80 40 76 56 C74 66 64 74 60 84"
                stroke="url(#navPurple)"
                strokeWidth="5.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M30 48 C22 58 24 72 36 78 C42 80 44 70 38 64"
                stroke="url(#navSilver)"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Glowing Heartbeat Pulse Line */}
              <path
                d="M6 50 L32 50 L38 34 L44 66 L50 24 L56 76 L62 36 L68 60 L74 50 L94 50"
                stroke="#c084fc"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6 50 L32 50 L38 34 L44 66 L50 24 L56 76 L62 36 L68 60 L74 50 L94 50"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}

        {/* Brushed Metal Brand Plate (as seen in 1.png & 12.png) - Compact font size on mobile */}
        {showText && variant !== 'icon' && variant !== 'iconOnly' && (
          <div className="flex flex-col items-start justify-center leading-none" dir="ltr">
            <div className="flex flex-row items-center gap-1.5 sm:gap-2 font-black text-sm sm:text-base md:text-xl font-['Orbitron',sans-serif] tracking-normal" dir="ltr">
              <span className="bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                Pulse
              </span>
              <span className="bg-gradient-to-r from-purple-400 via-[#8A2BE2] to-fuchsia-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(138,43,226,0.8)] tracking-wider">
                OCTO
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. Circular Shield Emblem variant (Directly matching 12.png)
  if (variant === 'emblem') {
    return (
      <div className={`relative flex flex-col items-center justify-center select-none ${className}`} id="brand-logo-emblem">
        {glow && (
          <div className="absolute w-72 h-72 rounded-full bg-[#8A2BE2]/25 blur-3xl -z-10 animate-pulse pointer-events-none" />
        )}

        {/* If custom logo image available, render it directly */}
        {isLogoAvailable && activeLogoUrl ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={activeLogoUrl}
              alt="Pulse OCTO Emblem"
              loading="lazy"
              decoding="async"
              onError={handleImageError}
              className="max-w-full max-h-full object-contain drop-shadow-[0_15px_40px_rgba(138,43,226,0.5)]"
            />
          </div>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            <svg
              viewBox="0 0 400 400"
              className="w-full h-full drop-shadow-[0_15px_40px_rgba(138,43,226,0.5)]"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="emblemChromeLarge" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="25%" stopColor="#cbd5e1" />
                  <stop offset="50%" stopColor="#475569" />
                  <stop offset="75%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#94a3b8" />
                </linearGradient>

                <linearGradient id="emblemPurpleLarge" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d8b4fe" />
                  <stop offset="35%" stopColor="#8A2BE2" />
                  <stop offset="75%" stopColor="#4c1d95" />
                  <stop offset="100%" stopColor="#2e1065" />
                </linearGradient>

                <filter id="emblemGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="6" result="blur1" />
                  <feGaussianBlur stdDeviation="15" result="blur2" />
                  <feMerge>
                    <feMergeNode in="blur2" />
                    <feMergeNode in="blur1" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Circular Outer Beveled Ring from 12.png */}
              <circle cx="200" cy="180" r="140" stroke="url(#emblemChromeLarge)" strokeWidth="18" strokeLinecap="round" />
              <circle cx="200" cy="180" r="149" stroke="url(#emblemPurpleLarge)" strokeWidth="3" />
              <circle cx="200" cy="180" r="124" stroke="#000000" strokeWidth="4" opacity="0.7" />

              {/* Center Vertical Chrome Divider / Spear */}
              <path
                d="M200 40 L200 320"
                stroke="url(#emblemChromeLarge)"
                strokeWidth="16"
                strokeLinecap="round"
              />
              <path
                d="M200 45 L200 315"
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Deep Metallic Purple Intertwining Tentacles (as in 12.png) */}
              <path
                d="M190 70 C240 70 300 100 295 160 C290 200 240 210 220 180 C210 160 220 120 250 120"
                stroke="url(#emblemPurpleLarge)"
                strokeWidth="18"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="270" cy="115" r="5" fill="#ffffff" />
              <circle cx="290" cy="145" r="6" fill="#ffffff" />
              <circle cx="280" cy="175" r="6" fill="#ffffff" />

              <path
                d="M170 190 C130 190 100 220 120 270 C140 310 190 310 180 260 C170 230 140 230 160 200"
                stroke="url(#emblemPurpleLarge)"
                strokeWidth="20"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M230 190 C270 190 300 220 280 270 C260 310 210 310 220 260 C230 230 260 230 240 200"
                stroke="url(#emblemPurpleLarge)"
                strokeWidth="20"
                strokeLinecap="round"
                fill="none"
              />

              {/* Horizontal Electric Heartbeat Pulse Wave */}
              <path
                d="M20 180 L130 180 L145 130 L165 240 L185 100 L200 260 L215 110 L235 230 L255 140 L270 180 L380 180"
                stroke="url(#emblemPurpleLarge)"
                strokeWidth="9"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#emblemGlowFilter)"
              />
              <path
                d="M20 180 L130 180 L145 130 L165 240 L185 100 L200 260 L215 110 L235 230 L255 140 L270 180 L380 180"
                stroke="#ffffff"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}

        {/* 3D Brushed Metal Logo Plate from 12.png */}
        {showPlate && (
          <div className="relative mt-2 px-8 py-3 rounded-2xl bg-gradient-to-b from-[#1e293b] via-[#090d16] to-[#020617] border border-slate-600/80 shadow-[0_10px_30px_rgba(0,0,0,0.9),0_0_20px_rgba(138,43,226,0.35)] flex items-center justify-center gap-3" dir="ltr">
            <div className="flex flex-row items-center tracking-tight font-black text-2xl md:text-3xl font-['Orbitron',sans-serif]" dir="ltr">
              <span className="bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                Pulse
              </span>
              <span className="bg-gradient-to-r from-purple-400 via-[#8A2BE2] to-fuchsia-400 bg-clip-text text-transparent ml-2 drop-shadow-[0_0_15px_rgba(138,43,226,0.8)]">
                OCTO
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. Hero Variant: The Biomechanical Cybernetic Octopus (Matching 1.png)
  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`} id="brand-logo-hero">
      {glow && (
        <div className="absolute w-96 h-96 rounded-full bg-[#8A2BE2]/25 blur-3xl -z-10 animate-pulse pointer-events-none" />
      )}

      {/* If custom logo image available, render it directly */}
      {isLogoAvailable && activeLogoUrl ? (
        <div className="relative w-80 h-72 sm:w-[420px] sm:h-[350px] flex items-center justify-center">
          <img
            src={activeLogoUrl}
            alt="Pulse OCTO Mascot 1.png"
            loading="lazy"
            decoding="async"
            onError={handleImageError}
            className="max-w-full max-h-full object-contain drop-shadow-[0_20px_50px_rgba(138,43,226,0.5)]"
          />
        </div>
      ) : (
        <div className="relative w-80 h-72 sm:w-[440px] sm:h-[360px] flex items-center justify-center">
          <svg
            viewBox="0 0 500 420"
            className="w-full h-full drop-shadow-[0_15px_40px_rgba(138,43,226,0.5)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="heroChrome" x1="20%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="25%" stopColor="#cbd5e1" />
                <stop offset="50%" stopColor="#475569" />
                <stop offset="75%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#94a3b8" />
              </linearGradient>

              <linearGradient id="heroChromeDark" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="40%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#1e1b4b" />
              </linearGradient>

              <linearGradient id="heroNeonPurple" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9333ea" />
                <stop offset="50%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#8A2BE2" />
              </linearGradient>

              <radialGradient id="heroSuctionGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#e9d5ff" />
                <stop offset="40%" stopColor="#8A2BE2" />
                <stop offset="100%" stopColor="#2e1065" />
              </radialGradient>

              <filter id="heroPulseGlowDetailed" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="6" result="blur1" />
                <feGaussianBlur stdDeviation="15" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* BACKGROUND TENTACLES (4 Outer Arms curving upwards as in 1.png) */}
            <path
              d="M170 170 C110 140 70 80 110 30 C135 0 170 30 150 70 C135 100 175 140 210 160"
              fill="url(#heroChromeDark)"
              stroke="url(#heroChrome)"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <circle cx="95" cy="55" r="5" fill="url(#heroSuctionGlow)" />
            <circle cx="115" cy="40" r="6" fill="url(#heroSuctionGlow)" />
            <circle cx="140" cy="50" r="7" fill="url(#heroSuctionGlow)" />

            <path
              d="M330 170 C390 140 430 80 390 30 C365 0 330 30 350 70 C365 100 325 140 290 160"
              fill="url(#heroChromeDark)"
              stroke="url(#heroChrome)"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <circle cx="405" cy="55" r="5" fill="url(#heroSuctionGlow)" />
            <circle cx="385" cy="40" r="6" fill="url(#heroSuctionGlow)" />
            <circle cx="360" cy="50" r="7" fill="url(#heroSuctionGlow)" />

            {/* Middle Outer Left & Right Arms */}
            <path
              d="M190 200 C100 180 30 200 60 250 C80 280 125 260 120 225 C115 190 170 210 215 220"
              fill="url(#heroChromeDark)"
              stroke="url(#heroChrome)"
              strokeWidth="10"
              strokeLinecap="round"
            />
            <path
              d="M310 200 C400 180 470 200 440 250 C420 280 375 260 380 225 C385 190 330 210 285 220"
              fill="url(#heroChromeDark)"
              stroke="url(#heroChrome)"
              strokeWidth="10"
              strokeLinecap="round"
            />

            {/* FOREGROUND TENTACLES (4 Inner Curved Main Arms curving down as in 1.png) */}
            <path
              d="M220 230 C190 270 140 310 170 370 C190 410 230 390 220 340 C210 300 235 270 245 245"
              fill="url(#heroChromeDark)"
              stroke="url(#heroChrome)"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <circle cx="180" cy="350" r="6" fill="url(#heroSuctionGlow)" />
            <circle cx="195" cy="375" r="7" fill="url(#heroSuctionGlow)" />

            <path
              d="M280 230 C310 270 360 310 330 370 C310 410 270 390 280 340 C290 300 265 270 255 245"
              fill="url(#heroChromeDark)"
              stroke="url(#heroChrome)"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <circle cx="320" cy="350" r="6" fill="url(#heroSuctionGlow)" />
            <circle cx="305" cy="375" r="7" fill="url(#heroSuctionGlow)" />

            {/* Central Symmetrical Tentacles */}
            <path
              d="M235 240 C225 280 215 320 230 350 C238 365 248 355 245 330 C242 300 245 270 248 245"
              stroke="url(#heroChrome)"
              strokeWidth="9"
              fill="url(#heroChromeDark)"
              strokeLinecap="round"
            />
            <path
              d="M265 240 C275 280 285 320 270 350 C262 365 252 355 255 330 C258 300 255 270 252 245"
              stroke="url(#heroChrome)"
              strokeWidth="9"
              fill="url(#heroChromeDark)"
              strokeLinecap="round"
            />

            {/* BIOMECHANICAL OCTOPUS HEAD (from 1.png) */}
            <path
              d="M250 45 C185 45 165 95 165 160 C165 205 200 240 250 240 C300 240 335 205 335 160 C335 95 315 45 250 45 Z"
              fill="url(#heroChrome)"
              stroke="#e2e8f0"
              strokeWidth="3.5"
            />

            {/* Central Cybernetic Head Crest / Purple Inlay Strip */}
            <path
              d="M250 50 L250 145 M235 70 L250 55 L265 70 M230 110 L250 130 L270 110"
              stroke="url(#heroNeonPurple)"
              strokeWidth="4"
              strokeLinecap="round"
              filter="url(#heroPulseGlowDetailed)"
            />
            <path
              d="M250 50 L250 145"
              stroke="#ffffff"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* GLOWING NEON VIOLET OCTOPUS EYES (from 1.png) */}
            <ellipse cx="215" cy="175" rx="16" ry="20" transform="rotate(15 215 175)" fill="#0f172a" stroke="#8A2BE2" strokeWidth="2.5" />
            <ellipse cx="215" cy="175" rx="12" ry="16" transform="rotate(15 215 175)" fill="#9333ea" filter="url(#heroPulseGlowDetailed)" />
            <ellipse cx="215" cy="175" rx="5" ry="8" transform="rotate(15 215 175)" fill="#ffffff" />

            <ellipse cx="285" cy="175" rx="16" ry="20" transform="rotate(-15 285 175)" fill="#0f172a" stroke="#8A2BE2" strokeWidth="2.5" />
            <ellipse cx="285" cy="175" rx="12" ry="16" transform="rotate(-15 285 175)" fill="#9333ea" filter="url(#heroPulseGlowDetailed)" />
            <ellipse cx="285" cy="175" rx="5" ry="8" transform="rotate(-15 285 175)" fill="#ffffff" />

            {/* HORIZONTAL ELECTRIC HEARTBEAT / PULSE WAVE (from 1.png) */}
            <path
              d="M10 210 L100 210 L115 160 L135 260 L155 130 L180 280 L200 170 L220 240 L235 210 L265 210 L280 180 L300 250 L320 140 L345 290 L365 160 L385 260 L400 210 L490 210"
              stroke="url(#heroNeonPurple)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#heroPulseGlowDetailed)"
            />
            <path
              d="M10 210 L100 210 L115 160 L135 260 L155 130 L180 280 L200 170 L220 240 L235 210 L265 210 L280 180 L300 250 L320 140 L345 290 L365 160 L385 260 L400 210 L490 210"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      )}

      {/* EMBOSSED 3D METALLIC BRAND PLATE (from 1.png) */}
      {showPlate && (
        <div className="relative mt-2 px-8 py-3 rounded-2xl bg-gradient-to-b from-[#1e293b] via-[#090d16] to-[#020617] border border-slate-600/80 shadow-[0_10px_30px_rgba(0,0,0,0.9),0_0_25px_rgba(138,43,226,0.4)] flex items-center justify-center gap-3" dir="ltr">
          <div className="absolute top-2.5 left-3 w-1.5 h-1.5 rounded-full bg-slate-400 shadow-inner" />
          <div className="absolute top-2.5 right-3 w-1.5 h-1.5 rounded-full bg-slate-400 shadow-inner" />
          <div className="absolute bottom-2.5 left-3 w-1.5 h-1.5 rounded-full bg-slate-400 shadow-inner" />
          <div className="absolute bottom-2.5 right-3 w-1.5 h-1.5 rounded-full bg-slate-400 shadow-inner" />

          <div className="absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-80" />

          <div className="flex flex-row items-center tracking-tight font-black text-2xl md:text-4xl font-['Orbitron',sans-serif]" dir="ltr">
            <span className="bg-gradient-to-b from-white via-slate-200 to-slate-400 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              Pulse
            </span>
            <span className="bg-gradient-to-r from-purple-400 via-[#8A2BE2] to-fuchsia-400 bg-clip-text text-transparent ml-2 drop-shadow-[0_0_15px_rgba(138,43,226,0.8)]">
              OCTO
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
