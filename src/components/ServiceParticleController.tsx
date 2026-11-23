import React, { useEffect, useRef, useState, useCallback } from 'react';

export interface ParticleTargetCoordinate {
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  label?: string;
  weight?: number;
}

export interface ParticleTargetState {
  activeSectionIndex: number;
  targetShapeIndex: number;
  previousShapeIndex: number;
  sectionName: string;
  enTitle: string;
  targetCoordinates: ParticleTargetCoordinate[];
  colors: string[];
  primaryColor: string;
  accentColor: string;
  particleSpeed: number;
  linkDistance: number;
  clusterTheme: string;
  morphTriggerId: number;
  isMorphing: boolean;
  timestamp: number;
}

// Pre-defined target anchor coordinate groups for the 8 services
export const SERVICE_SHAPE_PRESETS: Omit<
  ParticleTargetState,
  'morphTriggerId' | 'isMorphing' | 'previousShapeIndex' | 'timestamp'
>[] = [
  // 0. Branding & Identity Architecture
  {
    activeSectionIndex: 0,
    targetShapeIndex: 0,
    sectionName: 'الهوية وبناء العلامة',
    enTitle: 'BRANDING',
    colors: ['#8052ff', '#ffffff', '#c084fc', '#a855f7'],
    primaryColor: '#8052ff',
    accentColor: '#ffffff',
    linkDistance: 130,
    particleSpeed: 0.35,
    clusterTheme: 'diamond-brain',
    targetCoordinates: [
      { x: 50, y: 25, label: 'Apex' },
      { x: 68, y: 50, label: 'EastFacet' },
      { x: 50, y: 75, label: 'Base' },
      { x: 32, y: 50, label: 'WestFacet' },
      { x: 50, y: 50, label: 'CoreNucleus' },
      { x: 60, y: 38, label: 'SynapseNE' },
      { x: 40, y: 38, label: 'SynapseNW' },
      { x: 60, y: 62, label: 'SynapseSE' },
      { x: 40, y: 62, label: 'SynapseSW' },
    ],
  },
  // 1. Digital Marketing & Paid Media
  {
    activeSectionIndex: 1,
    targetShapeIndex: 1,
    sectionName: 'التسويق الرقمي',
    enTitle: 'MARKETING',
    colors: ['#06b6d4', '#8052ff', '#38bdf8', '#ffb829'],
    primaryColor: '#06b6d4',
    accentColor: '#ffb829',
    linkDistance: 145,
    particleSpeed: 0.4,
    clusterTheme: 'compass-radar',
    targetCoordinates: [
      { x: 50, y: 18, label: 'North' },
      { x: 82, y: 50, label: 'East' },
      { x: 50, y: 82, label: 'South' },
      { x: 18, y: 50, label: 'West' },
      { x: 50, y: 50, label: 'GimbalCenter' },
      { x: 72, y: 28, label: 'NorthEast' },
      { x: 28, y: 72, label: 'SouthWest' },
      { x: 72, y: 72, label: 'SouthEast' },
      { x: 28, y: 28, label: 'NorthWest' },
    ],
  },
  // 2. Web & E-Commerce Architecture
  {
    activeSectionIndex: 2,
    targetShapeIndex: 2,
    sectionName: 'المواقع والتجارة الإلكترونية',
    enTitle: 'WEB & E-COMMERCE',
    colors: ['#8052ff', '#15846e', '#10b981', '#ffffff'],
    primaryColor: '#8052ff',
    accentColor: '#15846e',
    linkDistance: 120,
    particleSpeed: 0.32,
    clusterTheme: 'window-grid',
    targetCoordinates: [
      { x: 22, y: 26, label: 'TopLeft' },
      { x: 78, y: 26, label: 'TopRight' },
      { x: 78, y: 74, label: 'BottomRight' },
      { x: 22, y: 74, label: 'BottomLeft' },
      { x: 50, y: 26, label: 'HeaderCenter' },
      { x: 36, y: 50, label: 'ProductCardA' },
      { x: 64, y: 50, label: 'ProductCardB' },
      { x: 30, y: 32, label: 'Dot1' },
      { x: 35, y: 32, label: 'Dot2' },
      { x: 40, y: 32, label: 'Dot3' },
    ],
  },
  // 3. Studio & Creative Production
  {
    activeSectionIndex: 3,
    targetShapeIndex: 3,
    sectionName: 'الاستوديو والإنتاج الإبداعي',
    enTitle: 'STUDIO',
    colors: ['#ffb829', '#8052ff', '#f59e0b', '#ec4899'],
    primaryColor: '#ffb829',
    accentColor: '#8052ff',
    linkDistance: 135,
    particleSpeed: 0.45,
    clusterTheme: 'target-bullseye',
    targetCoordinates: [
      { x: 50, y: 50, label: 'BullseyeCenter' },
      { x: 50, y: 30, label: 'InnerRingTop' },
      { x: 70, y: 50, label: 'InnerRingRight' },
      { x: 50, y: 70, label: 'InnerRingBottom' },
      { x: 30, y: 50, label: 'InnerRingLeft' },
      { x: 50, y: 15, label: 'CrosshairUp' },
      { x: 85, y: 50, label: 'CrosshairRight' },
      { x: 50, y: 85, label: 'CrosshairDown' },
      { x: 15, y: 50, label: 'CrosshairLeft' },
    ],
  },
  // 4. Digital Products & Custom Tools
  {
    activeSectionIndex: 4,
    targetShapeIndex: 4,
    sectionName: 'المنتجات والحلول الرقمية',
    enTitle: 'DIGITAL PRODUCTS',
    colors: ['#c084fc', '#ffb829', '#a855f7', '#ffffff'],
    primaryColor: '#c084fc',
    accentColor: '#ffb829',
    linkDistance: 140,
    particleSpeed: 0.35,
    clusterTheme: 'wave-ribbon',
    targetCoordinates: [
      { x: 16, y: 56, label: 'WaveP1' },
      { x: 32, y: 36, label: 'WaveP2' },
      { x: 50, y: 64, label: 'WaveP3' },
      { x: 68, y: 36, label: 'WaveP4' },
      { x: 84, y: 56, label: 'WaveP5' },
      { x: 44, y: 22, label: 'QuillTip' },
      { x: 56, y: 78, label: 'InkDrop' },
    ],
  },
  // 5. Strategy & Positioning
  {
    activeSectionIndex: 5,
    targetShapeIndex: 5,
    sectionName: 'الاستراتيجية',
    enTitle: 'STRATEGY',
    colors: ['#8052ff', '#06b6d4', '#e11d48', '#ffffff'],
    primaryColor: '#8052ff',
    accentColor: '#06b6d4',
    linkDistance: 130,
    particleSpeed: 0.38,
    clusterTheme: 'cinema-frame',
    targetCoordinates: [
      { x: 25, y: 30, label: 'CamTL' },
      { x: 75, y: 30, label: 'CamTR' },
      { x: 75, y: 70, label: 'CamBR' },
      { x: 25, y: 70, label: 'CamBL' },
      { x: 44, y: 42, label: 'PlayVertex1' },
      { x: 58, y: 50, label: 'PlayVertex2' },
      { x: 44, y: 58, label: 'PlayVertex3' },
      { x: 84, y: 50, label: 'LensApex' },
    ],
  },
  // 6. Content Creation & Storytelling
  {
    activeSectionIndex: 6,
    targetShapeIndex: 6,
    sectionName: 'صناعة المحتوى',
    enTitle: 'CONTENT',
    colors: ['#8052ff', '#15846e', '#06b6d4', '#ffb829'],
    primaryColor: '#8052ff',
    accentColor: '#15846e',
    linkDistance: 125,
    particleSpeed: 0.42,
    clusterTheme: 'chip-synapse',
    targetCoordinates: [
      { x: 36, y: 36, label: 'NodeA' },
      { x: 64, y: 36, label: 'NodeB' },
      { x: 64, y: 64, label: 'NodeC' },
      { x: 36, y: 64, label: 'NodeD' },
      { x: 50, y: 18, label: 'BusNorth' },
      { x: 82, y: 50, label: 'BusEast' },
      { x: 50, y: 82, label: 'BusSouth' },
      { x: 18, y: 50, label: 'BusWest' },
      { x: 50, y: 50, label: 'ChipCore' },
    ],
  },
  // 7. Growth & SEO Optimization
  {
    activeSectionIndex: 7,
    targetShapeIndex: 7,
    sectionName: 'النمو والتحسين',
    enTitle: 'GROWTH',
    colors: ['#10b981', '#ffb829', '#8052ff', '#06b6d4'],
    primaryColor: '#10b981',
    accentColor: '#ffb829',
    linkDistance: 150,
    particleSpeed: 0.48,
    clusterTheme: 'exponential-surge',
    targetCoordinates: [
      { x: 16, y: 80, label: 'Origin' },
      { x: 34, y: 76, label: 'Inflection' },
      { x: 52, y: 62, label: 'Acceleration' },
      { x: 70, y: 42, label: 'Parabolic' },
      { x: 86, y: 18, label: 'ApexArrow' },
      { x: 76, y: 18, label: 'ArrowBarb1' },
      { x: 86, y: 28, label: 'ArrowBarb2' },
      { x: 16, y: 20, label: 'YAxisTop' },
    ],
  },
];

export interface ServiceParticleControllerProps {
  /** Active section index (0-7) consumed directly from scroll observer */
  activeSectionIndex?: number;
  /** Optional container or target selector for self-contained scroll observing */
  targetSectionSelector?: string;
  /** Callback fired whenever target state changes */
  onTargetStateChange?: (state: ParticleTargetState) => void;
  /** Custom wrapper class */
  className?: string;
}

/**
 * ServiceParticleController
 * 
 * Consumes the active section index from the scroll observer and uses it
 * to update the ParticleBackground target state, triggering the requested
 * shape-morphing animation between services.
 */
export const ServiceParticleController: React.FC<ServiceParticleControllerProps> = ({
  activeSectionIndex,
  targetSectionSelector = '[data-arm-index]',
  onTargetStateChange,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(
    activeSectionIndex !== undefined ? activeSectionIndex : 0
  );
  const previousIndexRef = useRef<number>(0);
  const triggerCounterRef = useRef<number>(0);

  // 1. Consume active section index from prop if provided by parent scroll observer
  useEffect(() => {
    if (activeSectionIndex !== undefined && activeSectionIndex !== currentIndex) {
      previousIndexRef.current = currentIndex;
      setCurrentIndex(activeSectionIndex);
    }
  }, [activeSectionIndex, currentIndex]);

  // 2. Self-contained IntersectionObserver to track active sections if prop is omitted
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (activeSectionIndex !== undefined) return; // Prop takes precedence

    const sections = document.querySelectorAll(targetSectionSelector);
    if (!sections || sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let maxRatio = 0;
        let detectedIndex = -1;

        entries.forEach((entry) => {
          const idxAttr = entry.target.getAttribute('data-arm-index');
          if (idxAttr !== null) {
            const idx = parseInt(idxAttr, 10);
            if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
              maxRatio = entry.intersectionRatio;
              detectedIndex = idx;
            }
          }
        });

        if (detectedIndex !== -1 && detectedIndex !== currentIndex) {
          previousIndexRef.current = currentIndex;
          setCurrentIndex(detectedIndex);
        }
      },
      {
        root: null,
        rootMargin: '-20% 0px -20% 0px',
        threshold: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
      }
    );

    sections.forEach((sec) => observer.observe(sec));

    return () => {
      observer.disconnect();
    };
  }, [targetSectionSelector, activeSectionIndex, currentIndex]);

  // 3. Update ParticleBackground Target State & Trigger Shape-Morphing
  const dispatchTargetState = useCallback(
    (newIdx: number, prevIdx: number) => {
      const safeIdx = Math.min(Math.max(newIdx, 0), SERVICE_SHAPE_PRESETS.length - 1);
      const safePrev = Math.min(Math.max(prevIdx, 0), SERVICE_SHAPE_PRESETS.length - 1);
      const preset = SERVICE_SHAPE_PRESETS[safeIdx];

      triggerCounterRef.current += 1;

      const targetState: ParticleTargetState = {
        ...preset,
        activeSectionIndex: safeIdx,
        targetShapeIndex: safeIdx,
        previousShapeIndex: safePrev,
        morphTriggerId: triggerCounterRef.current,
        isMorphing: safeIdx !== safePrev,
        timestamp: Date.now(),
      };

      // Broadcast to ParticleBackground
      if (typeof window !== 'undefined') {
        const event = new CustomEvent<ParticleTargetState>('pulse:particle-target-update', {
          detail: targetState,
        });
        window.dispatchEvent(event);
      }

      if (onTargetStateChange) {
        onTargetStateChange(targetState);
      }
    },
    [onTargetStateChange]
  );

  useEffect(() => {
    dispatchTargetState(currentIndex, previousIndexRef.current);
  }, [currentIndex, dispatchTargetState]);

  return (
    <div
      data-testid="service-particle-controller"
      data-active-index={currentIndex}
      data-trigger-id={triggerCounterRef.current}
      className={`service-particle-controller hidden pointer-events-none select-none ${className}`}
      aria-hidden="true"
    />
  );
};
