document.addEventListener('DOMContentLoaded', () => {
  const home = document.getElementById('home')
  const root = document.getElementById('root')
  if (!home || !root) return

  // Check if we're already scrolled past the home section on page load
  const isPastHome = window.scrollY > home.offsetHeight

  // Initially hide the canvas to prevent showing loading spinner
  root.style.visibility = 'hidden'
  root.style.transform = 'translateY(-100vh)'
  root.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'

  // Only show canvas if we're not past the home section
  if (!isPastHome) {
    // Show canvas after a short delay to allow 3D scene to load
    setTimeout(() => {
      root.style.visibility = 'visible'
      root.style.transform = 'translateY(0)'
    }, 1000) // 1 second delay
  }

  function updateCanvasPosition() {
    const scrollY = window.scrollY
    const homeHeight = home.offsetHeight
    
    // Hide the card when it's completely scrolled past
    if (scrollY > homeHeight) {
      root.style.visibility = 'hidden'
      return
    }
    
    // Only show and animate the card if we're in the home section
    root.style.visibility = 'visible'
    
    // Keep the card in place initially, then move it up as content covers it
    let translateY = 0
    
    // Start moving the card up when we scroll past 20% of the home section
    const startMovingAt = homeHeight * 0.2
    
    if (scrollY > startMovingAt) {
      // Move the card up to get covered by scrolling content
      const scrollProgress = (scrollY - startMovingAt) / (homeHeight - startMovingAt)
      translateY = -scrollProgress * homeHeight * 0.8 // Move up by 80% of home height
    }
    
    // Apply the transform (combine with initial position)
    root.style.transform = `translateY(${translateY}px)`
  }

  // Update on scroll
  window.addEventListener('scroll', updateCanvasPosition, { passive: true })
  
  // Initial update
  updateCanvasPosition()
})
