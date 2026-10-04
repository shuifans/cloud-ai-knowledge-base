---
title: 软件研发技术与工具索引
outline: [2, 3]
lastReviewed: 2026-10-03
reviewScope: 技术职责定位与官方文档入口
---

# 软件研发技术与工具索引

> 先判断名字属于语言、运行时、框架、协议、工具、平台还是规范，再决定需要查什么。本页提供代表性入口，选型依据在对应专业文章中解释。

这些名称不是必选技术栈，也不是产品排名。版本、兼容矩阵、许可、价格及托管限制，以采用时的官方材料为准；文档路径中的 latest、current、stable 等代表滚动入口，不代表本站锁定某一版本。

## 语言、运行时与界面

| 名称 | 职责与边界 | 本站主文 | 官方入口 |
| --- | --- | --- | --- |
| JavaScript | 语言；浏览器和其他宿主提供的 API 不完全相同 | [语言、运行时与工程选型](/software/programming/languages-runtimes) | [文档](https://developer.mozilla.org/en-US/docs/Web/JavaScript) |
| TypeScript | 类型检查及相关语言工具；外部数据仍需运行时验证 | [变量、类型与控制流](/software/programming/types-control-flow) | [文档](https://www.typescriptlang.org/docs/) |
| Python | 通用语言及解释器生态；具体实现和环境影响运行行为 | [语言、运行时与工程选型](/software/programming/languages-runtimes) | [文档](https://docs.python.org/3/tutorial/) |
| Java / JVM | 语言及虚拟机生态；语言、字节码和执行平台须区分 | [语言、运行时与工程选型](/software/programming/languages-runtimes) | [文档](https://dev.java/learn/) |
| Go | 语言与工具链；并发机制仍需要正确的任务和资源管理 | [异步、并发同步与取消](/software/programming/async-concurrency) | [文档](https://go.dev/doc/) |
| Rust | 语言及工具链；所有权、借用与类型机制影响资源和并发设计 | [错误、异常与资源管理](/software/programming/errors-resource-management) | [文档](https://doc.rust-lang.org/book/) |
| Node.js | 在浏览器之外运行 JavaScript 的环境；不是业务后端本身 | [从源码到运行中的程序](/software/foundations/source-to-runtime) | [文档](https://nodejs.org/learn/getting-started/introduction-to-nodejs) |
| Vue | 界面框架；组件与响应式状态需要明确边界 | [组件、状态、路由与表单](/software/frontend/components-state-routing) | [文档](https://vuejs.org/guide/introduction.html) |
| React | 界面库；组件、状态和渲染模型服务于界面设计 | [组件、状态、路由与表单](/software/frontend/components-state-routing) | [文档](https://react.dev/learn) |
| Next.js | 围绕 React 的应用框架；渲染和缓存规则按版本核实 | [渲染方式与框架选型](/software/frontend/rendering-frameworks) | [文档](https://nextjs.org/docs) |
| Vite | 开发与构建工具；开发服务行为不等于生产部署行为 | [构建工具链与制品](/software/toolchain/build-artifacts) | [文档](https://vite.dev/guide/) |

## 依赖、版本与协作

| 名称 | 职责与边界 | 本站主文 | 官方入口 |
| --- | --- | --- | --- |
| npm | Node.js 生态的包管理及相关工具；清单与锁文件作用不同 | [依赖、清单与锁文件](/software/toolchain/dependencies-lockfiles) | [文档](https://docs.npmjs.com/) |
| Git | 分布式版本控制系统；可以独立于代码托管平台使用 | [Git 仓库模型](/software/collaboration/git-repository-model) | [文档](https://git-scm.com/book/en/v2) |
| GitHub | 仓库托管与协作平台；PR、检查与部署需分别配置 | [Pull Request 工作流](/software/collaboration/pull-request-workflow) | [文档](https://docs.github.com/en/pull-requests/get-started/about-pull-requests) |
| GitLab / Gitee | 其他仓库托管与协作平台；术语、权限和功能因平台而异 | [Pull Request 工作流](/software/collaboration/pull-request-workflow) | 对应平台官方资料见主文 |

## 接口与应用数据

| 名称 | 职责与边界 | 本站主文 | 官方入口 |
| --- | --- | --- | --- |
| HTTP | 应用层协议；方法、状态、表示和缓存有明确语义 | [HTTP、API 与接口契约](/software/backend/http-api-contracts) | [文档](https://www.rfc-editor.org/rfc/rfc9110.html) |
| OpenAPI | HTTP API 描述规范；描述文件不能自动证明实际服务符合契约 | [HTTP、API 与接口契约](/software/backend/http-api-contracts) | [文档](https://spec.openapis.org/oas/latest.html) |
| PostgreSQL | 关系数据库；应用约束、计划、事务与迁移仍需设计和验证 | [事务、并发与索引的应用选择](/software/data/transactions-indexes) | [文档](https://www.postgresql.org/docs/current/) |
| SQLite | 嵌入式数据库引擎；运行、并发和文件管理边界需说明 | [数据模型、关系与约束](/software/data/data-models) | [文档](https://www.sqlite.org/docs.html) |
| Redis | 提供多种数据类型的存储系统；使用作缓存时要设计失效与恢复 | [缓存、搜索与存储的应用边界](/software/data/cache-search-storage) | [文档](https://redis.io/docs/latest/) |
| Elasticsearch | 搜索与分析系统；不是所有业务数据的权威存储替代品 | [缓存、搜索与存储的应用边界](/software/data/cache-search-storage) | [文档](https://www.elastic.co/docs) |

## 测试、质量与交付

| 名称 | 职责与边界 | 本站主文 | 官方入口 |
| --- | --- | --- | --- |
| Playwright | 浏览器自动化与测试工具；测试范围、数据和断言由项目定义 | [单元、集成、契约与端到端测试](/software/quality/test-levels) | [文档](https://playwright.dev/docs/intro) |
| Pact | 契约测试工具；用于验证调用方与提供方对交互的共同理解 | [单元、集成、契约与端到端测试](/software/quality/test-levels) | [文档](https://docs.pact.io/) |
| Hypothesis | 属性测试工具；输入生成不能替代正确的性质和判定依据 | [测试用例、边界、状态与数据](/software/quality/test-cases) | [文档](https://hypothesis.readthedocs.io/en/latest/) |
| ESLint | JavaScript 静态规则检查工具；规则通过不能证明业务正确 | [静态检查、类型与审查](/software/quality/static-analysis) | [文档](https://eslint.org/docs/latest/) |
| GitHub Actions | 工作流执行平台；流水线权限、输入和制品需要约束 | [构建与 CI 流水线](/software/delivery/build-ci) | [文档](https://docs.github.com/en/actions) |
| Docker | 容器镜像构建与运行相关工具；镜像和运行中的容器需要区分 | [容器、镜像与打包](/software/delivery/containers-images) | [文档](https://docs.docker.com/) |
| Terraform | 基础设施管理工具；计划、实际状态和漂移是工程管理对象 | [环境、配置与基础设施即代码](/software/delivery/environments-iac) | [文档](https://developer.hashicorp.com/terraform/docs) |
| Kubernetes | 管理容器化工作负载的平台；调度和集群控制详见云原生主文 | [托管、部署与平台工程](/software/delivery/hosting-platforms) | [文档](https://kubernetes.io/docs/home/) |
| OpenTelemetry | 采集和导出观测信号的 API、SDK 与工具；仍需要后端存储和诊断流程 | [应用指标、日志与追踪埋点](/software/operations/application-observability) | [文档](https://opentelemetry.io/docs/concepts/signals/) |

## 安全与治理资料

| 名称 | 职责与边界 | 本站主文 | 官方入口 |
| --- | --- | --- | --- |
| OWASP ASVS | 应用安全验证要求框架；应选择适用要求和验证证据 | [威胁建模与安全开发验证](/software/security/threat-modeling) | [文档](https://owasp.org/projects/asvs) |
| SLSA | 软件供应链完整性框架；级别与要求须结合采用版本理解 | [依赖供应链与制品信任](/software/security/supply-chain) | [文档](https://slsa.dev/) |
| Sigstore | 围绕签名和验证的软件供应链工具与服务；信任策略不能省略 | [依赖供应链与制品信任](/software/security/supply-chain) | [文档](https://docs.sigstore.dev/) |
| SPDX | 软件组成与许可证信息的标准体系；标识许可证不等于完成合规判断 | [许可证、知识产权与职业责任](/software/security/licenses-professional-practice) | [文档](https://spdx.org/licenses/) |

## 专项开发入口

| 名称 | 职责与边界 | 本站主文 | 官方入口 |
| --- | --- | --- | --- |
| Android | 移动应用平台；生命周期、后台、权限和分发条件需要专项验证 | [移动应用开发基础](/software/specialized/mobile) | [文档](https://developer.android.com/get-started/overview) |
| Flutter | 跨平台界面框架及工具；共享代码仍需检验各宿主行为 | [移动应用开发基础](/software/specialized/mobile) | [文档](https://docs.flutter.dev/) |
| Electron | 结合 Web 与桌面运行环境的框架；进程、桥接和权限边界需要设计 | [桌面应用开发基础](/software/specialized/desktop) | [文档](https://www.electronjs.org/docs/latest/) |
| Tauri | 桌面应用框架；WebView、原生命令及能力授权需结合版本理解 | [桌面应用开发基础](/software/specialized/desktop) | [文档](https://v2.tauri.app/) |
| WebExtensions | 浏览器扩展的 API 与开发模型；宿主支持和分发政策各有差异 | [浏览器扩展](/software/specialized/browser-extensions) | [文档](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions) |
| Godot | 游戏引擎；游戏循环、资源和运行性能仍需工程判断 | [游戏软件工程基础](/software/specialized/games) | [文档](https://docs.godotengine.org/en/stable/) |
| Zephyr | 面向受限设备的实时操作系统项目；硬件支持和时序需按目标验证 | [嵌入式、物联网与实时约束](/software/specialized/embedded-iot) | [文档](https://docs.zephyrproject.org/latest/) |
| WebRTC | 实时媒体和数据通信技术；信令、网络穿透与媒体策略须明确 | [音视频与实时通信](/software/specialized/realtime-media) | [文档](https://webrtc.org/) |

## 将技术名称放回任务中

语言选择应连接运行环境与团队能力，框架选择应连接状态、业务及部署模型；工具检查的结果须回到需求和风险。跨平台不免除宿主验证，托管不免除应用责任，安全扫描不免除威胁与权限判断。

需要开发模型、检索或 Agent 产品时，从 [AI 应用工程入口](/software/specialized/ai-applications)进入已有 AI 专题；需要用 AI 写和管理软件时，从 [AI 辅助研发](/software/ai-assisted/ai-development)进入任务、上下文、权限和验证。这两种目的可能同时存在，但验证对象不同。

## 参考资料

<Refs>

- 上表以官方材料和对应主文定位职责；新增官方入口于 2026-10-03 实际查阅。访问日期仅覆盖入口及职责定位，不表示兼容矩阵、所有产品功能或价格已经复核。
- [MDN：Learn web development](https://developer.mozilla.org/en-US/docs/Learn_web_development)提供 Web 基础与标准文档的入口，主要面向 Web 开发。
- [GitHub：No License](https://choosealicense.com/no-permission/)解释公开可见与复用许可的区别；具体条款和适用方式见许可证主文。
- 站内相关：[术语索引](/software/reference/terms) · [场景索引](/software/reference/scenarios) · [软件研发总览](/software/)

</Refs>
