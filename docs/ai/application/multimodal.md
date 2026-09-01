---
title: 多模态模型与视频生成（提纲）
outline: [2, 3]
---

# 多模态模型与视频生成

::: warning 🚧 本文是提纲页
知识框架与要点已就位，正文整理中。可以先看 [大模型应用总览](/ai/application/) 了解全貌。本页源于个人研究轨迹的增补：2026 年以来对视频生成模型（Seedance、Wan 等）与多模态体验的持续跟踪。
:::

## 要点提纲

### 1. 从文本到多模态：应用层的版图扩张

- 大模型应用的主战场正在从"对话 + 检索"扩展到**图像/视频/语音的生成与理解**
- 与 RAG/Agent 的关系：多模态不是替代，而是把"输入输出的形态"扩展了——检索可以检图，Agent 可以操作多媒体管线

### 2. 视频生成模型格局

- 两条路线：**文生视频（t2v）与图生视频（i2v）**；首尾帧控制、参考图驱动是产品化关键能力
- 闭源平台服务（Seedance 类）与开源权重（Wan 类）并存——选型逻辑与文本模型一致：调用量、数据边界、成本三角
- 评测跟踪：[Artificial Analysis 视频生成榜单](https://artificialanalysis.ai/video/leaderboard/image-to-video) 是当前可用的第三方横评之一

### 3. 本地部署路线

- ComfyUI 是开源视频/图像模型本地部署的事实标准工作流框架（节点式编排）
- 开源视频模型（如 Wan 系列）+ ComfyUI 的组合，适合 POC 验证与数据敏感场景
- 约束很现实：视频生成是**显存与时间的双重密集负载**，消费级显卡只能跑短片段低分辨率，生产级仍需推理集群

### 4. 工程要点（待展开）

- 视频推理的成本结构：按秒计费背后的 GPU 时长与显存账
- 媒体管线：生成 → 审核 → 转码 → 分发，与云存储/视频云产品的衔接
- 提示词的跨模态差异：镜头语言、运动描述、风格一致性

## 精选资源

> 更新于 2026-09-02，全部链接已验证可达。

- [Wan-Video/Wan2.1](https://github.com/Wan-Video/Wan2.1) — 开源视频生成模型官方仓库（持续更新 · 开源项目）
- [comfyanonymous/ComfyUI](https://github.com/comfyanonymous/ComfyUI) — 节点式多模态工作流框架，本地部署事实标准（持续更新 · 开源项目）
- [Image to Video Leaderboard — Artificial Analysis](https://artificialanalysis.ai/video/leaderboard/image-to-video) — 视频生成模型第三方横评（持续更新 · 行业报告）

## 计划补充

- [ ] 主流视频生成模型能力对比（控制能力/时长/分辨率/成本）
- [ ] ComfyUI 本地部署实践：从环境到出片
- [ ] 视频生成的推理成本测算（方法复用 [GPU 选型与推理成本测算](/ai/inference/gpu-sizing)）

## 衔接

- 同层：[企业级 RAG 架构设计](/ai/application/rag-architecture) · [Agent 与 MCP](/ai/application/agent)
