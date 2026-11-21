import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCw, X } from "lucide-react";
import { markOwnerDevice, readVisitCounts, recordVisit } from "@/lib/visit-counter";

type Counts = { today: number | null; total: number | null };

/**
 * 숨겨진 TODAY 카운터.
 * 일반 방문자: 화면엔 아무것도 없고 방문만 기록.
 * `?today`로 접속: 이 기기를 주인으로 기억(이후 집계 제외)하고 TODAY / TOTAL 카드 표시.
 */
export function VisitCounter() {
  const [open, setOpen] = useState(false);
  const [counts, setCounts] = useState<Counts | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setCounts(await readVisitCounts());
    setLoading(false);
  }, []);

  useEffect(() => {
    const isSecret = new URLSearchParams(window.location.search).has("today");
    if (isSecret) {
      markOwnerDevice();
      setOpen(true);
      void refresh();
    } else {
      recordVisit();
    }
  }, [refresh]);

  const fmt = (n: number | null | undefined) => (n == null ? "–" : n.toLocaleString("ko-KR"));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          className="fixed right-3 top-16 z-50 rounded-2xl border border-blush bg-white/95 px-4 py-3 text-foreground shadow-[0_4px_18px_rgba(0,0,0,0.14)] backdrop-blur"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="font-serif text-[10px] tracking-[0.2em] text-primary">TODAY</p>
              <p className="mt-0.5 text-lg font-medium tabular-nums">{fmt(counts?.today)}</p>
            </div>
            <div className="h-8 w-px bg-blush" aria-hidden />
            <div className="text-center">
              <p className="font-serif text-[10px] tracking-[0.2em] text-muted-foreground">TOTAL</p>
              <p className="mt-0.5 text-lg font-medium tabular-nums">{fmt(counts?.total)}</p>
            </div>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => void refresh()}
                aria-label="새로고침"
                className="grid h-6 w-6 place-items-center rounded-full text-muted-foreground hover:bg-blush/40"
              >
                <RotateCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="닫기"
                className="grid h-6 w-6 place-items-center rounded-full text-muted-foreground hover:bg-blush/40"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
