import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';

function CreateProfilePage() {
    const { login } = useAuth();
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
                if (!response.ok) throw new Error(data.message || 'Could not fetch details.');
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
                    setIsHandleAvailable(response.ok && data.available);
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
                    handle: handle,
                    role: prefilledData.role,
                }),
                credentials: 'include',
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message);
            login(result.user);
            navigate(`/home`);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-muted">Loading your details...</p>
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-xl border border-border sm:p-8">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-foreground">Complete Your Profile</h1>
                    <p className="mt-2 text-sm text-muted">
                        Welcome, <span className="text-foreground font-medium">{prefilledData?.name}</span>! <br />
                        Choose a unique handle to get started.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Read-only Fields */}
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="text-xs font-medium uppercase tracking-wider text-muted ml-1">Full Name</label>
                            <input
                                type="text"
                                value={prefilledData?.name || ''}
                                disabled
                                className="mt-1 w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm text-muted cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium uppercase tracking-wider text-muted ml-1">Email Address</label>
                            <input
                                type="email"
                                value={prefilledData?.email || ''}
                                disabled
                                className="mt-1 w-full rounded-md border border-border bg-background/50 px-3 py-2 text-sm text-muted cursor-not-allowed"
                            />
                        </div>
                    </div>

                    {/* Handle Field */}
                    <div>
                        <label htmlFor="handle" className="text-xs font-medium uppercase tracking-wider text-muted ml-1">Choose Handle</label>
                        <div className="relative mt-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">@</span>
                            <input
                                id="handle"
                                type="text"
                                value={handle}
                                onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/\s/g, ''))}
                                placeholder="unique_username"
                                required
                                className="w-full rounded-md border border-border bg-background pl-8 pr-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                            />
                        </div>

                        {/* Status Message */}
                        {handle && (
                            <p className={`mt-2 text-xs font-medium ${isCheckingHandle ? 'text-muted' : isHandleAvailable ? 'text-green-500' : 'text-red-400'}`}>
                                {isCheckingHandle ? "Checking availability..." : isHandleAvailable ? "✓ This handle is available" : "✕ This handle is already taken"}
                            </p>
                        )}
                    </div>

                    {/* Warning Note */}
                    <div className="rounded-lg bg-background/50 border border-border p-3">
                        <p className="text-[12px] leading-relaxed text-muted">
                            <span className="text-foreground font-bold mr-1">⚠ Note:</span>
                            This handle is your permanent identity. It <strong className='text-red-600'>cannot be changed</strong> later. Choose wisely!
                        </p>
                    </div>

                    {error && <p className="text-center text-sm text-red-400 font-medium">{error}</p>}

                    <button
                        type="submit"
                        disabled={!isHandleAvailable || isCheckingHandle}
                        className="btn btn-primary w-full py-2.5"
                    >
                        Create Profile
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateProfilePage;