<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
import { useData, useRouter, withBase } from 'vitepress'
import localSearchIndex from '@localSearchIndex'
import MiniSearch from 'minisearch'
import { data as catalog } from '../knowledge.data'
import { groupSearchResults } from '../search.mjs'
import SearchHighlight from './SearchHighlight.vue'

const emit = defineEmits<{ (e: 'close'): void }>()
const { localeIndex, site } = useData()
const router = useRouter()
const dialog = ref<HTMLDialogElement>()
const input = ref<HTMLInputElement>()
const query = ref('')
const filter = ref('')
const index = shallowRef<MiniSearch>()
const loading = ref(true)
const failed = ref(false)
const filters = [{ label: '全部', value: '' }, { label: '云计算', value: '/cloud/' }, { label: '人工智能', value: '/ai/' }, { label: '编年史', value: '/chronicle/' }]
const grouped = computed(() => groupSearchResults(query.value, index.value?.search(query.value, { fuzzy: .15, prefix: true, combineWith: 'AND', boost: { title: 6, titles: 2, text: 1 } }) || [], catalog, site.value.base))
const results = computed(() => grouped.value.filter(result => !filter.value || result.url.startsWith(filter.value)))
let trigger: HTMLElement | null = null
let oldOverflow = ''
let disposed = false

async function load() {
  loading.value = true; failed.value = false
  try {
    const source = (await localSearchIndex[localeIndex.value]?.())?.default
    if (!source) throw new Error('Missing index')
    if (!disposed) index.value = MiniSearch.loadJSON(source, { fields: ['title', 'titles', 'text'], storeFields: ['title', 'titles'] })
  } catch { if (!disposed) failed.value = true }
  finally { if (!disposed) loading.value = false }
}
function close() { dialog.value?.close(); emit('close') }
function select(event: MouseEvent, url: string) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button) return
  event.preventDefault(); close(); router.go(withBase(url))
}
function keyboard(event: KeyboardEvent) {
  if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); return }
  const links = Array.from(dialog.value?.querySelectorAll<HTMLAnchorElement>('[data-search-result]') || [])
  if (event.target === input.value && event.key === 'Enter' && results.value.length) {
    event.preventDefault(); close(); router.go(withBase(results.value[0].url)); return
  }
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
  const position = links.indexOf(event.target as HTMLAnchorElement)
  if (event.target !== input.value && position < 0) return
  event.preventDefault()
  if (event.key === 'ArrowUp' && position <= 0) input.value?.focus()
  else links[Math.min(links.length - 1, position + (event.key === 'ArrowDown' ? 1 : -1))]?.focus()
}
onMounted(async () => {
  trigger = document.activeElement as HTMLElement
  oldOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'
  dialog.value?.showModal()
  await nextTick(); input.value?.focus()
  load()
})
onBeforeUnmount(() => {
  disposed = true
  document.body.style.overflow = oldOverflow
  trigger?.focus({ preventScroll: true })
})
</script>

<template>
  <Teleport to="body">
    <dialog ref="dialog" class="knowledge-search" aria-labelledby="knowledge-search-title" @cancel.prevent="close" @click="($event.target === dialog) && close()" @keydown="keyboard">
      <div class="search-shell">
        <header><h2 id="knowledge-search-title">搜索知识</h2><button class="close-search" aria-label="关闭搜索" @click="close">关闭 <kbd>Esc</kbd></button></header>
        <form role="search" @submit.prevent>
          <span class="vpi-search" aria-hidden="true"></span>
          <input ref="input" v-model="query" type="search" aria-label="搜索知识库" placeholder="搜索主题、问题或技术名…" autocomplete="off" spellcheck="false" />
        </form>
        <div class="search-filters" role="group" aria-label="搜索范围"><button v-for="option in filters" :key="option.value" :aria-pressed="filter === option.value" @click="filter = option.value">{{ option.label }}</button></div>
        <div class="search-results">
          <p v-if="loading" class="search-status" role="status">正在载入全文索引…</p>
          <p v-else-if="failed" class="search-status" role="alert">全文索引暂时无法加载，当前可搜索标题与导读。<button class="retry" @click="load">重试</button></p>
          <p v-if="!query.trim()" class="search-empty">从一个关键词开始：RAG、推理、数据库、成本。</p>
          <template v-else>
            <p class="search-status" role="status">{{ results.length ? `找到 ${results.length} 篇文章` : loading ? '正在查找…' : '没有找到相关内容，试试其他关键词或切换范围。' }}</p>
            <ol class="result-list">
              <li v-for="result in results" :key="result.url">
                <a class="result-title" data-search-result :href="withBase(result.url)" @click="select($event,result.url)"><span class="result-area">{{ result.url.startsWith('/cloud/') ? '云计算' : result.url.startsWith('/ai/') ? '人工智能' : result.url.startsWith('/chronicle/') ? '技术编年史' : '关于' }}</span><strong><SearchHighlight :text="result.title" :query="query" /></strong></a>
                <p v-if="result.summary" class="result-summary"><SearchHighlight :text="result.summary" :query="query" /></p>
                <div v-if="result.sections.length" class="result-sections"><a v-for="section in result.sections" :key="section.hash" :href="withBase(`${result.url}#${section.hash}`)" @click="select($event,`${result.url}#${section.hash}`)"><span aria-hidden="true">↳ </span><SearchHighlight :text="section.title" :query="query" /></a></div>
              </li>
            </ol>
          </template>
        </div>
        <footer><span>标题优先 · 同篇章节合并</span><span>↑ ↓ 选择 · Enter 打开 · Tab 切换</span></footer>
      </div>
    </dialog>
  </Teleport>
</template>

<style scoped>
.knowledge-search { position: fixed; inset: 0; width: min(720px,calc(100vw - 40px)); max-width: none; max-height: calc(100dvh - 72px); padding: 0; margin: 36px auto auto; color: var(--coast-ink); background: var(--coast-card); border: 1px solid var(--coast-line); border-radius: 22px; box-shadow: var(--coast-shadow); }
.knowledge-search::backdrop { background: #10292da8; backdrop-filter: blur(5px); }
.search-shell { padding: 20px 24px 14px; display: flex; flex-direction: column; max-height: calc(100dvh - 74px); }
header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }h2 { font-size: 18px; font-weight: 600; }
.close-search { display: flex; align-items: center; gap: 8px; min-height: 44px; color: var(--coast-muted); font-size: 12px; }kbd { padding: 0 5px; border: 1px solid var(--coast-line); border-radius: 4px; font: inherit; }
form { display: flex; align-items: center; gap: 12px; padding: 0 15px; background: var(--coast-page); border: 1px solid var(--coast-line); border-radius: 12px; min-height: 50px; flex-shrink: 0; }form:focus-within { outline: 2px solid var(--coast-accent); outline-offset: 1px; }
input { flex: 1; width: 0; min-width: 0; font-size: 16px; line-height: 1.5; min-height: 48px; background: transparent; outline: none; }input::placeholder { color: var(--coast-muted); }
.search-filters { display: flex; gap: 8px; margin: 14px 0 5px; flex-shrink: 0; }.search-filters button { min-height: 38px; padding: 6px 14px; border: 1px solid var(--coast-line); border-radius: 99px; font-size: 12px; color: var(--coast-muted); }.search-filters button[aria-pressed=true] { background: var(--coast-button); color: #fffdf5; border-color: transparent; }
.search-results { overflow-y: auto; overscroll-behavior: contain; min-height: 80px; }
.search-status,.search-empty { font-size: 12px; color: var(--coast-muted); margin: 12px 0; }.search-empty { padding: 20px 0 40px; }.retry { color: var(--coast-accent); margin-left: 12px; text-decoration: underline; }
.result-list { list-style: none; padding: 0; margin: 0; }.result-list li { padding: 16px 2px; border-top: 1px solid var(--coast-line); }
.result-title { display: flex; flex-direction: column; align-items: start; gap: 4px; }.result-title:hover strong { color: var(--coast-accent); }.result-title strong { font-size: 16px; font-weight: 550; line-height: 1.6; }.result-area { color: var(--coast-muted); font-size: 10px; letter-spacing: .04em; }
.result-summary { margin: 7px 0 0; font-size: 12px; line-height: 1.8; color: var(--coast-muted); }.result-sections { display: grid; gap: 5px; margin-top: 9px; }.result-sections a { font-size: 12px; line-height: 1.7; color: var(--coast-accent); padding: 4px 0; }
footer { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 6px; border-top: 1px solid var(--coast-line); padding-top: 12px; color: var(--coast-muted); font-size: 10px; flex-shrink: 0; }
button:focus-visible,a:focus-visible { outline: 2px solid var(--coast-focus); outline-offset: 3px; border-radius: 4px; }
@media(max-width:600px) { .knowledge-search { width: calc(100vw - 20px); margin-top: 10px; max-height: calc(100dvh - 20px); border-radius: 17px; }.search-shell { padding: 12px 15px; max-height: calc(100dvh - 22px); }.search-filters { gap: 5px; }.search-filters button { min-height: 44px; padding: 6px 11px; }.result-sections a { min-height: 44px; padding: 10px 0; }footer span:last-child { display: none; } }
</style>
