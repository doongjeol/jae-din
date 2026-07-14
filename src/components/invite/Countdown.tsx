import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE } from "./motion-shared";

interface Parts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function diffParts(target: Date): Parts {
  const ms = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(ms / 86_400_000),
    hours: Math.floor(ms / 3_600_000) % 24,
    minutes: Math.floor(ms / 60_000) % 60,
    seconds: Math.floor(ms / 1_000) % 60,
  };
}

/** A single digit that slides/fades only when its own value changes. */
function Digit({ ch, reduce }: { ch: string; reduce: boolean }) {
  if (reduce) return <span>{ch}</span>;
  return (
    <span className="relative inline-block h-[1.2em] w-[0.62em] overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={ch}
          initial={{ y: "0.9em", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-0.9em", opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="absolute inset-0 inline-block text-center"
        >
          {ch}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Unit({ value, label, reduce }: { value: number; label: string; reduce: boolean }) {
  const text = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center rounded-xl bg-white py-4 shadow-md shadow-black/10">
      <div className="font-serif text-2xl leading-none text-foreground">
        {text.split("").map((ch, i) => (
          <Digit key={i} ch={ch} reduce={reduce} />
        ))}
      </div>
      <span className="mt-2 text-[0.58rem] tracking-[0.2em] text-muted-foreground uppercase">
        {label}
      </span>
    </div>
  );
}

/**
 * Live D-Day countdown. Digits animate independently on change; when a unit
 * above seconds rolls over, the strip glows briefly. All state is local —
 * it never touches page-level scroll/reveal/parallax state.
 */
export function Countdown({ target, coupleLabel }: { target: Date; coupleLabel: string }) {
  const [parts, setParts] = useState<Parts | null>(null);
  const [celebrate, setCelebrate] = useState(false);
  const prevRef = useRef<Parts | null>(null);
  const reduce = useReducedMotion() ?? false;

  useEffect(() => {
    // First compute happens client-side only, avoiding SSR hydration mismatch.
    const tick = () => {
      const next = diffParts(target);
      const prev = prevRef.current;
      if (
        prev &&
        (next.days < prev.days || next.hours !== prev.hours || next.minutes !== prev.minutes)
      ) {
        setCelebrate(true);
        setTimeout(() => setCelebrate(false), 1200);
      }
      prevRef.current = next;
      setParts(next);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    <div
      className={`mx-auto mt-10 max-w-sm rounded-2xl transition-shadow duration-700 ${
        celebrate && !reduce ? "countdown-glow" : ""
      }`}
    >
      <div className="grid min-h-[4.6rem] grid-cols-4 items-stretch gap-2">
        {parts ? (
          <>
            <Unit value={parts.days} label="Days" reduce={reduce} />
            <Unit value={parts.hours} label="Hours" reduce={reduce} />
            <Unit value={parts.minutes} label="Minutes" reduce={reduce} />
            <Unit value={parts.seconds} label="Seconds" reduce={reduce} />
          </>
        ) : null}
      </div>
      <p className="mt-6 text-center text-[13px] text-foreground/80">
        {coupleLabel}의 결혼식이{" "}
        <span className="text-blush-deep">
          {parts ? (parts.days > 0 ? `${parts.days}일` : "오늘") : "…"}
        </span>{" "}
        남았습니다
      </p>
    </div>
  );
}
