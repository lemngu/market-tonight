import Image from 'next/image'
import { partners } from '@/lib/partners'
import type { SiteCopy } from '@/lib/content-schema'
export default function SiteFooter({site}:{site:SiteCopy}){return <>          <section aria-label="주최 및 협력 기관" className="sponsor-loop"><div className="sponsor-inner">
            <div className="sponsor-track">{[0, 1].map(repeat => <div className="sponsor-set" key={repeat} aria-hidden={repeat === 1}>{partners.map(partner => <div className="sponsor-logo" key={partner.url} data-logo={partner.url.includes('partner-07') ? 'compact' : 'standard'}><Image unoptimized loading="eager" src={partner.url} alt={repeat === 0 ? partner.name : ''} width={200} height={48} /></div>)}</div>)}</div>
          </div></section>

          <footer id="partners"><div className="footer-inner">
            <div>
              <span className="section-label">GUWOL × MORAENAE</span>
              <h2>
                {site.footer.headingLine1}
                <br />
                {site.footer.headingLine2}
              </h2>
              <p>{site.footer.tagline}</p>
            </div>
            <div className="footer-info">
              <span className="footer-card-label">LOCAL THEME COMMERCIAL DISTRICT</span>
              <div className="footer-info-block">
                <strong>운영</strong>
                <p>{site.footer.organization}</p>
              </div>
              <div className="footer-info-block">
                <strong>안내</strong>
                <p>{site.footer.analyticsNote}</p>
              </div>
              <div aria-label="소셜 미디어" className="footer-social">
                <strong>SNS</strong>
                <a aria-label="구월모래내시장 인스타그램 (새 창)" className="social-icon social-instagram" href="https://www.instagram.com/guwolmoraenaemarket/" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.4" cy="6.9" r="1" fill="currentColor" stroke="none" /></svg></a>
              </div>
              <a className="footer-admin-button" href="/admin">{site.footer.adminLabel} ↗</a>
              <p className="footer-copyright">
                © 2026 Guwol Moraenae Market Local Theme Commercial District. All Rights Reserved.
              </p>
            </div>
          </div></footer></>}
