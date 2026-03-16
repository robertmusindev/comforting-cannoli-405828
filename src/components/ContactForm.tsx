import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "motion/react";
import { ParallaxHeader } from "./ParallaxHeader";
import { Loader2, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

/* ══════════════════════════════════════════════════
   SCHEMA
══════════════════════════════════════════════════ */
const contactSchema = z.object({
  name: z.string().min(2, "Il nome deve contenere almeno 2 caratteri"),
  email: z.string().email("Inserisci un indirizzo email valido"),
  service: z.string().min(1, "Seleziona un tipo di progetto"),
  message: z.string().min(10, "Il messaggio deve contenere almeno 10 caratteri"),
});
type ContactFormValues = z.infer<typeof contactSchema>;

/* ══════════════════════════════════════════════════
   PROJECT TYPES — basati sul portfolio reale
══════════════════════════════════════════════════ */
const projectTypes = [
  { id: "ai-saas",   label: "AI & SaaS",         desc: "LLM API, prodotti intelligenti" },
  { id: "webapp",    label: "Web App",             desc: "Full stack, dashboard, gestionali" },
  { id: "software",  label: "Software Custom",     desc: "Automazione, logiche su misura" },
  { id: "consulting",label: "Consulenza",          desc: "Architettura, tech strategy" },
];

/* ══════════════════════════════════════════════════
   HERO ANIMATION — pannello sinistro 60fps GPU
══════════════════════════════════════════════════ */
const BADGES = [
  { text: "React",       x: "10%",  y: "14%",  d: 0    },
  { text: "TypeScript",  x: "58%",  y: "8%",   d: 0.5  },
  { text: "Node.js",     x: "72%",  y: "36%",  d: 1.1  },
  { text: "AI API",      x: "5%",   y: "52%",  d: 0.3  },
  { text: "C# / .NET",   x: "62%",  y: "62%",  d: 0.8  },
  { text: "Supabase",    x: "22%",  y: "74%",  d: 1.4  },
  { text: "Vercel",      x: "76%",  y: "80%",  d: 0.6  },
  { text: "PostgreSQL",  x: "38%",  y: "44%",  d: 1.2  },
];

const HeroPanel = () => (
  <div className="relative w-full h-full overflow-hidden bg-zinc-950 min-h-[280px] md:min-h-0">

    {/* Dot grid background */}
    <div
      className="absolute inset-0 opacity-[0.12]"
      style={{
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
        backgroundSize: "26px 26px",
      }}
    />

    {/* Pulsing rings from center */}
    {[120, 220, 330].map((size, i) => (
      <motion.div
        key={size}
        className="absolute rounded-full border border-white/[0.07] pointer-events-none"
        style={{
          width: size,
          height: size,
          top: "38%",
          left: "50%",
          x: "-50%",
          y: "-50%",
        }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.4, 0.75, 0.4] }}
        transition={{ duration: 3.5 + i * 0.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
      />
    ))}

    {/* Central pulsing dot */}
    <motion.div
      className="absolute w-2.5 h-2.5 rounded-full bg-white pointer-events-none"
      style={{ top: "38%", left: "50%", x: "-50%", y: "-50%" }}
      animate={{ scale: [1, 1.6, 1], opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
    />

    {/* Floating tech badges — GPU composited (transform + opacity only) */}
    {BADGES.map((badge, i) => (
      <motion.div
        key={badge.text}
        className="absolute px-2.5 py-1 bg-white/[0.07] border border-white/[0.10] rounded-full
                   text-[10px] font-mono text-white/55 whitespace-nowrap pointer-events-none
                   will-change-transform"
        style={{ left: badge.x, top: badge.y }}
        animate={{ y: [0, -9, 0, 9, 0], opacity: [0.5, 0.85, 0.5] }}
        transition={{
          duration: 4.8 + i * 0.38,
          repeat: Infinity,
          ease: "easeInOut",
          delay: badge.d,
        }}
      >
        {badge.text}
      </motion.div>
    ))}

    {/* Gradient: fade into right panel */}
    <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-r from-transparent to-zinc-950 hidden md:block" />
    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-zinc-950 to-transparent md:hidden" />

    {/* Bottom text overlay */}
    <div className="absolute bottom-0 left-0 right-0 p-7 md:p-8 lg:p-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.35, duration: 0.8 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
            Disponibile ora
          </span>
        </div>

        <h3 className="text-white/90 text-[clamp(1.1rem,1.8vw,1.8rem)] font-semibold
                       tracking-tight leading-snug mb-2">
          Trasformiamo la tua<br />idea in prodotto.
        </h3>

        <div className="flex flex-wrap gap-2 mt-3">
          {["Full Stack", "AI", "Vercel Deploy"].map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-white/[0.07] border border-white/[0.09]
                         rounded-full text-[9px] font-mono text-white/40 uppercase tracking-wider"
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════ */
export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { service: "" },
  });

  const selectedService = watch("service");

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");
    try {
      const res = await fetch("https://formspree.io/f/xkovdoel", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Errore durante l'invio.");
      setSubmitStatus("success");
      reset();
      setValue("service", "");
    } catch (err: any) {
      setSubmitStatus("error");
      setErrorMessage(err.message || "Qualcosa è andato storto. Riprova più tardi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative pt-0 pb-[clamp(1rem,2vw,3rem)] 2xl:pt-0 2xl:pb-0
                 bg-white overflow-hidden min-h-screen flex flex-col justify-start md:justify-center"
    >
      {/* Parallax title — identico a Expertise e Progetti */}
      <ParallaxHeader baseVelocity={1.5}>CONTATTI</ParallaxHeader>

      {/* Mac window wrapper */}
      <div className="w-[100vw] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]
                      px-[clamp(0.5rem,1.5vw,3vw)] flex justify-center
                      relative z-10 flex-grow items-center 2xl:mt-4">
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.95, rotateX: 10 }}
          whileInView={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, type: "spring", bounce: 0.3 }}
          style={{ perspective: "1500px" }}
          className="w-full max-w-[min(98vw,180rem)]
                     h-auto md:min-h-[60vh] md:max-h-[80vh] 2xl:min-h-[85vh] 2xl:max-h-[92vh]
                     flex flex-col bg-white
                     rounded-[clamp(0.5rem,2vw,3rem)]
                     shadow-[0_20px_50px_rgba(0,0,0,0.1)]
                     border border-zinc-200/50 overflow-hidden transform-gpu"
        >
          {/* ── Window chrome ── */}
          <div className="bg-white/80 backdrop-blur-md border-b border-zinc-200/50
                          px-[clamp(1rem,2vw,2.5rem)] py-[clamp(0.5rem,1vw,1.25rem)]
                          flex items-center gap-[clamp(0.5rem,0.8vw,1.5rem)]
                          sticky top-0 z-10 flex-shrink-0">
            <div className="flex gap-[clamp(0.5rem,0.6vw,1.25rem)]">
              <div className="w-[clamp(0.75rem,0.8vw,1.25rem)] h-[clamp(0.75rem,0.8vw,1.25rem)] rounded-full bg-[#FF5F57] border border-[#E0443E]" />
              <div className="w-[clamp(0.75rem,0.8vw,1.25rem)] h-[clamp(0.75rem,0.8vw,1.25rem)] rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
              <div className="w-[clamp(0.75rem,0.8vw,1.25rem)] h-[clamp(0.75rem,0.8vw,1.25rem)] rounded-full bg-[#28C840] border border-[#1AAB29]" />
            </div>
            <div className="ml-[clamp(1rem,2vw,3rem)] text-[clamp(0.8rem,1vw,1.2rem)] font-medium
                            text-zinc-400 font-mono flex-1 text-center
                            pr-[clamp(3rem,6vw,8rem)] tracking-tight">
              robert_musin_contact.tsx
            </div>
          </div>

          {/* ── Body: dark panel + form ── */}
          <div className="flex flex-col md:flex-row flex-1 min-h-0">

            {/* Left: animated dark hero */}
            <div className="w-full md:w-[38%] lg:w-[36%] xl:w-[34%] flex-shrink-0">
              <HeroPanel />
            </div>

            {/* Right: form — scrollable on small screens */}
            <div className="flex-1 md:overflow-y-auto custom-scrollbar
                            p-[clamp(1.25rem,2.5vw,3.5rem)]">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-[clamp(1.25rem,2vw,2.5rem)] h-full"
              >
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15 }}
                >
                  <h2 className="text-[clamp(1.4rem,2.2vw,2.4rem)] 2xl:text-[clamp(2rem,2.8vw,3.5rem)]
                                 font-medium tracking-tight text-zinc-900 leading-tight mb-1">
                    Iniziamo qualcosa<br className="hidden sm:block" /> di straordinario.
                  </h2>
                  <p className="text-zinc-400 text-[clamp(0.8rem,1vw,1rem)] font-light">
                    Risposta garantita entro 24&nbsp;ore.
                  </p>
                </motion.div>

                {/* Project type */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.22 }}
                >
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-3">
                    Di cosa hai bisogno?
                  </label>
                  <div className="grid grid-cols-2 gap-2 md:gap-3">
                    {projectTypes.map((type, i) => (
                      <motion.button
                        key={type.id}
                        type="button"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.28 + i * 0.07 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setValue("service", type.id, { shouldValidate: true })}
                        className={`group flex flex-col gap-0.5 p-3 md:p-4 rounded-xl md:rounded-2xl
                                    text-left border transition-all duration-200
                                    ${selectedService === type.id
                                      ? "bg-zinc-900 border-zinc-900 shadow-lg"
                                      : "bg-zinc-50 border-zinc-100 hover:border-zinc-300 hover:bg-white"
                                    }`}
                      >
                        <span className={`text-[clamp(0.8rem,1vw,0.95rem)] font-semibold leading-tight
                                          ${selectedService === type.id ? "text-white" : "text-zinc-800"}`}>
                          {type.label}
                        </span>
                        <span className={`text-[10px] font-mono leading-tight
                                          ${selectedService === type.id ? "text-zinc-400" : "text-zinc-400"}`}>
                          {type.desc}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                  {errors.service && (
                    <p className="text-red-500 text-xs mt-2">{errors.service.message}</p>
                  )}
                </motion.div>

                {/* Name + Email */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4"
                >
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      Nome
                    </label>
                    <input
                      {...register("name")}
                      placeholder="Il tuo nome"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3
                                 text-zinc-900 text-sm focus:outline-none focus:ring-2
                                 focus:ring-black/5 focus:border-zinc-900 transition-all
                                 placeholder:text-zinc-400"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs">{errors.name.message}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      Email
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      placeholder="tu@email.com"
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3
                                 text-zinc-900 text-sm focus:outline-none focus:ring-2
                                 focus:ring-black/5 focus:border-zinc-900 transition-all
                                 placeholder:text-zinc-400"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs">{errors.email.message}</p>
                    )}
                  </div>
                </motion.div>

                {/* Message */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.36 }}
                  className="space-y-1.5"
                >
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    Messaggio
                  </label>
                  <textarea
                    {...register("message")}
                    rows={4}
                    placeholder="Raccontami del tuo progetto o idea..."
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3
                               text-zinc-900 text-sm focus:outline-none focus:ring-2
                               focus:ring-black/5 focus:border-zinc-900 transition-all
                               placeholder:text-zinc-400 resize-none"
                  />
                  {errors.message && (
                    <p className="text-red-500 text-xs">{errors.message.message}</p>
                  )}
                </motion.div>

                {/* Submit */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.42 }}
                  className="mt-auto"
                >
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-zinc-900 text-white font-semibold rounded-2xl
                               py-[clamp(0.9rem,1.2vw,1.25rem)] px-6
                               flex items-center justify-center gap-2
                               hover:bg-black transition-all disabled:opacity-60
                               disabled:cursor-not-allowed group
                               text-[clamp(0.85rem,1vw,1rem)]
                               shadow-[0_4px_24px_rgba(0,0,0,0.12)]"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={18} />
                    ) : (
                      <>
                        Invia Richiesta
                        <ArrowRight
                          size={16}
                          className="group-hover:translate-x-1 transition-transform"
                        />
                      </>
                    )}
                  </motion.button>
                </motion.div>

                {/* Status */}
                <AnimatePresence>
                  {submitStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-emerald-50 text-emerald-600 p-4 rounded-xl
                                 flex items-center gap-3 text-sm font-medium"
                    >
                      <CheckCircle2 size={18} />
                      Messaggio inviato! Ti risponderò presto.
                    </motion.div>
                  )}
                  {submitStatus === "error" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-red-50 text-red-600 p-4 rounded-xl
                                 flex items-center gap-3 text-sm font-medium"
                    >
                      <AlertCircle size={18} />
                      {errorMessage}
                    </motion.div>
                  )}
                </AnimatePresence>

              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
