// TWO-COLUMN READING LAYOUT SHARED BY EVERY CONTENT PAGE AND EVERY BLOG ARTICLE: PROSE ON THE LEFT, A STICKY RAIL (TOC, ORDER CTA, RELATED LINKS) ON THE RIGHT.
// WHY TWO TOCs: A NATIVE <details> ABOVE THE TEXT ON PHONES, A STICKY LIST IN THE RAIL ON DESKTOP. BOTH ARE PLAIN LINKS (NO JS).
import type { Child } from 'hono/jsx'
import { useI18n } from '../i18n/context'
import { Icon } from './icons'
import { CtaLink } from './ui'

export type TocItem = { id: string; text: string }
export type RelatedLink = { href: string; label: string }

const TocList = ({ items }: { items: TocItem[] }) => (
  <ol>
    {items.map((i) => (
      <li><a href={`#${i.id}`}>{i.text}</a></li>
    ))}
  </ol>
)

export const ArticleShell = ({ toc, related, relatedTitle, children }: { toc: TocItem[]; related: RelatedLink[]; relatedTitle: string; children?: Child }) => {
  const { t, href } = useI18n()
  return (
    <section class="section is-article pt-0">
      <div class="container article-grid">
        <div class="article-main">
          {toc.length > 2 && (
            <details class="toc toc-mobile">
              <summary>{t('toc.title')}<Icon name="chevron" class="h-4 w-4" /></summary>
              <nav aria-label={t('toc.title')}><TocList items={toc} /></nav>
            </details>
          )}
          <article class="prose">{children}</article>
        </div>
        <aside class="article-aside" aria-label={t('aside.label')}>
          {toc.length > 2 && (
            <nav class="toc toc-desktop" aria-label={t('toc.title')}>
              <p class="toc-title">{t('toc.title')}</p>
              <TocList items={toc} />
            </nav>
          )}
          <div class="card aside-cta">
            <p class="card-title">{t('aside.ctaTitle')}</p>
            <p class="card-text">{t('aside.ctaText')}</p>
            <CtaLink href={href('/order')} block>{t('cta.orderShort')}</CtaLink>
          </div>
          {related.length > 0 && (
            <nav class="aside-links" aria-label={relatedTitle}>
              <p class="toc-title">{relatedTitle}</p>
              <ul>
                {related.map((r) => (
                  <li><a href={href(r.href)}>{r.label}</a></li>
                ))}
              </ul>
            </nav>
          )}
        </aside>
      </div>
    </section>
  )
}
