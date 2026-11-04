// EVERY INTERNAL href/src IN EVERY RENDERED PAGE MUST RESOLVE (WORKER ROUTE OR FILE IN public/). BROKEN LINKS EXIT 1.
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { loadWorker, root } from './lib/worker.mjs'

const w = await loadWorker()
const origin = 'https://buydummyflights.com'
const sitemap = await (await w.fetch(`${origin}/sitemap.xml`)).text()
const pages = new Set(['/', '/order', ...[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)])
const dynamic = new Set(['/sitemap.xml', '/robots.txt', '/icons.svg'])
let bad = 0
for (const page of pages) {
  const res = await w.fetch(origin + page)
  if (res.status !== 200) { console.error(`FAIL ${page}: HTTP ${res.status}`); bad++; continue }
  const html = await res.text()
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
void readFileSync
console.log(bad ? `links: ${bad} problem(s)` : `links: ok (${pages.size} pages)`)
process.exit(bad ? 1 : 0)
