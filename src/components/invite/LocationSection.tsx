import { useEffect, useRef, useState } from "react";
import { Bus, Car, MapPin, ParkingCircle, Train } from "lucide-react";
import { weddingConfig } from "@/config/wedding";
import { kakaoMapUrl, naverMapUrl, tmapAppUrl } from "@/lib/wedding-format";
import { hasKakaoKey, loadKakaoMapScript } from "@/lib/kakao";
import { useInViewOnce } from "@/components/invite/motion-shared";
import { useClipboard } from "@/hooks/useClipboard";

const { venue } = weddingConfig.event;
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

/* martinique 스타일: 아이콘 + 초록 라벨 헤더, 아래 본문, 그룹 사이 헤어라인 */
function TransportRow({
  icon: Icon,
  label,
  text,
}: {
  icon: typeof Train;
  label: string;
  text: string;
}) {
  return (
    <div className="py-5">
      <p className="flex items-center gap-2 text-[13px] text-blush-deep">
        <Icon className="h-4 w-4" aria-hidden />
        {label}
      </p>
      <p className="mt-3 text-[13px] leading-relaxed text-foreground/80">{text}</p>
    </div>
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
        {venue.transport.subway && (
          <TransportRow icon={Train} label="지하철" text={venue.transport.subway} />
        )}
        {venue.transport.bus && <TransportRow icon={Bus} label="버스" text={venue.transport.bus} />}
        {venue.transport.parking && (
          <TransportRow icon={ParkingCircle} label="주차" text={venue.transport.parking} />
        )}
      </div>
    </>
  );
}
