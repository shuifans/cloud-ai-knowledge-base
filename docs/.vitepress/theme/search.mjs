import { normalizePath } from './knowledge.mjs'

// VitePress strips heading tags but keeps their escaped HTML entities in its index.
const plainHeading = text => String(text || '').replace(/&(amp|lt|gt|quot|apos|#39|#x27);/gi, (entity, name) => ({ amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", '#39': "'", '#x27': "'" })[name.toLowerCase()])

export function canonicalPath(url, base = '/') {
  let path = url.split('#')[0]
  if (base !== '/' && path.startsWith(base)) path = `/${path.slice(base.length)}`
  return normalizePath(path)
}

export function groupSearchResults(query, hits, catalog, base = '/') {
  const q = query.trim().toLocaleLowerCase()
  if (!q) return []
  const words = q.split(/\s+/)
  const titleScore = title => {
    const text = title.toLocaleLowerCase()
    return text === q ? 300 : text.startsWith(q) ? 220 : text.includes(q) ? 180 : words.every(word => text.includes(word)) ? 120 : 0
  }
  const pages = new Map(catalog.map(page => [canonicalPath(page.url, base), page]))
  const groups = new Map()
  function add(path, hit) {
    const page = pages.get(path)
    if (!page) return
    const score = titleScore(page.title) + Math.log1p(hit?.score || 0)
    const group = groups.get(path) || { ...page, url: path === '/' ? '/' : `${path}${page.url.endsWith('/') ? '/' : ''}`, score, sections: [] }
    group.score = Math.max(group.score, score)
    const hash = hit?.id?.split('#')[1]
    const heading = plainHeading(hit?.title)
    if (hash && heading !== page.title && !group.sections.some(section => section.hash === hash)) {
      group.sections.push({ hash, title: heading, score: titleScore(heading) + (hit.score || 0) })
    }
    groups.set(path, group)
  }
  for (const hit of hits) add(canonicalPath(hit.id, base), hit)
  for (const [path, page] of pages) {
    if (titleScore(page.title) || words.every(word => page.summary.toLocaleLowerCase().includes(word))) add(path)
  }
  return [...groups.values()].sort((a,b) => b.score - a.score || a.title.localeCompare(b.title, 'zh-CN')).map(group => ({
    ...group, sections: group.sections.sort((a,b) => b.score - a.score).slice(0, 2),
  }))
}

export function highlightParts(text, query) {
  const q = query.trim().toLocaleLowerCase()
  if (!q) return [{ text, match: false }]
  const parts = []
  let start = 0, index
  while ((index = text.toLocaleLowerCase().indexOf(q, start)) !== -1) {
    parts.push({ text: text.slice(start, index), match: false }, { text: text.slice(index, index + q.length), match: true })
    start = index + q.length
  }
  parts.push({ text: text.slice(start), match: false })
  return parts
}
