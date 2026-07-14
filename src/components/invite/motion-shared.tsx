import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { motion, useReducedMotion } from "framer-motion";

/** Shared editorial easing — ease-out-expo style, no bounce. */
export const EASE = [0.16, 1, 0.3, 1] as const;

export const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * JS-driven page scroll with the same curve/duration as component animations,
 * so coordinated moves (accordion expand + keep-in-view) finish together.
 */
export function smoothScrollBy(delta: number, duration = 500) {
  if (typeof window === "undefined" || delta === 0) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.scrollBy(0, delta);
    return;
  }
  const start = window.scrollY;
  const t0 = performance.now();
  const step = (now: number) => {
    const p = Math.min(1, (now - t0) / duration);
    window.scrollTo(0, start + delta * easeOutExpo(p));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ---------------------------------------------------------------------- */
/* Interaction lock — single source of truth for "a modal owns the page". */
/* While locked, scroll reveals defer instead of firing behind the modal.  */
/* ---------------------------------------------------------------------- */

interface LockContextValue {
  locked: boolean;
  lockedRef: RefObject<boolean>;
  setLocked: (v: boolean) => void;
}

const LockContext = createContext<LockContextValue>({
  locked: false,
  lockedRef: { current: false },
  setLocked: () => {},
});

export function InteractionLockProvider({ children }: { children: ReactNode }) {
  const [locked, setLockedState] = useState(false);
  const lockedRef = useRef(false);
  const setLocked = (v: boolean) => {
    lockedRef.current = v;
    setLockedState(v);
  };
  return (
    <LockContext.Provider value={{ locked, lockedRef, setLocked }}>{children}</LockContext.Provider>
  );
}

export function useInteractionLock() {
  return useContext(LockContext);
}

/**
 * Fires once when the element enters the viewport — unless the interaction
 * lock is held, in which case the trigger is deferred and flushed on unlock.
 */
export function useInViewOnce<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);
  const { locked, lockedRef } = useInteractionLock();
  const pendingRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        if (lockedRef.current) {
          pendingRef.current = true;
        } else {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown]);

  useEffect(() => {
    if (!locked && pendingRef.current) {
      pendingRef.current = false;
      setShown(true);
    }
  }, [locked]);

  return { ref, shown };
}

/* ---------------------------------------------------------------------- */
/* Reveal — fade + slide (+ optional scale) once on scroll into view.      */
/* ---------------------------------------------------------------------- */

export function Reveal({
  children,
  delay = 0,
  y = 24,
  scaleFrom = 1,
  className,
}: {
  children: ReactNode;
  /** ms */
  delay?: number;
  y?: number;
  scaleFrom?: number;
  className?: string;
}) {
  const { ref, shown } = useInViewOnce<HTMLDivElement>();

  // NOTE: no early-return branch on useReducedMotion here. SSR always renders
  // the motion.div (with initial opacity:0 inline style); if the client took a
  // different branch, React's hydration would keep the stale style attribute
  // and the content would stay invisible. Reduced-motion preferences are
  // honored by the surrounding <MotionConfig reducedMotion="user">, which
  // disables transform animation while still animating opacity.
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y, scale: scaleFrom }}
      animate={shown ? { opacity: 1, y: 0, scale: 1 } : undefined}
      transition={{ duration: 0.7, ease: EASE, delay: delay / 1000 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Hydration-safe reduced-motion flag: returns false on the server AND on the
 * first client render (so SSR markup always matches), then the real media
 * query value after mount. Use this instead of framer's useReducedMotion
 * whenever the value changes what gets rendered.
 */
export function useReducedMotionSafe() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? (reduce ?? false) : false;
}
