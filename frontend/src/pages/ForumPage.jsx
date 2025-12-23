import React, { useState, useEffect } from "react";
import { Plus, Loader2, Info } from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import MainLayout from '../components/layout/MainLayout.jsx';
import ForumCard from "/src/components/forum/ForumCard.jsx";
import CreateForumModal from "/src/components/forum/CreateForumModal.jsx";
import { getForums, deleteForum } from "/src/services/ForumService.jsx";
import { useAuth } from '/src/context/AuthContext.jsx';
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
        } catch (err) { setError(err.message); }
    };

    useEffect(() => {
        fetchInitialForums();
        const handleNewForum = (newForum) => setForums(prev => [newForum, ...prev]);
        socket.on('new_forum_category', handleNewForum);
        return () => socket.off('new_forum_category', handleNewForum);
    }, []);

    const fetchMoreForums = async () => {
        const nextPage = page + 1;
        try {
            const response = await getForums(nextPage);
            if (response.success) {
                setForums(prev => [...prev, ...response.forums]);
                setHasMore(response.hasMore);
                setPage(nextPage);
            } else { setHasMore(false); }
        } catch (err) { setHasMore(false); }
    };

    const handleDeleteForum = async (forumId) => {
        try {
            await deleteForum(forumId);
            setForums(prev => prev.filter(f => f.id !== forumId));
        } catch (err) { setError(err.message); }
    };

    return (
        <MainLayout>
            <div className="w-full max-w-3xl mx-auto">
                <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4 flex items-center justify-between">
                    <h1 className="text-xl font-extrabold text-foreground tracking-tight">Community Forums</h1>
                </div>

                {/* FAB */}
                {user && (user.role === 'admin' || user.role === 'faculty') && (
                    <CreateForumModal
                        open={isCreateModalOpen}
                        onClose={() => setCreateModalOpen(false)}
                        onForumCreated={fetchInitialForums}
                    />
                )}

                <InfiniteScroll
                    dataLength={forums.length}
                    next={fetchMoreForums}
                    hasMore={hasMore}
                    loader={<div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>}
                    style={{ overflow: 'visible' }}
                >
                    <div className="flex flex-col space-y-0 sm:space-y-6 sm:py-6">
                        {forums.map((forum, index) => (
                            <div key={`${forum.id}-${index}`} className="border-b border-border/60 sm:border-none">
                                <ForumCard forum={forum} onDelete={handleDeleteForum} />
                            </div>
                        ))}
                    </div>
                </InfiniteScroll>
            </div>
        </MainLayout>
    );
}

export default ForumPage;