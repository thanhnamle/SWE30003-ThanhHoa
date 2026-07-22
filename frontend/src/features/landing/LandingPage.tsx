import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Statistics } from './components/Statistics';
import { HowItWorks } from './components/HowItWorks';
import { Features } from './components/Features';
import { AboutUs } from './components/AboutUs';
import { SubHero } from './components/SubHero';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { ScrollBlobs } from './components/ScrollBlobs';
import { motion } from 'framer-motion';

export const LandingPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col font-sans selection:bg-blue-200"
    >
      {/* Ambient scroll-linked color blobs, sit behind all sections */}
      <ScrollBlobs />

      <Navbar />

      <main className="flex-1">
        <Hero />
        <Statistics />
        <HowItWorks />
        <Features />
        <AboutUs />
        <Testimonials />
        <SubHero />
      </main>

      <Footer />
    </motion.div>
  );
};