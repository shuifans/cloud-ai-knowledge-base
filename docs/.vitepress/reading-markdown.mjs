// Insert shared reading aids without duplicating them across every article.
export function readingMarkdown(md) {
  md.core.ruler.after('inline', 'reading-guide', state => {
    const tokens = state.tokens
    const heading = tokens.findIndex(t => t.type === 'heading_close' && t.tag === 'h1')
    if (heading < 0) return
    const guide = new state.Token('html_block', '', 0)
    guide.content = '<PageGuide />\n'
    tokens.splice(heading + 1, 0, guide)
    for (let i = heading + 2; i < tokens.length; i++) {
      if (tokens[i].type === 'heading_open') break
      if (tokens[i].type !== 'paragraph_open' || tokens[i+1]?.type !== 'inline') continue
      const children = tokens[i+1].children || []
      if (children.length !== 1 || children[0].type !== 'image') continue
      const img = children[0]
      const src = img.attrGet('src') || ''
      if (!src.startsWith('/images/')) break
      const escape = value => md.utils.escapeHtml(value).replace(/\{/g, '&#123;').replace(/\}/g, '&#125;')
      const block = new state.Token('html_block', '', 0)
      block.content = `<OverviewMap src="${escape(src)}" alt="${escape(img.content)}" />\n`
      tokens.splice(i, 3, block)
      // Move only the standard overview caption into the expandable map.
      if (tokens[i+1]?.type === 'paragraph_open' && tokens[i+2]?.content?.includes('本站生成的高清全文阅读地图')) tokens.splice(i+1, 3)
      if (tokens[i+1]?.type === 'blockquote_open' && tokens[i+3]?.content === '图：本页技术脉络总览。') tokens.splice(i+1, 5)
      break
    }
  })
}
