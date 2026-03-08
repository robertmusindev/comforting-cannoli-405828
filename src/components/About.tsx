import React, { useRef, useContext } from "react";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import { ScrollContext } from "../App";

/* ─── NEURAL BACKGROUND COMPONENT ─── */
const NeuralBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 flex items-center justify-center">

            {/* Neural SVG Layer - Fullscreen Symmetrical Brackets */}
            <svg
                className="absolute w-[120%] h-[120%] md:w-full md:h-full opacity-60"
                viewBox="0 0 1000 600"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid slice"
            >
                {/* Left Symmetrical Bracket Curves */}
                <path
                    d="M 200,-100 C -50,150 -50,450 200,700"
                    stroke="rgba(0,0,0,0.15)"
                    strokeWidth="1.5"
                    strokeDasharray="4 12"
                    className="neural-wave-1"
                />
                <path
                    d="M 100,-50 C -150,200 -150,400 100,650"
                    stroke="rgba(0,0,0,0.1)"
                    strokeWidth="2"
                    strokeDasharray="8 16"
                    className="neural-wave-2"
                />

                {/* Right Symmetrical Bracket Curves */}
                <path
                    d="M 800,-100 C 1050,150 1050,450 800,700"
                    stroke="rgba(0,0,0,0.15)"
                    strokeWidth="1.5"
                    strokeDasharray="4 12"
                    className="neural-wave-1"
                />
                <path
                    d="M 900,-50 C 1150,200 1150,400 900,650"
                    stroke="rgba(0,0,0,0.1)"
                    strokeWidth="2"
                    strokeDasharray="8 16"
                    className="neural-wave-2"
                />

                {/* Pulsing Nodes at Intersections */}
                <circle cx="85" cy="180" r="3" fill="rgba(0,0,0,0.15)" className="neural-node pulse-delay-1" />
                <circle cx="20" cy="420" r="4" fill="rgba(0,0,0,0.1)" className="neural-node pulse-delay-2" />
                <circle cx="915" cy="180" r="3" fill="rgba(0,0,0,0.15)" className="neural-node pulse-delay-3" />
                <circle cx="980" cy="420" r="4" fill="rgba(0,0,0,0.1)" className="neural-node pulse-delay-1" />
            </svg>

            {/* Fade out edges so it seamlessly blends into the white background */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent" />
        </div>
    );
};

/* ─── SCROLL DRIVEN EXPERTISE TEXT COMPONENT ─── */
const ScrollExpertiseArea = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mainScrollContainer = useContext(ScrollContext);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        container: mainScrollContainer || undefined,
        offset: ["start start", "end end"]
    });

    return (
        <div ref={containerRef} className="relative w-[100vw] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[300vh] md:snap-start md:snap-always">
            <div className="sticky top-0 w-full h-[100svh] flex flex-col items-center justify-center overflow-hidden">
                {/* Background line fading in and out cleanly */}
                <motion.div
                    className="absolute top-0 bottom-0 left-[clamp(1.5rem,4vw,6rem)] w-[1px] bg-zinc-200 z-10 hidden md:block"
                    style={{ opacity: useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]) }}
                />

                {/* The progressive black line filling up */}
                <motion.div
                    className="absolute top-0 left-[clamp(1.5rem,4vw,6rem)] w-[2px] -ml-[0.5px] bg-zinc-800 z-20 origin-top shadow-[0_0_10px_rgba(0,0,0,0.1)] hidden md:block"
                    style={{
                        height: useTransform(scrollYProgress, [0, 0.9], ["0%", "100%"]),
                        opacity: useTransform(scrollYProgress, [0, 0.1, 0.8, 0.95], [0, 1, 1, 0])
                    }}
                />

                {/* The glowing dot tracking the tip of the line */}
                <motion.div
                    className="absolute top-0 left-[clamp(1.5rem,4vw,6rem)] w-3 h-3 -ml-[5px] rounded-full border border-black bg-white shadow-[0_0_15px_rgba(0,0,0,0.2)] z-30 hidden md:block origin-center"
                    style={{
                        y: useTransform(scrollYProgress, [0, 0.9], ["0vh", "100vh"]),
                        opacity: useTransform(scrollYProgress, [0, 0.1, 0.8, 0.95], [0, 1, 1, 0]),
                        scale: useTransform(scrollYProgress, [0, 0.05, 0.8, 0.95], [0, 1, 1, 0])
                    }}
                />

                <div className="relative w-full h-full max-w-[clamp(40rem,60vw,80rem)] px-4 mx-auto flex items-center justify-center">
                    {expertiseData.map((item, i) => {
                        const isFirst = i === 0;
                        const isLast = i === expertiseData.length - 1;

                        const start = i * 0.2;
                        const fadeIn = start + 0.05;
                        const fadeOut = start + 0.15;
                        const end = start + 0.2;

                        const opacity = useTransform(
                            scrollYProgress,
                            [start, fadeIn, fadeOut, end],
                            [isFirst ? 1 : 0, 1, 1, isLast ? 1 : 0]
                        );

                        const y = useTransform(
                            scrollYProgress,
                            [start, fadeIn, fadeOut, end],
                            [isFirst ? 0 : 40, 0, 0, isLast ? 0 : -40]
                        );

                        const pointerEvents = useTransform(
                            opacity,
                            (val) => (val > 0.5 ? "auto" : "none")
                        );

                        return (
                            <motion.div
                                key={i}
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex flex-col items-center justify-center"
                                style={{ opacity, y, pointerEvents }}
                            >
                                <h3 className="text-[clamp(1.8rem,3vw,5rem)] text-black font-medium tracking-tight mb-[clamp(1.5rem,2vw,3rem)] text-center w-full px-4 text-balance">
                                    {item.title}
                                </h3>
                                <p className="text-zinc-500 text-[clamp(1.1rem,1.5vw,2.5rem)] leading-relaxed font-light text-center max-w-[clamp(40rem,50vw,70rem)] px-6 text-balance">
                                    {item.description}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
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

/* ─── MAIN COMPONENT ─── */
export function About() {
    const sectionRef = useRef<HTMLElement>(null);

    return (
        <motion.section
            ref={sectionRef}
            className="relative w-full bg-white transition-colors duration-0"
        >
            <div className="max-w-screen-xl mx-auto relative z-20">

                {/* ── THE INTRO MANIFESTO CON NEURAL BACKGROUND ── */}
                <div className="md:snap-start md:snap-always relative w-full min-h-[100svh] flex flex-col items-center justify-center py-[clamp(4rem,8vw,12rem)]">

                    <NeuralBackground />

                    <div className="flex flex-col items-center justify-center px-4 relative z-10 text-center">

                        <motion.h2
                            className="text-[clamp(2rem,4vw,6rem)] text-zinc-900 font-medium tracking-tight leading-[1.1] max-w-[clamp(40rem,60vw,80rem)] mb-[clamp(2rem,3vw,5rem)]"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                        >
                            Costruisco il ponte tra l'<span className="text-zinc-500">Intelligenza Artificiale</span> e il marketing. In poche ore, non in settimane.
                        </motion.h2>

                        <motion.p
                            className="text-[clamp(1.1rem,1.5vw,2.5rem)] text-zinc-500 font-light leading-relaxed max-w-[clamp(30rem,50vw,70rem)] px-6"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            Non sono il classico sviluppatore che si perde in mesi di pianificazione. La mia passione è "sporcarmi le mani" subito, testando tecnologie emergenti per costruire prototipi funzionanti a tempo di record.
                        </motion.p>
                    </div>
                </div>

                {/* ── THE SPINAL CORD AND SCROLLING NODES ── */}
                <ScrollExpertiseArea />

            </div>
        </motion.section>
    );
}
