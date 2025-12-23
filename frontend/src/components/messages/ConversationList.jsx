import React, { useEffect, useState, useCallback } from 'react';
import { Loader2, MessageSquare } from 'lucide-react';
import { socket } from '../../socket.js';
import { API_BASE_URL } from '../../config.js';

const getFullUrl = (path) => path?.startsWith('http') ? path : `${API_BASE_URL}${path}`;

export default function ConversationList({ onSelectConversation, selectedId }) {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchConversations = useCallback(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/messages/conversations`, { credentials: 'include' });
            const data = await response.json();
            if (data.success) setConversations(data.conversations);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    }, []);

    useEffect(() => {
        fetchConversations();
        socket.on('conversation_updated', fetchConversations);
        return () => socket.off('conversation_updated', fetchConversations);
    }, [fetchConversations]);

    if (loading && conversations.length === 0) {
        return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" /></div>;
    }

    return (
        <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                    <MessageSquare className="text-muted/20 mb-4" size={48} />
                    <p className="text-muted text-sm">No conversations yet.</p>
                </div>
            ) : (
                <div className="flex flex-col">
                    {conversations.map((conv) => (
                        <button
                            key={conv.id}
                            onClick={() => onSelectConversation(conv)}
                            className={`flex items-center gap-3 p-4 text-left transition-all border-b border-border/50 group ${selectedId === conv.id ? 'bg-primary/5' : 'hover:bg-foreground/5'
                                }`}
                        >
                            <div className="relative shrink-0">
                                <div className="w-12 h-12 rounded-full border border-border overflow-hidden">
                                    {conv.other_participant?.profile_picture_url ? (
                                        <img src={getFullUrl(conv.other_participant.profile_picture_url)} className="w-full h-full object-cover" alt="" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold">
                                            {conv.other_participant?.name?.[0]}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <span className="font-bold text-foreground truncate group-hover:text-primary transition-colors text-sm">
                                        {conv.other_participant?.name || 'Unknown'}
                                    </span>
                                    <span className="text-[10px] text-muted whitespace-nowrap ml-2">
                                        {new Date(conv.last_message?.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className="text-xs text-muted truncate leading-relaxed">

                                    {conv.last_message?.content || ''}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}