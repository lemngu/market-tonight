import { contentSchema, type Content } from './content-schema'
import { applySectionCopy } from './section-copy'
import { pageDefaults } from './page-defaults'
import { recommendedHeroCopy } from './hero-copy'

const baseContent = {
  site: {
    ...pageDefaults,
    brand: '구월모래내시장', metaTitle: '구월모래내, 취향 따라 맛길 | Market ToNight', metaDescription: '다섯 가지 취향으로 만나는 구월모래내시장 미식 안내',
    navRoutesLabel: '미식루트', navEventLabel: '행사안내',
    hero: { ...recommendedHeroCopy, eyebrow: '구월모래내시장', ctaLabel: '내 취향의 맛길 펼치기', image: null, caption: '11월 13일, 시장에서 만나요.', footLeft: '취향 따라 고르고, 골목 따라 걷고.', footRight: '인천 구월모래내시장' },
    routesSection: { title: '다섯 가지 시장 산책.', description: '오늘 끌리는 맛을 골라보세요. 점포와 메뉴를 함께 살펴볼 수 있어요.', selectedLabel: '지금 펼친 맛길', searchPlaceholder: '점포명·대표 상품 검색', countLabel: '소개하는 점포', advisory: '가격·영업시간은 방문 전 점포에 확인해주세요.', emptyTitle: '검색 결과가 없어요', emptyMessage: '다른 검색어를 입력해보세요.', preparingTitle: '이 맛길의 점포를 확인하고 있어요.', preparingDescription: '메뉴와 운영 정보를 확인한 점포부터 소개할게요.', resetLabel: '검색 조건 초기화', priceLabel: '가격대', hoursLabel: '영업시간', unconfirmedLabel: '확인 중', menuUnconfirmedLabel: '대표 상품 확인 중', detailLabel: '자세히 보기' },
    festival: { isVisible: true, heading: '시장이 켜지는 금요일.', name: 'Market ToNight', highlights: '행사 프로그램을 준비 중입니다.', date: '2026.11.13.', schedule: '금요일 14:00–21:00', location: '인천 구월모래내시장 일대', programHours: '스쿨뮤직 프로그램 16:00–21:00', note: '세부 공연 시간표는 확정 후 안내합니다.', linkLabel: '행사 포스터 보기', poster: null },
    notice: '메뉴·가격·영업시간은 변경될 수 있습니다. 방문 전 점포에 확인해주세요.',
    footer: { headingLine1: 'ABOUT US /', headingLine2: 'CONTACT', tagline: '구월모래내시장 · 취향 따라 맛길', organization: '구월모래내시장 로컬테마 상권기획자', analyticsNote: '방문 전 점포의 운영 정보를 확인해주세요.', adminLabel: '관리자 작업실' },
    design: { navy: '#1c376b', cream: '#fff5de', white: '#fffcf3', blue: '#2877b4', mutedBackground: '#eae3d3', yellow: '#f4bf22', fontSize: 16, logoSeconds: 28 },
  },
  routes: [
    { id: 'budget', name: '만 원 안의 행복', description: '가볍고 든든한 한 끼', introduction: '가볍게 들러, 든든하게 채우는 한 끼.', advisory: '', isVisible: true },
    { id: 'gluten-free', name: '글루텐 프리', description: '쌀·메밀의 새로운 발견', introduction: '쌀과 메밀, 재료부터 살펴보는 맛 탐험.', advisory: '글루텐 프리 여부는 메뉴의 재료·양념·조리환경 확인이 필요합니다. 테마 자체가 인증을 의미하지 않습니다.', isVisible: true },
    { id: 'grill', name: '불맛 산책', description: '지글지글 구이와 볶음', introduction: '지글지글, 골목 끝에서 만나는 맛있는 온도.', advisory: '', isVisible: true },
    { id: 'vegan', name: '비건 보물 찾기', description: '식물성 먹거리 탐험', introduction: '식물성 먹거리의 가능성을 찾아서.', advisory: '비건 여부는 메뉴의 재료·양념·조리환경 확인이 필요합니다. 테마 자체가 인증을 의미하지 않습니다.', isVisible: true },
    { id: 'winter', name: '겨울 간식 산책', description: '따뜻하고 달콤한 한 입', introduction: '찬 바람이 불면 더 생각나는 한 입.', advisory: '', isVisible: true },
  ],
  stores: [],
}

export const defaultContent: Content = applySectionCopy(contentSchema.parse(baseContent))
