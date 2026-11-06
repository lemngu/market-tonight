import { redirect } from 'next/navigation'
import { authReady, isAdmin, signIn } from '@/auth'
import '../admin.css'

export const dynamic = 'force-dynamic'
export const metadata = { title: '관리자 로그인', robots: { index: false, follow: false } }
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const ready = authReady()
  if (ready && await isAdmin()) redirect('/admin')
  const { error } = await searchParams
  return <main className="admin-login"><a href="/">← 고객페이지</a><section>
    <p className="admin-eyebrow">GUWOL MORAENAE / PRIVATE WORKSPACE</p>
    <h1>나의 시장 작업실</h1><p>허용된 Google 계정으로만 들어갈 수 있습니다.</p>
    {error && <p role="alert" className="admin-error">로그인하지 못했습니다. 허용된 Google 계정을 확인한 뒤 다시 시도해주세요.</p>}
    {ready ? <form action={async () => { 'use server'; await signIn('google', { redirectTo: '/admin' }) }}><button className="admin-primary">Google 계정으로 로그인 →</button></form>
      : <div className="admin-setup"><h2>Google 로그인 연결이 필요합니다</h2><p>화면과 관리 기능은 준비되어 있으며, 로그인 설정이 끝나면 사용할 수 있습니다.</p><ol><li>프로젝트의 <code>.env.local</code>에서 관리자 이메일을 확인합니다.</li><li>Google Cloud에서 웹 애플리케이션 OAuth 클라이언트를 만듭니다.</li><li>클라이언트 ID와 비밀키를 <code>.env.local</code>에 직접 입력합니다.</li><li>개발 서버를 다시 시작합니다.</li></ol><p>자세한 순서는 프로젝트의 <code>LOCAL-ADMIN-SETUP.md</code>에 있습니다.</p><p>설정 전에는 관리자 접근과 저장이 차단됩니다.</p></div>}
  </section></main>
}
