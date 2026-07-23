import { Mail, Code2, Database, TestTube2, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

const GithubIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const FacebookIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export const AboutUs = () => {
  const teamMembers = [
    {
      name: 'Thanh Nam Le',
      role: 'Software Architect & Backend Lead',
      description: 'Designed the core Domain & Application layer architecture, CQRS patterns, and C# RESTful API endpoints.',
      avatar: 'namle.jpg',
      badge: 'Role 1: Application Architecture',
      icon: <Code2 className="h-4 w-4 text-blue-600" />,
      github: 'https://github.com/thanhnamle',
      facebook: 'https://www.facebook.com/slnamle/',
      email: 'mailto:104999380@student.swin.edu.au',
    },
    {
      name: 'Chanh Nguyen',
      role: 'Database & Infrastructure Engineer',
      description: 'Implemented MySQL database schema, Entity Framework Core repositories, and Docker deployment pipeline.',
      avatar: 'chanhnguyen.jpg',
      badge: 'Role 2: Infrastructure & Data',
      icon: <Database className="h-4 w-4 text-blue-600" />,
      github: 'https://github.com/chanhbe',
      facebook: 'https://www.facebook.com/bachanh.be#',
      email: 'mailto:104813299@student.swin.edu.au',
    },
    {
      name: 'Minh Huynh',
      role: 'Integration & QA Specialist',
      description: 'Led end-to-end integration testing, automated unit tests, and security vulnerability auditing.',
      avatar: 'huynhminh.jpg',
      badge: 'Role 3: Quality Assurance',
      icon: <TestTube2 className="h-4 w-4 text-blue-600" />,
      github: 'https://github.com/hdhminh',
      facebook: 'https://www.facebook.com/huynh.minh.461931',
      email: 'mailto:104777308@student.swin.edu.au',
    },
    {
      name: 'Thanh Huynh',
      role: 'Frontend Architect & UX Designer',
      description: 'Crafted the React TypeScript dashboard UI, Tailwind design system, and responsive landing experience.',
      avatar: 'thanhhuynh.jpg',
      badge: 'Role 4: Frontend & UX/UI',
      icon: <Palette className="h-4 w-4 text-blue-600" />,
      github: 'https://github.com/ThanhHuynh05',
      facebook: 'https://www.facebook.com/thanh.huynh.9215',
      email: 'mailto:105296615@student.swin.edu.au',
    },
  ];

  return (
    <section id="about-us" className="py-24 bg-slate-50 border-t border-slate-200/80 relative">
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

              {/* Social Links: GitHub, Facebook, Mail */}
              <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-100">
                <a 
                  href={member.github} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="GitHub"
                  className="p-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                >
                  <GithubIcon className="h-4 w-4" />
                </a>
                <a 
                  href={member.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  title="Facebook"
                  className="p-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                >
                  <FacebookIcon className="h-4 w-4" />
                </a>
                <a 
                  href={member.email}
                  title="Send Email"
                  className="p-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                >
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