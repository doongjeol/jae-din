import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

const BGM_SRC = "/bgm.mp3";
const BGM_VOLUME = 0.35;

/**
 * Background music with a small floating toggle.
 * Browsers block autoplay with sound, so playback starts on the reader's
 * first tap/click anywhere on the page; after that the toggle controls it.
 * If the audio file is missing, the toggle hides itself.
 */
export function BgmToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(true);
  const userPausedRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = BGM_VOLUME;

    const start = () => {
      if (userPausedRef.current) return;
      audio.play().catch(() => {});
    };
    // Try immediately (works if the browser already allows it), then on first gesture.
    start();
    const events = ["pointerdown", "touchstart", "keydown"] as const;
    const onGesture = () => {
      start();
      events.forEach((e) => window.removeEventListener(e, onGesture));
    };
    events.forEach((e) => window.addEventListener(e, onGesture, { passive: true }));

    // Pause when the tab is hidden, resume when it comes back.
    const onVisibility = () => {
      if (document.hidden) audio.pause();
      else if (!userPausedRef.current && audio.currentTime > 0) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      events.forEach((e) => window.removeEventListener(e, onGesture));
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const toggle = (e: React.MouseEvent) => {
    // Keep the global first-gesture listener from immediately undoing a pause.
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      userPausedRef.current = false;
      audio.play().catch(() => {});
    } else {
      userPausedRef.current = true;
      audio.pause();
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={BGM_SRC}
        loop
        preload="auto"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setAvailable(false)}
      />
      {available && (
        <motion.button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={toggle}
          aria-label={playing ? "배경음악 끄기" : "배경음악 켜기"}
          aria-pressed={playing}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="fixed left-3 top-3 z-50 grid h-10 w-10 place-items-center rounded-full border border-blush bg-white/90 text-primary shadow-[0_2px_10px_rgba(0,0,0,0.12)] backdrop-blur"
        >
          {playing ? (
            <motion.span
              animate={{ rotate: [0, -8, 8, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Volume2 className="h-[18px] w-[18px]" />
            </motion.span>
          ) : (
            <VolumeX className="h-[18px] w-[18px]" />
          )}
        </motion.button>
      )}
    </>
  );
}
