import { createTheme, responsiveFontSizes, PaletteOptions } from '@mui/material/styles';

// Extend PaletteOptions to include custom colors
declare module '@mui/material/styles' {
  interface Palette {
    accent1: { main: string };
    accent2: { main: string };
  }

  interface PaletteOptions {
    accent1?: { main: string };
    accent2?: { main: string };
  }
}

// Define custom colors
const customColors = {
  accent1: '#4CAF50', // Green (complements blue primary)
  accent2: '#FF9800', // Orange (adds warmth)
};

// Function to create a theme based on system mode
const getTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode, // Auto-switch between light/dark mode
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
      accent1: {
        main: customColors.accent1,
      },
      accent2: {
        main: customColors.accent2,
      },
    } as PaletteOptions, // Fix TypeScript error
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif', // Set default font
    },
  });

// Make fonts responsive
export const lightTheme = responsiveFontSizes(getTheme('light'));
export const darkTheme = responsiveFontSizes(getTheme('dark'));
