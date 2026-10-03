import { normalizePath } from './knowledge.mjs'

export function directoryPath(path, base = '/') {
  return normalizePath(base !== '/' && path.startsWith(base) ? path.slice(base.length - 1) : path)
}

// Keep group URLs as metadata for breadcrumbs and old links, never as tree actions.
export function directoryTree(items, parents = [], position = 'kb') {
  return items.map((item, index) => {
    const labels = [...parents, item.text]
    const id = `${position}-${index}`
    return {
      text: item.text, link: item.link,
      key: item.link || labels.join(' / '), id,
      path: parents.join(' / '), defaultOpen: item.collapsed === false,
      children: directoryTree(item.items || [], labels, id),
    }
  })
}

export function directoryAncestors(nodes, path) {
  for (const node of nodes) {
    if (node.link && normalizePath(node.link) === normalizePath(path)) {
      return node.children.length ? [node.key] : []
    }
    const child = directoryAncestors(node.children, path)
    if (child) return [node.key, ...child]
  }
  return null
}

export function restoreDirectory(nodes, path, saved = {}) {
  const state = {}
  function visit(items) {
    for (const node of items) {
      if (node.children.length) {
        state[node.key] = typeof saved?.[node.key] === 'boolean' ? saved[node.key] : node.defaultOpen
        visit(node.children)
      }
    }
  }
  visit(nodes)
  for (const key of directoryAncestors(nodes, path) || []) state[key] = true
  return state
}

export function filterDirectory(nodes, query) {
  const words = query.normalize('NFKC').trim().toLocaleLowerCase().split(/\s+/).filter(Boolean)
  if (!words.length) return []
  return nodes.flatMap(node => node.children.length
    ? filterDirectory(node.children, query)
    : node.link && node.link !== '/' && words.every(word => node.text.normalize('NFKC').toLocaleLowerCase().includes(word)) ? [node] : [])
}
