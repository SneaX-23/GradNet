import React from 'react';
import Sidebar from '../components/layout/Sidebar';
import { Box, Typography } from '@mui/material';

function ProfilePage() {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4">
          Profile Page
        </Typography>
        <Typography paragraph>
        </Typography>
      </Box>
    </Box>
  );
}

export default ProfilePage;