import { mkdir, writeFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import path from 'node:path'
import sharp from 'sharp'
import { requireAdmin } from '@/lib/admin-guard'
import { dataDirectory } from '@/lib/content-store'

export const runtime = 'nodejs'
export async function POST(request: Request) {
  const denied = await requireAdmin(request, true)
  if (denied) return denied
  if (Number(request.headers.get('content-length') || 0) > 5_500_000) return Response.json({ error: '사진은 5MB 이하로 올려주세요.' }, { status: 413 })
  try {
    const form = await request.formData()
    const file = form.get('file')
    if (!(file instanceof File) || file.size > 5 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return Response.json({ error: '5MB 이하 JPG·PNG·WebP 사진만 가능합니다.' }, { status: 400 })
    const bytes = Buffer.from(await file.arrayBuffer())
    const input = sharp(bytes, { limitInputPixels: 40_000_000 })
    const metadata = await input.metadata()
    if (!['jpeg', 'png', 'webp'].includes(metadata.format || '') || (metadata.pages ?? 1) > 1) throw new Error('Invalid image')
    const { data, info } = await input.rotate().resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true }).webp({ quality: 85 }).toBuffer({ resolveWithObject: true })
    const filename = `${randomUUID()}.webp`
    await mkdir(path.join(dataDirectory, 'uploads'), { recursive: true })
    await writeFile(path.join(dataDirectory, 'uploads', filename), data, { flag: 'wx' })
    return Response.json({ url: `/api/uploads/${filename}`, alt: file.name.replace(/\.[^.]+$/, '').slice(0, 200), width: info.width, height: info.height })
  } catch {
    return Response.json({ error: '사진을 처리하지 못했습니다. 파일 형식과 크기를 확인해주세요.' }, { status: 400 })
  }
}
