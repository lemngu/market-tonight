import 'server-only'
import { isAdmin } from '@/auth'

export async function requireAdmin(request: Request, mutation = false) {
  if (!(await isAdmin())) return Response.json({ error: '관리자 로그인이 필요합니다.' }, { status: 401 })
  if (mutation) {
    const expected = new URL(process.env.AUTH_URL || request.url).origin
    if (request.headers.get('origin') !== expected) return Response.json({ error: '허용되지 않은 요청입니다.' }, { status: 403 })
  }
  return null
}
