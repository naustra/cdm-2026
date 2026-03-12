import React, { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter } from 'react-router-dom'

import App from './screens/App'
import { AuthProvider } from './contexts/AuthContext'

import './index.css'

const root = createRoot(document.getElementById('root')!)

root.render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Suspense fallback="Chargement...">
        <AuthProvider>
          <App />
          <Toaster
            position="bottom-center"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: '12px',
                background: '#1e1e2f',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 500,
              },
            }}
          />
        </AuthProvider>
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>,
)
