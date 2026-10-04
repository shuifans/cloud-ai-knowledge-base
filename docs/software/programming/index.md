---
title: 目录已合并至编程与计算机基础
layout: page
sidebar: false
outline: false
search: false
readingProgress: false
redirect: /software/foundations/
---

<script setup>
import { onMounted } from 'vue'
import { useData, withBase } from 'vitepress'

const { frontmatter } = useData()
onMounted(() => {
  const destination = new URL(withBase(frontmatter.value.redirect), window.location.origin)
  destination.search = window.location.search
  window.location.replace(destination.href)
})
</script>

<div class="vp-doc" style="max-width: 760px; margin: 0 auto; padding: 48px 24px;">
  <h1>目录已合并至编程与计算机基础</h1>
  <p>正在打开合并后的目录。也可以<a :href="withBase(frontmatter.redirect)">直接查看编程与计算机基础</a>。</p>
</div>
