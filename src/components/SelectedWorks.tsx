import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue, useVelocity, useAnimationFrame } from "motion/react";
import { useState, useRef, useContext, useMemo } from "react";
import { ProjectDetail, Work } from "./ProjectDetail";
import { ScrollContext } from "../App";

// Utility for wrapping numbers
const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

/* ═══════════════════════════════════════════════════
   PARALLAX TEXT WITH GLOW EFFECT
   ═══════════════════════════════════════════════════ */
function ParallaxText({ children, baseVelocity = 100 }: { children: string; baseVelocity: number }) {
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
    <div className="w-full overflow-hidden whitespace-nowrap flex flex-nowrap relative py-4">
      {/* Subtle animated blur glow behind the text to boost the wow effect */}
      <motion.div 
        className="absolute top-1/2 left-0 right-0 h-1/2 bg-gradient-to-r from-zinc-500/0 via-zinc-200/50 to-zinc-500/0 -translate-y-1/2 blur-2xl pointer-events-none z-[-1]"
        animate={{ opacity: [0.3, 0.6, 0.3], scaleY: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div className="flex whitespace-nowrap gap-[clamp(1rem,2vw,3rem)] flex-nowrap" style={{ x, willChange: 'transform' }}>
        {[...Array(8)].map((_, i) => (
          <span 
            key={i} 
            className="block text-[clamp(2.5rem,4vw,6rem)] font-bold uppercase leading-[0.85] tracking-tight text-white drop-shadow-md mix-blend-difference" 
            style={{ WebkitTextStroke: "1px rgba(0,0,0,0.15)" }}
          >
            {children}{" "}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

const works: Work[] = [
  {
    id: 1,
    title: "Extrucalc",
    category: "Industrial Automation",
    description: "Software custom per l'automazione e il calcolo in tempo reale di impianti di estrusione.",
    fullDescription: "Software custom sviluppato per automatizzare le logiche e i calcoli di un impianto di estrusione. L'applicazione sostituisce i processi manuali gestendo in tempo reale il fabbisogno dei materiali (billette e log), i parametri di 'tirata' e l'interfaccia con il sistema forno. Architettura full-stack moderna, supportata da un backend robusto e database relazionale su Supabase per garantire scalabilità e sincronizzazione dei dati in real-time.",
    image: "https://i.imgur.com/tmwSLne.jpeg",
    video: "https://i.imgur.com/1sfHVoa.mp4",
    tech: ["React", "Supabase", "Tailwind", "Real-time"],
    year: "2024",
    link: "https://extrucalc.vercel.app",
    metrics: [
      { label: "Efficienza Produzione", value: "+45%", icon: "TrendingUp" },
      { label: "Tempo Gestione Mensile", value: "-20h", icon: "Clock" },
      { label: "Sincronizzazione Dati", value: "Real-time", icon: "Zap" }
    ]
  },
  {
    id: 2,
    title: "Klen Portfolio",
    category: "Creative Portfolio",
    description: "Portfolio su misura con UI/UX custom e interazioni uniche.",
    fullDescription: "Sito web portfolio realizzato su misura per Klen, caratterizzato da un design unico e un'interfaccia utente (UI) sviluppata da zero. Ogni elemento, in particolare i pulsanti personalizzati e le interazioni, è stato curato nei minimi dettagli per garantire un'esperienza visiva originale e immersiva, senza l'utilizzo di template pre-fatti.",
    image: "https://i.imgur.com/CSjF4n6.jpeg",
    tech: ["React", "Motion", "Custom UI"],
    year: "2024",
    link: "https://animated-croquembouche-87d583.netlify.app",
    metrics: [
      { label: "Template Pre-Fatti", value: "0%", icon: "Zap" },
      { label: "Visitatori Unici (Primo Mese)", value: "+300%", icon: "Users" },
      { label: "Tempo di Permanenza", value: "3m 45s", icon: "Clock" }
    ]
  },
  {
    id: 3,
    title: "CodePulse",
    category: "Web Agency",
    description: "Sito web ufficiale per CodePulse, web agency dinamica e innovativa.",
    fullDescription: "Progettazione e sviluppo del sito web ufficiale per CodePulse, una web agency dinamica e innovativa. Il progetto ha richiesto la creazione di un'interfaccia utente (UI) moderna e accattivante, capace di riflettere la professionalità e il talento creativo del team. Il sito è stato strutturato per guidare l'utente attraverso i servizi offerti, con una navigazione fluida, animazioni curate e un design completamente responsivo. Un vero e proprio biglietto da visita digitale che trasforma i visitatori in potenziali clienti.",
    image: "https://i.imgur.com/wBUEBEt.jpeg",
    tech: ["React", "Tailwind", "Framer Motion"],
    year: "2024",
    link: "https://codepulse3-orcin.vercel.app",
    metrics: [
      { label: "Lead Generati Raddoppiati", value: "+110%", icon: "TrendingUp" },
      { label: "Traffico Mobile Ottimizzato", value: "100%", icon: "Smartphone" },
      { label: "Conversion Rate (Tasso di conversione)", value: "5.2%", icon: "Eye" }
    ]
  }
];

export function SelectedWorks() {
  const [activeId, setActiveId] = useState(works[0].id);
  const [selectedProject, setSelectedProject] = useState<Work | null>(null);
  const activeWork = works.find(w => w.id === activeId) || works[0];

  return (
    <section id="works" className="py-0 pb-[clamp(3rem,5vw,8rem)] relative overflow-hidden w-[100vw] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-zinc-50">
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetail work={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>

      {/* Parallax Text Header */}
      <div className="relative py-[clamp(0.5rem,1vw,1.5rem)] mb-[clamp(0.5rem,1vw,2rem)] overflow-hidden pointer-events-none z-0 mt-8">
        <ParallaxText baseVelocity={1.5}>PROGETTI • </ParallaxText>
      </div>

      <div className="w-[90vw] mx-auto relative z-10 w-full">
        {/* Creative Container - White Theme, No Window Controls */}
        {/* ===== DESKTOP LAYOUT (Hidden on Mobile) ===== */}
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, type: "spring", bounce: 0.3, ease: "easeOut" }}
          className="hidden bg-white rounded-[clamp(1.5rem,2vw,3rem)] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-zinc-200/50 md:flex flex-row h-[clamp(30rem,40vw,50rem)] transform-gpu"
        >
          {/* Sidebar / List */}
          <div className="w-1/3 bg-white border-r border-zinc-100 flex flex-col relative z-10 flex-shrink-0">
            {/* Header */}
            <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-white">
              <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">Index</span>
              <span className="font-mono text-xs text-zinc-400">01 — 03</span>
            </div>

            {/* Project List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
              {works.map((work, index) => (
                <motion.button
                  key={work.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                  onClick={() => setActiveId(work.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${activeId === work.id ? "bg-zinc-50 translate-x-2" : "hover:bg-zinc-50/50 hover:translate-x-1"
                    }`}
                >
                  <div className="flex justify-between items-baseline mb-1">
                    <span className={`text-sm font-mono transition-colors ${activeId === work.id ? "text-black" : "text-zinc-400"}`}>
                      0{work.id}
                    </span>
                    {activeId === work.id && (
                      <motion.span
                        layoutId="activeDot"
                        className="w-1.5 h-1.5 rounded-full bg-black shadow-[0_0_8px_rgba(0,0,0,0.5)]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </div>

                  <h3 className={`text-lg font-medium transition-colors ${activeId === work.id ? "text-zinc-900" : "text-zinc-400 group-hover:text-zinc-600"}`}>
                    {work.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 font-medium">{work.category}</p>
                </motion.button>
              ))}
            </div>

            {/* Footer Info */}
            <div className="p-6 border-t border-zinc-100 bg-zinc-50/50">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-zinc-400">YEAR</span>
                <span className="text-black font-medium">{activeWork.year}</span>
              </div>
            </div>
          </div>

          {/* Main Preview Area */}
          <div className="w-2/3 flex-1 relative bg-zinc-100 overflow-hidden group/image">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeWork.id}
                className="absolute inset-0 cursor-pointer overflow-hidden"
                initial={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => setSelectedProject(activeWork)}
              >
                <motion.img
                  src={activeWork.image}
                  alt={activeWork.title}
                  className="w-full h-full object-cover transform-gpu"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </AnimatePresence>

            {/* Floating Info Card (Glassmorphism) inside preview */}
            <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
              <motion.div
                key={activeWork.id}
                initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.3, duration: 0.6, type: "spring", bounce: 0.3 }}
                className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/40 pointer-events-auto transform-gpu"
              >
                <div className="flex flex-col xl:flex-row gap-4 xl:gap-6 justify-between items-end">
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      {activeWork.tech.map(t => (
                        <span key={t} className="px-2 py-1 text-[10px] font-mono bg-zinc-100/80 border border-zinc-200/80 rounded text-zinc-600 backdrop-blur-sm">
                          {t}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-medium text-zinc-900 tracking-tight drop-shadow-sm">
                      {activeWork.title}
                    </h2>
                    <p className="text-zinc-500 text-sm max-w-md leading-relaxed">
                      {activeWork.description}
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "#333" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedProject(activeWork)}
                    className="w-12 h-12 flex-shrink-0 bg-black text-white rounded-full flex items-center justify-center group/btn shadow-md"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transform -rotate-45 group-hover/btn:rotate-0 transition-transform duration-300">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* ===== MOBILE LAYOUT (Cinematic Vertical Stack, Hidden on Desktop) ===== */}
        <div className="md:hidden flex flex-col gap-6 w-full mt-4">
          {works.map((work, index) => (
            <motion.div
              key={work.id}
              initial={{ opacity: 0, y: 80, scale: 0.9, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: index * 0.1, type: "spring", bounce: 0.3 }}
              className="relative w-full h-[70vh] rounded-[2rem] overflow-hidden shadow-2xl border border-zinc-200/50 transform-gpu"
              style={{ perspective: "1500px" }}
              onClick={() => setSelectedProject(work)}
            >
              {/* Background Image */}
              <motion.img
                src={work.image}
                alt={work.title}
                className="absolute inset-0 w-full h-full object-cover origin-center"
                referrerPolicy="no-referrer"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />

              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

              {/* Content Panel (Glassmorphism) at bottom */}
              <div className="absolute bottom-4 left-4 right-4 pointer-events-none">
                <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 pointer-events-auto group">
                  <div className="flex flex-col gap-4">

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {work.tech.slice(0, 3).map((t, i) => (
                        <span key={i} className="px-2 py-1 text-[10px] font-mono bg-white/20 text-white border border-white/10 rounded backdrop-blur-md shadow-sm">
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Titles */}
                    <div>
                      <h2 className="text-2xl font-medium text-white tracking-tight mb-1 drop-shadow-md">
                        {work.title}
                      </h2>
                      <p className="text-zinc-300 text-sm font-light line-clamp-2 drop-shadow-sm">
                        {work.description}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-white/80 text-xs font-mono uppercase tracking-widest group-hover:text-white transition-colors duration-300 drop-shadow-sm">
                        Scopri Progetto
                      </span>
                      <button className="w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full flex items-center justify-center active:scale-95 transition-all duration-300 shadow-lg group-hover:bg-white/30">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="transform -rotate-45 group-hover:rotate-0 transition-transform duration-300">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
