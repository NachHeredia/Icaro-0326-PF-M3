import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Typography } from '@mui/material'

export default function NotFoundPage() {
  return (
    <Box sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h3" sx={{ fontWeight: 700 }}>
        404
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
        Esta página no existe.
      </Typography>
      <Button component={RouterLink} to="/tareas" variant="contained">
        Ir a mis tareas
      </Button>
    </Box>
  )
}