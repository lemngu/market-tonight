import type { Content } from './content-schema'

// Keep upload visibility aligned with the components that render each image.
export function isPublishedMedia(content: Content, url: string) {
  const { site, routes, stores } = content
  const media = [site.hero.image,
    site.mapPage.image, site.festivalPage.timetable,
    ...(site.festival.isVisible ? [site.festival.poster] : [])]
  return media.some(image => image?.url === url) || stores.some(store =>
    store.isVisible && store.image?.url === url &&
    store.routeIds.some(id => routes.some(route => route.id === id && route.isVisible)))
}
