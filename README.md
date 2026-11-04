# Buy Dummy Flights — buydummyflights.com on Hono + Cloudflare Workers

**Status:** infrastructure stage. Domain registered on Cloudflare, zone configured (SSL Full strict, HTTPS forced,
TLS 1.2+, www → apex 301). Next: scaffold the Worker, then the home page. **Last revision:** 2026-11-05 (r0).

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
| Behaviour | Alpine.js + `@alpinejs/intersect` + `@alpinejs/collapse` | Header, menus, drawer, FAQ, order form; self-hosted |
| Transitions | Swup | Soft page fades over real URLs; progressive enhancement only |
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
npm run check        # i18n:check + typecheck + links
npm run deploy       # PREVIEW Worker on workers.dev (always noindex)
npm run ship         # PRODUCTION: check -> build -> deploy -> health check of /, /sitemap.xml, /robots.txt
```

Pushes to `main` deploy through Cloudflare Workers Builds (Git integration).

---

## 4. Folder structure

```text
src/index.ts                  Worker entry: exports the Hono app
app/
  env.ts                      bindings (ASSETS, ENVIRONMENT, …) + per-request variables
  routes/routes.tsx           middleware, PAGE_VIEWS, API routes, sitemaps, robots, icons, 404, 500
  routes/render.ts            renderPage(), renderDocument()
  routes/security.ts          security headers + CSP
  routes/order-api.ts         POST /api/order
  data/site.ts                every brand fact, URL and nav/footer structure (no visible words)
  data/pages.ts               PAGE REGISTRY: path, ns, canonical, index, lastModified
  data/airports.ts            airports / cities for the search form
  data/home.ts                home page structure (steps, pricing, benefits, FAQ keys)
  i18n/locales.ts, t.ts, context.tsx
  i18n/messages/<ns>/en.json  one folder per page (plus common)
  seo/head.tsx                meta, canonical, hreflang, OG, Twitter, favicons, preloads
  seo/schema.ts               JSON-LD: Organization, WebSite, WebPage, FAQPage, BreadcrumbList, Service
  seo/sitemap.ts, robots.ts   /sitemap.xml (from the registry), /robots.txt
  utils/                      urls.ts, alpine.ts, inline.ts
  views/layout.tsx, header.tsx, footer.tsx, logo.tsx, icons.tsx, ui.tsx, page-head.tsx
  views/partials/             flight-search form, float dock …
  views/sections/home/        hero, how-it-works, pricing, why-us, faq
  views/pages/                home.tsx, order.tsx, not-found.tsx
public/                       assets/js/app.js, assets/css (build output), fonts, images, _headers, favicons
styles/input.css              tokens + every shared component class
tools/                        build-assets, copy-vendor, asset-version, dev, i18n, check-links, ship
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

---

## Revision history

- 2026-11-05 r0: project created; domain, zone and README.
