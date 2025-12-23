import React, { useEffect, useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

function DeletePostModal({ open, onClose, onConfirm, isDeleting, type, section }) {
    const [isAnimate, setIsAnimate] = useState(false);
    const [shouldRender, setShouldRender] = useState(open);

    useEffect(() => {
        if (open) {
            setShouldRender(true);
            setTimeout(() => setIsAnimate(true), 10);
        } else {
            setIsAnimate(false);
            setTimeout(() => setShouldRender(false), 300);
        }
    }, [open]);

    if (!shouldRender) return null;

    return (
        <div className={`fixed inset-0 z-9999 flex items-center justify-center p-4 transition-opacity duration-300 ${isAnimate ? 'opacity-100' : 'opacity-0'}`}>
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className={`relative z-10000 w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-2xl transition-all duration-300 transform ${isAnimate ? 'scale-100' : 'scale-95'}`}>
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-red-500/10 rounded-full text-red-500">
                        <AlertTriangle size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Delete {type}?</h3>
                </div>
                <p className="text-muted mb-6">This action cannot be undone. This {type} will be permanently removed from the {section}.</p>
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} disabled={isDeleting} className="px-4 py-2 text-sm font-medium hover:bg-foreground/5 rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button onClick={onConfirm} disabled={isDeleting} className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 min-w-25 justify-center">
                        {isDeleting ? <Loader2 size={16} className="animate-spin" /> : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeletePostModal;