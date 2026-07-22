import { useState } from 'react';
import { Check, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';

export const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const plans = [
    {
      name: 'Starter',
      description: 'Ideal for small local delivery teams and startup fleets.',
      monthlyPrice: 29,
      annualPrice: 24,
      popular: false,
      features: [
        'Up to 10 active vehicles',
        'Real-time GPS tracking',
        'Standard route planning',
        'Basic fuel consumption logs',
        'Email & chat support',
      ],
      badge: 'Starter Pack',
      buttonText: 'Start Free Trial',
      buttonStyle: 'bg-slate-900 text-white hover:bg-blue-600',
    },
    {
      name: 'Professional',
      description: 'Our most popular plan for growing mid-sized fleet operations.',
      monthlyPrice: 79,
      annualPrice: 64,
      popular: true,
      features: [
        'Up to 50 active vehicles',
        'Real-time GPS & Geofencing',
        'AI-driven Route Optimization',
        'Predictive Maintenance Alerts',
        'Driver Behavior Scoring',
        'Automated Invoice Generation',
        'Priority 24/7 Support',
      ],
      badge: 'Most Popular',
      buttonText: 'Get Started Pro',
      buttonStyle: 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700',
    },
    {
      name: 'Enterprise',
      description: 'Tailored solutions for national supply chains and large fleets.',
      monthlyPrice: 199,
      annualPrice: 159,
      popular: false,
      features: [
        'Unlimited active vehicles',
        'Custom Telematics Integrations',
        'Dedicated Fleet Manager',
        'Advanced Analytics & SLA Logs',
        'Custom Role & Access Control',
        'White-label Reports & API',
        'Dedicated SLA & On-premise Deploy',
      ],
      badge: 'Custom Fleet',
      buttonText: 'Contact Enterprise',
      buttonStyle: 'bg-slate-900 text-white hover:bg-blue-600',
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-slate-50/70 border-t border-slate-200/80 relative overflow-hidden">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-100/80 px-4 py-1.5 rounded-full border border-blue-200">
            Flexible & Transparent
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mt-4 mb-4">
            Simple Pricing for Any Fleet Size
          </h2>
          <p className="text-lg text-slate-600">
            Choose the perfect plan to streamline your logistics. Upgrade, downgrade, or cancel anytime.
          </p>

          {/* Monthly / Annual Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-semibold ${!isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>
              Monthly Billing
            </span>

            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-14 h-8 bg-slate-200 rounded-full p-1 transition-colors cursor-pointer focus:outline-none"
              aria-label="Toggle annual billing"
            >
              <motion.div
                animate={{ x: isAnnual ? 24 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="w-6 h-6 bg-blue-600 rounded-full shadow-md"
              />
            </button>

            <span className={`text-sm font-semibold flex items-center gap-1.5 ${isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>
              Annual Billing
              <span className="text-[11px] font-extrabold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch">
          {plans.map((plan, index) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  plan.popular
                    ? 'bg-white border-2 border-blue-600 shadow-2xl shadow-blue-600/15 lg:-translate-y-2'
                    : 'bg-white border border-slate-200/80 shadow-md hover:shadow-xl hover:-translate-y-1'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-extrabold uppercase tracking-widest px-4 py-1 rounded-full shadow-md flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    {plan.badge}
                  </div>
                )}

                <div>
                  {/* Card Title & Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-extrabold text-slate-900">{plan.name}</h3>
                    {!plan.popular && (
                      <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 mb-6 leading-relaxed min-h-[36px]">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-8 pb-6 border-b border-slate-100">
                    <span className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
                      ${price}
                    </span>
                    <span className="text-sm font-semibold text-slate-500">
                      / month per vehicle
                    </span>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3.5 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-xs font-medium text-slate-700">
                        <div className={`rounded-full p-0.5 ${plan.popular ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
                          <Check className="h-3.5 w-3.5" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <div>
                  <Link
                    to="/login"
                    className={`w-full inline-flex items-center justify-center rounded-xl py-3.5 text-sm font-bold transition-all ${plan.buttonStyle}`}
                  >
                    {plan.buttonText}
                  </Link>

                  <div className="flex items-center justify-center gap-2 mt-4 text-[11px] text-slate-400 font-medium">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                    <span>No hidden fees • Cancel anytime</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
