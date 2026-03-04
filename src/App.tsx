import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Expertise } from "./components/Expertise";
import { SelectedWorks } from "./components/SelectedWorks";
import { ContactForm } from "./components/ContactForm";
import { Footer } from "./components/Footer";
import React from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { useRef, useState } from "react";

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollYProgress } = useScroll({ container: containerRef });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop > 50) {
      if (!isScrolled) setIsScrolled(true);
    } else {
      if (isScrolled) setIsScrolled(false);
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="bg-white text-zinc-950 selection:bg-black selection:text-white font-sans antialiased h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth relative"
    >
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-black origin-left z-50 pointer-events-none"
        style={{ scaleX }}
      />



      <main>
        <div className="snap-start snap-always h-screen w-full overflow-hidden">
          <Hero />
        </div>
        <div className="snap-start snap-always min-h-screen w-full overflow-y-auto">
          <About />
        </div>
        <div className="snap-start snap-always h-screen w-full overflow-hidden flex flex-col justify-center">
          <Expertise />
        </div>
        <div className="snap-start snap-always h-screen w-full overflow-hidden flex flex-col justify-center">
          <SelectedWorks />
        </div>
        <div className="snap-start snap-always min-h-screen w-full flex flex-col justify-between bg-zinc-50">
          <div className="flex-grow flex flex-col justify-center">
            <ContactForm />
          </div>
          <Footer />
        </div>
      </main>
    </div>
  );
}
