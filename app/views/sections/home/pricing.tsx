// PRICING CARDS. PRICES COME FROM data/site.ts, WHERE THEY ARE FLAGGED AS PLACEHOLDERS (TODO FOR THE OWNER).
import { PRICES_ARE_PLACEHOLDERS, plans } from '../../../data/site'
import { useI18n } from '../../../i18n/context'
import { Icon } from '../../icons'
import { CtaLink, SectionHeader, reveal } from '../../ui'

const money = (n: number, currency: string): string => new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n)

export const Pricing = () => {
  const { t, list, href } = useI18n()
  return (
    <section class="section" id="pricing" aria-labelledby="pricing-title">
      <div class="container">
        <SectionHeader id="pricing-title" eyebrow={t('pricing.eyebrow')} title={t('pricing.title')} lead={t('pricing.lead')} />
        <div class="plans">
          {plans.map((p) => (
            <article class={`plan card reveal ${p.featured ? 'is-featured' : ''}`} {...reveal}>
              {p.featured && <span class="plan-flag">{t('pricing.popular')}</span>}
              <span class="icon-tile"><Icon name={p.icon} class="h-5 w-5" /></span>
              <h3 class="card-title">{t(`pricing.plans.${p.id}.name`)}</h3>
              <p class="card-text">{t(`pricing.plans.${p.id}.tagline`)}</p>
              <p class="plan-price">
                <span>{money(p.price, p.currency)}</span>
                <small>{t('pricing.perOrder')}</small>
              </p>
              <ul class="check-list is-compact">
                {list(`pricing.plans.${p.id}.features`).map((f) => (
                  <li>
                    <span class="tick"><Icon name="check" class="h-3.5 w-3.5" /></span>
                    {f}
                  </li>
                ))}
              </ul>
              <CtaLink href={`${href('/order')}?plan=${p.id}`} variant={p.featured ? 'primary' : 'secondary'} block>
                {t('pricing.choose')}
              </CtaLink>
            </article>
          ))}
        </div>
        {PRICES_ARE_PLACEHOLDERS && <p class="plans-note">{t('pricing.placeholderNote')}</p>}
      </div>
    </section>
  )
}
