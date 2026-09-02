---
title: 图像生成：从 Stable Diffusion 到 DiT 时代
outline: [2, 3]
---

# 图像生成：从 Stable Diffusion 到 DiT 时代

> 图像生成是大模型时代第一个"出圈"的能力：Stable Diffusion 的开源让每个人都能在本机跑通扩散模型。这条技术线的主轴是：**扩散原理打底，架构从 UNet 换到 DiT，训练范式从像素空间搬到潜空间与流匹配**。

## 扩散模型：从噪声中雕刻图像

- **核心思想**：前向过程逐步加噪到纯高斯噪声，训练网络学习"逐步去噪"——生成即从噪声开始的迭代去噪
- **为什么赢了 GAN**：训练稳定（逐步回归目标，无对抗博弈）、模式覆盖全（无模式坍缩）、可控性强（每步都可注入条件）
- **代价**：迭代式采样慢——催生了整条加速技术线（DDIM、蒸馏、一致性模型）

## Stable Diffusion：潜空间扩散的工业化

- **LDM 关键设计**：先用 VAE 把图像压到低维潜空间，扩散过程在潜空间进行——计算量降一个数量级，这是"消费级显卡能跑"的根本原因
- **三件套架构**：文本编码器（CLIP/T5，理解提示词）+ UNet（去噪主干）+ VAE（潜空间↔像素）
- **ControlNet/IP-Adapter 生态**：在冻结主干上挂旁路条件——姿态、线稿、参考图控制，开源社区把"可控生成"做成了插件市场
- **SD 谱系**：1.5（生态之王）→ SDXL（质量跃升）→ SD3（MM-DiT + 流匹配，架构换代）

## 架构换代：UNet → DiT

- **DiT（Diffusion Transformer）**：用 Transformer 替换 UNet 作为去噪主干——又一个"Transformer 统一一切"的例证
- **换代的意义**：
  1. 扩散模型也吃上了 Scaling Law（加参数即变强，UNet 的扩展性差）
  2. 与 LLM 共享工程栈（并行策略、推理优化可复用）
  3. 图文生成架构趋同，为"统一生成模型"铺路
- **流匹配（Flow Matching）**：从"学噪声预测"转向"学概率流的速度场"——采样步数更少、训练更稳，SD3/Flux 均采用

## 开源与闭源的两线格局

- **开源线**：SD 生态 → Flux（DiT + 流匹配的开源标杆）→ 各家旗舰开源（Qwen-Image 系等），中文渲染与文字生成成为差异化战场
- **闭源线**：Midjourney/DALL·E → GPT Image 类原生多模态生成——"理解与生成同一模型"是闭源侧的主叙事
- **格局判断**：开源解决"可控与私有化"，闭源解决"开箱即用的上限"；企业选型按数据边界与定制深度划线

## 2026 格局：主力模型速览（更新于 2026-09）

| 阵营 | 模型 | 时间 | 要点 |
| --- | --- | --- | --- |
| 开源 | FLUX.2（BFL） | 2025-11 | 32B rectified flow transformer，生成+编辑+多参考图统一，dev 开放权重 |
| 开源 | Qwen-Image 系（通义） | 2025-08 起 | 20B MMDiT，Apache 2.0；中文文字渲染突破；注意 3.0（2026-07）转闭源 |
| 闭源 | Seedream 3.0→5.0 Pro（字节） | 2025→2026-07 | 生成编辑统一→4K 一致性→"理解设计"的推理式生成 |
| 闭源 | Nano Banana Pro（Google） | 2025-11 | Gemini 3 Pro Image：推理驱动的生成/编辑，最高 4K，SynthID 水印 |
| 闭源 | GPT Image（OpenAI） | 2025-04 | 自回归多模态路线（GPT-4o 原生生成的 API 形态），替代 DALL·E |

**格局要点**：
- **生成与编辑统一**成为标配（Kontext、Seedream、FLUX.2、Qwen-Image-Edit）
- **自回归路线回归**：GPT-4o 原生图像证明 AR 多模态可行，与扩散路线并存
- **推理式图像生成**（2025 末新趋势）：Nano Banana Pro、Seedream 5.0 Pro"先推理后生成"——图像模型开始吃 LLM 的推理红利
- **开源闭源动态**：差距缩小的同时出现回流（Qwen-Image-3.0 转闭源）——开源许可与商业模式仍是变量

## 工程与成本视角

- **推理成本结构**：扩散步数 × 分辨率 × 模型规模；加速三板斧 = 蒸馏减步数、缓存复用（TeaCache 类）、量化
- **ComfyUI 的事实标准地位**：节点式工作流让"模型+条件+后处理"自由拼装，本地部署与云端批处理通吃
- **生产管线要点**：提示词模板化、安全过滤前置、尺寸/宽高比预设、批量调度——生成质量靠模型，交付稳定靠管线

## 应用形态

- 设计辅助（变体生成、局部重绘 Inpainting）、营销物料批量生产、游戏美术管线（原画→三视图→贴图）、电商主图与虚拟试穿
- 与视觉理解的融合：生成结果直接回灌理解模型做质检（生成-评估闭环）

## 参考资料

- [Denoising Diffusion Probabilistic Models (DDPM)](https://arxiv.org/abs/2006.11239) — 扩散模型奠基（2020）
- [High-Resolution Image Synthesis with Latent Diffusion Models](https://arxiv.org/abs/2112.10752) — Stable Diffusion 论文（2021）
- [Scalable Diffusion Models with Transformers (DiT)](https://arxiv.org/abs/2212.09748) — DiT 架构（2022）
- [Flow Matching for Generative Modeling](https://arxiv.org/abs/2210.02747) — 流匹配（2022）
- 站内相关：[视频生成](/ai/models/video-gen) · [视觉理解](/ai/models/vision) · [多模态应用](/ai/application/multimodal)
