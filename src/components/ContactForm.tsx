import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue, useVelocity, useAnimationFrame } from "motion/react";

import { Loader2, CheckCircle2, AlertCircle, ArrowRight, Send } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Il nome deve contenere almeno 2 caratteri"),
  email: z.string().email("Inserisci un indirizzo email valido"),
  company: z.string().optional(),
  service: z.string().min(1, "Seleziona un tipo di servizio"),
  message: z.string().min(10, "Il messaggio deve contenere almeno 10 caratteri"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const services = [
  "Sito Web",
  "Web App",
  "E-commerce",
  "Consulenza",
  "Altro"
];

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
    defaultValues: {
      service: "",
    }
  });

  const selectedService = watch("service");

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("https://formspree.io/f/xkovdoel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Errore durante l'invio del messaggio.");
      }

      setSubmitStatus("success");
      reset();
      setValue("service", ""); // Reset service selection
    } catch (err: any) {
      console.error("Errore durante l'invio:", err);
      setSubmitStatus("error");
      setErrorMessage(err.message || "Qualcosa è andato storto. Riprova più tardi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-0 pb-10 relative overflow-hidden w-full">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-zinc-200/50 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-zinc-200/50 rounded-full blur-3xl opacity-50" />
      </div>

      {/* Parallax Text Header */}
      <div className="relative py-4 mb-2 w-full pointer-events-none z-0">
        <ParallaxText baseVelocity={1}>CONTATTI • </ParallaxText>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-24 relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white rounded-3xl shadow-2xl border border-zinc-100 overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-5">
            {/* Left Panel: Info & Context */}
            <div className="lg:col-span-2 bg-white text-black p-10 flex flex-col justify-between relative overflow-hidden border-b lg:border-r lg:border-b-0 border-zinc-100">
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-6 text-zinc-900">
                  Iniziamo un progetto insieme.
                </h2>
                <p className="text-zinc-600 font-light leading-relaxed mb-8">
                  Hai un'idea o un prodotto da scalare? Compila il form e costruiamo qualcosa di straordinario.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-sm text-zinc-600">
                    <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
                    Disponibile per nuovi progetti
                  </div>
                  <div className="text-zinc-500 text-xs font-mono">
                    Risposta media: 24 ore
                  </div>
                </div>
              </div>

              {/* Decorative Circles */}
              <div className="absolute bottom-[-50px] right-[-50px] w-64 h-64 border border-zinc-200 rounded-full" />
              <div className="absolute bottom-[-20px] right-[-20px] w-32 h-32 border border-zinc-200 rounded-full" />
            </div>

            {/* Right Panel: Form */}
            <div className="lg:col-span-3 p-10 bg-white">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                {/* Service Selection */}
                <div className="space-y-4">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    Di cosa hai bisogno?
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {services.map((service) => (
                      <button
                        key={service}
                        type="button"
                        onClick={() => setValue("service", service, { shouldValidate: true })}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${selectedService === service
                          ? "bg-black text-white border-black shadow-lg scale-105"
                          : "bg-white text-zinc-600 border-zinc-200 hover:border-black hover:text-black hover:bg-zinc-50"
                          }`}
                      >
                        {service}
                      </button>
                    ))}
                  </div>
                  {errors.service && <p className="text-red-500 text-xs">{errors.service.message}</p>}
                </div>

                {/* Inputs */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Nome</label>
                      <input
                        {...register("name")}
                        id="name"
                        className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all placeholder:text-zinc-400"
                        placeholder="Il tuo nome"
                      />
                      {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Email</label>
                      <input
                        {...register("email")}
                        id="email"
                        type="email"
                        className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all placeholder:text-zinc-400"
                        placeholder="tu@email.com"
                      />
                      {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Messaggio</label>
                    <textarea
                      {...register("message")}
                      id="message"
                      rows={4}
                      className="w-full bg-white border border-zinc-200 rounded-xl px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all placeholder:text-zinc-400 resize-none"
                      placeholder="Raccontami del tuo progetto..."
                    />
                    {errors.message && <p className="text-red-500 text-xs">{errors.message.message}</p>}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-black text-white font-bold rounded-xl py-4 px-6 flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        Invia Richiesta
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>

                {/* Status Messages */}
                <AnimatePresence>
                  {submitStatus === "success" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-emerald-50 text-emerald-600 p-4 rounded-xl flex items-center gap-3 text-sm font-medium"
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
                      className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm font-medium"
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
