import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Expertise } from "./components/Expertise";
import { SelectedWorks } from "./components/SelectedWorks";
import { ContactForm } from "./components/ContactForm";
import { Footer } from "./components/Footer";
import React, { createContext, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";

export const ScrollContext = createContext<React.RefObject<HTMLDivElement> | null>(null);

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
    <ScrollContext.Provider value={containerRef}>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="bg-white text-zinc-950 selection:bg-black selection:text-white font-sans antialiased h-screen w-full overflow-y-scroll overflow-x-hidden md:snap-y md:snap-mandatory scroll-smooth relative"
      >
        {/* Progress bar */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-1 bg-black origin-left z-50 pointer-events-none"
          style={{ scaleX }}
        />

        <main>
          <div className="md:snap-start md:snap-always w-full min-h-screen">
            <Hero />
          </div>
          <About />
          <div className="md:snap-start md:snap-always w-full min-h-screen flex flex-col justify-center">
            <Expertise />
          </div>
          <div className="md:snap-start md:snap-always w-full min-h-screen flex flex-col justify-center">
            <SelectedWorks />
          </div>
          <div className="md:snap-start md:snap-always min-h-screen w-full flex flex-col justify-between bg-zinc-50">
            <div className="flex-grow flex flex-col justify-center">
              <ContactForm />
            </div>
            <Footer />
          </div>
        </main>
      </div>
    </ScrollContext.Provider>
  );
}
