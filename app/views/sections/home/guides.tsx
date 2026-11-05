// LATEST GUIDES ON THE HOME PAGE: LINKS INTO THE BLOG SO ARTICLES ARE REACHABLE FROM THE MOST LINKED PAGE.
// THE CARDS READ THEIR WORDS FROM THE `blog` NAMESPACE, SO THEY ARE WRAPPED IN THAT PROVIDER.
import { posts } from '../../../content/blog'
import { home } from '../../../data/site'
import { I18nProvider, useI18n } from '../../../i18n/context'
import { createI18n } from '../../../i18n/t'
import { BlogCard } from '../../blog-card'
import { SectionHeader } from '../../ui'

export const Guides = () => {
  const { t, href } = useI18n()
  return (
    <section class="section" id="guides" aria-labelledby="guides-title">
      <div class="container">
        <SectionHeader id="guides-title" eyebrow={t('guides.eyebrow')} title={t('guides.title')} lead={t('guides.lead')} />
        <I18nProvider i18n={createI18n('blog')}>
          <div class="post-grid">
            {posts.slice(0, home.latestPosts).map((p) => <BlogCard post={p} />)}
          </div>
        </I18nProvider>
        <p class="mt-8"><a class="btn btn-secondary" href={href('/blog')}>{t('guides.all')}</a></p>
      </div>
    </section>
  )
}
