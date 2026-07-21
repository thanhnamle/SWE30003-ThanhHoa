import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router';

export const SubHero = () => {
  return (
    <section id="pricing" className="py-20 bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white relative overflow-hidden">
      {/* Glow effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 bg-white/5 border border-white/15 rounded-3xl p-8 lg:p-12 backdrop-blur-xl">
          
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-cyan-300 bg-cyan-950/60 px-3.5 py-1.5 rounded-full border border-cyan-500/30 mb-4">
              <Zap className="h-3.5 w-3.5" />
              Ready to Upgrade?
            </span>

            <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tight mb-4 leading-tight">
              SMARTFM: REVOLUTIONIZE YOUR FLEET MANAGEMENT
            </h2>

            <p className="text-blue-100/80 text-base max-w-xl mb-8 leading-relaxed">
              Join over 1,200+ logistics companies operating smarter, faster, and more economically every day with SmartFM.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-3 rounded-xl bg-cyan-400 text-slate-950 font-black px-8 py-4 text-sm uppercase tracking-wider hover:bg-cyan-300 shadow-lg shadow-cyan-400/20 hover:shadow-cyan-400/35 transition-all"
              >
                REQUEST A FREE DEMO
                <ArrowRight className="h-5 w-5" />
              </Link>
              
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-200">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Instant Setup • Cancel Anytime</span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-96 rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-slate-950/80 p-2">
            <img 
              src="/subhero-graphic.png" 
              alt="SmartFM Fleet Management Dashboard Preview" 
              className="w-full h-auto rounded-xl object-cover"
            />
          </div>

        </div>
      </div>
    </section>
  );
};
