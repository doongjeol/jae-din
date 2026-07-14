import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  MotionConfig,
  useScroll,
  useTransform,
} from "framer-motion";
import { Copy, Check, ChevronDown } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import g1 from "@/assets/g1.jpg";
import g2 from "@/assets/g2.jpg";
import g3 from "@/assets/g3.jpg";
import g4 from "@/assets/g4.jpg";
import g5 from "@/assets/g5.jpg";
import g6 from "@/assets/g6.jpg";
import g7 from "@/assets/g7.jpg";
import g8 from "@/assets/g8.jpg";
import {
  EASE,
  InteractionLockProvider,
  Reveal,
  smoothScrollBy,
  useInViewOnce,
  useReducedMotionSafe,
} from "@/components/invite/motion-shared";
import { Splash } from "@/components/invite/Splash";
import { ProgressNav } from "@/components/invite/ProgressNav";
import { Lightbox } from "@/components/invite/Lightbox";
import { Countdown } from "@/components/invite/Countdown";
import { LocationSection } from "@/components/invite/LocationSection";
import { ContactSection } from "@/components/invite/ContactSection";
import { ShareFooter } from "@/components/invite/ShareFooter";
import { FlowerIcon } from "@/components/invite/FlowerIcon";
import { weddingConfig, type Person } from "@/config/wedding";
import { collectAccounts } from "@/lib/wedding-format";
import { useClipboard } from "@/hooks/useClipboard";

export const Route = createFileRoute("/")({
  component: Invitation,
});

const WEDDING = {
  groom: weddingConfig.couple.groom.name,
  bride: weddingConfig.couple.bride.name,
  date: new Date(weddingConfig.event.datetime),
  dateTime: new Date(weddingConfig.event.datetime),
  dateLabel: weddingConfig.event.dateLabel,
  venueName: weddingConfig.event.venue.name,
  venueHall: weddingConfig.event.venue.hall,
  address: weddingConfig.event.venue.address,
  accounts: {
    groom: collectAccounts("groom"),
    bride: collectAccounts("bride"),
  },
};

const MONTH_EN = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
];

const NAV_SECTIONS = [
  { id: "hero", label: "처음으로" },
  { id: "invitation", label: "초대합니다" },
  { id: "wedding-day", label: "예식 안내" },
  { id: "family", label: "가족 소개" },
  { id: "gallery", label: "갤러리" },
  { id: "location", label: "오시는 길" },
  { id: "gift", label: "마음 전하실 곳" },
];

/* ------------------------------- Hero -------------------------------- */
/* martinique 스타일: 풀스크린 사진 위에 상단 영문 이름, 하단 일시·장소 오버레이 */

const heroStagger = {
  hidden: {},
  show: { transition: { delayChildren: 1.0, staggerChildren: 0.18 } },
};
const heroItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <header ref={ref} id="hero" className="relative h-[100dvh] overflow-hidden">
      <motion.div className="absolute inset-0" style={reduce ? undefined : { y: bgY }}>
        <img
          src={heroImg}
          alt={`${WEDDING.groom} & ${WEDDING.bride} 웨딩 사진`}
          width={1500}
          height={2100}
          className="animate-hero-img h-full w-full object-cover"
        />
      </motion.div>
      {/* 위·아래로만 살짝 어둡게 — 사진을 가리지 않는 얇은 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/35 via-transparent to-ink/45" />

      <motion.div
        variants={heroStagger}
        initial="hidden"
        animate="show"
        className="absolute inset-0 flex flex-col items-center justify-between px-6 pb-10 pt-16"
      >
        <motion.h1
          variants={heroItem}
          className="font-serif text-[1.7rem] font-light uppercase tracking-[0.18em] text-white/95"
        >
          {weddingConfig.couple.groom.nameEn}
          <span className="mx-3 font-script normal-case">&amp;</span>
          {weddingConfig.couple.bride.nameEn}
        </motion.h1>

        <div className="text-center text-white/95">
          <motion.p variants={heroItem} className="text-[15px] tracking-wide">
            {weddingConfig.event.displayDate} {weddingConfig.event.displayTime}
          </motion.p>
          <motion.p variants={heroItem} className="mt-2 text-sm text-white/85">
            {WEDDING.venueName} {WEDDING.venueHall}
          </motion.p>
          <motion.div variants={heroItem} className="mt-8 flex justify-center">
            <ChevronDown className="animate-indicator h-4 w-4 text-white/70" aria-hidden />
          </motion.div>
        </div>
      </motion.div>
    </header>
  );
}

/* --------------------------- Section title --------------------------- */
/* martinique 패턴: 큰 세리프 대문자 영문 타이틀 + 작은 한글 부제 */

function SectionTitle({
  title,
  subtitle,
  subtitleEn,
}: {
  title: string;
  subtitle?: string;
  subtitleEn?: string;
}) {
  return (
    <Reveal>
      <div className="mb-12 text-center">
        <h2 className="font-serif text-[1.65rem] font-light uppercase tracking-[0.28em] text-foreground/65">
          {title}
        </h2>
        {subtitle && <p className="mt-6 text-[15px] text-foreground/85">{subtitle}</p>}
        {subtitleEn && (
          <p className="mt-2 text-xs tracking-wide text-muted-foreground">{subtitleEn}</p>
        )}
      </div>
    </Reveal>
  );
}

/* ------------------------- Stem ornament ----------------------------- */
/* 초대글 상단의 가는 줄기+잎 장식 */

function StemOrnament() {
  return (
    <svg
      viewBox="0 0 24 56"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      aria-hidden
      className="mx-auto h-12 w-6 text-blush-deep/70"
    >
      <path d="M12 2v52" />
      <path d="M12 14c-4-1-6-4-6-7 3 0 6 2 6 7z" fill="currentColor" stroke="none" opacity="0.5" />
      <path d="M12 24c4-1 6-4 6-7-3 0-6 2-6 7z" fill="currentColor" stroke="none" opacity="0.35" />
    </svg>
  );
}

/* ---------------------------- Copy button ---------------------------- */

function CopyButton({ text, label = "복사" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const { copy } = useClipboard();
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.94 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      onClick={async () => {
        const ok = await copy(text, "계좌번호가 복사되었습니다");
        if (ok) {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }
      }}
      className="inline-flex items-center gap-1.5 rounded-full border border-blush-deep/40 bg-white/70 px-3 py-1.5 text-xs text-foreground transition-colors hover:bg-blush/40"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={copied ? "copied" : "idle"}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="inline-flex items-center gap-1.5"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "복사되었습니다" : label}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

/* ------------------------------ Calendar ----------------------------- */
/* martinique 스타일: 카드 없이 위아래 헤어라인만, 일요일 붉은 톤 */

const calGrid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.018 } },
};
const calCell = {
  hidden: { opacity: 0, y: 6 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

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
  const wdays = ["일", "월", "화", "수", "목", "금", "토"];
  const { ref, shown } = useInViewOnce<HTMLDivElement>();

  return (
    <div ref={ref} className="mx-auto max-w-xs">
      <motion.div
        variants={calGrid}
        initial="hidden"
        animate={shown ? "show" : undefined}
        className="grid grid-cols-7 gap-y-1 border-y border-blush/70 py-6 text-[0.78rem]"
      >
        {wdays.map((w, i) => (
          <motion.div
            key={`w${i}`}
            variants={calCell}
            className={`pb-2 text-center text-[0.68rem] ${
              i === 0 ? "text-red-400/80" : "text-foreground/70"
            }`}
          >
            {w}
          </motion.div>
        ))}
        {cells.map((n, i) => {
          const isDay = n === day;
          const isSun = i % 7 === 0 && n;
          return (
            <motion.div
              key={i}
              variants={calCell}
              className={`grid aspect-square place-items-center ${
                isDay
                  ? "dday-glow rounded-full bg-blush-deep font-medium text-primary-foreground"
                  : isSun
                    ? "text-red-400/80"
                    : "text-foreground/80"
              }`}
            >
              {n ?? ""}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

/* --------------------------- Family intro ---------------------------- */
/* pill 배지 + 이름/영문 + 혼주(고인 꽃 아이콘) + 서열 */

function FamilyCard({
  role,
  person,
  father,
  mother,
  order,
}: {
  role: string;
  person: { name: string; nameEn?: string };
  father: Person;
  mother: Person;
  order: string;
}) {
  const parent = (p: Person) => (
    <span className="whitespace-nowrap">
      {p.deceased && <FlowerIcon className="mr-1 text-blush-deep" />}
      {p.name}
    </span>
  );
  return (
    <div className="text-center">
      <span className="inline-block rounded-full bg-blush-deep/90 px-4 py-1 text-xs tracking-[0.15em] text-primary-foreground">
        {role}
      </span>
      <p className="mt-5 font-serif text-2xl text-foreground">{person.name}</p>
      {person.nameEn && (
        <p className="mt-1 text-[0.68rem] uppercase tracking-[0.35em] text-muted-foreground">
          {person.nameEn}
        </p>
      )}
      <p className="mt-5 text-sm text-foreground/80">
        {parent(father)}
        <span className="mx-3 text-blush-deep/60">|</span>
        {parent(mother)}
      </p>
      <p className="mt-1.5 text-xs text-muted-foreground">의 {order}</p>
    </div>
  );
}

/* ----------------------------- Accordion ----------------------------- */

const accordionList = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const accordionRow = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

const ACCORDION_MS = 500;

function AccountAccordion({ title, list }: { title: string; list: typeof WEDDING.accounts.groom }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next && contentRef.current) {
      // Keep the newly revealed rows in view: run a page scroll with the
      // same duration/ease as the expand so both finish together.
      const el = contentRef.current;
      const top = el.getBoundingClientRect().top;
      const expandedBottom = top + el.scrollHeight;
      const overflow = expandedBottom - (window.innerHeight - 24);
      const maxUp = Math.max(0, top - 96); // never push the header out of view
      const delta = Math.max(0, Math.min(overflow, maxUp));
      if (delta > 0) smoothScrollBy(delta, ACCORDION_MS);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-[var(--shadow-card)]">
      <button
        type="button"
        onClick={toggle}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
      >
        <span className="text-[15px] text-foreground">{title}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="inline-flex"
        >
          <ChevronDown className="h-4 w-4 text-blush-deep" />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: ACCORDION_MS / 1000, ease: EASE }}
        className="overflow-hidden"
      >
        <div ref={contentRef} className="px-5 pb-5">
          <motion.ul
            variants={accordionList}
            initial={false}
            animate={open ? "show" : "hidden"}
            className="divide-y divide-blush/50"
          >
            {list.map((a) => (
              <motion.li
                key={`${a.role}-${a.number}`}
                variants={accordionRow}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="min-w-0">
                  <p className="text-[0.7rem] text-muted-foreground">{a.role}</p>
                  <p className="truncate font-serif text-lg text-foreground">{a.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {a.bank} · {a.number}
                  </p>
                </div>
                <CopyButton text={a.number} label="계좌복사" />
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </motion.div>
    </div>
  );
}

/* -------------------------------- Page ------------------------------- */

function Invitation() {
  const gallery = [g4, g2, g3, g1, g5, g6, g7, g8];
  const [lightbox, setLightbox] = useState<number | null>(null);
  const d = WEDDING.date;

  return (
    <MotionConfig reducedMotion="user">
      <InteractionLockProvider>
        <Splash monogram={`${WEDDING.groom.slice(1)} & ${WEDDING.bride.slice(1)}`} />
        <ProgressNav sections={NAV_SECTIONS} />

        <main className="mx-auto min-h-screen max-w-[460px] bg-background text-foreground shadow-[var(--shadow-soft)]">
          <Hero />

          {/* ------- 초대글: 흰 배경, 줄기 장식 + 성구 + 인사말 ------- */}
          <section id="invitation" className="bg-white px-8 py-24">
            <Reveal>
              <StemOrnament />
            </Reveal>

            {weddingConfig.invitation.verse && (
              <Reveal delay={80}>
                <div className="mt-10 text-center">
                  <p className="font-script text-[15px] text-foreground/80">
                    {weddingConfig.invitation.verse}
                  </p>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {weddingConfig.invitation.verseRef}
                  </p>
                </div>
              </Reveal>
            )}

            <Reveal delay={150}>
              <p className="mx-auto mt-10 max-w-sm whitespace-pre-line text-center text-[15px] leading-[2.1] text-foreground/85">
                {weddingConfig.invitation.message}
              </p>
            </Reveal>

            <Reveal delay={220}>
              <p className="mt-12 text-center text-[15px] text-foreground">
                신랑 {WEDDING.groom} <span className="mx-1 text-blush-deep">·</span> 신부{" "}
                {WEDDING.bride}
              </p>
            </Reveal>
          </section>

          {/* ------- 풀폭 사진 한 장 ------- */}
          <Reveal>
            <img
              src={g5}
              alt="웨딩 촬영 사진"
              loading="lazy"
              className="aspect-[3/4] w-full object-cover"
            />
          </Reveal>

          {/* ------- 대형 날짜 타이포: 세이지 풀블리드 ------- */}
          <section className="bg-blush-deep px-6 py-32 text-center">
            <Reveal>
              <p className="font-serif text-6xl font-light tracking-[0.08em] text-primary-foreground">
                {MONTH_EN[d.getMonth()]} {d.getDate()}
              </p>
            </Reveal>
            <Reveal delay={150}>
              <p className="mt-4 font-serif text-5xl font-light tracking-[0.12em] text-primary-foreground/90">
                {d.getFullYear()}
              </p>
            </Reveal>
          </section>

          {/* ------- WEDDING DAY: 달력 + 카운트다운 ------- */}
          <section id="wedding-day" className="bg-white px-6 py-24">
            <SectionTitle
              title="Wedding Day"
              subtitle={`${weddingConfig.event.displayDate} | ${weddingConfig.event.displayTime}`}
              subtitleEn={weddingConfig.event.displayDateTimeEn}
            />
            <Reveal delay={100}>
              <Calendar />
            </Reveal>
            <Reveal delay={150}>
              <Countdown
                target={WEDDING.dateTime}
                coupleLabel={`${WEDDING.groom.slice(1)} ♥ ${WEDDING.bride.slice(1)}`}
              />
            </Reveal>
          </section>

          {/* ------- 가족 소개 ------- */}
          <section id="family" className="bg-sand px-6 py-24">
            <div className="mx-auto max-w-xs space-y-14">
              <Reveal>
                <FamilyCard
                  role="신랑"
                  person={weddingConfig.couple.groom}
                  father={weddingConfig.couple.groom.father}
                  mother={weddingConfig.couple.groom.mother}
                  order={weddingConfig.couple.groom.order}
                />
              </Reveal>
              <Reveal delay={100}>
                <div className="mx-auto h-px w-16 bg-blush-deep/40" />
              </Reveal>
              <Reveal delay={150}>
                <FamilyCard
                  role="신부"
                  person={weddingConfig.couple.bride}
                  father={weddingConfig.couple.bride.father}
                  mother={weddingConfig.couple.bride.mother}
                  order={weddingConfig.couple.bride.order}
                />
              </Reveal>
            </div>
          </section>

          {/* ------- 갤러리 ------- */}
          <section id="gallery" className="bg-white px-6 py-24">
            <SectionTitle title="Gallery" subtitle="우리의 순간들" />
            <div
              className={`grid gap-1.5 ${
                weddingConfig.gallery.columns === 3 ? "grid-cols-3" : "grid-cols-2"
              }`}
            >
              {gallery.map((src, i) => (
                <Reveal
                  key={i}
                  delay={i * 80}
                  y={16}
                  scaleFrom={0.95}
                  className={i === 0 ? "col-span-full" : ""}
                >
                  <button
                    type="button"
                    onClick={() => setLightbox(i)}
                    aria-label={`사진 ${i + 1} 크게 보기`}
                    className={`block w-full overflow-hidden rounded-md ${
                      i === 0 ? "aspect-[4/3]" : "aspect-square"
                    }`}
                  >
                    <img
                      src={src}
                      alt={`웨딩 촬영 사진 ${i + 1}`}
                      loading="lazy"
                      draggable={false}
                      onContextMenu={
                        weddingConfig.gallery.preventDownload ? (e) => e.preventDefault() : undefined
                      }
                      className={`h-full w-full object-cover transition-transform duration-700 hover:scale-105 ${
                        weddingConfig.gallery.preventDownload
                          ? "select-none [-webkit-touch-callout:none]"
                          : ""
                      }`}
                    />
                  </button>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ------- 오시는 길 ------- */}
          <section id="location" className="bg-sand px-6 py-24">
            <SectionTitle title="Location" subtitle="오시는 길" />
            <Reveal delay={100}>
              <LocationSection />
            </Reveal>
          </section>

          {/* ------- 마음 전하실 곳 ------- */}
          <section id="gift" className="bg-background px-6 py-24">
            <SectionTitle title="Account" subtitle="마음 전하실 곳" />
            <Reveal>
              <p className="mx-auto mb-8 max-w-xs text-center text-sm leading-relaxed text-muted-foreground">
                참석이 어려우신 분들을 위해
                <br />
                계좌번호를 안내해 드립니다.
              </p>
            </Reveal>
            <div className="mx-auto max-w-sm space-y-3">
              <Reveal delay={100}>
                <AccountAccordion title="신랑측에게" list={WEDDING.accounts.groom} />
              </Reveal>
              <Reveal delay={200}>
                <AccountAccordion title="신부측에게" list={WEDDING.accounts.bride} />
              </Reveal>
            </div>
          </section>

          {/* ------- 연락하기 ------- */}
          <section id="contact" className="bg-white px-6 py-24">
            <SectionTitle title="Contact" subtitle="연락하기" />
            <Reveal delay={100}>
              <ContactSection />
            </Reveal>
          </section>

          {/* ------- 엔딩: 풀블리드 사진 + 감사 문구 오버레이 ------- */}
          <section className="relative">
            <img
              src={g6}
              alt="웨딩 촬영 사진"
              loading="lazy"
              className="aspect-[3/4] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ink/10 to-ink/55" />
            <div className="absolute inset-x-0 bottom-0 px-8 pb-14 text-center">
              <Reveal>
                <p className="text-sm leading-relaxed text-white/95">
                  {weddingConfig.footer.thanksMessage}
                </p>
              </Reveal>
            </div>
          </section>

          {/* ------- 공유 + 푸터 ------- */}
          <footer className="bg-white px-6 pb-14 pt-10 text-center">
            <Reveal>
              <ShareFooter />
            </Reveal>
            <div className="mx-auto mb-6 mt-10 h-px w-12 bg-blush-deep/40" />
            <p className="font-script text-2xl text-blush-deep">
              {weddingConfig.couple.groom.nameEn} &amp; {weddingConfig.couple.bride.nameEn}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              {WEDDING.groom} · {WEDDING.bride} — {weddingConfig.event.displayDate}
            </p>
          </footer>
        </main>

        <Lightbox
          images={gallery}
          index={lightbox}
          onClose={() => setLightbox(null)}
          onNavigate={setLightbox}
        />
      </InteractionLockProvider>
    </MotionConfig>
  );
}
