import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Bookmark, Info } from 'lucide-react';
import InfiniteScroll from 'react-infinite-scroll-component';

import MainLayout from '../components/layout/MainLayout.jsx';
import { useAuth } from '/src/context/AuthContext.jsx';
import { getBookmarks } from "/src/services/bookmarksService.jsx";

// Components
import ShowPostsCard from '/src/components/posts/showPostCard.jsx';
import JobCard from '/src/components/jobs/JobCard.jsx';
import ForumCard from '/src/components/forum/ForumCard.jsx';
// import MentorshipCard from '../components/mentorship/MentorshipCard.jsx';

function BookmarksPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [bookmarks, setBookmarks] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState('');

    const fetchInitialBookmarks = async () => {
        try {
            setError('');
            const response = await getBookmarks(1);
            if (response.success) {
                setBookmarks(response.bookmarks);
                setHasMore(response.hasMore);
                setPage(1);
            } else {
                setError(response.message || 'Failed to fetch bookmarks.');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/');
        } else {
            fetchInitialBookmarks();
        }
    }, [user, navigate]);

    const fetchMoreData = async () => {
        const nextPage = page + 1;
        try {
            const response = await getBookmarks(nextPage);
            if (response.success) {
                setBookmarks(prevBookmarks => [...prevBookmarks, ...response.bookmarks]);
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

    const handleBookmarkChange = (itemId, itemType) => {
        setBookmarks(prevBookmarks => prevBookmarks.filter(b =>
            !(b.bookmarkable_id === itemId && b.bookmarkable_type === itemType)
        ));
    };

    const renderBookmark = (bookmark, index) => {
        const { bookmarkable_type, data } = bookmark;
        if (!data) return null;

        const commonProps = {
            onDelete: () => { },
            onUpdate: () => { },
            onBookmarkToggle: () => handleBookmarkChange(data.id, bookmarkable_type),
        };

        const itemWrapperClass = "border-b border-border/60 sm:border-none";

        let component;
        switch (bookmarkable_type) {
            case 'post':
                component = <ShowPostsCard post={data} {...commonProps} />;
                break;
            case 'job':
                component = <JobCard job={data} {...commonProps} />;
                break;
            case 'forum':
                component = <ForumCard forum={data} {...commonProps} />;
                break;
            // case 'mentorship':
            //     component = (
            //         <MentorshipCard 
            //             mentorship={data}
            //             onUpdate={fetchInitialBookmarks} 
            //             {...commonProps} 
            //         />
            //     );
            //     break;
            default:
                component = (
                    <div className="p-4 bg-card border border-border sm:rounded-2xl">
                        <p className="text-muted text-sm">Bookmarked {bookmarkable_type} (Display not implemented)</p>
                    </div>
                );
        }

        return (
            <div key={`${bookmarkable_type}-${data.id}-${index}`} className={itemWrapperClass}>
                {component}
            </div>
        );
    };

    if (!user) return null;

    return (
        <MainLayout>
            <div className="w-full max-w-3xl mx-auto">
                {/* Sticky Header */}
                <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3">
                    <Bookmark className="text-primary" size={20} />
                    <h1 className="text-lg font-bold text-foreground">My Bookmarks</h1>
                </div>

                {/* Error State */}
                {error && (
                    <div className="m-4 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-500">
                        <Info size={18} />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                )}

                {/* List Content */}
                <InfiniteScroll
                    dataLength={bookmarks.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={
                        <div className="flex justify-center py-10">
                            <Loader2 className="animate-spin text-primary" size={32} />
                        </div>
                    }
                    endMessage={
                        bookmarks.length > 0 && (
                            <div className="py-10 text-center text-muted text-sm font-medium">
                                End of bookmarks
                            </div>
                        )
                    }
                    style={{ overflow: 'visible' }}
                >
                    {bookmarks.length > 0 ? (
                        <div className="flex flex-col space-y-0 sm:space-y-6 sm:py-6">
                            {bookmarks.map((bookmark, index) => renderBookmark(bookmark, index))}
                        </div>
                    ) : (
                        !error && (
                            <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                                <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mb-4">
                                    <Bookmark size={32} className="text-muted" />
                                </div>
                                <h3 className="text-foreground font-bold text-lg">No bookmarks yet</h3>
                                <p className="text-muted text-sm max-w-xs mt-1">
                                    Items you bookmark will appear here for easy access.
                                </p>
                            </div>
                        )
                    )}
                </InfiniteScroll>
            </div>
        </MainLayout>
    );
}

export default BookmarksPage;