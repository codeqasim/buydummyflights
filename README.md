# Buy Dummy Flights — buydummyflights.com on Hono + Cloudflare Workers

**Status:** multi-page site built: home, `/order`, 16 content pages and an 11-article blog (r3). The live domain stays **noindex** until the owner flips the launch gate
(§8). Prices and the order flow are placeholders. **Last revision:** 2026-11-05 (r3).

This file is the single source of truth for the project, written for a human developer and an AI coding agent alike.
Update it in the same change that alters what it describes, and add a dated line to the revision history. Do not
create other `.md` files in this repo.

---

## 0. Definition of done for every page

A page is finished only when all seven checks pass. Report each result.

1. **Every string through `t()`:** words live in `app/i18n/messages/<ns>/en.json`; no visible word in a view.
2. **Mobile and responsive:** 375 px, tablet, desktop; no horizontal scroll; tap targets ≥ 44 px.
3. **Theme:** light and dark mode, every state (hover, open, active).
4. **SEO 100 % and schema:** title ≤ 60 chars, keyword first, `| BuyDummyFlights` last; description ≤ 155; exactly one
   keyword `<h1>`; canonical; breadcrumb (visible + `BreadcrumbList`); page JSON-LD (`FAQPage` where there is a FAQ,
   `Service` on service pages); Lighthouse SEO 100 in production (preview is noindex by design).
5. **Design system:** Tailwind + shared components (§7); one accent colour; images only where they carry information.
6. **Internal links:** 3–5 related pages linked; linked from nav or footer; `npm run links` reports no dangling link.
7. **In the sitemap:** registry record in `app/data/pages.ts` has `index: true` and appears in `/sitemap.xml`.

---

## 1. What this is

| | |
| --- | --- |
| Business | Buy Dummy Flights: verifiable dummy flight tickets / flight reservations (onward and return itineraries with a real PNR) for visa applications, proof of onward travel and travel planning. |
| Audience | Visa applicants worldwide (Schengen, UK, US, Canada, UAE …) who need a flight itinerary without buying a ticket. |
| Hosting | Cloudflare Workers with Static Assets; `buydummyflights-preview` on workers.dev (noindex), `buydummyflights` on the custom domain |
| Domain | buydummyflights.com (Cloudflare Registrar, zone on Cloudflare) |
| Repo | github.com/codeqasim/buydummyflights, branch `main` |

**Priorities, in order:** (1) SEO as a build constraint; (2) a clear, trustworthy, component-based design;
(3) Lighthouse 100 on mobile; (4) a frictionless order form, from the home page to a confirmed reservation.

---

## 2. Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| Runtime | Cloudflare Workers + Static Assets | `public/` served at the edge; the Worker renders pages, sitemaps, robots, 301s, real 404s, the order API |
| Server | Hono + server-side JSX (`hono/jsx`) | Tiny router, HTML rendering, no React, no hydration |
| Language | TypeScript (`.ts` logic, `.tsx` views), `strict` + `noUncheckedIndexedAccess` | wrangler bundles with esbuild |
| CSS | Tailwind v4, compiled at build time | Tokens via `@theme inline`, components via `@layer components`; no CDN |
| Behaviour | Alpine.js **CSP build** + `@alpinejs/intersect` | No `unsafe-eval`, so the CSP has no inline script or style; components are registered with `Alpine.data()` in `app.js`; self-hosted |
| Transitions | none | Swup and `@alpinejs/collapse` were dropped: real page loads are faster and need no JS. The FAQ is pure CSS (grid rows) under `html.js` |
| Font | One variable font, self-hosted | Google Fonts never called at runtime |
| Icons | Inline SVG sprite at `/icons.svg` | No icon font |
| Languages | Own i18n layer in `app/i18n` (English today) | Every word through `t()` |

Deliberately **not** used: React/Vue, Next/Astro, an ORM, CSS-in-JS, an icon font, a UI kit, jQuery, any runtime CDN.

---

## 3. Commands

```bash
npm install
npm run dev          # wrangler dev on http://localhost:8788
npm run typecheck    # tsc --noEmit
npm run links        # dangling internal links -> exit 1
npm run i18n         # regenerate app/i18n/messages/index.ts, report gaps
npm run i18n:check   # same, exit 1 on any gap
npm run build        # assets + wrangler dry-run bundle
npm run seo          # title/description length, one h1, JSON-LD types, no inline script
npm run check        # i18n:check + typecheck + links + seo
npm run deploy       # PREVIEW Worker on workers.dev (always noindex); needs `wrangler login` or CLOUDFLARE_API_TOKEN
npm run ship -- "msg"   # build assets -> check -> git commit -> git push origin main (never force)
```

Pushes to `main` deploy the production Worker through Cloudflare Workers Builds (Git integration), see §6.

---

## 4. Folder structure

```text
src/index.ts                  Worker entry: exports the Hono app
app/
  env.ts                      bindings (ASSETS, ENVIRONMENT, …) + per-request variables
  routes/routes.tsx           middleware, PAGE_VIEWS, API routes, sitemaps, robots, icons, 404, 500
  routes/render.tsx           renderPage(), renderDocument()
  routes/security.ts          security headers + CSP
  routes/order-api.ts         POST /api/order
  data/site.ts                every brand fact, URL and nav/footer structure (no visible words)
  data/pages.ts               PAGE REGISTRY: path, ns, canonical, index, lastModified
  data/airports.ts            airports / cities for the search form
  data/assets.ts              GENERATED by tools/build-assets.mjs (asset hashes); committed
  i18n/locales.ts, t.ts, context.tsx
  i18n/messages/<ns>/en.json  one folder per page (plus common): home, order, how, pricing, sample, faq, about, contact,
                              schengen, usvisa, ukvisa, canada, onward, returnflight, hotel, terms, privacy, refund, blog
  seo/head.tsx                meta, canonical, hreflang, OG, Twitter, favicons, preloads
  seo/schema.ts               JSON-LD: Organization, WebSite, WebPage, FAQPage, BreadcrumbList, Service
  seo/sitemap.ts, robots.ts   /sitemap.xml (pages, from the registry), /sitemap-blog.xml (articles), /robots.txt (lists both)
  utils/                      urls.ts, alpine.ts, inline.ts
  views/layout.tsx, header.tsx, footer.tsx, logo.tsx, icons.tsx, ui.tsx, page-head.tsx
  views/partials/             flight-form, ticket
  views/sections/home/        hero, trust, how, uses, pricing, why, sample, reviews, faq, cta
  views/sections/home/guides.tsx  latest-articles strip on the home page
  views/pages/                home.tsx, order.tsx, not-found.tsx, content-page.tsx (generic service/legal page), contact.tsx, blog-index.tsx, blog-post.tsx
  views/prose.tsx, article.tsx, faq-list.tsx, pager.tsx, blog-card.tsx, inline.tsx   article/page body renderers
  routes/page-views.tsx       maps every registry record to its view; contact-api.ts = POST /api/contact (mock)
  content/markup.ts           tiny markup parser for page bodies and posts (see below)
  content/blog/*.ts           one file per article (11), index.ts lists them; types.ts
public/                       assets/js/app.js, assets/css (build output), fonts, images, _headers, favicons
styles/input.css              tokens + every shared component class
tools/                        build-assets (Tailwind, vendor copy, hashes), dev, i18n, check-links, check-seo, ship, lib/worker (runs the Worker in Node for tests)
wrangler.jsonc, tsconfig.json, package.json, .dev.vars.example
```

**Adding a page:** add a record to `app/data/pages.ts`, a view in `routes/page-views.tsx`, a namespace folder with `meta{title,description}`,
`crumb`, `h1`, `lead`, `body[]`, then run `npm run i18n` and `npm run check`. **Adding an article:** add `app/content/blog/<slug>.ts`
and list it in `content/blog/index.ts`; the index, pagination (`BLOG_PAGE_SIZE`, `/blog/page/N`), related posts, TOC, schema and
`/sitemap-blog.xml` follow automatically. Body markup: `## ` h2, `### ` h3, `- ` list, `1. ` ordered list, `> ` callout, `Q:`/`A:` FAQ pair,
`[text](/path)`, `**bold**`; blank line separates paragraphs. All article text lives in the repo (no CMS).

**Layout:** the container is `max-width: 80rem` with `padding-inline: clamp(1.25rem, 3.5vw, 2.75rem)` (`.container` in `styles/input.css`),
matching the measured width of the reference site; the spec MD gives no number. Narrow it in that one rule if the owner wants.

Layering rule: `data/` knows nothing about HTTP; `routes/` reads the request and picks a view; `views/` only render props.

---

## 5. SEO system

- **Registry** drives routes and the sitemap; a registry entry without a view throws at startup.
- **Head:** canonical, hreflang (`en` + `x-default`), robots (`noindex, nofollow` on preview), Open Graph 1200×630,
  Twitter card, theme-color, LCP + font preload.
- **Schema:** `Organization` + `WebSite` on every page, `WebPage` per page, `FAQPage` / `BreadcrumbList` / `Service` from
  the same arrays the page renders. Never emit a figure not visible on the page; no fake `aggregateRating`/`Review`.
- **Preview safety:** localhost and `*.workers.dev` are always noindex (`Disallow: /`, `X-Robots-Tag`, meta).
- **Headings:** one `<h1>`; sections `<h2>`; cards `<h3>`.
- **Security headers:** CSP, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`; HSTS in production only.
- **Pages:** 17 indexable pages in `/sitemap.xml` plus `/blog`; 11 articles in `/sitemap-blog.xml`; `/blog/page/N` is self-canonical and not in a sitemap.
  Articles emit `BlogPosting` + `BreadcrumbList` + `FAQPage` (when they have Q/A) with a visible `<time datetime>`; the author is the organisation.
- **Checks (`npm run check`):** `check-links` crawls both sitemaps and the pager (broken links, duplicate ids, broken #anchors, contact and order API behaviour);
  `check-seo` enforces title ≤60 and description ≤155, one h1, canonical, the JSON-LD types, ≥3 distinct internal links in `<main>`, 1200–2000 words per article,
  both sitemaps and robots, no duplicate URLs, and the preview noindex safety rules.
- **Search Console:** domain property verified via Cloudflare DNS TXT; `/sitemap.xml` submitted.

---

## 6. Infrastructure

- Cloudflare zone `buydummyflights.com` (id `0050c0ae0d62b0bc89614c8bfddde42c`), nameservers june / oswald.ns.cloudflare.com.
- SSL Full (strict), Always Use HTTPS, Automatic HTTPS Rewrites, min TLS 1.2, TLS 1.3 on. HSTS off until launch.
- `www` = proxied AAAA `100::` placeholder; redirect rule 301 `www` → `https://buydummyflights.com` (path kept, query kept).
- Apex DNS is created by the Worker custom domain.
- Workers: `buydummyflights` (production, custom domain `buydummyflights.com`, `workers_dev` off) and
  `buydummyflights-preview` (workers.dev, noindex). Both are configured in `wrangler.jsonc` (production = top level,
  preview = `env.preview`). `www` is redirected to the apex inside the Worker as well as by the zone rule.
- **Workers Builds** (Git integration, GitHub app on `codeqasim`): a push to `main` builds and deploys both Workers with
  `npm ci && npm run build:assets`, then `npx wrangler deploy` (production) and `npx wrangler deploy --env preview` (preview).
  The preview trigger is limited to `main` because Cloudflare rejected a `*` branch include with no excludes. Both triggers use
  an existing account build token ("Workers Builds - 2026-09-04 01:11"); no secrets live in the repo.
- Preview URL: https://buydummyflights-preview.phptravels.workers.dev (always noindex). Production: https://buydummyflights.com
  (noindex until `INDEXING=on`). Only the apex is a Worker custom domain; `www` stays the proxied placeholder behind the zone 301 rule.
- Compatibility date is 2026-04-01 so that the local workerd accepts it; raise it only with a local `wrangler` that supports it.

---

## 7. Placeholders the owner must confirm (TODO(owner))

- **Prices** ($15 / $25 / $35) in `app/data/site.ts` are placeholders, marked `TODO(owner)`. They are not decided prices.
- **Order flow** (`POST /api/order`, page `/order`) is a **mock**: it validates, checks the honeypot (`website`), returns 202 JSON or
  303 to `/order?sent=BDF-PREVIEW-XXXXXXXX`. Nothing is stored, sent, charged or logged. Real fulfilment and payment are not built.
- **Reviews section** is clearly generic placeholder copy: no names, no ratings, no counts, no `Review` schema.
- **Support email:** `contactEmail` in `app/data/site.ts` is `null`; set it and it appears in the footer, the Organization schema and removes the mock notice on `/contact`. `TODO(owner)`.
- **Contact form** (`POST /api/contact`) is a **mock**: it validates, checks the honeypot, redirects to `/contact?status=sent`, and sends nothing. Real delivery is not built.
- **Legal pages** (`/terms`, `/privacy`, `/refund-policy`) are **drafts** (`LEGAL_IS_DRAFT=true` shows a banner) and need owner or lawyer review before launch.
- **Hotel page** (`/hotel-reservation-for-visa`) is flight-only in scope and says we do not sell hotel reservations; whether to offer them is `TODO(owner)`.
- **Validity window** of a reservation is "shown at checkout" everywhere; no number is promised until the owner confirms the product. `TODO(owner)`.
- **Blog** posts are dated 2026-11-05 and credit the BuyDummyFlights team; they contain no invented statistics or quotes and cite embassy guidance only generally.

## 8. Indexing launch gate

`INDEXING` (Worker var, default `off`) keeps the production domain `noindex` (meta, `X-Robots-Tag`, `Disallow: /`) until the owner
sets it to `on` in `wrangler.jsonc` after confirming prices and the order flow. localhost and `*.workers.dev` are noindex regardless.

## 9. Measured quality (r3)

Lighthouse on the local preview build (localhost, Chrome headless), home, `/dummy-ticket-for-schengen-visa`, `/blog` and one article: mobile
performance 100, accessibility 100, best practices 82, SEO 66; desktop 100 / 100 / 81 / 66 (also 100 performance on `/pricing`, `/faq`, `/contact`, `/how-it-works`, `/terms`). SEO is 66 only because the preview is noindex by design (SEO was 100 with indexing on).
The best-practices loss is one deprecation warning inside the vendored Alpine build (`FencedFrame`), outside our code.

---

## Revision history

- 2026-11-05 r0: project created; domain, zone and README.
- 2026-11-05 r1: Hono + hono/jsx site scaffolded: home page, /order mock, SEO system, CSP, i18n, tools, Workers config, launch gate.
- 2026-11-05 r2: Workers `buydummyflights` and `buydummyflights-preview` created, Workers Builds connected to this repo, custom domain buydummyflights.com attached.
- 2026-11-05 r3: multi-page site (16 content pages, dropdown nav, full footer), blog with 11 articles, `/sitemap-blog.xml`, container widened to 80rem, home guides strip, contact mock, checks extended (links, seo).
