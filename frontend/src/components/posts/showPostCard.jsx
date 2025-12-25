import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Bookmark, BookmarkCheck, FileText, Download, Trash2, Pencil,
    ChevronLeft, ChevronRight, Maximize2, X, ShieldCheck, MoreVertical
} from 'lucide-react';
import ImageModal from '../imageOptions/ImageModal';
import EditPostModal from './EditPostModal.jsx';
import DeletePostModal from './DeletePostModal.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { addBookmark, deleteBookmark } from '../../services/bookmarksService.jsx';
import { API_BASE_URL } from '../../config.js';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const getFullUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path}`;
};
const CHAR_LIMIT = 150;
export default function ShowPostsCard({ post, onDelete, onUpdate, onBookmarkToggle }) {
    const { user } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [isBookmarked, setIsBookmarked] = useState(post.is_bookmarked);
    const [isBookmarkPending, setIsBookmarkPending] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const menuRef = useRef(null);

    const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [pdfScale, setPdfScale] = useState(1.0);

    const canModify = user?.id === post.posted_by || user?.role === 'admin';

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleBookmarkClick = async (e) => {
        e.preventDefault();
        if (isBookmarkPending) return;
        setIsBookmarkPending(true);
        try {
            if (isBookmarked) {
                await deleteBookmark(post.id, 'post');
                setIsBookmarked(false);
            } else {
                await addBookmark(post.id, 'post');
                setIsBookmarked(true);
            }
            if (onBookmarkToggle) onBookmarkToggle(post.id, 'post');
        } catch (err) { console.error(err); } finally { setIsBookmarkPending(false); }
    };

    const renderMedia = () => {
        const files = post.files || [];
        if (files.length === 0) return null;

        // Filter based on file_mime_type from backend
        const images = files.filter(f => f.file_mime_type?.startsWith('image/'));
        const pdfs = files.filter(f => f.file_mime_type?.includes('pdf'));
        const videos = files.filter(f => f.file_mime_type?.includes('video'));
        const documents = files.filter(f => f.file_mime_type?.includes('document'));

        return (
            <div className="mt-4 space-y-3">
                {/* Image Grid */}
                {images.length > 0 && (
                    <div className={`grid gap-2 rounded-xl overflow-hidden ${images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {images.map((file, idx) => (
                            <div
                                key={idx}
                                onClick={() => { setSelectedImage(getFullUrl(file.file_url)); setImageModalOpen(true); }}
                                className="cursor-pointer overflow-hidden group"
                            >
                                <img
                                    src={getFullUrl(file.file_url)}
                                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105 hover:opacity-90"
                                    alt="Post content"
                                />
                            </div>
                        ))}
                    </div>
                )}
                {/* Video Attachments */}
                {videos.length > 0 && (
                    <div className={`grid gap-2 rounded-xl overflow-hidden ${videos.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {videos.map((file, idx) => (
                            <div
                                key={idx}
                                onClick={() => { setSelectedVideo(getFullUrl(file.file_url)); setVideoDialogOpen(true); }}
                                className="cursor-pointer overflow-hidden group"
                            >
                                <video
                                    src={getFullUrl(file.file_url)}
                                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105 hover:opacity-90"
                                    controls
                                />
                            </div>
                        ))}
                    </div>
                )}
                {/* PDF Attachments */}
                {pdfs.map((file, idx) => (
                    <div
                        key={idx}
                        onClick={() => { setSelectedPdf(getFullUrl(file.file_url)); setPdfDialogOpen(true); }}
                        className="flex items-center p-3 bg-card border border-border rounded-xl hover:bg-foreground/5 transition-all cursor-pointer group"
                    >
                        <div className="p-2 bg-red-500/10 text-red-500 rounded-lg mr-3">
                            <FileText size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">Document attachment</p>
                            <p className="text-xs text-muted">PDF Document</p>
                        </div>
                        <Maximize2 size={18} className="text-muted group-hover:text-foreground" />
                    </div>
                ))}
            </div>
        );
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setPageNumber(1);
    };


    return (
        <div className="w-full bg-card sm:border border-border sm:rounded-2xl transition-all sm:shadow-sm sm:hover:shadow-md ">
            {/* Header */}
            <div className="flex items-start justify-between p-4">
                <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-full bg-primary/5 border border-border flex items-center justify-center overflow-hidden">
                            {post.profile_picture_url ? (
                                <img src={getFullUrl(post.profile_picture_url)} className="w-full h-full object-cover" alt="" />
                            ) : (
                                <span className="text-lg font-bold text-primary">{post.author_name?.[0]}</span>
                            )}
                        </div>
                        {post.role === 'admin' && (
                            <div className="absolute -bottom-1 -right-1 bg-background p-0.5 rounded-full">
                                <ShieldCheck size={14} className="text-blue-500 fill-blue-500/10" />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                            <a href={`/profile/${post.handle}`}><span className="font-medium md:font-bold text-foreground hover:underline cursor-pointer leading-none text-[15px]">{post.author_name}</span></a>
                            <a href={`/profile/${post.handle}`} className="text-sm text-muted">@{post.handle}</a>
                        </div>
                        <div className="flex items-center gap-2 text-[12px] text-muted mt-0.5">
                            <span>{post.position || 'Member'}</span>
                            <span>•</span>
                            <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1" ref={menuRef}>
                    <button onClick={handleBookmarkClick} className={`p-2 rounded-full transition-all ${isBookmarked ? 'text-primary' : 'text-muted hover:bg-foreground/5'}`}>
                        {isBookmarked ? <BookmarkCheck size={20} fill="currentColor" /> : <Bookmark size={20} />}
                    </button>
                    {canModify && (
                        <div className="relative">
                            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-full text-muted hover:bg-foreground/5 transition-colors"><MoreVertical size={20} /></button>
                            {menuOpen && (
                                <div className="absolute right-0 mt-2 w-44 bg-card border border-border rounded-xl shadow-xl z-30 py-1.5 animate-in fade-in zoom-in-95 duration-100">
                                    <button onClick={() => { setEditModalOpen(true); setMenuOpen(false); }} className="w-full px-4 py-2 text-sm text-left flex items-center gap-2 hover:bg-foreground/5 text-foreground"><Pencil size={16} /> Edit Post</button>
                                    <hr className="my-1 border-border" />
                                    <button onClick={() => { setDeleteModalOpen(true); setMenuOpen(false); }} className="w-full px-4 py-2 text-sm text-left flex items-center gap-2 text-red-500 hover:bg-red-500/5"><Trash2 size={16} /> Delete</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="px-4 pb-4">
                {post.title && <h2 className="text-base font-medium md:font-semibold text-foreground mb-1">{post.title}</h2>}
                {post.description && (
                    <div className="text-[15px] text-foreground/90 leading-normal whitespace-pre-wrap">
                        {isExpanded || post.description.length <= CHAR_LIMIT
                            ? post.description
                            : `${post.description.substring(0, CHAR_LIMIT)}...`}

                        {post.description.length > CHAR_LIMIT && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="ml-1 text-primary font-semibold hover:underline"
                            >
                                {isExpanded ? '...Show less' : 'Read more'}
                            </button>
                        )}
                    </div>
                )}

                {renderMedia()}

            </div>
            {/* PDF Viewer Dialog */}
            {pdfDialogOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-card border border-border rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
                        <div className="flex justify-between items-center p-4 border-b border-border bg-card">
                            <h3 className="font-bold text-foreground flex items-center gap-2">
                                <FileText size={20} className="text-red-500" /> PDF Viewer
                            </h3>
                            <div className="flex items-center gap-2">
                                <a href={selectedPdf} target="_blank" rel="noopener noreferrer" download className="p-2 text-muted hover:text-foreground hover:bg-foreground/5 rounded-lg transition-colors">
                                    <Download size={20} />
                                </a>
                                <button onClick={() => setPdfDialogOpen(false)} className="p-2 text-muted hover:text-foreground hover:bg-foreground/5 rounded-lg transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 bg-background overflow-auto flex justify-center p-4">
                            <Document
                                file={selectedPdf}
                                onLoadSuccess={onDocumentLoadSuccess}
                                className="shadow-lg"
                                loading={<div className="text-foreground animate-pulse">Loading Document...</div>}
                            >
                                <Page
                                    pageNumber={pageNumber}
                                    scale={pdfScale}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                />
                            </Document>
                        </div>

                        {numPages && (
                            <div className="p-4 border-t border-border flex justify-between items-center bg-card">
                                <span className="text-sm text-muted font-medium">Page {pageNumber} of {numPages}</span>
                                <div className="flex items-center gap-4">
                                    <button
                                        disabled={pageNumber <= 1}
                                        onClick={() => setPageNumber(p => p - 1)}
                                        className="p-2 disabled:opacity-30 hover:bg-foreground/5 rounded-full text-foreground transition-colors"
                                    >
                                        <ChevronLeft />
                                    </button>
                                    <button
                                        disabled={pageNumber >= numPages}
                                        onClick={() => setPageNumber(p => p + 1)}
                                        className="p-2 disabled:opacity-30 hover:bg-foreground/5 rounded-full text-foreground transition-colors"
                                    >
                                        <ChevronRight />
                                    </button>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setPdfScale(s => Math.max(0.5, s - 0.1))} className="text-xs px-2 py-1 bg-foreground/5 rounded hover:bg-foreground/10 text-foreground">-</button>
                                    <span className="text-xs text-muted w-10 text-center">{Math.round(pdfScale * 100)}%</span>
                                    <button onClick={() => setPdfScale(s => Math.min(2.0, s + 0.1))} className="text-xs px-2 py-1 bg-foreground/5 rounded hover:bg-foreground/10 text-foreground">+</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
            {/* Modals */}
            <ImageModal open={imageModalOpen} onClose={() => setImageModalOpen(false)} imageUrl={selectedImage} />
            <EditPostModal open={editModalOpen} onClose={() => setEditModalOpen(false)} post={post} onSave={onUpdate} />
            <DeletePostModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={() => { onDelete(post.id); setDeleteModalOpen(false); }}
                type="Post"
                section="Feed"
            />
        </div>
    );
}