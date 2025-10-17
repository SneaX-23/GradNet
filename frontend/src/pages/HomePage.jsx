import React, { useEffect, useState } from 'react';
import { socket } from '../socket'
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { Box, Typography, CssBaseline, AppBar, Toolbar, CircularProgress, Button } from '@mui/material';
import initiateShowPosts from "../services/showPostsService";
import ShowPostsCard from '../components/common/showPostsCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import CreatePost from '../components/common/createPost'
import RightSidebar from '../components/layout/RightSidebar'

const retroFont = "'Courier New', Courier, monospace";
 
function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    function onPrivateMessage({ content, from }) {
      console.log(`Received message from ${from}: ${content}`);
      alert(`New message from user ${from}: ${content}`); 
    }

    socket.on('private_message', onPrivateMessage);

    return () => {
      socket.off('private_message', onPrivateMessage);
    };
  }, []); 

  const sendTestMessage = () => {
    const recipientId = prompt("Enter the User ID of the recipient:");
    const messageContent = prompt("Enter your message:");

    if (recipientId && messageContent) {
      socket.emit('private_message', {
        content: messageContent,
        to: recipientId,
      });
      console.log(`Sent message to ${recipientId}: ${messageContent}`);
    }
  };
  
  useEffect(() => {
    const fetchInitialPosts = async () => {
      try {
        const response = await initiateShowPosts(1);
        if (response.success) {
          setPosts(response.feed);
          setHasMore(response.hasMore);
        } else {
          setError(response.message || 'Failed to fetch posts.');
        }
      } catch (err) {
        setError(err.message);
      }
    };
    fetchInitialPosts();
  }, []);

  const fetchMoreData = async () => {
    const nextPage = page + 1;
    try {
      const response = await initiateShowPosts(nextPage);
      if (response.success) {
        setPosts(prevPosts => [...prevPosts, ...response.feed]);
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

  const handleDeletePost = async (postId) => {
    try {
        const response = await fetch(`/api/home/delete-post/${postId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete the post.');
        }

        setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
        setError(error.message);
    }
  };

  const handleUpdatePost = (updatedPost) => {
    setPosts(posts.map(post => 
      post.id === updatedPost.id ? { ...post, ...updatedPost } : post
    ));
  };

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <Box sx={{ display: 'flex', bgcolor: '#000000' }}>
      <CssBaseline />
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#000000',
          borderBottom: '2px solid #ffffff',
          boxShadow: 'none', 
          color: '#ffffff',
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ fontFamily: retroFont, fontWeight: 'bold' }}>
            GradNet
          </Typography>
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
        alignItems: 'center',
        bgcolor: '#000000', 
        color: '#ffffff', 
      }}>
        
        {user && (user.role === 'admin' || user.role === 'faculty') && <CreatePost />}

        {error && <Typography color="error" sx={{ fontFamily: retroFont, border: '1px dashed #ff0000', p: 1 }}>{error}</Typography>}
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<CircularProgress sx={{ my: 2, color: '#ffffff' }} />}
          endMessage={
            <p style={{ textAlign: 'center', marginTop: '20px', fontFamily: retroFont, color: '#ffffff' }}>
              <b>You have seen it all!</b>
            </p>
          }
        >
          {posts.map((post, index) => (
            <ShowPostsCard
             key={`${post.id}-${index}`}
              post={post}
              onDelete={handleDeletePost}
              onUpdate={handleUpdatePost}
            />
          ))}
        </InfiniteScroll>
      </Box>
    </Box>
  );
}

export default HomePage;