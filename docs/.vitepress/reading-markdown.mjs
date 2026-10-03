// Insert shared reading aids without duplicating them across every article.
export function readingMarkdown(md) {
  md.core.ruler.after('inline', 'reading-guide', state => {
    const tokens = state.tokens
    const heading = tokens.findIndex(t => t.type === 'heading_close' && t.tag === 'h1')
    if (heading < 0) return
    const guide = new state.Token('html_block', '', 0)
    guide.content = '<PageGuide />\n'
    tokens.splice(heading + 1, 0, guide)
  })
}
