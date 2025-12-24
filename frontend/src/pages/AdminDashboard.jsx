import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout.jsx';
import MentorshipApprovals from '../components/admin/MentorshipApprovals.jsx';
import { 
    ShieldCheck, 
    Users, 
    GraduationCap, 
    Flag, 
    Settings,
    ChevronRight
} from 'lucide-react';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('mentorships');

    const modules = [
        { id: 'mentorships', label: 'Mentor Approvals', icon: GraduationCap, component: MentorshipApprovals },
        { id: 'users', label: 'User Management', icon: Users, component: null },
        { id: 'reports', label: 'Content Flags', icon: Flag, component: null },  
        { id: 'settings', label: 'System Settings', icon: Settings, component: null }
    ];

    const ActiveComponent = modules.find(m => m.id === activeTab)?.component || 
        (() => <div className="p-20 text-center font-bold text-muted italic">Module under development...</div>);

    return (
        <MainLayout>
            <div className="max-w-6xl mx-auto py-8 px-4">
                <div className="flex flex-col md:flex-row gap-8">
                    
                    {/* Admin Sidebar Navigation */}
                    <div className="w-full md:w-64 shrink-0">
                        <div className="flex items-center gap-3 mb-8 px-2">
                            <div className="p-2 bg-primary text-background rounded-lg">
                                <ShieldCheck size={24} />
                            </div>
                            <h1 className="text-xl font-black tracking-tight">Admin Panel</h1>
                        </div>

                        <nav className="space-y-1">
                            {modules.map((module) => (
                                <button
                                    key={module.id}
                                    onClick={() => setActiveTab(module.id)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                                        activeTab === module.id 
                                        ? 'bg-primary text-background shadow-lg' 
                                        : 'text-muted hover:bg-foreground/5 hover:text-foreground'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <module.icon size={18} />
                                        {module.label}
                                    </div>
                                    {activeTab === module.id && <ChevronRight size={14} />}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1">
                        <ActiveComponent />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}