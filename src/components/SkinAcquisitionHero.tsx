import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float, Stars, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';
import confetti from 'canvas-confetti';

interface SkinAcquisitionHeroProps {
  isOpen: boolean;
  onClose: () => void;
  skinId: string;
}

export function SkinAcquisitionHero({ isOpen, onClose, skinId }: SkinAcquisitionHeroProps) {
  const [showShout, setShowShout] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      // Step 1: Start transformation progress
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 1) {
            clearInterval(timer);
            setShowShout(true);
            triggerConfetti();
            return 1;
          }
          return prev + 0.01;
        });
      }, 20); // ~50fps for smooth progress

      return () => clearInterval(timer);
    } else {
      setProgress(0);
      setShowShout(false);
    }
  }, [isOpen]);

  const triggerConfetti = () => {
    const end = Date.now() + (3 * 1000);
    const colors = ['#3498db', '#ffffff', '#2c3e50'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] bg-slate-950/95 backdrop-blur-2xl flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Animated Background Rays */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-[100%] bg-[conic-gradient(from_0deg,#3498db_0%,transparent_10%,#ffffff_20%,transparent_30%,#3498db_40%,transparent_50%,#ffffff_60%,transparent_70%,#3498db_80%,transparent_90%)] opacity-20"
          />
        </div>

        {/* 3D Character Preview */}
        <div className="w-full h-[60vh] relative z-20">
          <Canvas gl={{ antialias: true }} dpr={[1, 2]}>
            <PerspectiveCamera makeDefault position={[0, 1, 5]} />
            <ambientLight intensity={0.8} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
            <Environment preset="city" />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
              <group position={[0, -0.5, 0]}>
                <HeroCharacter progress={progress} />
              </group>
            </Float>
            
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={4} />
          </Canvas>
        </div>

        {/* UI Overlay */}
        <motion.div 
          className="relative z-30 text-center mt-8 px-4 w-full"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <AnimatePresence>
            {showShout && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 5, stiffness: 200 }}
                className="mb-8"
              >
                <h1 className="text-5xl md:text-8xl font-black text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] uppercase italic tracking-tighter" style={{ WebkitTextStroke: '2px #3498db' }}>
                   UNITED STATES OF ISRAEL
                </h1>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] mb-12 text-sm">
            {progress < 1 ? 'Sincronizzazione Skin...' : 'Nuova Skin Leggendaria Sbloccata'}
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="bg-white text-slate-900 px-12 py-5 rounded-2xl font-black text-xl uppercase tracking-widest shadow-[0_10px_20px_rgba(255,255,255,0.1)] hover:bg-[#3498db] hover:text-white transition-colors border-b-8 border-slate-200 active:border-b-0"
          >
            Continua
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function HeroCharacter({ progress }: { progress: number }) {
  const meshRef = React.useRef<THREE.Group>(null);
  
  // Create textures if needed, or just colors for mock
  // In a real app, load the flag texture
  const texture = React.useMemo(() => {
    const loader = new THREE.TextureLoader();
    return loader.load(import.meta.env.BASE_URL + 'skins/israel_skin.png');
  }, []);

  return (
    <group ref={meshRef}>
      {/* Head */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color={progress > 0.5 ? '#ffffff' : '#FFD1A4'} />
      </mesh>
      
      {/* Torso - This is where the flag goes */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[1, 1, 0.52]} />
        <meshStandardMaterial 
          map={progress > 0.8 ? texture : null} 
          color={progress > 0.8 ? '#ffffff' : THREE.MathUtils.lerp(0x3498db, 0xffffff, Math.min(1, progress * 1.2))}
        />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.7, 0.6, 0]}>
        <boxGeometry args={[0.35, 1, 0.35]} />
        <meshStandardMaterial color={progress > 0.6 ? '#3498db' : '#FFD1A4'} />
      </mesh>
      <mesh position={[0.7, 0.6, 0]}>
        <boxGeometry args={[0.35, 1, 0.35]} />
        <meshStandardMaterial color={progress > 0.6 ? '#3498db' : '#FFD1A4'} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.25, -0.3, 0]}>
        <boxGeometry args={[0.4, 0.8, 0.4]} />
        <meshStandardMaterial color={progress > 0.4 ? '#ffffff' : '#2c3e50'} />
      </mesh>
      <mesh position={[0.25, -0.3, 0]}>
        <boxGeometry args={[0.4, 0.8, 0.4]} />
        <meshStandardMaterial color={progress > 0.4 ? '#ffffff' : '#2c3e50'} />
      </mesh>
    </group>
  );
}
