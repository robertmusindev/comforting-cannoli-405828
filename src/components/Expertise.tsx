import { motion, useScroll, useTransform, useSpring, useMotionValue, useVelocity, useAnimationFrame } from "motion/react";
import { useRef, useContext, useMemo } from "react";
import { ScrollContext } from "../App";

// Utility for wrapping numbers
const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};
import { ParallaxHeader } from "./ParallaxHeader";
/* ═══════════════════════════════════════════════════
   1. FRONTEND ANIMATION — Code Editor & Live Preview
   ═══════════════════════════════════════════════════ */
const FrontendAnimation = () => {
  return (
    <div className="w-full h-full min-h-[14rem] bg-white rounded-xl border border-zinc-200 overflow-hidden relative shadow-sm group-hover:shadow-md hover:-translate-y-1 transition-all duration-500 will-change-transform transform-gpu">
      {/* Browser UI */}
      <div className="h-6 bg-zinc-50 border-b border-zinc-100 flex items-center px-3 gap-1.5">
        <div className="w-2 h-2 rounded-full bg-zinc-300" />
        <div className="w-2 h-2 rounded-full bg-zinc-300" />
        <div className="w-16 h-3 bg-zinc-200 rounded-full ml-2 opacity-50" />
      </div>

      <div className="relative w-full h-full p-3 flex flex-col">
        {/* Tabs */}
        <div className="flex gap-2 mb-2">
          {['HTML', 'CSS', 'JS'].map((tab, i) => (
            <motion.div
              key={tab}
              className="px-2 py-1 text-xs rounded-md bg-zinc-100 text-zinc-600 font-medium cursor-default"
              animate={{ 
                backgroundColor: i === 0 ? ['rgb(244 244 245)', 'rgb(228 228 231)', 'rgb(244 244 245)'] : 'rgb(244 244 245)',
                scale: i === 0 ? [1, 1.05, 1] : 1
              }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
            >
              {tab}
            </motion.div>
          ))}
        </div>

        {/* Code Editor & Preview */}
        <div className="flex-1 grid grid-cols-2 gap-3">
          {/* Code Editor */}
          <div className="bg-zinc-50 rounded-md p-3 overflow-hidden">
            <div className="flex gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <div className="w-2 h-2 rounded-full bg-yellow-400" />
              <div className="w-2 h-2 rounded-full bg-green-400" />
            </div>
            <div className="space-y-1">
              {[
                { text: '<div className="card">', width: '90%' },
                { text: '  <h3>Premium UI</h3>', width: '80%' },
                { text: '  <p>60fps animations</p>', width: '85%' },
                { text: '  <button>Interact</button>', width: '75%' },
                { text: '</div>', width: '40%' },
              ].map((line, i) => (
                <motion.div
                  key={i}
                  className="h-2 bg-zinc-200 rounded"
                  initial={{ width: 0 }}
                  animate={{ width: line.width }}
                  transition={{ duration: 0.8, delay: i * 0.2, repeat: Infinity, repeatDelay: 3 }}
                  style={{ willChange: 'width' }}
                />
              ))}
            </div>
          </div>

          {/* Live Preview */}
          <div className="bg-white border border-zinc-200 rounded-md p-3 flex flex-col items-center justify-center">
            {/* Responsive device frame */}
            <div className="relative w-16 h-24 border-2 border-zinc-300 rounded-lg mb-2 overflow-hidden">
              {/* Screen content */}
              <motion.div 
                className="absolute inset-1 bg-gradient-to-br from-blue-50 to-purple-50"
                animate={{ 
                  background: [
                    'linear-gradient(135deg, #f0f9ff 0%, #fdf2ff 100%)',
                    'linear-gradient(135deg, #e0f2fe 0%, #fae8ff 100%)',
                    'linear-gradient(135deg, #f0f9ff 0%, #fdf2ff 100%)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              {/* UI elements */}
              <motion.div 
                className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-zinc-300 rounded"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div 
                className="absolute top-6 left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"
                animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-10 h-2 bg-zinc-800 rounded-full"
                animate={{ width: ['2.5rem', '3rem', '2.5rem'] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            
            {/* Tech icons */}
            <div className="flex gap-1 mt-2">
              {['React', 'Vue', 'TS', 'TW'].map((tech, i) => (
                <motion.div
                  key={tech}
                  className="px-2 py-0.5 text-[10px] bg-zinc-100 rounded text-zinc-600"
                  animate={{ 
                    y: [0, -2, 0],
                    backgroundColor: ['rgb(244 244 245)', 'rgb(228 228 231)', 'rgb(244 244 245)']
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                >
                  {tech}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance indicator */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <div className="flex items-center gap-1">
            <motion.div 
              className="w-2 h-2 rounded-full bg-green-500"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span className="text-xs text-zinc-500">60fps</span>
          </div>
          <div className="text-xs text-zinc-400">|</div>
          <div className="text-xs text-zinc-500">GPU accelerated</div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   2. BACKEND ANIMATION — API, Database, Server
   ═══════════════════════════════════════════════════ */
const BackendAnimation = () => {
  return (
    <div className="w-full h-full min-h-[14rem] bg-white rounded-xl border border-zinc-200 overflow-hidden relative shadow-sm group-hover:shadow-md hover:-translate-y-1 transition-all duration-500 will-change-transform transform-gpu">
      {/* Browser UI */}
      <div className="h-6 bg-zinc-50 border-b border-zinc-100 flex items-center px-3 gap-1.5">
        <div className="w-2 h-2 rounded-full bg-zinc-300" />
        <div className="w-2 h-2 rounded-full bg-zinc-300" />
        <div className="w-16 h-3 bg-zinc-200 rounded-full ml-2 opacity-50" />
      </div>

      <div className="relative w-full h-full p-3 flex flex-col">
        {/* API Endpoints - More compact */}
        <div className="mb-3">
          <div className="text-xs text-zinc-400 font-medium mb-1">API Endpoints</div>
          <div className="space-y-0.5">
            {['GET /api/users', 'POST /api/auth', 'POST /api/llm/chat', 'PUT /api/data'].map((endpoint, i) => (
              <motion.div
                key={endpoint}
                className="flex items-center gap-1.5"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
              >
                <motion.div 
                  className="w-1.5 h-1.5 rounded-full"
                  animate={{ 
                    backgroundColor: [
                      'rgb(34 197 94)',  // green
                      'rgb(59 130 246)', // blue  
                      'rgb(234 179 8)',  // yellow
                      'rgb(239 68 68)',  // red
                      'rgb(34 197 94)',  // green
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                />
                <div className="text-[11px] font-mono text-zinc-600 truncate">{endpoint}</div>
                <motion.div 
                  className="ml-auto w-6 h-1 bg-zinc-200 rounded-full overflow-hidden"
                  animate={{ scaleX: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Database & Server Visualization - More compact */}
        <div className="flex-1 grid grid-cols-2 gap-2">
          {/* Database Section */}
          <div className="bg-gradient-to-br from-zinc-50 to-blue-50 rounded p-2 flex flex-col">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <div className="text-[11px] font-medium text-zinc-700 truncate">PostgreSQL</div>
            </div>
            
            {/* Database tables */}
            <div className="space-y-1 flex-1">
              {['users', 'products', 'orders', 'analytics'].map((table, i) => (
                <motion.div
                  key={table}
                  className="bg-white/80 border border-zinc-200 rounded px-1.5 py-1"
                  animate={{ 
                    boxShadow: [
                      '0 0 0 0 rgba(59, 130, 246, 0)',
                      '0 0 0 1px rgba(59, 130, 246, 0.3)',
                      '0 0 0 0 rgba(59, 130, 246, 0)'
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.8 }}
                >
                  <div className="flex justify-between items-center">
                    <div className="text-[9px] font-medium text-zinc-600 truncate">{table}</div>
                    <motion.div 
                      className="w-1.5 h-1.5 rounded-full bg-blue-400"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
                    />
                  </div>
                  <motion.div 
                    className="h-0.5 bg-blue-200 rounded-full mt-0.5"
                    initial={{ width: 0 }}
                    animate={{ width: ['0%', '100%', '0%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.6 }}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Server Section */}
          <div className="bg-gradient-to-br from-zinc-50 to-emerald-50 rounded p-2 flex flex-col">
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <div className="text-[11px] font-medium text-zinc-700 truncate">Node.js · Python · C# · .NET</div>
            </div>
            
            {/* Server processes */}
            <div className="space-y-1.5 flex-1">
              {[
                { name: 'Auth', cpu: 30 },
                { name: 'LLM API', cpu: 72 },
                { name: 'API Gateway', cpu: 45 },
              ].map((process, i) => (
                <div key={process.name} className="space-y-0.5">
                  <div className="flex justify-between items-center">
                    <div className="text-[9px] font-medium text-zinc-600 truncate">{process.name}</div>
                    <div className="text-[9px] text-zinc-400">{process.cpu}%</div>
                  </div>
                  <div className="h-1 bg-zinc-200 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${process.cpu}%` }}
                      transition={{ duration: 0.8, delay: i * 0.3 }}
                    />
                  </div>
                </div>
              ))}
              
              {/* Server activity indicator */}
              <div className="mt-2 pt-1.5 border-t border-zinc-200">
                <div className="flex items-center gap-1">
                  <motion.div 
                    className="w-1 h-1 rounded-full bg-emerald-500"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <div className="text-[9px] text-zinc-500">Processing</div>
                  <div className="ml-auto">
                    <motion.div 
                      className="w-3 h-3 border border-emerald-400 border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Bar - More compact */}
        <div className="mt-2 pt-1.5 border-t border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              <motion.div 
                className="w-1 h-1 rounded-full bg-green-500"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-[10px] text-zinc-500">Online</span>
            </div>
            <div className="text-[10px] text-zinc-400">|</div>
            <div className="text-[10px] text-zinc-500">99.9% uptime</div>
          </div>
          <div className="text-[10px] text-zinc-400 font-mono">~2ms</div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   3. END-TO-END SOLUTION ANIMATION — Product Lifecycle (Responsive)
   ═══════════════════════════════════════════════════ */
const EndToEndAnimation = () => {
  const phases = [
    { label: "Ideazione", icon: "💡", color: "from-blue-400 to-cyan-400" },
    { label: "Design", icon: "🎨", color: "from-purple-400 to-pink-400" },
    { label: "Sviluppo", icon: "⚡", color: "from-green-400 to-emerald-400" },
    { label: "Testing", icon: "🧪", color: "from-yellow-400 to-orange-400" },
    { label: "Deploy", icon: "🚀", color: "from-red-400 to-rose-400" },
  ];

  return (
    <div className="w-full h-full min-h-[14rem] bg-white rounded-xl border border-zinc-200 overflow-hidden relative shadow-sm group-hover:shadow-md hover:-translate-y-1 transition-all duration-500 will-change-transform transform-gpu">
      {/* Browser UI */}
      <div className="h-6 bg-zinc-50 border-b border-zinc-100 flex items-center px-3 gap-1.5">
        <div className="w-2 h-2 rounded-full bg-zinc-300" />
        <div className="w-2 h-2 rounded-full bg-zinc-300" />
        <div className="w-16 h-3 bg-zinc-200 rounded-full ml-2 opacity-50" />
      </div>

      <div className="relative w-full h-full p-3 md:p-4 flex flex-col">
        {/* Timeline Header */}
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className="text-xs text-zinc-400 font-medium">Product Lifecycle</div>
          <div className="flex items-center gap-1">
            <motion.div 
              className="w-1.5 h-1.5 rounded-full bg-green-500"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-xs text-zinc-500">Live</span>
          </div>
        </div>

        {/* Animated Timeline - Responsive */}
        <div className="flex-1 relative min-h-[120px] md:min-h-[140px]">
          {/* Timeline line - hide on very small screens */}
          <div className="hidden sm:block absolute left-0 right-0 top-1/2 h-0.5 bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200 -translate-y-1/2" />
          
          {/* For mobile: flex centrato */}
          <div className="sm:hidden flex flex-wrap justify-center gap-3 h-full items-center">
            {phases.map((phase, i) => (
              <motion.div
                key={phase.label}
                className="flex flex-col items-center"
                animate={{ 
                  y: [0, -4, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  delay: i * 0.3 
                }}
              >
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br ${phase.color} flex items-center justify-center shadow-md`}>
                  <span className="text-sm md:text-lg">{phase.icon}</span>
                </div>
                <div className="text-[9px] md:text-[10px] font-medium text-zinc-700 mt-1 text-center">{phase.label}</div>
              </motion.div>
            ))}
          </div>

          {/* For desktop: flexbox layout — perfectly centered, no overflow */}
          <div className="hidden sm:flex items-center justify-between w-full h-full relative">
            {/* Timeline line */}
            <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gradient-to-r from-zinc-200 via-zinc-300 to-zinc-200 -translate-y-1/2 pointer-events-none" />

            {/* Progress dot */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 rounded-full bg-white border-2 border-zinc-800 shadow-lg z-20 pointer-events-none"
              animate={{ left: ["0%", "100%", "0%"] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />

            {phases.map((phase, i) => (
              <div key={phase.label} className="flex flex-col items-center relative z-10">
                <motion.div
                  className="relative"
                  animate={{ y: [0, -6, 0], scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                >
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br ${phase.color} flex items-center justify-center shadow-lg`}>
                    <span className="text-sm md:text-lg">{phase.icon}</span>
                  </div>
                  <motion.div
                    className="absolute inset-0 rounded-full opacity-30"
                    style={{ background: "inherit" }}
                    animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                  />
                </motion.div>
                <motion.div
                  className="mt-1 whitespace-nowrap"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.2 }}
                >
                  <div className="text-[9px] md:text-[10px] font-medium text-zinc-700 text-center">{phase.label}</div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Deployment Pipeline Visualization */}
        <div className="mt-4 md:mt-6 grid grid-cols-3 gap-1 md:gap-2">
          {['Dev', 'Stage', 'Vercel'].map((env, i) => (
            <motion.div
              key={env}
              className="bg-zinc-50 rounded md:rounded-md p-1.5 md:p-2 flex flex-col items-center"
              animate={{ 
                backgroundColor: i === 2 ? ['rgb(244 244 245)', 'rgb(229 231 235)', 'rgb(244 244 245)'] : 'rgb(244 244 245)',
                borderColor: i === 2 ? ['rgb(209 213 219)', 'rgb(59 130 246)', 'rgb(209 213 219)'] : 'rgb(209 213 219)'
              }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 1 }}
            >
              <div className="text-[10px] md:text-xs font-medium text-zinc-600">{env}</div>
              <div className="flex items-center gap-0.5 md:gap-1 mt-0.5 md:mt-1">
                <motion.div 
                  className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-green-500"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.5 }}
                />
                <div className="text-[9px] md:text-[10px] text-zinc-400">Active</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Performance Metrics */}
        <div className="mt-3 md:mt-4 pt-2 md:pt-3 border-t border-zinc-200 flex items-center justify-between">
          <div className="flex items-center gap-1 md:gap-2">
            <div className="flex items-center gap-0.5 md:gap-1">
              <motion.div 
                className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-blue-500"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <span className="text-[10px] md:text-xs text-zinc-500">CI/CD</span>
            </div>
            <div className="text-[10px] md:text-xs text-zinc-400">|</div>
            <div className="text-[10px] md:text-xs text-zinc-500 hidden xs:inline">Auto-scaling</div>
          </div>
          <div className="text-[10px] md:text-xs text-zinc-400 font-mono">99.99%</div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   EXPERTISE DATA
   ═══════════════════════════════════════════════════ */
const expertiseAreas = [
  {
    title: "Eccellenza nel Frontend",
    description: "Architettura di interfacce utente reattive e accessibili con React e Vue.js. Attento alla semantica HTML5, all'estetica CSS3 e alla rapidità di sviluppo con Tailwind CSS per esperienze utente premium.",
    animation: FrontendAnimation,
  },
  {
    title: "Backend Solido & Dati",
    description: "Sviluppo di API robuste con Node.js, Python, C# e .NET. Integro LLM tramite API (OpenAI, Claude) per funzionalità AI native. Database relazionali con PostgreSQL per una gestione dati sicura e scalabile.",
    animation: BackendAnimation,
  },
  {
    title: "Soluzioni End-to-End",
    description: "Visione completa del ciclo di vita del prodotto. Dallo schema al deployment su Vercel, creo applicazioni web scalabili e ad alte prestazioni, garantendo coerenza e manutenibilità in ogni fase.",
    animation: EndToEndAnimation,
  },
];

/* ═══════════════════════════════════════════════════
   PREMIUM STAGGERED REVEAL TEXT
   ═══════════════════════════════════════════════════ */
const StaggeredTextReveal = ({ text, className, delayOffset = 0 }: { text: string; className?: string; delayOffset?: number }) => {
  const words = text.split(" ");
  
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: delayOffset * i },
    }),
  };

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
      y: 20,
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
      viewport={{ once: true, margin: "-50px" }}
      className={className}
    >
      {words.map((word, index) => (
        <motion.span
          variants={child}
          style={{ display: "inline-block", marginRight: "0.25em", willChange: "transform, opacity, filter" }}
          key={index}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};


/* ═══════════════════════════════════════════════════
   PARALLAX TEXT WITH GLOW EFFECT
   ═══════════════════════════════════════════════════ */
function ParallaxText({ children, baseVelocity = 100 }: { children: string; baseVelocity: number }) {
  const baseX = useMotionValue(0);
  const mainScrollContainer = useContext(ScrollContext);
  const { scrollY } = useScroll({ container: mainScrollContainer || undefined });
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
    <div style={{ x }} className="whitespace-nowrap">
      <span className="text-[clamp(6rem,15vw,30rem)] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 opacity-90">
        {children} 
      </span>
      <span className="text-[clamp(6rem,15vw,30rem)] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 opacity-90">
        {children}
      </span>
      <span className="text-[clamp(6rem,15vw,30rem)] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 opacity-90">
        {children}
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   EXPERTISE COMPONENT
   ═══════════════════════════════════════════════════ */
export default function Expertise() {
  return (
    <section className="relative pt-0 pb-[clamp(1rem,2vw,3rem)] 2xl:pt-0 2xl:pb-0 bg-white overflow-hidden min-h-screen flex flex-col justify-start md:justify-center">
      {/* Premium Divider / Parallax Text Header */}
      <ParallaxHeader baseVelocity={-1.5}>EXPERTISE</ParallaxHeader>

      <div className="w-[100vw] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] px-[clamp(0.5rem,1.5vw,3vw)] flex justify-center relative z-10 flex-grow items-center 2xl:mt-4">
        {/* Simulated Mac Window */}
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
              robert_musin_expertise.tsx
            </div>
          </div>

          {/* Window Content */}
          <div className="p-4 md:p-6 xl:p-8 2xl:p-12 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-6 md:gap-8 xl:gap-12 bg-white flex-1 md:overflow-y-auto w-full custom-scrollbar">
            {expertiseAreas.map((area, i) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.8, 
                  delay: i * 0.15,
                  type: "spring",
                  bounce: 0.2
                }}
                className="group flex flex-col h-full w-full"
                style={{ willChange: "transform, opacity, filter" }}
              >
                {/* Animation Container */}
                <div className="w-full h-[18rem] 2xl:h-[clamp(22rem,35vh,50rem)] flex items-center justify-center relative mb-4">
                  <div className="w-full h-full">
                    <area.animation />
                  </div>
                </div>

                <div className="flex flex-col flex-1 pt-2 md:pt-4">
                  <StaggeredTextReveal 
                    text={area.title}
                    className="text-[clamp(1.1rem,1.8vw,1.6rem)] 2xl:text-[clamp(1.8rem,2.5vw,3.5rem)] font-medium text-zinc-900 tracking-tight leading-tight min-h-[3.5rem] flex items-start" 
                    delayOffset={i * 0.1 + 0.2}
                  />
                  <p className="text-zinc-500 leading-tight lg:leading-snug font-light text-[clamp(0.8rem,1vw,1rem)] 2xl:text-[clamp(1rem,1.2vw,1.8rem)] pb-4 min-h-[6rem]">
                    {area.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}