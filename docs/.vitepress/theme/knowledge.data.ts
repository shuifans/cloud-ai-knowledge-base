import { createContentLoader } from 'vitepress'
import { getReadingGuide, pageKey, verifiedDate } from '../reading-guides.mjs'

export default createContentLoader('**/*.md', {
  transform(raw) {
    return raw.filter(page => page.url !== '/' && page.frontmatter.search !== false && !page.frontmatter.redirect).map(page => {
      const key = page.url.replace(/^\//, '').replace(/\.html$/, '')
      return {
        url: page.url.replace(/\.html$/, ''),
        title: page.frontmatter.title || key,
        verified: verifiedDate(page.frontmatter.lastVerified),
        summary: getReadingGuide(pageKey(key))?.summary || '',
      }
    })
  },
})
