export function setupImageZoom() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return

  let overlay: HTMLElement | null = null
  let trigger: HTMLElement | null = null
  let lastScroll = 0

  const getZoomTarget = (target: EventTarget | null) => {
    if (!(target instanceof Element)) return null
    return target.closest('.vp-doc img, .vp-doc .mermaid svg') as HTMLElement | null
  }

  const markZoomable = (root: ParentNode) => {
    root.querySelectorAll<HTMLElement>('.vp-doc img, .vp-doc .mermaid svg').forEach((element) => {
      element.tabIndex = 0
      element.setAttribute('role', 'button')
      element.setAttribute('aria-label', element.matches('img') ? '放大图片' : '放大图表')
    })
  }

  const close = () => {
    if (!overlay) return
    overlay.remove()
    overlay = null
    document.body.classList.remove('zoom-lock')
    window.scrollTo(0, lastScroll)
    trigger?.focus({ preventScroll: true })
    trigger = null
  }

  const open = (source: HTMLElement) => {
    lastScroll = window.scrollY
    trigger = source
    overlay = document.createElement('div')
    overlay.className = 'zoom-overlay'
    overlay.tabIndex = -1
    overlay.setAttribute('role', 'dialog')
    overlay.setAttribute('aria-modal', 'true')
    overlay.setAttribute('aria-label', '放大预览，按 Escape 关闭')

    const stage = document.createElement('div')
    stage.className = 'zoom-stage'
    const clone = source.cloneNode(true) as HTMLElement
    clone.removeAttribute('style')
    clone.removeAttribute('class')
    clone.removeAttribute('role')
    clone.removeAttribute('tabindex')
    stage.appendChild(clone)
    overlay.appendChild(stage)
    overlay.addEventListener('click', close)
    document.body.appendChild(overlay)
    document.body.classList.add('zoom-lock')
    overlay.focus({ preventScroll: true })
  }

  markZoomable(document)

  const observer = new MutationObserver((mutations) => {
    mutations.forEach(({ addedNodes }) => {
      addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return
        if (node.matches('.vp-doc img, .vp-doc .mermaid svg')) markZoomable(node.parentElement ?? document)
        markZoomable(node)
      })
    })
  })
  observer.observe(document.body, { childList: true, subtree: true })

  document.addEventListener('click', (event) => {
    if (overlay) return
    const target = getZoomTarget(event.target)
    if (!target) return
    event.preventDefault()
    open(target)
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      close()
      return
    }

    if (overlay || (event.key !== 'Enter' && event.key !== ' ')) return
    const target = getZoomTarget(event.target)
    if (!target) return
    event.preventDefault()
    open(target)
  })
}
