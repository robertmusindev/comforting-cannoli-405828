import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "motion/react";

/* ─── NEURAL BACKGROUND COMPONENT ─── */
const NeuralBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 flex items-center justify-center">
            {/* Soft glowing ambient orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-zinc-100 rounded-full blur-[100px] opacity-60" />

            {/* Neural SVG Layer */}
            <svg
                className="absolute w-[140%] h-[140%] md:w-full md:h-[120%] opacity-100"
                viewBox="0 0 1000 600"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid slice"
            >
                {/* Horizontal flow line 1 */}
                <path
                    d="M-100,200 C150,300 350,100 600,250 C850,400 1100,100 1300,250"
                    stroke="rgba(0,0,0,0.25)"
                    strokeWidth="1.5"
                    strokeDasharray="4 12"
                    className="neural-wave-1"
                />

                {/* Horizontal flow line 2 */}
                <path
                    d="M-50,400 C200,300 400,500 700,350 C950,200 1100,450 1250,350"
                    stroke="rgba(0,0,0,0.2)"
                    strokeWidth="2"
                    strokeDasharray="8 16"
                    className="neural-wave-2"
                />

                {/* Vertical connecting fibers */}
                <path
                    d="M300,-100 Q350,250 250,700"
                    stroke="rgba(0,0,0,0.15)"
                    strokeWidth="1.5"
                    className="neural-wave-3"
                />
                <path
                    d="M750,-100 Q650,300 800,700"
                    stroke="rgba(0,0,0,0.1)"
                    strokeWidth="2"
                    className="neural-wave-4"
                />

                {/* Pulsing Nodes at Intersections */}
                <circle cx="310" cy="165" r="4" fill="rgba(0,0,0,0.4)" className="neural-node pulse-delay-1" />
                <circle cx="715" cy="340" r="5" fill="rgba(0,0,0,0.3)" className="neural-node pulse-delay-2" />
                <circle cx="585" cy="245" r="3" fill="rgba(0,0,0,0.5)" className="neural-node pulse-delay-3" />
            </svg>

            {/* Fade out edges so it seamlessly blends into the white background */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent" />
        </div>
    );
};

/* ─── CUSTOM MINIMAL DIVIDER ─── */
const MinimalDivider = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <div ref={ref} className="relative w-full max-w-[120px] flex justify-center items-center py-8 z-20">
            {/* The animated horizontal dash (Left) */}
            <motion.div
                className="h-[1px] bg-zinc-800 shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                initial={{ width: 0 }}
                animate={isInView ? { width: "100%" } : { width: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            />

            {/* The central pip directly on the spine */}
            <motion.div
                className="w-2 h-2 bg-black rounded-full shadow-[0_0_10px_rgba(0,0,0,0.2)] flex-shrink-0 mx-[2px] relative z-20"
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : { scale: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            />

            {/* Symmetrical right horizontal dash */}
            <motion.div
                className="h-[1px] bg-zinc-800 shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                initial={{ width: 0 }}
                animate={isInView ? { width: "100%" } : { width: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            />
        </div>
    );
};

/* ─── EXPERTISE DATA ─── */
const expertiseData = [
    {
        title: "Integrazione AI e Prompt Design",
        description: "Non mi limito a usare l'AI come utente finale. Lavoro con le API dei modelli più avanzati per creare soluzioni su misura, strutturando logiche di contesto affinché l'AI replichi fedelmente lo stile e l'emozione di un brand."
    },
    {
        title: "Prototipazione Rapida",
        description: "Il mio workflow è progettato per la velocità. Sfrutto l'AI per abbattere i tempi di sviluppo, generare logiche complesse e passare da un'idea a una demo interattiva funzionante in poche ore."
    },
    {
        title: "Backend Agile",
        description: "Fondamenta solide implementate alla massima velocità. Utilizzo ecosistemi moderni come Supabase per creare database relazionali, auth e logiche serverless scalabili saltando i colli di bottiglia tradizionali."
    },
    {
        title: "Automazioni Low-Code",
        description: "Perché reinventare la ruota? Modello processi logici complessi tramite piattaforme come Make.com, orchestrando flussi di lavoro che fanno dialogare API, database e servizi di terze parti in tempo record."
    },
    {
        title: "Connessione MarTech",
        description: "Prendo un'esigenza di business complessa e la traduco in una soluzione tecnica fattibile. Faccio dialogare strumenti custom con l'ecosistema aziendale esistente: CRM, Analytics e sistemi di advertising."
    }
];

/* ─── SINGLE EXPERTISE NODE COMPONENT ─── */
const ExpertiseNode = ({ key, item, index }: { key?: React.Key, item: typeof expertiseData[0], index: number }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <div ref={ref} className="relative w-full flex flex-col items-center justify-center py-24 z-10">

            {/* Premium Minimal Divider */}
            <MinimalDivider />

            {/* Typography */}
            <motion.h3
                className="text-2xl md:text-3xl lg:text-4xl text-black font-medium tracking-tight mb-6 text-center max-w-2xl px-4"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: "easeOut" }}
            >
                {item.title}
            </motion.h3>

            <motion.p
                className="text-zinc-500 text-base md:text-lg leading-relaxed font-light text-center max-w-xl px-6"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            >
                {item.description}
            </motion.p>
        </div>
    );
};

/* ─── MAIN COMPONENT ─── */
export function About() {
    const sectionRef = useRef<HTMLElement>(null);

    // The glowing spine line animation
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start center", "end end"]
    });
    const spineHeight = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "100%"]);

    return (
        <motion.section
            ref={sectionRef}
            className="relative w-full bg-white transition-colors duration-0"
        >
            <div className="max-w-screen-xl mx-auto relative z-20">

                {/* ── THE INTRO MANIFESTO CON NEURAL BACKGROUND ── */}
                <div className="relative w-full min-h-screen flex flex-col items-center justify-center py-24 md:py-32">

                    <NeuralBackground />

                    <div className="flex flex-col items-center justify-center px-4 relative z-10 text-center">

                        <motion.h2
                            className="text-3xl md:text-5xl lg:text-6xl text-zinc-900 font-medium tracking-tight leading-[1.1] max-w-4xl mb-8"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                        >
                            Costruisco il ponte tra l'<span className="text-zinc-500">Intelligenza Artificiale</span> e il marketing. In poche ore, non in settimane.
                        </motion.h2>

                        <motion.p
                            className="text-lg md:text-xl text-zinc-500 font-light leading-relaxed max-w-2xl px-6"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            Non sono il classico sviluppatore che si perde in mesi di pianificazione. La mia passione è "sporcarmi le mani" subito, testando tecnologie emergenti per costruire prototipi funzionanti a tempo di record.
                        </motion.p>
                    </div>
                </div>

                {/* ── THE SPINAL CORD AND NODES ── */}
                <div className="relative pb-32">
                    <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-zinc-100 z-0" />
                    <motion.div
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] bg-zinc-800 z-0 origin-top shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                        style={{ height: spineHeight }}
                    />

                    {/* ── THE 5 SYMMETRICAL NODES ── */}
                    <div className="relative">
                        {expertiseData.map((item, i) => (
                            <ExpertiseNode key={i} item={item} index={i} />
                        ))}
                    </div>
                </div>

            </div>
        </motion.section>
    );
}
