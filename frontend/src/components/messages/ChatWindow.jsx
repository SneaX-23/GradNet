import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, Loader2, MessageCircle, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { socket } from '../../socket.js';
import { API_BASE_URL } from '../../config.js';

const getFullUrl = (path) => path?.startsWith('http') ? path : `${API_BASE_URL}${path}`;

export default function ChatWindow({ conversation, onBack }) {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        if (!conversation || String(conversation.id).startsWith('new-')) {
            setMessages([]);
            return;
        }
        const fetchMessages = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/api/messages/conversations/${conversation.id}`, { credentials: 'include' });
                const data = await response.json();
                if (data.success) setMessages(data.messages);
            } catch (err) { console.error(err); } finally { setLoading(false); }
        };
        fetchMessages();
    }, [conversation]);

    useEffect(() => {
        const onPrivateMessage = (msg) => {
            if (msg.from === conversation?.other_participant?.id) setMessages(prev => [...prev, msg]);
        };
        socket.on('private_message', onPrivateMessage);
        return () => socket.off('private_message', onPrivateMessage);
    }, [conversation]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!conversation || !newMessage.trim()) return;
        const payload = { content: newMessage, to: conversation.other_participant.id };
        socket.emit('private_message', payload);
        setMessages(prev => [...prev, { content: newMessage, sender_id: user.id, created_at: new Date().toISOString() }]);
        setNewMessage('');
    };

    if (!conversation) return (
        <div className="hidden md:flex flex-1 items-center justify-center bg-muted/5">
            <div className="text-center p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="text-primary" size={32} />
                </div>
                <h3 className="text-lg font-bold text-foreground">Your Messages</h3>
                <p className="text-muted text-sm mt-1">Select a chat to start messaging.</p>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-card relative z-0">
            {/* Header */}
            <div className="sticky top-0 z-20 flex items-center gap-3 p-3 border-b border-border bg-background/80 backdrop-blur-md">
                <button onClick={onBack} className="md:hidden p-2 -ml-2 text-muted hover:text-foreground hover:bg-foreground/5 rounded-full"><ArrowLeft size={20} /></button>
                <div className="w-10 h-10 rounded-full border border-border overflow-hidden shrink-0">
                    {conversation.other_participant.profile_picture_url ?
                        <img src={getFullUrl(conversation.other_participant.profile_picture_url)} className="w-full h-full object-cover" alt="" />
                        : (<span className="text-lg flex items-center justify-center w-full h-full font-bold text-primary">{conversation.other_participant.name?.[0]}</span>)
                    }
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-bold text-foreground truncate leading-tight">{conversation.other_participant.name}</h2>
                    <p className="text-[11px] text-muted">@{conversation.other_participant.handle}</p>
                </div>
                <button className="p-2 text-muted hover:text-foreground rounded-full"><Info size={18} /></button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading && <div className="flex justify-center"><Loader2 className="animate-spin text-primary" /></div>}
                {messages.map((msg, i) => {
                    const isMe = msg.sender_id === user.id;
                    return (
                        <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] px-4 py-2.5 shadow-sm text-sm ${isMe
                                ? 'bg-primary text-background rounded-2xl rounded-tr-none'
                                : 'bg-card border border-border text-foreground rounded-2xl rounded-tl-none'
                                }`}>
                                <p className="leading-relaxed">{msg.content}</p>
                                <span className={`text-[10px] mt-1 block ${isMe ? 'text-background/70' : 'text-muted'}`}>
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-3 bg-background border-t border-border sticky bottom-0">
                <div className="flex items-center gap-2 max-w-4xl mx-auto">
                    <input
                        className="flex-1 bg-card border border-border rounded-full px-5 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm shadow-inner"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        autoComplete="off"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-3 bg-primary text-background rounded-full hover:opacity-90 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-md"
                    >
                        <Send size={18} />
                    </button>
                </div>
            </form>
        </div>
    );
}