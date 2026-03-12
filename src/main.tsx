import React, { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import {
  ThemeProvider as MuiThemeProvider,
  StyledEngineProvider,
} from '@mui/material/styles'
import { SnackbarProvider } from 'notistack'
import { BrowserRouter } from 'react-router-dom'

import App from './screens/App'
import { AuthProvider } from './contexts/AuthContext'
import theme from './theme'

import './index.css'

const root = createRoot(document.getElementById('root')!)

root.render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Suspense fallback="Chargement...">
        <AuthProvider>
          <StyledEngineProvider injectFirst>
            <MuiThemeProvider theme={theme}>
              <SnackbarProvider>
                <App />
              </SnackbarProvider>
            </MuiThemeProvider>
          </StyledEngineProvider>
        </AuthProvider>
      </Suspense>
    </BrowserRouter>
  </React.StrictMode>,
)
