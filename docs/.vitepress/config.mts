import { defineConfig } from 'vitepress'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { getReadingGuide, pageKey, verifiedDate } from './reading-guides.mjs'
import { readingMarkdown } from './reading-markdown.mjs'

const require = createRequire(import.meta.url)
const component = (name: string) => fileURLToPath(new URL(`./theme/components/${name}.vue`, import.meta.url))
const miniSearchEntry = require.resolve('minisearch', { paths: [require.resolve('vitepress/package.json')] })

// GitHub Pages 项目站点部署时需要设置仓库名作为 base。
// 本地开发默认 '/'；CI 构建时通过环境变量注入，例如 /cloud-ai-knowledge-base/
const base = (process.env.VITEPRESS_BASE || '/').replace(/([^/])$/, '$1/')

export default defineConfig({
  title: '云与 AI 知识体系',
  description:
    '从云计算基座与云原生，到模型架构、AI Infra、应用工程与 Agent 的系统化技术知识库。',
  lang: 'zh-CN',
  appearance: true,
  base,
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: false,

  transformPageData(pageData) {
    pageData.frontmatter.readingGuide = getReadingGuide(pageKey(pageData.relativePath))
    pageData.frontmatter.lastVerified = verifiedDate(pageData.frontmatter.lastVerified)
    pageData.frontmatter.lastReviewed = verifiedDate(pageData.frontmatter.lastReviewed)
  },

  vite: {
    resolve: {
      alias: [
        { find: /^\.\/VPDocOutlineItem\.vue$/, replacement: component('KnowledgeOutline') },
        { find: /^\.\/VPLocalSearchBox\.vue$/, replacement: component('KnowledgeSearch') },
        { find: /^\.\/VPNavBarHamburger\.vue$/, replacement: component('KnowledgeMenuButton') },
        // Use the exact MiniSearch version that wrote VitePress's local index.
        { find: /^minisearch$/, replacement: miniSearchEntry.replace('/cjs/index.cjs', '/es/index.js') },
      ],
    },
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}favicon.svg` }],
    ['meta', { name: 'theme-color', content: '#f1f3eb' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: '云与 AI 知识体系' }],
    [
      'meta',
      {
        property: 'og:description',
        content: '从 OpenStack 到大模型：可检索、可核验、持续更新的云与 AI 知识体系',
      },
    ],
  ],

  markdown: {
    lineNumbers: false,
    theme: { light: 'github-light', dark: 'github-dark' },
    config(markdown) {
      readingMarkdown(markdown)
      const defaultFence = markdown.renderer.rules.fence?.bind(markdown.renderer.rules)
      if (!defaultFence) return

      markdown.renderer.rules.fence = (...args) => {
        const [tokens, index] = args
        const token = tokens[index]
        if (token.info.trim() !== 'mermaid') return defaultFence(...args)

        return `<Mermaid id="mermaid-${index}" graph="${encodeURIComponent(token.content)}"></Mermaid>`
      }
    },
  },

  sitemap: {
    // 项目站点：hostname 需包含仓库路径并以 / 结尾，保证 URL 正确拼接
    hostname: 'https://shuifans.github.io/cloud-ai-knowledge-base/',
  },

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: '云与 AI 知识体系',

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索知识', buttonAriaLabel: '搜索知识' },
          modal: {
            displayDetails: '显示详细列表',
            resetButtonTitle: '清除查询条件',
            backButtonTitle: '关闭搜索框',
            noResultsText: '无法找到相关结果',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭',
            },
          },
        },
      },
    },

    nav: [
      {
        text: '云计算',
        items: [
          { text: '云计算全景', link: '/cloud/' },
          { text: '云计算基座', link: '/cloud/foundation/' },
          { text: '计算·存储·网络', link: '/cloud/infra/' },
          { text: '数据库·大数据', link: '/cloud/data/' },
          { text: '云原生', link: '/cloud/native/' },
          { text: '架构与治理', link: '/cloud/architecture/' },
        ],
      },
      {
        text: '人工智能',
        items: [
          { text: 'AI 全景', link: '/ai/' },
          { text: '模型与算法', link: '/ai/models/' },
          { text: 'AI 基础设施', link: '/ai/infra/' },
          { text: '应用与评测', link: '/ai/application/' },
          { text: '智能体（Agent）', link: '/ai/agent/' },
        ],
      },
      { text: '编年史', link: '/chronicle/' },
      { text: '更新记录', link: '/updates' },
      { text: '关于', link: '/about' },
    ],

    sidebar: {
      '/cloud/': [
        { text: '云计算全景', link: '/cloud/' },
        {
          text: '云计算基座',
          link: '/cloud/foundation/',
          collapsed: true,
          items: [
            { text: '导读：基座知识框架', link: '/cloud/foundation/' },
            {
              text: 'OpenStack 架构与十年演进',
              link: '/cloud/foundation/openstack',
            },
            { text: '虚拟化与 KVM', link: '/cloud/foundation/virtualization' },
            { text: 'SDN / NFV', link: '/cloud/foundation/sdn-nfv' },
          ],
        },
        {
          text: '计算 · 存储 · 网络',
          link: '/cloud/infra/',
          collapsed: true,
          items: [
            { text: '导读：三大件知识框架', link: '/cloud/infra/' },
            { text: '弹性计算', link: '/cloud/infra/compute' },
            { text: '云存储', link: '/cloud/infra/storage' },
            { text: '云网络', link: '/cloud/infra/network' },
          ],
        },
        {
          text: '数据库 · 大数据',
          link: '/cloud/data/',
          collapsed: true,
          items: [
            { text: '导读：数据层知识框架', link: '/cloud/data/' },
            { text: '数据库选型', link: '/cloud/data/database' },
            { text: 'OLAP 引擎：谱系机制拆解与选型', link: '/cloud/data/olap' },
            { text: '大数据体系', link: '/cloud/data/bigdata' },
          ],
        },
        {
          text: '云原生',
          link: '/cloud/native/',
          collapsed: true,
          items: [
            { text: '导读：云原生知识框架', link: '/cloud/native/' },
            {
              text: 'Kubernetes 核心机制与企业级落地',
              link: '/cloud/native/kubernetes',
            },
            { text: '微服务治理', link: '/cloud/native/microservice' },
            { text: '可观测体系', link: '/cloud/native/observability' },
          ],
        },
        {
          text: '架构与治理',
          link: '/cloud/architecture/',
          collapsed: true,
          items: [
            { text: '导读：架构与治理知识框架', link: '/cloud/architecture/' },
            {
              text: '卓越架构：从原则到持续评审',
              link: '/cloud/architecture/well-architected',
            },
            {
              text: '安全与身份治理',
              link: '/cloud/architecture/security-governance',
            },
            { text: '可靠性与灾备', link: '/cloud/architecture/reliability-dr' },
            { text: 'FinOps：云成本治理', link: '/cloud/architecture/finops' },
            { text: '云迁移与现代化', link: '/cloud/architecture/migration' },
          ],
        },
      ],
      '/ai/': [
        { text: 'AI 全景', link: '/ai/' },
        {
          text: '模型与算法',
          link: '/ai/models/',
          collapsed: true,
          items: [
            { text: '模型总览', link: '/ai/models/' },
            {
              text: '基础模型',
              items: [
                { text: '机器学习与深度学习经典', link: '/ai/models/ml-dl' },
                { text: '大语言模型架构解析', link: '/ai/models/llm' },
              ],
            },
            {
              text: '多模态理解',
              items: [
                { text: '视觉理解', link: '/ai/models/vision' },
                { text: '语音识别与理解', link: '/ai/models/audio' },
              ],
            },
            {
              text: '多模态生成',
              items: [
                { text: '图像生成', link: '/ai/models/image-gen' },
                { text: '视频生成', link: '/ai/models/video-gen' },
                { text: '语音生成', link: '/ai/models/speech-gen' },
              ],
            },
          ],
        },
        {
          text: 'AI 基础设施',
          link: '/ai/infra/',
          collapsed: true,
          items: [
            { text: '基础设施总览', link: '/ai/infra/' },
            { text: 'GPU 集群与高速网络', link: '/ai/infra/cluster' },
            { text: '训练工程', link: '/ai/infra/training' },
            {
              text: '推理与算力',
              link: '/ai/infra/inference/',
              collapsed: true,
              items: [
                { text: '推理与算力总览', link: '/ai/infra/inference/' },
                {
                  text: '大模型推理部署实战',
                  link: '/ai/infra/inference/llm-inference',
                },
                {
                  text: 'GPU 选型与推理成本测算',
                  link: '/ai/infra/inference/gpu-sizing',
                },
                {
                  text: 'Token 经济学：定价与成本',
                  link: '/ai/infra/inference/token-economics',
                },
              ],
            },
          ],
        },
        {
          text: '应用与评测',
          link: '/ai/application/',
          collapsed: true,
          items: [
            { text: '应用总览', link: '/ai/application/' },
            {
              text: '企业级 RAG 架构设计',
              link: '/ai/application/rag-architecture',
            },
            { text: '多模态应用', link: '/ai/application/multimodal' },
            { text: '大模型评测', link: '/ai/application/evaluation' },
          ],
        },
        {
          text: '智能体（Agent）',
          link: '/ai/agent/',
          collapsed: true,
          items: [
            { text: '智能体技术全景', link: '/ai/agent/' },
            { text: 'Agent 热点编年史', link: '/ai/agent/history' },
            { text: 'Agent 开发框架对比', link: '/ai/agent/frameworks' },
            { text: 'Agent 安全与可靠执行', link: '/ai/agent/security' },
          ],
        },
      ],
      '/chronicle/': [
        {
          text: '技术编年史',
          link: '/chronicle/',
          collapsed: true,
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
      ],
    },

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/shuifans/cloud-ai-knowledge-base',
      },
    ],

    editLink: {
      pattern: 'https://github.com/shuifans/cloud-ai-knowledge-base/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页',
    },

    lastUpdated: { text: '页面修订于' },

    outline: { level: [2, 3], label: '本页目录' },

    docFooter: { prev: '上一篇', next: '下一篇' },

    footer: {
      message: '内容优先依据官方文档、原始论文与项目仓库',
      copyright: 'CC BY-NC-SA 4.0',
    },

    darkModeSwitchLabel: '日夜模式',
    lightModeSwitchTitle: '切换到白天模式',
    darkModeSwitchTitle: '切换到夜间模式',
    sidebarMenuLabel: '知识目录',
    returnToTopLabel: '返回顶部',
  },
})
