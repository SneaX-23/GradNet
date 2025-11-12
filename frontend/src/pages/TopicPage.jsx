import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Typography, CssBaseline, AppBar, Toolbar, CircularProgress, List, ListItem, ListItemButton, ListItemText, Fab, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import Sidebar from '/src/components/layout/Sidebar.jsx';
import RightSidebar from '/src/components/layout/RightSidebar.jsx';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getTopics, getForumById } from "/src/services/ForumService.jsx"; 
import { addBookmark, deleteBookmark } from "/src/services/bookmarksService.jsx";
import { socket } from '/src/socket.js';
import CreateTopicModal from '/src/components/forum/CreateTopicModal.jsx';

function TopicListItem({ topic, onBookmarkToggle }) {
    const [isBookmarked, setIsBookmarked] = useState(topic.is_bookmarked);
    const [isBookmarkPending, setIsBookmarkPending] = useState(false);

    const handleBookmarkClick = async (e) => {
        e.preventDefault(); 
        e.stopPropagation(); 
        setIsBookmarkPending(true);
        try {
            if (isBookmarked) {
                await deleteBookmark(topic.id, 'forum_topic');
                setIsBookmarked(false);
            } else {
                await addBookmark(topic.id, 'forum_topic');
                setIsBookmarked(true);
            }
            if (onBookmarkToggle) {
                onBookmarkToggle(topic.id, 'forum_topic');
            }
        } catch (err) {
            console.error("Failed to update bookmark:", err);
        } finally {
            setIsBookmarkPending(false);
        }
    };

    return (
        <ListItem 
            key={topic.id} 
            disablePadding 
            sx={{ mb: 1 }}
            secondaryAction={
                <IconButton 
                    edge="end" 
                    aria-label="bookmark" 
                    onClick={handleBookmarkClick}
                    disabled={isBookmarkPending}
                    sx={{ border: 'none', '&:hover': { backgroundColor: 'transparent', color: '#ffffff' } }}
                >
                    {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                </IconButton>
            }
        >
            <ListItemButton component={Link} to={`/topic/${topic.id}`}>
                <ListItemText
                    primary={topic.title}
                    secondary={`By ${topic.author_name} • ${topic.post_count} posts`}
                    primaryTypographyProps={{ fontWeight: 'bold' }}
                    secondaryTypographyProps={{ color: '#aaaaaa' }}
                />
            </ListItemButton>
        </ListItem>
    );
}


function TopicPage() {
    const { forumId } = useParams();
    const [forumInfo, setForumInfo] = useState(null); 
    const [topics, setTopics] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState('');
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);

    const fetchForumInfo = async () => {
        try {
            const response = await getForumById(forumId);
            if (response.success) {
                setForumInfo(response.forum);
            }
        } catch (err) {
            setError(err.message); 
        }
    };

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
        fetchForumInfo(); 
        fetchInitialTopics();

        const handleNewTopic = (newTopic) => {
            const augmentedTopic = { ...newTopic, is_bookmarked: false };
            setTopics(prevTopics => [augmentedTopic, ...prevTopics]);
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

    const handleBookmarkToggle = (topicId, type) => {
        console.log(`Bookmark toggled for ${type} ${topicId}`);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
                        {forumInfo ? forumInfo.name : 'Forum Topics'}
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
                
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', maxWidth: '800px', mb: 2 }}>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {forumInfo ? forumInfo.name : 'Topics'}
                    </Typography>
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
                        <p style={{ textAlign: 'center', marginTop: '20px' }}>
                            <b>...</b>
                        </p>
                    }
                >
                    <List sx={{ width: '100%' }}>
                        {topics.map((topic) => (
                             <TopicListItem 
                                key={topic.id} 
                                topic={topic} 
                                onBookmarkToggle={handleBookmarkToggle} 
                             />
                        ))}
                    </List>
                </InfiniteScroll>
            </Box>
        </Box>
    );
}

export default TopicPage;