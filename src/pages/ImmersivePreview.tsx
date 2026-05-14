// src/pages/ImmersivePreview.tsx
import React, { Suspense, useRef, useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

// ============================================
// GSAP (FIXED - SINGLE IMPORT ONLY)
// ============================================
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ============================================
// THREE.JS IMPORTS
// ============================================
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { Float, Environment, Stars, OrbitControls } from '@react-three/drei';

// ============================================
// LUCIDE ICONS
// ============================================
import {
  Sparkles, ArrowRight, Zap, Heart, Activity, Shield, Brain,
  TrendingUp, ChevronDown, Play, Pause, Rocket
} from 'lucide-react';

// ============================================
// LOCAL IMPORTS
// ============================================
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

// ============================================
// THREE.JS UTILITIES
// ============================================
import * as THREE from 'three';

// ============================================
// 1️⃣ DNA HELIX SCENE
// ============================================
const DNAHelixScene: React.FC = () => {
  const helixRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (helixRef.current) {
      helixRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  const { spheres, connections } = useMemo(() => {
    const spheresArr: JSX.Element[] = [];
    const connectionsArr: JSX.Element[] = [];

    const radius = 1.5;
    const height = 8;
    const turns = 4;
    const segments = 80;

    for (let i = 0; i < segments; i++) {
      const t = i / segments;
      const angle = t * Math.PI * 2 * turns;
      const y = (t - 0.5) * height;

      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;
      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;

      if (i % 3 === 0) {
        spheresArr.push(
          <mesh key={`a-${i}`} position={[x1, y, z1]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" />
          </mesh>,
          <mesh key={`b-${i}`} position={[x2, y, z2]}>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" />
          </mesh>
        );

        const geo = new THREE.BufferGeometry();
        geo.setAttribute(
          'position',
          new THREE.BufferAttribute(new Float32Array([x1, y, z1, x2, y, z2]), 3)
        );

        // ✅ FIXED LINE (NO SVG ERROR)
        connectionsArr.push(
          <line key={`l-${i}`}>
            <bufferGeometry attach="geometry" {...geo} />
            <lineBasicMaterial color="#ec4899" transparent opacity={0.4} />
          </line>
        );
      }
    }

    return { spheres: spheresArr, connections: connectionsArr };
  }, []);

  return (
    <group ref={helixRef}>
      {spheres}
      {connections}
      <pointLight position={[0, 0, 0]} intensity={1.5} color="#06b6d4" />
    </group>
  );
};

// ============================================
// MAIN COMPONENT (SIMPLIFIED FIXED)
// ============================================
const ImmersivePreview: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const [activeScene, setActiveScene] = useState('hero');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".preview-card", {
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 0.8
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050508]">
      <Navbar />

      {/* HERO */}
      <motion.section style={{ opacity }} className="relative h-screen flex items-center justify-center">
        <Canvas camera={{ position: [0, 0, 8] }}>
          <ambientLight />
          <Suspense fallback={null}>
            <DNAHelixScene />
          </Suspense>
        </Canvas>

        <div className="absolute text-center text-white">
          <h1 className="text-6xl font-bold">3D Web Experience</h1>
        </div>
      </motion.section>

      {/* FEATURE CARDS */}
      <section className="p-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {["DNA", "Heart", "Data"].map((item, i) => (
            <div
              key={i}
              className="preview-card p-6 bg-white/5 rounded-xl cursor-pointer"
              onClick={() => setActiveScene(item.toLowerCase())}
            >
              <h2 className="text-white">{item}</h2>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ImmersivePreview;