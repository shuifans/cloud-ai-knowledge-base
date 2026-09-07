<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{
  graph: string
  id: string
}>()

const svg = ref('')
const isRendering = ref(true)
let observer: MutationObserver | undefined
let renderVersion = 0

function getConfig(isDark: boolean) {
  const fontFamily =
    '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif'

  return {
    securityLevel: 'loose' as const,
    startOnLoad: false,
    theme: isDark ? ('dark' as const) : ('base' as const),
    themeVariables: isDark
      ? {
          fontFamily,
          fontSize: '14px',
          background: '#1a1b20',
          primaryColor: '#25272e',
          primaryTextColor: '#f1f2f4',
          primaryBorderColor: '#555a66',
          secondaryColor: '#202229',
          tertiaryColor: '#1a1b20',
          lineColor: '#a7acb7',
          arrowheadColor: '#a7acb7',
          textColor: '#f1f2f4',
          nodeTextColor: '#f1f2f4',
          mainBkg: '#25272e',
          nodeBorder: '#555a66',
          clusterBkg: '#202733',
          clusterBorder: '#4c5b73',
          edgeLabelBackground: '#1a1b20',
          actorBkg: '#25272e',
          actorBorder: '#555a66',
          actorTextColor: '#f1f2f4',
          noteBkgColor: '#3b3522',
          noteTextColor: '#f7edcc',
        }
      : {
          fontFamily,
          fontSize: '14px',
          background: '#f6f6f7',
          primaryColor: '#ffffff',
          primaryTextColor: '#3c3c43',
          primaryBorderColor: '#d7d9de',
          secondaryColor: '#f0f3f9',
          tertiaryColor: '#f6f6f7',
          lineColor: '#8a8f98',
          arrowheadColor: '#8a8f98',
          textColor: '#3c3c43',
          nodeTextColor: '#3c3c43',
          mainBkg: '#ffffff',
          nodeBorder: '#d7d9de',
          clusterBkg: '#f0f4fb',
          clusterBorder: '#c9d4e8',
          edgeLabelBackground: '#f6f6f7',
          actorBkg: '#ffffff',
          actorBorder: '#d7d9de',
          actorTextColor: '#3c3c43',
          noteBkgColor: '#fdf6dd',
          noteTextColor: '#3c3c43',
        },
    flowchart: { htmlLabels: false, useMaxWidth: false, nodeSpacing: 32, rankSpacing: 40 },
    sequence: { htmlLabels: false, useMaxWidth: false },
    timeline: { useMaxWidth: false },
    gantt: { useMaxWidth: false },
  }
}

async function renderDiagram() {
  const version = ++renderVersion
  isRendering.value = true

  try {
    const { default: mermaid } = await import('mermaid')
    const isDark = document.documentElement.classList.contains('dark')
    mermaid.initialize(getConfig(isDark))
    const { svg: renderedSvg } = await mermaid.render(props.id, decodeURIComponent(props.graph))
    if (version === renderVersion) svg.value = renderedSvg
  } catch {
    if (version === renderVersion) {
      svg.value = '<p class="mermaid-error" role="alert">图表加载失败，请刷新页面后重试。</p>'
    }
  } finally {
    if (version === renderVersion) isRendering.value = false
  }
}

onMounted(() => {
  observer = new MutationObserver((mutations) => {
    if (mutations.some((mutation) => mutation.attributeName === 'class')) renderDiagram()
  })
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  renderDiagram()
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div class="mermaid" :aria-busy="isRendering" v-html="svg"></div>
</template>
