import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Box, Avatar, Typography, Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 240;

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
       
        <Box>
          <Toolbar />
          <List>
            <ListItem disablePadding>
              <ListItemButton component={NavLink} to="/home" end>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={NavLink} to="/profile">
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
        <Box sx={{ marginTop: 'auto', p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Avatar src={user?.profile_image_url}>
               {!user?.profile_image_url && (user?.name ? user.name.charAt(0).toUpperCase() : 'U')}
            </Avatar>
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="body1" fontWeight="bold" noWrap>{user?.name}</Typography>
              <Typography variant="body2" color="text.secondary" noWrap>@{user?.handle}</Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            fullWidth
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}

export default Sidebar;