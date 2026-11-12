import type { Content } from './content-schema'

// Only images rendered by the current public pages are publicly readable.
export function isPublishedMedia(content: Content, url: string) {
  const { site } = content
  const media = [site.hero.image, site.mapPage.image, site.festivalPage.timetable,
    site.festivalPage.speakerImage, site.festivalPage.schoolTimetable, site.festivalPage.djTimetable]
  return media.some(image => image?.url === url)
}
