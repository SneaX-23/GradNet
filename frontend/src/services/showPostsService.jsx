export const initiateShowPosts = async (page) => {
    const response = await fetch(`/api/home/get-feed?page=${page}`);
    const data = await response.json();
    return data;
}

export default initiateShowPosts;