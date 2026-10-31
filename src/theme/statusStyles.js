import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'
import TimelapseRoundedIcon from '@mui/icons-material/TimelapseRounded'
import PauseCircleOutlineRoundedIcon from '@mui/icons-material/PauseCircleOutlineRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded'

// Color e ícono de cada estado. La clave debe coincidir con ESTADOS del store.
// Para cambiar un color, tocá solo el hex de acá.
export const STATUS_STYLES = {
  'Nueva tarea': { color: '#3B6FF5', Icon: AddCircleOutlineRoundedIcon }, 
  'En curso': { color: '#1AA6C9', Icon: TimelapseRoundedIcon }, 
  'Stand By': { color: '#7A8599', Icon: PauseCircleOutlineRoundedIcon }, 
  Completadas: { color: '#2E9E4F', Icon: CheckCircleRoundedIcon }, 
  Canceladas: { color: '#F26D6D', Icon: CancelRoundedIcon }, 
}