import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  InputAdornment,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  CircularProgress,
  Chip,
  Drawer,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import ConversationList from '../messages/ConversationList';
import { searchUsers } from '../../services/userService';
import { API_BASE_URL } from '../../config';

export const rightSidebarWidth = 350;

const NEO_BLACK = '#18181b';
const NEO_WHITE = '#FFFFFF';
const NEO_BLUE = '#93C5FD';
const NEO_BLUE_HOVER = '#60A5FA';

const getFullUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
};

function RightSidebar({ mobileOpen, onClose, window }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const navigate = useNavigate();

  const trendingTopics = ['#TechSummit', '#Hackathon', '#FinalsWeek', '#CampusLife', '#Internships'];

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      setSearchError('');
      return;
    }

    setIsSearchLoading(true);
    const debounceTimer = setTimeout(async () => {
      try {
        setSearchError('');
        const data = await searchUsers(searchQuery);
        setSearchResults(data.users);
      } catch (err) {
        setSearchError(err.message);
      } finally {
        setIsSearchLoading(false);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleUserClick = (handle) => {
    setSearchQuery('');
    setSearchResults([]);
    if(onClose) onClose();
    navigate(`/profile/${handle}`);
  };

  const handleSelectConversation = (conversation) => {
    if(onClose) onClose();
    navigate('/messages');
  };

  const container = window !== undefined ? () => window().document.body : undefined;

  const content = (
    <Box
      sx={{
        width: rightSidebarWidth,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: "hidden",
        gap: 4,
        // overflowY: 'auto',
        fontFamily: '"Space Grotesk", sans-serif',
        pl: 3, 
        pr: 3,
        py: 3,
        backgroundColor: '#FDF6E3' 
      }}
    >
      {/* Search Box */}
      <Box 
        sx={{ 
            bgcolor: NEO_WHITE, 
            border: `2px solid ${NEO_BLACK}`,
            boxShadow: `4px 4px 0px ${NEO_BLACK}`,
            borderRadius: "10px",
        }}
      >
        <TextField
          fullWidth
          placeholder="Search GradNet..."
          value={searchQuery}
          onChange={handleSearchChange}
          variant="standard"
          InputProps={{
            disableUnderline: true,
            sx: { 
                p: 1.5, 
                fontFamily: '"Space Mono", monospace',
                fontSize: '0.9rem',
                fontWeight: 600
            },
            startAdornment: (
              <InputAdornment position="start" sx={{ pl: 1 }}>
                {isSearchLoading ? (
                  <CircularProgress size={20} sx={{ color: NEO_BLACK }} />
                ) : (
                  <SearchIcon sx={{ color: NEO_BLACK, fontWeight: 'bold' }} />
                )}
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1 }}>
        {searchQuery.trim().length > 0 ? (
          // Search Results
          <Box sx={{ bgcolor: NEO_WHITE, border: `2px solid ${NEO_BLACK}`, boxShadow: `4px 4px 0px ${NEO_BLACK}`, }}>
            {searchError && (
              <Typography sx={{ p: 2, color: 'red', fontFamily: '"Space Mono", monospace' }}>{searchError}</Typography>
            )}
            <List disablePadding>
              {searchResults.length > 0 ? (
                searchResults.map((user) => (
                  <ListItem key={user.id} disablePadding divider sx={{ borderColor: NEO_BLACK, borderBottomWidth: '2px', }}>
                    <ListItemButton onClick={() => handleUserClick(user.handle)}>
                      <ListItemAvatar>
                        <Avatar
                          src={getFullUrl(user.profile_picture_url)}
                          sx={{ border: `2px solid ${NEO_BLACK}`, borderRadius: 0 }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={user.name}
                        secondary={`@${user.handle}`}
                        primaryTypographyProps={{ fontWeight: 'bold', fontFamily: '"Space Grotesk", sans-serif' }}
                        secondaryTypographyProps={{ fontFamily: '"Space Mono", monospace', fontSize: '0.8rem' }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))
              ) : (
                !isSearchLoading && !searchError && (
                  <Typography sx={{ p: 2, color: '#666', textAlign: 'center', fontFamily: '"Space Mono", monospace' }}>
                    No users found.
                  </Typography>
                )
              )}
            </List>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Inbox Section */}
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 14, height: 14, bgcolor: '#FDE047', border: `2px solid ${NEO_BLACK}` }} />
                    <Typography variant="h6" fontWeight="900" sx={{ fontFamily: '"Space Grotesk", sans-serif' }}>
                      Inbox
                    </Typography>
                </Box>
                <Typography 
                    variant="caption" 
                    onClick={() => { if(onClose) onClose(); navigate('/messages'); }}
                    sx={{ 
                        textDecoration: 'underline', 
                        cursor: 'pointer', 
                        fontWeight: 'bold', 
                        fontFamily: '"Space Mono", monospace', 
                        fontSize: '0.75rem',
                        '&:hover': { color: '#666'} 
                    }}
                >
                    View All
                </Typography>
              </Box>
              <Box 
                sx={{ 
                    maxHeight: '400px',
                    overflowY: 'auto',
                    '& > div': {
                        borderRight: 'none !important'
                    },
                    '& .MuiListItem-root': {
                        mt: '4px', 
                        ml: '4px', 
                        width: "calc(100% - 4px)",
                        display: 'block', 
                        marginBottom: '16px', 
                        border: `2px solid ${NEO_BLACK}`,
                        backgroundColor: NEO_WHITE,
                        borderRadius: "10px",
                        transition: 'transform 0.1s ease',
                        '&:hover': {
                            transform: 'translate(-2px, -2px)',
                            boxShadow: `6px 6px 0px ${NEO_BLACK}`,
                            backgroundColor: '#f0f0f0',
                        },
                        '&:active': {
                             transform: 'translate(2px, 2px)',
                             boxShadow: 'none',
                        },
                    },
                    '& .MuiAvatar-root': {
                        borderRadius: '0px !important',
                        border: `2px solid ${NEO_BLACK}`,
                    },
                    '& .MuiDivider-root': {
                        display: 'none' 
                    }
                }}
              >
                <ConversationList onSelectConversation={handleSelectConversation} showBorder={false} />
              </Box>
            </Box>

            {/* Trending Tags Section */}
            <Box>
                <Typography variant="h6" fontWeight="900" sx={{ fontFamily: '"Space Grotesk", sans-serif', mb: 1.5 }}>
                  Trending
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                    {trendingTopics.map(topic => (
                        <Chip 
                            key={topic}
                            label={topic}
                            onClick={() => {}}
                            sx={{
                                border: `2px solid ${NEO_BLACK}`,
                                backgroundColor: NEO_BLUE,
                                color: NEO_BLACK,
                                fontWeight: 'bold',
                                fontFamily: '"Space Mono", monospace',
                                boxShadow: `2px 2px 0px ${NEO_BLACK}`,
                                cursor: 'pointer',
                                borderRadius: "7px",
                                transition: 'all 0.1s ease',
                                '&:hover': {
                                    backgroundColor: NEO_BLUE_HOVER,
                                    boxShadow: `3px 3px 0px ${NEO_BLACK}`,
                                    transform: 'translate(-2px, -2px)'
                                },
                                '&:active': {
                                    boxShadow: 'none',
                                    transform: 'translate(1px, 1px)'
                                }
                            }}
                        />
                    ))}
                </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { lg: rightSidebarWidth }, flexShrink: { lg: 0 }, overflow: "hidden" }}
    >
      {/* Mobile Right Drawer */}
      <Drawer
        container={container}
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: rightSidebarWidth,
            backgroundColor: '#FDF6E3',
            borderLeft: `2px solid ${NEO_BLACK}`, 
          },
        }}
      >
        <Box sx={{display: 'flex', justifyContent: 'flex-end', p: 1}}>
            <IconButton onClick={onClose}><CloseIcon/></IconButton>
        </Box>
        {content}
      </Drawer>

      {/* Desktop Persistent Sidebar */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'block' },
          width: rightSidebarWidth,
          position: 'fixed',
          right: 0,
          top: '64px',
          height: 'calc(100vh - 64px)',
          borderLeft: `2px solid ${NEO_BLACK}`,
          backgroundColor: '#FDF6E3',
          overflowY: 'auto  '
        }}
      >
        {content}
      </Box>
    </Box>
  );
}

export default RightSidebar;