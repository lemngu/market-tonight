import { redirect } from 'next/navigation'
import { isAdmin, authReady } from '@/auth'
import { readContent } from '@/lib/content-store'
import { defaultContent } from '@/lib/default-content'
import AdminWorkspace from './AdminWorkspace'

export const dynamic = 'force-dynamic'
export const metadata = { title: '나의 시장 작업실', robots: { index: false, follow: false } }
export default async function AdminPage() {
  if (!authReady() || !(await isAdmin())) redirect('/admin/login')
  return <AdminWorkspace initial={await readContent()} defaults={defaultContent} />
}
