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
import ConversationList from '../messages/ConversationList'; 
import { searchUsers } from '../../services/userService'; 
import { API_BASE_URL } from '../../config';

const rightSidebarWidth = 320;
const retroFont = "'Courier New', Courier, monospace";

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
        bgcolor: '#000000', 
        color: '#ffffff', 
        fontFamily: retroFont,
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
          sx={{
            '& .MuiOutlinedInput-root': {
              fontFamily: retroFont,
              color: '#ffffff',
              backgroundColor: '#000000',
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
                outline: '2px dashed #ffffff',
                outlineOffset: '2px',
              },
            },
            '& .MuiInputBase-input': {
              color: '#ffffff', 
            },
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
              borderRadius: 0,
              bgcolor: '#000000',
              color: '#ffffff',
              fontFamily: retroFont,
            }}
          >
            {searchError && <Typography sx={{p: 2, color: 'red', fontFamily: retroFont}}>{searchError}</Typography>}
            
            <List disablePadding>
              {searchResults.length > 0 ? (
                searchResults.map((user) => (
                  <ListItem key={user.id} disablePadding>
                    <ListItemButton onClick={() => handleUserClick(user.handle)} sx={{'&:hover': {bgcolor: '#333'}}}>
                      <ListItemAvatar>
                        <Avatar src={getFullUrl(user.profile_picture_url)} sx={{border: '1px solid #fff'}} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={user.name}
                        secondary={`@${user.handle}`}
                        primaryTypographyProps={{ fontFamily: retroFont, color: '#fff', fontWeight: 'bold' }}
                        secondaryTypographyProps={{ fontFamily: retroFont, color: '#aaa' }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))
              ) : (
                !isSearchLoading && !searchError && (
                  <Typography sx={{ p: 2, fontFamily: retroFont, color: '#aaa', textAlign: 'center' }}>
                    No users found for "{searchQuery}"
                  </Typography>
                )
              )}
            </List>
          </Paper>
        ) : (
          // --- INBOX SECTION ---
          <Paper
            elevation={0}
            sx={{
              border: 'none',
              borderRadius: 0, 
              bgcolor: '#000000',
              color: '#ffffff',
              fontFamily: retroFont,
              height: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 2 }}>
              <InboxIcon sx={{ color: '#ffffff' }} />
              <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: retroFont, color: '#ffffff' }}>
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