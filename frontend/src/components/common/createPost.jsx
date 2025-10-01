import React, { useState } from 'react';
import { Box, Avatar, TextField, Button, IconButton, Card } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import GifBoxIcon from '@mui/icons-material/GifBox';
import PollIcon from '@mui/icons-material/Poll';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useAuth } from '../../context/AuthContext';
import AddIcon from '@mui/icons-material/Add';

function CreatePost() {
  const [postContent, setPostContent] = useState({ title: '', description: '' });
  const { user } = useAuth(); 

  const handlePost = () => {
    console.log('Posting content:', postContent);
    setPostContent({ title: '', description: '' }); 
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostContent(prevState => ({
      ...prevState,
      [name]: value
    }));
  };


  console.log('User data in CreatePost:', user);

  return (
    <Card sx={{ p: 2, mb: 3, width: '100%', maxWidth: 600, boxShadow: 'none', borderBottom: '1px solid #eee' }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Avatar 
          src={user?.profile_image_url ? user.profile_image_url : undefined}
          alt={user?.name || 'User'}
          sx={{ 
            bgcolor: 'primary.main',
            width: 48,
            height: 48
          }}
        >
          {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </Avatar>
        <Box sx={{ width: '100%' }}>
          <TextField
            multiline
            fullWidth
            minRows={1}
            variant="standard"
            placeholder="Title"
            name="title"
            value={postContent.title}
            onChange={handleInputChange}
            InputProps={{
              disableUnderline: true,
              sx: {
                fontSize: '1.2rem',
                padding: '8px 0',
              },
            }}
            sx={{
              '.MuiInputBase-root': {
                padding: 0,
              },
              marginBottom: '1rem',
            }}
          />
          <TextField
            multiline
            fullWidth
            minRows={2}
            variant="standard"
            placeholder="What's happening?"
            name="description"
            value={postContent.description}
            onChange={handleInputChange}
            InputProps={{
              disableUnderline: true,
              sx: {
                fontSize: '1rem',
                padding: '8px 0',
              },
            }}
            sx={{
              '.MuiInputBase-root': {
                padding: 0,
              },
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Box>
              <IconButton size="small" color="primary"><ImageIcon /></IconButton>
              <IconButton size="small" color="primary"><GifBoxIcon /></IconButton>
              <IconButton size="small" color="primary"><PollIcon /></IconButton>
              <IconButton size="small" color="primary"><SentimentSatisfiedAltIcon /></IconButton>
              <IconButton size="small" color="primary"><CalendarTodayIcon /></IconButton>
              <IconButton size="small" color="primary"><LocationOnIcon /></IconButton>
            </Box>
            <Button
              variant="contained"
              disabled={!postContent.title.trim() || !postContent.description.trim()}
              onClick={handlePost}
              sx={{
                borderRadius: '50%',
                minWidth: '56px',
                height: '56px',
                padding: 0,
                backgroundColor: 'black',
                '&:hover': {
                  backgroundColor: '#333',
                }
              }}
            >
              <AddIcon sx={{ fontSize: '2rem' }} />
            </Button>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}

export default CreatePost;