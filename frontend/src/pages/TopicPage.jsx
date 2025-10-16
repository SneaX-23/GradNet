import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Typography, CssBaseline, AppBar, Toolbar, CircularProgress, List, ListItem, ListItemButton, ListItemText, Button } from '@mui/material';
import Sidebar from '../components/layout/Sidebar.jsx';
import RightSidebar from '../components/layout/RightSidebar';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getTopics } from "../services/ForumService.jsx";
import { socket } from '../socket.js';
import CreateTopicModal from '../components/forum/CreateTopicModal.jsx';

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
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        Forum Topics
                    </Typography>
                </Toolbar>
            </AppBar>
            <Sidebar />
            <RightSidebar />
            
            <Box component="main" sx={{ flexGrow: 1, p: 3, marginTop: '64px', marginRight: '320px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '800px', mb: 2 }}>
                    <Typography variant="h4" gutterBottom>Topics</Typography>
                    <Button variant="contained" onClick={() => setCreateModalOpen(true)}>
                        Create Topic
                    </Button>
                </Box>
                
                <CreateTopicModal
                    open={isCreateModalOpen}
                    onClose={() => setCreateModalOpen(false)}
                    forumId={forumId}
                    onTopicCreated={fetchInitialTopics}
                />

                <InfiniteScroll
                    dataLength={topics.length}
                    next={fetchMoreTopics}
                    hasMore={hasMore}
                    loader={<CircularProgress sx={{ my: 2 }} />}
                    style={{width: '100%', maxWidth: '800px'}}
                    endMessage={
                        <p style={{ textAlign: 'center', marginTop: '20px' }}>
                            <b>You've reached the end.</b>
                        </p>
                    }
                >
                    <List sx={{ width: '100%' }}>
                        {topics.map((topic) => (
                             <ListItem key={topic.id} disablePadding>
                                <ListItemButton component={Link} to={`/topic/${topic.id}`}>
                                     <ListItemText
                                        primary={topic.title}
                                        secondary={`By ${topic.author_name} • ${topic.post_count} posts`}
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