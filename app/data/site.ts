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

export type NavItem = { id: string; href: string; children?: NavItem[] }

// THE VISA-TYPE PAGES: THE DESKTOP DROPDOWN, THE MOBILE GROUP AND A FOOTER COLUMN ALL READ THIS ONE LIST.
export const visaPages: NavItem[] = [
  { id: 'schengen', href: '/dummy-ticket-for-schengen-visa' },
  { id: 'us', href: '/dummy-ticket-for-us-visa' },
  { id: 'uk', href: '/dummy-ticket-for-uk-visa' },
  { id: 'canada', href: '/dummy-ticket-for-canada-visa' },
  { id: 'onward', href: '/onward-ticket' },
  { id: 'returnTicket', href: '/return-ticket' },
  { id: 'hotel', href: '/hotel-reservation-for-visa' },
]

// DESKTOP NAV. THE ENTRY WITH children RENDERS AS A DROPDOWN (NATIVE <details>, ALPINE ONLY CLOSES IT).
export const nav: NavItem[] = [
  { id: 'how', href: '/how-it-works' },
  { id: 'visas', href: '/dummy-ticket-for-schengen-visa', children: visaPages },
  { id: 'pricing', href: '/pricing' },
  { id: 'blog', href: '/blog' },
  { id: 'faq', href: '/faq' },
]

// MOBILE MENU = THE SAME NAV PLUS THE PAGES THAT ONLY FIT IN THE FOOTER ON DESKTOP.
export const mobileExtra: NavItem[] = [
  { id: 'sample', href: '/sample-ticket' },
  { id: 'about', href: '/about' },
  { id: 'contact', href: '/contact' },
]

export const footerCols: { id: string; links: NavItem[] }[] = [
  {
    id: 'product',
    links: [
      { id: 'order', href: '/order' },
      { id: 'how', href: '/how-it-works' },
      { id: 'pricing', href: '/pricing' },
      { id: 'sample', href: '/sample-ticket' },
    ],
  },
  { id: 'visas', links: visaPages },
  {
    id: 'resources',
    links: [
      { id: 'blog', href: '/blog' },
      { id: 'faq', href: '/faq' },
      { id: 'about', href: '/about' },
      { id: 'contact', href: '/contact' },
    ],
  },
  {
    id: 'legal',
    links: [
      { id: 'terms', href: '/terms' },
      { id: 'privacy', href: '/privacy' },
      { id: 'refund', href: '/refund-policy' },
    ],
  },
]

// TODO(owner): THE TERMS, PRIVACY AND REFUND TEXTS ARE DRAFTS WRITTEN FROM HOW THE SERVICE WORKS, NOT LEGAL ADVICE.
// WHILE true, THOSE PAGES SHOW A VISIBLE "DRAFT" NOTICE. SET false ONLY AFTER THE OWNER (OR A LAWYER) HAS APPROVED THE TEXT.
export const LEGAL_IS_DRAFT = true

// BLOG LISTING: ARTICLES PER PAGE (/blog, /blog/page/2, ...).
export const BLOG_PAGE_SIZE = 9

// HOME PAGE STRUCTURE (KEYS ONLY; WORDS ARE IN messages/home/en.json).
export const home = {
  steps: ['search', 'details', 'receive'] as const,
  benefits: ['pnr', 'noTicket', 'format', 'support', 'privacy', 'fast'] as const,
  trust: ['pnr', 'noTicket', 'email', 'airlines'] as const,
  useCases: ['schengen', 'onward', 'uk', 'canada'] as const,
  // EACH USE-CASE CARD LINKS TO ITS SERVICE PAGE, SO THE HOME PAGE PASSES LINK EQUITY TO THE PAGES THAT TARGET THOSE SEARCHES.
  useCaseLinks: { schengen: '/dummy-ticket-for-schengen-visa', onward: '/onward-ticket', uk: '/dummy-ticket-for-uk-visa', canada: '/dummy-ticket-for-canada-visa' } as const,
  latestPosts: 3,
  testimonialSlots: 3,
  faq: ['what', 'legal', 'verify', 'accepted', 'time', 'refund', 'change', 'pay'] as const,
  planFeatures: 4,
}
