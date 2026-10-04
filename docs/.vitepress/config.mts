import { defineConfig } from 'vitepress'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { pageKey, verifiedDate } from './reading-guides.mjs'
import { knowledgeSidebar } from './site-navigation.mjs'
import { sectionPager } from './theme/knowledge.mjs'
import { directoryMarkdown, softwarePager } from './directory-markdown.mjs'

const require = createRequire(import.meta.url)
const component = (name: string) => fileURLToPath(new URL(`./theme/components/${name}.vue`, import.meta.url))
const miniSearchEntry = require.resolve('minisearch', { paths: [require.resolve('vitepress/package.json')] })

// GitHub Pages 项目站点部署时需要设置仓库名作为 base。
// 本地开发默认 '/'；CI 构建时通过环境变量注入，例如 /cloud-ai-knowledge-base/
const base = (process.env.VITEPRESS_BASE || '/').replace(/([^/])$/, '$1/')

export default defineConfig({
  title: '云与 AI 知识体系',
  description:
    '从云计算与人工智能，到软件研发、工程实践与技术演进的系统化中文知识库。',
  lang: 'zh-CN',
  appearance: true,
  base,
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: false,

  transformPageData(pageData) {
    const path = `/${pageKey(pageData.relativePath)}`
    Object.assign(pageData.frontmatter, sectionPager(knowledgeSidebar, path), softwarePager(path))
    if (pageData.frontmatter.directory) {
      pageData.frontmatter.outline = false
      pageData.frontmatter.aside = false
    }
    pageData.frontmatter.lastVerified = verifiedDate(pageData.frontmatter.lastVerified)
    pageData.frontmatter.lastReviewed = verifiedDate(pageData.frontmatter.lastReviewed)
  },

  vite: {
    resolve: {
      alias: [
        { find: /^\.\/components\/VPLocalNav\.vue$/, replacement: component('ReadingControls') },
        { find: /^\.\/VPDocAsideOutline\.vue$/, replacement: component('KnowledgeAside') },
        { find: /^\.\/VPSidebarGroup\.vue$/, replacement: component('KnowledgeTree') },
        { find: /^\.\/VPDocOutlineItem\.vue$/, replacement: component('KnowledgeOutline') },
        { find: /^\.\/VPLocalSearchBox\.vue$/, replacement: component('KnowledgeSearch') },
        { find: /^\.\/VPNavBarHamburger\.vue$/, replacement: component('KnowledgeMenuButton') },
        // Use the exact MiniSearch version that wrote VitePress's local index.
        { find: /^minisearch$/, replacement: miniSearchEntry.replace('/cjs/index.cjs', '/es/index.js') },
      ],
    },
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}favicon.svg?v=pelican` }],
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: '云与 AI 知识体系' }],
    [
      'meta',
      {
        property: 'og:description',
        content: '云计算、人工智能与软件研发：可检索、可核验、持续更新的技术知识体系',
      },
    ],
  ],

  markdown: {
    lineNumbers: false,
    theme: { light: 'github-light', dark: 'github-dark' },
    config(markdown) {
      directoryMarkdown(markdown)
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
    logo: { light: '/logo.svg?v=pelican', dark: '/logo-dark.svg?v=pelican', alt: '鹈鹕' },
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
      { text: '首页', link: '/' },
      { text: '云计算', link: '/cloud/' },
      { text: '人工智能', link: '/ai/' },
      { text: '软件开发', link: '/software/' },
      { text: '鹈鹕测试', link: '/playground/pelican/' },
    ],

    sidebar: knowledgeSidebar,

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
