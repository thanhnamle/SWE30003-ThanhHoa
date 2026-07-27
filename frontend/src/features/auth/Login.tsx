import { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Truck,
  Mail,
  Lock,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  Route,
  MapPin,
  PackageCheck,
  TriangleAlert,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { LoginIntroAnimation } from '@/features/auth/LoginIntroAnimation'; // Import component animation

const loginSchema = z.object({
  email: z.string().min(1, 'Please enter your email address.').email('Invalid email address'),
  password: z.string().min(1, 'Please enter your password.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const ROUTE_PATH =
  'M 40,520 C 95,455 35,395 110,355 C 190,312 148,238 228,208 C 300,182 258,108 322,58';

const FEATURES = [
  { icon: Route, text: 'Optimize routes in real-time' },
  { icon: MapPin, text: 'Track vehicle positions live' },
  { icon: PackageCheck, text: 'Instant delivery confirmation' },
];

export function Login() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showIntro, setShowIntro] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  if (isAuthenticated && !showIntro) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: LoginFormValues) => {
    setServerError(null);
    setIsSubmitting(true);
    try {
      await login(data);
      // Khi login thành công, bật màn hình Intro lên thay vì chuyển trang ngay
      setShowIntro(true);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hàm xử lý sau khi xe tải chạy xong
  const handleAnimationFinish = () => {
    const from = (location.state as { from?: Location })?.from?.pathname;
    const target = from && from !== '/' ? from : '/dashboard';
    navigate(target, { replace: true });
  };

  // Nếu showIntro = true, hiển thị màn hình xe tải chạy
  if (showIntro) {
    return <LoginIntroAnimation onFinish={handleAnimationFinish} />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-full flex bg-slate-50"
    >
      <style>{`
        @keyframes sfm-dash-flow { to { stroke-dashoffset: -240; } }
        @keyframes sfm-travel { from { offset-distance: 0%; } to { offset-distance: 100%; } }
        @keyframes sfm-pin-pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.55; } }
        @keyframes sfm-fade-up { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes sfm-shake { 10%, 90% { transform: translateX(-1px); } 20%, 80% { transform: translateX(2px); } 30%, 50%, 70% { transform: translateX(-4px); } 40%, 60% { transform: translateX(4px); } }
        @keyframes sfm-grid-drift { from { background-position: 0 0; } to { background-position: -56px 56px; } }
        @keyframes sfm-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }

        .sfm-panel-bg {
          background-image: radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px);
          background-size: 28px 28px;
          animation: sfm-grid-drift 12s linear infinite;
        }
        .sfm-route-path {
          stroke-dasharray: 6 10;
          animation: sfm-dash-flow 4.5s linear infinite;
        }
        .sfm-truck {
          offset-path: path('${ROUTE_PATH}');
          offset-rotate: auto;
          animation: sfm-travel 6.5s linear infinite;
        }
        .sfm-pin {
          animation: sfm-pin-pulse 2.2s ease-in-out infinite;
        }
        .sfm-pin:nth-child(2) { animation-delay: 0.6s; }
        .sfm-pin:nth-child(3) { animation-delay: 1.2s; }
        .sfm-enter {
          opacity: 0;
          animation: sfm-fade-up 0.55s ease-out forwards;
        }
        .sfm-shake { animation: sfm-shake 0.4s ease-in-out; }
        .sfm-glow-orb {
          animation: sfm-float 7s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .sfm-panel-bg, .sfm-route-path, .sfm-truck, .sfm-pin, .sfm-enter, .sfm-shake, .sfm-glow-orb {
            animation: none !important;
          }
        }
      `}</style>

      {/* Brand / route panel */}
      <div className="hidden lg:flex lg:w-[46%] relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950">
        <div className="absolute inset-0 sfm-panel-bg" />
        <div className="absolute -top-16 -left-16 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl sfm-glow-orb" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl sfm-glow-orb" style={{ animationDelay: '2s' }} />

        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-12 w-full">
          <div className="flex items-center gap-3 sfm-enter">
            <div className="bg-white/10 border border-white/15 rounded-2xl p-2.5 backdrop-blur-sm">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-semibold text-lg tracking-tight">SmartFM</span>
          </div>

          <div className="relative flex-1 flex items-center justify-center py-6">
            <svg viewBox="0 0 360 560" className="w-full max-w-[280px] h-auto" fill="none">
              <path
                d={ROUTE_PATH}
                stroke="rgba(147, 197, 253, 0.9)"
                strokeWidth="3"
                strokeLinecap="round"
                className="sfm-route-path"
              />
              <circle cx="40" cy="520" r="6" fill="#93C5FD" className="sfm-pin" />
              <circle cx="190" cy="300" r="6" fill="#93C5FD" className="sfm-pin" />
              <circle cx="322" cy="58" r="7" fill="#BFDBFE" className="sfm-pin" />
            </svg>
            <div className="sfm-truck absolute top-0 left-0 bg-white rounded-lg p-1.5 shadow-lg shadow-blue-950/40">
              <Truck className="w-4 h-4 text-blue-700" />
            </div>
          </div>

          <div className="space-y-6 sfm-enter" style={{ animationDelay: '0.1s' }}>
            <div>
              <h2 className="text-white text-2xl font-bold leading-snug tracking-tight">
                Operate your fleet smarter,
                <br />
                every day.
              </h2>
              <p className="text-blue-200/80 text-sm mt-2">
                Centralized fleet management for all your vehicles.
              </p>
            </div>
            <ul className="space-y-3">
              {FEATURES.map(({ icon: Icon, text }, i) => (
                <li
                  key={text}
                  className="flex items-center gap-3 text-blue-100/90 text-sm sfm-enter"
                  style={{ animationDelay: `${0.2 + i * 0.1}s` }}
                >
                  <span className="shrink-0 bg-white/10 rounded-lg p-1.5">
                    <Icon className="w-4 h-4" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-4 relative">
        <div
          className="absolute inset-0 lg:hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50"
          aria-hidden
        />
        <div className="w-full max-w-md relative">
          <Link 
            to="/" 
            className="absolute -top-12 left-0 flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors sfm-enter"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <div className="flex flex-col items-center mb-8 lg:hidden sfm-enter">
            <div className="bg-blue-600 rounded-2xl p-3 shadow-lg shadow-blue-500/20 mb-4">
              <Truck className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">SmartFM</h1>
            <p className="text-gray-500 text-sm mt-1">Log in to your fleet management system</p>
          </div>

          <div className="hidden lg:block mb-8 sfm-enter">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-gray-500 text-sm mt-1">Log in to continue managing your vehicle fleet.</p>
          </div>

          <div
            className={`bg-white/80 backdrop-blur-xl border border-gray-200/60 rounded-3xl p-8 shadow-sm ${serverError ? 'sfm-shake opacity-100' : 'sfm-enter'}`}
            style={{ animationDelay: '0.1s' }}
          >
            {serverError && (
              <div className="mb-5 p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2 text-sm text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                  <input
                    type="email"
                    {...register('email')}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-gray-50 focus:bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:-translate-y-0.5 ${
                      errors.email ? 'border-red-300' : 'border-gray-200 focus:border-blue-400'
                    }`}
                    placeholder="name@company.com"
                    autoComplete="email"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400 transition-colors group-focus-within:text-blue-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    onKeyUp={(e) => setCapsLockOn(e.getModifierState?.('CapsLock') ?? false)}
                    className={`w-full pl-10 pr-10 py-3 rounded-xl border bg-gray-50 focus:bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:-translate-y-0.5 ${
                      errors.password ? 'border-red-300' : 'border-gray-200 focus:border-blue-400'
                    }`}
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {capsLockOn && (
                  <p className="text-amber-600 text-xs flex items-center gap-1">
                    <TriangleAlert className="w-3.5 h-3.5" /> Caps Lock is on
                  </p>
                )}
                {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] disabled:opacity-50 disabled:hover:translate-y-0 text-white rounded-xl font-medium transition-all duration-200 shadow-md shadow-blue-500/20"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log in'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                Sign up now
              </Link>
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6 sfm-enter" style={{ animationDelay: '0.2s' }}>
            Demo account: admin@smartfm.vn / Admin123!
          </p>
        </div>
      </div>
    </motion.div>
  );
}