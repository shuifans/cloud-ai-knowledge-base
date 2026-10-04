<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useSidebar } from 'vitepress/dist/client/theme-default/composables/sidebar.js'
import KnowledgeOutline from './KnowledgeOutline.vue'
import { useReadingLayout } from '../reading-layout'

defineProps<{ open: boolean }>()
const emit = defineEmits<{ (e: 'open-menu'): void }>()
const { hasSidebar } = useSidebar()
const { sidebarCollapsed, outlineOpen, headers } = useReadingLayout()
const desktop = ref(false)
const wide = ref(false)
let desktopQuery: MediaQueryList | undefined
let wideQuery: MediaQueryList | undefined
function updateViewport() {
  desktop.value = !!desktopQuery?.matches
  wide.value = !!wideQuery?.matches
}
const root = ref<HTMLElement>()
const outlineButton = ref<HTMLButtonElement>()
watch(wide, () => { outlineOpen.value = false })

function toggleSidebar() {
  if (desktop.value) sidebarCollapsed.value = !sidebarCollapsed.value
  else emit('open-menu')
}
function closeOutline(event: KeyboardEvent) {
  if (event.key === 'Escape' && outlineOpen.value) {
    outlineOpen.value = false
    outlineButton.value?.focus({ preventScroll: true })
  }
}
function closeOutside(event: PointerEvent) {
  if (!wide.value && outlineOpen.value && !root.value?.contains(event.target as Node)) outlineOpen.value = false
}
async function selectHeading(event: MouseEvent) {
  const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]')
  if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  outlineOpen.value = false
  await nextTick()
  const heading = document.getElementById(decodeURIComponent(link.hash.slice(1)))
  if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }) }
}
onMounted(() => {
  desktopQuery = window.matchMedia('(min-width: 960px)')
  wideQuery = window.matchMedia('(min-width: 1280px)')
  desktopQuery.addEventListener('change', updateViewport)
  wideQuery.addEventListener('change', updateViewport)
  updateViewport()
  document.addEventListener('keydown', closeOutline)
  document.addEventListener('pointerdown', closeOutside)
})
onBeforeUnmount(() => {
  desktopQuery?.removeEventListener('change', updateViewport)
  wideQuery?.removeEventListener('change', updateViewport)
  document.removeEventListener('keydown', closeOutline)
  document.removeEventListener('pointerdown', closeOutside)
})
</script>

<template>
  <div v-if="hasSidebar || headers.length" ref="root" class="reading-controls">
    <div class="reading-controls-row">
      <button v-if="hasSidebar" type="button" class="reading-sidebar-toggle"
        :aria-label="desktop ? (sidebarCollapsed ? '展开知识目录' : '收起知识目录') : '知识目录'"
        :aria-expanded="desktop ? !sidebarCollapsed : open" aria-controls="VPSidebarNav" @click="toggleSidebar">
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <rect x="2" y="3" width="16" height="14" rx="2" /><path d="M7 3v14" />
          <path :d="desktop && !sidebarCollapsed ? 'm13 7-3 3 3 3' : 'm11 7 3 3-3 3'" />
        </svg>
        <span>{{ desktop ? (sidebarCollapsed ? '展开知识目录' : '收起知识目录') : '知识目录' }}</span>
      </button>
      <button v-if="headers.length" ref="outlineButton" type="button" class="reading-outline-toggle"
        :aria-label="outlineOpen ? '关闭本页目录' : '打开本页目录'" :aria-expanded="outlineOpen"
        :aria-controls="wide ? 'article-outline-panel' : 'article-outline-popover'" @click="outlineOpen = !outlineOpen">
        <span>本页目录</span><span class="vpi-chevron-right" :class="{ expanded: outlineOpen }" aria-hidden="true" />
      </button>
    </div>
    <nav v-if="!wide && outlineOpen && headers.length" id="article-outline-popover" class="reading-outline-popover" aria-label="本页目录" @click="selectHeading">
      <KnowledgeOutline :headers="headers" :root="true" />
    </nav>
  </div>
</template>

<style>
.reading-controls { position: sticky; top: 0; z-index: var(--vp-z-index-local-nav); background: var(--coast-page); }
.reading-controls-row { display: flex; justify-content: space-between; align-items: center; min-height: 44px; padding: 0 12px; }
.reading-controls button { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 44px; padding: 0 8px; color: var(--coast-muted); font-size: 13px; }
.reading-controls button:hover { color: var(--coast-accent); }
.reading-controls button:focus-visible { outline: 2px solid var(--coast-focus); outline-offset: -3px; border-radius: 6px; }
.reading-controls svg { width: 18px; height: 18px; }
.reading-outline-toggle { margin-left: auto; }
.reading-outline-toggle .expanded { transform: rotate(90deg); }
.reading-outline-popover { position: absolute; top: 100%; right: 12px; left: 12px; max-height: min(65dvh, 520px); overflow-y: auto; padding: 12px 16px; border: 1px solid var(--coast-line); border-radius: 10px; background: var(--coast-card); box-shadow: 0 12px 32px #172d3220; }
@media (min-width: 960px) {
  .reading-controls { position: fixed; top: var(--vp-nav-height); left: var(--knowledge-content-offset); right: max(0px, calc((100vw - var(--vp-layout-max-width)) / 2)); }
  .reading-controls-row { padding: 0 24px; }
  .reading-outline-popover { left: auto; width: 320px; }
}
</style>
