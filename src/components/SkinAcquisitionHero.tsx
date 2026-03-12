import React, { useEffect, useState, Suspense, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float, Stars, useGLTF, useTexture } from '@react-three/drei';
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
        className="fixed inset-0 z-[10000] bg-white/95 backdrop-blur-3xl flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Animated Background Rays */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className={`absolute -inset-[100%] opacity-40 ${skinId === 'skin_special_israel' ? 'bg-[conic-gradient(from_0deg,#3498db_0%,transparent_10%,#ffffff_20%,transparent_30%,#3498db_40%,transparent_50%,#ffffff_60%,transparent_70%,#3498db_80%,transparent_90%)]' : 'bg-[conic-gradient(from_0deg,#fbbf24_0%,transparent_10%,#ffffff_20%,transparent_30%,#fbbf24_40%,transparent_50%,#ffffff_60%,transparent_70%,#fbbf24_80%,transparent_90%)]'}`}
          />
        </div>

        {/* 3D Character Preview */}
        <div className="w-full h-[60vh] relative z-20">
          <Canvas gl={{ antialias: true }} dpr={[1, 2]}>
            <PerspectiveCamera makeDefault position={[0, 1, 5]} />
            <ambientLight intensity={1} />
            <pointLight position={[10, 10, 10]} intensity={2} />
            <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={3} />
            <Environment preset="city" />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
              <group position={[0, -0.8, 0]}>
                <Suspense fallback={null}>
                  <HeroCharacter progress={progress} skinId={skinId} />
                </Suspense>
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
                <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter drop-shadow-2xl uppercase" style={{ WebkitTextStroke: skinId === 'skin_special_israel' ? '2px #3498db' : '2px #f59e0b', color: skinId === 'skin_special_israel' ? '#ffffff' : '#1e293b' }}>
                   {skinId === 'skin_special_israel' ? 'UNITED STATES OF ISRAEL' : 'ROB SBAGLIATO!!'}
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
            className="bg-amber-500 text-white px-12 py-5 rounded-2xl font-black text-xl uppercase tracking-widest shadow-xl hover:bg-amber-400 transition-colors border-b-8 border-amber-700 active:border-b-0"
          >
            Continua
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function HeroCharacter({ progress, skinId }: { progress: number, skinId: string }) {
  const { scene } = useGLTF(import.meta.env.BASE_URL + 'asset3d/character1.glb');
  const textures = useTexture({
    default: import.meta.env.BASE_URL + 'texture/zioperanza__DefaultMaterial_BaseColor.png',
    israel: import.meta.env.BASE_URL + 'skins/israel_skin.png',
    robsbagliato: import.meta.env.BASE_URL + 'texture/robsbagliato.png',
  });

  const clone = useMemo(() => {
    if (!scene) return new THREE.Group();
    const c = scene.clone();
    c.traverse((node) => {
      if (node instanceof THREE.Mesh) {
        const mat = new THREE.MeshStandardMaterial();
        node.material = mat;
        
        if (progress > 0.8) {
          if (skinId === 'skin_special_israel') {
             mat.map = textures.israel;
             textures.israel.flipY = false;
          } else if (skinId === 'skin_robsbagliato') {
             mat.map = textures.robsbagliato;
             textures.robsbagliato.flipY = false;
          }
        } else {
             const startColor = new THREE.Color(0x3498db);
             const endColor = new THREE.Color(0xffffff);
             mat.color.copy(startColor).lerp(endColor, progress);
        }
        mat.needsUpdate = true;
      }
    });
    return c;
  }, [scene, textures, skinId, progress]);

  return <primitive object={clone} />;
}
