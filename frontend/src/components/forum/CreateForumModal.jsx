import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography } from '@mui/material';
import { createForum } from '/src/services/ForumService.jsx';

function CreateForumModal({ open, onClose, onForumCreated }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!name.trim()) {
            setError('Forum name is required.');
            return;
        }
        setError('');
        try {
            await createForum({ name, description, color: '#4a90e2' }); 
            onForumCreated(); 
            setName(''); 
            setDescription('');
            onClose(); 
        } catch (err) {
            setError(err.message);
        }
    };

    const handleClose = () => {
        setName(''); 
        setDescription('');
        setError('');
        onClose();
    }

    return (
        <Dialog 
          open={open} 
          onClose={handleClose} 
          fullWidth 
          maxWidth="sm"
        >
            <DialogTitle sx={{ fontWeight: 'bold' }}>Create New Forum Category</DialogTitle>
            <DialogContent dividers>
                <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Forum Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={!!error && name.trim() === ''} 
                    helperText={error && name.trim() === '' ? error : ''}
                    sx={{
                      '& .MuiFormHelperText-root': { 
                        color: '#ff0000',
                      }
                    }}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    margin="dense"
                    id="description"
                    label="Description"
                    type="text"
                    fullWidth
                    multiline
                    rows={2}
                    variant="standard"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
                 {error && name.trim() !== '' && ( 
                    <Typography color="error" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                 )}
            </DialogContent>
            <DialogActions>
                <Button 
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit}
                  variant="contained"
                >
                  Create
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CreateForumModal;