const routeColors = [
  { color: '#2E8B57', accent: '#4CAF72', tint: '#E8F6E9', ink: '#FFFFFF', strong: '#17643B' },
  { color: '#F8A623', accent: '#FFD878', tint: '#FFF6DD', ink: '#FFFFFF', strong: '#8A5200' },
  { color: '#A8D64E', accent: '#CDEB7A', tint: '#F3FCE6', ink: '#FFFFFF', strong: '#3D5A0A' },
  { color: '#F74C3C', accent: '#FF8A7A', tint: '#FFE9E6', ink: '#FFFFFF', strong: '#B42318' },
  { color: '#8B5A3C', accent: '#C8A07D', tint: '#F5EAE2', ink: '#FFFFFF', strong: '#684026' },
] as const
const routeColorIndex: Record<string, number> = { budget: 0, 'gluten-free': 4, grill: 3, vegan: 2, winter: 1 }
export function getRouteColors(id: string, index = 0) {
  return routeColors[routeColorIndex[id] ?? Math.max(0, index) % routeColors.length]
}
