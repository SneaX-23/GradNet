import { API_BASE_URL } from '../config';

export const getBookmarks = async (page) => {
    const response = await fetch(`${API_BASE_URL}/api/bookmarks?page=${page}`, { credentials: 'include' });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch bookmarks.');
    }
    return data;
};

export const addBookmark = async (id, type) => {
    const response = await fetch(`${API_BASE_URL}/api/bookmarks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, type }),
        credentials: 'include',
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to add bookmark.');
    }
    return data;
};

export const deleteBookmark = async (id, type) => {
    const response = await fetch(`${API_BASE_URL}/api/bookmarks`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, type }),
        credentials: 'include',
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to delete bookmark.');
    }
    return data;
};