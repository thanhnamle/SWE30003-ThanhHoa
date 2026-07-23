import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * Fixed, full-viewport layer of soft blurred color blobs that drift
 * position and shift hue as the user scrolls down the page.
 *
 * Rendered via a React portal directly into document.body so it can
 * never get trapped/clipped behind an ancestor that creates its own
 * stacking or containing-block context (e.g. a parent with transform,
 * filter, or overflow set) — guaranteeing it always sits at the very
 * back, behind every section.
 */
export const ScrollBlobs = () => {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Blob 1: drifts top-left -> bottom-right-ish, blue -> indigo -> cyan
  const blob1Top = useTransform(scrollYProgress, [0, 1], ['-10%', '85%']);
  const blob1Left = useTransform(scrollYProgress, [0, 0.5, 1], ['5%', '55%', '15%']);
  const blob1Color = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ['#60a5fa', '#818cf8', '#22d3ee', '#c084fc', '#60a5fa']
  );

  // Blob 2: drifts opposite direction, cyan -> fuchsia -> blue
  const blob2Top = useTransform(scrollYProgress, [0, 1], ['15%', '105%']);
  const blob2Left = useTransform(scrollYProgress, [0, 0.5, 1], ['70%', '25%', '65%']);
  const blob2Color = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ['#22d3ee', '#e879f9', '#60a5fa', '#818cf8', '#22d3ee']
  );

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      <motion.div
        style={{ top: blob1Top, left: blob1Left, backgroundColor: blob1Color }}
        className="absolute w-[480px] h-[480px] lg:w-[620px] lg:h-[620px] rounded-full blur-[100px] opacity-45"
      />
      <motion.div
        style={{ top: blob2Top, left: blob2Left, backgroundColor: blob2Color }}
        className="absolute w-[420px] h-[420px] lg:w-[550px] lg:h-[550px] rounded-full blur-[100px] opacity-40"
      />
    </div>,
    document.body
  );
};