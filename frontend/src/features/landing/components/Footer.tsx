import { Truck, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { Link } from 'react-router';

export const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white pt-16 pb-12 border-t border-slate-900">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
                <Truck className="h-5 w-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white uppercase">
                Smart<span className="text-blue-500">FM</span>
              </span>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              SmartFM is an end-to-end fleet management & logistics telematics solution powering enterprise transportation systems worldwide.
            </p>

            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-500" />
                <span>100 Logistics Way, Tech Park, CA 94105</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-500" />
                <span>+1 (800) 555-SMARTFM</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-500" />
                <span>contact@smartfm.vn</span>
              </div>
            </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-200 mb-4">Features</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li><a href="#features" className="hover:text-blue-400 transition-colors">Real-Time Tracking</a></li>
              <li><a href="#features" className="hover:text-blue-400 transition-colors">Fuel Monitoring</a></li>
              <li><a href="#features" className="hover:text-blue-400 transition-colors">Predictive Maintenance</a></li>
              <li><a href="#features" className="hover:text-blue-400 transition-colors">Route Optimization</a></li>
              <li><a href="#features" className="hover:text-blue-400 transition-colors">Asset Management</a></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-200 mb-4">Company</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li><a href="#" className="hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Careers & Hiring</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Case Studies</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Partners & Integrations</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Press & Media</a></li>
            </ul>
          </div>

          {/* Links Col 3 */}
          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-200 mb-4">Support & Legal</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">API Reference</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Security Center</a></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-medium">
          <p>© {new Date().getFullYear()} SmartFM Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" /> English (US)</span>
            <a href="#" className="hover:text-slate-400">Privacy</a>
            <a href="#" className="hover:text-slate-400">Terms</a>
            <a href="#" className="hover:text-slate-400">Cookies</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
