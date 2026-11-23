import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeDalaMorphCanvasProps {
  progress: number; // Continuous scroll progress from 0.0 to 7.0
  activeIndex: number; // Integer index 0 to 7
  className?: string;
  isAr?: boolean;
}

const PARTICLE_COUNT = 4200;

// Precompute 3D coordinate target vectors for the 8 shapes
function generateShapePositions(shapeIndex: number, count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  const R = 2.4; // Base scale radius in Three.js world coordinates

  for (let i = 0; i < count; i++) {
    let x = 0, y = 0, z = 0;
    const u = Math.random();
    const v = Math.random();
    const idx = i * 3;

    switch (shapeIndex) {
      // 0. Branding & Identity: 3D Faceted Diamond Star & Distributed Brain
      case 0: {
        if (u < 0.45) {
          // Double cone / diamond octahedron facets
          const theta = Math.random() * Math.PI * 2;
          const h = (Math.random() - 0.5) * 2; // -1 to 1
          const r = (1 - Math.abs(h)) * R * 0.95;
          x = Math.cos(theta) * r;
          y = h * R * 1.1;
          z = Math.sin(theta) * r;
        } else if (u < 0.8) {
          // 4-Pointed radiant astroid star arms
          const arm = Math.floor(Math.random() * 4);
          const t = Math.random();
          const angle = (arm * Math.PI) / 2;
          const armLen = R * (0.4 + 0.8 * Math.pow(t, 0.7));
          const spread = (1 - t) * 0.35;
          x = Math.cos(angle) * armLen + (Math.random() - 0.5) * spread;
          y = Math.sin(angle) * armLen + (Math.random() - 0.5) * spread;
          z = (Math.random() - 0.5) * spread * 1.2;
        } else {
          // Inner glowing neural cluster
          const r = Math.random() * R * 0.4;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          x = r * Math.sin(phi) * Math.cos(theta);
          y = r * Math.sin(phi) * Math.sin(theta);
          z = r * Math.cos(phi);
        }
        break;
      }

      // 1. Digital Strategy: 3D Compass & Radar Gimbal
      case 1: {
        if (u < 0.4) {
          // Outer circular gimbal ring
          const theta = Math.random() * Math.PI * 2;
          const r = R * 0.95 + (Math.random() - 0.5) * 0.08;
          x = Math.cos(theta) * r;
          y = Math.sin(theta) * r;
          z = (Math.random() - 0.5) * 0.15;
        } else if (u < 0.72) {
          // 3D North-South & East-West directional needles
          const isNorthSouth = Math.random() > 0.4;
          const t = (Math.random() - 0.5) * 2; // -1 to 1
          const needleLen = R * 0.9;
          const taper = (1 - Math.abs(t)) * 0.35;
          if (isNorthSouth) {
            x = (Math.random() - 0.5) * taper;
            y = t * needleLen;
            z = (Math.random() - 0.5) * taper * 0.8;
          } else {
            x = t * needleLen * 0.7;
            y = (Math.random() - 0.5) * taper * 0.7;
            z = (Math.random() - 0.5) * taper * 0.7;
          }
        } else if (u < 0.9) {
          // Inner concentric radar ring
          const theta = Math.random() * Math.PI * 2;
          const r = R * 0.42;
          x = Math.cos(theta) * r;
          y = Math.sin(theta) * r;
          z = (Math.random() - 0.5) * 0.1;
        } else {
          // 4 Cardinal markers extending outwards
          const cardinal = Math.floor(Math.random() * 4);
          const angle = (cardinal * Math.PI) / 2;
          const r = R * 0.95 + Math.random() * 0.35;
          x = Math.cos(angle) * r;
          y = Math.sin(angle) * r;
          z = (Math.random() - 0.5) * 0.15;
        }
        break;
      }

      // 2. Web & E-Commerce: 3D Isometric Browser & Storefront Grid
      case 2: {
        const halfW = R * 0.95;
        const halfH = R * 0.7;
        const depth = 0.35;
        if (u < 0.45) {
          // 3D Browser window frame
          const p = Math.random() * (halfW * 4 + halfH * 4);
          let bx = 0, by = 0;
          if (p < halfW * 2) {
            bx = -halfW + p;
            by = -halfH;
          } else if (p < halfW * 2 + halfH * 2) {
            bx = halfW;
            by = -halfH + (p - halfW * 2);
          } else if (p < halfW * 4 + halfH * 2) {
            bx = halfW - (p - (halfW * 2 + halfH * 2));
            by = halfH;
          } else {
            bx = -halfW;
            by = halfH - (p - (halfW * 4 + halfH * 2));
          }
          x = bx;
          y = by;
          z = (Math.random() - 0.5) * depth;
        } else if (u < 0.6) {
          // Top window header line & window control dots
          const t = Math.random();
          x = -halfW + t * halfW * 2;
          y = -halfH + 0.32;
          z = (Math.random() - 0.5) * depth * 0.8;
        } else if (u < 0.8) {
          // Left Storefront Product Card (isometric extruded)
          x = -halfW * 0.48 + (Math.random() - 0.5) * 0.65;
          y = 0.15 + (Math.random() - 0.5) * 0.65;
          z = 0.25 + (Math.random() - 0.5) * 0.2;
        } else {
          // Right Checkout Cart / Storefront Button
          x = halfW * 0.48 + (Math.random() - 0.5) * 0.65;
          y = 0.15 + (Math.random() - 0.5) * 0.65;
          z = 0.25 + (Math.random() - 0.5) * 0.2;
        }
        break;
      }

      // 3. Paid Media & Ads: 3D Targeted Bullseye & Crosshair System
      case 3: {
        if (u < 0.35) {
          // Outer target ring
          const theta = Math.random() * Math.PI * 2;
          const r = R * 0.95;
          x = Math.cos(theta) * r;
          y = Math.sin(theta) * r;
          z = (Math.random() - 0.5) * 0.2;
        } else if (u < 0.62) {
          // Middle target ring
          const theta = Math.random() * Math.PI * 2;
          const r = R * 0.6;
          x = Math.cos(theta) * r;
          y = Math.sin(theta) * r;
          z = (Math.random() - 0.5) * 0.15;
        } else if (u < 0.82) {
          // Inner bullseye ring
          const theta = Math.random() * Math.PI * 2;
          const r = R * 0.28;
          x = Math.cos(theta) * r;
          y = Math.sin(theta) * r;
          z = (Math.random() - 0.5) * 0.12;
        } else if (u < 0.92) {
          // Center concentrated laser target dot
          const r = Math.random() * 0.12;
          const theta = Math.random() * Math.PI * 2;
          x = Math.cos(theta) * r;
          y = Math.sin(theta) * r;
          z = (Math.random() - 0.5) * 0.2;
        } else {
          // 3D Crosshairs extending along X and Y
          const isHoriz = Math.random() > 0.5;
          const t = (Math.random() - 0.5) * R * 2.2;
          if (isHoriz) {
            x = t;
            y = (Math.random() - 0.5) * 0.04;
            z = (Math.random() - 0.5) * 0.1;
          } else {
            x = (Math.random() - 0.5) * 0.04;
            y = t;
            z = (Math.random() - 0.5) * 0.1;
          }
        }
        break;
      }

      // 4. Creative Content: 3D Feather Quill & Flowing Ink Ribbon
      case 4: {
        if (u < 0.35) {
          // Curving quill spine
          const t = (Math.random() - 0.5) * 2; // -1 to 1
          x = Math.sin(t * 1.5) * 0.45;
          y = -t * R * 0.95;
          z = t * 0.35;
        } else if (u < 0.75) {
          // Radiating feather vanes
          const t = Math.random() * 1.6 - 0.8;
          const spineX = Math.sin(t * 1.5) * 0.45;
          const spineY = -t * R * 0.95;
          const side = Math.random() > 0.5 ? 1 : -1;
          const len = (1 - Math.abs(t)) * R * 0.65 * Math.random();
          const angle = (side * Math.PI) / 3.4;
          x = spineX + Math.cos(angle) * len;
          y = spineY + Math.sin(angle) * len * 0.4;
          z = (Math.random() - 0.5) * 0.25;
        } else {
          // 3D Flowing ink wave ribbon at bottom
          const t = Math.random() * 2 - 1;
          x = t * R * 0.85;
          y = -R * 0.85 + Math.sin(t * 5) * 0.22;
          z = Math.cos(t * 4) * 0.35;
        }
        break;
      }

      // 5. Visual Production & Studio: 3D Cinema Camera & Saturated Play Triangle
      case 5: {
        const camW = R * 0.7;
        const camH = R * 0.5;
        if (u < 0.35) {
          // Main camera body box
          x = (Math.random() - 0.5) * camW * 1.8 - 0.15;
          y = (Math.random() - 0.5) * camH * 1.8;
          z = (Math.random() - 0.5) * 0.6;
        } else if (u < 0.6) {
          // Prominent 3D Equilateral Play Triangle inside
          const r1 = Math.random();
          const r2 = Math.random();
          const s1 = Math.sqrt(r1);
          const v1 = { x: -0.35, y: -0.45 };
          const v2 = { x: 0.48, y: 0.0 };
          const v3 = { x: -0.35, y: 0.45 };
          x = (1 - s1) * v1.x + s1 * (1 - r2) * v2.x + s1 * r2 * v3.x - 0.08;
          y = (1 - s1) * v1.y + s1 * (1 - r2) * v2.y + s1 * r2 * v3.y;
          z = 0.35 + (Math.random() - 0.5) * 0.15;
        } else if (u < 0.8) {
          // Cinema lens cone projecting forward
          const t = Math.random();
          const coneR = 0.15 + t * 0.35;
          const theta = Math.random() * Math.PI * 2;
          x = camW * 0.9 + t * 0.55;
          y = Math.sin(theta) * coneR;
          z = Math.cos(theta) * coneR;
        } else {
          // Dual top film reels
          const isLeft = Math.random() > 0.5;
          const theta = Math.random() * Math.PI * 2;
          const r = Math.random() * 0.28;
          const reelX = isLeft ? -camW * 0.5 : camW * 0.3;
          x = reelX + Math.cos(theta) * r;
          y = camH * 0.95 + Math.sin(theta) * r;
          z = (Math.random() - 0.5) * 0.2;
        }
        break;
      }

      // 6. AI Solutions: 3D Neural Microchip Processor & Synaptic Nodes
      case 6: {
        const chipSize = R * 0.65;
        if (u < 0.35) {
          // Square processor boundary
          const side = Math.floor(Math.random() * 4);
          const t = (Math.random() - 0.5) * 2;
          if (side === 0) { x = t * chipSize; y = -chipSize; }
          else if (side === 1) { x = chipSize; y = t * chipSize; }
          else if (side === 2) { x = t * chipSize; y = chipSize; }
          else { x = -chipSize; y = t * chipSize; }
          z = (Math.random() - 0.5) * 0.18;
        } else if (u < 0.68) {
          // Radiating bus pins on 4 sides
          const pinSide = Math.floor(Math.random() * 4);
          const pinIdx = Math.floor(Math.random() * 5) - 2;
          const pinOffset = pinIdx * (chipSize * 0.36);
          const pinLen = chipSize + Math.random() * 0.5;
          if (pinSide === 0) { x = pinOffset; y = -pinLen; }
          else if (pinSide === 1) { x = pinLen; y = pinOffset; }
          else if (pinSide === 2) { x = pinOffset; y = pinLen; }
          else { x = -pinLen; y = pinOffset; }
          z = (Math.random() - 0.5) * 0.15;
        } else {
          // Internal synaptic neural net nodes
          const gx = Math.floor(Math.random() * 4) - 1.5;
          const gy = Math.floor(Math.random() * 4) - 1.5;
          x = gx * (chipSize * 0.45) + (Math.random() - 0.5) * 0.12;
          y = gy * (chipSize * 0.45) + (Math.random() - 0.5) * 0.12;
          z = 0.2 + (Math.random() - 0.5) * 0.15;
        }
        break;
      }

      // 7. Growth & SEO: 3D Exponential Surge Curve & Soaring Arrow
      case 7:
      default: {
        if (u < 0.2) {
          // 3D Coordinate grid axes
          const isY = Math.random() > 0.5;
          const t = Math.random();
          if (isY) {
            x = -R * 0.8;
            y = -R * 0.8 + t * R * 1.6;
            z = 0;
          } else {
            x = -R * 0.8 + t * R * 1.6;
            y = -R * 0.8;
            z = 0;
          }
        } else if (u < 0.65) {
          // 3D Hockey-stick exponential curve
          const t = Math.random();
          const px = -R * 0.75 + t * R * 1.55;
          const normalizedY = Math.pow(t, 2.3);
          const py = -R * 0.75 + normalizedY * R * 1.55;
          x = px + (Math.random() - 0.5) * 0.08;
          y = py + (Math.random() - 0.5) * 0.08;
          z = (Math.random() - 0.5) * 0.25;
        } else if (u < 0.85) {
          // Ascending bar chart pillars
          const barIdx = Math.floor(Math.random() * 4);
          const barHeights = [0.4, 0.75, 1.15, 1.65];
          const bH = barHeights[barIdx];
          const bX = -R * 0.55 + barIdx * 0.42;
          x = bX + (Math.random() - 0.5) * 0.16;
          y = -R * 0.8 + Math.random() * bH;
          z = (Math.random() - 0.5) * 0.18;
        } else {
          // 3D Arrowhead soaring at top right
          const tipX = R * 0.82;
          const tipY = R * 0.82;
          const angle = Math.random() > 0.5 ? Math.PI * 0.78 : Math.PI * 0.42;
          const len = Math.random() * 0.38;
          x = tipX + Math.cos(angle) * len;
          y = tipY + Math.sin(angle) * len;
          z = (Math.random() - 0.5) * 0.15;
        }
        break;
      }
    }

    positions[idx] = x;
    positions[idx + 1] = y;
    positions[idx + 2] = z;
  }

  return positions;
}

export const ThreeDalaMorphCanvas: React.FC<ThreeDalaMorphCanvasProps> = ({
  progress,
  activeIndex,
  className = '',
  isAr = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hudStatusRef = useRef<HTMLSpanElement>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animFrameRef = useRef<number | null>(null);

  // Smooth lerped progress ref for buttery continuous motion
  const currentProgressRef = useRef<number>(progress);
  const targetProgressRef = useRef<number>(progress);

  useEffect(() => {
    targetProgressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // 1. Setup Three.js Scene, Camera, and Renderer
    const scene = new THREE.Scene();
    scene.background = null; // Transparent on pure black void

    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.2);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Precompute the 8 shape position buffers
    const shapePositions: Float32Array[] = [];
    for (let s = 0; s < 8; s++) {
      shapePositions.push(generateShapePositions(s, PARTICLE_COUNT));
    }

    // 3. Precompute chaotic scatter dispersal vectors for the dissolution phase
    const scatterVectors = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const idx = i * 3;
      // Disperse radially with chaotic curl turbulence
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = 2.4 + Math.random() * 3.2;
      scatterVectors[idx] = Math.sin(phi) * Math.cos(theta) * speed;
      scatterVectors[idx + 1] = Math.sin(phi) * Math.sin(theta) * speed;
      scatterVectors[idx + 2] = Math.cos(phi) * speed;
    }

    // 4. Create InstancedMesh of 3D triangular pyramids (Tetrahedrons)
    // This strictly fulfills the Dala specification:
    // "composed of thousands of colored particle-pyramids... microscopic triangles"
    const pyramidGeo = new THREE.ConeGeometry(0.042, 0.075, 3);
    pyramidGeo.computeVertexNormals();

    const pyramidMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: false,
      transparent: true,
      opacity: 0.92,
    });

    const instancedMesh = new THREE.InstancedMesh(pyramidGeo, pyramidMat, PARTICLE_COUNT);
    instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    // Set particle colors matching Dala / Pulse Octo tokens:
    // Electric Iris (#8052ff), Saffron Spark (#ffb829), Deep Verdant (#15846e), Pulse Cyan (#06b6d4), Bone White (#ffffff)
    const brandColors = [
      new THREE.Color('#8052ff'), // Electric Iris (Dominant)
      new THREE.Color('#8052ff'),
      new THREE.Color('#ffb829'), // Saffron Spark
      new THREE.Color('#15846e'), // Deep Verdant
      new THREE.Color('#06b6d4'), // Pulse Cyan
      new THREE.Color('#ffffff'), // Bone White
      new THREE.Color('#c084fc'), // Bright Lilac
    ];

    const particleBaseColors: THREE.Color[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const col = brandColors[i % brandColors.length];
      instancedMesh.setColorAt(i, col);
      particleBaseColors.push(col.clone());
    }
    if (instancedMesh.instanceColor) {
      instancedMesh.instanceColor.needsUpdate = true;
    }

    scene.add(instancedMesh);

    // Ambient subtle point lights
    const pLight1 = new THREE.PointLight(0x8052ff, 1.8, 15);
    pLight1.position.set(2, 3, 4);
    scene.add(pLight1);

    const pLight2 = new THREE.PointLight(0x06b6d4, 1.2, 15);
    pLight2.position.set(-3, -2, 3);
    scene.add(pLight2);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 400;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    // Mouse Move Parallax
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseRef.current = { x, y };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Reusable dummy object and matrices
    const dummy = new THREE.Object3D();
    const currentPos = new Float32Array(PARTICLE_COUNT * 3);

    // Initialize current positions with shape 0
    currentPos.set(shapePositions[0]);

    // 5. High-Performance Render Loop
    let lastTime = performance.now();

    const animate = (time: number) => {
      animFrameRef.current = requestAnimationFrame(animate);

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Smooth lerping of progress to target (creates buttery inertia during scroll)
      const diff = targetProgressRef.current - currentProgressRef.current;
      currentProgressRef.current += diff * 0.12;

      const p = Math.max(0, Math.min(6.999, currentProgressRef.current));
      const stepA = Math.floor(p);
      const stepB = Math.min(stepA + 1, 7);
      const fraction = p - stepA; // 0.0 to 1.0

      // DISSOLVE & REASSEMBLE CURVE:
      // When scrolling between step A and step B:
      // fraction 0.0 -> 0.2: Solid shape A
      // fraction 0.2 -> 0.5: Disintegrate & Dissolve outward into chaotic velvet cloud (peak explosion at 0.5)
      // fraction 0.5 -> 0.8: Re-converge and gravitate inward toward shape B
      // fraction 0.8 -> 1.0: Lock into solid shape B!
      let dissolveFactor = 0;
      if (fraction < 0.5) {
        // Ramps up from 0 to 1 as fraction moves from 0.15 to 0.5
        dissolveFactor = Math.sin(fraction * Math.PI); // Peaks at 0.5
      } else {
        dissolveFactor = Math.sin(fraction * Math.PI); // Smoothly descends from 1 to 0
      }

      const posA = shapePositions[stepA];
      const posB = shapePositions[stepB];

      // Update real-time HUD telemetry text without React re-render lag
      if (hudStatusRef.current) {
        if (dissolveFactor > 0.22) {
          hudStatusRef.current.innerText = isAr
            ? `تفكك الجزيئات... انتقال إلى 0${stepB + 1}`
            : `DISSOLVING INTO VOID... MORPHING TO 0${stepB + 1}`;
          hudStatusRef.current.style.color = '#ffb829';
        } else {
          const displayIdx = fraction < 0.5 ? stepA : stepB;
          hudStatusRef.current.innerText = isAr
            ? `ترابط الأيقونة 0${displayIdx + 1} مكتمل`
            : `SHAPE 0${displayIdx + 1} ASSEMBLED`;
          hudStatusRef.current.style.color = '#06b6d4';
        }
      }

      // Subtle 3D camera parallax from mouse
      camera.position.x += (mouseRef.current.x * 0.45 - camera.position.x) * 0.05;
      camera.position.y += (mouseRef.current.y * 0.45 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // Global subtle rotation of the particle system
      instancedMesh.rotation.y = time * 0.0003 + p * 0.25;
      instancedMesh.rotation.x = Math.sin(time * 0.0002) * 0.12;

      // Update positions and matrices for each pyramid
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const idx = i * 3;

        // Base linear blend between Shape A and Shape B
        const ax = posA[idx];
        const ay = posA[idx + 1];
        const az = posA[idx + 2];

        const bx = posB[idx];
        const by = posB[idx + 1];
        const bz = posB[idx + 2];

        // Smooth cubic blend
        const blend = fraction * fraction * (3 - 2 * fraction);
        const baseX = ax + (bx - ax) * blend;
        const baseY = ay + (by - ay) * blend;
        const baseZ = az + (bz - az) * blend;

        // Dissolution burst vector
        const sx = scatterVectors[idx];
        const sy = scatterVectors[idx + 1];
        const sz = scatterVectors[idx + 2];

        // Apply dissolution dispersion outward into void
        const finalX = baseX + sx * dissolveFactor * 1.35;
        const finalY = baseY + sy * dissolveFactor * 1.35;
        const finalZ = baseZ + sz * dissolveFactor * 1.35;

        dummy.position.set(finalX, finalY, finalZ);

        // Continuous tumbling rotation for each tiny pyramid
        const rotOffset = i * 0.1;
        dummy.rotation.x = time * 0.0015 + rotOffset + dissolveFactor * 4;
        dummy.rotation.y = time * 0.002 + rotOffset + dissolveFactor * 4;
        dummy.rotation.z = time * 0.001 + rotOffset;

        // Microscopic pyramid scaling (scales down slightly during peak dissolution)
        const scale = 1 - dissolveFactor * 0.35;
        dummy.scale.set(scale, scale, scale);

        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);
      }

      instancedMesh.instanceMatrix.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      renderer.dispose();
      pyramidGeo.dispose();
      pyramidMat.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-square max-w-[580px] mx-auto flex items-center justify-center select-none ${className}`}
      style={{ background: 'transparent' }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-crosshair touch-none"
        aria-label="3D Particle Pyramid Morphing Constellation"
      />

      {/* Futuristic Telemetry HUD Indicator */}
      <div className="absolute bottom-3 inset-x-0 flex justify-center pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 border border-white/10 text-[11px] font-mono tracking-wider text-slate-400 backdrop-blur-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8052ff] animate-ping" />
          <span className="text-white/80 font-bold">3D DALA ENGINE</span>
          <span className="text-[#8052ff]">//</span>
          <span ref={hudStatusRef} className="text-[#ffb829]">SHAPE 0{activeIndex + 1} ASSEMBLED</span>
        </div>
      </div>
    </div>
  );
};
