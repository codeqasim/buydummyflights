// TESTIMONIALS PLACEHOLDER: CLEARLY GENERIC, NO NAMES, NO RATINGS, NO REVIEW SCHEMA. REPLACE WITH REAL, PERMISSIONED REVIEWS.
import { home } from '../../../data/site'
import { useI18n } from '../../../i18n/context'
import { Icon } from '../../icons'
import { SectionHeader, reveal } from '../../ui'

export const Reviews = () => {
  const { t } = useI18n()
  return (
    <section class="section section-alt" id="reviews" aria-labelledby="reviews-title">
      <div class="container">
        <SectionHeader id="reviews-title" eyebrow={t('reviews.eyebrow')} title={t('reviews.title')} lead={t('reviews.lead')} />
        <div class="grid-3">
          {Array.from({ length: home.testimonialSlots }, (_, i) => (
            <figure class="card quote is-placeholder reveal" data-placeholder="true" {...reveal} key={i}>
              <Icon name="quote" class="h-6 w-6 text-accent" />
              <blockquote class="quote-text">{t('reviews.placeholderQuote')}</blockquote>
              <figcaption class="quote-by">
                <span class="avatar" aria-hidden="true"><Icon name="user" class="h-4 w-4" /></span>
                <span>{t('reviews.placeholderMeta')}</span>
                <span class="chip">{t('reviews.placeholderLabel')}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
