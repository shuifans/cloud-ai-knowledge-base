import { inject, type InjectionKey, type Ref } from 'vue'

export type ArticleHeading = { title: string; link: string; children?: ArticleHeading[] }
export const readingLayoutKey: InjectionKey<{
  sidebarCollapsed: Ref<boolean>
  outlineOpen: Ref<boolean>
  headers: Ref<ArticleHeading[]>
}> = Symbol('reading-layout')

export function useReadingLayout() {
  const layout = inject(readingLayoutKey)
  if (!layout) throw new Error('Reading controls require KnowledgeLayout')
  return layout
}
