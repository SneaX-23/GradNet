import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Typography, CircularProgress, List, ListItem, ListItemButton, ListItemText, Fab, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getTopics, getForumById } from "/src/services/ForumService.jsx"; 
import { socket } from '/src/socket.js';
import CreateTopicModal from '/src/components/forum/CreateTopicModal.jsx';
import { theme, colors, borderStyle, shadowHover, shadowStyle } from '../theme';
import Layout from '../components/layout/Layout.jsx';

function TopicListItem({ topic }) {
    return (
        <ListItem 
            key={topic.id} 
            disablePadding 
            sx={{ 
                mb: 1,
                mt: '4px', 
                ml: '4px', 
                width: "calc(100% - 4px)",
                bgcolor: colors.green,
                border: borderStyle,
                boxShadow: shadowStyle,
                '&:hover': {
                    boxShadow: shadowHover,
                    transform: 'translate(-2px, -2px)',
                },
            }}
        >
            <ListItemButton component={Link} to={`/topic/${topic.id}`}>
                <ListItemText
                    primary={topic.title}
                    secondary={`By ${topic.author_name} • ${topic.post_count} posts`}
                    primaryTypographyProps={{ fontWeight: 'bold' }}
                    secondaryTypographyProps={{ color: colors.black }}
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

    return (
        <Layout title={forumInfo ? forumInfo.name : 'Topics'}>
            
            <CreateTopicModal
                open={isCreateModalOpen}
                onClose={() => setCreateModalOpen(false)}
                forumId={forumId}
                onTopicCreated={fetchInitialTopics}
            />

            <Fab
              color="primary"
              aria-label="create topic"
              onClick={() => setCreateModalOpen(true)}
              sx={{
                position: 'fixed',
                bottom: 24,
                right: { xs: 24, lg: 344 }, 
                zIndex: 1000,
              }}
            >
              <AddIcon />
            </Fab>

            <InfiniteScroll
                dataLength={topics.length}
                next={fetchMoreTopics}
                hasMore={hasMore}
                loader={<CircularProgress sx={{ my: 2, color: '#000000' }} />}
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
                         />
                    ))}
                </List>
            </InfiniteScroll>
        </Layout>
    );
}

export default TopicPage;