// SITEMAP INDEX (/sitemap.xml) -> /sitemap-pages.xml + /sitemap-blog.xml, ALL FROM THE REGISTRY. index:false RECORDS NEVER APPEAR.
// WHY AN INDEX: ONE URL FOR SEARCH CONSOLE, WHILE PAGES AND ARTICLES REPORT SEPARATELY. changefreq/priority ARE DROPPED ON PURPOSE: GOOGLE IGNORES THEM,
// AND A FAKE VALUE IS WORSE THAN NONE. lastmod IS THE REGISTRY DATE (THE DAY THE CONTENT REALLY CHANGED), NEVER "NOW".
import { pages, type PageRecord } from '../data/pages'
import { site } from '../data/site'
import { canonicalUrl, escapeXml } from '../utils/urls'

const XSL = '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>'
const HEAD = `<?xml version="1.0" encoding="UTF-8"?>\n${XSL}\n`
// THE OG IMAGE IS THE ONLY IMAGE EVERY PAGE CARRIES (SAME URL AS og:image IN THE HEAD), SO IT IS THE ONE LISTED PER URL.
const OG_IMAGE = `${site.origin}/assets/images/og-image.png`

export const SITEMAP_PAGES = '/sitemap-pages.xml'
export const SITEMAP_BLOG = '/sitemap-blog.xml'

const indexable = (group: 'blog' | 'pages'): PageRecord[] =>
  pages.filter((p) => p.index && (group === 'blog' ? p.group === 'blog' : p.group !== 'blog'))

const urlset = (list: PageRecord[]): string => {
  const urls = list
    .map(
      (p) =>
        `  <url><loc>${escapeXml(canonicalUrl(p.canonicalPath))}</loc><lastmod>${p.lastModified}</lastmod>` +
        `<image:image><image:loc>${escapeXml(OG_IMAGE)}</image:loc></image:image></url>`,
    )
    .join('\n')
  return `${HEAD}<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls}\n</urlset>\n`
}

const newest = (list: PageRecord[]): string => list.map((p) => p.lastModified).sort().at(-1) ?? ''

export const sitemapIndexXml = (): string => {
  const entry = (path: string, list: PageRecord[]): string => `  <sitemap><loc>${escapeXml(canonicalUrl(path))}</loc><lastmod>${newest(list)}</lastmod></sitemap>`
  return `${HEAD}<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entry(SITEMAP_PAGES, indexable('pages'))}\n${entry(SITEMAP_BLOG, indexable('blog'))}\n</sitemapindex>\n`
}
export const pagesSitemapXml = (): string => urlset(indexable('pages'))
export const blogSitemapXml = (): string => urlset(indexable('blog'))
