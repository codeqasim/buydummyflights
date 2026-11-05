// SEO CHECK ON EVERY INDEXABLE REGISTRY PAGE (RENDERED WITH INDEXING ON): title <= 60, description <= 155, ONE h1, CANONICAL, OG, JSON-LD TYPES, NO inline style/script. ALSO PROVES PREVIEW HOSTS ARE noindex.
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { loadWorker, root } from './lib/worker.mjs'

const w = await loadWorker()
const origin = 'https://buydummyflights.com'
let bad = 0
const fail = (m) => { console.error('FAIL', m); bad++ }
// SITEMAP INDEX -> pages + blog CHILDREN; ROBOTS ADVERTISES ONLY THE INDEX; EVERY URL HAS lastmod AND AN OG IMAGE; NO changefreq/priority; XSL + CSS SERVED.
const paths = []
const index = await (await w.fetch(`${origin}/sitemap.xml`)).text()
if (!/<sitemapindex /.test(index)) fail('/sitemap.xml is not a sitemap index')
for (const sm of ['/sitemap-pages.xml', '/sitemap-blog.xml']) {
  if (!index.includes(`<loc>${origin}${sm}</loc>`)) fail(`sitemap index missing ${sm}`)
  const r = await w.fetch(origin + sm)
  if (r.status !== 200) { fail(`${sm} HTTP ${r.status}`); continue }
  const xml = await r.text()
  const urls = xml.match(/<url>/g)?.length ?? 0
  if (urls === 0) fail(`${sm} is empty`)
  if ((xml.match(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g)?.length ?? 0) !== urls) fail(`${sm}: every URL needs a lastmod`)
  if ((xml.match(/<image:loc>https:\/\/buydummyflights\.com\/assets\/images\/og-image\.png<\/image:loc>/g)?.length ?? 0) !== urls) fail(`${sm}: every URL needs the OG image`)
  if (/changefreq|priority/.test(xml)) fail(`${sm}: changefreq/priority should not be emitted`)
  if (!xml.includes('href="/sitemap.xsl"')) fail(`${sm}: missing xml-stylesheet`)
  paths.push(...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname))
}
for (const f of ['/sitemap.xsl', '/sitemap.css']) {
  if (f === '/sitemap.css') continue // STATIC FILE: SERVED BY WORKERS ASSETS, NOT THE WORKER
  const r = await w.fetch(origin + f)
  if (r.status !== 200 || !(await r.text()).includes('xsl:stylesheet')) fail(`${f} not served`)
}
if (new Set(paths).size !== paths.length) fail('a URL is listed in both sitemaps or twice')
const robotsTxt = await (await w.fetch(`${origin}/robots.txt`)).text()
if (!robotsTxt.includes(`Sitemap: ${origin}/sitemap.xml`)) fail('robots.txt missing the sitemap index')
for (const rule of ['Allow: /', 'Disallow: /order', 'Disallow: /api/']) if (!robotsTxt.includes(rule)) fail(`robots.txt missing "${rule}"`)
// PRODUCTION (INDEXING ON) MUST NOT SEND noindex ON THE HOME PAGE.
const homeRes = await w.fetch(`${origin}/`)
if (/noindex/.test(homeRes.headers.get('x-robots-tag') ?? '')) fail('production sends X-Robots-Tag noindex')
if (!existsSync(join(root, 'public/sitemap.css'))) fail('public/sitemap.css missing')
const POST_MIN = 1200
const POST_MAX = 2000
const wordsOf = (html) => {
  const art = html.match(/<article class="prose">([\s\S]*?)<\/article>/)?.[1] ?? ''
  return art.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ').split(/\s+/).filter(Boolean).length
}

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
  // /about AND /contact USE THE MORE SPECIFIC schema.org PAGE TYPES (AboutPage, ContactPage) INSTEAD OF WebPage.
  for (const t of need) if (!(t === 'WebPage' ? ['WebPage', 'AboutPage', 'ContactPage'].some((x) => types.has(x)) : types.has(t))) fail(`${path} missing JSON-LD ${t}`)
  // 3-5 INTERNAL LINKS INSIDE <main> (HEADER AND FOOTER DO NOT COUNT). "/" ITSELF IS EXEMPT BECAUSE ITS SECTIONS LINK OUT.
  const main = html.match(/<main[\s\S]*?<\/main>/)?.[0] ?? ''
  const internal = new Set([...main.matchAll(/<a\b[^>]*href="(\/[^"#?]*)/g)].map((m) => m[1]).filter((h) => h !== path))
  if (path !== '/' && internal.size < 3) fail(`${path} has only ${internal.size} distinct internal links in <main>`)
  if (path.startsWith('/blog/')) {
    const words = wordsOf(html)
    if (words < POST_MIN || words > POST_MAX) fail(`${path} has ${words} words (want ${POST_MIN}-${POST_MAX})`)
    for (const t of ['BlogPosting']) if (!types.has(t)) fail(`${path} missing JSON-LD ${t}`)
    if (!/<time datetime="\d{4}-\d{2}-\d{2}"/.test(html)) fail(`${path} missing visible date`)
  }
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
// PAGINATION PAGE 2 EXISTS, IS CANONICAL TO ITSELF AND STAYS OUT OF THE SITEMAPS.
const p2 = await w.fetch(`${origin}/blog/page/2`)
const p2html = await p2.text()
if (p2.status !== 200 || !p2html.includes(`<link rel="canonical" href="${origin}/blog/page/2"`)) fail('/blog/page/2 missing or wrong canonical')
if (paths.includes('/blog/page/2')) fail('/blog/page/2 should not be in a sitemap')
const nf = await w.fetch(`${origin}/nope`)
if (nf.status !== 404) fail('404 status')
console.log(bad ? `seo: ${bad} problem(s)` : 'seo: ok')
process.exit(bad ? 1 : 0)
