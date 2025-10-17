import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, CssBaseline, AppBar, Toolbar, CircularProgress, Paper, Avatar, TextField, Button, List } from '@mui/material';
import Sidebar from '../components/layout/Sidebar.jsx';
import RightSidebar from '../components/layout/RightSidebar';
// import InfiniteScroll from 'react-infinite-scroll-component'; 
import { getPosts, createPost } from "../services/ForumService.jsx";
import { socket } from '../socket.js';

const retroFont = "'Courier New', Courier, monospace";

const getFullUrl = (path) => {
  if (!path) return null;
  const backendUrl = 'http://localhost:3000'; 
  return path.startsWith('http') ? path : `${backendUrl}${path}`;
};


const retroTextFieldStyles = {
  '& label': {
    color: '#ffffff',
    fontFamily: retroFont,
  },
  '& label.Mui-focused': {
    color: '#ffffff',
  },
  '& .MuiInputBase-root': {
    color: '#ffffff',
    fontFamily: retroFont,
    border: '2px solid #ffffff',
    borderRadius: 0,
    backgroundColor: '#000000',
    padding: '8px 12px', 
    '&:hover': {
        borderColor: '#ffffff', 
    },
    '&.Mui-focused': {
        borderColor: '#ffffff', 
        outline: '1px dashed #ffffff', 
        outlineOffset: '2px'
    },
  },
  '& .MuiOutlinedInput-notchedOutline': { 
    border: 'none',
  },
};


function PostPage() {
    const { topicId } = useParams();
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true); 
    const [error, setError] = useState('');
    const [newPostContent, setNewPostContent] = useState('');

    useEffect(() => {
        const fetchInitialPosts = async () => {
            try {
                const response = await getPosts(topicId, 1);
                if (response.success) {
                    setPosts(response.posts);
                    setHasMore(response.hasMore);
                    setPage(1);
                }
            } catch (err) {
                setError(err.message);
            }
        };
        fetchInitialPosts();

        const handleNewPost = (newPostData) => {
             
             const augmentedPost = {
                ...newPostData,
                author_name: newPostData.author_name || 'New User', 
                handle: newPostData.handle || 'newuser',
                profile_picture_url: newPostData.profile_picture_url || null
             };
            setPosts(prevPosts => [...prevPosts, augmentedPost]);
        };
        socket.on(`topic:${topicId}:new_post`, handleNewPost);

        return () => {
            socket.off(`topic:${topicId}:new_post`, handleNewPost);
        };
    }, [topicId]);

    const fetchMorePosts = async () => {
        // Implementation for infinite scroll (optional for now)
         const nextPage = page + 1;
         try {
             const response = await getPosts(topicId, nextPage);
             if (response.success) {
                 setPosts(prevPosts => [...prevPosts, ...response.posts]);
                 setHasMore(response.hasMore);
                 setPage(nextPage);
             } else {
                 setHasMore(false);
             }
         } catch (err) {
             setError(err.message);
             setHasMore(false);
         }
    };

    const handlePostSubmit = async () => {
        if (!newPostContent.trim()) return;
        try {
            await createPost(topicId, newPostContent); 
            setNewPostContent('');
        } catch (error) {
            setError('Failed to post reply.');
        }
    };

    return (
        <Box sx={{ display: 'flex', bgcolor: '#000000', minHeight: '100vh' }}>
            <CssBaseline />
            <AppBar 
              position="fixed" 
              sx={{ 
                zIndex: (theme) => theme.zIndex.drawer + 1,
                backgroundColor: '#000000',
                borderBottom: '2px solid #ffffff',
                boxShadow: 'none',
              }}
            >
                <Toolbar>
                  <Typography variant="h6" sx={{ fontFamily: retroFont, color: '#ffffff', fontWeight: 'bold' }}>Topic Discussion</Typography>
                </Toolbar>
            </AppBar>
            <Sidebar />
            <RightSidebar />
            
            <Box component="main" sx={{ 
              flexGrow: 1, 
              p: 3, 
              marginTop: '64px', 
              marginRight: '320px', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center' 
            }}>
                <Box sx={{ width: '100%', maxWidth: '800px' }}>
                    <List> 
                        {posts.map((post) => (
                            <Paper 
                              key={post.id} 
                              elevation={0}
                              sx={{ 
                                p: 2, 
                                mb: 2, 
                                display: 'flex', 
                                gap: 2, 
                                bgcolor: '#000000', 
                                border: '1px dashed #555',
                                borderRadius: 0 
                              }}
                            >
                                <Avatar 
                                  src={getFullUrl(post.profile_picture_url)} 
                                  sx={{ border: '1px solid #ffffff', borderRadius: 0, width: 40, height: 40 }} 
                                />
                                <Box>
                                    <Typography variant="subtitle2" component="span" fontWeight="bold" sx={{ fontFamily: retroFont, color: '#ffffff' }}>{post.author_name}</Typography>
                                    <Typography variant="caption" sx={{ ml: 1, fontFamily: retroFont, color: '#aaaaaa' }}>@{post.handle}</Typography>
                                    <Typography variant="body1" sx={{ mt: 1, fontFamily: retroFont, color: '#ffffff' }}>{post.content}</Typography>
                                </Box>
                            </Paper>
                        ))}
                    </List>
                    
                    <Box component="form" sx={{ mt: 2 }} onSubmit={(e) => { e.preventDefault(); handlePostSubmit(); }}>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            variant="outlined"
                            placeholder="Write a reply..."
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            sx={retroTextFieldStyles}
                            InputLabelProps={{ shrink: true }} 
                        />
                        <Button 
                          type="submit" 
                          variant="contained" 
                          sx={{ 
                            mt: 1, 
                            fontFamily: retroFont, 
                            bgcolor: '#ffffff', 
                            color: '#000000', 
                            borderRadius: 0, 
                            border: '2px solid #ffffff',
                            '&:hover': { bgcolor: '#000000', color: '#ffffff' }
                          }}
                        >
                          Post Reply
                        </Button>
                        {error && <Typography color="error" sx={{ fontFamily: retroFont, mt: 1 }}>{error}</Typography>}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default PostPage;