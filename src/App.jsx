import { useMemo } from 'react'
import { ThemeProvider, CssBaseline, Box } from '@mui/material'
import { useThemeStore } from './store/useThemeStore'
import { getTheme } from './theme/theme'
import Sidebar from './components/SideBar'
import TasksPage from './pages/TaskPage'

function App() {

  const mode = useThemeStore((state) => state.mode)
  const theme = useMemo(() => getTheme(mode), [mode])


  return (
    <>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box 
        component="main" 
        sx={{ flexGrow: 1, p: 3, pt: { xs: 10, md: 3 } }}>
          <TasksPage />
        </Box>
      </Box>
    </ThemeProvider>
    </>
  )
}

export default App
