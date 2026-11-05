// /sitemap.xml (SERVICE + INFO PAGES) AND /sitemap-blog.xml (BLOG INDEX + ARTICLES), BOTH FROM THE REGISTRY. index:false RECORDS NEVER APPEAR.
import { pages, type PageRecord } from '../data/pages'
import { canonicalUrl, escapeXml } from '../utils/urls'

const urlset = (list: PageRecord[]): string => {
  const urls = list
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

export const sitemapXml = (): string => urlset(pages.filter((p) => p.group !== 'blog'))
export const blogSitemapXml = (): string => urlset(pages.filter((p) => p.group === 'blog'))
