---
title: OpenStack 架构与十年演进
outline: [2, 3]
---

# OpenStack 架构与十年演进

> 在公有云成为"水电煤"之前，OpenStack 是一代工程师搭建私有云的事实标准。理解它，不只是理解一个开源项目，而是理解"云"这个抽象是如何被一层层构建出来的——今天公有云产品里的很多设计，都能在 OpenStack 里找到原型或反面教材。

## OpenStack 是什么

一句话：**OpenStack 是一组用 Python 编写的控制平面服务，把机房里的计算、存储、网络硬件抽象成可以通过 API 供给的资源池**。

它不是操作系统，不是 Hypervisor，也不是虚拟化软件。KVM 负责真正运行虚拟机，OpenStack 负责回答："这台物理机上还能不能再塞一台 4C8G 的虚拟机？塞在哪台最合适？网络怎么通？镜像从哪来？"

理解了这一点，就理解了它在技术栈中的位置：

```mermaid
flowchart TB
  subgraph 用户与运维
    U1[Dashboard Horizon]
    U2[OpenAPI / CLI]
  end
  subgraph 控制平面 - OpenStack
    K[Keystone 认证]
    N[Nova 计算]
    C[Cinder 块存储]
    NE[Neutron 网络]
    G[Glance 镜像]
    SC[Swift 对象存储]
  end
  subgraph 数据平面 - 基础设施
    H[KVM / QEMU]
    O[OVS / Linux Bridge]
    D[物理磁盘 / SAN / Ceph]
  end
  U1 & U2 --> K
  K --> N & C & NE & G
  N --> H
  C --> D
  NE --> O
```

::: tip 关键认知
OpenStack 的每个组件本质上都是一个"带状态机的 API 服务 + 消息队列驱动的异步执行器"。创建一台虚拟机的请求，会在 Nova、Neutron、Cinder、Glance 之间通过消息总线接力——这也是它所有复杂性与故障模式的根源。
:::

## 核心组件全景

| 组件 | 职责 | 一句话理解 |
| --- | --- | --- |
| **Keystone** | 认证与授权 | 所有服务的入口守卫，管 token 和 endpoint |
| **Nova** | 计算资源编排 | 虚拟机生命周期管理，但不含虚拟化本身 |
| **Glance** | 镜像服务 | 系统镜像的仓库与分发 |
| **Cinder** | 块存储 | 把存储后端抽象成"云盘"，挂给虚拟机 |
| **Neutron** | 网络即服务 | 虚拟网络、子网、路由、安全组、浮动 IP |
| **Swift** | 对象存储 | 海量非结构化数据，架构上是独立的分布式系统 |
| **Heat** | 编排 | 用模板声明式地拉起整套资源（IaC 的先声） |

下面这张是官方的组件全景图（v2026.04.01，即 Gazpacho 版），可以当作上表的扩展版来读：除了 Horizon、Skyline 两个前端，表里没列的 Ironic（裸金属）、Cyborg（加速器）也在其中——后文 AI 场景会再提到它们。

![OpenStack 官方组件全景图：计算、存储、网络、共享服务四大类核心服务，外围是客户端工具、集成使能、运维工具与生命周期管理工具](/images/cloud/openstack/openstack-map.png)

*图：OpenStack 官方组件全景图（OpenStack Map，v2026.04.01），来源：[openstack.org Software Overview](https://www.openstack.org/software/)。*

一个典型的"创建虚拟机"调用链，能看清组件间如何协作：

```mermaid
sequenceDiagram
  participant U as 用户
  participant KS as Keystone
  participant NV as Nova
  participant GL as Glance
  participant CI as Cinder
  participant NT as Neutron
  U->>KS: 获取 Token
  U->>NV: POST /servers
  NV->>GL: 查询镜像位置
  NV->>CI: 创建系统盘卷
  NV->>NT: 分配网络端口
  NV->>NV: 调度器选择宿主机
  NV->>NV: 下发 libvirt 启动 KVM 虚机
  NV-->>U: 返回实例状态（BUILDING→ACTIVE）
```

## 两个值得深究的设计

### 调度器：资源编排的核心难题

Nova Scheduler 要回答"新虚拟机放哪台宿主机"。流程是**过滤（Filter）+ 加权（Weigher）**：

- 过滤器：剩余资源够不够、反亲和约束、可用区约束、镜像本地缓存……
- 加权器：在候选集里打分——打散更均匀，还是装箱更紧凑？

这里藏着云计算最经典的取舍：**装箱（bin-packing）提高利用率但放大故障半径，打散（spread）提高可用性但降低密度**。公有云的调度系统至今仍在解同一道题，只是规模大了三个数量级、解法从静态权重进化到了预测与机器学习。

### Neutron 的 ML2 插件体系

Neutron 把网络拆成**核心模型（网络/子网/端口）**和**机制驱动（Mechanism Driver）**：上层统一 API，下层由插件决定真实实现（OVS、Linux Bridge、硬件 SDN……）。

这个"模型与实现分离"的设计非常超前——今天公有云的 VPC 产品，本质上是同一思想的工业化版本：控制面统一定义网络模型，数据面由自研转发引擎（甚至智能网卡）实现。

## 十年兴衰：基座为什么会"退场"

我入行的头几年，OpenStack 就是"云"的代名词。但回头看，私有云基座的退潮几乎是必然的：

### 成本账算不过来

- **运维成本**：一支能维护 OpenStack 的团队，人力成本远超中小企业的整个 IT 预算。升级一次大版本，往往需要数月的兼容性验证。
- **资源利用率**：小规模集群里，管理组件自身就要吃掉相当比例的资源；规模效应出不来，单位成本永远打不过公有云。
- **迭代速度**：公有云以周为单位发布新产品；私有云的 OpenStack 集群，三年不动是常态。

### 真正的转折：云原生

容器与 Kubernetes 改变了应用与基础设施的关系。应用不再关心"我在哪台虚拟机上"，只关心"有没有 API 可以调"。**基础设施的消费方式从"管资源"变成了"用服务"**——而这恰恰需要巨大的规模来摊薄服务化的成本，公有云的护城河因此越挖越深。

### 留给行业的东西

OpenStack 没有消失，而是完成了历史使命后的"退隐"：

1. 它培养了中国第一代云计算工程师——今天公有云厂商的核心团队里，有大量 OpenStack 出身的工程师；
2. 它的 API 语义（实例、卷、网络、镜像）成了行业通用语言；
3. 它的教训同样宝贵：控制面的复杂度管理、大规模状态机的工程化、升级兼容性——这些坑，后来的云厂商都绕着走或填得更平。

## OpenStack 的 2026：现状与定位

写完上面的"退场"，常有刚入行的同事问我："所以 OpenStack 死了？"没有。这一节用 2026 年的官网数据补上另一半图景——它不再是"全民热潮"，但早已在特定阵地里回到默认选项的位置。

先核对几个事实：

- **发布节奏没变，已走到第 33 个版本。** 官方维持约 6 个月一轮、一年两版的节奏：2026.1 'Gazpacho' 于 2026-04-01 发布，2026.2 'Hibiscus' 预计 2026 年 9 月底；每年有一个 SLURP（Skip Level Upgrade Release Process，允许跨版本跳级升级的长支持版）——Gazpacho 正是 SLURP 版，维护期预计到 2027 年 10 月，说明社区仍然把"长期运行环境的升级路径"当作头等大事。
- **规模没有萎缩。** OpenInfra Foundation 官网披露：OpenStack 支撑全球 300+ 个公有云数据中心、部署在 5500 万+ 核心上，背后有 560+ 支持组织；Gazpacho 一个版本就有约 500 名贡献者、来自 100 个组织（含 Ericsson、Red Hat、Walmart、NVIDIA），半年合入近 9000 项变更。
- **治理早已"去 OpenStack 化"。** OpenStack Foundation 更名为 OpenInfra Foundation（Open Infrastructure Foundation）后，又成为 Linux Foundation 旗下成员；OpenStack 只是其与 StarlingX（边缘/电信云）、Kata Containers、Zuul 并列的项目之一，遵循 Four Opens（开放源码、开放设计、开放开发、开放社区）原则，技术方向由社区选举的 Technical Committee 负责。

![OpenStack 官方概念架构图：上层是 Kubernetes 集群、AI 训练、AI 推理、传统虚拟机四类工作负载，经 OpenStack API 统一供给下层的裸金属、虚拟机与容器](/images/cloud/openstack/openstack-conceptual-architecture.png)

*图：OpenStack 官方概念架构图（2025 版）。注意上层工作负载：K8s 集群、AI 训练、AI 推理与传统虚拟机并列；底层把硬件统一抽象为裸金属/虚拟机/容器。来源：[openstack.org Software Overview](https://www.openstack.org/software/)。*

结合官方材料，我对它 2026 年定位的判断有四条：

- **私有云/专有云底座，"VMware 迁移"是新引擎。** 自 Broadcom 改变 VMware 授权策略以来，官方把 "VMware Migration to OpenStack" 列为独立用例，近几个版本的发布亮点里，并行热迁移、vTPM 热迁移等虚机迁移能力常居前列。对要自主可控、要管到硬件的客户，OpenStack 仍是最完整的开源答案。
- **电信云没有退场，只是更聚焦。** OpenStack + StarlingX 仍是 NFV/边缘场景的主流开源组合，Ericsson 等电信厂商持续贡献——这也是下面实践观点里把电信云列在"还会遇到"第一位的原因。
- **与 K8s 的关系已经定形：分层共存，而非谁替代谁。** 官方概念图把 Kubernetes 集群画成 OpenStack 之上的工作负载之一——K8s 管应用、OpenStack 管硬件；我见过的多数生产环境，最终形态都是"OpenStack 打底跑 K8s"。
- **AI 基础设施是新增长点。** 官方开了 "OpenStack for AI" 专栏并发布白皮书 *Open Infrastructure for AI: OpenStack's Role in the Next Generation Cloud*；落点不是训练编排，而是 IaaS 打底——Ironic 做 GPU 集群的裸金属供给、Cyborg 加速器驱动（GPU/FPGA/QAT/网卡等）、PCI 直通与 NUMA 感知调度、多租户 GPU 调度。近年的 GPU 云、主权云项目，多数走的正是这条路。

一句话总结：**2026 年的 OpenStack 不再试图做"所有人的云"，而是落定为私有云/专有云、电信云、AI/HPC 裸金属云三类场景的专业底座。** 上面写的"退场"，退的是大众市场；在这些阵地上，它仍在以一年两版的节奏积极迭代。

## 实践观点

- **什么时候还会遇到 OpenStack**：电信云（NFV 场景）、部分政企私有云、科研机构。接手这类环境的同学，重点看 Neutron 的网络实现和 Cinder 的后端对接，这两处是故障高发区。
- **学它的正确姿势**：不要学部署（部署细节已成历史），要学抽象——"如何把硬件变成 API"这个问题，OpenStack 给出的答案依然是最完整的公开教材。
- **与今天公有云的对照**：ECS ≈ Nova + 更强的调度；云盘 ≈ Cinder 的工业化；VPC ≈ Neutron 模型的规模化实现。对照着看，能同时理解两边的设计取舍。
- **OpenStack 作为 AI 打底**：以后接 GPU 集群建设任务，看到"Ironic 裸金属 + Cyborg/PCI 直通 + 上层 K8s"的组合不要惊讶——OpenStack 在其中的角色不是训练编排，而是"把硬件变成 API"（另见 [GPU 集群与高速网络](/ai/infra/cluster)）。

## 参考资料

<Refs>

- [OpenStack Releases：发布系列状态表（2026.1 Gazpacho、2026.2 Hibiscus 等排期）](https://releases.openstack.org/)（访问日期 2026-09-04）
- [OpenStack 2026.1 'Gazpacho' 发布页](https://www.openstack.org/software/openstack-gazpacho/)（访问日期 2026-09-04）
- [OpenStack Software Overview（含概念架构图与 OpenStack Map）](https://www.openstack.org/software/)（访问日期 2026-09-04）
- [OpenStack for AI: Scalable, Open Infrastructure for Next-Gen Workloads（含 Open Infrastructure for AI 白皮书）](https://www.openstack.org/openstack-for-ai/)（访问日期 2026-09-04）
- [OpenInfra Foundation 官网](https://openinfra.dev/) · [The Four Opens](https://openinfra.dev/four-opens/)（访问日期 2026-09-04）
- [OpenStack Docs 2026.1](https://docs.openstack.org/2026.1/)（访问日期 2026-09-04）
- 图片来源：OpenStack 官方概念架构图（2025 版）与官方组件全景图 OpenStack Map（v2026.04.01），均下载自 [openstack.org Software Overview](https://www.openstack.org/software/)（访问日期 2026-09-04）
- 站内相关：[虚拟化与 KVM](/cloud/foundation/virtualization) · [SDN / NFV](/cloud/foundation/sdn-nfv) · [Kubernetes 核心机制与企业级落地](/cloud/native/kubernetes) · [GPU 集群与高速网络](/ai/infra/cluster)

</Refs>