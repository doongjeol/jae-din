/**
 * 방문자 카운터 (counterapi.dev v2, 공개 워크스페이스).
 * - wedding-total: 누적 방문
 * - day-YYYYMMDD: 한국 시간 기준 그날 방문 (대시보드에서 미리 만들어둔 날짜만 집계됨)
 * 같은 기기는 하루 한 번만 세고, `?today`로 들어온 적 있는 기기(주인)는 세지 않는다.
 */
const BASE = "https://api.counterapi.dev/v2/dins-team-1-6312";
const TOTAL_SLUG = "wedding-total";

const OWNER_KEY = "jd:owner";
const LAST_DAY_KEY = "jd:visited-day";

export function kstDayKey(now = new Date()): string {
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10).replace(/-/g, "");
}

function storageGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function storageSet(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* 사파리 프라이빗 모드 등 — 무시 */
  }
}

export function markOwnerDevice() {
  storageSet(OWNER_KEY, "1");
}

function hit(slug: string) {
  return fetch(`${BASE}/${slug}/up`, { keepalive: true }).catch(() => {});
}

/** 방문 1회 기록. 주인 기기이거나 오늘 이미 센 기기면 아무것도 하지 않는다. */
export function recordVisit() {
  if (storageGet(OWNER_KEY)) return;
  const day = kstDayKey();
  if (storageGet(LAST_DAY_KEY) === day) return;
  storageSet(LAST_DAY_KEY, day);
  void hit(TOTAL_SLUG);
  void hit(`day-${day}`);
}

async function read(slug: string): Promise<number | null> {
  try {
    // API 응답이 CDN에 캐시되므로 매번 다른 쿼리로 우회
    const res = await fetch(`${BASE}/${slug}?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: { up_count?: number; down_count?: number } };
    const d = json.data;
    if (!d || typeof d.up_count !== "number") return null;
    return d.up_count - (d.down_count ?? 0);
  } catch {
    return null;
  }
}

/** 대시보드에 day-YYYYMMDD 카운터를 만들어 둔 기간 (한국 시간) */
const FIRST_DAY = "20261121";
const LAST_DAY = "20261205";

/** 날짜별 방문 수 (최신순). 자정이 지나도 그날 카운터에 그대로 남아 있다. */
export async function readDailyHistory(): Promise<{ day: string; count: number | null }[]> {
  const today = kstDayKey();
  const end = today < LAST_DAY ? today : LAST_DAY;
  const days: string[] = [];
  const cursor = new Date(
    `${FIRST_DAY.slice(0, 4)}-${FIRST_DAY.slice(4, 6)}-${FIRST_DAY.slice(6)}T00:00:00Z`,
  );
  for (;;) {
    const key = cursor.toISOString().slice(0, 10).replace(/-/g, "");
    if (key > end) break;
    days.push(key);
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  const counts = await Promise.all(days.map((d) => read(`day-${d}`)));
  return days.map((day, i) => ({ day, count: counts[i] })).reverse();
}

export async function readVisitCounts() {
  const [today, total] = await Promise.all([read(`day-${kstDayKey()}`), read(TOTAL_SLUG)]);
  return { today, total };
}
