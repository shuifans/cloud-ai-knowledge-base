---
title: 模型训练导读
outline: [2, 3]
---

# 模型训练

> 训练是 AI 三层结构的起点：把数据和算力变成模型权重。对解决方案架构师而言，理解训练不是为了亲自训模型，而是为了**判断客户的模型从哪来、成本结构长什么样、私有化微调是否值得**——这些问题决定了后续推理与应用层的所有方案。

## 这个子域回答什么问题

- 预训练、继续预训练、SFT、LoRA、RLHF/DPO 各自解决什么问题、成本差多少？
- 训练集群的工程难点：并行策略、checkpoint、故障容错为什么这么贵？
- 什么时候用云训练平台（PAI 类），什么时候自建？
- 私有化微调的决策框架：数据、效果、成本的三角验证

## 知识框架

```mermaid
flowchart TB
  subgraph 训练范式
    P1[预训练 Pretrain]
    P2[继续预训练 CPT]
    P3[指令微调 SFT]
    P4[高效微调 PEFT/LoRA]
    P5[对齐 RLHF/DPO]
  end
  subgraph 训练工程
    E1[数据工程 清洗/配比/去重]
    E2[分布式并行 DP/TP/PP]
    E3[Checkpoint 与容错]
    E4[训练可观测]
  end
  subgraph 基础设施
    H1[GPU 集群与网络]
    H2[高性能存储]
    H3[调度与资源池]
  end
  训练范式 --> 训练工程 --> 基础设施
```

## 要点提纲

### 训练范式光谱：成本与效果的阶梯

| 范式 | 改变什么 | 相对成本 | 典型用途 |
| --- | --- | --- | --- |
| 预训练 | 从零学语言与世界知识 | 极高（千卡月级） | 基座模型厂商 |
| 继续预训练 | 注入领域语料 | 高 | 行业基座（金融/医疗） |
| SFT | 学会指令格式与任务 | 中 | 让基座"听话" |
| LoRA/PEFT | 少量参数适配 | 低 | 风格/轻量领域适配 |
| RLHF/DPO | 对齐人类偏好 | 中高 | 安全性与偏好塑造 |

实践口径：企业落地 90% 的需求落在 **SFT + LoRA** 区间；"要不要预训练"的答案几乎总是"不要"。

### 训练工程的三个贵

- **并行策略**：数据并行扩吞吐、张量/流水线并行破单卡显存墙——组合选择决定集群拓扑
- **Checkpoint 风暴**：千卡集群上保存一次状态的 IO 开销巨大，频率是容错与效率的权衡
- **故障是常态**：千卡训练的日均故障率不可忽视，自动恢复与断点续训是集群工程的及格线

### 微调决策框架（SA 视角）

1. **先评测后微调**：基座 + RAG/Prompt 能达到 80 分，就不要为最后 10 分付微调的成本
2. **数据质量 > 数据数量**：千条高质量标注样本的 SFT 常胜过十万条噪音
3. **算清总账**：微调成本 = 训练算力 + 数据标注 + 模型维护（每次基座升级都要重来）——最后一项最容易被漏算

## 计划补充

- [ ] 分布式并行策略详解（DP/TP/PP/ZeRO 与集群拓扑）
- [ ] 云训练平台与自建集群的成本对比模型
- [ ] 一次私有化微调项目的完整复盘（脱敏）

## 精选资源

> 筛选标准：官方与一手来源优先，近两年内容优先，经典明确标注。更新于 2026-09-01。

### 预训练与大规模集群

- [DeepSeek-V3 Technical Report](https://arxiv.org/abs/2412.19437) — 千亿 MoE 低成本训练全复盘，架构与工程细节齐备（2024 · 论文）
- [The Llama 3 Herd of Models](https://arxiv.org/abs/2407.21783) — 1.6 万卡集群预训练过程与故障复盘（2024 · 论文）
- [MegaScale: Scaling LLM Training to More Than 10,000 GPUs](https://arxiv.org/abs/2402.15627) — 万卡训练实践：故障诊断、检查点与容错设计（2024 · 论文）
- [The Ultra-Scale Playbook: Training LLMs on GPU Clusters](https://huggingface.co/spaces/nanotron/ultrascale-playbook) — 系统讲透显存与 ZeRO/TP/CP/PP 并行的训练指南（2025 · 课程教程）
- [大模型在超大规模集群性能提升实践](https://www.infoq.cn/article/bcvHd1zutZqjWL0iBQFE) — 万卡集群一手优化经验：并行选型与通信瓶颈（2025 · 工程博客）
- [从 0 手撕 LLM 分布式训练：DP, ZeRO, TP, PP, CP, EP](https://developer.volcengine.com/articles/7526781261617037355) — 中文从零推导六大并行策略（2025 · 工程博客）

### 微调与对齐

- [LoRA: Low-Rank Adaptation of Large Language Models](https://arxiv.org/abs/2106.09685) — 低秩高效微调的奠基之作（2021 · 论文）
- [Practical Tips for Finetuning LLMs Using LoRA](https://magazine.sebastianraschka.com/p/practical-tips-for-finetuning-llms) — 实验讲透 rank/alpha 等超参调优，极具实操性（2023 · 工程博客）
- [Direct Preference Optimization (DPO)](https://arxiv.org/abs/2305.18290) — 直接偏好优化取代 RLHF 的对齐里程碑（2023 · 论文）
- [从 RLHF 到 DPO：多种人类偏好对齐算法原理对比](https://developer.aliyun.com/article/1559136) — 中文对比各对齐算法原理，推导清晰（2024 · 工程博客）
- [想训大模型？这里有一份避坑指南](https://hub.baai.ac.cn/view/25052) — 预训练数据、超参、loss 尖峰等常见坑系统总结（2023 · 工程博客）

### 数据工程

- [FineWeb: decanting the web for the finest text data at scale](https://huggingface.co/spaces/HuggingFaceFW/blogpost-fineweb-v1) — 15T token 预训练语料构建管线与消融实验全公开（2024 · 工程博客）

## 参考与衔接

- 训练完成后的下一站：[大模型推理部署实战](/ai/inference/llm-inference)
- 算力侧的测算方法：[GPU 选型与推理成本测算](/ai/inference/gpu-sizing)
