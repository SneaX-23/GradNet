import React, { useState, useEffect } from 'react';
import {
    Plus, X, Briefcase, Building2, MapPin, IndianRupee,
    Globe, Calendar, FileText, ClipboardList, Send, Loader2
} from 'lucide-react';
import { createJob } from '../../services/JobService';

function CreateJob({ onJobPosted }) {
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        job_type: 'Full-time',
        work_location: 'On-site',
        salary_range: '',
        description: '',
        requirements: '',
        application_deadline: '',
        external_link: ''
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            await createJob(formData);
            setFormData({
                title: '', company: '', location: '', job_type: 'Full-time',
                work_location: 'On-site', salary_range: '', description: '',
                requirements: '', application_deadline: '', external_link: ''
            });
            setOpen(false);
            if (onJobPosted) onJobPosted();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-6 right-6 md:right-10 sm:right-[344px] z-[1000] flex items-center justify-center gap-2 bg-primary text-background px-4 py-4 sm:py-3 sm:px-6 rounded-full sm:rounded-2xl font-bold shadow-xl hover:opacity-90 active:scale-95 transition-all"
            >
                <Plus size={24} />
                <span className="hidden sm:inline">Post Job</span>
            </button>

            {shouldRender && (
                <div className={`fixed inset-0 z-[1100] flex items-center justify-center p-4 transition-opacity duration-300 ${isAnimate ? 'opacity-100' : 'opacity-0'}`}>
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />

                    {/* Modal Container */}
                    <div className={`relative w-full max-w-3xl bg-card border border-border rounded-2xl shadow-2xl flex flex-col max-h-[90vh] transition-all duration-300 ease-out transform ${isAnimate ? 'translate-y-0 scale-100' : 'translate-y-10 scale-95'
                        }`}>

                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-border">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                                    <Briefcase size={20} />
                                </div>
                                <h2 className="text-xl font-bold text-foreground">Create a Job Post</h2>
                            </div>
                            <button onClick={() => setOpen(false)} className="p-2 hover:bg-foreground/5 rounded-full text-muted transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Scrollable Form Body */}
                        <form id="create-job-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Title */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2">
                                        <FileText size={14} /> Job Title
                                    </label>
                                    <input name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Senior Backend Developer"
                                        className="w-full px-3 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                    />
                                </div>

                                {/* Company */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2">
                                        <Building2 size={14} /> Company
                                    </label>
                                    <input name="company" value={formData.company} onChange={handleChange} required placeholder="Company Name"
                                        className="w-full px-3 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                    />
                                </div>

                                {/* Location */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2">
                                        <MapPin size={14} /> Location
                                    </label>
                                    <input name="location" value={formData.location} onChange={handleChange} required placeholder="e.g. Benguluru, KA"
                                        className="w-full px-3 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                    />
                                </div>

                                {/* Job Type */}
                                <div className="space-y-1.5 relative">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2">
                                        <Briefcase size={14} /> Job Type
                                    </label>
                                    <select name="job_type" value={formData.job_type} onChange={handleChange}
                                        className="w-full px-3 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm appearance-none cursor-pointer"
                                    >
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Internship">Internship</option>
                                    </select>
                                </div>

                                {/* Work Location */}
                                <div className="space-y-1.5 relative">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2">
                                        <Globe size={14} /> Work Location
                                    </label>
                                    <select name="work_location" value={formData.work_location} onChange={handleChange}
                                        className="w-full px-3 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm appearance-none cursor-pointer"
                                    >
                                        <option value="On-site">On-site</option>
                                        <option value="Remote">Remote</option>
                                        <option value="Hybrid">Hybrid</option>
                                    </select>
                                </div>

                                {/* Salary */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2">
                                        <IndianRupee size={14} /> Salary Range
                                    </label>
                                    <input name="salary_range" value={formData.salary_range} onChange={handleChange} placeholder="e.g. $100k - $140k"
                                        className="w-full px-3 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                    />
                                </div>

                                {/* Description */}
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2">
                                        <FileText size={14} /> Job Description
                                    </label>
                                    <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} placeholder="Describe the role..."
                                        className="w-full px-3 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm resize-none"
                                    />
                                </div>

                                {/* Requirements */}
                                <div className="space-y-1.5 md:col-span-2">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2">
                                        <ClipboardList size={14} /> Requirements
                                    </label>
                                    <textarea name="requirements" value={formData.requirements} onChange={handleChange} rows={3} placeholder="List key requirements..."
                                        className="w-full px-3 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm resize-none"
                                    />
                                </div>

                                {/* Deadline */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2">
                                        <Calendar size={14} /> Application Deadline
                                    </label>
                                    <input type="date" name="application_deadline" value={formData.application_deadline} onChange={handleChange}
                                        className="w-full px-3 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm [color-scheme:dark]"
                                    />
                                </div>

                                {/* External Link */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2">
                                        <Globe size={14} /> External Application Link
                                    </label>
                                    <input name="external_link" value={formData.external_link} onChange={handleChange} placeholder="https://company.com/jobs/123"
                                        className="w-full px-3 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-xs font-bold animate-in fade-in slide-in-from-top-1">
                                    {error}
                                </div>
                            )}
                        </form>

                        {/* Footer */}
                        <div className="flex justify-end gap-3 p-5 border-t border-border bg-muted/5">
                            <button type="button" onClick={() => setOpen(false)} disabled={isSubmitting}
                                className="px-4 py-2 text-sm font-semibold text-foreground hover:bg-foreground/5 rounded-xl transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button form="create-job-form" type="submit" disabled={isSubmitting}
                                className="flex items-center justify-center gap-2 px-6 py-2 text-sm font-bold bg-primary text-background rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-70 min-w-[140px]"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        <span>Posting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send size={16} />
                                        <span>Post Job</span>
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

export default CreateJob;