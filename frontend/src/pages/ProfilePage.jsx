import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Avatar, Button, CircularProgress, Alert, 
  Tabs, Tab, Link, Modal
} from '@mui/material';
import { fetchUserProfile } from '/src/services/profileService.jsx';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import XIcon from '@mui/icons-material/X';
import EditProfileModal from '/src/components/profile/EditProfileModal.jsx';
import { showUserPosts } from "/src/services/showPostsService.jsx";
import ShowPostsCard from '/src/components/common/showPostsCard.jsx';
import InfiniteScroll from 'react-infinite-scroll-component';
import { API_BASE_URL } from '/src/config.js';
import { useTheme } from '@mui/material/styles';
import { theme, colors, borderStyle, shadowHover, shadowStyle } from '../theme';
import Layout from '../components/layout/Layout.jsx';

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
          <Link href={profileData.linkedin_url} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: theme.palette.text.primary, '&:hover': {textDecoration: 'underline'} }}>
            <LinkedInIcon /> <Typography variant="body2">LinkedIn</Typography>
          </Link>
        )}
        {profileData.github_url && (
          <Link href={profileData.github_url} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: theme.palette.text.primary, '&:hover': {textDecoration: 'underline'} }}>
            <GitHubIcon /> <Typography variant="body2">GitHub</Typography>
          </Link>
        )}
        {profileData.twitter_url && (
          <Link href={profileData.twitter_url} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: theme.palette.text.primary, '&:hover': {textDecoration: 'underline'} }}>
            <XIcon /> <Typography variant="body2">X / Twitter</Typography>
          </Link>
        )}
      </Box>
      {!profileData.bio && !profileData.linkedin_url && !profileData.github_url && !profileData.twitter_url && (
        <Typography sx={{ color: '#aaaaaa' }}>No additional information to show.</Typography>
      )}
    </>
  );
};

const getFullUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
};

function ProfilePage() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const theme = useTheme();

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await fetchUserProfile();
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
    loadProfile();
  }, []);

  useEffect(() => {
    if (profileData && (profileData.role === 'admin' || profileData.role === 'faculty')) {
      const fetchUsersInitialPosts = async () => {
        try {
          const response = await showUserPosts(1);
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
      const response = await showUserPosts(nextPage);
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

  const handleTabChange = (event, newValue) => setTabValue(newValue);
  const handleProfileUpdate = () => loadProfile();
  const handleOpenImage = (imageUrl) => {
    if (imageUrl) {
      setSelectedImage(imageUrl);
      setImageModalOpen(true);
    }
  };
  const handleCloseImage = () => setImageModalOpen(false);
  const bannerUrl = getFullUrl(profileData?.profile_banner_url);
  const avatarUrl = getFullUrl(profileData?.profile_picture_url);

  return (
    <Layout title="Your Profile">
      <Modal open={imageModalOpen} onClose={handleCloseImage}>
        <Box 
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'transparent',
            p: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }} 
          onClick={handleCloseImage}
        >
          <img src={selectedImage} alt="Expanded view" style={{ maxHeight: '90vh', maxWidth: '90vw', objectFit: 'contain', border: '2px solid white' }} />
        </Box>
      </Modal>

      {loading && <Box sx={{p:3}}><CircularProgress sx={{color: '#000'}} /></Box>}
      {error && <Box sx={{p:3}}><Alert severity="error">{error}</Alert></Box>}
      
      {profileData && (
        <>
          <EditProfileModal 
            open={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            profileData={profileData}
            onSave={handleProfileUpdate}
          />
          <Box 
            sx={{ 
              width: '100%', 
              maxWidth: '800px', 
              minWidth: '300px', 
              border: borderStyle,
              boxShadow: "none",
              overflow: 'hidden',
              bgcolor: theme.palette.secondary.light
            }}
          >
            <Box sx={{ position: 'relative' }}>
              <Box
                onClick={() => handleOpenImage(bannerUrl)}
                sx={{
                  height: { xs: '150px', sm: '200px', md: '260px' }, 
                  borderBottom: '2px solid #ffffff',
                  backgroundImage: bannerUrl ? `url(${bannerUrl})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  cursor: bannerUrl ? 'pointer' : 'default',
                  bgcolor: theme.palette.secondary.light
                }}
              />
              <Avatar
                onClick={() => handleOpenImage(avatarUrl)}
                src={avatarUrl}
                sx={{
                  width: { xs: 80, sm: 100, md: 135 },
                  height: { xs: 80, sm: 100, md: 135 },
                  position: 'absolute',
                  top: { xs: '110px', sm: '150px', md: '190px' },
                  left: '16px',
                  border: '2px solid #000000', 
                  fontSize: '4rem',
                  cursor: avatarUrl ? 'pointer' : 'default',
                  borderRadius: '0px',
                }}
              >
                {profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U'}
              </Avatar>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: '12px 16px' }}>
                <Button 
                  onClick={() => setEditModalOpen(true)} 
                  variant="outlined" 
                  size="small"
                  sx={{ 
                    fontWeight: 'bold',
                    color: colors.black,
                    bgcolor: theme.palette.primary.main,
                    mt: { xs: 4, sm: 0 },
                    boxShadow: "none"
                  }}
                >
                  Edit profile
                </Button>
              </Box>
            </Box>

            <Box sx={{ p: '12px 16px', mt: { xs: '30px', sm: '40px', md: '60px' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                <Typography variant="h5" component="div" fontWeight="bold">
                  {profileData.name}
                </Typography>
                {profileData.position && (
                  <Typography
                    variant="caption"
                    sx={{
                      px: 1,
                      py: 0.25,
                      bgcolor: theme.palette.neo.purple || '#C4B5FD', 
                      border: '2px solid #18181b',      
                      borderRadius: 0,                  
                      fontWeight: 'bold',
                      fontFamily: '"Space Mono", monospace',
                      color: '#18181b',
                      boxShadow: 'none', 
                      lineHeight: 1.2,
                      transform: 'translateY(-2px)'     
                    }}
                  >
                    {profileData.position}
                  </Typography>
                )}
              </Box>
              <Typography>
                @{profileData.handle}
              </Typography>
            </Box>

            {(profileData.role === 'admin' || profileData.role === 'faculty') ? (
              <>
                <Box sx={{ borderBottom: 1, borderColor: '#ffffff' }}>
                  <Tabs 
                    value={tabValue} 
                    onChange={handleTabChange} 
                    variant="fullWidth" 
                    textColor="inherit"
                  >
                    <Tab label="About" id="profile-tab-0" />
                    <Tab label="Posts" id="profile-tab-1" />
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
                    loader={<CircularProgress sx={{ my: 2, color: '#000' }} />}
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
              <Box sx={{ p: 3, borderTop: '1px solid #555' }}>
                <AboutContent profileData={profileData} />
              </Box>
            )}
          </Box>
        </>
      )}
    </Layout>
  );
}

export default ProfilePage;