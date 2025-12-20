import { createTheme } from "@mui/material/styles";


export const colors = {
  bg: '#FDF6E3',      // Cream
  green: '#D4E4BC',   // Sage/Mint
  yellow: '#FDE047',  // Bright Yellow
  orange: '#FB923C',  // Orange
  purple: '#C4B5FD',  // Soft Purple
  blue: '#93C5FD',    // Soft Blue
  black: '#18181b',   // Zinc 900
  white: '#FFFFFF'
};

//shared styles 001
export const borderStyle = `2px solid ${colors.black}`;
export const shadowStyle = `4px 4px 0px 0px ${colors.black}`;
export const shadowHover = `6px 6px 0px 0px ${colors.black}`;
export const fontSans = '"Space Grotesk", sans-serif';
export const fontMono = '"Space Mono", monospace';

export const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: colors.bg,
      paper: colors.white,
    },
    primary: {
      main: colors.yellow,
      contrastText: colors.black,
    },
    secondary: {
      main: colors.green,
      contrastText: colors.black,
    },
    error: {
      main: '#ef4444',
    },
    text: {
      primary: colors.black,
      secondary: '#4a4a4a',
    },
    divider: colors.black,
    
    neo: {
        bg: colors.bg,
        green: colors.green,
        yellow: colors.yellow,
        orange: colors.orange,
        purple: colors.purple,
        blue: colors.blue,
        black: colors.black
    }
  },
  extend: {
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      colors: {
        neo_bg: '#FDF6E3', // Cream
        neo_green: '#D4E4BC', // Sage/Mint
        neo_yellow: '#FDE047', // Bright Yellow
        neo_orange: '#FB923C', // Orange
        neo_purple: '#C4B5FD', // Soft Purple
        neo_blue: '#93C5FD', // Soft Blue
        neo_black: '#18181b', // Zinc 900
      },
      boxShadow: {
        neo: '4px 4px 0px 0px rgba(24, 24, 27, 1)',
        neo_sm: '2px 2px 0px 0px rgba(24, 24, 27, 1)',
        neo_lg: '6px 6px 0px 0px rgba(24, 24, 27, 1)',
      }
    },
  typography: {
    fontFamily: fontSans,
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { 
        fontFamily: fontMono,
        fontWeight: 700,
        textTransform: 'none'
    },
    subtitle1: { fontFamily: fontMono },
    body2: { fontFamily: fontSans },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: colors.bg,
          color: colors.black,
        },
      },
    },

    // Cards
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: borderStyle,
          boxShadow: shadowStyle,
          backgroundColor: colors.white,
          transition: 'all 0.2s ease',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: borderStyle,
        },
        elevation0: {
             boxShadow: 'none',
        },
        elevation1: {
            boxShadow: shadowStyle,
        }
      },
    },

    // Buttons
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: borderStyle,
          boxShadow: shadowStyle,
          fontWeight: 700,
          fontFamily: fontMono,
          transition: 'all 0.1s ease',
          '&:hover': {
            transform: 'translate(-2px, -2px)',
            boxShadow: shadowHover,
          },
          '&:active': {
            transform: 'translate(0px, 0px)',
            boxShadow: 'none',
          },
        },
        containedPrimary: {
            backgroundColor: colors.yellow,
            color: colors.black,
            '&:hover': { backgroundColor: '#fcd34d' }
        },
        containedSecondary: {
            backgroundColor: colors.green,
            color: colors.black,
            '&:hover': { backgroundColor: '#bef264' }
        },
        outlined: {
            backgroundColor: 'transparent',
            '&:hover': {
                backgroundColor: 'rgba(24, 24, 27, 0.05)'
            }
        },
        text: {
            border: 'none',
            boxShadow: 'none',
            '&:hover': {
                 backgroundColor: 'rgba(24, 24, 27, 0.05)',
                 transform: 'none',
                 boxShadow: 'none'
            }
        }
      },
    },
    
    // Inputs
    MuiOutlinedInput: {
        styleOverrides: {
            root: {
                borderRadius: 0,
                backgroundColor: colors.white,
                fontFamily: fontMono,
                '& fieldset': {
                    border: borderStyle,
                    borderWidth: '2px',
                },
                '&:hover fieldset': {
                    borderColor: colors.black,
                },
                '&.Mui-focused fieldset': {
                    borderColor: colors.black,
                    boxShadow: `4px 4px 0px 0px ${colors.black}`
                },
            },
            input: {
                padding: '12px 14px',
            }
        }
    },
    MuiInputLabel: {
        styleOverrides: {
            root: {
                color: '#666',
                fontFamily: fontMono,
                '&.Mui-focused': {
                    color: colors.black,
                    fontWeight: 'bold'
                }
            }
        }
    },

    // Navigation
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.green,
          color: colors.black,
          borderBottom: borderStyle,
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.bg,
          borderRight: borderStyle,
        },
      },
    },

    // Dialogs
    MuiDialog: {
        styleOverrides: {
            paper: {
                borderRadius: 0,
                border: borderStyle,
                boxShadow: shadowHover,
            }
        }
    },
    
    // Lists
    MuiListItemButton: {
        styleOverrides: {
            root: {
                '&:hover': {
                    backgroundColor: 'rgba(24, 24, 27, 0.05)',
                },
                '&.Mui-selected': {
                    backgroundColor: colors.orange,
                    border: borderStyle,
                    '&:hover': {
                        backgroundColor: colors.orange,
                    }
                }
            }
        }
    }
  },
});