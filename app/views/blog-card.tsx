// ONE ARTICLE CARD (BLOG INDEX, RELATED ARTICLES, HOME). THE TITLE LINK IS STRETCHED OVER THE CARD IN CSS, SO THE WHOLE CARD IS ONE TAP TARGET.
import type { Post } from '../content/blog/types'
import { postMeta } from '../content/blog'
import { useI18n } from '../i18n/context'

export const longDate = (iso: string): string => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`))

export const BlogCard = ({ post }: { post: Post }) => {
  const { t, href } = useI18n()
  const m = postMeta(post)
  return (
    <article class="card post-card">
      <p class="chip chip-brand">{post.category}</p>
      <h3 class="card-title"><a class="post-link" href={href(`/blog/${post.slug}`)}>{post.title}</a></h3>
      <p class="card-text">{post.description}</p>
      <p class="post-meta"><time datetime={post.published}>{longDate(post.published)}</time> · {t('post.minRead', { n: m.minutes })}</p>
    </article>
  )
}
