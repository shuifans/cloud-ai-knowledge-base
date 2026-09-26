import test from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { createMarkdownRenderer, resolveConfig } from 'vitepress'
import { groupSearchResults, canonicalPath, highlightParts } from '../docs/.vitepress/theme/search.mjs'
import { overviewChildren, findNode, taskPaths, topicPaths, shortHeading } from '../docs/.vitepress/theme/knowledge.mjs'
import { getReadingGuide, pageKey, learningPaths, historyConnections, verifiedDate } from '../docs/.vitepress/reading-guides.mjs'
import { readingMarkdown } from '../docs/.vitepress/reading-markdown.mjs'
const catalog = [
  { url: '/ai/application/rag', title: '企业级 RAG 架构设计', summary: '设计检索与评测链路。' },
  { url: '/ai/application/', title: '应用与评测', summary: '模型接入应用。' },
  { url: '/cloud/data/', title: '数据库', summary: '数据持久化与检索。' },
]

test('title match wins over numerous high-scoring chapter hits and merges chapters by article', () => {
  const hits = Array.from({length:30}, (_,i) => ({id:`/base/ai/application/#part-${i}`, title: `RAG 示例 ${i}`, score: 1000 - i}))
  hits.push({id:'/base/ai/application/rag.html#principles', title:'架构原理', score:1})
  const results = groupSearchResults('RAG', hits, catalog, '/base/')
  assert.equal(results.length, 2)
  assert.equal(results[0].url, '/ai/application/rag')
  assert.equal(results[1].sections.length, 2)
  assert.equal(results[0].sections[0].hash, 'principles')
  const escaped = groupSearchResults('RAG', [{id:'/ai/application/rag#version',title:'把&quot;版本&quot;作为架构约束',score:1}], catalog)
  assert.equal(escaped[0].sections[0].title, '把"版本"作为架构约束')
})
test('Chinese title and summary fallback work without a downloaded index; empty and unmatched queries do not show all pages', () => {
  assert.equal(groupSearchResults('数据库', [], catalog)[0].title, '数据库')
  assert.equal(groupSearchResults('数据库', [], [{url:'/hub/', title:'导读：数据库知识框架',summary:''},{url:'/article',title:'数据库选型',summary:''}])[0].title, '数据库选型')
  assert.equal(groupSearchResults('持久化', [], catalog)[0].title, '数据库')
  assert.deepEqual(groupSearchResults('', [], catalog), [])
  assert.deepEqual(groupSearchResults('zzzz-nothing', [], catalog), [])
  assert.equal(canonicalPath('/base/ai/index.html#first','/base/'), '/ai')
  assert.equal(highlightParts('<script>RAG</script>', 'rag').map(p=>p.text).join(''), '<script>RAG</script>')
})
test('hub directories use real children, omit self-links and flatten labels without pages', () => {
  const sidebar = { '/ai/': [{text:'AI',link:'/ai/'}, {text:'模型',link:'/ai/models/',items:[{text:'模型总览',link:'/ai/models/'},{text:'基础模型',items:[{text:'LLM',link:'/ai/models/llm'}]}]}, {text:'推理',link:'/ai/inference/',items:[{text:'部署',link:'/ai/inference/deploy'}]}] }
  assert.deepEqual(overviewChildren(sidebar,'/ai/').map(x=>x.text), ['模型','推理'])
  assert.deepEqual(overviewChildren(sidebar,'/ai/models/').map(x=>x.text), ['LLM'])
  assert.deepEqual(overviewChildren(sidebar,'/ai/models/llm'), [])
  assert.equal(shortHeading('三、架构设计：控制面与数据面'), '架构设计')
})
test('every article has a complete reading guide; all curated paths resolve to actual pages', () => {
  const pages = readdirSync('docs', { recursive:true }).filter(p=>p.endsWith('.md') && !p.startsWith('.vitepress'))
  assert.ok(pages.length > 1)
  for (const page of pages.filter(p=>p!=='index.md')) {
    const guide = getReadingGuide(pageKey(page))
    for (const field of ['summary','audience','prerequisites']) assert.ok(guide?.[field], `${page}: ${field}`)
  }
  const paths = [...Object.values(learningPaths).flat(), ...Object.values(historyConnections).flat(), ...taskPaths.flatMap(t=>t.links.map(l=>l[1])), ...topicPaths.flatMap(t=>t.links.map(l=>l[1]))]
  for (const path of paths) {
    const relative = path.replace(/^\//,'')
    assert.ok(existsSync(`docs/${relative}${relative.endsWith('/') ? 'index.md' : '.md'}`), path)
  }
})
test('only the leading knowledge map is folded; technical images and headings remain', async () => {
  const md = await createMarkdownRenderer(process.cwd(), {config: readingMarkdown})
  const output = md.render('# 标题\n\n![地图](/images/test.png)\n\n*本站生成的高清全文阅读地图；具体版本以原文为准。*\n\n> 保留引语\n\n## 原理\n\n![技术图](/images/another.png)')
  assert.equal((output.match(/PageGuide/g) || []).length,1)
  assert.ok(output.indexOf('<PageGuide') < output.indexOf('<OverviewMap'))
  assert.match(output, /<OverviewMap src="\/images\/test.png"/)
  assert.match(output, /<img src="\/images\/another.png"/)
  assert.match(output, /保留引语/)
  assert.doesNotMatch(output, /高清全文阅读地图/)
  assert.doesNotMatch(md.render('首页无文章标题'), /PageGuide/)
})
test('verification dates preserve the actual date across YAML Date and serialized frontmatter', () => {
  assert.equal(verifiedDate(new Date('2026-09-20T00:00:00.000Z')), '2026-09-20')
  assert.equal(verifiedDate('2026-09-20T00:00:00.000Z'), '2026-09-20')
  assert.equal(verifiedDate(undefined), '')
  assert.equal(verifiedDate('unverified'), '')
})

test('real site config exposes every hub and keeps inference articles inside their clickable parent', async () => {
  const config = await resolveConfig('docs', 'build')
  const { sidebar, nav } = config.site.themeConfig
  const nodes = [...Object.values(sidebar).flat(), ...nav]
  const pages = readdirSync('docs', {recursive:true}).filter(p=>p.endsWith('.md') && !p.startsWith('.vitepress') && p !== 'index.md')
  for (const page of pages) {
    const path = `/${pageKey(page)}`
    const source = readFileSync(`docs/${page}`, 'utf8')
    const redirect = source.match(/^redirect:\s*(\S+)/m)?.[1]
    if (redirect) {
      assert.ok(findNode(nodes, redirect.split('#')[0]), `Missing redirect destination: ${page}`)
      continue
    }
    assert.ok(findNode(nodes,path), `Missing navigation: ${page}`)
    // Standalone galleries are navigable pages, not article-directory hubs.
    const standalone = /^layout: page$/m.test(source)
    if (page.endsWith('index.md') && !standalone) assert.ok(overviewChildren(sidebar,path).length, `Empty hub: ${page}`)
  }
  const inference = findNode(nodes,'/ai/infra/inference/')
  assert.ok(inference.items.some(item=>item.link === '/ai/infra/inference/gpu-sizing'))
  assert.equal(findNode(nodes,'/ai/infra/').text,'AI 基础设施')
})
