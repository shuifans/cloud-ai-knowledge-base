// 轻量灯箱：正文图片与 Mermaid 图默认小尺寸展示，点击全屏放大（Esc 或点击关闭）
export function setupImageZoom() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return

  let overlay: HTMLElement | null = null
  let lastScroll = 0

  const close = () => {
    if (!overlay) return
    overlay.remove()
    overlay = null
    document.body.classList.remove('zoom-lock')
    window.scrollTo(0, lastScroll)
  }

  const open = (source: HTMLElement) => {
    lastScroll = window.scrollY
    overlay = document.createElement('div')
    overlay.className = 'zoom-overlay'
    const stage = document.createElement('div')
    stage.className = 'zoom-stage'
    const clone = source.cloneNode(true) as HTMLElement
    clone.removeAttribute('style')
    clone.removeAttribute('class')
    stage.appendChild(clone)
    overlay.appendChild(stage)
    overlay.addEventListener('click', close)
    document.body.appendChild(overlay)
    document.body.classList.add('zoom-lock')
  }

  document.addEventListener('click', (e) => {
    if (overlay) return
    const t = e.target as HTMLElement
    if (!(t as HTMLElement).closest) return
    const img = t.closest('.vp-doc img') as HTMLElement | null
    const dia = t.closest('.vp-doc .mermaid svg') as HTMLElement | null
    const target = img ?? dia
    if (target) {
      e.preventDefault()
      open(target)
    }
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close()
  })
}
