import { API_BASE_URL } from '../config';

export const initiateShowPosts = async (page) => {
    const response = await fetch(`${API_BASE_URL}/api/home/get-feed?page=${page}`, { credentials: 'include' });
    const data = await response.json();
    return data;
}

export const showUserPosts = async (page, userId) => {
    let url = `${API_BASE_URL}/api/profile/getUserPosts?page=${page}`;
    if (userId) {
        url += `&userId=${userId}`;
    }
    const response = await fetch(url, { credentials: 'include' });
    const data = await response.json();
    return data;
}

export default initiateShowPosts;