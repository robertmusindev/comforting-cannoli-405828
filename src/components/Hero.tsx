import { motion } from "motion/react";
import { HighlightText } from "./About";

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
    willChange: "transform, opacity, filter"
  }),
};

export function Hero() {
  const name = "Robert Musin";
  const words = name.split(" ");

  return (
    <section className="w-full bg-white relative overflow-hidden flex flex-col justify-center items-center min-h-[100svh]">
      {/* ===== Animated Background Elements ===== */}
      <div className="absolute inset-0 z-0 pointer-events-none w-full h-full">
        {/* ===== Top-Left Corner Arc ===== */}
        <motion.svg
          className="absolute top-0 left-0 w-[55%] md:w-[40%] max-w-[800px] h-auto"
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.6, duration: 1.2, ease: "easeOut" }}
        >
          <motion.path
            d="M-20,0 Q-20,520 500,520"
            stroke="rgba(0,0,0,0.08)"
            strokeWidth="1.5"
            strokeDasharray="8 6"
            fill="none"
            animate={{ strokeDashoffset: [0, -56] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d="M-20,60 Q-20,460 440,460"
            stroke="rgba(0,0,0,0.06)"
            strokeWidth="1"
            strokeDasharray="6 8"
            fill="none"
            animate={{ strokeDashoffset: [0, -56] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d="M-20,120 Q-20,400 380,400"
            stroke="rgba(0,0,0,0.04)"
            strokeWidth="1"
            strokeDasharray="4 10"
            fill="none"
            animate={{ strokeDashoffset: [0, -56] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
        </motion.svg>

        {/* ===== Bottom-Right Corner Arc ===== */}
        <motion.svg
          className="absolute bottom-0 right-0 w-[55%] md:w-[40%] max-w-[800px] h-auto"
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.8, duration: 1.2, ease: "easeOut" }}
        >
          <motion.path
            d="M520,500 Q520,-20 0,-20"
            stroke="rgba(0,0,0,0.08)"
            strokeWidth="1.5"
            strokeDasharray="8 6"
            fill="none"
            animate={{ strokeDashoffset: [0, 56] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d="M520,440 Q520,40 60,40"
            stroke="rgba(0,0,0,0.06)"
            strokeWidth="1"
            strokeDasharray="6 8"
            fill="none"
            animate={{ strokeDashoffset: [0, 56] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d="M520,380 Q520,100 120,100"
            stroke="rgba(0,0,0,0.04)"
            strokeWidth="1"
            strokeDasharray="4 10"
            fill="none"
            animate={{ strokeDashoffset: [0, 56] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
        </motion.svg>

        {/* Floating geometric shapes */}
        <motion.div
          className="absolute z-0"
          style={{ top: '15%', left: '10%' }}
          animate={{ y: [-10, 10, -10], rotate: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-[clamp(2rem,3vw,4rem)] h-[clamp(2rem,3vw,4rem)] border-2 border-black/15 rounded-md" />
        </motion.div>

        <motion.div
          className="absolute z-0"
          style={{ top: '25%', right: '15%' }}
          animate={{ y: [10, -10, 10], rotate: [0, -15, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <svg viewBox="0 0 20 20" fill="none" className="w-[clamp(1.75rem,2.5vw,3rem)] h-[clamp(1.75rem,2.5vw,3rem)]">
            <line x1="10" y1="2" x2="10" y2="18" stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
            <line x1="2" y1="10" x2="18" y2="10" stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
          </svg>
        </motion.div>

        <motion.div
          className="absolute z-0"
          style={{ top: '45%', left: '8%' }}
          animate={{ y: [-15, 15, -15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <svg viewBox="0 0 22 20" fill="none" className="w-[clamp(1.8rem,2.8vw,3.5rem)] h-[clamp(1.8rem,2.8vw,3.5rem)]">
            <path d="M11 2L20 18H2L11 2Z" stroke="rgba(0,0,0,0.15)" strokeWidth="2" />
          </svg>
        </motion.div>

        <motion.div
          className="absolute z-0"
          style={{ top: '40%', left: '85%' }}
          animate={{ y: [-8, 8, -8], rotate: [0, 45, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        >
          <svg viewBox="0 0 18 18" fill="none" className="w-[clamp(1.5rem,2.2vw,3rem)] h-[clamp(1.5rem,2.2vw,3rem)]">
            <rect x="9" y="1" width="11" height="11" rx="1" stroke="rgba(0,0,0,0.15)" strokeWidth="2" transform="rotate(45 9 1)" />
          </svg>
        </motion.div>

        {/* Pulsing accent dots */}
        <div className="absolute w-[clamp(4px,0.8vw,12px)] h-[clamp(4px,0.8vw,12px)] bg-black/10 rounded-full" style={{ top: '30%', left: '20%', animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
        <div className="absolute w-[clamp(4px,0.8vw,12px)] h-[clamp(4px,0.8vw,12px)] bg-black/10 rounded-full" style={{ top: '70%', right: '18%', animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite 1.5s' }} />
        <div className="absolute w-[clamp(4px,0.8vw,12px)] h-[clamp(4px,0.8vw,12px)] bg-black/10 rounded-full" style={{ top: '45%', right: '25%', animation: 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite 3s' }} />
      </div>

      {/* Core centered content */}
      <div className="relative z-10 w-full px-[clamp(1.5rem,4vw,6rem)] flex flex-col items-center justify-center text-center">
        <h1 className="text-[clamp(3rem,4vw,5rem)] lg:text-[clamp(4rem,6vw,8rem)] xl:text-[clamp(5rem,7vw,10rem)] 3xl:text-[clamp(8rem,9vw,12rem)] font-medium tracking-tighter leading-none text-zinc-900 text-center">
          {words.map((word, wordIndex) => (
            <span key={wordIndex} className="inline-block whitespace-nowrap">
              {word.split("").map((char, charIndex) => {
                const i = wordIndex * 10 + charIndex;
                return (
                  <motion.span
                    key={charIndex}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={charVariants}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                );
              })}
              {wordIndex !== words.length - 1 && (
                <span className="inline-block w-[0.25em]">&nbsp;</span>
              )}
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 2.0, duration: 1, ease: "easeOut" }}
          style={{ willChange: "transform, opacity, filter" }}
          className="mt-[clamp(1.5rem,2.5vw,2.5rem)] lg:mt-[clamp(2rem,3vw,3rem)] xl:mt-[clamp(2.5rem,3.5vw,3.5rem)] 3xl:mt-[clamp(3.5rem,4vw,4rem)] text-[clamp(1.125rem,1.8vw,1.75rem)] lg:text-[clamp(1.25rem,2vw,2rem)] xl:text-[clamp(1.5rem,2.2vw,2.25rem)] 3xl:text-[clamp(2rem,2.5vw,2.5rem)] text-zinc-500 max-w-[clamp(40rem,60vw,80rem)] font-light tracking-wide leading-relaxed transform-gpu"
        >
          <HighlightText text="**Full Stack Developer**." delayOffset={2.2} /> <br className="hidden md:block" />
          <HighlightText text="Sviluppo prodotti digitali **scalabili** e **performanti**." delayOffset={2.7} />
        </motion.p>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 2.8, duration: 0.8, ease: "easeOut" }}
           className="mt-[clamp(2.5rem,3vw,3.5rem)] lg:mt-[clamp(3rem,4vw,4rem)] xl:mt-[clamp(3.5rem,5vw,5rem)] 3xl:mt-[clamp(4.5rem,6vw,7rem)] mb-[clamp(4rem,10vh,8rem)] flex flex-col sm:flex-row items-center gap-[clamp(1.5rem,2vw,3rem)]"
        >
          <a
            href="#contact"
            className="group relative inline-flex items-center justify-center px-[clamp(2rem,3vw,4rem)] py-[clamp(1rem,1.5vw,2rem)] text-[clamp(1rem,1.25vw,1.5rem)] bg-black text-white font-medium rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95"
          >
            <span className="relative z-10">Parliamone</span>
            <div className="absolute inset-0 bg-zinc-800 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          </a>
          <a
            href="#works"
            className="text-zinc-950 text-[clamp(1rem,1.25vw,1.5rem)] font-medium hover:text-zinc-600 transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-zinc-950 after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100"
          >
            Esplora i Progetti
          </a>
        </motion.div>
      </div>

      {/* Bottom elements */}
      <div className="flex flex-col items-center pb-[clamp(1rem,2vw,3rem)] w-full absolute bottom-0 left-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5, duration: 1 }}
          className="flex flex-col items-center gap-2 mb-[clamp(0.5rem,1.5vw,2rem)]"
        >
          <span className="text-[clamp(0.6rem,0.8vw,1rem)] uppercase tracking-[0.3em] text-zinc-400 font-light">scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg viewBox="0 0 16 16" fill="none" className="w-[clamp(1rem,1.5vw,2rem)] h-[clamp(1rem,1.5vw,2rem)]">
              <path d="M3 6L8 11L13 6" stroke="rgba(0,0,0,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 4.2, duration: 0.8, ease: "easeOut" }}
          className="w-full"
        >
          <TechTicker />
        </motion.div>
      </div>
    </section>
  );
}

const TechTicker = () => {
  const techs = [
    { name: "React", icon: <ReactIcon /> },
    { name: "Vue.js", icon: <VueIcon /> },
    { name: "TypeScript", icon: <TSIcon /> },
    { name: "Tailwind", icon: <TailwindIcon /> },
    { name: "HTML5", icon: <HTML5Icon /> },
    { name: "CSS3", icon: <CSS3Icon /> },
    { name: "Node.js", icon: <NodeIcon /> },
    { name: "Python", icon: <PythonIcon /> },
    { name: "PostgreSQL", icon: <PostgresIcon /> },
  ];

  // Create 4 copies to ensure seamless loop
  const allTechs = [...techs, ...techs, ...techs, ...techs];

  return (
    <div className="w-[100vw] overflow-hidden mt-[clamp(0.5rem,1.5vw,2rem)] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <motion.div
        className="flex gap-[clamp(2rem,6vw,6rem)] w-max pr-[clamp(2rem,6vw,6rem)]"
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
            className="flex items-center gap-[clamp(0.5rem,1vw,1.5rem)] text-zinc-400 grayscale hover:grayscale-0 hover:text-black transition-all duration-500 cursor-default flex-shrink-0"
          >
            <div className="w-[clamp(1.5rem,2.5vw,3rem)] h-[clamp(1.5rem,2.5vw,3rem)]">{tech.icon}</div>
            <span className="text-[clamp(1rem,1.5vw,2rem)] font-semibold tracking-tight">{tech.name}</span>
          </div>
        ))}
      </motion.div>

      {/* Gradient Masks for fade effect */}
      <div className="absolute inset-y-0 left-0 w-[clamp(2rem,6vw,6rem)] bg-gradient-to-r from-white to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-[clamp(2rem,6vw,6rem)] bg-gradient-to-l from-white to-transparent z-10" />
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

const HTML5Icon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M12 2L4 5V11C4 16.5 7 21 12 22C17 21 20 16.5 20 11V5L12 2Z" 
          stroke="currentColor" strokeWidth="1.5" />
    <text x="12" y="15" textAnchor="middle" fill="currentColor" 
          fontSize="8" fontWeight="bold">5</text>
  </svg>
);

const CSS3Icon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M12 2L4 5V11C4 16.5 7 21 12 22C17 21 20 16.5 20 11V5L12 2Z" 
          stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 10L12 12L16 10" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 14L12 16L16 14" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const VueIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M12 4L4 20L12 14L20 20L12 4Z" 
          stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M12 4L8 12L12 10L16 12L12 4Z" 
          stroke="currentColor" strokeWidth="1.5" fill="none" />
  </svg>
);

const PythonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M9 8C9 9.5 7.5 11 6 11C4.5 11 3 9.5 3 8C3 6.5 4.5 5 6 5C7.5 5 9 6.5 9 8Z" 
          stroke="currentColor" strokeWidth="1.5" />
    <path d="M15 16C15 17.5 16.5 19 18 19C19.5 19 21 17.5 21 16C21 14.5 19.5 13 18 13C16.5 13 15 14.5 15 16Z" 
          stroke="currentColor" strokeWidth="1.5" />
    <path d="M9 8C9 12 15 10 15 16" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);
