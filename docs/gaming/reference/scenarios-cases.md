---
title: 场景与案例索引
outline: [2, 3]
lastReviewed: 2026-10-04
reviewScope: 场景到主文的映射、公开机制资料和虚构示例的分类；没有记录真实客户实施收益
---

# 场景与案例索引

本页以工作问题定位知识。当前收录的是公开机制资料与虚构设计示例；虚构示例用于解释方法，未执行的方案不登记为已验证成效。

## 从问题找到调研和验证入口

| 场景 | 先弄清什么 | 主文与验证入口 |
| --- | --- | --- |
| 美术交付慢、返工多 | 创作、审查、规范、工具和集成分别耗时多少 | [资产生产](/gaming/production/asset-pipeline) · [AI 验收](/gaming/ai/scenarios-evaluation) |
| 构建与发布拖慢版本 | 排队、计算、依赖、失败及重跑 | [版本发布](/gaming/production/version-release) · [构建 CI](/software/delivery/build-ci) |
| 开服或活动时登录困难 | 登录、排队、区服、数据库和依赖分别表现如何 | [云需求](/gaming/systems/cloud-workloads) · [可观测](/cloud/native/observability) |
| 对局卡顿或匹配慢 | 帧时间、网络、服务模拟与匹配池分别怎样 | [云需求](/gaming/systems/cloud-workloads) · [游戏软件工程](/software/specialized/games) |
| 奖励重复、到账延迟或争议 | 资格、权威结算、发放标识与业务记录 | [策划规则](/gaming/design/planning-deliverables) · [业务系统](/gaming/systems/cloud-workloads) |
| 服务器费用高 | 会话、资源利用、地区与服务目标 | [云需求](/gaming/systems/cloud-workloads) · [FinOps](/cloud/architecture/finops) |
| 买量效果不稳定 | 流量结构、素材、产品承接与观察窗口 | [发行增长](/gaming/publishing/distribution-growth) · [经营指标](/gaming/analytics/metrics) |
| 活动数据上涨但留存未改善 | 群组、事件、同期因素与长期影响 | [运营](/gaming/operations/liveops-player-service) · [指标](/gaming/analytics/metrics) |
| 客服重复问题多 | 问题根因、知识版本、权限与转人工 | [玩家服务](/gaming/operations/liveops-player-service) · [RAG](/ai/application/rag-architecture) |
| 出海上线准备不完整 | 市场、语言、平台、支付与数据责任 | [出海协作](/gaming/globalization/localization-governance) |
| 希望引入 AI NPC | 游戏价值、角色约束、延迟、资产权限与成本 | [AI 场景](/gaming/ai/scenarios-evaluation) |
| 不清楚和谁讨论方案 | 工作执行者、结果负责人、技术与预算责任 | [岗位](/gaming/organization/roles) · [业务调研](/gaming/reference/discovery) |

## 已收录的资料与示例

| 条目 | 类型 | 可以帮助理解 | 不代表什么 |
| --- | --- | --- | --- |
| [公开制作阶段](/gaming/production/lifecycle) | 基于育碧公开流程的机制参考 | 阶段验证与内容生产 | 所有公司的统一流程或周期 |
| [Steam 发布与归因](/gaming/publishing/distribution-growth) | 平台公开机制 | 商店交付、发布和来源统计 | 其他平台能力或完整营销因果 |
| [角色资产入库](/gaming/production/asset-pipeline) | 虚构工作流与 Epic 文档参考 | 跨专业交接、格式与运行验证 | 实际引擎测试或效率提升 |
| [合作副本奖励](/gaming/design/planning-deliverables) | 虚构设计示例 | 权威结算、规则与异常验收 | 真实游戏业务规则 |
| [投放回收计算](/gaming/analytics/metrics) | 虚构算例 | CPI、ROAS、观测 LTV 的关系 | 行业均值、利润或未来回收保证 |
| [文件下载分发](/gaming/systems/cloud-workloads) | 阿里云中国站公开文档参考 | 文件缓存与更新分发 | 真实项目效果或实时对战加速 |

## 新案例如何收录

新增案例建议按“背景—业务问题—原流程—干预—验证—结果—适用边界”记录。至少保留资料来源、公开状态、观察时间、地区、版本、指标口径以及未解决的问题。

区分四类证据：官方机制说明、公开实施材料、实际执行记录、设计示例。供应商材料中的效果数字应保留原条件与归属，不自动当作独立验证；未公开的项目名称、人员、合同、数据和系统信息不进入公开正文。

## 参考资料

<Refs>

- 具体来源随表中主文维护，本页不重复推导效果数字。
- 站内相关：[业务调研方法](/gaming/reference/discovery) · [岗位与流程索引](/gaming/reference/roles-workflows) · [术语表](/gaming/reference/terms)

</Refs>
