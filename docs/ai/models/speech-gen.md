---
title: 语音生成
outline: [2, 3]
---

# 语音生成

> 文本到语音是怎么生成的？

![TTS 系统总体架构](/images/ai/models/speech-gen/tts-diagram-01.jpg)

## GPT 自回归模型 —— 从文本到语音离散表示

![GPT 自回归模型 —— 从文本到语音离散表示](/images/ai/models/speech-gen/gpt-autoregressive.png)

### 1.1 定位与角色

在整个 TTS 管线中，GPT 是承上启下的核心模块：它接收文本序列和说话人音色，以自回归方式逐步生成语音离散编码 (Mel Codes)以及对应的隐层特征 (Latents)，供下游音频引擎（HiFi-Decoder / DIT + DAV）转化为最终波形。简言之：> 文本 + 说话人音色 → GPT 自回归生成 → Mel Codes + Latents → 音频引擎 → WAV

![定位与角色](/images/ai/models/speech-gen/tts-diagram-03.jpg)

### 1.2 输入：三路信息的拼接

GPT 在推理时接收三类信息，拼接成一条统一序列后送入 Transformer：

| 序号 | 信息类型 | 来源 | 说明 |
| --- | --- | --- | --- |
| ① | 说话人音色 (Speaker Condition) | 参考音频经 ConditioningEncoder 提取 | 一个固定长度的向量，表征说话人的音色特征。若启用语言标识，还会拼接一个语言嵌入 (lang\_embedding)，二者通过可学习位置编码相加后组合 |
| ② | 文本序列 (Text Tokens) | 输入文本经 BPE Tokenizer 分词后映射为 token ID | 序列两端分别插入 start\_text\_token 和 stop\_text\_token，经 text\_embedding 层和 text\_pos\_embedding 层转化为嵌入向量 |
| ③ | 语音编码序列 (Mel Codes) | 推理时从 start\_mel\_token 开始逐步生成 | 共有 8194 个 Mel Code（0~8191 为有效编码，8192 为起始标记，8193 为终止标记），经 mel\_embedding 层转化为嵌入向量 |

拼接顺序为：[说话人音色, (语言嵌入), 文本嵌入, Mel起始标记, (Voice Prompt)]，形成 Transformer 的初始输入上下文。

![输入：三路信息的拼接](/images/ai/models/speech-gen/tts-diagram-04.jpg)

### 1.3 Transformer

自回归模型的 Transformer 有两种实现版本：

- v2.2.0 及以后：采用 LLaMA 架构（28 层，2048 维，16 头），使用 RoPE 旋转位置编码，无需显式位置嵌入
- v2.2.0 以前：采用 GPT-2 架构，使用学习式绝对位置嵌入

两种架构的核心行为一致：以 Causal Attention（因果注意力）的方式，逐步生成下一个 Mel Code。

### 1.4 VQVAE

VQVAE（Vector Quantized Variational Autoencoder，向量量化变分自编码器）在本系统中扮演语音与离散 token 之间的翻译器：

- 训练阶段：将训练语料的 Mel 频谱编码为离散的 Mel Code 序列，作为 GPT 的训练目标
- 推理阶段：将 Voice Prompt（参考语音）编码为 Mel Code 序列，拼接到 GPT 输入中实现风格引导

VQVAE 的输出编码空间与 GPT 的 mel\_embedding 词汇表完全一致（共 8192 个有效编码），二者共享同一套离散表示。

### 1.5 推理过程：自回归生成

推理过程与标准 GPT 文本生成高度一致，只是生成目标从"文字 token"变为"语音 Mel Code"：

（1）构造初始输入将说话人音色、文本嵌入和 Mel 起始标记拼接为一条序列。如果用户提供了 Voice Prompt（一段参考语音对应的 Mel Code 序列，由 VQVAE 编码得到），也将其拼接在 Mel 起始标记之后，作为生成的"风格引导前缀"。

（2）逐步生成 Mel Code：

- 对完整上下文做一次 Transformer 前向推理
- 取最后一个位置的隐层输出，经 final\_norm (LayerNorm) + mel\_head (Linear) 投影为 8194 维 logits
- 对 logits 进行采样（支持 top-p 采样、温度调节、Typical Sampling、窗口重复惩罚等策略），得到本步的 Mel Code
- 将新生成的 Mel Code 通过 mel\_embedding 层转为嵌入，追加到序列末尾
- 重复上述过程，直到生成 stop\_mel\_token（8193）或达到最大长度

（3）提取输出生成完毕后，从结果中提取两样东西：

- Mel Code 序列：离散的语音编码 token 序列
- Hidden States（Latents）：每一步 Transformer 最后一层的隐层输出，经 LayerNorm 后作为连续特征，传给下游音频引擎

### 1.6 条件提取：ConditioningEncoder

ConditioningEncoder 负责将参考音频的 Mel 频谱转化为固定长度的说话人向量：

- v2.2.0：使用基于 RoPE 的 ContinuousTransformerWrapper（12层，768维，12头），对 Mel 频谱序列做编码后取第一个位置的输出作为说话人嵌入
- 其他版本：使用 1D 卷积初始映射 + 6 层 AttentionBlock 的结构，同样取序列第一个位置的输出

最终输出为一个 2048 维的向量（与 Transformer model\_dim 一致），代表说话人的音色身份。

![条件提取：ConditioningEncoder](/images/ai/models/speech-gen/tts-diagram-05.jpg)

### 1.7 Voice Prompt：风格延续

Voice Prompt 机制允许用户提供一段参考语音，用于精细控制生成风格（如语气、节奏）：

- 参考语音通过 Mel 频谱 → VQVAE（DiscreteVAE）编码为 Mel Code 序列
- 这些 Mel Code 被拼接在 GPT 输入中 Mel 起始标记之后
- GPT 在此基础上续写新的 Mel Code，从而实现风格连续性

### 1.8 输出与下游衔接

GPT 的输出直接对接下游音频引擎：

|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |
|  |  |  |

### 1.9 采样策略

GPT 支持多种采样策略以平衡生成质量与多样性：

- Top-p (Nucleus) Sampling：仅从累积概率达到 p 的 token 子集中采样，默认 p=0.8
- Temperature：控制 logits 分布的锐度，默认 0.8
- Window Repetition Penalty：在滑动窗口内对已出现 token 施加惩罚，防止重复
- Typical Sampling：按 token 的"典型性"（与期望信息量的偏差）进行筛选

### 1.10 LoRA 情感控制

系统支持通过 LoRA（Low-Rank Adaptation）微调实现情感风格切换：

- 预加载多套 LoRA 权重文件（对应不同情感，如"开心"、"悲伤"等）
- 推理时根据请求指定的情感类型，动态热切换 LoRA adapter
- 无需重新加载完整模型即可改变生成风格

## HiFi-Decoder：从潜在表示到音频波形

![HiFi-Decoder：从潜在表示到音频波形](/images/ai/models/speech-gen/tts-diagram-06.jpg)

### 一、总体目标

在 TTS（文本转语音）系统中，前面的模型（比如 GPT）会生成一组向量（latents），这些向量是一种高度压缩的声音表示。但它不是声音本身，无法直接播放。HiFi-Decoder 的任务就是：把这个 token\_len × hidden\_dim 的 latents 还原成真正的、可以播放的音频波形。

### 二、核心设计思想

#### 2.1 从人类发声说起：源-滤波器模型

人的发声过程可以拆解为两个阶段：

1. 声源（Source）：声带振动产生一个带有基础音高（即基频 F0）的周期性脉冲信号，类似于"嗡嗡声"。这个信号包含了音高信息，但听起来不像任何具体的语音。
2. 滤波器（Filter）：这个原始信号经过口腔、鼻腔、舌头等构成的声道，被"塑形"成我们听到的元音、辅音等具体语音。声道的形状决定了共振峰（formant），也就决定了"a"和"o"听起来不同。

这一经典理论被称为 Source-Filter 模型，是语音学的基础。HiFi-Decoder 的设计正是受此启发。

#### 2.2 NSF：用神经网络实现源-滤波器

HiFi-Decoder 的声码器（vocoder）部分采用了 NSF（Neural Source Filter） 架构，即用神经网络来分别模拟"源"和"滤波器"这两个角色：

- 神经源模块（Source Module）：根据预测出的基频 F0，用正弦波合成器生成一个带有正确音高和谐波结构的激励信号。这相当于模拟声带振动。
- 神经滤波器（Filter = Generator 网络）：由多级上采样卷积和残差网络构成，负责将这个激励信号与语义特征融合，逐步"雕刻"成最终的语音波形。这相当于模拟声道的塑形作用。

> 这样设计的好处——降低难度
> 如果让网络完全从零学习生成周期性的音频波形，非常困难——网络很难自己"发明"出精确的正弦振荡。通过显式地根据 F0 生成一个周期性参考信号，并在每一级上采样中反复注入，网络只需要学习"在这个参考的基础上做修饰"，大大降低了学习难度，也使得合成的音频更加干净、音高更加准确。

### 三、实现步骤详解

整体流程共分为四步，如下图所示：

![三、实现步骤详解](/images/ai/models/speech-gen/tts-diagram-07.jpg)

#### 第 1 步：Latent Conditioner — 特征提取 + 说话人风格融合

> 目的：latents 中包含了"说什么"的信息，但还缺少"用谁的声音说"（音色）。这一步将说话人的声音特征注入到 latents 中。

1. 对输入的 latents 做初步加工

- Conv1d（2048 → 1024）：将 latents 从高维（2048 维）降维到 1024 维，进行通道压缩，以匹配后续网络的输入尺寸。
- Mel2Pitch（残差网络）：由多层卷积构成的 ResNet，用于对降维后的特征做进一步的提炼和抽象。
- LayerNorm：层归一化，稳定特征分布。

2. 条件融合（FiLM 调制）

- condition 是说话人的声音特征向量（从参考音频中提取），维度为 2048。
- 将 condition 一分为二，分别得到 1024 维的缩放因子（scale）和偏移量（shift）。
- 通过公式 x = x × (1 + scale) + shift，在特征层面将说话人的音色风格注入到内容表示中。这一技术称为 FiLM（Feature-wise Linear Modulation）。

#### 第 2 步：音高预测（Pitch Prediction）

> 目的：为后续的源模块提供每一帧的基频（F0），这是 NSF 架构正常运作的前提。

概念说明：

F0（基频，Fundamental Frequency）即声音的音高。男性说话大约 85–180 Hz，女性大约 165–255 Hz，唱歌时变化范围更大。F0 是语音中最重要的韵律特征之一。

实现方式：

Pitch Predictor 由多层 Attention Block 和 ResNet 组成，以融合了说话人特征的 x 为输入，在对数域预测 F0。使用对数域是因为人耳对频率的感知本身是对数尺度的，且对数域的数值范围更紧凑，有利于网络学习。预测完成后，通过逆变换转回线性频率（Hz）。

#### 第 3 步：谐波激励源生成（Harmonic Source Generation）

> 目的：根据第 2 步预测的 F0，生成一个携带正确音高信息的周期性激励信号，作为声码器的"源"输入。这对应了 Source-Filter 模型中的"源"——模拟声带振动。

实现方式：

源模块（SourceModuleHnNSF）内部包含一个正弦波生成器（SineGen），其工作流程如下：

1. 生成基频及谐波：根据 F0，生成基频正弦波以及 8 个谐波（即 2×F0, 3×F0, …, 9×F0）。谐波的存在使激励信号更接近真实声带振动的频谱结构——自然界中的声音几乎不会是纯正弦波，而是基频与多个谐波的叠加。
2. 区分有声段与无声段：在有声段（F0 > 0，如元音），使用正弦波信号；在无声段（F0 = 0，如气息音、清辅音），声带不振动，因此用随机噪声替代，以模拟气流通过声道产生的湍流噪声。
3. 谐波合并：通过一个线性层将 9 个谐波分量（基频 + 8 个谐波）合并为 1 个单通道的激励信号。

生成的激励信号长度已与最终音频采样点数对齐（上采样倍率为 512，即 1 帧 latent 对应 512 个音频采样点）。

#### 第 4 步：Generator — 多级上采样生成最终波形

> 目的：将第 1 步产出的 1024 维语义特征（每帧 1 个向量），逐步"展开"为 512 倍长度的、单通道的音频波形。这对应 Source-Filter 模型中的"滤波器"——将激励信号塑形为具体的语音。

整体结构：

Generator 采用经典的 HiFi-GAN 架构，由"入口卷积 → 5 级上采样模块 → 出口卷积"构成，核心在于每一级上采样模块内部的三项操作：

1. 转置卷积上采样使用转置卷积（ConvTranspose1d）将时间分辨率逐级提升，5 级的上采样倍率分别为 8、8、2、2、2（乘积 = 512）。每一级在拉长时间轴的同时将通道数减半——时间维度变长意味着信息被展开，无需再用大量通道来压缩存储。经过 5 级后，特征从 [512通道, T帧] 变为 [16通道, 512T采样点]。
2. 逐级注入激励信号在每一级上采样后，将第 3 步生成的谐波激励信号（经过卷积调整至当前时间分辨率后）加到特征上。之所以每一级都要注入，而非只注入一次，是因为随着上采样过程中特征的反复变换，音高信息可能逐渐衰减或走样。反复注入相当于在每一级都"提醒"网络当前的基频是什么，确保最终合成的音频音高准确、不跑调。

![第 4 步：Generator — 多级上采样生成最终波形](/images/ai/models/speech-gen/tts-diagram-08.jpg)

3. 多感受野融合（Multi-Receptive Field Fusion）这是 HiFi-GAN 架构的核心设计。在每一级上采样后，使用3 个并行的残差网络（ResNet）分别处理同一份特征，然后将结果取平均。这 3 个 ResNet 的区别在于卷积核大小不同（分别为 3、7、11），因此各自拥有不同的感受野（即每次卷积能"看到"多大范围的上下文）：

|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |
|  |  |  |

此外，每个 ResNet 内部还使用了空洞卷积（Dilated Convolution），通过不同的膨胀率（1、3、5）在不增加参数量的前提下进一步扩大感受野。这使得网络能够同时捕捉到从最细微的噪声纹理到最宏观的语调走势的多尺度信息。三个 ResNet 的输出取平均后作为该级的最终输出，这种设计让不同尺度的特征互补融合，是 HiFi-GAN 能够合成高保真音频的关键所在。

4. 最终输出经过 5 级上采样后，通过一个卷积层将 16 通道压缩为 1 通道（即单声道音频），再经过 tanh 激活函数将幅值限制在 [-1, 1] 之间——这正是标准音频波形的幅度范围。至此，我们得到了可以直接播放的 WAV 波形。

### 四、流程总结

```text
输入 latents (token_len × 2048)
        │
        ▼
  ① Latent Conditioner + FiLM 调制
     特征降维提炼 + 注入说话人音色
        │
        ▼
  ② Pitch Predictor
     预测每帧基频 F0（音高）
        │
        ▼
  ③ Harmonic Source Generator (NSF-源)
     根据 F0 生成正弦谐波激励信号（模拟声带振动）
        │
        ▼
  ④ Generator / HiFi-GAN (NSF-滤波器)
     5 级上采样（×512），逐级注入激励 + 多感受野融合
     将语义特征逐步展开为音频波形（模拟声道塑形）
        │
        ▼
  输出 audio (WAV 波形, 采样率 44100Hz)
```

整个过程遵循 Source-Filter 的设计理念：先构建携带音高信息的激励源（Source），再通过神经网络滤波器（Filter）将其与语义、音色特征融合，逐步雕刻为高保真的语音波形。

## DIT + DAV：基于流匹配与扩散 Transformer 的音频生成

### 一、总体目标

> 与 HiFi-Decoder 一样，DIT 模块的输入也是前面 GPT 生成的 latents（token\_len × 2048），最终输出可播放的音频波形。但它采用了完全不同的技术路线：先用 Flow Matching（流匹配）生成 VAE 潜在表示，再用 DAV（Descript Audio VAE）解码为波形。换句话说，HiFi-Decoder 是"一步到位"地从 GPT latents 直接生成波形，而 DIT 路线则拆成了两级： GPT latents ──→ [DIT: 流匹配] ──→ VAE latents (64维) ──→ [DAV: 解码器] ──→ 音频波形

为什么要多拆一级？ 因为 GPT 的 latents（2048 维）是一种高度抽象的语义表示，与音频波形之间的差距太大。引入 VAE latents 作为中间表示，让每一级的转换跨度更小、更容易学习。VAE latents（64 维）是一种更接近声学信号的连续表示——它由 DAV 的编码器从真实音频中提取，天然携带了丰富的声学细节。

### 二、核心设计思想

#### 2.1 什么是 Flow Matching（流匹配）

![2.1 什么是 Flow Matching（流匹配）](/images/ai/models/speech-gen/tts-diagram-09.jpg)

> Flow Matching 是一种生成式建模范式，可以直接理解为一种"高效版扩散模型"。其核心思想是： 目标：学习一条从"随机噪声"到"目标数据"的运输路径。 训练时：给定一对（噪声, 真实数据），在二者之间定义一条直线路径，让网络学习在这条路径上每一点的速度场（velocity field）——即"从当前位置出发，应该往哪个方向走"。 推理时：从纯随机噪声出发，按照网络预测的速度场，一步一步"走"到目标数据。数学上用欧拉法（Euler method） 求解常微分方程（ODE）实现。

相比传统扩散模型去噪，Flow Matching 的路径更直、更高效，通常只需要 几十步甚至几步即可生成高质量结果。

#### 2.2 Classifier-Free Guidance（CFG，无分类器引导）

推理时，网络会分别做两次预测：

1. 有条件预测：给定说话人特征和文本对齐条件
2. 无条件预测：将所有条件置零

最终的速度场通过公式 v = (1 + w) × v\_cond - w × v\_uncond 进行混合，其中 w 是引导强度（本系统中 w = 0.7）。这一技术源自图像生成领域，其作用是增强生成结果与条件之间的一致性——适当"远离"无条件预测的方向，使输出更忠实于所给的条件（音色、内容等），提升生成质量。

#### 2.4 DAV：用 VAE 架构做波形编解码

![2.4 DAV：用 VAE 架构做波形编解码](/images/ai/models/speech-gen/tts-diagram-10.jpg)

DAV（Descript Audio VAE）是一个变分自编码器（Variational Autoencoder），其设计理念是：

- 编码器：将原始音频波形压缩为低维连续表示（64 维），捕捉声学信号的核心信息。
- 解码器：将 64 维的潜在表示还原为音频波形。

DAV 在训练阶段学会了"如何把 64 维向量变回声音"，因此 DIT 只需要生成合理的 64 维表示，DAV 就能把它解码成音频。这种分工让 DIT 不需要直接面对复杂的波形生成问题，只需在一个更紧凑、更有结构的 64 维空间中操作。

### 三、实现步骤详解

![三、实现步骤详解](/images/ai/models/speech-gen/tts-diagram-11.jpg)

整体推理流程（以 \_generate\_with\_vae 为入口）分为两大阶段：

#### 阶段一：DIT 推理 — 从 GPT Latents 生成 VAE Latents

##### 第 1 步：条件准备（Condition Preparation）

DIT 的推理需要三类条件信息：

（1）对齐条件（Alignment Condition）— "说什么 + 音高走势"对 GPT latents 做两路并行处理，然后拼接：

- 语义特征提取：通过 latent\_conditioners（一个 Conv1d，2048 → 1024）对 GPT latents 做降维和特征变换，然后通过插值将时间分辨率从输入帧率对齐到输出帧率（24kHz → 44.1kHz 的帧率转换）。
- 音高预测：通过 pitch\_predictor（由多层 Attention Block + ResNet 组成）预测每帧的基频 F0。高版本模型还额外预测有声/无声标记（VUV, Voiced/Unvoiced），用于区分元音（有声）和清辅音/气息（无声）。

两路结果在通道维度上拼接，形成完整的对齐条件，为 Transformer 提供"每一帧应该是什么内容、什么音高"的指引。

（2）全局条件（Global Condition）— "用谁的声音说"

- 从参考音频中提取说话人嵌入向量（Speaker Embedding），编码说话人的音色和风格。
- 通过 conditioning\_encoder 将参考音频的 Mel 频谱转换为固定维度的全局条件向量。
- 该向量在 Transformer 内部以 Prepend（前置拼接） 的方式注入——即作为序列的第一个 token 参与自注意力计算，让每一帧都能"看到"说话人信息。

（3）参考条件（Conds）— 流式场景下的连续性保障

- 在流式生成中，会将上一个音频片段末尾的 VAE latents 作为参考条件传入，确保前后片段在声学特征上平滑过渡，避免拼接处出现断裂感。
- 在非流式场景下，此项为全零张量。

![第 1 步：条件准备（Condition Preparation）](/images/ai/models/speech-gen/tts-diagram-12.jpg)

##### 第 2 步：初始化随机噪声

z = randn(batch, 64, T) × temperature

生成与目标 VAE latents 同形状的随机高斯噪声，作为 Flow Matching 的起点。temperature 参数控制初始噪声的幅度，默认为 1.0。

##### 第 3 步：Flow Matching 迭代求解

这是 DIT 的核心推理过程。使用 EstimatorWrapper 封装的欧拉求解器，迭代地将噪声"运输"为 VAE latents：每一步迭代中：

1. 拼接输入：将当前状态 x（64 维）与参考条件 conds（64 维）在通道维度上拼接，形成 128 维的输入。
2. Transformer 前向推理：DiffusionTransformer 接收以下输入：

- 拼接后的特征 + 对齐条件（通过 input\_concat\_cond 方式，即在通道维度上进一步拼接）
- 时间步嵌入（通过 Fourier 特征编码当前所处的去噪阶段，告诉网络"现在走到路径的哪个位置了"）
- 全局说话人条件（通过 Prepend 方式注入）
- Transformer 内部使用多层自注意力 + 前馈网络，综合所有条件信息，预测当前位置的速度场方向

1. CFG 混合：同时做条件和无条件预测，通过加权混合获得更高质量的速度场。具体做法是在同一个 batch 内同时计算条件和无条件的结果（batch\_size=2），一次前向传播完成两次预测，提高效率。
2. 欧拉步进：x = x + dt × velocity，沿速度场方向前进一步。

时间步的调度采用余弦调度（Cosine Schedule）：t = 1 - cos(t\_linear × π/2)，使得在起始和结束阶段步长更小（变化缓慢的阶段分配更多步数，变化剧烈的阶段步长更大），提升生成质量。迭代完成后，得到最终的 VAE latents，shape 为 [batch, 64, T']。

#### 阶段二：DAV 解码 — 从 VAE Latents 生成音频波形

##### 第 4 步：投影 + 解码

DAV 的解码过程分为两步：

（1）输入投影通过一个 Conv1d（64 → 1024）将 64 维的 VAE latents 映射回 DAV 解码器的内部通道空间（1024 维）。

（2）多级上采样解码DAV 的 Decoder 采用与 HiFi-GAN 类似的上采样架构，但使用了 Snake 激活函数替代 LeakyReLU：

- Snake 激活函数：定义为 x + (1/α) × sin²(αx)，其中 α 是可学习参数。与 LeakyReLU 等通用激活函数不同，Snake 函数天然具有周期性，更适合建模音频信号中的周期性波形结构，能生成更自然的声音。

Decoder 的结构为"入口卷积 → 4 级上采样模块 → 出口卷积 + Tanh"：

| 层级 | 上采样倍率 | 通道数变化 |
| --- | --- | --- |
| 1 | ×8 | 1536 → 768 |
| 2 | ×8 | 768 → 384 |
| 3 | ×4 | 384 → 192 |
| 4 | ×2 | 192 → 96 |

每级上采样模块（DecoderBlock）内部包含：

```python
class DecoderBlock(nn.Module):
    def __init__(self, input_dim: int = 16, output_dim: int = 8, stride: int = 1):
        super().__init__()
        self.block = nn.Sequential(
            Snake1d(input_dim),
            WNConvTranspose1d(
                input_dim,
                output_dim,
                kernel_size=2 * stride,
                stride=stride,
                padding=math.ceil(stride / 2),
            ),
            ResidualUnit(output_dim, dilation=1),
            ResidualUnit(output_dim, dilation=3),
            ResidualUnit(output_dim, dilation=9),
        )

    def forward(self, x):
        return self.block(x)
```

- 一个转置卷积实现时间维度上采样（与 HiFi-GAN 原理相同）
- 3 个残差单元（ResidualUnit），dilation 分别为 1、3、9，通过不同膨胀率的空洞卷积捕捉不同尺度的时间模式

```python
class ResidualUnit(nn.Module):
    def __init__(self, dim: int = 16, dilation: int = 1):
        super().__init__()
        pad = ((7 - 1) * dilation) // 2
        self.block = nn.Sequential(
            Snake1d(dim),
            WNConv1d(dim, dim, kernel_size=7, dilation=dilation, padding=pad),
            Snake1d(dim),
            WNConv1d(dim, dim, kernel_size=1),
        )

    def forward(self, x):
        y = self.block(x)
        pad = (x.shape[-1] - y.shape[-1]) // 2
        if pad > 0:
            x = x[..., pad:-pad]
        return x + y
```

4 级上采样的总倍率为 8 × 8 × 4 × 2 = 512，即 1 帧 VAE latent 对应 512 个音频采样点。最终通过一个 Conv1d 将通道压缩为 1（单声道），经 Tanh 限幅到 [-1, 1]，输出可播放的 WAV 波形。

### 四、流程总结

```text
输入: GPT latents (token_len × 2048)
        │
  ══════╪═══════════════════════════════════════════
  ║     ▼        阶段一：DIT 推理                  ║
  ║                                                ║
  ║  ① 条件准备                                    ║
  ║     ├─ 语义特征提取 (Conv1d, 2048→1024) + 帧率对齐  ║
  ║     ├─ 音高预测 (Attention + ResNet → F0)       ║
  ║     ├─ 拼接 → 对齐条件 (align_cond)             ║
  ║     └─ 说话人嵌入 → 全局条件 (global_cond)       ║
  ║                                                ║
  ║  ② 初始化随机噪声 z ~ N(0, I), shape [B, 64, T'] ║
  ║                                                ║
  ║  ③ Flow Matching 迭代 (欧拉求解器)              ║
  ║     循环 N 步:                                  ║
  ║       Transformer 预测速度场 (含 CFG)            ║
  ║       x ← x + dt × velocity                   ║
  ║     输出: VAE latents [B, 64, T']              ║
  ║                                                ║
  ══════╪═══════════════════════════════════════════
        │
  ══════╪═══════════════════════════════════════════
  ║     ▼        阶段二：DAV 解码                   ║
  ║                                                ║
  ║  ④ 投影 (Conv1d, 64→1024) + 4级上采样 (×512)    ║
  ║     每级: 转置卷积上采样 + Snake残差网络          ║
  ║     输出 → Tanh → 音频波形 [B, 1, 512T']       ║
  ║                                                ║
  ══════╪═══════════════════════════════════════════
        │
        ▼
   输出: audio (WAV 波形, 采样率 44100Hz)
```

### 五、DIT 路线 vs HiFi-Decoder 路线的核心差异

|  |  |  |
| --- | --- | --- |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |
|  |  |  |

---

## 推理框架架构 —— 从 HTTP 请求到音频输出

### 1. 整体架构概览

整个 TTS 推理系统采用分层架构设计，自上而下分为以下六个层次：

| 层次 | 职责 | 核心类 |
| --- | --- | --- |
| 服务入口层 | 接收 HTTP 请求，暴露 API 接口 | BaseServer → TextToSpeechServer |
| 任务管理层 | 请求解析、并发控制、条件准备、文本预处理调度 | TaskManager（单例）、ConditionsManager |
| 模型执行层 | 路由到正确的生成器，协调 GPT 与音频引擎 | ModelRunner、Generator（6种变体） |
| 引擎抽象层 | 封装具体模型的推理逻辑 | BaseGPTEngine、BaseAudioEngine 及其子类 |
| 模型加载层 | 加载并优化所有模型权重 | TTSModelLoader、TRT 优化器 |
| 后处理/输出层 | 音频编码、流式传输 | WebStreamer、post\_t2a |
| 生成质量 | 高 | 更高（得益于迭代生成的精细调控） |

核心设计理念：策略模式 + 模板方法 + 工厂模式。系统通过配置（版本号、音频引擎类型、服务类型）在运行时灵活组装流水线，无需修改核心逻辑即可支持 HiFi-Decoder、DIT+DAV、Diffusion 三种音频路线以及流式/非流式两种输出模式。

![整体架构概览](/images/ai/models/speech-gen/tts-diagram-13.jpg)

---

### 2. 服务入口层

系统以 Flask Web 服务器为基础，通过 TextToSpeechServer 对外提供四个 API 端点：

启动流程为：

1. 解析命令行参数（端口号、GPU 后端类型等）
2. 加载所有模型（\_load\_models）
3. 初始化引擎（\_init\_engines），分别获取 GPT 引擎和音频引擎
4. 初始化 TaskManager，传入 GPT 引擎、音频引擎和 VQVAE 模型
5. 注册路由，启动 Flask 服务

支持两种 GPT 后端：default（PyTorch 原生）和 tensorrt\_llm（TensorRT-LLM 加速），通过命令行参数 --gpt-backend 选择。

---

### 3. 模型加载层

TTSModelLoader 负责加载整个系统所需的全部模型，加载顺序如下：

1. 环境准备：检查 CUDA、配置 LoRA 路径
2. 音频模型加载（根据环境变量选择性加载）：

- FlowMatching（DIT + DAV）
- HiFi-Decoder
- Diffusion Vocoder

1. Tokenizer 加载：BPE 分词器，不同版本使用不同词表
2. VQVAE 模型加载（v1.8.0 以上版本）
3. TensorRT 优化：尝试用 TRT 引擎替换原始 PyTorch 模型

- 对 DIT、DAV、HiFiDecoder、Vocoder 分别尝试加载 TRT Engine
- 如果加载失败则回退到 PyTorch 模型（优雅降级）

1. GPT 模型加载：加载自回归模型权重，初始化推理模式

加载完成后，ModelLoader 充当工厂，根据需要创建引擎实例：

- get\_gpt\_engine() → PyTorchGPTEngine 或 TensorrtLLMEngine
- get\_audio\_engines() → 返回一个字典，包含三种音频引擎

---

### 4. 任务管理层

#### 4.1 TaskManager（单例）

TaskManager 是整个请求处理的中枢调度器，实现为线程安全的单例模式。它通过信号量（Semaphore）控制并发数，防止 GPU 资源过载。一个请求的完整处理流程如下：

请求到达 → 获取槽位(Semaphore) → 解析配置 → 并行执行{条件准备, 文本预处理} → 模型推理 → 后处理 → 释放槽位

详细步骤：Step 1：解析任务配置 (\_parse\_task\_config)

- 从请求 JSON 中解析出 TTSConfig，包含：文本内容、说话人 ID、语速/音量/音调、音频格式、采样率、流式配置、情感类型等

Step 2 & 3：并行执行两项准备工作 （使用 ThreadPoolExecutor）

- 条件准备 (\_prepare\_model\_inputs)：通过 ConditionsManager 获取说话人条件向量
- 文本预处理 (\_preprocess\_text)：语言检测 → 文本切分 → 文本归一化（数字/缩写/生僻字/韩文罗马化等）

这两步并行执行，大幅减少整体延迟。

Step 4：执行模型推理 (\_run\_inference)

- 创建 TextIterator，将预处理结果封装为懒加载迭代器
- 将全部上下文（条件、文本迭代器、voice\_prompt）打包到 task 中
- 交给 ModelRunner.process() 处理

![4.1 TaskManager（单例）](/images/ai/models/speech-gen/tts-diagram-14.jpg)

#### 4.2 ConditionsManager

ConditionsManager 负责管理说话人条件向量的获取和缓存：

1. 加载参考音频：从本地缓存（.pth 文件）或远程 OSS 下载
2. 提取说话人嵌入：通过 GPT 的 ConditioningEncoder 将 Mel 频谱编码为条件向量
3. 多音色混合：支持多个说话人按权重加权混合
4. Voice Prompt 提取：通过 VQVAE 编码参考音频片段为 Mel Code 序列
5. LRU 缓存：缓存已计算的条件向量，避免重复计算

#### 4.3 文本预处理

文本预处理采用多进程架构（PreprocessExecutorMP），使用独立的子进程池处理文本，避免 CPU 密集型预处理任务阻塞 GPU 推理线程。预处理流程：

1. LaTeX 公式转口语文本（可选）
2. 语言自动检测
3. 文本切分（按标点和长度切分为合适片段）
4. 文本归一化（数字读法、缩写展开、生僻字替换等）
5. 多语言混合处理（中英/中日等混合文本拆分）

---

### 5. 模型执行层

#### 5.1 ModelRunner —— 路由调度器

ModelRunner 在初始化时注册 6 种生成器（3 种音频引擎 × 2 种模式）：

路由逻辑：

- 根据 task.audio\_engine\_type（FLOW\_MATCHING / HIFIDECODER / DIFFUSION）选择音频路线
- 根据 task.type（SYNC\_INFERENCE / SYNC\_STREAM\_INFERENCE / SYNC\_LONG\_TEXT）选择流式或非流式
- 如果启用了 LoRA，在生成前切换 LoRA 权重

![5.1 ModelRunner —— 路由调度器](/images/ai/models/speech-gen/tts-diagram-15.jpg)

#### 5.2 DefaultGenerator —— 非流式生成

非流式生成器的核心流程：

```text
for 每段预处理文本:
    GPT 自回归生成 → 得到 tokens + latents
    累积 latents（攒 batch）
    当 batch 够大时 → AudioEngine.generate() → 音频片段
拼接所有片段 → 后处理（音量/音调/去噪/去尾静音）→ 返回完整音频
```

支持并行生成：对于长文本，使用 ThreadPoolExecutor 并行处理多段文本的 GPT 推理（generate\_parallel），然后按序拼接。

#### 5.3 StreamGenerator —— 流式生成

流式生成是本系统的核心技术亮点，实现了 GPT 生成与音频合成的流水线并行，大幅降低首包延迟。流式生成的核心思路是：不等 GPT 生成完毕，而是 GPT 每产出一定量的 token，就立刻将对应的 latents 送入音频引擎合成一段音频，通过 WebSocket 发送给客户端。关键机制：

1. 分段控制 (SegmentControl)

- seg\_frame\_list：分段大小列表，例如 [48]，首段可以更小以降低首包延迟
- overlap：相邻段之间的重叠 token 数，用于消除拼接痕迹
- 自动递进到下一个分段大小

2. 流式状态 (StreamState)

- 跟踪已处理的 token 数量（processed\_size）
- 缓存已发送的音频长度（send\_wav\_length）
- 保存上一段音频的尾部用于交叉淡入淡出

3. 交叉淡入淡出 (Crossfade)

- 在分段边界处，对相邻片段的重叠区域做淡入淡出混合
- 消除拼接时可能出现的音频不连续和咔哒声
- HiFi-Decoder 和 DIT 各有针对性的处理策略

4. GPT 流式输出

- GPT 引擎提供 generate\_stream 接口，使用 Python generator (yield) 逐步输出 token
- StreamGenerator 在循环中收集 token，达到一段的长度后立即处理

流式生成的时序流程：

```text
GPT yield token₁ → 收集
GPT yield token₂ → 收集
...
累积够 segment_size + overlap 个 token
    → 送入 AudioEngine → 得到音频片段
    → Crossfade 处理
    → WebSocket 发送 ← 此时 GPT 仍在并行生成下一批 token
...
GPT 生成结束
    → 处理最后一段 → 发送
    → finish()
```

![5.3 StreamGenerator —— 流式生成](/images/ai/models/speech-gen/tts-diagram-16.jpg)

---

### 6. 引擎抽象层

![引擎抽象层](/images/ai/models/speech-gen/tts-diagram-17.jpg)

#### 6.1 GPT 引擎

BaseGPTEngine 定义了统一接口：

- generate()：同步生成，等待完整结果
- generate\_stream()：流式生成，通过 Python generator 逐步返回
- lora\_weights\_update()：运行时切换 LoRA 权重

三个实现：

- PyTorchGPTEngine：标准 PyTorch 推理
- TensorrtLLMEngine：TensorRT-LLM 加速推理
- FTGPTEngine：基于fast transformer的推理

#### 6.2 音频引擎

BaseAudioEngine 定义了统一的 generate() 接口，三个实现各自封装了完整的音频合成流程：

每个引擎除了基础的 generate() 方法外，还提供了流式生成所需的特殊接口（如 generate\_stream、get\_f0\_mel 等）。

---

### 7. 字级别时间戳与字幕系统

#### 7.1 功能概述

系统支持三种字幕粒度，通过请求参数 subtitle\_timestamp\_type 控制：

字级时间戳是最复杂也最有价值的功能，其核心思想是：利用 GPT 自回归生成时 Transformer 的注意力权重（Attention Map），将文本 token 与音频 token 进行对齐，从而推导出每个字的起止时间。

#### 7.2 核心原理 —— 基于注意力权重的文本-音频对齐

GPT 在自回归生成 Mel Code 时，每生成一个新的音频 token，都会计算其对所有输入 token（包括文本 token）的注意力权重。

> 直觉上：当模型在"发"某个字的音时，注意力会集中在该字对应的文本 token 上。

系统利用这一特性，从 GPT 指定层和指定头提取注意力权重矩阵（通过环境变量 WORD\_LEVEL\_GPT\_ATTN\_LAYER\_IDX 和 WORD\_LEVEL\_GPT\_ATTN\_HEAD\_IDX 配置），得到一个形状为 [audio\_token\_num, text\_token\_num] 的矩阵，然后进行对齐计算。

#### 7.3 对齐算法 —— 动态规划最优路径

注意力矩阵的原始值并不直接表示对齐关系。系统使用动态规划（DP）求解一条最优对齐路径，算法的核心约束是：

- 路径只能向下（音频前进、文本不动）或向右下（音频和文本同时前进）移动
- 路径经过的格子的注意力值之和最大化
- 保证单调性：文本和音频的对齐关系是单调递增的

```text
具体步骤（GPTUtils.get_optimal_token_alignment）：
构建 DP 表：dp[i][j] 表示音频 token i 与文本 token j 对齐时，路径上的最大注意力权重累积和
转移方程：dp[i][j] = max(dp[i-1][j], dp[i-1][j-1]) + attn[i][j]
从上方来（音频前进、文本不动）→ 一个文本 token 对应多个音频 token
从左上方来（音频和文本同时前进）→ 一一对应
回溯路径：从 DP 表末尾回溯得到最优对齐路径
提取时间范围：对每个文本 token，找出其对齐的音频 token 范围 [min, max]，转换为时间戳
```

对于音频 token 数少于文本 token 数的边界情况，系统会使用双线性插值将注意力矩阵在音频维度上扩展，确保 DP 算法能正常工作。

![7.3 对齐算法 —— 动态规划最优路径](/images/ai/models/speech-gen/tts-diagram-18.jpg)

#### 7.4 从 phoneme 到字 —— 时间戳聚合

由于 BPE Tokenizer 切分出的 token 粒度可能比"字"更细（如一个中文字可能对应多个 phoneme token），系统需要将 phoneme 级别的时间戳聚合为字级别：

1. GPT 推理时记录 encoded\_text（tokenizer 编码结果），包含每个 token 的文本
2. generate\_word\_timestamp\_list 将 phoneme token 的对齐结果映射为 [word, start\_time, end\_time] 三元组
3. 去除空白 token（[SPACE]、[UNK]）和未匹配的 token
4. 时间戳根据语速 speed 参数进行缩放

#### 7.5 从发音文本到原始文本 —— text\_range\_list 映射

由于文本预处理会改变文本内容（如 "3月" → "三月"，数字归一化等），最终返回给用户的时间戳需要映射回原始输入文本。系统通过 text\_range\_list 实现这一映射：

1. 预处理阶段：在文本切分和归一化时，使用 TextRangeUtils 维护一个 [(原始起始, 原始结束)] 的映射表，记录每个预处理后字符对应的原始文本位置
2. 字幕生成阶段：SubtitleState.update\_timestamped\_words 利用这个映射，将每个字的 pronounce\_word\_begin/end（发音文本中的位置）转换为 word\_begin/end（原始文本中的位置），并提取出原始文本中对应的 word

#### 7.6 字幕状态管理 —— SubtitleState

SubtitleState 是一个有状态的字幕管理器，在整个文本序列的生成过程中跟踪：

- 当前时间点 time（ms）
- 原始文本和发音文本的读取位置
- 累积的字级时间戳列表

每段文本生成完毕后，调用 create\_subtitle 输出一个完整的字幕信息字典：

```python
{
    "text": "原始文本",
    "pronounce_text": "发音文本(预处理后)",
    "time_begin": 0.0,         # 句起始时间(ms)
    "time_end": 1200.0,        # 句结束时间(ms)
    "text_begin": 0,           # 原文起始字符位置
    "text_end": 10,            # 原文结束字符位置
    "pronounce_text_begin": 0, # 发音文本起始位置
    "pronounce_text_end": 12,  # 发音文本结束位置
    "timestamped_words": [     # 字级时间戳(仅WORD模式)
        {
            "word": "你",               # 原始文本中的字
            "word_begin": 0,            # 原文中的位置
            "word_end": 1,
            "pronounce_word": "你",     # 发音文本中的字
            "pronounce_word_begin": 0,
            "pronounce_word_end": 1,
            "time_begin": 0.0,          # 起始时间(ms)
            "time_end": 150.0           # 结束时间(ms)
        },
        ...
    ]
}
```

#### 7.7 流式与非流式的差异

- 非流式：GPT 生成全部完成后，一次性获得完整的 attention map，在子线程中生成音频的同时，主线程计算字幕时间戳
- 流式：GPT generate\_stream 实际上先完整生成所有 token（拿到完整 attention map），再逐个 yield。字幕计算在最后一段处理时完成，与最后一段的音频合成并行执行

![7.7 流式与非流式的差异](/images/ai/models/speech-gen/tts-diagram-19.jpg)

### 8. 后处理与输出层

#### 8.1 非流式输出

生成完毕后，由 post\_t2a 函数处理：

1. 通过 SyncAudioGenerator（基于 FFmpeg 或 torchaudio）将 PCM 张量编码为指定格式（mp3/ogg/wav/pcm 等）
2. 编码为 Base64 字符串
3. 返回完整的 JSON 响应

#### 8.2 流式输出 (WebStreamer)

流式输出通过 WebSocket 实现：

1. 初始化时建立 WebSocket 连接
2. 启动后台发送线程，使用队列缓冲
3. 每收到一段音频，实时编码并通过 WebSocket 推送
4. 支持重连机制（最多重连 3 次）
5. 音频编码使用 FFmpeg 子进程流式处理，无需等待完整音频

音频编码器也有两个选项：

- FFmpegStreamingAudioGenerator：基于 FFmpeg 管道，支持所有格式
- TorchaudioStreamingAudioGenerator：基于 torchaudio，Python 原生

---

### 9. 并发与性能设计

![并发与性能设计](/images/ai/models/speech-gen/tts-diagram-20.jpg)

---

### 10. 版本兼容与扩展性

系统通过环境变量 TTS\_VERSION（如 1.3.1、1.7.2、2.2.0 等）控制版本差异：

- 不同版本加载不同的 Tokenizer 词表
- v1.8.0 及以下使用独立的 F0 Diffusion 模型
- v2.0.0 及以上支持 VQVAE Voice Prompt
- v2.2.0 使用 LLaMA 骨干替代 GPT-2

扩展新的音频引擎只需：

1. 实现 BaseAudioEngine 接口
2. 在 AudioEngineType 中注册新类型
3. 在 ModelRunner 中注册对应的 Generator
4. 如需流式支持，继承 BaseStreamGenerator 实现分段逻辑

## GPT推理引擎架构

### 1. 设计目标

GPT 自回归生成是 TTS 推理中最耗时的环节。每生成一个 Mel Token 都需要经过完整的 Transformer 前向计算，一段 5 秒的语音大约需要 120 步。但与 LLM 场景不同，TTS 的 Prefill 序列很短（通常只有几十到一百多个 token），瞬间就能完成，瓶颈主要在 Decode 阶段的逐 token 生成。推理引擎的核心设计目标：

### 2. 整体架构

系统分为三层：Python 业务层负责输入准备和结果消费，TTSGPTEngine 中连通 Python 和 C++，C++ 引擎层运行在独立后台线程中，驱动整个生成过程。

![整体架构](/images/ai/models/speech-gen/tts-diagram-21.jpg)

![整体架构](/images/ai/models/speech-gen/tts-diagram-22.jpg)

### 3. 引擎主循环

TTSInferEngine 在初始化后通过 start() 启动一个独立的 C++ 后台线程，运行 run\_engine() 的无限循环：

```javascript
void BaseInferEngine::run_engine() {
    while (running_) {
        fetch_request();           // 1. 取新请求做 Prefill
        if (curr_batch_size_ > 0)
            generate();            // 2. 对所有活跃请求做一步 Decode
        else
            sleep(20ms);           // 3. 无请求时休眠
    }
}
```

每次循环做两件事：

- fetch\_request()：从队列取一个新请求，分配 Slot，执行 infer\_first\_token()（Prefill）
- generate()：对当前所有活跃 Slot 执行一步 infer\_incre\_token()（Decode）

> 为什么 Prefill 和 Decode 分开执行？因为 Prefill 处理完整的 input\_embeds（seq\_len=几十~上百），而 Decode 每步只处理 1 个 token。两者的计算 shape 不同，Decode 阶段可以利用 CUDA Graph 加速，而 Prefill 不能（shape 不固定）。>> 在 TTS 场景中 Prefill 序列很短（远不如 LLM 动辄几千 token），所以 Prefill 本身很快，不构成性能瓶颈。

### 4. Continuous Batching —— Slot 机制

传统 Static Batching 要求所有请求同时开始、同时结束。Continuous Batching 允许请求随时加入和退出，GPU 始终处理尽可能多的请求。

![Continuous Batching —— Slot 机制](/images/ai/models/speech-gen/tts-diagram-23.jpg)

#### 4.1 Slot 预分配

引擎初始化时预分配 max\_batch\_size（默认 8）个 Slot，每个 Slot 对应一套独立状态：

```javascript
void BaseInferEngine::init_state_tensors() {
    curr_streams_.resize(max_batch_size);          // 每个 slot 的 GenerationStream（nullptr = 空闲）
    start_ids_.resize(max_batch_size);             // 每个 slot 的历史 token 序列

    // GPU 状态张量（全局视图，按 slot 索引）
    input_embeds_     [max_batch_size, 1, hidden_size]   // 当前步的输入 embedding
    history_lengths_  [max_batch_size]                    // 已生成 token 数
    steps_            [max_batch_size]                    // 当前步数
    valid_            [max_batch_size]                    // 是否有效
    infer_categories_ [max_batch_size]                    // 推理类别（0=prefill, 1=decode）
}
```

FT 内部也会为每个 Slot 独立维护 KV Cache 空间。由于 TTS 序列较短（Prefill + 最多几百步 Decode），KV Cache 的内存占用不大，不需要像 LLM 那样做 Paged Attention 等复杂管理。

#### 4.2 请求生命周期

```text
Python submit(stream, input_embeds)
    ↓ 入队 request_queue_ (加锁)
C++ fetch_request()
    ↓ 取出请求，分配空闲 Slot
infer_first_token(stream, input_embeds)
    ↓ 执行 Prefill（单请求 forward，seq_len > 1）
    ↓ 更新首个 token 到 stream
    ↓ 加入 curr_streams_
infer_incre_token()  ←── 主循环反复调用
    ↓ 与其他活跃请求合并为动态 batch
    ↓ 逐 token 生成，每步更新 stream
生成结束（stop_token / max_length）
    ↓ release_stream()，回收 Slot
    ↓ 重置该 slot 的 GPU 状态 (history=0, steps=0, valid=0)
    ↓ Slot 可被新请求复用
```

#### 4.3 动态 Batch 构建

infer\_incre\_token() 每次只收集当前有效的 Slot，构建紧凑的 batch：

```cpp
std::vector<int64_t> valid_slots;
for (int64_t slot = 0; slot < max_batch_size_; ++slot) {
    if (curr_streams_[slot] != nullptr)
        valid_slots.push_back(slot);
}
// batch_size = valid_slots.size()（可能是 1~8 中的任意值）
// 只对有效 slot 做计算，不浪费算力
```

由于 Slot 的分配和回收是异步的，batch 组成在每步都可能变化（有请求结束或新请求加入）。引擎通过 index\_select 从全局状态张量中选取当前有效 slot 的数据组成 batch 输入，forward 结束后再通过 scatter 将结果写回对应 slot。

### 5. 异步流水线设计

#### 5.1 问题：Decode 每步的同步开销

每步 Decode 结束后，需要做几件事：

1. 将生成的 token 从 GPU 拷贝到 CPU（判断 stop\_token、更新 start\_ids）
2. 将 hidden\_states 拷贝并写入 GenerationStream（供 Python 端消费）
3. 判断哪些请求已结束，回收 Slot

如果同步执行，GPU 在等待这些 CPU 操作完成时处于空闲状态。

#### 5.2 解决方案：延迟处理 + 异步拷贝

核心思想：本步的 forward 结果，延迟到下一步的 forward 之前再处理。

```text
Step N:  forward() → 采样 → 更新 embedding → 发起异步 DtoH → 预选下一步数据 → 记录 Event
释放GPU锁
Step N+1: 等待 Event → 处理 Step N 结果 → forward() → ...
```

#### 5.3 infer\_incre\_token() 完整流程

```cpp
void TTSInferEngine::infer_incre_token() {
    gpu_lock_.lock();
    if (is_external_waiting()) return;     // 有 DIT/DAV 在等，主动让步

    // ① 处理上一步的延迟结果
    process_pending_cpu_update();
    //   → cudaEventSynchronize(copy_event)  // 只等 DtoH 拷贝完成
    //   → 遍历 tokens_cpu：更新 stream、判断 finished、回收 slot

    // ② 收集有效 slots，构建动态 batch
    valid_slots = [slot for slot if curr_streams_[slot] != nullptr];

    // ③ 检查能否复用上一步预选的数据
    if (valid_slots == pending_update_.valid_slots) {
        // batch 组成没变，直接用预选数据，跳过 index_select
        batch_data = pending_update_.preselected_*;
    } else {
        // batch 变了（有请求结束），重新 index_select
        batch_data = index_select(global_state, valid_slots);
    }

    // ④ FT forward（Transformer 计算 + Final Norm + LM Head）
    result = forward(batch_data);

    // ⑤ GPU 上融合采样
    next_tokens = fused_rtkp_sampler(result.logits, ...);

    // ⑥ GPU 上更新全局状态（scatter 回对应 slot 位置）
    update_input_embeds(next_tokens, slot_indices);
    history_lengths_.scatter_add_(0, slot_indices, ones);

    // ⑦ 发起异步 DtoH 拷贝 + 预选下一步数据（与拷贝 overlap）
    prepare_pending_update(next_tokens, hidden_states, attn_weights, ...);
    //   → tokens.to(CPU, non_blocking=true)       // pinned memory 异步拷贝
    //   → finished_mask.to(CPU, non_blocking=true)
    //   → 预选: index_select(global_state, valid_slots)  // 与 DtoH 重叠
    //   → cudaEventRecord(copy_event)
}
```

### 6. GenerationStream —— 异步数据通道

GenerationStream 是引擎线程（C++）和业务线程（Python）之间的数据管道。每个请求创建一个 GenerationStream 对象，它贯穿请求的完整生命周期。

![GenerationStream —— 异步数据通道](/images/ai/models/speech-gen/tts-diagram-24.jpg)

#### 6.1 职责

```text
Python 端创建并提交:
  stream = GenerationStream(infer_type, trace_id, seed, start_ids, need_attn_map, ...)
  engine.submit(stream, input_embeds)

C++ 引擎线程写入:
  stream.update(token, hidden_state, finished)  → 每步 decode 写入一个 token
  stream.update_attn_map(attn_weights)          → 结束时写入注意力权重

Python 端消费:
  stream.wait_for_update(timeout_ms)            → condition_variable 等待通知
  result = stream.read_delta(from_step)         → 增量读取 token + hidden_states
  stream.is_finished()                          → 判断是否结束
```

#### 6.2 核心设计

```cpp
class GenerationStream {
    // 同步：用 condition_variable 替代 sleep 轮询
    std::mutex mutex_;
    std::condition_variable cv_;

    // 结果：deque 支持高效的头部弹出
    std::deque<int64_t> tokens_;
    std::deque<th::Tensor> hidden_states_;
    th::Tensor attn_map_;

    // 消费追踪
    int64_t consumed_ = 0;    // 已读取并释放的步数
};
```

condition\_variable ：引擎每写入一个 token，立即 cv\_.notify\_all()，Python 端被唤醒。

#### 6.3 增量读取与内存管理

```text
GenerationResult GenerationStream::read_delta(int64_t from_step) {
    // 1. 释放已消费的历史（pop_front）
    for (...) {
        tokens_.pop_front();
        hidden_states_.pop_front();  // 立即释放 GPU tensor 引用
    }
    consumed_ += local_from;

    // 2. 返回新增数据（也是 pop_front，不是 copy）
    for (...) {
        result.hiddens.push_back(hidden_states_.front().clone());
        hidden_states_.pop_front();  // clone 后立即释放原引用
    }
}
```

确保 hidden\_states 的 GPU 内存在被 Python 端读取后立即释放，不会因 C++ 端持有引用而导致显存泄漏。

### 7. GPU 锁与多引擎协调

TTS 系统中 GPT 引擎和音频引擎（DIT/DAV）共享同一块 GPU。引擎线程持续运行 Decode 循环，如果不加控制，会长时间霸占 GPU，导致音频合成拿不到资源。

#### 7.1 协作式让步机制

```cpp
// BaseInferEngine
std::recursive_mutex gpu_lock_;                    // GPU 操作互斥锁
std::atomic<int> external_lock_waiting_count_{0};  // 外部等待计数器

// 音频引擎获取 GPU
void acquire_gpu_lock() {
    external_lock_waiting_count_.fetch_add(1);  // 先标记"我在等"
    gpu_lock_.lock();                           // 再排队等锁
    external_lock_waiting_count_.fetch_sub(1);  // 拿到后取消标记
}
void release_gpu_lock() { gpu_lock_.unlock(); }

// GPT 引擎每步开始前检查
void infer_incre_token() {
    std::unique_lock<std::recursive_mutex> gpu_lock(gpu_lock_);
    if (is_external_waiting()) {
        return;  // 有人在等 → 主动让出，下个循环再来
    }
    // ... 正常执行 decode
}
```

这是一种非抢占式优先级调度：

- GPT 引擎每步 decode 前检查 external\_lock\_waiting\_count\_
- 如果有音频引擎在等（> 0），GPT 主动跳过本步，释放锁
- 音频引擎拿到锁，执行完后释放
- GPT 在下次循环中继续

这种设计保证了音频合成的及时性。

### 8. CUDA Graph

CUDA Graph 将多个 CUDA Kernel 的 launch 录制为一个图，后续执行时一次性提交，消除逐个 launch 的 CPU 开销（tts的矩阵规模很小，所以cuda graph会有显著收益）。Decode 阶段非常适合 CUDA Graph：每步的 input shape 固定为 [batch\_size, 1, hidden\_size]，28 层 Transformer 的操作完全一致。唯一的变量是 batch\_size（1~8），通过预热覆盖所有可能值即可。

> 继续向下是算子层面优化：CUDA 算子优化。主要是在tts这个较小规格上的一些算子优化，这里就不再继续展开了

目前的单次decode 2000us，极限希望做到1600us

## Audio Engine：从 Latents 到音频波形

### 职责

Audio Engine 是 TTS 流水线的最后一环：接收 GPT 产出的 latents（连续特征向量），生成最终的音频波形（WAV）。

### 两条路线

系统支持两种 Audio Engine，对应不同的声学模型：

两者都继承自 BaseAudioEngine，对外暴露统一的 generate() / generate\_stream() 接口，上层 Generator 无需关心具体实现。

### GPU 资源协调

Audio Engine 和 GPT 共享同一块 GPU。在流式场景下，GPT 持续生成 token，Audio Engine 则周期性地拿一批 latents 去合成音频，两者交替使用 GPU。协调机制通过 GPULock 实现：Audio Engine 每次推理前 acquire\_gpu\_lock()，推理完 release\_gpu\_lock()。GPT 的 FT 引擎在检测到有外部线程等待锁时会主动让步（is\_external\_waiting()），让 Audio Engine 优先使用 GPU。

### TRT 加速

Audio Engine 的核心优化手段是将 PyTorch 模型转换为 TensorRT (TRT) 引擎：

- 离线阶段：

  - 调优每个 PyTorch 子模块（如 LatentConditioner、PitchPredictor、Generator、DIT、DAV Decoder 等），方法包括调整推理代码，应用一些算法优化手段（mean flow减少迭代轮次）等
  - 导出为 trt的.engine 文件
- 加载阶段：用 TRT 封装类（如 TRTHiFiDecoder、TRTDiT、TRTDaV）替换对应的 PyTorch 模块，继承原始类的接口，仅替换 forward() 为 TRT 推理
- 运行阶段：调用链不变，上层代码无感知，推理速度显著提升

如果 TRT 引擎加载失败，自动回退到原始 PyTorch 模型，保证服务可用性。

![TRT 加速](/images/ai/models/speech-gen/tts-diagram-25.jpg)

## TTS的对齐测试

TTS 系统的质量评估围绕两个核心问题：说的对不对（内容准确性）和像不像（音色相似度）。我们基于 Seed-TTS-Eval 基准，构建了自动化评估流水线。

### WER —— 内容准确性

WER（Word Error Rate，字错误率）衡量生成语音的内容是否与输入文本一致。流程：将生成的音频通过 ASR（语音识别）模型转写为文本，再与原始输入文本对比，计算编辑距离。

计算使用 jiwer 库，输出四项指标：

- WER：综合字错误率（越低越好）
- SUB：替换错误率（把 A 说成 B）
- DEL：删除错误率（漏说了）
- INS：插入错误率（多说了）

### SIM —— 音色相似度

SIM（Speaker Similarity）衡量生成语音与参考音频的音色一致性。流程：分别提取生成音频和参考音频的说话人 embedding（使用 WavLM Large + ECAPA-TDNN），计算余弦相似度。

- 分数范围：-1.0 ~ 1.0（越高越像）
- 统计指标：均值、方差、中位数、最小值
- 支持离群值检测（IQR 方法）和阈值告警

## TTS服务在实践的一些设计思想

### 一、为遗忘而设计

> TTS 系统迭代节奏快、细节变更密集。设计的首要目标不是"写的时候好写"，而是"忘了之后好懂"。 目标是 降低认知负荷（Cognitive Load）

- 结构即文档：模块命名、分层边界、调用链路本身就是最好的注释
- 状态内聚（Deep Modules）：模块对外接口简单，复杂性封装在内部，调用者不需要理解实现细节。每个有状态对象自行管理生命周期，外部只见接口不见内部。

### 二、面向替换的架构

> 更新和优化的推进是局部替换——更好的声码器、更快的推理引擎。架构必须让替换的代价趋近于零。

- 接口驱动：组件之间只依赖接口约定，不依赖实现细节
- 分层治理：每层只解决一类问题，上层不触碰模型细节，下层不感知业务语义。

### 三、主干清晰

主流程是一条无旁路的直线：文本 → 预处理 → 条件获取 → GPT 生成 → 音频合成 → 输出。

所有复杂性——“前处理、分段策略、流式状态、TRT 加速、工具组件等”——都封装在各自模块内部，不侵入主干。

> Intention-Revealing Interfaces（意图揭示接口） 读代码看到的是"做什么"，每次的跳转优先获取的信息是程序要“做什么”，最后才会看到"怎么做"。 好处是对于维护和协作友好。

## 优化方向

- Ft engine

  - 更快的kernel
  - 更少的空泡
  - lora模型服务的吞吐
  - 推测解码
  - 量化
- Audio engine

  - 做更深入的优化，逐步得对trt engine做替换
  - 一些量化的探索
