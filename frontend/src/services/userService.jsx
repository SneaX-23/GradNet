import { API_BASE_URL } from '../config';

export const searchUsers = async (query) => {
    if (!query || query.trim() === '') {
        return { success: true, users: [] };
    }
    
    const response = await fetch(`${API_BASE_URL}/api/users/search?q=${query}`, { credentials: 'include' });
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'Failed to search for users.');
    }
    return data;
};

export const fetchGitHubStats = async (handle) => {
    const response = await fetch(`${API_BASE_URL}/api/users/${handle}/github-stats`, { 
        credentials: 'include' 
    });
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch GitHub stats.');
    }
    return data;
};