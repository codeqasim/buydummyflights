// PAGE SHELL INSIDE <I18nProvider>: head, skip link, header, main, footer.
import type { Child } from 'hono/jsx'
import { I18nProvider } from '../i18n/context'
import type { I18n } from '../i18n/t'
import { Head, type HeadMeta } from '../seo/head'
import { Footer } from './footer'
import { Header } from './header'

export const Layout = ({ i18n, meta, children, year }: { i18n: I18n; meta: HeadMeta; children?: Child; year: number }) => (
  <I18nProvider i18n={i18n}>
    <html lang={i18n.locale}>
      <Head meta={meta} />
      <body>
        <a class="skip-link" href="#main">{i18n.t('a11y.skip')}</a>
        <Header />
        <main id="main">{children}</main>
        <Footer year={year} />
      </body>
    </html>
  </I18nProvider>
)
