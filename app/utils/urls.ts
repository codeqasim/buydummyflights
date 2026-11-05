// CANONICAL ORIGIN, PREVIEW/INDEXING DECISION, XML ESCAPING.
import { site } from '../data/site'
import type { Bindings } from '../env'

export const canonicalUrl = (path: string): string => new URL(path, site.origin).toString()

// localhost, 127.0.0.1 AND *.workers.dev ARE ALWAYS PREVIEW, EVEN WHEN DEPLOYED AS PRODUCTION.
export const isPreviewHost = (host: string): boolean => {
  const h = host.split(':')[0] ?? ''
  return h === 'localhost' || h === '127.0.0.1' || h.endsWith('.workers.dev') || h.endsWith('.localhost')
}

// A PAGE MAY BE INDEXED ONLY ON THE PRODUCTION HOST, IN THE PRODUCTION ENVIRONMENT, AND AFTER THE OWNER'S LAUNCH SWITCH.
// THE OWNER SWITCHED INDEXING TO "on" IN wrangler.jsonc FOR PRODUCTION ONLY; THE PREVIEW ENV STAYS "off" AND workers.dev IS ALWAYS noindex.
export const isIndexable = (env: Pick<Bindings, 'ENVIRONMENT' | 'INDEXING'>, host: string): boolean =>
  env.ENVIRONMENT === 'production' && env.INDEXING === 'on' && !isPreviewHost(host)

export const escapeXml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
