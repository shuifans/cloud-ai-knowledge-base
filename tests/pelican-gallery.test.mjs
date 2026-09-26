import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { PELICAN_PROMPT, parsePelicanFilename, filterResults, readFilters, writeFilters, previewDocument } from '../docs/.vitepress/theme/pelican.mjs'

const sample = [
  { id: 'a', modelId: 'gpt6-sol', reasoningEffort: 'xhigh', importedAt: '2026-09-26T01:00:00Z' },
  { id: 'b', modelId: 'gpt6-sol', reasoningEffort: 'medium', importedAt: '2026-09-25T01:00:00Z' },
  { id: 'c', modelId: 'qwen3.8-max', reasoningEffort: 'xhigh', importedAt: '2026-09-24T01:00:00Z' },
  { id: 'd', modelId: 'gpt6-sol', reasoningEffort: 'medium', importedAt: '2026-09-27T01:00:00Z' },
]

test('filename parser preserves model suffixes and rejects missing or unsupported effort', () => {
  assert.deepEqual(parsePelicanFilename('pelican-bicycle-qwen3.8-max-xhigh.html'), { modelId: 'qwen3.8-max', reasoningEffort: 'xhigh' })
  assert.deepEqual(parsePelicanFilename('pelican-bicycle-deepseek-v4.1-flash-max.html'), { modelId: 'deepseek-v4.1-flash', reasoningEffort: 'max' })
  assert.throws(() => parsePelicanFilename('pelican-bicycle-gpt6-sol.html'))
  assert.throws(() => parsePelicanFilename('pelican-bicycle-gpt6-sol-unknown.html'))
})

test('multi-select uses OR within dimensions, AND across dimensions and preserves repeated runs', () => {
  const before = structuredClone(sample)
  assert.deepEqual(filterResults(sample, { models: ['gpt6-sol'], efforts: ['medium'] }).map(result => result.id), ['d', 'b'])
  assert.equal(filterResults(sample, { models: ['gpt6-sol', 'qwen3.8-max'], efforts: ['medium', 'xhigh'] }).length, 4)
  assert.equal(filterResults(sample, { models: ['qwen3.8-max'], efforts: ['medium'] }).length, 0)
  assert.deepEqual(filterResults(sample).map(result => result.id), ['d', 'b', 'a', 'c'])
  assert.deepEqual(filterResults(sample, { sort: 'recent' }).map(result => result.id), ['d', 'a', 'b', 'c'])
  assert.deepEqual(sample, before)
})

test('shared filters survive reload with Pages base and preserve unrelated URL state', () => {
  const next = writeFilters('https://example.com/cloud-ai-knowledge-base/playground/pelican/?campaign=demo#works', { models: ['gpt6-sol', 'qwen3.8-max'], efforts: ['xhigh'], sort: 'recent' })
  assert.ok(next.startsWith('/cloud-ai-knowledge-base/playground/pelican/?'))
  const url = new URL(next, 'https://example.com')
  assert.equal(url.searchParams.get('campaign'), 'demo')
  assert.equal(url.hash, '#works')
  assert.deepEqual(readFilters(url.search, sample), { models: ['gpt6-sol', 'qwen3.8-max'], efforts: ['xhigh'], sort: 'recent' })
  assert.deepEqual(readFilters('?model=invalid,gpt6-sol,gpt6-sol&effort=invalid&sort=invalid', sample), { models: ['gpt6-sol'], efforts: [], sort: 'model' })
  assert.equal(writeFilters(url.href, { models: [], efforts: [], sort: 'model' }), '/cloud-ai-knowledge-base/playground/pelican/?campaign=demo#works')
})

test('preview policy precedes executable content while original output remains intact', () => {
  const original = '<!doctype html><HTML><HEAD><script>document.body.dataset.test = 1</script></HEAD><body><svg></svg></body></HTML>'
  const preview = previewDocument(original)
  assert.ok(preview.indexOf('Content-Security-Policy') < preview.indexOf('<script>'))
  assert.ok(preview.endsWith(original.slice(original.indexOf('<script>'))))
  assert.match(preview, /connect-src 'none'/)
  assert.match(preview, /frame-src 'none'/)
  const component = readFileSync('docs/.vitepress/theme/components/PelicanPreview.vue', 'utf8')
  assert.match(component, /sandbox="allow-scripts"/)
  assert.doesNotMatch(component, /allow-same-origin|v-html/)
})

test('published catalog preserves every original hash, prompt, unique run and real cover', () => {
  const catalog = JSON.parse(readFileSync('docs/.vitepress/theme/pelican-catalog.json', 'utf8'))
  assert.equal(catalog.prompt, '创建一个HTML，内容是SVG绘制一个鹈鹕骑自行车的2D动画。')
  assert.equal(catalog.prompt, PELICAN_PROMPT)
  assert.equal(new Set(catalog.results.map(result => result.id)).size, catalog.results.length)
  for (const result of catalog.results) {
    assert.deepEqual(parsePelicanFilename(result.sourceFilename), { modelId: result.modelId, reasoningEffort: result.reasoningEffort })
    assert.ok(result.artifactPath.endsWith('.html.txt'))
    const source = readFileSync('docs/public' + result.artifactPath)
    assert.equal(createHash('sha256').update(source).digest('hex'), result.sha256)
    assert.ok(existsSync('docs/public' + result.thumbnailPath), `${result.id}: missing cover`)
    const cover = readFileSync('docs/public' + result.thumbnailPath)
    assert.equal(cover.toString('ascii', 8, 12), 'WEBP')
    assert.ok(result.capture?.viewport && result.previewViewport.height >= 800)
  }
})
