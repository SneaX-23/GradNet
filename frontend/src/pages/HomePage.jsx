import React, { useEffect, useState } from 'react';
import { socket } from '../socket.js'
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar.jsx';
import { Box, Typography, CssBaseline, AppBar, Toolbar, CircularProgress, Button } from '@mui/material';
import initiateShowPosts from "../services/showPostsService.jsx";
import ShowPostsCard from '../components/common/showPostsCard.jsx';
import InfiniteScroll from 'react-infinite-scroll-component';
import CreatePost from '../components/common/createPost.jsx'
import RightSidebar from '../components/layout/RightSidebar.jsx'
import { API_BASE_URL } from '../config.js';
import Layout from '../components/layout/Layout.jsx';
 
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
    }

    socket.on('private_message', onPrivateMessage);

    return () => {
      socket.off('private_message', onPrivateMessage);
    };
  }, []); 

  
  
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

  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };
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
        const response = await fetch(`${API_BASE_URL}/api/home/delete-post/${postId}`, {
            method: 'DELETE',
            credentials: 'include',
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
    <Layout title="GradNet">
        
        {user && (user.role === 'admin' || user.role === 'faculty') && <CreatePost />}

        {error && <Typography color="error">{error}</Typography>}
        
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<CircularProgress sx={{ my: 2, color: '#ffffff' }} />}
          endMessage={
            <p style={{ textAlign: 'center', marginTop: '20px' }}>
              <b>You have seen it all!</b>
            </p>
          }
          style={{ width: '100%', maxWidth: '750px', overflow: 'visible' }} 
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
    </Layout>
  );
}

export default HomePage;