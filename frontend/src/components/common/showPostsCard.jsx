import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Link
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import EditPostModal from './EditPostModal';
import { useAuth } from '../../context/AuthContext';

const backendUrl = 'http://localhost:3000';

const getFullUrl = (path) => {
  if (!path) return null;
  return path.startsWith('http') ? path : `${backendUrl}${path}`;
};

export default function ShowPostsCard({ post, onDelete, onUpdate }) {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [numPages, setNumPages] = useState(null);

  const isOwner = user?.id === post.posted_by;
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
    onDelete(post.id);
    setDeleteDialogOpen(false);
  };

  const handleSaveEdit = (updatedPost) => {
    if (onUpdate) {
      onUpdate(updatedPost);
    }
  };

  const handlePdfClick = (pdfUrl) => {
    setSelectedPdf(pdfUrl);
    setPdfDialogOpen(true);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const authorInitial = post.author_name ? post.author_name.charAt(0).toUpperCase() : '?';
  const avatarUrl = getFullUrl(post.profile_picture_url);

  const renderMedia = () => {
    if (!post.files || post.files.length === 0) return null;

    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
        {post.files.map((file, index) => {
          const fileUrl = getFullUrl(file.file_url);
          if (file.file_mime_type.startsWith('image/')) {
            return (
              <Box
                key={index}
                component="img"
                src={fileUrl}
                alt={`Post media ${index + 1}`}
                sx={{
                  width: post.files.length === 1 ? '100%' : 'calc(50% - 4px)',
                  maxHeight: '400px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              />
            );
          } else if (file.file_mime_type.startsWith('video/')) {
            return (
              <Box
                key={index}
                component="video"
                controls
                src={fileUrl}
                sx={{
                  width: post.files.length === 1 ? '100%' : 'calc(50% - 4px)',
                  maxHeight: '400px',
                  borderRadius: '8px'
                }}
              />
            );
          } else if (file.file_mime_type === 'application/pdf') {
            return (
              <Box
                key={index}
                onClick={() => handlePdfClick(fileUrl)}
                sx={{
                  width: post.files.length === 1 ? '100%' : 'calc(50% - 4px)',
                  height: '200px',
                  border: '2px solid #eee',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#f5f5f5' }
                }}
              >
                <Typography>PDF Document - Click to view</Typography>
              </Box>
            );
          }
          return null;
        })}
      </Box>
    );
  };

  return (
    <>
      <Card
        sx={{
          p: 2,
          mb: 2,
          width: '100%',
          maxWidth: 700,
          boxShadow: 'none',
          border: '1px solid #eee',
          borderRadius: '8px'
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar src={avatarUrl || ''} sx={{ width: 40, height: 40 }}>
              {!avatarUrl && authorInitial}
            </Avatar>
            <Box>
              <Typography variant="body1" fontWeight="bold">
                {post.author_name || 'Unknown'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {post.handle && (
                  <Link
                    href={`/profile/${post.handle}`}
                    underline="none"
                    sx={{ color: 'text.secondary', '&:hover': { textDecoration: 'underline' } }}
                  >
                    <Typography variant="body2">@{post.handle}</Typography>
                  </Link>
                )}
                <Typography variant="body2" color="text.secondary">
                  · {new Date(post.created_at).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          </Box>
          {canModify && (
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>
          )}
        </Box>

        {post.title && (
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
            {post.title}
          </Typography>
        )}
        {post.description && (
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {post.description}
          </Typography>
        )}

        {renderMedia()}
      </Card>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          Delete
        </MenuItem>
      </Menu>

      {editModalOpen && (
        <EditPostModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          post={post}
          onSave={handleSaveEdit}
        />
      )}

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Post</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this post? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={pdfDialogOpen} onClose={() => setPdfDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>PDF Document</DialogTitle>
        <DialogContent>
          {selectedPdf && (
            <Document file={selectedPdf} onLoadSuccess={onDocumentLoadSuccess}>
              {Array.from(new Array(numPages), (el, index) => (
                <Page key={`page_${index + 1}`} pageNumber={index + 1} width={600} />
              ))}
            </Document>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPdfDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}