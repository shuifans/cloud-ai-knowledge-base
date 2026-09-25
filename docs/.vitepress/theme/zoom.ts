export function setupImageZoom() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return
  let overlay: HTMLDialogElement | null = null
  let trigger: HTMLElement | null = null
  const getTarget = (target: EventTarget | null) => target instanceof Element ? target.closest<HTMLElement>('.vp-doc img, .vp-doc .mermaid svg') : null
  const markZoomable = (root: ParentNode) => {
    root.querySelectorAll<HTMLElement>('.vp-doc img, .vp-doc .mermaid svg').forEach(element => {
      element.tabIndex = 0
      element.setAttribute('role', 'button')
      element.setAttribute('aria-haspopup', 'dialog')
      const name = (element.getAttribute('alt') || element.getAttribute('aria-label')?.replace(/（点击放大）$/, '') || '图表').trim()
      element.setAttribute('aria-label', `${name}（点击放大）`)
    })
  }
  const close = () => {
    if (!overlay) return
    overlay.close(); overlay.remove(); overlay = null
    document.body.classList.remove('zoom-lock')
    trigger?.focus({ preventScroll: true }); trigger = null
  }
  const open = (source: HTMLElement) => {
    trigger = source
    overlay = document.createElement('dialog')
    overlay.className = 'zoom-overlay'
    overlay.setAttribute('aria-label', '知识图表预览')
    const toolbar = document.createElement('div')
    toolbar.className = 'zoom-toolbar'
    const stage = document.createElement('div')
    stage.className = 'zoom-stage'
    stage.tabIndex = 0
    stage.setAttribute('aria-label', '图表区域，放大后可滚动查看')
    const clone = source.cloneNode(true) as HTMLElement
    for (const attribute of ['style', 'class', 'role', 'tabindex', 'aria-label', 'aria-haspopup']) clone.removeAttribute(attribute)
    stage.appendChild(clone)
    let scale = 1
    const ratio = source.getBoundingClientRect().width / Math.max(1, source.getBoundingClientRect().height)
    const fit = Math.min(window.innerWidth - 32, (window.innerHeight - 110) * ratio)
    const resize = () => { clone.style.width = `${fit * scale}px` }
    const button = (label: string, action: () => void) => {
      const el = document.createElement('button'); el.type = 'button'; el.textContent = label
      el.addEventListener('click', action); toolbar.appendChild(el); return el
    }
    const smaller = button('缩小', () => { scale = Math.max(1, scale / 1.5); update() })
    const bigger = button('放大', () => { scale = Math.min(8, scale * 1.5); update() })
    button('适合屏幕', () => { scale = 1; update(); stage.scrollTo(0, 0) })
    const closeButton = button('关闭', close)
    const update = () => { resize(); smaller.disabled = scale <= 1; bigger.disabled = scale >= 8 }
    update()
    overlay.append(toolbar, stage)
    overlay.addEventListener('cancel', event => { event.preventDefault(); close() })
    overlay.addEventListener('keydown', event => { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close() } })
    overlay.addEventListener('click', event => { if (event.target === overlay) close() })
    document.body.appendChild(overlay)
    document.body.classList.add('zoom-lock')
    overlay.showModal(); closeButton.focus()
  }
  markZoomable(document)
  new MutationObserver(mutations => {
    for (const { addedNodes } of mutations) for (const node of addedNodes) {
      if (!(node instanceof Element)) continue
      if (node.matches('.vp-doc img, .vp-doc .mermaid svg')) markZoomable(node.parentElement ?? document)
      markZoomable(node)
    }
  }).observe(document.body, { childList: true, subtree: true })
  document.addEventListener('click', event => {
    if (overlay) return
    const target = getTarget(event.target)
    if (target) { event.preventDefault(); open(target) }
  })
  document.addEventListener('keydown', event => {
    if (overlay || !['Enter', ' '].includes(event.key)) return
    const target = getTarget(event.target)
    if (target) { event.preventDefault(); open(target) }
  })
}
