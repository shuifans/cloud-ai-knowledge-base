---
title: 更新记录已并入关于
layout: page
sidebar: false
outline: false
search: false
readingProgress: false
redirect: /about#updates
---

<script setup>
import { onMounted } from 'vue'
import { useData, withBase } from 'vitepress'

const { frontmatter } = useData()
onMounted(() => {
  const destination = new URL(withBase(frontmatter.value.redirect), window.location.origin)
  destination.search = window.location.search
  if (window.location.hash) destination.hash = window.location.hash
  window.location.replace(destination.href)
})
</script>

<div class="vp-doc" style="max-width: 760px; margin: 0 auto; padding: 48px 24px;">
  <h1>更新记录已并入关于</h1>
  <p>正在打开新的页面。也可以<a :href="withBase(frontmatter.redirect)">直接查看核验与更新记录</a>。</p>
</div>
