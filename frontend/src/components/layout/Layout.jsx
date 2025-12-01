import React, { useState } from 'react';
import { Box, CssBaseline, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Sidebar, { drawerWidth } from './Sidebar';
import RightSidebar, { rightSidebarWidth } from './RightSidebar';

function Layout({ children, title = "GradNet",disablePadding = false }) {
  const [mobileOpenLeft, setMobileOpenLeft] = useState(false);
  const [mobileOpenRight, setMobileOpenRight] = useState(false);

  const handleDrawerToggleLeft = () => {
    setMobileOpenLeft(!mobileOpenLeft);
  };

  const handleDrawerToggleRight = () => {
    setMobileOpenRight(!mobileOpenRight);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          {/* Left Menu Button (Mobile) */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggleLeft}
            sx={{ mr: 2, display: { md: 'none' } }} 
          >
            <MenuIcon />
          </IconButton>

          {/* Title */}
          <Typography 
            variant="h6" 
            noWrap 
            component="div" 
            sx={{ 
              fontWeight: 'bold', 
              flexGrow: 1, 
              textAlign: { xs: 'center', md: 'left' } 
            }}
          >
            {title}
          </Typography>

          {/* Right Search Button (Mobile/Tablet) */}
          <IconButton
            color="inherit"
            edge="end"
            onClick={handleDrawerToggleRight}
            sx={{ display: { lg: 'none' } }} 
          >
            <SearchIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Sidebars */}
      <Sidebar 
        mobileOpen={mobileOpenLeft} 
        onClose={handleDrawerToggleLeft} 
      />
      
      {/* Main Content Area */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: disablePadding ? 0 : { xs: 1, sm: 2, md: 3 }, 
          width: '100%', 
          minWidth: 0, 
          overflowX: 'hidden', 

          marginTop: '64px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {children}
      </Box>

      <RightSidebar 
        mobileOpen={mobileOpenRight} 
        onClose={handleDrawerToggleRight} 
      />
    </Box>
  );
}

export default Layout;