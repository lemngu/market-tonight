'use client'
import { useEffect, useState } from 'react'
import { contentSchema, type Content } from '@/lib/content-schema'
import HomeExperience from '../../HomeExperience'
import FestivalExperience from '../../FestivalExperience'
import MapExperience from '../../MapExperience'
export default function Preview({ initial }: { initial: Content }) {
  const [view,setView] = useState('home')
  const [content, setContent] = useState(initial)
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== location.origin || event.source !== parent || event.data?.type !== 'market-preview') return
      const result = contentSchema.safeParse(event.data.content)
      if (result.success) { setContent(result.data); setView(['routePage','festivalPage','mapPage'].includes(event.data.page) ? event.data.page : 'home') }
    }
    addEventListener('message', receive)
    parent.postMessage({ type: 'market-preview-ready' }, location.origin)
    return () => removeEventListener('message', receive)
  }, [])
  if(view === 'festivalPage') return <FestivalExperience site={content.site}/>
  if(view === 'mapPage') return <MapExperience site={content.site}/>
  return <HomeExperience detailMode={view === 'routePage'} {...content} routes={content.routes.filter(r => r.isVisible)} stores={content.stores.filter(s => s.isVisible)} />
}
