import { Fuel, TrendingUp, Wrench, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export const Statistics = () => {
  const stats = [
    {
      value: '30%',
      label: 'REDUCED FUEL COSTS',
      description: 'Optimized routing & idling reduction',
      icon: <Fuel className="h-7 w-7 text-blue-600" />,
    },
    {
      value: '25%',
      label: 'INCREASED PRODUCTIVITY',
      description: 'Automated dispatch & faster turns',
      icon: <TrendingUp className="h-7 w-7 text-blue-600" />,
    },
    {
      value: '15%',
      label: 'LOWER MAINTENANCE EXPENSES',
      description: 'Proactive diagnostic alerts',
      icon: <Wrench className="h-7 w-7 text-blue-600" />,
    },
    {
      value: '99.8%',
      label: 'UPTIME GUARANTEE',
      description: 'Enterprise SLA & 24/7 support',
      icon: <ShieldCheck className="h-7 w-7 text-blue-600" />,
    },
  ];

  // Duplicate the list so the track can loop seamlessly (0% -> -50%)
  const loopStats = [...stats, ...stats];

  return (
    <section className="py-12 bg-white/75 backdrop-blur-sm border-y border-slate-200/80 shadow-sm relative z-20 overflow-hidden">
      {/* Fade edges so cards don't hard-cut at the container border */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 lg:w-32 bg-gradient-to-r from-white/75 to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 lg:w-32 bg-gradient-to-l from-white/75 to-transparent z-10" />

      <div className="relative">
        <motion.div
          className="flex gap-6"
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {loopStats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-4 rounded-2xl hover:bg-slate-50 transition-colors shrink-0 w-56 lg:w-64"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 mb-4 border border-blue-100 shadow-sm">
                {stat.icon}
              </div>
              <span className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-1">
                {stat.value}
              </span>
              <span className="text-xs lg:text-sm font-bold text-slate-800 tracking-wider uppercase mb-1">
                {stat.label}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {stat.description}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};