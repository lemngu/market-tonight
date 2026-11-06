import { signOut } from '@/auth'
import { requireAdmin } from '@/lib/admin-guard'
export async function POST(request: Request) {
  const denied = await requireAdmin(request, true)
  if (denied) return denied
  await signOut({ redirect: false })
  return Response.json({ ok: true })
}
