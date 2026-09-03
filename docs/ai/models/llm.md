---
title: 大语言模型架构解析
outline: [2, 3]
---

# 大语言模型架构解析

> 从 GPT 到推理模型，大语言模型的架构演进只有一条主线：**在 Transformer 骨架上，不断寻找"规模换能力"的最优结构**。这篇解析这条主线上的每个关键节点：自回归生成为什么让 KV Cache 成为推理成本核心、规模化律如何改写预训练预算、预训练到对齐的后训练管线、稠密与 MoE 的分野、MLA 类注意力压缩、推理模型的"思考"机制，以及开源权重谱系与架构选择对部署账单的影响。
> 目标读者是要做模型选型或推理方案设计的架构师与工程师；读完应能把"模型卡片上的架构特性"翻译成"我的部署要花多少钱、能扛多少并发"。

## 开篇：一个骨架与三个成本旋钮

对 LLM 的全部理解可以压缩成一句话：

> **模型在玩"预测下一个 token"的文本接龙；每生成一步，都要回看之前全部上下文，而这份上下文以 KV Cache 的形式被缓存下来。**

由此展开推理成本的三个旋钮（后文所有架构分析都建立在这个骨架上，推理侧展开见 [推理部署实战](/ai/infra/inference/llm-inference)）：

1. **算力**：生成是串行的，一个 token 一次前向；长输入的首段计算（Prefill）受算力约束
2. **显存容量**：权重（由总参数量决定）+ KV Cache（随会话长度线性增长）
3. **显存带宽**：逐字生成阶段每步计算量小，却要把权重与 KV 全部读一遍，受带宽约束

近五年的架构演进，大半可以解读为"在不损能力的前提下拧小这三个旋钮"：MoE 拧算力、GQA/MLA 拧 KV Cache、稀疏注意力拧长上下文计算，推理模型则反其道行之——主动加算力换质量。

## 预训练范式：一切的起点

```mermaid
flowchart LR
  A[自监督预训练<br/>海量无标注语料] --> B[三种路线]
  B --> C[Encoder-only<br/>BERT: 理解]
  B --> D[Decoder-only<br/>GPT: 生成]
  B --> E[Encoder-Decoder<br/>T5: 转换]
  D --> F[In-Context Learning 涌现]
  F --> G[指令微调 + 对齐]
  G --> H[对话式通用助手]
```

- **自监督目标**：GPT 的"预测下一个 token"看似朴素，却是已知扩展性最好的学习目标——损失函数简单、数据无限、规模可加
- **Decoder-only 胜出的原因**：统一的生成式目标（一切任务皆可生成）、推理时 KV Cache 友好、训练目标与使用方式完全一致。BERT 系在理解任务上并非失败，而是"生成统一理解"的路线赢了
- **涌现能力**：规模跨过阈值后，少样本学习、思维链、指令跟随相继出现——GPT-3（2020，175B 参数）是"规模换能力"的分水岭，Scaling Law（算力/数据/参数的幂律）从经验观察变成了工程预算工具

Transformer 本身 2017 年为机器翻译而生：纯注意力取代循环与卷积，训练彻底并行化——8 卡 GPU 训 3.5 天即刷新 WMT'14 翻译纪录（英德 28.4 / 英法 41.8 BLEU）。真正改变历史的，是此后把 Decoder 半边单独拿出来、以"预测下一个 token"为唯一目标的组合。

![Transformer 架构：编码器（左）与解码器（右），每层由自注意力子层与前馈子层构成，残差连接与归一化并列](/images/ai/models/llm/transformer-architecture.png)

*图源：Attention Is All You Need 论文图 1（[arXiv:1706.03762](https://arxiv.org/abs/1706.03762)）*

### 自回归生成：为什么 KV Cache 是推理成本核心

自回归推理的两个阶段，瓶颈画像完全不同：

| 阶段 | 做什么 | 瓶颈 |
| --- | --- | --- |
| 预填充（Prefill） | 输入 token 并行计算，产出 KV Cache | 算力受限，输入越长 FLOPs 越高 |
| 逐字生成（Decode） | 逐个 token 生成，每步回看全部历史 | 带宽受限，并发数受 KV Cache 显存钳制 |

KV Cache 就是"全部前文的记忆"：每一层注意力都要保存每个历史 token 的 Key/Value 向量，体量随层数 × KV 头数 × 上下文长度线性增长。粗算一笔：某 70B 级 GQA 模型（80 层、8 个 KV 头、头维 128、FP16），单 token 的 KV 约 320KB——**128K 上下文的单个请求要吃掉约 40GB 显存，比模型权重本身还大一个量级**。推理服务的并发能力与长上下文成本，本质上都是 KV Cache 的管理问题；vLLM 的 PagedAttention 借鉴操作系统虚拟内存，把 KV 分页、非连续分配、消除碎片，仅这一项就带来数倍吞吐提升（细节见 [推理部署实战](/ai/infra/inference/llm-inference)）。

## Transformer 的关键工程细节

今天的主流模型都是"Transformer + 一组补丁"：

- **Pre-Norm 与残差**：深层稳定训练的基础；每层 = 注意力子层 + FFN 子层，均带残差与归一化
- **RoPE 旋转位置编码**：相对位置的优雅表达，天然支持长度外推，是当前长上下文模型的标配（配 NTK/YaRN 类缩放进一步拉长）
- **GQA（分组查询注意力）**：多个 Query 头共享一组 KV，大幅压缩 KV Cache——上例中 KV 头从 64 减到 8 即 8 倍压缩，是推理成本优化的架构级手段
- **FFN 的膨胀**：FFN 占模型参数的大头，也是知识存储的主要载体——MoE 动的正是这块

## 规模化律：从暴力堆参数到预算工具

预训练的"花钱方式"被两个节点改写：

1. **Scaling Law（GPT-3 时代）**：损失随算力、数据、参数呈幂律下降——对数坐标下是直线。"堆大就变强"从信仰变成可外推的工程预测
2. **Chinchilla 修正（2022）**：DeepMind 训练 400 余个规模不等的模型后给出结论——**参数量与训练 token 数必须等比扩张**，模型翻倍则数据翻倍。70B 的 Chinchilla 以与 280B Gopher 相同的算力、4 倍的数据（1.4T token），全面超越后者（MMLU 67.5%，高出 7 个百分点以上）。震撼之处在于：当时的大模型普遍"欠训"

三个工程后果随之而来：

- **LLaMA 路线**：既然推理成本也要进目标函数，就用小模型吃远超最优配比的数据（"过训"）。LLaMA-1（2023，7B–65B）证明 13B 过训模型能在多数基准超过 GPT-3 175B，并靠开放权重点燃了开源生态——今天 7B/14B/32B 的稠密小模型全是这条路
- **数据墙显现**：截至 2026-09，前沿模型预训练语料已达 10–20T token 量级，高质量网络文本趋近枯竭，合成数据与语料精炼成为数据工程主战场
- **规模化律变成预算工具**：训练前按算力预算反推模型与数据的配比、预测损失曲线再决定是否立项——预训练从"赌规模"变成"做预算"，集群与成本侧展开见 [GPU 集群与高速网络](/ai/infra/cluster)、[训练工程](/ai/infra/training)

## 从预训练到对齐：后训练管线

预训练模型只是"文本接龙引擎"：不会对话、不听指令，还会输出有害内容。InstructGPT（2022）确立的三阶段管线，把它变成了今天可用的"产品"：

| 阶段 | 做什么 | 数据 | 成本特征 |
| --- | --- | --- | --- |
| 预训练 | 学语言与世界知识 | 万亿级 token 无标注语料 | 占绝对多数算力 |
| SFT 指令微调 | 学"当助手"的格式与行为 | 数万至数百万条高质量指令对 | 算力低，数据质量杠杆极高 |
| 对齐强化学习 | 学"什么回答更好" | 人类偏好对比 / 可验证奖励 | 算力中等，决定体验上限 |

两个关键事实：

- **对齐是杠杆率极高的投入**：InstructGPT 论文中，1.3B 的对齐模型在人类评估里胜过 175B 的原始 GPT-3——参数量差百倍，体验反超
- RLHF（奖励模型 + PPO）成为标配后又分出一条谱系：**DPO** 跳过奖励模型直接用偏好对优化，工程更简单；**Constitutional AI（RLAIF）** 用 AI 反馈替代部分人工标注，解决无害性数据的规模与一致性问题；2025 年的推理模型浪潮再把 **RLVR**（可验证奖励的强化学习）推上前台——数学、代码等可自动判分的领域成为推理能力的训练场，这正是 o1/R1 的技术底座（详见 [训练工程](/ai/infra/training)）

## MoE：稀疏激活的效率革命

- **机制**：FFN 替换为多个专家网络 + 路由器，每个 token 只激活 top-k 个专家——**总参数大（能力上限高），激活参数小（推理计算成本低）**
- **演进**：Switch Transformer（2021，单专家路由，把路由简化到极致、参数推向万亿级）→ Mixtral 8x7B（2024，8 选 2，47B 总参数仅激活约 13B，开源 MoE 引爆点）→ DeepSeekMoE → DeepSeek-V3（细粒度专家 + 共享专家 + 无辅助损失负载均衡；671B 总参数/37B 激活，14.8T token 预训练，全程 2.788M H800 GPU 时——按论文假设的 2 美元/卡时折算约 560 万美元）
- **工程代价**：显存占用由总参数决定（专家都要加载），通信模式改变（EP 专家并行 + All-to-All），负载均衡是训练难点（路由失衡既浪费专家容量又制造热点）
- **架构启示**：MoE 证明了"稀疏化"是规模与成本矛盾的正解——这个思想正在向推理侧延伸（稀疏注意力、动态推理深度等）

![DeepSeek-V3 架构：下半部为 MLA 注意力（KV 压缩进低维潜向量），上半部为 DeepSeekMoE（路由器分发至细粒度专家 + 共享专家）](/images/ai/models/llm/deepseek-v3-architecture.png)

*图源：DeepSeek-V3 Technical Report 图 2（[arXiv:2412.19437](https://arxiv.org/abs/2412.19437)）*

MoE 的定价是双面的：API 厂商按激活参数计价（算力成本真实），**单价显得很便宜**；私有化部署却要为总参数买单（显存成本真实），**部署门槛高于同能力的稠密模型**。这个不对称直接决定了下文的选型逻辑。

## MLA 与注意力压缩：KV Cache 的显存战争

MoE 解决"算力"，注意力压缩解决"显存"。压缩谱系是：MHA（每头独享 KV）→ MQA（全体共享一组）→ GQA（分组共享）→ MLA（压进潜向量）：

![四种注意力结构对比：MHA、MQA、GQA 直接削减 KV 头数，MLA 则把 K 与 V 联合压缩为共享低维潜向量，计算时再低秩还原](/images/ai/models/llm/deepseek-mla-comparison.png)

*图源：DeepSeek-V2 论文图 3（[arXiv:2405.04434](https://arxiv.org/abs/2405.04434)）*

MLA（Multi-head Latent Attention，DeepSeek-V2 于 2024 年首创）把所有头的 K、V 联合压缩成一个低维潜向量，缓存时只存潜向量，单 token KV 体积降一个量级。官方报告的对照数字：相比前代稠密模型，DeepSeek-V2 的 **KV Cache 减少 93.3%，最大生成吞吐提升至 5.76 倍**。工程含义很直接：

- **并发直接抬升**：单请求显存下降，同一张卡能承载的会话数同比例上升
- **长上下文变得经济**：128K 上下文从"演示能力"变成"可日常使用"
- **与 PagedAttention 叠加**：分页管理 + 压缩后的 KV，两项收益相乘

2025-09，DeepSeek 进一步开源 DSA（DeepSeek Sparse Attention）：用轻量索引器为每个查询先粗筛，只对 top-k 个相关 token 做全注意力，把长上下文的计算复杂度也降了下来——这是 V3.2 敢大幅下调长上下文定价的架构底气。至此，注意力完成了"结构稀疏（MLA）→ 计算稀疏（DSA）"两步。

## 长上下文：从 8K 到百万级

- **三段式演进**：位置编码外推（RoPE 缩放）→ 注意力稀疏化/分层（滑动窗口、YaRN、DSA）→ 检索与记忆分层（KV 压缩、外部记忆）
- **成本真相**：长上下文的瓶颈是 KV Cache 的显存与带宽，不是计算——"支持 1M 上下文"与"用得起 1M 上下文"是两回事
- **与 RAG 的关系**：不是替代而是分工——长上下文管会话内，RAG 管知识库，两者在"上下文工程"里统一调度

## 推理模型：推理时计算（Reasoning）

- **范式转变**：从"训练时把能力压进权重"到"推理时用更多计算换更高质量"——OpenAI o1（2024-09，用大规模强化学习训练思维链）是开创者；DeepSeek-R1（2025-01，不依赖人工推理标注的纯 RL 路线并开源权重）是开源引爆点
- **技术要点**：思考 token 就是生成在专门推理区里的普通文本，其长度即"思考时长"；RLVR 的奖励来自可自动判分的结果（答案对错、测试通过与否）；推理预算可按任务难度调节——Qwen3 的思考/非思考双模式（截至 2026-09）已是开源旗舰标配
- **成本结构影响**：推理模型的输出 = 思考 token + 答案 token，单价与延迟都要按"思考预算"重新测算——传统的"输入/输出价格"模型被改写；思考区通常不完整展示给用户，但足额计费
- **与 Agent 的合流**：长程推理能力是 Agent 处理复杂任务的前提，两条技术线在这里交汇（参见 [Agentic 支柱](/agentic/)）；V3.2 一类模型已把"推理 + 工具调用"的合成训练管线作为核心能力来建设

## 开源权重谱系：从 LLaMA 到 DeepSeek

五代开源权重，各解决了一个不同的问题（截至 2026-09）：

| 世代 | 代表 | 解决的问题 |
| --- | --- | --- |
| 2023 | LLaMA 1/2 | 纯公开数据训练可行，过训路线成立，开放权重成势 |
| 2024 | Mixtral / Qwen2 / DeepSeek-V2 | MoE、MLA 等效率架构开源，对标闭源 |
| 2025 | DeepSeek-V3/R1、Qwen3 | 纯 RL 推理与架构创新成为主流，价格打至闭源 1/10 量级 |
| 2025–2026 | DeepSeek-V3.2、Qwen3.5 系、GLM-5 系 | 稀疏注意力、原生多模态、长程 Agent |

这条谱系也给出一个选型事实：**开源旗舰的能力差距在收敛，真正的差异在工程生态**——推理引擎（vLLM/SGLang）的支持速度与成熟度、量化方案、Agent 框架适配，往往比基准分数更影响落地体验。多模态方向的开源进展见 [多模态应用](/ai/application/multimodal)，更早的脉络见 [机器学习与深度学习经典](/ai/models/ml-dl)。

## 架构选择如何影响部署成本

把本文的架构特性逐一映射到推理侧：

| 架构特性 | 改变了什么 | 成本含义 |
| --- | --- | --- |
| 总参/激活分离（MoE） | 算力随激活、显存随总参 | API 单价低；私有化显存门槛高 |
| GQA / MLA | 单 token KV 体积 | 并发数、长上下文显存 |
| 稀疏注意力（DSA 类） | 长上下文注意力计算 | 长输入定价、长文档延迟 |
| 推理模式 | 输出 token 量 | 输出账单与延迟成倍上升 |
| 线性注意力/混合架构 | 长序列计算复杂度 | 1M+ 上下文的成本天花板 |

架构与推理引擎的耦合比想象中深：PagedAttention、FP8 KV Cache、前缀缓存、专家并行调度——推理工程清单上的每一项，都对应上面某个架构特性。评估模型时应把"主流引擎对它的支持程度"放进检查表（例如 DSA 发布当天即获 vLLM/SGLang 适配，这种速度本身就是竞争力的一部分）。

## 旗舰演进速览（2025–2026，更新于 2026-09）

**推理模型线**：o1（2024-09，开创者）→ **DeepSeek-R1**（2025-01，纯 RL + 开源引爆点）→ o3/o4-mini → DeepSeek-V3.2（2025-12，**DSA 稀疏注意力**大幅降低长上下文成本）→ V4（2026-04，主攻编程）

**开源旗舰线（2026）**：

| 机构 | 代表 | 要点 |
| --- | --- | --- |
| 阿里 Qwen | Qwen3.5（2026-02）/3.8 | 原生多模态、混合注意力；Qwen3-Next 首创 3:1 线性注意力混合架构 |
| DeepSeek | V3.2 → V4 | DSA 稀疏注意力 + MoE+MLA，性价比标杆 |
| 智谱 | GLM-5（2026-02）→ 5.2 | 744B MoE，定位"从 Vibe Coding 到智能体工程" |
| 月之暗面 | Kimi K2 Thinking（2025-11）→ K3 | 200-300 次连续工具调用的长程 Agent 里程碑 |
| MiniMax | M3（2026-06） | 前沿编程 + 1M 上下文 + 原生多模态三合一 |

**闭源对照**：GPT-5 → 5.5（2026-04）；Claude Opus 4.x → Opus 5（2026-07）；Gemini 3 Pro（2025-11，3.5 Pro 持续跳票）

**关键技术趋势**：
1. **MoE 极致稀疏化**：激活占比压到 3-5%，"大总参、小激活"成为开源标配
2. **注意力架构革命**：线性注意力实用化、稀疏注意力工程化——为 1M+ 上下文降本
3. **长上下文标配化**：1M token 成为旗舰门槛
4. **长程 Agent 能力取代单轮基准**成为新叙事（数百次工具调用的持续作战）
5. **开源闭源差距收敛 + 价格战**：开源旗舰对标闭源且价格低至 1/10-1/18

## 选型视角（SA 笔记）

- **稠密还是 MoE**：私有化部署看显存预算（MoE 总参数大），API 调用看激活参数定价
- **推理模型按需开启**：简单任务用非推理模式省成本，复杂任务才付思考预算——路由策略比模型选择更影响账单
- **上下文长度的账**：按真实业务长度分布测算，别被"支持长度"带节奏
- **别迷信基准分**：用真实业务样本建评测集，指令跟随稳定性、中文与工具调用等长尾能力比主榜分数更决定体验

```mermaid
flowchart TD
  S{部署形态} -->|API 调用| A{任务复杂度}
  S -->|私有化部署| M{显存预算}
  A -->|简单直接| N[非推理模型<br/>只为输入输出 token 付费]
  A -->|复杂推理 / 长程 Agent| R[推理模型<br/>按思考预算付费]
  M -->|单机可容纳| D[稠密中小模型<br/>量化 + 单机推理，链路最简]
  M -->|多机多卡| E{优化目标}
  E -->|性价比优先| MO[大总参小激活 MoE<br/>吞吐高，显存是门槛]
  E -->|稳妥优先| DE[稠密旗舰<br/>工程链路成熟]
```

## 常见坑

| 坑 | 现象 | 根因与对策 |
| --- | --- | --- |
| 按激活参数估私有化显存 | 部署即爆显存 | MoE 显存由总参数决定，预算要含全部专家 + KV Cache |
| 拿"支持上下文长度"做设计输入 | 账单爆炸、显存 OOM | 按真实业务长度分布测算；KV Cache 随长度线性增长 |
| 推理模式全量默认开启 | 延迟与单价成倍上升 | 按任务复杂度路由，高频简单任务走非思考模式 |
| 忽视 KV Cache 优化 | 并发量上不去 | 选 GQA/MLA 架构、FP8 KV 量化、PagedAttention 类引擎 |
| 迷信基准榜单 | 业务实测回退 | 业务样本建评测集，重点看指令跟随与长尾能力 |

## 参考资料

<Refs>

**原始论文**

- [Attention Is All You Need](https://arxiv.org/abs/1706.03762) — Transformer 开山之作（2017）（访问日期 2026-09-03）
- [Language Models are Few-Shot Learners (GPT-3)](https://arxiv.org/abs/2005.14165) — 涌现能力的分水岭（2020）（访问日期 2026-09-03）
- [Training Compute-Optimal Large Language Models (Chinchilla)](https://arxiv.org/abs/2203.15556) — 规模化律修正，"过训"路线依据（2022）（访问日期 2026-09-03）
- [Training language models to follow instructions with human feedback (InstructGPT)](https://arxiv.org/abs/2203.02155) — RLHF 三阶段原型（2022）（访问日期 2026-09-03）
- [Constitutional AI: Harmlessness from AI Feedback](https://arxiv.org/abs/2212.08073) — AI 反馈对齐（2022）（访问日期 2026-09-03）
- [LLaMA: Open and Efficient Foundation Language Models](https://arxiv.org/abs/2302.13971) — 开放权重转折点（2023）（访问日期 2026-09-03）
- [Switch Transformers](https://arxiv.org/abs/2101.03961) — MoE 路由简化与万亿参数（2021）（访问日期 2026-09-03）
- [Mixtral of Experts](https://arxiv.org/abs/2401.04088) — 开源 MoE 引爆点（2024）（访问日期 2026-09-03）
- [DeepSeek-V2: A Strong, Economical, and Efficient Mixture-of-Experts Language Model](https://arxiv.org/abs/2405.04434) — MLA 首秀与 KV Cache 压缩（2024）（访问日期 2026-09-03）
- [DeepSeek-V3 Technical Report](https://arxiv.org/abs/2412.19437) — MoE 工程化集大成（2024）（访问日期 2026-09-03）
- [DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning](https://arxiv.org/abs/2501.12948) — RLVR 与推理模型的开源里程碑（2025）（访问日期 2026-09-03）
- [Qwen3 Technical Report](https://arxiv.org/abs/2505.09388) — 稠密 + MoE 全线与思考双模式（2025）（访问日期 2026-09-03）
- [DeepSeek-V3.2: Pushing the Frontier of Open Large Language Models](https://arxiv.org/abs/2512.02556) — DSA 稀疏注意力与智能体后训练（2025）（访问日期 2026-09-03）
- [Efficient Memory Management for Large Language Model Serving with PagedAttention](https://arxiv.org/abs/2309.06180) — vLLM 论文，KV Cache 分页管理（2023）（访问日期 2026-09-03）

**官方博客与公告**

- [OpenAI: Learning to Reason with LLMs](https://openai.com/index/learning-to-reason-with-llms/) — o1 发布公告（2024-09-12）（访问日期 2026-09-03）
- [vLLM: Easy, Fast, and Cheap LLM Serving with PagedAttention](https://vllm.ai/blog/2023-06-20-vllm) — vLLM 发布博客（2023-06）（访问日期 2026-09-03）
- [DeepSeek: Introducing DeepSeek-V3.2-Exp](https://api-docs.deepseek.com/news/news250929/) — DSA 首发公告（2025-09-29）（访问日期 2026-09-03）

**图片来源**

- Transformer 架构图：Attention Is All You Need 图 1（[arXiv:1706.03762](https://arxiv.org/abs/1706.03762)）
- 注意力结构对比图：DeepSeek-V2 图 3（[arXiv:2405.04434](https://arxiv.org/abs/2405.04434)）
- DeepSeek-V3 架构图：DeepSeek-V3 Technical Report 图 2（[arXiv:2412.19437](https://arxiv.org/abs/2412.19437)）

站内相关：[机器学习与深度学习经典](/ai/models/ml-dl) · [GPU 集群与高速网络](/ai/infra/cluster) · [训练工程](/ai/infra/training) · [推理部署实战](/ai/infra/inference/llm-inference) · [多模态应用](/ai/application/multimodal) · [Agentic 支柱](/agentic/)

</Refs>
