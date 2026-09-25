<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute, onContentUpdated } from 'vitepress'
import { shortHeading } from '../knowledge.mjs'

type Header = { title: string; link: string; children?: Header[] }
const props = defineProps<{ headers: Header[]; root?: boolean }>()
const route = useRoute()
const current = ref('')
const expanded = ref<Record<string, boolean>>({})
let frame = 0
const isCurrent = (header: Header) => header.link === current.value || header.children?.some(child => child.link === current.value)
const isOpen = (header: Header) => expanded.value[header.link] ?? !!isCurrent(header)
function update() {
  const headings = Array.from(document.querySelectorAll<HTMLElement>('.vp-doc h2[id], .vp-doc h3[id]'))
  const active = headings.filter(el => el.getBoundingClientRect().top <= 150).at(-1)
  current.value = active ? `#${active.id}` : ''
}
function schedule() { cancelAnimationFrame(frame); frame = requestAnimationFrame(update) }
function focusHeading(link: string) { document.getElementById(decodeURIComponent(link.slice(1)))?.focus({ preventScroll: true }) }
watch(() => route.path, () => { expanded.value = {}; current.value = ''; schedule() })
onContentUpdated(schedule)
onMounted(() => { window.addEventListener('scroll', schedule, { passive: true }); schedule() })
onBeforeUnmount(() => { window.removeEventListener('scroll', schedule); cancelAnimationFrame(frame) })
</script>

<template>
  <ul class="knowledge-outline" :class="{ root }">
    <li v-for="header in props.headers" :key="header.link" :class="{ 'current-group': isCurrent(header) }">
      <div class="outline-row">
        <a class="outline-link" :href="header.link" :title="header.title" :aria-label="header.title" :aria-current="header.link === current ? 'location' : undefined" @click="focusHeading(header.link)">{{ shortHeading(header.title) }}</a>
        <button v-if="header.children?.length" type="button" :aria-label="`${isOpen(header) ? '收起' : '展开'}${shortHeading(header.title)}的小节`" :aria-expanded="isOpen(header)" @click="expanded[header.link] = !isOpen(header)"><span class="vpi-chevron-right" :class="{ open: isOpen(header) }" aria-hidden="true"></span></button>
      </div>
      <ul v-if="header.children?.length" v-show="isOpen(header)" class="outline-children">
        <li v-for="child in header.children" :key="child.link"><a class="outline-link" :href="child.link" :title="child.title" :aria-label="child.title" :aria-current="child.link === current ? 'location' : undefined" @click="focusHeading(child.link)">{{ shortHeading(child.title) }}</a></li>
      </ul>
    </li>
  </ul>
</template>

<style scoped>
.knowledge-outline,.outline-children { list-style: none; margin: 0; padding: 0; }
.knowledge-outline:not(.root) { padding: 0 16px; }
.outline-row { display: flex; align-items: start; }
.outline-link { display: block; flex: 1; min-width: 0; padding: 7px 0; font-size: 12px; line-height: 1.65; color: var(--coast-muted); overflow-wrap: anywhere; }
.outline-link:hover,.outline-link[aria-current],.current-group > .outline-row > a { color: var(--coast-accent); }
.outline-link[aria-current] { font-weight: 650; }
.outline-row button { flex: 0 0 30px; height: 34px; display: grid; place-items: center; border-radius: 6px; color: var(--coast-muted); }
.outline-row button:hover { background: var(--coast-wash); }
.vpi-chevron-right { transition: transform .2s; font-size: 12px; }.vpi-chevron-right.open { transform: rotate(90deg); }
.outline-children { margin: 0 0 7px 3px; padding-left: 13px; border-left: 1px solid var(--coast-line); }
.outline-children a { font-size: 11px; padding: 5px 0; }
a:focus-visible,button:focus-visible { outline: 2px solid var(--coast-focus); outline-offset: 2px; }
@media(max-width:1279px) { .outline-link { font-size: 13px; padding: 12px 0; }.outline-row button { flex-basis: 44px; height: 44px; }.outline-children a { font-size: 12px; padding: 12px 0; } }
</style>
