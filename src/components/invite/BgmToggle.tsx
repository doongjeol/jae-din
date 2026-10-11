import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

const BGM_SRC = "/bgm.mp3";
const BGM_VOLUME = 0.35;

/**
 * Background music with a small floating toggle.
 * Playback is attempted on load; browsers that block autoplay with sound
 * start it on the reader's first tap/click anywhere on the page.
 * If the audio file is missing, the toggle hides itself.
 */
export function BgmToggle() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(true);
  const userPausedRef = useRef(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = BGM_VOLUME;

    const start = () => {
      if (userPausedRef.current) return Promise.resolve();
      return audio.play();
    };
    // Try immediately (works if the browser already allows it). Otherwise keep
    // retrying on every user-activation gesture until playback actually starts.
    // Note: on mobile only touchend/click count as activation, not touchstart.
    const events = ["click", "touchend", "pointerup", "keydown"] as const;
    const detach = () => events.forEach((e) => window.removeEventListener(e, onGesture));
    const onGesture = (e: Event) => {
      // Taps on the toggle are handled by the toggle itself.
      if (buttonRef.current?.contains(e.target as Node)) return;
      start().then(detach, () => {});
    };
    events.forEach((e) => window.addEventListener(e, onGesture, { passive: true }));
    start().then(detach, () => {});

    // Pause when the tab is hidden, resume when it comes back.
    const onVisibility = () => {
      if (document.hidden) audio.pause();
      else if (!userPausedRef.current && audio.currentTime > 0) start().catch(() => {});
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      detach();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const toggle = () => {
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
          ref={buttonRef}
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
