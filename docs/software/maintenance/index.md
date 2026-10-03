---
title: 导读：维护与软件演进
outline: [2, 3]
---

# 维护与软件演进

> 接管、演进既有软件并有序退出。本域面向项目接管者、维护者及技术负责人，每篇专题均可独立查阅；先从具体问题进入，再按需要补齐机制和工程边界。

## 范围与相邻领域

关注既有系统的接管、持续变更、依赖升级和退出。重构须保持约定行为，架构演进需要说明改变的契约；停用同时涉及数据、集成、用户和资源责任。

## 专题与查阅范围

| 专题 | 要解决的问题 |
| --- | --- |
| [阅读与接管既有系统](/software/maintenance/system-takeover) | 按业务、代码、数据、交付和责任阅读既有系统，建立可复现的接管基线。 |
| [重构、技术债与架构演进](/software/maintenance/refactoring-debt) | 识别技术债的影响与变化热点，借助行为验证分步重构和演进架构。 |
| [依赖升级、弃用与兼容](/software/maintenance/upgrades-compatibility) | 沿兼容约束、弃用信号和依赖图规划升级，验证协议、配置与数据变化。 |
| [维护变更与问题管理](/software/maintenance/maintenance-changes) | 把缺陷、需求和维护变更统一追踪，安排优先级、影响分析与交付验证。 |
| [停用、数据迁移与可持续性](/software/maintenance/retirement-sustainability) | 规划停用、数据迁移和保留责任，以验证、通知和资源退出结束软件生命周期。 |

## 怎样开始

前置知识：版本、设计、测试与交付。初次进入本域，可以按照上方自动导读的顺序建立概念；已经遇到具体问题时，直接查阅对应专题。阅读顺序是编辑建议，不是理解每篇文章的硬性依赖。

[接管、维护、扩展与停用](/software/guide/maintenance-takeover) → [估算、风险、成本与自建采购](/software/requirements/estimation-risk-economics) → [恢复演练与数据对账](/software/operations/recovery-reconciliation)提供导览或相邻专业入口。专题中的示例用于解释机制，是否适用于自己的项目，仍要检查环境、数据、风险和验证条件。

## 参考资料

<Refs>

- 本页组织领域范围与入口；技术机制、一手来源、适用版本及实际访问日期见各主文。
- 站内相关：[软件研发总览](/software/) · [场景索引](/software/reference/scenarios) · [术语索引](/software/reference/terms)

</Refs>
