import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, CssBaseline, AppBar, Toolbar, CircularProgress,
  TextField, InputAdornment, Paper, Grid
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Sidebar from '../components/layout/Sidebar';
import RightSidebar from '../components/layout/RightSidebar';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getAlumniList, searchAlumni } from '../services/alumniService';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const retroFont = "'Courier New', Courier, monospace";

// Styles for the retro search bar
const retroTextFieldStyles = {
  '& .MuiOutlinedInput-root': {
    fontFamily: retroFont,
    color: '#ffffff',
    backgroundColor: '#000000',
    borderRadius: 0,
    '& fieldset': {
      borderColor: '#ffffff',
      borderWidth: '2px',
    },
    '&:hover fieldset': {
      borderColor: '#ffffff',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ffffff',
      outline: '2px dashed #ffffff',
      outlineOffset: '2px',
    },
  },
  '& .MuiInputBase-input': {
    color: '#ffffff',
  },
  '& .MuiInputAdornment-root': {
    color: '#ffffff',
  },
};

// AlumniCard component 
const AlumniCard = ({ alum }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      width: '100%',
      border: '1px solid #555',
      borderRadius: 0,
      bgcolor: '#000000',
      color: '#ffffff',
      fontFamily: retroFont,
    }}
  >
    <Typography variant="h6" sx={{ fontFamily: retroFont, fontWeight: 'bold' }}>
      {alum.name}
    </Typography>
    <Typography variant="body2" sx={{ fontFamily: retroFont, color: '#aaaaaa' }}>
      {alum.usn}
    </Typography>
    <Typography variant="body2" sx={{ fontFamily: retroFont, color: '#ffffff', mt: 1 }}>
      {alum.email}
    </Typography>
    <Grid container spacing={2} sx={{ mt: 1 }}>
      <Grid item xs={6}>
        <Typography variant="caption" sx={{ fontFamily: retroFont, color: '#aaaaaa' }}>Graduation Year:</Typography>
        <Typography variant="body2" sx={{ fontFamily: retroFont }}>{alum.graduation_year || 'N/A'}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="caption" sx={{ fontFamily: retroFont, color: '#aaaaaa' }}>Company:</Typography>
        <Typography variant="body2" sx={{ fontFamily: retroFont }}>{alum.company_name || 'N/A'}</Typography>
      </Grid>
    </Grid>
    {alum.remarks && (
      <Box sx={{ mt: 2, borderTop: '1px dashed #555', pt: 1 }}>
        <Typography variant="caption" sx={{ fontFamily: retroFont, color: '#aaaaaa' }}>Remarks:</Typography>
        <Typography variant="body2" sx={{ fontFamily: retroFont }}>{alum.remarks}</Typography>
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

  // Memoize fetchInitialList to use in effects
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

  // Infinite scroll loader
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

  // Effect for initial load
  useEffect(() => {
    if (!user) {
      navigate('/');
    } else {
      fetchInitialList();
    }
  }, [user, navigate, fetchInitialList]);

  // Effect for handling search (with 500ms debounce)
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

  // --- RENDER LOGIC ---
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
          bgcolor: '#000000',
          color: '#ffffff',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {/* Search Bar */}
        <Box sx={{ width: '100%', maxWidth: 700, mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search alumni by name or USN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={retroTextFieldStyles}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {isSearching ? <CircularProgress size={20} sx={{color: '#fff'}} /> : <SearchIcon />}
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {error && <Typography color="error" sx={{ fontFamily: retroFont }}>{error}</Typography>}

        
        {loading ? (
          // 1. LOADING STATE
          <CircularProgress sx={{ my: 4, color: '#ffffff' }} />
        ) : alumni.length > 0 ? (
          // 2. DATA FOUND STATE
          <InfiniteScroll
            dataLength={alumni.length}
            next={fetchMoreData}
            hasMore={hasMore && !searchQuery}
            loader={<CircularProgress sx={{ my: 2, color: '#ffffff' }} />}
            endMessage={
              <p style={{ textAlign: 'center', marginTop: '20px', fontFamily: retroFont, color: '#ffffff' }}>
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
          // 3. NO DATA FOUND STATE
          <Typography sx={{ fontFamily: retroFont, color: '#aaaaaa', mt: 4 }}>
            {searchQuery ? `No results found for "${searchQuery}".` : 'No alumni data found.'}
          </Typography>
        )}
        
      </Box>
    </Box>
  );
}

export default DashboardPage;