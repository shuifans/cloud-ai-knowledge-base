import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Timeline from './components/Timeline.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('Timeline', Timeline)
  },
} satisfies Theme
