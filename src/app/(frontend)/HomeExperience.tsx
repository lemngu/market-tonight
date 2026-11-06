'use client'

import Image from 'next/image'

import { useMemo, useState } from 'react'
import MenuSelect from './MenuSelect'
import { createDemoStores } from '@/lib/demo-stores'
import type { HomeMedia, HomeRoute, HomeStore } from '@/lib/home-data'

import type { CSSProperties } from 'react'
import type { SiteCopy } from '@/lib/content-schema'
import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'
import PatternRibbon from './PatternRibbon'
import StoreModal from './StoreModal'
import { getRouteColors } from '@/lib/route-colors'

function routeStyle(id: string, index = 0): CSSProperties {
  const palette = getRouteColors(id, index)
  return { '--route-color': palette.color, '--route-accent': palette.accent, '--route-tint': palette.tint, '--route-ink': palette.ink, '--route-strong': palette.strong } as CSSProperties
}

export default function HomeExperience({
  site,
  routes,
  stores,
  showDemo = false,
  detailMode = false,
  initialRouteID,
}: {
  site: SiteCopy
  routes: HomeRoute[]
  stores: HomeStore[]
  showDemo?: boolean
  detailMode?: boolean
  initialRouteID?: string
}) {
  const [selectedStore, setSelectedStore] = useState<HomeStore | null>(null)
  const [demoEnabled, setDemoEnabled] = useState(showDemo && stores.length === 0)
  const [page, setPage] = useState(1)
  const sourceStores = useMemo(() => demoEnabled ? createDemoStores(routes) : stores, [demoEnabled, routes, stores])
  const [activeRouteID, setActiveRouteID] = useState(initialRouteID ?? routes[0]?.id ?? '')
  const [selectedMenu, setSelectedMenu] = useState('')
  const activeRoute = routes.find((route) => route.id === activeRouteID) ?? routes[0]
  const routeStores = useMemo(() => sourceStores.filter(store => activeRoute && store.routeIds.includes(activeRoute.id)), [activeRoute, sourceStores])
  const menusForStore = (store: HomeStore) => store.menus?.length ? store.menus : (store.menu.trim() ? [store.menu.trim()] : [])
  const menuOptions = Array.from(new Set(routeStores.flatMap(menusForStore))).sort((a,b) => a.localeCompare(b,'ko'))
  const currentMenu = menuOptions.includes(selectedMenu) ? selectedMenu : ''
  const visibleStores = routeStores.filter(store => !currentMenu || menusForStore(store).includes(currentMenu))

  const pageSize = 6
  const totalPages = Math.max(1, Math.ceil(visibleStores.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pagedStores = visibleStores.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const poster = site.festival.poster

  return (
    <div className={detailMode ? "site-shell route-detail-shell" : "site-shell"} style={{ '--navy': site.design.navy, '--ink': site.design.navy, '--cream': site.design.cream, '--white': site.design.white, '--blue': site.design.blue, '--muted-background': site.design.mutedBackground, '--yellow': site.design.yellow, '--content-font-size': site.design.fontSize + 'px', '--logo-seconds': site.design.logoSeconds + 's' } as CSSProperties}>
      <SiteHeader site={site} />

      <main id="top">
        {detailMode && <div className="detail-page-inner route-detail-heading"><a className="detail-breadcrumb" href="/">홈 / 미식루트</a><header className="detail-page-heading"><span>{site.routePage.eyebrow}</span><h1>{site.routePage.title}</h1><p>{site.routePage.description}</p></header></div>}
        {!detailMode && <><section className="hero hero-editorial"><div className="hero-inner">
          <div aria-hidden="true" className="hero-shape hero-shape-one" />
          <div aria-hidden="true" className="hero-shape hero-shape-two" />
          <div className="hero-label">
            <span>KOREA GRAND FESTIVAL</span>
            {site.hero.eyebrow}
          </div>
          <div className="hero-card">
            <div className="hero-copy">
              <p className="hero-kicker">{site.hero.kicker}</p>
              <h1>
                <span>{site.hero.titleLine1}</span>
                <span>{site.hero.titleLine2}</span>
              </h1>
              <p className="hero-brand-title">{site.hero.brandTitle}</p>
              <p className="hero-description">{site.hero.description}</p>
              <dl className="hero-event-info">
                <div><dt className="sr-only">행사 일시</dt><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="5" width="18" height="16" rx="1"/><path d="M7 2v6m10-6v6M3 11h18M7 15h2m3 0h2m3 0h1M7 18h2m3 0h2"/></svg><dd>{site.hero.eventDate}</dd></div>
                <div><dt className="sr-only">행사 장소</dt><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg><dd>{site.hero.eventLocation}</dd></div>
              </dl>
              <p className="hero-program-line">{site.hero.programLine}</p>
              <a className="primary-button" href="#routes">
                {site.hero.ctaLabel} <span aria-hidden="true">↘</span>
              </a>
            </div>
            <figure className="hero-figure">
              <div className="hero-image">
                {site.hero.image ? (
                  <Image unoptimized
                    alt={site.hero.image.alt}
                    height={site.hero.image.height}
                    priority
                    sizes="(max-width: 700px) 100vw, 360px"
                    src={site.hero.image.url}
                    width={site.hero.image.width}
                  />
                ) : (
                  <span className="image-empty">대표 이미지를 등록해주세요.</span>
                )}
              </div>
              <figcaption>
                <span>UPCOMING</span>
                {site.hero.caption}
              </figcaption>
            </figure>
            <div className="hero-foot" aria-hidden="true" />
          </div>
          <a aria-label="맛길 섹션으로 이동" className="scroll-cue" href="#routes">
            <b aria-hidden="true">↓</b>
          </a>
        </div></section>

        <PatternRibbon /></>}

        <div className="content-wrap">
          <section className="routes-section" id="routes" style={routeStyle(activeRoute?.id ?? '', routes.findIndex(route => route.id === activeRoute?.id))}><div className="routes-inner">
            <div className="routes-heading">
              <span className="section-label">01 / TASTE ROUTES</span>
              <h2>{detailMode ? site.routePage.sectionTitle : site.routesSection.title}</h2>
              <p>{site.routesSection.description}</p>{!detailMode && <a className="route-detail-link" href="/routes">{site.routesSection.browseLabel} →</a>}
            </div>

            {routes.length > 0 ? (
              <>
                <div className="tabs" role="tablist" aria-label="미식루트">
                  {routes.map((route, index) => (
                    <button
                      aria-controls="route-panel"
                      aria-selected={activeRoute?.id === route.id}
                      className={activeRoute?.id === route.id ? 'active' : ''}
                      key={route.id}
                      style={routeStyle(route.id, index)}
                      onClick={() => { setActiveRouteID(route.id); setSelectedMenu(''); setPage(1) }}
                      role="tab"
                      type="button"
                    >
                      {route.name}
                    </button>
                  ))}
                </div>

                <div className="route-panel" id="route-panel" role="tabpanel">
                  <div className="panel-head">
                    <div>
                      <span className="selected-route-label">{site.routesSection.selectedLabel}</span><h3>{activeRoute?.name}</h3>
                      <p>{activeRoute?.introduction || activeRoute?.description}</p>
                    </div>
                    <MenuSelect key={activeRoute?.id} options={menuOptions} value={currentMenu} onChange={value => { setSelectedMenu(value); setPage(1) }} />
                  </div>

                  {showDemo && <div className="demo-store-notice"><p>{demoEnabled ? '디자인 확인용 예시 점포입니다. 실제 영업 정보가 아닙니다.' : '공개된 실제 점포를 표시하고 있습니다.'}</p><button type="button" onClick={() => { setDemoEnabled(!demoEnabled); setSelectedMenu(''); setPage(1) }}>{demoEnabled ? '실제 점포 보기' : '예시 점포 보기'}</button></div>}
                  <div className="result-meta">
                    <span>
                      {demoEnabled ? '예시 점포' : site.routesSection.countLabel} <strong>{visibleStores.length}</strong>{site.routesSection.countSuffix}
                    </span>
                    <span>{site.routesSection.advisory}</span>
                  </div>

                  <div className="store-grid">
                    {visibleStores.length > 0 ? (
                      pagedStores.map((store) => (
                        <article className="store-card" key={store.id}>
                          <div className="store-photo-wrap">{store.image ? <Image unoptimized alt={store.image.alt || store.name + ' 점포 사진'} className="store-photo" src={store.image.url} width={store.image.width} height={store.image.height} sizes="(max-width:767px) 100px, 120px" /> : <div className="store-photo-placeholder" aria-label="사진 준비 중"><svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M8 20v21h32V20M5 20l5-12h28l5 12M5 20c0 6 9 6 9 0 0 6 10 6 10 0 0 6 10 6 10 0 0 6 9 6 9 0M19 41V29h10v12" stroke="currentColor" strokeWidth="2" /></svg><span>사진 준비 중</span></div>}</div>
                          <div className="store-card-content">
                          <h3>{store.name}</h3>
                          <p className="menu-name">{store.menu || site.routesSection.menuUnconfirmedLabel}</p>
                          <dl>
                            <div>
                              <dt>{site.routesSection.priceLabel}</dt>
                              <dd>{store.price || site.routesSection.unconfirmedLabel}</dd>
                            </div>
                            <div>
                              <dt>{site.routesSection.hoursLabel}</dt>
                              <dd>{store.hours || site.routesSection.unconfirmedLabel}</dd>
                            </div>
                          </dl>
                          <button className="store-detail-button" type="button" onClick={() => setSelectedStore(store)}>{site.routesSection.detailLabel} <span aria-hidden="true">→</span></button>
                          </div>
                        </article>
                      ))
                    ) : (
                      <div className="empty-result"><strong>{site.routesSection.preparingTitle}</strong><p>{site.routesSection.preparingDescription}</p></div>
                    )}
                  </div>
                  <nav className="store-pagination" aria-label="점포 페이지"><button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} aria-label="이전 점포 페이지">← 이전</button><span><strong>{currentPage}</strong> / {totalPages}</span><button type="button" disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)} aria-label="다음 점포 페이지">다음 →</button></nav>
                </div>
              </>
            ) : (
              <div className="empty-result routes-empty">
                {site.routesSection.preparingTitle}
              </div>
            )}
          </div></section>

          {!detailMode && site.festival.isVisible && <section className="festival" id="festival"><div className="festival-inner">
            <div className="festival-copy">
              <span className="section-label">02 / MARKET NIGHT</span>
              <h2>{site.festival.heading}</h2>
              <strong>{site.festival.name}</strong>
              <p>{site.festival.highlights}</p>
              <div className="festival-date">
                <b>{site.festival.date}</b>
                <span>{site.festival.schedule}</span>
              </div>
              <p>
                {site.festival.location}
                <br />
                {site.festival.programHours}
              </p>
              <small>{site.festival.note}</small><a className="primary-button festival-detail-link" href="/festival">{site.festival.detailLabel} <span aria-hidden="true">↗</span></a>
            </div>
            {poster && (
              <a className="poster-link" href={poster.url} rel="noreferrer" target="_blank">
                <Image unoptimized
                  alt={poster.alt}
                  height={poster.height}
                  sizes="(max-width: 700px) 100vw, 330px"
                  src={poster.url}
                  width={poster.width}
                />
              </a>
            )}
          </div></section>}

          <p className="notice">{site.notice}</p>

          <SiteFooter site={site} />
        </div>
      </main>
      <StoreModal site={site} store={selectedStore ? sourceStores.find(store => store.id === selectedStore.id) ?? null : null} routes={routes} onClose={() => setSelectedStore(null)} />
    </div>
  )
}
