import React, { useState, } from 'react';
import { Image as ImageIcon, Smile, Send, X, Pencil, FileText, Play, } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { API_BASE_URL } from '../../config.js';
import ImageCropper from '../imageOptions/ImageCropper';

const getFullUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path}`;
};
const DESCRIPTION_LIMIT = 280;

function CharLimitLoader({ current, limit }) {
    const percent = Math.min((current / limit) * 100, 100);

    let strokeColor = 'stroke-primary';
    if (current > limit * 0.8) strokeColor = 'stroke-yellow-500';
    if (current >= limit) strokeColor = 'stroke-red-500';

    return (
        <div className="flex items-center gap-2">
            <svg className="w-6 h-6 -rotate-90">
                <circle
                    cx="12"
                    cy="12"
                    r="10"
                    strokeWidth="3"
                    className="stroke-border fill-none"
                />
                <circle
                    cx="12"
                    cy="12"
                    r="10"
                    strokeWidth="3"
                    strokeDasharray={2 * Math.PI * 10}
                    strokeDashoffset={
                        2 * Math.PI * 10 * (1 - percent / 100)
                    }
                    className={`fill-none transition-all duration-200 ${strokeColor}`}
                />
            </svg>

            <span
                className={`text-xs tabular-nums ${current >= limit ? 'text-red-500' : 'text-muted'
                    }`}
            >
                {limit - current}
            </span>
        </div>
    );
}

function CreatePost({ onPostCreated }) {
    const [postContent, setPostContent] = useState({ title: '', description: '' });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Cropper
    const [cropper, setCropper] = useState({ open: false, imageUrl: '', index: null });

    const { user } = useAuth();
    const avatarUrl = getFullUrl(user?.profile_image_url);

    const handleFileChange = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...newFiles].slice(0, 4));
        }
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const openCropper = (index) => {
        const file = selectedFiles[index];
        if (file && file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file);
            setCropper({ open: true, imageUrl: url, index });
        }
    };

    const handleCropComplete = (croppedFile) => {
        const updatedFiles = [...selectedFiles];
        updatedFiles[cropper.index] = croppedFile;
        setSelectedFiles(updatedFiles);
    };

    const handlePost = async () => {
        setIsSubmitting(true);
        const formData = new FormData();
        selectedFiles.forEach(file => formData.append('postFiles', file));
        formData.append("title", postContent.title);
        formData.append("description", postContent.description);

        try {
            const response = await fetch(`${API_BASE_URL}/api/home/create-post`, {
                method: "POST",
                body: formData,
                credentials: 'include',
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Upload failed');

            setPostContent({ title: '', description: '' });
            setSelectedFiles([]);
            setShowEmojiPicker(false);
            if (onPostCreated) onPostCreated(data.post);
        } catch (error) {
            console.error("Upload failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto mb-0 sm:mb-6">
            <div className="bg-card sm:border border-border sm:rounded-2xl shadow-sm p-3 flex gap-4 transition-all">
                {/* Desktop Avatar */}
                <div className="shrink-0 hidden sm:block">
                    <div className="w-12 h-12 rounded-full bg-primary/10 border border-border flex items-center justify-center overflow-hidden font-bold">
                        {avatarUrl ? <img src={avatarUrl} className="w-full h-full object-cover" alt="Profile" /> : (user?.name?.[0] || 'U')}
                    </div>
                </div>

                <div className="grow flex flex-col gap-3">
                    {/* Form Inputs */}
                    <div className="space-y-2">
                        <input
                            className="w-full bg-transparent text-base font-semibold placeholder:text-muted focus:outline-none"
                            placeholder="Post Title"
                            name="title"
                            value={postContent.title}
                            onChange={(e) => setPostContent({ ...postContent, title: e.target.value })}
                        />
                        <textarea
                            className="w-full bg-transparent text-foreground placeholder:text-muted focus:outline-none resize-none min-h-10 md:min-h-20 leading-relaxed"
                            placeholder="What's happening on the campus?"
                            name="description"
                            value={postContent.description}
                            onChange={(e) => {
                                const value = e.target.value;
                                setPostContent({
                                    ...postContent,
                                    description: value.slice(0, DESCRIPTION_LIMIT)
                                });
                            }}
                        />

                    </div>

                    {/* Dynamic File Previews */}
                    {selectedFiles.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {selectedFiles.map((file, idx) => {
                                const fileUrl = URL.createObjectURL(file);
                                const isImage = file.type.startsWith('image/');
                                const isVideo = file.type.startsWith('video/');

                                return (
                                    <div key={idx} className="relative group w-24 h-24 rounded-xl border border-border bg-muted/10 overflow-hidden shadow-sm">
                                        {isImage ? (
                                            <>
                                                <img src={fileUrl} className="w-full h-full object-cover" alt="Preview" />
                                                <button
                                                    onClick={() => openCropper(idx)}
                                                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                            </>
                                        ) : isVideo ? (
                                            <div className="relative w-full h-full bg-black">
                                                <video src={fileUrl} className="w-full h-full object-cover opacity-80" muted />
                                                <div className="absolute inset-0 flex items-center justify-center text-white/90">
                                                    <Play size={24} className="fill-current" />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-muted gap-1">
                                                <FileText size={24} />
                                                <span className="text-[10px] uppercase font-bold">PDF</span>
                                            </div>
                                        )}

                                        {/* Remove File Button */}
                                        <button
                                            onClick={() => removeFile(idx)}
                                            className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full hover:bg-red-500 transition-colors z-10"
                                        >
                                            <X size={12} strokeWidth={3} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Action Toolbar */}
                    <div className="flex items-center justify-between border-t border-border pt-3">
                        <div className="flex gap-1">
                            <label className="p-2.5 text-primary hover:bg-primary/10 rounded-full cursor-pointer transition-colors group">
                                <ImageIcon size={22} className="group-active:scale-90 transition-transform" />
                                <input type="file" hidden onChange={handleFileChange} multiple accept="image/*,video/*,application/pdf" />
                            </label>
                            <button
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className={`p-2.5 rounded-full transition-colors group ${showEmojiPicker ? 'bg-primary/20 text-primary' : 'text-primary hover:bg-primary/10'}`}
                            >
                                <Smile size={22} className="group-active:scale-90 transition-transform" />
                            </button>
                        </div>
                        <div className="flex items-center gap-2">
                            <CharLimitLoader
                                current={postContent.description.length}
                                limit={DESCRIPTION_LIMIT}
                            />
                            <button
                                onClick={handlePost}
                                disabled={isSubmitting || (!postContent.title.trim() && !postContent.description.trim() )}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-background font-bold rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
                            >
                                <Send size={16} />
                                {isSubmitting ? 'Posting...' : 'Post'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Emoji Picker Overlay */}
            {showEmojiPicker && (
                <div className="absolute z-50 mt-2 shadow-2xl rounded-2xl overflow-hidden border border-border animate-in fade-in zoom-in-95 duration-200">
                    <EmojiPicker
                        onEmojiClick={(emoji) => setPostContent(p => ({ ...p, description: p.description + emoji.emoji }))}
                        theme="auto"
                        width={350}
                        height={400}
                    />
                </div>
            )}

            {/* Cropper Modal Overlay */}
            {cropper.open && (
                <ImageCropper
                    image={cropper.imageUrl}
                    aspect={16 / 9}
                    onClose={() => setCropper({ ...cropper, open: false })}
                    onCropComplete={handleCropComplete}
                />
            )}
        </div>
    );
}

export default CreatePost;