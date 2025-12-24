import React, { useState } from 'react';
import { X, GraduationCap, Link as LinkIcon, Users, Save, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { createMentorProfile } from '../../services/mentorService';

export default function CreateMentorshipModal({ open, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState(''); 
    const [formData, setFormData] = useState({
        category: 'General',
        guidance_on: '',
        description: '',
        external_link: '',
        max_mentees: 1
    });

    const categories = ['General', 'Placement', 'Higher Studies', 'Web Dev', 'Data Science', 'Core Engineering'];

    if (!open) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(''); 
        try {
            await createMentorProfile(formData);
            setIsSuccess(true);
            setTimeout(() => {
                onSuccess(); 
                handleClose();
            }, 2500);
        } catch (err) {
            
            setError(err.message || "Failed to create mentorship listing.");
            
            setTimeout(() => setError(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setIsSuccess(false);
        setError('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-xl bg-card border border-border rounded-3xl shadow-2xl transition-all overflow-hidden">
                {!isSuccess ? (
                    <>
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <GraduationCap className="text-primary" size={20} /> Launch Program
                            </h2>
                            <button onClick={handleClose} className="p-2 hover:bg-foreground/5 rounded-full transition-colors"><X size={20} /></button>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mx-6 mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 animate-in slide-in-from-top-2 duration-300">
                                <AlertCircle size={18} strokeWidth={2.5} />
                                <p className="text-sm font-bold">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-muted uppercase tracking-widest">Category</label>
                                    <select 
                                        value={formData.category}
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                        className="w-full p-3 bg-foreground/5 border border-border rounded-xl text-sm outline-none font-bold focus:ring-2 focus:ring-primary/10 transition-all"
                                    >
                                        {categories.map(cat => <option key={cat}>{cat}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-muted uppercase tracking-widest">Max Mentees</label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
                                        <input 
                                            type="number" min="1" max="20"
                                            value={formData.max_mentees}
                                            onChange={(e) => setFormData({...formData, max_mentees: e.target.value})}
                                            className="w-full pl-10 pr-3 py-3 bg-foreground/5 border border-border rounded-xl text-sm outline-none font-bold"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-muted uppercase tracking-widest">Topic (Guidance On)</label>
                                <input 
                                    required placeholder="e.g., Backend System Design"
                                    value={formData.guidance_on}
                                    onChange={(e) => setFormData({...formData, guidance_on: e.target.value})}
                                    className="w-full p-3 bg-foreground/5 border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary/10 transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-muted uppercase tracking-widest">Description</label>
                                <textarea 
                                    required placeholder="Explain your mentorship goals..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    className="w-full p-3 bg-foreground/5 border border-border rounded-xl text-sm outline-none resize-none h-28 focus:ring-2 focus:ring-primary/10 transition-all"
                                />
                            </div>

                            <div className="p-3 bg-primary/5 rounded-xl border border-primary/10">
                                <p className="text-[10px] text-primary font-bold uppercase text-center leading-tight">
                                    Note: New listings require Faculty approval before appearing live.
                                </p>
                            </div>

                            <button 
                                type="submit" disabled={loading}
                                className="w-full py-4 bg-primary text-background font-black rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all shadow-lg active:scale-[0.98]"
                            >
                                {loading ? "Launching Program..." : "Confirm & Launch"}
                                {!loading && <Sparkles size={18} />}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="p-12 flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
                        <div className="w-20 h-20 bg-primary text-background rounded-full flex items-center justify-center mb-6 shadow-xl ring-8 ring-primary/10">
                            <CheckCircle2 size={40} />
                        </div>
                        <h2 className="text-2xl font-black tracking-tight mb-2">Program Created!</h2>
                        <p className="text-muted font-medium max-w-xs">Your mentorship listing has been sent to the faculty for review. It will be live soon!</p>
                    </div>
                )}
            </div>
        </div>
    );
}