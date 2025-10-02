import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Modal, Box, Slider, Button, Typography } from '@mui/material';
import getCroppedImg from './cropImage';

const cropperModalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '500px',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '8px',
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    gap: 2
};

function ImageCropper({ image, aspect, onCropComplete, onClose }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropFull = useCallback((croppedArea, croppedAreaPixelsValue) => {
        setCroppedAreaPixels(croppedAreaPixelsValue);
    }, []);

    const handleCrop = async () => {
        try {
            const croppedImageFile = await getCroppedImg(image, croppedAreaPixels);
            onCropComplete(croppedImageFile);
            onClose();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Modal open onClose={onClose}>
            <Box sx={cropperModalStyle}>
                <Typography variant="h6">Crop Image</Typography>
                <Box sx={{ position: 'relative', width: '100%', height: 400 }}>
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropFull}
                    />
                </Box>
                <Box>
                    <Typography>Zoom</Typography>
                    <Slider
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        onChange={(e, newZoom) => setZoom(newZoom)}
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                     <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={handleCrop} variant="contained">Apply</Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default ImageCropper;