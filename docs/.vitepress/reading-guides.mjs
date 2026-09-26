// Editorial summaries describe the existing content; verification dates remain in each page.
const entries = {
  'playground/pelican/': ['用同一条提示词，浏览不同模型与 reasoning effort 的鹈鹕骑车 SVG 动画。', '对模型绘图与动画编程感兴趣的读者', '无需前置知识'],
  'cloud/': ['先认识云的底层抽象，再连接资源、数据、平台与生产治理。', '建立云计算知识框架的技术读者', '了解应用、服务器与网络的基本概念'],
  'cloud/foundation/': ['从虚拟化、资源池和软件定义网络，理解云服务如何成立。', '希望理解 IaaS 底层的工程师', 'Linux、进程与基本网络知识'],
  'cloud/infra/': ['围绕算力、数据和流量，建立云资源的选型与组合方法。', '设计或运行云上系统的工程师', '虚拟机、磁盘与 IP 网络基础'],
  'cloud/data/': ['按访问模式、数据规模与时效要求，选择数据库和分析系统。', '应用架构师与数据工程师', 'SQL、事务与数据处理基础'],
  'cloud/native/': ['把应用交付、服务治理和可观测连接成可运营的平台。', '平台、后端与运维工程师', '容器、HTTP 与 Linux 基础'],
  'cloud/architecture/': ['用安全、可靠性、成本和变更机制，持续评审生产架构。', '架构师、平台负责人及 SRE', '至少一个生产系统的基本架构'],
  'cloud/foundation/openstack': ['沿计算、存储、网络与身份组件，理解 OpenStack 的控制链路与演进。'],
  'cloud/foundation/virtualization': ['从 KVM、QEMU 和 virtio 入手，解释虚拟机的隔离、资源管理与性能开销。'],
  'cloud/foundation/sdn-nfv': ['分清控制面与数据面，串联网络虚拟化、封装和网络功能的软件化。'],
  'cloud/infra/compute': ['从实例规格、调度与弹性机制出发，为工作负载选择计算资源。'],
  'cloud/infra/storage': ['比较块、文件和对象存储，以访问模式、持久性和成本做取舍。'],
  'cloud/infra/network': ['从 VPC、路由、负载均衡到跨域连接，梳理云网络的数据路径与边界。'],
  'cloud/data/database': ['把事务、查询模式、一致性和扩展需求转成数据库选型条件。'],
  'cloud/data/olap': ['理解分析引擎的存储与执行机制，再按查询、更新和成本要求选型。'],
  'cloud/data/bigdata': ['连接批处理、流处理、数据湖与治理，理解数据平台的分层与演进。'],
  'cloud/native/kubernetes': ['沿声明式 API、调度、网络和存储，理解 Kubernetes 核心机制及生产约束。'],
  'cloud/native/microservice': ['从服务发现、流量治理与故障隔离入手，规划微服务的运行边界。'],
  'cloud/native/observability': ['把指标、日志与追踪用于问题定位，建立围绕服务目标的观测闭环。'],
  'cloud/architecture/well-architected': ['把架构原则转成可重复的评审问题、证据与持续改进流程。'],
  'cloud/architecture/security-governance': ['以身份、权限、网络边界和审计为主线，梳理云上安全治理。'],
  'cloud/architecture/reliability-dr': ['从业务目标倒推故障域、恢复策略与演练方法，设计可靠性和灾备。'],
  'cloud/architecture/finops': ['把成本分摊、预算、资源优化与业务价值放进持续治理流程。'],
  'cloud/architecture/migration': ['按依赖、风险和业务节奏规划迁移，明确验证、切换与回退路径。'],
  'ai/': ['按模型、基础设施、应用与智能体四条线，建立 AI 的原理与工程全景。', '学习或落地 AI 系统的技术读者', '编程与基本系统架构知识'],
  'ai/models/': ['从经典模型到多模态理解与生成，按能力类型理解模型机制。', '希望理解模型原理与能力边界的工程师', '基础线性代数、概率与神经网络概念'],
  'ai/infra/': ['沿 GPU 集群、训练工程和推理服务，理解模型运行所需的系统能力。', 'AI 平台、基础设施与部署工程师', 'Linux、容器与模型训练/推理的基本概念'],
  'ai/infra/inference/': ['把推理机制、部署、容量规划与成本测算连接成一条工程路径。', '负责模型部署、选型与容量规划的工程师', 'LLM、GPU 显存和基本服务指标'],
  'ai/application/': ['用检索增强、多模态交互与评测，把模型接入可持续运营的应用。', 'AI 应用开发者与方案架构师', '模型 API、应用后端与数据处理基础'],
  'ai/agent/': ['从工具、记忆与编排到评测治理，理解智能体如何执行可控的长程任务。', '智能体开发者与应用架构师', 'LLM 调用、工具接口及应用评测基础'],
  'ai/models/ml-dl': ['串联经典机器学习与深度学习架构，为后续模型原理建立共同语言。'],
  'ai/models/llm': ['从 Transformer、注意力和训练目标入手，理解大语言模型架构与能力边界。'],
  'ai/models/vision': ['从图文对齐到原生多模态，比较视觉理解模型的结构与适用任务。'],
  'ai/models/audio': ['沿声学表示、识别与理解链路，梳理语音模型的任务边界与工程条件。'],
  'ai/models/image-gen': ['串联扩散、潜空间、DiT 与可控生成，再讨论评估、部署与算力成本。'],
  'ai/models/video-gen': ['围绕时空建模、一致性和计算代价，理解视频生成的主要技术路线。'],
  'ai/models/speech-gen': ['基于公开 TTS 论文区分语音表示、声学模型与声码器，再验证流式质量和延迟。'],
  'ai/infra/cluster': ['把 GPU、互联、拓扑和存储视为整体，分析训练与推理集群的系统瓶颈。'],
  'ai/infra/training': ['从预训练、后训练到强化学习，连接训练范式、并行策略与集群工程。'],
  'ai/infra/inference/llm-inference': ['从服务框架到量化、缓存和调度，组织可验证的大模型部署方案。'],
  'ai/infra/inference/gpu-sizing': ['先算显存，再判断带宽、并发和延迟约束，最后比较部署方案的成本。'],
  'ai/infra/inference/token-economics': ['拆解输入输出、缓存与吞吐的计价口径，把 token 用量转成成本判断。'],
  'ai/application/rag-architecture': ['沿解析、切分、索引、检索、重排和评测，设计能够持续运营的 RAG 链路。'],
  'ai/application/multimodal': ['从文档、视觉、语音与界面交互场景，比较多模态应用的架构和成本。'],
  'ai/application/evaluation': ['连接离线基准、业务评测集与生产监控，让模型质量有可复核的依据。'],
  'ai/agent/history': ['按关键阶段回看智能体演进，区分概念、工具生态与工程能力的变化。'],
  'ai/agent/frameworks': ['围绕编排、状态、工具、持久化和评测能力，为智能体选择开发框架。'],
  'chronicle/': ['从六轮技术浪潮和信创主题回看需求与基础设施，再链接到具体技术知识。', '希望理解技术演进背景的读者', '云计算与 AI 的基本概念'],
  'chronicle/mobile-internet': ['回看移动应用扩张如何推动弹性计算、云服务与应用架构演进。'],
  'chronicle/livestream': ['沿实时音视频、分发与峰值流量，理解直播业务对基础设施的要求。'],
  'chronicle/short-video': ['连接推荐、海量媒体和数据平台，回看短视频时代的系统与成本命题。'],
  'chronicle/blockchain': ['围绕共识、信任和性能，回看区块链路线、应用探索与基础设施沉淀。'],
  'chronicle/metaverse': ['从实时渲染、交互设备与 GPU 资源，梳理元宇宙相关技术的发展线索。'],
  'chronicle/ai-era': ['连接模型、算力与应用工程，回看 AI 浪潮中的关键阶段与技术栈变化。'],
  'chronicle/xinchuang': ['按软硬件生态、迁移与兼容性，理解信创和国产化的长期工程命题。'],
  'about': ['了解本站的内容边界、维护方式与更新记录，查看历次修正和逐页核验范围。', '所有读者', '无'],
  'updates': ['查看本轮修正、知识补充和逐页核验范围，区分筛查与事实复核。', '使用本站进行学习或选型的读者', '无'],
  'ai/agent/security': ['把身份、工具授权、提示注入与执行恢复落到可验收的边界。'],
}

export const learningPaths = {
  'cloud/': ['cloud/foundation/', 'cloud/infra/', 'cloud/data/', 'cloud/native/', 'cloud/architecture/'],
  'cloud/foundation/': ['cloud/foundation/virtualization', 'cloud/foundation/openstack', 'cloud/foundation/sdn-nfv'],
  'ai/': ['ai/models/ml-dl', 'ai/models/llm', 'ai/infra/inference/', 'ai/application/', 'ai/agent/'],
  'ai/infra/': ['ai/infra/cluster', 'ai/infra/training', 'ai/infra/inference/'],
  'ai/infra/inference/': ['ai/infra/inference/llm-inference', 'ai/infra/inference/gpu-sizing', 'ai/infra/inference/token-economics'],
}

export const historyConnections = {
  'chronicle/mobile-internet': ['cloud/infra/compute', 'cloud/native/microservice'],
  'chronicle/livestream': ['cloud/infra/network', 'cloud/native/observability'],
  'chronicle/short-video': ['cloud/data/bigdata', 'cloud/data/olap', 'ai/models/vision'],
  'chronicle/blockchain': ['cloud/data/database', 'cloud/architecture/security-governance'],
  'chronicle/metaverse': ['ai/infra/cluster', 'ai/models/vision', 'ai/application/multimodal'],
  'chronicle/ai-era': ['ai/models/llm', 'ai/infra/inference/', 'ai/agent/'],
  'chronicle/xinchuang': ['cloud/foundation/openstack', 'cloud/architecture/migration'],
}

export function verifiedDate(value) {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? '' : value.toISOString().slice(0, 10)
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value) ? value.slice(0, 10) : ''
}

export function pageKey(relativePath) {
  return relativePath.replace(/^\//, '').replace(/index\.md$/, '').replace(/\.md$/, '')
}

export function getReadingGuide(key) {
  const entry = entries[key]
  if (!entry) return null
  const parent = Object.keys(entries).filter(k => k.endsWith('/') && key.startsWith(k) && entries[k][1]).sort((a,b) => b.length-a.length)[0]
  const family = entries[parent] || []
  return { summary: entry[0], audience: entry[1] || family[1], prerequisites: entry[2] || family[2] }
}
