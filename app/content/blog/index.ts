// THE POST REGISTRY. TO ADD AN ARTICLE: CREATE app/content/blog/<slug>.ts, IMPORT IT HERE, LIST IT IN `all` (NEWEST FIRST). THE REGISTRY, BOTH SITEMAPS AND THE CHECKS PICK IT UP.
import { parseBlocks, readingMinutes, wordCount } from '../markup'
import type { Post } from './types'
import { post as p01 } from './what-is-a-dummy-ticket'
import { post as p02 } from './is-a-dummy-ticket-legal-for-a-visa'
import { post as p03 } from './schengen-visa-flight-itinerary-requirements'
import { post as p04 } from './onward-ticket-proof-of-onward-travel'
import { post as p05 } from './dummy-ticket-vs-real-flight-booking'
import { post as p06 } from './how-to-verify-a-flight-reservation-pnr'
import { post as p07 } from './uk-visa-flight-booking-requirements'
import { post as p08 } from './us-visa-flight-itinerary'
import { post as p09 } from './canada-visa-flight-itinerary'
import { post as p10 } from './airline-hold-booking-options'
import { post as p11 } from './visa-application-checklist'

export const posts: Post[] = [p01, p02, p03, p04, p05, p06, p07, p08, p09, p10, p11]

export const postBySlug = (slug: string): Post | undefined => posts.find((p) => p.slug === slug)

export const postMeta = (p: Post): { words: number; minutes: number } => {
  const words = wordCount(parseBlocks(p.body))
  return { words, minutes: readingMinutes(words) }
}

// RELATED = THE ARTICLE'S OWN `related` LIST FIRST, THEN SAME-CATEGORY, THEN NEWEST, SO THE BLOCK IS NEVER SHORT.
export const relatedPosts = (p: Post, n: number): Post[] => {
  const picked = p.related.flatMap((s) => postBySlug(s) ?? [])
  const rest = posts.filter((x) => x.slug !== p.slug && !picked.includes(x))
  rest.sort((a, b) => Number(b.category === p.category) - Number(a.category === p.category))
  return [...picked, ...rest].slice(0, n)
}
