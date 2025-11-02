import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Card, Typography, Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'; 
import BookmarkIcon from '@mui/icons-material/Bookmark'; 
import { useAuth } from '../../context/AuthContext';
import { addBookmark, deleteBookmark } from '../../services/bookmarksService'; 

const backendUrl = 'http://localhost:3000';
const retroFont = "'Courier New', Courier, monospace";

const getFullUrl = (path) => {
  if (!path) return null;
  return path.startsWith('http') ? path : `${backendUrl}${path}`;
};

export default function ForumCard({ forum, onDelete, onUpdate, onBookmarkToggle }) { 
    const { user } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);

    const [isBookmarked, setIsBookmarked] = useState(forum.is_bookmarked);
    const [isBookmarkPending, setIsBookmarkPending] = useState(false);
    
    const canModify = user?.role === 'admin' || user?.role === 'faculty';

    const handleMenuOpen = (event) => {
        event.preventDefault(); 
        event.stopPropagation(); 
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => setAnchorEl(null);


    const handleBookmarkClick = async (e) => {
        e.preventDefault(); 
        e.stopPropagation(); 
        setIsBookmarkPending(true);
        try {
        if (isBookmarked) {
            await deleteBookmark(forum.id, 'forum');
            setIsBookmarked(false);
        } else {
            await addBookmark(forum.id, 'forum');
            setIsBookmarked(true);
        }
        if (onBookmarkToggle) {
            onBookmarkToggle(forum.id, 'forum');
        }
        } catch (err) {
        console.error("Failed to update bookmark:", err);
        } finally {
        setIsBookmarkPending(false);
        }
    };

    const authorInitial = forum.author_name ? forum.author_name.charAt(0).toUpperCase() : '?';
    const avatarUrl = getFullUrl(forum.profile_picture_url);

    return (
        <>
            <Card
                component={Link} 
                to={`/forums/${forum.id}`}
                sx={{
                    display: 'flex',
                    p: 2,
                    mb: 2,
                    width: '100%',
                    maxWidth: 700,
                    boxShadow: 'none',
                    border: '2px solid #ffffff',
                    borderRadius: 0,
                    bgcolor: '#000000',
                    color: '#ffffff',
                    fontFamily: retroFont,
                    textDecoration: 'none',
                    '&:hover': {
                        backgroundColor: '#222222'
                    }
                }}
            >
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: retroFont }}>
                                {forum.name}
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 0.5, fontFamily: retroFont, color: '#aaaaaa' }}>
                                {forum.description}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', ml: 2, minWidth: '120px' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <Avatar
                                    src={avatarUrl || ''}
                                    alt={forum.author_name || 'Author'}
                                    sx={{ width: 32, height: 32, mr: 1, border: '1px solid #fff' }}
                                >
                                    {!avatarUrl && authorInitial}
                                </Avatar>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="body2" sx={{ fontWeight: 500, fontFamily: retroFont }}>
                                        {forum.author_name || 'Unknown'}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}> 
                                    <IconButton size="small" onClick={handleBookmarkClick} disabled={isBookmarkPending} sx={{ color: '#ffffff', ml: 1 }}>
                                        {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                                    </IconButton>
                                    {canModify && (
                                        <IconButton size="small" onClick={handleMenuOpen} sx={{ ml: 0, color: '#ffffff' }}>
                                            <MoreVertIcon />
                                        </IconButton>
                                    )}
                                </Box>
                            </Box>
                            <Typography variant="caption" sx={{ fontFamily: retroFont, color: '#aaaaaa' }}>
                                {new Date(forum.created_at).toLocaleDateString()}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Card>

            <Menu 
              anchorEl={anchorEl} 
              open={Boolean(anchorEl)} 
              onClose={handleMenuClose}
              sx={{
                '& .MuiPaper-root': {
                  backgroundColor: '#000000',
                  color: '#ffffff',
                  border: '2px solid #ffffff',
                  borderRadius: 0,
                  fontFamily: retroFont,
                }
              }}
            >
                <MenuItem sx={{fontFamily: retroFont, '&:hover': {backgroundColor: '#333'}}}>Edit</MenuItem>
                <MenuItem sx={{ color: '#ff0000', fontFamily: retroFont, '&:hover': {backgroundColor: '#333'} }}>
                    Delete
                </MenuItem>
            </Menu>
        </>
    );
}