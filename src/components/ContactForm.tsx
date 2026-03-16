import { useState, useRef, useContext } from "react";
import { useForm } from "react-hook-form";
import { ScrollContext } from "../App";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue, useVelocity, useAnimationFrame } from "motion/react";

import { ParallaxHeader } from "./ParallaxHeader";
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
    <section id="contact" className="py-0 pb-[clamp(3rem,5vw,8rem)] relative overflow-hidden w-[100vw] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-zinc-50">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-zinc-200/50 rounded-full blur-[100px] opacity-40 transform-gpu will-change-transform" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-zinc-200/50 rounded-full blur-[100px] opacity-40 transform-gpu will-change-transform" />
      </div>

      {/* Parallax Header */}
      <ParallaxHeader baseVelocity={1.5}>CONTATTI</ParallaxHeader>

      <div className="w-[clamp(40rem,60vw,80rem)] max-w-[90vw] mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white rounded-[clamp(1.5rem,2vw,3rem)] shadow-2xl border border-zinc-100 overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-5">
            {/* Left Panel: Info & Context */}
            <div className="lg:col-span-2 bg-white text-black p-[clamp(1.5rem,3vw,4rem)] flex flex-col justify-between relative overflow-hidden border-b lg:border-r lg:border-b-0 border-zinc-100">
              <div className="relative z-10">
                <h2 className="text-[clamp(1.5rem,2.5vw,3rem)] font-medium tracking-tight mb-[clamp(1rem,1.5vw,2rem)] text-zinc-900 leading-tight">
                  Iniziamo un progetto insieme.
                </h2>
                <p className="text-zinc-600 font-light leading-relaxed mb-8 text-[clamp(1rem,1.2vw,1.5rem)]">
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
            <div className="lg:col-span-3 p-[clamp(1.5rem,3vw,4rem)] bg-white">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-[clamp(1.5rem,3vw,4rem)]">

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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
