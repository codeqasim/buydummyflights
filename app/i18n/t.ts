// createI18n(ns): t(), t.rich(), t.list(), t.has(), href(). LOOKS IN THE PAGE NAMESPACE FIRST, THEN `common`.
import type { Child } from 'hono/jsx'
import { messages } from './messages'
import { defaultLocale, localizePath, type Locale } from './locales'

type Vars = Record<string, string | number>

const dig = (obj: unknown, key: string): unknown =>
  key.split('.').reduce<unknown>((o, k) => (o && typeof o === 'object' ? (o as Record<string, unknown>)[k] : undefined), obj)

export type I18n = {
  locale: Locale
  ns: string
  t: (key: string, vars?: Vars) => string
  rich: (key: string, tokens: Record<string, Child>) => Child[]
  list: (key: string) => string[]
  data: <T = unknown>(key: string) => T
  has: (key: string) => boolean
  href: (path: string) => string
}

export function createI18n(ns: string, locale: Locale = defaultLocale): I18n {
  const sources = [messages[ns]?.[locale], messages.common?.[locale]]
  const raw = (key: string): unknown => {
    for (const s of sources) {
      const v = dig(s, key)
      if (v !== undefined) return v
    }
    return undefined
  }
  const t = (key: string, vars?: Vars): string => {
    const v = raw(key)
    if (typeof v !== 'string') throw new Error(`i18n: missing string "${key}" in "${ns}" (${locale})`)
    return vars ? v.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m)) : v
  }
  const rich = (key: string, tokens: Record<string, Child>): Child[] => {
    const parts = t(key).split(/(\{\w+\})/)
    return parts.map((p) => {
      const m = /^\{(\w+)\}$/.exec(p)
      return m && m[1] && m[1] in tokens ? (tokens[m[1]] as Child) : p
    })
  }
  const list = (key: string): string[] => {
    const v = raw(key)
    if (!Array.isArray(v)) throw new Error(`i18n: missing list "${key}" in "${ns}"`)
    return v as string[]
  }
  // data(): STRUCTURED CONTENT (BLOCK ARRAYS, FAQ ITEMS) THAT IS STILL WORDS, SO IT LIVES IN THE MESSAGE FILES TOO.
  const data = <T,>(key: string): T => {
    const v = raw(key)
    if (v === undefined) throw new Error(`i18n: missing data "${key}" in "${ns}"`)
    return v as T
  }
  return { locale, ns, t, rich, list, data, has: (k) => raw(k) !== undefined, href: (p) => localizePath(p, locale) }
}
