import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar.jsx';
import { Box, Typography, CssBaseline, AppBar, Toolbar, CircularProgress } from '@mui/material';
import { getJobs } from "../services/JobService.jsx";
import JobCard from '../components/jobs/JobCard.jsx';
import InfiniteScroll from 'react-infinite-scroll-component';
import CreateJob from '../components/jobs/CreateJob.jsx';

function JobsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');
  
  const fetchInitialJobs = async () => {
    try {
      const response = await getJobs(1);
      if (response.success) {
        setJobs(response.jobs);
        setHasMore(response.hasMore);
        setPage(1);
      } else {
        setError(response.message || 'Failed to fetch jobs.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchInitialJobs();
  }, []);

  const fetchMoreData = async () => {
    const nextPage = page + 1;
    try {
      const response = await getJobs(nextPage);
      if (response.success) {
        setJobs(prevJobs => [...prevJobs, ...response.jobs]);
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
            GradNet - Jobs
          </Typography>
        </Toolbar>
      </AppBar>
      <Sidebar />
      
      <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: '64px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {user && (user.role === 'admin' || user.role === 'faculty') && <CreateJob onJobPosted={fetchInitialJobs} />}

        {error && <Typography color="error">{error}</Typography>}
        <InfiniteScroll
          dataLength={jobs.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<CircularProgress sx={{ my: 2 }} />}
          endMessage={
            <p style={{ textAlign: 'center', marginTop: '20px' }}>
              <b>You have seen all job postings!</b>
            </p>
          }
        >
          {jobs.map((job, index) => (
            <JobCard
             key={`${job.id}-${index}`}
              job={job} 
            />
          ))}
        </InfiniteScroll>
      </Box>
    </Box>
  );
}

export default JobsPage;

