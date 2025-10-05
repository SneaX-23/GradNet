import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, IconButton, CircularProgress, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useAuth } from '../../context/AuthContext';
import { socket } from '../../socket';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

function ChatWindow({ conversation }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!conversation) return;

    const fetchMessages = async () => {
      setLoading(true);
      setMessages([]);
      try {
        const response = await fetch(`/api/messages/conversations/${conversation.id}`);
        const data = await response.json();
        if (data.success) {
          setMessages(data.messages);
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [conversation]);

  useEffect(() => {
    function onPrivateMessage(message) {
      if (message.from === conversation?.other_participant?.id || message.from === user.id) {
        setMessages(prevMessages => [...prevMessages, message]);
      }
    }

    socket.on('private_message', onPrivateMessage);
    return () => socket.off('private_message', onPrivateMessage);
  }, [conversation, user.id]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !conversation) return;

    const messagePayload = {
      content: newMessage,
      to: conversation.other_participant.id,
    };

    socket.emit('private_message', messagePayload);
    setNewMessage('');
  };

  if (!conversation) {
    return (
     <Box
        sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: '#f9f9f9',
        borderLeft: '1px solid #eee',
        minWidth: 0,
        textAlign: 'center',
        p: 3,
        }}
    >
    <ChatBubbleOutlineIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
    <Typography variant="h6" gutterBottom>
        Select a conversation
    </Typography>
    <Typography variant="body2" color="text.secondary">
        Start chatting with your connections here.
    </Typography>
    </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#fafafa' }}>
      {loading ? (
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: msg.sender_id === user.id ? 'flex-end' : 'flex-start',
                mb: 1.5,
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  bgcolor: msg.sender_id === user.id ? 'primary.main' : 'background.paper',
                  color: msg.sender_id === user.id ? 'primary.contrastText' : 'text.primary',
                  p: '8px 12px',
                  borderRadius: '16px',
                  maxWidth: '75%',
                }}
              >
                <Typography variant="body1">{msg.content}</Typography>
              </Paper>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Box>
      )}

      <Box
        component="form"
        onSubmit={handleSendMessage}
        sx={{
          p: 2,
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          bgcolor: '#fff',
        }}
      >
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
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
