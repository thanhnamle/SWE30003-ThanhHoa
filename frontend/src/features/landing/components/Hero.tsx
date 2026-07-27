import {
  ArrowRight,
  Play,
  CheckCircle2,
  ShieldCheck,
  Zap,
  TrendingUp,
  Navigation,
  ChevronDown,
  Truck,
  MapPin,
  Gauge,
} from 'lucide-react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/* ─── Isometric Building Block ─── */
const Building = ({
  x,
  y,
  w,
  d = w,
  h,
  colorTop,
  colorFront,
  colorSide,
}: {
  x: number;
  y: number;
  w: number;
  d?: number;
  h: number;
  colorTop: string;
  colorFront: string;
  colorSide: string;
}) => (
  <div
    className="absolute"
    style={{ left: x, top: y, transformStyle: 'preserve-3d' }}
  >
    {/* Mặt trên */}
    <div
      style={{
        position: 'absolute',
        width: w,
        height: d,
        background: colorTop,
        transform: `translateZ(${h}px)`,
        borderRadius: 2,
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.4)',
      }}
    />
    {/* Mặt trước */}
    <div
      style={{
        position: 'absolute',
        width: w,
        height: h,
        background: colorFront,
        transform: `rotateX(-90deg) translateY(${d}px)`,
        transformOrigin: 'top',
        borderRadius: '0 0 2px 2px',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.2)',
      }}
    />
    {/* Mặt bên hông */}
    <div
      style={{
        position: 'absolute',
        width: d,
        height: h,
        background: colorSide,
        transform: `rotateY(90deg) translateX(${w}px)`,
        transformOrigin: 'left',
        borderRadius: '0 0 2px 2px',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.15)',
      }}
    />
  </div>
);

/* ─── 3D Isometric Platform ─── */
const IsometricPlatform = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      setMousePos({ x: x * 8, y: y * -6 });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full max-w-2xl mx-auto"
      style={{ perspective: '1200px' }}
    >
      <motion.div
        className="relative"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateX: 12 + mousePos.y, rotateY: -8 + mousePos.x }}
        transition={{ type: 'spring', stiffness: 60, damping: 20 }}
      >
        {/* Card kính chính */}
        <div
          className="rounded-3xl p-5 relative overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.65)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.5)',
            boxShadow:
              '0 8px 32px rgba(31, 38, 135, 0.07), inset 0 1px 0 rgba(255,255,255,0.6)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Inner content area */}
          <div
            className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-slate-200/60"
            style={{
              background: 'linear-gradient(to bottom right, #f8fafc, #f1f5f9)',
            }}
          >
            {/* Không gian Isometric 3D */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div
                className="relative"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: 'rotateX(55deg) rotateZ(-45deg)',
                  width: 0,
                  height: 0,
                }}
              >
                {/* Ground Plane */}
                <div
                  className="absolute rounded-3xl border border-blue-200/40"
                  style={{
                    width: 260,
                    height: 260,
                    left: -130,
                    top: -130,
                    background:
                      'linear-gradient(to bottom right, rgba(191,219,254,0.35), rgba(207,250,254,0.25))',
                    transform: 'translateZ(-2px)',
                  }}
                />

                {/* Route Line */}
                <svg
                  width="260"
                  height="260"
                  style={{
                    position: 'absolute',
                    left: -130,
                    top: -130,
                    transform: 'translateZ(2px)',
                  }}
                >
                  <defs>
                    <linearGradient
                      id="routeGrad"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 30 130 C 80 50, 180 210, 230 130"
                    stroke="url(#routeGrad)"
                    strokeWidth="3.5"
                    fill="none"
                    strokeDasharray="6 4"
                    opacity="0.8"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="100"
                      to="0"
                      dur="2.5s"
                      repeatCount="indefinite"
                    />
                  </path>
                </svg>

                {/* Khối nhà (Đã điều chỉnh vị trí xa tuyến đường) */}
                <Building
                  x={-90}
                  y={-90}
                  w={32}
                  d={32}
                  h={35}
                  colorTop="#93c5fd"
                  colorFront="#2563eb"
                  colorSide="#1d4ed8"
                />
                <Building
                  x={30}
                  y={-95}
                  w={30}
                  d={30}
                  h={45}
                  colorTop="#a5b4fc"
                  colorFront=""
                  colorSide=""
                />
                <Building
                  x={75}
                  y={55}
                  w={32}
                  d={32}
                  h={30}
                  colorTop="#67e8f9"
                  colorFront="#0891b2"
                  colorSide="#0e7490"
                />
                <Building
                  x={-95}
                  y={65}
                  w={28}
                  d={28}
                  h={32}
                  colorTop="#cbd5e1"
                  colorFront="#475569"
                  colorSide="#334155"
                />

                {/* ─── 3D Floating Vehicle Icons (Nổi hẳn lên trên tuyến đường) ─── */}
                
                {/* Icon 1: MapPin (Đầu tuyến đường - Bên trái) */}
                <div
                  className="absolute"
                  style={{
                    left: -35,
                    top: 0,
                    transform:
                      'translate3d(-95px, 0px, 5px) rotateZ(45deg) rotateX(-55deg)',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 3.5,
                      ease: 'easeInOut',
                    }}
                    className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-cyan-200/80 flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
                  >
                    <MapPin className="h-5 w-5 text-cyan-600" />
                  </motion.div>
                </div>

                {/* Icon 2: Truck (Giữa tuyến đường - Trung tâm) */}
                <div
                  className="absolute"
                  style={{
                    left: 0,
                    top: 0,
                    transform:
                      'translate3d(0px, 0px, -5px) rotateZ(45deg) rotateX(-55deg)',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 4,
                      ease: 'easeInOut',
                    }}
                    className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-blue-200/80 flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
                  >
                    <Truck className="h-5 w-5 text-blue-600" />
                  </motion.div>
                </div>

                {/* Icon 3: Gauge (Cuối tuyến đường - Bên phải) */}
                <div
                  className="absolute"
                  style={{
                    left: 0,
                    top: 0,
                    transform:
                      'translate3d(95px, 0px, 5px) rotateZ(45deg) rotateX(-55deg)',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 3.8,
                      ease: 'easeInOut',
                    }}
                    className="w-10 h-10 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-indigo-200/80 flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
                  >
                    <Gauge className="h-5 w-5 text-indigo-600" />
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Badge 1: Top Right */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: [0, -4, 0], scale: 1 }}
              transition={{
                opacity: { duration: 0.5, delay: 0.9 },
                scale: { duration: 0.5, delay: 0.9 },
                y: { repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 0.9 },
              }}
              className="absolute top-4 right-4 z-20 px-3.5 py-2 rounded-2xl flex items-center gap-2.5"
              style={{
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.7)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
              }}
            >
              <div className="flex h-2.5 w-2.5 relative">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </div>
              <div>
                <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Live Status
                </span>
                <span className="text-xs font-bold text-slate-900">
                  1,248 Vehicles Active
                </span>
              </div>
            </motion.div>

            {/* Badge 2: Bottom Left */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: [0, 5, 0], scale: 1 }}
              transition={{
                opacity: { duration: 0.5, delay: 1.1 },
                scale: { duration: 0.5, delay: 1.1 },
                y: { repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1.1 },
              }}
              className="absolute bottom-4 left-4 z-20 px-3.5 py-2 rounded-2xl flex items-center gap-2.5"
              style={{
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.7)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
              }}
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <TrendingUp className="h-3.5 w-3.5" />
              </div>
              <div>
                <span className="block text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Fuel Optimization
                </span>
                <span className="text-xs font-bold text-emerald-600">
                  -18.4% Savings
                </span>
              </div>
            </motion.div>

            {/* Badge 3: Top Left */}
            <motion.div
              initial={{ opacity: 0, x: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: [0, -4, 0], x: 0, scale: 1 }}
              transition={{
                opacity: { duration: 0.5, delay: 1.3 },
                scale: { duration: 0.5, delay: 1.3 },
                x: { duration: 0.5, delay: 1.3 },
                y: { repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 1.3 },
              }}
              className="absolute top-4 left-4 z-20 px-3 py-2 rounded-2xl flex items-center gap-2"
              style={{
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.7)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
              }}
            >
              <Navigation className="h-3.5 w-3.5 text-cyan-500" />
              <span className="text-xs font-extrabold text-slate-800">
                99.4% On-Time
              </span>
            </motion.div>
          </div>
        </div>

        {/* Glow Nền */}
        <div
          className="absolute -inset-6 -z-10 rounded-[3rem] pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom right, rgba(96,165,250,0.2), rgba(129,140,248,0.1), rgba(34,211,238,0.2))',
            filter: 'blur(40px)',
          }}
        />
      </motion.div>
    </div>
  );
};

export const Hero = () => {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-slate-50/70 to-white/70 py-20 lg:py-28"
    >
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-text {
          background-size: 200% auto;
          animation: gradientShift 5s ease infinite;
        }
      `}</style>

      {/* Background Orbs */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-blue-300/20 blur-[120px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-40 right-10 w-96 h-96 bg-cyan-200/20 blur-[100px] rounded-full pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.25, 0.1] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute bottom-20 left-20 w-72 h-72 bg-indigo-300/20 blur-[100px] rounded-full pointer-events-none"
      />

      {/* Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(59,130,246,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(59,130,246,0.07) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage:
            'radial-gradient(ellipse 65% 65% at 50% 0%, black 40%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 65% 65% at 50% 0%, black 40%, transparent 100%)',
        }}
      />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Content Bên Trái */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex-1 text-center lg:text-left"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-100/70 px-4 py-1.5 text-xs font-bold text-blue-700 mb-6 uppercase tracking-wider shadow-sm"
            >
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  repeatDelay: 2.5,
                  ease: 'easeInOut',
                }}
              >
                <Zap className="h-3.5 w-3.5 fill-blue-600 text-blue-600" />
              </motion.span>
              Smart Fleet Management Platform
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.18] tracking-tight mb-6">
              <motion.span
                variants={itemVariants}
                className="block text-slate-500 font-semibold text-xl md:text-2xl mb-2 tracking-normal uppercase"
              >
                SmartFM Ecosystem
              </motion.span>
              <motion.span
                variants={itemVariants}
                className="block font-black text-slate-900"
              >
                Revolutionize Your{' '}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent animate-gradient-text">
                    Fleet Operations
                  </span>
                  <span className="absolute -bottom-1.5 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 rounded-full opacity-75 shadow-sm" />
                </span>
              </motion.span>
            </h1>

            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal mb-8"
            >
              Optimize operations, reduce costs, and gain real-time visibility
              with our advanced telematic and fleet management platform.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10"
            >
              <Link
                to="/login"
                className="relative w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-500/25 hover:bg-blue-700 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all uppercase tracking-wide overflow-hidden group"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12" />
                REQUEST A FREE DEMO
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white px-7 py-4 text-base font-bold text-slate-700 shadow-sm hover:border-blue-300 hover:bg-blue-50/50 hover:-translate-y-0.5 transition-all"
              >
                <Play className="h-4 w-4 fill-slate-700 text-slate-700" />
                EXPLORE PLATFORM
              </Link>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm font-semibold text-slate-500 pt-4 border-t border-slate-200/60"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                <span>ISO 27001 Certified</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Đồ họa Isometric 3D Bên Phải */}
          <motion.div
            initial={{ opacity: 0, x: 40, rotateY: -8 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 relative w-full max-w-2xl"
            style={{ perspective: 1000 }}
          >
            <IsometricPlatform />
          </motion.div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="hidden lg:flex justify-center mt-16"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-1 text-slate-400"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Scroll
            </span>
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};