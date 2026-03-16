import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { ProjectDetail, Work } from "./ProjectDetail";
import { ParallaxHeader } from "./ParallaxHeader";
import svuotafrigoImg from "./pics/iScreen Shoter - Safari - 260316021510.jpg";


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
    title: "Svuota Frigo",
    category: "AI SaaS",
    description: "SaaS che trasforma gli ingredienti del tuo frigo in ricette gourmet grazie all'AI.",
    fullDescription: "Svuota Frigo risolve la domanda quotidiana: 'cosa cucino con quello che ho?' L'utente inserisce gli ingredienti disponibili e, grazie all'integrazione con API AI, riceve istantaneamente ricette gourmet personalizzate, dettagliate e creative. Un'esperienza culinaria intelligente, veloce e su misura — dal frigo al piatto in pochi secondi.",
    image: svuotafrigoImg,
    tech: ["React", "AI API", "Supabase", "Tailwind"],
    year: "2025",
    link: "https://robertmusindev.github.io/svuotafrigo/",
    metrics: [
      { label: "Generazione Ricette", value: "AI", icon: "Zap" },
      { label: "Tempo di Risposta", value: "<2s", icon: "Clock" },
      { label: "Ingredienti Supportati", value: "∞", icon: "TrendingUp" }
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
  const [selectedProject, setSelectedProject] = useState<Work | null>(null);

  return (
    <section id="works" className="relative pt-0 pb-[clamp(1rem,2vw,3rem)] 2xl:pt-0 2xl:pb-0 bg-white overflow-hidden min-h-screen flex flex-col justify-start md:justify-center">
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetail work={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>



      {/* Premium Divider / Parallax Text Header - Same as Expertise */}
      <ParallaxHeader baseVelocity={-1.5}>PROGETTI</ParallaxHeader>


      <div className="w-[100vw] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] px-[clamp(0.5rem,1.5vw,3vw)] flex justify-center relative z-10 flex-grow items-center 2xl:mt-4">
        {/* Simulated Mac Window - Same style as Expertise */}
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.95, rotateX: 10 }}
          whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ 
            duration: 1.2, 
            type: "spring", 
            bounce: 0.3,
            ease: "easeOut",
            willChange: "transform, opacity"
          }}
          style={{ perspective: "1500px" }}
          className="w-full max-w-[min(98vw,180rem)] h-auto md:min-h-[60vh] md:max-h-[80vh] 2xl:min-h-[85vh] 2xl:max-h-[92vh] flex flex-col bg-white rounded-[clamp(0.5rem,2vw,3rem)] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-zinc-200/50 overflow-hidden transform-gpu"
        >
          {/* Window Header */}
          <div className="bg-white/80 backdrop-blur-md border-b border-zinc-200/50 px-[clamp(1rem,2vw,2.5rem)] py-[clamp(0.5rem,1vw,1.25rem)] flex items-center gap-[clamp(0.5rem,0.8vw,1.5rem)] sticky top-0 z-10">
            <div className="flex gap-[clamp(0.5rem,0.6vw,1.25rem)]">
              <div className="w-[clamp(0.75rem,0.8vw,1.25rem)] h-[clamp(0.75rem,0.8vw,1.25rem)] rounded-full bg-[#FF5F57] border border-[#E0443E]" />
              <div className="w-[clamp(0.75rem,0.8vw,1.25rem)] h-[clamp(0.75rem,0.8vw,1.25rem)] rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
              <div className="w-[clamp(0.75rem,0.8vw,1.25rem)] h-[clamp(0.75rem,0.8vw,1.25rem)] rounded-full bg-[#28C840] border border-[#1AAB29]" />
            </div>
            <div className="ml-[clamp(1rem,2vw,3rem)] text-[clamp(0.8rem,1vw,1.2rem)] font-medium text-zinc-400 font-mono flex-1 text-center pr-[clamp(3rem,6vw,8rem)] tracking-tight">
              robert_musin_projects.tsx
            </div>
          </div>

          {/* Window Content - 3 Column Grid */}
          <div className="p-4 md:p-6 xl:p-8 2xl:p-12 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-6 md:gap-8 xl:gap-12 bg-white flex-1 md:overflow-y-auto w-full custom-scrollbar">
            {works.map((work, index) => (
              <motion.div
                key={work.id}
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.15,
                  type: "spring",
                  bounce: 0.2
                }}
                className="group flex flex-col h-full w-full cursor-pointer"
                style={{ willChange: "transform, opacity, filter" }}
                onClick={() => setSelectedProject(work)}
              >
                {/* Image Container with Hover Effect */}
                <div className="w-full h-[18rem] 2xl:h-[clamp(22rem,35vh,50rem)] rounded-xl overflow-hidden relative mb-4 bg-zinc-100 transform-gpu">
                  <motion.img
                    src={work.image}
                    alt={work.title}
                    className="w-full h-full object-cover origin-center"
                    referrerPolicy="no-referrer"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  {/* Tech Tags */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-1">
                    {work.tech.slice(0, 3).map((tech, i) => (
                      <motion.span
                        key={tech}
                        className="px-2 py-1 text-[10px] font-mono bg-white/90 backdrop-blur-sm border border-white/20 text-zinc-700 rounded shadow-sm"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.15 + i * 0.1 }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                  
                  {/* Year Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 text-[10px] font-mono bg-black/80 backdrop-blur-sm text-white rounded shadow-sm">
                      {work.year}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 pt-2 md:pt-4">
                  <h3 className="text-[clamp(1.1rem,1.8vw,1.6rem)] 2xl:text-[clamp(1.8rem,2.5vw,3.5rem)] font-medium text-zinc-900 tracking-tight leading-tight mb-2">
                    {work.title}
                  </h3>
                  <p className="text-zinc-500 leading-snug font-light text-[clamp(0.8rem,1vw,1rem)] 2xl:text-[clamp(1rem,1.2vw,1.8rem)] pb-3">
                    {work.description}
                  </p>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-zinc-100 mb-3">
                    {work.metrics.map((metric, mi) => (
                      <div key={mi} className="text-center">
                        <div className="text-[clamp(0.9rem,1.1vw,1.2rem)] 2xl:text-[clamp(1.2rem,1.4vw,2rem)] font-semibold text-zinc-900 leading-tight">
                          {metric.value}
                        </div>
                        <div className="text-[clamp(0.6rem,0.7vw,0.75rem)] 2xl:text-[clamp(0.75rem,0.85vw,1rem)] text-zinc-400 leading-tight mt-0.5">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Category */}
                  <div className="mt-auto pt-3 border-t border-zinc-100">
                    <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
                      {work.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

