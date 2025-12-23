import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Loader2 } from 'lucide-react';
import CreatePost from '../components/posts/CreatePost';
import MainLayout from "../components/layout/MainLayout";
import { useAuth } from '../context/AuthContext.jsx';
import initiateShowPosts from "../services/showPostsService.jsx";
import { API_BASE_URL } from '../config.js';
import ShowPostsCard from "../components/posts/showPostCard.jsx";

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }

        const fetchInitialPosts = async () => {
            try {
                const response = await initiateShowPosts(1);
                if (response.success) {
                    setPosts(response.feed);
                    setHasMore(response.hasMore);
                } else {
                    setError(response.message || 'Failed to fetch posts.');
                }
            } catch (err) {
                setError(err.message);
            }
        };
        fetchInitialPosts();
    }, [user, navigate]);

    const fetchMoreData = async () => {
        const nextPage = page + 1;
        try {
            const response = await initiateShowPosts(nextPage);
            if (response.success) {
                setPosts(prevPosts => [...prevPosts, ...response.feed]);
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

    const handleDeletePost = async (postId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/home/delete-post/${postId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) throw new Error('Failed to delete the post.');
            setPosts(posts.filter(post => post.id !== postId));
        } catch (error) {
            setError(error.message);
        }
    };

    const handleUpdatePost = (updatedPost) => {
        setPosts(posts.map(post =>
            post.id === updatedPost.id ? { ...post, ...updatedPost } : post
        ));
    };

    if (!user) return null;

    return (
        <MainLayout>
            <div className="w-full max-w-3xl mx-auto">
                {user && (user.role === 'admin' || user.role === 'faculty') && <CreatePost />}
                {error && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg m-4">
                        {error}
                    </div>
                )}

                <InfiniteScroll
                    dataLength={posts.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={
                        <div className="flex justify-center py-8">
                            <Loader2 className="animate-spin text-primary w-8 h-8" />
                        </div>
                    }
                    style={{ overflow: 'visible' }}
                >
                    <div className="flex flex-col space-y-0 sm:space-y-6 sm:pt-6">
                        {posts.map((post, index) => (
                            <div
                                key={`${post.id}-${index}`}
                                className="border-b border-border/50 sm:border-none"
                            >
                                <ShowPostsCard
                                    post={post}
                                    onDelete={handleDeletePost}
                                    onUpdate={handleUpdatePost}
                                />
                            </div>
                        ))}
                    </div>
                </InfiniteScroll>
            </div>
        </MainLayout>
    );
};

export default Home;