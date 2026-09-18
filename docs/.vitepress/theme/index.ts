import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import AppleHome from './components/AppleHome.vue'
import Timeline from './components/Timeline.vue'
import Refs from './components/Refs.vue'
import MermaidDiagram from './components/MermaidDiagram.vue'
import KnowledgeLayout from './KnowledgeLayout.vue'
import { setupImageZoom } from './zoom'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: KnowledgeLayout,
  enhanceApp({ app }) {
    app.component('AppleHome', AppleHome)
    app.component('Timeline', Timeline)
    app.component('Refs', Refs)
    app.component('Mermaid', MermaidDiagram)
    setupImageZoom()
  },
} satisfies Theme
