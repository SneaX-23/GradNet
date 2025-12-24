import React, { useState, useEffect } from 'react';
import { X, Pencil, Save, AlertTriangle } from 'lucide-react';
import { updateMentorProfile } from '../../services/mentorService';

export default function EditMentorshipModal({ open, onClose, mentorship, onSave }) {
    const [formData, setFormData] = useState({
        category: '',
        guidance_on: '',
        description: '',
        external_link: '',
        max_mentees: 1
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (mentorship) {
            setFormData({
                category: mentorship.category,
                guidance_on: mentorship.guidance_on,
                description: mentorship.description,
                external_link: mentorship.external_link || '',
                max_mentees: mentorship.max_mentees
            });
        }
    }, [mentorship, open]);

    if (!open || !mentorship) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateMentorProfile(formData);
            onSave();
            onClose();
        } catch (err) {
            alert(err.message || "Failed to update profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <div className="w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl">
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Pencil className="text-primary" size={20} /> Edit Mentorship Profile
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-foreground/5 rounded-full"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="flex items-center gap-2 p-3 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-xl">
                        <AlertTriangle size={16} />
                        <span>Warning: Editing your profile will temporarily hide it until it is re-approved by Faculty.</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-muted uppercase">Category</label>
                            <select 
                                value={formData.category}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                className="w-full p-2.5 bg-foreground/5 border border-border rounded-xl text-sm outline-none"
                            >
                                <option value="General">General</option>
                                <option value="Placement">Placement</option>
                                <option value="Higher Studies">Higher Studies</option>
                                <option value="Web Dev">Web Dev</option>
                                <option value="Data Science">Data Science</option>
                                <option value="Core Engineering">Core Engineering</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-muted uppercase">Max Mentees</label>
                            <input 
                                type="number"
                                value={formData.max_mentees}
                                onChange={(e) => setFormData({...formData, max_mentees: e.target.value})}
                                className="w-full p-2.5 bg-foreground/5 border border-border rounded-xl text-sm outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-muted uppercase">Topic</label>
                        <input 
                            value={formData.guidance_on}
                            onChange={(e) => setFormData({...formData, guidance_on: e.target.value})}
                            className="w-full p-2.5 bg-foreground/5 border border-border rounded-xl text-sm outline-none"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-muted uppercase">Description</label>
                        <textarea 
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full p-2.5 bg-foreground/5 border border-border rounded-xl text-sm outline-none h-32 resize-none"
                        />
                    </div>

                    <button 
                        type="submit" disabled={loading}
                        className="w-full py-3 bg-primary text-background font-bold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
                    >
                        {loading ? "Saving Changes..." : "Update & Submit for Review"}
                        <Save size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
}