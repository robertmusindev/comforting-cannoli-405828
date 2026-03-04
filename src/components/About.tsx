import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "motion/react";

/* ─── EXPERTISE DATA ─── */
const expertiseData = [
    {
        emoji: "🤖",
        title: "Integrazione AI e Prompt Design",
        description: "Non mi limito a usare l'AI come utente finale tramite interfacce standard. Lavoro direttamente con le API dei modelli più avanzati (come Gemini e Anthropic) per creare soluzioni su misura. So come strutturare prompt complessi e logiche di contesto affinché l'intelligenza artificiale non solo restituisca dati corretti, ma riesca a replicare fedelmente lo stile, il tono e l'emozione che un brand vuole comunicare."
    },
    {
        emoji: "⚡",
        title: "Prototipazione Rapida e Sviluppo AI-Assisted",
        description: "Il mio workflow è progettato per la velocità. Sfrutto quotidianamente strumenti di AI-assisted coding come Cursor e Antigravity per abbattere i tempi di sviluppo. Questo approccio mi permette di generare logiche complesse, eseguire debug in tempo reale e passare da una semplice idea a una demo interattiva in tempi brevissimi."
    },
    {
        emoji: "🗄️",
        title: "Backend Agile e Architetture Dati",
        description: "Costruire prototipi veloci non significa rinunciare a fondamenta solide. Utilizzo Supabase come ecosistema di riferimento per implementare database relazionali (PostgreSQL), sistemi di autenticazione e logiche serverless in pochissimi minuti. È la soluzione ideale per dare una struttura dati reale a un Proof of Concept saltando a piè pari i colli di bottiglia del setup backend tradizionale."
    },
    {
        emoji: "🧩",
        title: "Automazioni e Logica Low-Code",
        description: "Credo fermamente che non abbia senso reinventare la ruota. Se un processo aziendale può essere ottimizzato senza dover scrivere migliaia di righe di codice da zero, scelgo quella strada. Utilizzo piattaforme come Make.com per orchestrare flussi di lavoro complessi, facendo comunicare in modo intelligente API, database e servizi di terze parti."
    },
    {
        emoji: "📈",
        title: "Connessione MarTech e Soluzioni Business",
        description: "I software generano vero valore solo quando comunicano tra loro. Ho esperienza nel far dialogare strumenti custom con l'ecosistema aziendale esistente: CRM, piattaforme di Analytics e sistemi di advertising. Il mio obiettivo è prendere un'esigenza di business (ad esempio: \"vogliamo automatizzare e personalizzare queste campagne in base al target\") e tradurla rapidamente in una soluzione tecnica fattibile."
    }
];

/* ─── SINGLE EXPERTISE ITEM COMPONENT ─── */
const ExpertiseItem = ({
    key,
    item,
    index
}: {
    key?: React.Key,
    item: typeof expertiseData[0],
    index: number
}) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <motion.div
            ref={ref}
            className="py-12 md:py-16 border-t border-white/10 group"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className="flex flex-col md:flex-row gap-6 md:gap-12">
                {/* Number / Emoji Column */}
                <div className="flex-shrink-0 md:w-24">
                    <span className="text-4xl filter grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 block transform group-hover:scale-110 group-hover:-rotate-3 origin-center">
                        {item.emoji}
                    </span>
                    <span className="text-zinc-600 font-mono text-xs mt-4 block">0{index + 1}</span>
                </div>

                {/* Content Column */}
                <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl text-white font-medium tracking-tight mb-4 group-hover:text-zinc-200 transition-colors duration-300">
                        {item.title}
                    </h3>
                    <p className="text-zinc-400 text-base md:text-[17px] leading-[1.8] font-light md:pr-8">
                        {item.description}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

/* ─── MAIN COMPONENT ─── */
export function About() {
    const sectionRef = useRef<HTMLElement>(null);

    // Transition background color from white to black as user scrolls into this section
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start center", "end end"]
    });
    const backgroundColor = useTransform(scrollYProgress, [0, 0.15], ["#ffffff", "#09090b"]);
    const dividerOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);

    return (
        <motion.section
            ref={sectionRef}
            style={{ backgroundColor }}
            className="relative w-full min-h-screen transition-colors duration-0"
        >
            {/* Subtle top divider that fades in as background gets dark */}
            <motion.div
                style={{ opacity: dividerOpacity }}
                className="absolute top-0 left-0 right-0 h-[1px] bg-white/10"
            />

            <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

                    {/* ── LEFT COLUMN: STICKY MANIFESTO ── */}
                    <div className="lg:col-span-5 relative">
                        <div className="lg:sticky lg:top-32 pt-24 pb-12 lg:pb-32">

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                className="flex items-center gap-4 mb-12"
                            >
                                <div className="w-12 h-[1px] bg-zinc-600" />
                                <span className="text-[11px] uppercase tracking-[0.3em] text-zinc-500 font-medium">Il mio approccio</span>
                            </motion.div>

                            <motion.h2
                                className="text-3xl md:text-4xl lg:text-5xl text-white font-medium tracking-tight leading-[1.2] mb-10"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                            >
                                Costruisco il ponte tra le potenzialità dell'<span className="text-zinc-400">Intelligenza Artificiale</span> e le reali esigenze del marketing. In poche ore, non in settimane.
                            </motion.h2>

                            <motion.p
                                className="text-lg md:text-xl text-zinc-500 font-light leading-relaxed border-l border-zinc-800 pl-6"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                            >
                                Non sono il classico sviluppatore che si perde in mesi di pianificazione per un'architettura perfetta: la mia passione è "sporcarmi le mani" subito, testare tecnologie emergenti e dimostrare il valore di un'idea costruendo prototipi funzionanti a tempo di record.
                            </motion.p>

                            {/* Animated decorative element */}
                            <motion.div
                                className="hidden lg:block mt-24 w-12 h-12 rounded-full border border-white/10 relative"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: 0.5 }}
                            >
                                <motion.div
                                    className="absolute inset-0 rounded-full border border-white/20 border-t-transparent"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center text-white/30 text-xs">
                                    ↓
                                </div>
                            </motion.div>

                        </div>
                    </div>

                    {/* ── RIGHT COLUMN: EXPERTISE LIST (SCROLLABLE) ── */}
                    <div className="lg:col-span-7 pt-12 lg:pt-32 pb-32">

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="mb-12"
                        >
                            <h3 className="text-lg text-zinc-300 font-medium tracking-wide">
                                Come lavoro e cosa so fare
                            </h3>
                        </motion.div>

                        {/* List of Expertise Items */}
                        <div className="flex flex-col">
                            {expertiseData.map((item, i) => (
                                <ExpertiseItem key={i} item={item} index={i} />
                            ))}
                        </div>

                        {/* Bottom boundary line */}
                        <motion.div
                            className="h-[1px] bg-white/10 w-full"
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                            style={{ transformOrigin: "left" }}
                        />

                    </div>

                </div>
            </div>
        </motion.section>
    );
}
