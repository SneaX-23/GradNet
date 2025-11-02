import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar.jsx';
import { Box, Typography, CssBaseline, AppBar, Toolbar, CircularProgress } from '@mui/material';
import { getBookmarks } from "../services/bookmarksService.jsx";
import InfiniteScroll from 'react-infinite-scroll-component';
import RightSidebar from '../components/layout/RightSidebar';
import ShowPostsCard from '../components/common/showPostsCard.jsx';
import JobCard from '../components/jobs/JobCard.jsx';
import ForumCard from '../components/forum/ForumCard.jsx';


const retroFont = "'Courier New', Courier, monospace";

function BookmarksPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [bookmarks, setBookmarks] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');

  const fetchInitialBookmarks = async () => {
    try {
      setError('');
      const response = await getBookmarks(1);
      if (response.success) {
        setBookmarks(response.bookmarks);
        setHasMore(response.hasMore);
        setPage(1);
      } else {
        setError(response.message || 'Failed to fetch bookmarks.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/');
    } else {
      fetchInitialBookmarks();
    }
  }, [user, navigate]);

  const fetchMoreData = async () => {
    const nextPage = page + 1;
    try {
      const response = await getBookmarks(nextPage);
      if (response.success) {
        setBookmarks(prevBookmarks => [...prevBookmarks, ...response.bookmarks]);
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

  
  const handleBookmarkChange = (itemId, itemType) => {
    setBookmarks(prevBookmarks => prevBookmarks.filter(b => 
        !(b.bookmarkable_id === itemId && b.bookmarkable_type === itemType)
    ));
  };

  const renderBookmark = (bookmark) => {
    const { bookmarkable_type, data } = bookmark;
    if (!data) return null; 

    const commonProps = {
      onDelete: () => {}, 
      onUpdate: () => {}, 
      onBookmarkToggle: () => handleBookmarkChange(data.id, bookmarkable_type),
    };

    switch (bookmarkable_type) {
      case 'post':
        return <ShowPostsCard key={`post-${data.id}`} post={data} {...commonProps} />;
      case 'job':
        return <JobCard key={`job-${data.id}`} job={data} {...commonProps} />;
      case 'forum':
        return <ForumCard key={`forum-${data.id}`} forum={data} {...commonProps} />;
      default:
        return (
            <Box key={`unknown-${data.id}-${bookmarkable_type}`} sx={{ p: 2, border: '1px solid #555', mb: 2, color: '#fff', fontFamily: retroFont }}>
                <Typography>Bookmarked {bookmarkable_type} (Display component not implemented)</Typography>
            </Box>
        );
    }
  };

  if (!user) return null;

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
            Bookmarks
          </Typography>
        </Toolbar>
      </AppBar>
      <Sidebar />
      <RightSidebar />
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          marginTop: '64px', 
          marginRight: '320px', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          bgcolor: '#000000',
          color: '#ffffff',
          minHeight: 'calc(100vh - 64px)', 
        }}
      >
        
        {error && <Typography color="error" sx={{ fontFamily: retroFont, border: '1px dashed #ff0000', p: 1 }}>{error}</Typography>}
        
        <InfiniteScroll
          dataLength={bookmarks.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<CircularProgress sx={{ my: 2, color: '#ffffff' }} />}
          endMessage={
            bookmarks.length > 0 ? (
                <p style={{ textAlign: 'center', marginTop: '20px', fontFamily: retroFont, color: '#ffffff' }}>
                <b>End of bookmarks</b>
                </p>
            ) : null
          }
          style={{width: '100%', maxWidth: '800px'}}
        >
          {bookmarks.length > 0 ? (
            bookmarks.map(renderBookmark)
          ) : (
            !error && <Typography sx={{ textAlign: 'center', marginTop: '20px', fontFamily: retroFont, color: '#ffffff' }}>
                No bookmarks yet.
            </Typography>
          )}
        </InfiniteScroll>
      </Box>
    </Box>
  );
}

export default BookmarksPage;