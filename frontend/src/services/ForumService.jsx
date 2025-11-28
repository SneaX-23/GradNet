import { API_BASE_URL } from '../config';

export const getForums = async (page = 1) => {
    const response = await fetch(`${API_BASE_URL}/api/forum/get-forums?page=${page}`, { credentials: 'include' });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || `Failed to fetch forums`);
    }
    return data;
};

export const getForumById = async (forumId) => {
    const response = await fetch(`${API_BASE_URL}/api/forum/${forumId}`, { credentials: 'include' });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch forum details.');
    }
    return data;
};

export const getTopics = async (forumId, page = 1) => {
    const response = await fetch(`${API_BASE_URL}/api/forum/${forumId}/topics?page=${page}`, { credentials: 'include' });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch topics.');
    }
    return data;
};

export const getPosts = async (topicId, page = 1) => {
    const response = await fetch(`${API_BASE_URL}/api/forum/topics/${topicId}/posts?page=${page}`, { credentials: 'include' });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch posts.');
    }
    return data;
};

export const createTopic = async (forumId, title, description) => {
    const response = await fetch(`${API_BASE_URL}/api/forum/${forumId}/topics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
        credentials: 'include',
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to create topic.');
    }
    return data;
};

export const createPost = async (topicId, content) => {
    const response = await fetch(`${API_BASE_URL}/api/forum/topics/${topicId}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
        credentials: 'include',
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to create post.');
    }
    return data;
};

export const createForum = async (forumData) => {
    const response = await fetch(`${API_BASE_URL}/api/forum/create-forum`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(forumData),
        credentials: 'include',
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to create forum.');
    }
    return data;
};

export const deleteForum = async (forumId) => {
    const response = await fetch(`${API_BASE_URL}/api/forum/${forumId}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to delete forum.');
    }
    return data;
};