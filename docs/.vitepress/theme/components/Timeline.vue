<script setup lang="ts">
import { withBase } from 'vitepress'

defineProps<{ dark?: boolean }>()

interface Era {
  period: string
  title: string
  essence: string
  keywords: string[]
  link: string
}

const eras: Era[] = [
  {
    period: '2013 – 2015',
    title: '移动互联网',
    essence: 'App 爆发与第一次大规模上云，从自建机房到 IaaS',
    keywords: ['App 架构', '上云起步', '弹性伸缩'],
    link: '/chronicle/mobile-internet',
  },
  {
    period: '2016 – 2018',
    title: '直播',
    essence: '实时音视频与 CDN 的极限考验，峰值流量成为常态',
    keywords: ['实时音视频', 'CDN 调度', '峰值弹性'],
    link: '/chronicle/livestream',
  },
  {
    period: '2018 – 2021',
    title: '短视频',
    essence: '推荐规模化与海量媒体成本战争，算法成为基础设施',
    keywords: ['推荐系统', '海量存储', '转码优化'],
    link: '/chronicle/short-video',
  },
  {
    period: '2017 – 2019',
    title: '区块链',
    essence: '分布式系统的再探索：共识、信任与性能的不可能三角',
    keywords: ['共识算法', '分布式账本', 'BaaS'],
    link: '/chronicle/blockchain',
  },
  {
    period: '2021 – 2022',
    title: '元宇宙',
    essence: '3D 实时渲染与云游戏，GPU 算力第一次成为主角',
    keywords: ['云渲染', 'GPU 云主机', '数字孪生'],
    link: '/chronicle/metaverse',
  },
  {
    period: '2023 – 今',
    title: 'AI 大模型',
    essence: '基础模型重塑应用栈：训练、推理、RAG 与 Agent',
    keywords: ['大模型推理', 'RAG', 'Agent', '算力成本'],
    link: '/chronicle/ai-era',
  },
]
</script>

<template>
  <div class="timeline" :class="{ dark }">
    <div v-for="(era, i) in eras" :key="era.title" class="era" :class="{ last: i === eras.length - 1 }">
      <div class="era-node">
        <span class="dot"></span>
      </div>
      <div class="era-body">
        <div class="era-period">{{ era.period }}</div>
        <a class="era-title" :href="withBase(era.link)">{{ era.title }}</a>
        <p class="era-essence">{{ era.essence }}</p>
        <div class="era-keywords">
          <span v-for="kw in era.keywords" :key="kw" class="kw">{{ kw }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timeline {
  position: relative;
  max-width: 720px;
  margin: 0 auto;
}

.era {
  display: flex;
  gap: 20px;
  position: relative;
  padding-bottom: 28px;
}

.era-node {
  position: relative;
  width: 20px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
}

.era-node::before {
  content: '';
  position: absolute;
  top: 22px;
  bottom: -6px;
  width: 2px;
  background: linear-gradient(180deg, var(--vp-c-brand-2), var(--vp-c-divider));
}

.era.last .era-node::before {
  display: none;
}

.dot {
  margin-top: 6px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  box-shadow: 0 0 0 4px var(--vp-c-brand-soft);
  z-index: 1;
}

.era-body {
  flex: 1;
  min-width: 0;
}

.era-period {
  font-size: 13px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  letter-spacing: 0.5px;
}

.era-title {
  display: inline-block;
  font-size: 20px;
  font-weight: 700;
  margin: 2px 0 6px;
  color: var(--vp-c-text-1);
}

.era-title:hover {
  color: var(--vp-c-brand-1);
}

.era-essence {
  margin: 0 0 10px;
  font-size: 14px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.era-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.kw {
  font-size: 12px;
  padding: 2px 10px;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

/* 深色区适配（首页编年史区） */
.timeline.dark .era-title {
  color: #f5f5f7;
}

.timeline.dark .era-title:hover {
  color: #2997ff;
}

.timeline.dark .era-period {
  color: #86868b;
}

.timeline.dark .era-essence {
  color: #a1a1a6;
}

.timeline.dark .dot {
  background: #2997ff;
  box-shadow: 0 0 0 4px rgba(41, 151, 255, 0.2);
}

.timeline.dark .era-node::before {
  background: linear-gradient(180deg, #2997ff, rgba(255, 255, 255, 0.08));
}

.timeline.dark .kw {
  background: rgba(41, 151, 255, 0.16);
  color: #5eb1ff;
}
</style>
