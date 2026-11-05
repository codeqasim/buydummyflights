// FAQ ACCORDION (ALPINE). WITHOUT JS EVERY ANSWER IS OPEN: THE CLOSED STATE IS PURE CSS UNDER html.js, TOGGLED BY .is-open.
import { alpine } from '../utils/alpine'
import { Icon } from './icons'
import { InlineText } from './inline'

export type FaqItem = { id: string; q: string; a: string }

// THE ACCORDION ALONE: REUSED BY THE FAQ SECTION, THE /faq PAGE AND EVERY ARTICLE/PAGE THAT CARRIES Q:/A: BLOCKS.
// rich = ANSWERS MAY CONTAIN [links](/path) AND **bold** (CONTENT-FORMAT TEXT); OTHERWISE PLAIN STRINGS.
export const FaqList = ({ items, rich = false, uid = 'faq' }: { items: FaqItem[]; rich?: boolean; uid?: string }) => (
  <div class="faq-list">
    {items.map((it, i) => (
      <div class="faq-item" {...alpine({ 'x-data': 'faqItem' })}>
        <h3>
          <button type="button" class="faq-q" id={`${uid}-q-${i}`} aria-controls={`${uid}-a-${i}`} {...alpine({ '@click': 'toggle' })}>
            <span>{rich ? <InlineText text={it.q} /> : it.q}</span>
            <Icon name="chevron" class="faq-caret h-5 w-5" />
          </button>
        </h3>
        <div class="faq-a" id={`${uid}-a-${i}`} role="region" aria-labelledby={`${uid}-q-${i}`}>
          <div class="faq-a-in">
            <p>{rich ? <InlineText text={it.a} /> : it.a}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
)
