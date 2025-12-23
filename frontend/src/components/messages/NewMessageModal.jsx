import React, { useState, useEffect } from 'react';
import { X, Search, Loader2, UserPlus } from 'lucide-react';
import { API_BASE_URL } from '../../config.js';

const getFullUrl = (path) => path?.startsWith('http') ? path : `${API_BASE_URL}${path}`;

function NewMessageModal({ open, onClose, onSelectUser }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) { setSearchQuery(''); setResults([]); return; }
        if (searchQuery.trim() === '') { setResults([]); return; }

        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/api/users/search?q=${searchQuery}`, { credentials: 'include' });
                const data = await response.json();
                if (data.success) setResults(data.users);
            } catch (error) { console.error(error); } finally { setLoading(false); }
        };

        const timer = setTimeout(fetchUsers, 300);
        return () => clearTimeout(timer);
    }, [searchQuery, open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl flex flex-col h-[70vh] overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-border bg-card/50">
                    <h2 className="text-lg font-bold text-foreground">New Message</h2>
                    <button onClick={onClose} className="p-2 hover:bg-foreground/5 rounded-full text-muted transition-colors"><X size={20} /></button>
                </div>

                <div className="p-4 border-b border-border bg-background">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={18} />
                        <input
                            autoFocus
                            className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                            placeholder="Search for people..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {loading && <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>}
                    {results.map((user) => (
                        <button
                            key={user.id}
                            onClick={() => { onSelectUser(user); onClose(); }}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-foreground/5 transition-colors text-left group"
                        >
                            <div className="w-10 h-10 rounded-full border border-border overflow-hidden shrink-0">
                                {user.profile_picture_url ?
                                    <img src={getFullUrl(user.profile_picture_url)} className="w-full h-full object-cover" alt="" />
                                    : (<span className="text-lg flex items-center justify-center w-full h-full font-bold text-primary">{user.name?.[0]}</span>)
                                }
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{user.name}</p>
                                <p className="text-xs text-muted">@{user.handle}</p>
                            </div>
                            <UserPlus size={16} className="text-muted group-hover:text-primary" />
                        </button>
                    ))}
                    {!loading && searchQuery && results.length === 0 && (
                        <p className="text-center text-muted text-sm py-10">No users found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default NewMessageModal;