// RENDERS THE CONTENT FORMAT (app/content/markup.ts) TO HTML. THE ONLY PLACE ARTICLE AND PAGE BODIES BECOME MARKUP.
import type { Block } from '../content/markup'
import { FaqList } from './faq-list'
import { InlineText } from './inline'

export const Prose = ({ blocks }: { blocks: Block[] }) => {
  const out: unknown[] = []
  let group = 0
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i]!
    if (b.k === 'faq') {
      // CONSECUTIVE Q:/A: BLOCKS BECOME ONE ACCORDION (THE SAME ITEMS FEED THE FAQPage SCHEMA).
      const items: { q: string; a: string }[] = []
      while (blocks[i]?.k === 'faq') {
        const f = blocks[i] as Extract<Block, { k: 'faq' }>
        items.push({ q: f.q, a: f.a })
        i++
      }
      i--
      out.push(<FaqList items={items.map((f, n) => ({ id: String(n), q: f.q, a: f.a }))} rich uid={`faq${group++}`} />)
    } else if (b.k === 'h2') out.push(<h2 id={b.id}>{b.text}</h2>)
    else if (b.k === 'h3') out.push(<h3 id={b.id}>{b.text}</h3>)
    else if (b.k === 'ul') out.push(<ul>{b.items.map((t) => <li><InlineText text={t} /></li>)}</ul>)
    else if (b.k === 'ol') out.push(<ol>{b.items.map((t) => <li><InlineText text={t} /></li>)}</ol>)
    else if (b.k === 'note') out.push(<aside class="prose-note"><InlineText text={b.text} /></aside>)
    else if ('text' in b) out.push(<p><InlineText text={b.text} /></p>)
  }
  return <>{out as never}</>
}
