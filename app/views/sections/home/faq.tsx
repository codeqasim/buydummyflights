// FAQ: ONE ALPINE ACCORDION. THE SAME ITEMS FEED THE FAQPage SCHEMA (seo/schema.ts), SO THE PAGE AND THE MARKUP CANNOT DISAGREE.
// WITHOUT JS EVERY ANSWER IS OPEN: THE CLOSED STATE IS PURE CSS UNDER html.js (grid-rows 0fr), TOGGLED BY .is-open.
import { useI18n } from '../../../i18n/context'
import { FaqList, type FaqItem } from '../../faq-list'
import { SectionHeader } from '../../ui'

export type { FaqItem } from '../../faq-list'

export const Faq = ({ items }: { items: FaqItem[] }) => {
  const { t } = useI18n()
  return (
    <section class="section" id="faq" aria-labelledby="faq-title">
      <div class="container faq-wrap">
        <SectionHeader id="faq-title" eyebrow={t('faq.eyebrow')} title={t('faq.title')} lead={t('faq.lead')} />
        <FaqList items={items} />
      </div>
    </section>
  )
}
