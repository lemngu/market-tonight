import Image from 'next/image'
import type { SiteCopy } from '@/lib/content-schema'
import SiteFrame from './SiteFrame'
export default function MapExperience({site}:{site:SiteCopy}) {
  const copy=site.mapPage
  return <SiteFrame site={site}><div className="detail-page-inner"><a className="detail-breadcrumb" href="/">홈 / 지도</a><header className="detail-page-heading"><span>{copy.eyebrow}</span><h1>{copy.title}</h1><p>{copy.description}</p></header>{copy.image ? <figure className="published-market-map"><Image unoptimized src={copy.image.url} alt={copy.image.alt || copy.placeholderTitle} width={copy.image.width} height={copy.image.height}/></figure> : <section className="map-placeholder" aria-label="시장 지도 준비 중"><div className="map-placeholder-grid" aria-hidden="true"><i /><i /><i /><span className="map-marker one">01</span><span className="map-marker two">02</span><span className="map-marker three">03</span></div><div className="map-placeholder-message"><span>COMING SOON</span><h2>{copy.placeholderTitle}</h2><p>{copy.placeholderDescription}</p></div></section>}<div className="map-info-grid"><article><span>01</span><h2>미식루트</h2><p>테마별 점포와 대표 상품은 미식루트에서 먼저 확인할 수 있어요.</p><a href="/routes">미식루트 둘러보기 →</a></article><article><span>02</span><h2>행사 공간</h2><p>프로그램별 장소와 시간은 행사 안내에서 확인해주세요.</p><a href="/festival">행사 안내 보기 →</a></article></div></div></SiteFrame>
}
