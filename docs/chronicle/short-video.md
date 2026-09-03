---
title: 短视频时代
outline: [2, 3]
---

# 短视频时代（约 2018–2021）

> 这是 [技术编年史](/chronicle/) 的第三浪，也是唯一一浪"找不到退潮日"的周期。如果你和我一样在 2018 年前后开始接触短视频平台的云上架构，会发现一个反直觉的事实：短视频没有上演"眼见他起高楼"的戏剧，它只是悄悄把推荐系统、对象存储、转码矩阵变成了整个行业的地板。这篇写给想理解"规模成本工程"从何而来的读者——因为今天大模型时代的很多成本方法论，原型都在这里。

## 时代的坐标

直播教会行业"实时"，短视频教会行业"规模"。当内容消费从"看一场"变成"无限刷"，技术命题就变成了**海量媒体的成本工程 + 推荐系统的规模化**——算法第一次成为基础设施级的存在。

用公开数据给这个坐标钉几颗钉子：

- 2011 年 3 月，快手的前身"GIF 快手"还是一款制作和分享动图的工具 App；2013 年转型短视频社区，是这场长跑最早的起跑枪（[来源：英文维基百科 Kuaishou 词条](https://en.wikipedia.org/wiki/Kuaishou)）
- 截至 2020 年 12 月，中国短视频用户规模达 8.73 亿，占网民整体的 88.3%——CNNIC 第 47 次《中国互联网络发展状况统计报告》口径（[CNNIC 第 47 次报告](https://www.cac.gov.cn/2021-02/03/c_1613923422728645.htm)）
- 截至 2021 年 12 月，短视频用户规模攀升至 9.34 亿，占网民整体的 90.5%，**历史性突破 9 亿大关**——CNNIC 第 49 次报告（数据截至 2021 年 12 月，2022 年 2 月发布，[中国教育和科研计算机网转载](https://www.cernet.edu.cn/xxh/ji_shu_ju_le_bu/Internet/202203/t20220304_2213218.shtml)）
- 2021 年 9 月底，字节跳动披露 TikTok 全球月活跃用户突破 10 亿（[来源：路透社日文版 2021-09-27](https://jp.reuters.com/markets/global-markets/FJWTMFWOR5ONRIDKM3CWJIXOFA-2021-09-27/)）

一个在中国做内容生意的平台，用户盘子一年净增 6000 万；一个出海的应用，四年做到 10 亿人每月打开。这两条曲线叠加，就是"规模"二字的分量。

## 关键节点编年

| 时间 | 节点 | 意义 |
| --- | --- | --- |
| 2011.03 | GIF 快手上线（工具 App） | 短视频时代的"史前遗迹" |
| 2013 | 快手转型短视频社区 | 第一批 UGC 短视频供给沉淀 |
| 2014.08 | Musical.ly 正式发行 | 口型同步短视频在北美青少年中引爆 |
| 2016.09.20 | 抖音以"A.me"名义上线，同年 12 月更名 | 字节跳动把头条系的推荐引擎装进了短视频 |
| 2017.09 | TikTok 面向国际市场发布 | 抖音的出海孪生版本 |
| 2017.11.09 | 字节跳动以近 10 亿美元收购 Musical.ly | 当时今日头条史上最大收购案（[WSJ 报道](https://www.wsj.com/articles/lip-syncing-app-musical-ly-is-acquired-for-as-much-as-1-billion-1510278123)） |
| 2018.08.02 | Musical.ly 账号与数据并入 TikTok | 借船出海完成，TikTok 正式登上国际舞台（[路透社](https://www.reuters.com/article/technology/chinas-bytedance-scrubs-musically-brand-in-favor-of-tiktok-idUSKBN1KN0BN/)） |
| 2020.04 | TikTok 全球移动下载量突破 20 亿 | 疫情宅家红利叠加推荐飞轮（[英文维基百科 TikTok 词条](https://en.wikipedia.org/wiki/TikTok)） |
| 2020.09.15 | YouTube Shorts 在印度开启 beta | 巨头全面入场（[英文维基百科 YouTube Shorts 词条](https://en.wikipedia.org/wiki/YouTube_Shorts)） |
| 2021.02.05 | 快手在港交所挂牌，代号 1024 | "短视频第一股"，开盘大涨约 194%（[快手 IR 公告](https://ir.kuaishou.com/zh-hans/news-releases/news-release-details/kuaishou-technology-announces-details-proposed-listing-main)、[新浪财经](https://finance.sina.com.cn/tech/2021-02-05/doc-ikftssap3938025.shtml)） |
| 2021.07.13 | YouTube Shorts 全球发布 | 短视频完成对全行业的"格式同化" |
| 2022.02 | CNNIC 第 49 次报告：短视频用户 9.34 亿 | 十个人上网，九个刷短视频 |

![TikTok 音符图标，与抖音同源](/images/chronicle/short-video/tiktok-logo.png)

*图源：Wikimedia Commons（[File:Tiktok logo.png](https://commons.wikimedia.org/wiki/File:Tiktok_logo.png)，CC0）*

这条时间线里我最想强调的是 2017–2018 的收购与合并：Musical.ly 提供了北美用户底盘和内容生态，TikTok 提供的是背后的推荐引擎和工程体系。很多人把 TikTok 的成功归因于"会做特效"，但从架构师视角看，真正的杀器是**把今日头条验证过的推荐系统规模化能力，直接平移到了视频形态上**。

![TikTok 完整标识](/images/chronicle/short-video/tiktok-full-logo.png)

*图源：Wikimedia Commons（[File:Tik Tok logo.svg](https://commons.wikimedia.org/wiki/File:Tik_Tok_logo.svg)，CC BY-SA 3.0）*

## 技术驱动：三条线的合流

为什么恰好是这个时间窗起浪？我的判断是三要素齐备：移动终端成熟（4G 资费下降、智能手机拍摄能力过剩）、推荐算法跨过可用性门槛（深度学习的视觉与排序模型在 2016 年前后集体成熟）、创作工具平民化（一键拍同款把 UGC 门槛打到地板）。三条线背后对应三组技术栈。

### 推荐算法：从锦上添花到基础设施

抖音/TikTok 的推荐范式与 Facebook 一代有本质区别：前者按"社交关系"分发，后者按"内容兴趣"分发——用户不需要关注任何人，算法根据每一次完播、重播、点赞、划走的行为流实时改写推荐（机制描述见[英文维基百科 TikTok 词条](https://en.wikipedia.org/wiki/TikTok)）。这在工程上催生了一整套今天看来平平无奇、在当时却是全新物种的基建：

- **召回 / 粗排 / 精排 / 重排四段式流水线**：从百万级候选到十几条下发，每一段都是不同的模型与不同的延迟预算
- **特征平台 + 实时特征流**：用户行为日志经消息队列（Kafka 类）流入实时计算引擎（Flink 类），分钟级更新特征——这是"实时数仓"概念第一次被业务逼到极限
- **大规模 A/B 实验平台**：推荐系统的迭代速度取决于实验吞吐量，流量切分、指标体系、自动报告成为平台工程

### 编解码：成本生命线

短视频的账单大头藏在比特里。2013 年正式定版的 H.265/HEVC 标准，在同等画质下比 H.264 提供 25%–50% 的压缩率提升（[英文维基百科 High Efficiency Video Coding 词条](https://en.wikipedia.org/wiki/High_Efficiency_Video_Coding)）——对一个日上传千万条视频的平台，这就是每年省下的真金白银。于是：

- **转码矩阵成为标配**：一条上传视频派生多个分辨率/码率档位，适配不同网络与终端
- **"窄带高清"类智能编码兴起**：感知编码、ROI 增强，在主观画质与码率之间反复博弈——编码参数就是财务报表
- **解码在端、编码在云**：H.265 编码复杂度远高于 H.264，GPU/ASIC 转码集群的利用率优化第一次成为架构课题（承接[直播时代](/chronicle/livestream)的转码成本账，但规模大一个数量级）

### 拍摄特效：CV 第一次大规模在线服务

人脸关键点、美颜磨皮、AR 贴纸、手势触发——这些计算机视觉能力从实验室走进亿万部手机的前置摄像头。为了保住"秒开"与帧率，模型被压缩、量化、蒸馏后端侧部署，云端负责素材下发与内容审核。今天回看，**这就是"模型即服务"运维范式（多版本模型、灰度、监控、端云协同）的第一次全行业预演**。

![YouTube Shorts 图标，短视频格式同化时代的注脚](/images/chronicle/short-video/youtube-shorts-icon.png)

*图源：Wikimedia Commons（[File:YouTube Shorts icon 2024.svg](https://commons.wikimedia.org/wiki/File:YouTube_Shorts_icon_2024.svg)，Public domain）*

## 对云架构的影响：本站视角

把一条短视频从镜头前送到用户拇指下，完整管线大致如下——注意每一段都对应一类云产品的极限压力：

```mermaid
flowchart LR
  A["端上拍摄<br/>美颜/AR 特效（CV 模型端侧推理）"] --> B["分片上传<br/>对象存储直传 + 断点续传"]
  B --> C{"内容审核<br/>机审为主、人审兜底"}
  C -->|通过| D["转码矩阵<br/>多档位 H.264/H.265<br/>GPU 集群"]
  C -->|违规| X[拦截/封禁]
  D --> E[("对象存储<br/>原片+派生副本×N<br/>冷热分层+生命周期")]
  E --> F["CDN 预热/缓存<br/>热点推边、长尾回源"]
  F --> G["推荐系统<br/>召回→粗排→精排→重排<br/>几十毫秒延迟预算"]
  G --> H["端上无限下滑<br/>预加载 + 秒开优化"]
  H -.行为日志.-> I["实时计算<br/>Kafka/Flink 特征流"]
  I -.-> G
```

三个最直接的架构冲击：

### 海量小对象：存储账单的指数曲线

一线亲历的典型场景：客户的存储账单曲线不是线性增长，是指数爬坡——**内容只进不出**。每条上传派生出原片、多档转码流、封面帧、音轨，对象数量比文件数量再乘一个系数。应对动作从这一浪起成为全行业标配：

- PB 级对象存储（OSS 类）承载媒体底座，见 [对象存储](/cloud/infra/storage)
- 冷热分层 + 生命周期规则：99% 的视频从未被第二次播放，但平台不敢赌自己是那 1%，于是"沉降 + 随时可召回"成为默认策略
- 存储成本与命中率联动核算：低频/归档存储的取回费与请求费进架构评审清单

### 分发成本：从"回源拉取"到"预热推边"

直播时代的分发是"少数热门流、长时间在线"；短视频是"海量长尾、脉冲式热点"——一条视频可能十分钟内从 0 冲到百万 QPS。工程上的反应：

- **CDN 预热**：发布瞬间把热门内容主动推到边缘节点，用调度换命中率
- 预加载与秒开：端侧在用户滑动时提前拉取下 N 条的首片段，把"首帧时间"做成北极星指标——带宽成本从"用户拉"变成"平台赌"
- 编码档位与带宽联动：省 10% 码率约等于省 10% 带宽采购，这是直播时代"带宽即成本"公式的精细化版本

### 离线计算与在线推理：大数据栈被业务拉大了一号

推荐系统是一台吞吐日志的怪兽：行为埋点 → 数据湖（承接移动互联网时代建的底座，见[大数据体系](/cloud/data/bigdata)）→ 离线特征与样本 → 模型训练 → 实验上线。**大数据平台第一次不是"企业 IT 的项目"，而是核心业务的心脏**——这一浪把国内实时数仓、湖仓一体的需求整体提前了。

另一头是在线推理：推荐精排给整个链路的延迟预算只有几十毫秒，倒逼特征服务、模型服务做到极致的工程化（高可用、水平扩展、模型多版本热更新）。这套运维范式，就是今天大模型推理服务（见 [AI 推理服务](/ai/infra/inference/)）的直接前身。

## 一线回望

做 SA 这些年，短视频时代给我留下三个肌肉记忆：

1. **成本报表要下钻到"每次播放"**。我们给客户做过最细的账，是单条视频从上传到退役的全生命周期成本（存储 × 驻留时长 + 转码次数 + 分发流量），这个"单位内容成本"指标，和今天"单位 token 成本"的算法如出一辙。
2. **GPU 集群的利用率是被账单逼出来的**。转码负载有明显的潮汐性，混部、抢占实例、弹性伸缩这些今天大模型训练集群的常规操作，当年先在转码集群里用了一遍。
3. **最大的误判是低估"无限下滑"**。2018 年前后不少传统客户把短视频当"活动页的素材库"，容量规划按营销峰值做；结果用户行为是 7×24 的持续刷新，长尾流量远超想象。**这浪教育行业：推荐驱动的系统，流量形状由算法决定，容量规划必须跟着行为模型走**。

![快手标识，短视频时代最早的幸存者之一](/images/chronicle/short-video/kuaishou-logo.png)

*图源：Wikimedia Commons（[File:Kuaishou logo.png](https://commons.wikimedia.org/wiki/File:Kuaishou_logo.png)，Public domain）*

## 兴衰逻辑：为什么"看不见它退潮"

- **为什么兴起**：前文三要素（终端、算法、创作工具）齐备，缺一浪不起。
- **为什么没有退潮**：短视频没有退潮，**它变成了背景板**。2021 年后，电商加短视频、新闻加短视频、连音乐 App 都在做"刷"——当一种技术彻底融入日常，它就从"浪潮"变成了"环境"，这也是它长期缺席各类技术编年史的原因。一个浪潮的终点，是成为别人的默认设置。
- **留下了什么**：推荐基础设施（所有 App 的标配）、海量媒体成本工程（对象存储生命周期、转码档位体系、CDN 预热方法论）、视频云产品线的完整形态，以及被这个年代喂养长大的整整一代端侧 CV 与实时计算工程师。

## 对今天的启示

- **成本工程的传承**：当年为转码和带宽做的每一分优化——单位资源产出核算、档位分级、命中率与成本的博弈——方法论正原样复用在推理算力上。token 成本优化的很多套路（量化换吞吐≈降码率换带宽、结果缓存≈CDN 边缘缓存、模型分级路由≈按网络自适应选清晰度），在转码成本优化里都有原型。
- **算法基础设施化的第一次预演**：推荐系统教会行业"如何把模型变成 7×24 的在线服务"——特征平台、模型版本管理、A/B 灰度、延迟预算制，这正是[大模型应用](/ai/models/llm)栈的直接前身。看懂短视频的 MLOps，就看懂了大模型推理服务一半的运维日常。
- **警惕"叙事盲区"**：热搜关注度与基础设施重要性可以严重脱节。评估一浪技术的遗产，别看话题榜，看你的账单里哪一项增长最快。

## 站内相关

- 上一浪：[直播时代](/chronicle/livestream)——实时音视频与 CDN 的极限考验
- 并行暗线：[区块链时代](/chronicle/blockchain)、[元宇宙时代](/chronicle/metaverse)——后者为短视频之后攒下了 GPU 供给
- 技术承接：[大数据体系](/cloud/data/bigdata)（被推荐系统拉大的那一号底座）、[对象存储](/cloud/infra/storage)、[AI 推理服务](/ai/infra/inference/)

## 参考资料

<Refs>

**文字来源（访问日期均为 2026-09-02）**

1. [TikTok - Wikipedia](https://en.wikipedia.org/wiki/TikTok) — 抖音上线时间（2016-09-20，原名 A.me）、TikTok 国际发布（2017-09）、Musical.ly 收购（2017-11-09）与合并（2018-08-02）、2020-04 下载破 20 亿、推荐机制
2. [Musical.ly - Wikipedia](https://en.wikipedia.org/wiki/Musical.ly) — 2014-08 正式发行、产品形态
3. [Kuaishou - Wikipedia](https://en.wikipedia.org/wiki/Kuaishou) — 2011-03 GIF 快手创立、2013 转型短视频社区、2021-02 港交所 IPO
4. [YouTube Shorts - Wikipedia](https://en.wikipedia.org/wiki/YouTube_Shorts) — 2020-09-15 印度 beta、2021-07-13 全球发布
5. [High Efficiency Video Coding - Wikipedia](https://en.wikipedia.org/wiki/High_Efficiency_Video_Coding) — H.265/HEVC 2013 年定版、较 H.264 提升 25%–50% 压缩率
6. [CNNIC：第 47 次《中国互联网络发展状况统计报告》](https://www.cac.gov.cn/2021-02/03/c_1613923422728645.htm) — 截至 2020-12 短视频用户 8.73 亿（88.3%）
7. [CNNIC 发布第 49 次《中国互联网络发展状况统计报告》（中国教育和科研计算机网转载）](https://www.cernet.edu.cn/xxh/ji_shu_ju_le_bu/Internet/202203/t20220304_2213218.shtml) — 截至 2021-12 短视频用户 9.34 亿（90.5%）、网民 10.32 亿
8. [Social-Media App Musical.ly Is Acquired for as Much as $1 Billion - The Wall Street Journal](https://www.wsj.com/articles/lip-syncing-app-musical-ly-is-acquired-for-as-much-as-1-billion-1510278123)（2017-11-09）
9. [China's ByteDance scrubs Musical.ly brand in favor of TikTok - Reuters](https://www.reuters.com/article/technology/chinas-bytedance-scrubs-musically-brand-in-favor-of-tiktok-idUSKBN1KN0BN/)（2018-08）
10. [TikTok、7 月的世界の月間アクティブユーザー数が 10 億人に - ロイター日本語版](https://jp.reuters.com/markets/global-markets/FJWTMFWOR5ONRIDKM3CWJIXOFA-2021-09-27/)（2021-09-27）
11. [快手科技公布于香港联交所主板上市计划详情 - 快手投资者关系](https://ir.kuaishou.com/zh-hans/news-releases/news-release-details/kuaishou-technology-announces-details-proposed-listing-main)
12. [创业十年上市遭热捧，快手如何抢下短视频第一股？ - 新浪财经](https://finance.sina.com.cn/tech/2021-02-05/doc-ikftssap3938025.shtml)（2021-02-05）
13. [YouTube Shorts 于全球隆重推出 - Google 官方博客（中文）](https://blog.google/intl/zh-tw/products/explore-get-answers/2021_07_youtubeshorts/)（2021-07）

**图片来源（Wikimedia Commons，访问日期 2026-09-02）**

1. [File:Tiktok logo.png](https://commons.wikimedia.org/wiki/File:Tiktok_logo.png)（CC0）
2. [File:Tik Tok logo.svg](https://commons.wikimedia.org/wiki/File:Tik_Tok_logo.svg)（CC BY-SA 3.0）
3. [File:Kuaishou logo.png](https://commons.wikimedia.org/wiki/File:Kuaishou_logo.png)（Public domain）
4. [File:YouTube Shorts icon 2024.svg](https://commons.wikimedia.org/wiki/File:YouTube_Shorts_icon_2024.svg)（Public domain）

</Refs>