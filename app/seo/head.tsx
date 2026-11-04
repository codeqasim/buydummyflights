// <head>: META, CANONICAL, HREFLANG, OG, TWITTER, FAVICONS, THEME BOOT, FONT PRELOAD, SCRIPTS.
import { site } from '../data/site'
import { assetVersion } from '../data/assets'
import { canonicalUrl } from '../utils/urls'
import { graph, serialize } from './schema'

export type HeadMeta = {
  title: string
  description: string
  canonicalPath: string
  robots: string
  ogImage?: string
  ogImageAlt: string
  ogType?: 'website' | 'article'
  schema: Record<string, unknown>[]
}

const v = (path: string): string => (assetVersion[path] ? `${path}?v=${assetVersion[path]}` : path)

export const Head = ({ meta }: { meta: HeadMeta }) => {
  const url = canonicalUrl(meta.canonicalPath)
  const image = meta.ogImage ?? `${site.origin}/assets/images/og-image.png`
  return (
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={url} />
      <link rel="alternate" hreflang="en" href={url} />
      <link rel="alternate" hreflang="x-default" href={url} />
      <meta name="robots" content={meta.robots} />
      <meta name="theme-color" content={site.themeColor.light} media="(prefers-color-scheme: light)" />
      <meta name="theme-color" content={site.themeColor.dark} media="(prefers-color-scheme: dark)" />
      <meta name="color-scheme" content="light dark" />
      <meta name="application-name" content={site.name} />
      <meta name="apple-mobile-web-app-title" content={site.name} />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:type" content={meta.ogType ?? 'website'} />
      <meta property="og:locale" content={site.ogLocale} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={meta.ogImageAlt} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={meta.ogImageAlt} />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="icon" href="/favicon.ico" sizes="32x32" />
      <link rel="apple-touch-icon" href="/assets/images/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="preload" href="/assets/fonts/plus-jakarta-sans-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin="anonymous" />
      <link rel="stylesheet" href={v('/assets/css/app.css')} />
      <script src={v('/assets/js/theme.js')}></script>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialize(graph(meta.schema)) }} />
      <script src={v('/assets/js/app.js')} defer></script>
      <script src={v('/assets/js/vendor/alpine-intersect.js')} defer></script>
      <script src={v('/assets/js/vendor/alpine.js')} defer></script>
    </head>
  )
}
