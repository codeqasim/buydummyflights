// /contact: A PLAIN FORM POST TO /api/contact (WORKS WITHOUT JS). MOCK MODE UNTIL THE OWNER PROVIDES A SUPPORT MAILBOX: THE PAGE SAYS SO.
import { site } from '../../data/site'
import { useI18n } from '../../i18n/context'
import { Icon } from '../icons'

export const ContactForm = ({ status }: { status: string }) => {
  const { t } = useI18n()
  return (
    <section class="section pt-0">
      <div class="container">
        <form class="card contact-form" method="post" action="/api/contact">
          <h2 class="card-title">{t('form.title')}</h2>
          <div class="hp-field" aria-hidden="true">
            <label>Website<input type="text" name="website" tabindex={-1} autocomplete="off" /></label>
          </div>
          <div class="mt-4 grid gap-4 sm:grid-cols-2">
            <div class="field">
              <label class="form-label" for="c-name">{t('form.name')}</label>
              <input class="form-control" id="c-name" name="name" required autocomplete="name" maxlength={100} />
            </div>
            <div class="field">
              <label class="form-label" for="c-email">{t('form.email')}</label>
              <input class="form-control" id="c-email" type="email" name="email" required autocomplete="email" maxlength={254} />
            </div>
          </div>
          <div class="field mt-4">
            <label class="form-label" for="c-ref">{t('form.ref')}</label>
            <input class="form-control" id="c-ref" name="ref" maxlength={40} />
          </div>
          <div class="field mt-4">
            <label class="form-label" for="c-msg">{t('form.message')}</label>
            <textarea class="form-control" id="c-msg" name="message" rows={6} required minlength={10} maxlength={2000}></textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-lg mt-6">{t('form.submit')}<Icon name="arrow" class="h-4 w-4" /></button>
          {status === 'sent' && <p class="form-note is-ok" role="status">{t('form.sent')}</p>}
          {status === 'error' && <p class="form-note is-err" role="alert">{t('form.error')}</p>}
          {!site.contactEmail && <p class="form-note">{t('form.mockNotice')}</p>}
        </form>
      </div>
    </section>
  )
}
