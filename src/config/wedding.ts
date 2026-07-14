/**
 * Single source of truth for every piece of invitation content.
 * Update names/dates/accounts/etc. here — components only read from this file.
 */

export interface Person {
  name: string;
  nameEn?: string;
  deceased?: boolean; // true → 이름 앞에 꽃 아이콘 표시 (故 표기 대체)
  phone?: string; // "010-1234-5678" — components strip hyphens for tel:/sms:
  account?: { bank: string; number: string; holder: string };
}

export const weddingConfig = {
  meta: {
    title: "이재훈 ♥ 김다인 결혼합니다",
    description: "2026년 11월 28일 토요일 오후 4시 10분. 저희 결혼식에 초대합니다.",
    ogImage: "/og-thumbnail.jpg", // 1200x630, g8 사진 크롭
    url: "https://jae-din.cd8025.workers.dev",
    noIndex: true,
  },

  couple: {
    groom: {
      name: "이재훈",
      nameEn: "Jaehoon",
      order: "차남", // 누나 1명 있음 (형제 중 둘째)
      phone: "010-6299-8984",
      father: {
        name: "이주형",
        deceased: true, // 이름 앞 꽃 아이콘 렌더링
      } as Person,
      mother: {
        name: "박경미",
        deceased: false,
        account: { bank: "은행명", number: "000000-00-000000", holder: "박경미" }, // TODO: 계좌번호
      } as Person,
      account: { bank: "은행명", number: "000000-00-000000", holder: "이재훈" }, // TODO
      // (옵션) kakaopayLink: 'https://qr.kakaopay.com/...',
    },
    bride: {
      name: "김다인",
      nameEn: "Dain",
      order: "차녀", // 오빠 1명 있음 (형제 중 둘째)
      phone: "010-2530-1122",
      father: {
        name: "김두현",
        deceased: false,
        account: { bank: "은행명", number: "000000-00-000000", holder: "김두현" }, // TODO: 계좌번호
      } as Person,
      mother: {
        name: "김하연",
        deceased: false,
        account: { bank: "은행명", number: "000000-00-000000", holder: "김하연" }, // TODO: 계좌번호
      } as Person,
      account: { bank: "국민은행", number: "444401-01-393737", holder: "김다인" },
    },
  },

  event: {
    // ISO 8601 + KST 오프셋 — 카운트다운/달력의 단일 기준
    datetime: "2026-11-28T16:10:00+09:00",
    displayDate: "2026년 11월 28일 토요일",
    displayTime: "오후 4시 10분",
    displayDateTimeEn: "Saturday, November 28, 2026 | PM 4:10",
    dateLabel: "2026. 11. 28 SAT PM 4:10",
    venue: {
      name: "더뉴컨벤션웨딩",
      hall: "5층",
      address: "서울 강서구 공항대로36길 57",
      lat: 37.5563586,
      lng: 126.8369448,
      transport: {
        subway: "5호선 발산역 7번 출구 도보 3분",
        bus: "", // TODO: 버스 노선 확인
        parking: "B4~F1 총 720대 동시 주차 가능, 2시간 무료 (외부 주차장 여유 확보)",
      },
    },
  },

  invitation: {
    labelEn: "INVITATION",
    title: "소중한 분들을 초대합니다",
    // 상단 성구 (본문 위에 작은 세리프체로 표시)
    verse: "그러므로 이제 둘이 아니요 한 몸이니",
    verseRef: "마태복음 19:6",
    message:
      "하나님의 은혜 가운데 만나\n서로를 향한 사랑을 키워온 두 사람이\n이제 믿음 안에서 한 가정을 이루려 합니다.\n\n하나님과 여러분 앞에서 맺는\n저희의 서약 위에\n귀한 걸음으로 축복해 주시면\n더없는 기쁨으로 간직하겠습니다.",
  },

  gallery: {
    columns: 3 as const,
    preventDownload: true,
  },

  share: {
    kakaoTitle: "이재훈 ♥ 김다인 결혼합니다",
    kakaoDescription: "11월 28일 토요일 오후 4시 10분 | 더뉴컨벤션웨딩 5층",
    kakaoButtonText: "청첩장 보기",
  },

  footer: {
    thanksMessage: "하나님의 사랑 안에서 시작하는 저희 두 사람의 첫걸음에 함께해 주셔서 감사합니다.",
  },
} as const;

export type WeddingConfig = typeof weddingConfig;
