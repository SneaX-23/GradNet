import React, { useState } from 'react';
import { Box, Typography, CssBaseline, AppBar, Toolbar } from '@mui/material';
import Sidebar from '../components/layout/Sidebar';
import ConversationList from '../components/messages/ConversationList';
import ChatWindow from '../components/messages/ChatWindow';
import RightSidebar from '../components/layout/RightSidebar';

function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(null);

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            GradNet — Messages
          </Typography>
        </Toolbar>
      </AppBar>

      <Sidebar />

      <Box
        component="main"
        sx={{
            display: 'flex',
            flexGrow: 1,
            marginTop: '64px',
            height: 'calc(100vh - 64px)',
            overflow: 'hidden',
            minWidth: 0, 
        }}
    >
        <ConversationList onSelectConversation={setSelectedConversation} />
        <ChatWindow conversation={selectedConversation} />
      </Box>

      <RightSidebar />
    </Box>
  );
}

export default MessagesPage;
