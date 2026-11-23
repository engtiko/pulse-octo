import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedArms } from '../data/agencyData';
import type { ArmData } from '../types';
import { BlurUpImage } from './BlurUpImage';

interface Orbit3DCarouselProps {
  arms?: ArmData[];
  onSelectArm: (arm: ArmData) => void;
}

export const Orbit3DCarousel: React.FC<Orbit3DCarouselProps> = ({ arms, onSelectArm }) => {
  const { lang, isAr, dir } = useLanguage();
  const effectiveArms = useMemo(() => {
    if (arms && Array.isArray(arms) && arms.length > 0) {
      return arms;
    }
    return getLocalizedArms(lang);
  }, [arms, lang]);

  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startRotation, setStartRotation] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const dragDistanceRef = useRef<number>(0);

  // Responsive radius & card width detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const totalCards = effectiveArms.length || 8;
  const anglePerCard = 360 / totalCards; // 45 deg

  // Mobile-optimized dimensions so multiple cards curve visibly in 3D space
  const radius = isMobile ? 185 : 370;
  const cardWidth = isMobile ? 140 : 270;

  // Auto-rotation loop (slow, smooth, and cinematic)
  useEffect(() => {
    if (!autoRotate || isDragging) return;

    const animate = (time: number) => {
      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;
      // Reduced rotation speed for a slow, majestic, and elegant experience
      setRotation((prev) => (prev - delta * 4) % 360);
      animFrameRef.current = requestAnimationFrame(animate);
    };

    lastTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [autoRotate, isDragging]);

  // Drag / Touch Handlers
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    setStartRotation(rotation);
    dragDistanceRef.current = 0;
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const diff = clientX - startX;
    dragDistanceRef.current = Math.abs(diff);
    // Smooth sensitivity factor
    const factor = isMobile ? 0.38 : 0.28;
    setRotation(startRotation + diff * factor);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Find active / front card
  const normalizedRotation = (((-rotation % 360) + 360) % 360);
  const activeIndex = Math.round(normalizedRotation / anglePerCard) % totalCards;

  return (
    <div className="w-full relative select-none py-6 sm:py-10" dir={dir}>
      {/* 3D Cylindrical Orbit Stage */}
      <div
        className="relative w-full h-[370px] sm:h-[480px] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing [perspective:1200px] sm:[perspective:1500px]"
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
      >
        {/* Central Hub Core Ambient Light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-80 h-64 sm:h-80 bg-purple-600/10 rounded-full blur-[90px] pointer-events-none -z-10" />

        {/* 3D Rotating Ring */}
        <div
          style={{
            transform: `rotateY(${rotation}deg)`,
            transformStyle: 'preserve-3d',
            transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="relative w-0 h-0 flex items-center justify-center pointer-events-none"
        >
          {effectiveArms.map((arm, index) => {
            const cardAngle = index * anglePerCard;
            // Angle relative to front view
            const currentAngle = (cardAngle + rotation) % 360;
            const normalizedAngle = ((currentAngle + 180) % 360) - 180;
            const isCenterFront = Math.abs(normalizedAngle) < 25;

            // Opacity and blur tuned so surrounding cards in 3D orbit remain visible on mobile
            const depthFactor = (Math.cos((normalizedAngle * Math.PI) / 180) + 1) / 2; // 0 (back) to 1 (front)
            const opacity = isMobile ? 0.45 + depthFactor * 0.55 : 0.35 + depthFactor * 0.65;
            const blurAmount = (1 - depthFactor) * (isMobile ? 1.2 : 2.5);

            return (
              <div
                key={arm.id}
                style={{
                  width: `${cardWidth}px`,
                  transform: `rotateY(${cardAngle}deg) translateZ(${radius}px)`,
                  transformStyle: 'preserve-3d',
                  opacity: opacity,
                  filter: `blur(${blurAmount}px)`,
                  zIndex: Math.round(depthFactor * 100),
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto transition-[filter,opacity] duration-300"
              >
                {/* Individual 3D Card: Image on top, ONLY service name below */}
                <div
                  onClick={() => {
                    // Only trigger click if it wasn't a drag gesture
                    if (dragDistanceRef.current < 8) {
                      onSelectArm(arm);
                    }
                  }}
                  className={`group relative rounded-2xl backdrop-blur-xl bg-gradient-to-b from-[#130b2c]/95 via-[#0b071a]/95 to-[#05030e]/98 border p-2 sm:p-3 flex flex-col justify-between overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.85)] transition-all duration-300 cursor-pointer ${
                    isCenterFront
                      ? 'border-purple-400/80 shadow-[0_0_28px_rgba(138,43,226,0.45)] ring-1 ring-purple-400/40'
                      : 'border-white/[0.08] hover:border-purple-500/50'
                  }`}
                >
                  {/* Glowing Top Specular Bar */}
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" />

                  {/* 1. Pure Visual Image (No text or Arm number over the image) */}
                  <div
                    className="relative rounded-xl overflow-hidden aspect-[4/3] bg-black/60 border border-white/10 group-hover:border-purple-500/40 transition-colors"
                  >
                    <BlurUpImage
                      src={arm.image}
                      alt={arm.title}
                      className="w-full h-full"
                      imgClassName="w-full h-full object-cover object-center transform transition-transform duration-700 group-hover:scale-106"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b071a]/80 via-transparent to-transparent pointer-events-none z-10" />

                    {/* Subtle Hover Overlay */}
                    <div className="absolute inset-0 bg-purple-950/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-2.5 py-1 rounded-full bg-black/80 border border-purple-400 text-[10px] sm:text-xs font-semibold text-white shadow-lg flex items-center gap-1">
                        <span>{isAr ? 'عرض التفاصيل' : 'Details'}</span>
                        <ArrowRight className={`w-3 h-3 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                      </span>
                    </div>
                  </div>

                  {/* 2. Under Image: ONLY the Service Title (اسم الخدمة فقط) */}
                  <div className="pt-2 sm:pt-3 pb-1 text-center">
                    <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-purple-200 transition-colors leading-snug line-clamp-2">
                      {arm.title}
                    </h3>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Orbit Indicator Dots Strip */}
      <div className="flex items-center justify-center gap-1.5 mt-3 sm:mt-4">
        {arms.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setAutoRotate(false);
              const targetRotation = -i * anglePerCard;
              setRotation(targetRotation);
            }}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              activeIndex === i
                ? 'w-5 sm:w-6 h-1.5 bg-gradient-to-r from-cyan-400 to-purple-500 shadow-[0_0_8px_#22d3ee]'
                : 'w-1.5 h-1.5 bg-zinc-700 hover:bg-zinc-500'
            }`}
            aria-label={`Arm ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
