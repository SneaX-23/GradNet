import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography } from '@mui/material';
import { createForum } from '../../services/ForumService';

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
            <DialogTitle sx={{ fontFamily: retroFont, fontWeight: 'bold' }}>Create New Forum Category</DialogTitle>
            <DialogContent dividers sx={{ borderColor: '#ffffff' }}>
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
                    sx={retroDialogTextFieldStyles}
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
                    sx={retroDialogTextFieldStyles}
                    InputLabelProps={{ shrink: true }}
                />
                 {error && name.trim() !== '' && ( 
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
                  Create
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default CreateForumModal;