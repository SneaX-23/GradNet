import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserSession = async () => {
            try {
                const response = await fetch('/api/session-status');
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

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            await fetch('/api/logout', { method: 'POST' });
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