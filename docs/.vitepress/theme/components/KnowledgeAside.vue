<script setup lang="ts">
import KnowledgeOutline from './KnowledgeOutline.vue'
import { useReadingLayout } from '../reading-layout'
const { headers, outlineOpen } = useReadingLayout()
</script>

<template>
  <nav v-if="headers.length && outlineOpen" id="article-outline-panel" class="VPDocAsideOutline has-outline" aria-labelledby="doc-outline-aria-label">
    <h2 id="doc-outline-aria-label" class="outline-title">本页目录</h2>
    <KnowledgeOutline :headers="headers" :root="true" />
  </nav>
</template>

<style scoped>
.outline-title { margin-bottom: 8px; font-size: 12px; font-weight: 600; }
</style>
