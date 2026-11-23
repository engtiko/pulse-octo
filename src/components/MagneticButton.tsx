import React, { useRef, useCallback, useEffect, useState } from 'react';
import { motion, useSpring } from 'motion/react';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number; // Attraction magnitude in px, default 16
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  id?: string;
}

/**
 * MagneticButton Component
 * Uses Framer Motion to make CTA buttons subtly track and move toward the mouse cursor when hovered.
 * Enhances micro-interaction with realistic, dampening spring physics and graceful return.
 */
export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className = '',
  strength = 16,
  disabled = false,
  onClick,
  id,
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch-only devices to avoid awkward mouse-tracking offsets on tap
    if (typeof window !== 'undefined') {
      const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
      setIsTouchDevice(isTouch);
    }
  }, []);

  // Smooth springs for realistic magnetic pull with quick responsiveness and gentle damping
  const x = useSpring(0, { stiffness: 260, damping: 20, mass: 0.25 });
  const y = useSpring(0, { stiffness: 260, damping: 20, mass: 0.25 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled || isTouchDevice || !buttonRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Distance from mouse to center of button
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;

      // Normalized pull ratio clamped within range
      const ratioX = Math.max(-1, Math.min(1, distanceX / (rect.width / 2)));
      const ratioY = Math.max(-1, Math.min(1, distanceY / (rect.height / 2)));

      x.set(ratioX * strength);
      y.set(ratioY * strength);
    },
    [disabled, isTouchDevice, strength, x, y]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={buttonRef}
      id={id}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`inline-block will-change-transform ${className}`}
    >
      {children}
    </motion.div>
  );
};

