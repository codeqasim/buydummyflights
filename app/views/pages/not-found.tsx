// 404 / 500 BODY.
import { useI18n } from '../../i18n/context'
import { CtaLink } from '../ui'

export const NotFoundPage = ({ error = false }: { error?: boolean }) => {
  const { t, href } = useI18n()
  return (
    <section class="page-head">
      <div class="container text-center">
        <p class="eyebrow">{error ? '500' : '404'}</p>
        <h1 class="page-title">{error ? t('error.h1') : t('h1')}</h1>
        <p class="section-lead mx-auto">{error ? t('error.lead') : t('lead')}</p>
        <div class="mt-8">
          <CtaLink href={href('/')}>{t('home')}</CtaLink>
        </div>
      </div>
    </section>
  )
}
