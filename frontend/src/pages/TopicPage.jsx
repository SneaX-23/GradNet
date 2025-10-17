import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Typography, CssBaseline, AppBar, Toolbar, CircularProgress, List, ListItem, ListItemButton, ListItemText, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Sidebar from '../components/layout/Sidebar.jsx';
import RightSidebar from '../components/layout/RightSidebar';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getTopics } from "../services/ForumService.jsx";
import { socket } from '../socket.js';
import CreateTopicModal from '../components/forum/CreateTopicModal.jsx';

const retroFont = "'Courier New', Courier, monospace";

function TopicPage() {
    const { forumId } = useParams();
    const [topics, setTopics] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState('');
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);

    const fetchInitialTopics = async () => {
        try {
            const response = await getTopics(forumId, 1);
            if (response.success) {
                setTopics(response.topics);
                setHasMore(response.hasMore);
                setPage(1);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchInitialTopics();

        const handleNewTopic = (newTopic) => {
            setTopics(prevTopics => [newTopic, ...prevTopics]);
        };
        socket.on(`forum:${forumId}:new_topic`, handleNewTopic);

        return () => {
            socket.off(`forum:${forumId}:new_topic`, handleNewTopic);
        };
    }, [forumId]);

    const fetchMoreTopics = async () => {
        const nextPage = page + 1;
        try {
            const response = await getTopics(forumId, nextPage);
            if (response.success) {
                setTopics(prevTopics => [...prevTopics, ...response.topics]);
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
        <Box sx={{ display: 'flex', bgcolor: '#000000' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: '#000000', borderBottom: '2px solid #ffffff', boxShadow: 'none' }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{ fontFamily: retroFont, fontWeight: 'bold', color: '#ffffff' }}>
                        Forum Topics
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
                minHeight: 'calc(100vh - 64px)' 
              }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '800px', mb: 2 }}>
                    <Typography variant="h4" gutterBottom sx={{fontFamily: retroFont, color: '#ffffff'}}>Topics</Typography>
                </Box>
                
                <CreateTopicModal
                    open={isCreateModalOpen}
                    onClose={() => setCreateModalOpen(false)}
                    forumId={forumId}
                    onTopicCreated={fetchInitialTopics}
                />

                <Fab
                  aria-label="create topic"
                  onClick={() => setCreateModalOpen(true)}
                  sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 344, 
                    zIndex: 1000,
                    borderRadius: 0,
                    bgcolor: '#ffffff',
                    color: '#000000',
                    border: '2px solid #ffffff',
                    '&:hover': {
                      bgcolor: '#000000',
                      color: '#ffffff',
                    }
                  }}
                >
                  <AddIcon />
                </Fab>

                <InfiniteScroll
                    dataLength={topics.length}
                    next={fetchMoreTopics}
                    hasMore={hasMore}
                    loader={<CircularProgress sx={{ my: 2, color: '#ffffff' }} />}
                    style={{width: '100%', maxWidth: '800px'}}
                    endMessage={
                        <p style={{ textAlign: 'center', marginTop: '20px', fontFamily: retroFont, color: '#ffffff' }}>
                            <b>END OF TOPICS</b>
                        </p>
                    }
                >
                    <List sx={{ width: '100%' }}>
                        {topics.map((topic) => (
                             <ListItem key={topic.id} disablePadding sx={{ border: '2px solid #ffffff', mb: 1, borderRadius: 0 }}>
                                <ListItemButton component={Link} to={`/topic/${topic.id}`} sx={{ '&:hover': { bgcolor: '#333' } }}>
                                     <ListItemText
                                        primary={topic.title}
                                        secondary={`By ${topic.author_name} • ${topic.post_count} posts`}
                                        primaryTypographyProps={{ fontFamily: retroFont, color: '#ffffff', fontWeight: 'bold' }}
                                        secondaryTypographyProps={{ fontFamily: retroFont, color: '#aaaaaa' }}
                                     />
                                </ListItemButton>
                             </ListItem>
                        ))}
                    </List>
                </InfiniteScroll>
            </Box>
        </Box>
    );
}

export default TopicPage;