<script setup lang="ts">
import { useData } from 'vitepress'
import { onMounted, ref, watch, watchPostEffect } from 'vue'

// VitePress persists this ref and applies the root .dark class on every route.
const { isDark } = useData()
// Keep server and hydration markup identical; update labels after hydration.
const isNight = ref(false)
watchPostEffect(() => { isNight.value = isDark.value })
onMounted(() => {
  watch(isDark, (night) => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    if (meta) meta.content = night ? '#172d32' : '#f1f3eb'
  }, { immediate: true })
})
</script>

<template>
  <button
    class="coastal-theme-toggle"
    type="button"
    role="switch"
    :aria-checked="isNight"
    :aria-label="isNight ? '切换到白天模式' : '切换到夜间模式'"
    :title="isNight ? '切换到白天模式' : '切换到夜间模式'"
    @click="isDark = !isDark"
  >
    <span class="vpi-sun mode-day-icon" aria-hidden="true"></span>
    <span class="vpi-moon mode-night-icon" aria-hidden="true"></span>
    <span class="mode-name">{{ isNight ? '夜晚' : '白天' }}</span>
  </button>
</template>

<style scoped>
.coastal-theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  gap: 7px;
  min-height: 36px;
  margin-left: 18px;
  padding: 8px 13px;
  border: 1px solid var(--coast-line);
  border-radius: 99px;
  background: var(--coast-card);
  color: var(--coast-ink);
  font-size: 12px;
  line-height: 18px;
  cursor: pointer;
  transition: border-color .2s, background-color .2s;
}
.coastal-theme-toggle:hover { border-color: var(--coast-accent); background: var(--coast-wash); }
.coastal-theme-toggle:focus-visible { outline: 3px solid var(--coast-focus); outline-offset: 4px; }
[class^='vpi-'] { font-size: 16px; }
@media (max-width: 767px) { .coastal-theme-toggle { margin-left: 0; padding: 8px 10px; gap: 5px; } }
@media (max-width: 420px) { .mode-name { display: none; } .coastal-theme-toggle { width: 36px; padding: 8px; } }
</style>

<style>
.coastal-theme-toggle .mode-night-icon { display: none; }
html.dark .coastal-theme-toggle .mode-day-icon { display: none; }
html.dark .coastal-theme-toggle .mode-night-icon { display: block; }
</style>
