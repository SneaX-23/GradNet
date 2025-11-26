import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, CssBaseline, AppBar, Toolbar, CircularProgress,
  TextField, InputAdornment, Paper, Grid
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Sidebar from '/src/components/layout/Sidebar.jsx';
import RightSidebar from '/src/components/layout/RightSidebar.jsx';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getAlumniList, searchAlumni } from '/src/services/alumniService.jsx';
import { useAuth } from '/src/context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

const AlumniCard = ({ alum }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      width: '100%',
      border: '1px solid #555',
    }}
  >
    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
      {alum.name}
    </Typography>
    <Typography variant="body2" sx={{ color: '#aaaaaa' }}>
      {alum.usn}
    </Typography>
    <Typography variant="body2" sx={{ mt: 1 }}>
      {alum.email}
    </Typography>
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <Grid item xs={6}>
        <Typography variant="caption" sx={{ color: '#aaaaaa' }}>Graduation Year:</Typography>
        <Typography variant="body2">{alum.graduation_year || 'N/A'}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="caption" sx={{ color: '#aaaaaa' }}>Company:</Typography>
        <Typography variant="body2">{alum.company_name || 'N/A'}</Typography>
      </Grid>
    </Grid>
    {alum.remarks && (
      <Box sx={{ mt: 2, borderTop: '1px dashed #555', pt: 1 }}>
        <Typography variant="caption" sx={{ color: '#aaaaaa' }}>Remarks:</Typography>
        <Typography variant="body2">{alum.remarks}</Typography>
      </Box>
    )}
  </Paper>
);

function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [alumni, setAlumni] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true); 

  const fetchInitialList = useCallback(async () => {
    setLoading(true); 
    try {
      setError('');
      const data = await getAlumniList(1);
      setAlumni(data.alumni || []);
      setHasMore(data.hasMore);
      setPage(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); 
    }
  }, []);

  const fetchMoreData = async () => {
    if (searchQuery) return; 
    const nextPage = page + 1;
    try {
      const data = await getAlumniList(nextPage);
      setAlumni(prev => [...prev, ...data.alumni]);
      setHasMore(data.hasMore);
      setPage(nextPage);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/');
    } else {
      fetchInitialList();
    }
  }, [user, navigate, fetchInitialList]);

  useEffect(() => {
    const handleSearch = async (query) => {
      if (query.trim() === '') {
        setIsSearching(false);
        fetchInitialList(); 
        return;
      }

      setIsSearching(true);
      setLoading(true); 
      try {
        setError('');
        const data = await searchAlumni(query);
        setAlumni(data.alumni || []);
        setHasMore(false); 
      } catch (err) {
        setError(err.message);
      } finally {
        setIsSearching(false);
        setLoading(false); 
      }
    };

    const timer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 500); 

    return () => clearTimeout(timer);
  }, [searchQuery, fetchInitialList]);
  
  if (!user) return null;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
            Alumni Dashboard
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
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 700, mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search alumni by name or USN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {isSearching ? <CircularProgress size={20} /> : <SearchIcon sx={{ color: '#ffffff' }} />}
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {error && <Typography color="error">{error}</Typography>}

        
        {loading ? (
          <CircularProgress sx={{ my: 4 }} />
        ) : alumni.length > 0 ? (
          <InfiniteScroll
            dataLength={alumni.length}
            next={fetchMoreData}
            hasMore={hasMore && !searchQuery}
            loader={<CircularProgress sx={{ my: 2 }} />}
            endMessage={
              <p style={{ textAlign: 'center', marginTop: '20px' }}>
                <b>{searchQuery ? 'End of search results' : 'You have seen all alumni'}</b>
              </p>
            }
            style={{ width: '100%', maxWidth: 700 }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {alumni.map((alum) => (
                <AlumniCard key={alum.usn} alum={alum} />
              ))}
            </Box>
          </InfiniteScroll>
        ) : (
          <Typography sx={{ color: '#aaaaaa', mt: 4 }}>
            {searchQuery ? `No results found for "${searchQuery}".` : 'No alumni data found.'}
          </Typography>
        )}
        
      </Box>
    </Box>
  );
}

export default DashboardPage;