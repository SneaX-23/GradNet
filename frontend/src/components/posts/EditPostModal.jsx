import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../../config.js';

function EditPostModal({ open, onClose, post, onSave }) {
    const [formData, setFormData] = useState({
        title: '',
        description: ''
    });
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [shouldRender, setShouldRender] = useState(open);
    const [isAnimate, setIsAnimate] = useState(false);

    useEffect(() => {
        if (open) {
            setShouldRender(true);
            if (post) {
                setFormData({
                    title: post.title || '',
                    description: post.description || ''
                });
            }
            const timer = setTimeout(() => setIsAnimate(true), 10);
            return () => clearTimeout(timer);
        } else {
            setIsAnimate(false);
            const timer = setTimeout(() => setShouldRender(false), 300);
            return () => clearTimeout(timer);
        }
    }, [open, post]);

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
        if (e) e.preventDefault();
        setError('');

        if (!formData.title && !formData.description) {
            setError('Please provide at least a title or description.');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/home/update-post/${post.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include',
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to update post.');

            onSave(data.post);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!shouldRender) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isAnimate ? 'opacity-100' : 'opacity-0'}`}>
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            <div
                className={`relative w-full max-w-2xl bg-card border border-border rounded-lg shadow-xl overflow-hidden transition-all duration-300 ease-out transform ${isAnimate ? 'translate-y-0 scale-100' : 'translate-y-10 scale-95'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="text-xl font-semibold text-foreground">Edit Post</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-foreground/10 rounded-full transition-colors"
                    >
                        <X size={20} className="text-muted" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-muted">Title</label>
                        <input
                            name="title"
                            type="text"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted/50"
                            placeholder="Post title"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-muted">Description</label>
                        <textarea
                            name="description"
                            rows={6}
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none placeholder:text-muted/50"
                            placeholder="What's on your mind?"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 font-medium">{error}</p>
                    )}
                </form>

                {/* Footer Actions */}
                <div className="flex justify-end gap-3 p-4 bg-muted/5 border-t border-border">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm font-medium hover:bg-foreground/5 rounded-md transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-background rounded-md hover:opacity-90 transition-all disabled:opacity-70 disabled:cursor-not-allowed min-w-30"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                <span>Saving...</span>
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditPostModal;