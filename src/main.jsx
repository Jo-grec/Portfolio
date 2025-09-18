import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import RawCard from './Raw.jsx'
import App from './App.jsx'

// Import vanilla JavaScript modules
import './scripts/profile-tabs.js'
import './scripts/canvas-visibility.js'
import './scripts/projects-animate.js'
import './scripts/scroll-to-top.js'
import './scripts/project-modal.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)