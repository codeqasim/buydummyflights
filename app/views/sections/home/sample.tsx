// SAMPLE TICKET PREVIEW BESIDE THREE POINTS.
import { useI18n } from '../../../i18n/context'
import { Icon } from '../../icons'
import { Ticket } from '../../partials/ticket'
import { SectionHeader, reveal } from '../../ui'

export const Sample = () => {
  const { t, list } = useI18n()
  return (
    <section class="section section-alt" id="sample" aria-labelledby="sample-title">
      <div class="container sample-grid">
        <div class="reveal" {...reveal}>
          <SectionHeader id="sample-title" eyebrow={t('sample.eyebrow')} title={t('sample.title')} lead={t('sample.lead')} center={false} />
          <ul class="check-list">
            {list('sample.points').map((p) => (
              <li>
                <span class="tick"><Icon name="check" class="h-3.5 w-3.5" /></span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div class="reveal" {...reveal}>
          <Ticket />
        </div>
      </div>
    </section>
  )
}
