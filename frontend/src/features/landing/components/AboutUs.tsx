import { Mail, Code2, Database, TestTube2, Palette, Globe, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export const AboutUs = () => {
  const teamMembers = [
    {
      name: 'Thanh Nam Le',
      role: 'Software Architect & Backend Lead',
      description: 'Designed the core Domain & Application layer architecture, CQRS patterns, and C# RESTful API endpoints.',
      avatar: '/public/namle.jpg',
      badge: 'Role 1: Application Architecture',
      icon: <Code2 className="h-4 w-4 text-blue-600" />,
    },
    {
      name: 'Chanh Nguyen',
      role: 'Database & Infrastructure Engineer',
      description: 'Implemented MySQL database schema, Entity Framework Core repositories, and Docker deployment pipeline.',
      avatar: '/public/chanhnguyen.jpg',
      badge: 'Role 2: Infrastructure & Data',
      icon: <Database className="h-4 w-4 text-blue-600" />,
    },
    {
      name: 'Minh Huynh',
      role: 'Integration & QA Specialist',
      description: 'Led end-to-end integration testing, automated unit tests, and security vulnerability auditing.',
      avatar: '/public/huynhminh.jpg',
      badge: 'Role 3: Quality Assurance',
      icon: <TestTube2 className="h-4 w-4 text-blue-600" />,
    },
    {
      name: 'Thanh Huynh',
      role: 'Frontend Architect & UX Designer',
      description: 'Crafted the React TypeScript dashboard UI, Tailwind design system, and responsive landing experience.',
      avatar: '/public/thanhhuynh.jpg',
      badge: 'Role 4: Frontend & UX/UI',
      icon: <Palette className="h-4 w-4 text-blue-600" />,
    },
  ];

  return (
    <section id="about-us" className="py-24 bg-slate-50/75 backdrop-blur-sm border-t border-slate-200/80 relative">
      <div className="container mx-auto px-6 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-100/80 px-4 py-1.5 rounded-full border border-blue-200">
            SWE30003 Architecture Team
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight mt-4 mb-4">
            ABOUT OUR TEAM
          </h2>
          <p className="text-lg text-slate-600">
            Meet the four software architects and engineers who designed and built the SmartFM fleet management ecosystem.
          </p>
        </div>

        {/* 4 Team Members Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all group flex flex-col justify-between"
            >
              <div>
                {/* Member Avatar */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden border-2 border-blue-100 shadow-md group-hover:border-blue-500 transition-colors">
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white shadow-sm border border-slate-200 rounded-full p-1.5">
                    {member.icon}
                  </div>
                </div>

                {/* Badge */}
                <div className="text-center mb-2">
                  <span className="inline-block text-[11px] font-extrabold text-blue-700 bg-blue-50 px-3 py-1 rounded-md border border-blue-100">
                    {member.badge}
                  </span>
                </div>

                {/* Info */}
                <div className="text-center mb-4">
                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500">
                    {member.role}
                  </p>
                </div>

                <p className="text-xs text-slate-600 text-center leading-relaxed mb-6">
                  {member.description}
                </p>
              </div>

              {/* Social Links */}
              <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-100">
                <a href="#" className="p-2 rounded-xl bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <Globe className="h-4 w-4" />
                </a>
                <a href="#" className="p-2 rounded-xl bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <ExternalLink className="h-4 w-4" />
                </a>
                <a href="mailto:contact@smartfm.vn" className="p-2 rounded-xl bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};