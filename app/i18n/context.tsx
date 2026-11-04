// I18nProvider + useI18n(): VIEWS READ WORDS FROM CONTEXT, NEVER FROM PROPS.
import { createContext, useContext } from 'hono/jsx'
import type { Child } from 'hono/jsx'
import type { I18n } from './t'

const Ctx = createContext<I18n | null>(null)

export const I18nProvider = ({ i18n, children }: { i18n: I18n; children?: Child }) => <Ctx.Provider value={i18n}>{children}</Ctx.Provider>

export const useI18n = (): I18n => {
  const v = useContext(Ctx)
  if (!v) throw new Error('useI18n() outside I18nProvider')
  return v
}
