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
  // Read the same palette as the page so SVGs and zoomed diagrams follow the site theme.
  const styles = getComputedStyle(document.documentElement)
  const color = (name: string) => styles.getPropertyValue(`--coast-${name}`).trim()
  const fontFamily = styles.getPropertyValue('--vp-font-family-base').trim()
  const ink = color('ink')
  const series = Object.fromEntries(
    Array.from({ length: 12 }, (_, i) => [
      [`cScale${i}`, color(`series-${i % 6 + 1}`)],
      [`cScaleLabel${i}`, ink],
      [`pie${i + 1}`, color(`series-${i % 6 + 1}`)],
    ]).flat(),
  )

  return {
    securityLevel: 'loose' as const,
    startOnLoad: false,
    theme: 'base' as const,
    themeVariables: {
      ...series,
      darkMode: isDark,
      fontFamily,
      fontSize: '14px',
      background: color('wash'),
      primaryColor: color('node'),
      primaryTextColor: ink,
      primaryBorderColor: color('node-border'),
      secondaryColor: color('card'),
      secondaryTextColor: ink,
      secondaryBorderColor: color('node-border'),
      tertiaryColor: color('wash'),
      tertiaryTextColor: ink,
      tertiaryBorderColor: color('node-border'),
      lineColor: color('muted'),
      arrowheadColor: color('muted'),
      textColor: ink,
      nodeTextColor: ink,
      mainBkg: color('node'),
      nodeBorder: color('node-border'),
      clusterBkg: color('card'),
      clusterBorder: color('line'),
      edgeLabelBackground: color('wash'),
      actorBkg: color('card'),
      actorBorder: color('node-border'),
      actorTextColor: ink,
      labelBoxBkgColor: color('wash'),
      labelBoxBorderColor: color('node-border'),
      labelTextColor: ink,
      signalTextColor: ink,
      signalColor: color('muted'),
      activationBkgColor: color('node'),
      activationBorderColor: color('node-border'),
      noteBkgColor: color('note'),
      noteTextColor: color('note-ink'),
      noteBorderColor: color('node-border'),
      titleColor: ink,
      pieTitleTextColor: ink,
      pieSectionTextColor: ink,
      pieLegendTextColor: ink,
      scaleLabelColor: ink,
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
