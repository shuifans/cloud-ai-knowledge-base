<script setup lang="ts">
import { computed } from 'vue'
import { useData, useRoute, withBase } from 'vitepress'
import { breadcrumbTrail } from '../knowledge.mjs'

const route = useRoute()
const { site, theme, page } = useData()
// The global sidebar supplies every ancestor; top navigation is no longer involved.
const crumbs = computed(() => breadcrumbTrail(
  theme.value.sidebar || [], route.path, page.value.title?.trim(), site.value.base,
))
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
