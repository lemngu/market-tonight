'use client'
import { useEffect, useRef, useState } from 'react'
import type { HomeRoute, HomeStore } from '@/lib/content-schema'

export default function ThemeManager({ routes, stores, onChange }: { routes: HomeRoute[]; stores: HomeStore[]; onChange: (routes: HomeRoute[]) => void }) {
  const [editing, setEditing] = useState<HomeRoute | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const existing = editing && routes.some(route => route.id === editing.id)
  useEffect(() => { if (editing) dialog.current?.showModal(); else dialog.current?.close() }, [editing?.id])
  const move = (index: number, direction: number) => {
    const next = [...routes]; const other = index + direction
    if (other < 0 || other >= next.length) return
    ;[next[index], next[other]] = [next[other], next[index]]
    onChange(next)
  }
  return <div className="store-manager theme-manager">
    <div className="store-manager-heading"><div><p className="store-eyebrow">GUWOL MORAENAE / TASTE ROUTES</p><h1>미식루트 테마<span>{routes.length}</span></h1><p>테마를 선택해 내용을 수정하고, 화살표로 표시 순서를 조정하세요.</p></div><button className="admin-primary store-add-button" onClick={() => setEditing({ id: crypto.randomUUID(), name: '', description: '', introduction: '', advisory: '', isVisible: false })}>＋ 테마 추가</button></div>
    <div className="store-list-panel"><div className="theme-list-heading" aria-hidden="true"><span>순서</span><span>테마 / 짧은 설명</span><span>연결 점포</span><span>노출상태</span><span>순서 변경</span></div>
      <ul className="theme-manager-list" aria-label="미식루트 테마 목록">{routes.map((route, index) => <li key={route.id}>
        <button className="theme-edit-row" aria-label={route.name + ' 테마 편집'} onClick={() => setEditing(structuredClone(route))}><span className="theme-order">{String(index + 1).padStart(2, '0')}</span><span className="theme-name"><strong>{route.name}</strong><span>{route.description || '짧은 설명을 추가해주세요.'}</span></span><span className="theme-store-count">{stores.filter(store => store.routeIds.includes(route.id)).length}<small>개 점포</small></span><span className={route.isVisible ? 'store-visibility is-visible' : 'store-visibility'}><span aria-hidden="true" />{route.isVisible ? '공개' : '비공개'}</span></button>
        <div className="theme-order-actions"><button aria-label={route.name + ' 위로 이동'} disabled={index === 0} onClick={() => move(index, -1)}>↑</button><button aria-label={route.name + ' 아래로 이동'} disabled={index === routes.length - 1} onClick={() => move(index, 1)}>↓</button></div>
      </li>)}</ul>
      {!routes.length && <div className="store-list-empty"><h2>첫 미식루트를 추가해보세요.</h2><p>테마를 만든 후 점포를 연결할 수 있습니다.</p></div>}
    </div><p className="store-manager-footnote">테마 이름을 바꾸어도 연결된 점포는 유지됩니다. 변경 후 임시저장 또는 고객페이지 반영을 눌러주세요.</p>
    <dialog ref={dialog} className="admin-store-dialog store-editor-dialog theme-editor-dialog" aria-labelledby="theme-editor-title" onCancel={() => setEditing(null)} onClose={() => setEditing(null)}>{editing && <form onSubmit={event => {
      event.preventDefault()
      if (!editing.name.trim()) return
      const next = { ...editing, name: editing.name.trim() }
      onChange(existing ? routes.map(route => route.id === editing.id ? next : route) : [...routes, next]); setEditing(null)
    }}><div className="store-editor-header"><div><p className="store-eyebrow">TASTE ROUTE / DETAILS</p><h2 id="theme-editor-title">{existing ? '미식루트 테마 편집' : '새 미식루트 추가'}</h2><p id="store-editor-description">테마의 이름과 고객에게 안내할 내용을 입력하세요.</p></div><button type="button" className="store-editor-close" aria-label="테마 편집창 닫기" onClick={() => setEditing(null)}>✕</button></div>
      <div className="store-editor-body"><div className="store-form-grid">{(['name', 'description', 'introduction', 'advisory'] as const).map(key => <label className="store-field-wide" key={key}>{{ name: '테마명', description: '짧은 설명', introduction: '점포 목록 소개', advisory: '재료·인증 관련 안내' }[key]}{key === 'name' ? <input autoFocus required maxLength={160} value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} /> : <textarea rows={key === 'advisory' ? 4 : 2} maxLength={4000} value={editing[key]} onChange={e => setEditing({ ...editing, [key]: e.target.value })} />}</label>)}</div><section className="store-publish-setting"><div><h3>고객페이지 공개</h3><p>비공개 테마는 고객페이지의 미식루트 목록에서 숨겨집니다.</p></div><label className="store-switch"><input aria-label="테마 고객페이지에 공개" type="checkbox" checked={editing.isVisible} onChange={e => setEditing({ ...editing, isVisible: e.target.checked })} /><span aria-hidden="true" /><strong>{editing.isVisible ? '공개' : '비공개'}</strong></label></section></div>
      <div className="store-editor-footer"><p>점포 연결은 점포 관리에서 수정할 수 있습니다.</p><div><button type="button" onClick={() => setEditing(null)}>취소</button><button type="submit" className="admin-primary">{existing ? '수정 내용 적용' : '테마 추가하기'}</button></div></div>
    </form>}</dialog>
  </div>
}
