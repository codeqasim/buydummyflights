// /robots.txt: PREVIEW HOSTS DISALLOW EVERYTHING; PRODUCTION ALLOWS ALL EXCEPT /order AND /api/, AND POINTS TO THE SITEMAP INDEX (WHICH LISTS THE CHILDREN).
import { site } from '../data/site'

export function robotsTxt(indexable: boolean): string {
  if (!indexable) return 'User-agent: *\nDisallow: /\n'
  return `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /order\n\nSitemap: ${site.origin}/sitemap.xml\n`
}
