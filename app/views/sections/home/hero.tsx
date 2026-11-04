// HERO: THE ONE <h1>, THE PROMISE, AND THE ORDER FORM AS A TICKET-SHAPED CARD.
import { useI18n } from '../../../i18n/context'
import { Icon } from '../../icons'
import { FlightForm } from '../../partials/flight-form'
import { Accent } from '../../ui'

export const Hero = ({ today }: { today: string }) => {
  const { t, rich } = useI18n()
  return (
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-bg" aria-hidden="true"></div>
      <div class="container hero-in">
        <div class="hero-copy">
          <p class="eyebrow">{t('hero.eyebrow')}</p>
          <h1 class="hero-title" id="hero-title">{rich('hero.h1', { accent: <Accent>{t('hero.h1Accent')}</Accent> })}</h1>
          <p class="hero-lead">{t('hero.lead')}</p>
          <ul class="hero-points">
            {['point1', 'point2', 'point3'].map((k) => (
              <li>
                <span class="tick"><Icon name="check" class="h-3.5 w-3.5" /></span>
                {t(`hero.${k}`)}
              </li>
            ))}
          </ul>
        </div>
        <div class="hero-card">
          <p class="hero-card-title">{t('hero.formTitle')}</p>
          <p class="hero-card-lead">{t('hero.formLead')}</p>
          <FlightForm today={today} />
        </div>
      </div>
    </section>
  )
}
