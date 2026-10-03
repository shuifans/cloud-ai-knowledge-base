---
title: 导读：运维可靠性与性能
outline: [2, 3]
---

# 运维可靠性与性能

> 围绕服务目标观测、恢复与优化。本域面向应用维护者及运维人员，每篇专题均可独立查阅；先从具体问题进入，再按需要补齐机制和工程边界。

## 范围与相邻领域

围绕用户服务目标组织应用观测、值守、故障、容量和恢复验证。平台采集存储及灾备架构由云计算主文深入解释；应用需要定义自己的指标、手册和业务对账。

## 专题与查阅范围

| 专题 | 要解决的问题 |
| --- | --- |
| [SLO、健康检查与值守](/software/operations/slo-health-oncall) | 从用户成功定义 SLI/SLO，区分健康检查与服务目标，并安排值守责任。 |
| [应用指标、日志与追踪埋点](/software/operations/application-observability) | 围绕用户路径设计应用指标、日志与追踪，控制关联、采样和敏感信息。 |
| [故障响应、手册与复盘](/software/operations/incident-response) | 以分工、止损和时间线处理故障，把复盘结论落实为可验证行动。 |
| [性能分析、容量、弹性与成本](/software/operations/capacity-performance-cost) | 从工作负载和瓶颈分析容量、弹性与成本，验证优化是否改善目标指标。 |
| [恢复演练与数据对账](/software/operations/recovery-reconciliation) | 将备份、恢复和业务对账组合成演练，检验恢复时间、数据损失和一致性。 |

## 怎样开始

前置知识：服务、部署与质量指标。初次进入本域，可以按照上方自动导读的顺序建立概念；已经遇到具体问题时，直接查阅对应专题。阅读顺序是编辑建议，不是理解每篇文章的硬性依赖。

[定位问题与修复](/software/guide/diagnosis-repair) → [安全发布、观察与回退](/software/guide/release-observe-rollback) → [性能、负载与可靠性测试](/software/quality/performance-reliability-tests)提供导览或相邻专业入口。专题中的示例用于解释机制，是否适用于自己的项目，仍要检查环境、数据、风险和验证条件。

## 参考资料

<Refs>

- 本页组织领域范围与入口；技术机制、一手来源、适用版本及实际访问日期见各主文。
- 站内相关：[软件研发总览](/software/) · [场景索引](/software/reference/scenarios) · [术语索引](/software/reference/terms)

</Refs>
