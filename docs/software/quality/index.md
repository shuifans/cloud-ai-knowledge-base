---
title: 导读：测试与工程质量
outline: [2, 3]
---

# 测试与工程质量

> 以有效证据验证功能、质量与变更影响。本域面向开发者、测试人员及验收者，每篇专题均可独立查阅；先从具体问题进入，再按需要补齐机制和工程边界。

## 范围与相邻领域

关注从风险和质量目标到有效验证证据的全过程。测试、静态分析、调试和验收互补；AI 自报完成、单一覆盖率和一次正常演示均不能独立证明交付满足要求。

## 专题与查阅范围

| 专题 | 要解决的问题 |
| --- | --- |
| [质量模型与验证策略](/software/quality/quality-strategy) | 把质量属性、风险与可测试性转成验证策略，分清验证、确认和验收。 |
| [单元、集成、契约与端到端测试](/software/quality/test-levels) | 比较单元、集成、契约与端到端测试，按边界和失败成本分配证据。 |
| [测试用例、边界、状态与数据](/software/quality/test-cases) | 用等价类、边界、决策表和状态转换设计用例，并控制测试数据及判定依据。 |
| [调试、日志与缺陷管理](/software/quality/debugging-defects) | 围绕复现、假设和观测定位缺陷，保留诊断线索并验证修复和回归。 |
| [静态检查、类型与审查](/software/quality/static-analysis) | 理解类型检查、lint 与静态分析能够证明什么，将工具发现与人工审查结合。 |
| [性能、负载与可靠性测试](/software/quality/performance-reliability-tests) | 设计负载、压力、长稳和故障实验，明确工作负载、停止条件和结果边界。 |
| [验收、回归与质量度量](/software/quality/acceptance-regression) | 把验收标准、回归范围和质量度量连接起来，避免以覆盖率代替交付判断。 |

## 怎样开始

前置知识：需求、验收与程序运行。初次进入本域，可以按照上方自动导读的顺序建立概念；已经遇到具体问题时，直接查阅对应专题。阅读顺序是编辑建议，不是理解每篇文章的硬性依赖。

[验证与验收成果](/software/guide/verification-acceptance) → [AI 生成代码的验证与验收](/software/ai-assisted/generated-code-verification) → [构建与 CI 流水线](/software/delivery/build-ci)提供导览或相邻专业入口。专题中的示例用于解释机制，是否适用于自己的项目，仍要检查环境、数据、风险和验证条件。

## 参考资料

<Refs>

- 本页组织领域范围与入口；技术机制、一手来源、适用版本及实际访问日期见各主文。
- 站内相关：[软件研发总览](/software/) · [场景索引](/software/reference/scenarios) · [术语索引](/software/reference/terms)

</Refs>
