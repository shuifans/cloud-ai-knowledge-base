# 追加鹈鹕作品

页面入口为 `/playground/pelican/`，清单在 `docs/.vitepress/theme/pelican-catalog.json`。

1. 准备原始 HTML，命名为 `pelican-bicycle-<完整模型名>-<reasoning effort>.html`。只从最后一个短横线拆分 effort，模型名可以包含 `-max`、`-flash` 等后缀。
2. 执行 `node scripts/import-pelicans.mjs /作品目录 batch-002 第二批`。批次 ID 使用英文小写与短横线。原文按字节存为 `.html.txt`，网页只在隔离的 iframe 中运行，不直接作为同源 HTML 执行。
3. 在浏览器中逐个查看原始作品，默认参考视口 1280 × 800。出现页面滚动或截断时提高视口高度，完整展示原始页面并记录尺寸；不要修改原 HTML。首批 `gpt6-sol / xhigh` 使用 1280 × 1000。
4. 截取真实画面，等比例输出宽度 960 px 的 WebP，写入清单中对应的 `thumbnailPath`。不能使用设计草案插画。填写该记录的 `previewViewport` 与 `capture`（浏览器、视口、日期、实际截图时机）。首批为 DOM 就绪后截图，动画相位不固定，不表示同步截帧。
5. 运行 `node scripts/check-pelicans.mjs`、`node --test tests/*.test.mjs`、`npm run docs:build`，并在带 `/cloud-ai-knowledge-base/` base 的构建预览中验证筛选、播放与下载。
6. 按仓库发布约定，经 hkserver 中转 Git bundle 并推送 main。

导入不会覆盖已有 run。同一批次、同一文件的重复导入不产生新记录；新内容使用新哈希与记录 ID。其他批次出现完全相同的哈希会报错，先核对是否重复导入。生成时间、token、成本等不详时保持 null / 缺省；不要将文件修改时间当成测试时间。

当前题目使用提示词 v1：

> 创建一个HTML，内容是SVG绘制一个鹈鹕骑自行车的2D动画。

当前导入器只收录此 v1 题目。改变提示词时，先扩展题目版本与关联数据，不能直接改写现有提示词。
