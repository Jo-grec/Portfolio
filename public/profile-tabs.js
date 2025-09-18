document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.profile .tab')
  const indicator = document.querySelector('.profile .tab-indicator')
  const tabsBar = document.querySelector('.profile .profile-tabs')

  if (!tabs.length || !indicator || !tabsBar) return

  const panels = {
    skills: document.getElementById('panel-skills'),
    education: document.getElementById('panel-education'),
    hobbies: document.getElementById('panel-hobbies'),
  }

  function moveIndicator(target) {
    const rect = target.getBoundingClientRect()
    const barRect = tabsBar.getBoundingClientRect()
    const x = rect.left - barRect.left
    const index = [...tabs].indexOf(target)
    
    // Smoother tilting with more gradual angles
    const tilt = index === 0 ? -4 : index === 2 ? 4 : 0
    
    // Animate the indicator with smoother easing
    indicator.style.transform = `translateX(${x}px) translateY(-50%)`
    indicator.style.width = `${rect.width}px`
    indicator.style.transition = 'transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94), width 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    
    // Tilt the entire tab bar with smoother animation
    tabsBar.style.transform = `rotate(${tilt}deg)`
    
    // Move liquid droplets to the clicked tab with smoother positioning
    const centerX = x + (rect.width / 2)
    const liquid1X = centerX - 50
    const liquid2X = centerX + 10
    const liquid3X = centerX + 50
    
    // Ensure liquid reaches the edges for edge tabs with smoother boundaries
    const barWidth = tabsBar.getBoundingClientRect().width
    const finalLiquid1X = Math.max(40, Math.min(liquid1X, barWidth - 40))
    const finalLiquid2X = Math.max(60, Math.min(liquid2X, barWidth - 60))
    const finalLiquid3X = Math.max(60, Math.min(liquid3X, barWidth - 60))
    
    // Update CSS custom properties for liquid position
    tabsBar.style.setProperty('--liquid1-x', `${finalLiquid1X}px`)
    tabsBar.style.setProperty('--liquid2-x', `${finalLiquid2X}px`)
    tabsBar.style.setProperty('--liquid3-x', `${finalLiquid3X}px`)
  }

  function selectTab(target) {
    tabs.forEach((t) => t.classList.toggle('active', t === target))
    moveIndicator(target)
    const key = target.dataset.tab
    Object.entries(panels).forEach(([k, el]) => {
      if (!el) return
      el.hidden = k !== key
    })
  }

  tabs.forEach((t) =>
    t.addEventListener('click', (e) => {
      e.preventDefault()
      selectTab(t)
    }),
  )

  window.addEventListener('resize', () => {
    const active = document.querySelector('.profile .tab.active') || tabs[0]
    moveIndicator(active)
  })

  // Initialize to first tab
  requestAnimationFrame(() => selectTab(tabs[0]))
})


