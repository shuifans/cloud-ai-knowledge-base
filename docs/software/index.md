---
title: 软件研发与工程实践
outline: [2, 3]
lastReviewed: 2026-10-03
reviewScope: 完整目录、领域边界与阅读入口
---

# 软件研发与工程实践

> 这里面向使用 AI 编程的非程序员，也面向需要查阅原理与实践的技术读者。先认识软件项目怎样从需求走向交付，再按领域理解机制、判断工程取舍并寻找验证证据。

## 两种阅读方式

第一次管理软件项目，可以从[认识 AI 编程与软件项目](/software/guide/)开始。导览采用一个虚构的活动报名系统，连接需求、文件、代码、数据、版本与上线维护；它帮助读者形成全局理解，各专业文章仍可独立查阅。

已有问题或技术基础，可以直接进入专业子域。目录按知识领域组织，[场景索引](/software/reference/scenarios)帮助从任务找到文章，[术语索引](/software/reference/terms)帮助解释陌生词，[技术与工具索引](/software/reference/technologies-tools)提供概念和官方入口。全站搜索同时检索正文与摘要，可选择“软件研发”范围。

## 专业领域与建设范围

体系覆盖软件的整个生命周期。每个子域都提供导读和可独立查阅的完整专题；按主题深入，或通过索引从任务进入。

| 子域 | 要解决的问题 | 完整专题 |
| --- | --- | --- |
| [计算机与软件基础](/software/foundations/) | 程序如何运行，操作系统、文件、终端与网络如何承载它？ | 6 篇 |
| [编程语言与程序设计](/software/programming/) | 类型、函数、模块、错误、异步与运行时如何影响程序行为？ | 6 篇 |
| [数据结构与算法](/software/algorithms/) | 怎样按数据、规模和正确性选择结构与算法？ | 5 篇 |
| [开发环境与工具链](/software/toolchain/) | 项目如何组织，依赖、配置、构建与开发环境怎样可复现？ | 6 篇 |
| [版本控制与协作](/software/collaboration/) | 怎样保存版本、提出改动、审查、合并和追踪协作？ | 6 篇 |
| [需求、产品与项目管理](/software/requirements/) | 解决谁的问题，如何明确范围、验收、风险、成本与责任？ | 6 篇 |
| [软件设计与架构](/software/architecture/) | 怎样划分模块、接口与服务，并记录和验证架构取舍？ | 7 篇 |
| [前端与界面工程](/software/frontend/) | 怎样建立兼容、可访问、可观测的界面和交互？ | 7 篇 |
| [后端与接口工程](/software/backend/) | 怎样落实业务逻辑、契约、权限、消息任务与第三方集成？ | 7 篇 |
| [数据库与应用数据工程](/software/data/) | 怎样建模、查询、控制并发、迁移和恢复应用数据？ | 6 篇 |
| [测试与工程质量](/software/quality/) | 怎样验证行为、边界和质量，定位缺陷并防止回归？ | 7 篇 |
| [构建交付与部署](/software/delivery/) | 怎样构建可信制品、管理环境、发布和回退？ | 6 篇 |
| [运维可靠性与性能](/software/operations/) | 怎样观测服务目标、应对故障、规划容量和持续优化？ | 5 篇 |
| [安全、隐私与治理](/software/security/) | 怎样控制攻击面、密钥权限、供应链和数据生命周期？ | 6 篇 |
| [AI 辅助研发与 Agent 工程](/software/ai-assisted/) | 怎样约束 AI 的任务、上下文、执行权限、验证与成本？ | 6 篇 |
| [维护与软件演进](/software/maintenance/) | 怎样接管既有系统、处理技术债、升级依赖和有序停用？ | 5 篇 |
| [专项开发](/software/specialized/) | 移动、桌面、CLI、扩展、游戏、嵌入式、实时音视频和 AI 应用有哪些额外约束？ | 8 篇 |

专业篇共 105 篇专题，导览共 16 章。专项开发解释平台模型、通用工程能力的适用边界和深入入口，不追求穷举所有语言、产品或开发平台。

## 与云计算、人工智能的边界

软件研发关注应用如何被定义、构造、验证和维护；云计算关注资源、平台与生产治理；人工智能关注模型、算力、AI 应用与智能体系统。主题存在交叉时，先在对应主文解释核心机制，再从其他领域链接过去。

| 交叉主题 | 软件研发篇负责 | 复用的现有主文 |
| --- | --- | --- |
| 服务与分布式 | 应用模块边界、契约、状态及失败处理 | [微服务治理](/cloud/native/microservice)承担服务治理、发现与平台机制 |
| 数据库 | 应用模型、SQL、事务用法、ORM 与迁移 | [数据库选型](/cloud/data/database)承担引擎机制、数据库路线与产品选择 |
| 数据工程 | 应用数据导入、质量和恢复 | [大数据体系](/cloud/data/bigdata)与[OLAP 引擎](/cloud/data/olap)承担分析平台 |
| 容器与部署 | 制品、环境、应用发布和回退 | [Kubernetes](/cloud/native/kubernetes)承担集群控制、调度及平台落地 |
| 运维与可靠性 | 应用埋点、故障手册、性能与恢复验证 | [可观测体系](/cloud/native/observability)与[可靠性与灾备](/cloud/architecture/reliability-dr)承担平台及架构治理 |
| 安全 | 应用输入、业务权限、密钥、依赖与隐私 | [安全与身份治理](/cloud/architecture/security-governance)承担云账户、组织和资源治理 |
| 使用 AI 写软件 | 需求、上下文、受限执行、代码审查和验收 | [Agent 安全与可靠执行](/ai/agent/security)提供工具执行安全的共用原则 |
| 开发 AI 应用 | 通用应用工程与平台专项入口 | [RAG 架构](/ai/application/rag-architecture)、[大模型评测](/ai/application/evaluation)与[Agent 框架](/ai/agent/frameworks)承担 AI 专题机制 |

## 内容与验证边界

导览帮助形成全局理解，专业篇提供机制、工程实践、失败模式和适用边界，索引负责定位。阅读或复制示例不等于实际项目已经通过验证；运行环境、业务数据、权限和恢复条件仍须逐项确认。

本体系的完整性指领域覆盖、概念关系和边界清晰，不能代替具体语言手册、规范全文或产品兼容矩阵。带版本、价格、性能或功能限制的判断，以对应主文说明的适用范围和当前官方材料为准。

内容完成与站点上线是不同状态。本站以实际正文标记区分完整文章与提纲，维护清单记录建设批次；某次本地编辑完成不代表公共站点已经部署。

## 分类依据与适用边界

本站的分类是面向阅读与查阅的编辑组织方式。SWEBOK 用于校验软件工程的领域覆盖；MDN Curriculum 用于校验前端及其基础与扩展内容；roadmap.sh 提供社区学习路径参考；GitHub Docs 和 Skills 提供特定协作平台的概念与练习。它们各有范围，不能由其中一个网站推出完整的软件研发体系，也不意味着本站目录得到这些组织的认证。

## 参考资料

<Refs>

以下资料于 2026-10-03 实际查阅，用于分类覆盖和边界校验。

- [IEEE Computer Society：SWEBOK Guide v4.0a（官方 PDF）](https://ieeecs-media.computer.org/media/education/swebok/swebok-v4.pdf)
- [MDN：About Curriculum](https://developer.mozilla.org/en-US/curriculum/about-curriculum/)
- [roadmap.sh：Developer Roadmaps](https://roadmap.sh/)（社区资源）
- [GitHub Skills](https://github.com/skills)（协作练习入口，具体仓库与功能以官方说明为准）
- 站内相关：[认识 AI 编程与软件项目](/software/guide/) · [云计算](/cloud/) · [人工智能](/ai/)

</Refs>
