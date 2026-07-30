import { Truck, Globe } from 'lucide-react';
import { Link } from 'react-router';

const NAV_COLS = [
  {
    heading: 'Product',
    links: [
      { label: 'Pricing Plans', to: '/pricing' },
      { label: 'Key Features', to: '/#features' },
      { label: 'Route Optimization', to: '/#features' },
      { label: 'Fleet Analytics', to: '/#features' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About SmartFM', to: '/' },
      { label: 'Contact Us', to: '/' },
      { label: 'Careers', to: '/' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/' },
      { label: 'Terms of Service', to: '/' },
      { label: 'Cookie Policy', to: '/' },
    ],
  },
];

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800">
      {/* Top accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

      <div className="container mx-auto px-6 lg:px-12 py-16">
        {/* Main grid: brand left, 3 nav cols right */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1 flex flex-col gap-5">
            <Link to="/" className="flex items-center gap-2.5 w-fit">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600">
                <Truck className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight uppercase">
                Smart<span className="text-blue-500">FM</span>
              </span>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-[220px]">
              End-to-end fleet management & telematics for enterprise logistics.
            </p>

            <p className="text-xs text-slate-500">
              contact@smartfm.vn
            </p>
          </div>

          {/* Nav columns */}
          {NAV_COLS.map((col) => (
            <div key={col.heading} className="flex flex-col gap-4">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
                {col.heading}
              </p>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SmartFM Inc. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5" />
            <span>English (US)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};