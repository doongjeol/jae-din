import { weddingConfig } from "@/config/wedding";

function toIcsDate(d: Date) {
  return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function escapeIcsText(s: string) {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

/** Triggers a .ics download so mobile/desktop calendar apps can add the wedding event. */
export function downloadWeddingIcs() {
  const { event, share } = weddingConfig;
  const start = new Date(event.datetime);
  const end = new Date(start.getTime() + 60 * 60 * 1000); // 1시간 예식 기준
  const location = `${event.venue.name} ${event.venue.hall}, ${event.venue.address}`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//wedding-invite//KR",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${start.getTime()}@${weddingConfig.meta.url.replace(/^https?:\/\//, "")}`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:${escapeIcsText(share.kakaoTitle)}`,
    `DESCRIPTION:${escapeIcsText(share.kakaoDescription)}`,
    `LOCATION:${escapeIcsText(location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "wedding.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
