export const initiateShowPosts = async (page) => {
    const response = await fetch(`/api/home/get-feed?page=${page}`);
    const data = await response.json();
    return data;
}
export const showUserPosts = async (page) => {
    const response = await fetch(`api/profile/getUserPosts?page=${page}`)
    const data = await response.json();
    return data;
}

export default initiateShowPosts;