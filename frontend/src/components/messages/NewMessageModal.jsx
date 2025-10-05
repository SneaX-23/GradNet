import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, List, ListItem, ListItemButton, ListItemAvatar, Avatar, ListItemText, CircularProgress, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '16px',
  height: '70vh',
  display: 'flex',
  flexDirection: 'column'
};

const backendUrl = 'http://localhost:3000';
const getFullUrl = (path) => {
  if (!path) return null;
  return path.startsWith('http') ? path : `${backendUrl}${path}`;
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
        const response = await fetch(`/api/users/search?q=${searchQuery}`);
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
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: '1px solid #ddd' }}>
            <IconButton onClick={onClose}><CloseIcon /></IconButton>
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
        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
            {loading && <Box sx={{display: 'flex', justifyContent: 'center', p:2}}><CircularProgress size={24} /></Box>}
            <List>
                {results.map((user) => (
                    <ListItem key={user.id} disablePadding>
                        <ListItemButton onClick={() => handleSelect(user)}>
                            <ListItemAvatar>
                                <Avatar src={getFullUrl(user.profile_picture_url)} />
                            </ListItemAvatar>
                            <ListItemText primary={user.name} secondary={`@${user.handle}`} />
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