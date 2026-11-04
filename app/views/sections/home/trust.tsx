// TRUST BAR: FOUR QUALITATIVE FACTS ABOUT THE SERVICE. NO NUMBERS, NO LOGOS OF BRANDS WE DO NOT OWN.
import { home } from '../../../data/site'
import { useI18n } from '../../../i18n/context'
import { Icon } from '../../icons'

const icons: Record<string, string> = { pnr: 'ticket', noTicket: 'shield', email: 'mail', airlines: 'globe' }

export const Trust = () => {
  const { t } = useI18n()
  return (
    <section class="trust" aria-label={t('trust.title')}>
      <div class="container">
        <ul class="trust-grid">
          {home.trust.map((k) => (
            <li class="trust-item">
              <span class="icon-tile"><Icon name={icons[k] ?? 'check'} class="h-5 w-5" /></span>
              <div>
                <p class="trust-title">{t(`trust.${k}.title`)}</p>
                <p class="trust-text">{t(`trust.${k}.text`)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
