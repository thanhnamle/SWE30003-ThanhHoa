import { Star, Building2, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

export const Testimonials = () => {
  const brands = ['DHL Express', 'FedEx Logistics', 'Maersk Fleet', 'Lineage Supply', 'Swift Transport'];

  const testimonials = [
    {
      quote: "SmartFM reduced our fuel expenses by 32% within the first 60 days. The AI route optimization is a total game changer for our national fleet.",
      author: "Marcus Vance",
      title: "VP of Logistics, GlobalFreight Inc.",
      rating: 5,
    },
    {
      quote: "Predictive maintenance alerts saved us over $140,000 last year alone by preventing major engine failures before trucks hit the road.",
      author: "Elena Rostova",
      title: "Fleet Operations Director, Lineage Logistics",
      rating: 5,
    },
    {
      quote: "The real-time GPS tracking and automated ETA notifications reduced customer support inquiries by 45%. Highly recommended!",
      author: "David Chen",
      title: "Chief Operating Officer, Swift Logistics",
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-24 bg-white/75 backdrop-blur-sm border-t border-slate-200/80">
      <div className="container mx-auto px-6 lg:px-12">
        
        {/* Brand Logos Bar */}
        <div className="mb-20 -mx-6 lg:-mx-12 overflow-hidden relative">
          <p className="text-center text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-8">
            TRUSTED BY INDUSTRY-LEADING LOGISTICS & FLEET OPERATORS
          </p>

          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-8 left-0 w-16 lg:w-32 bg-gradient-to-r from-white/75 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-8 right-0 w-16 lg:w-32 bg-gradient-to-l from-white/75 to-transparent z-10" />

          <motion.div
            className="flex items-center gap-16 lg:gap-24 opacity-70 px-6 lg:px-12"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          >
            {[...brands, ...brands].map((brand, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-600 font-extrabold text-lg uppercase tracking-tight hover:text-blue-600 hover:opacity-100 transition-all cursor-pointer shrink-0">
                <Building2 className="h-5 w-5 text-blue-600 shrink-0" />
                <span className="whitespace-nowrap">{brand}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200">
            Client Testimonials
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight mt-4 mb-4">
            CLIENT TESTIMONIALS
          </h2>
          <p className="text-lg text-slate-600">
            See how fleet managers across the globe power their operations with SmartFM.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((t, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -8 }}
              className="group relative bg-white border border-slate-200/80 rounded-3xl p-8 shadow-md hover:shadow-2xl hover:shadow-blue-500/15 hover:border-blue-200 transition-[box-shadow,border-color] duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Top accent bar, glows in on hover */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <Quote className="h-12 w-12 text-blue-100 absolute top-6 right-6 group-hover:text-blue-200 group-hover:rotate-6 transition-all duration-300" />

              <div>
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(t.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0, rotate: -180 }}
                      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.45,
                        delay: index * 0.15 + 0.3 + i * 0.08,
                        type: 'spring',
                        stiffness: 260,
                        damping: 14,
                      }}
                    >
                      {/* Continuous gentle twinkle after the entrance pop */}
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 1.6,
                          repeat: Infinity,
                          repeatDelay: 2.2,
                          delay: index * 0.15 + 1.2 + i * 0.12,
                          ease: 'easeInOut',
                        }}
                      >
                        <Star className="h-5 w-5 fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.55)]" />
                      </motion.div>
                    </motion.div>
                  ))}
                </div>

                <p className="text-slate-700 text-sm leading-relaxed font-medium mb-6 relative z-10 italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 border-t border-slate-200 pt-4 mt-2">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-sm shrink-0 shadow-md shadow-blue-500/20">
                  {t.author.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm">{t.author}</h4>
                  <p className="text-xs text-slate-500 font-medium">{t.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};