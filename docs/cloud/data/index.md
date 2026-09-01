---
title: 导读：数据库·大数据知识框架
outline: [2, 3]
---

# 数据库 · 大数据

> 数据层是系统架构里"最难替换"的一层。计算可以重买，网络可以重拉，数据库选错一次要还很多年。这一域的核心是选型框架：业务特征 → 数据模型 → 一致性要求 → 成本与运维复杂度。

## 这个域回答什么问题

- 关系型、KV、文档、列存、时序、图数据库的边界与选型依据？
- 什么时候用云数据库（RDS/PolarDB），什么时候自建？
- 离线数仓、实时计算、数据湖如何组合成一套数据平台？

## 知识框架

```mermaid
flowchart TB
  subgraph 在线交易
    R1[关系型 RDS/PolarDB]
    R2[缓存 Redis]
    R3[文档/宽表]
  end
  subgraph 分析查询
    A1[OLAP / ClickHouse 类]
    A2[离线数仓 MaxCompute]
    A3[实时计算 Flink]
  end
  subgraph 底座
    D1[数据集成/同步 DTS]
    D2[数据湖 / 湖仓一体]
    D3[检索 Elasticsearch]
  end
  在线交易 -->|归档/分析| 分析查询
  底座 --> 在线交易
  底座 --> 分析查询
```

## 文章列表

| 文章 | 状态 | 说明 |
| --- | --- | --- |
| [数据库选型](/cloud/data/database) | 🚧 提纲 | 选型框架、读写分离、分库分表与云原生数据库 |
| [大数据体系](/cloud/data/bigdata) | 🚧 提纲 | 离线/实时/湖仓一体的典型架构与取舍 |

## 精选资源

> 筛选标准：官方与一手来源优先，近两年内容优先，经典明确标注。更新于 2026-09-01。

### 数据库

- [Amazon Aurora: Design considerations](https://www.amazon.science/publications/amazon-aurora-design-considerations-for-high-throughput-cloud-native-relational-databases) — 云原生数据库存算分离奠基论文，"日志即数据库"思想源头（2017 · 论文）
- [The lakebase architecture — Neon Docs](https://neon.com/docs/introduction/architecture-overview) — Serverless Postgres 存算分离架构官方详解（2026 · 官方文档）
- [Redis 8 GA: Fast, scalable, and feature-rich](https://redis.io/blog/redis-8-ga/) — Redis 8 官方发布：性能优化与 Vector Sets（2025 · 官方文档）
- [美团万亿级 KV 存储架构与实践](https://tech.meituan.com/2020/07/01/KV-Squirrel-Cellar.html) — 自研 KV 存储演进与一线踩坑复盘（2020 · 工程博客）

### 分析引擎

- [ClickHouse — Lightning Fast Analytics for Everyone (PVLDB Vol.17)](https://www.vldb.org/pvldb/vol17/p3731-schulze.pdf) — ClickHouse 首篇官方论文，列存与向量化执行全景（2024 · 论文）
- [Slash your cost by 90% with Apache Doris 存算分离](https://doris.apache.org/blog/doris-compute-storage-decoupled/) — 存算分离的成本、弹性与负载隔离设计（2025 · 工程博客）

### 大数据计算与湖仓

- [Apache Flink 2.0.0: A new Era of Real-Time Data Processing](https://flink.apache.org/2025/03/24/apache-flink-2.0.0-a-new-era-of-real-time-data-processing/) — Flink 2.0 官方发布：API 变更与流批一体方向（2025 · 官方文档）
- [Apache Spark 4.0.0 Release Notes](https://spark.apache.org/releases/spark-release-4-0-0.html) — Spark 4.0 发布说明：VARIANT、ANSI 模式与迁移要点（2025 · 官方文档）
- [什么是 MaxCompute](https://help.aliyun.com/zh/maxcompute/product-overview/what-is-maxcompute) — Serverless 离线数仓架构与场景（2026 · 官方文档）
- [Spec — Apache Iceberg](https://iceberg.apache.org/spec/) — 湖仓表格式权威规范（2025 · 官方文档）
- [vivo 基于 Paimon 的湖仓一体架构设计优化与迁移](https://developer.aliyun.com/article/1656030) — 湖仓一体落地复盘：选型、优化与迁移（2025 · 工程博客）

### 经典

- [Vonng/ddia —《数据密集型应用系统设计》中文翻译](https://github.com/Vonng/ddia) — 数据系统架构公认经典的中文开源翻译（2017 · 开源项目）

## 一句话入门

数据库选型的本质是**为数据访问模式选最优的数据结构 + 一致性级别 + 运维形态**——先问访问模式，再谈产品。
