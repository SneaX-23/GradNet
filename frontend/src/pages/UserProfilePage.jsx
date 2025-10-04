import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import {
  Box, Typography, Avatar, CircularProgress, Alert,
  AppBar, Toolbar, Tabs, Tab, Link, CssBaseline, Modal
} from '@mui/material';
import { fetchUserProfileByHandle } from '../services/profileService';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import XIcon from '@mui/icons-material/X';
import { showUserPosts } from "../services/showPostsService";
import ShowPostsCard from '../components/common/showPostsCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useParams } from 'react-router-dom';

const backendUrl = 'http://localhost:3000';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const AboutContent = ({ profileData }) => {
  return (
    <>
      {profileData.bio && <Typography variant="body1" sx={{ mb: 3 }}>{profileData.bio}</Typography>}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {profileData.linkedin_url && (
          <Link href={profileData.linkedin_url} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: 'text.secondary', '&:hover': {textDecoration: 'underline'} }}>
            <LinkedInIcon /> <Typography variant="body2">LinkedIn</Typography>
          </Link>
        )}
        {profileData.github_url && (
          <Link href={profileData.github_url} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: 'text.secondary', '&:hover': {textDecoration: 'underline'} }}>
            <GitHubIcon /> <Typography variant="body2">GitHub</Typography>
          </Link>
        )}
        {profileData.twitter_url && (
          <Link href={profileData.twitter_url} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: 'text.secondary', '&:hover': {textDecoration: 'underline'} }}>
            <XIcon /> <Typography variant="body2">X / Twitter</Typography>
          </Link>
        )}
      </Box>
      {!profileData.bio && !profileData.linkedin_url && !profileData.github_url && !profileData.twitter_url && (
        <Typography color="text.secondary">No additional information to show.</Typography>
      )}
    </>
  );
};

const getFullUrl = (path) => {
  if (!path) return null;
  return path.startsWith('http') ? path : `${backendUrl}${path}`;
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'transparent',
  boxShadow: 24,
  p: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

function UserProfilePage() {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [tabValue, setTabValue] = useState(0);
  
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
  
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
  
    const { handle } = useParams();
  
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await fetchUserProfileByHandle(handle);
        if (data.success) {
          setProfileData(data.user);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
        setPosts([]);
        setPage(1);
        setHasMore(true);
        setError('');
        loadProfile();
    }, [handle]);
  
    useEffect(() => {
      if (profileData && (profileData.role === 'admin' || profileData.role === 'faculty')) {
        const fetchUsersInitialPosts = async () => {
          try {
            const response = await showUserPosts(1, profileData.id); 
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
        fetchUsersInitialPosts();
      }
    }, [profileData]);
  
    const fetchMoreData = async () => {
      const nextPage = page + 1;
      try {
        const response = await showUserPosts(nextPage, profileData.id);
        if (response.success) {
          setPosts(prevPosts => [...prevPosts, ...response.feed]);
          setHasMore(response.hasMore);
          setPage(nextPage);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        setError(error.message);
        setHasMore(false);
      }
    }

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
  
    const handleTabChange = (event, newValue) => {
      setTabValue(newValue);
    };
  
    const handleOpenImage = (imageUrl) => {
      if (imageUrl) {
        setSelectedImage(imageUrl);
        setImageModalOpen(true);
      }
    };
  
    const handleCloseImage = () => {
      setImageModalOpen(false);
    };
  
    const bannerUrl = getFullUrl(profileData?.profile_banner_url);
    const avatarUrl = getFullUrl(profileData?.profile_picture_url);
  
    return (
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
  
        <Modal open={imageModalOpen} onClose={handleCloseImage}>
          <Box sx={modalStyle} onClick={handleCloseImage}>
            <img src={selectedImage} alt="Expanded view" style={{ maxHeight: '90vh', maxWidth: '90vw', objectFit: 'contain' }} />
          </Box>
        </Modal>
  
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Typography variant="h6" noWrap component="div">GradNet</Typography>
          </Toolbar>
        </AppBar>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            marginTop: '64px',
            display: 'flex',
            justifyContent: 'center',
            p: 3
          }}
        >
          {loading && <Box sx={{p:3}}><CircularProgress /></Box>}
          {error && <Box sx={{p:3}}><Alert severity="error">{error}</Alert></Box>}
  
          {profileData && (
            <>
              <Box
                sx={{
                  width: '100%',
                  maxWidth: '800px',
                  minWidth: '600px',
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <Box
                    onClick={() => handleOpenImage(bannerUrl)}
                    sx={{
                      height: '260px',
                      bgcolor: '#cfd9de',
                      backgroundImage: bannerUrl ? `url(${bannerUrl})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      cursor: bannerUrl ? 'pointer' : 'default',
                    }}
                  />
                  <Avatar
                    onClick={() => handleOpenImage(avatarUrl)}
                    src={avatarUrl}
                    sx={{
                      width: 135,
                      height: 135,
                      position: 'absolute',
                      top: '190px',
                      left: '16px',
                      border: '4px solid #fff',
                      fontSize: '4rem',
                      cursor: avatarUrl ? 'pointer' : 'default',
                    }}
                  >
                    {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
                  </Avatar>
                </Box>
  
                <Box sx={{ p: '12px 16px', mt: '60px' }}>
                  <Typography variant="h5" component="div" fontWeight="bold">
                    {profileData.name}
                  </Typography>
                  <Typography color="text.secondary">
                    @{profileData.handle}
                  </Typography>
                </Box>
  
                {(profileData.role === 'admin' || profileData.role === 'faculty') ? (
                  <>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth" textColor="inherit">
                        <Tab label="About" id="profile-tab-0" sx={{textTransform: 'none', fontWeight: 'bold'}} />
                        <Tab label="Posts" id="profile-tab-1" sx={{textTransform: 'none', fontWeight: 'bold'}} />
                      </Tabs>
                    </Box>
  
                    <TabPanel value={tabValue} index={0}>
                      <AboutContent profileData={profileData} />
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
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
                        {posts.map((post, index) => {
                          const postWithAuthor = {
                            ...post,
                            author_name: profileData.name,
                            handle: profileData.handle,
                            profile_picture_url: profileData.profile_picture_url
                          };
                          return (
                            <ShowPostsCard
                              key={`${post.id}-${index}`}
                              post={postWithAuthor}
                              onDelete={handleDeletePost}
                              onUpdate={handleUpdatePost}
                            />
                          )
                        })}
                      </InfiniteScroll>
                    </TabPanel>
                  </>
                ) : (
                  <Box sx={{ p: 3, borderTop: '1px solid #eee' }}>
                    <AboutContent profileData={profileData} />
                  </Box>
                )}
              </Box>
            </>
          )}
        </Box>
      </Box>
    );
  }
  
  export default UserProfilePage;