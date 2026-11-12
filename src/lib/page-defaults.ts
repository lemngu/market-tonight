import { sectionCopy, updateProgramCopy } from './section-copy'
import { festivalArtwork } from './festival-artwork'
const basePageDefaults = {
  "routePage": {
    "eyebrow": "GUWOL MORAENAE / TASTE ROUTES",
    "title": "취향 따라 고르고,\n골목 따라 걷고.",
    "description": "테마와 메뉴를 선택해 구월모래내시장의 맛을 만나보세요."
  },
  "festivalPage": {
    "eyebrow": "MARKET TONIGHT / 2026.11.13 FRI",
    "title": "시장이 켜지는 금요일.\nMarket Tonight",
    "description": "음악과 사람, 먹거리가 만나는 구월모래내시장의 하루.",
    "date": "2026.11.13. 금요일",
    "schedule": "14:00–21:00",
    "location": "구월모래내시장 일대",
    "timetableTitle": "한눈에 보는 시간표",
    "timetable": {
      "url": "/assets/event/timetable.svg",
      "alt": "11월 13일 행사 시간표",
      "width": 2333,
      "height": 1391
    },
    "programTitle": "오늘의 프로그램",
    "programs": [
      {
        "time": "14:00–21:00",
        "title": "아트플리마켓",
        "place": "구월모래내시장",
        "color": "yellow" as const,
        "description": "시장 산책과 함께 만나는 아트플리마켓."
      },
      {
        "time": "14:00–21:00",
        "title": "스쿨뮤직 팝업",
        "place": "서문 일원",
        "color": "blue" as const,
        "description": "음악과 함께 즐기는 마켓 팝업."
      },
      {
        "time": "16:00–17:30",
        "title": "말왕 토크쇼 & 사인회",
        "place": "서문 일원",
        "color": "orange" as const,
        "description": "토크쇼와 사인회 프로그램."
      },
      {
        "time": "17:30–21:00",
        "title": "스쿨뮤직 버스킹",
        "place": "서문 일원",
        "color": "blue" as const,
        "description": "저녁 골목을 채우는 라이브 버스킹."
      },
      {
        "time": "17:00–21:00",
        "title": "DJ RAVE & Doodle 테이블",
        "place": "구월시장 포차거리",
        "color": "olive" as const,
        "description": "음악과 드로잉으로 즐기는 시장의 밤."
      }
    ],
    "linkedTitle": "쌀 할인 판매 행사",
    "linkedSchedule": "2026.11.13.(금)–11.14.(토) · 양일간 진행",
    "linkedLocation": "모래내시장 중앙사거리",
    "note": "현장 사정에 따라 프로그램과 운영 시간이 변경될 수 있습니다."
  },
  "mapPage": {
    "eyebrow": "GUWOL MORAENAE / MARKET MAP",
    "title": "골목마다,\n새로운 발견.",
    "description": "미식루트와 행사 공간을 한눈에 볼 수 있는 시장 지도를 준비하고 있습니다.",
    "image": null,
    "placeholderTitle": "구월모래내시장 지도",
    "placeholderDescription": "지도가 완성되면 이곳에서 만나보세요.\n현재 배경과 표시는 디자인 확인용 예시입니다."
  }
}

export const pageDefaults = {
  routePage: { ...basePageDefaults.routePage, ...sectionCopy.routePage },
  festivalPage: { ...basePageDefaults.festivalPage, ...sectionCopy.festivalPage, timetable: festivalArtwork.overview, speakerImage: festivalArtwork.speaker, schoolTimetable: festivalArtwork.school, djTimetable: festivalArtwork.dj, linkedTitle: "전통시장 가는 날 · 쌀 할인 판매 행사", linkedDescription: "쌀 1포 구매 시 온누리상품권 1만 원권 1매 증정\n1인 최대 3포 구매 제한", linkedSchedule: "2026.11.13.(금)–11.14.(토)\n양일 13:00–17:00", linkedLocation: "골든벨리 & 수협 앞\n문화화장실 & 상인회 앞", linkedNote: "총 1,500포 판매 · 소진 시 조기 마감", programs: basePageDefaults.festivalPage.programs.map(updateProgramCopy) },
  mapPage: { ...basePageDefaults.mapPage, ...sectionCopy.mapPage, image: festivalArtwork.map },
}
