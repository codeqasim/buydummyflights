// JSON-LD BUILDERS. EVERYTHING EMITTED IS ALSO VISIBLE ON THE PAGE. NO aggregateRating, NO Review, NO INVENTED FIGURES.
import { site, plans } from '../data/site'
import { canonicalUrl } from '../utils/urls'

type Json = Record<string, unknown>
const id = (frag: string): string => `${site.origin}/#${frag}`

export const organizationSchema = (description: string): Json => ({
  '@type': 'Organization',
  '@id': id('organization'),
  name: site.name,
  legalName: site.legalName,
  url: `${site.origin}/`,
  logo: { '@type': 'ImageObject', url: `${site.origin}/assets/images/logo-512.png`, width: 512, height: 512 },
  description,
  ...(site.sameAs.length ? { sameAs: [...site.sameAs] } : {}),
  ...(site.contactEmail ? { contactPoint: [{ '@type': 'ContactPoint', contactType: 'customer support', email: site.contactEmail }] } : {}),
})

export const websiteSchema = (description: string): Json => ({
  '@type': 'WebSite',
  '@id': id('website'),
  url: `${site.origin}/`,
  name: site.name,
  description,
  inLanguage: site.locale,
  publisher: { '@id': id('organization') },
})

export const webPageSchema = (p: { path: string; title: string; description: string; image: string; modified: string; type?: string }): Json => ({
  '@type': p.type ?? 'WebPage',
  '@id': `${canonicalUrl(p.path)}#webpage`,
  url: canonicalUrl(p.path),
  name: p.title,
  description: p.description,
  inLanguage: site.locale,
  isPartOf: { '@id': id('website') },
  about: { '@id': id('organization') },
  primaryImageOfPage: { '@type': 'ImageObject', url: p.image },
  dateModified: p.modified,
  breadcrumb: { '@id': `${canonicalUrl(p.path)}#breadcrumb` },
})

export type Crumb = { name: string; path: string }
export const breadcrumbSchema = (path: string, crumbs: Crumb[]): Json => ({
  '@type': 'BreadcrumbList',
  '@id': `${canonicalUrl(path)}#breadcrumb`,
  itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: canonicalUrl(c.path) })),
})

export const faqSchema = (items: { q: string; a: string }[]): Json => ({
  '@type': 'FAQPage',
  mainEntity: items.map((i) => ({ '@type': 'Question', name: i.q, acceptedAnswer: { '@type': 'Answer', text: i.a } })),
})

// PRICES ARE PLACEHOLDERS (data/site.ts), SO THE SERVICE CARRIES PLAN NAMES ONLY, NO Offer PRICE, UNTIL THE OWNER CONFIRMS THEM.
export const serviceSchema = (p: { path?: string; name: string; description: string; serviceType: string; planNames: Record<string, string> }): Json => ({
  '@type': 'Service',
  '@id': p.path && p.path !== '/' ? `${canonicalUrl(p.path)}#service` : id('service'),
  name: p.name,
  serviceType: p.serviceType,
  description: p.description,
  url: canonicalUrl(p.path ?? '/'),
  provider: { '@id': id('organization') },
  areaServed: { '@type': 'Place', name: 'Worldwide' },
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: p.name,
    itemListElement: plans.map((pl) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: p.planNames[pl.id] } })),
  },
})

// BLOG. THE AUTHOR IS THE ORGANISATION (NO INVENTED PERSON); wordCount IS COUNTED FROM THE VISIBLE TEXT.
export const blogPostingSchema = (p: { path: string; headline: string; description: string; image: string; published: string; modified: string; category: string; keywords: string[]; words: number }): Json => ({
  '@type': 'BlogPosting',
  '@id': `${canonicalUrl(p.path)}#article`,
  mainEntityOfPage: { '@id': `${canonicalUrl(p.path)}#webpage` },
  headline: p.headline,
  description: p.description,
  image: [p.image],
  datePublished: p.published,
  dateModified: p.modified,
  author: { '@id': id('organization') },
  publisher: { '@id': id('organization') },
  articleSection: p.category,
  keywords: p.keywords.join(', '),
  wordCount: p.words,
  inLanguage: site.locale,
  isPartOf: { '@id': `${canonicalUrl('/blog')}#blog` },
})

export const blogSchema = (p: { name: string; description: string; posts: { path: string; title: string; published: string }[] }): Json => ({
  '@type': 'Blog',
  '@id': `${canonicalUrl('/blog')}#blog`,
  url: canonicalUrl('/blog'),
  name: p.name,
  description: p.description,
  inLanguage: site.locale,
  publisher: { '@id': id('organization') },
  blogPost: p.posts.map((x) => ({ '@type': 'BlogPosting', headline: x.title, url: canonicalUrl(x.path), datePublished: x.published })),
})

export const graph = (nodes: Json[]): Json => ({ '@context': 'https://schema.org', '@graph': nodes })
export const serialize = (j: Json): string => JSON.stringify(j).replace(/</g, '\\u003c')
