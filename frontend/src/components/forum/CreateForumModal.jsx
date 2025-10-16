import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box } from '@mui/material';
import { createForum } from '../../services/ForumService';

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
            await createForum({ name, description, color: '#4a90e2' }); // Using a default color
            onForumCreated(); // Refresh the list
            onClose(); // Close the modal
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Create New Forum Category</DialogTitle>
            <DialogContent>
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
                    error={!!error}
                    helperText={error}
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
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Create</Button>
            </DialogActions>
        </Dialog>
    );
}

export default CreateForumModal;