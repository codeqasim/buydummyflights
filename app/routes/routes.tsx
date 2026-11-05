// MIDDLEWARE, THE REGISTRY LOOP (PAGE_VIEWS), API, SITEMAP, ROBOTS, ICONS, 404, 500.
import { Hono } from 'hono'
import { home, plans } from '../data/site'
import { pageByPath, pages } from '../data/pages'
import type { AppEnv } from '../env'
import { robotsTxt } from '../seo/robots'
import { faqSchema, serviceSchema } from '../seo/schema'
import { blogSitemapXml, pagesSitemapXml, sitemapIndexXml } from '../seo/sitemap'
import { sitemapXsl } from '../seo/sitemap-xsl'
import { site } from '../data/site'
import { isIndexable } from '../utils/urls'
import { iconSprite } from '../views/icons'
import { HomePage } from '../views/pages/home'
import { NotFoundPage } from '../views/pages/not-found'
import { OrderPage } from '../views/pages/order'
import { postContact } from './contact-api'
import { postOrder } from './order-api'
import { contentViews, crumbsFor, type PageView } from './page-views'
import { i18nFor, renderDocument, renderPage } from './render'
import { securityHeaders } from './security'

const app = new Hono<AppEnv>()

// 1. www -> APEX (PRODUCTION HOST ONLY; THE ZONE ALSO HAS A REDIRECT RULE).
app.use('*', async (c, next) => {
  const u = new URL(c.req.url)
  if (u.hostname === `www.${site.domain}`) {
    u.hostname = site.domain
    return c.redirect(u.toString(), 301)
  }
  await next()
})
// 2. SECURITY HEADERS + X-Robots-Tag ON NON-INDEXABLE HOSTS.
app.use('*', securityHeaders)
// 3. CLEAN URLS: TRAILING SLASH, .html, .php -> ONE CANONICAL FORM.
app.use('*', async (c, next) => {
  const u = new URL(c.req.url)
  const clean = u.pathname.replace(/\.(html|php)$/i, '').replace(/\/+$/, '') || '/'
  if (clean !== u.pathname) {
    u.pathname = clean
    return c.redirect(u.toString(), 301)
  }
  await next()
})

const PAGE_VIEWS: Record<string, PageView> = {
  ...contentViews(),
  '/': {
    handler: (c) => {
      const record = pageByPath('/')!
      const i18n = i18nFor(record.ns)
      const faq = home.faq.map((id) => ({ id, q: i18n.t(`faq.items.${id}.q`), a: i18n.t(`faq.items.${id}.a`) }))
      const planNames = Object.fromEntries(plans.map((p) => [p.id, i18n.t(`pricing.plans.${p.id}.name`)]))
      return renderPage(c, {
        record,
        crumbs: crumbsFor(i18n, '/'),
        schema: [
          faqSchema(faq),
          serviceSchema({ name: i18n.t('service.name'), serviceType: i18n.t('brand.tagline'), description: i18n.t('meta.description'), planNames }),
        ],
        body: () => <HomePage today={new Date().toISOString().slice(0, 10)} faq={faq} />,
      })
    },
  },
  '/order': {
    handler: (c) => {
      const record = pageByPath('/order')!
      const i18n = i18nFor(record.ns)
      const q = c.req.query()
      const g = (k: string, n = 80): string => (q[k] ?? '').slice(0, n)
      const sent = /^[A-Z0-9-]{6,32}$/.test(g('sent', 32)) ? g('sent', 32) : ''
      const crumbs = crumbsFor(i18n, '/order', 'crumb')
      return renderPage(c, {
        record,
        crumbs,
        body: () => <OrderPage q={{ trip: g('trip', 10), from: g('from'), to: g('to'), depart: g('depart', 10), ret: g('return', 10), pax: g('pax', 2), plan: g('plan', 10), sent }} crumbs={crumbs} />,
      })
    },
  },
}

// 4. REGISTRY LOOP: A RECORD WITHOUT A VIEW THROWS AT STARTUP, SO A URL CAN NEVER REACH THE SITEMAP WITHOUT A ROUTE.
for (const record of pages) {
  const view = PAGE_VIEWS[record.path]
  if (!view) throw new Error(`pages.ts: "${record.path}" has no view in PAGE_VIEWS`)
  app.get(record.path, (c) => view.handler(c))
}

app.post('/api/order', postOrder)
app.post('/api/contact', postContact)
app.all('/api/*', (c) => c.json({ ok: false, error: 'not_found' }, 404))

const XML = { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
app.get('/sitemap.xml', (c) => c.body(sitemapIndexXml(), 200, XML))
app.get('/sitemap-pages.xml', (c) => c.body(pagesSitemapXml(), 200, XML))
app.get('/sitemap-blog.xml', (c) => c.body(blogSitemapXml(), 200, XML))
// THE STYLESHEET IS SAME-ORIGIN, SO CHROME APPLIES IT UNDER THE SITE CSP (default-src 'self').
app.get('/sitemap.xsl', (c) => c.body(sitemapXsl(), 200, { 'Content-Type': 'application/xslt+xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }))
app.get('/robots.txt', (c) =>
  c.body(robotsTxt(isIndexable(c.env, new URL(c.req.url).host)), 200, { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }),
)
app.get('/icons.svg', (c) => c.body(iconSprite(), 200, { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400' }))

app.notFound((c) => {
  const i18n = i18nFor('notfound')
  return renderDocument(c, {
    i18n,
    status: 404,
    body: <NotFoundPage />,
    meta: { title: i18n.t('meta.title'), description: i18n.t('meta.description'), canonicalPath: '/', robots: 'noindex, nofollow', ogImageAlt: i18n.t('brand.tagline'), schema: [] },
  })
})

app.onError((err, c) => {
  console.error('render error', err instanceof Error ? err.message : String(err))
  const i18n = i18nFor('notfound')
  return renderDocument(c, {
    i18n,
    status: 500,
    body: <NotFoundPage error />,
    meta: { title: i18n.t('error.h1'), description: i18n.t('error.lead'), canonicalPath: '/', robots: 'noindex, nofollow', ogImageAlt: i18n.t('brand.tagline'), schema: [] },
  })
})

export default app
