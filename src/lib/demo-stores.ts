import type { HomeRoute, HomeStore } from './content-schema'

// UI examples only: never persisted or mixed with published store records.
export function createDemoStores(routes: HomeRoute[]): HomeStore[] {
  const groups = [ ['잔치국수', '비빔국수', '김밥'], ['쌀국수', '메밀국수', '떡'], ['숯불구이', '철판볶음', '꼬치'], ['두부요리', '채소김밥', '나물비빔밥'], ['호떡', '붕어빵', '군고구마'] ]
  return routes.flatMap((route, routeIndex) => Array.from({ length: 8 }, (_, index) => {
    const menu = groups[routeIndex % groups.length][index % 3]
    return { id: `demo-${route.id}-${index}`, name: `[예시] ${menu} 점포 ${index + 1}`, menu, menus: [menu], isVisible: true, price: `예시 ${(4000 + index * 1000).toLocaleString('ko-KR')}원`, hours: '예시 10:00–19:00', image: null, routeIds: [route.id] }
  }))
}
