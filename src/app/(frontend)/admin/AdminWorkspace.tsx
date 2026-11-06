'use client'
import { Fragment, useEffect, useRef, useState } from 'react'
import { contentSchema, type Content, type HomeMedia, type HomeStore } from '@/lib/content-schema'
import type { ContentState } from '@/lib/content-store'
import './admin.css'
import './preview-visibility.css'
import ThemeManager from './ThemeManager'
import { imageTypeForFile } from '@/lib/upload-types'

const labels: Record<string, string> = {
  menuTagline: '전체 메뉴 하단 문구', browseLabel: '미식루트 이동 버튼', countSuffix: '점포 수 단위', sectionTitle: '상세 페이지 맛길 제목', linkedEyebrow: '연계 행사 안내 제목', linkedDescription: '연계 행사 혜택', linkedNote: '연계 행사 유의사항', routesDescription: '지도 미식루트 소개', eventDescription: '지도 행사 공간 소개', routesLinkLabel: '지도 미식루트 버튼', eventLinkLabel: '지도 행사 안내 버튼',
  timetable: '시간표 이미지', timetableTitle: '시간표 제목', programTitle: '프로그램 영역 제목', programs: '프로그램 목록', time: '시간', place: '장소', color: '포인트 색상', linkedTitle: '연계 행사 제목', linkedSchedule: '연계 행사 일정', linkedLocation: '연계 행사 장소', placeholderTitle: '지도 준비 중 제목', placeholderDescription: '지도 준비 중 설명',
  brand: '상단 사이트 이름', metaTitle: '브라우저·검색 제목', metaDescription: '검색 소개', navRoutesLabel: '미식루트 메뉴', navEventLabel: '행사 메뉴',
  kicker: '히어로 상단 영문', brandTitle: '행사 영문 이름', eventDate: '히어로 행사 일시', eventLocation: '히어로 행사 장소', programLine: '히어로 프로그램 목록',
  eyebrow: '표지 탭', titleLine1: '큰 제목 첫째 줄', titleLine2: '큰 제목 둘째 줄', description: '소개', ctaLabel: '맛길 펼치기 버튼', image: '대표 사진', caption: '사진 아래 문구', footLeft: '표지 하단 왼쪽', footRight: '표지 하단 오른쪽',
  title: '제목', selectedLabel: '선택한 맛길 안내', searchPlaceholder: '검색창 안내', countLabel: '점포 수 안내', advisory: '확인 안내', emptyTitle: '검색 결과 없음 제목', emptyMessage: '검색 결과 없음 설명', preparingTitle: '점포 준비 중 제목', preparingDescription: '점포 준비 중 설명', resetLabel: '검색 초기화 버튼', priceLabel: '가격 항목', hoursLabel: '영업시간 항목', unconfirmedLabel: '미확인 정보 표시', menuUnconfirmedLabel: '대표 상품 미확인 표시', detailLabel: '자세히 보기 버튼',
  isVisible: '고객페이지에 표시', heading: '행사 제목', name: '이름', highlights: '프로그램 소개', date: '행사 날짜', schedule: '행사 시간', location: '행사 장소', programHours: '추가 운영시간', note: '추가 안내', linkLabel: '포스터 버튼', poster: '행사 포스터',
  notice: '하단 유의사항', headingLine1: '마무리 제목 첫째 줄', headingLine2: '마무리 제목 둘째 줄', tagline: '하단 소개', organization: '운영 주체', analyticsNote: '하단 안내 문구', adminLabel: '관리자 작업실 버튼',
  navy: '기본 글자·남색', cream: '페이지 배경', white: '목록·카드 배경', blue: '선택·강조', mutedBackground: '하단·보조 배경', yellow: '표지·노란색', fontSize: '기본 글자 크기', logoSeconds: '기관 띠 이동 속도(클수록 느림)',
}
const sections = [ ['site', '사이트 이름·메뉴'], ['hero', '첫 화면'], ['routesSection', '맛길 안내·점포 목록'], ['festival', '행사 안내'], ['routePage', '미식루트 상세 페이지'], ['festivalPage', '행사 안내 상세 페이지'], ['mapPage', '지도 페이지·이미지'], ['footer', '하단 문구'], ['design', '색상·디자인'] ]
function PhotoField({ label, value, onChange, onError }: { label: string; value: HomeMedia | null; onChange: (value: HomeMedia | null) => void; onError: (message: string) => void }) {
  const [busy, setBusy] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploaded, setUploaded] = useState<{ url: string; name: string } | null>(null)
  const fail = (message: string) => { setUploadError(message); onError(message) }
  return <div className="admin-photo"><strong>{label}</strong><p>JPG·PNG·WebP·SVG · 최대 5MB. SVG는 안전한 이미지로 변환합니다. 고객페이지 반영 전에는 관리자에게만 보입니다.</p>
    {value && <><img src={value.url} alt={value.alt} onError={() => setUploadError('첨부된 이미지를 불러오지 못했습니다. 로그인 상태를 확인한 뒤 다시 첨부해주세요.')} /><label>사진 설명<input value={value.alt} onChange={e => onChange({ ...value, alt: e.target.value })} /></label><button type="button" onClick={() => { onChange(null); setUploaded(null); setUploadError('') }}>사진 선택 해제</button></>}
    <div className="admin-file-actions"><label className="admin-file-picker" aria-disabled={busy}><span>{busy ? '업로드 중…' : value ? '파일 교체' : '＋ 파일 첨부'}</span>
      <input className="admin-file-input" aria-label={`${label} 업로드`} disabled={busy} type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml,.jpg,.jpeg,.png,.webp,.svg" onChange={async event => {
        const input = event.currentTarget
        const file = input.files?.[0]
        if (!file) return
        setUploadError('')
        if (!imageTypeForFile(file)) { fail('JPG·PNG·WebP·SVG 파일을 선택해주세요.'); input.value = ''; return }
        if (file.size > 5 * 1024 * 1024) { fail('사진은 5MB 이하로 올려주세요.'); input.value = ''; return }
        setBusy(true)
        try {
          const body = new FormData(); body.append('file', file)
          const response = await fetch('/api/admin/upload', { method: 'POST', body })
          const data = await response.json()
          if (!response.ok) throw new Error(data.error || '업로드에 실패했습니다.')
          onChange(data)
          setUploaded({ url: data.url, name: file.name })
        } catch (error) { fail((error as Error).message || '업로드에 실패했습니다.') }
        finally { setBusy(false); input.value = '' }
      }} />
    </label><span>{value ? '이미지가 첨부되어 있습니다.' : '버튼을 눌러 이미지를 선택하세요.'}</span></div>
    {busy && <p role="status">사진을 처리하고 있습니다…</p>}
    {uploadError && <p className="admin-error" role="alert">{uploadError}</p>}
    {!uploadError && uploaded?.url === value?.url && uploaded && <p role="status">첨부 완료: {uploaded.name}. 임시저장 또는 고객페이지 반영을 눌러 저장하세요.</p>}
  </div>
}

export default function AdminWorkspace({ initial, defaults }: { initial: ContentState; defaults: Content }) {
  const [content, setContent] = useState(initial.draft)
  const [saved, setSaved] = useState(initial)
  const [tab, setTab] = useState('copy')
  const [selectedSection, setSection] = useState('site')
  const section = sections.some(([key]) => key === selectedSection) ? selectedSection : 'site'
  const [mobile, setMobile] = useState(true)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [search, setSearch] = useState('')
  const [theme, setTheme] = useState('all')
  const [visibility, setVisibility] = useState('all')
  const [editing, setEditing] = useState<HomeStore | null>(null)
  const [storeError, setStoreError] = useState('')
  const [dirty, setDirty] = useState(false)
  const [programIndex, setProgramIndex] = useState(0)
  const [previewRouteId, setPreviewRouteId] = useState('')
  const previewPage = tab === 'themes' || tab === 'stores' ? 'routePage' : section
  const previewContent = editing ? { ...content, stores: content.stores.some(store => store.id === editing.id) ? content.stores.map(store => store.id === editing.id ? editing : store) : [...content.stores, editing] } : content
  const previewIssue = contentSchema.safeParse(previewContent).error?.issues[0]?.message
  const iframe = useRef<HTMLIFrameElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const sectionRef = useRef(previewPage); sectionRef.current = previewPage
  const previewRouteRef = useRef(previewRouteId); previewRouteRef.current = previewRouteId
  const contentRef = useRef(previewContent); contentRef.current = previewContent
  useEffect(() => {
    const receive = (event: MessageEvent) => { if (event.origin === location.origin && event.source === iframe.current?.contentWindow && event.data?.type === 'market-preview-ready') iframe.current?.contentWindow?.postMessage({ type: 'market-preview', page: sectionRef.current, routeId: previewRouteRef.current, content: contentRef.current }, location.origin) }
    addEventListener('message', receive); return () => removeEventListener('message', receive)
  }, [])
  useEffect(() => { iframe.current?.contentWindow?.postMessage({ type: 'market-preview', page: previewPage, routeId: previewRouteId, content: previewContent }, location.origin) }, [content, editing, previewPage, previewRouteId])
  useEffect(() => { const warn = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault() }; addEventListener('beforeunload', warn); return () => removeEventListener('beforeunload', warn) }, [dirty])
  useEffect(() => { if (editing) dialog.current?.showModal(); else dialog.current?.close() }, [editing?.id])
  const update = (next: Content) => { setContent(next); setDirty(true); setMessage('수정 중인 내용입니다. 고객페이지 반영 전에는 공개되지 않습니다.') }
  const updateSite = (key: string, value: unknown) => { setContent(current => ({ ...current, site: { ...current.site, [key]: value } })); setDirty(true); setMessage('수정 중인 내용입니다. 고객페이지 반영 전에는 공개되지 않습니다.') }
  const updateGroup = (group: string, key: string, value: unknown) => {
    setContent(previous => {
      const current = previous.site[group as keyof Content['site']] as object
      const site = { ...previous.site, [group]: { ...current, [key]: value } }
      if (['festival', 'festivalPage'].includes(group) && ['date', 'schedule', 'location'].includes(key)) {
        if (group === 'festival') site.festivalPage = { ...previous.site.festivalPage, [key]: value }
        else site.festival = { ...previous.site.festival, [key]: value }
      }
      return { ...previous, site }
    })
    setDirty(true); setMessage('수정 중인 내용입니다. 고객페이지 반영 전에는 공개되지 않습니다.')
  }
  const report = (text: string) => setMessage(text)
  const save = async (publish: boolean) => {
    setBusy(true); setMessage('저장 중입니다…')
    try {
      const res = await fetch('/api/admin/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content, revision: saved.revision, publish }) })
      const data = await res.json(); if (!res.ok) throw new Error(data.error)
      setSaved(data); setContent(data.draft); setDirty(false)
      setMessage(publish ? '고객페이지에 반영했습니다. 새로고침하면 변경 내용이 보입니다.' : '임시저장했습니다. 고객페이지는 아직 바뀌지 않았습니다.')
    } catch (error) { setMessage((error as Error).message || '저장에 실패했습니다.') } finally { setBusy(false) }
  }
  const reload = async () => {
    if (dirty && !confirm('저장하지 않은 수정을 버리고 다시 불러올까요?')) return
    setBusy(true)
    try { const res = await fetch('/api/admin/content', { cache: 'no-store' }); const data = await res.json(); if (!res.ok) throw new Error(data.error); setContent(data.draft); setSaved(data); setDirty(false); setMessage('저장된 내용을 불러왔습니다.') } catch (error) { report((error as Error).message) } finally { setBusy(false) }
  }
  const fields = (group: string, values: Record<string, unknown>) => Object.entries(values).map(([key, value]) => {
    const label = group === 'mapPage' && key === 'preparingDescription' ? '지도 준비 중 소개' : group === 'mapPage' && key === 'description' ? '지도 등록 후 소개' : group === 'festival' && key === 'detailLabel' ? '전체 프로그램 및 시간표 버튼' : labels[key] || key
    const change = (next: unknown) => group === 'site' ? updateSite(key, next) : updateGroup(group, key, next)
    if ((group === 'festival' && key === 'linkLabel') || (group === 'routesSection' && ['searchPlaceholder', 'emptyTitle', 'emptyMessage', 'resetLabel'].includes(key)) || (group === 'hero' && ['footLeft', 'footRight'].includes(key))) return null
    if (['image', 'poster', 'timetable'].includes(key)) return <PhotoField key={`${group}.${key}`} label={label} value={value as HomeMedia | null} onChange={change} onError={report} />
    if (group === 'festivalPage' && key === 'programs' && Array.isArray(value)) {
      const index = Math.min(programIndex, Math.max(0, value.length - 1))
      const selected = value[index] as Content['site']['festivalPage']['programs'][number] | undefined
      return <div key={key} className="admin-program-editor"><h3>{label}</h3><label>편집할 행사 선택<select aria-label="편집할 행사 선택" value={value.length ? index : ''} onChange={e => setProgramIndex(Number(e.target.value))}>{!value.length && <option value="">등록된 행사가 없습니다</option>}{value.map((program, i) => <option key={i} value={i}>{program.title || '제목 없는 행사'}</option>)}</select></label>
        {selected && <fieldset><legend>{selected.title || '행사 상세'}</legend>{Object.entries(selected).map(([field, entry]) => <label key={field}>{labels[field] || field}{field === 'color' ? <select aria-label={labels[field] || field} value={entry} onChange={e => change(value.map((item, i) => i === index ? { ...item, [field]: e.target.value } : item))}>{['yellow', 'blue', 'orange', 'olive'].map(color => <option key={color} value={color}>{{ yellow: '노랑', blue: '파랑', orange: '주황', olive: '검정' }[color]}</option>)}</select> : <textarea aria-label={labels[field] || field} value={entry} maxLength={4000} onChange={e => change(value.map((item, i) => i === index ? { ...item, [field]: e.target.value } : item))} />}</label>)}<button type="button" onClick={() => { if (confirm('선택한 행사를 목록에서 삭제할까요?')) { change(value.filter((_, i) => i !== index)); setProgramIndex(Math.max(0, index - 1)) } }}>선택한 행사 삭제</button><button type="button" disabled={index === 0} onClick={() => { const next = [...value]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; change(next); setProgramIndex(index - 1) }}>위로 이동</button><button type="button" disabled={index === value.length - 1} onClick={() => { const next = [...value]; [next[index + 1], next[index]] = [next[index], next[index + 1]]; change(next); setProgramIndex(index + 1) }}>아래로 이동</button></fieldset>}
        <button type="button" disabled={value.length >= 50} onClick={() => { change([...value, { title: '새 행사', time: '', place: '', description: '', color: 'blue' }]); setProgramIndex(value.length) }}>행사 추가</button></div>
    }
    if (typeof value === 'boolean') return <label key={key} className="admin-check"><input type="checkbox" checked={value} onChange={e => change(e.target.checked)} />{label}</label>
    if (typeof value === 'number') return <label key={key}>{label}<input aria-label={label} type="number" min={key === 'fontSize' ? 12 : 10} max={key === 'fontSize' ? 22 : 90} value={value} onChange={e => change(Number(e.target.value))} /></label>
    if (group === 'design') return <label key={key}>{label}<div className="admin-color"><input aria-label={`${label} 선택`} type="color" value={String(value)} onChange={e => change(e.target.value)} /><input aria-label={label} value={String(value)} maxLength={7} pattern="#[0-9A-Fa-f]{6}" onChange={e => change(e.target.value)} /></div></label>
    return <Fragment key={key}>{group === 'routesSection' && key === 'selectedLabel' && <label>미리볼 맛길<select aria-label="미리볼 맛길" value={previewRouteId} onChange={e => setPreviewRouteId(e.target.value)}><option value="">첫 번째 공개 맛길</option>{content.routes.filter(route => route.isVisible).map(route => <option key={route.id} value={route.id}>{route.name}</option>)}</select></label>}<label>{label}<textarea aria-label={label} rows={key === 'metaDescription' ? 3 : 2} value={String(value ?? '')} maxLength={['brand', 'metaTitle'].includes(key) ? 160 : 4000} onChange={e => change(e.target.value)} /></label></Fragment>
  })
  const siteRootFields = Object.fromEntries(Object.entries(content.site).filter(([key, value]) => typeof value === 'string' && key !== 'notice'))
  const visibleStores = content.stores.filter(s => `${s.name} ${s.menu}`.toLowerCase().includes(search.toLowerCase()) && (theme === 'all' || s.routeIds.includes(theme)) && (visibility === 'all' || s.isVisible === (visibility === 'visible')))
  return <div className="admin-workspace">
    <header className="admin-top"><div><strong>나의 시장 작업실</strong><span>관리자 전용</span></div><nav><a href="/" target="_blank" rel="noreferrer">고객페이지 열기 ↗</a><button onClick={async () => { if (dirty && !confirm('저장하지 않은 수정이 있습니다. 로그아웃할까요?')) return; const res = await fetch('/api/admin/logout', { method: 'POST' }); if (res.ok) location.assign('/admin/login'); else report('로그아웃에 실패했습니다.') }}>로그아웃</button></nav></header>
    <nav className="admin-tabs" aria-label="관리 항목">{[['copy', '문구·사진·디자인'], ['themes', '미식루트 테마 관리'], ['stores', '점포 관리']].map(([key, title]) => <button key={key} aria-pressed={tab === key} className={tab === key ? 'active' : ''} onClick={() => setTab(key)}>{title}</button>)}</nav>
    <div className="admin-savebar"><p role="status">{message || '현재 저장된 초안을 편집 중입니다.'}</p><div><button disabled={busy} onClick={() => save(false)}>임시저장</button><button className="admin-primary" disabled={busy} onClick={() => save(true)}>고객페이지 반영</button></div></div>
    <div className="admin-toolbar"><button disabled={busy} onClick={reload}>저장된 내용 다시 불러오기</button><button onClick={() => { if (confirm('현재 공개된 내용으로 편집 내용을 되돌릴까요?')) update(structuredClone(saved.published)) }}>현재 공개본 불러오기</button><a href="/api/admin/content?download=1">저장 데이터 백업 ↓</a><span>마지막 공개: {saved.publishedAt ? new Date(saved.publishedAt).toLocaleString('ko-KR') : '초기 콘텐츠'}</span></div>
    <div className={`admin-columns ${tab !== 'copy' ? 'stores-layout' : ''}`}><section className="admin-editor" inert={busy}>
      {tab === 'copy' && <><h1>사이트를 직접 편집하세요.</h1><p>문구·사진·색상을 바꾸면 오른쪽 미리보기가 바뀝니다. 고객페이지 반영을 눌러야 방문자에게 공개됩니다.</p><nav className="admin-section-tabs">{sections.map(([key, title]) => <button key={key} className={section === key ? 'active' : ''} onClick={() => setSection(key)}>{title}</button>)}</nav><h2>{sections.find(([key]) => key === section)?.[1]}</h2>{['festival', 'festivalPage'].includes(section) && <p>날짜·시간·장소는 행사 안내와 상세 페이지에서 함께 수정됩니다. 기존 값은 편집 전까지 보존됩니다.</p>}{fields(section, section === 'site' ? siteRootFields : content.site[section as keyof Content['site']] as unknown as Record<string, unknown>)}{section === 'footer' && fields('site', { notice: content.site.notice })}<button onClick={() => { if (confirm('이 영역의 기본 문구와 설정을 불러올까요?')) { if (section === 'site') { const next = { ...content.site }; for (const key of Object.keys(siteRootFields)) (next as unknown as Record<string, unknown>)[key] = (defaults.site as unknown as Record<string, unknown>)[key]; update({ ...content, site: next }) } else updateSite(section, defaults.site[section as keyof Content['site']]) } }}>이 영역 기본값 불러오기</button></>}
      {tab === 'themes' && <ThemeManager routes={content.routes} stores={content.stores} onChange={routes => update({ ...content, routes })} />}
      {tab === 'stores' && <div className="store-manager">
        <div className="store-manager-heading"><div><p className="store-eyebrow">GUWOL MORAENAE / STORES</p><h1>점포 관리<span>{content.stores.length}</span></h1><p>점포를 선택해 정보를 확인하고 수정하세요.</p></div><button className="admin-primary store-add-button" onClick={() => { setStoreError(''); setEditing({ id: crypto.randomUUID(), name: '', menu: '', price: '', hours: '', image: null, routeIds: [], isVisible: false }) }}><span aria-hidden="true">＋</span> 점포 추가</button></div>
        <div className="store-summary" aria-label="점포 노출상태 필터">{[['all', '전체 점포', content.stores.length], ['visible', '공개', content.stores.filter(s => s.isVisible).length], ['hidden', '비공개', content.stores.filter(s => !s.isVisible).length]].map(([key, title, count]) => <button key={key} className={visibility === key ? 'selected' : ''} aria-pressed={visibility === key} onClick={() => setVisibility(String(key))}><span className={'store-status-dot ' + key} aria-hidden="true" />{title}<strong>{count}</strong></button>)}</div>
        <div className="store-list-panel"><div className="store-list-toolbar"><label className="store-search"><span aria-hidden="true">⌕</span><span className="sr-only">점포명·대표 상품 검색</span><input type="search" placeholder="점포명 또는 대표 상품으로 검색" value={search} onChange={e => setSearch(e.target.value)} /></label><label className="store-theme-filter"><span className="sr-only">미식루트 필터</span><select value={theme} onChange={e => setTheme(e.target.value)}><option value="all">전체 미식루트</option>{content.routes.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}</select></label>{(search || theme !== 'all' || visibility !== 'all') && <button className="store-reset" onClick={() => { setSearch(''); setTheme('all'); setVisibility('all') }}>필터 초기화</button>}</div>
          <div className="store-list-meta"><span>검색 결과 <strong>{visibleStores.length}</strong>개</span><span>행을 누르면 상세 편집창이 열립니다.</span></div>
          <div className="store-list-head" aria-hidden="true"><span>점포 / 대표 상품</span><span>미식루트</span><span>가격대 / 영업시간</span><span>노출상태</span><span /></div>
          <ul className="store-list" aria-label="점포 목록">{visibleStores.map(store => <li key={store.id}><button type="button" className="store-list-row" aria-label={store.name + ' 상세 편집'} onClick={() => { setStoreError(''); setEditing(structuredClone(store)) }}>
            <span className="store-identity"><span className="store-thumbnail">{store.image ? <img src={store.image.url} alt="" /> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 10v10h16V10M3 10l2-6h14l2 6M3 10c0 3 4 3 4 0 0 3 5 3 5 0 0 3 5 3 5 0 0 3 4 3 4 0M9 20v-6h6v6" /></svg>}</span><span className="store-name-copy"><strong>{store.name}</strong><span>{store.menu || content.site.routesSection.menuUnconfirmedLabel}</span></span></span>
            <span className="store-theme-tags">{store.routeIds.length ? store.routeIds.map(id => <span key={id}>{content.routes.find(r => r.id === id)?.name || '미선택'}</span>) : <span className="unassigned">미식루트 미선택</span>}</span>
            <span className="store-operating"><span>{store.price || '가격 확인 중'}</span><small>{store.hours || '영업시간 확인 중'}</small></span>
            <span className={store.isVisible ? 'store-visibility is-visible' : 'store-visibility'}><span aria-hidden="true" />{store.isVisible ? '공개' : '비공개'}</span><span className="store-row-arrow" aria-hidden="true">↗</span>
          </button></li>)}</ul>
          {!visibleStores.length && <div className="store-list-empty"><span aria-hidden="true">⌕</span><h2>{content.stores.length ? '조건에 맞는 점포가 없어요' : '첫 번째 점포를 등록해보세요'}</h2><p>{content.stores.length ? '검색어를 바꾸거나 필터를 초기화해보세요.' : '점포 추가 버튼으로 대표 상품과 사진, 미식루트를 등록할 수 있습니다.'}</p><button onClick={() => { if (content.stores.length) { setSearch(''); setTheme('all'); setVisibility('all') } else { setStoreError(''); setEditing({ id: crypto.randomUUID(), name: '', menu: '', price: '', hours: '', image: null, routeIds: [], isVisible: false }) } }}>{content.stores.length ? '필터 초기화' : '점포 추가'}</button></div>}
        </div><p className="store-manager-footnote">구월모래내시장 통합 관리 · 편집 후 임시저장하거나 고객페이지에 반영해주세요.</p>
      </div>}
    </section><aside className="admin-preview"><div className="admin-preview-head"><div><h2>실시간 미리보기</h2><p>수정 중인 내용 · 관리자만 볼 수 있어요</p></div><div><button className={mobile ? 'active' : ''} onClick={() => setMobile(true)}>모바일</button><button className={!mobile ? 'active' : ''} onClick={() => setMobile(false)}>PC</button></div></div>{previewIssue && <p role="alert">미리보기는 마지막 정상 입력을 표시합니다: {previewIssue}</p>}<div className="admin-preview-stage"><iframe ref={iframe} title="고객페이지 실시간 미리보기" src="/admin/preview" className={mobile ? 'mobile' : 'desktop'} /></div><p>미리보기 안에서 스크롤하거나 미식루트를 선택해 확인할 수 있습니다.</p></aside></div>
    <dialog className="admin-store-dialog store-editor-dialog" ref={dialog} aria-labelledby="store-editor-title" aria-describedby="store-editor-description" onCancel={() => setEditing(null)} onClose={() => setEditing(null)}>{editing && <form onSubmit={e => {
      e.preventDefault()
      if (!editing.name.trim()) { setStoreError('점포명을 입력해주세요.'); return }
      if (editing.isVisible && !editing.routeIds.length) { setStoreError('공개할 점포는 미식루트를 하나 이상 선택해주세요.'); return }
      update({ ...content, stores: content.stores.some(s => s.id === editing.id) ? content.stores.map(s => s.id === editing.id ? { ...editing, name: editing.name.trim(), menus: [...new Set((editing.menus ?? []).map(menu => menu.trim()).filter(Boolean))] } : s) : [...content.stores, { ...editing, name: editing.name.trim() }] }); setEditing(null)
    }}><div className="store-editor-header"><div><p className="store-eyebrow">GUWOL MORAENAE / STORE DETAILS</p><h2 id="store-editor-title">{content.stores.some(s => s.id === editing.id) ? '점포 상세 편집' : '새 점포 추가'}</h2><p id="store-editor-description">기본 정보와 사진, 연결할 미식루트를 관리하세요.</p></div><button className="store-editor-close" type="button" aria-label="점포 편집창 닫기" onClick={() => setEditing(null)}>✕</button></div>
      <div className="store-editor-body">{storeError && <p className="admin-error" role="alert">{storeError}</p>}<section className="store-editor-basics"><div className="store-form-section-heading"><span>01</span><h3>기본 정보</h3></div><div className="store-form-grid"><label className="store-field-wide">점포명 <span className="store-required">*</span><input autoFocus required placeholder="점포 이름을 입력하세요" maxLength={160} value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} /></label><label className="store-field-wide">대표 상품<textarea placeholder="대표 상품이나 메뉴를 입력하세요" maxLength={4000} value={editing.menu} onChange={e => setEditing({ ...editing, menu: e.target.value })} /></label>{(['price', 'hours'] as const).map(key => <label key={key}>{{ price: '가격대', hours: '영업시간·휴무' }[key]}<textarea placeholder={key === 'price' ? '예: 5,000원 ~ 10,000원' : '예: 10:00–20:00 / 매주 월요일 휴무'} maxLength={4000} value={editing[key]} onChange={e => setEditing({ ...editing, [key]: e.target.value })} /></label>)}</div></section>
      <section className="store-menu-editor"><div className="store-form-section-heading"><span>메뉴</span><h3>메뉴 선택 항목</h3></div><label>메뉴 (한 줄에 하나)<textarea placeholder={'예: 국수\n순대\n김밥'} value={(editing.menus ?? []).join('\n')} onChange={e => setEditing({ ...editing, menus: e.target.value.split('\n') })} onBlur={e => setEditing({ ...editing, menus: [...new Set(e.target.value.split('\n').map(menu => menu.trim()).filter(Boolean))] })} /></label><p className="store-menu-help">테마를 선택한 고객이 이 메뉴로 점포를 찾을 수 있습니다. 비워두면 대표 상품을 선택 항목으로 사용합니다.</p></section><section><div className="store-form-section-heading"><span>02</span><h3>점포 사진</h3></div><PhotoField label="대표 사진" value={editing.image} onChange={image => setEditing(current => current?.id === editing.id ? { ...current, image } : current)} onError={setStoreError} /></section>
      <section><div className="store-form-section-heading"><span>03</span><h3>미식루트 연결</h3><small>여러 개 선택 가능</small></div><div className="store-theme-options" role="group" aria-label="미식루트 테마 선택">{content.routes.map(route => <label key={route.id} className={editing.routeIds.includes(route.id) ? 'selected' : ''}><input type="checkbox" checked={editing.routeIds.includes(route.id)} onChange={e => setEditing({ ...editing, routeIds: e.target.checked ? [...editing.routeIds, route.id] : editing.routeIds.filter(id => id !== route.id) })} /><span><strong>{route.name}</strong><small>{route.isVisible ? route.description : '비공개 테마'}</small></span></label>)}</div>{!content.routes.length && <p>미식루트 테마 관리에서 테마를 먼저 추가해주세요.</p>}</section>
      <section className="store-publish-setting"><div><h3>고객페이지 공개</h3><p>확인한 정보만 공개해주세요. 비공개 점포는 고객에게 보이지 않습니다.</p></div><label className="store-switch"><input aria-label="고객페이지에 공개" type="checkbox" checked={editing.isVisible} onChange={e => setEditing({ ...editing, isVisible: e.target.checked })} /><span aria-hidden="true" /><strong>{editing.isVisible ? '공개' : '비공개'}</strong></label></section></div>
      <div className="store-editor-footer"><p>적용 후 상단에서 저장 또는 공개 반영해주세요.</p><div><button type="button" onClick={() => setEditing(null)}>취소</button><button className="admin-primary" type="submit">{content.stores.some(s => s.id === editing.id) ? '수정 내용 적용' : '점포 추가하기'}</button></div></div>
    </form>}</dialog>
  </div>
}
