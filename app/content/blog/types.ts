// ONE ARTICLE. body USES THE CONTENT FORMAT IN app/content/markup.ts (## H2, ### H3, lists, > callout, Q:/A: FAQ).
export type Post = {
  slug: string
  title: string // THE VISIBLE h1
  seoTitle: string // THE <title> TEXT, KEYWORD FIRST, WITHOUT THE BRAND SUFFIX; WITH " | BuyDummyFlights" IT MUST STAY <= 60 CHARS (THE SEO CHECK ENFORCES IT)
  description: string // <= 155 CHARS
  category: string
  tags: string[]
  published: string // REAL ISO DATE
  updated: string
  services: string[] // SERVICE PAGES THE ARTICLE SUPPORTS (SHOWN IN THE SIDEBAR)
  related: string[] // SLUGS OF RELATED ARTICLES, IN ORDER
  body: string
}
