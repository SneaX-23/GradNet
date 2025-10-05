import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  CircularProgress,
  Divider,
  ListItemButton // Import ListItemButton
} from '@mui/material';
import { socket } from '../../socket';

const backendUrl = 'http://localhost:3000';

const getFullUrl = (path) => {
  if (!path) return null;
  return path.startsWith('http') ? path : `${backendUrl}${path}`;
};

export default function ConversationList({ onSelectConversation }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchConversations = useCallback(async () => {
    try {
      // Keep setLoading(true) only for the initial load
      if (conversations.length === 0) {
        setLoading(true);
      }
      const response = await fetch('/api/messages/conversations');
      const data = await response.json();
      if (data.success) {
        setConversations(data.conversations);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [conversations.length]); 

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]); 

  useEffect(() => {
    function onConversationUpdated() {
      fetchConversations();
    }
    socket.on('conversation_updated', onConversationUpdated);
    return () => {
      socket.off('conversation_updated', onConversationUpdated);
    };
  }, [fetchConversations]);

  return (
    <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress size={24} />
        </Box>
      ) : conversations.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 3 }}>
          No conversations yet.
        </Typography>
      ) : (
        <List disablePadding>
          {conversations.map((conv) => (
            <React.Fragment key={conv.id}>
              <ListItem disablePadding>
                <ListItemButton onClick={() => onSelectConversation(conv)}>
                  <ListItemAvatar>
                    <Avatar 
                      src={getFullUrl(conv.other_participant?.profile_picture_url)} 
                      alt={conv.other_participant?.name}
                    >
                      {conv.other_participant?.name?.[0] || '?'}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={conv.other_participant?.name || 'Unknown'}
                    secondary={conv.last_message?.content || 'No messages yet'}
                    primaryTypographyProps={{ noWrap: true }}
                    secondaryTypographyProps={{ noWrap: true, variant: 'body2', color: 'text.secondary' }}
                  />
                </ListItemButton>
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
}