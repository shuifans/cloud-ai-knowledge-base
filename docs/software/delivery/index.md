---
title: 导读：构建交付与部署
outline: [2, 3]
---

# 构建交付与部署

> 从可追溯构建到可控发布与回退。本域面向开发者、平台人员及上线负责人，每篇专题均可独立查阅；先从具体问题进入，再按需要补齐机制和工程边界。

## 范围与相邻领域

关注从源码版本、构建输入和制品来源到可控部署、发布与回退。应用环境与基础设施状态需分别追踪；Kubernetes 调度及云平台架构复用云原生主文。

## 专题与查阅范围

| 专题 | 要解决的问题 |
| --- | --- |
| [构建与 CI 流水线](/software/delivery/build-ci) | 用固定输入构建可追溯制品，把 CI 检查、来源和交付证据连接起来。 |
| [环境、配置与基础设施即代码](/software/delivery/environments-iac) | 管理环境差异、配置和基础设施声明，检查状态、漂移和变更计划。 |
| [容器、镜像与打包](/software/delivery/containers-images) | 区分镜像、容器和宿主资源，评估打包、隔离、来源及运行配置。 |
| [托管、部署与平台工程](/software/delivery/hosting-platforms) | 按工作负载、责任、约束和退出成本选择托管及部署方式，明确平台接口。 |
| [域名、DNS、HTTPS 与入口](/software/delivery/dns-https) | 连接域名解析、入口路由和 TLS 信任，分层判断访问与证书故障。 |
| [发布、功能开关与回滚](/software/delivery/release-rollback) | 区分部署与发布，以渐进流量、功能开关和兼容策略控制回退风险。 |

## 怎样开始

前置知识：版本控制、环境与网络。初次进入本域，可以按照上方自动导读的顺序建立概念；已经遇到具体问题时，直接查阅对应专题。阅读顺序是编辑建议，不是理解每篇文章的硬性依赖。

[从本地到线上](/software/guide/local-to-production) → [安全发布、观察与回退](/software/guide/release-observe-rollback) → [SLO、健康检查与值守](/software/operations/slo-health-oncall)提供导览或相邻专业入口。专题中的示例用于解释机制，是否适用于自己的项目，仍要检查环境、数据、风险和验证条件。

## 参考资料

<Refs>

- 本页组织领域范围与入口；技术机制、一手来源、适用版本及实际访问日期见各主文。
- 站内相关：[软件研发总览](/software/) · [场景索引](/software/reference/scenarios) · [术语索引](/software/reference/terms)

</Refs>
