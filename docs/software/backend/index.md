---
title: 导读：后端与接口工程
outline: [2, 3]
---

# 后端与接口工程

> 落实业务、契约、权限与外部系统交互。本域面向后端开发者及接口验收者，每篇专题均可独立查阅；先从具体问题进入，再按需要补齐机制和工程边界。

## 范围与相邻领域

关注服务处理请求、落实业务和访问外部系统的边界。HTTP 契约与身份权限是基础，异步任务需要处理重复和失败；数据库、平台治理与集群机制由对应主文深入解释。

## 专题与查阅范围

| 专题 | 要解决的问题 |
| --- | --- |
| [服务与请求生命周期](/software/backend/service-lifecycle) | 沿接入、验证、业务处理和响应理解服务生命周期，管理超时、连接与退出。 |
| [HTTP、API 与接口契约](/software/backend/http-api-contracts) | 将 HTTP 语义、资源、错误和兼容性写入接口契约，避免传输成功掩盖业务失败。 |
| [业务逻辑、规则与状态机](/software/backend/business-state-machines) | 以不变量和状态机落实业务规则，让状态转换、权限及并发判断可验证。 |
| [身份认证、会话与权限](/software/backend/authentication-authorization) | 区分认证、会话和授权，检查令牌生命周期、对象权限及服务端执行边界。 |
| [消息、任务、调度与幂等](/software/backend/messages-jobs-idempotency) | 设计消息、后台任务和调度，用幂等、确认与重试处理重复和失败。 |
| [第三方集成与 Webhook](/software/backend/integrations-webhooks) | 以签名、去重、重放和兼容性约束外部集成，防止第三方失败扩散。 |
| [后端框架、性能与资源管理](/software/backend/backend-frameworks-performance) | 按请求模型、生态和资源约束选择后端框架，管理连接池、阻塞和背压。 |

## 怎样开始

前置知识：HTTP、模块与数据。初次进入本域，可以按照上方自动导读的顺序建立概念；已经遇到具体问题时，直接查阅对应专题。阅读顺序是编辑建议，不是理解每篇文章的硬性依赖。

[需求如何穿过界面、接口与数据库](/software/guide/request-through-system) → [数据模型、关系与约束](/software/data/data-models) → [分布式一致性与部分失败](/software/architecture/distributed-failure)提供导览或相邻专业入口。专题中的示例用于解释机制，是否适用于自己的项目，仍要检查环境、数据、风险和验证条件。

## 参考资料

<Refs>

- 本页组织领域范围与入口；技术机制、一手来源、适用版本及实际访问日期见各主文。
- 站内相关：[软件研发总览](/software/) · [场景索引](/software/reference/scenarios) · [术语索引](/software/reference/terms)

</Refs>
