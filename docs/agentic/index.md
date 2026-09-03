---
title: Agentic：智能体技术全景
outline: [2, 3]
---

# Agentic：智能体技术全景

> 2025–2026 年，Agent 从"对话助手的延伸"变成了独立的技术品类：它有自己的运行时（Harness）、自己的协议层（MCP/Skills/A2A）、自己的商业化路径与开源生态。这个支柱记录智能体的技术全景——从概念分级、热点演进到框架选型。

## 从 Copilot 到 Agent 的分级

- **L1 对话**：问答与生成，无外部动作
- **L2 工具调用**：Function Calling，模型决定调什么工具
- **L3 工作流**：多步规划 + 工具编排（ReAct、Plan-and-Execute）
- **L4 自主体**：长任务、自我反思、多 Agent 协作——落地仍需人工确认点

技术栈的分层现实：**编排框架**（怎么构建）与**运行时**（怎么跑）正在收敛为两个独立赛道，连接层（MCP/Skills/A2A）成为事实标准。详见 [Agent 开发框架对比](/agentic/frameworks)。

## 本支柱文章

| 文章 | 状态 | 说明 |
| --- | --- | --- |
| [Agent 热点编年史](/agentic/history) | 撰写中 | OpenClaw 引爆 → Claude Code/Codex 商业化与开源 → 百花齐放 |
| [Agent 开发框架对比](/agentic/frameworks) | 已发布 | 分层全景、核心四框架源码级审计摘要、选型框架 |

## Function Calling 的工程要点

- 工具描述（Schema）就是 Prompt：描述质量直接决定调用准确率
- 参数校验与幂等：模型会幻觉出不存在的参数值
- 失败处理：工具报错要"可被模型理解"，否则陷入重试死循环
- 高风险动作保留人工确认（HITL）：审批不是体验损失，是治理基线

## Agent 应用的架构模式

- 单 Agent + 工具箱：覆盖 80% 场景，先做这个
- 路由 + 专家 Agent：意图分发，各域独立迭代
- 多 Agent 协作：复杂任务分解——注意协作开销可能大于收益
- 上线清单：动作白名单、预算上限（token/调用次数）、审计日志、回滚路径

## 精选资源

> 更新于 2026-09-02。

- [What is the Model Context Protocol (MCP)?](https://modelcontextprotocol.io/docs/getting-started/intro) — MCP 官方规范：协议架构与接入方式（2026 · 官方文档）
- [Building Effective AI Agents](https://www.anthropic.com/engineering/building-effective-agents) — 辨析工作流与 Agent 并给出设计模式，智能体实践经典（2024 · 工程博客）
- [anthropics/skills — Agent Skills](https://github.com/anthropics/skills) — Anthropic 官方 Agent Skills 仓库与规范示例（持续更新 · 开源项目）
- [MCP 火爆半年后，是时候对它"祛魅"了](https://www.infoq.cn/article/aojruzcywajsxgj00jv6) — 冷静剖析 MCP 架构本质与生态炒作（2025 · 工程博客）
- [Agent Arena Leaderboard](https://arena.ai/leaderboard/agent) — Agent 任务能力排行榜（持续更新 · 行业报告）
- [SWE-Marathon](https://www.swe-marathon.org/) — 长程软件工程基准，测 Agent 自主开发的持续作战能力（2026 · 行业报告）
- [Berkeley Function Calling Leaderboard](https://gorilla.cs.berkeley.edu/blogs/8_berkeley_function_calling_leaderboard.html) — 函数调用能力权威横评（2024 · 工程博客）
- [Hermes Agent Documentation](https://hermes-agent.nousresearch.com/docs/) — Nous 开源 Agent 框架官方文档（2026 · 官方文档）
- [Orca — Agent Development Environment](https://www.onorca.dev/) — 面向 Agent 的 ADE：多智能体编排与终端自动化（2026 · 工程博客）
- [你的 OpenClaw 真的在受控运行吗？](https://mp.weixin.qq.com/s/W1n69rhyOUVU5eKUAqGPnA) — Agent 受控运行与治理的实践探讨（2026 · 工程博客）
- [OpenClaw 维基百科条目](https://en.wikipedia.org/wiki/OpenClaw) — 现象级个人 Agent 项目全记录（持续更新 · 百科）

## 计划扩充

- [ ] Agent 开发环境（ADE）横评：Orca 类工具的多智能体编排模式
- [ ] Agent 评测体系：任务型榜单的指标解读与选型应用
- [ ] Agent 成本失控的典型案例分析
- [ ] 企业级 Agent 治理：权限、审计与合规边界
