<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useData, useRoute } from 'vitepress'

const route = useRoute()
const { frontmatter } = useData()
const progress = ref(0)
let frameId = 0

const isDocument = computed(() => !['home', 'page'].includes(frontmatter.value.layout) && frontmatter.value.readingProgress !== false)

function updateProgress() {
  frameId = 0
  const documentHeight = document.documentElement.scrollHeight - window.innerHeight
  progress.value = documentHeight > 0 ? Math.min(100, Math.max(0, (window.scrollY / documentHeight) * 100)) : 0
}

function requestUpdate() {
  if (frameId) return
  frameId = window.requestAnimationFrame(updateProgress)
}

onMounted(() => {
  window.addEventListener('scroll', requestUpdate, { passive: true })
  window.addEventListener('resize', requestUpdate)
  requestUpdate()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', requestUpdate)
  window.removeEventListener('resize', requestUpdate)
  if (frameId) window.cancelAnimationFrame(frameId)
})

watch(
  () => route.path,
  async () => {
    await nextTick()
    requestUpdate()
  },
)
</script>

<template>
  <div
    v-if="isDocument"
    class="reading-progress"
    role="progressbar"
    aria-label="阅读进度"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-valuenow="Math.round(progress)"
  >
    <span :style="{ transform: `scaleX(${progress / 100})` }"></span>
  </div>
</template>

<style scoped>
.reading-progress {
  position: fixed;
  top: var(--vp-nav-height);
  right: 0;
  left: 0;
  z-index: 35;
  height: 2px;
  pointer-events: none;
  background: transparent;
}

.reading-progress span {
  display: block;
  width: 100%;
  height: 100%;
  transform-origin: left center;
  background: var(--vp-c-brand-1);
  transition: transform 80ms linear;
}

@media (prefers-reduced-motion: reduce) {
  .reading-progress span {
    transition: none;
  }
}
</style>
