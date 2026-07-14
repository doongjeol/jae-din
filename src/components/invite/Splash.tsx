import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Minimal page-load splash: monogram fades in, then the whole overlay fades
 * away (~0.9s total) to reveal the hero sequence.
 */
export function Splash({ monogram }: { monogram: string }) {
  const [gone, setGone] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const t = setTimeout(() => setGone(true), reduce ? 0 : 900);
    return () => clearTimeout(t);
  }, [reduce]);

  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          aria-hidden
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="font-script text-2xl tracking-[0.35em] text-blush-deep"
          >
            {monogram}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
