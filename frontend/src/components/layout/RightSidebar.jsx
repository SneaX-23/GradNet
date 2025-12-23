import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '/src/context/AuthContext.jsx';
import { API_BASE_URL } from '/src/config.js';
import { LogOut, User } from 'lucide-react';

function RightSidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showLogout, setShowLogout] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        if (!showLogout) return;

        const handlePointerDown = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setShowLogout(false);
            }
        };

        document.addEventListener('pointerdown', handlePointerDown, true);
        return () =>
            document.removeEventListener('pointerdown', handlePointerDown, true);
    }, [showLogout]);

    const handleLogout = async () => {
        setShowLogout(false);
        await logout();
        navigate('/');
    };

    const avatarUrl = user?.profile_image_url
        ? user.profile_image_url.startsWith('http')
            ? user.profile_image_url
            : `${API_BASE_URL}${user.profile_image_url}`
        : null;

    return (
        <div className="flex flex-col justify-between h-full">
            <div />
            <div></div>
            <div ref={containerRef} className="mt-auto px-4 py-3 relative">
                {showLogout && (
                    <div className="absolute bottom-16 right-4 z-50">
                        <button
                            onClick={handleLogout}
                            className="btn btn-primary flex items-center gap-2"
                        >
                            <LogOut size={18} />
                            <span className="font-semibold">Logout</span>
                        </button>
                    </div>
                )}

                <button
                    onClick={() => setShowLogout((prev) => !prev)}
                    className={`w-full flex items-center gap-3 p-2 rounded-md transition-colors hover:bg-primary/10 ${showLogout ? 'bg-primary/10' : ''
                        }`}
                >
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-muted shrink-0 border border-border">
                        {avatarUrl ? (
                            <img
                                src={avatarUrl}
                                alt="User"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="h-full w-full flex items-center justify-center bg-primary text-primary-foreground">
                                <User size={20} />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col items-start overflow-hidden">
                        <span className="text-sm font-bold truncate w-full text-left">
                            {user?.name || 'User'}
                        </span>
                        <span className="text-xs text-muted-foreground truncate w-full text-left capitalize">
                            {user?.handle || 'Member'}
                        </span>
                    </div>
                </button>
            </div>
        </div>
    );
}

export default RightSidebar;
