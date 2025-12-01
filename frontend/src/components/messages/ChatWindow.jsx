import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, IconButton, CircularProgress, Paper, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useAuth } from '../../context/AuthContext.jsx';
import { socket } from '../../socket.js';
import { API_BASE_URL } from '../../config.js';
import { theme, borderStyle } from '../../theme';

const getFullUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
};

function ChatWindow({ conversation, onBack }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  useEffect(() => { scrollToBottom(); }, [messages]);

  useEffect(() => {
    if (!conversation) return;
    if (String(conversation.id).startsWith('new-')) {
        setMessages([]);
        setLoading(false);
        return;
    }
    const fetchMessages = async () => {
      setLoading(true);
      setMessages([]);
      try {
        const response = await fetch(`${API_BASE_URL}/api/messages/conversations/${conversation.id}`, { credentials: 'include' });
        const data = await response.json();
        if (data.success) setMessages(data.messages);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [conversation]);

  useEffect(() => {
    function onPrivateMessage(message) {
      if (message.from === conversation?.other_participant?.id) {
        setMessages((prev) => [...prev, message]);
      }
    }
    socket.on('private_message', onPrivateMessage);
    return () => socket.off('private_message', onPrivateMessage);
  }, [conversation]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!conversation || newMessage.trim() === '') return;

    const messagePayload = { content: newMessage, to: conversation.other_participant.id };
    socket.emit('private_message', messagePayload);
    
    const optimisticMessage = {
      content: newMessage,
      sender_id: user.id,
      created_at: new Date().toISOString(),
    };
    setMessages(prevMessages => [...prevMessages, optimisticMessage]);

    setNewMessage('');
  };
  
  if (!conversation) {
    return (
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Paper elevation={0} sx={{ textAlign: 'center', p: 4, border: borderStyle }}>
          <ChatBubbleOutlineIcon sx={{ fontSize: 48, color: '#555', mb: 1 }} />
          <Typography variant="h6">Select a conversation</Typography>
          <Typography variant="body2" sx={{ color: '#aaaaaa', mt: 1 }}>
            Start chatting with your connections here.
          </Typography>
        </Paper>
      </Box>
    );
  }

   return (
    <Box sx={{ 
      position: 'relative', height: '100%', width: '100%', display: 'flex', flexDirection: 'column',
      border: borderStyle, borderLeft: '0px', borderRight: '0px'
    }}>
      <Paper 
        elevation={0} 
        sx={{ 
          position: 'sticky', top: 0, zIndex: 10, p: 1.5, display: 'flex', alignItems: 'center', gap: 2, 
          borderBottom: borderStyle, borderRadius: 0
        }}
      >
        {/* Back Button for Mobile */}
        <IconButton onClick={onBack} sx={{ display: { md: 'none' }, mr: -1 }}>
            <ArrowBackIcon />
        </IconButton>

        <Avatar src={getFullUrl(conversation.other_participant.profile_picture_url)} sx={{ border: '1px solid #141313ff' }} />
        <Box>
          <Typography variant="body1" fontWeight="bold">{conversation.other_participant.name}</Typography>
          <Typography variant="body2" sx={{ color: '#aaaaaa' }}>@{conversation.other_participant.handle}</Typography>
        </Box>
      </Paper>
      
      {loading ? (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress sx={{ color: '#ffffff' }} />
        </Box>
      ) : (
        <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', p: 2 }}>
          {messages.map((msg, index) => (
            <Box key={index} sx={{ display: 'flex', justifyContent: msg.sender_id === user.id ? 'flex-end' : 'flex-start', mb: 1 }}>
              <Box sx={{ border: msg.sender_id === user.id ? '1px solid #0b0b0bff' : '1px dashed #555555', p: '8px 12px', maxWidth: '85%', wordBreak: 'break-word' }}>
                <Typography variant="body1">{msg.content}</Typography>
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>
      )}

      <Box component="form" onSubmit={handleSendMessage} sx={{ position: 'sticky', bottom: 0, zIndex: 10, p: 2, borderTop: borderStyle, display: 'flex', alignItems: 'center', bgcolor: 'white' }}>
        <TextField fullWidth size="small" variant="outlined" placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} autoComplete="off" />
        <IconButton type="submit" color="primary" sx={{ ml: 1 }}><SendIcon /></IconButton>
      </Box>
    </Box>
  );
}

export default ChatWindow;