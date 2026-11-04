# Buy Dummy Flights — buydummyflights.com on Hono + Cloudflare Workers

**Status:** home page and `/order` built (r1). The live domain stays **noindex** until the owner flips the launch gate
(§8). Prices and the order flow are placeholders. **Last revision:** 2026-11-05 (r1).

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
  i18n/messages/<ns>/en.json  one folder per page (plus common)
  seo/head.tsx                meta, canonical, hreflang, OG, Twitter, favicons, preloads
  seo/schema.ts               JSON-LD: Organization, WebSite, WebPage, FAQPage, BreadcrumbList, Service
  seo/sitemap.ts, robots.ts   /sitemap.xml (from the registry), /robots.txt
  utils/                      urls.ts, alpine.ts, inline.ts
  views/layout.tsx, header.tsx, footer.tsx, logo.tsx, icons.tsx, ui.tsx, page-head.tsx
  views/partials/             flight-form, ticket
  views/sections/home/        hero, trust, how, uses, pricing, why, sample, reviews, faq, cta
  views/pages/                home.tsx, order.tsx, not-found.tsx
public/                       assets/js/app.js, assets/css (build output), fonts, images, _headers, favicons
styles/input.css              tokens + every shared component class
tools/                        build-assets (Tailwind, vendor copy, hashes), dev, i18n, check-links, check-seo, ship, lib/worker (runs the Worker in Node for tests)
wrangler.jsonc, tsconfig.json, package.json, .dev.vars.example
```

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
- Compatibility date is 2026-04-01 so that the local workerd accepts it; raise it only with a local `wrangler` that supports it.

---

## 7. Placeholders the owner must confirm (TODO(owner))

- **Prices** ($15 / $25 / $35) in `app/data/site.ts` are placeholders, marked `TODO(owner)`. They are not decided prices.
- **Order flow** (`POST /api/order`, page `/order`) is a **mock**: it validates, checks the honeypot (`website`), returns 202 JSON or
  303 to `/order?sent=BDF-PREVIEW-XXXXXXXX`. Nothing is stored, sent, charged or logged. Real fulfilment and payment are not built.
- **Reviews section** is clearly generic placeholder copy: no names, no ratings, no counts, no `Review` schema.
- **Support email / legal pages** are not built yet.

## 8. Indexing launch gate

`INDEXING` (Worker var, default `off`) keeps the production domain `noindex` (meta, `X-Robots-Tag`, `Disallow: /`) until the owner
sets it to `on` in `wrangler.jsonc` after confirming prices and the order flow. localhost and `*.workers.dev` are noindex regardless.

## 9. Measured quality (r1)

Lighthouse on the local preview build (localhost, Chrome headless): mobile performance 100, accessibility 100, best practices 82,
SEO 66; desktop 100 / 100 / 81 / 66. SEO is 66 only because the preview is noindex by design (SEO was 100 with indexing on).
The best-practices loss is one deprecation warning inside the vendored Alpine build (`FencedFrame`), outside our code.

---

## Revision history

- 2026-11-05 r0: project created; domain, zone and README.
- 2026-11-05 r1: Hono + hono/jsx site scaffolded: home page, /order mock, SEO system, CSP, i18n, tools, Workers config, launch gate.
