<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'
import { overviewChildren, findNode } from '../knowledge.mjs'
import { learningPaths, historyConnections, pageKey } from '../../reading-guides.mjs'

const { page, frontmatter, theme } = useData()
const key = computed(() => pageKey(page.value.relativePath))
const path = computed(() => `/${key.value}`)
const guide = computed(() => frontmatter.value.readingGuide)
const children = computed(() => overviewChildren(theme.value.sidebar || {}, path.value))
const nodes = computed(() => Object.values(theme.value.sidebar || {}).flat())
const titleFor = (route: string) => findNode(nodes.value, `/${route}`)?.text || route
const sequence = computed(() => learningPaths[key.value] || children.value.map(item => item.link.slice(1)).slice(0, 4))
const connections = computed(() => historyConnections[key.value] || [])
const date = computed(() => String(frontmatter.value.lastVerified || '').slice(0, 10))
const reviewed = computed(() => String(frontmatter.value.lastReviewed || '').slice(0, 10))
const scope = computed(() => frontmatter.value.reviewScope || frontmatter.value.verificationScope)
</script>

<template>
  <section v-if="guide" class="page-guide" aria-label="阅读指南">
    <div class="guide-meta"><span>{{ children.length ? '领域导读' : '阅读指南' }}</span><span v-if="reviewed || date">{{ reviewed ? '专项复核' : '内容复核记录' }} <time :datetime="reviewed || date">{{ reviewed || date }}</time></span></div>
    <p v-if="scope" class="guide-review">本次范围：{{ scope }}。<a v-if="key !== 'about' && key !== 'updates'" :href="withBase('/about#updates')">查看核验记录</a></p>
    <p class="guide-summary">{{ guide.summary }}</p>
    <dl class="guide-context"><div><dt>适合谁读</dt><dd>{{ guide.audience }}</dd></div><div><dt>前置知识</dt><dd>{{ guide.prerequisites }}</dd></div></dl>
    <template v-if="children.length">
      <div class="guide-directory" aria-label="本领域知识目录">
        <a v-for="item in children" :key="item.link" :href="withBase(item.link)"><span>{{ item.text.replace(/^导读：/, '') }}</span><span class="vpi-arrow-right" aria-hidden="true"></span></a>
      </div>
      <div v-if="sequence.length" class="guide-sequence"><strong>建议阅读顺序</strong><ol><li v-for="route in sequence" :key="route"><a :href="withBase(`/${route}`)">{{ titleFor(route).replace(/^导读：/, '') }}</a></li></ol></div>
    </template>
    <div v-if="connections.length" class="history-connections"><strong>从这段历史继续理解技术</strong><a v-for="route in connections" :key="route" :href="withBase(`/${route}`)">{{ titleFor(route) }}<span class="vpi-arrow-right" aria-hidden="true"></span></a></div>
  </section>
</template>

<style scoped>
.page-guide { margin: 0 0 26px; padding: 22px; background: var(--coast-wash); border: 1px solid var(--coast-line); border-radius: 18px; }
.guide-meta { display: flex; flex-wrap: wrap; gap: 6px 18px; justify-content: space-between; color: var(--coast-muted); font-size: 12px; }
.vp-doc .guide-review { margin: 10px 0 0; color: var(--coast-muted); font-size: 12px; line-height: 1.7; }
.vp-doc .guide-summary { margin: 12px 0 16px; font-size: 16px; font-weight: 500; line-height: 1.8; color: var(--coast-ink); }
.guide-context { margin: 0; font-size: 12px; line-height: 1.8; display: grid; gap: 7px; }
.guide-context > div { display: grid; grid-template-columns: 64px 1fr; gap: 10px; }
dt { font-weight: 500; color: var(--coast-ink); } dd { margin: 0; color: var(--coast-muted); }
.guide-directory { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 8px; margin-top: 20px; }
.vp-doc .guide-directory a { display: flex; justify-content: space-between; align-items: center; gap: 12px; min-height: 46px; padding: 10px 12px; font-size: 13px; background: var(--coast-card); border: 1px solid var(--coast-line); border-radius: 10px; text-decoration: none; }
.guide-directory .vpi-arrow-right { flex-shrink: 0; }
.guide-directory a:hover { border-color: var(--coast-accent); }
.guide-sequence { border-top: 1px solid var(--coast-line); margin-top: 18px; padding-top: 14px; font-size: 12px; }
.guide-sequence strong,.history-connections strong { display: block; font-size: 12px; margin-bottom: 6px; }
.guide-sequence ol { margin: 0; padding-left: 20px; display: flex; flex-wrap: wrap; gap: 3px 26px; }
.vp-doc .guide-sequence li { margin: 0; line-height: 1.9; }
.history-connections { margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--coast-line); }
.history-connections a { display: inline-flex; align-items: center; gap: 7px; margin-right: 16px; font-size: 12px; }
@media(max-width:600px) { .page-guide { padding: 17px; } .guide-directory { grid-template-columns: 1fr; } .guide-meta { font-size: 11px; } .vp-doc .guide-summary { font-size: 15px; } }
</style>
