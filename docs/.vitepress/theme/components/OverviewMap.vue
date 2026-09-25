<script setup lang="ts">
import { withBase } from 'vitepress'
defineProps<{ src: string; alt: string }>()
</script>

<template>
  <details class="overview-map">
    <summary><span class="vpi-plus" aria-hidden="true"></span><span>本篇知识地图</span><small>展开查看 · 点击图片可放大</small></summary>
    <figure><img :src="withBase(src)" :alt="alt" loading="lazy" decoding="async" /><figcaption>本站生成的知识地图。具体版本、参数与结论以正文引用的一手来源为准。</figcaption></figure>
  </details>
</template>

<style scoped>
.overview-map { margin: 22px 0; border: 1px solid var(--coast-line); border-radius: 14px; background: var(--coast-card); overflow: hidden; }
summary { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; padding: 14px 16px; color: var(--coast-ink); font-size: 13px; cursor: pointer; list-style: none; }
summary::-webkit-details-marker { display: none; } summary .vpi-plus { font-size: 14px; } details[open] summary .vpi-plus { transform: rotate(45deg); }
summary small { margin-left: auto; font-size: 11px; color: var(--coast-muted); }
summary:focus-visible { outline: 2px solid var(--coast-focus); outline-offset: -3px; }
figure { margin: 0; padding: 0 16px 16px; } img { display: block; width: 100%; border: 1px solid var(--coast-line); border-radius: 10px; }
figcaption { margin-top: 10px; font-size: 12px; color: var(--coast-muted); line-height: 1.8; }
@media(max-width:600px) { summary small { width: 100%; margin: 0 0 0 24px; } figure { padding: 0 10px 12px; } }
</style>
