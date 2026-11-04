// PAGE REGISTRY: DRIVES ROUTES, THE SITEMAP AND THE SEO CHECK. A RECORD WITHOUT A VIEW THROWS AT STARTUP.
export type PageRecord = {
  path: string
  ns: string // MESSAGE NAMESPACE WITH meta.title / meta.description / h1
  canonicalPath: string
  index: boolean // true => in /sitemap.xml and indexable
  lastModified: string // REAL ISO DATE
  changeFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly'
  priority?: number
}

export const pages: PageRecord[] = [
  { path: '/', ns: 'home', canonicalPath: '/', index: true, lastModified: '2026-11-05', changeFrequency: 'weekly', priority: 1 },
  { path: '/order', ns: 'order', canonicalPath: '/order', index: false, lastModified: '2026-11-05' },
]

export const pageByPath = (path: string): PageRecord | undefined => pages.find((p) => p.path === path)
