import test from 'node:test'
import assert from 'node:assert/strict'
import { knowledgeSidebar } from '../docs/.vitepress/site-navigation.mjs'
import { directoryTree, directoryPath, directoryAncestors, restoreDirectory, filterDirectory } from '../docs/.vitepress/theme/directory.mjs'
import { sectionPager } from '../docs/.vitepress/theme/knowledge.mjs'

const tree = directoryTree(knowledgeSidebar)
const source = '/software/foundations/source-to-runtime'

test('deep links identify every directory ancestor, including groups without a URL', () => {
  assert.equal(directoryPath(`/cloud-ai-knowledge-base${source}.html#原理`, '/cloud-ai-knowledge-base/'), source)
  assert.deepEqual(directoryAncestors(tree, source), ['/software/', '/software/foundations/'])
  assert.deepEqual(directoryAncestors(tree, '/ai/models/llm'), ['/ai/', '/ai/models/', '人工智能 / 模型与算法 / 基础模型'])
  assert.deepEqual(directoryAncestors(tree, '/software/foundations/'), ['/software/', '/software/foundations/'])
  assert.equal(directoryAncestors(tree, '/missing'), null)
})

test('navigating opens the destination path without resetting other manually expanded branches', () => {
  const saved = { '/cloud/': true, '/cloud/data/': false, '/software/': false, '/software/foundations/': false, '/missing/': true }
  const restored = restoreDirectory(tree, source, saved)
  assert.equal(restored['/cloud/'], true)
  assert.equal(restored['/cloud/data/'], false)
  assert.equal(restored['/software/'], true)
  assert.equal(restored['/software/foundations/'], true)
  assert.equal(restored['/missing/'], undefined)
  assert.equal(saved['/software/'], false)
  assert.doesNotThrow(() => restoreDirectory(tree, source, null))
  assert.equal(restoreDirectory(tree, '/', { '/cloud/': 'false' })['/cloud/'], false)
})

test('title filtering returns direct articles with their paths and no intermediate directory pages', () => {
  assert.deepEqual(filterDirectory(tree, ''), [])
  assert.deepEqual(filterDirectory(tree, '不存在的文章关键词'), [])
  const result = filterDirectory(tree, '源码')
  assert.equal(result.length, 1)
  assert.equal(result[0].link, source)
  assert.equal(result[0].path, '软件研发 / 编程与计算机基础')
  assert.deepEqual(filterDirectory(tree, '编程与计算机基础'), [])
  assert.equal(filterDirectory(tree, '  gpu  选型  ')[0].link, '/ai/infra/inference/gpu-sizing')
  assert.equal(filterDirectory(tree, 'ＧＰＵ 选型')[0].link, '/ai/infra/inference/gpu-sizing')
})

test('article paging skips directory pages while keeping technical areas separate', () => {
  assert.deepEqual(sectionPager(knowledgeSidebar, '/cloud/'), { prev: false, next: false })
  assert.equal(sectionPager(knowledgeSidebar, '/cloud/foundation/sdn-nfv').next.link, '/cloud/infra/compute')
  assert.equal(sectionPager(knowledgeSidebar, '/ai/infra/training').next.link, '/ai/infra/inference/llm-inference')
  assert.equal(sectionPager(knowledgeSidebar, '/cloud/architecture/migration').next, false)
})
