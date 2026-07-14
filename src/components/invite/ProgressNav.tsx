import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export interface NavSection {
  id: string;
  label: string;
}

/**
 * Scroll-reactive chrome driven by a single scroll source:
 * - a hairline progress bar at the top (useScroll → one MotionValue), and
 * - side dot indicators whose active state comes from ONE shared
 *   IntersectionObserver over all sections (no per-dot listeners).
 * Both fade in together once the reader leaves the hero.
 */
export function ProgressNav({ sections }: { sections: NavSection[] }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  // Chrome visibility derives from the same scroll value — bar and dots stay in sync.
  const chromeOpacity = useTransform(scrollYProgress, [0.02, 0.08], [0, 1]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        // Pick the section currently crossing the middle band of the viewport.
        const hit = entries.find((e) => e.isIntersecting);
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  return (
    <>
      <motion.div
        className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-blush-deep/70"
        style={{ scaleX, opacity: chromeOpacity }}
        aria-hidden
      />
      <motion.nav
        className="fixed right-3 top-1/2 z-50 -translate-y-1/2"
        style={{ opacity: chromeOpacity }}
        aria-label="섹션 이동"
      >
        <ul className="flex flex-col items-center gap-3">
          {sections.map((s) => {
            const isActive = active === s.id;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  aria-label={s.label}
                  onClick={() =>
                    document
                      .getElementById(s.id)
                      ?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                  className="grid h-4 w-4 place-items-center"
                >
                  <motion.span
                    className="block rounded-full bg-blush-deep"
                    animate={{
                      scale: isActive ? 1 : 0.55,
                      opacity: isActive ? 0.9 : 0.35,
                    }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    style={{ width: 6, height: 6 }}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </motion.nav>
    </>
  );
}
