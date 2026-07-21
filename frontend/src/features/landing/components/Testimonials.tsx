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
    <section id="testimonials" className="py-24 bg-white border-t border-slate-200/80">
      <div className="container mx-auto px-6 lg:px-12">
        
        {/* Brand Logos Bar */}
        <div className="mb-20">
          <p className="text-center text-xs font-extrabold uppercase tracking-widest text-slate-400 mb-8">
            TRUSTED BY INDUSTRY-LEADING LOGISTICS & FLEET OPERATORS
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16 opacity-70">
            {brands.map((brand, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-600 font-extrabold text-lg uppercase tracking-tight hover:text-blue-600 hover:opacity-100 transition-all cursor-pointer">
                <Building2 className="h-5 w-5 text-blue-600" />
                <span>{brand}</span>
              </div>
            ))}
          </div>
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-slate-50 border border-slate-200/80 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
            >
              <Quote className="h-10 w-10 text-blue-200 absolute top-6 right-6" />

              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-6">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-slate-700 text-sm leading-relaxed font-medium mb-6 relative z-10 italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="border-t border-slate-200 pt-4 mt-2">
                <h4 className="font-extrabold text-slate-900 text-sm">{t.author}</h4>
                <p className="text-xs text-slate-500 font-medium">{t.title}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
