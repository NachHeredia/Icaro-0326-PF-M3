import { useState } from 'react'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import useTaskApi from '../hooks/useTaskApi'
import { ESTADOS } from '../store/useTaskStore'
import { STATUS_STYLES } from '../theme/statusStyles'
import TaskFormDialog from '../components/TaskFormDialog'
import ConfirmDialog from '../components/ConfirmDialog'
import styles from './TaskDetailPage.module.css'

const toDate = (value) => {
  if (!value) return null
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, m - 1, d)
}

const formatLong = (value) => {
  const date = toDate(value)
  return date
    ? date.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—'
}

export default function TaskDetailPage() {
  const { id } = useParams() 
  const navigate = useNavigate()
  const { tasks, loading, error, editTask, changeTaskStatus, removeTask } =
    useTaskApi()

  const task = tasks.find((t) => t.id === id)

  const [editOpen, setEditOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const backButton = (
    <Button
      component={RouterLink}
      to="/tareas"
      startIcon={<ArrowBackRoundedIcon />}
      color="inherit"
      sx={{ mb: 2 }}
    >
      Volver al tablero
    </Button>
  )

  if (!task) {
    return (
      <Box>
        {backButton}
        {loading ? (
          <LinearProgress sx={{ borderRadius: 2 }} />
        ) : (
          <Alert severity="warning">No encontramos esta tarea.</Alert>
        )}
      </Box>
    )
  }

  const { color } = STATUS_STYLES[task.estado] ?? { color: '#7A8599' }
  const start = toDate(task.fechaInicio)
  const end = toDate(task.fechaFin)
  const days = start && end ? Math.round((end - start) / 86400000) + 1 : null

  const confirmDelete = async () => {
    const ok = await removeTask(task.id)
    setConfirmOpen(false)
    if (ok) navigate('/tareas')
  }

  return (
    <Box>
      {backButton}

      {loading && <LinearProgress sx={{ mb: 2, borderRadius: 2 }} />}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={0} className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>{task.titulo}</h1>
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              borderRadius: '10px',
              fontSize: 13,
              fontWeight: 600,
              color,
              bgcolor: alpha(color, 0.16),
            }}
          >
            {task.estado}
          </Box>
        </div>

        <p className={styles.description}>
          {task.descripcion || 'Sin descripción.'}
        </p>

        <div className={styles.grid}>
          <div className={styles.field}>
            <span className={styles.label}>Fecha de inicio</span>
            <span className={styles.value}>{formatLong(task.fechaInicio)}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Fecha de fin</span>
            <span className={styles.value}>{formatLong(task.fechaFin)}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Duración</span>
            <span className={styles.value}>
              {days ? `${days} ${days === 1 ? 'día' : 'días'}` : '—'}
            </span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Estado</span>
            <Select
              size="small"
              value={task.estado}
              onChange={(e) => changeTaskStatus(task.id, e.target.value)}
              sx={{ borderRadius: '10px', fontSize: 14 }}
            >
              {ESTADOS.map((estado) => (
                <MenuItem key={estado} value={estado} sx={{ fontSize: 14 }}>
                  {estado}
                </MenuItem>
              ))}
            </Select>
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            variant="contained"
            startIcon={<EditRoundedIcon />}
            onClick={() => setEditOpen(true)}
          >
            Editar
          </Button>
          <Button
            color="error"
            startIcon={<DeleteOutlineRoundedIcon />}
            onClick={() => setConfirmOpen(true)}
          >
            Eliminar
          </Button>
        </div>
      </Paper>

      <TaskFormDialog
        open={editOpen}
        task={task}
        onClose={() => setEditOpen(false)}
        onSubmit={(values) => editTask(task.id, values)}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="¿Eliminar tarea?"
        message={`Vas a eliminar "${task.titulo}". Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        loading={loading}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </Box>
  )
}
