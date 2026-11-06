import type { ReactNode, CSSProperties } from 'react'
import type { SiteCopy } from '@/lib/content-schema'
import SiteHeader from './SiteHeader'
import SiteFooter from './SiteFooter'
export default function SiteFrame({site,children}:{site:SiteCopy;children:ReactNode}){return <div className="site-shell detail-shell" style={{'--navy':site.design.navy,'--ink':site.design.navy,'--cream':site.design.cream,'--white':site.design.white,'--blue':site.design.blue,'--yellow':site.design.yellow,'--logo-seconds':site.design.logoSeconds+'s'} as CSSProperties}><SiteHeader site={site}/><main id="top" className="detail-main">{children}</main><SiteFooter site={site}/></div>}
