import React, { useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // Maximum tilt angle in degrees, default 9
  perspective?: number; // Perspective distance, default 1000
  glareEffect?: boolean;
  glowColor?: string; // Optional glow accent color, defaults to neon purple/cyan
  onClick?: () => void;
  id?: string;
}

/**
 * 3D Parallax Tilt Card Component using Framer Motion
 * Adds true 3D perspective, tilt, and a subtle glowing spotlight effect on mouse movement.
 */
export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  maxTilt = 9,
  perspective = 1000,
  glareEffect = true,
  glowColor = 'rgba(138, 43, 226, 0.28)',
  onClick,
  id,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Normalized mouse coordinates: -0.5 to 0.5
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for fluid, physics-based rotation
  const rotateXSpring = useSpring(0, { stiffness: 280, damping: 25, mass: 0.4 });
  const rotateYSpring = useSpring(0, { stiffness: 280, damping: 25, mass: 0.4 });

  // Spotlight light position coordinates in %
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(x);
    mouseY.set(y);

    // Negative for natural tilt perspective
    rotateXSpring.set(-y * maxTilt);
    rotateYSpring.set(x * maxTilt);

    setGlowPos({
      x: Math.round(((e.clientX - rect.left) / rect.width) * 100),
      y: Math.round(((e.clientY - rect.top) / rect.height) * 100),
    });
  }, [maxTilt, mouseX, mouseY, rotateXSpring, rotateYSpring]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateXSpring.set(0);
    rotateYSpring.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      id={id}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: `${perspective}px`,
        transformStyle: 'preserve-3d',
      }}
      className={`relative ${className}`}
    >
      <motion.div
        style={{
          rotateX: rotateXSpring,
          rotateY: rotateYSpring,
          transformStyle: 'preserve-3d',
        }}
        className="w-full h-full relative"
      >
        {children}

        {/* Dynamic Subtle Glowing Light Spotlight Following Mouse Movement */}
        {glareEffect && (
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-[inherit] pointer-events-none transition-opacity duration-300 overflow-hidden z-20"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(circle 320px at ${glowPos.x}% ${glowPos.y}%, rgba(255, 255, 255, 0.2), ${glowColor} 40%, rgba(6, 182, 212, 0.12) 65%, transparent 80%)`,
              mixBlendMode: 'screen',
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
};

