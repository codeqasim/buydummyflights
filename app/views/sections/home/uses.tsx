// USE CASES: WHERE A FLIGHT RESERVATION HELPS.
import { home } from '../../../data/site'
import { useI18n } from '../../../i18n/context'
import { Icon } from '../../icons'
import { SectionHeader, reveal } from '../../ui'

const icons: Record<string, string> = { schengen: 'passport', onward: 'plane', uk: 'file', canada: 'globe' }

export const Uses = () => {
  const { t, href } = useI18n()
  return (
    <section class="section" id="use-cases" aria-labelledby="uses-title">
      <div class="container">
        <SectionHeader id="uses-title" eyebrow={t('uses.eyebrow')} title={t('uses.title')} lead={t('uses.lead')} />
        <div class="grid-4">
          {home.useCases.map((k) => (
            <article class="card use-card reveal" {...reveal}>
              <span class="icon-tile"><Icon name={icons[k] ?? 'check'} class="h-5 w-5" /></span>
              <h3 class="card-title"><a class="post-link" href={href(home.useCaseLinks[k])}>{t(`uses.items.${k}.title`)}</a></h3>
              <p class="card-text">{t(`uses.items.${k}.text`)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
