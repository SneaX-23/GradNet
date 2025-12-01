import React, { useState } from 'react';
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'; 
import BookmarkIcon from '@mui/icons-material/Bookmark'; 
import EditJobModal from './EditJobModal.jsx';
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
const ensureAbsoluteUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return `https://${url}`;
};

export default function JobCard({ job, onDelete, onUpdate, onBookmarkToggle }) { 
  const { user } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [isBookmarked, setIsBookmarked] = useState(job.is_bookmarked);
  const [isBookmarkPending, setIsBookmarkPending] = useState(false);
  const theme = useTheme();

  const isOwner = user?.id === job.posted_by;
  const isAdmin = user?.role === 'admin';
  const canModify = isOwner || isAdmin;

  const handleExpandClick = () => setExpanded(!expanded);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleEdit = () => {
    handleMenuClose();
    setEditModalOpen(true);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(job.id);
    setDeleteDialogOpen(false);
  };

  const handleSaveEdit = (updatedJob) => {
    if (onUpdate) onUpdate(updatedJob);
  };

  const handleBookmarkClick = async (e) => {
    e.stopPropagation(); 
    setIsBookmarkPending(true);
    try {
      if (isBookmarked) {
        await deleteBookmark(job.id, 'job');
        setIsBookmarked(false);
      } else {
        await addBookmark(job.id, 'job');
        setIsBookmarked(true);
      }
      
      if (onBookmarkToggle) {
        onBookmarkToggle(job.id, 'job');
      }
    } catch (err) {
      console.error("Failed to update bookmark:", err);
    } finally {
      setIsBookmarkPending(false);
    }
  };

  const authorInitial = job.author_name ? job.author_name.charAt(0).toUpperCase() : '?';
  const avatarUrl = getFullUrl(job.profile_picture_url);

  return (
    <>
      <Card
        sx={{
          display: 'flex',
          p: 2,
          mb: 2,
          mt: '4px', 
          ml: '4px', 
          width: "calc(100% - 4px)", 
          maxWidth: 700,
          bgcolor: colors.green,
          border: borderStyle,
          boxShadow: shadowStyle,
          transition: "all 0.1s ease",
          "&:hover": {
            borderColor: colors.black,
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
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {job.title}
                </Typography>
                <Typography variant="body1" sx={{ mt: 0.5 }}>
                  {job.company}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5, color: '#444' }}>
                  {job.location} ({job.work_location})
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', ml: 2, minWidth: '80px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Avatar
                    src={avatarUrl || ''}
                    alt={job.author_name || 'Author'}
                    sx={{ width: 32, height: 32, mr: 1, border: '1px solid #ffffff' }}
                  >
                    {!avatarUrl && authorInitial}
                  </Avatar>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}> 
                    <IconButton size="small" onClick={handleBookmarkClick} disabled={isBookmarkPending} sx={{ border: 'none', '&:hover': { backgroundColor: 'transparent' } }}>
                        {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                    </IconButton>
                    {canModify && (
                        <IconButton size="small" onClick={handleMenuOpen} sx={{ ml: 0, border: 'none', '&:hover': { backgroundColor: 'transparent' } }}>
                        <MoreVertIcon />
                        </IconButton>
                    )}
                  </Box>
                </Box>
                <Typography variant="caption" sx={{ color: '#444' }}>
                  {new Date(job.updated_at).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>

            <Collapse in={expanded} timeout="auto" unmountOnExit sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Job Type:</Typography>
              <Typography paragraph sx={{ mb: 1.5 }}>{job.job_type}</Typography>

              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Salary Range:</Typography>
              <Typography paragraph sx={{ mb: 1.5 }}>{job.salary_range || 'Not specified'}</Typography>

              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Description:</Typography>
              <Typography paragraph sx={{ mb: 1.5, whiteSpace: 'pre-wrap' }}>{job.description}</Typography>

              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Requirements:</Typography>
              <Typography paragraph sx={{ mb: 1.5, whiteSpace: 'pre-wrap' }}>{job.requirements || 'Not specified'}</Typography>

              {job.application_deadline && (
                <>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Deadline:</Typography>
                  <Typography paragraph sx={{ mb: 1.5 }}>
                    {new Date(job.application_deadline).toLocaleDateString()}
                  </Typography>
                </>
              )}

              {job.external_link && job.external_link.trim() !== '' && (
                <>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Apply here:</Typography>
                  <Typography paragraph sx={{ mb: 1.5 }}>
                    <a 
                      href={ensureAbsoluteUrl(job.external_link)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#0000EE', wordBreak: 'break-all' }} 
                    >
                      {job.external_link}
                    </a>
                  </Typography>
                </>
              )}
            </Collapse>

            <CardActions disableSpacing sx={{ pl: 0, pt: 2, justifyContent: 'flex-start' }}>
              <Button
                size="small"
                onClick={handleExpandClick}
                endIcon={<ExpandMoreIcon sx={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />}
                sx={{
                  border: borderStyle,
                  boxShadow: shadowStyle,
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.text.primary,
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                    transform: 'translate(-2px, -2px)',
                    boxShadow: shadowHover
                  },
                  '&:active': {
                    boxShadow: 'none',
                    transform: 'translate(2px, 2px)'
                  }
                }}
              >
                {expanded ? 'Show less' : 'Show more'}
              </Button>
            </CardActions>
          </Box>
        </Box>
      </Card>

      <Menu 
        anchorEl={anchorEl} 
        open={Boolean(anchorEl)} 
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: '#ff0000' }}>
          Delete
        </MenuItem>
      </Menu>

      {editModalOpen && (
        <EditJobModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          job={job}
          onSave={handleSaveEdit}
        />
      )}

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Job Post</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this job posting?</Typography>
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