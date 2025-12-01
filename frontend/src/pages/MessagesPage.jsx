import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit'; 
import ConversationList from '/src/components/messages/ConversationList.jsx';
import ChatWindow from '/src/components/messages/ChatWindow.jsx';
import NewMessageModal from '/src/components/messages/NewMessageModal.jsx';
import { borderStyle } from '../theme';
import Layout from '../components/layout/Layout.jsx';

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
    <Layout title="Messages" disablePadding>
      <NewMessageModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSelectUser={handleSelectUser}
      />
      
      <Box sx={{ display: 'flex', width: '100%', height: 'calc(100vh - 64px)' }}>
        
        {/* Conversation List Container (Left Side) */}
        <Box sx={{ 
          width: { xs: '100%', md: 320 }, 
          
          display: { xs: selectedConversation ? 'none' : 'flex', md: 'flex' }, 
          flexDirection: 'column',
          borderRight: { md: borderStyle } 
        }}>
            <Box sx={{
              p: 2, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              borderBottom: borderStyle,
            }}>
                <Typography variant="h6" fontWeight="bold">
                  Chats
                </Typography>
                <IconButton onClick={() => setIsModalOpen(true)} sx={{ border: 'none' }}>
                    <EditIcon />
                </IconButton>
            </Box>
            <ConversationList onSelectConversation={setSelectedConversation} showBorder={false} />
        </Box>

        {/* Chat Window Container (Right Side) */}
        <Box sx={{ 
          flexGrow: 1,
          
          display: { xs: selectedConversation ? 'flex' : 'none', md: 'flex' },
          flexDirection: 'column'
        }}>
            <ChatWindow 
                conversation={selectedConversation} 
                onBack={() => setSelectedConversation(null)} 
            />
        </Box>
      </Box>
    </Layout>
  );
}

export default MessagesPage;