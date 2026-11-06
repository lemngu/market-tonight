import { mkdir, writeFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import path from 'node:path'
import { convertImage, readUploadForm, ImageUploadError, MAX_IMAGE_BYTES } from '@/lib/image-upload'
import { imageTypeForFile } from '@/lib/upload-types'
import { requireAdmin } from '@/lib/admin-guard'
import { dataDirectory } from '@/lib/content-store'

export const runtime = 'nodejs'
export async function POST(request: Request) {
  const denied = await requireAdmin(request, true)
  if (denied) return denied
  if (Number(request.headers.get('content-length') || 0) > 5_500_000) return Response.json({ error: '사진은 5MB 이하로 올려주세요.' }, { status: 413 })
  try {
    const form = await readUploadForm(request)
    const file = form.get('file')
    if (!(file instanceof File) || !file.size || file.size > MAX_IMAGE_BYTES) return Response.json({ error: '5MB 이하 JPG·PNG·WebP·SVG 이미지만 가능합니다.' }, { status: 400 })
    const type = imageTypeForFile(file)
    if (!type) return Response.json({ error: 'JPG·PNG·WebP·SVG 파일을 선택해주세요.' }, { status: 400 })
    const bytes = Buffer.from(await file.arrayBuffer())
    const { data, info } = await convertImage(bytes, type)
    const filename = `${randomUUID()}.webp`
    await mkdir(path.join(dataDirectory, 'uploads'), { recursive: true })
    await writeFile(path.join(dataDirectory, 'uploads', filename), data, { flag: 'wx' })
    return Response.json({ url: `/api/uploads/${filename}`, alt: file.name.replace(/\.[^.]+$/, '').slice(0, 200), width: info.width, height: info.height })
  } catch (error) {
    if ((error as Error).message === 'UPLOAD_TOO_LARGE') return Response.json({ error: '사진은 5MB 이하로 올려주세요.' }, { status: 413 })
    if (error instanceof ImageUploadError) return Response.json({ error: error.message }, { status: 400 })
    return Response.json({ error: '사진을 처리하지 못했습니다. 파일 형식과 크기를 확인해주세요.' }, { status: 400 })
  }
}
