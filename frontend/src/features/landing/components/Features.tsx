import { useState } from 'react';
import {
  Navigation,
  Fuel,
  Wrench,
  UserCheck,
  Route,
  BarChart3,
  ShieldCheck,
  CalendarCheck,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';

type FeatureItem = {
  title: string;
  description: string;
  icon: LucideIcon;
  badge: string;
};

export const Features = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const featuresList: FeatureItem[] = [
    {
      title: 'REAL-TIME TRACKING (GPS)',
      description: 'Real-time GPS tracking of fleet assets, live map visualization, geofencing, and automated ETA notifications.',
      icon: Navigation,
      badge: 'GPS & Telematics',
    },
    {
      title: 'FUEL CONSUMPTION MONITORING',
      description: 'Maximize fuel efficiency through optimized routes, idling reduction alerts, and fuel card integration.',
      icon: Fuel,
      badge: 'Cost Savings',
    },
    {
      title: 'PREDICTIVE MAINTENANCE ALERTS',
      description: 'Proactive maintenance alerts and engine diagnostic monitoring to prevent costly highway breakdowns.',
      icon: Wrench,
      badge: 'Zero Downtime',
    },
    {
      title: 'DRIVER BEHAVIOR ANALYSIS',
      description: 'Monitor driver behavior, speed violations, harsh braking, and score drivers for safety bonuses.',
      icon: UserCheck,
      badge: 'Safety First',
    },
    {
      title: 'ROUTE OPTIMIZATION',
      description: 'Calculate optimal routes based on live traffic, road constraints, cargo weight, and fuel consumption.',
      icon: Route,
      badge: 'AI Routing',
    },
    {
      title: 'COMPREHENSIVE REPORTING',
      description: 'Generate instant executive reports on cost per mile, vehicle utilization, emissions, and total ROI.',
      icon: BarChart3,
      badge: 'Analytics',
    },
    {
      title: 'ASSET MANAGEMENT',
      description: 'Asset management tools to track cargo containers, trailers, and specialized heavy machinery.',
      icon: ShieldCheck,
      badge: 'Security',
    },
    {
      title: 'SMART DISPATCH & SCHEDULING',
      description: 'Automate driver assignment, load matching, and shift scheduling for maximum operational throughput.',
      icon: CalendarCheck,
      badge: 'Automation',
    },
  ];

  return (
    <section id="features" className="py-24 bg-white/75 backdrop-blur-sm border-t border-slate-200/80">
      <div className="container mx-auto px-6 lg:px-12">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200">
            Platform Capabilities
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight mt-4 mb-4">
            KEY FEATURES
          </h2>
          <p className="text-lg text-slate-600">
            Everything fleet managers need to gain full operational visibility and reduce overhead.
          </p>
        </div>

        {/* 8 Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {featuresList.map((item, index) => {
            const isHovered = hoveredIndex === index;
            const Icon = item.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className={`rounded-2xl p-6 border transition-all duration-300 ease-out flex flex-col justify-between cursor-pointer ${
                  isHovered
                    ? 'bg-blue-600 border-blue-600 shadow-xl shadow-blue-500/25 -translate-y-1.5'
                    : 'bg-slate-50/70 border-slate-200/80 hover:shadow-xl hover:shadow-blue-500/5'
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`h-12 w-12 rounded-xl flex items-center justify-center shadow-sm transition-colors duration-300 ${
                        isHovered
                          ? 'bg-white/15 border border-white/30'
                          : 'bg-white border border-slate-200'
                      }`}
                    >
                      <Icon
                        className={`h-6 w-6 transition-colors duration-300 ${
                          isHovered ? 'text-white' : 'text-blue-600'
                        }`}
                      />
                    </div>
                    <CheckCircle2
                      className={`h-5 w-5 transition-colors duration-300 ${
                        isHovered ? 'text-white' : 'text-emerald-500'
                      }`}
                    />
                  </div>

                  <span
                    className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-md mb-2 transition-colors duration-300 ${
                      isHovered ? 'text-white bg-white/20' : 'text-blue-700 bg-blue-100/80'
                    }`}
                  >
                    {item.badge}
                  </span>

                  <h3
                    className={`text-base font-extrabold uppercase tracking-tight mb-2 transition-colors duration-300 ${
                      isHovered ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {item.title}
                  </h3>

                  <p
                    className={`text-xs leading-relaxed transition-colors duration-300 ${
                      isHovered ? 'text-blue-50' : 'text-slate-600'
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};