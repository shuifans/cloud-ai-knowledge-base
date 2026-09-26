import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { basename, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { CAPTURE_VIEWPORT, PELICAN_PROMPT, parsePelicanFilename } from '../docs/.vitepress/theme/pelican.mjs'

// Each invocation adds a batch. Re-imports are idempotent; changed files never overwrite a run.
const root = fileURLToPath(new URL('../', import.meta.url))
const [source, batchId, batchLabel = batchId] = process.argv.slice(2)
if (!source || !/^[a-z0-9][a-z0-9-]*$/.test(batchId || '')) {
  throw new Error('用法：node scripts/import-pelicans.mjs <源目录> <英文批次ID> [批次名称]')
}
const manifestPath = resolve(root, 'docs/.vitepress/theme/pelican-catalog.json')
const catalog = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {
  challengeId: 'pelican-bicycle', promptVersion: 'v1', prompt: PELICAN_PROMPT, batches: [], results: [],
}
const importedAt = new Date().toISOString()
const pending = []
for (const filename of readdirSync(resolve(source)).filter(name => name.endsWith('.html')).sort()) {
  const metadata = parsePelicanFilename(filename)
  const bytes = readFileSync(resolve(source, filename))
  const sha256 = createHash('sha256').update(bytes).digest('hex')
  const html = bytes.toString('utf8')
  if (!/<html\b/i.test(html) || !/<svg\b/i.test(html)) throw new Error(`不是 HTML / SVG 作品：${filename}`)
  const id = `${batchId}-${basename(filename, '.html').replace('pelican-bicycle-', '')}-${sha256.slice(0, 10)}`
  if (catalog.results.some(result => result.id === id)) continue
  if (catalog.results.some(result => result.sha256 === sha256)) {
    throw new Error(`发现其他批次中的相同文件，请核对后收录：${filename}`)
  }
  const prefix = `/playground/pelican/assets/${batchId}/${id}`
  pending.push({ bytes, record: {
    id, ...metadata, modelLabel: metadata.modelId, challengeId: catalog.challengeId,
    promptVersion: catalog.promptVersion, effortSource: 'filename', batchId, runId: sha256.slice(0, 10),
    sourceFilename: filename, artifactPath: `${prefix}.html.txt`, thumbnailPath: `${prefix}.webp`,
    sha256, importedAt, testedAt: null, previewViewport: CAPTURE_VIEWPORT, capture: null,
  } })
}
if (!pending.length) {
  console.log('没有新结果；现有批次保持不变。')
} else {
  // Validation above completes before any files are written.
  for (const { bytes, record } of pending) {
    const target = resolve(root, 'docs/public' + record.artifactPath)
    mkdirSync(dirname(target), { recursive: true })
    writeFileSync(target, bytes, { flag: 'wx' })
    catalog.results.push(record)
  }
  if (!catalog.batches.some(batch => batch.id === batchId)) catalog.batches.push({ id: batchId, label: batchLabel })
  writeFileSync(manifestPath, JSON.stringify(catalog, null, 2) + '\n')
  console.log(`收录 ${pending.length} 个作品，共 ${catalog.results.length} 个；下一步生成真实封面并校验。`)
}
