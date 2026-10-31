import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material'


const todayStr = () => {
  const d = new Date()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${month}-${day}`
}

const emptyForm = () => ({
  titulo: '',
  descripcion: '',
  fechaInicio: todayStr(),
  fechaFin: todayStr(),
})

export default function TaskFormDialog({ open, onClose, onSubmit }) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: emptyForm() })


  useEffect(() => {
    if (open) reset(emptyForm())
  }, [open, reset])

  const field = (name, rules) => {
    const { ref, ...rest } = register(name, rules)
    return { ...rest, inputRef: ref }
  }

  const onValid = async (values) => {
    const ok = await onSubmit(values)
    if (ok) {
      onClose()
    } else {
      setError('root.serverError', {
        type: 'server',
        message: 'No se pudo guardar la tarea. Revisá tu conexión e intentá de nuevo.',
      })
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(15, 23, 42, 0.25)',
          },
        },
        paper: {
          component: 'form',
          noValidate: true,
          onSubmit: handleSubmit(onValid),
          sx: (theme) => ({
            width: { xs: 'calc(100% - 24px)', sm: 480 },
            maxWidth: 'calc(100% - 24px)',
            height: { xs: 'calc(100% - 24px)', sm: 'auto' },
            maxHeight: 'calc(100% - 24px)',
            m: '12px',
            borderRadius: '24px',
            bgcolor:
              theme.palette.mode === 'light'
                ? 'rgba(255, 255, 255, 0.88)'
                : 'rgba(30, 36, 48, 0.9)',
          }),
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>Nueva tarea</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          {errors.root?.serverError && (
            <Alert severity="error">{errors.root.serverError.message}</Alert>
          )}

          <TextField
            label="Título"
            fullWidth
            autoFocus
            {...field('titulo', {
              required: 'Escribí un título',
              maxLength: { value: 80, message: 'Máximo 80 caracteres' },
            })}
            error={!!errors.titulo}
            helperText={errors.titulo?.message}
          />

          <TextField
            label="Descripción"
            fullWidth
            multiline
            minRows={3}
            {...field('descripcion', { required: 'Escribí una descripción' })}
            error={!!errors.descripcion}
            helperText={errors.descripcion?.message}
          />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Fecha de inicio"
              type="date"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              {...field('fechaInicio', {
                required: 'Elegí la fecha de inicio',
                deps: ['fechaFin'], 
              })}
              error={!!errors.fechaInicio}
              helperText={errors.fechaInicio?.message}
            />
            <TextField
              label="Fecha de fin"
              type="date"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              {...field('fechaFin', {
                required: 'Elegí la fecha de fin',
                validate: (value, formValues) =>
                  value >= formValues.fechaInicio ||
                  'No puede ser anterior a la fecha de inicio',
              })}
              error={!!errors.fechaFin}
              helperText={errors.fechaFin?.message}
            />
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button color="inherit" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando…' : 'Crear tarea'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}