import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { MessageSquare, Plus, Loader2, ChevronRight, User, Calendar } from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';
import MainLayout from '../components/layout/MainLayout.jsx';
import CreateTopicModal from '/src/components/forum/CreateTopic.jsx';
import { getTopics, getForumById } from "/src/services/ForumService.jsx";
import { socket } from '/src/socket.js';

function TopicListItem({ topic }) {
    return (
        <Link
            to={`/topic/${topic.id}`}
            className="block bg-card p-4 sm:p-5 sm:rounded-2xl sm:border hover:bg-foreground/5 transition-all group border-b border-border/50 sm:border-b-none"
        >
            <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <h4 className="text-[15px] font-bold text-foreground group-hover:text-primary transition-colors truncate mb-1">
                        {topic.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-muted font-medium">
                        <span className="flex items-center gap-1">
                            <User size={12} />
                            {topic.author_name}
                        </span>

                        <span>•</span>

                        <span className="flex items-center gap-1">
                            <MessageSquare size={12} />
                            {topic.post_count} posts
                        </span>

                        <span className="hidden sm:inline">•</span>

                        <span className="hidden sm:inline-flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(topic.created_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>
                <ChevronRight size={18} className="text-muted shrink-0 transition-transform group-hover:translate-x-1" />
            </div>
        </Link>
    );
}

function ForumTopicPage() {
    const { forumId } = useParams();
    const [forumInfo, setForumInfo] = useState(null);
    const [topics, setTopics] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isCreateModalOpen, setCreateModalOpen] = useState(false);

    useEffect(() => {
        const loadInitial = async () => {
            const [info, list] = await Promise.all([getForumById(forumId), getTopics(forumId, 1)]);
            if (info.success) setForumInfo(info.forum);
            if (list.success) { setTopics(list.topics); setHasMore(list.hasMore); setPage(1); }
        };
        loadInitial();

        socket.on(`forum:${forumId}:new_topic`, (topic) => setTopics(prev => [topic, ...prev]));
        return () => socket.off(`forum:${forumId}:new_topic`);
    }, [forumId]);

    const fetchMore = async () => {
        const response = await getTopics(forumId, page + 1);
        if (response.success) {
            setTopics(prev => [...prev, ...response.topics]);
            setHasMore(response.hasMore);
            setPage(p => p + 1);
        } else { setHasMore(false); }
    };

    return (
        <MainLayout>
            <div className="w-full max-w-3xl mx-auto">
                <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4">
                    <Link to="/forums" className="text-xs font-bold text-primary uppercase mb-1 hover:underline flex items-center gap-1">
                        ← Back to Forums
                    </Link>
                    <h1 className="text-xl font-extrabold text-foreground tracking-tight truncate">
                        {forumInfo?.name || 'Topics'}
                    </h1>
                </div>

                <CreateTopicModal
                    open={isCreateModalOpen}
                    onClose={() => setCreateModalOpen(false)}
                    forumId={forumId}
                    onTopicCreated={() => window.location.reload()}
                />

                <InfiniteScroll
                    dataLength={topics.length}
                    next={fetchMore}
                    hasMore={hasMore}
                    loader={<div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>}
                    style={{ overflow: 'visible' }}
                >
                    <div className="flex flex-col space-y-0 sm:space-y-4 sm:py-4">
                        {topics.map((topic) => <TopicListItem key={topic.id} topic={topic} />)}
                    </div>
                </InfiniteScroll>
            </div>
        </MainLayout>
    );
}

export default ForumTopicPage;