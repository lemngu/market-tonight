'use client'

import Image from 'next/image'
import type { CSSProperties } from 'react'
import type { SiteCopy } from '@/lib/content-schema'
import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'
import PatternRibbon from './PatternRibbon'
import MarketMap from './MarketMap'
import TimetableOverview from './TimetableOverview'
import { festivalArtwork } from '@/lib/festival-artwork'

export default function HomeExperience({ site }: { site: SiteCopy }) {
  const nextSection = site.festival.isVisible ? '#festival' : '#market-map'
  return (
    <div className="site-shell" style={{ '--navy': site.design.navy, '--ink': site.design.navy, '--cream': site.design.cream, '--white': site.design.white, '--blue': site.design.blue, '--muted-background': site.design.mutedBackground, '--yellow': site.design.yellow, '--content-font-size': site.design.fontSize + 'px', '--logo-seconds': site.design.logoSeconds + 's' } as CSSProperties}>
      <SiteHeader site={site} />

      <main id="top">
        <section className="hero hero-editorial"><div className="hero-inner">
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
              <a className="primary-button" href="/festival/" data-ga-event="festival_schedule_click">
                행사 프로그램 보기 <span aria-hidden="true">↘</span>
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
          <a aria-label="다음 안내로 이동" className="scroll-cue" href={nextSection}>
            <b aria-hidden="true">↓</b>
          </a>
        </div></section>

        <PatternRibbon />

        <div className="content-wrap">
          {site.festival.isVisible && <section className="home-program-section" id="festival"><div className="home-section-inner">
            <div className="home-section-heading"><span className="section-label">01 / TIME TABLE</span><h2>행사 안내</h2><p>{site.festivalPage.date} · {site.festivalPage.location}</p></div>
            <TimetableOverview image={site.festivalPage.timetable || festivalArtwork.overview} />
            <a className="primary-button" href="/festival/#overview" data-ga-event="festival_schedule_click">행사별 자세히 보기 <span aria-hidden="true">↗</span></a>
          </div></section>}
          <section className="home-program-section home-map-section" id="market-map"><div className="home-section-inner">
            <div className="home-section-heading"><span className="section-label">02 / MARKET MAP</span><h2>행사장 지도</h2><p>시장 곳곳의 행사 위치를 확인하고, 두 구역의 플리마켓을 둘러보세요.</p></div>
            <MarketMap copy={site.mapPage} compact />
            <a className="primary-button" href="/map/" data-ga-event="market_map_click">지도와 플리마켓 부스 보기 <span aria-hidden="true">↗</span></a>
          </div></section>
          <SiteFooter site={site} />
        </div>
      </main>
    </div>
  )
}
