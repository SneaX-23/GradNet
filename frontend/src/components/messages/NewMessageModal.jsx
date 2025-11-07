import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, List, ListItem, ListItemButton, ListItemAvatar, Avatar, ListItemText, CircularProgress, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { API_BASE_URL } from '../../config';

const retroFont = "'Courier New', Courier, monospace";

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: 500,
  bgcolor: '#000000',
  color: '#ffffff',
  border: '2px solid #ffffff',
  borderRadius: 0,
  boxShadow: 'none',
  height: '70vh',
  display: 'flex',
  flexDirection: 'column',
  fontFamily: retroFont,
};

const retroTextFieldStyles = {
  '& label.Mui-focused': {
    color: '#ffffff',
  },
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
    },
  },
};


const getFullUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
};

function NewMessageModal({ open, onClose, onSelectUser }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

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
      <Box sx={modalStyle}>
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: '1px solid #555' }}>
            <IconButton onClick={onClose} sx={{ color: '#ffffff' }}><CloseIcon /></IconButton>
            <Typography variant="h6" sx={{ ml: 2, fontFamily: retroFont }}>New message</Typography>
        </Box>
        <Box sx={{ p: 2 }}>
            <TextField
                fullWidth
                autoFocus
                variant="outlined"
                placeholder="Search for people"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={retroTextFieldStyles}
            />
        </Box>
        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
            {loading && <Box sx={{display: 'flex', justifyContent: 'center', p:2}}><CircularProgress size={24} sx={{ color: '#ffffff' }} /></Box>}
            <List>
                {results.map((user) => (
                    <ListItem key={user.id} disablePadding>
                        <ListItemButton 
                          onClick={() => handleSelect(user)}
                          sx={{
                            '&:hover': {
                              backgroundColor: '#333333'
                            }
                          }}
                        >
                            <ListItemAvatar>
                                <Avatar src={getFullUrl(user.profile_picture_url)} sx={{ border: '1px solid #ffffff' }} />
                            </ListItemAvatar>
                            <ListItemText 
                              primary={user.name} 
                              secondary={`@${user.handle}`} 
                              primaryTypographyProps={{ fontFamily: retroFont, color: '#ffffff' }}
                              secondaryTypographyProps={{ fontFamily: retroFont, color: '#aaaaaa' }}
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