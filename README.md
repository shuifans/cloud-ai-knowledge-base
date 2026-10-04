# 云与 AI 知识体系（cloud-ai-knowledge-base）

围绕云计算、人工智能与软件研发构建的公开中文技术知识库：从基础设施、模型与智能体，到需求、程序、协作、验证、交付和维护。

> 站点地址：<https://shuifans.github.io/cloud-ai-knowledge-base/>

## 内容结构

知识体系采用“领域 → 子域 → 专题”三级目录。三大技术领域与技术编年史并列：

| 支柱 | 路径 | 主题 |
| --- | --- | --- |
| 云计算 | `docs/cloud/` | 基座（虚拟化/OpenStack）· 计算·存储·网络 · 数据库·大数据（含 OLAP）· 云原生 · 架构与治理 |
| 人工智能 | `docs/ai/` | 模型与算法 · 数据与知识工程 · AI Infra（集群→训练→推理）· 应用与评测 · Agent · 工程运营与治理 |
| 软件研发与工程实践 | `docs/software/` | 软件项目入门 · 按专业目录查阅 · 术语、场景与技术工具索引 |
| 技术编年史 | `docs/chronicle/` | 移动互联网→直播→短视频→区块链→元宇宙→AI，及信创暗流 |

文章状态：无标记 = 完整文章；提纲页使用纯文字“本文是提纲页”提示，并在导航标注“（提纲）”。仅规划的专题不创建空页、不提供空链接。完整正文与上线部署是不同状态。

软件研发建设清单见 [maintenance/software-roadmap.json](./maintenance/software-roadmap.json)：16 篇项目入门、17 个专业目录和 105 篇专业专题，配套 20 个目录页及 3 个查询索引，共 144 页。五阶段内容均已形成完整正文，完成状态指本地内容验收，不代表已经上线。

AI 数据、持续交付与企业治理的建设规划及核验边界见 [maintenance/ai-expansion-2026-10-04.md](./maintenance/ai-expansion-2026-10-04.md)，包括 8 篇完整专题与官方来源记录。

## 本地开发

```bash
npm install
npm run docs:dev      # http://localhost:5173
node --test tests/*.test.mjs
npm run docs:build    # 构建（含死链检查）
npm run docs:preview
```

写作规范与 AI 协作约定见 [CLAUDE.md](./CLAUDE.md)，通用文章模板见 [templates/article-template.md](./templates/article-template.md)。按内容类型也可选用 [概念](./templates/concept-template.md)、[专题](./templates/topic-template.md)、[实践](./templates/practice-template.md)或[比较](./templates/comparison-template.md)模板。

## 发布

推送到 `main` 分支即由 GitHub Actions 自动构建并发布到 GitHub Pages（见 `.github/workflows/deploy.yml`）。

首次部署需要：

1. 仓库 Settings → Pages → Source 选择 **GitHub Actions**
2. 仓库名不是 `<user>.github.io` 时，工作流已通过 `VITEPRESS_BASE` 自动注入仓库名前缀，无需手动配置

## 技术栈

- [VitePress](https://vitepress.dev/) 1.x（中文全文搜索内置）
- [Mermaid](https://mermaid.js.org/)（自定义组件按需渲染，支持主题切换与点击放大）

## 内容声明

技术内容优先依据官方公开文档、原始论文与项目仓库；工程建议会与可核验事实分开表述，并标注适用边界。内容不包含作者履历、客户信息、内部系统或未公开数据。内容许可：CC BY-NC-SA 4.0。

## V2 路线图

- giscus 评论、RSS 订阅、自定义域名
- 英文版、"最近更新"聚合页
- 持续复核软件研发专题，维护与云、AI 内容的边界、版本适用范围及互链
