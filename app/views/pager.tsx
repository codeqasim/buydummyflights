// PREV / NEXT PAGER FOR /blog (PAGE 1 IS /blog, PAGE N IS /blog/page/N). RENDERS NOTHING FOR A SINGLE PAGE.
import { useI18n } from '../i18n/context'

export const pagePath = (n: number): string => (n <= 1 ? '/blog' : `/blog/page/${n}`)

export const Pager = ({ page, pages }: { page: number; pages: number }) => {
  const { t, href } = useI18n()
  if (pages <= 1) return null
  return (
    <nav class="pager" aria-label={t('pager.label')}>
      {page > 1 ? <a class="btn btn-secondary" rel="prev" href={href(pagePath(page - 1))}>{t('pager.prev')}</a> : <span></span>}
      <span class="pager-count">{t('pager.count', { page, pages })}</span>
      {page < pages ? <a class="btn btn-secondary" rel="next" href={href(pagePath(page + 1))}>{t('pager.next')}</a> : <span></span>}
    </nav>
  )
}
