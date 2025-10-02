import React, { useState, useEffect } from 'react';
import { Box, Avatar, TextField, Button, IconButton, Card, Typography, Grid } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import CloseIcon from '@mui/icons-material/Close';
import ArticleIcon from '@mui/icons-material/Article';
import { useAuth } from '../../context/AuthContext';
import AddIcon from '@mui/icons-material/Add';

function CreatePost() {
  const [postContent, setPostContent] = useState({ title: '', description: '' });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const { user } = useAuth();

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prevFiles => [...prevFiles, ...newFiles].slice(0, 4));
    }
  };

  const removeFile = (indexToRemove) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  useEffect(() => {
    return () => {
      selectedFiles.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [selectedFiles]);

  const handlePost = async () => {
    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('postFiles', file); 
    });
    formData.append("title", postContent.title);
    formData.append("description", postContent.description);

    try {
      const response = await fetch("/api/home/create-post", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Upload failed');
      console.log('Post successful:', data);
    } catch (error) {
      console.error("Upload failed:", error);
    }

    setPostContent({ title: '', description: '' });
    setSelectedFiles([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostContent(prevState => ({ ...prevState, [name]: value }));
  };

  const renderPreview = (file, index) => {
    const previewUrl = URL.createObjectURL(file);
    
    const removeButton = (
      <IconButton 
        size="small" 
        onClick={() => removeFile(index)}
        sx={{ 
          position: 'absolute', 
          top: 4, 
          right: 4, 
          bgcolor: 'rgba(0,0,0,0.6)', 
          color: 'white',
          '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    );

    if (file.type.startsWith('image/')) {
      return (
        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
          <img 
            src={previewUrl} 
            alt="Preview" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            onLoad={() => { file.preview = previewUrl; }}
          />
          {removeButton}
        </Box>
      );
    }
    
    if (file.type.startsWith('video/')) {
      return (
        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
          <video 
            src={previewUrl} 
            controls 
            style={{ width: '100%', height: '100%' }} 
            onLoadedMetadata={() => { file.preview = previewUrl; }}
          />
          {removeButton}
        </Box>
      );
    }

    return (
      <Box sx={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
        <Box sx={{ textAlign: 'center' }}>
          <ArticleIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
          <Typography variant="caption" display="block">{file.name}</Typography>
        </Box>
        {removeButton}
      </Box>
    );
  };

  const getGridLayout = (files) => {
    const count = files.length;

    if (count === 1) {
      return (
        <Box sx={{ 
          borderRadius: '16px', 
          overflow: 'hidden', 
          height: '300px',
          mt: 2 
        }}>
          {renderPreview(files[0], 0)}
        </Box>
      );
    }

    if (count === 2) {
      return (
        <Grid container spacing={0.5} sx={{ mt: 2, borderRadius: '16px', overflow: 'hidden' }}>
          {files.map((file, index) => (
            <Grid item xs={6} key={index} sx={{ height: '280px' }}>
              {renderPreview(file, index)}
            </Grid>
          ))}
        </Grid>
      );
    }

    if (count === 3) {
      return (
        <Grid container spacing={0.5} sx={{ mt: 2, borderRadius: '16px', overflow: 'hidden', height: '280px' }}>
          <Grid item xs={6} sx={{ height: '100%' }}>
            {renderPreview(files[0], 0)}
          </Grid>
          <Grid item xs={6}>
            <Grid container spacing={0.5} sx={{ height: '100%' }}>
              <Grid item xs={12} sx={{ height: 'calc(50% - 2px)' }}>
                {renderPreview(files[1], 1)}
              </Grid>
              <Grid item xs={12} sx={{ height: 'calc(50% - 2px)' }}>
                {renderPreview(files[2], 2)}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      );
    }

    if (count === 4) {
      return (
        <Grid container spacing={0.5} sx={{ mt: 2, borderRadius: '16px', overflow: 'hidden' }}>
          {files.map((file, index) => (
            <Grid item xs={6} key={index} sx={{ height: '140px' }}>
              {renderPreview(file, index)}
            </Grid>
          ))}
        </Grid>
      );
    }

    return null;
  };

  return (
    <Card sx={{ p: 2, mb: 3, width: '100%', maxWidth: 600, boxShadow: 'none', borderBottom: '1px solid #eee' }}>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Avatar src={user?.profile_image_url} sx={{ bgcolor: 'primary.main' }}>
          {!user?.profile_image_url && (user?.name ? user.name.charAt(0).toUpperCase() : 'U')}
        </Avatar>
        <Box sx={{ width: '100%' }}>
          <TextField
            fullWidth
            variant="standard"
            placeholder="Title"
            name="title"
            value={postContent.title}
            onChange={handleInputChange}
            InputProps={{ disableUnderline: true }}
            sx={{ mb: 1 }}
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
            InputProps={{ disableUnderline: true }}
          />

          {selectedFiles.length > 0 && getGridLayout(selectedFiles)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Box>
              <IconButton 
                size="small" 
                color="primary" 
                component="label"
                disabled={selectedFiles.length >= 4}
              >
                <ImageIcon />
                <input 
                  type="file" 
                  hidden 
                  onChange={handleFileChange} 
                  multiple
                  accept="image/*,video/*,application/pdf,.doc,.docx,.ppt,.pptx"
                />
              </IconButton>
              {selectedFiles.length > 0 && (
                <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                  {selectedFiles.length}/4 files
                </Typography>
              )}
            </Box>
            <Button
              variant="contained"
              disabled={!postContent.title.trim() && !postContent.description.trim()}
              onClick={handlePost}
              sx={{ borderRadius: '8px', textTransform: 'none', fontWeight: 'bold', minWidth: '40px', height: '40px', padding: 0 }}
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