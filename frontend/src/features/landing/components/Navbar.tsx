import { Link } from 'react-router';
import { Truck, ArrowRight } from 'lucide-react';
import React from 'react';

export const Navbar = () => {
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80; // Offset for sticky navbar
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/90 backdrop-blur-md transition-all">
      <div className="container mx-auto flex h-20 items-center justify-between px-6 lg:px-12">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Truck className="h-6 w-6" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-slate-900">
            Smart<span className="text-blue-600">FM</span>
          </span>
        </Link>

        {/* Navigation Links in Logical Order */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a 
            href="#how-it-works" 
            onClick={(e) => handleScrollTo(e, 'how-it-works')}
            className="hover:text-blue-600 transition-colors"
          >
            How It Works
          </a>
          <a 
            href="#features" 
            onClick={(e) => handleScrollTo(e, 'features')}
            className="hover:text-blue-600 transition-colors"
          >
            Key Features
          </a>
          <a 
            href="#about-us" 
            onClick={(e) => handleScrollTo(e, 'about-us')}
            className="hover:text-blue-600 transition-colors"
          >
            About Us
          </a>
          <a 
            href="#testimonials" 
            onClick={(e) => handleScrollTo(e, 'testimonials')}
            className="hover:text-blue-600 transition-colors"
          >
            Testimonials
          </a>
          <a 
            href="#pricing" 
            onClick={(e) => handleScrollTo(e, 'pricing')}
            className="hover:text-blue-600 transition-colors"
          >
            Pricing
          </a>
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
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            Request a Free Demo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </header>
  );
};
