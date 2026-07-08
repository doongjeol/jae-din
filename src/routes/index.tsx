import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Copy, Check, ChevronDown, MapPin, Heart, MessageCircle } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import g1 from "@/assets/g1.jpg";
import g2 from "@/assets/g2.jpg";
import g3 from "@/assets/g3.jpg";
import g4 from "@/assets/g4.jpg";

export const Route = createFileRoute("/")({
  component: Invitation,
});

const WEDDING = {
  groom: "김민준",
  bride: "이서연",
  date: new Date(2026, 8, 12),
  dateLabel: "2026. 09. 12 SAT PM 1:00",
  venueName: "그랜드 하얏트 서울",
  venueHall: "그랜드볼룸 3F",
  address: "서울특별시 용산구 소월로 322",
  accounts: {
    groom: [
      { role: "신랑", name: "김민준", bank: "국민은행", number: "123-4567-8901-23" },
      { role: "신랑 아버지", name: "김상철", bank: "신한은행", number: "110-234-567890" },
      { role: "신랑 어머니", name: "박정희", bank: "우리은행", number: "1002-345-678901" },
    ],
    bride: [
      { role: "신부", name: "이서연", bank: "카카오뱅크", number: "3333-01-2345678" },
      { role: "신부 아버지", name: "이영수", bank: "농협은행", number: "302-1234-5678-90" },
      { role: "신부 어머니", name: "최은주", bank: "하나은행", number: "234-910123-45607" },
    ],
  },
};

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={shown ? "reveal-in" : "reveal"}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title?: string;
  children: ReactNode;
}) {
  return (
    <section className="px-6 py-20">
      {(eyebrow || title) && (
        <Reveal>
          <div className="mb-12 text-center">
            {eyebrow && (
              <p className="mb-3 text-[0.7rem] tracking-[0.4em] text-blush-deep uppercase font-script">
                {eyebrow}
              </p>
            )}
            {title && <h2 className="text-3xl text-foreground font-serif">{title}</h2>}
            <div className="mx-auto mt-6 h-px w-10 bg-blush-deep/50" />
          </div>
        </Reveal>
      )}
      {children}
    </section>
  );
}

function CopyButton({ text, label = "복사" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          /* noop */
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-full border border-blush-deep/30 bg-white/60 px-3 py-1.5 text-xs text-foreground transition hover:bg-blush/40"
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? "복사됨" : label}
    </button>
  );
}

function Calendar() {
  const d = WEDDING.date;
  const year = d.getFullYear();
  const month = d.getMonth();
  const day = d.getDate();
  const first = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(i);
  while (cells.length % 7 !== 0) cells.push(null);
  const wdays = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className="mx-auto max-w-xs rounded-2xl bg-white/70 p-6 shadow-[var(--shadow-card)] backdrop-blur">
      <p className="text-center font-serif text-xl text-foreground">
        {year}. {String(month + 1).padStart(2, "0")}
      </p>
      <div className="mt-4 grid grid-cols-7 gap-1 text-[0.7rem] text-muted-foreground">
        {wdays.map((w, i) => (
          <div
            key={i}
            className={`py-1 text-center ${i === 0 ? "text-blush-deep" : ""}`}
          >
            {w}
          </div>
        ))}
        {cells.map((n, i) => {
          const isDay = n === day;
          const isSun = i % 7 === 0 && n;
          return (
            <div
              key={i}
              className={`aspect-square grid place-items-center text-sm ${
                isDay
                  ? "rounded-full bg-blush-deep text-primary-foreground font-medium"
                  : isSun
                    ? "text-blush-deep"
                    : "text-foreground"
              }`}
            >
              {n ?? ""}
            </div>
          );
        })}
      </div>
      <p className="mt-5 text-center text-sm text-muted-foreground">
        {WEDDING.dateLabel}
      </p>
    </div>
  );
}

function AccountList({ list }: { list: typeof WEDDING.accounts.groom }) {
  return (
    <ul className="divide-y divide-blush/60">
      {list.map((a) => (
        <li key={a.number} className="flex items-center justify-between gap-3 py-3">
          <div className="min-w-0">
            <p className="text-[0.7rem] text-muted-foreground">{a.role}</p>
            <p className="truncate font-serif text-lg text-foreground">{a.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {a.bank} · {a.number}
            </p>
          </div>
          <CopyButton text={a.number} label="계좌복사" />
        </li>
      ))}
    </ul>
  );
}

function AccountAccordion({
  side,
  list,
}: {
  side: string;
  list: typeof WEDDING.accounts.groom;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-2xl border border-blush/60 bg-white/60 backdrop-blur">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="font-serif text-lg text-foreground">{side} 계좌번호</span>
        <ChevronDown
          className={`h-4 w-4 text-blush-deep transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`grid transition-all duration-500 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="px-5 pb-5">
            <AccountList list={list} />
          </div>
        </div>
      </div>
    </div>
  );
}

interface Msg {
  id: number;
  name: string;
  text: string;
  at: string;
}

function Guestbook() {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: 1,
      name: "지은",
      text: "두 분의 결혼을 진심으로 축하드려요. 늘 지금처럼 행복하세요 💐",
      at: "2026.08.20",
    },
    {
      id: 2,
      name: "현우",
      text: "축하해 민준아! 서연 님과 오래오래 행복하길 바랄게.",
      at: "2026.08.22",
    },
  ]);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    const now = new Date();
    setMsgs((prev) => [
      {
        id: Date.now(),
        name: name.trim(),
        text: text.trim(),
        at: `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`,
      },
      ...prev,
    ]);
    setName("");
    setText("");
  };

  return (
    <div className="mx-auto max-w-md">
      <form
        onSubmit={submit}
        className="space-y-3 rounded-2xl border border-blush/60 bg-white/60 p-5 backdrop-blur"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름"
          className="w-full rounded-lg border border-blush/60 bg-white/70 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-blush-deep"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="따뜻한 축하의 메시지를 남겨주세요"
          rows={3}
          className="w-full resize-none rounded-lg border border-blush/60 bg-white/70 px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:border-blush-deep"
        />
        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blush-deep px-4 py-2.5 text-sm text-primary-foreground transition hover:opacity-90"
        >
          <Heart className="h-3.5 w-3.5" /> 축하 메시지 남기기
        </button>
      </form>

      <ul className="mt-6 space-y-3">
        {msgs.map((m) => (
          <li
            key={m.id}
            className="rounded-2xl border border-blush/40 bg-white/50 p-4 backdrop-blur"
          >
            <div className="mb-1 flex items-baseline justify-between">
              <span className="font-serif text-base text-foreground">{m.name}</span>
              <span className="text-[0.7rem] text-muted-foreground">{m.at}</span>
            </div>
            <p className="text-sm leading-relaxed text-foreground/85">{m.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Invitation() {
  const gallery = [g1, g2, g3, g4, heroImg];
  const kakaoMap = `https://map.kakao.com/?q=${encodeURIComponent(WEDDING.venueName)}`;

  return (
    <main className="mx-auto min-h-screen max-w-[460px] bg-background text-foreground">
      <header className="relative overflow-hidden">
        <div className="animate-soft-fade relative">
          <img
            src={heroImg}
            alt={`${WEDDING.groom} & ${WEDDING.bride}`}
            width={1024}
            height={1280}
            className="h-[78vh] w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background" />
        </div>
        <div className="animate-rise relative -mt-24 px-6 pb-16 text-center">
          <p className="font-script text-sm tracking-[0.35em] text-blush-deep">
            WE ARE GETTING MARRIED
          </p>
          <h1 className="mt-6 font-serif text-4xl leading-tight text-foreground">
            {WEDDING.groom}
            <span className="mx-3 text-blush-deep">&amp;</span>
            {WEDDING.bride}
          </h1>
          <div className="mx-auto mt-6 h-px w-16 bg-blush-deep/50" />
          <p className="mt-6 text-sm tracking-[0.2em] text-muted-foreground">
            {WEDDING.dateLabel}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {WEDDING.venueName} · {WEDDING.venueHall}
          </p>
        </div>
      </header>

      <Section eyebrow="Invitation" title="소중한 분들을 초대합니다">
        <Reveal delay={100}>
          <div className="mx-auto max-w-sm text-center font-serif text-[15px] leading-[2.1] text-foreground/85">
            <p>
              서로 마주보며 다져온 사랑을
              <br />
              이제 함께 한 곳을 바라보며
              <br />
              키우고자 합니다.
            </p>
            <p className="mt-6">
              저희 두 사람이 사랑의 이름으로
              <br />
              지켜나갈 수 있게 오셔서 축복해 주시면
              <br />
              더없는 기쁨으로 간직하겠습니다.
            </p>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="mx-auto mt-10 max-w-xs space-y-2 text-center text-sm text-muted-foreground">
            <p>
              김상철 · 박정희<span className="mx-2 text-blush-deep">의 아들</span>
              <span className="font-serif text-foreground"> 민준</span>
            </p>
            <p>
              이영수 · 최은주<span className="mx-2 text-blush-deep">의 딸</span>
              <span className="font-serif text-foreground"> 서연</span>
            </p>
          </div>
        </Reveal>
      </Section>

      <Section eyebrow="Gallery" title="우리의 순간들">
        <Reveal>
          <div className="grid grid-cols-2 gap-2">
            {gallery.map((src, i) => (
              <div
                key={i}
                className={`overflow-hidden rounded-lg ${i === 0 ? "col-span-2 aspect-[4/3]" : "aspect-square"}`}
              >
                <img
                  src={src}
                  alt={`gallery ${i + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      <Section eyebrow="When & Where" title="예식 안내">
        <Reveal>
          <Calendar />
        </Reveal>

        <Reveal delay={150}>
          <div className="mx-auto mt-10 max-w-sm text-center">
            <h3 className="font-serif text-2xl text-foreground">{WEDDING.venueName}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{WEDDING.venueHall}</p>
            <p className="mt-3 text-sm text-foreground/80">{WEDDING.address}</p>

            <div className="mt-4 flex justify-center gap-2">
              <CopyButton text={WEDDING.address} label="주소 복사" />
              <a
                href={kakaoMap}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-blush-deep/30 bg-white/60 px-3 py-1.5 text-xs text-foreground transition hover:bg-blush/40"
              >
                <MapPin className="h-3 w-3" /> 지도 열기
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={250}>
          <div className="relative mx-auto mt-8 aspect-[4/3] max-w-sm overflow-hidden rounded-2xl border border-blush/60 bg-blush/20">
            <div
              className="absolute inset-0 opacity-70"
              style={{
                backgroundImage:
                  "linear-gradient(115deg, color-mix(in oklab, var(--blush) 60%, white) 0%, color-mix(in oklab, var(--sand) 80%, white) 100%)",
              }}
            />
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 400 300"
              fill="none"
              aria-hidden
            >
              <path
                d="M0 180 Q100 120 200 160 T400 140"
                stroke="oklch(0.78 0.06 22 / 0.5)"
                strokeWidth="2"
              />
              <path
                d="M40 40 Q160 100 240 60 T400 90"
                stroke="oklch(0.78 0.06 22 / 0.3)"
                strokeWidth="1.5"
              />
              <path
                d="M20 260 Q140 220 260 250 T400 230"
                stroke="oklch(0.78 0.06 22 / 0.3)"
                strokeWidth="1.5"
              />
              <rect x="60" y="80" width="70" height="50" rx="4" fill="oklch(1 0 0 / 0.5)" />
              <rect x="260" y="200" width="90" height="60" rx="4" fill="oklch(1 0 0 / 0.5)" />
              <rect x="150" y="180" width="60" height="40" rx="4" fill="oklch(1 0 0 / 0.5)" />
            </svg>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="mx-auto grid h-10 w-10 place-items-center rounded-full bg-blush-deep text-primary-foreground shadow-[var(--shadow-soft)]">
                <MapPin className="h-5 w-5" />
              </div>
              <p className="mt-2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-foreground">
                {WEDDING.venueName}
              </p>
            </div>
          </div>
        </Reveal>
      </Section>

      <Section eyebrow="Congratulations" title="마음 전하실 곳">
        <Reveal>
          <p className="mx-auto mb-8 max-w-xs text-center text-sm leading-relaxed text-muted-foreground">
            참석이 어려우신 분들을 위해
            <br />
            계좌번호를 안내해 드립니다.
          </p>
        </Reveal>
        <div className="mx-auto max-w-sm space-y-3">
          <Reveal delay={100}>
            <AccountAccordion side="신랑측" list={WEDDING.accounts.groom} />
          </Reveal>
          <Reveal delay={200}>
            <AccountAccordion side="신부측" list={WEDDING.accounts.bride} />
          </Reveal>
        </div>
      </Section>

      <Section eyebrow="Guestbook" title="축하의 한마디">
        <Reveal>
          <div className="mb-8 text-center text-sm text-muted-foreground">
            <MessageCircle className="mx-auto mb-2 h-4 w-4 text-blush-deep" />
            따뜻한 축하 메시지를 남겨주세요
          </div>
        </Reveal>
        <Reveal delay={100}>
          <Guestbook />
        </Reveal>
      </Section>

      <footer className="px-6 pb-12 pt-4 text-center">
        <div className="mx-auto mb-6 h-px w-12 bg-blush-deep/40" />
        <p className="font-script text-xl text-blush-deep">Thank you</p>
        <p className="mt-2 text-xs text-muted-foreground">
          {WEDDING.groom} &amp; {WEDDING.bride} · 2026.09.12
        </p>
      </footer>
    </main>
  );
}
