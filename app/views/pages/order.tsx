// /order: SUMMARY OF THE TRIP FROM THE QUERY STRING, PLAN CHOICE, EMAIL + NAME. POSTS TO /api/order (MOCK MODE: NO PAYMENT, NO EMAIL SENT).
import { plans } from '../../data/site'
import { useI18n } from '../../i18n/context'
import type { Crumb } from '../../seo/schema'
import { alpine } from '../../utils/alpine'
import { Icon } from '../icons'
import { PageHead } from '../page-head'

export type OrderQuery = { trip: string; from: string; to: string; depart: string; ret: string; pax: string; plan: string; sent: string }

const money = (n: number, c: string): string => new Intl.NumberFormat('en-US', { style: 'currency', currency: c, maximumFractionDigits: 0 }).format(n)

export const OrderPage = ({ q, crumbs }: { q: OrderQuery; crumbs: Crumb[] }) => {
  const { t, href } = useI18n()
  const hasTrip = Boolean(q.from && q.to && q.depart)
  const selected = plans.find((p) => p.id === q.plan)?.id ?? (q.trip === 'one-way' ? 'one-way' : 'return')
  return (
    <>
      <PageHead title={t('h1')} lead={t('lead')} crumbs={crumbs} />
      <section class="section pt-0">
        <div class="container order-grid">
          <aside class="card order-summary" aria-labelledby="summary-title">
            <h2 class="card-title" id="summary-title">{t('summary.title')}</h2>
            {hasTrip ? (
              <dl class="summary-list">
                <div><dt>{t('summary.route')}</dt><dd>{q.from} → {q.to}</dd></div>
                <div><dt>{t('summary.dates')}</dt><dd>{q.depart}{q.trip === 'return' && q.ret ? ` → ${q.ret}` : ''} · {q.trip === 'one-way' ? t('summary.oneWay') : t('summary.return')}</dd></div>
                <div><dt>{t('summary.passengers')}</dt><dd>{q.pax || '1'}</dd></div>
              </dl>
            ) : (
              <p class="card-text">{t('summary.empty')}</p>
            )}
            <a class="btn btn-ghost mt-4" href={`${href('/')}#hero-title`}>{t('summary.backToForm')}</a>
          </aside>

          <form class="card order-form" method="post" action="/api/order" {...alpine({ 'x-data': 'orderForm', '@submit.prevent': 'submit' })}>
            <input type="hidden" name="from" value={q.from} />
            <input type="hidden" name="to" value={q.to} />
            <input type="hidden" name="depart" value={q.depart} />
            <input type="hidden" name="return" value={q.ret} />
            <input type="hidden" name="pax" value={q.pax || '1'} />
            <input type="hidden" name="trip" value={q.trip || 'return'} />
            <div class="hp-field" aria-hidden="true">
              <label>Website<input type="text" name="website" tabindex={-1} autocomplete="off" /></label>
            </div>
            <fieldset>
              <legend class="card-title">{t('plan.title')}</legend>
              <div class="plan-options">
                {plans.map((p) => (
                  <label class="plan-option">
                    <input type="radio" name="plan" value={p.id} checked={p.id === selected} />
                    <span class="plan-option-body">
                      <span class="plan-option-name">{t(`plan.names.${p.id}`)}</span>
                      <span class="plan-option-price">{money(p.price, p.currency)} <small>{t('plan.perOrder')}</small></span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            <h2 class="card-title mt-8">{t('contact.title')}</h2>
            <div class="mt-4 grid gap-4 sm:grid-cols-2">
              <div class="field">
                <label class="form-label" for="o-name">{t('contact.name')}</label>
                <input class="form-control" id="o-name" name="name" placeholder={t('contact.namePh')} required autocomplete="name" />
              </div>
              <div class="field">
                <label class="form-label" for="o-email">{t('contact.email')}</label>
                <input class="form-control" id="o-email" type="email" name="email" placeholder={t('contact.emailPh')} required autocomplete="email" />
              </div>
            </div>
            <button type="submit" class="btn btn-primary btn-lg mt-6">{t('contact.submit')}<Icon name="arrow" class="h-4 w-4" /></button>
            <p class="form-note" role="status" {...alpine({ 'x-text': 'message', 'x-show': 'hasMessage' })}></p>
            {q.sent && <p class="form-note is-ok" role="status">{t('contact.mockTitle')}: {t('contact.mockText', { ref: q.sent })}</p>}
            <p class="form-note">{t('notice')}</p>
          </form>
        </div>
      </section>
    </>
  )
}
