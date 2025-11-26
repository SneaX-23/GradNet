import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, IconButton, Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ImageCropper from '../profile/ImageCropper.jsx'; 
import { API_BASE_URL } from '../../config.js';
import { useTheme } from '@mui/material/styles';
import { theme, colors, borderStyle, shadowHover, shadowStyle } from '../../theme';

const getFullUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
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
    const theme = useTheme()

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

    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Box sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '100%',
                  maxWidth: 600,
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  bgcolor: theme.palette.background.default,
                  border: borderStyle,
                }}>
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: '1px solid #555' }}>
                            <IconButton onClick={onClose} sx={{ border: 'none' }}><CloseIcon /></IconButton>
                            <Typography variant="h6" sx={{ ml: 2, flexGrow: 1 }}>Edit profile</Typography>
                            <Button 
                              type="submit" 
                              variant="contained"
                            >
                              Save
                            </Button>
                        </Box>
                        
                        <Box sx={{ position: 'relative' }}>
                            <Box sx={{ 
                              height: '200px', 
                              borderBottom: '2px solid #ffffff',
                              backgroundImage: `url(${bannerPreview})`, 
                              backgroundSize: 'cover', 
                              backgroundPosition: 'center', 
                              position: 'relative' 
                            }}>
                                <IconButton 
                                  component="label" 
                                  sx={{ 
                                    position: 'absolute', 
                                    top: '50%', 
                                    left: '50%', 
                                    transform: 'translate(-50%, -50%)', 
                                    bgcolor: 'rgba(255, 255, 255, 0.3)', 
                                    border: 'none',
                                    '&:hover': {bgcolor: 'rgba(255, 255, 255, 0.5)'} 
                                  }}
                                >
                                    <AddPhotoAlternateIcon sx={{ color: 'white' }} />
                                    <input type="file" hidden accept="image/*" onChange={(e) => handleFileChange(e, 'banner')} />
                                </IconButton>
                            </Box>
                            
                            <Avatar 
                              src={profilePreview} 
                              sx={{ 
                                width: 120, 
                                height: 120, 
                                border: '2px solid #000', 
                                position: 'absolute', 
                                top: '140px', 
                                left: '16px' 
                              }} 
                            />
                            <IconButton 
                              component="label" 
                              sx={{ 
                                position: 'absolute', 
                                top: 196, 
                                left: 72, 
                                transform: 'translate(-50%, -50%)', 
                                bgcolor: 'rgba(255, 255, 255, 0.3)', 
                                border: 'none',
                                '&:hover': {bgcolor: 'rgba(255, 255, 255, 0.5)'} 
                              }}
                            >
                                <AddPhotoAlternateIcon sx={{ color: 'white' }} />
                                <input type="file" hidden accept="image/*" onChange={(e) => handleFileChange(e, 'profile')} />
                            </IconButton>
                        </Box>

                        <Box sx={{ p: 2, mt: '80px' }}>
                            <TextField name="name" label="Name" value={formData.name || ''} onChange={handleChange} fullWidth margin="normal" variant="standard" InputLabelProps={{ shrink: true }} />
                            <TextField name="bio" label="Bio" value={formData.bio || ''} onChange={handleChange} fullWidth multiline rows={3} margin="normal" variant="standard" InputLabelProps={{ shrink: true }} />
                            <TextField name="linkedin_url" label="LinkedIn URL" value={formData.linkedin_url || ''} onChange={handleChange} fullWidth margin="normal" variant="standard" InputLabelProps={{ shrink: true }} />
                            <TextField name="github_url" label="GitHub URL" value={formData.github_url || ''} onChange={handleChange} fullWidth margin="normal" variant="standard" InputLabelProps={{ shrink: true }} />
                            <TextField name="twitter_url" label="X (Twitter) URL" value={formData.twitter_url || ''} onChange={handleChange} fullWidth margin="normal" variant="standard" InputLabelProps={{ shrink: true }} />
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