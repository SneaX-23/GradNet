import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, IconButton, CircularProgress, Paper, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useAuth } from '../../context/AuthContext';
import { socket } from '../../socket';

const backendUrl = 'http://localhost:3000';
const getFullUrl = (path) => {
  if (!path) return null;
  return path.startsWith('http') ? path : `${backendUrl}${path}`;
};

function ChatWindow({ conversation }) {
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
        const response = await fetch(`/api/messages/conversations/${conversation.id}`);
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
    
    // Optimistic UI update
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
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#fafafa',
          p: 3,
        }}
      >
        <Paper elevation={0} sx={{ textAlign: 'center', p: 4, borderRadius: 2, background: 'transparent' }}>
          <ChatBubbleOutlineIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
          <Typography variant="h6">Select a conversation</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Start chatting with your connections here.
          </Typography>
        </Paper>
      </Box>
    );
  }

   return (
    <Box sx={{ 
      position: 'relative',
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'background.default'
    }}>
      {/* Header - Fixed at top */}
      <Paper elevation={0} sx={{ 
        position: 'sticky',
        top: 0,
        zIndex: 10,
        p: 1.5, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        borderBottom: '1px solid #eee',
        bgcolor: 'background.paper'
      }}>
        <Avatar src={getFullUrl(conversation.other_participant.profile_picture_url)} />
        <Box>
          <Typography variant="body1" fontWeight="bold">{conversation.other_participant.name}</Typography>
          <Typography variant="body2" color="text.secondary">@{conversation.other_participant.handle}</Typography>
        </Box>
      </Paper>
      
      {/* Messages - Scrollable middle section */}
      {loading ? (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ 
          flex: 1,
          overflowY: 'auto', 
          overflowX: 'hidden',
          p: 2
        }}>
          {messages.map((msg, index) => (
            <Box key={index} sx={{
              display: 'flex',
              justifyContent: msg.sender_id === user.id ? 'flex-end' : 'flex-start',
              mb: 1
            }}>
              <Box sx={{
                bgcolor: msg.sender_id === user.id ? 'primary.main' : '#f0f0f0',
                color: msg.sender_id === user.id ? 'primary.contrastText' : 'text.primary',
                p: '8px 12px',
                borderRadius: '16px',
                maxWidth: '70%'
              }}>
                <Typography variant="body1">{msg.content}</Typography>
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>
      )}

      {/* Input - Fixed at bottom */}
      <Box 
        component="form" 
        onSubmit={handleSendMessage} 
        sx={{ 
          position: 'sticky',
          bottom: 0,
          zIndex: 10,
          p: 2, 
          borderTop: '1px solid #eee', 
          display: 'flex', 
          alignItems: 'center', 
          bgcolor: 'background.paper'
        }}
      >
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          autoComplete="off"
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: '20px' } }}
        />
        <IconButton type="submit" color="primary" sx={{ ml: 1 }}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default ChatWindow;