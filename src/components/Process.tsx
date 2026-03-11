import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue, useVelocity, useAnimationFrame } from "motion/react";
import React, { useState, useRef, useEffect } from "react";

// Utility for wrapping numbers
const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

function ParallaxText({ children, baseVelocity = 100 }: { children: string; baseVelocity: number }) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden whitespace-nowrap flex flex-nowrap">
      <motion.div className="flex whitespace-nowrap gap-4 flex-nowrap" style={{ x }}>
        {[...Array(8)].map((_, i) => (
          <span key={i} className="block text-4xl md:text-6xl font-bold uppercase leading-[0.85] tracking-tighter text-transparent opacity-20" style={{ WebkitTextStroke: "1px #000" }}>
            {children}{" "}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// --- Visualizations ---

// 1. Interaction: Magnetic/Fluid Cursor Effect
const InteractionGraphic = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Simulate mouse movement for the demo
  useEffect(() => {
    const interval = setInterval(() => {
      const time = Date.now() / 1000;
      setMousePosition({
        x: Math.sin(time) * 100,
        y: Math.cos(time * 1.5) * 80
      });
    }, 16);
    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative flex items-center justify-center bg-zinc-50 overflow-hidden">
      <div className="grid grid-cols-5 gap-4">
        {[...Array(25)].map((_, i) => {
          return (
            <MagneticItem key={i} mouseX={mousePosition.x} mouseY={mousePosition.y} />
          );
        })}
      </div>
      
      {/* Simulated Cursor */}
      <motion.div 
        className="absolute w-6 h-6 border-2 border-black rounded-full pointer-events-none z-20 mix-blend-difference"
        animate={{ x: mousePosition.x, y: mousePosition.y }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
      />
    </div>
  );
};

const MagneticItem: React.FC<{ mouseX: number, mouseY: number }> = ({ mouseX, mouseY }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = 0; // Relative to center of grid
    const centerY = 0;
    
    // Simple distance calculation in this demo context is tricky without absolute coordinates,
    // so we'll just use a randomized offset based on the "global" mouse position passed down
    // combined with the index-based grid position.
    // For a robust demo, we'll just make them react to the global mouseX/Y with a delay/offset.
    
    // Let's simplify: Just animate scale based on proximity to the "simulated" cursor center (0,0)
    // We need to know "where" this item is relative to center.
    // This is hard to do cleanly without layout effects.
    
    // Alternative: Just a nice wave animation.
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={ref}
      className="w-8 h-8 bg-zinc-200 rounded-lg"
      animate={{
        scale: 1,
        x: mouseX * 0.1 * (Math.random() * 0.5 + 0.5),
        y: mouseY * 0.1 * (Math.random() * 0.5 + 0.5),
      }}
      transition={{ type: "spring", damping: 15, stiffness: 150 }}
    />
  );
};

// 2. Architecture: Modular Stacking System
const ArchitectureGraphic = () => {
  return (
    <div className="w-full h-full relative flex items-center justify-center bg-zinc-900 overflow-hidden perspective-1000">
      <div className="relative transform-style-3d rotate-x-60 rotate-z-45">
        {/* Base Layer */}
        <motion.div
          className="w-32 h-32 bg-zinc-800 rounded-xl border border-zinc-700 shadow-2xl absolute"
          style={{ zIndex: 1 }}
          animate={{ y: [0, 20, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Middle Layer */}
        <motion.div
          className="w-32 h-32 bg-zinc-700 rounded-xl border border-zinc-600 shadow-2xl absolute"
          style={{ zIndex: 2 }}
          animate={{ y: [-40, -20, -40], rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        >
          <div className="absolute inset-0 grid grid-cols-2 gap-2 p-2">
            <div className="bg-zinc-600 rounded" />
            <div className="bg-zinc-600 rounded" />
            <div className="bg-zinc-600 rounded" />
            <div className="bg-zinc-600 rounded" />
          </div>
        </motion.div>

        {/* Top Layer (UI) */}
        <motion.div
          className="w-32 h-32 bg-white rounded-xl border border-zinc-200 shadow-xl absolute flex items-center justify-center"
          style={{ zIndex: 3 }}
          animate={{ y: [-80, -60, -80], rotate: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        >
          <div className="w-16 h-16 bg-black rounded-full" />
        </motion.div>
        
        {/* Connecting Lines */}
        <motion.div 
           className="absolute w-1 h-32 bg-gradient-to-b from-white to-transparent left-1/2 top-1/2 -translate-x-1/2"
           animate={{ height: [80, 120, 80], opacity: [0.2, 0.5, 0.2] }}
           transition={{ duration: 4, repeat: Infinity }}
        />
      </div>
    </div>
  );
};

// 3. Performance: Speedometer / FPS
const PerformanceGraphic = () => {
  return (
    <div className="w-full h-full relative flex items-center justify-center bg-white overflow-hidden">
      {/* Background Grid moving fast */}
      <div className="absolute inset-0 grid grid-cols-12 gap-4 opacity-10 transform -skew-x-12 scale-150">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="h-full w-full bg-black"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 0.5, repeat: Infinity, ease: "linear", delay: i * 0.05 }}
          />
        ))}
      </div>

      {/* Central Metric */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative w-40 h-40">
           <svg className="w-full h-full -rotate-90">
             <circle cx="80" cy="80" r="70" stroke="#f4f4f5" strokeWidth="8" fill="none" />
             <motion.circle 
               cx="80" cy="80" r="70" 
               stroke="#000" 
               strokeWidth="8" 
               fill="none" 
               strokeDasharray="440"
               strokeDashoffset="440"
               animate={{ strokeDashoffset: 0 }}
               transition={{ duration: 1.5, ease: "circOut", repeat: Infinity, repeatDelay: 1 }}
             />
           </svg>
           <div className="absolute inset-0 flex items-center justify-center flex-col">
             <motion.span 
               className="text-5xl font-black tracking-tighter"
               animate={{ opacity: [0, 1, 1, 0] }}
               transition={{ duration: 2.5, repeat: Infinity, times: [0, 0.2, 0.8, 1] }}
             >
               100
             </motion.span>
             <span className="text-xs font-mono uppercase tracking-widest mt-1">Score</span>
           </div>
        </div>
        
        <div className="flex gap-4 mt-6">
           {["LCP", "FID", "CLS"].map((metric, i) => (
             <motion.div
               key={metric}
               className="flex items-center gap-2 bg-zinc-100 px-3 py-1.5 rounded-full border border-zinc-200"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
             >
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-bold">{metric}</span>
             </motion.div>
           ))}
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

const features = [
  {
    id: "interaction",
    title: "Interaction",
    subtitle: "Fluid Motion",
    description: "Micro-interazioni curate e animazioni fisiche che rendono l'interfaccia viva e reattiva.",
    graphic: InteractionGraphic,
  },
  {
    id: "architecture",
    title: "Architecture",
    subtitle: "Scalable Systems",
    description: "Architetture modulari e robuste, progettate per crescere senza debito tecnico.",
    graphic: ArchitectureGraphic,
  },
  {
    id: "performance",
    title: "Performance",
    subtitle: "Lightning Fast",
    description: "Ottimizzazione ossessiva dei Core Web Vitals per esperienze istantanee.",
    graphic: PerformanceGraphic,
  },
];

export function Process() {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <section id="craft" className="pt-0 pb-0 bg-white overflow-hidden relative">
      {/* Parallax Text Header */}
      <div className="relative py-8">
        <ParallaxText baseVelocity={-1}>THE CRAFT • </ParallaxText>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center md:text-left"
        >
          <p className="text-zinc-500 text-lg max-w-2xl font-light">
            Non scrivo solo codice. Costruisco esperienze digitali dove ingegneria e design si fondono.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Left Column: Navigation */}
          <div className="lg:col-span-4 flex flex-col gap-2">
            {features.map((feature, index) => (
              <motion.button
                key={feature.id}
                onClick={() => setActiveFeature(index)}
                className="group relative pl-6 py-4 text-left transition-all duration-300"
              >
                {/* Active Indicator Line */}
                <div className={`absolute left-0 top-0 bottom-0 w-0.5 transition-colors duration-300 ${
                  activeFeature === index ? "bg-black" : "bg-zinc-200 group-hover:bg-zinc-300"
                }`} />

                <h3 className={`text-3xl md:text-4xl font-bold tracking-tight transition-colors duration-300 ${
                  activeFeature === index ? "text-black" : "text-zinc-300 group-hover:text-zinc-400"
                }`}>
                  {feature.title}
                </h3>
                
                <AnimatePresence>
                  {activeFeature === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-zinc-500 text-sm leading-relaxed font-light">
                        {feature.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>

          {/* Right Column: Visual Showcase */}
          <div className="lg:col-span-8">
            <motion.div
              className="relative aspect-square md:aspect-[16/9] bg-zinc-50 rounded-3xl border border-zinc-200 overflow-hidden shadow-sm"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {/* Window Controls (Minimal) */}
              <div className="absolute top-6 left-6 z-20 flex gap-2">
                 <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                   {features[activeFeature].subtitle}
                 </div>
              </div>

              {/* Content Area */}
              <div className="absolute inset-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFeature}
                    className="w-full h-full"
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(10px)" }}
                    transition={{ duration: 0.4 }}
                  >
                    {features[activeFeature].graphic()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
