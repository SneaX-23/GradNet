import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, IconButton, Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ImageCropper from './ImageCropper'; // Import the new cropper

const backendUrl = 'http://localhost:3000';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '16px',
  maxHeight: '90vh',
  overflowY: 'auto'
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

    // State for the cropper modal
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
            // Reset file inputs
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
            setCropAspect(type === 'profile' ? 1 / 1 : 16 / 5); // Square for profile, wide for banner
            setCropperOpen(true);
        };
        reader.readAsDataURL(file);
        e.target.value = null; // Reset file input to allow re-selection of the same file
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
            const response = await fetch('/api/profile/update', {
                method: 'POST',
                body: data,
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
                <Box sx={modalStyle}>
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: '1px solid #ddd' }}>
                            <IconButton onClick={onClose}><CloseIcon /></IconButton>
                            <Typography variant="h6" sx={{ ml: 2, flexGrow: 1 }}>Edit profile</Typography>
                            <Button type="submit" variant="contained" sx={{ borderRadius: '99px' }}>Save</Button>
                        </Box>
                        
                        <Box sx={{ position: 'relative' }}>
                            <Box sx={{ height: '200px', bgcolor: '#cfd9de', backgroundImage: `url(${bannerPreview})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                                <IconButton component="label" sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'rgba(15, 20, 25, 0.75)', '&:hover': {bgcolor: 'rgba(39, 44, 48, 0.75)'} }}>
                                    <AddPhotoAlternateIcon sx={{ color: 'white' }} />
                                    <input type="file" hidden accept="image/*" onChange={(e) => handleFileChange(e, 'banner')} />
                                </IconButton>
                            </Box>
                            <Box sx={{ position: 'absolute', top: '140px', left: '16px' }}>
                                <Avatar src={profilePreview} sx={{ width: 120, height: 120, border: '4px solid #fff' }} />
                                <IconButton component="label" sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'rgba(15, 20, 25, 0.75)', '&:hover': {bgcolor: 'rgba(39, 44, 48, 0.75)'} }}>
                                    <AddPhotoAlternateIcon sx={{ color: 'white' }} />
                                    <input type="file" hidden accept="image/*" onChange={(e) => handleFileChange(e, 'profile')} />
                                </IconButton>
                            </Box>
                        </Box>

                        <Box sx={{ p: 2, mt: '80px' }}>
                            <TextField name="name" label="Name" value={formData.name || ''} onChange={handleChange} fullWidth margin="normal" />
                            <TextField name="bio" label="Bio" value={formData.bio || ''} onChange={handleChange} fullWidth multiline rows={3} margin="normal" />
                            <TextField name="linkedin_url" label="LinkedIn URL" value={formData.linkedin_url || ''} onChange={handleChange} fullWidth margin="normal" />
                            <TextField name="github_url" label="GitHub URL" value={formData.github_url || ''} onChange={handleChange} fullWidth margin="normal" />
                            <TextField name="twitter_url" label="X (Twitter) URL" value={formData.twitter_url || ''} onChange={handleChange} fullWidth margin="normal" />
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