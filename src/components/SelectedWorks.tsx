import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue, useVelocity, useAnimationFrame } from "motion/react";
import { useState, useRef } from "react";
import { ProjectDetail, Work } from "./ProjectDetail";

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
          <span key={i} className="block text-2xl md:text-4xl font-light uppercase leading-[0.85] tracking-widest text-zinc-100" style={{ WebkitTextStroke: "1px rgba(0,0,0,0.1)" }}>
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
    <section id="works" className="py-0 pb-10 relative overflow-hidden w-full">
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetail work={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>

      {/* Parallax Text Header */}
      <div className="relative py-4 mb-2 w-full pointer-events-none z-0">
        <ParallaxText baseVelocity={1}>PROGETTI • </ParallaxText>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 relative z-10 w-full">
        {/* Creative Container - White Theme, No Window Controls */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-3xl overflow-hidden shadow-[0_0_50px_-12px_rgba(0,0,0,0.1)] border border-zinc-100 flex flex-col md:flex-row h-[600px] md:h-[550px]"
        >
          {/* Sidebar / List */}
          <div className="w-full md:w-1/3 bg-white border-r border-zinc-100 flex flex-col relative z-10">
            {/* Header */}
            <div className="p-6 border-b border-zinc-100 flex justify-between items-center bg-white">
              <span className="font-mono text-xs uppercase tracking-widest text-zinc-400">Index</span>
              <span className="font-mono text-xs text-zinc-400">01 — 03</span>
            </div>

            {/* Project List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {works.map((work) => (
                <button
                  key={work.id}
                  onClick={() => setActiveId(work.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${activeId === work.id ? "bg-zinc-50" : "hover:bg-zinc-50/50"
                    }`}
                >
                  <div className="flex justify-between items-baseline mb-1">
                    <span className={`text-sm font-mono transition-colors ${activeId === work.id ? "text-black" : "text-zinc-400"}`}>
                      0{work.id}
                    </span>
                    {activeId === work.id && (
                      <motion.span
                        layoutId="activeDot"
                        className="w-1.5 h-1.5 rounded-full bg-black"
                      />
                    )}
                  </div>

                  <h3 className={`text-lg font-medium transition-colors ${activeId === work.id ? "text-zinc-900" : "text-zinc-400 group-hover:text-zinc-600"}`}>
                    {work.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1 font-medium">{work.category}</p>
                </button>
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
          <div className="w-full md:w-2/3 relative bg-zinc-100 overflow-hidden group">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeWork.id}
                className="absolute inset-0 cursor-pointer"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "circOut" }}
                onClick={() => setSelectedProject(activeWork)}
              >
                <img
                  src={activeWork.image}
                  alt={activeWork.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            </AnimatePresence>

            {/* Floating Info Card (Glassmorphism) */}
            <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
              <motion.div
                key={activeWork.id}
                initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="bg-white/90 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/20 pointer-events-auto"
              >
                <div className="flex flex-col md:flex-row gap-6 justify-between items-end">
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      {activeWork.tech.map(t => (
                        <span key={t} className="px-2 py-1 text-[10px] font-mono bg-zinc-100 border border-zinc-200 rounded text-zinc-600">
                          {t}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-medium text-zinc-900 tracking-tight">
                      {activeWork.title}
                    </h2>
                    <p className="text-zinc-500 text-sm max-w-md leading-relaxed">
                      {activeWork.description}
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedProject(activeWork)}
                    className="w-12 h-12 flex-shrink-0 bg-black text-white rounded-full flex items-center justify-center group/btn"
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
      </div>
    </section>
  );
}
