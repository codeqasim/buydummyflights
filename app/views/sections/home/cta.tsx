// CLOSING CTA BAND.
import { useI18n } from '../../../i18n/context'
import { CtaLink } from '../../ui'

export const Cta = () => {
  const { t, href } = useI18n()
  return (
    <section class="section pt-0" aria-labelledby="cta-title">
      <div class="container">
        <div class="cta-band">
          <h2 class="cta-title" id="cta-title">{t('cta.title')}</h2>
          <p class="cta-lead">{t('cta.lead')}</p>
          <CtaLink href={href('/order')} variant="secondary" large>{t('cta.button')}</CtaLink>
        </div>
      </div>
    </section>
  )
}
