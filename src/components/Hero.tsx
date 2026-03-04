import { motion } from "motion/react";

const charVariants = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      delay: i * 0.08,
      duration: 1.2,
      ease: [0.2, 0.65, 0.3, 0.9],
    },
  }),
};

export function Hero() {
  const name = "Robert Musin";
  const chars = name.split("");

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 md:px-12 lg:px-24 bg-white text-center relative overflow-hidden">
      {/* ===== Animated Background Elements ===== */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">

        {/* Semicircle arc from top, framing the title */}
        <motion.svg
          className="hero-arc"
          viewBox="0 0 800 420"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 3.6, duration: 1.2, ease: "easeOut" }}
          style={{
            position: 'absolute',
            top: '8%',
            left: 0,
            right: 0,
            margin: '0 auto',
            width: 'min(70vw, 800px)',
            height: 'auto',
          }}
        >
          {/* Main semicircle — true half-circle using arc command */}
          <path
            d="M0,0 A400,400 0 0,0 800,0"
            stroke="rgba(0,0,0,0.08)"
            strokeWidth="1.5"
            fill="none"
          />
          {/* Animated dot traveling clockwise along outer arc */}
          <circle r="6" fill="rgba(0,0,0,0.3)">
            <animateMotion
              dur="10s"
              repeatCount="indefinite"
              path="M0,0 A400,400 0 0,0 800,0"
            />
          </circle>

          {/* Inner semicircle, dashed — rotating counter-clockwise */}
          <g style={{ transformOrigin: '400px 0px' }} className="hero-inner-arc-spin">
            <path
              d="M30,0 A370,370 0 0,0 770,0"
              stroke="rgba(0,0,0,0.12)"
              strokeWidth="1.5"
              strokeDasharray="6 5"
              fill="none"
            />
          </g>

          {/* Dots at key points */}
          <circle cx="0" cy="0" r="4" fill="rgba(0,0,0,0.12)" />
          <circle cx="800" cy="0" r="4" fill="rgba(0,0,0,0.12)" />
          <circle cx="400" cy="400" r="5" fill="rgba(0,0,0,0.15)" />
          <circle cx="200" cy="346" r="3" fill="rgba(0,0,0,0.08)" />
          <circle cx="600" cy="346" r="3" fill="rgba(0,0,0,0.08)" />
        </motion.svg>

        {/* Floating geometric shapes */}
        {/* Small hollow square */}
        <div className="hero-float hero-float-1" style={{ top: '15%', left: '10%' }}>
          <div style={{ width: 24, height: 24, border: '1.5px solid rgba(0,0,0,0.08)', borderRadius: 4 }} />
        </div>
        {/* Small plus/cross */}
        <div className="hero-float hero-float-2" style={{ top: '20%', right: '15%' }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <line x1="10" y1="2" x2="10" y2="18" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" />
            <line x1="2" y1="10" x2="18" y2="10" stroke="rgba(0,0,0,0.1)" strokeWidth="1.5" />
          </svg>
        </div>
        {/* Small triangle */}
        <div className="hero-float hero-float-3" style={{ bottom: '25%', left: '8%' }}>
          <svg width="22" height="20" viewBox="0 0 22 20" fill="none">
            <path d="M11 2L20 18H2L11 2Z" stroke="rgba(0,0,0,0.07)" strokeWidth="1.5" />
          </svg>
        </div>
        {/* Small circle */}
        <div className="hero-float hero-float-4" style={{ bottom: '20%', right: '12%' }}>
          <div style={{ width: 16, height: 16, borderRadius: '50%', border: '1.5px solid rgba(0,0,0,0.08)' }} />
        </div>
        {/* Small diamond */}
        <div className="hero-float hero-float-5" style={{ top: '60%', left: '85%' }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="9" y="1" width="11" height="11" rx="1" stroke="rgba(0,0,0,0.07)" strokeWidth="1.5" transform="rotate(45 9 1)" />
          </svg>
        </div>

        {/* Pulsing accent dots */}
        <div className="hero-pulse-dot" style={{ top: '30%', left: '20%' }} />
        <div className="hero-pulse-dot" style={{ top: '70%', right: '18%', animationDelay: '1.5s' }} />
        <div className="hero-pulse-dot" style={{ top: '45%', right: '25%', animationDelay: '3s' }} />
      </div>

      <div className="max-w-5xl flex flex-col items-center relative z-10">
        <h1 className="text-5xl md:text-7xl lg:text-[6.5rem] font-medium tracking-tighter leading-none text-zinc-900 flex flex-wrap justify-center">
          {chars.map((char, i) => (
            <motion.span
              key={i}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={charVariants}
              className={char === " " ? "w-[0.25em]" : "inline-block"}
            >
              {char}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 2.0, duration: 1, ease: "easeOut" }}
          className="mt-8 text-lg md:text-2xl text-zinc-500 max-w-2xl font-light tracking-wide"
        >
          Creative Technologist & AI Prototyper. <br className="hidden md:block" />
          Sviluppo prodotti digitali che scalano.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8, duration: 0.8, ease: "easeOut" }}
          className="mt-12 flex flex-col sm:flex-row items-center gap-6"
        >
          <a
            href="#contact"
            className="group relative inline-flex items-center justify-center px-8 py-4 bg-black text-white font-medium rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95"
          >
            <span className="relative z-10">Parliamone</span>
            <div className="absolute inset-0 bg-zinc-800 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          </a>
          <a
            href="#works"
            className="text-zinc-950 font-medium hover:text-zinc-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-zinc-950 after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100"
          >
            Esplora i Progetti
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.5, duration: 0.8, ease: "easeOut" }}
        >
          <TechTicker />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.2, duration: 1 }}
          className="mt-16 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-light">scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 6L8 11L13 6" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

const TechTicker = () => {
  const techs = [
    { name: "React", icon: <ReactIcon /> },
    { name: "Next.js", icon: <NextIcon /> },
    { name: "TypeScript", icon: <TSIcon /> },
    { name: "Tailwind", icon: <TailwindIcon /> },
    { name: "Node.js", icon: <NodeIcon /> },
    { name: "Supabase", icon: <SupabaseIcon /> },
    { name: "PostgreSQL", icon: <PostgresIcon /> },
    { name: "Vite", icon: <ViteIcon /> },
    { name: "Claude", icon: <ClaudeIcon /> },
    { name: "Antigravity", icon: <AntigravityIcon /> },
  ];

  // Create 4 copies to ensure seamless loop
  const allTechs = [...techs, ...techs, ...techs, ...techs];

  return (
    <div className="w-screen max-w-[100vw] overflow-hidden mt-32 -ml-[50vw] left-[50%] relative">
      <motion.div
        className="flex gap-16 md:gap-24 w-max pr-16 md:pr-24"
        animate={{ x: ["0%", "-25%"] }}
        transition={{
          duration: 40,
          ease: "linear",
          repeat: Infinity
        }}
        style={{ willChange: "transform" }}
      >
        {allTechs.map((tech, i) => (
          <div
            key={i}
            className="flex items-center gap-3 text-zinc-400 grayscale hover:grayscale-0 hover:text-black transition-all duration-500 cursor-default flex-shrink-0"
          >
            <div className="w-8 h-8 md:w-10 md:h-10">{tech.icon}</div>
            <span className="text-lg md:text-xl font-semibold tracking-tight">{tech.name}</span>
          </div>
        ))}
      </motion.div>

      {/* Gradient Masks for fade effect */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />
    </div>
  );
};

// Icons
const ReactIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <circle cx="12" cy="12" r="2" fill="currentColor" />
    <g stroke="currentColor" strokeWidth="1.5">
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(0 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
    </g>
  </svg>
);

const NextIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 8V16" stroke="currentColor" strokeWidth="1.5" />
    <path d="M16 16V8" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 8L16 16" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const TSIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect x="2" y="2" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6 8H14M10 8V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M14 16C14 16 15 16.5 16 16.5C17 16.5 18 16 18 15C18 14 16.5 13.5 16.5 13.5C16.5 13.5 15 13 15 12C15 11 16 10.5 17 10.5C18 10.5 19 11 19 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const TailwindIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M7 15C4.5 14 3 12.5 3 10C3 7.5 5 6 7.5 6C10 6 11 7.5 11.5 9C12 10.5 11.5 12 14 13C16.5 14 18 12.5 18 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M11 19C8.5 18 7 16.5 7 14C7 11.5 9 10 11.5 10C14 10 15 11.5 15.5 13C16 14.5 15.5 16 18 17C20.5 18 22 16.5 22 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const NodeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M12 2L20.6603 7V17L12 22L3.33975 17V7L12 2Z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 22V12" stroke="currentColor" strokeWidth="1.5" />
    <path d="M20.6603 7L12 12L3.33975 7" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const SupabaseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M12.5 2L4 13H11.5L10.5 22L20 10H12.5L12.5 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

const PostgresIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 6V18" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6 12H18" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 8L16 16" stroke="currentColor" strokeWidth="1.5" />
    <path d="M16 8L8 16" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const ViteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M20 2L12 22L10 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 4L10 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 2L4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ClaudeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M12 2L14.5 9L22 9L16 13.5L18 21L12 16.5L6 21L8 13.5L2 9L9.5 9L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

const AntigravityIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M12 3L4 21H9L12 13L15 21H20L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M8 17H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 3V1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M10 5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M14 5L16 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
