import { Link } from 'react-router';
import { Truck, ArrowRight } from 'lucide-react';
import React, { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 20);
  });

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; // Offset for sticky navbar
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const navLinks = [
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'features', label: 'Key Features' },
    { id: 'about-us', label: 'About Us' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'pricing', label: 'Pricing' },
  ];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? 'border-slate-200 bg-white/95 backdrop-blur-md shadow-sm'
          : 'border-transparent bg-white/80 backdrop-blur-md'
      }`}
    >
      <div
        className={`container mx-auto flex items-center justify-between px-6 lg:px-12 transition-all duration-300 ${
          scrolled ? 'h-16' : 'h-20'
        }`}
      >
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ rotate: -8, scale: 1.08 }}
            transition={{ type: 'spring', stiffness: 300, damping: 12 }}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20"
          >
            <Truck className="h-6 w-6" />
          </motion.div>
          <span className="text-2xl font-extrabold tracking-tight text-slate-900">
            Smart<span className="text-blue-600">FM</span>
          </span>
        </Link>

        {/* Navigation Links, with animated underline on hover */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleScrollTo(e, link.id)}
              className="relative py-1 group hover:text-blue-600 transition-colors"
            >
              {link.label}
              <span className="absolute left-1/2 -translate-x-1/2 bottom-0 h-0.5 w-0 bg-blue-600 rounded-full group-hover:w-full transition-all duration-300 ease-out" />
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-semibold text-slate-700 hover:text-blue-600 px-4 py-2 rounded-lg transition-colors"
          >
            Login
          </Link>
          <Link
            to="/login"
            className="relative inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all overflow-hidden group"
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12" />
            Request a Free Demo
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.header>
  );
};