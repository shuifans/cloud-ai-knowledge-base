# 全站信息图生成 Prompt 规格

> 状态：`video-gen` 高密度方案 B 已采纳；其余 47 张信息图已完成生成、校验并插入对应页面。
>
> 统计：全站 50 个 Markdown 页面；48 个内容页均已配置 4K 总览图；`docs/index.md` 与 `docs/about.md` 按规划跳过。

## 1. 已选视觉母版

- 参考图：`docs/public/images/ai/models/video-gen/video-generation-overview-b.png`
- 用例：`infographic-diagram`
- 画布：3840×2160，16:9，横版，不透明背景。
- 风格：与网站一致的浅灰背景、白色圆角卡片、深灰正文、网站蓝作为唯一主强调色；线性图标、细分隔线、克制阴影。
- 信息层级：顶部标题与一句主线；中部唯一主骨架；底部 4–8 个辅助卡片；最底部可放一个公式、决策规则或边界提示。
- 密度：专题页保留 25–45 个主要标签；索引页保留 12–24 个标签。避免长段落，以名词、短句、箭头和分组表达全文脉络。
- 字体：现代中文无衬线；中文、英文缩写、公式均清晰可读。技术名词原样保留，不做“通俗化改名”。
- 禁止：暗黑、霓虹、赛博朋克、拟物 3D、品牌 Logo 堆砌、装饰性人物、无来源数字、自动补写结论、水印。

## 2. 可直接复用的母 Prompt

```text
Use case: infographic-diagram
Asset type: website article overview infographic
Input images: Image 1 is the approved style reference only; do not copy its video-generation content.
Primary request: Create a high-information-density overview infographic for the supplied article. The image must let a technical reader scan the article's complete logic, architecture, terminology, trade-offs, and decision boundaries before reading the body.
Scene/backdrop: opaque warm light-gray background with white rounded cards, subtle separators and restrained shadows.
Style/medium: clean vector-like technical infographic matching the current website and Image 1; precise, editorial, engineering-oriented.
Composition/framing: 3840×2160 landscape. Top: exact article title plus a one-line thesis. Center: the page-specific primary structure. Bottom: supporting modules for trade-offs, evaluation, selection, operations, or legacy. Maintain generous gutters while keeping high information density.
Color palette: website blue #0071E3 for hierarchy and arrows; near-black #1D1D1F for headings; gray #59595C for secondary copy; white cards on #F5F5F7-like background. Small semantic accent colors are allowed only when needed.
Typography: modern Chinese sans-serif; technical English, abbreviations, formulas, model names and protocol names must remain verbatim. Render every supplied label exactly once unless repetition is structurally necessary.
Facts: use only the supplied article payload. Preserve dates, versions, quantities, formulas and qualification language exactly. Do not infer missing values, rankings, causality, performance, prices, market share or maturity.
Arrows: use arrows only for relationships explicitly stated as flow, dependency, evolution or feedback. Use grouping, not arrows, for parallel concepts.
Constraints: high density but no paragraphs; 25–45 primary labels for technical pages and 12–24 for index pages; no logo collage; no watermark; no decorative people; no extra slogans; no invented text.
Avoid: dark theme, neon, cyberpunk, glassmorphism, tiny illegible copy, fake code, hallucinated Chinese characters, duplicated labels, cropped cards, unsupported numbers.
```

每张图调用时附加四段页面载荷：`主骨架`、`必须逐字呈现`、`事实边界`、`输出路径`。正文中的标题、摘要、二三级标题和关键表格是唯一事实输入。

## 3. 首轮校准页

今晚不应直接连续生成 47 张。先生成以下 6 张，分别校准六种主模板：

1. `ai/models/llm.md`：机制骨架图。
2. `ai/application/rag-architecture.md`：双泳道端到端架构图。
3. `ai/infra/inference/llm-inference.md`：请求生命周期与优化挂载图。
4. `ai/infra/cluster.md`：分层物理拓扑图。
5. `ai/application/evaluation.md`：矩阵与闭环图。
6. `chronicle/index.md`：统一时间线母版。

验收这 6 张后，再按同类模板批量生成其余页面。

### 2026-09-20 校准输出

- `docs/public/images/ai/models/llm/llm-overview-calibration.png`
- `docs/public/images/ai/application/rag-architecture/rag-architecture-overview-calibration.png`
- `docs/public/images/ai/infra/inference/llm-inference/llm-inference-overview-calibration.png`
- `docs/public/images/ai/infra/cluster/gpu-cluster-overview-calibration.png`
- `docs/public/images/ai/application/evaluation/llm-evaluation-overview-calibration.png`
- `docs/public/images/chronicle/index/chronicle-six-waves-overview-calibration.png`

以上均使用内置图像生成工具分别生成，以已采纳的 `video-generation-overview-b.png` 作为纯风格参考；项目副本统一为 3840×2160 PNG。校准稿已复制为稳定正式文件并插入对应 Markdown 页面，原 `-calibration` 文件保留用于追溯。

### 2026-09-20 全量完成记录

- `AI`：22/22 张完成；其中 5 张复用校准稿，17 张新生成。
- `云计算`：17/17 张完成并插入页面。
- `技术编年史`：8/8 张完成并插入页面。
- 连同已采纳的 `video-gen` 方案 B，共覆盖 48 个内容页；所有正式首图均为 3840×2160 PNG。
- 事实与结构 QA 重点纠正了 FLOPs 口径、训练路线关系、CFG 条件/无条件分支、ASR 对齐方法并列关系、OpenStack 调用链与 Skyline 职责、计算实例状态机等问题。
- 生成时使用本文件的统一母 Prompt、对应页面载荷，以及 `docs/public/images/ai/models/video-gen/video-generation-overview-b.png` 作为纯视觉风格参考。

## 4. AI 页面载荷（22 张）

### P0 · `docs/ai/models/llm.md`

- 主骨架：中央 Transformer 骨架，外围放成本旋钮、训练阶段与架构演进分支。
- 必须逐字呈现：Tokenizer、自回归生成、KV Cache、Transformer、Scaling Law、后训练、MoE、Routing、Load Balancing、MLA、DSA、线性注意力、长上下文、RAG、Test-time compute、投机解码。
- 事实边界：不补参数量、上下文长度、硬件数量、价格；MoE、MLA、DSA 不画成同一层替代关系。

### P0 · `docs/ai/models/image-gen.md`

- 主骨架：GAN → Diffusion 的演进线；DDPM → Sampler → CFG → VAE/Latent Diffusion → U-Net/DiT/MM-DiT → Flow Matching 的生成主链；底部放控制、评估与部署。
- 必须逐字呈现：GAN、Diffusion、DDPM、ε、x₀、Sampler、CFG、VAE、Latent Diffusion、U-Net、DiT、MM-DiT、Flow Matching、ControlNet、IP-Adapter、LoRA、DreamBooth、Textual Inversion、Inpainting、FID、CLIP Score。
- 事实边界：不补采样步数、API 价格或许可；不宣称自回归或扩散已成为唯一终局。

### P0 · `docs/ai/models/vision.md`

- 主骨架：CNN → ViT → CLIP → VLM → 原生多模态演进主轴，旁列三种 VLM 接入方式与视觉任务。
- 必须逐字呈现：Patch、ViT、CLIP、对比学习、零样本分类、cross-attention、MLP projector、原生交错训练、Flamingo、LLaVA、Chameleon、Gemini、Qwen-VL、SAM、OCR、grounding、视觉 token、切图策略。
- 事实边界：不补排名、token 数、分辨率阈值；三种接入方式保持并列比较。

### P0 · `docs/ai/models/audio.md`

- 主骨架：ASR 演进时间线、对齐方法矩阵、语音大模型与实时对话双路线。
- 必须逐字呈现：经典 ASR、WFST、CTC、RNN-T/Transducer、AED/LAS、Paraformer、CIF、Whisper、wav2vec 2.0、HuBERT、Speech Token、GLM-4-Voice、Qwen-Omni、Moshi、GPT-4o、gpt-realtime、级联、端到端。
- 事实边界：不补 WER、SLA、排名；弱监督与自监督不得合并成同一路线。

### P0 · `docs/ai/models/ml-dl.md`

- 主骨架：传统机器学习 → MLP → CNN → 序列模型 → 生成模型/Transformer 的谱系树叠加时间轴。
- 必须逐字呈现：线性模型、SVM、决策树、Bagging、Boosting、GBDT、XGBoost、感知机、MLP、反向传播、AlexNet、BatchNorm、CNN、ResNet、RNN、LSTM、GRU、Seq2Seq、Attention、word2vec、GAN、YOLO、Transformer。
- 事实边界：不自行添加年份或精度；不表达为旧架构已全部淘汰。

### P0 · `docs/ai/infra/cluster.md`

- 主骨架：GPU → 节点 → 机架 → 数据中心的分层拓扑，叠加四张网络和通信流。
- 必须逐字呈现：NVLink、NVSwitch、HGX、NVL、RDMA、InfiniBand、RoCE、前端网络、后端网络、存储网络、管理网络、Clos、AI Zone、胖树、轨道优化、800G、EFA、eRDMA、All-to-All、NCCL、TP、EP、Checkpoint、MFU。
- 事实边界：不补带宽、规模、功耗、收敛比；不把 InfiniBand 与 RoCE 简化成绝对优劣。

### P0 · `docs/ai/infra/training.md`

- 主骨架：显存账本 + 并行策略矩阵 + 一次训练迭代时间线。
- 必须逐字呈现：模型状态 16 bytes/param、激活、ZeRO、DP、TP、PP、EP、SP、CP、all-reduce、all-gather、ReduceScatter、SFT、LoRA/PEFT、DPO、RLVR、FP16、BF16、FP8、梯度累积、激活重计算、MFU、HFU。
- 事实边界：`16 bytes/param` 标明正文口径，不泛化到所有优化器和精度；不补训练成本或卡数。

### P0 · `docs/ai/infra/inference/gpu-sizing.md`

- 主骨架：四项显存账本 → 卡型筛选 → 带宽/SLO → 数量与冗余；中央显示并发–显存–延迟三角。
- 必须逐字呈现：权重、KV Cache、激活、中间态、运行时 5–10%、7B、70B、671B MoE、NVLink、Roofline、量化、TPOT SLO、自建、租云、API。
- 事实边界：不补显卡规格、报价或算例结果；三角关系不画成线性公式。

### P0 · `docs/ai/infra/inference/llm-inference.md`

- 主骨架：请求生命周期从 Prefill 到 Decode；把每种优化技术挂到实际作用阶段。
- 必须逐字呈现：Prefill、Decode、Continuous Batching、PagedAttention、copy-on-write、vLLM V1、Prefix Cache、RadixAttention、TTFT、TPOT、PD 分离、draft-verify、MTP、量化、KV Cache 量化、vLLM、SGLang、TensorRT-LLM、MoE、EP、推理网关。
- 事实边界：不补性能倍数；投机解码只表达无损验证机制，不承诺固定收益。

### P0 · `docs/ai/infra/inference/token-economics.md`

- 主骨架：FLOPs → 卡时成本 → 每 token 成本 → 定价 → 每任务成本。
- 必须逐字呈现：2N FLOPs/token、6N FLOPs/token、Prefill、Decode、PUE、利用率、输入/输出价差、缓存折扣、Batch API、思考 token、区域、服务档位、命中率、自建/API 盈亏平衡、Agent token 放大、每任务成本。
- 事实边界：不补厂商价格、降价幅度、市场行情；所有时点口径必须保留。

### P0 · `docs/ai/application/rag-architecture.md`

- 主骨架：离线与在线双泳道端到端架构，旁接 RAG 演进分支与评测运营闭环。
- 必须逐字呈现：解析、Chunking、Embedding、相似度、ANN、元数据、索引版本化、查询理解、BM25 + 向量、Rerank、生成与引用、Naive RAG、Agentic RAG、GraphRAG、长上下文、评测、运营层。
- 事实边界：不指定唯一 chunk 大小、top-k 或向量库；GraphRAG 不画成所有场景的必然升级。

### P0 · `docs/ai/application/multimodal.md`

- 主骨架：七类应用地图；语音、视觉、文档、RAG、GUI Agent、数字人和视频在三种组装模式中汇聚。
- 必须逐字呈现：直连、工具循环、管线编排、级联 speech-to-speech、端到端 speech-to-speech、延迟–可控性–成本三角、barge-in、视觉 token、结构化输出、文档智能、多模态 RAG、GUI Agent、数字人、ComfyUI。
- 事实边界：不补每分钟价格、模型能力矩阵、参数量；视频部分只采用本页明确路线。

### P0 · `docs/ai/application/evaluation.md`

- 主骨架：公开基准矩阵 → 污染诊断 → LLM-as-judge → 业务评测 → 生产监控闭环。
- 必须逐字呈现：MMLU、MMLU-Pro、GPQA、HumanEval、SWE-bench、Verified、GSM8K、MATH、AIME、FrontierMath、τ-bench、OSWorld、BrowseComp、RULER、LMArena、OpenCompass、HELM、数据污染、LLM-as-judge、红队、漂移、harness effect。
- 事实边界：不补榜单分数或排名；LLM-as-judge 不表达为无偏真值。

### P0 · `docs/ai/agent/frameworks.md`

- 主骨架：技术栈分层 + 框架机制矩阵 + 参考部署拓扑。
- 必须逐字呈现：Agent 执行循环、LangGraph、AutoGen、AG2、Microsoft Agent Framework、CrewAI、OpenAI Agents SDK、handoff、Claude Agent SDK、Google ADK、Dify、Coze、n8n、AgentScope、MCP、A2A、记忆、状态。
- 事实边界：不补版本号和活跃度；不自行选出赢家；MCP 与 A2A 保持不同协议职责。

### P0 · `docs/ai/agent/history.md`

- 主骨架：1950s–2026 横向时间线；底部放能力、期望、成本关系与正文阶段划分。
- 必须逐字呈现：符号智能体、强化学习、ReAct、AutoGPT、接口化、协议化、基准化、编码 Agent、长程任务、上下文工程、多 Agent、OpenClaw、Harness。
- 事实边界：日期逐字取正文；失败原因与寒冬因果只可采用正文判断。

### P1 · `docs/ai/models/speech-gen.md`

- 主骨架：文本 → 离散语音表示 → 波形的双路线流程，叠加服务运行时分层。
- 必须逐字呈现：GPT 自回归、VQVAE、ConditioningEncoder、Voice Prompt、LoRA 情感控制、HiFi-Decoder、DiT + DAV、Flow Matching、HTTP、模型加载、任务管理、Continuous Batching、Slot、GenerationStream、GPU Lock、CUDA Graph、TRT、WER、SIM。
- 事实边界：醒目标注“本文所述实现架构”；不泛化为全部 TTS；不补延迟、吞吐或质量分数。

### P1 · `docs/ai/agent/index.md`

- 主骨架：Copilot → Agent 分级阶梯，连接 Agent 架构环和记忆/RAG 分工。
- 必须逐字呈现：Function Calling、Agent 架构模式、短期记忆、长期记忆、多轮上下文、压缩、归档、知识归 RAG，个性化归记忆。
- 事实边界：不补成熟度标准；不与框架对比页重复。

### P1 · `docs/ai/index.md`

- 主骨架：四子域知识地图。
- 必须逐字呈现：模型、AI Infra、大模型应用、Agent，以及正文给出的相互关系。
- 事实边界：不增加第五子域，不塞模型版本。

### P1 · `docs/ai/models/index.md`

- 主骨架：模型演进主线 + 三层目录 + 三个规律。
- 必须逐字呈现：只提取正文“演进主线”“三层目录”“三个规律”的原词。
- 事实边界：不把三个规律改写成新定律，不补年代。

### P1 · `docs/ai/infra/index.md`

- 主骨架：三层 AI Infra 堆栈，连接文章导航与各层问题。
- 必须逐字呈现：正文“三层结构”和导航中的原词。
- 事实边界：不添加云产品或硬件规格。

### P1 · `docs/ai/infra/inference/index.md`

- 主骨架：推理子域知识地图。
- 必须逐字呈现：推理框架与 Serving、量化与加速、GPU 选型、模型服务、Prefill-Decode 分离、2026-09 前沿速览。
- 事实边界：“计划扩充”与“已发布”必须明显区分。

### P1 · `docs/ai/application/index.md`

- 主骨架：应用子域知识地图。
- 必须逐字呈现：RAG、Prompt 工程、安全、评测与知识生态、合规与备案、现有文章列表。
- 事实边界：计划内容与已发布文章视觉区分；不补产品案例。

## 5. 云计算页面载荷（17 张）

### P0 · `docs/cloud/foundation/openstack.md`

- 主骨架：创建一台 VM 的横向时序，上方控制平面，下方数据平面。
- 必须逐字呈现：Horizon/Skyline、OpenAPI/CLI/SDK、Keystone、nova-api、Neutron、nova-scheduler、Placement、Filter/Weigher、nova-conductor、nova-compute、Glance、Cinder、libvirt/KVM、RabbitMQ、Swift、Ironic、Heat、OVS/OVN、Ceph/SAN。
- 事实边界：不把 OpenStack 画成 OS 或 Hypervisor；不虚构组件直接调用；不把观点写成无来源结论。

### P0 · `docs/cloud/foundation/virtualization.md`

- 主骨架：CPU、内存、IO 三条机制链，右侧连接算力形态选择矩阵。
- 必须逐字呈现：VT-x/AMD-V、VMX root/non-root、VM Entry/Exit、VMCS/VMCB、GVA→GPA→HPA、EPT/NPT、VPID/ASID、KVM `/dev/kvm`、QEMU、设备模拟、virtio、vhost/DPDK、SR-IOV、大页、ballooning、KSM、pre-copy、VM、容器、Kata、Firecracker、gVisor、裸金属、Nitro、CIPU、DPU、vGPU、MIG、TDX、SEV-SNP。
- 事实边界：不标绝对性能倍率、固定延迟或损耗；不裁决 KVM 类型争议；容器不等同虚拟机隔离。

### P0 · `docs/cloud/foundation/sdn-nfv.md`

- 主骨架：SDN 控制链与 NFV 功能链双轨，在 VPC 数据面和 DPU 汇合。
- 必须逐字呈现：控制面、数据面、OpenFlow match/action/pipeline、PACKET_IN、FLOW_MOD、OVS 快慢路径、OVN、VXLAN、VTEP、VNI、VNF、NFVI、MANO、SFC、NSH、DPDK、DPU、SONiC、OpenConfig/gNMI、Neutron ML2、专线、VPN、骨干、SD-WAN、SASE。
- 事实边界：SDN 与 NFV 不作同义词；不宣称 OpenFlow 已统治生产网络；不补包速率或市场份额。

### P0 · `docs/cloud/infra/compute.md`

- 主骨架：中央实例状态机，外围为实例族、计费、弹性、算力形态四象限。
- 必须逐字呈现：Pending、Running、Stopped、Released、g/c/r/d/i/t/GPU、包年包月、按量、Savings Plan、RI、Spot、稳态基线、弹性波动、可中断任务、伸缩组、目标追踪、定时伸缩、warm pool、镜像启动、函数、Serverless 容器、应用引擎、Nitro、CIPU、裸金属、Arm、GPU。
- 事实边界：不固化实例型号、折扣、回收窗口、单价和性能；不承诺停机必不计费。

### P0 · `docs/cloud/infra/storage.md`

- 主骨架：块、文件、对象三路选择树；外围放冗余、快照、层级、性能与备份。
- 必须逐字呈现：云盘、virtio-blk、NVMe、RDMA/NVMe-oF、OSS/S3、PUT/GET、扁平 key、分片上传、冷热分层、NAS/CPFS、NFS/SMB、MDS/OST、三副本、Erasure Coding、ROW、COW、IOPS、吞吐、延迟、存算分离、3-2-1。
- 事实边界：不固定容量上限、持久性、延迟和价格；对象存储不具有 POSIX/fsync 语义。

### P0 · `docs/cloud/infra/network.md`

- 主骨架：一次请求的完整旅程：用户 → DNS/CDN/加速/WAF → LB → VPC/应用/数据库，并展示 NAT/EIP 和混合云链路。
- 必须逐字呈现：DNS、CDN、全球加速、Anycast、WAF、ALB/NLB、NAT/SNAT、EIP、专线、IPsec VPN、CEN/TR、VPC、vSwitch、路由表、安全组、网络 ACL、underlay、overlay、VXLAN、VTEP、VNI、ECMP、DPU、LVS DR/NAT/FullNAT、GTM、HTTPDNS。
- 事实边界：示例 CIDR 不作推荐；不写死 MTU、端口、带宽或超时；厂商产品名不是行业唯一实现。

### P0 · `docs/cloud/data/database.md`

- 主骨架：内核六骨架 → 主备/存算分离/分布式三级跳 → 三形态决策与四阶段迁移。
- 必须逐字呈现：B+ Tree、buffer pool、MVCC、undo/purge、xmin/xmax/vacuum、LSM-Tree、读/写/空间放大、隔离级别、主从复制、读写分离、CAP、集中式云原生、分布式、Serverless、关系型、NoSQL、NewSQL、向量、pgvector、Milvus、HNSW/IVF、评估、改造、双跑、割接。
- 事实边界：不放热度分数、QPS 或容量阈值；CAP 不简化成“三选二”；向量库不替代关系库。

### P0 · `docs/cloud/data/olap.md`

- 主骨架：五条引擎谱系 + 查询解剖 + 场景决策树。
- 必须逐字呈现：MPP 存算一体、预聚合 Cube、大宽表明细、联邦计算、湖仓服务层、StarRocks、Doris、ClickHouse、Druid、Kylin、Trino/Presto、Spark SQL、列存、压缩、稀疏索引、data skipping、向量化、物化视图、rollup、Lambda、Kappa、流批一体、CDC、Iceberg、Paimon、分区、分桶、副本、存算分离。
- 事实边界：不选绝对赢家；不标无上下文的延迟、压缩比、QPS 或规模；不暗示湖上直查天然亚秒。

### P0 · `docs/cloud/data/bigdata.md`

- 主骨架：采集 → 缓冲 → 存储 → 计算 → 服务五层数据流，上方叠加代际时间线，下方放湖格式决策。
- 必须逐字呈现：日志、CDC、埋点、Kafka topic/partition、HDFS、NameNode、GFS、YARN、Spark RDD/DataFrame、DAG、shuffle、Catalyst/Tungsten、Flink JobManager/TaskManager/Slot、状态后端、Checkpoint、事件时间、水位线、exactly-once、Flink CDC、对象存储、Iceberg、Delta、Hudi、Paimon、数仓、Lambda、Kappa、Lakehouse、数据治理、质量、调度编排、OLAP、检索、AI 消费。
- 事实边界：不写死版本；不宣称格式战争结束；exactly-once 不表达为无条件成立。

### P0 · `docs/cloud/native/kubernetes.md`

- 主骨架：`kubectl apply → API Server → etcd/watch → controller/scheduler/kubelet → Pod Running`，外围为网络、存储、弹性和企业落地。
- 必须逐字呈现：Desired State、Actual State、level-triggered reconcile、kube-apiserver、etcd、kube-scheduler、kube-controller-manager、cloud-controller-manager、kubelet、kube-proxy、容器运行时、Filter/Score、CRI、PV/PVC/StorageClass/CSI、Service、CNI、DNS、NetworkPolicy、iptables、nftables、eBPF、Deployment、StatefulSet、DaemonSet、Job、CronJob、HPA、VPA、CA、Karpenter、DRA、KServe、RDMA、多租户、节点池、升级、安全、可观测。
- 事实边界：不写死当前版本和阶段；不虚构组件直接 RPC；不暗示 K8s 解决应用一致性。

### P0 · `docs/cloud/native/microservice.md`

- 主骨架：一次请求的治理链路；顶部为单体 → SOA/ESB → 微服务；底部为拆分与 Mesh 决策。
- 必须逐字呈现：分布式八宗罪、康威定律、DDD 限界上下文、Scale Cube、AP/CP、配置推送/轮询、负载均衡、优雅上下线、超时、重试、熔断、舱壁、限流、Tracing、REST、gRPC、GraphQL、Dubbo Triple、事件驱动、Outbox、Saga、Dubbo、Spring Cloud、Service Mesh、sidecar、ambient、Ingress、Gateway API、Spring Cloud Alibaba、Higress、绞杀者模式。
- 事实边界：不按团队人数或服务数量给固定阈值；微服务不默认优于单体；Saga 不等于事务回滚。

### P0 · `docs/cloud/native/observability.md`

- 主骨架：信号源 → 采集 → OTel Collector → 三类存储 → 看板/告警/排障；右下为指标 → 链路 → 日志排障动线。
- 必须逐字呈现：Metrics、Logs、Tracing、TraceID、Prometheus pull、Service Discovery、Exporter、OpenTelemetry SDK/Collector/OTLP、Prometheus/Mimir、Loki/ES/SLS、Jaeger/Tempo/APM、cardinality、head block、WAL、PromQL、Span 树、上下文传播、头采样、尾采样、Profiling、eBPF、黄金信号、RED、USE、SLI/SLO、错误预算、燃烧率。
- 事实边界：不写死版本、阈值或成本；不宣称 AIOps 能可靠自动根因定位。

### P1 · `docs/cloud/index.md`

- 主骨架：基座、资源、数据、应用平台四层纵向技术栈，连接云与 AI。
- 必须逐字呈现：虚拟化/KVM、OpenStack、SDN/NFV、计算、存储、网络、数据库、大数据、Kubernetes、微服务治理、可观测。
- 事实边界：不增加厂商产品；四层不是唯一严格依赖架构。

### P1 · `docs/cloud/foundation/index.md`

- 主骨架：硬件 → 虚拟化 → 资源管理 → 网络虚拟化 → 调度运维。
- 必须逐字呈现：KVM/QEMU、CPU 虚拟化、EPT、virtio、Nova、Cinder、Neutron、Glance、Keystone、OVS、VXLAN、VPC、资源调度、超分、故障域、反亲和。
- 事实边界：不补版本或厂商实现；OpenStack 不等同 Hypervisor。

### P1 · `docs/cloud/infra/index.md`

- 主骨架：计算、存储、网络三列选择地图，汇合为负载、数据、成本三项输入。
- 必须逐字呈现：ECS、容器/K8s、Serverless、GPU、块/对象/文件、备份容灾、VPC、SLB/ALB、CDN、专线/VPN。
- 事实边界：不补实例型号、报价或 SLA；三类资源并非彼此独立。

### P1 · `docs/cloud/data/index.md`

- 主骨架：集成/湖仓底座 → 在线交易与分析查询 → 业务消费的数据生命周期。
- 必须逐字呈现：RDS/PolarDB、Redis、文档/宽表、OLAP、MaxCompute、Flink、DTS、数据湖/湖仓、Elasticsearch、业务特征、数据模型、一致性、成本与运维。
- 事实边界：不固化具体版本；热度不等于技术优劣。

### P1 · `docs/cloud/native/index.md`

- 主骨架：以 Kubernetes 为中心的工作负载、网络、存储、治理、可观测与发布辐射图。
- 必须逐字呈现：Deployment/StatefulSet/Job、Service/Ingress/CNI、CSI/PV/PVC、Prometheus/SLS/Tracing、注册发现、配置、限流熔断、金丝雀、蓝绿、灰度。
- 事实边界：不写死当前版本；Service Mesh 和 IDP 不表达为必选项。

## 6. 技术编年史页面载荷（8 张）

### P0 · `docs/chronicle/index.md`

- 主骨架：横向六浪总时间轴，每浪一张“核心命题/基础设施/成本主项/沉淀”四元卡；信创作为贯穿底层暗流；底部三条跨周期规律。
- 必须逐字呈现：移动互联网、ECS、弹性伸缩、计算；直播、CDN、转码、带宽调度、带宽；短视频、海量存储、转码矩阵、推荐基建、存储与转码；区块链、联盟链、BaaS、存证、共识开销；元宇宙、GPU 云、云渲染、边缘、显卡；AI 大模型、GPU 集群、推理服务、算力与 token；供需缺口、成本主项迁移、泡沫退潮后留下基础设施。
- 事实边界：六浪时间可重叠，不画成严格首尾相接；AI 窗口保持本页“2023–今”；不预测下一浪。

### P0 · `docs/chronicle/ai-era.md`

- 主骨架：论文、模型与产品、基础设施与产业三线并进；分为 2012–2016、2017–2020、2022–2023、2024、2025、2026 截至 09；中央为预训练缩放 → 成本工程 → 推理时计算 → Agent 委托。
- 必须逐字呈现：AlexNet、AlphaGo、Transformer、Attention Is All You Need、Scaling Laws、GPT-3、in-context learning、Chinchilla、ChatGPT、LLaMA/Llama 2/Mistral、Prompt 工程、RAG、o1、test-time compute、DeepSeek-V3、MoE、DeepSeek-R1、RL、蒸馏、MCP、Model Context Protocol、Agent、DP/TP/PP/EP、超节点、PUE、KV Cache、continuous batching、prefill/decode 分离、投机解码、模型网关、LLM 可观测、语义缓存。
- 事实边界：这是产业编年，不展开模型内部机制；快变数字若使用必须逐字取正文并标截至时间；不做排名或预测。

### P0 · `docs/chronicle/xinchuang.md`

- 主骨架：四阶段政策/产业双轨时间线；中央五层生态按“源头/现状/卡点”展开；底部 CPU 路线和全栈适配组合。
- 必须逐字呈现：核高基、党政试点、根社区捐赠、东数西算、79 号文、七项政府采购需求标准；芯片（CPU+AI 芯片）→ 操作系统 → 数据库/中间件 → 云平台/整机 → 应用生态适配；Arm、鲲鹏、飞腾、x86、海光、兆芯、LoongArch、龙芯、SW-64、申威、RISC-V、昇腾、寒武纪、海光 DCU、银河麒麟、统信 UOS、openEuler、Anolis OS、OceanBase、GaussDB/openGauss、达梦、TiDB、TDSQL、TongWeb、宝兰德、金蝶天燕、中创、CANN、6R。
- 事实边界：区分“官方公开”与“公开报道”；79 号文原文未公开；不做厂商排名、自主程度或性能定级；CPU 与 AI 芯片同属芯片层。

### P1 · `docs/chronicle/mobile-internet.md`

- 主骨架：2007–2019 时间线；终端与生态 → 网络与超级 App → 万物移动化三幕；连接 PC 后端到移动后端架构演进。
- 必须逐字呈现：iPhone、App Store、Android G1、APNs、3G、TD-LTE/4G、微信、公众平台、红包、O2O、移动支付、双端 App、移动接入网关、长连接、鉴权、限流、降级、云数据库、缓存、推送通道、CDN、弹性伸缩、单元化、全链路压测、熔断、消息队列削峰、对象存储、Serverless、小程序。
- 事实边界：不外推流量、QPS、用户数；观点标明是综合判断；双 11 不混用不同统计口径。

### P1 · `docs/chronicle/livestream.md`

- 主骨架：采集推流 → 接入/源站 → 转码/切片 → CDN → 多端拉流；IM 与 RTC 旁路；旁列协议–延迟–角色阶梯。
- 必须逐字呈现：RTMP、HLS、HTTP-FLV、SRT、WebRTC、GSLB、源站、H.264、GPU/FPGA 转码、TS+m3u8、CDN L1/L2、回源、IM 消息通道、RTC 网关、旁路混流、ABR、FEC、ARQ、弱网对抗、95 峰值、码率即成本。
- 事实边界：延迟只写正文经验量级，不作 SLA；WebRTC 是互动链路；RTMP 不画成已完全淘汰。

### P1 · `docs/chronicle/short-video.md`

- 主骨架：拍摄 → 分片上传 → 审核 → 转码矩阵 → 对象存储 → CDN → 召回/粗排/精排/重排 → 无限下滑 → Kafka/Flink 回流的闭环。
- 必须逐字呈现：抖音、快手、TikTok、微信视频号、推荐四段式、特征平台、实时特征流、A/B 实验、Monolith、OneRec、生成式推荐、Kafka、Flink、参数服务器、H.264/AVC、H.265/HEVC、AV1、H.266/VVC、GPU/ASIC 转码、冷热分层、CDN 预热、预加载、首帧、机审+人审、显式/隐式 AI 标识、UGC、微短剧。
- 事实边界：OneRec 不表示已取代全行业级联；编码节省不作通用保证；不制造平台排名。

### P1 · `docs/chronicle/blockchain.md`

- 主骨架：2008–2026 全球/中国双轨时间线；公共链、技术底座、产业联盟链/海外金融制度化/数字人民币三层结构；底部“要不要用链”决策树。
- 必须逐字呈现：比特币、以太坊、ERC-20、Prev_Hash、Merkle root、PoW、PoS、PBFT、Raft、EVM、The DAO、重入漏洞、硬分叉、Hyperledger Fabric、FISCO BCOS、长安链、BaaS、Peer、Orderer、MSP/CA/PKI、DeFi、NFT、Rollup、Layer 1/Layer 2、Optimistic Rollup、ZK Rollup、blob、EIP-4844、账户抽象、e-CNY、mBridge。
- 事实边界：不做投资判断或币价预测；公共链、联盟链、数字人民币分轨呈现；不表达“大文件上链”或“区块链需要 GPU”。

### P1 · `docs/chronicle/metaverse.md`

- 主骨架：18 个月概念周期 → 技术器官迁移；1992–2026 时间线、2021 三触发器、技术就绪度矩阵、遗产流向 AI 与工业。
- 必须逐字呈现：Snow Crash、Second Life、Roblox、Oculus/Quest 2/Quest 3/3S、Meta、Horizon Worlds、Reality Labs、Omniverse、Apple Vision Pro、Ray-Ban Meta、AI 眼镜、实时渲染、Pixel Streaming、RTC、SFU、NVENC、USD/OpenUSD、OpenXR、GIS/BIM/IoT、实例池化、镜像预热、画质分级、会话状态、物理 AI、工业数字孪生。
- 事实边界：退潮不等于技术死亡；约 100ms 是正文经验预算而非 SLA；AI 眼镜与沉浸头显分开。

## 7. 跳过页面

- `docs/index.md`：使用 `layout: home` 与 `<AppleHome />`，新增独立位图会与首页 Hero 和导航重复，且无正文事实载荷。
- `docs/about.md`：不适合高密度技术图。若后续坚持生成，只能做“云计算/人工智能/技术编年史”三支柱与内容治理流程；不得出现作者画像、从业年限、客户案例、团队规模或更新频率承诺。

## 8. 文件与页面约定

- 输出路径：`docs/public/images/<页面目录>/<页面名>-overview.png`。
- 页面引用：放在一级标题后、正文导语前。
- Alt 文本：用一句话概括主骨架与关键模块，不堆叠完整术语表。
- 图注统一说明：`本站生成的 4K 全文阅读地图；具体版本、参数与结论以正文引用的一手来源为准。`
- 不覆盖已有图片；迭代稿使用 `-v2`、`-v3`，用户确认后再替换正式文件。

## 9. 每张图的验收清单

1. 尺寸为 3840×2160，PNG，不透明。
2. 标题、技术名词、缩写、公式逐字核对；不得有错别字、乱码或伪字。
3. 主骨架在缩放到网页宽度时仍可一眼识别；100% 查看时所有小字可读。
4. 图中每个数字、日期、版本、价格、性能值都能在当前页面正文找到原文。
5. 箭头语义正确；并列、替代、演进、调用、反馈不混用。
6. 不出现正文没有的厂商、模型、组件、结论或排名。
7. 视觉与方案 B 同系列，但不机械复制七步流程版式。
8. 先预览，不自动批量写入页面；用户确认批次后再落盘与插入 Markdown。

## 10. 推荐批次

- 批次 A（6 张模板校准）：LLM、RAG、LLM 推理、GPU 集群、评测、六浪总览。
- 批次 B（AI P0）：模型、训练、推理经济、应用与 Agent 专题。
- 批次 C（Cloud P0）：Foundation → Infra → Data → Cloud Native。
- 批次 D（Chronicle）：AI 时代、信创，再生成其余五浪。
- 批次 E（P1 导读页）：根据已完成正文图统一抽象，最后生成，避免术语和结构冲突。
