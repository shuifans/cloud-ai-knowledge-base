<script setup lang="ts">
import { computed } from 'vue'
import { useData, withBase } from 'vitepress'

const { frontmatter } = useData()
const date = computed(() => frontmatter.value.lastReviewed || frontmatter.value.lastVerified)
const scope = computed(() => frontmatter.value.reviewScope || frontmatter.value.verificationScope)
</script>

<template>
  <aside v-if="date && !frontmatter.directory" class="article-meta" aria-label="内容复核记录">
    <p>{{ frontmatter.lastReviewed ? '专项复核' : '内容复核记录' }}：<time :datetime="date">{{ date }}</time></p>
    <p v-if="scope">复核范围：{{ scope }}</p>
    <a :href="withBase('/about#updates')">查看核验记录</a>
  </aside>
</template>

<style scoped>
.article-meta { margin-top: 32px; padding-top: 16px; border-top: 1px solid var(--coast-line); color: var(--coast-muted); font-size: 12px; line-height: 1.8; }
.article-meta p { margin: 4px 0; }
.article-meta a { color: var(--coast-accent); text-underline-offset: 3px; }
</style>
