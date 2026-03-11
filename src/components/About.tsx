import React, { useRef, useContext, useMemo } from "react";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import { ScrollContext } from "../App";

/* ─── SCROLL-DRIVEN PARALLAX BACKGROUND ─── */
const NeuralBackground = () => {
    // Generate static random positions for particles to avoid hydration mismatches
    const particles = useMemo(() => {
        return Array.from({ length: 30 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 4 + 1,
            duration: Math.random() * 20 + 20,
            delay: Math.random() * -20,
        }));
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 flex items-center justify-center bg-zinc-50/30">
            {/* Drifting Particles for depth (hardware accelerated translate3d) */}
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full bg-zinc-300 pointer-events-none"
                    style={{
                        width: p.size,
                        height: p.size,
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                    }}
                    animate={{
                        y: ["-20vh", "20vh"],
                        x: ["-10vw", "10vw"],
                        opacity: [0.1, 0.5, 0.1],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "linear",
                        delay: p.delay,
                    }}
                />
            ))}

            {/* Neural SVG Layer - Fullscreen Symmetrical Brackets (Animated) */}
            <svg
                className="absolute w-[120%] h-[120%] md:w-full md:h-full opacity-[0.25]"
                viewBox="0 0 1000 600"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid slice"
            >
                {/* Left Symmetrical Bracket Curves */}
                <motion.path
                    d="M 200,-100 C -50,150 -50,450 200,700"
                    stroke="rgba(0,0,0,0.4)"
                    strokeWidth="1.5"
                    strokeDasharray="4 12"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                />
                <motion.path
                    d="M 100,-50 C -150,200 -150,400 100,650"
                    stroke="rgba(0,0,0,0.2)"
                    strokeWidth="2"
                    strokeDasharray="8 16"
                    initial={{ pathLength: 1, opacity: 1 }}
                    animate={{ pathLength: 0.5, opacity: 0.5 }}
                    transition={{ duration: 5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                />

                {/* Right Symmetrical Bracket Curves */}
                <motion.path
                    d="M 800,-100 C 1050,150 1050,450 800,700"
                    stroke="rgba(0,0,0,0.4)"
                    strokeWidth="1.5"
                    strokeDasharray="4 12"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 4.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                />
                <motion.path
                    d="M 900,-50 C 1150,200 1150,400 900,650"
                    stroke="rgba(0,0,0,0.2)"
                    strokeWidth="2"
                    strokeDasharray="8 16"
                    initial={{ pathLength: 1, opacity: 1 }}
                    animate={{ pathLength: 0.5, opacity: 0.5 }}
                    transition={{ duration: 5.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                />

                {/* Pulsing Nodes at Intersections */}
                {[
                    { cx: 85, cy: 180, r: 3, delay: 0 },
                    { cx: 20, cy: 420, r: 4, delay: 1 },
                    { cx: 915, cy: 180, r: 3, delay: 0.5 },
                    { cx: 980, cy: 420, r: 4, delay: 1.5 }
                ].map((node, i) => (
                    <motion.circle
                        key={i}
                        cx={node.cx}
                        cy={node.cy}
                        r={node.r}
                        fill="rgba(0,0,0,0.3)"
                        animate={{ r: [node.r, node.r * 2.5, node.r], opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity, delay: node.delay, ease: "easeInOut" }}
                    />
                ))}
            </svg>

            {/* Fade out edges so it seamlessly blends into the white background */}
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent" />
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent" />
        </div>
    );
};

/* ─── STAGGERED TEXT REVEAL COMPONENT ─── */
const StaggeredText = ({ text, className, delayOffset = 0, highlightWords = [] }: { text: string; className?: string; delayOffset?: number; highlightWords?: string[] }) => {
    const words = text.split(" ");
    
    // Framer motion variants for the container to stagger children
    const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: delayOffset * i },
        }),
    };

    // Premium word reveal with blur, Y translation and rotateX for a 3D flip effect
    const child = {
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            filter: "blur(0px)",
            transition: {
                type: "spring",
                damping: 20,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 40,
            rotateX: -45,
            filter: "blur(10px)",
        },
    };

    return (
        <motion.div
            style={{ display: "inline-block", perspective: "1000px" }}
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className={className}
        >
            {words.map((word, index) => {
                const cleanWord = word.replace(/[.,;?!]/g, "");
                const isHighlighted = highlightWords.includes(cleanWord);
                return (
                    <motion.span
                        variants={child}
                        style={{ display: "inline-block", marginRight: "0.25em", willChange: "transform, opacity, filter" }}
                        key={index}
                    >
                        {isHighlighted ? (
                            <span className="relative inline-block text-black font-semibold px-1 mx-[1px]">
                                <span className="relative z-10">{word}</span>
                                <motion.span
                                    className="absolute inset-0 bg-gradient-to-r from-zinc-200 to-zinc-100 rounded-sm -z-10 origin-left"
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: delayOffset + 0.5 + (index * 0.05), ease: [0.22, 1, 0.36, 1] }}
                                />
                            </span>
                        ) : (
                            word
                        )}
                    </motion.span>
                );
            })}
        </motion.div>
    );
};

/* ─── INLINE HIGHLIGHT TEXT COMPONENT ─── */
export const HighlightText = ({ text, delayOffset = 0 }: { text: string; delayOffset?: number }) => {
    // Splits the text by **...**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return (
        <>
            {parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    const content = part.slice(2, -2);
                    return (
                        <span key={i} className="relative inline-block text-black font-medium z-10 px-1 mx-[1px]">
                            <span className="relative z-10">{content}</span>
                            <motion.span
                                className="absolute inset-0 bg-gradient-to-r from-zinc-200 to-zinc-100 rounded-sm -z-10 origin-left"
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: delayOffset + (i * 0.1), ease: [0.22, 1, 0.36, 1] }}
                            />
                        </span>
                    );
                }
                return <span key={i}>{part}</span>;
            })}
        </>
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
            <div className="sticky top-0 w-full h-[100svh] flex flex-col items-center justify-center overflow-hidden bg-white/50 backdrop-blur-[2px]">
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

                <div className="relative w-full h-full max-w-[clamp(40rem,60vw,80rem)] px-4 mx-auto flex items-center justify-center" style={{ perspective: "1500px" }}>
                    {expertiseData.map((item, i) => {
                        const isFirst = i === 0;
                        const isLast = i === expertiseData.length - 1;

                        const start = i * 0.2;
                        const fadeIn = start + 0.05;
                        const fadeOut = start + 0.15;
                        const end = start + 0.2;

                        // Create a "focus" window where opacity is 1
                        const opacity = useTransform(
                            scrollYProgress,
                            [start, fadeIn, fadeOut, end],
                            [isFirst ? 1 : 0, 1, 1, isLast ? 1 : 0]
                        );

                        // Y translation: items fly up from bottom, stay, then fly up and away
                        const y = useTransform(
                            scrollYProgress,
                            [start, fadeIn, fadeOut, end],
                            [isFirst ? "0%" : "60%", "0%", "0%", isLast ? "0%" : "-60%"]
                        );

                        // 3D Rotation: tilt back when entering/exiting, flat when active
                        const rotateX = useTransform(
                            scrollYProgress,
                            [start, fadeIn, fadeOut, end],
                            [isFirst ? 0 : 35, 0, 0, isLast ? 0 : -35]
                        );

                        // Scale: grow slightly as they enter focus
                        const scale = useTransform(
                            scrollYProgress,
                            [start, fadeIn, fadeOut, end],
                            [isFirst ? 1 : 0.85, 1, 1, isLast ? 1 : 0.85]
                        );

                        // Blur: blur out unfocused elements for depth of field effect
                        const filter = useTransform(
                            scrollYProgress,
                            [start, fadeIn, fadeOut, end],
                            [isFirst ? "blur(0px)" : "blur(12px)", "blur(0px)", "blur(0px)", isLast ? "blur(0px)" : "blur(12px)"]
                        );

                        const pointerEvents = useTransform(
                            opacity,
                            (val) => (val > 0.5 ? "auto" : "none")
                        );
                        
                        // Alternate left/right offset for layout dynamism
                        const xOffset = i % 2 === 0 ? "2%" : "-2%";

                        return (
                            <div key={i} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <motion.div
                                    className="w-full flex flex-col items-center justify-center transform-gpu"
                                    style={{ 
                                        opacity, 
                                        y, 
                                        rotateX, 
                                        scale, 
                                        filter, 
                                        pointerEvents,
                                        x: xOffset,
                                        willChange: "transform, opacity, filter"
                                    }}
                                >
                                    <h3 className="text-[clamp(1.8rem,3vw,5rem)] text-black font-medium tracking-tight mb-[clamp(1.5rem,2vw,3rem)] text-center w-full px-4 text-balance drop-shadow-sm">
                                        {item.title}
                                    </h3>
                                    <p className="text-zinc-500 text-[clamp(1.1rem,1.5vw,2.5rem)] leading-relaxed font-light text-center max-w-[clamp(40rem,50vw,70rem)] px-6 text-balance">
                                        <HighlightText text={item.description} delayOffset={i * 0.15} />
                                    </p>
                                </motion.div>
                            </div>
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
        description: "Non mi limito a usare l'AI come utente finale. Lavoro con le **API dei modelli più avanzati** per creare soluzioni su misura, strutturando logiche di contesto affinché l'AI **replichi fedelmente lo stile** e l'emozione di un brand."
    },
    {
        title: "Prototipazione Rapida",
        description: "Il mio workflow è progettato per la velocità. Sfrutto l'AI per abbattere i tempi di sviluppo, generare logiche complesse e passare da un'idea a una **demo interattiva funzionante** in poche ore."
    },
    {
        title: "Backend Agile",
        description: "Fondamenta solide implementate alla massima velocità. Utilizzo ecosistemi moderni come **Supabase** per creare database relazionali, auth e **logiche serverless scalabili** saltando i colli di bottiglia tradizionali."
    },
    {
        title: "Automazioni Low-Code",
        description: "Perché reinventare la ruota? Modello processi logici complessi tramite piattaforme come **Make.com**, orchestrando flussi di lavoro che fanno dialogare API, database e servizi di terze parti a tempo di record."
    },
    {
        title: "Connessione MarTech",
        description: "Prendo un'esigenza di business complessa e la traduco in una soluzione tecnica fattibile. Faccio dialogare **strumenti custom** con l'ecosistema aziendale esistente: **CRM, Analytics** e sistemi di advertising."
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
                        <StaggeredText 
                            text="Costruisco il ponte tra l' Intelligenza Artificiale e il marketing. In poche ore, non in settimane."
                            className="text-[clamp(2rem,4vw,6rem)] text-zinc-900 font-medium tracking-tight leading-[1.1] max-w-[clamp(40rem,60vw,80rem)] mb-[clamp(2rem,3vw,5rem)]"
                            delayOffset={0.1}
                        />

                        <motion.p
                            className="text-[clamp(1.1rem,1.5vw,2.5rem)] text-zinc-500 font-light leading-relaxed max-w-[clamp(30rem,50vw,70rem)] px-6"
                            initial={{ opacity: 0, y: 30, filter: "blur(5px)" }}
                            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                            style={{ willChange: "transform, opacity, filter" }}
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
