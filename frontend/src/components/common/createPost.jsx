import React, { useState, useEffect } from 'react';
import { Box, Avatar, Button, IconButton, Grid, InputBase } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import LinkIcon from '@mui/icons-material/Link';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SendIcon from '@mui/icons-material/Send';
import ArticleIcon from '@mui/icons-material/Article';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '/src/context/AuthContext.jsx';
import { API_BASE_URL } from '/src/config.js';

// Neo-Brutalist Colors
const NEO_BLACK = '#18181b';
const NEO_CREAM = '#FDF6E3';
const NEO_WHITE = '#FFFFFF';
const NEO_YELLOW = '#FDE047';
const NEO_YELLOW_HOVER = '#FCD34D';

const getFullUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
};

function CreatePost() {
  const [postContent, setPostContent] = useState({ title: '', description: '' });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const { user } = useAuth();

  const avatarUrl = getFullUrl(user?.profile_image_url);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prevFiles => [...prevFiles, ...newFiles].slice(0, 4));
    }
  };

  
  useEffect(() => {
    const newPreviews = selectedFiles.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type,
      name: file.name
    }));
    setPreviews(newPreviews);

    
    return () => {
      newPreviews.forEach(preview => URL.revokeObjectURL(preview.url));
    };
  }, [selectedFiles]);

  const removeFile = (indexToRemove) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  };

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
      
      // Reset form
      setPostContent({ title: '', description: '' });
      setSelectedFiles([]);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostContent(prevState => ({ ...prevState, [name]: value }));
  };

  const renderPreviewItem = (preview, index) => {
    return (
      <Box 
        key={index} 
        sx={{ 
          position: 'relative', 
          height: '80px', 
          width: '80px', 
          border: `2px solid ${NEO_BLACK}`,
          bgcolor: NEO_WHITE,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        {preview.type.startsWith('image/') ? (
          <img src={preview.url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
           <ArticleIcon />
        )}
        <IconButton 
            size="small" 
            onClick={() => removeFile(index)}
            sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                bgcolor: 'rgba(255,255,255,0.8)',
                p: 0.5,
                '&:hover': { bgcolor: '#fff' }
            }}
        >
            <CloseIcon fontSize="small" />
        </IconButton>
      </Box>
    );
  };

  return (
    <Box sx={{ 
      p: 2, 
      mb: 4, 
      width: '100%', 
      maxWidth: 750, 
      backgroundColor: NEO_CREAM,
      border: `2px solid ${NEO_BLACK}`,
      boxShadow: `4px 4px 0px ${NEO_BLACK}`,
      display: 'flex',
      gap: 2,
      fontFamily: '"Space Grotesk", sans-serif'
    }}>
      {/* Avatar Section */}
      <Box>
        <Avatar 
          src={avatarUrl} 
          sx={{ 
            width: 48, 
            height: 48,
            border: `2px solid ${NEO_BLACK}`,
            borderRadius: '0px', 
            backgroundColor: '#D4E4BC',
            color: NEO_BLACK,
            fontWeight: 'bold'
          }}
        >
          {!avatarUrl && (user?.name ? user.name.charAt(0).toUpperCase() : 'U')}
        </Avatar>
      </Box>

      {/* Content Section */}
      <Box sx={{ flexGrow: 1 }}>
        
        {/* Input Container - White Box */}
        <Box sx={{ 
            backgroundColor: NEO_WHITE,
            border: `2px solid ${NEO_BLACK}`,
            p: 2,
            mb: 2
        }}>
            <InputBase
                fullWidth
                name="title"
                placeholder="Title"
                value={postContent.title}
                onChange={handleInputChange}
                sx={{ 
                    fontSize: '1.1rem', 
                    fontWeight: 'bold', 
                    mb: 1, 
                    fontFamily: '"Space Mono", monospace' 
                }}
            />
            <InputBase
                fullWidth
                multiline
                minRows={2}
                name="description"
                placeholder="What's happening on campus?"
                value={postContent.description}
                onChange={handleInputChange}
                sx={{ 
                    fontSize: '1rem', 
                    fontFamily: '"Space Mono", monospace' 
                }}
            />

            {/* File Previews */}
            {previews.length > 0 && (
                <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                    {previews.map(renderPreviewItem)}
                </Box>
            )}
        </Box>

        {/* Actions Row */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            
            {/* Icons Group */}
            <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton 
                    component="label" 
                    sx={{ 
                        color: NEO_BLACK, 
                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' } 
                    }}
                >
                    <ImageIcon />
                    <input type="file" hidden onChange={handleFileChange} multiple accept="image/*,application/pdf" />
                </IconButton>
                
                <IconButton sx={{ color: NEO_BLACK }}>
                    <LinkIcon />
                </IconButton>
                
                <IconButton sx={{ color: NEO_BLACK }}>
                    <SentimentSatisfiedAltIcon />
                </IconButton>
            </Box>

            {/* Post Button */}
            <Button
                variant="contained"
                onClick={handlePost}
                disabled={!postContent.title.trim() && !postContent.description.trim() && selectedFiles.length === 0}
                sx={{
                    backgroundColor: NEO_YELLOW,
                    color: NEO_BLACK,
                    border: `2px solid ${NEO_BLACK}`,
                    borderRadius: 0,
                    boxShadow: `3px 3px 0px ${NEO_BLACK}`,
                    fontWeight: 'bold',
                    fontFamily: '"Space Mono", monospace',
                    textTransform: 'none',
                    px: 3,
                    '&:hover': {
                        backgroundColor: NEO_YELLOW_HOVER,
                        boxShadow: `4px 4px 0px ${NEO_BLACK}`,
                        transform: 'translate(-1px, -1px)'
                    },
                    '&:active': {
                        boxShadow: 'none',
                        transform: 'translate(2px, 2px)'
                    },
                    '&.Mui-disabled': {
                        backgroundColor: '#e0e0e0',
                        color: '#a0a0a0',
                        border: `2px solid #a0a0a0`,
                        boxShadow: 'none'
                    }
                }}
            >
                <SendIcon sx={{ fontSize: 18, mr: 1 }} />
                Post
            </Button>
        </Box>

      </Box>
    </Box>
  );
}

export default CreatePost;