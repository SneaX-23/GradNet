import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check } from 'lucide-react';
import getCroppedImg from './cropImage';

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
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <h3 className="text-lg font-bold text-foreground">Crop Image</h3>
                    <button onClick={onClose} className="p-1 hover:bg-foreground/10 rounded-full text-muted">
                        <X size={20} />
                    </button>
                </div>

                {/* Cropper Area */}
                <div className="relative w-full h-80 bg-black">
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropFull}
                    />
                </div>

                {/* Controls */}
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-medium text-muted">
                            <span>Zoom</span>
                            <span>{Math.round(zoom * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            min={1}
                            max={3}
                            step={0.1}
                            value={zoom}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <button onClick={onClose} className="px-4 py-2 text-sm font-medium hover:bg-foreground/5 rounded-lg">
                            Cancel
                        </button>
                        <button onClick={handleCrop} className="flex items-center gap-2 px-6 py-2 text-sm font-medium bg-primary text-background rounded-lg hover:opacity-90 transition-all">
                            <Check size={16} /> Apply Crop
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ImageCropper;