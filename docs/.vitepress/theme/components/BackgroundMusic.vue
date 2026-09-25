<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import { createBackgroundMusicPlayer } from '../backgroundMusic.js'

const audio = ref<HTMLAudioElement>()
const state = ref({ muted: false, status: 'idle' })
const mounted = ref(false)
let player: ReturnType<typeof createBackgroundMusicPlayer> | undefined
const audible = computed(() => state.value.status === 'playing' && !state.value.muted)
const label = computed(() => {
  if (state.value.muted) return '开启背景音乐'
  if (state.value.status === 'loading') return '背景音乐加载中，点击静音'
  if (state.value.status === 'error') return '背景音乐加载失败，点击重试'
  if (!audible.value) return '播放背景音乐'
  return '静音背景音乐'
})
const hint = computed(() => {
  if (state.value.muted) return '已静音 · 点击开启海边慢骑'
  if (state.value.status === 'blocked') return '点击播放 · 海边慢骑'
  if (state.value.status === 'error') return '音乐加载失败 · 点击重试'
  if (state.value.status === 'loading') return '正在加载 · 海边慢骑'
  return audible.value ? '正在播放 · 海边慢骑 · 点击静音' : '海边慢骑 · 背景音乐'
})

onMounted(() => {
  let storage: Storage | undefined
  try { storage = window.localStorage } catch { /* Storage may be unavailable. */ }
  player = createBackgroundMusicPlayer({
    audio: audio.value!,
    gestures: document,
    storageEvents: window,
    storage,
    onChange: (next: typeof state.value) => { state.value = next },
  })
  mounted.value = true
})
onBeforeUnmount(() => player?.dispose())
</script>

<template>
  <div class="coastal-music">
    <audio ref="audio" :src="withBase('/audio/coastal-ride.mp3')" loop preload="none" aria-hidden="true"></audio>
    <button
      type="button"
      class="coastal-music-toggle"
      data-background-music-toggle
      :data-state="state.status"
      :aria-label="label"
      :title="hint"
      :disabled="!mounted"
      @click="player?.toggle()"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M11 4 6 8H3v8h3l5 4Z" />
        <template v-if="audible">
          <path d="M15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14" />
        </template>
        <path v-else-if="state.muted" d="m16 9 5 6m0-6-5 6" />
        <path v-else d="m16 8 5 4-5 4Z" />
      </svg>
      <span class="music-state-dot" :class="{ active: audible }" aria-hidden="true"></span>
    </button>
  </div>
</template>

<style scoped>
.coastal-music { display: flex; align-items: center; margin-left: 8px; flex-shrink: 0; }
audio { display: none; }
.coastal-music-toggle {
  position: relative; display: inline-flex; align-items: center; justify-content: center;
  width: 36px; height: 36px; flex-shrink: 0; border-radius: 50%;
  border: 1px solid var(--coast-line); background: var(--coast-card); color: var(--coast-ink);
  cursor: pointer; transition: background-color .2s, border-color .2s;
}
.coastal-music-toggle:hover { border-color: var(--coast-accent); background: var(--coast-wash); }
.coastal-music-toggle:focus-visible { outline: 3px solid var(--coast-focus); outline-offset: 4px; }
.coastal-music-toggle:disabled { cursor: default; }
svg { width: 17px; height: 17px; }
.music-state-dot { position: absolute; right: 1px; bottom: 1px; width: 6px; height: 6px; border-radius: 50%; border: 1px solid var(--coast-card); background: var(--coast-muted); }
.music-state-dot.active { background: var(--coast-accent); }
@media (max-width: 420px) { .coastal-music { margin-left: 6px; } }
</style>
