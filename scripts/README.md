# 海边慢骑背景音乐

网站音轨为百炼 `fun-music-v1` 生成的纯器乐，生成提示词见 `generate-coastal-music.py`。源音频约 184.88 秒，发布版选取 4–97.4 秒，做 3.4 秒首尾交叉淡化，得到 90 秒循环。发布文件为 `docs/public/audio/coastal-ride.mp3`（44.1 kHz 双声道、160 kbps、约 1.8 MB）。MP3 元数据保留 AI 生成来源说明。

## 重新生成

凭证仅从环境变量或仓库之外的文件读取。不要把凭证、带签名的下载链接、响应缓存或 `.env` 提交到仓库。

```sh
python3 scripts/generate-coastal-music.py \
  --key-file /private/path/to/key.md \
  --output /tmp/coastal-original.wav \
  --response-cache /tmp/coastal-response.json
```

也可设置 `DASHSCOPE_API_KEY` 或传入 `--env-file`。接口每次生成可能产生费用。超时不会自动重复生成；已保存响应缓存时，重跑会复用该结果下载。生成结果时长由模型决定，处理前需确认片段范围。

```sh
python3 scripts/prepare-coastal-music.py /tmp/coastal-original.wav /tmp/coastal-new.mp3 \
  --ffmpeg /path/to/ffmpeg --start 4 --end 97.4 --crossfade 3.4
```

处理脚本依赖 FFmpeg，使用固定增益调整响度，避免循环边界的增益突变。先检查新文件再替换发布文件；脚本拒绝覆盖已有文件。

## 播放与验证

播放器位于共享布局，页面导航时保留同一音频元素；默认尝试播放，音量为 24%。浏览器禁止有声自动播放时，在首次真实点击或按键后重试。右上角按钮可静音、恢复或重试加载；静音偏好存入本地存储并同步同源标签页。

```sh
node --test tests/background-music.test.mjs
VITEPRESS_BASE=/cloud-ai-knowledge-base/ npm run docs:build
```

浏览器还需验证播放进度在页面切换后连续、完整一轮后自动循环、静音刷新后保留，以及深浅主题和 320px 导航布局。
