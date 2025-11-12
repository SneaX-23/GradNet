import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography } from '@mui/material';
import { createTopic } from '../../services/ForumService.jsx';

function CreateTopicModal({ open, onClose, forumId, onTopicCreated }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!title.trim()) {
            setError('Topic title is required.');
            return;
        }
        setError('');
        try {
            await createTopic(forumId, title, description);
            onTopicCreated();
            setTitle(''); 
            setDescription('');
            onClose();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleClose = () => {
        setTitle(''); 
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
            <DialogTitle>Start a New Topic</DialogTitle>
            <DialogContent dividers>
                <TextField
                    autoFocus
                    margin="dense"
                    id="title"
                    label="Topic Title"
                    type="text"
                    fullWidth
                    variant="standard" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    error={!!error && title.trim() === ''} 
                    helperText={error && title.trim() === '' ? error : ''} 
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
                    label="Description (Optional)"
                    type="text"
                    fullWidth
                    multiline
                    rows={3}
                    variant="standard"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
                 {error && title.trim() !== '' && ( 
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
                  Create Topic
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CreateTopicModal;