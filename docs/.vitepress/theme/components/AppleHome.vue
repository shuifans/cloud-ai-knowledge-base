<script setup lang="ts">
import { withBase } from 'vitepress'
import Timeline from './Timeline.vue'

const bigTiles = [
  {
    icon: '☁️',
    title: '云计算',
    desc: '基座 → 计算·存储·网络 → 数据 → 云原生。四层完整技术栈的原理、选型与实践。',
    link: '/cloud/',
    cta: '进入云计算',
    sub: '从基座开始',
    subLink: '/cloud/foundation/',
  },
  {
    icon: '🧬',
    title: '人工智能',
    desc: '模型架构演进 · AI Infra · 大模型应用 · Agent。从机器学习经典到智能体前沿的完整谱系。',
    link: '/ai/',
    cta: '进入人工智能',
    sub: '从模型架构开始',
    subLink: '/ai/models/',
  },
]
</script>

<template>
  <div class="apple-home">
    <!-- Hero -->
    <section class="hero">
      <h1 class="hero-title">云与 AI 知识体系</h1>
      <p class="hero-tag">十年云实践 · 六浪技术变迁。</p>
      <p class="hero-sub">
        从 OpenStack 云计算基座，到模型架构、AI Infra 与
        Agent——一名解决方案架构师的完整知识图谱。
      </p>
      <div class="hero-actions">
        <a class="btn btn-primary" :href="withBase('/cloud/')">从云计算开始</a>
        <a class="btn btn-ghost" :href="withBase('/ai/')">直达人工智能 ›</a>
      </div>
    </section>

    <!-- 支柱磁贴 -->
    <section class="tiles">
      <div class="grid grid-2">
        <div v-for="t in bigTiles" :key="t.title" class="tile tile-big">
          <span class="tile-icon">{{ t.icon }}</span>
          <span class="tile-title">{{ t.title }}</span>
          <span class="tile-desc">{{ t.desc }}</span>
          <div class="tile-ctas">
            <a class="tile-cta-primary" :href="withBase(t.link)">{{ t.cta }}</a>
            <a class="tile-cta-link" :href="withBase(t.subLink)">{{ t.sub }} ›</a>
          </div>
        </div>
        <div class="tile tile-wide">
          <span class="tile-icon">📜</span>
          <span class="tile-title">技术编年史</span>
          <span class="tile-desc">
            六次技术浪潮的架构命题与破局之道——移动互联网、直播、短视频、区块链、元宇宙、AI 大模型。
          </span>
          <div class="tile-ctas">
            <a class="tile-cta-primary" :href="withBase('/chronicle/')">进入编年史</a>
            <a class="tile-cta-link" href="#home-timeline">看时间轴 ›</a>
          </div>
        </div>
      </div>
    </section>

    <!-- 编年史：深色全宽区 -->
    <section id="home-timeline" class="chronicle">
      <h2 class="sec-title">技术编年史</h2>
      <p class="sec-sub">每一浪技术周期，都有它独特的架构命题。</p>
      <Timeline :dark="true" />
    </section>

    <!-- 宣言 -->
    <section class="manifesto">
      <p class="quote">把判断变成流程，<br />把经验变成体系。</p>
      <p class="quote-sub">内容基于公开技术资料与脱敏后的实践总结 · 持续更新</p>
    </section>
  </div>
</template>

<style scoped>
.apple-home {
  margin-top: calc(var(--vp-nav-height) * -1);
  padding-top: var(--vp-nav-height);
}

/* ---------- Hero ---------- */
.hero {
  padding: 110px 24px 84px;
  text-align: center;
  background:
    radial-gradient(60% 50% at 50% 0%, rgba(0, 113, 227, 0.06) 0%, transparent 70%),
    var(--vp-c-bg);
}

.hero-title {
  font-size: clamp(44px, 7vw, 68px);
  line-height: 1.05;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--vp-c-text-1);
  margin: 0;
}

.hero-tag {
  margin-top: 20px;
  font-size: clamp(20px, 3vw, 26px);
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--vp-c-text-2);
}

.hero-sub {
  margin: 14px auto 0;
  max-width: 620px;
  font-size: 17px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.hero-actions {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  height: 44px;
  padding: 0 24px;
  border-radius: 980px;
  font-size: 15px;
  font-weight: 500;
  transition: background-color 0.25s, color 0.25s;
}

.btn-primary {
  background: var(--vp-c-brand-1);
  color: #fff;
}

.btn-primary:hover {
  background: var(--vp-c-brand-2);
  color: #fff;
}

.btn-ghost {
  color: var(--apple-link, var(--vp-c-brand-1));
}

.btn-ghost:hover {
  text-decoration: underline;
}

/* ---------- 磁贴（羊皮纸段，浅色区脉冲：白 → 羊皮纸 → 黑 → 白） ---------- */
.tiles {
  padding: 12px 20px 84px;
  background: var(--vp-c-bg-soft);
}

.grid {
  display: grid;
  gap: 20px;
  max-width: 1060px;
  margin: 0 auto 20px;
}

.grid-2 {
  grid-template-columns: repeat(2, 1fr);
}

.tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  padding: 44px 26px 40px;
  transition: border-color 0.3s ease, background-color 0.3s ease;
}

.tile:hover {
  border-color: rgba(0, 0, 0, 0.16);
}

.dark .tile {
  background: var(--vp-c-bg-mute);
}

.dark .tile:hover {
  border-color: rgba(255, 255, 255, 0.2);
}

.tile-wide {
  grid-column: 1 / -1;
  min-height: 0;
}

.tile-big {
  min-height: 300px;
  justify-content: center;
}

.tile-big .tile-icon {
  font-size: 52px;
}

.tile-big .tile-title {
  font-size: 28px;
  margin-top: 14px;
}

.tile-big .tile-desc {
  font-size: 16px;
  max-width: 360px;
}

.tile-icon {
  font-size: 38px;
  line-height: 1;
}

.tile-title {
  display: block;
  margin-top: 12px;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--vp-c-text-1);
}

.tile-desc {
  display: block;
  margin-top: 8px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}

.tile-ctas {
  margin-top: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
  flex-wrap: wrap;
}

.tile-cta-primary {
  display: inline-flex;
  align-items: center;
  height: 36px;
  padding: 0 18px;
  border-radius: 980px;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.25s;
}

.tile-cta-primary:hover {
  background: var(--vp-c-brand-2);
  color: #fff;
}

.tile-cta-link {
  font-size: 14px;
  color: var(--apple-link, var(--vp-c-brand-1));
}

.tile-cta-link:hover {
  text-decoration: underline;
}

/* ---------- 编年史（深色区） ---------- */
.chronicle {
  background: #000;
  padding: 96px 24px 110px;
  scroll-margin-top: calc(var(--vp-nav-height) + 16px);
}

.sec-title {
  text-align: center;
  font-size: clamp(32px, 5vw, 44px);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #f5f5f7;
  margin: 0;
}

.sec-sub {
  text-align: center;
  margin: 12px 0 56px;
  font-size: 17px;
  color: #86868b;
}

/* ---------- 宣言 ---------- */
.manifesto {
  background: var(--vp-c-bg);
  padding: 92px 24px;
  text-align: center;
}

.quote {
  font-size: clamp(24px, 4vw, 32px);
  font-weight: 600;
  letter-spacing: -0.015em;
  line-height: 1.4;
  color: var(--vp-c-text-1);
  margin: 0;
}

.quote-sub {
  margin-top: 18px;
  font-size: 13.5px;
  color: var(--vp-c-text-2);
}

/* ---------- 响应式 ---------- */
@media (max-width: 640px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }

  .hero {
    padding: 84px 20px 64px;
  }

  .tile-big {
    min-height: 0;
  }
}
</style>
