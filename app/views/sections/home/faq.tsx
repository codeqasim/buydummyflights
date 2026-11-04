// FAQ: ONE ALPINE ACCORDION. THE SAME ITEMS FEED THE FAQPage SCHEMA (seo/schema.ts), SO THE PAGE AND THE MARKUP CANNOT DISAGREE.
// WITHOUT JS EVERY ANSWER IS OPEN: THE CLOSED STATE IS PURE CSS UNDER html.js (grid-rows 0fr), TOGGLED BY .is-open.
import { useI18n } from '../../../i18n/context'
import { alpine } from '../../../utils/alpine'
import { Icon } from '../../icons'
import { SectionHeader } from '../../ui'

export type FaqItem = { id: string; q: string; a: string }

export const Faq = ({ items }: { items: FaqItem[] }) => {
  const { t } = useI18n()
  return (
    <section class="section" id="faq" aria-labelledby="faq-title">
      <div class="container faq-wrap">
        <SectionHeader id="faq-title" eyebrow={t('faq.eyebrow')} title={t('faq.title')} lead={t('faq.lead')} />
        <div class="faq-list">
          {items.map((it, i) => (
            <div class="faq-item" {...alpine({ 'x-data': 'faqItem' })}>
              <h3>
                <button type="button" class="faq-q" id={`faq-q-${i}`} aria-controls={`faq-a-${i}`} {...alpine({ '@click': 'toggle' })}>
                  <span>{it.q}</span>
                  <Icon name="chevron" class="faq-caret h-5 w-5" />
                </button>
              </h3>
              <div class="faq-a" id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`}>
                <div class="faq-a-in">
                  <p>{it.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
