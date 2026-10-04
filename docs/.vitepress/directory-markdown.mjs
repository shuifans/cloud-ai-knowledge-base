import { softwareSidebar } from './software-sidebar.mjs'
import { gamingSidebar } from './gaming-sidebar.mjs'
import { normalizePath } from './theme/knowledge.mjs'

const groups = softwareSidebar.filter(item => item.items?.length)
const catalogs = { '/software': groups, '/gaming': gamingSidebar }
const label = text => text.replace(/[\\[\]]/g, '\\$&')
const articleList = items => items.map(item => `- [${label(item.text)}](${item.link})`).join('\n')

export function directoryContent(path) {
  const root = `/${normalizePath(path).split('/').filter(Boolean)[0]}`
  const catalog = catalogs[root]
  if (!catalog) throw new Error(`Unknown directory: ${path}`)
  const group = catalog.find(item => normalizePath(item.link) === normalizePath(path))
  if (group) return `<div class="article-directory">\n\n<p class="directory-count">${group.items.length} 篇文章</p>\n\n${articleList(group.items)}\n\n</div>`
  if (normalizePath(path) !== root) throw new Error(`Unknown directory: ${path}`)
  const count = catalog.reduce((total, item) => total + item.items.length, 0)
  return `<div class="article-directory directory-overview">\n\n<p class="directory-count">${catalog.length} 个目录 · ${count} 篇文章</p>\n\n` + catalog.map(item =>
    `## [${label(item.text)}](${item.link}) {#${item.link.split('/').filter(Boolean).at(-1)}}\n\n${articleList(item.items)}`
  ).join('\n\n') + '\n\n</div>'
}

// Expand before block parsing so links, headings, search and SSR use ordinary Markdown.
export function directoryMarkdown(md) {
  md.core.ruler.before('block', 'article-directory', state => {
    state.src = state.src.replace(/^<!-- directory:(\/(?:software|gaming)\/[^\s]*?) -->$/gm, (_, path) => directoryContent(path))
  })
}

export function softwarePager(path) {
  return catalogPager('/software', groups, path)
}

export function directoryPager(path) {
  const root = `/${normalizePath(path).split('/').filter(Boolean)[0]}`
  return catalogs[root] ? catalogPager(root, catalogs[root], path) : {}
}

function catalogPager(root, catalog, path) {
  if (normalizePath(path) === root || catalog.some(item => normalizePath(item.link) === normalizePath(path))) {
    return { prev: false, next: false }
  }
  for (const group of catalog) {
    const index = group.items.findIndex(item => normalizePath(item.link) === normalizePath(path))
    if (index < 0) continue
    return { prev: group.items[index - 1] || false, next: group.items[index + 1] || false }
  }
  return {}
}
