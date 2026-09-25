# 全站海风风格与日夜模式验收

final result: passed

## 目标与视觉依据

- 用户要求：将知识库首页改为给定页面的风格，放入原 SVG 动画，并把风格与白天 / 黑夜切换扩展到整个站点。
- 原始视觉来源：`/Users/judehuang/ai-projects/鹈鹕骑车模型测试结果/pelican-bicycle-gpt6-astra-xhigh.html`。
- 参考截图：`/tmp/coastal-home-qa/reference-desktop.png`。
- 实现：`http://127.0.0.1:5173/`；截图 `/tmp/coastal-home-qa/home-desktop-viewport.png`。
- 同屏对照：`/tmp/coastal-home-qa/comparison-desktop.png`。
- 动画卡片细节对照：`/tmp/coastal-home-qa/comparison-cards.png`。
- 两张桌面截图均为 1280 × 900 CSS / 图像像素，1:1，不涉及密度缩放。对照拼图 2560 × 940；细节图仅对参考卡片等比例缩小，不拉伸插画。
- 状态：同为浅色、暂停、1.0 倍速，均从页面顶部截取。动画暂停时间不同，因此脚踏、云朵的位置不同。
- 本次是知识库的风格移植，双栏首屏、知识入口、文章推荐、编年史与侧栏文章布局延续既有信息架构，不按单张动画演示页的结构逐像素复制。
- 全站扩展以已实现的海风首页为依据。最终桌面首页与云计算文章均使用 1440 × 1000 视口，原像素拼接对照：`/tmp/coastal-site-qa/comparison-site-day.png`、`/tmp/coastal-site-qa/comparison-site-night.png`。拼图为 2880 × 1040，40px 为标签栏，无截图缩放或裁切。

## 五项视觉检查

1. 字体：沿用参考页的系统无衬线 / PingFang 字体栈。标题按知识库首页层级放大至桌面 56px；小标签使用参考页的字距与轻量字重。手机标题单行自适应，未截断。
2. 布局与间距：参考的 24px 圆角、细边框、轻阴影、胶囊按钮和留白已应用于首页和文章纸面。侧边知识地图、页内目录、面包屑与分页采用一致层级。动画按完整 viewBox 等比例展示；手机控制条换行，速度滑杆保持可操作。
3. 色彩：页面 #f1f3eb、卡片 #fffdf5、主文字 #29464a、主色 #397e70 与参考一致；辅助文字略加深至 #63756e。夜间页面 #172d32、纸面 #233b3e、文字 #e7e9d8。所有页面导航、侧栏、搜索、引用、表格、代码容器、提示框和 Mermaid 共用根节点语义变量。
4. 图像：直接复用用户提供的 SVG 路径、原动画计算及配色，没有重画或栅格化。沿用知识库三枚领域图标；站点云形标识改为海盐绿。文章中的原始内容图片保留，流程图和时间轴根据主题重新绘制。
5. 文案与内容：保留云计算、人工智能、技术编年史入口、六个时代及原有站内路径；首页文案改为知识旅程语气，推荐文章均链接到现有内容。

## 检查中修复的问题

- P1：夜景作用域样式错误影响整页透明度。将所有场景选择器限定在 `.ride-card` 内；复核 html opacity=1、星星 opacity=1、天空色 #2b424b，原插画及整页夜景正常。
- P2：VitePress 正文规则覆盖首页标题字号、部分文章链接呈蓝色。提高首页排版选择器优先级，局部重置链接样式。最终标题为 56px，领域标题和推荐文章链接为 rgb(41,70,74)。证据：最终首屏、`home-routes-desktop.png` 和 `home-timeline-desktop.png`。
- P2：暂停标记与 Vue 的主题 class 更新可能互相覆盖。改为独立 `data-playing` 属性；暂停后切换夜景，状态仍为 false，文案仍为“歇一会儿”。
- P2：暗色 CTA 悬停色过浅。保持原按钮背景，仅轻微提亮。
- P2：全站侧栏指示线误作用于未选中项。缩小到 `.is-active`，未选中项恢复透明。
- P2：搜索组件延迟加载的作用域样式覆盖自定义圆角。提升根节点选择器优先级；实测弹层 24px、搜索框 99px、结果 12px，桌面与手机均生效。
- P2：部分屏宽隐藏动画速度文案后滑杆缺少名称。添加独立 `aria-label="骑行速度"`。
- P2：直播文章两处硬编码粉紫节点不随主题变化。改用语义类，深色实测分别为 rgb(83,73,50) 和 rgb(53,87,79)。
- P1：线上静态页首次以夜间模式加载时，Vue 水合没有修正服务器输出的日景 class，导致插画和图标与页面主题不一致。场景夜色和日月图标改为直接响应 `html.dark`。生产构建预览刷新验证：天空 #2b424b、星星 opacity=1、月亮图标显示、太阳图标隐藏；切回白天为 #f7f2e5。
- 主题按钮文案和无障碍属性在客户端完成水合后同步，服务端与首次客户端标记一致。最终生产预览使用 4174 新端口排除旧资源缓存，日夜两种模式刷新均无 console error / warning。
- 已重新捕获并与参考同屏对照，无剩余 P0 / P1 / P2 视觉问题。

## 浏览器验证

- 1280 × 900 桌面、768 × 1024 平板、390 × 844 手机、320 × 740 窄屏：document.scrollWidth 均等于 viewport 宽度。
- 手机首屏证据：`/tmp/coastal-home-qa/home-mobile-viewport.png`；完整插画、控制按钮和滑杆均可展示。
- 暂停后前轮 transform 保持不变；继续后恢复渲染。滚出视口后两次读取前轮 transform 均为 rotate(83.540)，确认离屏停止渲染。
- 速度键盘调整 1.0 → 1.3，输出和 aria-valuetext 同步。
- 车铃按钮与 B 键触发“叮铃”状态及铃声波纹；空格可在动画区域切换播放。
- 搜索入口打开原站内搜索，查询 RAG 返回真实文章。
- “开始探索”进入 `/cloud/`，页面标题“云计算：知识全景”；导航、文章、侧栏沿用同一主题，返回首页正常重新挂载动画。
- 页面切换卸载时清理事件、requestAnimationFrame、IntersectionObserver、铃声计时器与 AudioContext。
- 减少动态效果的初始状态与偏好变化处理已保留；未修改系统偏好进行额外人工测试。
- 使用 Codex 内置浏览器检查，未发现客户端 console error / warning。

## 全站扩展验证

- 桌面 1440 × 1000：检查云计算总览、RAG 长文、编年史、直播时代与关于页；有侧栏及无侧栏布局正常。
- 手机 390 × 844：RAG 深色文章与侧栏可读，展开菜单可正常选中当前文章，Escape 可关闭。搜索 RAG 返回真实站内结果，深色结果文字与高亮可辨识。
- 窄屏 320 × 740：日间 RAG 文档 scrollWidth=320；导航标题、搜索、图标切换按钮和菜单无重叠。18 张宽表在各自容器内滚动，没有撑宽整页。
- 顶部切换按钮在桌面与手机常驻；日夜两种选择刷新后保留，跨页面保持一致；浏览器 theme-color 分别为 #f1f3eb / #172d32。
- 首页 SVG 夜景与顶部全站开关同步。图表文字、节点、连线随主题重绘：RAG 5 张、编年史 1 张、直播时代 3 张图表均成功，无 `.mermaid-error`。
- 云计算图表放大预览使用深色背景，Escape 恢复文章；时间轴两种主题可读，表格交替行保持适当对比。
- 代码容器日间实测 rgb(237,241,232)，沿用原语法高亮与横向滚动能力。
- 证据目录：`/tmp/coastal-site-qa/`。包括 cloud-day-desktop、cloud-night-desktop、article-night-mobile、article-day-narrow、sidebar-night-mobile、search-night-mobile、search-day-desktop、timeline-day、timeline-night、diagram-zoom-night、table-night、about-night-desktop（均为 PNG）。

## 构建

- 默认路径构建通过。
- 全站样式和静态页日夜初始化修订后，`VITEPRESS_BASE=/cloud-ai-knowledge-base/` 构建通过（14.14 秒），包含 VitePress 死链校验。
- `git diff --check` 通过。
- 构建仍提示已有的 PromQL 语法高亮回退及部分大 bundle 提示，不影响产物生成。

## 剩余项

无阻塞项。按用户后续授权，通过 hk-server 中转推送 GitHub main，由现有 GitHub Actions 发布到 Pages。

## 全站背景音乐验收（2026-09-25）

- 百炼 `fun-music-v1` 生成《海边慢骑》，使用纯器乐参数，返回歌词为空。原音频约 184.88 秒，发布版为 90 秒、44.1 kHz 双声道、160 kbps MP3，1,801,554 字节。
- 发布片段做 3.4 秒首尾交叉淡化及固定增益调整。解码后实测 90 秒；响度 -19.43 LUFS、峰值 -4.96 dBTP，无削波样本；循环边界采样差 -58.27 dBFS。播放器初始音量 24%。
- 音频由共享布局持有。首页点击“开始探索”后从浏览器拦截状态转为播放；云计算页进入关于页时，进度从 23.456 秒连续到 23.526 秒，始终只有一个音频元素；切换夜间模式后继续播放。
- 经过完整 90 秒后，进度自动回到 8.174 秒，`loop=true`、`paused=false`、状态仍为 playing。
- 右上角静音按钮在静音后暂停并保留位置；刷新后 muted=true、paused=true；Enter 可操作按钮。自动化覆盖手势重试、静音偏好、异步播放竞态、失败重试、跨标签页同步和存储不可用，共 6 项通过。
- 320 × 740 夜间文章页 scrollWidth=320，标题、搜索、主题、音乐和菜单按钮不重叠。证据：`/tmp/coastal-music-qa/night-mobile-muted.png`。
- 使用 4176 新端口验证生产构建，资源正确加载于 `/cloud-ai-knowledge-base/audio/coastal-ride.mp3`，时长 90 秒、可播放；日夜模式及刷新均无 console error / warning。日间截图：`/tmp/coastal-music-qa/production-day-desktop.png`。
- `VITEPRESS_BASE=/cloud-ai-knowledge-base/` 构建通过（13.88 秒），包含死链检查。保留既有 PromQL 回退与大 bundle 提示。
- 浏览器可能限制有声自动播放：页面默认尝试播放，被拦截时在第一次真实点击或按键后启动。已保存的静音偏好优先。此限制不通过改变浏览器安全设置绕过。
- 凭证仅从用户提供的仓库外文件读取并用于官方接口鉴权；代码和发布资源不包含密钥。
