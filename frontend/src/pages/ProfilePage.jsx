import React, { useState, useEffect } from 'react';
import {
    Github,
    Linkedin,
    Twitter,
    Globe,
    Mail,
    MapPin,
    Calendar,
    Pencil,
    FileText,
    User,
    Loader2,
    ShieldCheck,
    ExternalLink
} from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';

import MainLayout from '../components/layout/MainLayout.jsx';
import { useAuth } from '/src/context/AuthContext.jsx';
import { fetchUserProfile } from '/src/services/profileService.jsx';
import { showUserPosts } from "/src/services/showPostsService.jsx";
import { API_BASE_URL } from '/src/config.js';

// Components
import ShowPostsCard from '/src/components/posts/showPostCard.jsx';
import EditProfileModal from '/src/components/profile/EditProfileModal.jsx';
import ImageModal from '/src/components/imageOptions/ImageModal.jsx';

import {fetchGitHubStats} from "../services/userService.jsx";
import GitHubStats from '../components/profile/GitHubStats.jsx';

const getFullUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path}`;
};

export default function ProfilePage() {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('about');

    // Modals state
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [imageModal, setImageModal] = useState({ open: false, url: '' });

    // Posts state
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const [githubStats, setGithubStats] = useState(null);

    const loadGitHub = async () => {
        if (profileData?.github_url) {
            try {
                const res = await fetchGitHubStats(profileData.handle);
                if (res.success) setGithubStats(res.data);
            } catch (err) { console.error("GitHub stats error:", err); }
    }
    };

    useEffect(() => {
        if (profileData) loadGitHub();
    }, [profileData]);

    const loadProfile = async () => {
        try {
            setLoading(true);
            const data = await fetchUserProfile();
            if (data.success) {
                setProfileData(data.user);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadProfile(); }, []);

    // Fetch posts if user is admin or faculty
    useEffect(() => {
        if (profileData && (profileData.role === 'admin' || profileData.role === 'faculty')) {
            fetchInitialPosts();
        }
    }, [profileData]);

    const fetchInitialPosts = async () => {
        try {
            const response = await showUserPosts(1);
            if (response.success) {
                setPosts(response.feed);
                setHasMore(response.hasMore);
                setPage(1);
            }
        } catch (err) { console.error(err); }
    };

    const fetchMorePosts = async () => {
        const nextPage = page + 1;
        try {
            const response = await showUserPosts(nextPage);
            if (response.success) {
                setPosts(prev => [...prev, ...response.feed]);
                setHasMore(response.hasMore);
                setPage(nextPage);
            } else {
                setHasMore(false);
            }
        } catch (err) { setHasMore(false); }
    };

    const isHighLevel = profileData?.role === 'admin' || profileData?.role === 'faculty';
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

    if (loading) {
        return (
            <MainLayout>
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div>
            </MainLayout>
        );
    }

    const bannerUrl = getFullUrl(profileData?.profile_banner_url);
    const avatarUrl = getFullUrl(profileData?.profile_picture_url);

    return (
        <MainLayout>
            <div className="w-full max-w-3xl mx-auto">

                {/* Profile Header Card */}
                <div className="bg-card sm:border border-border sm:rounded-b-2xl overflow-hidden relative">
                    {/* Banner */}
                    <div
                        onClick={() => bannerUrl && setImageModal({ open: true, url: bannerUrl })}
                        className={`h-32 sm:h-52 bg-muted/20 border-b border-border transition-opacity ${bannerUrl ? 'cursor-pointer hover:opacity-90' : ''}`}
                        style={{ backgroundImage: bannerUrl ? `url(${bannerUrl})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}
                    >
                        {!bannerUrl && <div className="w-full h-full flex items-center justify-center text-muted/30"><User size={48} /></div>}
                    </div>

                    <div className="px-4 pb-6 relative">
                        <div className="absolute -top-12 sm:-top-16 left-4">
                            <div
                                onClick={() => avatarUrl && setImageModal({ open: true, url: avatarUrl })}
                                className={`w-24 h-24 sm:w-32 sm:h-32 bg-card border-4 border-background rounded-2xl overflow-hidden shadow-xl ${avatarUrl ? 'cursor-pointer' : ''}`}
                            >
                                {avatarUrl ? (
                                    <img src={avatarUrl} className="w-full h-full object-cover" alt="" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-xl font-semibold">
                                        {profileData.name?.[0]}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end pt-3">
                            <button
                                onClick={() => setEditModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-1.5 bg-primary text-background rounded-xl text-sm font-semibold shadow-sm hover:opacity-90 active:scale-95 transition-all"
                            >
                                <Pencil size={14} /> Edit profile
                            </button>
                        </div>

                        <div className="mt-4 sm:mt-6">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
                                    {profileData.name}
                                </h1>
                                {profileData.position && (
                                    <span className="px-2 py-0.5 bg-primary text-background text-[10px] font-bold uppercase rounded flex items-center gap-1">
                                        <ShieldCheck size={10} /> {profileData.position}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm sm:text-base text-muted">@{profileData.handle}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border flex px-4 mt-2">
                    <button
                        onClick={() => setActiveTab('about')}
                        className={`px-5 py-3 text-sm font-bold transition-colors relative ${activeTab === 'about' ? 'text-primary' : 'text-muted hover:text-foreground'}`}
                    >
                        About
                        {activeTab === 'about' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                    </button>

                    {profileData?.github_url && (
                        <button
                        onClick={() => setActiveTab('github')}
                        className={`px-5 py-3 text-sm font-bold transition-colors relative ${activeTab === 'github' ? 'text-primary' : 'text-muted hover:text-foreground'}`}
                        >
                            GitHub
                            {activeTab === 'github' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                        </button>
                    )}

                    {isHighLevel && (
                        <button
                            onClick={() => setActiveTab('posts')}
                            className={`px-5 py-3 text-sm font-bold transition-colors relative ${activeTab === 'posts' ? 'text-primary' : 'text-muted hover:text-foreground'}`}
                        >
                            Posts
                            {activeTab === 'posts' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                        </button>
                    )}
                </div>

                {/* Content Area */}
                <div className="flex flex-col space-y-0 sm:space-y-6 sm:py-6 animate-in fade-in duration-300">

                    {activeTab === 'about' && (
                        <div className="bg-card sm:border sm:rounded-2xl p-4 sm:p-6 space-y-8 border-b border-border sm:border-b-0">
                            {/* Biography */}
                            <section>
                                <h2 className="text-xs font-bold uppercase tracking-widest text-muted mb-4 flex items-center gap-2">
                                    <User size={14} /> Biography
                                </h2>
                                <p className="text-[15px] text-foreground/90 leading-relaxed whitespace-pre-wrap">
                                    {profileData.bio || "No biography provided yet."}
                                </p>
                            </section>

                            {/* Identity & Metadata Grid */}
                            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div className="flex items-center gap-3 text-muted text-sm">
                                    <Mail size={16} /> <span>{profileData.email}</span>
                                </div>
                                <div className="flex items-center gap-3 text-muted text-sm">
                                    <Calendar size={16} /> <span>Joined {new Date(profileData.created_at).toLocaleDateString()}</span>
                                </div>
                            </section>

                            {/* Social Links */}
                            <section className="pt-4">
                                <h2 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">External Links</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {[
                                        { name: 'LinkedIn', icon: <Linkedin size={18} />, url: profileData.linkedin_url },
                                        { name: 'GitHub', icon: <Github size={18} />, url: profileData.github_url },
                                        { name: 'X / Twitter', icon: <Twitter size={18} />, url: profileData.twitter_url }
                                    ].filter(link => link.url).map((link) => (
                                        <a
                                            key={link.name}
                                            href={link.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center justify-between p-3 border border-border rounded-xl hover:bg-foreground/5 transition-all group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-muted group-hover:text-primary transition-colors">{link.icon}</span>
                                                <span className="font-semibold text-sm">{link.name}</span>
                                            </div>
                                            <ExternalLink size={14} className="text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </a>
                                    ))}
                                    {(!profileData.linkedin_url && !profileData.github_url && !profileData.twitter_url) && (
                                        <p className="text-xs text-muted col-span-2 italic">No external links connected.</p>
                                    )}
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'github' && githubStats && (
                        <div className="bg-card sm:border sm:rounded-2xl p-4 sm:p-6 border-b border-border sm:border-b-0">
                            <GitHubStats githubData={githubStats} github_url={profileData.github_url} />
                        </div>
                    )}

                    {activeTab === 'posts' && isHighLevel && (
                        <InfiniteScroll
                            dataLength={posts.length}
                            next={fetchMorePosts}
                            hasMore={hasMore}
                            loader={<div className="flex justify-center py-10"><Loader2 className="animate-spin text-primary" /></div>}
                            style={{ overflow: 'visible' }}
                        >
                            <div className="flex flex-col space-y-0 sm:space-y-6">
                                {posts.map((post, idx) => (
                                    <div key={`${post.id}-${idx}`} className="border-b border-border/60 sm:border-none">
                                        <ShowPostsCard
                                            post={{ ...post, author_name: profileData.name, profile_picture_url: profileData.profile_picture_url, handle: profileData.handle }}
                                            onDelete={handleDeletePost}
                                            onUpdate={handleUpdatePost}
                                        />
                                    </div>
                                ))}
                            </div>
                        </InfiniteScroll>
                    )}
                </div>
            </div>

            {/* Modals */}
            <EditProfileModal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                profileData={profileData}
                onSave={loadProfile}
            />
            <ImageModal
                open={imageModal.open}
                onClose={() => setImageModal({ open: false, url: '' })}
                imageUrl={imageModal.url}
            />
        </MainLayout>
    );
}