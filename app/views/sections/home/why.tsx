// WHY US: SIX BENEFITS.
import { home } from '../../../data/site'
import { useI18n } from '../../../i18n/context'
import { Icon } from '../../icons'
import { SectionHeader, reveal } from '../../ui'

const icons: Record<string, string> = { pnr: 'ticket', noTicket: 'shield', format: 'file', support: 'support', privacy: 'lock', fast: 'zap' }

export const Why = () => {
  const { t } = useI18n()
  return (
    <section class="section section-alt" id="why-us" aria-labelledby="why-title">
      <div class="container">
        <SectionHeader id="why-title" eyebrow={t('why.eyebrow')} title={t('why.title')} lead={t('why.lead')} />
        <div class="grid-3">
          {home.benefits.map((k) => (
            <article class="card reveal" {...reveal}>
              <span class="icon-tile"><Icon name={icons[k] ?? 'check'} class="h-5 w-5" /></span>
              <h3 class="card-title">{t(`why.items.${k}.title`)}</h3>
              <p class="card-text">{t(`why.items.${k}.text`)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
