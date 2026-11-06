'use client'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import type { HomeRoute, HomeStore } from '@/lib/content-schema'

export default function StoreModal({ store, routes, onClose }: { store: HomeStore | null; routes: HomeRoute[]; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => { if (store) dialog.current?.showModal(); else dialog.current?.close() }, [store?.id])
  return <dialog ref={dialog} className="public-store-modal" aria-labelledby="public-store-title" onCancel={onClose} onClose={onClose}>{store && <>
    <div className="public-store-modal-head"><span>GUWOL MORAENAE / STORE</span><button type="button" aria-label="점포 상세 닫기" onClick={onClose}>✕</button></div>
    <div className="public-store-modal-body"><div className="public-store-image">{store.image ? <Image unoptimized src={store.image.url} alt={store.image.alt || store.name} width={store.image.width} height={store.image.height} /> : <div><span aria-hidden="true">↗</span><p>점포 사진 준비 중</p></div>}</div><div className="public-store-copy"><div className="public-store-themes">{store.routeIds.map(id => routes.find(route => route.id === id)).filter(Boolean).map(route => <span key={route!.id}>{route!.name}</span>)}</div><h2 id="public-store-title">{store.name}</h2><p className="public-store-product">{store.menu || '대표 상품 확인 중'}</p><dl><div><dt>메뉴</dt><dd>{store.menus?.length ? store.menus.join(' · ') : store.menu || '확인 중'}</dd></div><div><dt>가격대</dt><dd>{store.price || '확인 중'}</dd></div><div><dt>영업시간</dt><dd>{store.hours || '확인 중'}</dd></div></dl><p className="public-store-note">가격과 영업시간은 변경될 수 있습니다. 방문 전 점포에 확인해주세요.</p></div></div><div className="public-store-modal-foot"><button type="button" onClick={onClose}>목록으로 돌아가기</button></div>
  </>}</dialog>
}
