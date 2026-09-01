# 云与 AI 知识体系（cloud-ai-knowledge-base）

一名云解决方案架构师的十年知识沉淀：从 OpenStack 云计算基座、全栈云产品（计算/存储/网络/数据库/大数据/云原生）到 AI 大模型应用的系统性个人知识库。

> 🔗 站点地址：<https://yourname.github.io/cloud-ai-knowledge-base/>（建仓后替换为实际地址）

## 内容结构

| 知识域 | 路径 | 主题 |
| --- | --- | --- |
| 01 · 云计算基座 | `docs/foundation/` | 虚拟化、OpenStack、SDN/NFV |
| 02 · 计算·存储·网络 | `docs/csn/` | ECS/OSS/VPC 三大件 |
| 03 · 数据库·大数据 | `docs/data/` | RDS/PolarDB、MaxCompute/Flink |
| 04 · 云原生 | `docs/cloud-native/` | Kubernetes、微服务、可观测 |
| 05 · AI 与大模型 | `docs/ai/` | 推理部署、GPU 成本、RAG、Agent |
| 06 · 解决方案方法论 | `docs/methodology/` | 架构设计、上云迁移、高可用 |
| 07 · 技术编年史 | `docs/chronicle/` | 移动互联网→直播→区块链→元宇宙→AI |

文章状态：无标记 = 完整文章；🚧 = 提纲页（知识框架已就位，正文待扩充）。

## 本地开发

```bash
npm install
npm run docs:dev      # http://localhost:5173
npm run docs:build    # 构建（含死链检查）
npm run docs:preview
```

写作规范与 AI 协作约定见 [CLAUDE.md](./CLAUDE.md)，文章模板见 [templates/article-template.md](./templates/article-template.md)。

## 发布

推送到 `main` 分支即由 GitHub Actions 自动构建并发布到 GitHub Pages（见 `.github/workflows/deploy.yml`）。

首次部署需要：

1. 仓库 Settings → Pages → Source 选择 **GitHub Actions**
2. 若仓库不是 `<user>.github.io`，工作流已通过 `VITEPRESS_BASE` 自动注入仓库名前缀
3. 全局替换代码与文档中的 `yourname` 占位符为你的 GitHub 用户名

## 技术栈

- [VitePress](https://vitepress.dev/) 1.x（中文全文搜索内置）
- [vitepress-plugin-mermaid](https://github.com/emersonbotero/vitepress-plugin-mermaid)（架构图）

## 内容声明

技术内容基于官方公开文档与行业共识；实践内容均为脱敏后的行业化、场景化总结，不涉及客户信息与未公开数据。内容许可：CC BY-NC-SA 4.0。

## V2 路线图

- giscus 评论、RSS 订阅、自定义域名
- 英文版、"最近更新"聚合页
- 提纲页逐篇扩充（优先 AI 与大模型、云原生）
