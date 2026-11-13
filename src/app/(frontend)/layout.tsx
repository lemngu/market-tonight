import React from 'react'
import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { BodyCustomCode, renderHeadCustomCode } from '@/lib/make-custom-code'
import { makeSiteSettings, sanitizeHtmlAttribute } from '@/lib/make-site-settings'
import './styles.css'
import './responsive.css'
import './detail-pages.css'
import './hero-copy.css'
import './section-copy.css'
import './responsive-polish.css'
import './event-updates.css'
import { readContent } from '@/lib/content-store'

const analyticsSetting = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID?.trim() || makeSiteSettings.analytics?.googleAnalyticsId
const googleAnalyticsId = analyticsSetting && /^G-[A-Z0-9]+$/.test(analyticsSetting) ? analyticsSetting : undefined

export const viewport: Viewport = { colorScheme: 'only light' }

export async function generateMetadata(): Promise<Metadata> {
  const { published: { site } } = await readContent()
  return { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'), title: site.metaTitle, description: site.metaDescription, openGraph: { title: site.metaTitle, description: site.metaDescription } }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const language = sanitizeHtmlAttribute(makeSiteSettings.language) || 'ko'
  const addBypassLinks = makeSiteSettings.accessibility?.addBypassLinks === true
  const customScripts = makeSiteSettings.customScripts

  return (
    <html lang={language}>
      <head>
        {renderHeadCustomCode(customScripts?.headStart, 'head-start')}
        {renderHeadCustomCode(customScripts?.headEnd, 'head-end')}
      </head>
      <body className="min-h-screen antialiased">
        <BodyCustomCode html={customScripts?.bodyStart} />
        {addBypassLinks && (
          <a className="figma-bypass-link" href="#root">
            Skip to content
          </a>
        )}
        <div id="root" tabIndex={-1}>
          {children}
        </div>
        {googleAnalyticsId && (
          <Script id="market-google-analytics" strategy="afterInteractive">
            {`
(() => {
  if (/(^|\\/)admin(\\/|$)/.test(location.pathname)) return;

  if (['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)) return;

  const measurementId = ${JSON.stringify(googleAnalyticsId)};
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', measurementId);

  const tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
  document.head.append(tag);

  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const action = event.target.closest('[data-ga-event]');
    if (!action || action.closest(':disabled')) return;
    const item = action.getAttribute('data-ga-item');
    window.gtag('event', action.getAttribute('data-ga-event'), item ? { item_id: item } : {});
  }, true);
})();
`}
          </Script>
        )}
        <BodyCustomCode html={customScripts?.bodyEnd} />
      </body>
    </html>
  )
}
