import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function HomePage() {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        navigate('/');
    }

    return (
        <div>
            <h1>Welcome, {user.name}!</h1>
            <p>You are successfully logged in.</p>
            <button onClick={logout}>Logout</button>
        </div>
    );
}

export default HomePage;