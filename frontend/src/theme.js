import { createTheme } from '@mui/material/styles';
const retroFont = "'Courier New', Courier, monospace";

const lightPalette = {
  backgroundColor: '#e9f0f7',
  textColor: '#1e3a5f',
  secondaryTextColor: '#4a5568',
  borderColor: '#a7c2da',
};

const darkPalette = {
  backgroundColor: '#1e293b',     
  textColor: '#f1f5f9',           
  secondaryTextColor: '#94a3b8',  
  borderColor: '#475569',         
};

const getCommonStyles = (palette) => ({
  border: `2px solid ${palette.borderColor}`,
  borderRadius: 0,
  fontFamily: retroFont,
  textColor: palette.textColor,
  bgColor: palette.backgroundColor,
  borderColor: palette.borderColor,
});

export const getDesignTokens = (mode) => {
  const palette = mode === 'dark' ? darkPalette : lightPalette;
  const commonStyles = getCommonStyles(palette);

  return createTheme({
    palette: {
      mode,
      primary: {
        main: commonStyles.textColor,
        contrastText: commonStyles.bgColor,
      },
      background: {
        default: commonStyles.bgColor,
        paper: commonStyles.bgColor,
      },
      text: {
        primary: commonStyles.textColor,
        secondary: palette.secondaryTextColor,
      },
      divider: commonStyles.borderColor,
    },
    typography: {
      fontFamily: commonStyles.fontFamily,
      allVariants: { color: commonStyles.textColor },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: commonStyles.bgColor,
            color: commonStyles.textColor,
            fontFamily: commonStyles.fontFamily,
            imageRendering: 'pixelated',
            transition: 'background-color 0.3s ease, color 0.3s ease',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            fontFamily: commonStyles.fontFamily,
            borderRadius: commonStyles.borderRadius,
            border: commonStyles.border,
            textTransform: 'none',
            color: commonStyles.textColor,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: commonStyles.textColor,
              color: commonStyles.bgColor,
            },
          },
          contained: {
            backgroundColor: commonStyles.textColor,
            color: commonStyles.bgColor,
            '&:hover': {
              backgroundColor: commonStyles.borderColor,
              color: commonStyles.textColor,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: commonStyles.bgColor,
            border: commonStyles.border,
            borderRadius: commonStyles.borderRadius,
            boxShadow: 'none',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: commonStyles.bgColor,
            color: commonStyles.textColor,
            borderRadius: commonStyles.borderRadius,
            border: commonStyles.border, 
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            border: commonStyles.border,
            backgroundColor: commonStyles.bgColor,
            boxShadow: 'none',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: commonStyles.bgColor,
            borderBottom: commonStyles.border,
            boxShadow: 'none',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: commonStyles.bgColor,
            borderRight: commonStyles.border, 
          },
        },
      },
      MuiDivider: {
        styleOverrides: {
          root: {
            borderColor: commonStyles.borderColor,
            opacity: 1,
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            border: commonStyles.border,
            borderRadius: commonStyles.borderRadius,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            fontFamily: commonStyles.fontFamily,
            color: commonStyles.textColor,
            '&:hover': {
              backgroundColor:
                mode === 'dark'
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(30,58,95,0.1)',
            },
            '&.Mui-selected': {
              backgroundColor: commonStyles.textColor,
              color: commonStyles.bgColor,
              '& .MuiListItemIcon-root': {
                color: commonStyles.bgColor,
              },
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: commonStyles.textColor,
            borderRadius: commonStyles.borderRadius,
            '&:hover': {
              backgroundColor:
                mode === 'dark'
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(30,58,95,0.1)',
            },
          },
        },
      },
      MuiTabs: {
        styleOverrides: {
          root: {
            color: commonStyles.textColor,
          },
          indicator: {
            backgroundColor: commonStyles.borderColor,
          },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: {
            fontFamily: commonStyles.fontFamily,
            textTransform: 'none',
            fontWeight: 'bold',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& label, & label.Mui-focused': {
              color: commonStyles.textColor,
              fontFamily: commonStyles.fontFamily,
            },
            '& .MuiInputBase-input': {
              color: commonStyles.textColor,
              fontFamily: commonStyles.fontFamily,
            },
            '& .MuiOutlinedInput-root': {
              fontFamily: commonStyles.fontFamily,
              color: commonStyles.textColor,
              borderRadius: commonStyles.borderRadius,
              '& fieldset': {
                borderColor: commonStyles.borderColor,
                borderWidth: '2px',
              },
              '&:hover fieldset': {
                borderColor: commonStyles.textColor,
              },
              '&.Mui-focused fieldset': {
                borderColor: commonStyles.textColor,
              },
            },
          },
        },
      },
    },
  });
};
