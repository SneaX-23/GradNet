import React, { useEffect, useState } from 'react';

function ImageModal({ open, onClose, imageUrl, alt = "Expanded view" }) {
    const [shouldRender, setShouldRender] = useState(open);
    const [isAnimate, setIsAnimate] = useState(false);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (open) {
            setShouldRender(true);
            window.addEventListener('keydown', handleEsc);
            const timer = setTimeout(() => setIsAnimate(true), 10);
            return () => {
                clearTimeout(timer);
                window.removeEventListener('keydown', handleEsc);
            };
        } else {
            setIsAnimate(false);
            const timer = setTimeout(() => setShouldRender(false), 300);
            return () => {
                clearTimeout(timer);
                window.removeEventListener('keydown', handleEsc);
            };
        }
    }, [open, onClose]);

    if (!shouldRender) return null;

    return (
        <div
            className={`fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-md transition-opacity duration-300 ease-in-out ${isAnimate ? 'opacity-100' : 'opacity-0'
                }`}
            onClick={onClose}
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 z-110"
                aria-label="Close modal"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Image Container */}
            <div
                className={`relative max-w-[95vw] max-h-[95vh] flex items-center justify-center transition-all duration-300 ease-out transform ${isAnimate ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                <img
                    src={imageUrl}
                    alt={alt}
                    className="max-h-[90vh] max-w-[90vw] object-contain border border-white/20 shadow-2xl [image-rendering:pixelated]"
                />
            </div>
        </div>
    );
}

export default ImageModal;