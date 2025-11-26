import React, { useState } from 'react';
import { Box, Typography, CssBaseline, AppBar, Toolbar, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'; 
import Sidebar from '/src/components/layout/Sidebar.jsx';
import RightSidebar from '/src/components/layout/RightSidebar.jsx';
import ConversationList from '/src/components/messages/ConversationList.jsx';
import ChatWindow from '/src/components/messages/ChatWindow.jsx';
import NewMessageModal from '/src/components/messages/NewMessageModal.jsx';
import { useTheme } from '@mui/material/styles';
import { theme, colors, borderStyle, shadowHover, shadowStyle } from '../theme';

function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const theme = useTheme();

  const handleSelectUser = (user) => {
    const newConversation = {
      id: `new-${user.id}`, 
      other_participant: user,
    };
    setSelectedConversation(newConversation);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold' }}>
            Messages
          </Typography>
        </Toolbar>
      </AppBar>
      <Sidebar />
      <RightSidebar />

      <NewMessageModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSelectUser={handleSelectUser}
      />
      
      <Box 
        component="main" 
        sx={{ 
          display: 'flex', 
          flexGrow: 1, 
          marginTop: '64px', 
          height: 'calc(100vh - 64px)',
          marginRight: '320px',
          border: '2px solid #ffffff',
          borderLeft: 'none', 
          borderRight: 'none', 
          borderTop: 'none', 
        }}
      >
        <Box sx={{ 
          width: 320, 
          borderRight: '2px solid #ffffff', 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
        }}>
            <Box sx={{
              p: 2, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              borderBottom: '1px solid #555',
              borderRight: borderStyle
            }}>
                <Typography variant="h6" fontWeight="bold">
                  Chats
                </Typography>
                <IconButton onClick={() => setIsModalOpen(true)} sx={{ border: 'none' }}>
                    <EditIcon />
                </IconButton>
            </Box>
            <ConversationList onSelectConversation={setSelectedConversation} />
        </Box>

        <ChatWindow conversation={selectedConversation} />
      </Box>
    </Box>
  );
}

export default MessagesPage;