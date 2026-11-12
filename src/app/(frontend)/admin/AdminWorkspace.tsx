'use client'
import { Fragment, useEffect, useRef, useState } from 'react'
import { contentSchema, type Content, type HomeMedia } from '@/lib/content-schema'
import type { ContentState } from '@/lib/content-store'
import './admin.css'
import './preview-visibility.css'
import { imageTypeForFile } from '@/lib/upload-types'

const labels: Record<string, string> = {
  menuTagline: '전체 메뉴 하단 문구', linkedEyebrow: '연계 행사 안내 제목', linkedDescription: '연계 행사 혜택', linkedNote: '연계 행사 유의사항', eventDescription: '지도 행사 공간 소개', eventLinkLabel: '지도 행사 안내 버튼',
  timetable: '전체 타임테이블', speakerImage: '말왕 안내 이미지', schoolTimetable: '스쿨뮤직 타임테이블', djTimetable: 'DJ 타임테이블', timetableTitle: '시간표 제목', programTitle: '프로그램 영역 제목', programs: '프로그램 목록', time: '시간', place: '장소', color: '포인트 색상', linkedTitle: '연계 행사 제목', linkedSchedule: '연계 행사 일정', linkedLocation: '연계 행사 장소', placeholderTitle: '지도 준비 중 제목', placeholderDescription: '지도 준비 중 설명',
  brand: '상단 사이트 이름', metaTitle: '브라우저·검색 제목', metaDescription: '검색 소개', navEventLabel: '행사 메뉴',
  kicker: '히어로 상단 영문', brandTitle: '행사 영문 이름', eventDate: '히어로 행사 일시', eventLocation: '히어로 행사 장소', programLine: '히어로 프로그램 목록',
  eyebrow: '표지 탭', titleLine1: '큰 제목 첫째 줄', titleLine2: '큰 제목 둘째 줄', description: '소개', ctaLabel: '행사 안내 버튼', image: '대표 사진', caption: '사진 아래 문구', footLeft: '표지 하단 왼쪽', footRight: '표지 하단 오른쪽',
  title: '제목', isVisible: '고객페이지에 표시', heading: '행사 제목', name: '이름', highlights: '프로그램 소개', date: '행사 날짜', schedule: '행사 시간', location: '행사 장소', programHours: '추가 운영시간', note: '추가 안내', linkLabel: '포스터 버튼', poster: '행사 포스터',
  notice: '하단 유의사항', headingLine1: '마무리 제목 첫째 줄', headingLine2: '마무리 제목 둘째 줄', tagline: '하단 소개', organization: '운영 주체', analyticsNote: '하단 안내 문구', adminLabel: '관리자 작업실 버튼',
  navy: '기본 글자·남색', cream: '페이지 배경', white: '목록·카드 배경', blue: '선택·강조', mutedBackground: '하단·보조 배경', yellow: '표지·노란색', fontSize: '기본 글자 크기', logoSeconds: '기관 띠 이동 속도(클수록 느림)',
}
const sections = [ ['site', '사이트 이름·메뉴'], ['hero', '첫 화면'], ['festival', '행사 안내'], ['festivalPage', '행사 안내 상세 페이지'], ['mapPage', '지도 페이지·이미지'], ['footer', '하단 문구'], ['design', '색상·디자인'] ]
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
  const [selectedSection, setSection] = useState('site')
  const section = sections.some(([key]) => key === selectedSection) ? selectedSection : 'site'
  const [mobile, setMobile] = useState(true)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [programIndex, setProgramIndex] = useState(0)
  const previewPage = section
  const previewContent = content
  const previewIssue = contentSchema.safeParse(previewContent).error?.issues[0]?.message
  const iframe = useRef<HTMLIFrameElement>(null)
  const sectionRef = useRef(previewPage); sectionRef.current = previewPage
  const contentRef = useRef(previewContent); contentRef.current = previewContent
  useEffect(() => {
    const receive = (event: MessageEvent) => { if (event.origin === location.origin && event.source === iframe.current?.contentWindow && event.data?.type === 'market-preview-ready') iframe.current?.contentWindow?.postMessage({ type: 'market-preview', page: sectionRef.current, content: contentRef.current }, location.origin) }
    addEventListener('message', receive); return () => removeEventListener('message', receive)
  }, [])
  useEffect(() => { iframe.current?.contentWindow?.postMessage({ type: 'market-preview', page: previewPage, content: previewContent }, location.origin) }, [content, previewPage])
  useEffect(() => { const warn = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault() }; addEventListener('beforeunload', warn); return () => removeEventListener('beforeunload', warn) }, [dirty])
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
    if ((group === 'festival' && key !== 'isVisible') || (group === 'mapPage' && ['routesDescription', 'routesLinkLabel'].includes(key)) || (group === 'hero' && ['footLeft', 'footRight', 'ctaLabel', 'programLine'].includes(key))) return null
    if (['image', 'poster', 'timetable', 'speakerImage', 'schoolTimetable', 'djTimetable'].includes(key)) return <PhotoField key={`${group}.${key}`} label={label} value={value as HomeMedia | null} onChange={change} onError={report} />
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
    return <Fragment key={key}><label>{label}<textarea aria-label={label} rows={key === 'metaDescription' ? 3 : 2} value={String(value ?? '')} maxLength={['brand', 'metaTitle'].includes(key) ? 160 : 4000} onChange={e => change(e.target.value)} /></label></Fragment>
  })
  const siteRootFields = Object.fromEntries(Object.entries(content.site).filter(([key, value]) => typeof value === 'string' && !['notice', 'navRoutesLabel'].includes(key)))
  return <div className="admin-workspace">
    <header className="admin-top"><div><strong>나의 시장 작업실</strong><span>관리자 전용</span></div><nav><a href="/" target="_blank" rel="noreferrer">고객페이지 열기 ↗</a><button onClick={async () => { if (dirty && !confirm('저장하지 않은 수정이 있습니다. 로그아웃할까요?')) return; const res = await fetch('/api/admin/logout', { method: 'POST' }); if (res.ok) location.assign('/admin/login'); else report('로그아웃에 실패했습니다.') }}>로그아웃</button></nav></header>
    <div className="admin-savebar"><p role="status">{message || '현재 저장된 초안을 편집 중입니다.'}</p><div><button disabled={busy} onClick={() => save(false)}>임시저장</button><button className="admin-primary" disabled={busy} onClick={() => save(true)}>고객페이지 반영</button></div></div>
    <div className="admin-toolbar"><button disabled={busy} onClick={reload}>저장된 내용 다시 불러오기</button><button onClick={() => { if (confirm('현재 공개된 내용으로 편집 내용을 되돌릴까요?')) update(structuredClone(saved.published)) }}>현재 공개본 불러오기</button><a href="/api/admin/content?download=1">저장 데이터 백업 ↓</a><span>마지막 공개: {saved.publishedAt ? new Date(saved.publishedAt).toLocaleString('ko-KR') : '초기 콘텐츠'}</span></div>
    <div className="admin-columns"><section className="admin-editor" inert={busy}>
      <><h1>사이트를 직접 편집하세요.</h1><p>문구·사진·색상을 바꾸면 오른쪽 미리보기가 바뀝니다. 고객페이지 반영을 눌러야 방문자에게 공개됩니다.</p><nav className="admin-section-tabs">{sections.map(([key, title]) => <button key={key} className={section === key ? 'active' : ''} onClick={() => setSection(key)}>{title}</button>)}</nav><h2>{sections.find(([key]) => key === section)?.[1]}</h2>{['festival', 'festivalPage'].includes(section) && <p>날짜·시간·장소는 행사 안내와 상세 페이지에서 함께 수정됩니다. 기존 값은 편집 전까지 보존됩니다.</p>}{fields(section, section === 'site' ? siteRootFields : content.site[section as keyof Content['site']] as unknown as Record<string, unknown>)}<button onClick={() => { if (confirm('이 영역의 기본 문구와 설정을 불러올까요?')) { if (section === 'site') { const next = { ...content.site }; for (const key of Object.keys(siteRootFields)) (next as unknown as Record<string, unknown>)[key] = (defaults.site as unknown as Record<string, unknown>)[key]; update({ ...content, site: next }) } else updateSite(section, defaults.site[section as keyof Content['site']]) } }}>이 영역 기본값 불러오기</button></>
    </section><aside className="admin-preview"><div className="admin-preview-head"><div><h2>실시간 미리보기</h2><p>수정 중인 내용 · 관리자만 볼 수 있어요</p></div><div><button className={mobile ? 'active' : ''} onClick={() => setMobile(true)}>모바일</button><button className={!mobile ? 'active' : ''} onClick={() => setMobile(false)}>PC</button></div></div>{previewIssue && <p role="alert">미리보기는 마지막 정상 입력을 표시합니다: {previewIssue}</p>}<div className="admin-preview-stage"><iframe ref={iframe} title="고객페이지 실시간 미리보기" src="/admin/preview" className={mobile ? 'mobile' : 'desktop'} /></div><p>미리보기 안에서 행사와 지도 안내를 확인할 수 있습니다.</p></aside></div>

  </div>
}
