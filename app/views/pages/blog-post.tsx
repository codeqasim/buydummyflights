// ONE ARTICLE: BREADCRUMB, h1, BYLINE (AUTHOR, DATES, READING TIME), TOC + RAIL, PROSE, RELATED ARTICLES, CTA.
import { headings, parseBlocks } from '../../content/markup'
import type { Post } from '../../content/blog/types'
import { postMeta, relatedPosts } from '../../content/blog'
import { useI18n } from '../../i18n/context'
import { pageLabel } from '../../routes/labels'
import type { Crumb } from '../../seo/schema'
import { ArticleShell } from '../article'
import { BlogCard, longDate } from '../blog-card'
import { Breadcrumbs } from '../page-head'
import { Prose } from '../prose'
import { Cta } from '../sections/home/cta'
import { FromHome } from './content-page'

export const BlogPostPage = ({ post, crumbs }: { post: Post; crumbs: Crumb[] }) => {
  const { t, href } = useI18n()
  const blocks = parseBlocks(post.body)
  const m = postMeta(post)
  const more = relatedPosts(post, 3)
  return (
    <>
      <section class="page-head">
        <div class="container">
          <Breadcrumbs crumbs={crumbs} />
          <p class="chip chip-brand mt-4">{post.category}</p>
          <h1 class="page-title post-title">{post.title}</h1>
          <p class="post-byline">
            {t('post.by')} <a href={href('/about')}>{t('post.author')}</a> · <time datetime={post.published}>{longDate(post.published)}</time>
            {post.updated !== post.published && <> · {t('post.updated')} <time datetime={post.updated}>{longDate(post.updated)}</time></>}
            {' · '}{t('post.minRead', { n: m.minutes })}
          </p>
        </div>
      </section>
      <ArticleShell toc={headings(blocks)} related={post.services.map((p) => ({ href: p, label: pageLabel(p) }))} relatedTitle={t('post.services')}>
        <Prose blocks={blocks} />
        <p class="post-tags">{post.tags.map((tag) => <span class="chip">{tag}</span>)}</p>
      </ArticleShell>
      {more.length > 0 && (
        <section class="section section-alt" aria-labelledby="more-title">
          <div class="container">
            <h2 class="section-title" id="more-title">{t('post.more')}</h2>
            <div class="post-grid mt-8">
              {more.map((p) => <BlogCard post={p} />)}
            </div>
          </div>
        </section>
      )}
      <FromHome><Cta /></FromHome>
    </>
  )
}
