import React from 'react';
import { Modal, Box } from '@mui/material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'transparent', 
  p: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  outline: 'none', 
};


function ImageModal({ open, onClose, imageUrl, alt = "Expanded view" }) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle} onClick={onClose}>
        <img 
          src={imageUrl} 
          alt={alt}
          style={{ 
            maxHeight: '90vh', 
            maxWidth: '90vw', 
            objectFit: 'contain', 
            border: '2px solid white',
            borderRadius: 0, 
            imageRendering: 'pixelated' 
          }} 
        />
      </Box>
    </Modal>
  );
}

export default ImageModal;