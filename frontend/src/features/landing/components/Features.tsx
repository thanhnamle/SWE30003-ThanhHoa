import { 
  Navigation, 
  Fuel, 
  Wrench, 
  UserCheck, 
  Route, 
  BarChart3, 
  ShieldCheck, 
  CalendarCheck,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Features = () => {
  const featuresList = [
    {
      title: 'REAL-TIME TRACKING (GPS)',
      description: 'Real-time GPS tracking of fleet assets, live map visualization, geofencing, and automated ETA notifications.',
      icon: <Navigation className="h-6 w-6 text-blue-600" />,
      badge: 'GPS & Telematics',
    },
    {
      title: 'FUEL CONSUMPTION MONITORING',
      description: 'Maximize fuel efficiency through optimized routes, idling reduction alerts, and fuel card integration.',
      icon: <Fuel className="h-6 w-6 text-blue-600" />,
      badge: 'Cost Savings',
    },
    {
      title: 'PREDICTIVE MAINTENANCE ALERTS',
      description: 'Proactive maintenance alerts and engine diagnostic monitoring to prevent costly highway breakdowns.',
      icon: <Wrench className="h-6 w-6 text-blue-600" />,
      badge: 'Zero Downtime',
    },
    {
      title: 'DRIVER BEHAVIOR ANALYSIS',
      description: 'Monitor driver behavior, speed violations, harsh braking, and score drivers for safety bonuses.',
      icon: <UserCheck className="h-6 w-6 text-blue-600" />,
      badge: 'Safety First',
    },
    {
      title: 'ROUTE OPTIMIZATION',
      description: 'Calculate optimal routes based on live traffic, road constraints, cargo weight, and fuel consumption.',
      icon: <Route className="h-6 w-6 text-blue-600" />,
      badge: 'AI Routing',
    },
    {
      title: 'COMPREHENSIVE REPORTING',
      description: 'Generate instant executive reports on cost per mile, vehicle utilization, emissions, and total ROI.',
      icon: <BarChart3 className="h-6 w-6 text-blue-600" />,
      badge: 'Analytics',
    },
    {
      title: 'ASSET MANAGEMENT',
      description: 'Asset management tools to track cargo containers, trailers, and specialized heavy machinery.',
      icon: <ShieldCheck className="h-6 w-6 text-blue-600" />,
      badge: 'Security',
    },
    {
      title: 'SMART DISPATCH & SCHEDULING',
      description: 'Automate driver assignment, load matching, and shift scheduling for maximum operational throughput.',
      icon: <CalendarCheck className="h-6 w-6 text-blue-600" />,
      badge: 'Automation',
    },
  ];

  return (
    <section id="features" className="py-24 bg-white border-t border-slate-200/80">
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
          {featuresList.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-6 hover:bg-white hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors">
                    <span className="group-hover:text-white transition-colors">
                      {item.icon}
                    </span>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                </div>

                <span className="inline-block text-[11px] font-bold text-blue-700 bg-blue-100/80 px-2.5 py-0.5 rounded-md mb-2">
                  {item.badge}
                </span>

                <h3 className="text-base font-extrabold text-slate-900 uppercase tracking-tight mb-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
