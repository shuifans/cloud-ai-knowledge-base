export function normalizePath(path) {
  return path.split('#')[0].replace(/index\.html?$/, '').replace(/\.html$/, '').replace(/\/+$/, '') || '/'
}

export function findNode(items, path) {
  for (const item of items) {
    if (item.link && normalizePath(item.link) === normalizePath(path)) return item
    const child = item.items && findNode(item.items, path)
    if (child) return child
  }
}

export function overviewChildren(sidebar, path) {
  const prefix = Object.keys(sidebar).filter(p => `${normalizePath(path)}/`.startsWith(p)).sort((a,b)=>b.length-a.length)[0]
  const items = sidebar[prefix] || []
  const node = findNode(items, path)
  const children = node?.items || (normalizePath(path) === normalizePath(prefix || '') ? items : [])
  return children.flatMap(item => item.link ? [item] : (item.items || [])).filter(item => item.link && normalizePath(item.link) !== normalizePath(path))
}

export function shortHeading(title) {
  const clean = title.replace(/^(?:[一二三四五六七八九十]+[、．.]\s*|\d+(?:\.\d+)*[、．.\s]+)+/, '').trim()
  const colon = clean.search(/[：:]/)
  // Keep short, meaningful names; the full heading remains in title and aria-label.
  return colon >= 4 && colon < 24 ? clean.slice(0, colon) : clean
}

export const taskPaths = [
  { title: '搭建企业知识库', question: '让回答有依据，质量可评测。', links: [['RAG 架构', '/ai/application/rag-architecture'], ['质量评测', '/ai/application/evaluation']] },
  { title: '部署一个大模型', question: '从服务框架走到容量规划。', links: [['部署实战', '/ai/infra/inference/llm-inference'], ['GPU 选型', '/ai/infra/inference/gpu-sizing']] },
  { title: '估算与治理成本', question: '看清 token、算力与云账单。', links: [['Token 成本', '/ai/infra/inference/token-economics'], ['云成本治理', '/cloud/architecture/finops']] },
  { title: '设计可靠云架构', question: '把安全、故障与变更纳入设计。', links: [['架构评审', '/cloud/architecture/well-architected'], ['可靠性与灾备', '/cloud/architecture/reliability-dr']] },
]

export const topicPaths = [
  { title: '安全与权限', links: [['身份治理', '/cloud/architecture/security-governance'], ['智能体治理', '/ai/agent/']] },
  { title: '质量与观测', links: [['大模型评测', '/ai/application/evaluation'], ['可观测体系', '/cloud/native/observability']] },
  { title: '数据与检索', links: [['数据库选型', '/cloud/data/database'], ['RAG 检索链路', '/ai/application/rag-architecture']] },
]
