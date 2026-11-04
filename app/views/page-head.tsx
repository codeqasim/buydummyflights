// INNER-PAGE HEAD: VISIBLE BREADCRUMB + THE ONE <h1>. (HOME HAS ITS OWN HERO.)
import { useI18n } from '../i18n/context'
import type { Crumb } from '../seo/schema'

export const Breadcrumbs = ({ crumbs }: { crumbs: Crumb[] }) => {
  const { t } = useI18n()
  return (
    <nav aria-label={t('a11y.breadcrumb')} class="crumbs">
      <ol>
        {crumbs.map((c, i) => (
          <li>{i < crumbs.length - 1 ? <a href={c.path}>{c.name}</a> : <span aria-current="page">{c.name}</span>}</li>
        ))}
      </ol>
    </nav>
  )
}

export const PageHead = ({ title, lead, crumbs }: { title: string; lead?: string; crumbs: Crumb[] }) => (
  <section class="page-head">
    <div class="container">
      <Breadcrumbs crumbs={crumbs} />
      <h1 class="page-title">{title}</h1>
      {lead && <p class="section-lead">{lead}</p>}
    </div>
  </section>
)
