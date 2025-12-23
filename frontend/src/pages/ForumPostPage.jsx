import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Send, Loader2, User, MessageCircle } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout.jsx';
import { getPosts, createPost } from "/src/services/ForumService.jsx";
import { socket } from '/src/socket.js';
import { API_BASE_URL } from '/src/config.js';

const getFullUrl = (path) => path?.startsWith('http') ? path : `${API_BASE_URL}${path}`;

function ForumPostPage() {
    const { topicId } = useParams();
    const [posts, setPosts] = useState([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await getPosts(topicId, 1);
            if (response.success) setPosts(response.posts);
        };
        fetchPosts();

        socket.on(`topic:${topicId}:new_post`, (data) => setPosts(prev => [...prev, data]));
        return () => socket.off(`topic:${topicId}:new_post`);
    }, [topicId]);

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!newPostContent.trim()) return;
        setIsSubmitting(true);
        try {
            await createPost(topicId, newPostContent);
            setNewPostContent('');
        } catch (error) { console.error(error); } finally { setIsSubmitting(false); }
    };

    return (
        <MainLayout>
            <div className="w-full max-w-3xl mx-auto flex flex-col h-[calc(100vh-64px)] sm:h-auto">
                <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4 shrink-0">
                    <h1 className="text-lg font-extrabold text-foreground tracking-tight flex items-center gap-2">
                        <MessageCircle size={20} className="text-primary" /> Discussion
                    </h1>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={scrollRef}>
                    {posts.map((post) => (
                        <div key={post.id} className="flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="w-10 h-10 rounded-full bg-primary/10 border border-border flex items-center justify-center overflow-hidden shrink-0">
                                {post.profile_picture_url ? (
                                    <img src={getFullUrl(post.profile_picture_url)} className="w-full h-full object-cover" />
                                ) : <span className="font-bold text-primary">{post.author_name?.[0]}</span>}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-foreground text-sm hover:underline cursor-pointer">{post.author_name}</span>
                                    <span className="text-xs text-muted">@{post.handle}</span>
                                </div>
                                <div className="bg-card border border-border p-4 rounded-2xl rounded-tl-none text-[15px] leading-relaxed text-foreground/90 shadow-sm">
                                    {post.content}
                                </div>
                                <span className="text-[10px] text-muted font-medium mt-1 inline-block px-1">
                                    {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Reply Bar */}
                <div className="p-4 bg-background border-t border-border sticky bottom-0 sm:relative">
                    <form onSubmit={handlePostSubmit} className="relative group">
                        <textarea
                            rows={1}
                            placeholder="Write a reply..."
                            value={newPostContent}
                            onChange={(e) => setNewPostContent(e.target.value)}
                            className="w-full bg-card border border-border rounded-2xl px-5 py-3 pr-14 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none shadow-inner"
                        />
                        <button
                            disabled={isSubmitting || !newPostContent.trim()}
                            className="absolute right-2 top-1.5 p-2 text-primary hover:bg-primary/10 rounded-xl transition-all disabled:opacity-30 group-focus-within:scale-105"
                        >
                            {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                        </button>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}

export default ForumPostPage;