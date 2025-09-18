document.addEventListener('DOMContentLoaded', () => {
  // Create intersection observer for scroll animations
  const observerOptions = {
    threshold: 0.15, // Trigger when 15% of element is visible
    rootMargin: '0px 0px -30px 0px' // Start animation slightly before element is fully visible
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in')
        // Unobserve after animation to improve performance
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  // Function to add scroll animations to elements
  function addScrollAnimations() {
    // Remove existing scroll-animate classes first to avoid conflicts
    const existingElements = document.querySelectorAll('.scroll-animate')
    existingElements.forEach(el => {
      el.classList.remove('scroll-animate', 'animate-in')
      observer.unobserve(el)
    })

    // Add scroll-animate class to various content elements
    const elementsToAnimate = [
      '.skill',
      '.roadmap-point', 
      '.hobby-item',
      '.software-box',
      '.skills-col',
      '.education-roadmap',
      '.hobbies-grid'
    ]

    elementsToAnimate.forEach(selector => {
      const elements = document.querySelectorAll(selector)
      elements.forEach(element => {
        // Only add to visible elements
        if (!element.hidden && element.offsetParent !== null) {
          element.classList.add('scroll-animate')
          observer.observe(element)
        }
      })
    })
  }

  // Initialize scroll animations
  addScrollAnimations()

  // Re-initialize when profile tabs change
  const profileTabs = document.querySelectorAll('.profile .tab')
  profileTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Wait for tab transition to complete
      setTimeout(() => {
        addScrollAnimations()
      }, 500) // Match the panel transition duration
    })
  })

  // Handle window resize
  let resizeTimeout
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      addScrollAnimations()
    }, 150)
  })

  // Re-initialize on scroll to catch any missed elements
  let scrollTimeout
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout)
    scrollTimeout = setTimeout(() => {
      addScrollAnimations()
    }, 100)
  })
})
