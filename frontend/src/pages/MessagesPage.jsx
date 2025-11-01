import React, { useState } from 'react';
import { Box, Typography, CssBaseline, AppBar, Toolbar, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'; 
import Sidebar from '../components/layout/Sidebar';
import RightSidebar from '../components/layout/RightSidebar';
import ConversationList from '../components/messages/ConversationList';
import ChatWindow from '../components/messages/ChatWindow';
import NewMessageModal from '../components/messages/NewMessageModal';

const retroFont = "'Courier New', Courier, monospace";

function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const handleSelectUser = (user) => {
    const newConversation = {
      id: `new-${user.id}`, 
      other_participant: user,
    };
    setSelectedConversation(newConversation);
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: '#000000' }}>
      <CssBaseline />
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#000000',
          borderBottom: '2px solid #ffffff',
          boxShadow: 'none',
          color: '#ffffff',
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ fontFamily: retroFont, fontWeight: 'bold' }}>
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
          bgcolor: '#000000'
        }}>
            <Box sx={{
              p: 2, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              borderBottom: '1px solid #555'
            }}>
                <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: retroFont, color: '#ffffff' }}>
                  Chats
                </Typography>
                <IconButton onClick={() => setIsModalOpen(true)} sx={{ color: '#ffffff' }}>
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