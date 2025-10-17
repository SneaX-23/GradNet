import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography } from '@mui/material';
import { createTopic } from '../../services/ForumService';

const retroFont = "'Courier New', Courier, monospace";

const retroDialogTextFieldStyles = {
  '& label': {
    color: '#ffffff',
    fontFamily: retroFont,
  },
  '& label.Mui-focused': {
    color: '#ffffff',
  },
  '& .MuiInput-underline:before': { 
    borderBottomColor: '#ffffff',
  },
  '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
    borderBottomColor: '#ffffff',
  },
  '& .MuiInput-underline:after': { 
    borderBottomColor: '#ffffff',
  },
  '& .MuiInputBase-input': {
    color: '#ffffff',
    fontFamily: retroFont,
  },
  '& .MuiFormHelperText-root': { 
    color: '#ff0000', 
    fontFamily: retroFont,
  }
};

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
          PaperProps={{
            sx: {
              bgcolor: '#000000',
              color: '#ffffff',
              border: '2px solid #ffffff',
              borderRadius: 0,
              fontFamily: retroFont,
            }
          }}
        >
            <DialogTitle sx={{ fontFamily: retroFont, fontWeight: 'bold' }}>Start a New Topic</DialogTitle>
            <DialogContent dividers sx={{ borderColor: '#ffffff' }}>
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
                    helperText={error && title.trim() === '' ? error : ''} 
                    sx={retroDialogTextFieldStyles}
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
                    sx={retroDialogTextFieldStyles}
                    InputLabelProps={{ shrink: true }}
                />
                 {error && title.trim() !== '' && ( 
                    <Typography color="error" sx={{ mt: 2, fontFamily: retroFont }}>
                        {error}
                    </Typography>
                 )}
            </DialogContent>
            <DialogActions>
                <Button 
                  onClick={handleClose} 
                  sx={{ fontFamily: retroFont, color: '#ffffff', borderColor: '#ffffff', borderRadius: 0, '&:hover': { bgcolor: '#333' }}}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit}
                  sx={{ 
                    fontFamily: retroFont, 
                    bgcolor: '#ffffff', 
                    color: '#000000', 
                    borderRadius: 0, 
                    border: '2px solid #ffffff',
                    '&:hover': { bgcolor: '#000000', color: '#ffffff' }
                  }}
                >
                  Create Topic
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CreateTopicModal;