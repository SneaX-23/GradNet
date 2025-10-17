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
const retroFont = "'Courier New', Courier, monospace";

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
        borderLeft: '2px solid #ffffff', // White border
        bgcolor: '#000000', // Black background
        color: '#ffffff', // White text
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        fontFamily: retroFont,
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
                <SearchIcon sx={{ color: '#ffffff' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              fontFamily: retroFont,
              color: '#ffffff',
              backgroundColor: '#000000',
              borderRadius: 0, // No rounded corners
              '& fieldset': {
                borderColor: '#ffffff', // White border
                borderWidth: '2px',
              },
              '&:hover fieldset': {
                borderColor: '#ffffff',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#ffffff',
                outline: '2px dashed #ffffff',
                outlineOffset: '2px',
              },
            },
            '& .MuiInputBase-input': {
              color: '#ffffff', // White text for input
            },
          }}
        />
      </Box>

      {/* Inbox Section */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          border: '2px solid #ffffff', // White border
          borderRadius: 0, // No rounded corners
          bgcolor: '#000000', // Black background
          color: '#ffffff',
          fontFamily: retroFont,
          minHeight: '200px'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <InboxIcon sx={{ color: '#ffffff' }} />
          <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: retroFont, color: '#ffffff' }}>
            Inbox
          </Typography>
        </Box>
        <Divider sx={{ borderColor: '#ffffff', mb: 2 }} />
        
        {/* Empty State */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4,
            color: '#ffffff'
          }}
        >
          <InboxIcon sx={{ fontSize: 48, mb: 1, opacity: 0.7 }} />
          <Typography variant="body2" sx={{ fontFamily: retroFont, color: '#ffffff' }}>
            No messages yet
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default RightSidebar;