'use client'
import { useEffect, useRef, useState } from 'react'

export default function FestivalTabs({ sections }: { sections: string[][] }) {
  const nav = useRef<HTMLElement>(null)
  const [active, setActive] = useState(sections[0][0])
  const lockedUntil = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    const bar = nav.current
    if (!bar) return
    let frame = 0
    const update = () => {
      frame = 0
      if (performance.now() < lockedUntil.current) return
      const top = bar.getBoundingClientRect().bottom + 48
      let current = sections[0][0]
      for (const [id] of sections) {
        if ((document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) <= top) current = id
      }
      setActive(current)
    }
    const requestUpdate = () => { if (!frame) frame = requestAnimationFrame(update) }
    const size = requestUpdate
    const unlock = () => { lockedUntil.current = 0; requestUpdate() }
    const observer = new ResizeObserver(size)
    observer.observe(bar)
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('wheel', unlock, { passive: true })
    window.addEventListener('touchstart', unlock, { passive: true })
    size()
    return () => { observer.disconnect(); cancelAnimationFrame(frame); if (timer.current) clearTimeout(timer.current); window.removeEventListener('scroll', requestUpdate); window.removeEventListener('wheel', unlock); window.removeEventListener('touchstart', unlock) }
  }, [sections])
  useEffect(() => {
    const bar = nav.current
    const link = bar?.querySelector<HTMLElement>('[aria-current="location"]')
    if (!bar || !link) return
    const padding = parseFloat(getComputedStyle(bar).paddingLeft) || 0
    bar.scrollTo({ left: bar.scrollLeft + link.getBoundingClientRect().left - bar.getBoundingClientRect().left - padding, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }, [active])
  return <nav ref={nav} className="festival-section-tabs" aria-label="행사 안내 바로가기">
    {sections.map(([id, title]) => <a key={id} href={'#' + id} aria-current={active === id ? 'location' : undefined}
      onClick={() => { lockedUntil.current = performance.now() + 1000; setActive(id); if (timer.current) clearTimeout(timer.current); timer.current = setTimeout(() => { lockedUntil.current = 0; window.dispatchEvent(new Event('scroll')) }, 1100) }}>{title}</a>)}
  </nav>
}
