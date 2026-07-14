# 모바일 청첩장 프로젝트 기획서

> Next.js(App Router) + TypeScript + Tailwind CSS + Vercel
> 디자인 컨셉: 깔끔 + 따뜻한 감성 (toourguest.com/preview/martinique 스타일 참조)

---

## 1. 프로젝트 개요

### 1.1 목적
- 신랑·신부가 직접 제작/배포하는 **원페이지 모바일 청첩장** 웹사이트
- 카카오톡/문자 링크 공유가 주 유입 경로 → **모바일 우선(Mobile-First)** 설계
- 모든 개인 정보(이름, 날짜, 장소, 계좌 등)는 **단일 설정 파일**로 분리하여, 코드 수정 없이 내용만 교체 가능

### 1.2 범위
- 정적 원페이지 사이트 (별도 백엔드/DB 없음, 방명록·RSVP는 범위 외)
- Vercel 배포, 커스텀 도메인 연결 가능

### 1.3 타겟 환경
- 주 사용자: 모바일 (카카오톡 인앱 브라우저, iOS Safari, Android Chrome)
- 부 사용자: 데스크톱 (모바일 프레임 중앙 정렬로 표시)

---

## 2. 기능적 요구사항 (Functional Requirements)

페이지는 아래 8개 섹션이 세로 스크롤로 이어지는 구조.

### FR-1. Hero (첫 화면)
| ID | 요구사항 |
|---|---|
| FR-1.1 | 화면 전체(100dvh)를 채우는 메인 사진 또는 상단 대형 사진 배치 |
| FR-1.2 | 신랑·신부 이름, 예식 날짜, 장소명을 오버레이 또는 하단에 표시 |
| FR-1.3 | "SAVE THE DATE" 등 영문 레터링(장식 텍스트) 옵션 |
| FR-1.4 | 진입 시 부드러운 페이드인 애니메이션 |
| FR-1.5 | 스크롤 유도 인디케이터(화살표/텍스트) 표시 |

### FR-2. 초대 문구 (Invitation)
| ID | 요구사항 |
|---|---|
| FR-2.1 | 초대 인사말 본문 표시 (여러 줄, 설정 파일에서 줄바꿈 유지) |
| FR-2.2 | 양가 혼주 정보 표시: `아버지 · 어머니 의 장남/장녀 이름` 형식 |
| FR-2.3 | 고인 표기 지원 — 텍스트(故) 대신 이름 앞에 작은 꽃 아이콘(SVG) 표시, 설정 파일 플래그로 처리 |
| FR-2.4 | 스크롤 진입 시 페이드업 애니메이션 |

### FR-3. 날짜 / 장소 (Date & Venue)
| ID | 요구사항 |
|---|---|
| FR-3.1 | 예식 일시 표시 (예: 2026년 10월 24일 토요일 오후 1시) |
| FR-3.2 | 해당 월 미니 달력 렌더링, 예식일 하이라이트 |
| FR-3.3 | D-Day 카운트다운 (일/시/분/초, 클라이언트에서 1초 간격 갱신) |
| FR-3.4 | 예식장 이름, 층/홀 정보 표시 |

### FR-4. 갤러리 (Gallery)
| ID | 요구사항 |
|---|---|
| FR-4.1 | 썸네일 그리드 표시 (2~3열, 설정 파일에서 이미지 목록 관리) |
| FR-4.2 | 썸네일 탭 시 모달(라이트박스) 확대 보기 |
| FR-4.3 | 모달 내 좌우 스와이프/버튼으로 이전·다음 이미지 이동 |
| FR-4.4 | 모달 표시 중 배경 스크롤 잠금, 닫기 버튼 및 배경 탭으로 닫기 |
| FR-4.5 | `next/image` 사용 — 지연 로딩, 최적화 포맷 자동 적용 |
| FR-4.6 | (옵션) 이미지 우클릭/롱프레스 저장 방지 |

### FR-5. 지도 + 길찾기 (Location)
| ID | 요구사항 |
|---|---|
| FR-5.1 | 예식장 위치 지도 표시 (카카오맵 JS SDK 또는 정적 지도 이미지) |
| FR-5.2 | 길찾기 버튼 3종: 카카오맵 / 네이버지도 / 티맵 딥링크 |
| FR-5.3 | 주소 텍스트 + "주소 복사" 버튼 (클립보드 복사 + 토스트) |
| FR-5.4 | 대중교통/자가용/주차 안내 텍스트 표시 (설정 파일 관리) |

### FR-6. 계좌 안내 (Accounts)
| ID | 요구사항 |
|---|---|
| FR-6.1 | 신랑측/신부측 아코디언(접기/펼치기) 그룹 |
| FR-6.2 | 각 계좌: 은행명, 계좌번호, 예금주 표시 |
| FR-6.3 | "복사" 버튼 원터치 → `navigator.clipboard` 복사 |
| FR-6.4 | 복사 성공 시 토스트 알림 ("계좌번호가 복사되었습니다") |
| FR-6.5 | 클립보드 API 미지원(구형 인앱 브라우저) 시 fallback 처리 |
| FR-6.6 | (옵션) 카카오페이 송금 링크 버튼 |

### FR-7. 연락하기 (Contact)
| ID | 요구사항 |
|---|---|
| FR-7.1 | 신랑/신부/양가 혼주 연락처 목록 |
| FR-7.2 | 전화 버튼 → `tel:` 링크, 문자 버튼 → `sms:` 링크 |
| FR-7.3 | 인물별 아이콘 버튼 UI, 이름/역할 라벨 표시 |

### FR-8. 카카오톡 공유 / OG 메타 (Share & Footer)
| ID | 요구사항 |
|---|---|
| FR-8.1 | OG 메타태그: 제목, 설명, 썸네일 이미지(800×400 권장), URL — Next.js Metadata API로 설정 |
| FR-8.2 | "카카오톡 공유하기" 버튼 → Kakao JS SDK `Kakao.Share.sendDefault` |
| FR-8.3 | "링크 복사하기" 버튼 → 클립보드 복사 + 토스트 |
| FR-8.4 | 푸터: 감사 문구, 신랑·신부 이름, (옵션) 저작권 표기 |

---

## 3. 비기능적 요구사항 (Non-Functional Requirements)

### NFR-1. 성능
- Lighthouse 모바일 Performance **90점 이상** 목표
- LCP 2.5초 이내 — Hero 이미지 `priority` 로딩, 나머지 lazy
- 갤러리 원본 이미지는 `next/image`로 자동 리사이징/WebP 변환
- 초기 JS 번들 최소화 — 지도 SDK, Kakao SDK는 해당 섹션에서 lazy load

### NFR-2. 호환성
- 카카오톡 인앱 브라우저에서 완전 동작 (클립보드/딥링크 fallback 포함)
- iOS Safari 15+, Android Chrome 최신 2개 버전
- `100dvh` 사용 (iOS 주소창 대응), 미지원 브라우저는 `100vh` fallback

### NFR-3. 반응형 / 레이아웃
- 기준 뷰포트 375px, 콘텐츠 최대 폭 **max-w-[430px]** 중앙 정렬
- 데스크톱에서는 배경색 위 모바일 프레임 형태로 표시

### NFR-4. 접근성
- 모든 이미지 `alt`, 버튼 `aria-label` 제공
- 모달: 포커스 트랩, `Esc` 닫기, `role="dialog"`
- 텍스트 대비 WCAG AA 이상

### NFR-5. 유지보수성
- **모든 콘텐츠는 `src/config/wedding.ts` 단일 파일에서 관리** (타입 안전)
- 섹션 = 독립 컴포넌트 1개, props 없이 config를 직접 import (또는 섹션별 props 주입)
- 환경 변수: Kakao JS 키 등 민감값은 `.env.local` (`NEXT_PUBLIC_KAKAO_JS_KEY`)

### NFR-6. 보안 / 프라이버시
- 검색엔진 비노출: `robots: noindex` 메타 설정 (지인 공유 전용)
- 계좌번호 등 민감 정보는 정적 텍스트로만 존재, 외부 전송 없음
- Kakao 키는 도메인 제한 설정 (Kakao Developers 플랫폼 등록)

### NFR-7. 배포
- Vercel 자동 배포 (main 브랜치 push → 배포)
- 커스텀 도메인 연결 및 HTTPS 자동 적용
- OG 이미지는 절대 URL로 제공 (`metadataBase` 설정)

---

## 4. 디자인 가이드 (깔끔 + 따뜻한 감성)

### 4.1 컬러 팔레트
> toourguest.com/preview/martinique 실제 렌더링 색상(computed style) 추출 기준

| 용도 | 값 | 설명 |
|---|---|---|
| 배경 | `#DDE6CC` | 소프트 세이지 그린 |
| 서브 배경 | `#EBF1E0` | 섹션 구분용 라이트 민트 |
| 본문 텍스트 | `#555555` | 웜 그레이 |
| 보조 텍스트 | `#999999` | 소프트 그레이 |
| 포인트 | `#A0B575` | 올리브 그린 |
| 포인트(진한) | `#7C8A60` | 딥 모스 그린 — 호버/강조용 |
| 라인/보더 | `#C9D5AF` | 은은한 세이지 라인 |

### 4.2 타이포그래피
- 한글 본문/제목: **명조 계열** — Nanum Myeongjo, Gowun Batang (next/font/google)
- 영문 장식(SAVE THE DATE 등): 세리프 이탤릭 — Cormorant Garamond, Playfair Display
- 본문 15~16px, 행간 1.8~2.0, 자간 약간 넓게(`tracking-wide`)

### 4.3 레이아웃 & 무드
- 섹션 간 여백 크게 (`py-20` 내외), 요소 밀도 낮게
- 섹션 타이틀 패턴: 작은 영문 라벨(예: GALLERY) + 한글 제목 + 짧은 구분선
- 사진 모서리 살짝 라운드(`rounded-lg`), 그림자 최소화
- 스크롤 진입 애니메이션: IntersectionObserver 기반 fade-up (0.6~0.8s, ease-out) — 라이브러리 없이 커스텀 훅 구현
- 장식 요소: 얇은 라인, 작은 꽃/잎 SVG 포인트 정도로 절제

---

## 5. 프로젝트 설계

### 5.1 기술 스택
| 영역 | 선택 | 비고 |
|---|---|---|
| 프레임워크 | Next.js 14+ (App Router) | 정적 렌더링 위주 |
| 언어 | TypeScript (strict) | |
| 스타일 | Tailwind CSS | 커스텀 테마 토큰 정의 |
| 이미지 | next/image | 갤러리/Hero 최적화 |
| 지도 | Kakao Maps JS SDK | Script lazy load |
| 공유 | Kakao JS SDK (Share) | |
| 배포 | Vercel | |
| 상태 | React state + 커스텀 훅 | 전역 상태 라이브러리 불필요 |

### 5.2 디렉터리 구조
```
wedding-invitation/
├── public/
│   └── images/
│       ├── hero.jpg
│       ├── og-thumbnail.jpg        # 800×400
│       └── gallery/                # 01.jpg ~ NN.jpg
├── src/
│   ├── app/
│   │   ├── layout.tsx              # 폰트, 메타데이터(OG), 전역 레이아웃
│   │   ├── page.tsx                # 8개 섹션 조립
│   │   └── globals.css
│   ├── config/
│   │   └── wedding.ts              # ★ 모든 청첩장 데이터
│   ├── components/
│   │   ├── sections/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── InvitationSection.tsx
│   │   │   ├── DateVenueSection.tsx
│   │   │   ├── GallerySection.tsx
│   │   │   ├── LocationSection.tsx
│   │   │   ├── AccountSection.tsx
│   │   │   ├── ContactSection.tsx
│   │   │   └── ShareFooterSection.tsx
│   │   └── ui/
│   │       ├── SectionTitle.tsx    # 영문 라벨 + 한글 제목 공통
│   │       ├── FadeIn.tsx          # 스크롤 진입 애니메이션 래퍼
│   │       ├── Modal.tsx           # 갤러리 라이트박스 베이스
│   │       ├── Accordion.tsx       # 계좌 그룹 접기/펼치기
│   │       └── Toast.tsx           # 전역 토스트 (Provider + useToast)
│   ├── hooks/
│   │   ├── useInView.ts            # IntersectionObserver
│   │   ├── useCountdown.ts         # D-Day
│   │   └── useClipboard.ts         # 복사 + fallback
│   └── lib/
│       ├── kakao.ts                # SDK 로더 (지도/공유 공용)
│       └── date.ts                 # 날짜 포맷/달력 유틸
├── .env.local                      # NEXT_PUBLIC_KAKAO_JS_KEY
├── tailwind.config.ts
└── next.config.js
```

### 5.3 설정 파일 스키마 — `src/config/wedding.ts`
```ts
export const weddingConfig = {
  meta: {
    title: '이재훈 ♥ 김다인 결혼합니다',
    description: '2026년 11월 28일 토요일 오후 4시 10분',
    ogImage: '/images/og-thumbnail.jpg',   // 800×400
    url: 'https://our-wedding.vercel.app', // 배포 후 실제 도메인
    noIndex: true,
  },

  couple: {
    groom: {
      name: '이재훈',
      nameEn: 'Jaehoon',
      order: '차남',                 // 누나 1명 있음 (형제 중 둘째)
      father: {
        name: '이주형',
        deceased: true,             // 故 표기 → 이름 앞 꽃 아이콘 렌더링
        account: { bank: '은행명', number: '000000-00-000000', holder: '박미경' }, // TODO: 계좌번호
      },
      mother: {
        name: '박미경',
        deceased: false,
        account: { bank: '은행명', number: '000000-00-000000', holder: '박미경' }, // TODO: 계좌번호
      },
      phone: '010-0000-0000',        // TODO
      account: { bank: '은행명', number: '000000-00-000000', holder: '이재훈' }, // TODO
      // (옵션) kakaopayLink: 'https://qr.kakaopay.com/...',
    },
    bride: {
      name: '김다인',
      nameEn: 'Dain',
      order: '차녀',                 // 오빠 1명 있음 (형제 중 둘째)
      father: {
        name: '김두현',
        deceased: false,
        account: { bank: '은행명', number: '000000-00-000000', holder: '김두현' }, // TODO: 계좌번호
      },
      mother: {
        name: '김하연',
        deceased: false,
        account: { bank: '은행명', number: '000000-00-000000', holder: '김하연' }, // TODO: 계좌번호
      },
      phone: '010-0000-0000',        // TODO
      account: { bank: '은행명', number: '000000-00-000000', holder: '김다인' }, // TODO
    },
  },

  event: {
    // ISO 8601 + KST 오프셋 — 카운트다운/달력의 단일 기준
    datetime: '2026-11-28T16:10:00+09:00',
    displayDate: '2026년 11월 28일 토요일',
    displayTime: '오후 4시 10분',
    venue: {
      name: '더뉴컨벤션웨딩',
      hall: '5층',
      address: '서울 강서구 공항대로36길 57',
      lat: 0,                       // TODO: 카카오맵에서 좌표 조회
      lng: 0,                       // TODO: 카카오맵에서 좌표 조회
      kakaoPlaceId: '',            // 카카오맵 장소 ID (딥링크용, 선택)
      transport: {
        subway: '5호선 발산역 7번 출구 도보 3분',
        bus: '',                    // TODO: 버스 노선 확인
        parking: 'B4~F1 총 720대 동시 주차 가능, 2시간 무료 (외부 주차장 여유 확보)',
      },
    },
  },

  invitation: {
    titleEn: 'INVITATION',
    title: '소중한 분들을 초대합니다',
    // 상단 성구 (본문 위에 작은 세리프체로 표시)
    verse: '그러므로 이제 둘이 아니요 한 몸이니',
    verseRef: '마태복음 19:6',
    message: `하나님의 은혜 가운데 만나
서로를 향한 사랑을 키워온 두 사람이
이제 믿음 안에서 한 가정을 이루려 합니다.

하나님과 여러분 앞에서 맺는
저희의 서약 위에
귀한 걸음으로 축복해 주시면
더없는 기쁨으로 간직하겠습니다.`,
  },

  gallery: {
    // public/images/gallery/ 기준 경로
    images: [
      { src: '/images/gallery/01.jpg', alt: '웨딩 촬영 사진 1' },
      { src: '/images/gallery/02.jpg', alt: '웨딩 촬영 사진 2' },
      // ...
    ],
    columns: 3,
    preventDownload: true,
  },

  share: {
    kakaoTitle: '이재훈 ♥ 김다인 결혼합니다',
    kakaoDescription: '11월 28일 토요일 오후 4시 10분 | OO웨딩홀 5층',
    kakaoImage: 'https://our-wedding.vercel.app/images/og-thumbnail.jpg', // 절대 URL
    kakaoButtonText: '청첩장 보기',
  },

  footer: {
    thanksMessage: '하나님의 사랑 안에서 시작하는 저희 두 사람의 첫걸음에 함께해 주셔서 감사합니다.',
  },
} as const;

export type WeddingConfig = typeof weddingConfig;
```

### 5.4 공통 컴포넌트 설계 포인트
- **Toast**: Context Provider(`ToastProvider`)를 `layout.tsx`에 배치, `useToast()`로 어디서든 호출. 하단 고정, 2초 후 자동 소멸, 연속 호출 시 교체.
- **useClipboard**: `navigator.clipboard.writeText` 시도 → 실패 시 임시 `textarea` + `document.execCommand('copy')` fallback (카카오톡 인앱 대응). 반환값으로 성공 여부 → 토스트 연동.
- **FadeIn**: `useInView` 훅으로 뷰포트 진입 감지 → `opacity-0 translate-y-4` → `opacity-100 translate-y-0` 트랜지션. `once: true`.
- **kakao.ts**: SDK 스크립트를 1회만 주입하는 싱글턴 로더. 지도는 `services` 없이 기본, 공유는 `Kakao.init` 후 사용.

### 5.5 개발 단계 (마일스톤)
| 단계 | 내용 | 산출물 |
|---|---|---|
| M0 | 프로젝트 셋업: Next.js + TS + Tailwind, 테마 토큰, 폰트, config 파일, 공통 UI(Toast/FadeIn/SectionTitle) | 빈 8섹션 스켈레톤 |
| M1 | Hero + Invitation | FR-1, FR-2 |
| M2 | DateVenue (달력 + 카운트다운) | FR-3 |
| M3 | Gallery (그리드 + 모달) | FR-4 |
| M4 | Location (지도 + 길찾기 + 주소복사) | FR-5 |
| M5 | Account (아코디언 + 복사 + 토스트) | FR-6 |
| M6 | Contact | FR-7 |
| M7 | OG 메타 + 카카오 공유 + 푸터 | FR-8 |
| M8 | QA: 인앱 브라우저 테스트, Lighthouse, 실기기 확인 → Vercel 배포 | 릴리즈 |

---

## 6. 섹션별 개발 프롬프트

> 각 프롬프트는 독립 실행 가능하도록 작성. 순서대로 진행하되, **P0을 먼저 실행**해 공통 기반을 만든 뒤 P1~P8을 진행할 것.

### P0. 프로젝트 셋업 (공통 기반)
```
Next.js 14 App Router + TypeScript(strict) + Tailwind CSS로 모바일 청첩장 프로젝트를 셋업해줘.

요구사항:
1. src/ 디렉터리 구조 사용. 다음 폴더 생성: config, components/sections, components/ui, hooks, lib
2. src/config/wedding.ts 생성 — [기획서 5.3의 스키마 전체를 붙여넣기] 구조로 작성하고 as const + 타입 export.
3. tailwind.config.ts에 커스텀 테마 추가:
   - colors: ivory(#DDE6CC), cream(#EBF1E0), brown(#555555), taupe(#999999), accent(#A0B575), accentDark(#7C8A60), line(#C9D5AF)
4. layout.tsx: next/font/google로 Gowun_Batang(한글)과 Cormorant_Garamond(영문) 로드, CSS 변수로 등록.
   body는 bg-ivory text-brown, 콘텐츠는 mx-auto max-w-[430px] bg-ivory min-h-dvh로 감싸기.
   데스크톱(min-width 431px)에서는 바깥 배경을 cream으로 하고 좌우 얇은 그림자로 모바일 프레임 느낌.
5. 공통 UI 3종 구현:
   - components/ui/FadeIn.tsx: IntersectionObserver 커스텀 훅(hooks/useInView.ts) 기반.
     뷰포트 20% 진입 시 opacity-0 translate-y-4 → opacity-100 translate-y-0 (duration-700 ease-out), 1회만 실행.
   - components/ui/SectionTitle.tsx: props { labelEn: string; title?: string }.
     영문 라벨(세리프, tracking-[0.3em], text-accent, 작게) + 한글 제목(명조, text-xl) + 가운데 24px 세로 라인.
   - components/ui/Toast.tsx + ToastProvider + useToast 훅: 화면 하단 고정, 반투명 다크 배경 pill 형태,
     2초 후 자동 소멸, 연속 호출 시 메시지 교체. layout.tsx에 Provider 배치.
6. hooks/useClipboard.ts: navigator.clipboard.writeText 시도, 실패 시 textarea + execCommand fallback.
   async copy(text): Promise<boolean> 반환.
7. app/page.tsx: 8개 섹션 컴포넌트를 placeholder(<section> + 섹션명 텍스트)로 순서대로 배치:
   Hero → Invitation → DateVenue → Gallery → Location → Account → Contact → ShareFooter
8. .env.local.example에 NEXT_PUBLIC_KAKAO_JS_KEY= 추가.

모든 컴포넌트는 config를 직접 import해서 사용. 빌드 에러 없이 npm run dev 가능한 상태로 완성해줘.
```

### P1. Hero 섹션
```
components/sections/HeroSection.tsx를 구현해줘. weddingConfig에서 데이터를 가져와 사용.

요구사항:
1. 높이 100dvh(fallback 100vh)의 풀스크린 섹션.
2. next/image로 /images/hero.jpg를 fill + object-cover + priority 로딩. 하단에 어두운 그라데이션 오버레이.
3. 콘텐츠(하단 정렬, 흰색 텍스트):
   - 상단 작은 세리프 영문: "SAVE THE DATE" (tracking 넓게)
   - 신랑 nameEn · 신부 nameEn (영문 세리프, 큰 사이즈)
   - 한 줄: displayDate | venue.name
4. 페이지 로드 시 텍스트가 순차적으로 페이드인 (CSS animation, 각 150ms 딜레이).
5. 최하단 중앙에 스크롤 유도: 얇은 세로선 + 아래 화살표가 부드럽게 bounce.
6. 이미지 alt는 "신랑 신부 메인 웨딩 사진".
```

### P2. 초대 문구 섹션
```
components/sections/InvitationSection.tsx를 구현해줘.

요구사항:
1. bg-ivory, py-20, FadeIn 래퍼 적용.
2. SectionTitle: labelEn="INVITATION", title=config.invitation.title.
3. 본문 위에 성구 영역: config.invitation.verse를 세리프 이탤릭 느낌의 작은 글씨로,
   그 아래 verseRef("마태복음 19:6")를 text-taupe 더 작은 글씨로 가운데 표시. verse가 없으면 렌더 생략.
4. 본문 config.invitation.message를 whitespace-pre-line으로 줄바꿈 유지, 가운데 정렬,
   text-[15px] leading-loose text-brown/90.
5. 본문 아래 얇은 가로 구분선(w-8, bg-line) 후 혼주 정보 2줄:
   - "[꽃아이콘]이주형 · 박미경 의 차남 재훈" / "김두현 · 김하연 의 차녀 다인" 형식
   - deceased가 true인 혼주는 이름 앞에 "故" 텍스트 대신 작은 꽃 모양 아이콘(인라인 SVG, 한 송이 라인 드로잉,
     accent 컬러 `#A0B575` 채움, width 12~14px) 표시 — toourguest.com/preview/martinique 스타일 참조
   - 이름 부분은 살짝 크고 진하게, 나머지는 text-taupe
6. 혼주 표기 로직은 config의 couple 데이터에서 계산하는 헬퍼 함수로 분리 (lib/format.ts).
```

### P3. 날짜/장소 섹션 (달력 + D-Day)
```
components/sections/DateVenueSection.tsx를 구현해줘.

요구사항:
1. bg-cream, py-20, SectionTitle: labelEn="WEDDING DAY".
2. 상단에 displayDate + displayTime, venue.name + venue.hall 표시.
3. 미니 달력: lib/date.ts에 config.event.datetime 기준으로 해당 월의 주 단위 2차원 배열을 만드는
   getCalendarMatrix(date) 유틸 작성. 일~토 헤더(일요일 빨간 계열, 토요일 파란 계열은 은은한 톤으로),
   예식일은 bg-accent text-white rounded-full로 하이라이트. 라이브러리 사용 금지, 순수 구현.
4. D-Day 카운트다운: hooks/useCountdown.ts — 목표 시각까지 남은 일/시/분/초를 1초마다 갱신.
   SSR 하이드레이션 불일치가 없도록 mounted 이후에만 숫자 렌더 (그 전엔 자리 유지용 placeholder).
   4개 박스(일/시/분/초) 가로 배치, 숫자는 세리프 큰 글씨.
5. 카운트다운 아래 한 줄: "재훈 ♥ 다인의 결혼식이 N일 남았습니다." (당일이면 "오늘입니다", 지났으면 감사 문구).
6. 클라이언트 컴포넌트는 카운트다운 부분만 분리("use client")하고 나머지는 서버 컴포넌트 유지.
```

### P4. 갤러리 섹션 (그리드 + 모달)
```
components/sections/GallerySection.tsx와 components/ui/Modal.tsx를 구현해줘.

요구사항:
1. SectionTitle: labelEn="GALLERY", title="우리의 순간들". bg-ivory, py-20.
2. config.gallery.images를 config.gallery.columns 열 그리드로 표시. gap-1.5, 각 셀 aspect-square,
   next/image fill + object-cover, sizes 속성 적절히 지정, rounded-sm.
3. 썸네일 탭 → 라이트박스 모달:
   - 전체 화면 딤 배경(bg-black/90), 중앙에 현재 이미지(object-contain, 최대 화면 크기)
   - 좌우 화살표 버튼 + 터치 스와이프(touchstart/touchend 델타 50px 이상)로 이전/다음
   - 하단에 "3 / 12" 형태 인덱스 표시
   - 우상단 닫기(X) 버튼, 배경 탭 시 닫기, Esc 키 닫기
   - 모달 오픈 시 body 스크롤 잠금(overflow hidden), 닫으면 복원
   - role="dialog" aria-modal="true", 열릴 때 닫기 버튼에 포커스
4. config.gallery.preventDownload가 true면 이미지에 onContextMenu preventDefault +
   CSS로 -webkit-touch-callout: none, user-select: none 적용.
5. 모달 이미지 전환 시 살짝 페이드 트랜지션.
```

### P5. 지도 + 길찾기 섹션
```
components/sections/LocationSection.tsx와 lib/kakao.ts를 구현해줘.

요구사항:
1. SectionTitle: labelEn="LOCATION", title="오시는 길". bg-cream, py-20.
2. venue.name, hall, address 표시. 주소 옆 "복사" 텍스트 버튼 → useClipboard로 복사 후
   토스트 "주소가 복사되었습니다".
3. lib/kakao.ts: 카카오 SDK 스크립트를 중복 없이 로드하는 loadKakaoMapScript() 구현
   (https://dapi.kakao.com/v2/maps/sdk.js?appkey=...&autoload=false).
   NEXT_PUBLIC_KAKAO_JS_KEY 환경변수 사용.
4. 지도 영역(aspect-[4/3], rounded-lg overflow-hidden):
   IntersectionObserver로 섹션이 뷰포트에 접근할 때 SDK 로드 → kakao.maps.Map 생성,
   venue.lat/lng 중심, 커스텀 마커 1개, 드래그/줌 비활성화(draggable false, 스크롤 줌 off),
   지도 탭 시 카카오맵 앱/웹으로 이동.
5. 길찾기 버튼 3개 (가로 균등, 아이콘 + 텍스트):
   - 카카오맵: https://map.kakao.com/link/to/{장소명},{lat},{lng}
   - 네이버지도: nmap://route/public?dlat={lat}&dlng={lng}&dname={인코딩된 장소명}
     → 앱 미설치 대비 웹 fallback: https://map.naver.com/p/search/{인코딩된 주소}
     (nmap 스킴 시도 후 1.5초 내 이동 없으면 웹 URL로 이동하는 방식)
   - 티맵: tmap://route?goalname={인코딩}&goalx={lng}&goaly={lat} (미설치 시 안내 토스트)
6. 하단 안내: 지하철/버스/주차 정보를 아이콘 + 라벨 + 설명 리스트로 표시 (config.transport).
```

### P6. 계좌 안내 섹션
```
components/sections/AccountSection.tsx와 components/ui/Accordion.tsx를 구현해줘.

요구사항:
1. SectionTitle: labelEn="ACCOUNT", title="마음 전하실 곳". bg-ivory, py-20.
2. 안내 문구 한 줄: "참석이 어려우신 분들을 위해 계좌번호를 안내드립니다." (text-taupe, 작게)
3. Accordion 컴포넌트: props { title, children }. 헤더 탭 시 부드럽게 펼침/접힘
   (grid-rows [0fr→1fr] 트릭 또는 max-height 트랜지션), 화살표 아이콘 회전.
4. "신랑측 계좌번호" / "신부측 계좌번호" 아코디언 2개. config에서 계좌가 정의된 인물만 수집해
   (신랑/신부 본인 + 혼주 중 account 필드가 있는 사람) 각 그룹에 렌더.
5. 각 계좌 행: 은행명 + 계좌번호 + 예금주 (2줄 구성) / 우측에 "복사" 버튼(bordered pill).
   복사 버튼 → useClipboard로 "은행명 계좌번호" 복사 → 토스트 "계좌번호가 복사되었습니다".
6. kakaopayLink가 있으면 노란 카카오페이 송금 버튼 추가 (새 탭).
7. 계좌 데이터 수집 로직은 lib/format.ts의 헬퍼로 분리해 타입 안전하게 작성.
```

### P7. 연락하기 섹션
```
components/sections/ContactSection.tsx를 구현해줘.

요구사항:
1. SectionTitle: labelEn="CONTACT", title="연락하기". bg-cream, py-20.
2. 신랑/신부 카드 2개(좌우 배치): 역할 라벨("신랑"/"신부") + 이름 + 전화/문자 원형 아이콘 버튼 2개.
   - 전화: <a href="tel:01000000000">, 문자: <a href="sms:01000000000">
   - 전화번호는 config의 하이픈 포함 문자열에서 하이픈 제거 후 사용
3. 아래에 "혼주에게 연락하기" 소제목 후 양가 혼주 중 phone이 있는 사람만
   같은 패턴(관계 라벨: 신랑 아버지 등 + 이름 + 전화/문자 버튼)으로 표시.
4. 아이콘은 인라인 SVG(전화기, 말풍선), 버튼 aria-label="OOO에게 전화하기" 형식으로 지정.
5. 혼주 관계 라벨 생성도 lib/format.ts 헬퍼로 처리.
```

### P8. OG 메타 + 카카오 공유 + 푸터
```
app/layout.tsx의 메타데이터와 components/sections/ShareFooterSection.tsx를 구현해줘.

요구사항:
1. layout.tsx에 Next.js Metadata API로 설정 (config.meta 사용):
   - metadataBase: new URL(config.meta.url)
   - title, description
   - openGraph: { title, description, images: [{ url: ogImage, width: 800, height: 400 }], type: 'website' }
   - twitter: { card: 'summary_large_image' }
   - robots: noIndex가 true면 { index: false, follow: false }
2. lib/kakao.ts에 loadKakaoShareScript() 추가:
   https://t1.kakaocdn.net/kakao_js_sdk/2.7.x/kakao.min.js 로드 후 Kakao.init(NEXT_PUBLIC_KAKAO_JS_KEY).
   이미 init 되어 있으면 skip.
3. ShareFooterSection ("use client"):
   - 버튼 1: "카카오톡으로 공유하기" (카카오 옐로 배경 + 말풍선 아이콘)
     → Kakao.Share.sendDefault({ objectType: 'feed',
        content: { title, description, imageUrl, link: { mobileWebUrl: url, webUrl: url } },
        buttons: [{ title: config.share.kakaoButtonText, link: {...} }] })
   - 버튼 2: "링크 복사하기" (보더 스타일) → useClipboard(config.meta.url) → 토스트 "청첩장 링크가 복사되었습니다"
   - SDK 로드 실패/키 미설정 시 공유 버튼 클릭하면 토스트로 안내
4. 푸터: config.footer.thanksMessage + 하단에 영문 세리프로 "Jaehoon & Dain" + 작은 하트,
   충분한 하단 여백(pb-16), text-taupe 톤.
5. 마지막으로 카카오톡 공유 썸네일이 반영되려면 배포 후 카카오 OG 캐시 초기화
   (https://developers.kakao.com/tool/debugger/sharing)가 필요하다는 주석을 코드에 남겨줘.
```

### P9. QA & 배포 체크리스트 프롬프트 (선택)
```
배포 전 점검을 도와줘. 다음 항목을 코드 기준으로 검증하고 문제를 수정해줘:
1. npm run build 무오류, 타입 에러 0
2. 모든 이미지 alt / 버튼 aria-label 존재 여부
3. 카운트다운 하이드레이션 경고 없음
4. config.meta.url, share.kakaoImage가 절대 URL인지
5. Lighthouse 모바일 기준 이미지 sizes 속성 / priority 설정 점검
6. 카카오톡 인앱 브라우저에서 clipboard fallback 경로가 동작하는 코드인지
7. .env.local 미설정 시에도 지도/공유 섹션이 크래시 없이 안내만 표시하는지
```

---

## 7. 사전 준비물 체크리스트

- [ ] Hero 사진 1장 (세로형 고해상도 권장)
- [ ] 갤러리 사진 8~20장 (긴 변 1600px 내외로 리사이즈 후 업로드)
- [ ] OG 썸네일 800×400 1장 (텍스트 포함 버전 권장)
- [ ] Kakao Developers 앱 생성 → JavaScript 키 발급 → 플랫폼(Web)에 도메인 등록 (localhost:3000 + 배포 도메인)
- [ ] 예식장 좌표(lat/lng) — 카카오맵에서 장소 검색 후 확인
- [ ] 계좌번호/연락처 최종 확인 (오타 시 치명적)
- [ ] 배포 후: 카카오 공유 디버거로 OG 캐시 갱신