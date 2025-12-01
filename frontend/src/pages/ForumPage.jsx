import { useState, useEffect } from "react";
import { useAuth } from '/src/context/AuthContext.jsx';
import { Typography, CircularProgress, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getForums, deleteForum } from "/src/services/ForumService.jsx";
import ForumCard from "/src/components/forum/ForumCard.jsx";
import CreateForumModal from "/src/components/forum/CreateForumModal.jsx";
import { socket } from '/src/socket.js';
import Layout from '../components/layout/Layout.jsx';

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

    const handleDeleteForum = async (forumId) => {
        try {
            await deleteForum(forumId);
            setForums(prevForums => prevForums.filter(f => f.id !== forumId));
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Layout title="GradNet - Forums">
             {user && (user.role === 'admin' || user.role === 'faculty') && (
                <Fab
                  color="primary"
                  aria-label="create forum"
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
            )}

            <CreateForumModal
                open={isCreateModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onForumCreated={fetchInitialForums}
            />
            
            {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

            <InfiniteScroll
                dataLength={forums.length}
                next={fetchMoreForums}
                hasMore={hasMore}
                loader={<CircularProgress sx={{ my: 2, color: '#000000' }} />}
                endMessage={
                    <p style={{ textAlign: 'center', marginTop: '20px' }}>
                        <b>End of list</b>
                    </p>
                }
                style={{width: '100%', maxWidth: '800px'}}
            >
                {forums.map((forum, index) => (
                    <ForumCard
                        key={`${forum.id}-${index}`}
                        forum={forum}
                        onDelete={handleDeleteForum}
                    />
                ))}
            </InfiniteScroll>
        </Layout>
    );
}

export default ForumPage;