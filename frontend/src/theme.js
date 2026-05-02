import { createTheme } from '@mui/material';

/**
 * theme.js
 * 
 * Defines the color palettes and component overrides for both 
 * Light and Dark modes.
 */
export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // LIGHT MODE
          primary: {
            main: '#FF6B35',
            contrastText: '#FFFFFF',
          },
          secondary: {
            main: '#2D3436',
          },
          background: {
            default: '#FAFAFA',
            paper: '#FFFFFF',
          },
          text: {
            primary: '#2D3436',
            secondary: '#636E72',
          },
          divider: 'rgba(0, 0, 0, 0.08)',
        }
      : {
          // DARK MODE (Professional Elevated Greys)
          primary: {
            main: '#FF8F65', // Softer, less vibrant orange for dark mode
            contrastText: '#FFFFFF',
          },
          secondary: {
            main: '#B0B0B0',
          },
          background: {
            default: '#121212', // Pure black is too harsh, we use deep grey
            paper: '#1E1E1E',   // Elevated surfaces
          },
          text: {
            primary: '#EAEAEA',
            secondary: '#B0B0B0',
          },
          divider: 'rgba(255, 255, 255, 0.08)',
        }),
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none', // Prevents the default MUI white overlay on elevated papers
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
  },
});
