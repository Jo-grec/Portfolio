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
    
    // Simple liquid movement with tilting
    const tilt = index === 0 ? -6 : index === 2 ? 6 : 0
    
    // Animate the indicator
    indicator.style.transform = `translateX(${x}px) translateY(-50%)`
    indicator.style.width = `${rect.width}px`
    
    // Tilt the entire tab bar
    tabsBar.style.transform = `rotate(${tilt}deg)`
    tabsBar.style.transition = 'transform 400ms cubic-bezier(.25,.46,.45,.94)'
    
    // Move liquid droplets to the clicked tab
    const centerX = x + (rect.width / 2)
    const liquid1X = centerX - 40
    const liquid2X = centerX + 20
    const liquid3X = centerX + 40
    
    // Ensure liquid reaches the edges for edge tabs
    const barWidth = tabsBar.getBoundingClientRect().width
    const finalLiquid1X = Math.max(30, Math.min(liquid1X, barWidth - 30))
    const finalLiquid2X = Math.max(50, Math.min(liquid2X, barWidth - 50))
    const finalLiquid3X = Math.max(50, Math.min(liquid3X, barWidth - 50))
    
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


