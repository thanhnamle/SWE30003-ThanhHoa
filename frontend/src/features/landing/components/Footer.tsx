import { Truck, Mail, Phone, MapPin, Globe, ArrowUp } from 'lucide-react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const FooterLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <li>
    <a href={href} className="relative inline-block group hover:text-blue-400 transition-colors">
      {children}
      <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-blue-400 group-hover:w-full transition-all duration-300 ease-out" />
    </a>
  </li>
);

export const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-white pt-16 pb-12 border-t border-slate-900 relative overflow-hidden">
      {/* Top accent glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />

      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12"
        >

          {/* Brand Col */}
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <motion.div
                whileHover={{ rotate: -8, scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 300, damping: 12 }}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md"
              >
                <Truck className="h-5 w-5" />
              </motion.div>
              <span className="text-2xl font-black tracking-tight text-white uppercase">
                Smart<span className="text-blue-500">FM</span>
              </span>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              SmartFM is an end-to-end fleet management & logistics telematics solution powering enterprise transportation systems worldwide.
            </p>

            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span>100 Logistics Way, Tech Park, CA 94105</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-500" />
                <span>+1 (800) 555-SMARTFM</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-500" />
                <span>contact@smartfm.vn</span>
              </div>
            </div>
          </motion.div>

          {/* Links Col 1 */}
          <motion.div variants={itemVariants}>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-200 mb-4">Features</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <FooterLink href="#features">Real-Time Tracking</FooterLink>
              <FooterLink href="#features">Fuel Monitoring</FooterLink>
              <FooterLink href="#features">Predictive Maintenance</FooterLink>
              <FooterLink href="#features">Route Optimization</FooterLink>
              <FooterLink href="#features">Asset Management</FooterLink>
            </ul>
          </motion.div>

          {/* Links Col 2 */}
          <motion.div variants={itemVariants}>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-200 mb-4">Company</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <FooterLink href="#">About Us</FooterLink>
              <FooterLink href="#">Careers & Hiring</FooterLink>
              <FooterLink href="#">Case Studies</FooterLink>
              <FooterLink href="#">Partners & Integrations</FooterLink>
              <FooterLink href="#">Press & Media</FooterLink>
            </ul>
          </motion.div>

          {/* Links Col 3 */}
          <motion.div variants={itemVariants}>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-200 mb-4">Support & Legal</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <FooterLink href="#">Documentation</FooterLink>
              <FooterLink href="#">API Reference</FooterLink>
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Terms of Service</FooterLink>
              <FooterLink href="#">Security Center</FooterLink>
            </ul>
          </motion.div>

        </motion.div>

        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} SmartFM Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" /> English (US)</span>
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Cookies</a>

            {/* Back to top */}
            <motion.button
              onClick={scrollToTop}
              whileHover={{ y: -3, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-400 hover:border-blue-500/50 transition-colors"
              aria-label="Back to top"
            >
              <ArrowUp className="h-4 w-4" />
            </motion.button>
          </div>
        </div>

      </div>
    </footer>
  );
};