// BINDINGS AND PER-REQUEST VARIABLES. ONE PLACE SO EVERY HANDLER IS TYPED THE SAME WAY.
import type { I18n } from './i18n/t'

export type Bindings = {
  ASSETS: Fetcher
  ENVIRONMENT: 'production' | 'preview'
  SITE_ORIGIN: string
  INDEXING?: 'on' | 'off'
  ORDER_MODE?: string
}

export type Variables = {
  i18n: I18n
}

export type AppEnv = { Bindings: Bindings; Variables: Variables }
