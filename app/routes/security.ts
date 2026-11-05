// SECURITY HEADERS + CSP IN ONE PLACE. THE CSP ALLOWS ONLY OUR ORIGIN (NO eval: THE ALPINE CSP BUILD IS USED, NO INLINE SCRIPT OR STYLE).
import type { MiddlewareHandler } from 'hono'
import type { AppEnv } from '../env'
import { isIndexable, isPreviewHost } from '../utils/urls'

// THE SITEMAP XML DOCUMENTS ARE THE ONE PLACE THE CSP IS RELAXED. CHROME INJECTS ITS OWN INLINE-STYLED "XSLT IS BEING REMOVED" BANNER (WITH AN INLINE
// CLOSE HANDLER) INTO ANY XML PAGE THAT USES xml-stylesheet; UNDER A STRICT CSP IT RENDERS UNSTYLED OVER THE TABLE. THESE DOCUMENTS ARE GENERATED FROM OUR
// OWN REGISTRY (NO USER INPUT, NO OUR OWN SCRIPT), SO ALLOWING INLINE THERE ADDS NO RISK; EVERY HTML PAGE KEEPS THE STRICT POLICY.
const SITEMAP_PATH = /^\/sitemap(?:-[a-z]+)?\.(?:xml|xsl)$/

const csp = (production: boolean, sitemap = false): string =>
  [
    "default-src 'self'",
    sitemap ? "script-src 'self' 'unsafe-inline'" : "script-src 'self'",
    sitemap ? "style-src 'self' 'unsafe-inline'" : "style-src 'self'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(production ? ['upgrade-insecure-requests'] : []),
  ].join('; ')

export const securityHeaders: MiddlewareHandler<AppEnv> = async (c, next) => {
  await next()
  const host = new URL(c.req.url).host
  const production = c.env.ENVIRONMENT === 'production' && !isPreviewHost(host)
  const h = c.res.headers
  h.set('Content-Security-Policy', csp(production, SITEMAP_PATH.test(new URL(c.req.url).pathname)))
  h.set('X-Content-Type-Options', 'nosniff')
  h.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  h.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()')
  h.set('X-Frame-Options', 'DENY')
  h.set('Cross-Origin-Opener-Policy', 'same-origin')
  if (production) h.set('Strict-Transport-Security', 'max-age=15552000')
  if (!isIndexable(c.env, host)) h.set('X-Robots-Tag', 'noindex, nofollow')
}
