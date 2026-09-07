<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, withBase } from 'vitepress'

interface Crumb {
  text: string
  link?: string
}

interface Section {
  text: string
  link: string
  items: Array<{ text: string; link: string }>
}

const route = useRoute()

const sections: Section[] = [
  {
    text: '云计算',
    link: '/cloud/',
    items: [
      { text: '云计算全景', link: '/cloud/' },
      { text: '导读：基座知识框架', link: '/cloud/foundation/' },
      { text: 'OpenStack 架构与十年演进', link: '/cloud/foundation/openstack' },
      { text: '虚拟化与 KVM', link: '/cloud/foundation/virtualization' },
      { text: 'SDN / NFV', link: '/cloud/foundation/sdn-nfv' },
      { text: '导读：三大件知识框架', link: '/cloud/infra/' },
      { text: '弹性计算', link: '/cloud/infra/compute' },
      { text: '云存储', link: '/cloud/infra/storage' },
      { text: '云网络', link: '/cloud/infra/network' },
      { text: '导读：数据层知识框架', link: '/cloud/data/' },
      { text: '数据库选型', link: '/cloud/data/database' },
      { text: 'OLAP 引擎：谱系机制拆解与选型', link: '/cloud/data/olap' },
      { text: '大数据体系', link: '/cloud/data/bigdata' },
      { text: '导读：云原生知识框架', link: '/cloud/native/' },
      { text: 'Kubernetes 核心机制与企业级落地', link: '/cloud/native/kubernetes' },
      { text: '微服务治理', link: '/cloud/native/microservice' },
      { text: '可观测体系', link: '/cloud/native/observability' },
    ],
  },
  {
    text: '人工智能',
    link: '/ai/',
    items: [
      { text: 'AI 全景', link: '/ai/' },
      { text: '演进总览', link: '/ai/models/' },
      { text: '机器学习与深度学习经典', link: '/ai/models/ml-dl' },
      { text: '大语言模型架构解析', link: '/ai/models/llm' },
      { text: '视觉理解', link: '/ai/models/vision' },
      { text: '图像生成', link: '/ai/models/image-gen' },
      { text: '视频生成', link: '/ai/models/video-gen' },
      { text: '语音生成', link: '/ai/models/speech-gen' },
      { text: '语音识别与理解', link: '/ai/models/audio' },
      { text: 'Infra 总览', link: '/ai/infra/' },
      { text: 'GPU 集群与高速网络', link: '/ai/infra/cluster' },
      { text: '训练工程', link: '/ai/infra/training' },
      { text: '推理与算力总览', link: '/ai/infra/inference/' },
      { text: '大模型推理部署实战', link: '/ai/infra/inference/llm-inference' },
      { text: 'GPU 选型与推理成本测算', link: '/ai/infra/inference/gpu-sizing' },
      { text: 'Token 经济学：定价与成本', link: '/ai/infra/inference/token-economics' },
      { text: '应用总览', link: '/ai/application/' },
      { text: '企业级 RAG 架构设计', link: '/ai/application/rag-architecture' },
      { text: '多模态应用', link: '/ai/application/multimodal' },
      { text: '大模型评测', link: '/ai/application/evaluation' },
      { text: '智能体技术全景', link: '/ai/agent/' },
      { text: 'Agent 热点编年史', link: '/ai/agent/history' },
      { text: 'Agent 开发框架对比', link: '/ai/agent/frameworks' },
    ],
  },
  {
    text: '技术编年史',
    link: '/chronicle/',
    items: [
      { text: '十年六浪：总纲', link: '/chronicle/' },
      { text: '移动互联网时代', link: '/chronicle/mobile-internet' },
      { text: '直播时代', link: '/chronicle/livestream' },
      { text: '短视频时代', link: '/chronicle/short-video' },
      { text: '区块链时代', link: '/chronicle/blockchain' },
      { text: '元宇宙时代', link: '/chronicle/metaverse' },
      { text: 'AI 大模型时代', link: '/chronicle/ai-era' },
      { text: '暗流：信创与国产化', link: '/chronicle/xinchuang' },
    ],
  },
]

function normalizePath(path: string) {
  const normalized = path.replace(/index\.html?$/, '').replace(/\/$/, '')
  return normalized || '/'
}

function pathsMatch(first: string, second: string) {
  return normalizePath(first) === normalizePath(second)
}

const crumbs = computed<Crumb[]>(() => {
  const path = normalizePath(route.path)
  if (path === '/') return []

  const section = sections.find(({ link }) => {
    const sectionPath = normalizePath(link)
    return path === sectionPath || path.startsWith(`${sectionPath}/`)
  })

  if (!section) return [{ text: '首页', link: '/' }, { text: '关于' }]

  const page = section.items.find((item) => pathsMatch(item.link, path))
  const result: Crumb[] = [{ text: '首页', link: '/' }, { text: section.text, link: section.link }]

  if (page && page.text !== section.text) {
    result.push({ text: page.text })
  }

  return result
})
</script>

<template>
  <nav v-if="crumbs.length" class="knowledge-breadcrumb" aria-label="面包屑导航">
    <ol>
      <li v-for="(crumb, index) in crumbs" :key="crumb.text" class="knowledge-breadcrumb-item">
        <svg v-if="index > 0" aria-hidden="true" viewBox="0 0 16 16">
          <path d="m6 3 5 5-5 5" />
        </svg>
        <a v-if="crumb.link && index !== crumbs.length - 1" :href="withBase(crumb.link)">{{ crumb.text }}</a>
        <span v-else aria-current="page">{{ crumb.text }}</span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.knowledge-breadcrumb {
  margin-bottom: 24px;
  font-size: 13px;
  line-height: 20px;
  color: var(--vp-c-text-2);
}

ol,
.knowledge-breadcrumb-item {
  display: flex;
  align-items: center;
}

ol {
  flex-wrap: wrap;
  gap: 4px;
}

.knowledge-breadcrumb-item {
  min-width: 0;
  gap: 4px;
}

svg {
  width: 14px;
  height: 14px;
  flex: 0 0 auto;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.5;
}

a {
  color: inherit;
  text-decoration: none;
}

a:hover {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-underline-offset: 3px;
}

span[aria-current='page'] {
  overflow: hidden;
  max-width: min(48vw, 360px);
  color: var(--vp-c-text-1);
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
