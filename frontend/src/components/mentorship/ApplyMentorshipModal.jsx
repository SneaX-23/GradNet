import React, { useState } from 'react';
import { X, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { applyForMentorship } from '../../services/mentorService';

export default function ApplyMentorshipModal({ open, onClose, mentorship, onSuccess }) {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    if (!open || !mentorship) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await applyForMentorship(mentorship.id, message);
            setIsSuccess(true);
            setTimeout(() => {
                onSuccess();
                handleClose();
            }, 2000); 
        } catch (err) {
            setError(err.message || "Failed to submit application.");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setIsSuccess(false);
        setMessage('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl overflow-hidden transition-all">
                {!isSuccess ? (
                    <>
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <h2 className="text-lg font-bold">Apply for Mentorship</h2>
                            <button onClick={handleClose} className="p-2 hover:bg-foreground/5 rounded-full transition-colors"><X size={20} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Applying for:</p>
                                <p className="text-sm font-bold text-foreground">{mentorship.guidance_on}</p>
                                <p className="text-xs text-muted mt-1 font-medium">Mentor: <span className="text-foreground">{mentorship.mentor_name}</span></p>
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 p-3 text-sm text-red-500 bg-red-500/10 rounded-xl">
                                    <AlertCircle size={16} /> {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-black text-muted uppercase tracking-wider">Request Message</label>
                                <textarea
                                    required
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Introduce yourself and your goals..."
                                    className="w-full h-32 p-4 bg-foreground/5 border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none text-sm"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !message.trim()}
                                className="w-full py-4 bg-primary text-background font-bold rounded-2xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? "Sending Application..." : "Submit Request"}
                                {!loading && <Send size={18} />}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="p-12 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
                        <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle2 size={48} strokeWidth={2.5} />
                        </div>
                        <h2 className="text-2xl font-black tracking-tight mb-2">Application Sent!</h2>
                        <p className="text-muted font-medium">Your request has been delivered to {mentorship.mentor_name}.</p>
                    </div>
                )}
            </div>
        </div>
    );
}