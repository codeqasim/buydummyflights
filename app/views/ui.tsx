// SHARED PRIMITIVES: SectionHeader, Accent, CtaLink, reveal ATTRIBUTES.
import type { Child } from 'hono/jsx'
import { alpine } from '../utils/alpine'
import { Icon } from './icons'

export const Accent = ({ children }: { children?: Child }) => <span class="title-accent">{children}</span>

// REVEAL-ON-SCROLL: HIDDEN ONLY WHEN JS IS ON (html.js); app.js ADDS .is-in WHEN IT ENTERS THE VIEWPORT.
export const reveal = alpine({ 'x-data': 'reveal', 'x-intersect.once': 'show' })

export const SectionHeader = ({ eyebrow, title, lead, center = true, id }: { eyebrow?: string; title: string; lead?: string; center?: boolean; id?: string }) => (
  <header class={`section-head ${center ? 'is-center' : ''}`}>
    {eyebrow && <p class="eyebrow">{eyebrow}</p>}
    <h2 class="section-title" id={id}>{title}</h2>
    {lead && <p class="section-lead">{lead}</p>}
  </header>
)

export const CtaLink = ({ href, children, variant = 'primary', large = false, block = false, arrow = true }: { href: string; children?: Child; variant?: 'primary' | 'secondary' | 'ghost'; large?: boolean; block?: boolean; arrow?: boolean }) => (
  <a href={href} class={`btn btn-${variant} ${large ? 'btn-lg' : ''} ${block ? 'btn-block' : ''}`}>
    {children}
    {arrow && <Icon name="arrow" class="h-4 w-4" />}
  </a>
)
