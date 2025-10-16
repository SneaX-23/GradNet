import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { createTopic } from '../../services/ForumService';

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
            onClose();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Start a New Topic</DialogTitle>
            <DialogContent>
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
                    error={!!error}
                    helperText={error}
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
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit}>Create Topic</Button>
            </DialogActions>
        </Dialog>
    );
}

export default CreateTopicModal;