// VIEW HANDLERS FOR THE CONTENT PAGES AND THE BLOG. THE REGISTRY (data/pages.ts) DECIDES WHICH PATHS EXIST; THIS FILE DECIDES HOW EACH ONE RENDERS.
import type { Context } from 'hono'
import { BLOG_PAGE_SIZE, plans } from '../data/site'
import { faqOf, parseBlocks } from '../content/markup'
import { postBySlug, postMeta, posts } from '../content/blog'
import { blogPageCount, pages, type PageRecord } from '../data/pages'
import type { AppEnv } from '../env'
import type { I18n } from '../i18n/t'
import { blogPostingSchema, blogSchema, faqSchema, serviceSchema, type Crumb } from '../seo/schema'
import { site } from '../data/site'
import { BlogIndexPage } from '../views/pages/blog-index'
import { BlogPostPage } from '../views/pages/blog-post'
import { ContactForm } from '../views/pages/contact'
import { ContentPage, FromHome } from '../views/pages/content-page'
import { How } from '../views/sections/home/how'
import { Pricing } from '../views/sections/home/pricing'
import { Sample } from '../views/sections/home/sample'
import { i18nFor, renderPage } from './render'

export type PageView = { handler: (c: Context<AppEnv>) => Response }

export const crumbsFor = (i18n: I18n, path: string, nameKey?: string): Crumb[] => {
  const homeCrumb: Crumb = { name: i18n.t('breadcrumb.home'), path: '/' }
  return path === '/' || !nameKey ? [homeCrumb] : [homeCrumb, { name: i18n.t(nameKey), path }]
}

const LEGAL = new Set(['/terms', '/privacy', '/refund-policy'])

const contentView = (record: PageRecord): PageView => ({
  handler: (c) => {
    const i18n = i18nFor(record.ns)
    const home = i18nFor('home')
    const blocks = parseBlocks(i18n.data<string[]>('body'))
    const faq = faqOf(blocks)
    const planNames = Object.fromEntries(plans.map((p) => [p.id, home.t(`pricing.plans.${p.id}.name`)]))
    const before =
      record.path === '/how-it-works' ? <FromHome><How /></FromHome>
      : record.path === '/pricing' ? <FromHome><Pricing /></FromHome>
      : record.path === '/sample-ticket' ? <FromHome><Sample /></FromHome>
      : record.path === '/contact' ? <ContactForm status={c.req.query('status') === 'sent' ? 'sent' : c.req.query('status') === 'error' ? 'error' : ''} />
      : undefined
    const crumbs = crumbsFor(i18n, record.path, 'crumb')
    return renderPage(c, {
      record,
      crumbs,
      schema: [
        ...(faq.length ? [faqSchema(faq)] : []),
        ...(record.service ? [serviceSchema({ path: record.path, name: i18n.t('crumb'), serviceType: i18n.t('brand.tagline'), description: i18n.t('meta.description'), planNames })] : []),
      ],
      body: () => <ContentPage record={record} crumbs={crumbs} before={before} legal={LEGAL.has(record.path)} />,
    })
  },
})

const blogIndexView = (record: PageRecord, page: number): PageView => ({
  handler: (c) => {
    const i18n = i18nFor('blog')
    const items = posts.slice((page - 1) * BLOG_PAGE_SIZE, page * BLOG_PAGE_SIZE)
    const crumbs = [...crumbsFor(i18n, '/blog', 'crumb')]
    return renderPage(c, {
      record,
      crumbs: page > 1 ? [...crumbs, { name: i18n.t('crumbPage', { n: page }), path: record.path }] : crumbs,
      meta: page > 1 ? { title: i18n.t('meta.titlePage', { n: page }), description: i18n.t('meta.description') } : undefined,
      schema: [blogSchema({ name: i18n.t('h1'), description: i18n.t('meta.description'), posts: items.map((p) => ({ path: `/blog/${p.slug}`, title: p.title, published: p.published })) })],
      body: () => <BlogIndexPage items={items} page={page} pages={blogPageCount} crumbs={page > 1 ? [...crumbs, { name: i18n.t('crumbPage', { n: page }), path: record.path }] : crumbs} />,
    })
  },
})

const blogPostView = (record: PageRecord): PageView => ({
  handler: (c) => {
    const post = postBySlug(record.path.slice('/blog/'.length))!
    const i18n = i18nFor('blog')
    const blocks = parseBlocks(post.body)
    const faq = faqOf(blocks)
    const crumbs: Crumb[] = [...crumbsFor(i18n, '/blog', 'crumb'), { name: post.title, path: record.path }]
    return renderPage(c, {
      record,
      crumbs,
      meta: { title: `${post.seoTitle} | ${site.legalName}`, description: post.description, ogType: 'article' },
      schema: [
        blogPostingSchema({ path: record.path, headline: post.title, description: post.description, image: `${site.origin}/assets/images/og-image.png`, published: post.published, modified: post.updated, category: post.category, keywords: post.tags, words: postMeta(post).words }),
        ...(faq.length ? [faqSchema(faq)] : []),
      ],
      body: () => <BlogPostPage post={post} crumbs={crumbs} />,
    })
  },
})

// EVERY REGISTRY RECORD THIS FILE OWNS (EVERYTHING EXCEPT "/" AND "/order", WHICH routes.tsx KEEPS).
export const contentViews = (): Record<string, PageView> => {
  const views: Record<string, PageView> = {}
  for (const record of pages) {
    if (record.path === '/' || record.path === '/order') continue
    if (record.path === '/blog') views[record.path] = blogIndexView(record, 1)
    else if (record.path.startsWith('/blog/page/')) views[record.path] = blogIndexView(record, Number(record.path.split('/').pop()))
    else if (record.path.startsWith('/blog/')) views[record.path] = blogPostView(record)
    else views[record.path] = contentView(record)
  }
  return views
}
