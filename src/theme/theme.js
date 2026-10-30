import { createTheme, alpha } from '@mui/material/styles'

const palettes = {
  light: {
    primary: { main: '#3B6FF5' },
    secondary: { main: '#64748B' },
    background: { default: '#EEF1F7', paper: 'rgba(255, 255, 255, 0.72)' },
    text: { primary: '#1B2130', secondary: '#667085' },
    divider: 'rgba(27, 33, 48, 0.08)',
  },
  dark: {
    primary: { main: '#6C95FF' },
    secondary: { main: '#94A3B8' },
    background: { default: '#0E1118', paper: 'rgba(30, 36, 48, 0.72)' },
    text: { primary: '#E8ECF4', secondary: '#9AA4B5' },
    divider: 'rgba(232, 236, 244, 0.10)',
  },
}

export const getTheme = (mode) => {
  const p = palettes[mode]

  return createTheme({
    palette: { mode, ...p },
    shape: { borderRadius: 16 }, 
    typography: {
      fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
      button: { textTransform: 'none', fontWeight: 600 },
      h6: { fontWeight: 700 },
    },
    components: {
      // Fondo con degradé suave en toda la app
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundImage:
              mode === 'light'
                ? 'linear-gradient(135deg, #EEF1F7 0%, #DDE6FB 100%)'
                : 'linear-gradient(135deg, #0E1118 0%, #162036 100%)',
            backgroundAttachment: 'fixed',
            minHeight: '100vh',
          },
        },
      },
     
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backdropFilter: 'blur(16px)',
            border: `1px solid ${p.divider}`,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: { borderRadius: 18, boxShadow: 'none' },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: { root: { borderRadius: 12 } },
      },
      MuiOutlinedInput: {
        styleOverrides: { root: { borderRadius: 12 } },
      },
      MuiDialog: {
        styleOverrides: { paper: { borderRadius: 24 } },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: alpha(mode === 'light' ? '#FFFFFF' : '#1E2430', 0.72),
            backdropFilter: 'blur(20px)',
          },
        },
      },
      MuiChip: {
        styleOverrides: { root: { borderRadius: 10 } },
      },
    },
  })
}