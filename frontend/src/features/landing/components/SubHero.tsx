import { ArrowRight, ShieldCheck, CheckCircle2, Sparkles } from 'lucide-react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';

export const SubHero = () => {
  return (
    <section id="pricing" className="py-24 bg-slate-50/80 border-t border-slate-200/80 relative overflow-hidden">
      {/* Soft Background Orbs */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.6 }}
          className="relative rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-600 p-8 lg:p-14 text-white shadow-2xl shadow-blue-600/20 overflow-hidden"
        >
          {/* Subtle Grid Overlay on Card */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage:
                'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
              backgroundSize: '36px 36px',
            }}
          />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
            
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-cyan-200 bg-white/10 px-4 py-1.5 rounded-full border border-white/20 backdrop-blur-md mb-6 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                Ready to Upgrade Your Fleet?
              </span>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-6 leading-tight">
                Transform Your Fleet Operations Today
              </h2>

              <p className="text-blue-100 text-base md:text-lg max-w-xl mb-8 leading-relaxed font-normal">
                Join over 1,200+ enterprise fleet operators cutting costs by 30% and maximizing driver safety with SmartFM.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-6">
                <Link
                  to="/login"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-xl bg-white text-blue-700 font-extrabold px-8 py-4 text-sm uppercase tracking-wider hover:bg-blue-50 shadow-lg shadow-black/10 hover:shadow-xl hover:-translate-y-0.5 transition-all group"
                >
                  REQUEST A FREE DEMO
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/pricing"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-white font-bold px-7 py-4 text-sm hover:bg-white/20 transition-all"
                >
                  Explore Pricing
                </Link>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-medium text-blue-100/90 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-300" />
                  <span>14-Day Free Trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-cyan-300" />
                  <span>Instant API Setup</span>
                </div>
              </div>
            </div>

            {/* Right Side Laptop/Dashboard Preview Graphic */}
            <div className="relative w-full lg:w-[420px] shrink-0">
              <div className="rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-slate-900 p-2 group">
                <img
                  src="/subhero-graphic.png"
                  alt="SmartFM Fleet Management Dashboard Preview"
                  className="w-full h-auto rounded-xl object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};