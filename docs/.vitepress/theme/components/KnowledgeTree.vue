<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'
import KnowledgeTreeNode from './KnowledgeTreeNode.vue'
import { directoryAncestors, directoryPath, directoryTree, filterDirectory, restoreDirectory } from '../directory.mjs'

// Replace only the default sidebar's contents; retain its drawer and Escape handling.
defineProps<{ items: unknown[] }>()
const { theme, site } = useData()
const route = useRoute()
const tree = computed(() => directoryTree(theme.value.sidebar || []))
const current = computed(() => directoryPath(route.path, site.value.base))
const ancestors = computed(() => directoryAncestors(tree.value, current.value) || [])
const expanded = ref<Record<string, boolean>>(restoreDirectory(tree.value, current.value))
const query = ref('')
const filtering = computed(() => !!query.value.trim())
const results = computed(() => filterDirectory(tree.value, query.value))
const root = ref<HTMLElement>()
const input = ref<HTMLInputElement>()
const storageKey = `knowledge-directory:v1:${site.value.base}`
let sidebar: HTMLElement | null = null
let unfilteredScroll = 0
let ready = false
let focusArticle = false
let timer: ReturnType<typeof setTimeout> | undefined

function save() {
  if (!ready || !sidebar) return
  try {
    sessionStorage.setItem(storageKey, JSON.stringify({ expanded: expanded.value, scroll: filtering.value ? unfilteredScroll : sidebar.scrollTop }))
  } catch { /* Reading remains available when browser storage is disabled. */ }
}
function saveScroll() {
  clearTimeout(timer)
  timer = setTimeout(save, 120)
}
function toggle(key: string) {
  expanded.value[key] = !expanded.value[key]
  save()
}
function revealCurrent() {
  const active = root.value?.querySelector<HTMLElement>('[aria-current="page"]')
  if (!sidebar || !active || !active.getClientRects().length) return
  const bounds = sidebar.getBoundingClientRect()
  const row = active.getBoundingClientRect()
  const filterBottom = root.value?.querySelector('.directory-filter')?.getBoundingClientRect().bottom || 0
  const top = Math.max(bounds.top + (window.matchMedia('(min-width: 960px)').matches ? 76 : 16), filterBottom + 8)
  if (row.top < top) sidebar.scrollTop += row.top - top
  else if (row.bottom > bounds.bottom - 20) sidebar.scrollTop += row.bottom - bounds.bottom + 20
}
watch(filtering, async (value, previous) => {
  if (!sidebar) return
  if (value && !previous) {
    unfilteredScroll = sidebar.scrollTop
    sidebar.scrollTop = 0
  } else if (!value && previous) {
    await nextTick()
    sidebar.scrollTop = unfilteredScroll
  }
})
watch(() => route.path, async () => {
  const scroll = filtering.value ? unfilteredScroll : sidebar?.scrollTop || 0
  expanded.value = restoreDirectory(tree.value, current.value, expanded.value)
  query.value = ''
  await nextTick()
  if (sidebar) sidebar.scrollTop = scroll
  revealCurrent()
  if (focusArticle) {
    const heading = document.querySelector<HTMLElement>('main h1')
    if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }) }
    focusArticle = false
  }
  save()
})
function selectArticle(event: MouseEvent) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  const link = (event.target as Element).closest<HTMLAnchorElement>('a')
  focusArticle = !!link && directoryPath(link.pathname, site.value.base) !== current.value
}
function clearFilter() {
  query.value = ''
  input.value?.focus({ preventScroll: true })
}
onMounted(async () => {
  sidebar = root.value?.closest<HTMLElement>('.VPSidebar') || null
  let scroll = 0
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey) || 'null')
    expanded.value = restoreDirectory(tree.value, current.value, saved?.expanded)
    scroll = Number.isFinite(saved?.scroll) ? Math.max(0, saved.scroll) : 0
  } catch { /* A stale storage entry must not prevent navigation. */ }
  await nextTick()
  if (sidebar) sidebar.scrollTop = scroll
  revealCurrent()
  ready = true
  sidebar?.addEventListener('scroll', saveScroll, { passive: true })
  window.addEventListener('pagehide', save)
})
onBeforeUnmount(() => {
  save()
  clearTimeout(timer)
  sidebar?.removeEventListener('scroll', saveScroll)
  window.removeEventListener('pagehide', save)
})
</script>

<template>
  <div ref="root" class="knowledge-directory" @click="selectArticle">
    <div class="directory-filter">
      <label class="visually-hidden" for="knowledge-title-filter">筛选文章标题</label>
      <span class="vpi-search" aria-hidden="true" />
      <input id="knowledge-title-filter" ref="input" v-model="query" type="search" placeholder="筛选文章标题" autocomplete="off" aria-controls="knowledge-directory-content" />
      <button v-if="query" type="button" aria-label="清除标题筛选" @click="clearFilter"><span class="vpi-close" aria-hidden="true" /></button>
    </div>
    <div id="knowledge-directory-content">
      <template v-if="filtering">
        <p class="directory-result-count" role="status">{{ results.length ? `${results.length} 个匹配条目` : '未找到匹配文章' }}</p>
        <ul class="directory-results">
          <li v-for="node in results" :key="node.key">
            <a class="directory-row directory-result" :href="withBase(node.link)" :aria-current="directoryPath(node.link) === current ? 'page' : undefined">
              <span>{{ node.text }}</span><small>{{ node.path }}</small>
            </a>
          </li>
        </ul>
      </template>
      <KnowledgeTreeNode v-else :nodes="tree" :expanded="expanded" :current="current" :ancestors="ancestors" @toggle="toggle" />
    </div>
  </div>
</template>

<style>
.knowledge-directory { padding: 16px 0 24px; }
.directory-filter { position: sticky; top: 12px; z-index: 2; display: flex; align-items: center; gap: 7px; min-height: 38px; margin-bottom: 18px; padding: 0 10px; border: 1px solid var(--coast-line); border-radius: 8px; background: var(--coast-card); box-shadow: 0 -8px 0 4px var(--vp-sidebar-bg-color); }
.directory-filter > span { flex: 0 0 14px; color: var(--coast-muted); }
.directory-filter input { width: 100%; min-width: 0; padding: 8px 0; font: inherit; font-size: 12px; background: transparent; }
.directory-filter input::-webkit-search-cancel-button { display: none; }
.directory-filter button { display: grid; flex: 0 0 28px; place-items: center; height: 32px; color: var(--coast-muted); }
.directory-filter:focus-within { outline: 2px solid var(--coast-focus); outline-offset: 2px; }
.directory-filter input:focus { outline: none; }
.knowledge-tree, .directory-results { list-style: none; margin: 0; padding: 0; }
.knowledge-tree.nested { margin: 2px 0 8px 8px; padding-left: 10px; border-left: 1px solid var(--coast-line); }
.knowledge-tree > .root-node { margin-bottom: 6px; }
.knowledge-tree > .root-node + .root-node:has(> .directory-folder) { margin-top: 10px; }
.directory-row { position: relative; display: flex; align-items: center; width: 100%; gap: 7px; min-height: 38px; padding: 7px 8px; border-radius: 6px; text-align: left; font-size: 13px; line-height: 1.65; color: var(--coast-muted); overflow-wrap: anywhere; }
.directory-row:hover { color: var(--coast-ink); background: var(--coast-wash); }
.directory-folder { font-weight: 550; }
.root-node > .directory-folder { font-size: 14px; font-weight: 650; color: var(--coast-ink); }
.directory-folder > .vpi-chevron-right { flex: 0 0 12px; font-size: 12px; transition: transform .15s; }
.directory-folder > .expanded { transform: rotate(90deg); }
.in-path > .directory-folder { color: var(--coast-ink); }
.directory-row[aria-current="page"] { color: var(--coast-accent); background: var(--coast-wash); font-weight: 650; }
.directory-row[aria-current="page"]::before { content: ''; position: absolute; left: -4px; top: 9px; bottom: 9px; width: 2px; border-radius: 2px; background: var(--coast-accent); }
.directory-row:focus-visible, .directory-filter button:focus-visible { outline: 2px solid var(--coast-focus); outline-offset: 2px; }
.directory-result { display: block; margin-bottom: 7px; }
.directory-result small { display: block; margin-top: 4px; color: var(--coast-muted); font-size: 11px; font-weight: 400; }
.directory-result-count { padding: 0 8px 10px; color: var(--coast-muted); font-size: 12px; }
@media (max-width: 959px) {
  .directory-row { min-height: 44px; padding-top: 10px; padding-bottom: 10px; }
  .directory-filter { top: 8px; min-height: 44px; }
  .directory-filter input { font-size: 16px; }
  .directory-filter button { flex-basis: 36px; height: 44px; }
}
</style>
