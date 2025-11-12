import React, { useState, useEffect } from 'react';
import { Box, Avatar, TextField, Button, IconButton, Card, Typography, Grid } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import ArticleIcon from '@mui/icons-material/Article';
import { useAuth } from '/src/context/AuthContext.jsx';
import AddIcon from '@mui/icons-material/Add';
import { API_BASE_URL } from '/src/config.js';

function CreatePost() {
  const [postContent, setPostContent] = useState({ title: '', description: '' });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { user } = useAuth();

const getFullUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
};

  const avatarUrl = getFullUrl(user?.profile_image_url);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prevFiles => [...prevFiles, ...newFiles].slice(0, 4));
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handlePost = async () => {
    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('postFiles', file); 
    });
    formData.append("title", postContent.title);
    formData.append("description", postContent.description);

    try {
      const response = await fetch(`${API_BASE_URL}/api/home/create-post`, {
        method: "POST",
        body: formData,
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Upload failed');
      console.log('Post successful:', data);
    } catch (error) {
      console.error("Upload failed:", error);
    }

    setPostContent({ title: '', description: '' });
    setSelectedFiles([]);
    setPreviewUrl(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostContent(prevState => ({ ...prevState, [name]: value }));
  };

  const renderPreview = (file) => {
    const previewUrl = URL.createObjectURL(file);
    if (file.type.startsWith('image/')) return <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />;
    if (file.type.startsWith('video/')) return <video src={previewUrl} controls style={{ width: '100%', height: '100%' }} />;

    if (file.type === 'application/pdf') return <Box sx={{p:1}}><ArticleIcon /> PDF</Box>;
    return <Box sx={{p:1}}><ArticleIcon /> File</Box>;
  };

 return (
    <Card sx={{ 
      p: 2, 
      mb: 3, 
      width: '100%', 
      maxWidth: 600, 
    }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Avatar 
          src={avatarUrl} 
          sx={{ 
            border: '2px solid #ffffff',
          }}
        >
          {!avatarUrl && (user?.name ? user.name.charAt(0).toUpperCase() : 'U')}
        </Avatar>
        <Box sx={{ width: '100%' }}>
          <TextField
            fullWidth
            variant="standard"
            placeholder="Title"
            name="title"
            value={postContent.title}
            onChange={handleInputChange}
            InputProps={{ 
              disableUnderline: true, 
              sx: { border: '1px dashed #333', padding: '8px', mb: 1 } 
            }}
          />
          <TextField
            fullWidth
            multiline
            minRows={2}
            variant="standard"
            placeholder="What's happening?"
            name="description"
            value={postContent.description}
            onChange={handleInputChange}
            InputProps={{ 
              disableUnderline: true, 
              sx: { border: '1px dashed #333', padding: '8px' } 
            }}
          />

          {selectedFiles.length > 0 && (
            <Grid container spacing={1} sx={{ mt: 2 }}>
              {selectedFiles.map((file, index) => (
                <Grid item xs={6} key={index} sx={{ height: '150px', borderRadius: 0, overflow: 'hidden', border: '1px solid #333' }}>
                  {renderPreview(file)}
                </Grid>
              ))}
            </Grid>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Box>
              <IconButton size="small" component="label" sx={{ border: 'none' }}>
                <ImageIcon />
                <input type="file" hidden onChange={handleFileChange} multiple />
              </IconButton>
            </Box>
            <Button
              variant="contained"
              disabled={!postContent.title.trim() && selectedFiles.length === 0}
              onClick={handlePost}
              sx={{ 
                '&.Mui-disabled': {
                  bgcolor: '#333',
                  borderColor: '#888',
                  color: '#888'
                }
              }}
            >
              <AddIcon />
            </Button>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}

export default CreatePost;