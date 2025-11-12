import { createTheme } from '@mui/material/styles';

const retroFont = "'Courier New', Courier, monospace";

export const theme = createTheme({
  typography: {
    fontFamily: retroFont,
    allVariants: {
      color: '#ffffff',
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#ffffff',
      contrastText: '#000000',
    },
    background: {
      default: '#000000',
      paper: '#000000',
    },
    text: {
      primary: '#ffffff',
      secondary: '#aaaaaa',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#000000',
          color: '#ffffff',
          fontFamily: retroFont,
          imageRendering: 'pixelated', 
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: retroFont,
          borderRadius: 0,
          border: '2px solid #ffffff',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: '#ffffff',
            color: '#000000',
          },
        },
        contained: {
          backgroundColor: '#ffffff',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#000000',
            color: '#ffffff',
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          fontFamily: retroFont,
          borderRadius: 0,
          border: '2px solid #ffffff',
          backgroundColor: '#ffffff',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#000000',
            color: '#ffffff',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
          border: '2px solid #ffffff',
          borderRadius: 0,
          boxShadow: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
          color: '#ffffff',
          borderRadius: 0,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          border: '2px solid #ffffff',
          boxShadow: 'none',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#000000',
          borderBottom: '2px solid #ffffff',
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#000000',
          borderRight: '2px solid #ffffff',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          fontFamily: retroFont,
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#333333',
          },
          '&.Mui-selected': {
            backgroundColor: '#ffffff',
            color: '#000000',
            '& .MuiListItemIcon-root': {
              color: '#000000',
            },
            '&:hover': {
              backgroundColor: '#ffffff',
            },
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#ffffff',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& label, & label.Mui-focused': {
            color: '#ffffff',
            fontFamily: retroFont,
          },
          '& .MuiInputBase-input': {
            color: '#ffffff',
            fontFamily: retroFont,
          },
          '& .MuiOutlinedInput-root': {
            fontFamily: retroFont,
            color: '#ffffff',
            borderRadius: 0,
            '& fieldset': {
              borderColor: '#ffffff',
              borderWidth: '2px',
            },
            '&:hover fieldset': {
              borderColor: '#ffffff',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ffffff',
            },
          },
          '& .MuiInput-underline:before': { 
            borderBottomColor: '#ffffff',
          },
          '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
            borderBottomColor: '#ffffff',
          },
          '& .MuiInput-underline:after': { 
            borderBottomColor: '#ffffff',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          '.MuiOutlinedInput-notchedOutline': {
            borderColor: '#ffffff',
          },
        },
        icon: {
          color: '#ffffff',
        }
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          border: '2px solid #ffffff',
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          '& .MuiSlider-thumb': {
            backgroundColor: '#ffffff',
            border: '2px solid #000000',
            borderRadius: 0,
          },
          '& .MuiSlider-track': {
            backgroundColor: '#ffffff',
            border: 'none',
          },
          '& .MuiSlider-rail': {
            backgroundColor: '#555555',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          backgroundColor: '#333',
          color: 'red',
          fontFamily: retroFont,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          color: '#ffffff',
        },
        indicator: {
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: retroFont,
          textTransform: 'none',
          fontWeight: 'bold',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          borderRadius: 0,
          '&:hover': {
            backgroundColor: '#333333',
          }
        }
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          border: '2px solid #ffffff',
          borderRadius: 0,
        }
      }
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#ffffff',
        }
      }
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: retroFont,
          '&:hover': {
            backgroundColor: '#333',
          }
        }
      }
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          paddingLeft: 0,
          paddingRight: 0,
        }
      }
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: retroFont,
          fontWeight: 'bold',
        }
      }
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          borderColor: '#ffffff',
        }
      }
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          paddingRight: 24,
          paddingBottom: 16,
        }
      }
    }
  },
});