<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { withBase } from 'vitepress'
import catalog from '../pelican-catalog.json'
import { EFFORT_ORDER, filterResults, readFilters, writeFilters } from '../pelican.mjs'
import PelicanPreview from './PelicanPreview.vue'

type Result = (typeof catalog.results)[number]
const models = ref<string[]>([])
const efforts = ref<string[]>([])
const sort = ref('model')
const modelSearch = ref('')
const visibleIds = ref(new Set<string>())
const pageVisible = ref(false)
const detail = ref<Result | null>(null)
const fitWindow = ref(true)
const announcement = ref('')
const copyLabel = ref('复制提示词')
const downloadBusy = ref(false)
const grid = ref<HTMLElement>()
const modelMenu = ref<HTMLDetailsElement>()
const dialog = ref<HTMLDialogElement>()
let visibility: IntersectionObserver | undefined
let returnFocus: HTMLElement | null = null
let previousOverflow: string | null = null
let noticeTimer: ReturnType<typeof setTimeout> | undefined
let downloadRequest: AbortController | undefined

const allModels = [...new Set(catalog.results.map(result => result.modelId))].sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))
const availableEfforts = EFFORT_ORDER.filter(effort => catalog.results.some(result => result.reasoningEffort === effort))
const shown = computed<Result[]>(() => filterResults(catalog.results, { models: models.value, efforts: efforts.value, sort: sort.value }))
const modelOptions = computed(() => allModels.filter(model => model.toLowerCase().includes(modelSearch.value.trim().toLowerCase())))
const hasFilters = computed(() => models.value.length > 0 || efforts.value.length > 0)
const modelLabel = computed(() => models.value.length === 1 ? models.value[0] : models.value.length ? `已选 ${models.value.length} 个模型` : '全部模型')
const detailIndex = computed(() => detail.value ? shown.value.findIndex(result => result.id === detail.value!.id) : -1)
const lastImported = catalog.results.map(result => result.importedAt.slice(0, 10)).sort().at(-1)
const batchLabel = (id: string) => catalog.batches.find(batch => batch.id === id)?.label || id
const modelCount = (id: string) => filterResults(catalog.results, { models: [id], efforts: efforts.value }).length
const effortCount = (effort: string) => filterResults(catalog.results, { models: models.value, efforts: [effort] }).length
const toggle = (values: string[], value: string) => values.includes(value) ? values.filter(item => item !== value) : [...values, value]

function isCardPlaying(id: string) { return pageVisible.value && !detail.value && visibleIds.value.has(id) }
function applyFilters(next: { models?: string[]; efforts?: string[]; sort?: string }) {
  if (next.models) models.value = next.models
  if (next.efforts) efforts.value = next.efforts
  if (next.sort) sort.value = next.sort
  const url = writeFilters(window.location.href, { models: models.value, efforts: efforts.value, sort: sort.value })
  if (url !== location.pathname + location.search + location.hash) history.pushState(history.state, '', url)
  nextTick(observeCards)
}
function restoreFilters() {
  dialog.value?.close()
  const state = readFilters(window.location.search, catalog.results)
  models.value = state.models
  efforts.value = state.efforts
  sort.value = state.sort
  nextTick(observeCards)
}
function clearFilters() { applyFilters({ models: [], efforts: [], sort: 'model' }); modelSearch.value = '' }
function observeCards() {
  visibility?.disconnect()
  visibleIds.value = new Set()
  grid.value?.querySelectorAll('[data-result-id]').forEach(card => visibility?.observe(card))
}
function dismissMenu(event: Event) {
  if (event.type === 'keydown' && (event as KeyboardEvent).key !== 'Escape') return
  if (event.type === 'pointerdown' && modelMenu.value?.contains(event.target as Node)) return
  if (modelMenu.value?.open) {
    modelMenu.value.open = false
    if (event.type === 'keydown') modelMenu.value.querySelector('summary')?.focus()
  }
}
function onVisibility() { pageVisible.value = !document.hidden }
async function openDetail(result: Result, event?: Event) {
  detail.value = result
  fitWindow.value = true
  if (!dialog.value?.open) {
    returnFocus = event?.currentTarget instanceof HTMLElement ? event.currentTarget : document.activeElement as HTMLElement
    await nextTick()
    if (previousOverflow === null) previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.value?.showModal()
    if (dialog.value) dialog.value.scrollTop = 0
  }
}
function closeDetail() { dialog.value?.close() }
function onClose() {
  detail.value = null
  downloadRequest?.abort()
  if (previousOverflow !== null) document.body.style.overflow = previousOverflow
  previousOverflow = null
  nextTick(() => { if (returnFocus?.isConnected) returnFocus.focus() })
}
function stepDetail(step: number) {
  const next = shown.value[detailIndex.value + step]
  if (next) detail.value = next
}
function sameModel() {
  if (!detail.value) return
  const model = detail.value.modelId
  closeDetail()
  applyFilters({ models: [model], efforts: [] })
}
async function copyPrompt() {
  try {
    await navigator.clipboard.writeText(catalog.prompt)
    copyLabel.value = '已复制'
    announce('提示词已复制')
  } catch { announce('复制未成功，请选中提示词手动复制') }
}
function announce(message: string) {
  announcement.value = message
  clearTimeout(noticeTimer)
  noticeTimer = setTimeout(() => { announcement.value = ''; copyLabel.value = '复制提示词' }, 4000)
}
async function downloadOriginal() {
  const result = detail.value
  if (!result || downloadBusy.value) return
  downloadBusy.value = true
  downloadRequest = new AbortController()
  try {
    const response = await fetch(withBase(result.artifactPath), { signal: downloadRequest.signal, credentials: 'omit' })
    if (!response.ok) throw new Error('download')
    const url = URL.createObjectURL(new Blob([await response.arrayBuffer()], { type: 'text/html;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = result.sourceFilename
    link.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  } catch (error) {
    if ((error as Error).name !== 'AbortError') announce('下载失败，请稍后重试')
  } finally { downloadBusy.value = false }
}

onMounted(() => {
  onVisibility()
  visibility = new IntersectionObserver(entries => {
    const next = new Set(visibleIds.value)
    for (const entry of entries) {
      const id = (entry.target as HTMLElement).dataset.resultId!
      if (entry.isIntersecting) next.add(id)
      else next.delete(id)
    }
    visibleIds.value = next
  }, { threshold: 0 })
  restoreFilters()
  document.addEventListener('visibilitychange', onVisibility)
  document.addEventListener('pointerdown', dismissMenu)
  document.addEventListener('keydown', dismissMenu)
  window.addEventListener('popstate', restoreFilters)
})
onBeforeUnmount(() => {
  visibility?.disconnect()
  clearTimeout(noticeTimer)
  downloadRequest?.abort()
  if (previousOverflow !== null) document.body.style.overflow = previousOverflow
  document.removeEventListener('visibilitychange', onVisibility)
  document.removeEventListener('pointerdown', dismissMenu)
  document.removeEventListener('keydown', dismissMenu)
  window.removeEventListener('popstate', restoreFilters)
})
</script>

<template>
  <main class="pelican-gallery" aria-labelledby="pelican-title">
    <header class="gallery-heading">
      <p class="eyebrow">PELICAN LAB</p>
      <h1 id="pelican-title">同一道题，骑出不同的风景。</h1>
      <div class="heading-foot"><p>鹈鹕骑车 <span>·</span> {{ catalog.results.length }} 个作品 <span>·</span> {{ allModels.length }} 个模型 <span>·</span> {{ availableEfforts.length }} 档 effort</p><span class="collection-note">保持好奇，持续收录。</span></div>
    </header>

    <section class="prompt-bar" aria-label="测试提示词">
      <span class="field-label">提示词</span>
      <p>{{ catalog.prompt }}</p>
      <button class="quiet-button copy-button" type="button" @click="copyPrompt"><span class="copy-icon" aria-hidden="true"></span>{{ copyLabel }}</button>
    </section>

    <section class="filter-bar" aria-label="筛选作品">
      <div class="model-control">
        <span class="field-label">模型</span>
        <details ref="modelMenu" class="model-menu">
          <summary aria-label="筛选模型"><span>{{ modelLabel }}</span><span class="vpi-chevron-down" aria-hidden="true"></span></summary>
          <div class="model-options">
            <label class="model-search"><span class="vpi-search" aria-hidden="true"></span><input v-model="modelSearch" type="search" placeholder="搜索模型名称" aria-label="搜索模型名称" /></label>
            <button type="button" class="all-models" @click="applyFilters({ models: [] })">全部模型<span>{{ catalog.results.length }}</span></button>
            <div class="model-list">
              <label v-for="model in modelOptions" :key="model"><input type="checkbox" :checked="models.includes(model)" @change="applyFilters({ models: toggle(models, model) })" /><span>{{ model }}</span><small>{{ modelCount(model) }}</small></label>
              <p v-if="!modelOptions.length" class="no-models">没有找到这个模型</p>
            </div>
            <button type="button" class="finish-selection" @click="modelMenu!.open = false">完成筛选</button>
          </div>
        </details>
      </div>
      <fieldset class="effort-control"><legend>Reasoning effort</legend><div class="effort-options">
        <button type="button" :aria-pressed="!efforts.length" @click="applyFilters({ efforts: [] })">全部</button>
        <button v-for="effort in availableEfforts" :key="effort" type="button" :aria-pressed="efforts.includes(effort)" :title="`${effort} · ${effortCount(effort)} 个作品`" @click="applyFilters({ efforts: toggle(efforts, effort) })">{{ effort }}<small>{{ effortCount(effort) }}</small></button>
      </div></fieldset>
      <label class="sort-control"><span class="sr-only">作品排序</span><select :value="sort" aria-label="作品排序" @change="applyFilters({ sort: ($event.target as HTMLSelectElement).value })"><option value="model">模型分组</option><option value="recent">最近收录</option></select></label>
    </section>

    <div class="results-bar"><p role="status" aria-live="polite">显示 <strong>{{ shown.length }}</strong> / {{ catalog.results.length }} 个作品 <button v-if="hasFilters || sort !== 'model'" type="button" @click="clearFilters">清空筛选</button></p><span>趣味观察，不代表综合能力排名。</span></div>

    <div v-if="shown.length" ref="grid" class="pelican-grid">
      <article v-for="(result, index) in shown" :key="result.id" class="pelican-card" :data-result-id="result.id" :aria-label="`${result.modelLabel} · ${result.reasoningEffort}`">
        <div class="card-preview">
          <PelicanPreview v-if="isCardPlaying(result.id)" class="card-animation" :source="result.artifactPath" :viewport="result.previewViewport" :title="`${result.modelLabel} ${result.reasoningEffort} 的鹈鹕骑车动画`" passive />
          <button class="cover-button" type="button" :aria-label="`放大查看 ${result.modelLabel} ${result.reasoningEffort}`" @click="openDetail(result, $event)"><img v-if="!isCardPlaying(result.id)" :src="withBase(result.thumbnailPath)" :alt="`${result.modelLabel} · ${result.reasoningEffort} 原始作品截图`" width="1280" height="800" :loading="index < 3 ? 'eager' : 'lazy'" decoding="async" /></button>
        </div>
        <div class="card-caption"><div><h2>{{ result.modelLabel }}</h2><span class="effort-tag">{{ result.reasoningEffort }}</span></div><button type="button" :aria-label="`查看 ${result.modelLabel} ${result.reasoningEffort} 的详情`" @click="openDetail(result, $event)">放大查看 <span class="vpi-arrow-right" aria-hidden="true"></span></button></div>
      </article>
    </div>
    <section v-else class="empty-state"><h2>没有符合条件的作品</h2><p>试试其他模型或 effort，新的骑行作品也会持续加入。</p><button class="primary-button" type="button" @click="clearFilters">查看全部作品</button></section>

    <footer class="collection-footer"><p>同一条提示词，各自的想象力。</p><p>模型与 effort 按收录文件标注；同名档位不代表相同计算预算。<br />最近收录 {{ lastImported }} <span>·</span> 动画自动播放，点击作品即可放大查看。</p></footer>
    <p v-if="announcement" class="gallery-notice" role="status">{{ announcement }}</p>

    <dialog ref="dialog" class="pelican-dialog" aria-labelledby="detail-title" @close="onClose" @click="($event.target === dialog) && closeDetail()">
      <div v-if="detail" class="detail-content">
        <header class="detail-heading"><div><p class="eyebrow">PELICAN LAB <span>·</span> {{ detailIndex + 1 }} / {{ shown.length }}</p><h2 id="detail-title">{{ detail.modelLabel }} <span class="effort-tag">{{ detail.reasoningEffort }}</span></h2></div><button class="quiet-button" type="button" autofocus @click="closeDetail">关闭</button></header>
        <div class="detail-stage"><PelicanPreview v-if="pageVisible" :key="detail.id" :source="detail.artifactPath" :viewport="detail.previewViewport" :title="`${detail.modelLabel} ${detail.reasoningEffort} 完整原始作品`" :fit="fitWindow" /></div>
        <div class="detail-toolbar"><div><button class="quiet-button" type="button" :aria-pressed="fitWindow" @click="fitWindow = !fitWindow">{{ fitWindow ? '恢复完整画面' : '适应窗口' }}</button></div><div><button class="quiet-button" type="button" :disabled="detailIndex <= 0" @click="stepDetail(-1)">上一个</button><button class="quiet-button" type="button" :disabled="detailIndex >= shown.length - 1" @click="stepDetail(1)">下一个</button></div></div>
        <div class="detail-info"><p>{{ catalog.prompt }}</p><div><span>{{ batchLabel(detail.batchId) }} <span>·</span> {{ detail.promptVersion }} <span>·</span> 收录于 {{ detail.importedAt.slice(0, 10) }}</span><div class="detail-actions"><button type="button" @click="copyPrompt">{{ copyLabel }}</button><button type="button" @click="sameModel">只看该模型</button><button type="button" :disabled="downloadBusy" @click="downloadOriginal">{{ downloadBusy ? '准备下载…' : '下载原始 HTML' }}</button></div></div></div>
      </div>
    </dialog>
  </main>
</template>

<style scoped>
.pelican-gallery { max-width: 1400px; margin: 0 auto; padding: 32px 32px 60px; color: var(--coast-ink); }
.gallery-heading { padding: 0 10px 28px; }
.eyebrow { margin: 0 0 14px; color: var(--coast-muted); font-size: 11px; letter-spacing: .22em; line-height: 1.5; }
h1 { margin: 0 0 18px; font-size: clamp(30px, 3.8vw, 56px); font-weight: 600; letter-spacing: .025em; line-height: 1.3; }
.heading-foot { display: flex; align-items: center; justify-content: space-between; gap: 20px; color: var(--coast-muted); }
.heading-foot p { margin: 0; font-size: 15px; line-height: 1.8; }
.heading-foot p span { padding: 0 7px; }
.collection-note { font-size: 12px; white-space: nowrap; }
.prompt-bar, .filter-bar { display: flex; align-items: center; gap: 20px; padding: 16px 20px; border: 1px solid var(--coast-line); border-radius: 14px; background: var(--coast-card); }
.prompt-bar { margin-bottom: 14px; }
.field-label { flex: none; font-size: 14px; font-weight: 550; }
.prompt-bar p { margin: 0; flex: 1; font-size: 15px; line-height: 1.8; user-select: text; }
button, summary, select, input { font: inherit; }
button, summary, select { cursor: pointer; }
button { touch-action: manipulation; }
button:disabled { opacity: .45; cursor: default; }
button:focus-visible, summary:focus-visible, select:focus-visible, input:focus-visible { outline: 3px solid var(--coast-focus); outline-offset: 3px; }
.quiet-button, .primary-button { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 9px 15px; min-height: 40px; border-radius: 99px; border: 1px solid var(--coast-line); font-size: 13px; white-space: nowrap; }
.quiet-button { background: var(--coast-card); }
.primary-button { background: var(--coast-button); color: #fffdf5; border-color: var(--coast-button); }
.quiet-button:hover:not(:disabled), .effort-options button:hover { border-color: var(--coast-accent); }
.copy-button { border-radius: 10px; flex: none; }
.copy-icon { display: inline-block; width: 15px; height: 15px; background: currentColor; mask: var(--vp-icon-copy) no-repeat center / contain; }
.filter-bar { flex-wrap: wrap; gap: 16px 22px; position: relative; z-index: 2; }
.model-control { display: flex; align-items: center; gap: 12px; }
.model-menu { position: relative; }
.model-menu summary { display: flex; align-items: center; justify-content: space-between; gap: 20px; width: 190px; min-height: 38px; padding: 8px 12px; border: 1px solid var(--coast-line); border-radius: 10px; font-size: 13px; list-style: none; }
summary::-webkit-details-marker { display: none; }
.model-menu summary > span:first-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.model-options { position: absolute; top: calc(100% + 10px); left: 0; z-index: 5; width: 300px; max-width: calc(100vw - 48px); padding: 12px; border: 1px solid var(--coast-line); border-radius: 14px; background: var(--coast-card); box-shadow: 0 10px 35px #172d3220; }
.model-search { display: flex; align-items: center; gap: 9px; padding: 7px 10px; border: 1px solid var(--coast-line); border-radius: 8px; }
.model-search input { width: 100%; min-width: 0; background: transparent; font-size: 13px; }
.model-list { max-height: 310px; overflow: auto; }
.model-list label { display: flex; align-items: center; gap: 10px; min-height: 39px; font-size: 13px; padding: 8px 6px; cursor: pointer; }
.model-list label:hover, .all-models:hover { background: var(--coast-wash); border-radius: 6px; }
.model-list input { accent-color: var(--coast-accent); width: 15px; height: 15px; }
.model-list small { margin-left: auto; color: var(--coast-muted); }
.all-models { display: flex; justify-content: space-between; width: 100%; font-size: 13px; padding: 10px 6px; margin-top: 6px; color: var(--coast-accent); }
.finish-selection { display: block; width: 100%; padding: 8px; margin-top: 8px; border-top: 1px solid var(--coast-line); font-size: 13px; color: var(--coast-accent); }
.no-models { padding: 15px 6px; font-size: 13px; color: var(--coast-muted); }
.effort-control { display: flex; align-items: center; gap: 14px; padding: 0; margin: 0; border: 0; min-width: 0; }
.effort-control legend { float: left; padding: 0; margin-right: 14px; font-size: 13px; line-height: 38px; }
.effort-options { display: flex; gap: 6px; flex-wrap: wrap; }
.effort-options button { display: inline-flex; align-items: center; gap: 6px; padding: 7px 12px; border: 1px solid var(--coast-line); border-radius: 99px; font-size: 13px; min-height: 36px; }
.effort-options small { color: var(--coast-muted); font-size: 10px; }
.effort-options button[aria-pressed='true'] { color: #fffdf5; background: var(--coast-button); border-color: var(--coast-button); }
.effort-options button[aria-pressed='true'] small { color: #fffdf5; }
.sort-control { margin-left: auto; }
.sort-control select { max-width: 100%; min-height: 38px; padding: 6px 24px 6px 10px; border: 1px solid var(--coast-line); border-radius: 8px; color: var(--coast-ink); background: var(--coast-card); font-size: 13px; }
.results-bar { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 15px 4px; color: var(--coast-muted); font-size: 12px; }
.results-bar p { margin: 0; }
.results-bar strong { color: var(--coast-ink); font-weight: 550; }
.results-bar button { margin-left: 15px; color: var(--coast-accent); text-decoration: underline; text-underline-offset: 4px; }
.pelican-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; }
.pelican-card { min-width: 0; padding: 7px; border-radius: 14px; border: 1px solid var(--coast-line); background: var(--coast-card); transition: border-color .18s; }
.pelican-card:hover { border-color: var(--coast-accent); }
.card-preview { position: relative; overflow: hidden; border-radius: 9px; aspect-ratio: 16 / 10; background: var(--coast-wash); }
.card-animation { position: absolute; inset: 0; }
.card-preview :deep(.preview-message) { z-index: 2; }
.cover-button { position: absolute; inset: 0; z-index: 1; display: block; width: 100%; height: 100%; }
.cover-button:focus-visible { outline-offset: -4px; }
.cover-button img { display: block; width: 100%; height: 100%; object-fit: contain; }
.card-caption { display: flex; justify-content: space-between; align-items: center; gap: 6px; padding: 12px 6px 5px; }
.card-caption > div { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; min-width: 0; }
.card-caption h2 { font-size: 15px; line-height: 1.45; font-weight: 550; margin: 0; overflow-wrap: anywhere; }
.effort-tag { display: inline-block; border-radius: 99px; padding: 2px 10px; border: 1px solid var(--coast-line); background: var(--coast-wash); color: var(--coast-accent); font-size: 11px; font-weight: 400; line-height: 1.6; white-space: nowrap; }
.card-caption > button { display: inline-flex; align-items: center; gap: 7px; flex: none; font-size: 11px; color: var(--coast-muted); min-height: 32px; }
.card-caption > button:hover { color: var(--coast-accent); }
.collection-footer { margin-top: 38px; border-top: 1px solid var(--coast-line); padding-top: 22px; display: flex; justify-content: space-between; gap: 20px; font-size: 12px; color: var(--coast-muted); line-height: 1.9; }
.collection-footer p { margin: 0; }
.collection-footer p:first-child { font-size: 14px; color: var(--coast-ink); }
.collection-footer p:last-child { text-align: right; }
.collection-footer span { padding: 0 6px; }
.empty-state { text-align: center; padding: 70px 20px; border: 1px dashed var(--coast-line); border-radius: 14px; }
.empty-state h2 { font-size: 23px; margin: 0 0 10px; font-weight: 550; }
.empty-state p { color: var(--coast-muted); font-size: 14px; margin: 0 0 24px; }
.gallery-notice { position: fixed; z-index: 99; bottom: 25px; left: 50%; transform: translateX(-50%); margin: 0; padding: 12px 22px; border-radius: 14px; max-width: calc(100% - 30px); background: var(--coast-ink); color: var(--coast-page); font-size: 13px; box-shadow: var(--coast-shadow); }
.pelican-dialog { width: min(1160px, calc(100vw - 48px)); max-width: none; max-height: calc(100dvh - 40px); padding: 0; margin: auto; overflow: auto; color: var(--coast-ink); border: 1px solid var(--coast-line); border-radius: 20px; background: var(--coast-card); }
.pelican-dialog::backdrop { background: #172d32b3; }
.detail-heading { position: sticky; top: 0; z-index: 3; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 16px 22px; background: var(--coast-card); border-bottom: 1px solid var(--coast-line); }
.detail-heading .eyebrow { font-size: 9px; margin-bottom: 4px; }
.detail-heading h2 { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin: 0; font-size: 22px; font-weight: 550; line-height: 1.4; overflow-wrap: anywhere; }
.detail-stage { background: var(--coast-wash); }
.detail-stage :deep(.pelican-preview) { max-height: calc(100dvh - 260px); }
.detail-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px 22px; border-top: 1px solid var(--coast-line); }
.detail-toolbar > div { display: flex; gap: 9px; }
.detail-info { padding: 0 22px 20px; font-size: 12px; line-height: 1.8; color: var(--coast-muted); }
.detail-info > p { margin: 0 0 12px; }
.detail-info > div { display: flex; justify-content: space-between; gap: 10px; flex-wrap: wrap; }
.detail-actions { display: flex; gap: 20px; flex-wrap: wrap; }
.detail-actions button { color: var(--coast-accent); text-decoration: underline; text-underline-offset: 4px; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; }
@media (max-width: 1099px) { .pelican-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }.pelican-gallery { padding: 32px 24px 45px; }.filter-bar { gap: 14px; }.effort-control { flex-wrap: wrap; }.effort-control legend { float: none; line-height: 1.7; margin: 0 0 7px; }.collection-note { display: none; } }
@media (max-width: 699px) {
  .effort-options small { display: none; }
  .pelican-gallery { padding: 26px 18px 36px; }.gallery-heading { padding: 0 2px 22px; }h1 { font-size: 32px; max-width: 12em; line-height: 1.45; margin-bottom: 12px; }.eyebrow { font-size: 10px; margin-bottom: 10px; }.heading-foot p { font-size: 12px; }.heading-foot p span { padding: 0 3px; }
  .prompt-bar { flex-wrap: wrap; gap: 8px 12px; padding: 14px 16px; }.prompt-bar .field-label { order: 0; }.prompt-bar p { order: 2; flex-basis: 100%; font-size: 14px; }.copy-button { order: 1; margin-left: auto; font-size: 12px; min-height: 36px; padding: 6px 11px; }
  .filter-bar { padding: 14px; gap: 15px; }.model-control { flex: 1; min-width: 0; }.model-menu { flex: 1; min-width: 0; }.model-menu summary { width: 100%; gap: 8px; }.model-options { left: -44px; }.effort-control { order: 3; flex-basis: 100%; }.effort-options { gap: 5px; }.effort-options button { padding: 8px 11px; font-size: 12px; min-height: 40px; }.sort-control select { font-size: 12px; padding-right: 6px; }.results-bar { flex-wrap: wrap; gap: 6px; font-size: 11px; padding: 13px 1px; }.results-bar > span { flex-basis: 100%; }
  .pelican-grid { grid-template-columns: 1fr; gap: 16px; }.card-caption { padding: 10px 7px 4px; }.card-caption h2 { font-size: 16px; }.card-caption > button { min-height: 40px; font-size: 12px; }.collection-footer { display: block; margin-top: 28px; }.collection-footer p:last-child { text-align: left; margin-top: 9px; font-size: 11px; }
  .pelican-dialog { width: 100vw; max-height: 100dvh; height: 100dvh; border: 0; border-radius: 0; }.detail-heading { padding: 13px 16px; }.detail-heading h2 { font-size: 18px; gap: 8px; }.detail-toolbar { flex-wrap: wrap; padding: 13px 16px; gap: 10px; }.detail-toolbar > div { flex: 1; justify-content: space-between; }.detail-toolbar .quiet-button, .detail-toolbar .primary-button { padding: 8px 13px; min-height: 44px; }.detail-info { padding: 3px 16px 25px; }.detail-info > div { gap: 14px; }.detail-actions { width: 100%; gap: 16px; }.detail-actions button { min-height: 44px; }
}
@media (prefers-reduced-motion: reduce) { .pelican-card { transition: none; } }
</style>
