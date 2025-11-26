import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, List, ListItem, ListItemButton, ListItemAvatar, Avatar, ListItemText, CircularProgress, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { API_BASE_URL } from '../../config';
import { useTheme } from '@mui/material/styles';
import { theme, colors, borderStyle, shadowHover, shadowStyle } from '../../theme';

const getFullUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
};

function NewMessageModal({ open, onClose, onSelectUser }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme()
  useEffect(() => {
    if (!open) {
        setSearchQuery('');
        setResults([]);
        return;
    }

    if (searchQuery.trim() === '') {
      setResults([]);
      return;
    }

    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/search?q=${searchQuery}`, { credentials: 'include' });
        const data = await response.json();
        if (data.success) {
          setResults(data.users);
        }
      } catch (error) {
        console.error("Failed to search users:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
        fetchUsers();
    }, 300); 

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, open]);

  const handleSelect = (user) => {
    onSelectUser(user);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        maxWidth: 500,
        height: '70vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: colors.white,
        border: borderStyle,
        boxShadow: shadowStyle
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: '1px solid #555' }}>
            <IconButton onClick={onClose} sx={{ color: '#000000' }}><CloseIcon /></IconButton>
            <Typography variant="h6" sx={{ ml: 2 }}>New message</Typography>
        </Box>
        <Box sx={{ p: 2 }}>
            <TextField
                fullWidth
                autoFocus
                variant="outlined"
                placeholder="Search for people"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </Box>
        <Box sx={{ flexGrow: 1, overflowY: 'auto' ,}}>
            {loading && <Box sx={{display: 'flex', justifyContent: 'center', p:2}}><CircularProgress size={24} sx={{ color: '#ffffff' }} /></Box>}
            <List>
                {results.map((user, index) => (
                    <ListItem key={user.id} disablePadding 
                    sx={{
                            border: borderStyle,
                            borderLeft: '0px',
                            borderRight: '0px',
                            backgroundColor: theme.palette.secondary.light,
                            marginBottom: 0,
                            
                            marginTop: index === 0 ? 0 : '-2px',
                            position: 'relative', 
                            transition: 'all 0.1s ease',
                            '&:hover': {
                                backgroundColor: theme.palette.background.paper,
                                boxShadow: `3px 3px 0px ${shadowHover}`,
                                transform: 'translate(-2px, -2px)'
                            },
                            '&:active': {
                                boxShadow: 'none',
                                transform: 'translate(1px, 1px)'
                            }
                        
                    }}>
                        <ListItemButton 
                          onClick={() => handleSelect(user)}
                        >
                            <ListItemAvatar>
                                <Avatar src={getFullUrl(user.profile_picture_url)} sx={{ border: '1px solid #000000' }} />
                            </ListItemAvatar>
                            <ListItemText 
                              primary={user.name} 
                              secondary={`@${user.handle}`} 
                              primaryTypographyProps={{ color: '#000000' }}
                              secondaryTypographyProps={{ color: '#000000' }}
                              sx={{
                              }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
      </Box>
    </Modal>
  );
}

export default NewMessageModal;