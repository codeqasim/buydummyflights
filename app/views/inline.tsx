// INLINE CONTENT FORMAT ([text](/path) AND **bold**) TO JSX. LINKS GO THROUGH href() SO THEY STAY LOCALE-AWARE.
import { parseInline } from '../content/markup'
import { useI18n } from '../i18n/context'

export const InlineText = ({ text }: { text: string }) => {
  const { href } = useI18n()
  return (
    <>
      {parseInline(text).map((i) =>
        typeof i === 'string' ? i : 'link' in i ? <a href={href(i.link)}>{i.text}</a> : <strong>{i.bold}</strong>,
      )}
    </>
  )
}
