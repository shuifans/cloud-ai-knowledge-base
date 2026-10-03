---
title: 导读：软件设计与架构
outline: [2, 3]
---

# 软件设计与架构

> 设计模块系统边界并记录取舍。本域面向开发者、架构师及技术负责人，每篇专题均可独立查阅；先从具体问题进入，再按需要补齐机制和工程边界。

## 范围与相邻领域

关注模块、系统边界、状态与重要决策。用视图和场景描述取舍；云微服务治理、集群与可靠性架构由已有主文承担，本文说明应用设计为何形成这些需求。

## 专题与查阅范围

| 专题 | 要解决的问题 |
| --- | --- |
| [模块边界、依赖与接口](/software/architecture/modules-interfaces) | 按职责、变化和契约划分模块，检查依赖方向、耦合与接口演进。 |
| [设计原则、模式与重构](/software/architecture/principles-patterns) | 围绕具体变化点应用设计原则和模式，用行为证据控制重构风险。 |
| [建模与架构描述](/software/architecture/architecture-modeling) | 按读者关注点选择结构、部署和行为视图，保持架构描述与实现对应。 |
| [单体、模块化单体与服务](/software/architecture/monolith-services) | 比较单体、模块化单体和服务，评估部署、数据、团队与故障边界的成本。 |
| [分布式一致性与部分失败](/software/architecture/distributed-failure) | 解释网络分区、超时与结果未知，按一致性要求设计重试和失败处理。 |
| [事件、工作流与补偿](/software/architecture/events-workflows) | 区分命令、事件与工作流，通过幂等、顺序和补偿处理跨组件状态变化。 |
| [架构决策与验证](/software/architecture/architecture-decisions) | 把约束、备选方案和后果记录为架构决策，以可验证场景检查取舍。 |

## 怎样开始

前置知识：模块、接口、网络与数据。初次进入本域，可以按照上方自动导读的顺序建立概念；已经遇到具体问题时，直接查阅对应专题。阅读顺序是编辑建议，不是理解每篇文章的硬性依赖。

[需求如何穿过界面、接口与数据库](/software/guide/request-through-system) → [需求分析、领域规则与追踪](/software/requirements/requirements-analysis) → [重构、技术债与架构演进](/software/maintenance/refactoring-debt)提供导览或相邻专业入口。专题中的示例用于解释机制，是否适用于自己的项目，仍要检查环境、数据、风险和验证条件。

## 参考资料

<Refs>

- 本页组织领域范围与入口；技术机制、一手来源、适用版本及实际访问日期见各主文。
- 站内相关：[软件研发总览](/software/) · [场景索引](/software/reference/scenarios) · [术语索引](/software/reference/terms)

</Refs>
