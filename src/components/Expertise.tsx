import { motion, useScroll, useTransform, useSpring, useMotionValue, useVelocity, useAnimationFrame } from "motion/react";
import { useRef } from "react";

// Utility for wrapping numbers
const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

const PremiumWebsiteAnimation = () => (
  <div className="w-full h-48 bg-white rounded-xl border border-zinc-200 overflow-hidden relative shadow-sm group-hover:shadow-md transition-shadow duration-500">
    {/* Browser UI */}
    <div className="h-6 bg-zinc-50 border-b border-zinc-100 flex items-center px-3 gap-1.5 z-20 relative">
      <div className="w-2 h-2 rounded-full bg-zinc-300" />
      <div className="w-2 h-2 rounded-full bg-zinc-300" />
      <div className="w-16 h-3 bg-zinc-200 rounded-full ml-2 opacity-50" />
    </div>

    {/* Scrolling Website Content */}
    <div className="relative w-full h-full overflow-hidden bg-zinc-50">
      <motion.div
        className="w-full"
        animate={{ y: [-20, -120] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }}
      >
        {/* Hero Section */}
        <div className="h-32 w-full bg-white flex flex-col items-center justify-center gap-2 p-4 border-b border-zinc-100">
          <motion.div
            className="w-16 h-16 rounded-full bg-zinc-100 mb-2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.div
            className="w-3/4 h-4 bg-zinc-900 rounded-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
          <motion.div
            className="w-1/2 h-2 bg-zinc-300 rounded-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          />
          <motion.div
            className="mt-2 w-20 h-6 bg-black rounded-full"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          />
        </div>

        {/* Grid Section */}
        <div className="p-4 grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="h-24 bg-white rounded-lg border border-zinc-100 p-2 flex flex-col gap-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="w-full h-12 bg-zinc-100 rounded-md" />
              <div className="w-3/4 h-2 bg-zinc-200 rounded-sm" />
              <div className="w-1/2 h-2 bg-zinc-100 rounded-sm" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </div>
);

const WebAppAnimation = () => (
  <div className="w-full h-48 bg-white rounded-xl border border-zinc-200 overflow-hidden relative shadow-sm group-hover:shadow-md transition-shadow duration-500">
    {/* Browser UI */}
    <div className="h-6 bg-zinc-50 border-b border-zinc-100 flex items-center px-3 gap-1.5">
      <div className="w-2 h-2 rounded-full bg-zinc-300" />
      <div className="w-2 h-2 rounded-full bg-zinc-300" />
      <div className="w-16 h-3 bg-zinc-200 rounded-full ml-2 opacity-50" />
    </div>

    {/* Content */}
    <div className="p-4 flex gap-4 h-full">
      {/* Sidebar */}
      <motion.div
        className="w-12 h-32 bg-zinc-50 rounded-lg flex flex-col gap-2 p-2"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {[1, 2, 3].map(i => (
          <motion.div
            key={i}
            className="w-full h-2 bg-zinc-200 rounded-sm"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </motion.div>

      {/* Main Dashboard */}
      <div className="flex-1 flex flex-col gap-3">
        {/* Header */}
        <motion.div
          className="w-full h-8 bg-zinc-50 rounded-lg flex items-center px-3"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="w-1/3 h-3 bg-zinc-200 rounded-sm" />
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            className="h-20 bg-zinc-900 rounded-lg p-2 relative overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Graph Line */}
            <svg className="absolute bottom-0 left-0 w-full h-full" preserveAspectRatio="none">
              <motion.path
                d="M0 80 C 20 60, 40 20, 60 40 S 100 10, 140 30"
                fill="none"
                stroke="white"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </svg>
          </motion.div>
          <motion.div
            className="h-20 bg-zinc-100 rounded-lg p-2 flex flex-col justify-between"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="w-8 h-8 rounded-full border-2 border-zinc-300 border-t-zinc-900 animate-spin" />
            <div className="w-1/2 h-2 bg-zinc-300 rounded-sm" />
          </motion.div>
        </div>
      </div>
    </div>

    {/* Cursor Overlay */}
    <motion.div
      className="absolute top-0 left-0 pointer-events-none"
      animate={{
        x: [100, 160, 140, 60, 100],
        y: [100, 120, 60, 80, 100]
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19169L11.7841 12.3673H5.65376Z" fill="black" stroke="white" />
      </svg>
    </motion.div>
  </div>
);

const EcommerceAnimation = () => (
  <div className="w-full h-48 bg-white rounded-xl border border-zinc-200 overflow-hidden relative shadow-sm group-hover:shadow-md transition-shadow duration-500 flex items-center justify-center">
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Conveyor Belt */}
      <div className="absolute bottom-8 left-0 right-0 h-1 bg-zinc-200">
        <motion.div
          className="w-full h-full bg-zinc-300"
          animate={{ x: ["-100%", "0%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{ background: "repeating-linear-gradient(90deg, transparent, transparent 20px, #e4e4e7 20px, #e4e4e7 40px)" }}
        />
      </div>

      {/* Product Box */}
      <motion.div
        className="w-16 h-16 bg-white border-2 border-zinc-900 rounded-xl z-10 flex items-center justify-center shadow-lg"
        animate={{
          y: [0, -5, 0],
          rotate: [0, 2, -2, 0]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-8 h-8 bg-zinc-100 rounded-md flex items-center justify-center">
          <div className="w-4 h-4 bg-zinc-900 rounded-full" />
        </div>
      </motion.div>

      {/* Floating Elements (Cart, Likes) */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1, 1.1, 0.8],
            x: [0, (i - 1) * 60],
            y: [0, -80]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeOut",
            times: [0, 0.2, 0.8, 1]
          }}
        >
          {i === 0 ? (
            <div className="p-2 bg-black rounded-full text-white text-xs font-bold shadow-lg">SALE</div>
          ) : i === 1 ? (
            <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center border border-zinc-200 shadow-md">🛒</div>
          ) : (
            <div className="w-8 h-8 bg-zinc-100 rounded-full flex items-center justify-center border border-zinc-200 shadow-md">❤️</div>
          )}
        </motion.div>
      ))}
    </div>
  </div>
);

const expertiseAreas = [
  {
    title: "Siti Web Premium",
    description: "Siti vetrina e landing page dal design moderno e minimale. Ottimizzati per prestazioni estreme, SEO e conversioni.",
    animation: PremiumWebsiteAnimation,
  },
  {
    title: "E-commerce ad Alta Conversione",
    description: "Storefront veloci e soluzioni commerce su misura (anche headless) progettate per massimizzare le vendite e l'esperienza utente.",
    animation: EcommerceAnimation,
  },
  {
    title: "Web App & Gestionali",
    description: "Sistemi custom, dashboard interne e single-page applications robuste, costruite con il moderno ecosistema React per automatizzare il tuo business.",
    animation: WebAppAnimation,
  },
];

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

    // Change direction based on scroll velocity (optional, keeping it simple unidirectional for now or bidirectional)
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
        <span className="block text-2xl md:text-4xl font-light uppercase leading-[0.85] tracking-widest text-zinc-100" style={{ WebkitTextStroke: "1px rgba(0,0,0,0.1)" }}>{children} </span>
        <span className="block text-2xl md:text-4xl font-light uppercase leading-[0.85] tracking-widest text-zinc-100" style={{ WebkitTextStroke: "1px rgba(0,0,0,0.1)" }}>{children} </span>
        <span className="block text-2xl md:text-4xl font-light uppercase leading-[0.85] tracking-widest text-zinc-100" style={{ WebkitTextStroke: "1px rgba(0,0,0,0.1)" }}>{children} </span>
        <span className="block text-2xl md:text-4xl font-light uppercase leading-[0.85] tracking-widest text-zinc-100" style={{ WebkitTextStroke: "1px rgba(0,0,0,0.1)" }}>{children} </span>
        <span className="block text-2xl md:text-4xl font-light uppercase leading-[0.85] tracking-widest text-zinc-100" style={{ WebkitTextStroke: "1px rgba(0,0,0,0.1)" }}>{children} </span>
        <span className="block text-2xl md:text-4xl font-light uppercase leading-[0.85] tracking-widest text-zinc-100" style={{ WebkitTextStroke: "1px rgba(0,0,0,0.1)" }}>{children} </span>
        <span className="block text-2xl md:text-4xl font-light uppercase leading-[0.85] tracking-widest text-zinc-100" style={{ WebkitTextStroke: "1px rgba(0,0,0,0.1)" }}>{children} </span>
        <span className="block text-2xl md:text-4xl font-light uppercase leading-[0.85] tracking-widest text-zinc-100" style={{ WebkitTextStroke: "1px rgba(0,0,0,0.1)" }}>{children} </span>
      </motion.div>
    </div>
  );
}

export function Expertise() {
  return (
    <section id="expertise" className="py-0 pb-10 relative overflow-hidden w-full">
      {/* Premium Divider / Parallax Text */}
      <div className="relative py-4 mb-2 w-full pointer-events-none z-0">
        <ParallaxText baseVelocity={-1}>EXPERTISE • </ParallaxText>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 relative z-10 w-full">
        {/* Simulated Mac Window */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden"
        >
          {/* Window Header */}
          <div className="bg-white/60 backdrop-blur-xl border-b border-zinc-200/50 px-4 py-3 flex items-center gap-2 sticky top-0 z-10">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57] border border-[#E0443E]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
              <div className="w-3 h-3 rounded-full bg-[#28C840] border border-[#1AAB29]" />
            </div>
            <div className="ml-4 text-xs font-medium text-zinc-400 font-mono flex-1 text-center pr-12">
              robert_musin_expertise.tsx
            </div>
          </div>

          {/* Window Content */}
          <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 bg-white">
            {expertiseAreas.map((area, i) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group flex flex-col gap-6"
              >
                {/* Animation Container */}
                <div className="w-full aspect-[4/3] flex items-center justify-center">
                  <area.animation />
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="text-2xl font-medium text-zinc-900 tracking-tight">
                    {area.title}
                  </h3>
                  <p className="text-zinc-500 leading-relaxed font-light text-sm md:text-base">
                    {area.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
