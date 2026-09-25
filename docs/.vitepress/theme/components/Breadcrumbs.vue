<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'

interface Crumb {
  text: string
  link?: string
}

/** config.mts 里 sidebar / nav 条目的最小结构，够用即可 */
interface NavNode {
  text?: string
  link?: string
  items?: NavNode[]
}

const route = useRoute()
const { site, theme, page } = useData()

function normalizePath(path: string) {
  return path.split('#')[0].replace(/index\.html?$/, '').replace(/\.html$/, '').replace(/\/+$/, '') || '/'
}

function samePath(first: string, second: string) {
  return normalizePath(first) === normalizePath(second)
}

function underPath(path: string, parent: string) {
  const root = normalizePath(parent)
  const target = normalizePath(path)
  return target === root || target.startsWith(`${root}/`)
}

/**
 * 面包屑全部由 config.mts 的 nav + sidebar 推导，不再手抄一份导航树，
 * 否则新增文章时必须同步两处，漏改会静默退化成「首页 > 支柱名」。
 */

/**
 * SSR 阶段 route.path 带 base（VitePress 内部 withBase），客户端不带。
 * 统一剥掉 base 再与 sidebar/nav 中不含 base 的 link 比较，
 * 否则 GitHub Pages 部署（base=/cloud-ai-knowledge-base/）下
 * 首屏 SSR 会匹配不到任何 sidebar，渲染出兜底面包屑再被 hydration 纠正。
 */
const currentPath = computed(() => {
  const base = site.value.base || '/'
  const path = route.path
  return base !== '/' && path.startsWith(base) ? path.slice(base.length - 1) : path
})

/** 复刻 VitePress getSidebar 的前缀匹配：按路径段数降序取最长匹配前缀 */
const sidebarEntry = computed(() => {
  const sidebar = theme.value.sidebar as NavNode[] | Record<string, NavNode[]> | undefined
  if (!sidebar) return null
  if (Array.isArray(sidebar)) return { prefix: '/', items: sidebar }

  const path = currentPath.value
  const prefix = Object.keys(sidebar)
    .sort((a, b) => b.split('/').length - a.split('/').length)
    .find((key) => path.startsWith(key.startsWith('/') ? key : `/${key}`))

  return prefix ? { prefix, items: sidebar[prefix] } : null
})

/** 支柱名取自 nav：sidebar 前缀的第一段落在哪个 nav 下拉里 */
const pillar = computed<Crumb | null>(() => {
  const entry = sidebarEntry.value
  if (!entry || entry.prefix === '/') return null

  const root = `/${entry.prefix.split('/').filter(Boolean)[0]}/`
  for (const item of (theme.value.nav ?? []) as NavNode[]) {
    if (item.items?.length) {
      if (item.items.some((child) => child.link && underPath(child.link, root))) {
        return { text: item.text ?? '', link: root }
      }
    } else if (item.link && samePath(item.link, root)) {
      return { text: item.text ?? '', link: item.link }
    }
  }
  return null
})

/** 深度优先找出当前页，真实目录的总览链接同时用于可返回的祖先层级。 */
function findTrail(items: NavNode[], target: string, ancestors: Crumb[] = []): Crumb[] | null {
  for (const item of items) {
    if (!item) continue
    const trail = item.text ? [...ancestors, { text: item.text, link: item.link }] : ancestors

    if (item.link && samePath(item.link, target)) return trail
    if (item.items?.length) {
      const found = findTrail(item.items, target, trail)
      if (found) return found
    }
  }
  return null
}

const crumbs = computed<Crumb[]>(() => {
  const path = currentPath.value
  if (normalizePath(path) === '/') return []

  const home: Crumb = { text: '首页', link: '/' }
  const trail = sidebarEntry.value ? findTrail(sidebarEntry.value.items, path) : null

  // 不属于任何 sidebar 前缀（如 /about）：用页面自身标题，不写死文案
  if (!trail?.length) {
    const title = page.value.title?.trim()
    return title ? [home, { text: title }] : [home]
  }

  const full = pillar.value ? [pillar.value, ...trail] : trail
  const last = full[full.length - 1]

  // 当前页与某个祖先同址时（/cloud/ 既是支柱首页又是「云计算全景」）截断到祖先，避免重复
  if (last.link) {
    const dup = full.findIndex(
      (crumb, index) => index < full.length - 1 && crumb.link && samePath(crumb.link, last.link),
    )
    if (dup !== -1) return [home, ...full.slice(0, dup + 1)]
  }

  return [home, ...full.filter((crumb, index) => crumb.link || index === full.length - 1)]
})
</script>

<template>
  <nav v-if="crumbs.length" class="knowledge-breadcrumb" aria-label="面包屑导航">
    <ol>
      <li
        v-for="(crumb, index) in crumbs"
        :key="`${index}-${crumb.text}`"
        class="knowledge-breadcrumb-item"
      >
        <svg v-if="index > 0" aria-hidden="true" viewBox="0 0 16 16">
          <path d="m6 3 5 5-5 5" />
        </svg>
        <a v-if="crumb.link && index !== crumbs.length - 1" :href="withBase(crumb.link)">
          {{ crumb.text }}
        </a>
        <span v-else-if="index === crumbs.length - 1" aria-current="page">{{ crumb.text }}</span>
        <span v-else>{{ crumb.text }}</span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.knowledge-breadcrumb {
  margin-bottom: 24px;
  font-size: 13px;
  line-height: 20px;
  color: var(--vp-c-text-2);
}

ol,
.knowledge-breadcrumb-item {
  display: flex;
  align-items: center;
}

ol {
  flex-wrap: wrap;
  gap: 4px;
}

.knowledge-breadcrumb-item {
  min-width: 0;
  gap: 4px;
}

svg {
  width: 14px;
  height: 14px;
  flex: 0 0 auto;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.5;
}

a {
  color: inherit;
  text-decoration: none;
}

a:hover {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-underline-offset: 3px;
}

span[aria-current='page'] {
  overflow: hidden;
  max-width: min(48vw, 360px);
  color: var(--vp-c-text-1);
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
