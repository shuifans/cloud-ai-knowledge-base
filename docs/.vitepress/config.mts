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
    '从云计算与人工智能，到软件研发、工程实践与技术演进的系统化中文知识库。',
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
    ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}favicon.svg?v=pelican` }],
    ['meta', { name: 'theme-color', content: '#f1f3eb' }],
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
      {
        text: '软件研发',
        items: [
          { text: '软件研发与工程实践', link: '/software/' },
          { text: '认识 AI 编程与软件项目', link: '/software/guide/' },
          { text: '编程语言与程序设计', link: '/software/programming/' },
          { text: '软件设计与架构', link: '/software/architecture/' },
          { text: '测试与工程质量', link: '/software/quality/' },
          { text: 'AI 辅助研发与 Agent 工程', link: '/software/ai-assisted/' },
          { text: '术语与查询索引', link: '/software/reference/' },
        ],
      },
      { text: '鹈鹕测试', link: '/playground/pelican/' },
      { text: '编年史', link: '/chronicle/' },
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
      '/software/': [
        { text: '软件研发与工程实践', link: '/software/' },
        {
          text: '认识 AI 编程与软件项目', link: '/software/guide/', collapsed: true,
          items: [
            { text: '导览总览与阅读顺序', link: '/software/guide/' },
            { text: 'AI 编程：协作方式与人的责任', link: '/software/guide/ai-coding-responsibility' },
            { text: '从想法到需求与验收', link: '/software/guide/requirements-and-acceptance' },
            { text: '软件项目全景：从操作到交付', link: '/software/guide/software-project-overview' },
            { text: '文件、目录与代码仓库', link: '/software/guide/files-directories-repositories' },
            { text: '语言、框架、运行时与依赖', link: '/software/guide/languages-frameworks-dependencies' },
            { text: '在本地运行项目', link: '/software/guide/running-locally' },
            { text: '需求如何穿过界面、接口与数据库', link: '/software/guide/request-through-system' },
            { text: '给 AI 上下文与边界', link: '/software/guide/ai-context-boundaries' },
            { text: '看懂改动与保存版本', link: '/software/guide/changes-and-versions' },
            { text: '分支、PR、审查与合并', link: '/software/guide/branches-review-merge' },
            { text: '验证与验收成果', link: '/software/guide/verification-acceptance' },
            { text: '定位问题与修复', link: '/software/guide/diagnosis-repair' },
            { text: '配置、密钥、权限与数据', link: '/software/guide/configuration-secrets-data' },
            { text: '从本地到线上', link: '/software/guide/local-to-production' },
            { text: '安全发布、观察与回退', link: '/software/guide/release-observe-rollback' },
            { text: '接管、维护、扩展与停用', link: '/software/guide/maintenance-takeover' },
          ],
        },
        {
          text: '计算机与软件基础', link: '/software/foundations/', collapsed: true,
          items: [
            { text: '导读：计算机与软件基础', link: '/software/foundations/' },
            { text: '从源码到运行中的程序', link: '/software/foundations/source-to-runtime' },
            { text: '操作系统、进程线程与内存', link: '/software/foundations/operating-systems-processes-memory' },
            { text: '文件、路径与权限', link: '/software/foundations/files-paths-permissions' },
            { text: '终端、Shell 与命令行', link: '/software/foundations/terminal-shell' },
            { text: '网络地址、端口与连接', link: '/software/foundations/network-addresses-ports' },
            { text: '工程数学与度量基础', link: '/software/foundations/engineering-math-measurement' },
          ],
        },
        {
          text: '编程语言与程序设计', link: '/software/programming/', collapsed: true,
          items: [
            { text: '导读：编程语言与程序设计', link: '/software/programming/' },
            { text: '变量、类型与控制流', link: '/software/programming/types-control-flow' },
            { text: '函数、作用域与模块', link: '/software/programming/functions-modules' },
            { text: '抽象、接口与编程范式', link: '/software/programming/abstraction-paradigms' },
            { text: '错误、异常与资源管理', link: '/software/programming/errors-resource-management' },
            { text: '异步、并发同步与取消', link: '/software/programming/async-concurrency' },
            { text: '语言、运行时与工程选型', link: '/software/programming/languages-runtimes' },
          ],
        },
        {
          text: '数据结构与算法', link: '/software/algorithms/', collapsed: true,
          items: [
            { text: '导读：数据结构与算法', link: '/software/algorithms/' },
            { text: '常用数据结构的工程选择', link: '/software/algorithms/data-structures' },
            { text: '时间与空间复杂度', link: '/software/algorithms/complexity' },
            { text: '搜索、排序与字符串处理', link: '/software/algorithms/search-sort-strings' },
            { text: '树、图与依赖关系', link: '/software/algorithms/trees-graphs' },
            { text: '正确性、测量与算法优化', link: '/software/algorithms/correctness-optimization' },
          ],
        },
        {
          text: '开发环境与工具链', link: '/software/toolchain/', collapsed: true,
          items: [
            { text: '导读：开发环境与工具链', link: '/software/toolchain/' },
            { text: '工程目录与配置', link: '/software/toolchain/project-structure' },
            { text: 'IDE、调试与开发工具', link: '/software/toolchain/ide-debugging' },
            { text: '依赖、清单与锁文件', link: '/software/toolchain/dependencies-lockfiles' },
            { text: '开发环境、环境变量与配置注入', link: '/software/toolchain/environment-configuration' },
            { text: '构建工具链与制品', link: '/software/toolchain/build-artifacts' },
            { text: '可复现开发与团队约定', link: '/software/toolchain/reproducible-development' },
          ],
        },
        {
          text: '版本控制与协作', link: '/software/collaboration/', collapsed: true,
          items: [
            { text: '导读：版本控制与协作', link: '/software/collaboration/' },
            { text: 'Git 仓库模型', link: '/software/collaboration/git-repository-model' },
            { text: '提交、差异、历史与撤销', link: '/software/collaboration/commits-history-undo' },
            { text: '分支、合并与冲突策略', link: '/software/collaboration/branches-merges-conflicts' },
            { text: 'Pull Request 工作流', link: '/software/collaboration/pull-request-workflow' },
            { text: '代码审查与变更证据', link: '/software/collaboration/code-review-evidence' },
            { text: '标签、版本与配置基线', link: '/software/collaboration/tags-versions-baselines' },
          ],
        },
        {
          text: '需求、产品与项目管理', link: '/software/requirements/', collapsed: true,
          items: [
            { text: '导读：需求、产品与项目管理', link: '/software/requirements/' },
            { text: '问题与范围', link: '/software/requirements/problem-scope' },
            { text: '可验证的验收标准', link: '/software/requirements/acceptance-criteria' },
            { text: '需求分析、领域规则与追踪', link: '/software/requirements/requirements-analysis' },
            { text: '生命周期、迭代与过程选择', link: '/software/requirements/lifecycle-process' },
            { text: '估算、风险、成本与自建采购', link: '/software/requirements/estimation-risk-economics' },
            { text: '文档、沟通与责任分工', link: '/software/requirements/documentation-responsibility' },
          ],
        },
        {
          text: '软件设计与架构', link: '/software/architecture/', collapsed: true,
          items: [
            { text: '导读：软件设计与架构', link: '/software/architecture/' },
            { text: '模块边界、依赖与接口', link: '/software/architecture/modules-interfaces' },
            { text: '设计原则、模式与重构', link: '/software/architecture/principles-patterns' },
            { text: '建模与架构描述', link: '/software/architecture/architecture-modeling' },
            { text: '单体、模块化单体与服务', link: '/software/architecture/monolith-services' },
            { text: '分布式一致性与部分失败', link: '/software/architecture/distributed-failure' },
            { text: '事件、工作流与补偿', link: '/software/architecture/events-workflows' },
            { text: '架构决策与验证', link: '/software/architecture/architecture-decisions' },
          ],
        },
        {
          text: '前端与界面工程', link: '/software/frontend/', collapsed: true,
          items: [
            { text: '导读：前端与界面工程', link: '/software/frontend/' },
            { text: 'Web 标准与浏览器运行', link: '/software/frontend/web-browser' },
            { text: 'HTML、CSS 与响应式布局', link: '/software/frontend/html-css-responsive' },
            { text: 'JavaScript 交互与浏览器 API', link: '/software/frontend/javascript-browser-apis' },
            { text: '组件、状态、路由与表单', link: '/software/frontend/components-state-routing' },
            { text: '渲染方式与框架选型', link: '/software/frontend/rendering-frameworks' },
            { text: '交互、可访问性与国际化', link: '/software/frontend/accessibility-internationalization' },
            { text: '前端性能、兼容与观测', link: '/software/frontend/frontend-performance' },
          ],
        },
        {
          text: '后端与接口工程', link: '/software/backend/', collapsed: true,
          items: [
            { text: '导读：后端与接口工程', link: '/software/backend/' },
            { text: '服务与请求生命周期', link: '/software/backend/service-lifecycle' },
            { text: 'HTTP、API 与接口契约', link: '/software/backend/http-api-contracts' },
            { text: '业务逻辑、规则与状态机', link: '/software/backend/business-state-machines' },
            { text: '身份认证、会话与权限', link: '/software/backend/authentication-authorization' },
            { text: '消息、任务、调度与幂等', link: '/software/backend/messages-jobs-idempotency' },
            { text: '第三方集成与 Webhook', link: '/software/backend/integrations-webhooks' },
            { text: '后端框架、性能与资源管理', link: '/software/backend/backend-frameworks-performance' },
          ],
        },
        {
          text: '数据库与应用数据工程', link: '/software/data/', collapsed: true,
          items: [
            { text: '导读：数据库与应用数据工程', link: '/software/data/' },
            { text: '数据模型、关系与约束', link: '/software/data/data-models' },
            { text: 'SQL 查询与执行计划', link: '/software/data/sql-query-plans' },
            { text: '事务、并发与索引的应用选择', link: '/software/data/transactions-indexes' },
            { text: 'ORM、迁移与兼容', link: '/software/data/orm-migrations' },
            { text: '缓存、搜索与存储的应用边界', link: '/software/data/cache-search-storage' },
            { text: '导入、数据质量与恢复', link: '/software/data/data-quality-recovery' },
          ],
        },
        {
          text: '测试与工程质量', link: '/software/quality/', collapsed: true,
          items: [
            { text: '导读：测试与工程质量', link: '/software/quality/' },
            { text: '质量模型与验证策略', link: '/software/quality/quality-strategy' },
            { text: '单元、集成、契约与端到端测试', link: '/software/quality/test-levels' },
            { text: '测试用例、边界、状态与数据', link: '/software/quality/test-cases' },
            { text: '调试、日志与缺陷管理', link: '/software/quality/debugging-defects' },
            { text: '静态检查、类型与审查', link: '/software/quality/static-analysis' },
            { text: '性能、负载与可靠性测试', link: '/software/quality/performance-reliability-tests' },
            { text: '验收、回归与质量度量', link: '/software/quality/acceptance-regression' },
          ],
        },
        {
          text: '构建交付与部署', link: '/software/delivery/', collapsed: true,
          items: [
            { text: '导读：构建交付与部署', link: '/software/delivery/' },
            { text: '构建与 CI 流水线', link: '/software/delivery/build-ci' },
            { text: '环境、配置与基础设施即代码', link: '/software/delivery/environments-iac' },
            { text: '容器、镜像与打包', link: '/software/delivery/containers-images' },
            { text: '托管、部署与平台工程', link: '/software/delivery/hosting-platforms' },
            { text: '域名、DNS、HTTPS 与入口', link: '/software/delivery/dns-https' },
            { text: '发布、功能开关与回滚', link: '/software/delivery/release-rollback' },
          ],
        },
        {
          text: '运维可靠性与性能', link: '/software/operations/', collapsed: true,
          items: [
            { text: '导读：运维可靠性与性能', link: '/software/operations/' },
            { text: 'SLO、健康检查与值守', link: '/software/operations/slo-health-oncall' },
            { text: '应用指标、日志与追踪埋点', link: '/software/operations/application-observability' },
            { text: '故障响应、手册与复盘', link: '/software/operations/incident-response' },
            { text: '性能分析、容量、弹性与成本', link: '/software/operations/capacity-performance-cost' },
            { text: '恢复演练与数据对账', link: '/software/operations/recovery-reconciliation' },
          ],
        },
        {
          text: '安全、隐私与治理', link: '/software/security/', collapsed: true,
          items: [
            { text: '导读：安全、隐私与治理', link: '/software/security/' },
            { text: '威胁建模与安全开发验证', link: '/software/security/threat-modeling' },
            { text: '输入、输出与业务安全', link: '/software/security/application-security' },
            { text: '密钥、最小权限与审计', link: '/software/security/secrets-permissions' },
            { text: '依赖供应链与制品信任', link: '/software/security/supply-chain' },
            { text: '隐私与数据生命周期', link: '/software/security/privacy-lifecycle' },
            { text: '许可证、知识产权与职业责任', link: '/software/security/licenses-professional-practice' },
          ],
        },
        {
          text: 'AI 辅助研发与 Agent 工程', link: '/software/ai-assisted/', collapsed: true,
          items: [
            { text: '导读：AI 辅助研发与 Agent 工程', link: '/software/ai-assisted/' },
            { text: 'Vibe Coding 与 AI 辅助研发全景', link: '/software/ai-assisted/ai-development' },
            { text: '上下文、约束与记忆', link: '/software/ai-assisted/context-constraints' },
            { text: '任务拆分、变更预算与 Agent 协作', link: '/software/ai-assisted/agent-collaboration' },
            { text: 'AI 生成代码的验证与验收', link: '/software/ai-assisted/generated-code-verification' },
            { text: '沙箱、权限与执行防护', link: '/software/ai-assisted/sandbox-permissions' },
            { text: '评测、成本与迭代', link: '/software/ai-assisted/evaluation-cost' },
          ],
        },
        {
          text: '维护与软件演进', link: '/software/maintenance/', collapsed: true,
          items: [
            { text: '导读：维护与软件演进', link: '/software/maintenance/' },
            { text: '阅读与接管既有系统', link: '/software/maintenance/system-takeover' },
            { text: '重构、技术债与架构演进', link: '/software/maintenance/refactoring-debt' },
            { text: '依赖升级、弃用与兼容', link: '/software/maintenance/upgrades-compatibility' },
            { text: '维护变更与问题管理', link: '/software/maintenance/maintenance-changes' },
            { text: '停用、数据迁移与可持续性', link: '/software/maintenance/retirement-sustainability' },
          ],
        },
        {
          text: '专项开发', link: '/software/specialized/', collapsed: true,
          items: [
            { text: '导读：专项开发', link: '/software/specialized/' },
            { text: '移动应用开发基础', link: '/software/specialized/mobile' },
            { text: '桌面应用开发基础', link: '/software/specialized/desktop' },
            { text: 'CLI 与自动化工具', link: '/software/specialized/cli-automation' },
            { text: '浏览器扩展', link: '/software/specialized/browser-extensions' },
            { text: '游戏软件工程基础', link: '/software/specialized/games' },
            { text: '嵌入式、物联网与实时约束', link: '/software/specialized/embedded-iot' },
            { text: '音视频与实时通信', link: '/software/specialized/realtime-media' },
            { text: 'AI 应用工程入口', link: '/software/specialized/ai-applications' },
          ],
        },
        {
          text: '术语与查询索引', link: '/software/reference/', collapsed: true,
          items: [
            { text: '索引总览', link: '/software/reference/' },
            { text: '术语索引', link: '/software/reference/terms' },
            { text: '场景索引', link: '/software/reference/scenarios' },
            { text: '技术与工具索引', link: '/software/reference/technologies-tools' },
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
