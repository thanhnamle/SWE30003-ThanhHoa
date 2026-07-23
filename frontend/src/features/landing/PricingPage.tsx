import { Navbar } from './components/Navbar';
import { Pricing } from './components/Pricing';
import { Footer } from './components/Footer';
import { ScrollIndicator } from './components/ScrollIndicator';
import { ScrollBlobs } from './components/ScrollBlobs';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const faqs = [
  {
    q: 'Can I change or upgrade my plan anytime?',
    a: 'Yes, you can upgrade, downgrade, or switch between monthly and annual billing at any time directly from your account settings. Pro-rated adjustments will be calculated automatically.',
  },
  {
    q: 'Is there a free trial available?',
    a: 'We offer a 14-day free trial for all new accounts with full access to our Professional tier features. No credit card is required to sign up.',
  },
  {
    q: 'What hardware & telematics devices are supported?',
    a: 'SmartFM connects seamlessly with over 200+ standard OBD-II dongles, J1939 truck telematics, and popular GPS trackers via open APIs.',
  },
  {
    q: 'Are there any hidden setup or cancellation fees?',
    a: 'No hidden fees. You only pay the advertised per-vehicle rate. You can cancel your subscription at any time with no penalties.',
  },
];

export const PricingPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col font-sans bg-white text-slate-900 selection:bg-blue-200"
    >
      <ScrollIndicator />
      <ScrollBlobs />
      <Navbar />

      <main className="flex-1">
        {/* Header Hero Banner for Pricing Page */}
        <section className="relative pt-16 pb-12 bg-gradient-to-b from-blue-50/80 via-slate-50 to-white text-center border-b border-slate-100">
          <div className="container mx-auto px-6 lg:px-12 relative z-10">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-100/80 px-4 py-1.5 rounded-full border border-blue-200 mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              SmartFM Plans & Rates
            </span>

            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 mb-4">
              Explore Our Flexible Pricing
            </h1>

            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Transparent, predictable pricing designed to scale with your logistics operations.
            </p>
          </div>
        </section>

        {/* Pricing Component */}
        <Pricing />

        {/* FAQ Section */}
        <section className="py-20 bg-white border-t border-slate-200/80">
          <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
            <div className="text-center mb-14">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 mb-4 border border-blue-100">
                <HelpCircle className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-3">
                Frequently Asked Questions
              </h2>
              <p className="text-slate-600 text-sm">
                Have questions about our pricing or plans? We have answers.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-slate-50/50"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full flex items-center justify-between p-6 text-left font-extrabold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`h-5 w-5 text-slate-500 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 text-blue-600' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </motion.div>
  );
};
