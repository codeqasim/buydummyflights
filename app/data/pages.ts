// PAGE REGISTRY: DRIVES ROUTES, BOTH SITEMAPS AND THE SEO/LINK CHECKS. A RECORD WITHOUT A VIEW THROWS AT STARTUP.
// THE BLOG RECORDS ARE GENERATED FROM app/content/blog, SO AN ARTICLE CANNOT EXIST WITHOUT BEING IN THE SITEMAP.
import { posts } from '../content/blog'
import { BLOG_PAGE_SIZE } from './site'

export type PageRecord = {
  path: string
  ns: string // MESSAGE NAMESPACE WITH meta.title / meta.description / h1
  canonicalPath: string
  index: boolean // true => IN A SITEMAP AND INDEXABLE
  lastModified: string // REAL ISO DATE
  changeFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly'
  priority?: number
  group?: 'blog' // blog RECORDS GO TO /sitemap-blog.xml, EVERYTHING ELSE TO /sitemap.xml
  related?: string[] // 3-5 INTERNAL LINKS SHOWN IN THE PAGE RAIL (ALSO COUNTS TOWARDS THE INTERNAL-LINK RULE)
  service?: boolean // EMITS Service JSON-LD
  schemaType?: 'AboutPage' | 'ContactPage' // DEFAULT WebPage
}

const D = '2026-11-05'
const page = (path: string, ns: string, related: string[], extra: Partial<PageRecord> = {}): PageRecord => ({
  path, ns, canonicalPath: path, index: true, lastModified: D, changeFrequency: 'monthly', priority: 0.7, related, ...extra,
})

const blog = (slug: string): string => `/blog/${slug}`

const staticPages: PageRecord[] = [
  { path: '/', ns: 'home', canonicalPath: '/', index: true, lastModified: D, changeFrequency: 'weekly', priority: 1 },
  { path: '/order', ns: 'order', canonicalPath: '/order', index: false, lastModified: D },
  page('/how-it-works', 'how', ['/pricing', '/sample-ticket', '/dummy-ticket-for-schengen-visa', '/faq'], { priority: 0.9, service: true }),
  page('/pricing', 'pricing', ['/how-it-works', '/sample-ticket', '/onward-ticket', '/return-ticket', '/faq'], { priority: 0.9 }),
  page('/sample-ticket', 'sample', ['/how-it-works', '/pricing', '/faq', blog('how-to-verify-a-flight-reservation-pnr')], { priority: 0.8 }),
  page('/faq', 'faq', ['/how-it-works', '/pricing', '/blog', '/contact'], { priority: 0.8 }),
  page('/about', 'about', ['/how-it-works', '/blog', '/contact', '/faq'], { priority: 0.5, schemaType: 'AboutPage' }),
  page('/contact', 'contact', ['/faq', '/how-it-works', '/pricing', '/refund-policy'], { priority: 0.5, schemaType: 'ContactPage' }),
  page('/dummy-ticket-for-schengen-visa', 'schengen', ['/onward-ticket', '/return-ticket', '/pricing', '/sample-ticket', blog('schengen-visa-flight-itinerary-requirements')], { priority: 0.9, service: true }),
  page('/dummy-ticket-for-us-visa', 'usvisa', ['/dummy-ticket-for-uk-visa', '/dummy-ticket-for-canada-visa', '/sample-ticket', '/pricing', blog('us-visa-flight-itinerary')], { priority: 0.9, service: true }),
  page('/dummy-ticket-for-uk-visa', 'ukvisa', ['/dummy-ticket-for-us-visa', '/dummy-ticket-for-schengen-visa', '/sample-ticket', '/pricing', blog('uk-visa-flight-booking-requirements')], { priority: 0.9, service: true }),
  page('/dummy-ticket-for-canada-visa', 'canada', ['/dummy-ticket-for-us-visa', '/dummy-ticket-for-uk-visa', '/sample-ticket', '/pricing', blog('canada-visa-flight-itinerary')], { priority: 0.9, service: true }),
  page('/onward-ticket', 'onward', ['/return-ticket', '/dummy-ticket-for-schengen-visa', '/sample-ticket', '/pricing', blog('onward-ticket-proof-of-onward-travel')], { priority: 0.9, service: true }),
  page('/return-ticket', 'returnflight', ['/onward-ticket', '/dummy-ticket-for-schengen-visa', '/sample-ticket', '/pricing', blog('dummy-ticket-vs-real-flight-booking')], { priority: 0.8, service: true }),
  page('/hotel-reservation-for-visa', 'hotel', ['/dummy-ticket-for-schengen-visa', '/how-it-works', '/faq', blog('visa-application-checklist')], { priority: 0.6 }),
  page('/terms', 'terms', ['/privacy', '/refund-policy', '/contact', '/faq'], { priority: 0.3, changeFrequency: 'yearly' }),
  page('/privacy', 'privacy', ['/terms', '/refund-policy', '/contact'], { priority: 0.3, changeFrequency: 'yearly' }),
  page('/refund-policy', 'refund', ['/terms', '/contact', '/pricing', '/faq'], { priority: 0.3, changeFrequency: 'yearly' }),
]

export const blogPageCount = Math.max(1, Math.ceil(posts.length / BLOG_PAGE_SIZE))
const latest = posts.reduce((m, p) => (p.updated > m ? p.updated : m), D)

const blogPages: PageRecord[] = [
  { path: '/blog', ns: 'blog', canonicalPath: '/blog', index: true, lastModified: latest, changeFrequency: 'weekly', priority: 0.8, group: 'blog' },
  // PAGE 2+ ARE REAL, CRAWLABLE LISTING PAGES BUT STAY OUT OF THE SITEMAP (THEY ADD NOTHING THE ARTICLES DO NOT ALREADY SAY).
  ...Array.from({ length: blogPageCount - 1 }, (_, i): PageRecord => ({
    path: `/blog/page/${i + 2}`, ns: 'blog', canonicalPath: `/blog/page/${i + 2}`, index: false, lastModified: latest, group: 'blog',
  })),
  ...posts.map((p): PageRecord => ({
    path: blog(p.slug), ns: 'blog', canonicalPath: blog(p.slug), index: true, lastModified: p.updated, changeFrequency: 'monthly', priority: 0.6, group: 'blog',
  })),
]

export const pages: PageRecord[] = [...staticPages, ...blogPages]
export const pageByPath = (path: string): PageRecord | undefined => pages.find((p) => p.path === path)
