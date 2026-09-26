<script setup lang="ts">
import { withBase } from 'vitepress'
import { data as catalog } from '../knowledge.data'
import { taskPaths, topicPaths } from '../knowledge.mjs'
import PelicanRide from './PelicanRide.vue'
import Timeline from './Timeline.vue'

const areas = [
  { number: '01', name: '云计算', english: 'CLOUD COMPUTING', icon: 'cloud', description: '从基础设施出发，理解云上系统如何构建、运行与演进。', topics: '云计算基座 / 计算·存储·网络 / 数据 / 云原生 / 架构', link: '/cloud/', start: '/cloud/foundation/', startLabel: '从云计算基座开始' },
  { number: '02', name: '人工智能', english: 'ARTIFICIAL INTELLIGENCE', icon: 'ai', description: '从模型原理走向工程实践，连接算力、应用与智能体。', topics: '模型与算法 / AI 基础设施 / 应用与评测 / 智能体', link: '/ai/', start: '/ai/models/', startLabel: '从模型与算法开始' },
  { number: '03', name: '技术编年史', english: 'A HISTORY OF TECHNOLOGY', icon: 'history', description: '循着技术浪潮回望，在变化中看清不变的架构命题。', topics: '移动互联网 / 直播 / 短视频 / 区块链 / 元宇宙 / AI', link: '/chronicle/', start: '/chronicle/mobile-internet', startLabel: '从移动互联网开始' },
]
const reading = [
  { label: '云计算基座', title: 'OpenStack 架构与十年演进', link: '/cloud/foundation/openstack' },
  { label: '应用与评测', title: '企业级 RAG 架构设计', link: '/ai/application/rag-architecture' },
  { label: 'AI 基础设施', title: '大模型推理部署实战', link: '/ai/infra/inference/llm-inference' },
]
const verifiedOn = (path: string) => catalog.find(page => page.url === path)?.verified || ''
function openSearch() {
  document.querySelector<HTMLButtonElement>('.VPNavBarSearch .DocSearch-Button')?.click()
}
</script>

<template>
  <div class="coastal-home">
    <section class="coastal-hero" aria-labelledby="home-title">
      <div class="hero-copy">
        <p class="eyebrow">A LITTLE KNOWLEDGE JOURNEY</p>
        <h1 id="home-title">云与 AI<br /><span>知识体系</span></h1>
        <p class="hero-tagline">保持好奇，慢慢深入。</p>
        <p class="hero-description">从云计算基座，到大模型与智能体。<br />把零散的技术线索，连成一张可探索的知识地图。<br class="desktop-break" />理解原理，也抵达实践。</p>
        <div class="hero-actions">
          <a class="coast-button" href="#knowledge-map">探索知识地图 <span class="vpi-arrow-right" aria-hidden="true"></span></a>
          <button class="search-button" type="button" @click="openSearch"><span class="vpi-search" aria-hidden="true"></span>搜索知识</button>
        </div>
        <nav class="hero-shortcuts" aria-label="快速入口"><a :href="withBase('/cloud/')">云计算</a><a :href="withBase('/ai/')">人工智能</a><a href="#task-start">按任务开始</a></nav>
        <p class="hero-footnote">公开资料为起点 · 工程实践为方向 · 持续校验</p>
      </div>
      <div class="hero-pelican"><PelicanRide /><a class="pelican-gallery-link" :href="withBase('/playground/pelican/')">同一道题，看看其他模型怎么画 <span class="vpi-arrow-right" aria-hidden="true"></span></a></div>
    </section>

    <section id="knowledge-map" class="knowledge-section" aria-labelledby="knowledge-title">
      <div class="section-heading"><div><p class="eyebrow">CHOOSE YOUR ROUTE</p><h2 id="knowledge-title">每一条路，都通向理解。</h2></div><span class="section-note">两大技术领域，一条历史线索</span></div>
      <div class="knowledge-grid">
        <article v-for="area in areas" :key="area.number" class="knowledge-card">
          <div class="card-top"><span class="area-icon" aria-hidden="true">
            <svg v-if="area.icon === 'cloud'" viewBox="0 0 64 64" fill="none"><path d="M19 48h27a11 11 0 0 0 1-22 15 15 0 0 0-28-3A12 12 0 0 0 19 48Z"/><path d="M20 53h24M24 58h16"/></svg>
            <svg v-else-if="area.icon === 'ai'" viewBox="0 0 64 64" fill="none"><rect x="18" y="18" width="28" height="28" rx="6"/><path d="M27 27h10v10H27zM32 12v6M32 46v6M12 32h6M46 32h6M19 19l4 4M41 41l4 4M45 19l-4 4M23 41l-4 4"/></svg>
            <svg v-else viewBox="0 0 64 64" fill="none"><path d="M14 47h36M18 39V23M32 39V16M46 39V28"/><circle cx="18" cy="20" r="4"/><circle cx="32" cy="13" r="4"/><circle cx="46" cy="25" r="4"/></svg>
          </span><span class="route-number">ROUTE / {{ area.number }}</span></div>
          <p class="area-english">{{ area.english }}</p><h3><a :href="withBase(area.link)">{{ area.name }}</a></h3>
          <p class="area-description">{{ area.description }}</p><p class="area-topics">{{ area.topics }}</p>
          <div class="card-links"><a class="area-entry" :href="withBase(area.link)">探索这一领域 <span class="vpi-arrow-right" aria-hidden="true"></span></a><a class="area-start" :href="withBase(area.start)">{{ area.startLabel }}</a></div>
        </article>
      </div>
    </section>

    <section id="task-start" class="task-section" aria-labelledby="task-title">
      <div class="section-heading"><div><p class="eyebrow">START WITH A QUESTION</p><h2 id="task-title">带着任务，找一条路径。</h2></div><span class="section-note">从目标走向方法</span></div>
      <div class="task-grid"><article v-for="task in taskPaths" :key="task.title"><h3>{{ task.title }}</h3><p>{{ task.question }}</p><nav :aria-label="task.title"><a v-for="[label,path] in task.links" :key="path" :href="withBase(path)">{{ label }} <span class="vpi-arrow-right" aria-hidden="true"></span></a></nav></article></div>
    </section>

    <section class="reading-section" aria-labelledby="reading-title">
      <div class="reading-intro"><p class="eyebrow">A GOOD PLACE TO START</p><h2 id="reading-title">精选阅读，慢慢深入。</h2><p>复核日期记录技术内容的校验时间。</p></div>
      <div class="reading-list"><a v-for="(article, i) in reading" :key="article.link" :href="withBase(article.link)"><span class="reading-number">0{{ i + 1 }}</span><span class="reading-text"><small>{{ article.label }}</small><strong>{{ article.title }}</strong><small v-if="verifiedOn(article.link)">内容复核于 <time :datetime="verifiedOn(article.link)">{{ verifiedOn(article.link) }}</time></small></span><span class="vpi-arrow-right" aria-hidden="true"></span></a></div>
    </section>

    <section class="topic-section" aria-labelledby="topic-title"><div class="section-heading"><div><p class="eyebrow">CONNECT THE DOTS</p><h2 id="topic-title">跨越目录，串起共通问题。</h2></div></div><div class="topic-grid"><article v-for="topic in topicPaths" :key="topic.title"><h3>{{ topic.title }}</h3><nav :aria-label="topic.title"><a v-for="[label,path] in topic.links" :key="path" :href="withBase(path)">{{ label }} <span class="vpi-arrow-right" aria-hidden="true"></span></a></nav></article></div></section>

    <section id="home-timeline" class="coastal-chronicle" aria-labelledby="chronicle-title">
      <div class="chronicle-intro"><p class="eyebrow">FOLLOW THE TIDE</p><h2 id="chronicle-title">技术有浪潮，<br />知识有来路。</h2><p>从移动互联网到 AI 大模型，<br />每一轮变化，都留下值得理解的线索。</p><a class="text-link" :href="withBase('/chronicle/')">沿着时间线，看看来时的路 <span class="vpi-arrow-right" aria-hidden="true"></span></a></div>
      <Timeline />
    </section>

    <section class="coastal-manifesto" aria-label="知识库理念"><p class="eyebrow">ONE IDEA AT A TIME</p><p class="manifesto-quote">把判断变成流程，把知识变成体系。</p><p class="manifesto-note">不赶时间，让每一次理解都更进一步。</p></section>
  </div>
</template>

<style scoped>
.coastal-home { max-width: 1120px; margin: 0 auto; padding: 0 32px; color: var(--coast-ink); }
.coastal-home :where(a) { color: inherit; text-decoration: none; }
.eyebrow { margin: 0 0 14px; font-size: 10px; line-height: 1.6; font-weight: 500; letter-spacing: .18em; color: var(--coast-muted); }
.coastal-hero { display: grid; grid-template-columns: .88fr 1.12fr; gap: 46px; align-items: center; padding: 40px 0 42px; }
.hero-copy { padding: 8px 0; }
.hero-pelican { min-width: 0; }
.pelican-gallery-link { display: flex; align-items: center; justify-content: center; gap: 10px; color: var(--coast-accent) !important; font-size: 12px; min-height: 44px; margin-top: 6px; }
.pelican-gallery-link:hover { text-decoration: underline; text-underline-offset: 4px; }
.coastal-home h1 { font-size: clamp(40px, 4.5vw, 56px); font-weight: 600; letter-spacing: .025em; line-height: 1.3; margin: 22px 0 0; }
h1 span { color: var(--coast-accent); }
.hero-tagline { font-size: 21px; font-weight: 500; letter-spacing: .08em; margin: 22px 0 14px; }
.hero-description { color: var(--coast-muted); font-size: 14px; line-height: 2; margin: 0; }
.hero-actions { display: flex; align-items: center; gap: 20px; margin-top: 28px; }
.coast-button, .search-button { display: inline-flex; align-items: center; justify-content: center; gap: 12px; border-radius: 99px; min-height: 44px; font-size: 13px; font-weight: 500; cursor: pointer; }
.coast-button { padding: 11px 22px; background: var(--coast-button); color: #fffdf5; }
.coast-button:hover { filter: brightness(1.08); }
.search-button { gap: 8px; color: var(--coast-ink); padding: 10px 0; }
.search-button:hover { color: var(--coast-accent); }
.hero-footnote { font-size: 10px; letter-spacing: .05em; color: var(--coast-muted); margin: 15px 0 0; }
.section-heading { display: flex; align-items: end; justify-content: space-between; gap: 20px; margin-bottom: 24px; }
.section-heading .eyebrow { margin-bottom: 7px; }
.coastal-home h2 { font-size: 25px; line-height: 1.5; letter-spacing: .025em; font-weight: 550; margin: 0; padding: 0; border: 0; }
.section-note { font-size: 11px; color: var(--coast-muted); padding-bottom: 5px; }
.knowledge-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }
.knowledge-card { background: var(--coast-card); border: 1px solid var(--coast-line); border-radius: 20px; padding: 23px; transition: border-color .2s, transform .2s; }
.knowledge-card:hover { border-color: var(--coast-accent); transform: translateY(-3px); }
.card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
.area-icon { display: grid; place-items: center; width: 44px; height: 44px; border-radius: 14px; background: var(--coast-wash); color: var(--coast-accent); }
.area-icon svg { width: 32px; height: 32px; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.route-number { font-size: 9px; letter-spacing: .13em; color: var(--coast-muted); }
.area-english { font-size: 8px; letter-spacing: .12em; color: var(--coast-muted); margin: 0 0 6px; }
.coastal-home h3 { font-size: 23px; font-weight: 550; letter-spacing: .03em; margin: 0 0 12px; line-height: 1.4; }
.area-description { margin: 0; min-height: 51px; font-size: 13px; line-height: 1.95; color: var(--coast-muted); }
.area-topics { font-size: 10px; line-height: 1.9; min-height: 38px; margin: 16px 0 22px; color: var(--coast-muted); }
.card-links { border-top: 1px solid var(--coast-line); padding-top: 17px; display: grid; gap: 11px; }
.area-entry { display: flex; justify-content: space-between; align-items: center; font-size: 12px; font-weight: 550; color: var(--coast-accent); }
.area-start { font-size: 11px; color: var(--coast-muted); width: fit-content; }
.area-start:hover { color: var(--coast-accent); text-decoration: underline; text-underline-offset: 4px; }
.reading-section { display: grid; grid-template-columns: .85fr 1.15fr; gap: 50px; padding: 52px 0; margin: 45px 0 0; border-top: 1px solid var(--coast-line); }
.reading-intro { padding-top: 15px; }
.reading-intro .eyebrow { margin-bottom: 9px; }
.reading-intro > p:last-child { font-size: 13px; color: var(--coast-muted); margin-top: 11px; }
.reading-list a { display: flex; align-items: center; gap: 19px; border-bottom: 1px solid var(--coast-line); padding: 16px 0; }
.reading-list a:first-child { padding-top: 0; }
.reading-list a:last-child { border-bottom: 0; }
.reading-number { color: var(--coast-muted); font-size: 11px; font-variant-numeric: tabular-nums; }
.reading-text { display: grid; gap: 4px; flex: 1; }
.reading-text small { color: var(--coast-muted); font-size: 10px; }
.reading-text strong { font-size: 14px; font-weight: 500; }
.reading-list a:hover strong { color: var(--coast-accent); }
.reading-list .vpi-arrow-right { color: var(--coast-accent); font-size: 15px; }
.coastal-chronicle { display: grid; grid-template-columns: .85fr 1.15fr; gap: 48px; padding: 40px; background: var(--coast-wash); border: 1px solid var(--coast-line); border-radius: 24px; scroll-margin-top: 80px; }
.coastal-home .chronicle-intro h2 { font-size: 30px; line-height: 1.6; }
.chronicle-intro > p:not(.eyebrow) { color: var(--coast-muted); font-size: 13px; line-height: 2; margin: 18px 0 23px; }
.text-link { font-size: 12px; color: var(--coast-accent); display: inline-flex; align-items: center; gap: 10px; }
.text-link:hover { text-decoration: underline; text-underline-offset: 4px; }
.coastal-chronicle :deep(.timeline) { width: 100%; }
.coastal-chronicle :deep(.era) { gap: 15px; padding-bottom: 24px; }
.coastal-chronicle :deep(.era.last) { padding-bottom: 0; }
.coastal-chronicle :deep(.era-node::before) { background: var(--coast-line); width: 1px; }
.coastal-chronicle :deep(.dot) { width: 8px; height: 8px; margin-top: 7px; box-shadow: 0 0 0 4px var(--coast-wash); background: var(--coast-accent); }
.coastal-chronicle :deep(.era-period) { font-size: 10px; font-weight: 400; color: var(--coast-muted); }
.coastal-chronicle :deep(.era-title) { font-size: 17px; font-weight: 500; margin: 3px 0 5px; }
.coastal-chronicle :deep(.era-essence) { font-size: 11px; line-height: 1.8; color: var(--coast-muted); margin-bottom: 8px; }
.coastal-chronicle :deep(.kw) { font-size: 9px; padding: 1px 8px; color: var(--coast-accent); background: var(--coast-card); }
.coastal-manifesto { text-align: center; padding: 68px 0 60px; }
.coastal-manifesto .eyebrow { font-size: 9px; margin-bottom: 14px; }
.manifesto-quote { font-size: 23px; font-weight: 500; letter-spacing: .04em; margin: 0; }
.manifesto-note { color: var(--coast-muted); font-size: 12px; margin: 14px 0 0; }
a, button { -webkit-tap-highlight-color: transparent; }
a:focus-visible, button:focus-visible { outline: 3px solid #c49441; outline-offset: 5px; }
@media (max-width: 1000px) { .coastal-home { padding: 0 24px; } .coastal-hero { gap: 28px; } .hero-description { font-size: 13px; } .knowledge-card { padding: 20px; } .coastal-chronicle { padding: 30px; } }
@media (max-width: 820px) {
  .coastal-hero { grid-template-columns: 1fr; gap: 32px; padding: 42px 0 44px; }
  .hero-copy { text-align: center; }
  .coastal-home h1 { font-size: 44px; margin-top: 12px; } h1 br { display: none; } h1 span { margin-left: .2em; }
  .hero-tagline { margin-top: 18px; font-size: 19px; }
  .hero-description { font-size: 14px; } .hero-actions { justify-content: center; margin-top: 22px; }
  .hero-footnote { margin-top: 20px; } .coastal-hero :deep(.ride-card) { width: 100%; max-width: 600px; margin: 0 auto; }
  .knowledge-grid { gap: 12px; } .knowledge-card { padding: 17px; } .area-description { min-height: 76px; }
  .reading-section { gap: 26px; } .coastal-chronicle { grid-template-columns: 1fr; gap: 32px; }
}
@media (max-width: 600px) {
  .coastal-home { padding: 0 20px; } .coastal-hero { padding-top: 29px; }
  .coastal-home h1 { font-size: 35px; } .eyebrow { font-size: 8px; } .hero-tagline { font-size: 17px; }
  .hero-description { font-size: 12px; line-height: 2; } .hero-footnote { font-size: 9px; }
  .hero-actions { gap: 22px; } .desktop-break { display: none; }
  .coastal-home h2 { font-size: 22px; } .section-heading { display: block; margin-bottom: 20px; } .section-note { display: block; margin-top: 10px; }
  .knowledge-grid { grid-template-columns: 1fr; gap: 14px; } .knowledge-card { padding: 24px; }
  .card-top { margin-bottom: 18px; } .area-description, .area-topics { min-height: 0; } .area-topics { margin: 12px 0 20px; }
  .card-links { display: flex; align-items: center; justify-content: space-between; gap: 16px; } .area-entry { gap: 9px; }
  .reading-section { grid-template-columns: 1fr; gap: 24px; padding: 32px 0; margin-top: 32px; }
  .reading-intro { padding: 0; } .reading-text strong { font-size: 13px; }
  .coastal-chronicle { padding: 25px 22px; border-radius: 20px; }
  .coastal-home .chronicle-intro h2 { font-size: 26px; } .coastal-manifesto { padding: 45px 0 40px; }
  .manifesto-quote { font-size: 18px; line-height: 1.8; } .manifesto-note { font-size: 11px; }
}
@media (max-width: 360px) { .coastal-home { padding: 0 14px; } .coastal-home h1 { font-size: 30px; } .card-links { align-items: start; flex-direction: column; gap: 12px; } }
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } .knowledge-card:hover { transform: none; } }
.knowledge-section,.task-section { scroll-margin-top: 92px; }
.hero-shortcuts { display: flex; flex-wrap: wrap; gap: 20px; margin-top: 20px; }
.hero-shortcuts a { font-size: 12px; color: var(--coast-accent); text-decoration: underline; text-underline-offset: 4px; }
.task-section { padding-top: 48px; }
.task-grid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 16px; }
.task-grid article { padding: 20px; border: 1px solid var(--coast-line); border-radius: 16px; background: var(--coast-wash); }
.coastal-home .task-grid h3,.coastal-home .topic-grid h3 { font-size: 16px; margin: 0 0 10px; }
.task-grid p { margin: 0 0 15px; color: var(--coast-muted); font-size: 12px; line-height: 1.8; }
.task-grid nav,.topic-grid nav { display: grid; gap: 8px; }
.task-grid a,.topic-grid a { display: flex; align-items: center; justify-content: space-between; gap: 8px; color: var(--coast-accent); font-size: 12px; padding: 5px 0; }
.task-grid a:hover,.topic-grid a:hover { text-decoration: underline; text-underline-offset: 4px; }
.topic-section { padding: 0 0 48px; }.topic-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 30px; }.topic-grid article { border-top: 1px solid var(--coast-line); padding-top: 20px; }
@media(max-width:820px) { .hero-shortcuts { justify-content: center; }.task-grid { grid-template-columns: repeat(2,minmax(0,1fr)); } }
@media(max-width:600px) { .hero-shortcuts { gap: 18px; margin-top: 12px; }.hero-shortcuts a { display: inline-flex; align-items: center; min-height: 44px; }.hero-footnote { margin-top: 6px; }.task-section { padding-top: 32px; }.task-grid { grid-template-columns: 1fr; gap: 12px; }.task-grid nav { display: flex; gap: 22px; }.task-grid a,.topic-grid a { min-height: 44px; }.task-grid p { margin-bottom: 6px; }.topic-grid { grid-template-columns: 1fr; gap: 20px; }.topic-grid nav { display: flex; gap: 25px; }.topic-section { padding-bottom: 32px; } }
</style>
