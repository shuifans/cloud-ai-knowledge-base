---
title: 软件研发术语索引
outline: [2, 3]
---

# 软件研发术语索引

> 本页用于快速解释陌生词，并指出容易混淆的概念。简明释义帮助定位，不替代对应专业文章；中英文名称均可通过全站搜索查找。

## 项目、文件与运行

| 术语 | 简明释义与易混点 | 主文 |
| --- | --- | --- |
| 项目 / Project | 围绕目标组织的代码、配置、测试、文档和协作活动；一个项目可以涉及多个仓库 | [项目全景](/software/guide/software-project-overview) |
| 仓库 / Repository | 保存版本对象、引用和相关元数据的集合；并不等于托管网站，也不自动包含运行环境 | [Git 仓库模型](/software/collaboration/git-repository-model) |
| 目录 / Directory | 文件系统中组织名称和路径的结构；Git 不直接记录空目录 | [文件与路径](/software/foundations/files-paths-permissions) |
| 工作目录 / Current working directory | 进程当前用来解析部分相对路径的基准；不是所有路径都以它为基准 | [文件与路径](/software/foundations/files-paths-permissions) |
| 源码 / Source code | 用编程语言描述程序的文件；文件存在不表示程序正在运行 | [源码到运行](/software/foundations/source-to-runtime) |
| 制品 / Artifact | 构建或交付产生、供后续步骤使用的输出，例如打包后的代码或镜像 | [工程结构](/software/toolchain/project-structure) |
| 运行时 / Runtime | 执行程序所依赖的运行机制或环境；不等于开发编辑器 | [源码到运行](/software/foundations/source-to-runtime) |
| 进程 / Process | 操作系统管理的一次程序执行及其资源；同一程序可产生多个进程 | [源码到运行](/software/foundations/source-to-runtime) |
| 前端 / Frontend | 面向用户界面及交互的一侧；Web 前端常在浏览器运行 | [项目全景](/software/guide/software-project-overview) |
| 后端 / Backend | 接收请求、执行服务端业务规则并访问数据等服务；不等于数据库本身 | [项目全景](/software/guide/software-project-overview) |
| 接口 / API | 组件间交互的约定；并非所有接口都是 HTTP 网络接口 | [项目全景](/software/guide/software-project-overview) |
| 框架 / Framework | 提供应用组织方式和常用机制的软件基础；不能代替业务需求与验收 | [源码到运行](/software/foundations/source-to-runtime) |

## 依赖与工程配置

| 术语 | 简明释义与易混点 | 主文 |
| --- | --- | --- |
| 依赖 / Dependency | 项目或某个包完成工作所需要的其他软件；依赖也可能继续依赖其他包 | [依赖与锁文件](/software/toolchain/dependencies-lockfiles) |
| 包 / Package | 按包管理生态约定发布和安装的软件单元；不一定对应单个源码文件 | [依赖与锁文件](/software/toolchain/dependencies-lockfiles) |
| 包管理器 / Package manager | 管理依赖解析、安装及相关元数据的工具；不同工具规则不同 | [依赖与锁文件](/software/toolchain/dependencies-lockfiles) |
| 清单 / Manifest | 描述项目或包元数据及依赖要求的文件，例如 package.json | [依赖与锁文件](/software/toolchain/dependencies-lockfiles) |
| 锁文件 / Lockfile | 记录包管理器解析出的依赖信息，用于约束后续安装；不单独保证完整环境可复现 | [依赖与锁文件](/software/toolchain/dependencies-lockfiles) |
| 配置 / Configuration | 影响软件行为的参数或约定；配置文件、环境变量和命令参数只是不同载体 | [工程结构](/software/toolchain/project-structure) |
| 构建 / Build | 将源码及输入处理为目标输出的过程；构建成功不等于业务行为正确 | [源码到运行](/software/foundations/source-to-runtime) |

## 版本与协作

| 术语 | 简明释义与易混点 | 主文 |
| --- | --- | --- |
| 工作区 / Working tree | Git 仓库关联的、供编辑使用的文件树；不是提交对象 | [Git 仓库模型](/software/collaboration/git-repository-model) |
| 暂存区 / Index | 记录下一次提交所准备内容的索引；文件之后再次修改不会自动更新已暂存的版本 | [Git 仓库模型](/software/collaboration/git-repository-model) |
| 提交 / Commit | 关联目录快照、父提交和元数据的版本对象；提交通常先发生在本地 | [Git 仓库模型](/software/collaboration/git-repository-model) |
| 分支 / Branch | 指向提交、可随提交推进的引用；不是磁盘中复制出来的一整套目录 | [Git 仓库模型](/software/collaboration/git-repository-model) |
| 远端 / Remote | Git 对另一仓库位置的命名和配置；它可以在服务器，也可以在本地 | [Git 仓库模型](/software/collaboration/git-repository-model) |
| 推送 / Push | 向另一仓库传递对象并请求更新引用；是否部署取决于其他配置 | [Git 仓库模型](/software/collaboration/git-repository-model) |
| PR / Pull request；MR / Merge request | 托管平台上提出并讨论合并变更的协作对象；术语和具体流程因平台而异 | [PR/MR 协作](/software/collaboration/pull-request-workflow) |
| Issue | 平台中的问题或工作跟踪项；不一定是缺陷，也不等于代码提交 | [PR/MR 协作](/software/collaboration/pull-request-workflow) |
| 合并 / Merge | 将开发历史或变更整合到目标版本的操作；不表示已经发布或上线 | [PR/MR 协作](/software/collaboration/pull-request-workflow) |

## 需求与验证

| 术语 | 简明释义与易混点 | 主文 |
| --- | --- | --- |
| 需求 / Requirement | 用户、系统或项目需要具备的能力或满足的条件；技术方案是实现这些条件的选择 | [问题与范围](/software/requirements/problem-scope) |
| 范围 / Scope | 当前交付包含的工作与边界；非目标有助于明确暂不承诺的事项 | [问题与范围](/software/requirements/problem-scope) |
| 质量属性 / Quality attribute | 性能、可靠性、安全等可用于评估系统质量的特征；需进一步规定条件和衡量方法 | [验收标准](/software/requirements/acceptance-criteria) |
| 验收标准 / Acceptance criteria | 用于判断交付是否满足约定的条件；它不等于测试步骤或测试结果 | [验收标准](/software/requirements/acceptance-criteria) |
| 回归 / Regression | 变更导致原有行为出现不符合预期的情况；回归检查用于发现这类影响 | [验收标准](/software/requirements/acceptance-criteria) |
| Vibe Coding | 以自然语言和 AI 快速推动代码生成的一类开发方式；定义和使用习惯并不统一 | [AI 编程与责任](/software/guide/ai-coding-responsibility) |

## 系统、网络与度量

| 术语 | 简明释义与易混点 | 主文 |
| --- | --- | --- |
| 线程 / Thread | 进程内的执行单元；共享地址空间不代表访问共享数据天然安全 | [进程与内存](/software/foundations/operating-systems-processes-memory) |
| 虚拟内存 / Virtual memory | 操作系统与硬件提供的地址空间抽象；不是把所有内存都写到磁盘 | [进程与内存](/software/foundations/operating-systems-processes-memory) |
| 终端 / Terminal | 提供输入输出的交互界面；通常由 Shell 解析命令 | [终端与 Shell](/software/foundations/terminal-shell) |
| Shell | 解释命令并组织进程的程序；不同 Shell 的引号和语法不完全相同 | [终端与 Shell](/software/foundations/terminal-shell) |
| 退出码 / Exit status | 进程结束时返回的状态值；其语义由程序约定，输出了文字不代表成功 | [终端与 Shell](/software/foundations/terminal-shell) |
| DNS | 将域名等信息组织为可查询记录的系统；解析成功不代表目标服务可达 | [地址与端口](/software/foundations/network-addresses-ports) · [DNS 与 HTTPS](/software/delivery/dns-https) |
| 端口 / Port | 传输协议中区分通信端点的编号；同一编号须结合地址和协议理解 | [地址与端口](/software/foundations/network-addresses-ports) |
| localhost / 回环地址 | 指当前网络环境的自身端点；容器或远端的自身未必是你的电脑 | [地址与端口](/software/foundations/network-addresses-ports) |
| 分位数 / Percentile | 描述观测分布中某一位置的统计量；p99 不能用平均值替代 | [工程度量](/software/foundations/engineering-math-measurement) |
| 吞吐量 / Throughput | 单位时间完成的工作量；与单个请求的延迟是不同指标 | [工程度量](/software/foundations/engineering-math-measurement) |

## 程序设计与算法

| 术语 | 简明释义与易混点 | 主文 |
| --- | --- | --- |
| 类型 / Type | 描述值、操作及其约束的语言机制；编译期检查不能替代外部输入验证 | [类型与控制流](/software/programming/types-control-flow) |
| 作用域 / Scope | 名称可被解析和使用的范围；不等于变量在内存中存活的时间 | [函数与作用域](/software/programming/functions-modules) |
| 闭包 / Closure | 函数连同它所捕获的词法环境；捕获引用可能继续观察到状态变化 | [函数与作用域](/software/programming/functions-modules) |
| 模块 / Module | 组织实现并暴露约定入口的单元；源码模块、进程和服务未必一一对应 | [函数与模块](/software/programming/functions-modules) · [模块边界](/software/architecture/modules-interfaces) |
| 多态 / Polymorphism | 通过共同接口处理不同实现的能力；具体机制依语言和范式而异 | [抽象与范式](/software/programming/abstraction-paradigms) |
| 异常 / Exception | 中断正常控制流并传递错误的一种语言机制；不是所有失败都必须用异常表达 | [错误与资源](/software/programming/errors-resource-management) |
| 异步 / Asynchronous | 操作的发起与完成可以分离；异步不自动意味着并行执行 | [异步与并发](/software/programming/async-concurrency) |
| 并发 / Concurrency；并行 / Parallelism | 并发组织多个进行中的任务，并行在同一时刻执行多个任务；两者可以结合 | [异步与并发](/software/programming/async-concurrency) |
| 竞态 / Race condition | 结果依赖未受约束的执行时序；单线程异步程序也可能出现逻辑竞态 | [异步与并发](/software/programming/async-concurrency) |
| 哈希表 / Hash table | 根据哈希映射组织键值的数据结构；性能和正确性仍依赖冲突处理及键语义 | [数据结构](/software/algorithms/data-structures) |
| 队列 / Queue | 按约定顺序接收与取出元素的结构；内存队列不自动提供持久性或消息确认 | [数据结构](/software/algorithms/data-structures) |
| 大 O / Big O | 描述增长上界的渐近记号；不是实际耗时、常数或服务容量的直接数值 | [复杂度](/software/algorithms/complexity) |
| 稳定排序 / Stable sort | 保持相等比较键元素的原有相对顺序；不代表排序过程总是更快 | [搜索与排序](/software/algorithms/search-sort-strings) |
| 拓扑排序 / Topological sort | 给有向无环图找出满足依赖顺序的排列；有环时不能得到这种完整排列 | [树与图](/software/algorithms/trees-graphs) |
| 不变量 / Invariant | 在指定操作或状态转换中应保持成立的条件；是验证正确性的重要依据 | [算法正确性](/software/algorithms/correctness-optimization) · [业务状态机](/software/backend/business-state-machines) |

## 调试、配置与版本基线

| 术语 | 简明释义与易混点 | 主文 |
| --- | --- | --- |
| 断点 / Breakpoint | 在指定位置或条件下暂停执行的调试机制；暂停会改变时间相关行为 | [IDE 与调试](/software/toolchain/ide-debugging) |
| 环境变量 / Environment variable | 进程环境中的键值信息；读入时机、继承和覆盖规则因工具而异 | [环境配置](/software/toolchain/environment-configuration) |
| Source map | 将转换后的代码位置映射回来源的位置元数据；公开发布可能暴露源码信息 | [构建制品](/software/toolchain/build-artifacts) |
| 可复现 / Reproducible | 在已说明的输入和环境条件下能够重复得到约定结果；有锁文件还不够 | [可复现开发](/software/toolchain/reproducible-development) |
| revert / 反向提交 | 用新提交记录某个既有提交的反向改动；共享历史通常比删除旧历史容易审计 | [提交与撤销](/software/collaboration/commits-history-undo) |
| rebase / 变基 | 将提交改动重新应用到另一基础历史上；会生成新的提交身份 | [分支与冲突](/software/collaboration/branches-merges-conflicts) |
| 语义冲突 / Semantic conflict | 文本能够合并，但组合后的程序违反约定；Git 无冲突提示不能证明行为正确 | [分支与冲突](/software/collaboration/branches-merges-conflicts) |
| Code review / 代码审查 | 结合目标、差异和证据评估变更；自动检查通过仍需要风险判断 | [审查证据](/software/collaboration/code-review-evidence) |
| 标签 / Tag | 为版本对象提供名称的 Git 引用；不自动说明实际部署了哪个制品 | [标签与基线](/software/collaboration/tags-versions-baselines) |
| 配置基线 / Configuration baseline | 在约定时点经过确认、用于控制后续变更的一组配置项；不只是一个版本号 | [标签与基线](/software/collaboration/tags-versions-baselines) |

## 需求、设计与业务接口

| 术语 | 简明释义与易混点 | 主文 |
| --- | --- | --- |
| 需求追踪 / Traceability | 将需求与来源、设计、实现及验证证据建立关系；链接存在不代表证据有效 | [需求分析](/software/requirements/requirements-analysis) |
| 迭代 / Iteration；增量 / Increment | 迭代重复活动以获得反馈，增量增加可用能力；并非所有迭代都会交付新能力 | [生命周期](/software/requirements/lifecycle-process) |
| TCO / 总拥有成本 | 在说明的生命周期和范围内统计建设、运行、维护及退出成本；不是仅比较采购价 | [估算风险与成本](/software/requirements/estimation-risk-economics) |
| RACI | 用执行、最终负责、咨询和知会区分协作角色的工具；角色表不能代替实际决策权 | [文档与责任](/software/requirements/documentation-responsibility) |
| 耦合 / Coupling；内聚 / Cohesion | 分别描述单元之间的关联及单元内部职责的关联；需要结合变化场景判断 | [模块与接口](/software/architecture/modules-interfaces) |
| 设计模式 / Design pattern | 描述反复出现问题的一类可复用设计思路；不能忽略代价直接套用 | [原则与模式](/software/architecture/principles-patterns) |
| 架构视图 / Architecture view | 面向特定关注点描述系统的一种视图；结构图不能代替运行和部署视图 | [架构建模](/software/architecture/architecture-modeling) |
| 模块化单体 / Modular monolith | 保持一个整体部署单元，同时约束内部模块边界的组织方式 | [单体与服务](/software/architecture/monolith-services) |
| 部分失败 / Partial failure | 分布式系统中的部分组件或链路失败，其他部分可能继续运行 | [分布式失败](/software/architecture/distributed-failure) |
| Saga / 补偿事务流程 | 以多个本地事务及补偿组织跨组件业务流程；不等于一次数据库回滚 | [事件与补偿](/software/architecture/events-workflows) |
| ADR / 架构决策记录 | 记录一个重要决策的背景、选择和后果；应保留被后续决策替代的历史 | [架构决策](/software/architecture/architecture-decisions) |
| API 契约 / API contract | 规定调用、输入输出、错误及兼容行为的约定；接口描述文件只是表达载体之一 | [HTTP 与 API](/software/backend/http-api-contracts) |
| 状态机 / State machine | 用状态、事件和转换条件描述行为；应明确哪些转换由谁允许和执行 | [业务状态机](/software/backend/business-state-machines) |
| 认证 / Authentication；授权 / Authorization | 分别判断主体是谁、主体能否执行某项操作；登录成功不代表有全部权限 | [身份与权限](/software/backend/authentication-authorization) |
| 幂等 / Idempotency | 重复执行指定操作与执行一次具有约定的相同效果；不意味着响应或内部调用次数相同 | [消息与任务](/software/backend/messages-jobs-idempotency) |
| Webhook | 外部系统通过约定的 HTTP 回调通知事件；应校验来源并处理重复和重放 | [第三方集成](/software/backend/integrations-webhooks) |
| 背压 / Backpressure | 通过限制、等待或反馈控制上游输入速度，避免下游无限积压 | [后端资源管理](/software/backend/backend-frameworks-performance) |

## 界面、数据与质量

| 术语 | 简明释义与易混点 | 主文 |
| --- | --- | --- |
| DOM | 浏览器暴露的文档对象模型；修改 DOM 与最终像素渲染是不同步骤 | [Web 与浏览器](/software/frontend/web-browser) |
| 响应式布局 / Responsive layout | 根据可用空间和媒介条件调整排版的方式；不能只检查一款手机 | [HTML 与 CSS](/software/frontend/html-css-responsive) |
| 事件冒泡 / Event bubbling | 事件传播的一部分路径；不是所有事件都冒泡，监听阶段也可以不同 | [浏览器 API](/software/frontend/javascript-browser-apis) |
| 单一事实来源 / Single source of truth | 为某项状态指定权威来源的设计原则；不是禁止所有缓存或派生状态 | [组件状态](/software/frontend/components-state-routing) |
| SSR / 服务端渲染；SSG / 静态生成 | 分别在服务端或预先生成页面 HTML；具体请求和缓存策略还需说明 | [渲染方式](/software/frontend/rendering-frameworks) |
| 水合 / Hydration | 将客户端交互逻辑与已生成的页面结构连接的过程；初始 HTML 可见不表示交互已就绪 | [渲染方式](/software/frontend/rendering-frameworks) |
| 可访问性 / Accessibility | 使不同能力与使用条件的用户能够感知、操作和理解产品；不限于视觉样式 | [可访问性](/software/frontend/accessibility-internationalization) |
| i18n / 国际化；l10n / 本地化 | 前者使产品能够适配语言和地区，后者落实具体语言、格式及地区内容 | [国际化](/software/frontend/accessibility-internationalization) |
| Core Web Vitals | 描述加载、交互响应和视觉稳定性的 Web 指标组；不是完整的前端质量模型 | [前端性能](/software/frontend/frontend-performance) |
| 主键 / Primary key；外键 / Foreign key | 分别标识记录、约束引用关系；业务唯一性仍可能需要另设约束 | [数据模型](/software/data/data-models) |
| 执行计划 / Query plan | 数据库执行查询的操作策略；估算计划和实际执行观察需区分 | [SQL 与计划](/software/data/sql-query-plans) |
| 事务隔离 / Transaction isolation | 约束并发事务能够观察或影响彼此行为的规则；级别名称需结合数据库实现 | [事务与索引](/software/data/transactions-indexes) |
| ORM / 对象关系映射 | 在对象模型与关系数据库之间提供映射的机制；不能消除 SQL 和事务语义 | [ORM 与迁移](/software/data/orm-migrations) |
| 数据迁移 / Data migration | 改变数据结构、内容或所在系统的受控过程；数据库模式迁移只是其中一类 | [ORM 与迁移](/software/data/orm-migrations) · [数据恢复](/software/data/data-quality-recovery) |
| 缓存 / Cache | 保存可复用结果以减少后续访问成本的机制；必须说明权威来源、失效与一致性 | [缓存搜索存储](/software/data/cache-search-storage) |
| 数据对账 / Reconciliation | 按业务规则比较并解释数据差异；只检查文件数量不能证明恢复正确 | [恢复与对账](/software/operations/recovery-reconciliation) |
| 验证 / Verification；确认 / Validation | 分别检查是否符合规定要求、是否满足预期用途；实际过程可以相互补充 | [质量策略](/software/quality/quality-strategy) |
| 测试替身 / Test double | 测试中替代依赖的对象或实现；替身可能与真实依赖行为偏离 | [测试层次](/software/quality/test-levels) |
| 测试判定依据 / Test oracle | 判断观察结果是否符合预期的依据；由同一错误实现生成预期值会削弱证据 | [测试用例](/software/quality/test-cases) |
| 静态分析 / Static analysis | 不直接运行目标程序而分析其结构或性质的技术；结果受模型和规则边界限制 | [静态检查](/software/quality/static-analysis) |
| 负载测试 / Load test；压力测试 / Stress test | 分别检查指定负载下表现及超出正常边界时的行为；均须说明负载模型 | [性能与可靠性测试](/software/quality/performance-reliability-tests) |
| 测试覆盖率 / Test coverage | 衡量测试执行或用例对某种覆盖目标的覆盖程度；不直接证明断言质量和需求满足 | [验收与回归](/software/quality/acceptance-regression) |

## 交付、运维与治理

| 术语 | 简明释义与易混点 | 主文 |
| --- | --- | --- |
| CI / 持续集成 | 频繁集成变更并通过自动构建和检查获得反馈的实践；不是任意定时脚本 | [构建与 CI](/software/delivery/build-ci) |
| CD / 持续交付或持续部署 | 前者保持可部署能力，后者自动将合格变更部署到生产；团队须明确缩写所指 | [构建与 CI](/software/delivery/build-ci) |
| IaC / 基础设施即代码 | 用可版本化的声明或程序管理基础设施；仍需处理真实状态和漂移 | [环境与 IaC](/software/delivery/environments-iac) |
| 镜像 / Image；容器 / Container | 镜像是打包后的运行输入，容器是由其启动的运行实例；两者都不等于虚拟机 | [容器与镜像](/software/delivery/containers-images) |
| PaaS / 平台即服务 | 提供应用运行和交付能力的一类服务；责任、限制及可迁移性因平台而异 | [托管与平台](/software/delivery/hosting-platforms) |
| TLS / 传输层安全 | 保护通信的协议；HTTPS 使用 TLS，但加密不能代替应用授权和业务安全 | [DNS 与 HTTPS](/software/delivery/dns-https) |
| 功能开关 / Feature flag | 用配置控制行为是否启用的机制；开关也需要权限、默认值和退出管理 | [发布与回滚](/software/delivery/release-rollback) |
| 金丝雀发布 / Canary release | 先让有限范围承担新版本，再按指标逐步扩大；小流量仍可能修改真实数据 | [发布与回滚](/software/delivery/release-rollback) |
| SLI / SLO / SLA | 分别是服务指标、目标和服务协议；健康检查成功不能代表用户目标达成 | [SLO 与健康](/software/operations/slo-health-oncall) |
| 可观测性 / Observability | 根据系统输出理解其内部运行状况的能力；采集很多日志不自动形成有效诊断 | [应用观测](/software/operations/application-observability) |
| Runbook / 操作手册 | 描述特定情境下检查、处置和升级路径的手册；应说明适用条件和停止条件 | [故障响应](/software/operations/incident-response) |
| RTO / RPO | 分别是恢复时间目标与恢复点目标，后者表示可容忍的数据回退窗口；目标是否可达须结合故障场景及演练证据 | [恢复与对账](/software/operations/recovery-reconciliation) |
| 威胁模型 / Threat model | 描述资产、边界、威胁及控制的模型；不是仅列一张漏洞清单 | [威胁建模](/software/security/threat-modeling) |
| XSS / 跨站脚本；CSRF / 跨站请求伪造 | 分别滥用浏览器执行上下文或被浏览器自动携带的身份能力；防护条件不同 | [应用安全](/software/security/application-security) |
| 最小权限 / Least privilege | 只授予完成特定任务所需的权限和时限；不是简单让所有人拥有同一个低权限角色 | [密钥与权限](/software/security/secrets-permissions) |
| SBOM / 软件物料清单 | 记录软件组成和依赖信息的清单；有清单不等于已经安全或合规 | [供应链](/software/security/supply-chain) |
| Provenance / 来源证明 | 记录制品如何、由何种输入生成的信息；需结合身份、签名和信任策略验证 | [供应链](/software/security/supply-chain) |
| 数据最小化 / Data minimization | 按明确目的限制收集、使用和保留的数据；应覆盖日志、备份及第三方副本 | [隐私生命周期](/software/security/privacy-lifecycle) |
| 许可证 / License | 权利人按条款授予使用等权利的法律文件；公开仓库不必然授予任意复用权 | [许可证与责任](/software/security/licenses-professional-practice) |

## AI 研发、维护与专项

| 术语 | 简明释义与易混点 | 主文 |
| --- | --- | --- |
| 上下文 / Context | 当前任务供模型参考的信息集合；信息进入上下文不表示它准确或具有指令权限 | [上下文与约束](/software/ai-assisted/context-constraints) |
| Agent / 智能体 | 结合模型、状态和工具执行任务的系统；能够调用工具不表示应拥有所有权限 | [Agent 协作](/software/ai-assisted/agent-collaboration) |
| 提示注入 / Prompt injection | 通过不可信内容诱导模型偏离授权目标或规则的攻击；不能只依赖一段提示词防护 | [沙箱与权限](/software/ai-assisted/sandbox-permissions) |
| 沙箱 / Sandbox | 约束执行资源和访问能力的环境或机制；隔离程度须结合具体实现核验 | [沙箱与权限](/software/ai-assisted/sandbox-permissions) |
| 评测 / Evaluation | 用明确任务、数据和判定方式评估系统；模型榜单不等于项目验收 | [研发评测](/software/ai-assisted/evaluation-cost) |
| 重构 / Refactoring | 在保持约定可观察行为的条件下改善内部结构；新增需求应单独说明 | [重构与技术债](/software/maintenance/refactoring-debt) |
| 技术债 / Technical debt | 会增加后续修改成本的设计或实现负担，可能来自时间取舍、知识不足或认识变化；不是所有遗留代码都算债 | [重构与技术债](/software/maintenance/refactoring-debt) |
| 弃用 / Deprecation | 表示某能力不再推荐并准备转向替代路径；不一定立即删除，也不保证永久兼容 | [升级与兼容](/software/maintenance/upgrades-compatibility) |
| 停用 / Retirement | 有序结束系统服务并处理数据、集成和资源责任的过程；不是只关闭服务器 | [停用与迁移](/software/maintenance/retirement-sustainability) |
| 原生 / Native；跨平台 / Cross-platform | 分别面向特定宿主能力或复用多个平台实现的开发路线；仍需验证各宿主行为 | [移动开发](/software/specialized/mobile) · [桌面开发](/software/specialized/desktop) |
| CLI / 命令行接口 | 通过命令参数、输入输出与退出状态交互的接口；应面向人和自动化同时设计 | [CLI 工程](/software/specialized/cli-automation) |
| Content script / 内容脚本 | 扩展在匹配网页中执行的脚本上下文；与网页及扩展后台存在不同边界 | [浏览器扩展](/software/specialized/browser-extensions) |
| 游戏循环 / Game loop | 重复处理输入、更新状态并生成输出的运行模型；需区分模拟步长与显示帧率 | [游戏工程](/software/specialized/games) |
| 实时 / Real-time | 在指定时限内满足行为约束；不是简单追求平均处理速度快 | [嵌入式与实时](/software/specialized/embedded-iot) |
| WebRTC | 支持实时媒体和数据通信的一组 Web API 与协议机制；仍需要信令及连接策略 | [实时媒体](/software/specialized/realtime-media) |
| RAG / 检索增强生成 | 用检索得到的材料支持模型生成的应用方法；检索命中不代表最终回答正确 | [AI 应用入口](/software/specialized/ai-applications) · [RAG 架构](/ai/application/rag-architecture) |

## 参考资料

<Refs>

- 本页释义由对应主文收敛；机制依据和实际访问日期见主文引用。
- 站内相关：[场景索引](/software/reference/scenarios) · [技术与工具索引](/software/reference/technologies-tools)

</Refs>
