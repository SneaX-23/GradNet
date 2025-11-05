import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, IconButton, Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ImageCropper from './ImageCropper'; 
import { API_BASE_URL } from '../../config';

const backendUrl = 'http://localhost:3000';
const retroFont = "'Courier New', Courier, monospace";

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: 600,
  bgcolor: '#000000',
  color: '#ffffff',
  border: '2px solid #ffffff',
  borderRadius: 0,
  boxShadow: 24,
  maxHeight: '90vh',
  overflowY: 'auto'
};

const retroDialogTextFieldStyles = {
  '& label': {
    color: '#ffffff',
    fontFamily: retroFont,
  },
  '& label.Mui-focused': {
    color: '#ffffff',
  },
  '& .MuiInput-underline:before': { 
    borderBottomColor: '#ffffff',
  },
  '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
    borderBottomColor: '#ffffff',
  },
  '& .MuiInput-underline:after': { 
    borderBottomColor: '#ffffff',
  },
  '& .MuiInputBase-input': {
    color: '#ffffff',
    fontFamily: retroFont,
  }
};


const getFullUrl = (path) => {
  if (!path) return null;
  return path.startsWith('http') ? path : `${backendUrl}${path}`;
};

function EditProfileModal({ open, onClose, profileData, onSave }) {
    const [formData, setFormData] = useState({});
    const [profileImage, setProfileImage] = useState(null);
    const [bannerImage, setBannerImage] = useState(null);
    const [profilePreview, setProfilePreview] = useState(null);
    const [bannerPreview, setBannerPreview] = useState(null);
    const [cropperOpen, setCropperOpen] = useState(false);
    const [imageToCrop, setImageToCrop] = useState(null);
    const [cropAspect, setCropAspect] = useState(1);
    const [croppingType, setCroppingType] = useState(null);
    useEffect(() => {
        if (profileData) {
            setFormData({
                name: profileData.name || '',
                bio: profileData.bio || '',
                linkedin_url: profileData.linkedin_url || '',
                github_url: profileData.github_url || '',
                twitter_url: profileData.twitter_url || '',
            });
            setProfilePreview(getFullUrl(profileData.profile_picture_url));
            setBannerPreview(getFullUrl(profileData.profile_banner_url));
            setProfileImage(null);
            setBannerImage(null);
        }
    }, [profileData, open]);
    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            setImageToCrop(reader.result);
            setCroppingType(type);
            setCropAspect(type === 'profile' ? 1 / 1 : 16 / 5);
            setCropperOpen(true);
        };
        reader.readAsDataURL(file);
        e.target.value = null;
    };
    const handleCropComplete = (croppedFile) => {
        const previewUrl = URL.createObjectURL(croppedFile);
        if (croppingType === 'profile') {
            setProfileImage(croppedFile);
            setProfilePreview(previewUrl);
        } else if (croppingType === 'banner') {
            setBannerImage(croppedFile);
            setBannerPreview(previewUrl);
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (profileImage) data.append('profileImage', profileImage);
        if (bannerImage) data.append('bannerImage', bannerImage);
        try {
            const response = await fetch(`${API_BASE_URL}/api/profile/update`, {
                method: 'POST',
                body: data,
                credentials: 'include',
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Failed to update.');
            onSave();
            onClose();
        } catch (error) {
            console.error("Failed to update profile:", error);
        }
    };

    // --- Start of JSX ---
    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Box sx={modalStyle}>
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: '1px solid #555' }}>
                            <IconButton onClick={onClose} sx={{color: '#fff'}}><CloseIcon /></IconButton>
                            <Typography variant="h6" sx={{ ml: 2, flexGrow: 1, fontFamily: retroFont }}>Edit profile</Typography>
                            <Button 
                              type="submit" 
                              variant="contained" 
                              sx={{ 
                                fontFamily: retroFont,
                                borderRadius: 0,
                                bgcolor: '#ffffff', 
                                color: '#000000', 
                                border: '2px solid #ffffff',
                                '&:hover': { bgcolor: '#000000', color: '#ffffff' }
                              }}
                            >
                              Save
                            </Button>
                        </Box>
                        
                        <Box sx={{ position: 'relative' }}>
                            <Box sx={{ 
                              height: '200px', 
                              bgcolor: '#000000', 
                              borderBottom: '2px solid #ffffff',
                              backgroundImage: `url(${bannerPreview})`, 
                              backgroundSize: 'cover', 
                              backgroundPosition: 'center', 
                              position: 'relative' 
                            }}>
                                <IconButton component="label" sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'rgba(255, 255, 255, 0.3)', borderRadius: 0, '&:hover': {bgcolor: 'rgba(255, 255, 255, 0.5)'} }}>
                                    <AddPhotoAlternateIcon sx={{ color: 'white' }} />
                                    <input type="file" hidden accept="image/*" onChange={(e) => handleFileChange(e, 'banner')} />
                                </IconButton>
                            </Box>
                            <Box sx={{ position: 'absolute', top: '140px', left: '16px' }}>
                                <Avatar src={profilePreview} sx={{ width: 120, height: 120, border: '4px solid #000', borderRadius: 0 }} />
                                <IconButton component="label" sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'rgba(255, 255, 255, 0.3)', borderRadius: 0, '&:hover': {bgcolor: 'rgba(255, 255, 255, 0.5)'} }}>
                                    <AddPhotoAlternateIcon sx={{ color: 'white' }} />
                                    <input type="file" hidden accept="image/*" onChange={(e) => handleFileChange(e, 'profile')} />
                                </IconButton>
                            </Box>
                        </Box>

                        <Box sx={{ p: 2, mt: '80px' }}>
                            <TextField name="name" label="Name" value={formData.name || ''} onChange={handleChange} fullWidth margin="normal" variant="standard" sx={retroDialogTextFieldStyles} InputLabelProps={{ shrink: true }} />
                            <TextField name="bio" label="Bio" value={formData.bio || ''} onChange={handleChange} fullWidth multiline rows={3} margin="normal" variant="standard" sx={retroDialogTextFieldStyles} InputLabelProps={{ shrink: true }} />
                            <TextField name="linkedin_url" label="LinkedIn URL" value={formData.linkedin_url || ''} onChange={handleChange} fullWidth margin="normal" variant="standard" sx={retroDialogTextFieldStyles} InputLabelProps={{ shrink: true }} />
                            <TextField name="github_url" label="GitHub URL" value={formData.github_url || ''} onChange={handleChange} fullWidth margin="normal" variant="standard" sx={retroDialogTextFieldStyles} InputLabelProps={{ shrink: true }} />
                            <TextField name="twitter_url" label="X (Twitter) URL" value={formData.twitter_url || ''} onChange={handleChange} fullWidth margin="normal" variant="standard" sx={retroDialogTextFieldStyles} InputLabelProps={{ shrink: true }} />
                        </Box>
                    </form>
                </Box>
            </Modal>
            
            {cropperOpen && (
                <ImageCropper
                    image={imageToCrop}
                    aspect={cropAspect}
                    onCropComplete={handleCropComplete}
                    onClose={() => setCropperOpen(false)}
                />
            )}
        </>
    );
}

export default EditProfileModal;