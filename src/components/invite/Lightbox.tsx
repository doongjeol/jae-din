import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type PanInfo,
} from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { EASE, useInteractionLock } from "./motion-shared";
import { weddingConfig } from "@/config/wedding";

const SWIPE_X = 80;
const SWIPE_X_VELOCITY = 500;
const DISMISS_Y = 120;
const DISMISS_Y_VELOCITY = 600;

const slideVariants = {
  enter: (dir: number) => ({ x: dir * 64, opacity: 0, scale: 0.96 }),
  center: { x: 0, y: 0, opacity: 1, scale: 1 },
  exit: (dir: number) => ({ x: dir * -64, opacity: 0, scale: 0.96 }),
};

/**
 * Native-photo-viewer style lightbox:
 * - the image follows the finger in real time (drag on both axes),
 * - release decides via distance + velocity: navigate, dismiss, or spring back,
 * - the backdrop dims live as a pure transform of the drag-Y MotionValue,
 * - open/close acquires the shared interaction lock so page reveals pause.
 */
export function Lightbox({
  images,
  index,
  onClose,
  onNavigate,
}: {
  images: string[];
  /** null = closed */
  index: number | null;
  onClose: () => void;
  onNavigate: (next: number) => void;
}) {
  const open = index !== null;
  const [direction, setDirection] = useState(0);
  const { setLocked } = useInteractionLock();
  const reduce = useReducedMotion();

  const dragY = useMotionValue(0);
  const backdropOpacity = useTransform(dragY, [-240, 0, 240], [0.45, 1, 0.25]);

  // Acquire/release the shared interaction lock + body scroll lock together.
  useEffect(() => {
    setLocked(open);
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index]);

  const go = (dir: number) => {
    if (index === null) return;
    setDirection(dir);
    onNavigate((index + dir + images.length) % images.length);
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const { offset, velocity } = info;
    // Vertical intent wins: swipe down to dismiss.
    if (offset.y > DISMISS_Y || velocity.y > DISMISS_Y_VELOCITY) {
      onClose();
      return;
    }
    if (offset.x < -SWIPE_X || velocity.x < -SWIPE_X_VELOCITY) {
      go(1);
    } else if (offset.x > SWIPE_X || velocity.x > SWIPE_X_VELOCITY) {
      go(-1);
    }
    // Otherwise dragSnapToOrigin springs the image back.
  };

  return (
    <AnimatePresence>
      {index !== null && (
        <motion.div
          className="fixed inset-0 z-[90] grid place-items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <motion.div
            className="absolute inset-0 bg-ink/90"
            style={{ opacity: backdropOpacity }}
            onClick={onClose}
          />

          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white/80 backdrop-blur transition hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="이전 사진"
            className="absolute left-2 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white/80 backdrop-blur transition hover:bg-white/20 sm:left-4"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="다음 사진"
            className="absolute right-2 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white/80 backdrop-blur transition hover:bg-white/20 sm:right-4"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <motion.div
            className="relative w-full max-w-[460px] px-4"
            initial={{ scale: reduce ? 1 : 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: reduce ? 1 : 0.95, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
          >
            <AnimatePresence mode="popLayout" custom={direction} initial={false}>
              <motion.img
                key={index}
                src={images[index]}
                alt={`사진 ${index + 1}`}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: EASE }}
                drag={!reduce}
                dragElastic={0.35}
                dragSnapToOrigin
                style={{ y: dragY }}
                onDragEnd={onDragEnd}
                onContextMenu={
                  weddingConfig.gallery.preventDownload ? (e) => e.preventDefault() : undefined
                }
                className="max-h-[76vh] w-full cursor-grab select-none rounded-xl object-contain [-webkit-touch-callout:none] active:cursor-grabbing"
                draggable={false}
              />
            </AnimatePresence>
            <p className="pointer-events-none mt-4 text-center text-xs tracking-[0.3em] text-white/70">
              {index + 1} / {images.length}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
