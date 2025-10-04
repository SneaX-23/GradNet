import React, { useState } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  Paper,
  Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InboxIcon from '@mui/icons-material/Inbox';

const rightSidebarWidth = 320;

function RightSidebar() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    //  search functionality
  };

  return (
    <Box
      sx={{
        width: rightSidebarWidth,
        flexShrink: 0,
        position: 'fixed',
        right: 0,
        top: 64,
        height: 'calc(100vh - 64px)',
        overflowY: 'auto',
        borderLeft: '1px solid #eee',
        bgcolor: 'background.paper',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}
    >
      {/* Search Box */}
      <Box>
        <TextField
          fullWidth
          size="small"
          placeholder="Search GradNet"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '20px',
              bgcolor: '#f0f2f5',
              '& fieldset': {
                border: 'none',
              },
              '&:hover fieldset': {
                border: 'none',
              },
              '&.Mui-focused fieldset': {
                border: '1px solid #1976d2',
              },
            },
          }}
        />
      </Box>

      {/* Inbox Section */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          border: '1px solid #eee',
          borderRadius: '12px',
          minHeight: '200px'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <InboxIcon color="action" />
          <Typography variant="h6" fontWeight="bold">
            Inbox
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        
        {/* Empty State */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4,
            color: 'text.secondary'
          }}
        >
          <InboxIcon sx={{ fontSize: 48, mb: 1, opacity: 0.3 }} />
          <Typography variant="body2" color="text.secondary">
            No messages yet
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default RightSidebar;