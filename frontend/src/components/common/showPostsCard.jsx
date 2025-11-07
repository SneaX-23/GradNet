import React, { useState } from 'react';
import {
  Box, Card, Typography, Avatar, IconButton, Menu, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Link, Modal
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark'; 
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import EditPostModal from './EditPostModal';
import ImageModal from './ImageModal'; 
import { useAuth } from '../../context/AuthContext';
import { addBookmark, deleteBookmark } from '../../services/bookmarksService'; 
import { API_BASE_URL } from '../../config';

// const backendUrl = 'http://localhost:3000';
const retroFont = "'Courier New', Courier, monospace";

// const getFullUrl = (path) => {
//   if (!path) return null;
//   return path.startsWith('http') ? path : `${backendUrl}${path}`;
// };
const getFullUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
};



const retroDialogSx = {
  '& .MuiDialog-paper': {
    bgcolor: '#000000',
    color: '#ffffff',
    border: '2px solid #ffffff',
    borderRadius: 0,
    fontFamily: retroFont,
  },
  '& .MuiTypography-root': {
    fontFamily: retroFont,
  },
  '& .MuiButton-root': {
    fontFamily: retroFont,
    color: '#ffffff',
    borderColor: '#ffffff',
    borderRadius: 0,
    '&:hover': { bgcolor: '#333' }
  },
  '& .MuiButton-contained': {
    bgcolor: '#ffffff',
    color: '#000000',
    '&:hover': { bgcolor: '#000000', color: '#ffffff' }
  }
};

export default function ShowPostsCard({ post, onDelete, onUpdate, onBookmarkToggle }) { 
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [numPages, setNumPages] = useState(null);

  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

  const [isBookmarked, setIsBookmarked] = useState(post.is_bookmarked);
  const [isBookmarkPending, setIsBookmarkPending] = useState(false);


  const handleOpenImage = (imageUrl) => {
    if (imageUrl) {
      setSelectedImage(imageUrl);
      setImageModalOpen(true);
    }
  };
  const handleCloseImage = () => setImageModalOpen(false);
 


  const isOwner = user?.id === post.posted_by;
  const isAdmin = user?.role === 'admin';
  const canModify = isOwner || isAdmin;

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
    onDelete(post.id);
    setDeleteDialogOpen(false);
  };

  const handleSaveEdit = (updatedPost) => {
    if (onUpdate) onUpdate(updatedPost);
  };

  const handlePdfClick = (pdfUrl) => {
    setSelectedPdf(pdfUrl);
    setPdfDialogOpen(true);
  };

  const onDocumentLoadSuccess = ({ numPages }) => setNumPages(numPages);

  const handleBookmarkClick = async (e) => {
    e.stopPropagation(); 
    setIsBookmarkPending(true);
    try {
      if (isBookmarked) {
        await deleteBookmark(post.id, 'post');
        setIsBookmarked(false);
      } else {
        await addBookmark(post.id, 'post');
        setIsBookmarked(true);
      }
      if (onBookmarkToggle) {
        onBookmarkToggle(post.id, 'post');
      }
    } catch (err) {
      console.error("Failed to update bookmark:", err);
    } finally {
      setIsBookmarkPending(false);
    }
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
                onClick={() => handleOpenImage(fileUrl)} 
                sx={{
                  width: post.files.length === 1 ? '100%' : 'calc(50% - 4px)',
                  maxHeight: '400px',
                  objectFit: 'cover',
                  borderRadius: 0, 
                  border: '1px solid #555', 
                  cursor: 'pointer',
                  imageRendering: 'pixelated' 
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
                  borderRadius: 0, 
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
                  border: '2px solid #555', 
                  borderRadius: 0, 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#333' }
                }}
              >
                <Typography sx={{fontFamily: retroFont, color: '#ffffff'}}>PDF Document</Typography>
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
          border: '2px solid #ffffff', 
          borderRadius: 0, 
          bgcolor: '#000000', 
          color: '#ffffff', 
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar 
              src={avatarUrl || ''} 
              sx={{ 
                width: 40, 
                height: 40,
                border: '2px solid #ffffff', 
                borderRadius: 0, 
                imageRendering: 'pixelated'
              }}
            >
              {!avatarUrl && authorInitial}
            </Avatar>
            <Box>
              <Typography variant="body1" fontWeight="bold" sx={{ fontFamily: retroFont, color: '#ffffff' }}>
                {post.author_name || 'Unknown'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {post.handle && (
                  <Link
                    href={`/profile/${post.handle}`}
                    underline="none"
                    sx={{ color: '#aaaaaa', '&:hover': { textDecoration: 'underline' } }}
                  >
                    <Typography variant="body2" sx={{ fontFamily: retroFont }}>@{post.handle}</Typography>
                  </Link>
                )}
                <Typography variant="body2" sx={{ fontFamily: retroFont, color: '#aaaaaa' }}>
                  · {new Date(post.created_at).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}> 
            <IconButton size="small" onClick={handleBookmarkClick} disabled={isBookmarkPending} sx={{ color: '#ffffff' }}>
                {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
            </IconButton>
            {canModify && (
              <IconButton size="small" onClick={handleMenuOpen} sx={{ color: '#ffffff' }}>
                <MoreVertIcon />
              </IconButton>
            )}
          </Box>
        </Box>

        {post.title && (
          <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold', fontFamily: retroFont, color: '#ffffff' }}>
            {post.title}
          </Typography>
        )}
        {post.description && (
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', fontFamily: retroFont, color: '#ffffff' }}>
            {post.description}
          </Typography>
        )}

        {renderMedia()}
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
        <MenuItem onClick={handleEdit} sx={{fontFamily: retroFont, '&:hover': {backgroundColor: '#333'}}}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: '#ff0000', fontFamily: retroFont, '&:hover': {backgroundColor: '#333'} }}>
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

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} sx={retroDialogSx}>
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

      <Dialog open={pdfDialogOpen} onClose={() => setPdfDialogOpen(false)} maxWidth="md" fullWidth sx={retroDialogSx}>
        <DialogTitle>PDF Document</DialogTitle>
        <DialogContent sx={{bgcolor: '#ffffff'}}>
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

      <ImageModal
        open={imageModalOpen}
        onClose={handleCloseImage}
        imageUrl={selectedImage}
      />
    </>
  );
}