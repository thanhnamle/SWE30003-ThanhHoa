import { ArrowRight, Play, CheckCircle2, ShieldCheck, Zap, TrendingUp, Navigation, ChevronDown } from 'lucide-react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export const Hero = () => {
  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-slate-50/70 to-white/70 py-20 lg:py-28">
      {/* Local keyframes: animated gradient text */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-text {
          background-size: 200% auto;
          animation: gradientShift 5s ease infinite;
        }
      `}</style>

      {/* Background Decorative Blur Orbs, now breathing */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-blue-300/20 blur-[120px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-40 right-10 w-96 h-96 bg-cyan-200/20 blur-[100px] rounded-full pointer-events-none"
      />

      {/* Subtle grid pattern overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(59,130,246,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(59,130,246,0.07) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 65% 65% at 50% 0%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 65% 65% at 50% 0%, black 40%, transparent 100%)',
        }}
      />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 text-center lg:text-left"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/70 px-4 py-1.5 text-xs font-bold text-blue-700 mb-6 uppercase tracking-wider shadow-sm"
            >
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' }}
              >
                <Zap className="h-3.5 w-3.5 fill-blue-600 text-blue-600" />
              </motion.span>
              Smart Fleet Management Platform
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.18] tracking-tight mb-6">
              <motion.span variants={itemVariants} className="block text-slate-500 font-semibold text-xl md:text-2xl mb-2 tracking-normal uppercase">
                SmartFM Ecosystem
              </motion.span>
              <motion.span variants={itemVariants} className="block font-black text-slate-900">
                Revolutionize Your{' '}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent animate-gradient-text">
                    Fleet Operations
                  </span>
                  <span className="absolute -bottom-1.5 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 rounded-full opacity-75 shadow-sm" />
                </span>
              </motion.span>
            </h1>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal mb-8"
            >
              Optimize operations, reduce costs, and gain real-time visibility with our advanced telematic and fleet management platform.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10"
            >
              <Link
                to="/login"
                className="relative w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-500/25 hover:bg-blue-700 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all uppercase tracking-wide overflow-hidden group"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12" />
                REQUEST A FREE DEMO
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white px-7 py-4 text-base font-bold text-slate-700 shadow-sm hover:border-blue-300 hover:bg-blue-50/50 hover:-translate-y-0.5 transition-all"
              >
                <Play className="h-4 w-4 fill-slate-700 text-slate-700" />
                EXPLORE PLATFORM
              </Link>
            </motion.div>

            {/* Micro Trust Indicators */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm font-semibold text-slate-500 pt-4 border-t border-slate-200/60"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                <span>ISO 27001 Certified</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Dedicated 3D Isometric Platform Graphic with Floating Live Badges */}
          <motion.div
            initial={{ opacity: 0, x: 40, rotateY: -8 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 relative w-full max-w-2xl"
            style={{ perspective: 1000 }}
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
                  initial={{ opacity: 0, y: -20, scale: 0.8 }}
                  animate={{ opacity: 1, y: [0, -6, 0], scale: 1 }}
                  transition={{
                    opacity: { duration: 0.5, delay: 0.9 },
                    scale: { duration: 0.5, delay: 0.9 },
                    y: { repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 0.9 },
                  }}
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
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: [0, 6, 0], scale: 1 }}
                  transition={{
                    opacity: { duration: 0.5, delay: 1.1 },
                    scale: { duration: 0.5, delay: 1.1 },
                    y: { repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1.1 },
                  }}
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
                  initial={{ opacity: 0, x: -20, scale: 0.8 }}
                  animate={{ opacity: 1, y: [0, -4, 0], x: 0, scale: 1 }}
                  transition={{
                    opacity: { duration: 0.5, delay: 1.3 },
                    scale: { duration: 0.5, delay: 1.3 },
                    x: { duration: 0.5, delay: 1.3 },
                    y: { repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 1.3 },
                  }}
                  className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-slate-200/80 flex items-center gap-2"
                >
                  <Navigation className="h-4 w-4 text-cyan-500" />
                  <span className="text-xs font-extrabold text-slate-800">99.4% On-Time Delivery</span>
                </motion.div>
              </div>
            </div>

            {/* Soft glow ring behind the card */}
            <div className="absolute -inset-4 -z-10 bg-gradient-to-br from-blue-400/20 via-indigo-400/10 to-cyan-400/20 blur-3xl rounded-[3rem]" />
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="hidden lg:flex justify-center mt-16"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-1 text-slate-400"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest">Scroll</span>
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};