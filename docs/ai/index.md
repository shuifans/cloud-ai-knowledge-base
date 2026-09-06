---
title: 人工智能：知识全景
outline: [2, 3]
---

# 人工智能：知识全景

> 人工智能是本知识体系的核心支柱。作者亲历了从传统机器学习、深度学习（DNN/CNN/RNN/GAN/YOLO）到大模型时代的完整技术演进，这一支柱按"模型—系统—应用—智能体"组织：**模型架构演进**记录每一代模型的架构解析，**AI Infra** 记录训练与推理的系统工程，**大模型应用**记录工程化落地的方法，**Agent** 记录智能体从概念分级、热点演进到框架选型的技术全景。

## 知识全景

```mermaid
flowchart TB
  subgraph 模型层
    direction LR
    M1[机器学习/深度学习经典]
    M2[大语言模型]
    M3[视觉理解/图像/视频/语音]
    M1 ~~~ M2 ~~~ M3
  end
  subgraph 基础设施层
    direction LR
    I1[GPU 集群与高速网络]
    I2[训练工程]
    I3[推理与算力]
    I1 ~~~ I2 ~~~ I3
  end
  subgraph 应用层
    direction LR
    A1[RAG 知识增强]
    A2[多模态应用]
    A3[评测与运营]
    A1 ~~~ A2 ~~~ A3
  end
  subgraph 智能体层
    direction LR
    G1[Agent 分级/编年演进]
    G2[开发框架与运行时选型]
    G1 ~~~ G2
  end
  模型层 -->|权重| 基础设施层 -->|服务| 应用层
  应用层 -->|编排成智能体| 智能体层
  智能体层 -.需求反哺.-> 模型层
```

三层共用同一个工程命题：**在质量、延迟、成本三角里做显式取舍**；智能体层则在此之上叠加"编排与治理"的命题。

## 四个子域

### 模型架构演进

从机器学习经典到多模态大模型的完整谱系：ML/DL 基础、LLM、视觉理解、图像生成、视频生成、语音——每一代模型的架构解析与演进逻辑。

→ [模型架构演进](/ai/models/)

### AI Infra

模型背后的系统工程：GPU 集群与高速网络（NVLink/RDMA/分布式存储）、训练工程（预训练/后训练/强化学习）、推理优化与算力成本。

→ [AI Infra 总览](/ai/infra/)

| 文章 | 状态 |
| --- | --- |
| [GPU 集群与高速网络](/ai/infra/cluster) | 已发布 |
| [训练工程](/ai/infra/training) | 已发布（持续扩充） |
| [大模型推理部署实战](/ai/infra/inference/llm-inference) | 已发布 |
| [GPU 选型与推理成本测算](/ai/infra/inference/gpu-sizing) | 已发布 |
| [Token 经济学：定价与成本的数学](/ai/infra/inference/token-economics) | 已发布 |

### 大模型应用

把模型能力工程化为业务价值：RAG、多模态应用、评测与运营。

→ [大模型应用](/ai/application/)

| 文章 | 状态 |
| --- | --- |
| [企业级 RAG 架构设计](/ai/application/rag-architecture) | 已发布 |
| [多模态应用](/ai/application/multimodal) | 已发布 |
| [大模型评测](/ai/application/evaluation) | 已发布 |

### Agent

把模型编排成能干活的智能体：概念分级、热点编年演进、开发框架与运行时选型。

→ [智能体技术全景](/ai/agent/)

| 文章 | 状态 |
| --- | --- |
| [Agent 热点编年史](/ai/agent/history) | 已发布 |
| [Agent 开发框架对比](/ai/agent/frameworks) | 已发布 |

## 一句话入门

大模型时代的技术栈 = **模型定义能力上限 + Infra 定义成本下限 + 应用兑现业务价值**。工程上 80% 的功夫花在"把概率性的模型输出，包进确定性的工程系统里"。
