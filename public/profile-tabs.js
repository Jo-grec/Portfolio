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
    indicator.style.transform = `translateX(${x}px)`
    indicator.style.width = `${rect.width}px`
    const index = [...tabs].indexOf(target)
    const tilt = index === 0 ? -6 : index === 2 ? 6 : 0
    tabsBar.style.transform = `rotate(${tilt}deg)`
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


