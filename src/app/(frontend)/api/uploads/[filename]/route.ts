import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { dataDirectory, readContent } from '@/lib/content-store'
import { isAdmin } from '@/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export async function GET(_request: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params
  if (!/^[a-f0-9-]{36}\.webp$/.test(filename)) return new Response('Not found', { status: 404 })
  const url = `/api/uploads/${filename}`
  const { published } = await readContent()
  const publicImage = published.site.hero.image?.url === url || (published.site.festival.isVisible && published.site.festival.poster?.url === url) || published.stores.some(s => s.isVisible && s.routeIds.some(id => published.routes.some(r => r.id === id && r.isVisible)) && s.image?.url === url)
  if (!publicImage && !(await isAdmin())) return new Response('Not found', { status: 404 })
  try {
    const bytes = await readFile(path.join(dataDirectory, 'uploads', filename))
    return new Response(bytes, { headers: { 'Content-Type': 'image/webp', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'private, no-store' } })
  } catch { return new Response('Not found', { status: 404 }) }
}
