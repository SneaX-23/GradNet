import React, { useState, useEffect } from 'react';
import { getPendingMentorships, moderateMentorship } from '../../services/mentorService.jsx';
import { Check, X, ExternalLink, Clock, AlertCircle } from 'lucide-react';

export default function MentorshipApprovals() {
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionId, setActionId] = useState(null); 
    const [error, setError] = useState('');

    useEffect(() => { loadPending(); }, []);

    const loadPending = async () => {
        try {
            const res = await getPendingMentorships();
            setPending(res.data);
        } catch (err) {
            setError("Failed to load pending requests.");
        } finally {
            setLoading(false);
        }
    };

    const handleApproval = async (id, status) => {
        setActionId(id);
        try {
            await moderateMentorship(id, status);
            setPending(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            setError(`Failed to ${status} program.`);
            setTimeout(() => setError(''), 4000);
        } finally {
            setActionId(null);
        }
    };

    if (loading) return <div className="py-20 text-center animate-pulse font-bold text-muted">Scanning for pending programs...</div>;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header>
                <h2 className="text-2xl font-black tracking-tight">Mentorship Approvals</h2>
                <p className="text-sm text-muted font-medium">Verify and approve new mentorship programs before they go live.</p>
            </header>

            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500">
                    <AlertCircle size={18} />
                    <p className="text-sm font-bold">{error}</p>
                </div>
            )}

            <div className="grid gap-4">
                {pending.length > 0 ? pending.map((item) => (
                    <div key={item.id} className="bg-card border border-border rounded-3xl p-6 hover:shadow-md transition-all">
                        <div className="flex justify-between items-start gap-4">
                            <div className="space-y-3 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-md">
                                        {item.category}
                                    </span>
                                    <span className="text-xs text-muted flex items-center gap-1">
                                        <Clock size={12} /> {new Date(item.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                
                                <div>
                                    <h3 className="text-lg font-bold text-foreground">{item.guidance_on}</h3>
                                    <p className="text-sm text-muted font-medium">By {item.mentor_name}</p>
                                </div>

                                <p className="text-sm text-foreground/80 leading-relaxed bg-foreground/5 p-4 rounded-2xl italic">
                                    "{item.description}"
                                </p>

                                {item.external_link && (
                                    <a href={item.external_link} target="_blank" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
                                        <ExternalLink size={14} /> View Resources
                                    </a>
                                )}
                            </div>

                            <div className="flex flex-col gap-2 shrink-0">
                                <button 
                                    disabled={actionId === item.id}
                                    onClick={() => handleApproval(item.id, 'approved')}
                                    className="p-3 bg-green-600 text-white rounded-2xl hover:bg-green-700 transition-all disabled:opacity-50"
                                >
                                    <Check size={20} strokeWidth={3} />
                                </button>
                                <button 
                                    disabled={actionId === item.id}
                                    onClick={() => handleApproval(item.id, 'rejected')}
                                    className="p-3 border border-border text-red-600 rounded-2xl hover:bg-red-50 transition-all disabled:opacity-50"
                                >
                                    <X size={20} strokeWidth={3} />
                                </button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="py-20 text-center bg-card border border-border rounded-3xl border-dashed">
                        <p className="text-muted font-bold italic">No pending mentorship programs found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}