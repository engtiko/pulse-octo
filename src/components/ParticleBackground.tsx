import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  ParticleTargetState,
  ParticleTargetCoordinate,
  SERVICE_SHAPE_PRESETS,
} from './ServiceParticleController';

export interface ParticleBackgroundProps {
  /** Active section index (0-7) to trigger shape morphing */
  activeSectionIndex?: number | null;
  /** Custom target state */
  targetState?: ParticleTargetState;
  /** Custom target coordinates */
  targetCoordinates?: ParticleTargetCoordinate[];
  /** Custom className */
  className?: string;
  /** Opacity override */
  opacity?: number;
}

interface MorphParticle {
  // Current position
  x: number;
  y: number;
  // Target position in current shape
  tx: number;
  ty: number;
  // Velocity during morph / dissolution
  vx: number;
  vy: number;
  // Visual attributes
  size: number;
  color: string;
  baseColor: string;
  alpha: number;
  rotation: number;
  vRot: number;
  isTriangle: boolean;
}

const PARTICLE_COUNT_DESKTOP = 160;
const PARTICLE_COUNT_MOBILE = 75;

// Generate 2D coordinates for the 8 distinct service icons
function getShapeTargetPoints(
  shapeIndex: number,
  count: number,
  w: number,
  h: number
): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  const cx = w * 0.5;
  const cy = h * 0.5;
  const R = Math.min(w, h) * 0.32;

  for (let i = 0; i < count; i++) {
    const u = i / count;
    const rand = Math.random();
    let x = cx;
    let y = cy;

    switch (shapeIndex) {
      // 0. Branding Star & Neural Brain
      case 0: {
        if (rand < 0.4) {
          // Diamond boundary
          const side = Math.floor(Math.random() * 4);
          const t = Math.random();
          const p1 = [
            { x: cx, y: cy - R * 0.95 },
            { x: cx + R * 0.9, y: cy },
            { x: cx, y: cy + R * 0.95 },
            { x: cx - R * 0.9, y: cy },
          ];
          const a = p1[side];
          const b = p1[(side + 1) % 4];
          x = a.x + (b.x - a.x) * t;
          y = a.y + (b.y - a.y) * t;
        } else if (rand < 0.75) {
          // 4-pointed radiant star spikes
          const angle = Math.floor(Math.random() * 4) * (Math.PI / 2);
          const len = R * (0.3 + 0.7 * Math.random());
          x = cx + Math.cos(angle) * len + (Math.random() - 0.5) * 20;
          y = cy + Math.sin(angle) * len + (Math.random() - 0.5) * 20;
        } else {
          // Inner nucleus cluster
          const r = R * 0.35 * Math.random();
          const theta = Math.random() * Math.PI * 2;
          x = cx + Math.cos(theta) * r;
          y = cy + Math.sin(theta) * r;
        }
        break;
      }

      // 1. Digital Strategy Compass & Radar Gimbal
      case 1: {
        if (rand < 0.45) {
          // Outer gimbal ring
          const theta = u * Math.PI * 2;
          const r = R * 0.9 + (Math.random() - 0.5) * 8;
          x = cx + Math.cos(theta) * r;
          y = cy + Math.sin(theta) * r;
        } else if (rand < 0.75) {
          // North-South & East-West directional cross
          const isNS = Math.random() > 0.5;
          const t = (Math.random() - 0.5) * 2;
          if (isNS) {
            x = cx + (Math.random() - 0.5) * 8;
            y = cy + t * R * 0.85;
          } else {
            x = cx + t * R * 0.85;
            y = cy + (Math.random() - 0.5) * 8;
          }
        } else {
          // Inner concentric radar ring
          const theta = Math.random() * Math.PI * 2;
          const r = R * 0.4;
          x = cx + Math.cos(theta) * r;
          y = cy + Math.sin(theta) * r;
        }
        break;
      }

      // 2. Web & E-Commerce Browser Window & Grid
      case 2: {
        const halfW = R * 0.95;
        const halfH = R * 0.7;
        if (rand < 0.45) {
          // Perimeter of browser window
          const p = Math.random() * (halfW * 4 + halfH * 4);
          if (p < halfW * 2) {
            x = cx - halfW + p;
            y = cy - halfH;
          } else if (p < halfW * 2 + halfH * 2) {
            x = cx + halfW;
            y = cy - halfH + (p - halfW * 2);
          } else if (p < halfW * 4 + halfH * 2) {
            x = cx + halfW - (p - (halfW * 2 + halfH * 2));
            y = cy + halfH;
          } else {
            x = cx - halfW;
            y = cy + halfH - (p - (halfW * 4 + halfH * 2));
          }
        } else if (rand < 0.6) {
          // Top bar line & dots
          x = cx - halfW + Math.random() * halfW * 2;
          y = cy - halfH + 24;
        } else if (rand < 0.8) {
          // Left Product Card Box
          x = cx - halfW * 0.45 + (Math.random() - 0.5) * 45;
          y = cy + 10 + (Math.random() - 0.5) * 45;
        } else {
          // Right Product Card Box
          x = cx + halfW * 0.45 + (Math.random() - 0.5) * 45;
          y = cy + 10 + (Math.random() - 0.5) * 45;
        }
        break;
      }

      // 3. Paid Media Targeted Bullseye & Crosshair
      case 3: {
        if (rand < 0.35) {
          // Outer target circle
          const theta = u * Math.PI * 2;
          x = cx + Math.cos(theta) * R * 0.92;
          y = cy + Math.sin(theta) * R * 0.92;
        } else if (rand < 0.65) {
          // Middle target circle
          const theta = Math.random() * Math.PI * 2;
          x = cx + Math.cos(theta) * R * 0.58;
          y = cy + Math.sin(theta) * R * 0.58;
        } else if (rand < 0.85) {
          // Inner bullseye circle
          const theta = Math.random() * Math.PI * 2;
          x = cx + Math.cos(theta) * R * 0.28;
          y = cy + Math.sin(theta) * R * 0.28;
        } else {
          // Crosshairs
          const isHoriz = Math.random() > 0.5;
          const t = (Math.random() - 0.5) * R * 2.1;
          if (isHoriz) {
            x = cx + t;
            y = cy;
          } else {
            x = cx;
            y = cy + t;
          }
        }
        break;
      }

      // 4. Creative Content Feather & Wave Ribbon
      case 4: {
        if (rand < 0.35) {
          // Curved quill spine
          const t = (Math.random() - 0.5) * 2;
          x = cx + Math.sin(t * 1.5) * 35;
          y = cy - t * R * 0.85;
        } else if (rand < 0.75) {
          // Feather vanes
          const t = Math.random() * 1.6 - 0.8;
          const spineX = cx + Math.sin(t * 1.5) * 35;
          const spineY = cy - t * R * 0.85;
          const side = Math.random() > 0.5 ? 1 : -1;
          const len = (1 - Math.abs(t)) * R * 0.55 * Math.random();
          const angle = (side * Math.PI) / 3.4;
          x = spineX + Math.cos(angle) * len;
          y = spineY + Math.sin(angle) * len * 0.4;
        } else {
          // Ink wave ribbon at bottom
          const t = Math.random() * 2 - 1;
          x = cx + t * R * 0.85;
          y = cy + R * 0.75 + Math.sin(t * 5) * 18;
        }
        break;
      }

      // 5. Visual Production Cinema Camera & Play Triangle
      case 5: {
        const camW = R * 0.75;
        const camH = R * 0.5;
        if (rand < 0.35) {
          // Main camera box
          x = cx - 20 + (Math.random() - 0.5) * camW * 1.6;
          y = cy + (Math.random() - 0.5) * camH * 1.6;
        } else if (rand < 0.65) {
          // Equilateral play triangle in center
          const r1 = Math.random();
          const r2 = Math.random();
          const s1 = Math.sqrt(r1);
          const v1 = { x: cx - 25, y: cy - 28 };
          const v2 = { x: cx + 30, y: cy };
          const v3 = { x: cx - 25, y: cy + 28 };
          x = (1 - s1) * v1.x + s1 * (1 - r2) * v2.x + s1 * r2 * v3.x;
          y = (1 - s1) * v1.y + s1 * (1 - r2) * v2.y + s1 * r2 * v3.y;
        } else if (rand < 0.82) {
          // Lens cone projecting forward
          const t = Math.random();
          x = cx + camW * 0.75 + t * 45;
          const coneH = (0.2 + t * 0.6) * camH;
          y = cy + (Math.random() - 0.5) * coneH * 2;
        } else {
          // Film reels top
          const theta = Math.random() * Math.PI * 2;
          const isLeft = Math.random() > 0.5;
          const reelX = isLeft ? cx - camW * 0.4 : cx + camW * 0.2;
          const r = Math.random() * 22;
          x = reelX + Math.cos(theta) * r;
          y = cy - camH * 0.85 + Math.sin(theta) * r;
        }
        break;
      }

      // 6. AI Solutions Neural Microchip Processor
      case 6: {
        const chip = R * 0.62;
        if (rand < 0.35) {
          // Square chip boundary
          const side = Math.floor(Math.random() * 4);
          const t = (Math.random() - 0.5) * 2;
          if (side === 0) { x = cx + t * chip; y = cy - chip; }
          else if (side === 1) { x = cx + chip; y = cy + t * chip; }
          else if (side === 2) { x = cx + t * chip; y = cy + chip; }
          else { x = cx - chip; y = cy + t * chip; }
        } else if (rand < 0.65) {
          // Radiating bus pins
          const pinSide = Math.floor(Math.random() * 4);
          const offset = (Math.floor(Math.random() * 5) - 2) * (chip * 0.35);
          const len = chip + Math.random() * 32;
          if (pinSide === 0) { x = cx + offset; y = cy - len; }
          else if (pinSide === 1) { x = cx + len; y = cy + offset; }
          else if (pinSide === 2) { x = cx + offset; y = cy + len; }
          else { x = cx - len; y = cy + offset; }
        } else {
          // 4x4 internal synaptic node grid
          const gx = Math.floor(Math.random() * 4) - 1.5;
          const gy = Math.floor(Math.random() * 4) - 1.5;
          x = cx + gx * (chip * 0.45) + (Math.random() - 0.5) * 10;
          y = cy + gy * (chip * 0.45) + (Math.random() - 0.5) * 10;
        }
        break;
      }

      // 7. Growth & SEO Exponential Surge Curve
      case 7:
      default: {
        if (rand < 0.25) {
          // L-shaped axes
          const isY = Math.random() > 0.5;
          const t = Math.random();
          if (isY) {
            x = cx - R * 0.85;
            y = cy - R * 0.85 + t * R * 1.7;
          } else {
            x = cx - R * 0.85 + t * R * 1.7;
            y = cy + R * 0.85;
          }
        } else if (rand < 0.7) {
          // Exponential hockey-stick curve
          const t = Math.random();
          x = cx - R * 0.8 + t * R * 1.6;
          const normY = Math.pow(t, 2.4);
          y = cy + R * 0.85 - normY * R * 1.7;
        } else if (rand < 0.85) {
          // Ascending bar pillars
          const barIdx = Math.floor(Math.random() * 4);
          const barHeights = [R * 0.25, R * 0.5, R * 0.85, R * 1.35];
          const bX = cx - R * 0.55 + barIdx * (R * 0.4);
          x = bX + (Math.random() - 0.5) * 12;
          y = cy + R * 0.85 - Math.random() * barHeights[barIdx];
        } else {
          // Soaring Arrowhead
          const tipX = cx + R * 0.82;
          const tipY = cy - R * 0.82;
          const angle = Math.random() > 0.5 ? Math.PI * 0.75 : Math.PI * 0.45;
          const len = Math.random() * 26;
          x = tipX + Math.cos(angle) * len;
          y = tipY + Math.sin(angle) * len;
        }
        break;
      }
    }

    points.push({ x, y });
  }

  return points;
}

/**
 * ParticleBackground
 * 
 * High-performance dark-stage canvas that listens to ServiceParticleController
 * and triggers the requested shape-morphing animation between services.
 * Thousands of tiny triangular particles dissolve into the void and reassemble
 * into each service icon.
 */
export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  activeSectionIndex,
  targetState: propTargetState,
  targetCoordinates: propTargetCoordinates,
  className = '',
  opacity = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<MorphParticle[]>([]);

  // Internal target state (listened from ServiceParticleController)
  const [internalState, setInternalState] = useState<ParticleTargetState>(() => {
    return {
      ...SERVICE_SHAPE_PRESETS[0],
      previousShapeIndex: 0,
      morphTriggerId: 0,
      isMorphing: false,
      timestamp: Date.now(),
    };
  });

  // Listen to state update event from ServiceParticleController
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleTargetUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<ParticleTargetState>;
      if (customEvent.detail) {
        setInternalState(customEvent.detail);
      }
    };

    window.addEventListener('pulse:particle-target-update', handleTargetUpdate);
    return () => {
      window.removeEventListener('pulse:particle-target-update', handleTargetUpdate);
    };
  }, []);

  // Determine active preset (priority: propTargetState -> prop activeSectionIndex -> internalState)
  const currentTargetState = useMemo<ParticleTargetState>(() => {
    if (propTargetState) return propTargetState;

    if (activeSectionIndex !== undefined && activeSectionIndex !== null) {
      const safeIdx = Math.min(
        Math.max(activeSectionIndex, 0),
        SERVICE_SHAPE_PRESETS.length - 1
      );
      const preset = SERVICE_SHAPE_PRESETS[safeIdx];
      return {
        ...preset,
        previousShapeIndex: internalState.activeSectionIndex,
        morphTriggerId: safeIdx + 1,
        isMorphing: safeIdx !== internalState.activeSectionIndex,
        timestamp: Date.now(),
      };
    }

    return internalState;
  }, [propTargetState, activeSectionIndex, internalState]);

  const [isMobileView] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  // 1. Initialize Particles on mount (Desktop >= 768px only)
  useEffect(() => {
    if (isMobileView) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const count = PARTICLE_COUNT_DESKTOP;

    const w = (canvas.width = window.innerWidth);
    const h = (canvas.height = window.innerHeight);

    const initialPoints = getShapeTargetPoints(currentTargetState.targetShapeIndex, count, w, h);
    const particles: MorphParticle[] = [];

    const brandPalette = [
      '#8052ff', // Electric Iris
      '#c084fc', // Lilac
      '#06b6d4', // Pulse Cyan
      '#ffb829', // Saffron Spark
      '#ffffff', // Bone White
    ];

    for (let i = 0; i < count; i++) {
      const pt = initialPoints[i] || { x: w * 0.5, y: h * 0.5 };
      const col = brandPalette[i % brandPalette.length];
      particles.push({
        x: pt.x + (Math.random() - 0.5) * 40,
        y: pt.y + (Math.random() - 0.5) * 40,
        tx: pt.x,
        ty: pt.y,
        vx: 0,
        vy: 0,
        size: Math.random() > 0.4 ? 2.5 + Math.random() * 2 : 1.5 + Math.random() * 1.5,
        color: col,
        baseColor: col,
        alpha: 0.35 + Math.random() * 0.55,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.04,
        isTriangle: Math.random() > 0.35, // 65% are tiny triangular pyramids
      });
    }

    particlesRef.current = particles;

    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Re-assign target points on resize
      const newPoints = getShapeTargetPoints(
        currentTargetState.targetShapeIndex,
        particlesRef.current.length,
        canvas.width,
        canvas.height
      );
      particlesRef.current.forEach((p, idx) => {
        if (newPoints[idx]) {
          p.tx = newPoints[idx].x;
          p.ty = newPoints[idx].y;
        }
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 2. Trigger Shape-Morphing Animation when Target State Changes
  const prevTriggerIdRef = useRef<number>(-1);
  useEffect(() => {
    if (prevTriggerIdRef.current === currentTargetState.morphTriggerId) return;
    prevTriggerIdRef.current = currentTargetState.morphTriggerId;

    const canvas = canvasRef.current;
    if (!canvas || particlesRef.current.length === 0) return;

    const w = canvas.width || window.innerWidth;
    const h = canvas.height || window.innerHeight;

    // Generate new shape coordinates for the requested service
    const newTargets = getShapeTargetPoints(
      currentTargetState.targetShapeIndex,
      particlesRef.current.length,
      w,
      h
    );

    // Trigger explosive dissolution outward into void, then gravitation into new shape
    particlesRef.current.forEach((p, i) => {
      if (newTargets[i]) {
        p.tx = newTargets[i].x;
        p.ty = newTargets[i].y;
      }

      // Dissolution burst velocity
      const angle = Math.random() * Math.PI * 2;
      const burstSpeed = 8 + Math.random() * 16;
      p.vx = Math.cos(angle) * burstSpeed;
      p.vy = Math.sin(angle) * burstSpeed;
      p.vRot = (Math.random() - 0.5) * 0.2;

      // Color tint shift to active service primary color
      if (Math.random() > 0.4) {
        p.color = currentTargetState.primaryColor;
      } else if (Math.random() > 0.5) {
        p.color = currentTargetState.accentColor;
      } else {
        p.color = p.baseColor;
      }
    });
  }, [currentTargetState]);

  // 3. Render Loop: Physics, Dissolution, Morphing & Constellation Links
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const render = () => {
      time += 0.02;
      animFrameRef.current = requestAnimationFrame(render);

      const w = canvas.width;
      const h = canvas.height;

      // Clear with soft void transparency
      ctx.clearRect(0, 0, w, h);

      const particles = particlesRef.current;
      const linkDistSq = 85 * 85;

      // Draw faint constellation links between nearby particles
      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < linkDistSq) {
            const alpha = (1 - distSq / linkDistSq) * 0.18;
            ctx.strokeStyle = currentTargetState.primaryColor;
            ctx.globalAlpha = alpha * opacity;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Update & Draw each microscopic particle pyramid / dot
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Gravitational spring toward target point
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        const spring = 0.045;
        const friction = 0.86;

        p.vx += dx * spring;
        p.vy += dy * spring;

        p.vx *= friction;
        p.vy *= friction;

        p.x += p.vx;
        p.y += p.vy;

        // Subtle gentle breathing drift when settled
        p.x += Math.sin(time + i) * 0.25;
        p.y += Math.cos(time + i * 0.7) * 0.25;

        p.rotation += p.vRot;
        p.vRot *= 0.98;

        ctx.globalAlpha = p.alpha * opacity;
        ctx.fillStyle = p.color;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.isTriangle) {
          // Draw tiny microscopic equilateral triangle / pyramid facet
          const r = p.size;
          ctx.beginPath();
          ctx.moveTo(0, -r);
          ctx.lineTo(r * 0.866, r * 0.5);
          ctx.lineTo(-r * 0.866, r * 0.5);
          ctx.closePath();
          ctx.fill();
        } else {
          // Draw circular node
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.65, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      ctx.globalAlpha = 1.0;
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [currentTargetState, opacity]);

  if (isMobileView) {
    return (
      <div
        aria-hidden="true"
        className={`fixed inset-0 pointer-events-none z-0 select-none overflow-hidden bg-[#030108] bg-[radial-gradient(ellipse_85%_65%_at_50%_35%,rgba(128,82,255,0.18)_0%,rgba(6,182,212,0.05)_50%,#030108_100%)] ${className}`}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none z-0 select-none overflow-hidden ${className}`}
      style={{ pointerEvents: 'none' }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none"
        style={{ pointerEvents: 'none' }}
        aria-label="Shape-Morphing Constellation Particle Canvas"
      />
    </div>
  );
};
