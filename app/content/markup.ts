// THE TINY CONTENT FORMAT SHARED BY PAGE BODIES (i18n JSON) AND BLOG ARTICLES (app/content/blog/*.ts).
// WHY A FORMAT AND NOT HTML: WRITERS EDIT PLAIN TEXT, THE RENDERER STAYS THE ONLY PLACE THAT EMITS MARKUP, AND LINKS CAN BE CHECKED.
//   "## Title" H2 · "### Title" H3 · "- a" LIST · "1. a" NUMBERED LIST · "> text" CALLOUT · "Q: ..." + "A: ..." FAQ ITEM
//   INLINE: [text](/path) INTERNAL LINK · **bold**
export type Block =
  | { k: 'h2' | 'h3'; text: string; id: string }
  | { k: 'p' | 'note'; text: string }
  | { k: 'ul' | 'ol'; items: string[] }
  | { k: 'faq'; q: string; a: string }

export const slugify = (s: string): string =>
  s.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

export function parseBlocks(src: string | string[]): Block[] {
  const raw = (Array.isArray(src) ? src : src.split(/\n{2,}/)).map((b) => b.trim()).filter(Boolean)
  const seen = new Map<string, number>()
  const uid = (text: string): string => {
    const base = slugify(text) || 'section'
    const n = (seen.get(base) ?? 0) + 1
    seen.set(base, n)
    return n === 1 ? base : `${base}-${n}`
  }
  return raw.map((b): Block => {
    if (b.startsWith('## ')) return { k: 'h2', text: b.slice(3).trim(), id: uid(b.slice(3)) }
    if (b.startsWith('### ')) return { k: 'h3', text: b.slice(4).trim(), id: uid(b.slice(4)) }
    if (b.startsWith('> ')) return { k: 'note', text: b.replace(/^> ?/gm, '').replace(/\n/g, ' ').trim() }
    if (/^- /.test(b)) return { k: 'ul', items: b.split(/\n(?=- )/).map((l) => l.replace(/^- /, '').replace(/\n/g, ' ').trim()) }
    if (/^\d+\. /.test(b)) return { k: 'ol', items: b.split(/\n(?=\d+\. )/).map((l) => l.replace(/^\d+\. /, '').replace(/\n/g, ' ').trim()) }
    const faq = /^Q: ([\s\S]+?)\nA: ([\s\S]+)$/.exec(b)
    if (faq) return { k: 'faq', q: faq[1]!.replace(/\n/g, ' ').trim(), a: faq[2]!.replace(/\n/g, ' ').trim() }
    return { k: 'p', text: b.replace(/\n/g, ' ') }
  })
}

export type Inline = string | { link: string; text: string } | { bold: string }
export function parseInline(text: string): Inline[] {
  return text
    .split(/(\[[^\]]+\]\([^)\s]+\)|\*\*[^*]+\*\*)/)
    .filter(Boolean)
    .map((part): Inline => {
      const l = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part)
      if (l) return { link: l[2]!, text: l[1]! }
      const b = /^\*\*([^*]+)\*\*$/.exec(part)
      return b ? { bold: b[1]! } : part
    })
}

export const plain = (text: string): string => text.replace(/\[([^\]]+)\]\([^)\s]+\)/g, '$1').replace(/\*\*([^*]+)\*\*/g, '$1')

export const blockText = (b: Block): string =>
  'items' in b ? b.items.map(plain).join(' ') : 'q' in b ? `${plain(b.q)} ${plain(b.a)}` : plain(b.text)

export const wordCount = (blocks: Block[]): number => blocks.map(blockText).join(' ').split(/\s+/).filter(Boolean).length
export const readingMinutes = (words: number): number => Math.max(1, Math.round(words / 220))
export const faqOf = (blocks: Block[]): { q: string; a: string }[] =>
  blocks.flatMap((b) => (b.k === 'faq' ? [{ q: plain(b.q), a: plain(b.a) }] : []))
export const headings = (blocks: Block[]): { id: string; text: string }[] =>
  blocks.flatMap((b) => (b.k === 'h2' ? [{ id: b.id, text: b.text }] : []))
// EVERY INTERNAL LINK USED INSIDE A BLOCK LIST (THE LINK CHECK VERIFIES EACH ONE EXISTS).
export const linksOf = (blocks: Block[]): string[] =>
  blocks.flatMap((b) => {
    const texts = 'items' in b ? b.items : 'q' in b ? [b.q, b.a] : [b.text]
    return texts.flatMap((t) => parseInline(t).flatMap((i) => (typeof i === 'object' && 'link' in i ? [i.link] : [])))
  })
