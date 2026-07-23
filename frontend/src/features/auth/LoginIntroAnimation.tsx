import { useEffect, useMemo, useState, useRef } from 'react';
import { Truck, CheckCircle2, Route, PackageCheck, Sparkles } from 'lucide-react';

// Path now lives entirely inside the SVG viewBox (0 40 360 300 -> x:[0,360] y:[40,340]),
// so the truck never travels off-screen the way it did with the old path
// (which ran from y=520 to y=58, far outside the 40-340 visible window).
const ROUTE_PATH =
  'M 40,320 C 95,270 35,225 110,195 C 190,162 148,105 228,80 C 270,65 290,55 322,45';

const PINS = [
  { cx: 110, cy: 195, r: 6 },
  { cx: 228, cy: 80, r: 6 },
  { cx: 322, cy: 45, r: 7 },
];

const CONFETTI_COLORS = ['#93C5FD', '#818CF8', '#34D399', '#FDE68A', '#FFFFFF'];

const STAGES = [
  { icon: PackageCheck, label: 'Order ready' },
  { icon: Route, label: 'Optimize route' },
  { icon: Truck, label: 'Fast delivery' },
  { icon: CheckCircle2, label: 'Welcome to SmartFM' },
];

const DURATION_MS = 4200;

export function LoginIntroAnimation({ onFinish }: { onFinish: () => void }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const [truck, setTruck] = useState({ x: 0, y: 0, angle: 0 });
  const [trailLen, setTrailLen] = useState(0);

  const startRef = useRef<number | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const totalLenRef = useRef(0);

  // Confetti burst: generated once, reused when `done` flips true.
  const confetti = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => {
        const angle = (Math.PI * 2 * i) / 28 + Math.random() * 0.3;
        const distance = 55 + Math.random() * 85;
        return {
          id: i,
          dx: Math.cos(angle) * distance,
          dy: Math.sin(angle) * distance,
          color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
          delay: Math.random() * 0.12,
          size: 4 + Math.random() * 4,
        };
      }),
    []
  );

  useEffect(() => {
    let raf: number;

    const updateTruck = (p: number) => {
      const path = pathRef.current;
      const container = containerRef.current;
      if (!path || !container) return;

      if (!totalLenRef.current) totalLenRef.current = path.getTotalLength();
      const total = totalLenRef.current;
      const len = p * total;

      const pt = path.getPointAtLength(len);
      const ptAhead = path.getPointAtLength(Math.min(total, len + 1));
      const angle = Math.atan2(ptAhead.y - pt.y, ptAhead.x - pt.x) * (180 / Math.PI);

      // Convert the SVG-space point to real screen pixels via the path's own
      // screen CTM, so the truck sticks to the line at any render size instead
      // of relying on a CSS offset-path whose coordinate space didn't match.
      const svg = path.ownerSVGElement;
      const ctm = path.getScreenCTM();
      if (svg && ctm) {
        const svgPoint = svg.createSVGPoint();
        svgPoint.x = pt.x;
        svgPoint.y = pt.y;
        const screenPt = svgPoint.matrixTransform(ctm);
        const rect = container.getBoundingClientRect();
        setTruck({ x: screenPt.x - rect.left, y: screenPt.y - rect.top, angle });
      }
      setTrailLen(len);
    };

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now;
      const p = Math.min((now - startRef.current) / DURATION_MS, 1);
      setProgress(p);
      updateTruck(p);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDone(true);
        setTimeout(onFinish, 650);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onFinish]);

  const stageIndex = Math.min(STAGES.length - 1, Math.floor(progress * STAGES.length));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950">
      <style>{`
        @keyframes sfm2-dash { to { stroke-dashoffset: -240; } }
        @keyframes sfm2-pin { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: 0.5; } }
        @keyframes sfm2-drift { from { background-position: 0 0; } to { background-position: -56px 56px; } }
        @keyframes sfm2-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes sfm2-rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes sfm2-pop { 0% { opacity: 0; transform: scale(0.6); } 60% { opacity: 1; transform: scale(1.08); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes sfm2-check-in { from { opacity: 0; transform: scale(0.5) rotate(-20deg); } to { opacity: 1; transform: scale(1) rotate(0); } }
        @keyframes sfm2-ring { 0% { transform: scale(0.8); opacity: 0.6; } 100% { transform: scale(1.8); opacity: 0; } }
        @keyframes sfm2-fade-out { to { opacity: 0; } }
        @keyframes sfm2-confetti { from { transform: translate(0, 0) scale(1); opacity: 1; } to { transform: translate(var(--sfm2-dx), var(--sfm2-dy)) scale(0.25); opacity: 0; } }

        .sfm2-bg-dots {
          background-image: radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px);
          background-size: 30px 30px;
          animation: sfm2-drift 14s linear infinite;
        }
        .sfm2-path { stroke-dasharray: 6 10; animation: sfm2-dash 4s linear infinite; }
        .sfm2-pin { animation: sfm2-pin 2s ease-in-out infinite; }
        .sfm2-pin:nth-child(2) { animation-delay: .5s; }
        .sfm2-pin:nth-child(3) { animation-delay: 1s; }
        .sfm2-orb { animation: sfm2-float 6s ease-in-out infinite; }
        .sfm2-stage { animation: sfm2-pop 0.5s cubic-bezier(.22,1.2,.36,1) both; }
        .sfm2-check { animation: sfm2-check-in 0.6s cubic-bezier(.22,1.2,.36,1) both; }
        .sfm2-ring { animation: sfm2-ring 1.3s ease-out infinite; }
        .sfm2-shell-out { animation: sfm2-fade-out 0.5s ease-in forwards; }
        .sfm2-confetti-piece { animation: sfm2-confetti 0.9s cubic-bezier(.16,.84,.44,1) both; }
        .sfm2-bar-fill { transition: width 550ms cubic-bezier(0.34, 1.56, 0.64, 1); }
        @media (prefers-reduced-motion: reduce) {
          .sfm2-bg-dots, .sfm2-path, .sfm2-pin, .sfm2-orb, .sfm2-stage, .sfm2-check, .sfm2-ring, .sfm2-confetti-piece { animation: none !important; }
          .sfm2-bar-fill { transition: width 200ms linear; }
        }
      `}</style>

      <div className={`absolute inset-0 sfm2-bg-dots ${done ? 'sfm2-shell-out' : ''}`} />
      <div className="absolute -top-24 -left-20 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl sfm2-orb" />
      <div
        className="absolute bottom-0 right-0 w-[28rem] h-[28rem] rounded-full bg-indigo-500/20 blur-3xl sfm2-orb"
        style={{ animationDelay: '2.2s' }}
      />

      <div className={`relative z-10 flex flex-col items-center gap-10 px-6 ${done ? 'sfm2-shell-out' : ''}`}>
        {/* Route + truck */}
        <div ref={containerRef} className="relative w-[300px] h-[220px] flex items-center justify-center">
          <svg viewBox="0 40 360 300" className="w-full h-full" fill="none">
            <defs>
              <linearGradient id="sfm2-trail-gradient" gradientUnits="userSpaceOnUse" x1="40" y1="320" x2="322" y2="45">
                <stop offset="0%" stopColor="#93C5FD" stopOpacity="0" />
                <stop offset="100%" stopColor="#BFDBFE" stopOpacity="0.95" />
              </linearGradient>
              <filter id="sfm2-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <path
              d={ROUTE_PATH}
              stroke="rgba(147, 197, 253, 0.85)"
              strokeWidth="3"
              strokeLinecap="round"
              className="sfm2-path"
              ref={pathRef}
            />

            {/* Comet trail: reveals the exact portion of the real path already
                travelled, so it never drifts out of sync with the truck. */}
            {!done && (
              <path
                d={ROUTE_PATH}
                stroke="url(#sfm2-trail-gradient)"
                strokeWidth="5"
                strokeLinecap="round"
                filter="url(#sfm2-glow)"
                strokeDasharray={`${trailLen} 9999`}
              />
            )}

            {PINS.map((pin, i) => (
              <circle key={i} cx={pin.cx} cy={pin.cy} r={pin.r} fill={i === 2 ? '#BFDBFE' : '#93C5FD'} className="sfm2-pin" />
            ))}
          </svg>

          {!done ? (
            <div
              className="absolute top-0 left-0 bg-white rounded-xl p-2 shadow-xl shadow-blue-950/50"
              style={{
                transform: `translate(${truck.x}px, ${truck.y}px) translate(-50%, -50%) rotate(${truck.angle}deg)`,
              }}
            >
              <Truck className="w-5 h-5 text-blue-700" />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="absolute w-20 h-20 rounded-full bg-emerald-400/30 sfm2-ring" />
              <span
                className="absolute w-20 h-20 rounded-full bg-emerald-400/30 sfm2-ring"
                style={{ animationDelay: '0.4s' }}
              />
              {confetti.map((piece) => (
                <span
                  key={piece.id}
                  className="absolute rounded-full sfm2-confetti-piece"
                  style={
                    {
                      width: piece.size,
                      height: piece.size,
                      backgroundColor: piece.color,
                      animationDelay: `${piece.delay}s`,
                      '--sfm2-dx': `${piece.dx}px`,
                      '--sfm2-dy': `${piece.dy}px`,
                    } as React.CSSProperties
                  }
                />
              ))}
              <div className="relative bg-white rounded-full p-4 shadow-xl shadow-emerald-900/30 sfm2-check">
                <CheckCircle2 className="w-9 h-9 text-emerald-500" strokeWidth={2.2} />
              </div>
            </div>
          )}
        </div>

        {/* Stage label */}
        <div className="h-9 flex items-center justify-center min-w-[260px]">
          <div key={stageIndex} className="sfm2-stage flex items-center gap-2.5 text-white/95">
            {(() => {
              const Icon = STAGES[stageIndex].icon;
              return <Icon className="w-5 h-5 text-blue-300" />;
            })()}
            <span className="text-xl font-medium tracking-wide">{STAGES[stageIndex].label}</span>
          </div>
        </div>

        {/* Progress bar — advances in a little nudge each time a new stage label appears */}
        <div className="w-64 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-300 sfm2-bar-fill"
            style={{ width: `${((stageIndex + 1) / STAGES.length) * 100}%` }}
          />
        </div>

        <div
          className="flex items-center gap-1.5 text-blue-200/60 text-xs"
          style={{ animation: 'sfm2-rise 0.6s ease-out 0.15s both' }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>SmartFM · Smart fleet management</span>
        </div>
      </div>
    </div>
  );
}