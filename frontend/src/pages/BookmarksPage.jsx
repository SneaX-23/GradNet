import React, { useEffect, useState } from 'react';
import { useAuth } from '/src/context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { getBookmarks } from "/src/services/bookmarksService.jsx";
import InfiniteScroll from 'react-infinite-scroll-component';
import ShowPostsCard from '/src/components/common/showPostsCard.jsx';
import JobCard from '/src/components/jobs/JobCard.jsx';
import ForumCard from '/src/components/forum/ForumCard.jsx';
import Layout from '../components/layout/Layout.jsx';

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
            <Box key={`unknown-${data.id}-${bookmarkable_type}`} sx={{ p: 2, border: '1px solid #555', mb: 2 }}>
                <Typography>Bookmarked {bookmarkable_type} (Display component not implemented)</Typography>
            </Box>
        );
    }
  };

  if (!user) return null;

  return (
    <Layout title="Bookmarks">
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <InfiniteScroll
          dataLength={bookmarks.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<CircularProgress sx={{ my: 2 }} />}
          endMessage={
            bookmarks.length > 0 ? (
                <p style={{ textAlign: 'center', marginTop: '20px' }}>
                <b>End of bookmarks</b>
                </p>
            ) : null
          }
          style={{ width: '100%', maxWidth: '800px' }}
        >
          {bookmarks.length > 0 ? (
            bookmarks.map(renderBookmark)
          ) : (
            !error && <Typography sx={{ textAlign: 'center', marginTop: '20px', color: '#aaaaaa' }}>
                No bookmarks yet.
            </Typography>
          )}
        </InfiniteScroll>
    </Layout>
  );
}

export default BookmarksPage;