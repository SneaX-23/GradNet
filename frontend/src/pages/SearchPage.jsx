import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Loader2, User, ShieldCheck, ArrowRight, X } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout.jsx';
import { searchUsers } from '../services/userService.jsx';
import { API_BASE_URL } from '../config.js';

const getFullUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path}`;
};

export default function SearchPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setSearchResults([]);
            setSearchError('');
            return;
        }

        setIsSearchLoading(true);
        const debounceTimer = setTimeout(async () => {
            try {
                setSearchError('');
                const data = await searchUsers(searchQuery);
                setSearchResults(data.users || []);
            } catch (err) {
                setSearchError(err.message);
            } finally {
                setIsSearchLoading(false);
            }
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    const handleUserClick = (handle) => {
        setSearchQuery('');
        setSearchResults([]);
        navigate(`/profile/${handle}`);
    };

    return (
        <MainLayout>
            <div className="w-full max-w-3xl mx-auto min-h-screen sm:py-6">

                <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border px-4 py-4 sm:rounded-t-2xl sm:border sm:bg-card">
                    <div className="relative group">
                        <Search
                            className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${isSearchLoading ? 'text-primary' : 'text-muted group-focus-within:text-primary'
                                }`}
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder="Search people by name or handle..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-background border border-border rounded-2xl pl-12 pr-12 py-3 text-foreground placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner"
                            autoFocus
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-foreground/5 rounded-full text-muted transition-colors"
                            >
                                <X size={18} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Results Area */}
                <div className="bg-card sm:border-x sm:border-b border-border sm:rounded-b-2xl overflow-hidden min-h-100">

                    {/* Loading State */}
                    {isSearchLoading && (
                        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-300">
                            <Loader2 className="animate-spin text-primary mb-4" size={32} />
                            <p className="text-muted text-sm font-medium">Searching our directory...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {searchError && (
                        <div className="p-8 text-center animate-in fade-in">
                            <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl inline-block mx-auto text-sm font-medium">
                                {searchError}
                            </div>
                        </div>
                    )}

                    {/* Empty State: Initial */}
                    {!searchQuery && !isSearchLoading && (
                        <div className="flex flex-col items-center justify-center py-24 text-center px-6 opacity-60">
                            <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mb-4">
                                <Search size={32} className="text-muted" />
                            </div>
                            <h3 className="text-foreground font-bold text-lg">Find your connections</h3>
                            <p className="text-muted text-sm max-w-xs mt-1">
                                Search for alumni, faculty, or students by their name or unique handle.
                            </p>
                        </div>
                    )}

                    {/* Empty State: No Results */}
                    {searchQuery && !isSearchLoading && searchResults.length === 0 && !searchError && (
                        <div className="py-24 text-center px-6 animate-in fade-in">
                            <p className="text-muted font-medium">No results found for "{searchQuery}"</p>
                            <p className="text-muted/60 text-xs mt-1">Try checking for typos or use a different name.</p>
                        </div>
                    )}

                    {/* Results List */}
                    {!isSearchLoading && searchResults.length > 0 && (
                        <div className="flex flex-col divide-y divide-border/50">
                            {searchResults.map((user) => (
                                <button
                                    key={user.id}
                                    onClick={() => handleUserClick(user.handle)}
                                    className="w-full flex items-center justify-between p-4 text-left hover:bg-foreground/3 active:bg-foreground/5 transition-all group"
                                >
                                    <div className="flex items-center gap-4 min-w-0">
                                        <div className="w-12 h-12 rounded-xl border border-border overflow-hidden bg-muted/20 shrink-0 shadow-sm transition-transform group-hover:scale-105">
                                            {user.profile_picture_url ? (
                                                <img
                                                    src={getFullUrl(user.profile_picture_url)}
                                                    className="w-full h-full object-cover"
                                                    alt=""
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-lg">
                                                    {user.name?.[0]}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col min-w-0">
                                            <div className="flex items-center gap-1.5 min-w-0">
                                                <span className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                                                    {user.name}
                                                </span>
                                                {(user.role === 'admin' || user.role === 'faculty') && (
                                                    <ShieldCheck size={14} className="text-blue-500 shrink-0" />
                                                )}
                                            </div>
                                            <span className="text-xs text-muted truncate">@{user.handle}</span>
                                            {user.position && (
                                                <span className="text-[10px] text-primary/80 font-bold uppercase tracking-wider mt-0.5">
                                                    {user.position}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <ArrowRight
                                        size={18}
                                        className="text-muted opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}