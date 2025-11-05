import { API_BASE_URL } from '../config';

/**
 * Fetches a paginated list of all alumni.
 */
export const getAlumniList = async (page = 1) => {
    const response = await fetch(`${API_BASE_URL}/api/alumni?page=${page}`, { credentials: 'include' });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch alumni list.');
    }
    return data;
};

/**
 * Searches for alumni based on a query.
 */
export const searchAlumni = async (query) => {
    const response = await fetch(`${API_BASE_URL}/api/alumni/search?q=${query}`, { credentials: 'include' });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to search alumni.');
    }
    return data;
};