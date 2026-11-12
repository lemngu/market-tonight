import MarketMap from './MarketMap'
import type { SiteCopy } from '@/lib/content-schema'
import FleaMarketTabs from './FleaMarketTabs'
import SiteFrame from './SiteFrame'

export default function MapExperience({ site }: { site: SiteCopy }) {
  const copy = site.mapPage
  return <SiteFrame site={site}><div className="detail-page-inner market-map-page">
    <header className="detail-page-heading"><span>{copy.eyebrow}</span><h1>{copy.title}</h1><p>{copy.description}</p></header>
    <MarketMap copy={copy} />
    <section className="flea-market-directory" aria-labelledby="flea-market-title">
      <div className="program-section-heading"><span>FLEA MARKET</span><h2 id="flea-market-title">구역별 플리마켓 안내</h2></div>
      <FleaMarketTabs />
    </section>
    <a className="primary-button map-program-link" href="/festival/">행사 프로그램 살펴보기 <span aria-hidden="true">↗</span></a>
  </div></SiteFrame>
}
