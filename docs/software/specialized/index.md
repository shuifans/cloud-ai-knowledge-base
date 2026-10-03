---
title: 导读：专项开发
outline: [2, 3]
---

# 专项开发

> 明确平台约束与扩展入口。本域面向选择开发形态者及跨领域开发者，每篇专题均可独立查阅；先从具体问题进入，再按需要补齐机制和工程边界。

## 范围与相邻领域

覆盖不同开发形态的运行模型、额外约束与深入入口，不穷举语言或产品。通用需求、版本、测试和交付方法依然适用，但宿主生命周期、权限、实时性和分发规则需要另行验证。

## 专题与查阅范围

| 专题 | 要解决的问题 |
| --- | --- |
| [移动应用开发基础](/software/specialized/mobile) | 理解移动生命周期、离线、权限和分发约束，选择原生或跨平台工程路径。 |
| [桌面应用开发基础](/software/specialized/desktop) | 理解桌面进程、系统集成、安装更新和平台差异，控制应用权限与交付边界。 |
| [CLI 与自动化工具](/software/specialized/cli-automation) | 设计 CLI 的参数、输出、退出码和幂等性，使自动化可组合、可诊断和可恢复。 |
| [浏览器扩展](/software/specialized/browser-extensions) | 理解扩展页面、内容脚本和后台上下文，约束宿主权限、消息与分发。 |
| [游戏软件工程基础](/software/specialized/games) | 围绕游戏循环、状态、资源与确定性安排工程，区分实时性能和通用业务服务。 |
| [嵌入式、物联网与实时约束](/software/specialized/embedded-iot) | 把设备资源、时序、通信和物理故障纳入嵌入式及物联网研发与升级验证。 |
| [音视频与实时通信](/software/specialized/realtime-media) | 连接采集、编码、传输和播放，按延迟、丢包与同步要求选择实时媒体方案。 |
| [AI 应用工程入口](/software/specialized/ai-applications) | 把通用应用工程连接到模型、检索和 Agent，明确 AI 应用质量与安全的新边界。 |

## 怎样开始

前置知识：程序、系统与通用工程。初次进入本域，可以按照上方自动导读的顺序建立概念；已经遇到具体问题时，直接查阅对应专题。阅读顺序是编辑建议，不是理解每篇文章的硬性依赖。

[软件项目全景：从操作到交付](/software/guide/software-project-overview) → [架构决策与验证](/software/architecture/architecture-decisions) → [质量模型与验证策略](/software/quality/quality-strategy)提供导览或相邻专业入口。专题中的示例用于解释机制，是否适用于自己的项目，仍要检查环境、数据、风险和验证条件。

## 参考资料

<Refs>

- 本页组织领域范围与入口；技术机制、一手来源、适用版本及实际访问日期见各主文。
- 站内相关：[软件研发总览](/software/) · [场景索引](/software/reference/scenarios) · [术语索引](/software/reference/terms)

</Refs>
