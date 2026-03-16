import React, { useRef, useContext } from "react";
import { motion, useScroll, useTransform, useSpring, useVelocity, useAnimationFrame, useMotionValue } from "motion/react";
import { ScrollContext } from "../App";

// Utility for wrapping numbers
const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

interface ParallaxHeaderProps {
  children: string;
  baseVelocity?: number;
}

export function ParallaxHeader({ children, baseVelocity = -1.5 }: ParallaxHeaderProps) {
  const baseX = useMotionValue(0);
  const mainScrollContainer = useContext(ScrollContext);
  const { scrollY } = useScroll({ container: mainScrollContainer || undefined });
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
    <div className="w-full overflow-hidden whitespace-nowrap flex flex-nowrap relative py-4 md:py-6 pointer-events-none z-0">
      {/* Subtle animated blur glow behind the text to boost the wow effect */}
      <motion.div 
        className="absolute top-1/2 left-0 right-0 h-1/2 bg-gradient-to-r from-zinc-500/0 via-zinc-200/50 to-zinc-500/0 -translate-y-1/2 blur-2xl pointer-events-none z-[-1]"
        animate={{ opacity: [0.3, 0.6, 0.3], scaleY: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div className="flex whitespace-nowrap gap-[clamp(1rem,2vw,3rem)] flex-nowrap" style={{ x }}>
        {[...Array(8)].map((_, i) => (
          <span 
            key={i} 
            className="block text-[clamp(2.5rem,8vw,5rem)] xl:text-[clamp(5rem,7vw,10rem)] font-bold uppercase leading-[0.9] tracking-tight text-white drop-shadow-md mix-blend-difference"
            style={{ WebkitTextStroke: "0.5px rgba(0,0,0,0.1)" }}
          >
            {children} •{" "}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
