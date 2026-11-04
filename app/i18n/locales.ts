// THE LOCALES. ENGLISH ONLY TODAY; ADDING A LANGUAGE = ONE ENTRY HERE + ONE <lang>.json PER NAMESPACE.
export const locales = ['en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

// NO LANGUAGE PREFIX WHILE THERE IS ONE LOCALE.
export const localizePath = (path: string, _locale: Locale = defaultLocale): string => path
