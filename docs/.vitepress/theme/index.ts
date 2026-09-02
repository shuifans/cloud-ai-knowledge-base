import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import AppleHome from './components/AppleHome.vue'
import Timeline from './components/Timeline.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('AppleHome', AppleHome)
    app.component('Timeline', Timeline)
  },
} satisfies Theme
