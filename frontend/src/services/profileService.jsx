export const fetchUserProfile = async () => {
    const response = await fetch('/api/profile');
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch user profile.');
    }
    return data;
};