import { createTheme } from "@mui/material/styles";

const retroFont = "'Courier New', Courier, monospace";

const p = {
  backgroundColor: "#1B1B1D",   
  surfaceColor: "#2D2D31",      
  textColor: "#FFFFFF",
  secondaryTextColor: "#B3B3B3",
  primaryBlue: "#009CFF",
  borderColor: "#3A3A3C",
};

const c = {
  border: `2px solid ${p.borderColor}`,
  borderRadius: 0,
  fontFamily: retroFont,
  textColor: p.textColor,
  bgColor: p.backgroundColor,
  borderColor: p.borderColor,
  surfaceColor: p.surfaceColor,
};

export const theme = createTheme({
  spacing: 8,

  palette: {
    mode: "dark",
    primary: {
      main: p.primaryBlue,
      contrastText: "#FFFFFF",
    },
    background: {
      default: p.backgroundColor,
      paper: p.surfaceColor,
    },
    text: {
      primary: p.textColor,
      secondary: p.secondaryTextColor,
    },
    divider: p.borderColor,
  },

  typography: {
    fontFamily: retroFont,
    allVariants: {
      color: p.textColor,
      letterSpacing: "0.3px",
    },
    h1: { fontSize: "2.4rem", fontWeight: 700 },
    h2: { fontSize: "2rem", fontWeight: 700 },
    h3: { fontSize: "1.7rem", fontWeight: 600 },
    h4: { fontSize: "1.4rem", fontWeight: 600 },
    h5: { fontSize: "1.2rem", fontWeight: 600 },
    h6: { fontSize: "1.05rem", fontWeight: 600 },
    body1: { fontSize: "1rem", lineHeight: 1.6 },
    body2: { fontSize: "0.92rem", lineHeight: 1.55 },
    button: { fontWeight: 600, letterSpacing: "0.6px" },
  },

  shadows: Array(25)
    .fill("none")
    .map((_, i) =>
      i === 1
        ? "0px 2px 6px rgba(0,0,0,0.04)"
        : i === 2
        ? "0px 4px 10px rgba(0,0,0,0.06)"
        : "none"
    ),

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: p.backgroundColor,
          color: p.textColor,
          fontFamily: retroFont,
          transition: "background-color 0.3s ease, color 0.3s ease",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: p.surfaceColor,
          border: c.border,
          borderRadius: 0,
          color: p.textColor,
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: p.surfaceColor,
          borderRight: c.border,   
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: { borderColor: p.borderColor, opacity: 1 },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: c.border,
          "&:hover": {
            backgroundColor: p.primaryBlue,
            color: "#FFFFFF",
          },
        },
        contained: {
          backgroundColor: p.primaryBlue,
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#007ACC",
          },
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          "&.Mui-selected": {
            backgroundColor: p.primaryBlue,
            color: "#FFFFFF",
          },
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.1)",
          },
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 0,
            backgroundColor: "#2D2D31",
            "& fieldset": {
              borderColor: p.borderColor,
              borderWidth: "2px",
            },
            "&:hover fieldset": { borderColor: p.primaryBlue },
            "&.Mui-focused fieldset": { borderColor: p.primaryBlue },
          },
        },
      },
    },
  },
});
