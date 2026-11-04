// /sitemap.xml FROM THE REGISTRY (EVERY index:true RECORD). THE OTHER PAGES NEVER APPEAR HERE.
import { pages } from '../data/pages'
import { canonicalUrl, escapeXml } from '../utils/urls'

export function sitemapXml(): string {
  const urls = pages
    .filter((p) => p.index)
    .map((p) => {
      const parts = [`<loc>${escapeXml(canonicalUrl(p.canonicalPath))}</loc>`, `<lastmod>${p.lastModified}</lastmod>`]
      if (p.changeFrequency) parts.push(`<changefreq>${p.changeFrequency}</changefreq>`)
      if (p.priority !== undefined) parts.push(`<priority>${p.priority.toFixed(1)}</priority>`)
      return `  <url>${parts.join('')}</url>`
    })
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}
