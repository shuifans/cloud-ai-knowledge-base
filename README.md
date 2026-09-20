# 云与 AI 知识体系（cloud-ai-knowledge-base）

围绕云计算与人工智能构建的公开技术知识库：从 OpenStack、计算、存储、网络、数据与云原生，到模型架构、AI Infra、应用工程与智能体。

> 🔗 站点地址：<https://shuifans.github.io/cloud-ai-knowledge-base/>

## 内容结构

知识体系采用“领域 → 子域 → 专题”三级目录。顶层分为三大支柱：

| 支柱 | 路径 | 主题 |
| --- | --- | --- |
| ☁️ 云计算 | `docs/cloud/` | 基座（虚拟化/OpenStack）· 计算·存储·网络 · 数据库·大数据（含 OLAP）· 云原生 |
| 🧬 人工智能 | `docs/ai/` | 模型（基础→理解→生成）· AI Infra（集群→训练→推理）· 应用（RAG→多模态→评测）· Agent |
| 📜 技术编年史 | `docs/chronicle/` | 移动互联网→直播→短视频→区块链→元宇宙→AI，及信创暗流 |

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
2. 仓库名不是 `<user>.github.io` 时，工作流已通过 `VITEPRESS_BASE` 自动注入仓库名前缀，无需手动配置

## 技术栈

- [VitePress](https://vitepress.dev/) 1.x（中文全文搜索内置）
- [vitepress-plugin-mermaid](https://github.com/emersonbotero/vitepress-plugin-mermaid)（架构图）

## 内容声明

技术内容优先依据官方公开文档、原始论文与项目仓库；工程建议会与可核验事实分开表述，并标注适用边界。内容不包含作者履历、客户信息、内部系统或未公开数据。内容许可：CC BY-NC-SA 4.0。

## V2 路线图

- giscus 评论、RSS 订阅、自定义域名
- 英文版、"最近更新"聚合页
- 提纲页逐篇扩充（优先 AI 与大模型、云原生）
