'use client'
import Image from 'next/image'
import { useEffect, useRef, type CSSProperties } from 'react'
import { getRouteColors } from '@/lib/route-colors'
import type { HomeRoute, HomeStore, SiteCopy } from '@/lib/content-schema'

export default function StoreModal({ store, routes, site, onClose, themeID }: { store: HomeStore | null; routes: HomeRoute[]; site: SiteCopy; onClose: () => void; themeID?: string }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const palette = getRouteColors(themeID ?? store?.routeIds[0] ?? "budget")
  const themeStyle = { "--route-color": palette.color, "--route-tint": palette.tint, "--route-strong": palette.strong, "--route-accent": palette.accent } as CSSProperties
  useEffect(() => { if (store) dialog.current?.showModal(); else dialog.current?.close() }, [store?.id])
  return <dialog ref={dialog} className="public-store-modal" style={themeStyle} aria-labelledby="public-store-title" onCancel={onClose} onClose={onClose}>{store && <>
    <div className="public-store-modal-head"><span>GUWOL MORAENAE / STORE</span><button type="button" aria-label="점포 상세 닫기" onClick={onClose}>✕</button></div>
    <div className="public-store-modal-body"><div className="public-store-image">{store.image ? <Image unoptimized src={store.image.url} alt={store.image.alt || store.name} width={store.image.width} height={store.image.height} /> : <div><span aria-hidden="true">↗</span><p>점포 사진 준비 중</p></div>}</div><div className="public-store-copy"><div className="public-store-themes">{store.routeIds.map(id => routes.find(route => route.id === id)).filter(Boolean).map(route => <span key={route!.id}>{route!.name}</span>)}</div><h2 id="public-store-title">{store.name}</h2><dl><div className="modal-menu-row"><dt>메뉴</dt><dd>{store.menus?.length ? store.menus.join(' · ') : store.menu || site.routesSection.unconfirmedLabel}</dd></div><div className="modal-price-row"><dt>{site.routesSection.priceLabel}</dt><dd>{(store.id.startsWith("demo-") ? store.price.replace(/^예시\s*/, "") : store.price) || site.routesSection.unconfirmedLabel}</dd></div><div><dt>{site.routesSection.hoursLabel}</dt><dd>{store.hours || site.routesSection.unconfirmedLabel}</dd></div><div className="modal-location-row"><dt>위치</dt><dd>{store.location || "위치 확인 중"}</dd></div></dl></div></div><div className="public-store-modal-foot"><button className="store-detail-button" type="button" onClick={onClose}>목록으로 <span aria-hidden="true">→</span></button></div>
  </>}</dialog>
}
