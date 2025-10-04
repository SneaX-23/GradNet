export const initiateShowPosts = async (page) => {
    const response = await fetch(`/api/home/get-feed?page=${page}`);
    const data = await response.json();
    return data;
}

export const showUserPosts = async (page, userId) => {
    let url = `/api/profile/getUserPosts?page=${page}`;
    if (userId) {
        url += `&userId=${userId}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

export default initiateShowPosts;