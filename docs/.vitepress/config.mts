import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

// GitHub Pages 项目站点部署时需要设置仓库名作为 base。
// 本地开发默认 '/'；CI 构建时通过环境变量注入，例如 /cloud-ai-knowledge-base/
const base = (process.env.VITEPRESS_BASE || '/').replace(/([^/])$/, '$1/')

export default withMermaid(
  defineConfig({
    title: '云与 AI 知识体系',
    description:
      '一名云解决方案架构师的十年沉淀：从 OpenStack 云计算基座、全栈云产品到云原生与大模型应用的系统性知识体系。',
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
          content: '从 OpenStack 到大模型：一名云解决方案架构师的十年知识沉淀',
        },
      ],
    ],

    markdown: {
      lineNumbers: false,
      theme: { light: 'github-light', dark: 'github-dark' },
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
        { text: '云计算基座', link: '/foundation/' },
        { text: '计算·存储·网络', link: '/csn/' },
        { text: '数据', link: '/data/' },
        { text: '云原生', link: '/cloud-native/' },
        { text: 'AI 与大模型', link: '/ai/' },
        { text: '方法论', link: '/methodology/' },
        { text: '编年史', link: '/chronicle/' },
        { text: '关于', link: '/about' },
      ],

      sidebar: {
        '/foundation/': [
          {
            text: '01 · 云计算基座',
            items: [
              { text: '导读：基座知识框架', link: '/foundation/' },
              { text: 'OpenStack 架构与十年演进', link: '/foundation/openstack' },
              { text: '虚拟化与 KVM（提纲）', link: '/foundation/virtualization' },
              { text: 'SDN / NFV（提纲）', link: '/foundation/sdn-nfv' },
            ],
          },
        ],
        '/csn/': [
          {
            text: '02 · 计算 · 存储 · 网络',
            items: [
              { text: '导读：三大件知识框架', link: '/csn/' },
              { text: '弹性计算（提纲）', link: '/csn/compute' },
              { text: '云存储（提纲）', link: '/csn/storage' },
              { text: '云网络（提纲）', link: '/csn/network' },
            ],
          },
        ],
        '/data/': [
          {
            text: '03 · 数据库 · 大数据',
            items: [
              { text: '导读：数据层知识框架', link: '/data/' },
              { text: '数据库选型（提纲）', link: '/data/database' },
              { text: '大数据体系（提纲）', link: '/data/bigdata' },
            ],
          },
        ],
        '/cloud-native/': [
          {
            text: '04 · 云原生',
            items: [
              { text: '导读：云原生知识框架', link: '/cloud-native/' },
              { text: 'Kubernetes 核心机制与企业级落地', link: '/cloud-native/kubernetes' },
              { text: '微服务治理（提纲）', link: '/cloud-native/microservice' },
              { text: '可观测体系（提纲）', link: '/cloud-native/observability' },
            ],
          },
        ],
        '/ai/': [
          {
            text: '05 · AI 与大模型',
            items: [
              { text: '导读：AI 技术栈全景', link: '/ai/' },
              { text: '大模型推理部署实战', link: '/ai/llm-inference' },
              { text: 'GPU 选型与推理成本测算', link: '/ai/gpu-sizing' },
              { text: '企业级 RAG 架构设计', link: '/ai/rag-architecture' },
              { text: 'Agent 与 MCP（提纲）', link: '/ai/agent' },
            ],
          },
        ],
        '/methodology/': [
          {
            text: '06 · 解决方案方法论',
            items: [
              { text: '导读：SA 能力地图', link: '/methodology/' },
              { text: '解决方案架构设计方法论', link: '/methodology/architecture-design' },
              { text: '上云迁移方法论（6R）', link: '/methodology/cloud-migration' },
              { text: '高可用与容灾设计（提纲）', link: '/methodology/ha-dr' },
            ],
          },
        ],
        '/chronicle/': [
          {
            text: '07 · 技术编年史',
            items: [
              { text: '十年六浪：总纲', link: '/chronicle/' },
              { text: '移动互联网时代（提纲）', link: '/chronicle/mobile-internet' },
              { text: '直播时代（提纲）', link: '/chronicle/livestream' },
              { text: '短视频时代（提纲）', link: '/chronicle/short-video' },
              { text: '区块链时代（提纲）', link: '/chronicle/blockchain' },
              { text: '元宇宙时代（提纲）', link: '/chronicle/metaverse' },
              { text: 'AI 大模型时代（提纲）', link: '/chronicle/ai-era' },
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
