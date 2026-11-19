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
    ogImage: "/og-thumbnail.jpg", // 1200x630, g7 사진 크롭
    url: "https://jae-din.cd8025.workers.dev",
    noIndex: true,
  },

  couple: {
    groom: {
      name: "이재훈",
      nameEn: "Jaehoon",
      order: "아들", // 누나 1명 있음 (형제 중 둘째)
      phone: "010-6299-8984",
      father: {
        name: "이주형",
        deceased: true, // 이름 앞 꽃 아이콘 렌더링
      } as Person,
      mother: {
        name: "박경미",
        deceased: false,
        account: { bank: "신한은행", number: "110-047-666112", holder: "박경미" },
      } as Person,
      account: { bank: "국민은행", number: "044202-04-215912", holder: "이재훈" },
      // (옵션) kakaopayLink: 'https://qr.kakaopay.com/...',
    },
    bride: {
      name: "김다인",
      nameEn: "Dain",
      order: "딸", // 오빠 1명 있음 (형제 중 둘째)
      phone: "010-2530-1122",
      father: {
        name: "김두현",
        deceased: false,
        account: { bank: "우리은행", number: "1002-584-000170", holder: "김두현" },
      } as Person,
      mother: {
        name: "김하연",
        deceased: false,
        account: { bank: "우리은행", number: "1002-159-518429", holder: "김하연" },
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
      hall: "5층 제니스홀",
      address: "서울 강서구 공항대로36길 57",
      lat: 37.5563586,
      lng: 126.8369448,
      transport: {
        // 자차: 내비 검색어 + 주차 상세(라벨 | 내용 행)
        car: {
          navi: "‘더뉴컨벤션웨딩’ 또는 ‘공항대로36길 57’ 검색",
          parking: [
            { label: "주차 위치", value: "더뉴컨벤션웨딩 건물 B4 ~ B1 주차장" },
            { label: "주차 요금", value: "2시간 무료\n이후 30분당 2,000원" },
            { label: "참고", value: "먼저 웨딩홀 주차장으로 오시면\n만차 시 이대서울병원으로 주차 안내해드립니다.\n이대서울병원 주차도 요금은 동일합니다." },
          ],
          // 방면별 경로 (예식장 안내 이미지 기준)
          routes: [
            {
              label: "분당 방면",
              value: "외곽순환도로(김포공항 방향) › 김포공항 정문에서 좌회전 › 시내 쪽으로 직진",
            },
            {
              label: "강남, 지방(영동) 방면",
              value: "올림픽대로 › 발산역 지나 직진 › 발산 사거리에서 우회전 후 우측",
            },
            {
              label: "인천 방면",
              value:
                "경인고속도로 › 신월IC(김포동 방향) › 발산역 이정표에서 우회전 › 발산 사거리에서 우회전 후 우측",
            },
            {
              label: "일산 방면",
              value:
                "경부고속도로 › 서울(한남대교 진입) › 올림픽대로(김포공항 방면) › 가양대교 사거리(발산 램프 방향) › 발산 램프 2번째 사거리 지나 우측\n(서부간선도로 끝 지점 성산대교 건너지 말고 P턴하면 공항로)",
            },
            {
              label: "남부순환로 방면",
              value: "남부순환로 › 김포공항 이정표 › 발산 사거리 우회전 후 우측",
            },
          ],
        },
        // 대중교통: 비어 있는 항목은 화면에서 숨김
        subway: ["5호선 발산역 7번 출구 도보 2분"],
        // 지하철 아래 옅은 글씨로 표시되는 도보 안내
        subwayWalk: [
          "7번 출구로 나오시자마자 계속 직진하시면 메가커피가 있습니다.",
          "메가커피에서 오른쪽으로 꺾으시면 웨딩홀이 보입니다.",
        ],
        // 버스: 발산역 하차
        bus: [
          { label: "지선(초록)", value: "4번 출구 6630, 6712\n9번 출구 6632, 6645, 6648, 6712" },
          { label: "간선(파랑)", value: "5번 출구 661\n중앙차로 601, 605, 654, 6633" },
          { label: "경기버스", value: "60, 60-3" },
          { label: "광역버스", value: "3000, 3000-1" },
          { label: "공항버스", value: "6003" },
          { label: "마을버스", value: "강서05, 강서06" },
        ],
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
    kakaoDescription: "11월 28일 토요일 오후 4시 10분 | 더뉴컨벤션웨딩 5층 제니스홀",
    kakaoButtonText: "청첩장 보기",
  },

  footer: {
    thanksMessage: "하나님의 사랑 안에서 시작하는 저희 두 사람의 첫걸음에 함께해 주셔서 감사합니다.",
  },
} as const;

export type WeddingConfig = typeof weddingConfig;
