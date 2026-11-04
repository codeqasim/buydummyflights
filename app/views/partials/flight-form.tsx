// THE ORDER FORM: A PLAIN GET FORM TO /order (WORKS WITHOUT JS). ALPINE ONLY SHOWS/HIDES THE RETURN DATE AND SWAPS FROM/TO.
import { airportLabel, airports } from '../../data/airports'
import { useI18n } from '../../i18n/context'
import { alpine } from '../../utils/alpine'
import { Icon } from '../icons'

export const FlightForm = ({ today, idPrefix = 'hero' }: { today: string; idPrefix?: string }) => {
  const { t, href } = useI18n()
  const id = (n: string) => `${idPrefix}-${n}`
  const listId = `${idPrefix}-airports`
  return (
    <form class="flight-form" method="get" action={href('/order')} {...alpine({ 'x-data': 'flightForm', '@submit': 'onSubmit' })}>
      <fieldset class="trip-toggle">
        <legend class="sr-only">{t('form.trip')}</legend>
        <label class="trip-option">
          <input type="radio" name="trip" value="one-way" {...alpine({ 'x-model': 'trip' })} />
          <span>{t('form.oneWay')}</span>
        </label>
        <label class="trip-option">
          <input type="radio" name="trip" value="return" checked {...alpine({ 'x-model': 'trip' })} />
          <span>{t('form.return')}</span>
        </label>
      </fieldset>

      <div class="route-row">
        <div class="field">
          <label class="form-label" for={id('from')}>{t('form.from')}</label>
          <input class="form-control" id={id('from')} name="from" list={listId} placeholder={t('form.fromPh')} required autocomplete="off" {...alpine({ 'x-model': 'from' })} />
        </div>
        <button type="button" class="swap-btn" aria-label={`${t('form.from')} / ${t('form.to')}`} {...alpine({ '@click': 'swap' })}>
          <Icon name="swap" class="h-4 w-4 rotate-90" />
        </button>
        <div class="field">
          <label class="form-label" for={id('to')}>{t('form.to')}</label>
          <input class="form-control" id={id('to')} name="to" list={listId} placeholder={t('form.toPh')} required autocomplete="off" {...alpine({ 'x-model': 'to' })} />
        </div>
      </div>

      <div class="date-row">
        <div class="field">
          <label class="form-label" for={id('depart')}>{t('form.depart')}</label>
          <input class="form-control" type="date" id={id('depart')} name="depart" min={today} required />
        </div>
        <div class="field" {...alpine({ 'x-show': 'isReturn' })}>
          <label class="form-label" for={id('return')}>{t('form.returnDate')}</label>
          <input class="form-control" type="date" id={id('return')} name="return" min={today} />
        </div>
        <div class="field">
          <label class="form-label" for={id('pax')}>{t('form.passengers')}</label>
          <select class="form-control" id={id('pax')} name="pax">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <option value={n}>{n === 1 ? t('form.passengerOne') : t('form.passengerMany', { n })}</option>
            ))}
          </select>
        </div>
      </div>

      <datalist id={listId}>
        {airports.map((a) => (
          <option value={airportLabel(a)}>{a.country}</option>
        ))}
      </datalist>

      <button type="submit" class="btn btn-primary btn-lg btn-block">
        {t('form.submit')}
        <Icon name="arrow" class="h-4 w-4" />
      </button>
      <p class="form-note">{t('form.note')}</p>
    </form>
  )
}
