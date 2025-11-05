import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, IconButton, CircularProgress, Paper, Avatar } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useAuth } from '../../context/AuthContext';
import { socket } from '../../socket';
import { API_BASE_URL } from '../../config';

const backendUrl = 'http://localhost:3000';
const retroFont = "'Courier New', Courier, monospace";

const getFullUrl = (path) => {
  if (!path) return null;
  return path.startsWith('http') ? path : `${backendUrl}${path}`;
};

const retroTextFieldStyles = {
  '& label.Mui-focused': {
    color: '#ffffff',
  },
  '& .MuiOutlinedInput-root': {
    fontFamily: retroFont,
    color: '#ffffff',
    backgroundColor: '#000000',
    borderRadius: 0,
    '& fieldset': {
      borderColor: '#ffffff',
      borderWidth: '2px',
    },
    '&:hover fieldset': {
      borderColor: '#ffffff',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#ffffff',
    },
  },
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
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#000000',
          p: 3,
        }}
      >
        <Paper elevation={0} sx={{ textAlign: 'center', p: 4, borderRadius: 0, border: '2px dashed #555', background: '#000000' }}>
          <ChatBubbleOutlineIcon sx={{ fontSize: 48, color: '#555', mb: 1 }} />
          <Typography variant="h6" sx={{ fontFamily: retroFont, color: '#ffffff' }}>Select a conversation</Typography>
          <Typography variant="body2" sx={{ fontFamily: retroFont, color: '#aaaaaa', mt: 1 }}>
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
      bgcolor: '#000000'
    }}>
      <Paper elevation={0} sx={{ 
        position: 'sticky',
        top: 0,
        zIndex: 10,
        p: 1.5, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        borderBottom: '2px solid #ffffff',
        borderRadius: 0,
        bgcolor: '#000000'
      }}>
        <Avatar src={getFullUrl(conversation.other_participant.profile_picture_url)} sx={{ border: '1px solid #ffffff' }} />
        <Box>
          <Typography variant="body1" fontWeight="bold" sx={{ fontFamily: retroFont, color: '#ffffff' }}>{conversation.other_participant.name}</Typography>
          <Typography variant="body2" sx={{ fontFamily: retroFont, color: '#aaaaaa' }}>@{conversation.other_participant.handle}</Typography>
        </Box>
      </Paper>
      
      {loading ? (
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress sx={{ color: '#ffffff' }} />
        </Box>
      ) : (
        <Box sx={{ 
          flex: 1,
          overflowY: 'auto', 
          overflowX: 'hidden',
          p: 2,
          bgcolor: '#000000'
        }}>
          {messages.map((msg, index) => (
            <Box key={index} sx={{
              display: 'flex',
              justifyContent: msg.sender_id === user.id ? 'flex-end' : 'flex-start',
              mb: 1
            }}>
              <Box sx={{
                
                bgcolor: '#000000',
                color: '#ffffff',
                border: msg.sender_id === user.id ? '1px solid #ffffff' : '1px dashed #555555',
                borderRadius: 0,
                p: '8px 12px',
                maxWidth: '70%'
              }}>
                <Typography variant="body1" sx={{ fontFamily: retroFont }}>{msg.content}</Typography>
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>
      )}

      <Box 
        component="form" 
        onSubmit={handleSendMessage} 
        sx={{ 
          position: 'sticky',
          bottom: 0,
          zIndex: 10,
          p: 2, 
          borderTop: '2px solid #ffffff', 
          display: 'flex', 
          alignItems: 'center', 
          bgcolor: '#000000'
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
          sx={retroTextFieldStyles}
        />
        <IconButton type="submit" color="primary" sx={{ ml: 1, color: '#ffffff', border: '2px solid #ffffff', borderRadius: 0, '&:hover': { bgcolor: '#ffffff', color: '#000000'} }}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default ChatWindow;