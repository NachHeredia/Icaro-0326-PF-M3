import { useState } from 'react'
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded'
import ThemeToggle from './ThemeToggle'

export const SIDEBAR_WIDTH = 248
const MARGIN = 16

function SidebarContent() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2 }}>
      <Typography variant="h6" sx={{ px: 1.5, py: 1, letterSpacing: 1 }}>
        TO DO
      </Typography>

      <List sx={{ mt: 3, flexGrow: 1 }}>
        <ListItemButton selected sx={{ borderRadius: '14px' }}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <TaskAltRoundedIcon color="primary" />
          </ListItemIcon>
          <ListItemText
            primary="Tasks"
            primaryTypographyProps={{ fontWeight: 600 }}
          />
        </ListItemButton>
      </List>

      <Box>
        <ThemeToggle />
      </Box>
    </Box>
  )
}

export default function Sidebar() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [open, setOpen] = useState(false)

  if (isMobile) {
    return (
      <>
        <AppBar
          position="fixed"
          color="transparent"
          elevation={0}
          sx={{ borderRadius: 0, borderWidth: '0 0 1px 0' }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="Abrir menú"
              onClick={() => setOpen(true)}
            >
              <MenuRoundedIcon />
            </IconButton>
            <Typography
              variant="h6"
              sx={{ flexGrow: 1, textAlign: 'center', letterSpacing: 1 }}
            >
              TO DO
            </Typography>
            <Box sx={{ width: 40 }} />
          </Toolbar>
        </AppBar>

        <Drawer
          variant="temporary"
          open={open}
          onClose={() => setOpen(false)}
          ModalProps={{ keepMounted: true }}
          PaperProps={{ sx: { width: SIDEBAR_WIDTH } }}
        >
          <SidebarContent />
        </Drawer>
      </>
    )
  }

  return (
    <Drawer
      variant="permanent"
      sx={{ width: SIDEBAR_WIDTH + MARGIN * 2, flexShrink: 0 }}
      PaperProps={{
        sx: {
          width: SIDEBAR_WIDTH,
          m: `${MARGIN}px`,
          height: `calc(100% - ${MARGIN * 2}px)`,
          borderRadius: '24px',
        },
      }}
    >
      <SidebarContent />
    </Drawer>
  )
}
