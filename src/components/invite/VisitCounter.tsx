import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, RotateCw, X } from "lucide-react";
import {
  markOwnerDevice,
  readDailyHistory,
  readVisitCounts,
  recordVisit,
} from "@/lib/visit-counter";

type Counts = { today: number | null; total: number | null };
type History = { day: string; count: number | null }[];

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
function dayLabel(key: string) {
  const m = Number(key.slice(4, 6));
  const d = Number(key.slice(6));
  const w = new Date(`${key.slice(0, 4)}-${key.slice(4, 6)}-${key.slice(6)}T12:00:00Z`).getUTCDay();
  return `${m}/${d} (${WEEKDAYS[w]})`;
}

/**
 * 숨겨진 TODAY 카운터.
 * 일반 방문자: 화면엔 아무것도 없고 방문만 기록.
 * `?today`로 접속: 이 기기를 주인으로 기억(이후 집계 제외)하고 TODAY / TOTAL 카드 표시.
 */
export function VisitCounter() {
  const [open, setOpen] = useState(false);
  const [counts, setCounts] = useState<Counts | null>(null);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<History | null>(null);

  const refresh = useCallback(async (withHistory = false) => {
    setLoading(true);
    const [c, h] = await Promise.all([
      readVisitCounts(),
      withHistory ? readDailyHistory() : Promise.resolve(null),
    ]);
    setCounts(c);
    if (h) setHistory(h);
    setLoading(false);
  }, []);

  const toggleHistory = () => {
    const next = !showHistory;
    setShowHistory(next);
    if (next) void refresh(true);
  };

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
          className="fixed right-[max(0.75rem,calc(50vw-230px+0.75rem))] top-16 z-50 rounded-2xl border border-blush bg-white/95 px-4 py-3 text-foreground shadow-[0_4px_18px_rgba(0,0,0,0.14)] backdrop-blur"
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
                onClick={() => void refresh(showHistory)}
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
          <button
            type="button"
            onClick={toggleHistory}
            aria-expanded={showHistory}
            className="mt-2 flex w-full items-center justify-center gap-1 border-t border-blush/60 pt-2 text-[11px] text-muted-foreground"
          >
            날짜별 기록
            <ChevronDown
              className={`h-3 w-3 transition-transform ${showHistory ? "rotate-180" : ""}`}
            />
          </button>
          {showHistory && (
            <ul className="mt-1.5 max-h-56 space-y-1 overflow-y-auto text-[12px]">
              {history == null ? (
                <li className="text-center text-muted-foreground">불러오는 중…</li>
              ) : (
                history.map(({ day, count }) => (
                  <li key={day} className="flex justify-between gap-6 tabular-nums">
                    <span className="text-muted-foreground">{dayLabel(day)}</span>
                    <span>{fmt(count)}</span>
                  </li>
                ))
              )}
            </ul>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
