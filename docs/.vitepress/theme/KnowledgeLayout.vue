<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import Breadcrumbs from './components/Breadcrumbs.vue'
import ReadingProgress from './components/ReadingProgress.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #layout-top>
      <ReadingProgress />
    </template>
    <template #doc-before>
      <Breadcrumbs />
    </template>
  </Layout>
</template>
