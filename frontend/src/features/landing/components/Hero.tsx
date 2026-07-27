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
        borderRadius: 3,
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.5)',
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
        borderRadius: '0 0 3px 3px',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.25)',
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
        borderRadius: '0 0 3px 3px',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)',
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
      setMousePos({ x: x * 10, y: y * -8 });
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
        animate={{ rotateX: 14 + mousePos.y, rotateY: -10 + mousePos.x }}
        transition={{ type: 'spring', stiffness: 50, damping: 18 }}
      >
        {/* ─── Khung Ngoại Viền Màu Chạy (Running Border Light) ─── */}
        <div className="relative rounded-[26px] p-[2px] overflow-hidden shadow-2xl">
          {/* Vệt màu Gradient xoay 360 độ tạo hiệu ứng viền chạy */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
            className="absolute -inset-[150%] origin-center pointer-events-none"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0%, transparent 65%, #06b6d4 80%, #3b82f6 90%, #a855f7 100%)',
            }}
          />

          {/* Card kính chính */}
          <div
            className="rounded-[24px] p-5 md:p-6 relative overflow-hidden z-10"
            style={{
              background: 'rgba(255, 255, 255, 0.82)',
              backdropFilter: 'blur(24px) saturate(200%)',
              WebkitBackdropFilter: 'blur(24px) saturate(200%)',
              boxShadow:
                '0 20px 50px rgba(30, 58, 138, 0.1), inset 0 1px 0 rgba(255,255,255,0.9)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Inner content area */}
            <div
              className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-slate-200/80 shadow-inner"
              style={{
                background:
                  'radial-gradient(circle at 50% 30%, #f8fafc, #e2e8f0)',
              }}
            >
              {/* Viền sáng Laser quét xung quanh khung màn hình bên trong */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-30"
                style={{ filter: 'drop-shadow(0 0 3px #3b82f6)' }}
              >
                <rect
                  x="1"
                  y="1"
                  width="99.5%"
                  height="99.5%"
                  rx="15"
                  fill="none"
                  stroke="url(#innerBorderGrad)"
                  strokeWidth="2"
                  strokeDasharray="120 300"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="840"
                    to="0"
                    dur="4s"
                    repeatCount="indefinite"
                  />
                </rect>
                <defs>
                  <linearGradient
                    id="innerBorderGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="50%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>

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
                    className="absolute rounded-3xl border-2 border-blue-300/50"
                    style={{
                      width: 340,
                      height: 340,
                      left: -170,
                      top: -170,
                      background:
                        'radial-gradient(circle, rgba(219,234,254,0.6) 0%, rgba(186,230,253,0.3) 70%, rgba(191,219,254,0.15) 100%)',
                      transform: 'translateZ(-2px)',
                      boxShadow: '0 0 40px rgba(59, 130, 246, 0.15)',
                    }}
                  >
                    {/* Họa tiết Lưới Grid */}
                    <div
                      className="absolute inset-0 rounded-3xl opacity-30"
                      style={{
                        backgroundImage:
                          'radial-gradient(#3b82f6 1px, transparent 1px)',
                        backgroundSize: '16px 16px',
                      }}
                    />
                  </div>

                  {/* Vòng định vị GPS phát sáng */}
                  <div
                    className="absolute w-12 h-12 rounded-full border-2 border-cyan-400/60 animate-ping"
                    style={{
                      left: -140,
                      top: 0,
                      transform: 'translate(-50%, -50%) translateZ(1px)',
                    }}
                  />
                  <div
                    className="absolute w-14 h-14 rounded-full border-2 border-blue-500/60 animate-pulse"
                    style={{
                      left: 0,
                      top: 0,
                      transform: 'translate(-50%, -50%) translateZ(1px)',
                    }}
                  />
                  <div
                    className="absolute w-12 h-12 rounded-full border-2 border-indigo-400/60 animate-ping"
                    style={{
                      left: 140,
                      top: 0,
                      transform: 'translate(-50%, -50%) translateZ(1px)',
                    }}
                  />

                  {/* Route Line */}
                  <svg
                    width="340"
                    height="340"
                    style={{
                      position: 'absolute',
                      left: -170,
                      top: -170,
                      transform: 'translateZ(2px)',
                      filter: 'drop-shadow(0 0 6px rgba(6, 182, 212, 0.5))',
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
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="50%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 30 170 C 100 60, 240 280, 310 170"
                      stroke="url(#routeGrad)"
                      strokeWidth="4.5"
                      fill="none"
                      strokeDasharray="8 5"
                      strokeLinecap="round"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        from="130"
                        to="0"
                        dur="2.2s"
                        repeatCount="indefinite"
                      />
                    </path>
                  </svg>

                  {/* Các Khối Nhà 3D */}
                  <Building
                    x={-120}
                    y={-120}
                    w={42}
                    d={42}
                    h={48}
                    colorTop="#93c5fd"
                    colorFront="#2563eb"
                    colorSide="#1d4ed8"
                  />
                  <Building
                    x={40}
                    y={-125}
                    w={38}
                    d={38}
                    h={58}
                    colorTop="#c7d2fe"
                    colorFront=""
                    colorSide=""
                  />
                  <Building
                    x={100}
                    y={75}
                    w={40}
                    d={40}
                    h={42}
                    colorTop="#a5f3fc"
                    colorFront="#0891b2"
                    colorSide="#0e7490"
                  />
                  <Building
                    x={-125}
                    y={85}
                    w={36}
                    d={36}
                    h={40}
                    colorTop="#cbd5e1"
                    colorFront="#475569"
                    colorSide="#334155"
                  />
                  <Building
                    x={-20}
                    y={-135}
                    w={26}
                    d={26}
                    h={30}
                    colorTop="#6ee7b7"
                    colorFront="#059669"
                    colorSide="#047857"
                  />

                  {/* Vệt Bóng 3D Đổ Xuống Mặt Đất */}
                  <div
                    className="absolute w-10 h-10 rounded-full bg-cyan-900/25 blur-md"
                    style={{
                      left: -140,
                      top: 20,
                      transform: 'translate(-50%, -50%) scaleY(0.4)',
                    }}
                  />
                  <div
                    className="absolute w-12 h-12 rounded-full bg-blue-900/30 blur-md"
                    style={{
                      left: 0,
                      top: 20,
                      transform: 'translate(-50%, -50%) scaleY(0.4)',
                    }}
                  />
                  <div
                    className="absolute w-10 h-10 rounded-full bg-indigo-900/25 blur-md"
                    style={{
                      left: 140,
                      top: 20,
                      transform: 'translate(-50%, -50%) scaleY(0.4)',
                    }}
                  />

                  {/* 3D Floating Vehicle Icons */}
                  <div
                    className="absolute"
                    style={{
                      left: -35,
                      top: 0,
                      transform:
                        'translate3d(-90px, 0px, -20px) rotateZ(45deg) rotateX(-55deg)',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 3.5,
                        ease: 'easeInOut',
                      }}
                      className="w-13 h-13 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-cyan-300 flex items-center justify-center -translate-x-1/2 -translate-y-1/2 group"
                    >
                      <MapPin className="h-6 w-6 text-cyan-600 drop-shadow" />
                    </motion.div>
                  </div>

                  <div
                    className="absolute"
                    style={{
                      left: -10,
                      top: 0,
                      transform:
                        'translate3d(0px, 0px, -10px) rotateZ(45deg) rotateX(-55deg)',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 4,
                        ease: 'easeInOut',
                      }}
                      className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-blue-500 rounded-2xl shadow-2xl border-2 border-white flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
                    >
                      <Truck className="h-7 w-7 text-white drop-shadow-md" />
                    </motion.div>
                  </div>

                  <div
                    className="absolute"
                    style={{
                      left: 140,
                      top: 0,
                      transform:
                        'translate3d(0px, 0px, -15px) rotateZ(45deg) rotateX(-55deg)',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 3.8,
                        ease: 'easeInOut',
                      }}
                      className="w-13 h-13 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-indigo-300 flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
                    >
                      <Gauge className="h-6 w-6 text-indigo-600 drop-shadow" />
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Badge 1: Live Status */}
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: [0, -5, 0], scale: 1 }}
                transition={{
                  opacity: { duration: 0.5, delay: 0.9 },
                  scale: { duration: 0.5, delay: 0.9 },
                  y: { repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 0.9 },
                }}
                className="absolute top-4 right-4 z-20 px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-lg"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.9)',
                }}
              >
                <div className="flex h-3 w-3 relative">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                </div>
                <div>
                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">
                    Live Fleet Status
                  </span>
                  <span className="text-xs font-extrabold text-slate-900">
                    1,248 Active Vehicles
                  </span>
                </div>
              </motion.div>

              {/* Badge 2: Fuel Optimization */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: [0, 5, 0], scale: 1 }}
                transition={{
                  opacity: { duration: 0.5, delay: 1.1 },
                  scale: { duration: 0.5, delay: 1.1 },
                  y: { repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1.1 },
                }}
                className="absolute bottom-4 left-4 z-20 px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-lg"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.9)',
                }}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[9px] font-black text-slate-400 uppercase tracking-wider">
                    Fuel Savings
                  </span>
                  <span className="text-xs font-black text-emerald-600">
                    -18.4% Efficiency
                  </span>
                </div>
              </motion.div>

              {/* Badge 3: On-Time Delivery */}
              <motion.div
                initial={{ opacity: 0, x: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: [0, -4, 0], x: 0, scale: 1 }}
                transition={{
                  opacity: { duration: 0.5, delay: 1.3 },
                  scale: { duration: 0.5, delay: 1.3 },
                  x: { duration: 0.5, delay: 1.3 },
                  y: { repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 1.3 },
                }}
                className="absolute top-4 left-4 z-20 px-3.5 py-2 rounded-2xl flex items-center gap-2.5 shadow-lg"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.9)',
                }}
              >
                <div className="p-1 rounded-lg bg-cyan-50 text-cyan-600">
                  <Navigation className="h-3.5 w-3.5 fill-cyan-500" />
                </div>
                <span className="text-xs font-extrabold text-slate-800">
                  99.4% On-Time
                </span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Glow Nền phía sau */}
        <div
          className="absolute -inset-8 -z-10 rounded-[3.5rem] pointer-events-none opacity-80"
          style={{
            background:
              'radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(6,182,212,0.18) 50%, transparent 75%)',
            filter: 'blur(45px)',
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