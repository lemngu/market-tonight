import type { Content } from './content-schema'

export const sectionCopy = {
  menuTagline: '서로 다른 하루, 같은 저녁에서 만나다.',
  metaTitle: 'MARKET TONIGHT | 구월모래내시장 금요일 밤 축제',
  metaDescription: '음악과 예술, 먹거리와 사람이 어우러지는 특별한 금요일. 2026년 11월 13일, 구월모래내시장에서 MARKET TONIGHT를 만나보세요.',
  routesSection: {
    title: '취향 따라, 미식루트',
    description: '만 원의 든든한 한 끼부터 겨울 간식까지. 구월모래내 두 시장의 맛을 따라 걸어보세요.',
    browseLabel: '내 취향의 미식루트 찾기', selectedLabel: '지금 선택한 미식루트',
    countLabel: '참여 점포', countSuffix: '곳',
    preparingTitle: '맛길에 어울리는 점포를 준비하고 있어요.',
    advisory: '메뉴와 가격, 영업시간은 점포 사정에 따라 달라질 수 있습니다.',
  },
  festival: {
    heading: '시장이 무대가 되는 금요일 밤.', name: 'MARKET TONIGHT',
    highlights: '아트 플리마켓부터 말왕 토크쇼, 스쿨뮤직 버스킹과 DJ RAVE까지! 시장 골목을 가득 채우는 특별한 하루.',
    programHours: '스쿨뮤직 팝업 14:00–21:00 · 버스킹 17:30–21:00',
    note: '원하는 프로그램의 시간과 장소를 확인해 보세요.', detailLabel: '전체 프로그램 및 시간표 보기',
  },
  routePage: {
    title: '두 시장의 맛을 따라,\n다섯 가지 미식 산책.',
    description: '구월시장과 모래내시장의 숨은 맛을 찾아 떠나는 다섯 가지 테마 여행.',
    sectionTitle: '오늘은 어떤 맛길을 걸어볼까요?',
  },
  festivalPage: {
    title: '서로 다른 하루가,\n같은 저녁에서 만나는 곳.',
    description: '음악과 예술, 먹거리와 사람이 어우러지는 특별한 금요일. 구월모래내시장의 새로운 밤을 만나보세요.',
    timetableTitle: '놓치지 말아야 할 오늘의 타임테이블', programTitle: '골목마다 펼쳐지는 특별한 즐거움',
    linkedEyebrow: '시장에서 만나는 특별한 구매 혜택', linkedTitle: '강화 석모도 고시히까리쌀 할인 판매',
    linkedDescription: '고시히까리쌀 10kg, 39,000원! 구매 시 온누리상품권 1만 원권 증정.',
    linkedNote: '1인 최대 2포까지 구매 가능하며, 준비된 물량 소진 시 조기 종료됩니다.',
  },
  mapPage: {
    title: '구월과 모래내,\n두 시장을 잇는 특별한 산책.',
    description: '먹거리부터 공연과 체험까지! MARKET TONIGHT의 주요 장소를 지도에서 확인해 보세요.',
    preparingDescription: '먹거리부터 공연과 체험까지! MARKET TONIGHT의 주요 장소를 한눈에 볼 수 있는 지도를 준비하고 있습니다.',
    placeholderTitle: 'MARKET TONIGHT 축제 지도',
    placeholderDescription: '실제 행사 배치도를 준비하고 있습니다.\n현재 배경과 표시는 디자인 확인용 예시입니다.',
    routesDescription: '다섯 가지 테마를 따라 구월모래내시장의 숨은 맛집을 발견해 보세요.',
    eventDescription: '아트 플리마켓, 버스킹, DJ RAVE가 열리는 장소를 확인해 보세요.',
    routesLinkLabel: '내 취향의 미식루트 찾기', eventLinkLabel: '전체 프로그램 및 시간표 보기',
  },
  footer: { headingLine1: 'ABOUT US /', headingLine2: 'CONTACT', tagline: 'MARKET TONIGHT · 구월모래내시장' },
} as const

const routeIntroductions: Record<string, string> = {
  budget: '만원 한 장으로 즐기는 든든한 행복! 부담 없이 즐기는 1만 원 이하 가성비 맛집 코스.',
  'gluten-free': '쌀과 메밀 등 다양한 재료의 맛을 찾아보는 글루텐 프리 테마 코스. 메뉴의 재료·소스·조리환경은 방문 전 점포에 확인해주세요.',
  grill: '지글지글 불 위에서 완성되는 맛! 구월모래내시장의 대표 불맛을 찾아 떠나는 산책.',
  vegan: '시장 골목에서 발견하는 식물성 먹거리! 취향과 가성비를 함께 생각하는 비건 탐방. 메뉴의 재료·양념은 점포에 확인해주세요.',
  winter: '쌀쌀한 계절, 손끝까지 따뜻하게. 시장에서 만나는 달콤하고 따끈한 겨울 간식.',
}

export function updateProgramCopy(program: { time: string; title: string; place: string; color: 'yellow' | 'blue' | 'orange' | 'olive'; description: string }) {
  if (/아트\s*플리마켓/.test(program.title)) return { ...program, title: '아트 플리마켓', description: '40개 로컬 셀러와 함께하는 취향 발견! 책과 음반, 수공예품을 만나보세요.' }
  if (/스쿨뮤직.*팝업/.test(program.title)) return { ...program, description: '인천 로컬 브랜드 스쿨뮤직과 함께 악기를 직접 보고, 연주하고, 경험해 보세요.' }
  if (/말왕/.test(program.title)) return { ...program, title: '말왕 토크쇼·사인회', description: '크리에이터 말왕과 나누는 도전과 일상의 이야기! 현장 Q&A와 사인회까지 함께하세요.' }
  if (/스쿨뮤직.*버스킹/.test(program.title)) return { ...program, description: '인천 청년 아티스트들의 라이브 무대! 시장 골목을 음악으로 채우는 특별한 시간.' }
  if (/DJ\s*RAVE.*Doodle/i.test(program.title)) return { ...program, description: 'DJ 비트에 몸을 맡기고, 테이블 위에 자유롭게 그려보세요. 음악과 낙서가 예술이 되는 밤!' }
  return program
}

export function applySectionCopy(content: Content): Content {
  const next = structuredClone(content)
  next.site.menuTagline = sectionCopy.menuTagline
  next.site.metaTitle = sectionCopy.metaTitle
  next.site.metaDescription = sectionCopy.metaDescription
  next.site.routesSection = { ...next.site.routesSection, ...sectionCopy.routesSection }
  next.site.festival = { ...next.site.festival, ...sectionCopy.festival }
  next.site.routePage = { ...next.site.routePage, ...sectionCopy.routePage }
  next.site.festivalPage = { ...next.site.festivalPage, ...sectionCopy.festivalPage, programs: next.site.festivalPage.programs.map(updateProgramCopy) }
  next.site.mapPage = { ...next.site.mapPage, ...sectionCopy.mapPage }
  next.site.footer = { ...next.site.footer, ...sectionCopy.footer }
  next.site.notice = sectionCopy.routesSection.advisory
  next.routes = next.routes.map(route => routeIntroductions[route.id] ? { ...route, introduction: routeIntroductions[route.id] } : route)
  return next
}
