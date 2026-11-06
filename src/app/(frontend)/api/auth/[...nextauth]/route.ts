import type { NextRequest } from 'next/server'
import { handlers, authReady } from '@/auth'
const unavailable = () => Response.json({ error: 'Google 로그인 설정이 필요합니다.' }, { status: 503 })
export const GET = (request: NextRequest) => authReady() ? handlers.GET(request) : unavailable()
export const POST = (request: NextRequest) => authReady() ? handlers.POST(request) : unavailable()

