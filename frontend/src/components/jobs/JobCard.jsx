import React, { useState, useEffect, useRef } from 'react';
import {
    Briefcase,
    MapPin,
    Building2,
    Calendar,
    ChevronDown,
    MoreVertical,
    Bookmark,
    BookmarkCheck,
    Trash2,
    Pencil,
    ExternalLink,
    IndianRupee,
    Clock
} from 'lucide-react';
import { useAuth } from '/src/context/AuthContext.jsx';
import { addBookmark, deleteBookmark } from '/src/services/bookmarksService.jsx';
import { API_BASE_URL } from '/src/config.js';
import EditJobModal from './EditJobModal.jsx';
import DeletePostModal from '../posts/DeletePostModal.jsx';

const getFullUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path}`;
};

const ensureAbsoluteUrl = (url) => {
    if (!url) return '';
    return (url.startsWith('http://') || url.startsWith('https://')) ? url : `https://${url}`;
};

export default function JobCard({ job, onDelete, onUpdate, onBookmarkToggle }) {
    const { user } = useAuth();
    const [expanded, setExpanded] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(job.is_bookmarked);
    const [isBookmarkPending, setIsBookmarkPending] = useState(false);

    const menuRef = useRef(null);
    const canModify = user?.id === job.posted_by || user?.role === 'admin';

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleBookmarkClick = async (e) => {
        e.stopPropagation();
        if (isBookmarkPending) return;
        setIsBookmarkPending(true);
        try {
            if (isBookmarked) {
                await deleteBookmark(job.id, 'job');
                setIsBookmarked(false);
            } else {
                await addBookmark(job.id, 'job');
                setIsBookmarked(true);
            }
            if (onBookmarkToggle) onBookmarkToggle(job.id, 'job');
        } catch (err) {
            console.error("Bookmark failed:", err);
        } finally {
            setIsBookmarkPending(false);
        }
    };

    return (
        <div className="w-full bg-card sm:border border-border sm:rounded-2xl transition-all sm:shadow-sm sm:hover:shadow-md overflow-hidden">
            <div className="p-4 sm:p-5">
                <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                        {/* Job Title & Company */}
                        <h3 className="text-lg font-bold text-foreground truncate group cursor-pointer">
                            {job.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-primary font-medium">
                            <Building2 size={16} />
                            <span className="text-sm truncate">{job.company}</span>
                        </div>

                        {/* Core Details Row */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-muted">
                            <div className="flex items-center gap-1.5 text-xs">
                                <MapPin size={14} />
                                <span>{job.location} ({job.work_location})</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs">
                                <Briefcase size={14} />
                                <span>{job.job_type}</span>
                            </div>
                            {job.salary_range && (
                                <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-500 font-medium">
                                    <IndianRupee size={14} />
                                    <span>{job.salary_range}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Area */}
                    <div className="flex items-center gap-1 ml-4" ref={menuRef}>
                        <button
                            onClick={handleBookmarkClick}
                            disabled={isBookmarkPending}
                            className={`p-2 rounded-full transition-all ${isBookmarked ? 'text-primary ' : 'text-muted '}`}
                        >
                            {isBookmarked ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                        </button>

                        {canModify && (
                            <div className="relative">
                                <button
                                    onClick={() => setMenuOpen(!menuOpen)}
                                    className="p-2 rounded-full text-muted hover:bg-foreground/5 transition-colors"
                                >
                                    <MoreVertical size={20} />
                                </button>
                                {menuOpen && (
                                    <div className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-xl shadow-xl z-20 py-1.5 animate-in fade-in zoom-in-95 duration-100">
                                        <button
                                            onClick={() => { setEditModalOpen(true); setMenuOpen(false); }}
                                            className="w-full px-4 py-2 text-sm text-left flex items-center gap-2 hover:bg-foreground/5"
                                        >
                                            <Pencil size={16} /> Edit Job
                                        </button>
                                        <button
                                            onClick={() => { setDeleteModalOpen(true); setMenuOpen(false); }}
                                            className="w-full px-4 py-2 text-sm text-left flex items-center gap-2 text-red-500 hover:bg-red-500/5"
                                        >
                                            <Trash2 size={16} /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Collapsible Content */}
                <div className={`grid transition-all duration-300 ease-in-out ${expanded ? 'grid-rows-[1fr] opacity-100 mt-5' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden space-y-4">
                        <div className="h-px bg-border/50 w-full" />

                        <section>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Description</h4>
                            <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">{job.description}</p>
                        </section>

                        {job.requirements && (
                            <section>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">Requirements</h4>
                                <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">{job.requirements}</p>
                            </section>
                        )}

                        <div className="flex flex-wrap gap-4 pt-2">
                            {job.application_deadline && (
                                <div className="flex items-center gap-2 text-xs text-muted">
                                    <Calendar size={14} />
                                    <span>Deadline: {new Date(job.application_deadline).toLocaleDateString()}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-xs text-muted">
                                <Clock size={14} />
                                <span>Posted {new Date(job.updated_at).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {job.external_link && (
                            <a
                                href={ensureAbsoluteUrl(job.external_link)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-background font-bold rounded-xl hover:opacity-90 transition-opacity text-sm mt-4"
                            >
                                Apply for this Position <ExternalLink size={16} />
                            </a>
                        )}
                    </div>
                </div>

                {/* Card Footer*/}
                <div className="flex items-center justify-between mt-4">
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="flex items-center gap-1 text-xs font-bold text-primary hover:underline uppercase tracking-tight"
                    >
                        {expanded ? 'Show less' : 'Show more Details'}
                        <ChevronDown size={14} className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
                    </button>

                    <div className="flex items-center gap-2 group cursor-pointer">
                        <span className="text-[10px] text-muted font-medium text-right leading-tight hidden sm:block">
                            Posted by<br /><b className="text-foreground">{job.author_name}</b>
                        </span>
                        <div className="w-8 h-8 rounded-full bg-primary/10 border border-border overflow-hidden flex items-center justify-center shrink-0">
                            {job.profile_picture_url ? (
                                <img src={getFullUrl(job.profile_picture_url)} className="w-full h-full object-cover" alt="" />
                            ) : (
                                <span className="text-xs font-bold text-primary">{job.author_name?.[0]?.toUpperCase()}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <EditJobModal
                open={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                job={job}
                onSave={onUpdate}
            />

            <DeletePostModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={() => { onDelete(job.id); setDeleteModalOpen(false); }}
                type="Job"
                section="Jobs section"
            />
        </div>
    );
}