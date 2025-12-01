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
import { socket } from '../../socket.js';
import { API_BASE_URL } from '../../config.js';
import { useTheme } from '@mui/material/styles';
import { theme, colors, borderStyle, shadowHover, shadowStyle } from '../../theme';

const getFullUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
};

export default function ConversationList({ onSelectConversation, showBorder = true}) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const theme = useTheme();

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
    <Box sx={{ flexGrow: 1, overflowY: 'auto', borderRight: borderStyle }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress size={24} sx={{ color: '#ffffff' }} />
        </Box>
      ) : conversations.length === 0 ? (
        <Typography variant="body2" sx={{ textAlign: 'center', mt: 3, color: '#aaaaaa' }}>
          No conversations yet.
        </Typography>
      ) : (
        <List disablePadding >
          {conversations.map((conv, index) => (
            <React.Fragment key={conv.id}>
              <ListItem disablePadding 
                sx={{
                  border: borderStyle,
                  borderLeft: '0px',
                  borderRight: '0px',
                  backgroundColor: theme.palette.secondary.light,
                  marginBottom: 0,
                                              
                  marginTop: index === 0 ? 0 : '-2px',
                  position: 'relative', 
                  
                  transition: 'all 0.1s ease',
                  '&:hover': {
                      backgroundColor: theme.palette.background.paper,
                      boxShadow: `3px 3px 0px ${shadowHover}`,
                      transform: 'translate(-2px, -2px)'
                  },
                  '&:active': {
                      boxShadow: 'none',
                      transform: 'translate(1px, 1px)'
                  }
                }}
              >
                <ListItemButton 
                  onClick={() => onSelectConversation(conv)}
                >
                  <ListItemAvatar>
                    <Avatar 
                      src={getFullUrl(conv.other_participant?.profile_picture_url)} 
                      alt={conv.other_participant?.name}
                      sx={{ border: borderStyle }}
                    >
                      {conv.other_participant?.name?.[0] || '?'}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={conv.other_participant?.name || 'Unknown'}
                    secondary={conv.last_message?.content || ''} 
                    primaryTypographyProps={{ noWrap: true, fontWeight: 'bold' }}
                    secondaryTypographyProps={{ noWrap: true, variant: 'body2', color: 'inherit', opacity: 0.7 }}
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