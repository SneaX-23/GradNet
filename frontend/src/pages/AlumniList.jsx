import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '/src/context/AuthContext.jsx';
import { getAlumniList, searchAlumni } from '/src/services/alumniService.jsx';
import MainLayout from '/src/components/layout/MainLayout.jsx';
function AlumniListPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [alumni, setAlumni] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const fetchInitial = useCallback(async () => {
        setLoading(true);
        try {
            setError('');
            const data = await getAlumniList(1);
            setAlumni(data.alumni || []);
            setHasMore(data.hasMore);
            setPage(1);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchMore = async () => {
        if (isSearching || !hasMore) return;

        const nextPage = page + 1;
        try {
            const data = await getAlumniList(nextPage);
            setAlumni((prev) => [...prev, ...data.alumni]);
            setHasMore(data.hasMore);
            setPage(nextPage);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }
        fetchInitial();
    }, [user, navigate, fetchInitial]);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (!searchQuery.trim()) {
                setIsSearching(false);
                fetchInitial();
                return;
            }

            setIsSearching(true);
            setLoading(true);

            try {
                const data = await searchAlumni(searchQuery);
                setAlumni(data.alumni || []);
                setHasMore(false);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, fetchInitial]);

    if (!user) return null;

    return (
        <MainLayout>
            <main className="w-full min-h-screen bg-background text-foreground">
                <div className="w-full max-w-6xl mx-auto px-0 sm:px-4 py-6">

                    {/* Header */}
                    <div className="sm:sticky sm:top-0 sm:z-30 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-2 sm:px-4">
                        <div className="flex h-12 items-center justify-between gap-3">

                            {/* Title – Desktop only */}
                            <h1 className="hidden sm:block text-base font-semibold shrink-0">
                                Alumni Directory
                            </h1>

                            {/* Search Box */}
                            <div className="w-full sm:w-72">
                                <input
                                    type="text"
                                    placeholder="Search alumni…"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="
                                        w-full 
                                        rounded-md border border-border bg-background
                                        px-3 py-1.5
                                        text-sm
                                        focus:outline-none focus:ring-2 focus:ring-primary
                                    "
                                />
                            </div>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    {/* Infinite Scroll */}
                    <InfiniteScroll
                        dataLength={alumni.length}
                        next={fetchMore}
                        hasMore={!isSearching && hasMore}
                        loader={
                            <p className="py-4 text-center text-sm text-muted-foreground">
                                Loading more alumni…
                            </p>
                        }
                        endMessage={
                            !isSearching && (
                                <p className="py-4 text-center text-xs text-muted-foreground">
                                    You have reached the end
                                </p>
                            )
                        }
                    >

                        {/* Desktop Header */}
                        {alumni.length > 0 && (
                            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium uppercase text-muted-foreground border-b">
                                <span className="col-span-3">Name</span>
                                <span className="col-span-2">USN</span>
                                <span className="col-span-3">Email</span>
                                <span className="col-span-2">Graduation</span>
                                <span className="col-span-2">Company</span>
                            </div>
                        )}

                        {/* List */}
                        <div className="divide-y divide-border border border-border rounded-md">
                            {alumni.map((alum) => (
                                <div
                                    key={alum.id}
                                    className="
                                        px-4 py-4
                                        hover:bg-muted/40 transition
                                        md:grid md:grid-cols-12 md:gap-4
                                    "
                                >
                                    <div className="md:col-span-3">
                                        <p className="font-medium">{alum.name}</p>
                                        <p className="text-xs text-muted-foreground md:hidden">
                                            {alum.usn}
                                        </p>
                                    </div>

                                    <div className="hidden md:block md:col-span-2 text-sm">
                                        {alum.usn}
                                    </div>

                                    <div className="md:col-span-3 text-sm break-all">
                                        {alum.email}
                                    </div>

                                    <div className="md:col-span-2 text-sm">
                                        {alum.graduation_year || 'N/A'}
                                    </div>

                                    <div className="md:col-span-2 text-sm">
                                        {alum.company_name || 'N/A'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </InfiniteScroll>

                    {/* Initial Loading */}
                    {loading && alumni.length === 0 && (
                        <p className="mt-6 text-center text-sm text-muted-foreground">
                            Loading alumni…
                        </p>
                    )}
                </div>
            </main>
        </MainLayout>
    );
}

export default AlumniListPage;
