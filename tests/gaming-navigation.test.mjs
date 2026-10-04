import test from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { createMarkdownRenderer } from 'vitepress'
import { gamingSidebar } from '../docs/.vitepress/gaming-sidebar.mjs'
import { knowledgeSidebar } from '../docs/.vitepress/site-navigation.mjs'
import { directoryMarkdown, directoryContent, directoryPager } from '../docs/.vitepress/directory-markdown.mjs'
import { breadcrumbTrail } from '../docs/.vitepress/theme/knowledge.mjs'

test('gaming directory rendering exposes every real article once in sidebar order', async () => {
  const md = await createMarkdownRenderer(process.cwd(), { config: directoryMarkdown })
  const paths = readdirSync('docs/gaming', { recursive: true })
    .filter(path => path.endsWith('.md') && !path.endsWith('index.md'))
    .map(path => `/gaming/${path.slice(0, -3)}`).sort()
  const entries = gamingSidebar.flatMap(group => group.items)
  assert.deepEqual(entries.map(item => item.link).sort(), paths)
  const overview = md.render(readFileSync('docs/gaming/index.md', 'utf8'))
  assert.doesNotMatch(overview, /<!-- directory:/)
  for (const group of gamingSidebar) {
    assert.ok(group.items.length >= 2, `Avoid single-article directories: ${group.text}`)
    const html = md.render(readFileSync(`docs${group.link}index.md`, 'utf8'))
    let previous = -1
    for (const item of group.items) {
      const href = `href="${item.link}.html"`
      assert.equal(overview.split(href).length - 1, 1, item.link)
      assert.equal(html.split(href).length - 1, 1, item.link)
      assert.ok(html.indexOf(href) > previous, item.link)
      previous = html.indexOf(href)
    }
  }
})

test('gaming paging keeps readers in the same directory and preserves breadcrumb hierarchy with a deployment base', () => {
  assert.deepEqual(directoryPager('/gaming/'), { prev: false, next: false })
  for (const group of gamingSidebar) {
    assert.deepEqual(directoryPager(group.link), { prev: false, next: false })
    group.items.forEach((item, index) => {
      assert.deepEqual(directoryPager(item.link), {
        prev: group.items[index - 1] || false,
        next: group.items[index + 1] || false,
      })
    })
  }
  const trail = breadcrumbTrail(knowledgeSidebar, '/cloud-ai-knowledge-base/gaming/production/asset-pipeline.html', '', '/cloud-ai-knowledge-base/')
  assert.deepEqual(trail.map(item => item.link), ['/', '/gaming/', '/gaming/production/', '/gaming/production/asset-pipeline'])
  assert.equal(trail[1].text, '游戏行业')
  // Existing article URLs now resolve through their merged directory, not their physical folder.
  for (const [article, parent] of [
    ['/gaming/organization/roles', '/gaming/industry/'],
    ['/gaming/design/planning-deliverables', '/gaming/production/'],
    ['/gaming/analytics/metrics', '/gaming/publishing/'],
    ['/gaming/ai/scenarios-evaluation', '/gaming/systems/'],
  ]) {
    const mergedTrail = breadcrumbTrail(knowledgeSidebar, `/cloud-ai-knowledge-base${article}.html`, '', '/cloud-ai-knowledge-base/')
    assert.deepEqual(mergedTrail.map(item => item.link), ['/', '/gaming/', parent, article])
  }
})

test('catalog lookup rejects unknown paths and leaves other domains to their own pager', () => {
  assert.throws(() => directoryContent('/gaming/missing/'), /Unknown directory/)
  assert.throws(() => directoryContent('/missing/'), /Unknown directory/)
  assert.deepEqual(directoryPager('/gaming/missing'), {})
  assert.deepEqual(directoryPager('/cloud/infra/compute'), {})
  assert.equal(directoryPager('/software/foundations/source-to-runtime').prev, false)
  assert.ok(directoryContent('/software/').includes('/software/foundations/source-to-runtime'))
})
