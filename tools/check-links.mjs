// EVERY INTERNAL href/src IN EVERY RENDERED PAGE MUST RESOLVE (WORKER ROUTE OR FILE IN public/). BROKEN LINKS EXIT 1.
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { loadWorker, root } from './lib/worker.mjs'

const w = await loadWorker()
const origin = 'https://buydummyflights.com'
// SITEMAP INDEX + ITS TWO CHILDREN. ONLY THE CHILDREN LIST PAGES. PAGINATION PAGES (/blog/page/N) ARE NOT IN A SITEMAP, SO THEY ARE ADDED BY FOLLOWING THE BLOG INDEX PAGER.
const children = ['/sitemap-pages.xml', '/sitemap-blog.xml']
const sitemaps = ['/sitemap.xml', '/sitemap.xsl', ...children]
for (const sm of ['/sitemap.xml', '/sitemap.xsl']) { const r = await w.fetch(origin + sm); if (r.status !== 200) { console.error(`FAIL ${sm}: HTTP ${r.status}`); process.exit(1) } }
const locs = []
for (const sm of children) {
  const r = await w.fetch(origin + sm)
  if (r.status !== 200) { console.error(`FAIL ${sm}: HTTP ${r.status}`); process.exit(1) }
  locs.push(...[...(await r.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname))
}
const pages = new Set(['/', '/order', ...locs])
const blogIndex = await (await w.fetch(`${origin}/blog`)).text()
for (const m of blogIndex.matchAll(/href="(\/blog\/page\/\d+)"/g)) pages.add(m[1])
const dynamic = new Set([...sitemaps, '/robots.txt', '/icons.svg'])
let bad = 0
for (const page of pages) {
  const res = await w.fetch(origin + page)
  if (res.status !== 200) { console.error(`FAIL ${page}: HTTP ${res.status}`); bad++; continue }
  const html = await res.text()
  // DUPLICATE id ATTRIBUTES BREAK ANCHORS, ARIA REFERENCES AND THE TOC.
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])
  for (const id of new Set(ids.filter((x, i) => ids.indexOf(x) !== i))) { console.error(`DUPLICATE id "${id}" on ${page}`); bad++ }
  // EVERY #fragment LINK MUST POINT AT AN id ON THE SAME PAGE (THE TOC).
  for (const m of html.matchAll(/href="#([^"]+)"/g)) if (!ids.includes(m[1])) { console.error(`BROKEN anchor #${m[1]} on ${page}`); bad++ }
  const refs = new Set([...html.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)].map((m) => m[1]))
  for (const ref of refs) {
    if (ref === '//' || dynamic.has(ref) || pages.has(ref)) continue
    if (existsSync(join(root, 'public', ref))) continue
    console.error(`BROKEN ${page} -> ${ref}`); bad++
  }
}
// THE ORDER FORM POSTS /api/order: MAKE SURE THE ROUTE EXISTS.
const r = await w.fetch(`${origin}/api/order`, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ name: 'Test', email: 'a@b.co', plan: 'return' }) })
if (r.status !== 202) { console.error(`FAIL /api/order: ${r.status}`); bad++ }
// THE CONTACT FORM IS A MOCK: A VALID POST REDIRECTS TO ?status=sent, AN INVALID ONE TO ?status=error, A BOT (HONEYPOT) GETS A FAKE SUCCESS.
const post = (fields) => w.fetch(`${origin}/api/contact`, { method: 'POST', redirect: 'manual', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(fields).toString() })
for (const [label, fields, expect] of [
  ['valid', { name: 'Alex', email: 'a@b.co', message: 'Hello there, a question' }, 'sent'],
  ['invalid', { name: '', email: 'nope', message: '' }, 'error'],
  ['honeypot', { name: 'A', email: 'a@b.co', message: 'x', website: 'spam' }, 'sent'],
]) {
  const cr = await post(fields)
  if (!(cr.headers.get('location') ?? '').endsWith(`/contact?status=${expect}`)) { console.error(`FAIL /api/contact ${label}: ${cr.status} ${cr.headers.get('location')}`); bad++ }
}
void readFileSync
console.log(bad ? `links: ${bad} problem(s)` : `links: ok (${pages.size} pages)`)
process.exit(bad ? 1 : 0)
