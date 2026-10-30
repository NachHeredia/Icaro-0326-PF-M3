import { useMemo } from 'react'
import { ThemeProvider, CssBaseline, Box, Typography } from '@mui/material'
import { useThemeStore } from './store/useThemeStore'
import { getTheme } from './theme/theme'
import ThemeToggle from './components/ThemeToggle'

function App() {

  const mode = useThemeStore((state) => state.mode)
  const theme = useMemo(() => getTheme(mode), [mode])


  return (
    <>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: 3 }}>
        <Typography variant="h6">TO DO</Typography>
        <ThemeToggle />
      </Box>
    </ThemeProvider>
    </>
  )
}

export default App
