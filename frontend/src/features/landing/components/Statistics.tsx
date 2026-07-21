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

  return (
    <section className="py-12 bg-white border-y border-slate-200/80 shadow-sm relative z-20">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-4 rounded-2xl hover:bg-slate-50 transition-colors"
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
