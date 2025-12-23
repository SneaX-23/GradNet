import React, { useState, useEffect } from 'react';
import { X, MessageSquare, FileText, Loader2, Save } from 'lucide-react';

function EditForumModal({ open, onClose, forum, onForumUpdated }) {
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [shouldRender, setShouldRender] = useState(open);
    const [isAnimate, setIsAnimate] = useState(false);

    useEffect(() => {
        if (open) {
            setShouldRender(true);
            if (forum) {
                setFormData({
                    name: forum.name || '',
                    description: forum.description || ''
                });
            }
            const timer = setTimeout(() => setIsAnimate(true), 10);
            return () => clearTimeout(timer);
        } else {
            setIsAnimate(false);
            const timer = setTimeout(() => setShouldRender(false), 300);
            return () => clearTimeout(timer);
        }
    }, [open, forum]);

    useEffect(() => {
        if (!open) return;
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [open, onClose]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            setError('Forum name is required.');
            return;
        }

        setError('');
        setIsSubmitting(true);
        try {
            await updateForum(forum.id, {
                name: formData.name,
                description: formData.description
            });
            if (onForumUpdated) onForumUpdated();
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to update forum category.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!shouldRender) return null;

    return (
        <div className={`fixed inset-0 z-[150] flex items-center justify-center p-4 transition-opacity duration-300 ${isAnimate ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className={`relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ease-out transform ${isAnimate ? 'translate-y-0 scale-100' : 'translate-y-10 scale-95'
                }`}>

                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 text-primary rounded-xl">
                            <MessageSquare size={20} />
                        </div>
                        <h2 className="text-xl font-bold text-foreground tracking-tight">Edit Category</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-foreground/5 rounded-full transition-colors text-muted hover:text-foreground"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form id="edit-forum-form" onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted flex items-center gap-2">
                            <MessageSquare size={14} /> Category Name
                        </label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Campus News"
                            className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted flex items-center gap-2">
                            <FileText size={14} /> Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="What is this category about?"
                            className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm leading-relaxed resize-none"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-xs font-bold animate-in fade-in slide-in-from-top-1">
                            {error}
                        </div>
                    )}
                </form>

                <div className="flex justify-end gap-3 p-5 border-t border-border bg-muted/5">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-5 py-2 text-sm font-semibold text-foreground hover:bg-foreground/5 rounded-xl transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        form="edit-forum-form"
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-2 px-8 py-2 text-sm font-bold bg-primary text-background rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-70 min-w-[140px]"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                <span>Save Changes</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditForumModal;