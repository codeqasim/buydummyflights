// FOOTER: BRAND, TWO LINK COLUMNS, THE HONEST DISCLAIMER, LEGAL BAR. DARK IN BOTH THEMES.
import { footerCols, site } from '../data/site'
import { useI18n } from '../i18n/context'
import { Logo } from './logo'

export const Footer = ({ year }: { year: number }) => {
  const { t, href } = useI18n()
  return (
    <footer class="site-footer">
      <div class="container">
        <div class="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div class="max-w-sm">
            <Logo class="logo-on-dark" />
            <p class="mt-4 text-sm leading-relaxed text-foot-mute">{t('footer.about')}</p>
            {site.contactEmail && (
              <p class="mt-4 text-sm">
                <span class="text-foot-mute">{t('footer.emailLabel')}: </span>
                <a class="foot-link" href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
              </p>
            )}
          </div>
          {footerCols.map((col) => (
            <nav aria-label={`${t('a11y.footerNav')}: ${t(`footer.${col.id}`)}`}>
              <p class="foot-head">{t(`footer.${col.id}`)}</p>
              <ul class="mt-4 space-y-1">
                {col.links.map((l) => (
                  <li>
                    <a class="foot-link" href={href(l.href)}>{t(`nav.${l.id}`)}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <p class="foot-disclaimer">{t('footer.disclaimer')}</p>
        <p class="foot-legal">{t('footer.rights', { year })}</p>
      </div>
    </footer>
  )
}
