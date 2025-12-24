import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { getMentorDashboard, handleMenteeApplication } from '../services/mentorService.jsx';
import { 
    Users, 
    CheckCircle2, 
    XCircle, 
    LayoutDashboard,
    AlertCircle,
    X,
    Send
} from 'lucide-react';
import { API_BASE_URL } from '../config.js';

const getFullUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path}`;
};

export default function MentorDashboard() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    
    // Modal States
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [selectedAppId, setSelectedAppId] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const response = await getMentorDashboard();
            setApplications(response.data);
        } catch (error) {
            console.error("Failed to load dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    const onActionClick = (enrollmentId, status) => {
        if (status === 'rejected') {
            setSelectedAppId(enrollmentId);
            setIsRejectModalOpen(true);
        } else {
            handleFinalAction(enrollmentId, 'accepted', '');
        }
    };

    const handleFinalAction = async (enrollmentId, status, notes) => {
        setActionLoading(true);
        try {
            await handleMenteeApplication(enrollmentId, status, notes);
            setApplications(prev => prev.map(app => 
                app.enrollment_id === enrollmentId ? { ...app, status } : app
            ));
            setIsRejectModalOpen(false);
            setRejectionReason('');
        } catch (error) {
            alert(error.message);
        } finally {
            setActionLoading(false);
        }
    };

    const filteredApps = applications.filter(app => 
        filterStatus === 'all' ? true : app.status === filterStatus
    );

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-0">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                            <LayoutDashboard size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight">Mentor Dashboard</h1>
                            <p className="text-sm text-muted font-medium">Manage your mentees and incoming requests</p>
                        </div>
                    </div>
                    
                    <div className="flex bg-card border border-border rounded-xl p-1">
                        {['all', 'pending', 'accepted', 'rejected'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                                    filterStatus === status 
                                    ? 'bg-primary text-background shadow-sm' 
                                    : 'text-muted hover:text-foreground'
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Application List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-20 text-muted animate-pulse font-bold italic">Loading applications...</div>
                    ) : filteredApps.length > 0 ? (
                        filteredApps.map((app) => (
                            <div 
                                key={app.enrollment_id} 
                                className="bg-card border border-border rounded-2xl p-5 hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col md:flex-row gap-5">
                                    {/* Student Info */}
                                    <div className="flex items-start gap-4 min-w-50">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 overflow-hidden shrink-0 border border-border">
                                            {app.student_avatar ? (
                                                <img 
                                                    src={getFullUrl(app.student_avatar)} 
                                                    alt={app.student_name} 
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center font-bold text-primary text-lg">
                                                    {app.student_name[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-foreground">{app.student_name}</h3>
                                            <p className="text-xs text-muted font-medium flex items-center gap-1 mt-0.5">
                                                Applied {new Date(app.applied_at).toLocaleDateString()}
                                            </p>
                                            <div className={`mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                                                app.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                                                app.status === 'accepted' ? 'bg-green-500/10 text-green-500' :
                                                'bg-red-500/10 text-red-500'
                                            }`}>
                                                {app.status}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 space-y-3">
                                        <div className="bg-foreground/5 p-4 rounded-xl border border-border/50">
                                            <p className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Applying for guidance on:</p>
                                            <p className="text-sm font-bold text-foreground mb-3">{app.guidance_on}</p>
                                            <p className="text-sm text-foreground/80 leading-relaxed italic">
                                                "{app.request_message}"
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex md:flex-col justify-end gap-2 shrink-0">
                                        {app.status === 'pending' ? (
                                            <>
                                                <button 
                                                    onClick={() => onActionClick(app.enrollment_id, 'accepted')}
                                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-colors"
                                                >
                                                    <CheckCircle2 size={16} /> Accept
                                                </button>
                                                <button 
                                                    onClick={() => onActionClick(app.enrollment_id, 'rejected')}
                                                    className="flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors"
                                                >
                                                    <XCircle size={16} /> Reject
                                                </button>
                                            </>
                                        ) : (
                                            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-muted text-muted-foreground rounded-xl text-sm font-bold cursor-not-allowed">
                                                Status Finalized
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-card border border-border rounded-3xl border-dashed">
                            <Users size={48} className="mx-auto text-muted/30 mb-4" />
                            <p className="text-muted font-bold italic">No applications found in this category.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Rejection Modal */}
            {isRejectModalOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-2xl overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <h2 className="text-lg font-bold flex items-center gap-2 text-red-600">
                                <AlertCircle size={20} /> Reject Application
                            </h2>
                            <button 
                                onClick={() => setIsRejectModalOpen(false)} 
                                className="p-2 hover:bg-foreground/5 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-black text-muted uppercase tracking-wider">Reason for rejection</label>
                                <textarea 
                                    placeholder="Explain why this application cannot be accepted at this time..."
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    className="w-full p-4 bg-foreground/5 border border-border rounded-2xl text-sm outline-none resize-none h-32 focus:ring-2 focus:ring-red-500/20 transition-all"
                                />
                                <p className="text-[10px] text-muted font-bold">This message will be sent to the student to help them improve.</p>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button 
                                    onClick={() => setIsRejectModalOpen(false)}
                                    className="flex-1 py-3 text-sm font-bold rounded-xl border border-border hover:bg-foreground/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    disabled={!rejectionReason.trim() || actionLoading}
                                    onClick={() => handleFinalAction(selectedAppId, 'rejected', rejectionReason)}
                                    className="flex-1 py-3 bg-red-600 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-red-700 disabled:opacity-50 transition-all"
                                >
                                    {actionLoading ? "Processing..." : "Confirm Reject"}
                                    {!actionLoading && <Send size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}