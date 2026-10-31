import { useMemo } from 'react'
import { ThemeProvider, CssBaseline, Box, Typography } from '@mui/material'
import { useThemeStore } from './store/useThemeStore'
import { getTheme } from './theme/theme'
import Sidebar from './components/SideBar'

function App() {

  const mode = useThemeStore((state) => state.mode)
  const theme = useMemo(() => getTheme(mode), [mode])


  return (
    <>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3, pt: { xs: 10, md: 3 } }}>
          <Typography variant="h5">Tasks</Typography>
        </Box>
      </Box>
    </ThemeProvider>
    </>
  )
}

export default App
