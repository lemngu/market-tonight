'use client'

import Image from 'next/image'

import { useEffect, useMemo, useRef, useState } from 'react'
import MenuSelect from './MenuSelect'
import { createDemoStores } from '@/lib/demo-stores'
import type { HomeMedia, HomeRoute, HomeStore } from '@/lib/home-data'

import type { CSSProperties } from 'react'
import { storeSchema, type SiteCopy } from '@/lib/content-schema'
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
  detailMode = false,
  initialRouteID,
  publicFeed = false,
}: {
  site: SiteCopy
  routes: HomeRoute[]
  stores: HomeStore[]
  showDemo?: boolean
  detailMode?: boolean
  initialRouteID?: string
  publicFeed?: boolean
}) {
  const [selectedStore, setSelectedStore] = useState<HomeStore | null>(null)
  const [page, setPage] = useState(1)
  const feedPath = publicFeed ? process.env.NEXT_PUBLIC_STORE_FEED_PATH : undefined
  const [sheetStores, setSheetStores] = useState<HomeStore[] | null>(null)
  useEffect(() => {
    if (!feedPath) return
    const controller = new AbortController()
    let loading = false
    const refresh = async () => {
      if (loading || document.hidden) return
      loading = true
      try {
        const response = await fetch(feedPath, { signal: controller.signal })
        if (!response.ok) return
        const data = await response.json()
        const parsed = storeSchema.array().max(2000).safeParse(data.stores)
        if (parsed.success && !controller.signal.aborted) {
          setSheetStores(parsed.data.filter(store => store.isVisible))
        }
      } catch {
        // Keep the latest successful list during a temporary connection issue.
      } finally {
        loading = false
      }
    }
    void refresh()
    const timer = window.setInterval(refresh, 30_000)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      controller.abort()
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [feedPath])
  const sourceStores = useMemo(() => {
    if (feedPath) return sheetStores ?? stores
    return stores.length === 0 ? createDemoStores(routes) : stores
  }, [feedPath, sheetStores, routes, stores])
  const [activeRouteID, setActiveRouteID] = useState(initialRouteID ?? routes[0]?.id ?? '')
  const [selectedMenu, setSelectedMenu] = useState('')
  const tabsRef = useRef<HTMLDivElement>(null)
  const activeRoute = routes.find((route) => route.id === activeRouteID) ?? routes[0]
  useEffect(() => {
    const container = tabsRef.current
    const selected = container?.querySelector<HTMLElement>('[aria-selected="true"]')
    if (!container || !selected || container.scrollWidth <= container.clientWidth) return
    const left = selected.offsetLeft
    if (left < container.scrollLeft || left + selected.offsetWidth > container.scrollLeft + container.clientWidth) {
      container.scrollTo({ left: Math.max(0, left - (container.clientWidth - selected.offsetWidth) / 2), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
    }
  }, [activeRoute?.id])
  const routeStores = useMemo(() => sourceStores.filter(store => activeRoute && store.routeIds.includes(activeRoute.id)), [activeRoute, sourceStores])
  const menuOptions = [...new Set(routeStores.map(store => store.menu.trim()).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b, 'ko'))
  const currentMenu = menuOptions.includes(selectedMenu) ? selectedMenu : ''
  const visibleStores = routeStores.filter(store => !currentMenu || store.menu.trim() === currentMenu)

  const [pageSize, setPageSize] = useState(8)
  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 767px)')
    const updatePageSize = () => { setPageSize(mobile.matches ? 4 : 8); setPage(1) }
    updatePageSize()
    mobile.addEventListener('change', updatePageSize)
    return () => mobile.removeEventListener('change', updatePageSize)
  }, [])
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
          </div>
          <div className="hero-card">
            <div className="hero-copy">
              <h1>
                <span>{site.hero.titleLine1}</span>
                <span>{site.hero.titleLine2}</span>
              </h1>
              <p className="hero-description">{site.hero.description}</p>
              <dl className="hero-event-info">
                <div><dt className="sr-only">행사 일시</dt><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="5" width="18" height="16" rx="1"/><path d="M7 2v6m10-6v6M3 11h18M7 15h2m3 0h2m3 0h1M7 18h2m3 0h2"/></svg><dd>{site.hero.eventDate}</dd></div>
              </dl>
              <a className="primary-button" href="#routes" data-ga-event="taste_routes_click">
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
            </div>

            {routes.length > 0 ? (
              <>
                <div ref={tabsRef} className="tabs" role="tablist" aria-label="미식루트">
                  {routes.map((route, index) => (
                    <button
                      aria-controls="route-panel"
                      aria-selected={activeRoute?.id === route.id}
                      className={activeRoute?.id === route.id ? 'active' : ''}
                      key={route.id}
                      style={routeStyle(route.id, index)}
                      data-ga-event="taste_route_select" data-ga-item={route.id}
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
                      <h3>{activeRoute?.name}</h3>
                      <p>{activeRoute?.introduction || activeRoute?.description}</p>
                    </div>
                    <MenuSelect key={activeRoute?.id} options={menuOptions} value={currentMenu} onChange={value => { setSelectedMenu(value); setPage(1) }} />
                  </div>


                  <div className="store-grid">
                    {visibleStores.length > 0 ? (
                      pagedStores.map((store) => (
                        <article className="store-card" key={store.id} data-ga-event="store_detail_open" data-ga-item={store.id} onClick={() => setSelectedStore(store)}>
                          <div className="store-card-content">
                          <h3>{store.name}</h3>
                          <dl>
                            <div><dt><span className="sr-only">메뉴</span><svg className="store-meta-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M5 3v6m3-6v6M3 3v6c0 2 7 2 7 0V3M6.5 11v10M20 3c-4 3-5 7-5 10h5m0-10v18"/></svg></dt><dd className="store-menu-value">{store.menu || site.routesSection.menuUnconfirmedLabel}</dd></div>
                            <div>
                              <dt><span className="sr-only">{site.routesSection.priceLabel}</span><span aria-hidden="true" className="store-meta-icon">₩</span></dt>
                              <dd className="store-price-value">{(store.id.startsWith('demo-') ? store.price.replace(/^예시\s*/, '') : store.price) || site.routesSection.unconfirmedLabel}</dd>
                            </div>
                            <div>
                              <dt><span className="sr-only">{site.routesSection.hoursLabel}</span><svg className="store-meta-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></svg></dt>
                              <dd>{store.hours || site.routesSection.unconfirmedLabel}</dd>
                            </div>
                          </dl>
                          <button className="store-detail-button" type="button" aria-label={store.name + " " + site.routesSection.detailLabel}><span className="store-detail-label">{site.routesSection.detailLabel}</span><span aria-hidden="true">→</span></button>
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

          {!detailMode && site.festival.isVisible && <PatternRibbon reverse />}

          {!detailMode && site.festival.isVisible && <section className="festival" id="festival"><div className="festival-inner">
            <div className="festival-copy">
              <span className="section-label">02 / MARKET NIGHT</span>
              <h2>{site.festival.heading}</h2>
              <div className="festival-date">
                <b>{site.festival.date}</b>
                <span>{site.festival.schedule}</span>
              </div>
              <p>
                {site.festival.location}
                <br />
                {site.festival.programHours}
              </p>
              <small>{site.festival.note}</small><a className="primary-button festival-detail-link" href="/festival" data-ga-event="festival_schedule_click">{site.festival.detailLabel} <span aria-hidden="true">↗</span></a>
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
      <StoreModal themeID={activeRoute?.id} site={site} store={selectedStore ? sourceStores.find(store => store.id === selectedStore.id) ?? null : null} routes={routes} onClose={() => setSelectedStore(null)} />
    </div>
  )
}
