import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardActions,
  Collapse,
  Typography,
  Button,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useAuth } from '../../context/AuthContext';


const backendUrl = 'http://localhost:3000';
const getFullUrl = (path) => {
  if (!path) return null;
  return path.startsWith('http') ? path : `${backendUrl}${path}`;
};

export default function ForumCard({forum}) {
    const { user } = useAuth();
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const isOwner = user?.id === forum.posted_by;
    const isAdmin = user?.role === 'admin';
    const canModify = isOwner || isAdmin;

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        handleMenuClose();
        setEditModalOpen(true);
    };
    const handleDeleteClick = () => {
        handleMenuClose();
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = () => {
        onDelete(forum.id);
        setDeleteDialogOpen(false);
    };

    const handleSaveEdit = (updatedJob) => {
        if (onUpdate) {
        onUpdate(updatedJob);
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
                    border: '1px solid #eee',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: 'inherit',
                    '&:hover': {
                        backgroundColor: '#f9f9f9' 
                    }
                }}
            >
                <Box sx={{ width: '100%' }}>
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                {forum.name}
                            </Typography>
                            <Typography variant="body1" color="text.primary" sx={{ mt: 0.5 }}>
                                {forum.description}
                            </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', ml: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <Avatar
                                src={avatarUrl || ''}
                                alt={forum.author_name || 'Author'}
                                sx={{ width: 32, height: 32, mr: 1 }}
                            >
                                {!avatarUrl && authorInitial}
                            </Avatar>
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {forum.author_name || 'Unknown'}
                                </Typography>
                                {forum.handle && (
                                <Typography variant="caption" color="text.secondary">
                                    @{forum.handle}
                                </Typography>
                                )}
                            </Box>
                            {canModify && (
                                <IconButton size="small" onClick={handleMenuOpen} sx={{ ml: 1 }}>
                                <MoreVertIcon />
                                </IconButton>
                            )}
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                            {new Date(forum.created_at).toLocaleDateString()}
                            </Typography>
                        </Box>
                        </Box>
                    </Box>
                </Box>
            </Card>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
                    Delete
                </MenuItem>
            </Menu>

            {editModalOpen && (
                d
            )}
        </>
    );

}