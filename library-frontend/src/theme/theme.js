import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#7c4dff' },
    background: { default: '#f0f2f5', paper: '#ffffff' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
    h4: { fontWeight: 800 },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, textTransform: 'none', fontWeight: 700, py: 1.5 }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: { '&.MuiOutlinedInput-root': { borderRadius: 12 } }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: { borderRadius: 20 }
      }
    }
  }
});