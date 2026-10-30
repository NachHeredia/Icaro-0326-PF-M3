import { IconButton, Tooltip } from '@mui/material'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import { useThemeStore } from '../store/useThemeStore'


export default function ThemeToggle() {
  const mode = useThemeStore((state) => state.mode)
  const toggleMode = useThemeStore((state) => state.toggleMode)

  return (
    <Tooltip title={mode === 'light' ? 'Modo oscuro' : 'Modo claro'}>
      <IconButton onClick={toggleMode} color="inherit" aria-label="Cambiar tema">
        {mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}
      </IconButton>
    </Tooltip>
  )
}
