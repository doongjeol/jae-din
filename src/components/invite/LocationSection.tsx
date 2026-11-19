import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Bus,
  Car,
  ChevronDown,
  ExternalLink,
  Info,
  MapPin,
  Navigation,
  ParkingCircle,
  Train,
  TrainFront,
  Utensils,
} from "lucide-react";
import { weddingConfig } from "@/config/wedding";
import transitMap from "@/assets/transit-map.png";
import { kakaoMapUrl, naverMapUrl, tmapAppUrl } from "@/lib/wedding-format";
import { hasKakaoKey, loadKakaoMapScript } from "@/lib/kakao";
import { useInViewOnce } from "@/components/invite/motion-shared";
import { useClipboard } from "@/hooks/useClipboard";

const { venue } = weddingConfig.event;
const { transport } = venue;
const hasCoords = (venue.lat as number) !== 0 || (venue.lng as number) !== 0;

/** Renders the real Kakao map once the section scrolls into view (lazy SDK load); otherwise a static art placeholder. */
function VenueMap() {
  const { ref, shown } = useInViewOnce<HTMLDivElement>(0.1);
  const mapElRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!shown || !hasKakaoKey() || !hasCoords) return;
    let cancelled = false;
    loadKakaoMapScript().then((ok) => {
      if (!ok || cancelled || !mapElRef.current) return;
      const { kakao } = window as any;
      const center = new kakao.maps.LatLng(venue.lat, venue.lng);
      const map = new kakao.maps.Map(mapElRef.current, { center, level: 3, draggable: false });
      map.setZoomable(false);
      new kakao.maps.Marker({ position: center, map });
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [shown]);

  const openInKakaoMap = () => window.open(kakaoMapUrl(venue.name), "_blank", "noreferrer");

  return (
    <div
      ref={ref}
      onClick={openInKakaoMap}
      role="button"
      tabIndex={0}
      aria-label="카카오맵에서 크게 보기"
      className="relative mx-auto mt-8 aspect-[4/3] max-w-sm cursor-pointer overflow-hidden rounded-2xl border border-blush/60 bg-blush/20"
    >
      {hasKakaoKey() && hasCoords ? (
        <div ref={mapElRef} className="h-full w-full" />
      ) : (
        <div
          className="absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "linear-gradient(115deg, color-mix(in oklab, var(--blush) 60%, white) 0%, color-mix(in oklab, var(--sand) 80%, white) 100%)",
          }}
        />
      )}
      {!ready && (
        <>
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 300" fill="none" aria-hidden>
            <path d="M0 180 Q100 120 200 160 T400 140" stroke="rgb(160 181 117 / 0.5)" strokeWidth="2" />
            <path d="M40 40 Q160 100 240 60 T400 90" stroke="rgb(160 181 117 / 0.3)" strokeWidth="1.5" />
            <path d="M20 260 Q140 220 260 250 T400 230" stroke="rgb(160 181 117 / 0.3)" strokeWidth="1.5" />
            <rect x="60" y="80" width="70" height="50" rx="4" fill="oklch(1 0 0 / 0.5)" />
            <rect x="260" y="200" width="90" height="60" rx="4" fill="oklch(1 0 0 / 0.5)" />
            <rect x="150" y="180" width="60" height="40" rx="4" fill="oklch(1 0 0 / 0.5)" />
          </svg>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-blush-deep text-primary-foreground shadow-[var(--shadow-soft)]">
              <MapPin className="h-5 w-5" />
            </div>
            <p className="mt-2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-foreground">
              {venue.name}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function DirectionButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-1 flex-col items-center gap-1.5 rounded-xl border border-blush/60 bg-white/60 py-3 text-xs text-foreground transition-colors hover:bg-blush/40"
    >
      <Car className="h-4 w-4 text-blush-deep" aria-hidden />
      {label}
    </button>
  );
}

/* 그룹 헤더(아이콘 + 라벨) 아래로 하위 항목을 묶는다 — 자차 / 대중교통 */
function TransportGroup({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Train;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="py-6">
      <p className="flex items-center gap-2 text-[14px] font-medium text-blush-deep">
        <Icon className="h-4 w-4" aria-hidden />
        {label}
      </p>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

function SubItem({
  icon: Icon,
  title,
  lines,
  notes = [],
}: {
  icon?: typeof Train;
  title: string;
  lines: readonly string[];
  /** 본문보다 옅게 보이는 보조 안내 */
  notes?: readonly string[];
}) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[13px] font-medium text-foreground">
        {Icon && <Icon className="h-3.5 w-3.5 text-blush-deep" aria-hidden />}
        {title}
      </p>
      <ul className="mt-1.5 space-y-1">
        {lines.map((l) => (
          <li key={l} className="text-[13px] leading-relaxed text-foreground/80">
            {l}
          </li>
        ))}
        {notes.map((l) => (
          <li key={l} className="text-[12.5px] leading-relaxed text-foreground/55">
            {l}
          </li>
        ))}
      </ul>
    </div>
  );
}

type InfoRow = { label: string; value: string };

/* 라벨 | 내용 행 목록 (주차·버스 공용) */
function InfoRows({ rows, labelWidth = "w-16" }: { rows: readonly InfoRow[]; labelWidth?: string }) {
  return (
    <dl className="divide-y divide-blush/50">
      {rows.map((r) => (
        <div key={r.label} className="flex gap-3 py-2.5 text-[13px] leading-relaxed">
          <dt className={`${labelWidth} shrink-0 text-muted-foreground`}>{r.label}</dt>
          <dd className="whitespace-pre-line text-foreground/80">{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/* 주차 상세 카드 */
function ParkingTable({
  rows,
  link,
}: {
  rows: readonly InfoRow[];
  link?: { label: string; url: string };
}) {
  return (
    <div className="rounded-xl bg-white/60 px-4 py-1">
      <p className="flex items-center gap-1.5 pt-3 text-[13px] font-medium text-foreground">
        <ParkingCircle className="h-3.5 w-3.5 text-blush-deep" aria-hidden />
        주차 안내
      </p>
      <InfoRows rows={rows} labelWidth="w-[4.5rem]" />
      {link?.url && (
        <a
          href={link.url}
          target="_blank"
          rel="noreferrer"
          className="-mt-1 ml-[calc(4.5rem+0.75rem)] inline-flex items-center gap-1 pb-3 text-[13px] text-blush-deep underline underline-offset-2"
        >
          {link.label}
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </a>
      )}
    </div>
  );
}

/* 방면별 경로: 내용이 길어 접어 두고 탭하면 펼친다 */
function RouteList({ routes }: { routes: readonly InfoRow[] }) {
  return (
    <details className="group rounded-xl bg-white/60 px-4">
      <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-[13px] font-medium text-foreground [&::-webkit-details-marker]:hidden">
        차량 방면별 오시는 길
        <ChevronDown
          className="h-4 w-4 text-blush-deep transition-transform group-open:rotate-180"
          aria-hidden
        />
      </summary>
      <ul className="space-y-3 border-t border-blush/50 pb-4 pt-3">
        {routes.map((r) => (
          <li key={r.label} className="text-[13px] leading-relaxed">
            <p className="text-foreground">{r.label}</p>
            <p className="mt-0.5 whitespace-pre-line text-foreground/75">{r.value}</p>
          </li>
        ))}
      </ul>
    </details>
  );
}

export function LocationSection() {
  const { copy } = useClipboard();

  return (
    <>
      <div className="mx-auto max-w-sm text-center">
        <h3 className="font-serif text-2xl text-foreground">{venue.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{venue.hall}</p>
        <div className="mt-3 flex items-center justify-center gap-2 text-sm text-foreground/80">
          <span>{venue.address}</span>
          <button
            type="button"
            onClick={() => copy(venue.address, "주소가 복사되었습니다")}
            className="shrink-0 text-xs text-blush-deep underline underline-offset-2"
          >
            복사
          </button>
        </div>
      </div>

      <VenueMap />

      <div className="mx-auto mt-4 flex max-w-sm gap-2">
        <DirectionButton label="카카오맵" onClick={() => window.open(kakaoMapUrl(venue.name), "_blank", "noreferrer")} />
        <DirectionButton
          label="네이버지도"
          onClick={() => window.open(naverMapUrl(venue.address), "_blank", "noreferrer")}
        />
        <DirectionButton
          label="티맵"
          onClick={() => {
            window.location.href = tmapAppUrl(venue.name);
          }}
        />
      </div>

      <div className="mx-auto mt-10 max-w-sm divide-y divide-blush/70">
        <TransportGroup icon={Car} label="자차">
          <SubItem icon={Navigation} title="내비게이션" lines={[transport.car.navi]} />
          {transport.car.parking.length > 0 && <ParkingTable rows={transport.car.parking} link={transport.car.parkingLink} />}
          {transport.car.routes.length > 0 && <RouteList routes={transport.car.routes} />}
        </TransportGroup>

        {(transport.subway.length > 0 || transport.bus.length > 0) && (
          <TransportGroup icon={Train} label="대중교통">
            <img
              src={transitMap}
              alt="발산역 사거리 기준 더뉴컨벤션웨딩홀 약도: 발산역 7번·8번 출구에서 남쪽으로 내려와 이대병원·메가커피 사이 골목 안쪽"
              width={1200}
              height={769}
              loading="lazy"
              className="w-full rounded-xl bg-white"
            />
            {transport.subway.length > 0 && <SubItem icon={TrainFront} title="지하철" lines={transport.subway} notes={transport.subwayWalk} />}
            {transport.bus.length > 0 && (
              <div>
                <p className="flex items-center gap-1.5 text-[13px] font-medium text-foreground">
                  <Bus className="h-3.5 w-3.5 text-blush-deep" aria-hidden />
                  버스 <span className="font-normal text-muted-foreground">(발산역 하차)</span>
                </p>
                <div className="mt-1">
                  <InfoRows rows={transport.bus} labelWidth="w-[4.5rem]" />
                </div>
              </div>
            )}
          </TransportGroup>
        )}

        {venue.meal && (
          <TransportGroup icon={Utensils} label="식사 안내">
            <p className="text-[13px] leading-relaxed text-foreground/80">{venue.meal}</p>
          </TransportGroup>
        )}

        {venue.etc.length > 0 && (
          <TransportGroup icon={Info} label="기타 안내">
            <InfoRows rows={venue.etc} labelWidth="w-[4.5rem]" />
          </TransportGroup>
        )}
      </div>
    </>
  );
}
