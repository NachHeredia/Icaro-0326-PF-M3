import { Box, Button, Dialog, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirmar',
  loading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(15, 23, 42, 0.25)',
          },
        },
        paper: {
          sx: (theme) => ({
            width: { xs: 'calc(100% - 32px)', sm: 380 },
            maxWidth: 'calc(100% - 32px)',
            m: 2,
            p: 3,
            borderRadius: '24px',
            bgcolor:
              theme.palette.mode === 'light'
                ? 'rgba(255, 255, 255, 0.88)'
                : 'rgba(30, 36, 48, 0.9)',
          }),
        },
      }}
    >
      <Stack spacing={2} alignItems="center" sx={{ textAlign: 'center' }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            color: '#F5A524',
            bgcolor: alpha('#F5A524', 0.18),
          }}
        >
          <WarningAmberRoundedIcon fontSize="large" />
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>

        <Stack direction="row" spacing={1.5} sx={{ width: '100%', pt: 1 }}>
          <Button
            fullWidth
            color="inherit"
            onClick={onCancel}
            disabled={loading}
            sx={(theme) => ({ bgcolor: alpha(theme.palette.text.primary, 0.06) })}
          >
            Cancelar
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="error"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Eliminando…' : confirmLabel}
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  )
}