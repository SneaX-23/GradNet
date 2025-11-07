import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, 
  Toolbar, Box, Avatar, Typography, Menu, MenuItem 
} from '@mui/material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../context/AuthContext';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import MailOutlineTwoToneIcon from '@mui/icons-material/MailOutlineTwoTone';
import ForumTwoToneIcon from '@mui/icons-material/ForumTwoTone';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import DashboardIcon from '@mui/icons-material/Dashboard'; 
import BookmarkIcon from '@mui/icons-material/Bookmark'; 
import { API_BASE_URL } from '../../config';

const drawerWidth = 240;


// Retro styles
const retroFont = "'Courier New', Courier, monospace";
const retroSx = {
    fontFamily: retroFont,
    color: '#ffffff', 
    '&.Mui-selected': { 
        backgroundColor: '#ffffff',
        color: '#000000',
        '& .MuiListItemIcon-root': {
            color: '#000000',
        },
        '&:hover': {
            backgroundColor: '#ffffff', 
        }
    },
    '&:hover': { // Hover style
        backgroundColor: '#333333',
    },
    '& .MuiListItemIcon-root': {
        color: '#ffffff',
    },
    '& .MuiListItemText-primary': { 
        fontFamily: retroFont,
    }
};

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

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

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box',
            backgroundColor: '#000000', 
            borderRight: '2px solid #ffffff', 
            color: '#ffffff', 
         },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box>
          <Toolbar />
          <List>
            {/* --- Home Link --- */}
            <ListItem disablePadding>
              <ListItemButton component={NavLink} to="/home" end sx={retroSx}>
                <ListItemIcon>
                  <HomeOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>
            
            {/* --- Dashboard Link --- */}
            {user && (user.role === 'admin' || user.role === 'faculty') && (
              <ListItem disablePadding>
                <ListItemButton component={NavLink} to="/dashboard" sx={retroSx}>
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
              </ListItem>
            )}

            {/* --- Jobs Link --- */}
            <ListItem disablePadding>
              <ListItemButton component={NavLink} to="/jobs" sx={retroSx}>
                <ListItemIcon>
                  <WorkOutlineOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Jobs" />
              </ListItemButton>
            </ListItem>

            {/* --- Messages Link --- */}
            <ListItem disablePadding>
              <ListItemButton component={NavLink} to="/messages" sx={retroSx}>
                <ListItemIcon>
                  <MailOutlineTwoToneIcon />
                </ListItemIcon>
              <ListItemText primary="Messages" />
            </ListItemButton>
            </ListItem>

            {/* --- Forums Link --- */}
            <ListItem disablePadding>
              <ListItemButton component={NavLink} to="/forums" sx={retroSx}>
                <ListItemIcon>
                  <ForumTwoToneIcon />
                </ListItemIcon>
                <ListItemText primary="Forums" />
              </ListItemButton>
            </ListItem>

            {/* --- Bookmarks Link --- */}
            <ListItem disablePadding>
              <ListItemButton component={NavLink} to="/bookmarks" sx={retroSx}>
                <ListItemIcon>
                  <BookmarkIcon />
                </ListItemIcon>
                <ListItemText primary="Bookmarks" />
              </ListItemButton>
            </ListItem>

            {/* --- Profile Link --- */}
            <ListItem disablePadding>
              <ListItemButton component={NavLink} to="/profile" sx={retroSx}>
                <ListItemIcon>
                  <PersonOutlineOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>

        {/* --- User Profile Box --- */}
        <Box sx={{ marginTop: 'auto', p: 1 }}>
          <Box
            onClick={handleClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1.5,
              borderRadius: 0, 
              cursor: 'pointer',
              border: '2px dashed #333333', 
              '&:hover': {
                backgroundColor: '#333333', 
                borderColor: '#ffffff',
              }
            }}
          >
            <Avatar src={avatarUrl} sx={{ border: '2px solid #ffffff', borderRadius: 0 }}> 
               {!avatarUrl && (user?.name ? user.name.charAt(0).toUpperCase() : 'U')}
            </Avatar>
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="body1" fontWeight="bold" noWrap sx={{...retroSx}}>{user?.name}</Typography>
              <Typography variant="body2" noWrap sx={{...retroSx, color: '#aaaaaa'}} >@{user?.handle}</Typography>
            </Box>
          </Box>
          
          {/* --- Logout Menu --- */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            sx={{
              '& .MuiPaper-root': { 
                width: drawerWidth - 16, 
                mb: 1,
                backgroundColor: '#000000',
                color: '#ffffff',
                border: '2px solid #ffffff',
                borderRadius: 0,
              }
            }}
          >
            <MenuItem onClick={handleLogout} sx={{...retroSx, '&:hover': {backgroundColor: '#333333'}}}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" sx={{color: '#ffffff'}} />
              </ListItemIcon>
              <ListItemText>Logout @{user?.handle}</ListItemText>
            </MenuItem>
          </Menu>
        </Box>
      </Box>
    </Drawer>
  );
}

export default Sidebar;