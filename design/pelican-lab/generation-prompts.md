# 界面草案的生成提示词

生成工具：ImageGen 内置工具。日期：2026-09-26。

用途：仅用于设计讨论；作品缩略图为示意，正式展示必须使用原始结果。

参考：本地现有知识库首页截图、gpt6-astra-xhigh 原始结果截图、qwen3.8-max-xhigh 原始结果截图，通过会话图像引用传入；后两次还包含此前草案作为差异化参考。

## 草案 1

```text
Create realistic production-quality UI design, not code. Design direction name: 海风作品画廊. One focused desktop page 1440 x 1024 for an existing Chinese knowledge site, preserving existing brand. Use attached THREE reference screenshots: first is existing knowledge homepage for typography, colors, navigation, overall atmosphere; second is an actual gpt6-astra-xhigh result with scarf and coral bicycle; third is actual qwen3.8-max-xhigh with blue sky and red bicycle. They are references, not edit targets. Do not invent an unrelated visual system.
The user wants a playful ongoing exhibition of model outputs for the prompt “创建一个HTML，内容是SVG绘制一个鹈鹕骑自行车的2D动画。” This exact sentence must be visible, legible, unchanged.
Use page background #f1f3eb, cards #fffdf5, headings #29464a, muted text #63756e, rules #dce2d5, green accent #397e70. Chinese system sans-serif, editorial whitespace, 16-20px card corners, minimal shadow, no emoji. No giant hero illustration.
Top navigation same brand 云与 AI 知识体系 with simple logo from ref, links 云计算 / 人工智能 / 编年史 / 鹈鹕测试 (active green underline) / 更新记录 / 关于. Compact search and day/night control.
Main area width about 1200, centered. Eyebrow PELICAN LAB. Main heading “同一道题，骑出不同的风景。” Below quiet summary “鹈鹕骑车 · 13 个作品 · 9 个模型 · 4 档 effort”. Compact prompt strip displaying exact prompt and “复制提示词”. Then compact horizontal filter toolbar: model searchable dropdown labeled “模型：全部”, reasoning effort chips “全部  medium  high  xhigh  max”, right “模型分组” sorting. Show counts 13 / 13 and subtle “趣味观察，不代表综合能力排名”.
Hero use case is browsing actual outputs in STRICTLY THREE equal columns, gallery continuing below fold. Show two complete rows with large 16:10 thumbnail preview areas; each uses distinct pelican bicycle graphics inspired by reference outputs but clearly mock gallery previews. Captions: gpt6-astra / medium, gpt6-astra / xhigh, gpt6-luna / max on row one; gpt6-sol / medium, gpt6-sol / high, gpt6-sol / xhigh on row two. Each card has quiet effort pill, one “播放” action on thumbnail bottom and “放大查看” text in footer. No rating, score, ranking, voting, leaderboard, fake latency or price, no feature clutter. Give thumbnails room, consistent same canvas size. Do not clip pelican beak or wheels. This is a visual design draft, add a tiny bottom note “布局草案 · 缩略画面仅作示意”. Current date anchor 2026-09-26; don't invent test dates.
```

## 草案 2

```text
Create a realistic production-quality UI concept, one independent screen, 1440 x 1024 desktop. Design direction: 模型分组展柜. Context: Chinese existing knowledge site 云与 AI 知识体系; fun continuing exhibition of 13 HTML/SVG pelican bicycle animations from 9 model names, four reasoning effort values. This is a visual draft, not code.
Attached last FOUR images: the existing knowledge homepage, actual astra-xhigh output, actual qwen3.8-max-xhigh output, and a previous concept. Use the FIRST reference homepage as brand grounding. The second and third are actual art references. The fourth previous concept is NOT the target; make a structurally DIFFERENT layout while preserving brand.
Match sea-salt green #397e70, warm paper #f1f3eb, ivory #fffdf5, dark teal #29464a, subtle #dce2d5 dividers. System Chinese sans, ample whitespace, no emoji, no scoreboard/ranking/prices. Use same thin full-width top navigation as site: 云与 AI 知识体系, 搜索知识, 云计算, 人工智能, 编年史, 鹈鹕测试(active), 更新记录, 关于, day/night.
Compact title area: “鹈鹕骑车，模型作品集” with “13 个作品 · 9 个模型 · 持续收录”. Under title preserve exact full prompt visibly: “创建一个HTML，内容是SVG绘制一个鹈鹕骑自行车的2D动画。” and a copy button.
Distinct layout: slim 210px LEFT FILTER RAIL with searchable model list and checkboxes, works count, and effort filter group. Right MAIN gallery about 1000px, THREE equal cards per row. Group by model using editorial section heading and a horizontal hairline. First visible group “gpt6-astra · 2 个结果” showing two cards medium and xhigh plus intentional blank third space, NOT a nonexistent result. Second visible group “gpt6-sol · 4 个结果” showing medium/high/xhigh three cards and the top of max card on next row at bottom. No invented model effort combinations.
Rail contains model names gpt6-astra (2), gpt6-sol (4), gpt6-luna (1), deepseek-v4.1-flash (1), glm-5.3 (1), glm-5.3-flash (1), kimi-k3 (1), qwen3.8-flash (1), qwen3.8-max (1). Rail filter “Reasoning effort” options 全部, medium, high, xhigh, max. Rows can truncate long names only with believable ellipsis, no cramming. Filters are multi-select.
Each artwork card large 16:10 preview pelican riding bicycle, varied SVG-like illustrations inspired by actual refs and lightly approximate other thumbnails, readable exact captions effort pill and “播放 / 放大”. Hero use case: exploring one model's different outputs, no huge hero art. At bottom small note “布局草案 · 缩略画面仅作示意”. Current date is 2026-09-26; no dates are needed, don't invent generation dates. Clear 14–16px body type, only two fonts max, no browser chrome, no device frame.
```

## 草案 3

```text
Create realistic production-quality Chinese UI concept, ONE desktop page, 1440 x 1024. Direction name: 三席对照台. This is a proposed optional comparison view within a playful model-output exhibition. Exactly three equal artwork columns per row is a hard constraint. No code, no split screens, no device frame, no option number on image.
Use attached FIVE images. FIRST is current homepage brand reference. SECOND actual gpt6-astra-xhigh artwork and THIRD actual qwen3.8-max-xhigh artwork are source visual references. LAST TWO images are previous draft concepts, not targets. Make this structure meaningfully different: three large selected works in a side-by-side comparison stage plus a narrow bottom thumbnail filmstrip for selecting/replacing a work. Still retain connection to the three-column gallery via a visible “返回作品画廊” link. This is a secondary view; avoid presenting it as a mandatory gate.
Brand exact: warm paper #f1f3eb, ivory cards #fffdf5, teal text #29464a, muted #63756e, sea green #397e70, dividers #dce2d5. Chinese system sans, 14–16px body, understated soft rounded corners, almost no shadow, lots of room for actual artwork. No emoji, no scores, no rankings, no token/latency/cost assumptions.
Same nav as existing site: 云与 AI 知识体系 logo, 搜索知识, 云计算, 人工智能, 编年史, 鹈鹕测试(active), 更新记录, 关于, day/night.
Compact top section “同一个模型，多想一会儿会怎样？” with “gpt6-sol 的三档 effort 对照”. Exact prompt visibly “创建一个HTML，内容是SVG绘制一个鹈鹕骑自行车的2D动画。” next to “复制提示词”.
A compact filter row allows switching comparison selection: “模型  gpt6-sol ▾” and “Reasoning effort  medium  high  xhigh  max”. Selected chips medium, high, xhigh; max not selected. Main actions “同时开始” and quiet “停止预览”, with small visible label “同尺寸展示 · 保留原始输出”.
Three equal large vertical artwork panels: gpt6-sol medium, gpt6-sol high, gpt6-sol xhigh. 16:10 large preview in each with visually distinct bicycle pelican SVG-like graphics; keep recognizable pelican beak and two wheels. This is design illustration, do NOT present art as verified results. Each panel caption is exact model name plus effort tag, actions “放大查看” and “替换”. Under art, a small shared observation line “看一看：脚蹬衔接 · 车轮运动 · 画面完整性”; no ratings or written performance verdicts.
Beneath comparison, a quiet thin divider, then “继续挑选 · 13 个作品” and compact horizontal filmstrip containing four or five miniature artwork thumbnails with readable labels gpt6-sol max, gpt6-astra medium, gpt6-astra xhigh, kimi-k3 max. The three big comparison cards occupy most of the page, filmstrip a supporting region. No fourth big column, no featured huge hero. At bottom tiny “趣味观察，不代表综合能力排名” and “布局草案 · 缩略画面仅作示意”. Current date anchor 2026-09-26; don't invent generation/test dates.
```

