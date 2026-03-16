import { useEffect } from "react";
import { motion } from "motion/react";
import { X, ExternalLink, TrendingUp, Clock, Zap, Users, Eye, Smartphone } from "lucide-react";

export interface Work {
  id: number;
  title: string;
  category: string;
  description: string;
  fullDescription?: string;
  image: string;
  video?: string;
  tech: string[];
  year: string;
  link?: string;
  metrics?: {
    value: string;
    label: string;
    icon?: "TrendingUp" | "Clock" | "Zap" | "Users" | "Eye" | "Smartphone";
  }[];
}

const IconMap = { TrendingUp, Clock, Zap, Users, Eye, Smartphone };

interface ProjectDetailProps {
  work: Work;
  onClose: () => void;
}

export function ProjectDetail({ work, onClose }: ProjectDetailProps) {
  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-white/80 backdrop-blur-xl"
      onClick={onClose}
    >
      {/* Centra su desktop, full-height su mobile */}
      <div
        className="min-h-screen flex items-stretch md:items-center md:justify-center md:p-6 lg:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          initial={{ opacity: 0, y: 48, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 28, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.85 }}
          className="relative w-full md:max-w-5xl lg:max-w-6xl bg-white flex flex-col
                     md:rounded-[2.5rem] overflow-hidden
                     shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_32px_100px_rgba(0,0,0,0.14)]"
        >

          {/* ══ HERO MEDIA ══ */}
          <div className="relative w-full h-[52vw] min-h-[220px] max-h-[52vh] flex-shrink-0 overflow-hidden bg-zinc-100">
            {work.video ? (
              <motion.video
                src={work.video}
                autoPlay loop muted playsInline
                initial={{ scale: 1.07 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-full h-full object-cover"
              />
            ) : (
              <motion.img
                src={work.image}
                alt={work.title}
                initial={{ scale: 1.07 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            )}

            {/* Gradient: fade image into white card */}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent" />
            {/* Vignette laterale leggera */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(255,255,255,0.35)_100%)]" />

            {/* Year badge — top left */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute top-5 left-5 md:top-7 md:left-7 px-3 py-1.5
                         bg-white/70 backdrop-blur-md border border-zinc-200 rounded-full"
            >
              <span className="text-[11px] font-mono text-zinc-500 tracking-widest uppercase">{work.year}</span>
            </motion.div>

            {/* Close — top right */}
            <motion.button
              onClick={onClose}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              className="absolute top-5 right-5 md:top-7 md:right-7 w-10 h-10 md:w-11 md:h-11
                         bg-white/70 backdrop-blur-md rounded-full flex items-center justify-center
                         border border-zinc-200 hover:bg-white transition-all active:scale-90 z-10
                         shadow-sm"
            >
              <X size={17} className="text-zinc-700" />
            </motion.button>

            {/* Title overlay — bottom of image */}
            <div className="absolute bottom-0 left-0 right-0 px-6 pb-5 md:px-10 md:pb-7 lg:px-12 lg:pb-9">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-zinc-400 text-[11px] font-mono uppercase tracking-widest mb-2"
              >
                {work.category}
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 220, damping: 26 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-bold tracking-tighter
                           text-zinc-900 leading-none"
              >
                {work.title}
              </motion.h2>
            </div>
          </div>

          {/* ══ BODY ══ */}
          <div className="flex flex-col lg:flex-row">

            {/* ── Left: description + cta ── */}
            <div className="flex-1 px-6 py-8 md:px-10 md:py-10 lg:px-12 lg:py-12 flex flex-col">

              {/* Tech tags */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-2 mb-7"
              >
                {work.tech.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1.5 text-[11px] font-mono bg-zinc-50 border border-zinc-200
                               rounded-full text-zinc-600 hover:bg-zinc-100 transition-colors"
                  >
                    {t}
                  </span>
                ))}
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.48 }}
                className="text-zinc-600 text-base md:text-[1.05rem] leading-relaxed font-light mb-8"
              >
                {work.fullDescription || work.description}
              </motion.p>

              {/* Thin divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.52, duration: 0.55, ease: "easeOut" }}
                className="origin-left h-px bg-zinc-100 mb-8"
              />

              {/* CTA */}
              {work.link && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.58 }}
                  className="mt-auto"
                >
                  <a
                    href={work.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-zinc-900 text-white
                               font-semibold text-sm rounded-full hover:bg-black transition-all
                               hover:scale-105 active:scale-95 shadow-[0_4px_24px_rgba(0,0,0,0.12)]"
                  >
                    Visita il Sito
                    <ExternalLink
                      size={14}
                      className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    />
                  </a>
                </motion.div>
              )}
            </div>

            {/* ── Right: metrics ── */}
            {work.metrics && work.metrics.length > 0 && (
              <div
                className="px-6 py-8 md:px-10 md:py-10 lg:px-12 lg:py-12
                           lg:w-[17rem] xl:w-[19rem] flex-shrink-0
                           border-t lg:border-t-0 lg:border-l border-zinc-100
                           flex flex-col gap-3"
              >
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.48 }}
                  className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 mb-1"
                >
                  Risultati chiave
                </motion.p>

                {/* Mobile: scroll orizzontale; desktop: verticale */}
                <div className="flex lg:flex-col gap-3 overflow-x-auto pb-1 lg:pb-0 -mx-1 px-1
                                [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {work.metrics.map((metric, i) => {
                    const IconComponent = metric.icon ? IconMap[metric.icon] : Zap;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.52 + i * 0.09, type: "spring", stiffness: 220, damping: 26 }}
                        className="flex-shrink-0 w-40 lg:w-auto p-5 bg-zinc-50 border border-zinc-100
                                   rounded-2xl hover:bg-zinc-100 transition-colors"
                      >
                        <IconComponent className="w-4 h-4 text-zinc-400 mb-3" />
                        <div className="text-2xl md:text-3xl font-bold text-zinc-900 leading-none mb-1.5">
                          {metric.value}
                        </div>
                        <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wide leading-snug">
                          {metric.label}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ══ FOOTER ══ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.68 }}
            className="px-6 md:px-10 lg:px-12 py-5 border-t border-zinc-100 flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest">
                Live Production
              </span>
            </div>
            <button
              onClick={onClose}
              className="hidden md:block text-[11px] font-mono text-zinc-400
                         hover:text-zinc-700 transition-colors uppercase tracking-widest"
            >
              ESC per chiudere
            </button>
          </motion.div>

        </motion.div>
      </div>
    </motion.div>
  );
}
