import test from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { createMarkdownRenderer, resolveConfig } from 'vitepress'
import { groupSearchResults, canonicalPath, highlightParts } from '../docs/.vitepress/theme/search.mjs'
import { overviewChildren, findNode, taskPaths, topicPaths, shortHeading, breadcrumbTrail, sectionPager } from '../docs/.vitepress/theme/knowledge.mjs'
import { getReadingGuide, pageKey, learningPaths, historyConnections, verifiedDate } from '../docs/.vitepress/reading-guides.mjs'
import { directoryMarkdown, softwarePager } from '../docs/.vitepress/directory-markdown.mjs'
import { softwareSidebar } from '../docs/.vitepress/software-sidebar.mjs'
import { knowledgeSidebar } from '../docs/.vitepress/site-navigation.mjs'
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
test('articles render directly without injected guides and retain technical content', async () => {
  const md = await createMarkdownRenderer(process.cwd(), {config: directoryMarkdown})
  const output = md.render('# 标题\n\n![架构图](/images/test.png)\n\n> 保留引语\n\n## 原理\n\n正文')
  assert.doesNotMatch(output, /PageGuide|阅读指南|建议阅读顺序/)
  assert.match(output, /<img src="\/images\/test.png"/)
  assert.match(output, /保留引语/)
  assert.match(output, /<h2 id="原理"/)
})
test('software catalogs expose every article exactly once with the same order as the sidebar', async () => {
  const md = await createMarkdownRenderer(process.cwd(), {config: directoryMarkdown})
  const groups = softwareSidebar.filter(item => item.items)
  const expected = readdirSync('docs/software', {recursive:true}).filter(p=>p.endsWith('.md') && !p.endsWith('index.md')).map(p=>`/software/${p.slice(0,-3)}`).sort()
  const entries = groups.flatMap(group=>group.items)
  assert.deepEqual(entries.map(item=>item.link).sort(), expected)
  assert.equal(new Set(entries.map(item=>item.link)).size, entries.length)
  const overview = md.render(readFileSync('docs/software/index.md', 'utf8'))
  for (const group of groups) {
    assert.ok(!group.items.some(item=>item.link === group.link), `Duplicate self-link: ${group.link}`)
    const source = readFileSync(`docs${group.link}index.md`, 'utf8')
    assert.doesNotMatch(source, /导读|阅读顺序|怎样开始/)
    const output = md.render(source)
    let previousPosition = -1
    for (const item of group.items) {
      const href = `href="${item.link}.html"`
      assert.equal(overview.split(href).length - 1, 1, `Overview: ${item.link}`)
      assert.equal(output.split(href).length - 1, 1, `Directory: ${item.link}`)
      const position = output.indexOf(href)
      assert.ok(position > previousPosition)
      previousPosition = position
    }
  }
})
test('software article paging stays inside the article directory', () => {
  for (const group of softwareSidebar.filter(item=>item.items)) {
    assert.deepEqual(softwarePager(group.link), {prev:false,next:false})
    assert.equal(softwarePager(group.items[0].link).prev, false)
    assert.equal(softwarePager(group.items.at(-1).link).next, false)
    for (let i=1;i<group.items.length;i++) {
      assert.equal(softwarePager(group.items[i].link).prev.link, group.items[i-1].link)
      assert.equal(softwarePager(group.items[i-1].link).next.link, group.items[i].link)
    }
  }
  assert.deepEqual(softwarePager('/cloud/infra/compute'), {})
})
test('verification dates preserve the actual date across YAML Date and serialized frontmatter', () => {
  assert.equal(verifiedDate(new Date('2026-09-20T00:00:00.000Z')), '2026-09-20')
  assert.equal(verifiedDate('2026-09-20T00:00:00.000Z'), '2026-09-20')
  assert.equal(verifiedDate(undefined), '')
  assert.equal(verifiedDate('unverified'), '')
})

test('one global sidebar contains every knowledge area and no duplicate destinations', async () => {
  const config = await resolveConfig('docs', 'build')
  const { sidebar, nav } = config.site.themeConfig
  assert.ok(Array.isArray(sidebar))
  assert.deepEqual(sidebar, knowledgeSidebar)
  assert.deepEqual(nav, [
    { text: '首页', link: '/' },
    { text: '云计算', link: '/cloud/' },
    { text: '人工智能', link: '/ai/' },
    { text: '软件开发', link: '/software/' },
    { text: '游戏行业', link: '/gaming/' },
    { text: '鹈鹕测试', link: '/playground/pelican/' },
  ])
  assert.deepEqual(sidebar.filter(item=>item.items).map(item=>item.link), ['/cloud/','/ai/','/software/','/gaming/','/chronicle/'])
  const links = []
  function visit(items) {
    for (const item of items) {
      if (item.link) links.push(item.link)
      if (item.items) visit(item.items)
    }
  }
  visit(sidebar)
  assert.equal(new Set(links).size, links.length)
  assert.ok(overviewChildren(sidebar, '/cloud/').length === 5)
  assert.ok(overviewChildren(sidebar, '/software/').length === 9)
  assert.doesNotMatch(readFileSync('docs/index.md','utf8'), /^sidebar: false$|^layout: home$/m)
  assert.equal(findNode(sidebar, '/playground/pelican/'), undefined)
  assert.match(readFileSync('docs/playground/pelican/index.md','utf8'), /^sidebar: false$/m)
})

test('breadcrumbs retain the full directory hierarchy without top navigation, including deployment base', () => {
  const path = '/cloud-ai-knowledge-base/ai/infra/inference/gpu-sizing.html'
  const trail = breadcrumbTrail(knowledgeSidebar, path, 'GPU 选型', '/cloud-ai-knowledge-base/')
  assert.deepEqual(trail.map(item=>item.link), ['/', '/ai/', '/ai/infra/', '/ai/infra/inference/', '/ai/infra/inference/gpu-sizing'])
  assert.equal(trail[1].text, '人工智能')
  assert.deepEqual(breadcrumbTrail(knowledgeSidebar, '/software/backend/http-api-contracts', '').map(item=>item.link), ['/', '/software/', '/software/backend/', '/software/backend/http-api-contracts'])
  assert.deepEqual(breadcrumbTrail(knowledgeSidebar, '/software/', '').map(item=>item.text), ['首页','软件研发'])
  assert.deepEqual(breadcrumbTrail(knowledgeSidebar, '/about', '').map(item=>item.text), ['首页','关于'])
  assert.deepEqual(breadcrumbTrail(knowledgeSidebar, '/', ''), [])
})

test('global sidebar does not introduce article paging across unrelated areas', () => {
  assert.equal(sectionPager(knowledgeSidebar, '/cloud/architecture/migration').next, false)
  assert.equal(sectionPager(knowledgeSidebar, '/ai/operations/risk-supplier').next, false)
  assert.equal(sectionPager(knowledgeSidebar, '/ai/').prev, false)
  assert.deepEqual(sectionPager(knowledgeSidebar, '/about'), {prev:false,next:false})
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
