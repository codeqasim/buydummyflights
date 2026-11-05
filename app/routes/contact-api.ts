// POST /api/contact: MOCK MODE. VALIDATES (HONEYPOT + SHAPE) AND REDIRECTS; NOTHING IS SENT, STORED OR LOGGED UNTIL THE OWNER SETS A SUPPORT MAILBOX.
// TODO(owner): ADD A REAL DELIVERY (EMAIL ROUTING / SEND) WHEN site.contactEmail EXISTS.
import type { Context } from 'hono'
import type { AppEnv } from '../env'

const str = (v: unknown, max: number): string => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function postContact(c: Context<AppEnv>): Promise<Response> {
  let raw: Record<string, unknown> = {}
  try {
    raw = (c.req.header('content-type') ?? '').includes('application/json') ? ((await c.req.json()) as Record<string, unknown>) : ((await c.req.parseBody()) as Record<string, unknown>)
  } catch {
    return c.redirect('/contact?status=error', 303)
  }
  c.header('Cache-Control', 'no-store')
  // HONEYPOT: BOTS FILL THE HIDDEN FIELD AND GET THE SAME FAKE SUCCESS.
  if (str(raw.website, 100)) return c.redirect('/contact?status=sent', 303)
  const ok = str(raw.name, 100).length >= 2 && EMAIL.test(str(raw.email, 254)) && str(raw.message, 2000).length >= 10
  return c.redirect(`/contact?status=${ok ? 'sent' : 'error'}`, 303)
}
