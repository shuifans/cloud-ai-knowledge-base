---
title: 导读：版本控制与协作
outline: [2, 3]
---

# 版本控制与协作

> 以版本和审查组织可追踪变更。本域面向AI 项目管理者及协作开发者，每篇专题均可独立查阅；先从具体问题进入，再按需要补齐机制和工程边界。

## 范围与相邻领域

版本控制记录对象与历史，托管平台组织 PR/MR、Issue 和审查。平台差异与团队策略需要明确；合并、发布和部署是可以关联的不同活动。

## 专题与查阅范围

| 专题 | 要解决的问题 |
| --- | --- |
| [Git 仓库模型](/software/collaboration/git-repository-model) | 用快照、暂存区、提交父关系与引用建立 Git 和远端仓库的准确模型。 |
| [提交、差异、历史与撤销](/software/collaboration/commits-history-undo) | 读懂工作区和提交差异，按历史是否共享选择撤销办法并保留恢复线索。 |
| [分支、合并与冲突策略](/software/collaboration/branches-merges-conflicts) | 理解分支引用、共同祖先、合并和变基，处理文本冲突与语义冲突。 |
| [Pull Request 工作流](/software/collaboration/pull-request-workflow) | 把 Issue、PR/MR、审查、自动检查与合并串成有证据的协作过程。 |
| [代码审查与变更证据](/software/collaboration/code-review-evidence) | 围绕目标、风险和证据审查变更，检查业务、兼容性、安全及可维护性。 |
| [标签、版本与配置基线](/software/collaboration/tags-versions-baselines) | 区分 Git 标签、发布版本和配置基线，建立版本、制品和运行实例的追踪。 |

## 怎样开始

前置知识：文件、变更与验收。初次进入本域，可以按照上方自动导读的顺序建立概念；已经遇到具体问题时，直接查阅对应专题。阅读顺序是编辑建议，不是理解每篇文章的硬性依赖。

[看懂改动与保存版本](/software/guide/changes-and-versions) → [分支、PR、审查与合并](/software/guide/branches-review-merge) → [发布、功能开关与回滚](/software/delivery/release-rollback)提供导览或相邻专业入口。专题中的示例用于解释机制，是否适用于自己的项目，仍要检查环境、数据、风险和验证条件。

## 参考资料

<Refs>

- 本页组织领域范围与入口；技术机制、一手来源、适用版本及实际访问日期见各主文。
- 站内相关：[软件研发总览](/software/) · [场景索引](/software/reference/scenarios) · [术语索引](/software/reference/terms)

</Refs>
