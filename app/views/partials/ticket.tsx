// THE SAMPLE BOARDING-PASS-STYLE ITINERARY. ILLUSTRATION ONLY (LABELLED "SAMPLE ONLY"); EVERY VALUE COMES FROM MESSAGES.
import { useI18n } from '../../i18n/context'
import { Icon } from '../icons'

export const Ticket = () => {
  const { t } = useI18n()
  const row = (k: string) => (
    <div>
      <dt>{t(`sample.ticket.${k}`)}</dt>
      <dd>{t(`sample.ticket.${k}Value`)}</dd>
    </div>
  )
  return (
    <figure class="ticket" aria-label={t('sample.ticket.title')}>
      <div class="ticket-main">
        <div class="ticket-top">
          <p class="ticket-title">{t('sample.ticket.title')}</p>
          <span class="chip chip-brand">{t('sample.badge')}</span>
        </div>
        <div class="ticket-route">
          <div>
            <p class="ticket-city">{t('sample.ticket.fromCity')}</p>
            <p class="ticket-code" aria-hidden="true">LHE</p>
          </div>
          <div class="ticket-path" aria-hidden="true">
            <span></span>
            <Icon name="plane" class="h-5 w-5" />
            <span></span>
          </div>
          <div class="text-right">
            <p class="ticket-city">{t('sample.ticket.toCity')}</p>
            <p class="ticket-code" aria-hidden="true">CDG</p>
          </div>
        </div>
        <p class="ticket-duration">{t('sample.ticket.duration')}</p>
        <dl class="ticket-grid">
          {row('passenger')}
          {row('flight')}
          {row('date')}
          {row('boarding')}
          {row('arrives')}
          {row('status')}
        </dl>
      </div>
      <div class="ticket-stub">
        <dl>
          <div>
            <dt>{t('sample.ticket.reference')}</dt>
            <dd class="ticket-ref">{t('sample.ticket.referenceValue')}</dd>
          </div>
        </dl>
        <div class="ticket-barcode" aria-hidden="true"></div>
      </div>
    </figure>
  )
}
