document.addEventListener('DOMContentLoaded', () => {
  const home = document.getElementById('home')
  const root = document.getElementById('root')
  if (!home || !root) return

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry && entry.isIntersecting) {
        root.classList.remove('canvas-hidden')
      } else {
        root.classList.add('canvas-hidden')
      }
    },
    { root: null, threshold: 0.2 },
  )

  observer.observe(home)
})


