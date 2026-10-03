import { softwareSidebar } from './software-sidebar.mjs'
import { normalizePath } from './theme/knowledge.mjs'

const groups = softwareSidebar.filter(item => item.items?.length)
const label = text => text.replace(/[\\[\]]/g, '\\$&')
const articleList = items => items.map(item => `- [${label(item.text)}](${item.link})`).join('\n')

export function directoryContent(path) {
  const group = groups.find(item => normalizePath(item.link) === normalizePath(path))
  if (group) return `<div class="article-directory">\n\n<p class="directory-count">${group.items.length} 篇文章</p>\n\n${articleList(group.items)}\n\n</div>`
  if (normalizePath(path) !== '/software') throw new Error(`Unknown directory: ${path}`)
  const count = groups.reduce((total, item) => total + item.items.length, 0)
  return `<div class="article-directory directory-overview">\n\n<p class="directory-count">${groups.length} 个目录 · ${count} 篇文章</p>\n\n` + groups.map(item =>
    `## [${label(item.text)}](${item.link}) {#${item.link.split('/').filter(Boolean).at(-1)}}\n\n${articleList(item.items)}`
  ).join('\n\n') + '\n\n</div>'
}

// Expand before block parsing so links, headings, search and SSR use ordinary Markdown.
export function directoryMarkdown(md) {
  md.core.ruler.before('block', 'article-directory', state => {
    state.src = state.src.replace(/^<!-- directory:(\/software\/[^\s]*?) -->$/gm, (_, path) => directoryContent(path))
  })
}

export function softwarePager(path) {
  if (normalizePath(path) === '/software' || groups.some(item => normalizePath(item.link) === normalizePath(path))) {
    return { prev: false, next: false }
  }
  for (const group of groups) {
    const index = group.items.findIndex(item => normalizePath(item.link) === normalizePath(path))
    if (index < 0) continue
    return { prev: group.items[index - 1] || false, next: group.items[index + 1] || false }
  }
  return {}
}
