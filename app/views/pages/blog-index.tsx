// /blog AND /blog/page/N: CARD GRID + PREV/NEXT PAGER (ONLY WHEN THERE IS MORE THAN ONE PAGE).
import type { Post } from '../../content/blog/types'
import { useI18n } from '../../i18n/context'
import type { Crumb } from '../../seo/schema'
import { BlogCard } from '../blog-card'
import { PageHead } from '../page-head'
import { Pager } from '../pager'
import { FromHome } from './content-page'
import { Cta } from '../sections/home/cta'

export const BlogIndexPage = ({ items, page, pages, crumbs }: { items: Post[]; page: number; pages: number; crumbs: Crumb[] }) => {
  const { t } = useI18n()
  return (
    <>
      <PageHead title={page > 1 ? t('h1Page', { n: page }) : t('h1')} lead={t('lead')} crumbs={crumbs} />
      <section class="section pt-0">
        <div class="container">
          {/* VISUALLY HIDDEN H2 SO THE CARD H3s FOLLOW A VALID HEADING ORDER (ACCESSIBILITY) WITHOUT CHANGING THE DESIGN. */}
          <h2 class="sr-only">{t('list')}</h2>
          <div class="post-grid">
            {items.map((p) => <BlogCard post={p} />)}
          </div>
          <Pager page={page} pages={pages} />
        </div>
      </section>
      <FromHome><Cta /></FromHome>
    </>
  )
}
