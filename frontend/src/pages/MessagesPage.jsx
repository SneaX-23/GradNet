import React, { useState } from 'react';
import { Box, Typography, CssBaseline, AppBar, Toolbar, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'; 
import Sidebar from '../components/layout/Sidebar';
import RightSidebar from '../components/layout/RightSidebar';
import ConversationList from '../components/messages/ConversationList';
import ChatWindow from '../components/messages/ChatWindow';
import NewMessageModal from '../components/messages/NewMessageModal';

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
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
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
          marginRight: '320px' 
        }}
      >
        <Box sx={{ width: 320, borderRight: '1px solid #eee', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <Typography variant="h6" fontWeight="bold">Chats</Typography>

                <IconButton onClick={() => setIsModalOpen(true)}>
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