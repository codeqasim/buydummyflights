// POST /api/order: VALIDATES THE ORDER ON THE EDGE (HONEYPOT + SHAPE CHECKS). MOCK MODE ONLY: NO PAYMENT, NO EMAIL, NOTHING STORED OR LOGGED.
import type { Context } from 'hono'
import { plans } from '../data/site'
import type { AppEnv } from '../env'

const str = (v: unknown, max: number): string => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const DATE = /^\d{4}-\d{2}-\d{2}$/

const reference = (): string => {
  const a = new Uint8Array(4)
  crypto.getRandomValues(a)
  return `BDF-PREVIEW-${[...a].map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase()}`
}

export async function postOrder(c: Context<AppEnv>): Promise<Response> {
  const wantsJson = (c.req.header('accept') ?? '').includes('application/json')
  const ct = c.req.header('content-type') ?? ''
  let raw: Record<string, unknown> = {}
  try {
    raw = ct.includes('application/json') ? ((await c.req.json()) as Record<string, unknown>) : ((await c.req.parseBody()) as Record<string, unknown>)
  } catch {
    return c.json({ ok: false, error: 'invalid_body' }, 400)
  }
  const f = {
    name: str(raw.name, 100), email: str(raw.email, 254), plan: str(raw.plan, 20), from: str(raw.from, 80), to: str(raw.to, 80),
    depart: str(raw.depart, 10), return: str(raw.return, 10), pax: str(raw.pax, 2), website: str(raw.website, 100),
  }
  // HONEYPOT: BOTS FILL THE HIDDEN FIELD AND GET A FAKE SUCCESS.
  if (f.website) return respond(c, wantsJson, reference())
  const errors: string[] = []
  if (f.name.length < 2) errors.push('name')
  if (!EMAIL.test(f.email)) errors.push('email')
  if (!plans.some((p) => p.id === f.plan)) errors.push('plan')
  if (f.depart && !DATE.test(f.depart)) errors.push('depart')
  if (f.return && !DATE.test(f.return)) errors.push('return')
  if (f.pax && !/^[1-9]$/.test(f.pax)) errors.push('pax')
  if (errors.length) return c.json({ ok: false, error: 'validation', fields: errors }, 422)
  return respond(c, wantsJson, reference())
}

function respond(c: Context<AppEnv>, json: boolean, ref: string): Response {
  c.header('Cache-Control', 'no-store')
  if (json) return c.json({ ok: true, mock: true, reference: ref }, 202)
  return c.redirect(`/order?sent=${encodeURIComponent(ref)}`, 303)
}
