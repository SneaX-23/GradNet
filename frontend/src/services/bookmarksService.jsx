export const getBookmarks = async (page) => {
    const response = await fetch(`/api/bookmarks?page=${page}`);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch bookmarks.');
    }
    return data;
};

export const addBookmark = async (id, type) => {
    const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, type }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to add bookmark.');
    }
    return data;
};

export const deleteBookmark = async (id, type) => {
    const response = await fetch('/api/bookmarks', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, type }),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to delete bookmark.');
    }
    return data;
};