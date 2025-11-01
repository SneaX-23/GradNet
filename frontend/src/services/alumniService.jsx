/**
 * Fetches a paginated list of all alumni.
 */
export const getAlumniList = async (page = 1) => {
    const response = await fetch(`/api/alumni?page=${page}`);
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
    const response = await fetch(`/api/alumni/search?q=${query}`);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to search alumni.');
    }
    return data;
};