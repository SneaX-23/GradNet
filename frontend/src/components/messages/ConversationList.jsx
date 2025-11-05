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
  ListItemButton 
} from '@mui/material';
import { socket } from '../../socket';
import { API_BASE_URL } from '../../config';

const backendUrl = 'http://localhost:3000';
const retroFont = "'Courier New', Courier, monospace";

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
      if (conversations.length === 0) {
        setLoading(true);
      }
      const response = await fetch(`${API_BASE_URL}/api/messages/conversations`, { credentials: 'include' });
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
    <Box sx={{ flexGrow: 1, overflowY: 'auto', bgcolor: '#000000', color: '#ffffff' }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress size={24} sx={{ color: '#ffffff' }} />
        </Box>
      ) : conversations.length === 0 ? (
        <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, fontFamily: retroFont, color: '#aaaaaa' }}>
          No conversations yet.
        </Typography>
      ) : (
        <List disablePadding>
          {conversations.map((conv) => (
            <React.Fragment key={conv.id}>
              <ListItem disablePadding>
                <ListItemButton 
                  onClick={() => onSelectConversation(conv)}
                  sx={{
                    fontFamily: retroFont,
                    color: '#ffffff',
                    '&:hover': {
                      backgroundColor: '#333333'
                    },
                    '&.Mui-selected': {
                      backgroundColor: '#ffffff',
                      color: '#000000',
                      '&:hover': {
                        backgroundColor: '#ffffff',
                      }
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar 
                      src={getFullUrl(conv.other_participant?.profile_picture_url)} 
                      alt={conv.other_participant?.name}
                      sx={{ border: '1px solid #ffffff' }}
                    >
                      {conv.other_participant?.name?.[0] || '?'}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={conv.other_participant?.name || 'Unknown'}
                    secondary={conv.last_message?.content || ''} 
                    primaryTypographyProps={{ noWrap: true, fontFamily: retroFont, fontWeight: 'bold' }}
                    secondaryTypographyProps={{ noWrap: true, variant: 'body2', fontFamily: retroFont, color: 'inherit', opacity: 0.7 }}
                  />
                </ListItemButton>
              </ListItem>
              <Divider component="li" sx={{ borderColor: '#555555' }} />
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
}