import React, { useState, useEffect } from 'react';
import { X, MessageSquarePlus, FileText, Loader2, Plus, Send } from 'lucide-react';
import { createTopic } from '../../services/ForumService.jsx';

function CreateTopicModal({ forumId, onTopicCreated }) {
    const [formData, setFormData] = useState({
        title: '',
        description: ''
    });
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [shouldRender, setShouldRender] = useState(false);
    const [isAnimate, setIsAnimate] = useState(false);

    useEffect(() => {
        if (open) {
            setShouldRender(true);
            const timer = setTimeout(() => setIsAnimate(true), 10);
            return () => clearTimeout(timer);
        } else {
            setIsAnimate(false);
            const timer = setTimeout(() => setShouldRender(false), 300);
            return () => clearTimeout(timer);
        }
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const handleEsc = (e) => {
            if (e.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [open]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleClose = () => {
        setFormData({ title: '', description: '' });
        setError('');
        setOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            setError('Topic title is required.');
            return;
        }

        setError('');
        setIsSubmitting(true);
        try {
            await createTopic(forumId, formData.title, formData.description);
            if (onTopicCreated) onTopicCreated();
            handleClose();
        } catch (err) {
            setError(err.message || 'Failed to start new topic.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* FAB */}
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-6 right-6 md:right-10 sm:right86 z-1000 flex items-center justify-center gap-2 bg-primary text-background px-4 py-4 sm:py-3 sm:px-6 rounded-full sm:rounded-2xl font-bold shadow-xl hover:opacity-90 active:scale-95 transition-all"
            >
                <Plus size={24} />
                <span className="hidden sm:inline">Start Topic</span>
            </button>

            {shouldRender && (
                <div className={`fixed inset-0 z-1100 flex items-center justify-center p-4 transition-opacity duration-300 ${isAnimate ? 'opacity-100' : 'opacity-0'}`}>
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />

                    {/* Modal Container */}
                    <div className={`relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ease-out transform ${isAnimate ? 'translate-y-0 scale-100' : 'translate-y-10 scale-95'
                        }`}>

                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-border">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 text-primary rounded-xl">
                                    <MessageSquarePlus size={20} />
                                </div>
                                <h2 className="text-xl font-bold text-foreground tracking-tight">Start a New Topic</h2>
                            </div>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-foreground/5 rounded-full transition-colors text-muted hover:text-foreground"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form Body */}
                        <form id="create-topic-form" onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted flex items-center gap-2">
                                    <FileText size={14} /> Topic Title
                                </label>
                                <input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    placeholder="What would you like to discuss?"
                                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-widest text-muted flex items-center gap-2">
                                    <FileText size={14} /> Description (Optional)
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Provide some context for this topic..."
                                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm leading-relaxed resize-none"
                                />
                            </div>

                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-xs font-bold animate-in fade-in slide-in-from-top-1">
                                    {error}
                                </div>
                            )}
                        </form>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 p-5 border-t border-border bg-muted/5">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={isSubmitting}
                                className="px-5 py-2 text-sm font-semibold text-foreground hover:bg-foreground/5 rounded-xl transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                form="create-topic-form"
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center justify-center gap-2 px-8 py-2 text-sm font-bold bg-primary text-background rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-70 min-w-35"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        <span>Posting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send size={16} />
                                        <span>Create Topic</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default CreateTopicModal;