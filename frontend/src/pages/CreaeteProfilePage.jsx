import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/CreateProfilePage.css'; 
import { API_BASE_URL } from '../config';

function CreateProfilePage() {
    const [prefilledData, setPrefilledData] = useState(null);
    const [handle, setHandle] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isHandleAvailable, setIsHandleAvailable] = useState(false);
    const [isCheckingHandle, setIsCheckingHandle] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOnboardingDetails = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/onboard`, { credentials: 'include' });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Could not fetch your details.');
                }

                setPrefilledData(data.user);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOnboardingDetails();
    }, []); 

    useEffect(() => {
        if (handle.trim() === '') {
            setIsHandleAvailable(false);
            return;
        }

        setIsCheckingHandle(true);

        const debounceTimer = setTimeout(() => {
            const checkHandleAvailability = async () => {
                try {
                    const response = await fetch(`${API_BASE_URL}/api/check-handle`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ handle }),
                        credentials: 'include',
                    });
                    const data = await response.json();
                    if (response.ok) {
                        setIsHandleAvailable(data.available);
                    } else {
                        setIsHandleAvailable(false);
                    }
                } catch (err) {
                    setIsHandleAvailable(false);
                } finally {
                    setIsCheckingHandle(false);
                }
            };

            checkHandleAvailability();
        }, 500); 

    
        return () => clearTimeout(debounceTimer);

    }, [handle]); 

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/api/create-profile`, {
               method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usn: prefilledData.usn,
                    name: prefilledData.name,
                    email: prefilledData.email,
                    handle: handle }), 
                credentials: 'include',
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
            return navigate('/home');
        } catch (err) {
            setError(err.message); 
        }
    };

    let handleStatusText = '';
    let handleStatusClass = 'handle-status';
    if (isCheckingHandle) {
        handleStatusText = 'Checking availability...';
    } else if (handle.trim() !== '') {
        if (isHandleAvailable) {
            handleStatusText = 'Handle is available!';
            handleStatusClass += ' available';
        } else {
            handleStatusText = 'Handle is already taken.';
            handleStatusClass += ' unavailable';
        }
    }

    if (loading) return (
        <div className="create-profile-container">
            <p>Loading your details...</p>
        </div>
    );
    
    if (error && !prefilledData) return (
        <div className="create-profile-container">
             <div className="create-profile-card">
                <h1>Error</h1>
                <p className="error-message">{error}</p>
             </div>
        </div>
    );

    return (
        <div className="create-profile-container">
            <div className="create-profile-card">
                <h1>Complete Your Profile</h1>
                <p>Welcome, {prefilledData?.name}! Choose a unique handle to get started.</p>

                <form className="create-profile-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" value={prefilledData?.name || ''} disabled />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" value={prefilledData?.email || ''} disabled />
                    </div>
                    <div className="form-group">
                        <label htmlFor="handle">Handle</label>
                        <input
                            id="handle"
                            type="text"
                            value={handle}
                            onChange={(e) => setHandle(e.target.value)}
                            placeholder="Choose a unique handle"
                            required
                        />
                        <p className={handleStatusClass}>{handleStatusText}</p>
                        <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '8px', fontStyle: 'italic' }}>
                            ⚠ <strong>Note:</strong> This handle will serve as your permanent identity on the platform. Please choose a professional and appropriate handle as it <strong>cannot be changed later</strong>.
                        </p>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <button type="submit" disabled={!isHandleAvailable || isCheckingHandle}>
                        Create Profile
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateProfilePage;