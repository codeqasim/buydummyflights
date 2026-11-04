// EVERY BRAND FACT, URL AND NAV/FOOTER STRUCTURE LIVES HERE. NO VISIBLE WORDS (THOSE ARE IN i18n/messages).
export const site = {
  name: 'Buy Dummy Flights',
  legalName: 'BuyDummyFlights',
  domain: 'buydummyflights.com',
  // PRODUCTION ORIGIN: CANONICALS, SITEMAP AND SCHEMA ALWAYS USE THIS, EVEN WHEN SERVED FROM A PREVIEW HOST.
  origin: 'https://buydummyflights.com',
  locale: 'en',
  ogLocale: 'en_US',
  themeColor: { light: '#ffffff', dark: '#0b1020' },
  // TODO(owner): REAL SUPPORT EMAIL, SOCIAL PROFILES AND LOGO FILE. NOTHING BELOW IS PUBLISHED UNTIL FILLED IN.
  contactEmail: null as string | null,
  sameAs: [] as string[],
  // TODO(owner): FOUNDING YEAR AND ADDRESS ARE UNKNOWN, SO THEY ARE NOT EMITTED IN SCHEMA.
} as const

// TODO(owner): THESE PRICES ARE PLACEHOLDERS, NOT FACTS. CONFIRM THE REAL PRICES (AND CURRENCY) BEFORE LAUNCH.
// THEY ARE THE ONLY PLACE PRICES ARE WRITTEN; VIEWS AND SCHEMA READ THEM FROM HERE.
export const PRICES_ARE_PLACEHOLDERS = true
export const plans = [
  { id: 'one-way', price: 15, currency: 'USD', featured: false, icon: 'plane' },
  { id: 'return', price: 25, currency: 'USD', featured: true, icon: 'return' },
  { id: 'multi', price: 35, currency: 'USD', featured: false, icon: 'route' },
] as const
export type PlanId = (typeof plans)[number]['id']

export type NavItem = { id: string; href: string }
export const nav: NavItem[] = [
  { id: 'how', href: '/#how-it-works' },
  { id: 'pricing', href: '/#pricing' },
  { id: 'sample', href: '/#sample' },
  { id: 'faq', href: '/#faq' },
]

export const footerCols: { id: string; links: NavItem[] }[] = [
  {
    id: 'product',
    links: [
      { id: 'order', href: '/order' },
      { id: 'how', href: '/#how-it-works' },
      { id: 'pricing', href: '/#pricing' },
      { id: 'sample', href: '/#sample' },
    ],
  },
  {
    id: 'help',
    links: [
      { id: 'faq', href: '/#faq' },
      { id: 'why', href: '/#why-us' },
      { id: 'uses', href: '/#use-cases' },
    ],
  },
]

// HOME PAGE STRUCTURE (KEYS ONLY; WORDS ARE IN messages/home/en.json).
export const home = {
  steps: ['search', 'details', 'receive'] as const,
  benefits: ['pnr', 'noTicket', 'format', 'support', 'privacy', 'fast'] as const,
  trust: ['pnr', 'noTicket', 'email', 'airlines'] as const,
  useCases: ['schengen', 'onward', 'uk', 'canada'] as const,
  testimonialSlots: 3,
  faq: ['what', 'legal', 'verify', 'accepted', 'time', 'refund', 'change', 'pay'] as const,
  planFeatures: 4,
}
