import { ArrowRight, Play, CheckCircle2, ShieldCheck, Zap, TrendingUp, Navigation } from 'lucide-react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-slate-50 to-white py-20 lg:py-28">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-blue-300/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-40 right-10 w-96 h-96 bg-cyan-200/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="flex-1 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/70 px-4 py-1.5 text-xs font-bold text-blue-700 mb-6 uppercase tracking-wider shadow-sm">
              <Zap className="h-3.5 w-3.5 fill-blue-600 text-blue-600" />
              Smart Fleet Management Platform
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.15] tracking-tight uppercase mb-6">
              SMARTFM: <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                REVOLUTIONIZE YOUR FLEET MANAGEMENT
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal mb-8">
              Optimize operations, reduce costs, and gain real-time visibility with our advanced telematic and fleet management platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-500/25 hover:bg-blue-700 hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all uppercase tracking-wide"
              >
                REQUEST A FREE DEMO
                <ArrowRight className="h-5 w-5" />
              </Link>
              
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white px-7 py-4 text-base font-bold text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50 transition-all"
              >
                <Play className="h-4 w-4 fill-slate-700 text-slate-700" />
                EXPLORE PLATFORM
              </Link>
            </div>

            {/* Micro Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm font-semibold text-slate-500 pt-4 border-t border-slate-200/60">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                <span>ISO 27001 Certified</span>
              </div>
            </div>
          </motion.div>

          {/* Dedicated 3D Isometric Platform Graphic with Floating Live Badges */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex-1 relative w-full max-w-2xl"
          >
            <div className="relative rounded-3xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50 p-4 shadow-2xl shadow-blue-900/10 backdrop-blur-xl">
              
              {/* Main 3D Isometric Graphic */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-[4/3] group flex items-center justify-center">
                <img 
                  src="/hero-isometric.png" 
                  alt="SmartFM 3D Isometric Fleet Management Graphic" 
                  className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-700"
                />

                {/* Floating Live Badge 1 (Top Right) */}
                <motion.div 
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-slate-200/80 flex items-center gap-3"
                >
                  <div className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Live Status</span>
                    <span className="text-xs font-bold text-slate-900">1,248 Vehicles Active</span>
                  </div>
                </motion.div>

                {/* Floating Live Badge 2 (Bottom Left) */}
                <motion.div 
                  animate={{ y: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                  className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-slate-200/80 flex items-center gap-3"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Fuel Optimization</span>
                    <span className="text-xs font-bold text-emerald-600">-18.4% Monthly Savings</span>
                  </div>
                </motion.div>

                {/* Floating Live Badge 3 (Top Left) */}
                <motion.div 
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
                  className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-slate-200/80 flex items-center gap-2"
                >
                  <Navigation className="h-4 w-4 text-cyan-500" />
                  <span className="text-xs font-extrabold text-slate-800">99.4% On-Time Delivery</span>
                </motion.div>
              </div>

            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
};
