import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

export const authReady = () => Boolean(process.env.AUTH_SECRET && process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET && process.env.ADMIN_EMAIL)
export const isAllowedEmail = (email?: string | null) => Boolean(process.env.ADMIN_EMAIL && email?.toLowerCase() === process.env.ADMIN_EMAIL.trim().toLowerCase())

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google({ authorization: { params: { prompt: 'select_account', scope: 'openid email profile' } } })],
  session: { strategy: 'jwt', maxAge: 60 * 60 * 8 },
  pages: { signIn: '/admin/login', error: '/admin/login' },
  callbacks: {
    signIn({ account, profile }) {
      return authReady() && account?.provider === 'google' && profile?.email_verified === true && isAllowedEmail(profile.email)
    },
    jwt({ token, account, profile }) {
      if (account) token.marketAdmin = account.provider === 'google' && profile?.email_verified === true && isAllowedEmail(profile.email)
      return token
    },
    session({ session, token }) {
      if (token.marketAdmin !== true || !isAllowedEmail(session.user?.email)) return { ...session, user: undefined }
      return session
    },
  },
})

export async function isAdmin() {
  if (!authReady()) return false
  const session = await auth()
  return isAllowedEmail(session?.user?.email)
}
