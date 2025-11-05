import React, { createContext, useState, useContext, useEffect } from 'react';
import { socket } from '../socket';
import { API_BASE_URL } from '../config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserSession = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/session-status`, { credentials: 'include' });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user); 
                }
            } catch (error) {
                console.error('Session check failed:', error);
            } finally {
                setLoading(false); 
            }
        };

        checkUserSession();
    }, []);

    useEffect(() => {
        if (user) {
            socket.connect();
            console.log("Socket connected!");

        } else {
            socket.disconnect();
            console.log("Socket disconnected.");
        }

        return () => {
            socket.off('connect_error');
        };
    }, [user]);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            await fetch(`${API_BASE_URL}/api/logout`, { method: 'POST', credentials: 'include' });
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setUser(null);
        }
    };

    const value = {
        user,
        isLoggedIn: !!user, 
        login,
        logout,
        loading 
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};