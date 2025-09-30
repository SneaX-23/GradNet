import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CreateProfilePage() {
    const [prefilledData, setPrefilledData] = useState(null);

    const [handle, setHandle] = useState('');

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState('');
    
    const [isHandleAvailable, setIsHandleAvailable] = useState(false);
    const [isCheckingHandle, setIsCheckingHandle] = useState(false);
    const navigate = useNavigate()
    useEffect(() => {
        const fetchOnboardingDetails = async () => {
            try {
                const response = await fetch('/api/onboard');
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
                    const response = await fetch('/api/check-handle', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ handle }),
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
        console.log({
            ...prefilledData,
            handle: handle,
        });
        try {
            const response = fetch('/api/create-profile', {
               method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usn: prefilledData.usn,
                    name: prefilledData.name,
                    email: prefilledData.email,
                    handle: handle }), 
            });
            const result = await response.json();
            return navigate('/home');
        } catch (err) {
            setError(err.message); 
        }
        
    };

    if (loading) return <p>Loading your details...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

    return (
        <div>
            <h1>Complete Your GradNet Profile</h1>
            <p>Welcome, {prefilledData?.name}! Choose a unique handle to get started.</p>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name</label>
                    <input type="text" value={prefilledData?.name || ''} disabled />
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" value={prefilledData?.email || ''} disabled />
                </div>
                <div>
                    <label htmlFor="handle">Handle</label>
                    <input
                        id="handle"
                        type="text"
                        value={handle}
                        onChange={(e) => setHandle(e.target.value)}
                        placeholder="Choose a unique handle"
                        style={{
                            border: `2px solid ${handle.trim() === '' ? 'gray' : isHandleAvailable ? 'green' : 'red'}`
                        }}
                        required
                    />
                    {isCheckingHandle && <p>Checking availability...</p>}
                </div>
                <button type="submit" disabled={!isHandleAvailable || isCheckingHandle}>
                    Create Profile
                </button>
            </form>
        </div>
    );
}

export default CreateProfilePage;