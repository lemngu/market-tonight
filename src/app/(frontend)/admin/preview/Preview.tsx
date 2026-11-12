'use client'
import { useEffect, useRef, useState } from 'react'
import { contentSchema, type Content } from '@/lib/content-schema'
import HomeExperience from '../../HomeExperience'
import FestivalExperience from '../../FestivalExperience'
import MapExperience from '../../MapExperience'

export default function Preview({ initial }: { initial: Content }) {
  const [view, setView] = useState('home')
  const [section, setSection] = useState('site')
  const [content, setContent] = useState(initial)
  const lastSelection = useRef('')
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== location.origin || event.source !== parent || event.data?.type !== 'market-preview') return
      const result = contentSchema.safeParse(event.data.content)
      if (!result.success) return
      setContent(result.data)
      const page = typeof event.data.page === 'string' ? event.data.page : 'site'
      const selection = page
      if (lastSelection.current !== selection) {
        lastSelection.current = selection
        setSection(page)
        setView(['festivalPage', 'mapPage'].includes(page) ? page : 'home')
      }
    }
    // Keep internal navigation inside this draft, instead of loading published pages
    // and losing the message listener when a preview link is clicked.
    const navigate = (event: MouseEvent) => {
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href]')
      if (!link || link.target === '_blank' || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return
      const url = new URL(link.href, location.href)
      if (url.origin !== location.origin) return
      if (url.pathname === location.pathname && url.hash) return
      if (url.pathname === '/') { event.preventDefault(); setView('home'); setSection(url.hash === '#festival' ? 'festival' : 'hero'); window.scrollTo(0, 0) }
      else if (url.pathname === '/festival' || url.pathname === '/map') { event.preventDefault(); setView(url.pathname === '/festival' ? 'festivalPage' : 'mapPage'); window.scrollTo(0, 0) }
      else if (url.pathname.startsWith('/admin')) event.preventDefault()
    }
    addEventListener('message', receive)
    document.addEventListener('click', navigate)
    parent.postMessage({ type: 'market-preview-ready' }, location.origin)
    return () => { removeEventListener('message', receive); document.removeEventListener('click', navigate) }
  }, [])
  useEffect(() => {
    const target = view === 'home' ? ({ hero: '.hero', festival: '#festival', footer: '#partners' } as Record<string, string>)[section] : ''
    if (target) document.querySelector(target)?.scrollIntoView({ block: 'start' })
    else window.scrollTo(0, 0)
  }, [view, section])
  if (view === 'festivalPage') return <FestivalExperience site={content.site} />
  if (view === 'mapPage') return <MapExperience site={content.site} />
  return <HomeExperience site={content.site} />
}
