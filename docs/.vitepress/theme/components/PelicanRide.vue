<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useData } from 'vitepress'
import scene from '../assets/pelican-ride.svg?raw'
import { mountPelicanRide } from './pelicanRide.js'

const { isDark } = useData()
const card = ref<HTMLElement>()
let dispose: (() => void) | undefined
onMounted(() => { if (card.value) dispose = mountPelicanRide(card.value) })
onBeforeUnmount(() => dispose?.())
</script>

<template>
  <section ref="card" class="ride-card" aria-label="鹈鹕骑行动画与播放控制" aria-describedby="ride-shortcuts" tabindex="0">
    <div class="ride-stage">
      <div class="ride-caption"><span>COASTAL ROUTE · 01</span><strong>慢一点，知识自有风景。</strong></div>
      <button class="scene-theme" type="button" :aria-label="isDark ? '切换日景' : '切换夜景'" :aria-pressed="isDark" @click="isDark = !isDark">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.5 8.5 0 1 0 20 15.5Z"/></svg>
        <span>{{ isDark ? '日景' : '夜景' }}</span>
      </button>
      <div class="ride-art" v-html="scene"></div>
      <div id="toast" class="ride-toast" aria-hidden="true">叮铃 ♪</div>
    </div>
    <div class="ride-toolbar">
      <button id="play" class="ride-play" type="button" aria-label="暂停动画">
        <svg id="play-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h3v14H7zm7 0h3v14h-3z"/></svg>
        <span id="play-text">暂停一下</span>
      </button>
      <label class="ride-speed" for="speed"><span>骑行速度</span><input id="speed" aria-label="骑行速度" type="range" min="0.5" max="2" step="0.1" value="1" aria-valuetext="1.0 倍速"><output id="speed-value" for="speed">1.0×</output></label>
      <button id="bell" class="ride-bell" type="button" aria-label="按响车铃"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 15h14l-2-3V9a5 5 0 0 0-10 0v3Zm5 4a2 2 0 0 0 4 0M12 2v2"/></svg><span>叮铃</span></button>
    </div>
    <div class="ride-note"><span><i class="ride-dot" aria-hidden="true"></i><span id="status-text">迎着海风</span></span><span>不赶时间，一路向前。</span></div>
    <p id="ride-shortcuts" class="sr-only">动画区域获得焦点时，按空格暂停或继续，按 B 响铃。</p>
    <div id="announcement" class="sr-only" role="status" aria-live="polite"></div>
  </section>
</template>

<style scoped>
.ride-card {
  --sky: #f7f2e5; --sea: #d1e5da; --wave: #abcfc2; --sand: #efeede;
  --sun: #f3d58a; --cloud: #fffdf7; --gull: #88aaa1; --grass: #9bbaa4;
  --road: #b1c0aa; --shadow: #d5d7c2;
  min-width: 0; border: 1px solid var(--coast-line); border-radius: 24px;
  background: var(--coast-card); overflow: hidden;
  box-shadow: 0 12px 45px #304b380a;
}
.ride-stage { position: relative; background: var(--sky); }
.ride-caption { position: absolute; z-index: 1; left: 24px; top: 22px; display: grid; gap: 4px; pointer-events: none; }
.ride-caption span { font-size: 9px; letter-spacing: .17em; color: var(--coast-muted); }
.ride-caption strong { font-size: 12px; font-weight: 500; letter-spacing: .06em; }
.scene-theme { position: absolute; z-index: 1; right: 20px; top: 22px; display: flex; align-items: center; gap: 5px; font-size: 11px; border-radius: 99px; border: 1px solid var(--coast-line); padding: 6px 10px; background: var(--coast-card); }
.scene-theme svg { width: 14px; height: 14px; }
.ride-art :deep(#ride) { display: block; width: 100%; height: auto; }
.ride-art :deep(.stars), .ride-art :deep(.moon-cut) { opacity: 0; transition: opacity .4s; }
.ride-toolbar { border-top: 1px solid var(--coast-line); display: flex; align-items: center; gap: 16px; padding: 16px 20px; }
.ride-toolbar button { display: flex; align-items: center; justify-content: center; gap: 5px; font-size: 12px; white-space: nowrap; border-radius: 99px; min-height: 38px; }
.ride-toolbar svg { width: 17px; height: 17px; flex: none; }
.ride-play { color: #fffdf5; background: var(--coast-button); padding: 9px 14px; min-width: 100px; }
.ride-bell { border: 1px solid var(--coast-line); padding: 8px 12px; }
.ride-speed { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0; font-size: 11px; color: var(--coast-muted); }
.ride-speed > span { white-space: nowrap; }
.ride-speed input { width: 100%; min-width: 35px; height: 24px; accent-color: var(--coast-accent); cursor: pointer; }
.ride-speed output { min-width: 30px; color: var(--coast-ink); font-variant-numeric: tabular-nums; }
.ride-note { display: flex; justify-content: space-between; gap: 12px; padding: 0 22px 15px; color: var(--coast-muted); font-size: 10px; letter-spacing: .04em; }
.ride-note > span:first-child { display: flex; align-items: center; gap: 6px; }
.ride-dot { width: 5px; height: 5px; background: var(--coast-accent); border-radius: 50%; }
.ride-card[data-playing='false'] .ride-dot { background: #b1833f; }
.ride-toast { position: absolute; left: 65%; top: 34%; padding: 5px 12px; border-radius: 20px; background: var(--coast-card); font-size: 12px; opacity: 0; pointer-events: none; transform: translateY(5px); transition: opacity .15s, transform .2s; }
.ride-toast.show { opacity: 1; transform: translateY(0); }
button { cursor: pointer; touch-action: manipulation; transition: background .2s, border-color .2s; }
button:hover { filter: brightness(1.06); border-color: var(--coast-accent); }
button:focus-visible, input:focus-visible, .ride-card:focus-visible { outline: 3px solid #c49441; outline-offset: 4px; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
@media (max-width: 1100px) and (min-width: 821px) { .ride-toolbar { gap: 10px; padding: 14px; } .ride-speed > span { display: none; } }
@media (max-width: 480px) {
  .ride-card { border-radius: 20px; }
  .ride-caption { left: 17px; top: 17px; }
  .ride-caption span { font-size: 8px; }
  .ride-caption strong { font-size: 10px; }
  .scene-theme { right: 14px; top: 16px; padding: 5px 8px; }
  .ride-toolbar { flex-wrap: wrap; gap: 12px; padding: 14px 17px 10px; }
  .ride-bell { margin-left: auto; }
  .ride-speed { order: 3; flex-basis: 100%; }
  .ride-note { padding: 0 17px 14px; }
}
@media (prefers-reduced-motion: reduce) { *, :deep(*) { transition: none !important; } }
</style>

<style>
/* The root theme is set before hydration, including on a saved night-mode reload. */
html.dark .ride-card {
  --sky: #2b424b; --sea: #3c6668; --wave: #537e7b; --sand: #435955;
  --sun: #efe0ad; --cloud: #678080; --gull: #9db5b0; --grass: #8ea994;
  --road: #708b7d; --shadow: #304541;
}
html.dark .ride-card .ride-art .stars,
html.dark .ride-card .ride-art .moon-cut { opacity: 1; }
html.dark .ride-card .ride-art #clouds { opacity: .3; }
</style>
