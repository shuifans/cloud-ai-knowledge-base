<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { normalizePath } from '../knowledge.mjs'

type Node = { text: string; link?: string; key: string; id: string; children: Node[] }
const props = defineProps<{ nodes: Node[]; expanded: Record<string, boolean>; current: string; ancestors: string[]; depth?: number }>()
const emit = defineEmits<{ toggle: [key: string] }>()
const level = computed(() => props.depth || 0)
</script>

<template>
  <ul class="knowledge-tree" :class="{ nested: level > 0 }">
    <li v-for="node in nodes" :key="node.key" class="knowledge-node" :class="{ 'root-node': level === 0, 'in-path': ancestors.includes(node.key) }">
      <template v-if="node.children.length">
        <button type="button" class="directory-row directory-folder" :aria-expanded="!!expanded[node.key]" :aria-controls="node.id" @click="emit('toggle', node.key)">
          <span class="vpi-chevron-right" :class="{ expanded: expanded[node.key] }" aria-hidden="true" />
          <span>{{ node.text }}</span>
        </button>
        <div :id="node.id" v-show="expanded[node.key]">
          <KnowledgeTreeNode :nodes="node.children" :expanded="expanded" :current="current" :ancestors="ancestors" :depth="level + 1" @toggle="emit('toggle', $event)" />
        </div>
      </template>
      <a v-else-if="node.link" class="directory-row directory-article" :href="withBase(node.link)" :aria-current="normalizePath(node.link) === current ? 'page' : undefined">{{ node.text }}</a>
    </li>
  </ul>
</template>
