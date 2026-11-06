import type { ReactNode, CSSProperties } from 'react'
import type { SiteCopy } from '@/lib/content-schema'
import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'

export default function SiteFrame({ site, children }: { site: SiteCopy; children: ReactNode }) {
  const style = {
    '--navy': site.design.navy, '--ink': site.design.navy, '--cream': site.design.cream,
    '--white': site.design.white, '--blue': site.design.blue, '--yellow': site.design.yellow,
    '--muted-background': site.design.mutedBackground,
    '--content-font-size': site.design.fontSize + 'px', '--logo-seconds': site.design.logoSeconds + 's',
  } as CSSProperties
  return <div className="site-shell detail-shell" style={style}><SiteHeader site={site} /><main id="top" className="detail-main">{children}</main><SiteFooter site={site} /></div>
}
