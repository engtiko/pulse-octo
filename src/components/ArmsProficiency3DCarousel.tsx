import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { LiquidGlassButton } from './LiquidGlassButton';
import { ARMS_PROFICIENCY_DATA, type ArmProficiency } from './ArmsProficiencySection';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Check,
  RotateCcw,
  Zap,
  Activity,
  Layers,
  LayoutGrid
} from 'lucide-react';

interface CircularProgressProps {
  percentage: number;
  gradientId: string;
  gradientFrom: string;
  gradientTo: string;
  number: string;
  isHovered: boolean;
}

const CarouselCircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  gradientId,
  gradientFrom,
  gradientTo,
  number,
  isHovered,
}) => {
  const size = 96;
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (circumference * percentage) / 100;

  return (
    <div className="relative w-16 h-16 xs:w-18 xs:h-18 sm:w-24 sm:h-24 flex items-center justify-center shrink-0">
      <svg className="w-full h-full transform -rotate-90 origin-center" viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradientFrom} />
            <stop offset="100%" stopColor={gradientTo} />
          </linearGradient>
          <filter id={`glow-${gradientId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
        />

        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={gradientFrom}
          strokeWidth={1}
          opacity={isHovered ? 0.45 : 0.2}
          strokeDasharray="4 4"
        />

        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: targetOffset }}
          transition={{
            duration: 1.4,
            ease: [0.16, 1, 0.3, 1],
          }}
          strokeLinecap="round"
          filter={isHovered ? `url(#glow-${gradientId})` : undefined}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
        <span className="text-[7.5px] sm:text-[9px] font-mono font-semibold text-zinc-400">
          ARM {number}
        </span>
        <span className="text-xs xs:text-sm sm:text-lg font-bold font-mono text-white tracking-tight leading-none my-0.5">
          {percentage}%
        </span>
        <span
          className="text-[6.5px] sm:text-[8px] font-semibold font-mono uppercase tracking-wider px-1 sm:px-1.5 py-0.2 rounded-full"
          style={{
            color: gradientTo,
            backgroundColor: 'rgba(255,255,255,0.08)',
          }}
        >
          MASTER
        </span>
      </div>
    </div>
  );
};

interface ArmsProficiency3DCarouselProps {
  onOpenConsultation?: () => void;
}

export const ArmsProficiency3DCarousel: React.FC<ArmsProficiency3DCarouselProps> = ({
  onOpenConsultation,
}) => {
  const { isAr, dir } = useLanguage();
  const stageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(stageRef, { once: false, amount: 0.25 });

  const [activeArmIndex, setActiveArmIndex] = useState<number>(0);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const targetAngleRef = useRef<number>(0);
  const currentAngleRef = useRef<number>(0);

  // Responsive radius calculation
  const [radius, setRadius] = useState<number>(500);
  const [perspective, setPerspective] = useState<number>(1400);
  const [depthOffset, setDepthOffset] = useState<number>(120);

  // Drag & Swipe physics state
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const lastXRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);

  const [isInteracting, setIsInteracting] = useState<boolean>(false);
  const [hoveredCardId, setHoveredCardId] = useState<number | null>(null);

  // Calculate responsive radius based on window size
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 440) {
        // Compact mobile: wide radius so cards never touch/collide, pushed back with depthOffset
        setRadius(290);
        setPerspective(1100);
        setDepthOffset(105);
      } else if (width < 640) {
        // Phablet / large phone
        setRadius(330);
        setPerspective(1200);
        setDepthOffset(115);
      } else if (width < 1024) {
        // Tablets
        setRadius(410);
        setPerspective(1350);
        setDepthOffset(125);
      } else {
        // Desktop
        setRadius(520);
        setPerspective(1500);
        setDepthOffset(135);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Main smooth animation loop with inertia and gentle floating
  useEffect(() => {
    let lastTimestamp = performance.now();

    const animateLoop = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
      lastTimestamp = timestamp;

      // When user is not interacting, add gentle ambient float
      if (!isDraggingRef.current && !isInteracting && isInView) {
        targetAngleRef.current += dt * 3.5; // slow graceful ambient drift
      }

      // Smooth lerp / spring easing towards targetAngle
      const diff = targetAngleRef.current - currentAngleRef.current;
      currentAngleRef.current += diff * 0.12;

      setRotationAngle(currentAngleRef.current);

      // Identify which card is currently closest to the front (0 degrees)
      const numCards = ARMS_PROFICIENCY_DATA.length;
      const anglePerCard = 360 / numCards;
      const normalizedAngle = ((-currentAngleRef.current % 360) + 360) % 360;
      const closestIdx = Math.round(normalizedAngle / anglePerCard) % numCards;
      setActiveArmIndex(closestIdx);

      rafIdRef.current = requestAnimationFrame(animateLoop);
    };

    rafIdRef.current = requestAnimationFrame(animateLoop);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [isInteracting, isInView]);

  // Pointer / Mouse Drag Handlers
  const handlePointerDown = (clientX: number) => {
    isDraggingRef.current = true;
    setIsInteracting(true);
    startXRef.current = clientX;
    lastXRef.current = clientX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
  };

  useEffect(() => {
    const handlePointerMoveGlobal = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const now = performance.now();
      const dt = Math.max(now - lastTimeRef.current, 1);
      const deltaX = clientX - lastXRef.current;

      lastXRef.current = clientX;
      lastTimeRef.current = now;
      velocityRef.current = deltaX / dt;

      // Dragging right rotates right (positive delta), dragging left rotates left
      targetAngleRef.current += deltaX * 0.42;
    };

    const handlePointerUpGlobal = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;

      // Apply velocity inertia flick
      const inertia = velocityRef.current * 160;
      targetAngleRef.current += inertia;

      // Snap to nearest card angle cleanly
      const numCards = ARMS_PROFICIENCY_DATA.length;
      const anglePerCard = 360 / numCards;
      const snapped = Math.round(targetAngleRef.current / anglePerCard) * anglePerCard;
      targetAngleRef.current = snapped;

      setTimeout(() => {
        setIsInteracting(false);
      }, 1800);
    };

    window.addEventListener('mousemove', handlePointerMoveGlobal);
    window.addEventListener('mouseup', handlePointerUpGlobal);
    window.addEventListener('touchmove', handlePointerMoveGlobal, { passive: true });
    window.addEventListener('touchend', handlePointerUpGlobal);

    return () => {
      window.removeEventListener('mousemove', handlePointerMoveGlobal);
      window.removeEventListener('mouseup', handlePointerUpGlobal);
      window.removeEventListener('touchmove', handlePointerMoveGlobal);
      window.removeEventListener('touchend', handlePointerUpGlobal);
    };
  }, []);

  // Rotate to specific card when clicked
  const handleCardClick = (cardIndex: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const numCards = ARMS_PROFICIENCY_DATA.length;
    const anglePerCard = 360 / numCards;
    const cardBaseAngle = cardIndex * anglePerCard;

    // Shortest angular path to bring clicked card to front (relative angle = 0)
    const currentRot = currentAngleRef.current;
    const relativeAngle = ((cardBaseAngle + currentRot) % 360 + 540) % 360 - 180;
    targetAngleRef.current = currentRot - relativeAngle;

    setIsInteracting(true);
    setTimeout(() => setIsInteracting(false), 2000);
  };

  const handleStepRotate = (direction: 'left' | 'right') => {
    const anglePerCard = 360 / ARMS_PROFICIENCY_DATA.length;
    if (direction === 'left') {
      targetAngleRef.current += anglePerCard;
    } else {
      targetAngleRef.current -= anglePerCard;
    }
    setIsInteracting(true);
    setTimeout(() => setIsInteracting(false), 2000);
  };

  const numCards = ARMS_PROFICIENCY_DATA.length;
  const anglePerCard = 360 / numCards;

  return (
    <div
      ref={stageRef}
      className="relative w-full py-10 sm:py-16 overflow-hidden select-none"
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => {
        if (!isDraggingRef.current) setIsInteracting(false);
      }}
    >
      {/* 3D Atmospheric Depth Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-purple-900/20 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-950/20 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* 
        THE 3D CYLINDER CAROUSEL STAGE
        - Scroll reveal: starts far away in space (scale 0.28, opacity 0, rotateY -140deg)
        - Zooms in and rotates smoothly into resting view as user scrolls down!
      */}
      <div
        className="relative w-full h-[470px] xs:h-[500px] sm:h-[540px] md:h-[570px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y"
        style={{
          perspective: `${perspective}px`,
          perspectiveOrigin: '50% 50%',
        }}
        onMouseDown={(e) => handlePointerDown(e.clientX)}
        onTouchStart={(e) => handlePointerDown(e.touches[0].clientX)}
      >
        {/* Outer scroll-triggered reveal animation: starts far away in space (zoom in + rotate into view) */}
        <motion.div
          initial={{
            scale: 0.22,
            opacity: 0,
            rotateY: -130,
            z: -600,
          }}
          whileInView={{
            scale: 1,
            opacity: 1,
            rotateY: 0,
            z: 0,
          }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{
            duration: 1.4,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative w-[220px] xs:w-[245px] sm:w-[290px] md:w-[325px] h-[400px] xs:h-[425px] sm:h-[465px] md:h-[485px] flex items-center justify-center pointer-events-auto"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Inner 3D Rotating Cylinder: pushed back in Z so front card is at comfortable focal depth */}
          <div
            className="relative w-full h-full"
            style={{
              transformStyle: 'preserve-3d',
              transform: `translateZ(-${depthOffset}px) rotateY(${rotationAngle}deg)`,
            }}
          >
            {ARMS_PROFICIENCY_DATA.map((arm, index) => {
              const Icon = arm.icon;
              const baseAngle = index * anglePerCard;
              const gradientId = `carousel-grad-${arm.id}`;

              // Calculate card relative angle to camera for dynamic specular depth & opacity
              const relativeAngle = ((baseAngle + rotationAngle) % 360 + 540) % 360 - 180;
              const distFromFront = Math.abs(relativeAngle);
              const isFrontCard = distFromFront < 26;
              const isFlankingCard = distFromFront >= 26 && distFromFront <= 68;
              const isBackCard = distFromFront > 68;

              // Opacity & scale based on 3D distance - rear cards completely hidden to prevent ghosting!
              const cardOpacity = isFrontCard ? 1 : isFlankingCard ? 0.72 : 0;
              const cardZIndex = isFrontCard ? 50 : isFlankingCard ? 25 : 0;

              return (
                <div
                  key={arm.id}
                  id={`arm-proficiency-${arm.id}`}
                  onClick={(e) => handleCardClick(index, e)}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    transform: `rotateY(${baseAngle}deg) translateZ(${radius}px)`,
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    zIndex: cardZIndex,
                    opacity: cardOpacity,
                    visibility: isBackCard ? 'hidden' : 'visible',
                    pointerEvents: isFrontCard || isFlankingCard ? 'auto' : 'none',
                  }}
                  className="transition-[opacity] duration-300"
                >
                  {/* 
                    LIQUID GLASS CARD ARCHITECTURE 
                    - Backdrop blur 2xl
                    - Rich frosted violet gradient ensuring maximum contrast and zero bleed-through
                    - Specular top highlight line
                    - Tactile smooth scale & elevation hover transition
                  */}
                  <div
                    onMouseEnter={() => setHoveredCardId(arm.id)}
                    onMouseLeave={() => setHoveredCardId(null)}
                    className={`group relative w-full h-full rounded-[26px] sm:rounded-[30px] p-4 xs:p-4.5 sm:p-5 md:p-6 flex flex-col justify-between overflow-hidden border backdrop-blur-2xl transition-all duration-400 ease-out select-none cursor-pointer transform-gpu ${
                      isAr ? 'text-right' : 'text-left'
                    } ${
                      isFrontCard
                        ? 'hover:scale-[1.03] hover:-translate-y-1.5 active:scale-[0.98] bg-gradient-to-b from-[#190c3d]/94 via-[#0d0724]/96 to-[#060318]/98 border-purple-400/80 hover:border-purple-300 shadow-[0_24px_60px_rgba(0,0,0,0.92),0_0_40px_rgba(138,43,226,0.35),inset_0_1px_1.5px_rgba(255,255,255,0.3)] hover:shadow-[0_32px_75px_rgba(0,0,0,0.95),0_0_55px_rgba(138,43,226,0.45),inset_0_1px_2px_rgba(255,255,255,0.4)] ring-1 ring-purple-300/40 hover:ring-purple-300/70'
                        : 'hover:scale-[1.02] hover:-translate-y-0.5 bg-gradient-to-b from-[#130a2e]/75 via-[#0a061b]/80 to-[#05030e]/85 border-purple-500/25 hover:border-purple-400/60 shadow-[0_16px_40px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.18)]'
                    }`}
                  >
                    {/* Top Specular Sheen Line */}
                    <div className="absolute top-0 inset-x-6 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

                    {/* Ambient Violet Inner Bloom */}
                    <div
                      className="absolute -top-16 -right-16 w-36 h-36 rounded-full blur-2xl pointer-events-none transition-opacity duration-500"
                      style={{
                        background: `radial-gradient(circle, ${arm.gradientFrom}40 0%, transparent 70%)`,
                        opacity: isFrontCard ? 0.7 : 0.25,
                      }}
                    />

                    {/* Card Header: Arm Pill & Icon */}
                    <div className="relative z-10 flex items-center justify-between mb-2 sm:mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-white border border-white/15 bg-white/[0.06] backdrop-blur-xl shadow-inner transition-transform group-hover:scale-105 shrink-0">
                          <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-purple-300 group-hover:text-white" />
                        </div>
                        <div>
                          <span className="text-xs sm:text-xs font-bold font-mono tracking-wider text-purple-200">
                            ARM {arm.number}
                          </span>
                          <div className="text-[10px] sm:text-[11px] text-zinc-300 font-medium truncate max-w-[95px] xs:max-w-none">
                            {isAr ? arm.categoryAr : arm.categoryEn}
                          </div>
                        </div>
                      </div>

                      <span className="px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-400/40 text-[10px] font-semibold text-purple-200 backdrop-blur-md shrink-0">
                        {isAr ? arm.levelAr : arm.levelEn}
                      </span>
                    </div>

                    {/* Centered Circular Progress Gauge */}
                    <div className="relative z-10 flex justify-center my-1.5 sm:my-2.5">
                      <CarouselCircularProgress
                        percentage={arm.percentage}
                        gradientId={gradientId}
                        gradientFrom={arm.gradientFrom}
                        gradientTo={arm.gradientTo}
                        number={arm.number}
                        isHovered={hoveredCardId === arm.id || isFrontCard}
                      />
                    </div>

                    {/* Arm Title */}
                    <div className="relative z-10 mt-1 mb-2">
                      <h3 className="text-sm xs:text-base sm:text-lg font-bold text-white group-hover:text-purple-200 transition-colors leading-snug">
                        {isAr ? arm.titleAr : arm.titleEn}
                      </h3>
                      <div className="text-[10px] sm:text-[11px] text-zinc-400 font-mono truncate mt-0.5">
                        {arm.titleEn}
                      </div>
                    </div>

                    {/* Skills Checklist */}
                    <div className="relative z-10 space-y-1 mb-3 pt-2.5 border-t border-purple-500/25">
                      {(isAr ? arm.skillsAr : arm.skillsEn).slice(0, 3).map((skill, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex items-start gap-2 text-[10.5px] sm:text-xs text-zinc-200 leading-snug"
                        >
                          <div className="w-3.5 h-3.5 rounded-full bg-purple-950/90 border border-purple-400/40 flex items-center justify-center shrink-0 mt-0.5 text-purple-300">
                            <Check className="w-2 h-2" />
                          </div>
                          <span className="truncate">{skill}</span>
                        </div>
                      ))}
                    </div>

                    {/* Benchmark Footer */}
                    <div className="relative z-10 pt-2.5 border-t border-purple-500/25 flex items-center justify-between text-xs">
                      <span className="text-[10px] sm:text-[11px] text-zinc-400">
                        {isAr ? 'الميزة القياسية:' : 'Benchmark:'}
                      </span>
                      <span className="font-semibold text-[9.5px] sm:text-[10.5px] px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/12 text-purple-200 truncate max-w-[140px] sm:max-w-none">
                        {isAr ? arm.highlightAr : arm.highlightEn}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* 3D Navigation Controls: Left/Right Steppers with Glowing Pulse Dots */}
      <div className="relative z-20 max-w-md mx-auto mt-6 px-4 flex items-center justify-center gap-3">
        {/* Previous Arrow */}
        <LiquidGlassButton
          onClick={() => handleStepRotate('left')}
          variant="secondary"
          size="sm"
          aria-label={isAr ? 'تدوير لليمين' : 'Rotate right'}
          title={isAr ? 'تدوير لليمين' : 'Rotate right'}
          className="w-10 h-10 p-0 flex items-center justify-center rounded-full shrink-0"
        >
          <ChevronLeft className={`w-4 h-4 text-purple-200 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
        </LiquidGlassButton>

        {/* Central Glowing Pagination Dots Container */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-full backdrop-blur-2xl bg-gradient-to-b from-[#130a2e]/70 via-[#0a061b]/75 to-[#05030e]/80 border border-purple-500/30 shadow-[0_8px_25px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] relative overflow-hidden">
          <div className="absolute top-0 inset-x-2 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
          {ARMS_PROFICIENCY_DATA.map((arm, idx) => {
            const isActive = activeArmIndex === idx;
            return (
              <button
                key={arm.id}
                type="button"
                onClick={(e) => handleCardClick(idx, e)}
                title={isAr ? arm.titleAr : arm.titleEn}
                aria-label={isAr ? arm.titleAr : arm.titleEn}
                className={`transition-all duration-300 cursor-pointer rounded-full ${
                  isActive
                    ? 'w-6 h-2 bg-gradient-to-r from-purple-400 via-white to-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.95)]'
                    : 'w-2 h-2 bg-white/25 hover:bg-white/60 hover:scale-125'
                }`}
              />
            );
          })}
        </div>

        {/* Next Arrow */}
        <LiquidGlassButton
          onClick={() => handleStepRotate('right')}
          variant="secondary"
          size="sm"
          aria-label={isAr ? 'تدوير لليسار' : 'Rotate left'}
          title={isAr ? 'تدوير لليسار' : 'Rotate left'}
          className="w-10 h-10 p-0 flex items-center justify-center rounded-full shrink-0"
        >
          <ChevronRight className={`w-4 h-4 text-purple-200 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
        </LiquidGlassButton>
      </div>
    </div>
  );
};
