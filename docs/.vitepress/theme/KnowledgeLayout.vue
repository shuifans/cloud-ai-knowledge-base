<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { onContentUpdated, useData, useRoute } from 'vitepress'
import { onMounted, provide, ref, shallowRef, watch } from 'vue'
import { getHeaders } from 'vitepress/dist/client/theme-default/composables/outline.js'
import { readingLayoutKey, type ArticleHeading } from './reading-layout'
import Breadcrumbs from './components/Breadcrumbs.vue'
import ReadingProgress from './components/ReadingProgress.vue'
import CoastalThemeToggle from './components/CoastalThemeToggle.vue'
import BackgroundMusic from './components/BackgroundMusic.vue'
import ArticleMeta from './components/ArticleMeta.vue'

const { Layout } = DefaultTheme
const { frontmatter, theme, site } = useData()
const route = useRoute()
const sidebarCollapsed = ref(false)
const outlineOpen = ref(false)
const headers = shallowRef<ArticleHeading[]>([])
const storageKey = `knowledge-sidebar-collapsed:v1:${site.value.base}`
provide(readingLayoutKey, { sidebarCollapsed, outlineOpen, headers })

function updateHeaders() {
  headers.value = frontmatter.value.aside === false || frontmatter.value.layout === 'page'
    ? [] : getHeaders(frontmatter.value.outline ?? theme.value.outline)
  if (!headers.value.length) outlineOpen.value = false
}
onContentUpdated(updateHeaders)
watch(() => route.path, () => { outlineOpen.value = false; headers.value = [] })
onMounted(() => {
  try { sidebarCollapsed.value = sessionStorage.getItem(storageKey) === 'true' } catch { /* Optional preference. */ }
  updateHeaders()
  watch(sidebarCollapsed, (collapsed) => {
    try { sessionStorage.setItem(storageKey, String(collapsed)) } catch { /* Navigation still works without storage. */ }
  })
})
</script>

<template>
  <div class="knowledge-layout" :class="{ 'sidebar-collapsed': sidebarCollapsed, 'article-outline-open': outlineOpen }">
  <Layout>
    <template #nav-bar-content-after>
      <CoastalThemeToggle />
      <BackgroundMusic />
    </template>
    <template #layout-top>
      <ReadingProgress />
    </template>
    <template #doc-before>
      <Breadcrumbs />
    </template>
    <template #doc-after>
      <ArticleMeta />
    </template>
  </Layout>
  </div>
</template>
