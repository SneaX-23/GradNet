import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, CssBaseline, AppBar, Toolbar, CircularProgress, List, Paper, Avatar, ListItemText, TextField, Button } from '@mui/material';
import Sidebar from '../components/layout/Sidebar.jsx';
import RightSidebar from '../components/layout/RightSidebar';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getPosts, createPost } from "../services/ForumService.jsx";
import { socket } from '../socket.js';

const getFullUrl = (path) => {
  if (!path) return null;
  return path.startsWith('http') ? `http://localhost:3000${path}` : path;
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

        const handleNewPost = (newPost) => {
            setPosts(prevPosts => [...prevPosts, newPost]);
        };
        socket.on(`topic:${topicId}:new_post`, handleNewPost);

        return () => {
            socket.off(`topic:${topicId}:new_post`, handleNewPost);
        };
    }, [topicId]);

    const fetchMorePosts = async () => {
        // ... (implementation for infinite scroll)
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
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar><Typography variant="h6">Topic</Typography></Toolbar>
            </AppBar>
            <Sidebar />
            <RightSidebar />
            
            <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: '64px', marginRight: '320px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ width: '100%', maxWidth: '800px' }}>
                    {posts.map((post) => (
                        <Paper key={post.id} sx={{ p: 2, mb: 2, display: 'flex', gap: 2 }}>
                            <Avatar src={getFullUrl(post.profile_picture_url)} />
                            <Box>
                                <Typography variant="subtitle2" component="span" fontWeight="bold">{post.author_name}</Typography>
                                <Typography variant="caption" sx={{ ml: 1 }}>@{post.handle}</Typography>
                                <Typography variant="body1" sx={{ mt: 1 }}>{post.content}</Typography>
                            </Box>
                        </Paper>
                    ))}
                    <Box component="form" sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            variant="outlined"
                            placeholder="Write a reply..."
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                        />
                        <Button variant="contained" onClick={handlePostSubmit} sx={{ mt: 1 }}>Post Reply</Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default PostPage;