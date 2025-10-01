import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import { Box, Typography, CssBaseline, AppBar, Toolbar, Button, CircularProgress } from '@mui/material';
import initiateShowPosts from "../services/showPostsService";
import ShowPostsCard from '../components/common/showPostsCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import CreatePost from '../components/common/createPost'

function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');
  
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

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            GradNet
          </Typography>
        </Toolbar>
      </AppBar>
      <Sidebar />
      
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: '64px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <CreatePost/>
        {error && <Typography color="error">{error}</Typography>}
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<CircularProgress sx={{ my: 2 }} />}
          endMessage={
            <p style={{ textAlign: 'center', marginTop: '20px' }}>
              <b>You have seen it all!</b>
            </p>
          }
        >
          {posts.map((post) => (
            <ShowPostsCard
              key={post.id}
              title={post.author_name}
              subheader={post.created_at}
              image={post.image_url}
              post_title={post.title}
              description={post.description}
              handle={post.handle}
            />
          ))}
        </InfiniteScroll>
      </Box>
    </Box>
  );
}

export default HomePage;