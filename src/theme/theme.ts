import { createTheme, PaletteColor, PaletteColorOptions } from '@mui/material/styles';

// Extending the Palette interface to include custom colors
declare module '@mui/material/styles' {
  interface Palette {
    blue: PaletteColor;
    green: PaletteColor;
    offBlue: PaletteColor;
  }
  
  interface PaletteOptions {
    blue: PaletteColorOptions;
    green: PaletteColorOptions;
    offBlue: PaletteColorOptions;
  }
}

export const theme = createTheme({
  palette: {
    blue: {
      main: "#718EBF",  // Blue for today
    },
    offBlue: {
      main: "#718EBF"
    },
    green: {
      main: "#35D187",  // Green for ride days
    },
    primary: {
      main: "#34D399",  // Teacher
    },
    secondary: {
      main: "#FBBF24",  // Student?
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "9999px",
          textTransform: "none", // Prevents all-caps text
          padding: "12px 0",
          fontSize: "1rem",
        },
      },
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
});
