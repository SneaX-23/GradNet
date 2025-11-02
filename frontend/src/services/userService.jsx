export const searchUsers = async (query) => {
    if (!query || query.trim() === '') {
        return { success: true, users: [] };
    }
    
    const response = await fetch(`/api/users/search?q=${query}`);
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'Failed to search for users.');
    }
    return data;
};