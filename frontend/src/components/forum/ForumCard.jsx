import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MoreVertical, Bookmark, BookmarkCheck, Trash2, Pencil, MessageSquare, User, Calendar } from 'lucide-react';
import { useAuth } from '/src/context/AuthContext.jsx';
import { addBookmark, deleteBookmark } from '/src/services/bookmarksService.jsx';
import { API_BASE_URL } from '/src/config.js';
import DeletePostModal from '../posts/DeletePostModal.jsx';
import EditForumModal from './EditForumModal.jsx';

const getFullUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path}`;
};

export default function ForumCard({ forum, onDelete, onBookmarkToggle }) {
    const { user } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(forum.is_bookmarked);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isBookmarkPending, setIsBookmarkPending] = useState(false);
    const menuRef = useRef(null);
    const canModify = user?.role === 'admin' || user?.role === 'faculty';

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleBookmarkClick = async (e) => {
        e.preventDefault(); e.stopPropagation();
        if (isBookmarkPending) return;
        setIsBookmarkPending(true);
        try {
            if (isBookmarked) {
                await deleteBookmark(forum.id, 'forum');
                setIsBookmarked(false);
            } else {
                await addBookmark(forum.id, 'forum');
                setIsBookmarked(true);
            }
            if (onBookmarkToggle) onBookmarkToggle(forum.id, 'forum');
        } catch (err) { console.error(err); } finally { setIsBookmarkPending(false); }
    };

    return (
        <div className="w-full bg-card sm:border border-border sm:rounded-2xl transition-all sm:shadow-sm sm:hover:shadow-md overflow-hidden relative group">
            <Link to={`/forums/${forum.id}`} className="block p-2 sm:p-4">
                <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="p-1.5 bg-primary/10 text-primary rounded-lg">
                                <MessageSquare size={18} />
                            </div>
                            <h3 className="text-sm md:text-sm lg:text-lg font-bold text-foreground truncate group-hover:text-primary transition-colors">
                                {forum.name}
                            </h3>
                        </div>
                        <p className="text-sm text-muted line-clamp-2 leading-relaxed">
                            {forum.description}
                        </p>
                    </div>

                    <div className="flex items-center gap-1" ref={menuRef}>
                        <button
                            onClick={handleBookmarkClick}
                            className={`p-2 rounded-full transition-all ${isBookmarked ? 'text-primary bg-primary/10' : 'text-muted hover:bg-foreground/5'}`}
                        >
                            {isBookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                        </button>

                        {canModify && (
                            <div className="relative">
                                <button
                                    onClick={(e) => { e.preventDefault(); setMenuOpen(!menuOpen); }}
                                    className="p-2 rounded-full text-muted hover:bg-foreground/5 transition-colors"
                                >
                                    <MoreVertical size={20} />
                                </button>
                                {menuOpen && (
                                    <div className="absolute z-9999 right-0 mt-2 w-40 bg-card border border-border rounded-xl shadow-xl  py-1.5 animate-in fade-in zoom-in-95 duration-100">
                                        <button onClick={(e) => { e.preventDefault(); setEditModalOpen(true); }} className="w-full px-4 py-2 text-sm text-left flex items-center gap-2 hover:bg-foreground/5 text-foreground">
                                            <Pencil size={14} /> Edit
                                        </button>
                                        <button
                                            onClick={(e) => { e.preventDefault(); setDeleteModalOpen(true); }}
                                            className="w-full px-4 py-2 text-sm text-left flex items-center gap-2 text-red-500 hover:bg-red-500/5"
                                        >
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 border border-border flex items-center justify-center overflow-hidden shrink-0">
                            {forum.profile_picture_url ? (
                                <img src={getFullUrl(forum.profile_picture_url)} className="w-full h-full object-cover" alt="" />
                            ) : (
                                <span className="text-[10px] font-bold text-primary">{forum.author_name?.[0]}</span>
                            )}
                        </div>
                        <span className="text-xs font-semibold text-foreground/80">{forum.author_name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted text-[11px] font-medium">
                        <Calendar size={12} />
                        {new Date(forum.created_at).toLocaleDateString()}
                    </div>
                </div>
            </Link>
            <div className='z-50' >
                <DeletePostModal
                    open={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={() => { onDelete(forum.id); setDeleteModalOpen(false); }}
                    type="forum"
                    section="forums section"
                />
                <EditForumModal
                    open={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    onForumUpdated={() => { setEditModalOpen(false); }}
                    forum={forum}
                />
            </div>
        </div>
    );
}