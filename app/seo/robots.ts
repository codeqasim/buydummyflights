// /robots.txt: PREVIEW AND NOT-YET-LAUNCHED HOSTS DISALLOW EVERYTHING; PRODUCTION POINTS TO THE SITEMAP.
import { site } from '../data/site'

export function robotsTxt(indexable: boolean): string {
  if (!indexable) return 'User-agent: *\nDisallow: /\n'
  return `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /order\n\nSitemap: ${site.origin}/sitemap.xml\nSitemap: ${site.origin}/sitemap-blog.xml\n`
}
