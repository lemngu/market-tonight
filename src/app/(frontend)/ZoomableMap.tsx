'use client'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import type { HomeMedia } from '@/lib/content-schema'

export default function ZoomableMap({ image, compact = false }: { image: HomeMedia; compact?: boolean }) {
  const viewport = useRef<HTMLDivElement>(null)
  const initialScale = Math.max(image.width / image.height, image.height / image.width)
  const transform = useRef({ scale: initialScale, x: 0, y: 0 })
  const [view, setView] = useState(transform.current)
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const apply = (scale: number, x: number, y: number) => {
    const box = viewport.current
    if (!box) return
    const next = Math.max(1, Math.min(5, scale))
    const fit = Math.min(box.clientWidth / image.width, box.clientHeight / image.height)
    const limitX = Math.max(0, (image.width * fit * next - box.clientWidth) / 2)
    const limitY = Math.max(0, (image.height * fit * next - box.clientHeight) / 2)
    transform.current = { scale: next, x: Math.max(-limitX, Math.min(limitX, x)), y: Math.max(-limitY, Math.min(limitY, y)) }
    setView(transform.current)
  }
  const zoom = (factor: number, clientX?: number, clientY?: number) => {
    const box = viewport.current?.getBoundingClientRect()
    if (!box) return
    const old = transform.current
    const next = Math.max(1, Math.min(5, old.scale * factor))
    const ratio = next / old.scale
    const x = (clientX ?? box.x + box.width / 2) - box.x - box.width / 2
    const y = (clientY ?? box.y + box.height / 2) - box.y - box.height / 2
    apply(next, x - (x - old.x) * ratio, y - (y - old.y) * ratio)
  }
  useEffect(() => {
    const box = viewport.current
    if (!box) return
    const wheel = (event: WheelEvent) => { event.preventDefault(); zoom(Math.exp(-event.deltaY * .003), event.clientX, event.clientY) }
    box.addEventListener('wheel', wheel, { passive: false })
    const observer = new ResizeObserver(() => { const v = transform.current; apply(v.scale, v.x, v.y) })
    observer.observe(box)
    return () => { box.removeEventListener('wheel', wheel); observer.disconnect() }
  }, [])
  const release = (id: number) => { pointers.current.delete(id) }
  return <div className={'interactive-market-map gesture-map' + (compact ? ' compact' : '')} style={{ maxWidth: image.width + 'px' }}>
    <div ref={viewport} className={'map-viewport' + (view.scale > 1 ? ' zoomed' : '')}
      style={{ aspectRatio: image.width + ' / ' + image.height }} tabIndex={0}
      role="region" aria-label="행사장 지도. 두 손가락 또는 마우스 휠로 확대하고 드래그로 이동합니다. 두 번 누르면 초기화합니다."
      onKeyDown={event => { if (['+', '=', '-', '0', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) { event.preventDefault(); const v = transform.current; if (event.key === '0') apply(1, 0, 0); else if (['+', '=', '-'].includes(event.key)) zoom(event.key === '-' ? .8 : 1.25); else apply(v.scale, v.x + (event.key === 'ArrowLeft' ? 40 : event.key === 'ArrowRight' ? -40 : 0), v.y + (event.key === 'ArrowUp' ? 40 : event.key === 'ArrowDown' ? -40 : 0)) } }}
      onDoubleClick={() => apply(1, 0, 0)}
      onPointerDown={event => { if (event.pointerType === 'mouse' && event.button !== 0) return; pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY }); event.currentTarget.setPointerCapture(event.pointerId) }}
      onPointerMove={event => {
        const before = pointers.current.get(event.pointerId)
        if (!before) return
        const other = [...pointers.current.entries()].find(([id]) => id !== event.pointerId)?.[1]
        pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
        if (other) {
          const previousDistance = Math.hypot(before.x - other.x, before.y - other.y)
          const distance = Math.hypot(event.clientX - other.x, event.clientY - other.y)
          if (previousDistance > 0) zoom(distance / previousDistance, (event.clientX + other.x) / 2, (event.clientY + other.y) / 2)
        } else { const v = transform.current; apply(v.scale, v.x + event.clientX - before.x, v.y + event.clientY - before.y) }
      }}
      onPointerUp={event => release(event.pointerId)} onPointerCancel={event => release(event.pointerId)}
      onLostPointerCapture={event => release(event.pointerId)}>
      <Image unoptimized draggable={false} src={image.url} alt={image.alt} width={image.width} height={image.height}
        style={{ transform: 'translate(' + view.x + 'px,' + view.y + 'px) scale(' + view.scale + ')' }} />
      {view.scale > 1 && <button type="button" className="map-reset" onClick={() => apply(1, 0, 0)} aria-label="지도 전체 보기">↺ <span>{Math.round(view.scale * 100)}%</span></button>}
    </div>
  </div>
}
