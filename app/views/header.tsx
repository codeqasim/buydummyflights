// GLASS BAR: LOGO, NAV, THEME TOGGLE, CTA. THE MOBILE MENU IS A NATIVE <details> (WORKS WITHOUT JS); ALPINE ONLY CLOSES IT.
import { mobileExtra, nav } from '../data/site'
import { useI18n } from '../i18n/context'
import { alpine } from '../utils/alpine'
import { Icon } from './icons'
import { Logo } from './logo'

export const ThemeToggle = () => {
  const { t } = useI18n()
  return (
    <button type="button" class="btn-icon" aria-label={t('a11y.theme')} {...alpine({ 'x-data': 'theme', '@click': 'toggle' })}>
      <Icon name="moon" class="h-5 w-5 dark:hidden" />
      <Icon name="sun" class="hidden h-5 w-5 dark:block" />
    </button>
  )
}

export const Header = () => {
  const { t, href } = useI18n()
  return (
    <header class="site-header" {...alpine({ 'x-data': 'header', '@scroll.window.passive': 'onScroll' })}>
      <div class="container site-header-in">
        <Logo />
        <nav class="hidden items-center gap-1 md:flex" aria-label={t('a11y.primaryNav')}>
          {nav.map((n) =>
            n.children ? (
              <details class="dropdown" {...alpine({ 'x-data': 'dropdown', '@keydown.escape.window': 'close', '@click.window': 'away' })}>
                <summary class="nav-link" aria-label={`${t(`nav.${n.id}`)}: ${t('a11y.dropdown')}`}>
                  {t(`nav.${n.id}`)}
                  <Icon name="chevron" class="h-4 w-4 dropdown-chev" />
                </summary>
                <div class="dropdown-panel">
                  {n.children.map((ch) => (
                    <a class="dropdown-link" href={href(ch.href)} {...alpine({ '@click': 'close' })}>{t(`nav.${ch.id}`)}</a>
                  ))}
                </div>
              </details>
            ) : (
              <a class="nav-link" href={href(n.href)}>{t(`nav.${n.id}`)}</a>
            ),
          )}
        </nav>
        <div class="flex items-center gap-2">
          <ThemeToggle />
          <a class="btn btn-primary hidden sm:inline-flex" href={href('/order')}>{t('cta.orderShort')}</a>
          <details class="menu md:hidden" {...alpine({ 'x-data': 'menu', '@keydown.escape.window': 'close' })}>
            <summary class="btn-icon" aria-label={t('a11y.menu')}>
              <Icon name="menu" class="h-5 w-5" />
            </summary>
            <div class="menu-panel">
              <nav aria-label={t('a11y.primaryNav')}>
                {[...nav, ...mobileExtra].map((n) =>
                  n.children ? (
                    <>
                      <p class="menu-group">{t(`nav.${n.id}`)}</p>
                      {n.children.map((ch) => (
                        <a class="menu-link menu-sub" href={href(ch.href)} {...alpine({ '@click': 'close' })}>{t(`nav.${ch.id}`)}</a>
                      ))}
                    </>
                  ) : (
                    <a class="menu-link" href={href(n.href)} {...alpine({ '@click': 'close' })}>{t(`nav.${n.id}`)}</a>
                  ),
                )}
              </nav>
              <a class="btn btn-primary btn-block" href={href('/order')}>{t('cta.order')}</a>
            </div>
          </details>
        </div>
      </div>
    </header>
  )
}
