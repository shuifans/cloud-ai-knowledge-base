<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { withBase } from 'vitepress'
import { fetchOriginal, previewDocument } from '../pelican.mjs'

const props = defineProps<{ source: string; title: string; fit?: boolean; passive?: boolean; viewport?: { width: number; height: number } }>()
const emit = defineEmits<{ ready: []; error: [] }>()
const host = ref<HTMLElement>()
const srcdoc = ref('')
const loading = ref(true)
const failed = ref(false)
const size = ref({ width: 0, height: 0 })
const frameStyle = computed(() => {
  const frame = props.viewport || { width: 1280, height: 800 }
  const scale = Math.min(size.value.width / frame.width, size.value.height / frame.height)
  return { width: `${frame.width}px`, height: `${frame.height}px`, transform: `scale(${scale})`, left: `${(size.value.width - frame.width * scale) / 2}px`, top: `${(size.value.height - frame.height * scale) / 2}px` }
})
let resize: ResizeObserver | undefined
let request: AbortController | undefined
let timeout: ReturnType<typeof setTimeout> | undefined
let generation = 0

async function load() {
  const current = ++generation
  request?.abort()
  clearTimeout(timeout)
  request = new AbortController()
  srcdoc.value = ''
  loading.value = true
  failed.value = false
  timeout = setTimeout(() => { request?.abort(); if (current === generation) fail() }, 15000)
  try {
    const html = await fetchOriginal(withBase(props.source), { signal: request.signal })
    if (current === generation) srcdoc.value = previewDocument(html)
  } catch {
    if (current === generation) fail()
  }
}
function ready() { clearTimeout(timeout); loading.value = false; emit('ready') }
function fail() { clearTimeout(timeout); failed.value = true; loading.value = false; srcdoc.value = ''; emit('error') }
onMounted(() => {
  resize = new ResizeObserver(entries => { size.value = { width: entries[0].contentRect.width, height: entries[0].contentRect.height } })
  if (host.value) resize.observe(host.value)
  load()
})
watch(() => props.source, load)
onBeforeUnmount(() => { ++generation; request?.abort(); clearTimeout(timeout); resize?.disconnect() })
</script>

<template>
  <div ref="host" class="pelican-preview" :class="{ 'fit-window': fit }" :aria-busy="loading">
    <iframe v-if="srcdoc" :key="source" :srcdoc="srcdoc" :title="title" :tabindex="passive ? -1 : undefined" :aria-hidden="passive ? true : undefined" sandbox="allow-scripts" referrerpolicy="no-referrer" :style="fit ? undefined : frameStyle" @load="ready" @error="fail"></iframe>
    <div v-if="loading" class="preview-message" role="status">正在打开作品…</div>
    <div v-if="failed" class="preview-message" role="alert"><span>预览未能加载</span><button type="button" @click="load">重新尝试</button></div>
  </div>
</template>

<style scoped>
.pelican-preview { position: relative; width: 100%; aspect-ratio: 16 / 10; overflow: hidden; background: var(--coast-wash); }
iframe { position: absolute; display: block; width: 1280px; height: 800px; border: 0; transform-origin: top left; color-scheme: light; }
.fit-window { aspect-ratio: auto; height: min(68vh, 800px); min-height: 360px; }
.fit-window iframe { width: 100%; height: 100%; }
.preview-message { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 14px; background: var(--coast-card); color: var(--coast-muted); font-size: 14px; }
.preview-message button { padding: 8px 16px; border: 1px solid var(--coast-line); border-radius: 20px; cursor: pointer; color: var(--coast-accent); }
</style>
