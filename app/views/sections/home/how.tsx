// HOW IT WORKS: THREE NUMBERED STEPS.
import { home } from '../../../data/site'
import { useI18n } from '../../../i18n/context'
import { Icon } from '../../icons'
import { SectionHeader, reveal } from '../../ui'

const icons = ['route', 'lock', 'mail']

export const How = () => {
  const { t } = useI18n()
  return (
    <section class="section" id="how-it-works" aria-labelledby="how-title">
      <div class="container">
        <SectionHeader id="how-title" eyebrow={t('how.eyebrow')} title={t('how.title')} lead={t('how.lead')} />
        <ol class="steps">
          {home.steps.map((s, i) => (
            <li class="step card reveal" {...reveal}>
              <span class="step-n" aria-hidden="true">{i + 1}</span>
              <span class="icon-tile"><Icon name={icons[i] ?? 'check'} class="h-5 w-5" /></span>
              <h3 class="card-title">{t(`how.steps.${s}.title`)}</h3>
              <p class="card-text">{t(`how.steps.${s}.text`)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
