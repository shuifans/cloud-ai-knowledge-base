---
title: 软件研发场景索引
outline: [2, 3]
---

# 软件研发场景索引

> 从你正在做的事情找到阅读与核查路径。每条路径指向负责该问题的主文；可以先读第一篇建立判断，再按缺少的知识继续，不需要通读整个体系。

## 接管与本地运行

| 当前任务或问题 | 推荐入口 | 应得到的判断或记录 |
| --- | --- | --- |
| 拿到 AI 生成的文件，不知道从哪里开始 | [文件、目录与代码仓库](/software/guide/files-directories-repositories) → [工程目录与配置](/software/toolchain/project-structure) → [阅读与接管既有系统](/software/maintenance/system-takeover) | 能说明入口、源码、配置、测试、生成物以及当前维护责任。 |
| 安装成功，启动却失败或访问不到 | [在本地运行项目](/software/guide/running-locally) → [终端、Shell 与命令行](/software/foundations/terminal-shell) → [网络地址、端口与连接](/software/foundations/network-addresses-ports) → [开发环境、环境变量与配置注入](/software/toolchain/environment-configuration) | 记录命令、工作目录、环境、端口、错误与分层检查结果。 |
| 本机能运行，换电脑或 CI 失败 | [依赖、清单与锁文件](/software/toolchain/dependencies-lockfiles) → [可复现开发与团队约定](/software/toolchain/reproducible-development) → [构建与 CI 流水线](/software/delivery/build-ci) | 对齐工具版本、锁文件、配置注入和构建输入；保留干净环境证据。 |
| 不知道该选语言、框架还是运行环境 | [语言、框架、运行时与依赖](/software/guide/languages-frameworks-dependencies) → [语言、运行时与工程选型](/software/programming/languages-runtimes) → [渲染方式与框架选型](/software/frontend/rendering-frameworks) → [后端框架、性能与资源管理](/software/backend/backend-frameworks-performance) | 先明确工作负载、宿主、团队与维护约束，再比较路线。 |
| 需要自动化重复任务或制作新形态应用 | [CLI 与自动化工具](/software/specialized/cli-automation) → [移动应用开发基础](/software/specialized/mobile) → [桌面应用开发基础](/software/specialized/desktop) → [浏览器扩展](/software/specialized/browser-extensions) | 明确参数输出、平台权限、生命周期与分发方式。 |

## 需求、过程与 AI 协作

| 当前任务或问题 | 推荐入口 | 应得到的判断或记录 |
| --- | --- | --- |
| AI 不断增加功能，范围失控 | [问题与范围](/software/requirements/problem-scope) → [可验证的验收标准](/software/requirements/acceptance-criteria) → [上下文、约束与记忆](/software/ai-assisted/context-constraints) | 写明用户、场景、非目标、约束和完成条件，固定本次变更范围。 |
| 同一句需求，不同人理解不同 | [需求分析、领域规则与追踪](/software/requirements/requirements-analysis) → [业务逻辑、规则与状态机](/software/backend/business-state-machines) → [文档、沟通与责任分工](/software/requirements/documentation-responsibility) | 收敛术语、规则、状态、例外和决策记录，连到实现与验证。 |
| 任务太大，想让多个 Agent 并行 | [任务拆分、变更预算与 Agent 协作](/software/ai-assisted/agent-collaboration) → [模块边界、依赖与接口](/software/architecture/modules-interfaces) → [代码审查与变更证据](/software/collaboration/code-review-evidence) | 划分文件与接口所有权、集成顺序、任务边界和审查证据。 |
| 如何控制 Agent 命令、网络或文件访问 | [沙箱、权限与执行防护](/software/ai-assisted/sandbox-permissions) → [密钥、最小权限与审计](/software/security/secrets-permissions) | 记录授权目标、最小权限、沙箱限制、停止条件与人工升级点。 |
| 怎样比较模型或 Agent 的项目价值 | [评测、成本与迭代](/software/ai-assisted/evaluation-cost) → [AI 生成代码的验证与验收](/software/ai-assisted/generated-code-verification) → [估算、风险、成本与自建采购](/software/requirements/estimation-risk-economics) | 使用项目任务集、相同环境和判定标准，计算有效交付与返工成本。 |
| 如何选择迭代过程并估算成本 | [生命周期、迭代与过程选择](/software/requirements/lifecycle-process) → [估算、风险、成本与自建采购](/software/requirements/estimation-risk-economics) → [文档、沟通与责任分工](/software/requirements/documentation-responsibility) | 说明反馈周期、风险、范围假设、责任与全生命周期成本。 |

## 程序、设计与实现

| 当前任务或问题 | 推荐入口 | 应得到的判断或记录 |
| --- | --- | --- |
| 看不懂类型、函数、错误和异步 | [变量、类型与控制流](/software/programming/types-control-flow) → [函数、作用域与模块](/software/programming/functions-modules) → [错误、异常与资源管理](/software/programming/errors-resource-management) → [异步、并发同步与取消](/software/programming/async-concurrency) | 沿值、控制流、错误传播和任务生命周期解释实际行为。 |
| AI 代码越来越复杂，想拆模块或换架构 | [模块边界、依赖与接口](/software/architecture/modules-interfaces) → [设计原则、模式与重构](/software/architecture/principles-patterns) → [单体、模块化单体与服务](/software/architecture/monolith-services) → [架构决策与验证](/software/architecture/architecture-decisions) | 找出变化点、依赖和部署边界，用场景验证方案并记录代价。 |
| 接口超时后重试，担心重复写入 | [分布式一致性与部分失败](/software/architecture/distributed-failure) → [消息、任务、调度与幂等](/software/backend/messages-jobs-idempotency) → [事件、工作流与补偿](/software/architecture/events-workflows) | 区分结果未知、重复执行和业务补偿，确定幂等与重试边界。 |
| 一次用户操作到底经过哪些组件 | [需求如何穿过界面、接口与数据库](/software/guide/request-through-system) → [组件、状态、路由与表单](/software/frontend/components-state-routing) → [HTTP、API 与接口契约](/software/backend/http-api-contracts) → [数据模型、关系与约束](/software/data/data-models) | 追踪界面状态、请求契约、业务规则、授权和数据库约束。 |
| 算法在小数据上快，大数据上慢 | [常用数据结构的工程选择](/software/algorithms/data-structures) → [时间与空间复杂度](/software/algorithms/complexity) → [树、图与依赖关系](/software/algorithms/trees-graphs) → [正确性、测量与算法优化](/software/algorithms/correctness-optimization) | 确认操作模式、增长趋势、正确性与测量环境，再选结构或优化。 |
| 开发移动、游戏、设备或实时媒体功能 | [移动应用开发基础](/software/specialized/mobile) → [游戏软件工程基础](/software/specialized/games) → [嵌入式、物联网与实时约束](/software/specialized/embedded-iot) → [音视频与实时通信](/software/specialized/realtime-media) | 识别宿主、物理资源、实时性及分发约束，安排专项验证。 |
| 需要把模型、检索或 Agent 接入应用 | [AI 应用工程入口](/software/specialized/ai-applications) → [第三方集成与 Webhook](/software/backend/integrations-webhooks) → [Vibe Coding 与 AI 辅助研发全景](/software/ai-assisted/ai-development) | 区分 AI 产品工程与 AI 辅助研发；模型和检索机制进入 AI 主文。 |

## 界面、接口与数据

| 当前任务或问题 | 推荐入口 | 应得到的判断或记录 |
| --- | --- | --- |
| 界面能点，但键盘、手机或其他语言不好用 | [HTML、CSS 与响应式布局](/software/frontend/html-css-responsive) → [交互、可访问性与国际化](/software/frontend/accessibility-internationalization) → [前端性能、兼容与观测](/software/frontend/frontend-performance) | 检查语义、布局、焦点、错误反馈、格式和真实设备证据。 |
| 接口返回成功，业务状态却不正确 | [HTTP、API 与接口契约](/software/backend/http-api-contracts) → [业务逻辑、规则与状态机](/software/backend/business-state-machines) → [测试用例、边界、状态与数据](/software/quality/test-cases) | 核对 HTTP 与业务结果、不变量、转换条件和并发用例。 |
| 用户登录后能看到其他人的对象 | [身份认证、会话与权限](/software/backend/authentication-authorization) → [输入、输出与业务安全](/software/security/application-security) → [测试用例、边界、状态与数据](/software/quality/test-cases) | 逐对象检查服务端授权，验证水平和垂直权限边界。 |
| 数据重复、超额或出现并发写入问题 | [数据模型、关系与约束](/software/data/data-models) → [事务、并发与索引的应用选择](/software/data/transactions-indexes) → [消息、任务、调度与幂等](/software/backend/messages-jobs-idempotency) | 把唯一性、事务与幂等规则落实到权威写入边界。 |
| SQL 或查询很慢，想加索引 | [SQL 查询与执行计划](/software/data/sql-query-plans) → [事务、并发与索引的应用选择](/software/data/transactions-indexes) → [性能分析、容量、弹性与成本](/software/operations/capacity-performance-cost) | 检查实际数据、计划、选择性、写入成本和整体瓶颈。 |
| 升级应用同时要改数据库 | [ORM、迁移与兼容](/software/data/orm-migrations) → [发布、功能开关与回滚](/software/delivery/release-rollback) → [依赖升级、弃用与兼容](/software/maintenance/upgrades-compatibility) | 安排扩展、兼容、迁移与收缩步骤，分别验证应用与数据回退条件。 |
| 缓存、搜索或导入的数据不一致 | [缓存、搜索与存储的应用边界](/software/data/cache-search-storage) → [导入、数据质量与恢复](/software/data/data-quality-recovery) → [恢复演练与数据对账](/software/operations/recovery-reconciliation) | 确认权威来源、失效或重建策略、来源追踪与业务对账。 |

## 验证、诊断与安全

| 当前任务或问题 | 推荐入口 | 应得到的判断或记录 |
| --- | --- | --- |
| AI 说完成了，只展示一个正常流程 | [验证与验收成果](/software/guide/verification-acceptance) → [质量模型与验证策略](/software/quality/quality-strategy) → [单元、集成、契约与端到端测试](/software/quality/test-levels) → [验收、回归与质量度量](/software/quality/acceptance-regression) | 将验收条件映射到独立证据，检查异常、边界、权限与质量。 |
| 测试全绿或覆盖率很高，仍有缺陷 | [测试用例、边界、状态与数据](/software/quality/test-cases) → [静态检查、类型与审查](/software/quality/static-analysis) → [AI 生成代码的验证与验收](/software/ai-assisted/generated-code-verification) | 审查判定依据、替身偏差、数据、遗漏路径和工具证明边界。 |
| 修了一个问题，又破坏另一个功能 | [调试、日志与缺陷管理](/software/quality/debugging-defects) → [验收、回归与质量度量](/software/quality/acceptance-regression) → [代码审查与变更证据](/software/collaboration/code-review-evidence) | 保留复现、影响分析和回归范围，将修复关联到明确版本。 |
| 系统慢或偶发失败，日志没有线索 | [IDE、调试与开发工具](/software/toolchain/ide-debugging) → [应用指标、日志与追踪埋点](/software/operations/application-observability) → [性能、负载与可靠性测试](/software/quality/performance-reliability-tests) → [性能分析、容量、弹性与成本](/software/operations/capacity-performance-cost) | 围绕假设补观测，区分负载、阻塞、资源耗尽和时间相关问题。 |
| 准备加入外部库、密钥或真实数据 | [威胁建模与安全开发验证](/software/security/threat-modeling) → [密钥、最小权限与审计](/software/security/secrets-permissions) → [依赖供应链与制品信任](/software/security/supply-chain) → [隐私与数据生命周期](/software/security/privacy-lifecycle) | 检查威胁、最小权限、依赖来源、敏感副本和保留责任。 |
| 打算复用公开仓库或分发软件 | [许可证、知识产权与职业责任](/software/security/licenses-professional-practice) → [依赖供应链与制品信任](/software/security/supply-chain) | 核对来源、具体许可证、通知与分发条件，保留物料清单。 |

## 上线、故障与维护

| 当前任务或问题 | 推荐入口 | 应得到的判断或记录 |
| --- | --- | --- |
| PR 合并后，不确定线上是否更新 | [标签、版本与配置基线](/software/collaboration/tags-versions-baselines) → [构建与 CI 流水线](/software/delivery/build-ci) → [发布、功能开关与回滚](/software/delivery/release-rollback) | 对应提交、制品、部署实例与发布状态；检查实际运行版本。 |
| 准备从本地部署到生产 | [从本地到线上](/software/guide/local-to-production) → [环境、配置与基础设施即代码](/software/delivery/environments-iac) → [容器、镜像与打包](/software/delivery/containers-images) → [托管、部署与平台工程](/software/delivery/hosting-platforms) → [域名、DNS、HTTPS 与入口](/software/delivery/dns-https) | 说明环境、制品、平台责任、网络入口、TLS 和运行准备条件。 |
| 上线后异常，想快速回滚 | [安全发布、观察与回退](/software/guide/release-observe-rollback) → [发布、功能开关与回滚](/software/delivery/release-rollback) → [ORM、迁移与兼容](/software/data/orm-migrations) → [故障响应、手册与复盘](/software/operations/incident-response) | 按停止条件止损，检查应用、配置、数据与外部副作用的恢复边界。 |
| 网站看似健康，用户却频繁失败 | [SLO、健康检查与值守](/software/operations/slo-health-oncall) → [应用指标、日志与追踪埋点](/software/operations/application-observability) → [故障响应、手册与复盘](/software/operations/incident-response) | 用用户成功定义服务指标，明确告警、值守与升级路径。 |
| 有备份但不知道能否恢复 | [恢复演练与数据对账](/software/operations/recovery-reconciliation) → [导入、数据质量与恢复](/software/data/data-quality-recovery) | 在明确故障场景下恢复，并核对业务不变量、时间和数据损失。 |
| 准备长期维护、升级或停用 | [接管、维护、扩展与停用](/software/guide/maintenance-takeover) → [重构、技术债与架构演进](/software/maintenance/refactoring-debt) → [依赖升级、弃用与兼容](/software/maintenance/upgrades-compatibility) → [维护变更与问题管理](/software/maintenance/maintenance-changes) → [停用、数据迁移与可持续性](/software/maintenance/retirement-sustainability) | 安排债务、兼容、变更、交接、迁移及资源退出证据。 |

## 深入云和 AI 平台

| 需要进一步解决的问题 | 主文 | 与软件研发的边界 |
| --- | --- | --- |
| 数据库引擎、分析和存储路线 | [数据库选型](/cloud/data/database) · [OLAP](/cloud/data/olap) · [大数据](/cloud/data/bigdata) | 应用模型、查询与迁移先在软件数据域解决 |
| 容器集群和服务治理平台 | [Kubernetes](/cloud/native/kubernetes) · [微服务治理](/cloud/native/microservice) | 软件篇管理制品、契约及应用发布，云篇解释平台机制 |
| 观测、灾备、成本及云账户治理 | [可观测体系](/cloud/native/observability) · [可靠性与灾备](/cloud/architecture/reliability-dr) · [FinOps](/cloud/architecture/finops) · [安全治理](/cloud/architecture/security-governance) | 应用仍需定义用户目标、埋点、恢复及自己的权限边界 |
| 模型、检索和 Agent 应用机制 | [RAG 架构](/ai/application/rag-architecture) · [评测](/ai/application/evaluation) · [Agent 框架](/ai/agent/frameworks) · [安全执行](/ai/agent/security) | 用 AI 写软件与开发 AI 应用分别评估，不把模型榜单当成项目验收 |

## 参考资料

<Refs>

- 路径为编辑建议，技术机制、一手来源和适用范围见各主文；本页不宣称这些步骤已在读者项目中实际执行。
- 站内相关：[软件研发总览](/software/) · [项目导览](/software/guide/) · [术语索引](/software/reference/terms) · [技术工具索引](/software/reference/technologies-tools)

</Refs>
