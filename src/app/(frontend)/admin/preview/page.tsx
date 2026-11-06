import { redirect } from 'next/navigation'
import { isAdmin } from '@/auth'
import { readContent } from '@/lib/content-store'
import Preview from './Preview'
export const dynamic = 'force-dynamic'
export const metadata = { robots: { index: false, follow: false } }
export default async function PreviewPage() {
  if (!(await isAdmin())) redirect('/admin/login')
  return <Preview initial={(await readContent()).draft} />
}
