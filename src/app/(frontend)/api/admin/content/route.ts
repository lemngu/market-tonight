import { z } from 'zod'
import { requireAdmin } from '@/lib/admin-guard'
import { contentSchema } from '@/lib/content-schema'
import { readContent, saveContent } from '@/lib/content-store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export async function GET(request: Request) {
  const denied = await requireAdmin(request)
  if (denied) return denied
  const state = await readContent()
  if (new URL(request.url).searchParams.get('download') === '1') return Response.json(state, { headers: { 'Content-Disposition': 'attachment; filename="market-content-backup.json"', 'Cache-Control': 'no-store' } })
  return Response.json(state, { headers: { 'Cache-Control': 'no-store' } })
}
export async function PUT(request: Request) {
  const denied = await requireAdmin(request, true)
  if (denied) return denied
  if (Number(request.headers.get('content-length') || 0) > 4_000_000) return Response.json({ error: '데이터가 너무 큽니다.' }, { status: 413 })
  const bodyText = await request.text()
  if (Buffer.byteLength(bodyText) > 4_000_000) return Response.json({ error: '데이터가 너무 큽니다.' }, { status: 413 })
  let body: unknown
  try { body = JSON.parse(bodyText) } catch { return Response.json({ error: '올바른 데이터가 아닙니다.' }, { status: 400 }) }
  const result = z.object({ content: contentSchema, revision: z.number().int().nonnegative(), publish: z.boolean() }).strict().safeParse(body)
  if (!result.success) return Response.json({ error: result.error.issues.map(i => i.message).join(' / ') }, { status: 400 })
  try {
    const state = await saveContent(result.data.content, result.data.revision, result.data.publish)
    return Response.json(state, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    if ((error as Error).message === 'CONFLICT') return Response.json({ error: '다른 창에서 수정되었습니다. 저장된 내용을 다시 불러온 뒤 수정해주세요.' }, { status: 409 })
    console.error('Content save failed')
    return Response.json({ error: '저장에 실패했습니다. 다시 시도해주세요.' }, { status: 500 })
  }
}
