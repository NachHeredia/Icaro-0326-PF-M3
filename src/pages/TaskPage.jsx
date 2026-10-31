import { useState } from 'react'
import { Alert, Box, Button, LinearProgress, Stack, Typography } from '@mui/material'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import useTaskApi from '../hooks/useTaskApi'
import { ESTADOS } from '../store/useTaskStore'
import Column from '../components/Column'
import TaskFormDialog from '../components/TaskFormDialog'

export default function TasksPage() {
  const { tasks, loading, error, createTask, changeTaskStatus, removeTask } =
    useTaskApi()

  const [formOpen, setFormOpen] = useState(false)
  const openForm = () => setFormOpen(true)
  const closeForm = () => setFormOpen(false)

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Tus tareas
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={openForm}
        >
          Nueva tarea
        </Button>
      </Stack>

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
            onAdd={openForm}
          />
        ))}
      </Box>

      <TaskFormDialog open={formOpen} onClose={closeForm} onSubmit={createTask} />
    </Box>
  )
}
