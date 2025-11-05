import { API_BASE_URL } from '../config';

export const fetchUserProfile = async () => {
    const response = await fetch(`${API_BASE_URL}/api/profile`, { credentials: 'include' });
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user profile.');
    }
    return data;
};

export const fetchUserProfileByHandle = async (handle) => {
    const response = await fetch(`${API_BASE_URL}/api/profile/${handle}`, { credentials: 'include' });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user profile.');
    }
    return data;
}