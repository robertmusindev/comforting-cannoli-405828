import { Hero } from "./components/Hero";
import Expertise from "./components/Expertise";
import { SelectedWorks } from "./components/SelectedWorks";
import { ContactForm } from "./components/ContactForm";
import { Footer } from "./components/Footer";
import React, { createContext, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";

export const ScrollContext = createContext<React.RefObject<HTMLDivElement> | null>(null);

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const expertiseRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const autoScrolledToExpertise = useRef(false);
  const autoScrolledToContact = useRef(false);

  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollYProgress } = useScroll({ container: containerRef });

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight } = e.currentTarget;

    if (scrollTop > 50) {
      if (!isScrolled) setIsScrolled(true);
    } else {
      if (isScrolled) setIsScrolled(false);
    }

    if (window.innerWidth >= 768) return;

    // Hero → auto-scroll to Expertise
    if (heroRef.current && expertiseRef.current) {
      const heroBottom = heroRef.current.offsetTop + heroRef.current.offsetHeight;

      if (scrollTop + clientHeight >= heroBottom + 60 && !autoScrolledToExpertise.current) {
        autoScrolledToExpertise.current = true;
        e.currentTarget.scrollTo({
          top: expertiseRef.current.offsetTop,
          behavior: "smooth",
        });
      }

      if (scrollTop + clientHeight < heroBottom - 60) {
        autoScrolledToExpertise.current = false;
      }
    }

    // Projects → auto-scroll to Contacts
    if (projectsRef.current && contactRef.current) {
      const projectsBottom = projectsRef.current.offsetTop + projectsRef.current.offsetHeight;

      if (scrollTop + clientHeight >= projectsBottom + 60 && !autoScrolledToContact.current) {
        autoScrolledToContact.current = true;
        e.currentTarget.scrollTo({
          top: contactRef.current.offsetTop,
          behavior: "smooth",
        });
      }

      if (scrollTop + clientHeight < projectsBottom - 60) {
        autoScrolledToContact.current = false;
      }
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
          <div ref={heroRef} className="md:snap-start md:snap-always w-full min-h-screen">
            <Hero />
          </div>
          <div ref={expertiseRef} className="md:snap-start md:snap-always w-full bg-zinc-50 min-h-screen">
            <Expertise />
          </div>
          {/* Divider Expertise → Progetti */}
          <div className="w-full px-6 md:px-16">
            <div className="border-t border-zinc-200" />
          </div>

          <div ref={projectsRef} className="md:snap-start md:snap-always w-full min-h-screen flex flex-col justify-center bg-zinc-50">
            <SelectedWorks />
          </div>
          <div ref={contactRef} className="md:snap-start md:snap-always min-h-screen w-full flex flex-col justify-between bg-zinc-50">
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
