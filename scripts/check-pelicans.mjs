import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { PELICAN_PROMPT, parsePelicanFilename } from '../docs/.vitepress/theme/pelican.mjs'

const catalog = JSON.parse(readFileSync(new URL('../docs/.vitepress/theme/pelican-catalog.json', import.meta.url), 'utf8'))
if (catalog.prompt !== PELICAN_PROMPT) throw new Error('提示词与当前 v1 记录不一致')
const ids = new Set()
for (const result of catalog.results) {
  if (ids.has(result.id)) throw new Error(`重复记录 ID：${result.id}`)
  ids.add(result.id)
  const parsed = parsePelicanFilename(result.sourceFilename)
  if (parsed.modelId !== result.modelId || parsed.reasoningEffort !== result.reasoningEffort) throw new Error(`元数据与文件名不一致：${result.id}`)
  for (const path of [result.artifactPath, result.thumbnailPath]) {
    if (!/^\/playground\/pelican\/assets\/[a-z0-9-]+\/[a-z0-9.-]+$/.test(path) || path.includes('..')) throw new Error(`无效资源路径：${path}`)
  }
  if (!result.artifactPath.endsWith('.html.txt')) throw new Error('原始作品须作为文本归档')
  const source = readFileSync(new URL('../docs/public' + result.artifactPath, import.meta.url))
  if (createHash('sha256').update(source).digest('hex') !== result.sha256) throw new Error(`原始文件被改动：${result.id}`)
  const image = readFileSync(new URL('../docs/public' + result.thumbnailPath, import.meta.url))
  if (image.toString('ascii', 8, 12) !== 'WEBP' || !result.capture) throw new Error(`缺少真实封面及截图记录：${result.id}`)
  if (!catalog.batches.some(batch => batch.id === result.batchId)) throw new Error(`批次不存在：${result.id}`)
}
console.log(`鹈鹕展区校验通过：${ids.size} 个原始作品及封面。`)
