import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import './index.css'

import { OutboxProvider } from './hooks/use-outbox'
import { isIosStandalone, nudgeViewportStaggered } from './utils/ios-pwa'

if (isIosStandalone()) {
  nudgeViewportStaggered()
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) nudgeViewportStaggered()
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <OutboxProvider>
      <App />
    </OutboxProvider>
  </StrictMode>,
)
