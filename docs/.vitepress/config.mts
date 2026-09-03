import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

// GitHub Pages 项目站点部署时需要设置仓库名作为 base。
// 本地开发默认 '/'；CI 构建时通过环境变量注入，例如 /cloud-ai-knowledge-base/
const base = (process.env.VITEPRESS_BASE || '/').replace(/([^/])$/, '$1/')

export default withMermaid(
  defineConfig({
    title: '云与 AI 知识体系',
    description:
      '一名云解决方案架构师的十年沉淀：从云计算基座、全栈云产品到模型架构、AI Infra 与 Agentic 的完整知识体系。',
    lang: 'zh-CN',
    base,
    cleanUrls: true,
    lastUpdated: true,
    ignoreDeadLinks: false,

    head: [
      ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}favicon.svg` }],
      ['meta', { name: 'theme-color', content: '#0f6fff' }],
      ['meta', { property: 'og:type', content: 'website' }],
      ['meta', { property: 'og:title', content: '云与 AI 知识体系' }],
      [
        'meta',
        {
          property: 'og:description',
          content: '从 OpenStack 到大模型：一名云解决方案架构师的完整知识体系',
        },
      ],
    ],

    markdown: {
      lineNumbers: false,
      theme: { light: 'github-light', dark: 'github-dark' },
    },

    // Mermaid：htmlLabels 渲染中文多行标签时行高测量不准导致文字裁切，
    // 改用 SVG 原生 <text> 渲染（tspan 换行），测量与渲染同源不再裁切
    mermaid: {
      flowchart: { htmlLabels: false },
      sequence: { htmlLabels: false },
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
          ],
        },
        {
          text: '人工智能',
          items: [
            { text: 'AI 全景', link: '/ai/' },
            { text: '模型架构演进', link: '/ai/models/' },
            { text: 'AI Infra', link: '/ai/infra/' },
            { text: '大模型应用', link: '/ai/application/' },
          ],
        },
        { text: 'Agentic', link: '/agentic/' },
        { text: '方法论', link: '/methodology/' },
        { text: '行业场景', link: '/industry/gaming' },
        { text: '编年史', link: '/chronicle/' },
        { text: '关于', link: '/about' },
      ],

      sidebar: {
        '/cloud/': [
          { text: '云计算全景', link: '/cloud/' },
          {
            text: '云计算基座',
            items: [
              { text: '导读：基座知识框架', link: '/cloud/foundation/' },
              { text: 'OpenStack 架构与十年演进', link: '/cloud/foundation/openstack' },
              { text: '虚拟化与 KVM', link: '/cloud/foundation/virtualization' },
              { text: 'SDN / NFV', link: '/cloud/foundation/sdn-nfv' },
            ],
          },
          {
            text: '计算 · 存储 · 网络',
            items: [
              { text: '导读：三大件知识框架', link: '/cloud/infra/' },
              { text: '弹性计算', link: '/cloud/infra/compute' },
              { text: '云存储', link: '/cloud/infra/storage' },
              { text: '云网络', link: '/cloud/infra/network' },
            ],
          },
          {
            text: '数据库 · 大数据',
            items: [
              { text: '导读：数据层知识框架', link: '/cloud/data/' },
              { text: '数据库选型', link: '/cloud/data/database' },
              { text: '大数据体系', link: '/cloud/data/bigdata' },
            ],
          },
          {
            text: '云原生',
            items: [
              { text: '导读：云原生知识框架', link: '/cloud/native/' },
              { text: 'Kubernetes 核心机制与企业级落地', link: '/cloud/native/kubernetes' },
              { text: '微服务治理', link: '/cloud/native/microservice' },
              { text: '可观测体系', link: '/cloud/native/observability' },
            ],
          },
        ],
        '/ai/': [
          { text: 'AI 全景', link: '/ai/' },
          {
            text: '模型架构演进',
            items: [
              { text: '演进总览', link: '/ai/models/' },
              { text: '机器学习与深度学习经典', link: '/ai/models/ml-dl' },
              { text: '大语言模型架构解析', link: '/ai/models/llm' },
              { text: '视觉理解', link: '/ai/models/vision' },
              { text: '图像生成', link: '/ai/models/image-gen' },
              { text: '视频生成', link: '/ai/models/video-gen' },
              { text: '语音识别与理解', link: '/ai/models/audio' },
            ],
          },
          {
            text: 'AI Infra',
            items: [
              { text: 'Infra 总览', link: '/ai/infra/' },
              { text: 'GPU 集群与高速网络', link: '/ai/infra/cluster' },
              { text: '训练工程', link: '/ai/infra/training' },
              { text: '推理与算力总览', link: '/ai/infra/inference/' },
              { text: '大模型推理部署实战', link: '/ai/infra/inference/llm-inference' },
              { text: 'GPU 选型与推理成本测算', link: '/ai/infra/inference/gpu-sizing' },
            ],
          },
          {
            text: '大模型应用',
            items: [
              { text: '应用总览', link: '/ai/application/' },
              { text: '企业级 RAG 架构设计', link: '/ai/application/rag-architecture' },
              { text: '多模态应用', link: '/ai/application/multimodal' },
            ],
          },
        ],
        '/agentic/': [
          {
            text: 'Agentic',
            items: [
              { text: '智能体技术全景', link: '/agentic/' },
              { text: 'Agent 热点编年史', link: '/agentic/history' },
              { text: 'Agent 开发框架对比', link: '/agentic/frameworks' },
            ],
          },
        ],
        '/methodology/': [
          {
            text: '解决方案方法论',
            items: [
              { text: '导读：SA 能力地图', link: '/methodology/' },
              { text: '解决方案架构设计方法论', link: '/methodology/architecture-design' },
              { text: '上云迁移方法论（6R）', link: '/methodology/cloud-migration' },
              { text: '高可用与容灾设计', link: '/methodology/ha-dr' },
            ],
          },
        ],
        '/industry/': [
          {
            text: '行业场景',
            items: [
              { text: '游戏行业：云技术地图', link: '/industry/gaming' },
            ],
          },
        ],
        '/chronicle/': [
          {
            text: '技术编年史',
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
        { icon: 'github', link: 'https://github.com/shuifans/cloud-ai-knowledge-base' },
      ],

      editLink: {
        pattern: 'https://github.com/shuifans/cloud-ai-knowledge-base/edit/main/docs/:path',
        text: '在 GitHub 上编辑此页',
      },

      lastUpdated: { text: '最后更新于' },

      outline: { level: [2, 3], label: '本页目录' },

      docFooter: { prev: '上一篇', next: '下一篇' },

      footer: {
        message: '内容基于公开技术资料与脱敏后的实践总结',
        copyright: 'CC BY-NC-SA 4.0',
      },

      darkModeSwitchLabel: '外观',
      lightModeSwitchTitle: '切换到浅色模式',
      darkModeSwitchTitle: '切换到深色模式',
      sidebarMenuLabel: '菜单',
      returnToTopLabel: '返回顶部',
    },

    mermaid: {
      theme: 'base',
      themeVariables: {
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
      },
    },
  })
)
