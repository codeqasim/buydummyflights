// i18nFor(), renderPage(), renderDocument(): VIEW + META -> A FULL HTML DOCUMENT.
import type { Context } from 'hono'
import type { Child } from 'hono/jsx'
import { site } from '../data/site'
import type { PageRecord } from '../data/pages'
import type { AppEnv } from '../env'
import { createI18n, type I18n } from '../i18n/t'
import type { HeadMeta } from '../seo/head'
import { breadcrumbSchema, organizationSchema, webPageSchema, websiteSchema, type Crumb } from '../seo/schema'
import { isIndexable } from '../utils/urls'
import { Layout } from '../views/layout'

type Schema = Record<string, unknown>

export const i18nFor = (ns: string): I18n => createI18n(ns)

const ROBOTS_INDEX = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'

export function renderDocument(c: Context<AppEnv>, o: { i18n: I18n; meta: HeadMeta; body: Child; status?: 200 | 404 | 500; cache?: string }): Response {
  const html = `<!DOCTYPE html>${(
    <Layout i18n={o.i18n} meta={o.meta} year={new Date().getUTCFullYear()}>
      {o.body}
    </Layout>
  ).toString()}`
  c.header('Cache-Control', o.cache ?? 'no-store')
  return c.html(html, o.status ?? 200)
}

// meta OVERRIDES THE NAMESPACE title/description (BLOG: PER-ARTICLE TEXT THAT LIVES IN app/content, NOT IN A MESSAGE FILE).
export function renderPage(c: Context<AppEnv>, o: { record: PageRecord; body: (i18n: I18n) => Child; crumbs: Crumb[]; schema?: Schema[]; meta?: { title: string; description: string; ogType?: 'article' } }): Response {
  const i18n = i18nFor(o.record.ns)
  const host = new URL(c.req.url).host
  const indexable = isIndexable(c.env, host) && o.record.index
  const title = o.meta?.title ?? i18n.t('meta.title')
  const description = o.meta?.description ?? i18n.t('meta.description')
  const image = `${site.origin}/assets/images/og-image.png`
  const meta: HeadMeta = {
    title,
    description,
    canonicalPath: o.record.canonicalPath,
    robots: indexable ? ROBOTS_INDEX : o.record.index ? 'noindex, nofollow' : 'noindex, follow',
    ogImageAlt: i18n.t('brand.tagline'),
    ogImage: image,
    ogType: o.meta?.ogType,
    schema: [
      organizationSchema(i18n.t('footer.about')),
      websiteSchema(i18n.t('footer.about')),
      webPageSchema({ path: o.record.canonicalPath, title, description, image, modified: o.record.lastModified, type: o.record.schemaType }),
      breadcrumbSchema(o.record.canonicalPath, o.crumbs),
      ...(o.schema ?? []),
    ],
  }
  const cache = indexable ? 'public, max-age=300, s-maxage=900, stale-while-revalidate=86400' : 'no-store'
  return renderDocument(c, { i18n, meta, body: o.body(i18n), cache })
}
