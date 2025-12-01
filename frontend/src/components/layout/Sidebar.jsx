import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, 
  Toolbar, Box, Avatar, Typography, Menu, MenuItem, useMediaQuery 
} from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '/src/context/AuthContext.jsx';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import MailOutlineTwoToneIcon from '@mui/icons-material/MailOutlineTwoTone';
import ForumTwoToneIcon from '@mui/icons-material/ForumTwoTone';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard'; 
import BookmarkIcon from '@mui/icons-material/Bookmark'; 
import { API_BASE_URL } from '/src/config.js';
import { useTheme } from '@mui/material/styles';
import { theme, colors, borderStyle, shadowHover, shadowStyle } from '../../theme';

export const drawerWidth = 240;

function Sidebar({ mobileOpen, onClose, window }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme(); 
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);

  const container = window !== undefined ? () => window().document.body : undefined;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    await logout();
    navigate('/');
  };

  const avatarUrl = user?.profile_image_url
    ? (user.profile_image_url.startsWith('http') ? user.profile_image_url : `${API_BASE_URL}${user.profile_image_url}`)
    : null;

  const sidebarItemStyle = {
    mb: 1.5, 
    border: borderStyle,
    boxShadow: 'none',
    borderRadius: 0,
    bgcolor: colors.white,
    transition: 'all 0.1s ease',
    color: colors.black,
    '&:hover': {
      bgcolor: colors.white,
      boxShadow: shadowHover,
      transform: 'translate(-2px, -2px)',
    },
    '&.active': {
      bgcolor: colors.orange,
      boxShadow: shadowStyle, 
      '&:hover': {
        bgcolor: colors.orange, 
      }
    }
  };

  const textStyle = {
    primaryTypographyProps: { 
      fontFamily: theme.extend.fontFamily.mono.join(','), 
      fontWeight: 'bold' 
    }
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2 }}>
        <Box>
          <Toolbar sx={{ minHeight: '64px !important' }} /> 
          <List disablePadding>
            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton component={NavLink} to="/home" end sx={sidebarItemStyle} onClick={onClose}>
                <ListItemIcon sx={{ color: colors.black, minWidth: 40 }}>
                  <HomeOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Home" {...textStyle} />
              </ListItemButton>
            </ListItem>
            
            {user && (user.role === 'admin' || user.role === 'faculty') && (
              <ListItem disablePadding sx={{ display: 'block' }}>
                <ListItemButton component={NavLink} to="/dashboard" sx={sidebarItemStyle} onClick={onClose}>
                  <ListItemIcon sx={{ color: colors.black, minWidth: 40 }}>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" {...textStyle} />
                </ListItemButton>
              </ListItem>
            )}

            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton component={NavLink} to="/jobs" sx={sidebarItemStyle} onClick={onClose}>
                <ListItemIcon sx={{ color: colors.black, minWidth: 40 }}>
                  <WorkOutlineOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Jobs" {...textStyle} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton component={NavLink} to="/messages" sx={sidebarItemStyle} onClick={onClose}>
                <ListItemIcon sx={{ color: colors.black, minWidth: 40 }}>
                  <MailOutlineTwoToneIcon />
                </ListItemIcon>
              <ListItemText primary="Messages" {...textStyle} />
            </ListItemButton>
            </ListItem>

            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton component={NavLink} to="/forums" sx={sidebarItemStyle} onClick={onClose}>
                <ListItemIcon sx={{ color: colors.black, minWidth: 40 }}>
                  <ForumTwoToneIcon />
                </ListItemIcon>
                <ListItemText primary="Forums" {...textStyle} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton component={NavLink} to="/bookmarks" sx={sidebarItemStyle} onClick={onClose}>
                <ListItemIcon sx={{ color: colors.black, minWidth: 40 }}>
                  <BookmarkIcon />
                </ListItemIcon>
                <ListItemText primary="Bookmarks" {...textStyle} />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding sx={{ display: 'block' }}>
              <ListItemButton component={NavLink} to="/profile" sx={sidebarItemStyle} onClick={onClose}>
                <ListItemIcon sx={{ color: colors.black, minWidth: 40 }}>
                  <PersonOutlineOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" {...textStyle} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>

        <Box sx={{ marginTop: 'auto' }}>
          <Box
            onClick={handleClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1.5,
              cursor: 'pointer',
              bgcolor: colors.white,
              border: borderStyle,
              boxShadow: shadowStyle,
              transition: 'all 0.1s ease',
              '&:hover': {
                boxShadow: shadowHover,
                transform: 'translate(-2px, -2px)',
              }
            }}
          >
            <Avatar 
                src={avatarUrl} 
                sx={{ 
                    border: borderStyle, 
                    borderRadius: 0, 
                    width: 32,
                    height: 32
                }}
            > 
               {!avatarUrl && (user?.name ? user.name.charAt(0).toUpperCase() : 'U')}
            </Avatar>
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="body2" fontWeight="bold" noWrap sx={{ fontFamily: theme.extend.fontFamily.mono.join(',') }}>
                {user?.name}
              </Typography>
              <Typography variant="caption" noWrap sx={{ color: '#666', fontFamily: theme.extend.fontFamily.mono.join(',') }} >
                @{user?.handle}
              </Typography>
            </Box>
          </Box>
          
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            sx={{
              '& .MuiPaper-root': { 
                width: drawerWidth - 32, 
                mb: 1,
                border: borderStyle,
                boxShadow: shadowStyle,
                borderRadius: 0,
              }
            }}
          >
            <MenuItem onClick={handleLogout} sx={{ fontFamily: theme.extend.fontFamily.mono.join(',') }}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={`Logout @${user?.handle}`} primaryTypographyProps={{ fontFamily: 'inherit' }} />
            </MenuItem>
          </Menu>
        </Box>
      </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      aria-label="mailbox folders"
    >
      {/* Mobile Drawer */}
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            backgroundColor: colors.bg, 
            borderRight: borderStyle, 
          },
        }}
      >
        {drawerContent}
      </Drawer>
      
      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            backgroundColor: colors.bg, 
            borderRight: borderStyle,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}

export default Sidebar;