---
title: 认识 AI 编程与软件项目
outline: [2, 3]
---

# 认识 AI 编程与软件项目

> 这篇导览写给开始使用 AI 编程、却还看不懂项目文件和研发流程的读者。沿着一个小项目，逐步理解每个阶段要决定什么、向 AI 提供什么、怎样检查结果以及何时需要专业帮助。

## 导览怎样帮助你

AI 可以生成代码、解释文件和执行开发任务。要把结果接管为可维护的软件，仍需要能说清问题、判断改动范围、保存版本、寻找验证证据，并安排上线后的责任。

导览建立这些概念之间的联系，专业篇解释机制和工程取舍。遇到熟悉的问题可直接跳到相应专业文章；不必按同一案例读完整个知识体系。每章首次出现的重要术语会用简明语言解释，详细规则从[专业总览](/software/)继续查阅。

## 贯穿案例：活动报名与管理

案例是虚构的小型活动报名系统：访客查看活动和剩余名额，报名或取消；管理员查看名单和导出。它足够小，也能暴露实际工程问题：名额满了怎么办、重复点击是否重复报名、普通访客能否导出名单、取消是否释放名额、更新后既有数据是否仍可用。

基础范围不包含支付、多租户或真实个人数据。目录中的界面、接口和数据库是讲解模型，不是已经交付的示例应用；后续实践若引入可运行代码，将另行说明具体版本、准备条件和实际验证结果。

## 全部章节与交付问题

16 章沿着同一项目从需求走到运行与维护。每章给出读者需要作出的判断，相关机制从专业篇继续查阅。

| 章节 | 要回答的问题 | 深入专业篇 |
| --- | --- | --- |
| 1. [AI 编程与人的责任](/software/guide/ai-coding-responsibility) | AI 能做哪些工作，每个阶段由谁决定并承担责任？ | [AI 研发全景](/software/ai-assisted/ai-development) · [生成代码验证](/software/ai-assisted/generated-code-verification) |
| 2. [从想法到需求与验收](/software/guide/requirements-and-acceptance) | 怎样明确范围、业务规则与可检查的完成条件？ | [问题与范围](/software/requirements/problem-scope) · [验收标准](/software/requirements/acceptance-criteria) · [需求分析](/software/requirements/requirements-analysis) |
| 3. [软件项目全景](/software/guide/software-project-overview) | 界面、接口、后端、数据库和环境怎样一起完成报名？ | [程序运行](/software/foundations/source-to-runtime) · [浏览器](/software/frontend/web-browser) · [服务生命周期](/software/backend/service-lifecycle) · [数据模型](/software/data/data-models) |
| 4. [文件、目录与代码仓库](/software/guide/files-directories-repositories) | 哪些内容是源码、配置、依赖或生成物？ | [文件路径](/software/foundations/files-paths-permissions) · [工程结构](/software/toolchain/project-structure) · [仓库模型](/software/collaboration/git-repository-model) |
| 5. [语言、框架、运行时与依赖](/software/guide/languages-frameworks-dependencies) | 它们各负责什么，选型如何约束项目？ | [语言与运行时](/software/programming/languages-runtimes) · [依赖锁文件](/software/toolchain/dependencies-lockfiles) · [构建制品](/software/toolchain/build-artifacts) |
| 6. [在本地运行项目](/software/guide/running-locally) | 怎样确认环境、配置、启动步骤与失败原因？ | [终端](/software/foundations/terminal-shell) · [地址与端口](/software/foundations/network-addresses-ports) · [环境配置](/software/toolchain/environment-configuration) · [可复现开发](/software/toolchain/reproducible-development) |
| 7. [需求如何穿过界面、接口与数据库](/software/guide/request-through-system) | 一次操作怎样成为请求、规则判断和数据变更？ | [组件与状态](/software/frontend/components-state-routing) · [API 契约](/software/backend/http-api-contracts) · [业务状态机](/software/backend/business-state-machines) · [数据模型](/software/data/data-models) |
| 8. [给 AI 上下文与边界](/software/guide/ai-context-boundaries) | 怎样传递已有约束并限制一次改动的范围？ | [上下文约束](/software/ai-assisted/context-constraints) · [Agent 协作](/software/ai-assisted/agent-collaboration) · [文档责任](/software/requirements/documentation-responsibility) |
| 9. [看懂改动与保存版本](/software/guide/changes-and-versions) | 怎样阅读差异、记录版本和识别误改？ | [仓库模型](/software/collaboration/git-repository-model) · [提交与撤销](/software/collaboration/commits-history-undo) · [审查证据](/software/collaboration/code-review-evidence) |
| 10. [分支、PR、审查与合并](/software/guide/branches-review-merge) | 怎样在可审查的变更上协作并处理冲突？ | [分支冲突](/software/collaboration/branches-merges-conflicts) · [PR 工作流](/software/collaboration/pull-request-workflow) · [代码审查](/software/collaboration/code-review-evidence) |
| 11. [验证与验收成果](/software/guide/verification-acceptance) | 怎样检查正常、异常、权限和质量要求？ | [测试层次](/software/quality/test-levels) · [测试用例](/software/quality/test-cases) · [验收回归](/software/quality/acceptance-regression) · [生成代码验证](/software/ai-assisted/generated-code-verification) |
| 12. [定位问题与修复](/software/guide/diagnosis-repair) | 怎样收集复现条件、错误和日志并验证修复？ | [IDE 调试](/software/toolchain/ide-debugging) · [缺陷管理](/software/quality/debugging-defects) · [故障响应](/software/operations/incident-response) |
| 13. [配置、密钥、权限与数据](/software/guide/configuration-secrets-data) | 哪些信息影响运行，哪些信息需要限制访问？ | [环境配置](/software/toolchain/environment-configuration) · [身份权限](/software/backend/authentication-authorization) · [应用安全](/software/security/application-security) · [密钥](/software/security/secrets-permissions) · [隐私生命周期](/software/security/privacy-lifecycle) |
| 14. [从本地到线上](/software/guide/local-to-production) | 环境、构建、托管、域名和 HTTPS 怎样连接？ | [CI](/software/delivery/build-ci) · [环境 IaC](/software/delivery/environments-iac) · [容器镜像](/software/delivery/containers-images) · [托管部署](/software/delivery/hosting-platforms) · [DNS/HTTPS](/software/delivery/dns-https) |
| 15. [安全发布、观察与回退](/software/guide/release-observe-rollback) | 如何判断上线健康，发生问题时怎样恢复？ | [发布回滚](/software/delivery/release-rollback) · [SLO](/software/operations/slo-health-oncall) · [应用观测](/software/operations/application-observability) · [故障响应](/software/operations/incident-response) · [数据迁移](/software/data/orm-migrations) |
| 16. [接管、维护、扩展与停用](/software/guide/maintenance-takeover) | 怎样保留文档、处理升级和成本，并有序退出？ | [维护与演进](/software/maintenance/) · [风险成本](/software/requirements/estimation-risk-economics) · [容量成本](/software/operations/capacity-performance-cost) |

## 从导览转到专业查询

| 当前困惑 | 对应主文 |
| --- | --- |
| “AI 说完成了，我怎么判断？” | [验收标准与质量属性](/software/requirements/acceptance-criteria) |
| “想法怎样拆成明确工作？” | [问题、场景、需求与范围](/software/requirements/problem-scope) |
| “源码怎么变成正在运行的软件？” | [程序从源码到运行](/software/foundations/source-to-runtime) |
| “路径、目录和权限为什么会影响运行？” | [文件系统、路径权限与编码](/software/foundations/files-paths-permissions) |
| “这个文件夹或配置是否有必要？” | [项目目录、文件与配置](/software/toolchain/project-structure) |
| “清单和锁文件为什么都有依赖？” | [依赖、包管理与锁文件](/software/toolchain/dependencies-lockfiles) |
| “仓库、提交、分支各是什么？” | [Git 与仓库的版本模型](/software/collaboration/git-repository-model) |
| “PR 合并是不是就上线了？” | [仓库托管与 PR/MR 协作](/software/collaboration/pull-request-workflow) |

## 如何使用每章的判断方法

读完一章，可以用自己的项目回答其中的问题，并指出证据存在哪里。例如，“不会超额报名”需要对应规则、负责执行的组件和验证记录；一句“已修复”不足以表达这些条件。

案例中的目录结构、流程和验收表是编辑示例。它们不能代替真实项目的业务确认、运行验证或专业审查。出现数据、权限或恢复问题时，先限制影响范围，再补充证据和必要的技术检查。

## 参考资料

<Refs>

- 站内相关：[软件研发与工程实践](/software/) · [术语索引](/software/reference/terms) · [场景索引](/software/reference/scenarios)
- 深入来源见各章节的参考资料；本页负责组织阅读与说明虚构案例边界。

</Refs>
