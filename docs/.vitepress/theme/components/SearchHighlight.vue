<script setup lang="ts">
import { highlightParts } from '../search.mjs'
defineProps<{ text: string; query: string }>()
</script>
<template><template v-for="(part,index) in highlightParts(text,query)" :key="index"><mark v-if="part.match">{{ part.text }}</mark><template v-else>{{ part.text }}</template></template></template>
<style scoped>mark { color: var(--coast-ink); background: var(--coast-note); border-radius: 2px; }</style>
