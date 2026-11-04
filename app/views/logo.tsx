// THE MARK (A PLANE ON A ROUNDED SQUARE) + THE WORDMARK. THE ONLY PLACE THE BRAND NAME IS ASSEMBLED FOR DISPLAY.
import { useI18n } from '../i18n/context'
import { Icon } from './icons'

export const Logo = ({ class: cls = '' }: { class?: string }) => {
  const { t, href } = useI18n()
  return (
    <a href={href('/')} class={`logo ${cls}`}>
      <span class="logo-mark" aria-hidden="true">
        <Icon name="plane" class="h-5 w-5" />
      </span>
      <span class="logo-text">
        Buy<span class="logo-word">Dummy</span><span class="logo-accent">Flights</span>
      </span>
    </a>
  )
}
