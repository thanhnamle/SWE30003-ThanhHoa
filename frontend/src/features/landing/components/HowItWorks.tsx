import { Radio, MapPin, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export const HowItWorks = () => {
  const steps = [
    {
      num: '1',
      title: 'STEP 1: CONNECT YOUR FLEET',
      description: 'Easy installation of telematics devices & plug-and-play vehicle sensors.',
      icon: <Radio className="h-8 w-8 text-blue-600" />,
      badge: 'Plug & Play Hardware',
    },
    {
      num: '2',
      title: 'STEP 2: GAIN REAL-TIME INSIGHTS',
      description: 'Access live data on location, speed, fuel levels, and driver performance.',
      icon: <MapPin className="h-8 w-8 text-blue-600" />,
      badge: 'Live GPS & Sensor Data',
    },
    {
      num: '3',
      title: 'STEP 3: OPTIMIZE & GROW',
      description: 'Make data-driven decisions to lower operational expenses and boost overall efficiency.',
      icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
      badge: 'AI Recommendations',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-100/80 px-4 py-1.5 rounded-full border border-blue-200">
            Streamlined Workflow
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight mt-4 mb-4">
            HOW IT WORKS
          </h2>
          <p className="text-lg text-slate-600">
            Transform your fleet management into a high-performance operation in three seamless steps.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto relative">
          
          {/* Connector Line for Desktop */}
          <div className="hidden md:block absolute top-16 left-[15%] right-[15%] h-1 bg-gradient-to-r from-blue-200 via-blue-400 to-indigo-400 -z-10 rounded-full" />

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-lg shadow-slate-200/40 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center relative group"
            >
              {/* Step Number Circle */}
              <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-6 group-hover:scale-110 transition-transform">
                {step.num}
              </div>

              {/* Icon Container */}
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 border border-blue-100">
                {step.icon}
              </div>

              <span className="inline-block text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-md mb-3 border border-blue-100">
                {step.badge}
              </span>

              <h3 className="text-xl font-extrabold text-slate-900 uppercase tracking-tight mb-3">
                {step.title}
              </h3>

              <p className="text-slate-600 text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
