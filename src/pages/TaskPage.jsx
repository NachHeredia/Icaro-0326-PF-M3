import { Alert, Box, LinearProgress, Typography } from '@mui/material'
import useTaskApi from '../hooks/useTaskApi'
import { ESTADOS } from '../store/useTaskStore'
import Column from '../components/Column'

export default function TasksPage() {
  const { tasks, loading, error, changeTaskStatus, removeTask } = useTaskApi()

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        Tus tareas
      </Typography>

      {loading && <LinearProgress sx={{ mb: 2, borderRadius: 2 }} />}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          pb: 2,
          scrollSnapType: { xs: 'x mandatory', md: 'none' },
        }}
      >
        {ESTADOS.map((estado) => (
          <Column
            key={estado}
            title={estado}
            tasks={tasks.filter((t) => t.estado === estado)}
            onChangeStatus={changeTaskStatus}
            onDelete={removeTask}
          />
        ))}
      </Box>
    </Box>
  )
}
