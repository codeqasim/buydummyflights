// GENERIC INFO / SERVICE PAGE: HEAD (BREADCRUMB + h1 + LEAD), OPTIONAL SECTION ABOVE THE TEXT, THE TEXT, RAIL, CLOSING CTA.
// THE TEXT IS A `body` BLOCK LIST IN THE PAGE'S MESSAGE NAMESPACE (CONTENT FORMAT: app/content/markup.ts).
import type { Child } from 'hono/jsx'
import { headings, parseBlocks } from '../../content/markup'
import type { PageRecord } from '../../data/pages'
import { I18nProvider, useI18n } from '../../i18n/context'
import { createI18n } from '../../i18n/t'
import { pageLabel } from '../../routes/labels'
import type { Crumb } from '../../seo/schema'
import { LEGAL_IS_DRAFT } from '../../data/site'
import { ArticleShell } from '../article'
import { PageHead } from '../page-head'
import { Prose } from '../prose'
import { Cta } from '../sections/home/cta'

// SECTIONS WRITTEN FOR THE HOME PAGE (STEPS, PRICING, SAMPLE) READ THEIR WORDS FROM THE `home` NAMESPACE; THIS WRAPPER LETS OTHER PAGES REUSE THEM.
export const FromHome = ({ children }: { children?: Child }) => <I18nProvider i18n={createI18n('home')}>{children}</I18nProvider>

export const ContentPage = ({ record, crumbs, before, afterBody, legal = false }: { record: PageRecord; crumbs: Crumb[]; before?: Child; afterBody?: Child; legal?: boolean }) => {
  const { t, data } = useI18n()
  const blocks = parseBlocks(data<string[]>('body'))
  return (
    <>
      <PageHead title={t('h1')} lead={t('lead')} crumbs={crumbs} />
      {legal && LEGAL_IS_DRAFT && (
        <div class="container">
          <p class="legal-note" role="note"><strong>{t('legal.draftTitle')}.</strong> {t('legal.draftText')}</p>
        </div>
      )}
      {before}
      <ArticleShell toc={headings(blocks)} related={(record.related ?? []).map((p) => ({ href: p, label: pageLabel(p) }))} relatedTitle={t('aside.related')}>
        <Prose blocks={blocks} />
        {afterBody}
      </ArticleShell>
      <FromHome><Cta /></FromHome>
    </>
  )
}
