'use client'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import type { SiteCopy } from '@/lib/content-schema'

export default function SiteHeader({ site }: { site: SiteCopy }) {
  const [open, setOpen] = useState(false)
  const [origin, setOrigin] = useState({ x: 'calc(100% - 50px)', y: '48px' })
  const [menuInset, setMenuInset] = useState('24px')
  const button = useRef<HTMLButtonElement>(null)
  const overlay = useRef<HTMLDivElement>(null)
  const locate = () => { const cross = document.querySelector('.shared-header .header-logo-cross')?.getBoundingClientRect(); if (cross) setMenuInset(window.innerWidth < 768 ? '24px' : `${cross.right}px`); const box = button.current?.getBoundingClientRect(); if (box) setOrigin({ x: `${box.x + box.width / 2}px`, y: `${box.y + box.height / 2}px` }) }
  useEffect(() => {
    if (!open) return
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const content = [...document.querySelectorAll<HTMLElement>('.site-shell > main, .site-shell > footer, .site-shell > .sponsor-loop')]
    const previous = content.map(node => node.inert)
    content.forEach(node => { node.inert = true })
    const trap = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); button.current?.focus() }
      if (event.key === 'Tab') {
        const focusable = [button.current, ...overlay.current!.querySelectorAll<HTMLAnchorElement>('a')].filter(Boolean) as HTMLElement[]
        const current = focusable.indexOf(document.activeElement as HTMLElement)
        event.preventDefault(); focusable[(current + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length]?.focus()
      }
    }
    document.addEventListener('keydown', trap); window.addEventListener('resize', locate)
    return () => { document.body.style.overflow = oldOverflow; content.forEach((node,index) => { node.inert = previous[index] }); document.removeEventListener('keydown', trap); window.removeEventListener('resize', locate) }
  }, [open])
  return <>
    <header className={'topbar shared-header' + (open ? ' menu-is-open' : '')}><div className="topbar-inner">
      <a className="header-logos" href="/" aria-label={site.brand + ' 홈'}><Image unoptimized priority className="festival-logo" src={'/assets/Korea-Grand-Festival_logo_' + (open ? 'white' : 'black') + '.svg'} alt="코리아그랜드페스티벌" width={661} height={370} /><span className="header-logo-cross" aria-hidden="true">|</span><Image unoptimized priority className="market-logo" src={'/assets/Market-Tonight_logo_' + (open ? 'white' : 'black') + '.svg'} alt="Market Tonight" width={487} height={180} /></a>
      <button ref={button} type="button" className={'menu-trigger fixed-menu-toggle' + (open ? ' is-open' : '')} aria-controls="site-menu" aria-expanded={open} aria-label={open ? '전체 메뉴 닫기' : '전체 메뉴 열기'} onClick={() => { locate(); setOpen(!open) }}><span /><span /><span /></button>
    </div></header>
    <div ref={overlay} id="site-menu" className={'radial-menu' + (open ? ' is-open' : '')} role="dialog" aria-modal={open ? true : undefined} aria-label="전체 메뉴" aria-hidden={!open} inert={!open} style={{ '--menu-inset': menuInset, '--menu-x': origin.x, '--menu-y': origin.y } as CSSProperties}>
      <div className="radial-menu-content"><p>GUWOL MORAENAE / MARKET TONIGHT</p><nav aria-label="전체 메뉴 항목">{[['/', '홈', 'HOME'], ['/routes', site.navRoutesLabel, 'TASTE ROUTES'], ['/festival', site.navEventLabel, 'FESTIVAL'], ['/map', '지도', 'MARKET MAP']].map(([href,title,english],index) => <a key={href} href={href} onClick={() => setOpen(false)}><span>{String(index + 1).padStart(2,'0')}</span><strong>{title}</strong><small>{english} ↗</small></a>)}</nav><p>오늘 끌리는 맛으로, 구월모래내시장.</p></div>
    </div>
  </>
}
