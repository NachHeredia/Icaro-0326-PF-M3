import {
  Box,
  Card,
  CardContent,
  IconButton,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import { ESTADOS } from '../store/useTaskStore'
import { STATUS_STYLES } from '../theme/statusStyles'

// "2026-10-31" -> Date local (sin corrimiento de zona horaria)
const toDate = (value) => {
  if (!value) return null
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, m - 1, d)
}

const formatShort = (date) =>
  date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })

// "29 oct – 2 nov (3d)"
const formatRange = (start, end) => {
  const s = toDate(start)
  const e = toDate(end)
  if (!s || !e) return ''
  const days = Math.round((e - s) / 86400000) + 1
  return `${formatShort(s)} – ${formatShort(e)} (${days}d)`
}

export default function TaskCard({ task, onChangeStatus, onDelete }) {
  // Fecha en rojo si ya venció y la tarea sigue abierta
  const end = toDate(task.fechaFin)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const overdue =
    end && end < today && !['Completadas', 'Canceladas'].includes(task.estado)

  return (
    <Card
      elevation={0}
      sx={(theme) => ({
        borderRadius: '14px',
        bgcolor:
          theme.palette.mode === 'light' ? '#FFFFFF' : alpha('#FFFFFF', 0.06),
      })}
    >
      <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Stack spacing={1.25}>
          {/* Título + borrar */}
          <Stack
            direction="row"
            alignItems="flex-start"
            justifyContent="space-between"
            spacing={1}
          >
            <Typography sx={{ fontSize: 14, fontWeight: 500, wordBreak: 'break-word' }}>
              {task.titulo}
            </Typography>
            <IconButton
              size="small"
              aria-label="Borrar tarea"
              onClick={() => onDelete(task.id)}
              sx={{ mt: -0.5, mr: -0.5, opacity: 0.6, '&:hover': { opacity: 1 } }}
            >
              <DeleteOutlineRoundedIcon fontSize="small" />
            </IconButton>
          </Stack>

          {/* Descripción (máx. 2 líneas) */}
          {task.descripcion && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {task.descripcion}
            </Typography>
          )}

          {/* Fechas */}
          <Typography
            variant="caption"
            sx={{ color: overdue ? 'error.main' : 'text.secondary' }}
          >
            {formatRange(task.fechaInicio, task.fechaFin)}
          </Typography>

          {/* Estado desplegable: al cambiarlo, la tarea pasa de columna */}
          <Select
            size="small"
            fullWidth
            value={task.estado}
            onChange={(e) => onChangeStatus(task.id, e.target.value)}
            sx={{ borderRadius: '10px', fontSize: 13 }}
          >
            {ESTADOS.map((estado) => (
              <MenuItem key={estado} value={estado} sx={{ fontSize: 13 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    mr: 1,
                    bgcolor: STATUS_STYLES[estado].color,
                  }}
                />
                {estado}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </CardContent>
    </Card>
  )
}
