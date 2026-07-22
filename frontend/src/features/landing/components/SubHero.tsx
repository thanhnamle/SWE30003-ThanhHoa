import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';
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

export const SubHero = () => {
  return (
    <section id="pricing" className="py-20 bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white relative overflow-hidden">
      {/* Breathing glow effects */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"
      />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col lg:flex-row items-center justify-between gap-12 bg-white/5 border border-white/15 rounded-3xl p-8 lg:p-12 backdrop-blur-xl"
        >

          <div className="flex-1 text-center lg:text-left">
            <motion.span
              variants={itemVariants}
              className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-cyan-300 bg-cyan-950/60 px-3.5 py-1.5 rounded-full border border-cyan-500/30 mb-4"
            >
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2.5, ease: 'easeInOut' }}
              >
                <Zap className="h-3.5 w-3.5" />
              </motion.span>
              Ready to Upgrade?
            </motion.span>

            <motion.h2 variants={itemVariants} className="text-3xl lg:text-4xl font-black uppercase tracking-tight mb-4 leading-tight">
              SMARTFM: REVOLUTIONIZE YOUR FLEET MANAGEMENT
            </motion.h2>

            <motion.p variants={itemVariants} className="text-blue-100/80 text-base max-w-xl mb-8 leading-relaxed">
              Join over 1,200+ logistics companies operating smarter, faster, and more economically every day with SmartFM.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link
                to="/login"
                className="relative inline-flex items-center gap-3 rounded-xl bg-cyan-400 text-slate-950 font-black px-8 py-4 text-sm uppercase tracking-wider hover:bg-cyan-300 shadow-lg shadow-cyan-400/20 hover:shadow-cyan-400/40 hover:-translate-y-0.5 transition-all overflow-hidden group"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />
                REQUEST A FREE DEMO
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="flex items-center gap-2 text-xs font-semibold text-blue-200">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Instant Setup • Cancel Anytime</span>
              </div>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="relative w-full lg:w-96">
            <div className="w-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-slate-950/80 p-2 group">
              <img
                src="/subhero-graphic.png"
                alt="SmartFM Fleet Management Dashboard Preview"
                className="w-full h-auto rounded-xl object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Soft glow ring behind the preview */}
            <div className="absolute -inset-3 -z-10 bg-gradient-to-br from-cyan-400/20 via-blue-400/10 to-indigo-400/20 blur-2xl rounded-[2rem]" />
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
};