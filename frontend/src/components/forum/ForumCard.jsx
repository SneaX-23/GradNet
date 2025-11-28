import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    Box, Card, Typography, Avatar, IconButton, Menu, MenuItem, 
    Dialog, DialogTitle, DialogContent, DialogActions, Button 
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'; 
import BookmarkIcon from '@mui/icons-material/Bookmark'; 
import { useAuth } from '/src/context/AuthContext.jsx';
import { addBookmark, deleteBookmark } from '/src/services/bookmarksService.jsx'; 
import { API_BASE_URL } from '/src/config.js';
import { useTheme } from '@mui/material/styles';
import { theme, colors, borderStyle, shadowHover, shadowStyle } from '../../theme';

const getFullUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
};

export default function ForumCard({ forum, onDelete, onUpdate, onBookmarkToggle }) { 
    const { user } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);

    const [isBookmarked, setIsBookmarked] = useState(forum.is_bookmarked);
    const [isBookmarkPending, setIsBookmarkPending] = useState(false);
    const theme = useTheme();
    const canModify = user?.role === 'admin' || user?.role === 'faculty';
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const handleMenuOpen = (event) => {
        event.preventDefault(); 
        event.stopPropagation(); 
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => setAnchorEl(null);

    const handleDeleteClick = () => {
        handleMenuClose();
        setDeleteDialogOpen(true);
    };
    const handleDeleteConfirm = () => {
        if (onDelete) {
            onDelete(forum.id);
        }
        setDeleteDialogOpen(false);
    };

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
                    mt: '4px', 
                    ml: '4px', 
                    width: "calc(100% - 4px)",
                    maxWidth: 700,
                    textDecoration: 'none',
                    transition: "all 0.1s ease", 
                              
                    "&:hover": {
                        boxShadow: shadowHover, 
                        transform: 'translate(-2px, -2px)' 
                    },
                              
                    '&:active': {
                        boxShadow: 'none',
                        transform: 'translate(4px, 4px)',
                    }
                }}
            >
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                {forum.name}
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 0.5, color: '#aaaaaa' }}>
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
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {forum.author_name || 'Unknown'}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}> 
                                    <IconButton 
                                      size="small" 
                                      onClick={handleBookmarkClick} 
                                      disabled={isBookmarkPending} 
                                      sx={{ ml: 1, border: 'none', '&:hover': { backgroundColor: 'transparent' } }}
                                    >
                                        {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                                    </IconButton>
                                    {canModify && (
                                        <IconButton 
                                          size="small" 
                                          onClick={handleMenuOpen} 
                                          sx={{ ml: 0, border: 'none', '&:hover': { backgroundColor: colors.green } }}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                    )}
                                </Box>
                            </Box>
                            <Typography variant="caption" sx={{ color: '#aaaaaa' }}>
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
            >
                <MenuItem>Edit</MenuItem>
                <MenuItem 
                    sx={{ color: '#ff0000' }} 
                    onClick={handleDeleteClick}
                >
                    Delete
                </MenuItem>
            </Menu>
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Forum</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this forum?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}