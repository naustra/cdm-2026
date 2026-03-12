import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#19194b',
      contrastText: '#fff',
    },
    secondary: {
      main: '#fb3103',
      contrastText: '#fff',
    },
  },
  typography: {
    h1: { fontSize: '1.5rem' },
    h2: { fontSize: '1.25rem' },
    h3: { fontSize: '1rem' },
    h4: { fontSize: '0.75rem' },
  },
})

export default theme
