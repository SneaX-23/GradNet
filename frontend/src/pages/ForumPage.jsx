import { useState, useEffect } from "react";
import { useAuth } from '/src/context/AuthContext.jsx';
import { Box, Typography, CssBaseline, AppBar, Toolbar, CircularProgress, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Sidebar from '/src/components/layout/Sidebar.jsx';
import RightSidebar from '/src/components/layout/RightSidebar.jsx';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getForums } from "/src/services/ForumService.jsx";
import ForumCard from "/src/components/forum/ForumCard.jsx";
import CreateForumModal from "/src/components/forum/CreateForumModal.jsx";
import { socket } from '/src/socket.js';

function ForumPage() {
    const { user } = useAuth();
    const [forums, setForums] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState('');
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);

    const fetchInitialForums = async () => {
        try {
            const response = await getForums(1);
            if (response.success) {
                setForums(response.forums);
                setHasMore(response.hasMore);
                setPage(1);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchInitialForums();

          const handleNewForum = (newForum) => {
            setForums(prevForums => [newForum, ...prevForums]);
        };
        socket.on('new_forum_category', handleNewForum);

        return () => {
            socket.off('new_forum_category', handleNewForum);
        };
    }, []);

    const fetchMoreForums = async () => {
        const nextPage = page + 1;
        try {
            const response = await getForums(nextPage);
            if (response.success) {
                setForums(prevForums => [...prevForums, ...response.forums]);
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
                        GradNet - Forums
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
                minHeight: 'calc(100vh - 64px)'
              }}
            >
                
                 {user && (user.role === 'admin' || user.role === 'faculty') && (
                    <Fab
                      aria-label="create forum"
                      onClick={() => setCreateModalOpen(true)}
                      sx={{
                        position: 'fixed',
                        bottom: 24,
                        right: 344, 
                        zIndex: 1000,
                      }}
                    >
                      <AddIcon />
                    </Fab>
                )}

                <CreateForumModal
                    open={isCreateModalOpen}
                    onClose={() => setCreateModalOpen(false)}
                    onForumCreated={fetchInitialForums}
                />

                <InfiniteScroll
                    dataLength={forums.length}
                    next={fetchMoreForums}
                    hasMore={hasMore}
                    loader={<CircularProgress sx={{ my: 2, color: '#ffffff' }} />}
                    endMessage={
                        <p style={{ textAlign: 'center', marginTop: '20px' }}>
                            <b>END OF LIST</b>
                        </p>
                    }
                    style={{width: '100%', maxWidth: '800px'}}
                >
                    {forums.map((forum, index) => (
                        <ForumCard
                            key={`${forum.id}-${index}`}
                            forum={forum}
                        />
                    ))}
                </InfiniteScroll>
            </Box>
        </Box>
    );
}

export default ForumPage;