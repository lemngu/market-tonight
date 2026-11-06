import { z } from 'zod'
import { pageDefaults } from './page-defaults'

const text = z.string().max(4000)
const short = z.string().trim().min(1).max(160)
const id = z.string().regex(/^[a-zA-Z0-9_-]{1,100}$/)
const imageUrl = z.string().max(2000).refine(v => /^\/api\/uploads\/[a-f0-9-]+\.webp$/.test(v) || /^\/assets\/[a-zA-Z0-9_./%-]+$/.test(v), '업로드한 이미지 또는 assets 경로를 사용해주세요.')
export const mediaSchema = z.object({ url: imageUrl, alt: text, width: z.number().int().positive().max(20000), height: z.number().int().positive().max(20000) }).strict().nullable()
export const routeSchema = z.object({ id, name: short, description: text, introduction: text, advisory: text, isVisible: z.boolean() }).strict()
export const storeSchema = z.object({ id, name: short, isVisible: z.boolean(), menu: text, menus: z.array(short).max(100).optional(), price: text, hours: text, image: mediaSchema, routeIds: z.array(id).max(100) }).strict()
const color = z.string().regex(/^#[a-fA-F0-9]{6}$/)
export const siteSchema = z.object({
  brand: short, metaTitle: short, metaDescription: text, navRoutesLabel: text, navEventLabel: text,
  hero: z.object({ eyebrow: text, titleLine1: text, titleLine2: text, description: text, ctaLabel: text, image: mediaSchema, caption: text, footLeft: text, footRight: text }).strict(),
  routesSection: z.object({ title: text, description: text, selectedLabel: text, searchPlaceholder: text, countLabel: text, advisory: text, emptyTitle: text, emptyMessage: text, preparingTitle: text, preparingDescription: text, resetLabel: text, priceLabel: text, hoursLabel: text, unconfirmedLabel: text, menuUnconfirmedLabel: text, detailLabel: text }).strict(),
  festival: z.object({ isVisible: z.boolean(), heading: text, name: text, highlights: text, date: text, schedule: text, location: text, programHours: text, note: text, linkLabel: text, poster: mediaSchema }).strict(),
  routePage: z.object({eyebrow: text, title: text, description: text}).strict().default(pageDefaults.routePage),
  festivalPage: z.object({eyebrow: text, title: text, description: text, date: text, schedule: text, location: text, timetableTitle: text, timetable: mediaSchema, programTitle: text, programs: z.array(z.object({time:text,title:text,place:text,color:z.enum(['yellow','blue','orange','olive']),description:text}).strict()).max(50), linkedTitle:text, linkedSchedule:text, linkedLocation:text, note:text}).strict().default(pageDefaults.festivalPage),
  mapPage: z.object({eyebrow: text, title: text, description: text, image:mediaSchema, placeholderTitle:text, placeholderDescription:text}).strict().default(pageDefaults.mapPage),
  notice: text,
  footer: z.object({ headingLine1: text, headingLine2: text, tagline: text, organization: text, analyticsNote: text, adminLabel: text }).strict(),
  design: z.object({ navy: color, cream: color, white: color, blue: color, mutedBackground: color, yellow: color, fontSize: z.number().int().min(12).max(22), logoSeconds: z.number().int().min(10).max(90) }).strict(),
}).strict()
export const contentSchema = z.object({ site: siteSchema, routes: z.array(routeSchema).max(100), stores: z.array(storeSchema).max(2000) }).strict().superRefine((data, ctx) => {
  const ids = new Set(data.routes.map(r => r.id))
  if (ids.size !== data.routes.length || new Set(data.stores.map(s => s.id)).size !== data.stores.length) ctx.addIssue({ code: 'custom', message: '중복된 항목 ID가 있습니다.' })
  data.stores.forEach((s, i) => {
    if (s.routeIds.some(r => !ids.has(r))) ctx.addIssue({ code: 'custom', path: ['stores', i, 'routeIds'], message: '존재하지 않는 미식루트입니다.' })
    if (s.isVisible && !s.routeIds.length) ctx.addIssue({ code: 'custom', path: ['stores', i, 'routeIds'], message: '공개 점포는 미식루트를 하나 이상 선택해주세요.' })
  })
})
export type Content = z.infer<typeof contentSchema>
export type SiteCopy = Content['site']
export type HomeRoute = Content['routes'][number]
export type HomeStore = Content['stores'][number]
export type HomeMedia = NonNullable<HomeStore['image']>
