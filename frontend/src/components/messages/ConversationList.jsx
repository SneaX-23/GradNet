import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemAvatar, Avatar, ListItemText, Typography, CircularProgress } from '@mui/material';

const backendUrl = 'http://localhost:3000';

const getFullUrl = (path) => {
  if (!path) return null;
  return path.startsWith('http') ? path : `${backendUrl}${path}`;
};

function ConversationList({ onSelectConversation }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchConversations = async () => {
      try {
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
    };

    fetchConversations();
  }, []);

  return (
    <Box sx={{ width: 320, borderRight: '1px solid #eee', height: '100%', overflowY: 'auto', bgcolor: '#fff' }}>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}
      {error && <Typography color="error" sx={{ p: 2 }}>{error}</Typography>}
      <List disablePadding>
        {conversations.map((convo) => (
          <ListItem key={convo.id} disablePadding>
            <ListItemButton
              onClick={() => onSelectConversation(convo)}
              sx={{
                '&:hover': { bgcolor: 'action.hover' },
                py: 1.2,
              }}
            >
              <ListItemAvatar>
                <Avatar
                  src={getFullUrl(convo.other_participant.profile_picture_url)}
                  alt={convo.other_participant.name}
                >
                  {convo.other_participant.name?.[0] || '?'}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={convo.other_participant.name}
                secondary={`@${convo.other_participant.handle}`}
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default ConversationList;
