// VISIBLE NAME OF ANY REGISTERED PATH (RELATED-LINK LISTS, BREADCRUMBS): BLOG ARTICLE TITLE, OR THE PAGE'S OWN `crumb` MESSAGE.
import { postBySlug } from '../content/blog'
import { pageByPath } from '../data/pages'
import { createI18n } from '../i18n/t'

export const pageLabel = (path: string): string => {
  const post = path.startsWith('/blog/') ? postBySlug(path.slice('/blog/'.length)) : undefined
  if (post) return post.title
  const rec = pageByPath(path)
  if (!rec) throw new Error(`labels: "${path}" is not in the registry`)
  return createI18n(rec.ns).t('crumb')
}
