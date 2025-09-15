// Scroll-driven stack → grid animation for project cards
document.addEventListener('DOMContentLoaded', () => {
  const section = document.getElementById('projects')
  const grid = section?.querySelector('.projects-grid')
  if (!section || !grid) return

  const cards = Array.from(grid.querySelectorAll('.project-card'))
  if (cards.length === 0) return

  const state = { firstRect: null, cardRects: [], ready: false }

  function computeRects() {
    state.cardRects = cards.map((c) => c.getBoundingClientRect())
    state.firstRect = state.cardRects[0]
    state.ready = !!state.firstRect
  }

  function getProgress() {
    const viewportH = window.innerHeight || document.documentElement.clientHeight
    const rect = section.getBoundingClientRect()
    // Progress based on the section top moving from bottom (enter) to top of viewport (fully in view)
    // p = 0 when section top is at viewport bottom; p = 1 when section top reaches viewport top
    const start = viewportH * 0.9 // begin easing slightly before full entry
    const end = 0 // when section top hits the top of the viewport
    const raw = 1 - (rect.top - end) / (start - end)
    return Math.min(1, Math.max(0, raw))
  }

  function applyTransforms(progress) {
    if (!state.ready) return
    cards.forEach((card, i) => {
      const r = state.cardRects[i]
      const dx = state.firstRect.left - r.left
      const dy = state.firstRect.top - r.top
      const t = 1 - progress // 1 → stacked, 0 → natural position
      card.style.transform = `translate(${dx * t}px, ${dy * t}px)`
    })
  }

  function onScroll() {
    const p = getProgress()
    applyTransforms(p)
  }

  function onResize() {
    // Clear transforms to measure natural layout positions
    cards.forEach((c) => (c.style.transform = 'none'))
    computeRects()
    onScroll()
  }

  // Setup observers
  window.addEventListener('resize', onResize, { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true })

  // Initial measure
  requestAnimationFrame(onResize)
})


