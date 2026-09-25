<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import Breadcrumbs from './components/Breadcrumbs.vue'
import ReadingProgress from './components/ReadingProgress.vue'
import CoastalThemeToggle from './components/CoastalThemeToggle.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #nav-bar-content-after>
      <CoastalThemeToggle />
    </template>
    <template #layout-top>
      <ReadingProgress />
    </template>
    <template #doc-before>
      <Breadcrumbs />
    </template>
  </Layout>
</template>
