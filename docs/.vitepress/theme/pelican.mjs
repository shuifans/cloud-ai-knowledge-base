export const PELICAN_PROMPT = '创建一个HTML，内容是SVG绘制一个鹈鹕骑自行车的2D动画。'
export const EFFORT_ORDER = ['none', 'minimal', 'low', 'medium', 'high', 'xhigh', 'max']
export const CAPTURE_VIEWPORT = { width: 1280, height: 800 }

export function parsePelicanFilename(filename) {
  const match = /^pelican-bicycle-(.+)-([a-z]+)\.html$/.exec(filename)
  if (!match || !EFFORT_ORDER.includes(match[2])) throw new Error(`无法识别模型或 reasoning effort：${filename}`)
  return { modelId: match[1], reasoningEffort: match[2] }
}

export function filterResults(results, { models = [], efforts = [], sort = 'model' } = {}) {
  const filtered = results.filter(result => (!models.length || models.includes(result.modelId)) &&
    (!efforts.length || efforts.includes(result.reasoningEffort)))
  return filtered.sort((a, b) => {
    if (sort === 'recent') {
      const date = b.importedAt.localeCompare(a.importedAt)
      if (date) return date
    }
    return a.modelId.localeCompare(b.modelId, 'en', { numeric: true }) ||
      EFFORT_ORDER.indexOf(a.reasoningEffort) - EFFORT_ORDER.indexOf(b.reasoningEffort) ||
      b.importedAt.localeCompare(a.importedAt) || a.id.localeCompare(b.id)
  })
}

export function readFilters(search, results) {
  const params = new URLSearchParams(search)
  const knownModels = new Set(results.map(result => result.modelId))
  const knownEfforts = new Set(results.map(result => result.reasoningEffort))
  const selected = (key, known) => [...new Set((params.get(key) || '').split(',').filter(value => known.has(value)))]
  return {
    models: selected('model', knownModels),
    efforts: selected('effort', knownEfforts),
    sort: params.get('sort') === 'recent' ? 'recent' : 'model',
  }
}

export function writeFilters(url, state) {
  const next = new URL(url)
  for (const [key, values] of [['model', state.models], ['effort', state.efforts]]) {
    if (values.length) next.searchParams.set(key, [...values].sort().join(','))
    else next.searchParams.delete(key)
  }
  if (state.sort === 'recent') next.searchParams.set('sort', 'recent')
  else next.searchParams.delete('sort')
  return next.pathname + next.search + next.hash
}

// The archive stays byte-for-byte intact. Only the sandboxed preview gets this policy.
export function previewDocument(html) {
  const policy = "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; connect-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'"
  const meta = `<meta http-equiv="Content-Security-Policy" content="${policy}"><meta name="referrer" content="no-referrer">`
  if (/<head\b[^>]*>/i.test(html)) return html.replace(/<head\b[^>]*>/i, head => head + meta)
  return `<!doctype html><head>${meta}</head>${html}`
}

export async function fetchOriginal(path, { signal } = {}) {
  const response = await fetch(path, { signal, credentials: 'omit' })
  if (!response.ok) throw new Error('原始作品暂时无法加载')
  const html = await response.text()
  if (!/<svg\b/i.test(html) || !/<html\b/i.test(html)) throw new Error('作品文件格式不正确')
  return html
}
