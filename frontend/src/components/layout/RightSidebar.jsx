import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InboxIcon from '@mui/icons-material/Inbox';
import ConversationList from '../messages/ConversationList.jsx'; 
import { searchUsers } from '../../services/userService.jsx'; 
import { API_BASE_URL } from '../../config.js';

const rightSidebarWidth = 320;

const getFullUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
};

function RightSidebar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setSearchError('');
      return;
    }

    setIsSearchLoading(true);
    const debounceTimer = setTimeout(async () => {
      try {
        setSearchError('');
        const data = await searchUsers(searchQuery);
        setSearchResults(data.users);
      } catch (err) {
        setSearchError(err.message);
      } finally {
        setIsSearchLoading(false);
      }
    }, 500); 

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);


  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleUserClick = (handle) => {
    setSearchQuery('');
    setSearchResults([]);
    navigate(`/profile/${handle}`);
  };


  const handleSelectConversation = (conversation) => {
    navigate('/messages');
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
        borderLeft: '2px solid #ffffff', 
        display: 'flex',
        flexDirection: 'column',
      }}
    >

      <Box sx={{ p: 2, borderBottom: '2px solid #333' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search GradNet"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {isSearchLoading ? (
                  <CircularProgress size={20} sx={{ color: '#ffffff' }} />
                ) : (
                  <SearchIcon sx={{ color: '#ffffff' }} />
                )}
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        {searchQuery.trim().length > 0 ? (
          
          <Paper
            elevation={0}
            sx={{
              p: 0,
              border: 'none',
            }}
          >
            {searchError && <Typography sx={{p: 2, color: 'red'}}>{searchError}</Typography>}
            
            <List disablePadding>
              {searchResults.length > 0 ? (
                searchResults.map((user) => (
                  <ListItem key={user.id} disablePadding>
                    <ListItemButton onClick={() => handleUserClick(user.handle)}>
                      <ListItemAvatar>
                        <Avatar src={getFullUrl(user.profile_picture_url)} sx={{border: '1px solid #fff'}} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={user.name}
                        secondary={`@${user.handle}`}
                        primaryTypographyProps={{ fontWeight: 'bold' }}
                        secondaryTypographyProps={{ color: '#aaa' }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))
              ) : (
                !isSearchLoading && !searchError && (
                  <Typography sx={{ p: 2, color: '#aaa', textAlign: 'center' }}>
                    No users found for "{searchQuery}"
                  </Typography>
                )
              )}
            </List>
          </Paper>
        ) : (
          <Paper
            elevation={0}
            sx={{
              border: 'none',
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2 }}>
              <InboxIcon />
              <Typography variant="h6" fontWeight="bold">
                Inbox
              </Typography>
            </Box>
            <Divider sx={{ borderColor: '#ffffff' }} />
            
  
            <ConversationList onSelectConversation={handleSelectConversation} />
            
          </Paper>
        )}
      </Box>
    </Box>
  );
}

export default RightSidebar;