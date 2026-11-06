import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { dataDirectory, readContent } from '@/lib/content-store'
import { isAdmin } from '@/auth'
import { isPublishedMedia } from '@/lib/published-media'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export async function GET(_request: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params
  if (!/^[a-f0-9-]{36}\.webp$/.test(filename)) return new Response('Not found', { status: 404 })
  const url = `/api/uploads/${filename}`
  const { published } = await readContent()
  const publicImage = isPublishedMedia(published, url)
  if (!publicImage && !(await isAdmin())) return new Response('Not found', { status: 404 })
  try {
    const bytes = await readFile(path.join(dataDirectory, 'uploads', filename))
    return new Response(bytes, { headers: { 'Content-Type': 'image/webp', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'private, no-store' } })
  } catch { return new Response('Not found', { status: 404 }) }
}
