import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';

const sections = [
  { id: 'hero', label: 'Home' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'features', label: 'Key Features' },
  { id: 'about-us', label: 'About Us' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'pricing', label: 'Pricing' },
];

export const ScrollIndicator = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrollTopVisible, setIsScrollTopVisible] = useState(false);
  const { scrollYProgress } = useScroll();
  
  // Smooth physics spring for top progress bar
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Track scroll position & active section
  useEffect(() => {
    const handleScroll = () => {
      // Toggle scroll-to-top button visibility
      if (window.scrollY > 300) {
        setIsScrollTopVisible(true);
      } else {
        setIsScrollTopVisible(false);
      }

      // Intersection detection for right-side dot navigation
      const scrollPosition = window.scrollY + 200;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -80; // Sticky header offset
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {/* 1. Top Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-400 origin-left z-[100] shadow-sm shadow-blue-500/50"
        style={{ scaleX }}
      />

      {/* 2. Right-Side Vertical Dot Progress Navigation */}
      <div className="hidden xl:flex fixed right-5 top-1/2 -translate-y-1/2 z-50 flex-col items-center gap-2.5 bg-white/90 backdrop-blur-md p-2 rounded-full border border-slate-200 shadow-xl shadow-slate-900/10">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="group relative flex items-center justify-center p-1 cursor-pointer focus:outline-none"
              aria-label={`Scroll to ${section.label}`}
            >
              {/* Tooltip Label on Hover */}
              <span className="absolute right-8 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 bg-slate-900 text-white text-xs font-semibold px-2.5 py-1 rounded-lg shadow-md whitespace-nowrap">
                {section.label}
              </span>

              {/* Dot Indicator */}
              <motion.span
                animate={{
                  scale: isActive ? 1.25 : 1,
                  height: isActive ? '12px' : '8px',
                  width: isActive ? '12px' : '8px',
                }}
                transition={{ duration: 0.25 }}
                className={`rounded-full transition-colors ${
                  isActive
                    ? 'bg-blue-600 ring-4 ring-blue-100 shadow-sm'
                    : 'bg-slate-300 group-hover:bg-blue-400'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* 3. Floating Scroll to Top Button */}
      <AnimatePresence>
        {isScrollTopVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/30 border border-blue-400/30 hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all group cursor-pointer"
          >
            <ArrowUp className="h-5 w-5 group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};
