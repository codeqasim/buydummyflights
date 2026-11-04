// SEO CHECK ON EVERY INDEXABLE REGISTRY PAGE (RENDERED WITH INDEXING ON): title <= 60, description <= 155, ONE h1, CANONICAL, OG, JSON-LD TYPES, NO inline style/script. ALSO PROVES PREVIEW HOSTS ARE noindex.
import { loadWorker } from './lib/worker.mjs'

const w = await loadWorker()
const origin = 'https://buydummyflights.com'
const sitemap = await (await w.fetch(`${origin}/sitemap.xml`)).text()
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname)
let bad = 0
const fail = (m) => { console.error('FAIL', m); bad++ }

for (const path of paths) {
  const res = await w.fetch(origin + path)
  const html = await res.text()
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? ''
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? ''
  if (!title || title.length > 60) fail(`${path} title length ${title.length}`)
  if (!desc || desc.length > 155) fail(`${path} description length ${desc.length}`)
  const h1 = (html.match(/<h1[\s>]/g) ?? []).length
  if (h1 !== 1) fail(`${path} has ${h1} h1`)
  if (!html.includes(`<link rel="canonical" href="${origin}${path === '/' ? '/' : path}"`)) fail(`${path} canonical`)
  for (const k of ['og:title', 'og:description', 'og:image', 'twitter:card']) if (!html.includes(k)) fail(`${path} missing ${k}`)
  if (!/content="index, follow/.test(html)) fail(`${path} should be indexable in this run`)
  if (/ style="/.test(html) || [...html.matchAll(/<script\b[^>]*>/g)].some((m) => !/\bsrc=/.test(m[0]) && !/application\/ld\+json/.test(m[0]))) fail(`${path} has inline style or script (CSP)`)
  const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]))
  const types = new Set(ld.flatMap((d) => (d['@graph'] ?? [d]).map((n) => n['@type'])))
  const need = path === '/' ? ['Organization', 'WebSite', 'WebPage', 'BreadcrumbList', 'FAQPage', 'Service'] : ['Organization', 'WebSite', 'WebPage', 'BreadcrumbList']
  for (const t of need) if (!types.has(t)) fail(`${path} missing JSON-LD ${t}`)
  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].filter((m) => !/\balt=/.test(m[0]))
  if (imgs.length) fail(`${path} img without alt`)
  console.log(`ok ${path}: title ${title.length}, desc ${desc.length}, h1 ${h1}, ld ${[...types].join(',')}`)
}

// PREVIEW SAFETY: workers.dev, localhost AND INDEXING=off MUST ALL BE noindex WITH Disallow: /
for (const [label, url, env] of [
  ['workers.dev', 'https://buydummyflights-preview.example.workers.dev/', { ENVIRONMENT: 'production' }],
  ['indexing off', `${origin}/`, { INDEXING: 'off' }],
  ['preview env', `${origin}/`, { ENVIRONMENT: 'preview' }],
]) {
  const r = await w.fetch(url, {}, env)
  const html = await r.text()
  if (!/noindex/.test(r.headers.get('x-robots-tag') ?? '') || !/name="robots" content="noindex/.test(html)) fail(`${label}: not noindex`)
  const robots = await (await w.fetch(new URL('/robots.txt', url).href, {}, env)).text()
  if (!/Disallow: \/\s*$/m.test(robots)) fail(`${label}: robots.txt should Disallow: /`)
}
const www = await w.fetch('https://www.buydummyflights.com/order?x=1', { redirect: 'manual' })
if (www.status !== 301 || www.headers.get('location') !== `${origin}/order?x=1`) fail('www redirect')
const nf = await w.fetch(`${origin}/nope`)
if (nf.status !== 404) fail('404 status')
console.log(bad ? `seo: ${bad} problem(s)` : 'seo: ok')
process.exit(bad ? 1 : 0)
