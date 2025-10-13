export const getForums = async (page) => {
    const response = await fetch(`/api/forum/get-forums?page=${page}`);
    const data = await response.json();
    if(!response.ok){
        throw new Error(data.message || `Failed to fetch forums`);
    }
    return data;
}

export const editForum = async (name, description, forumId) => {
    const response = await fetch(`/api/forum/edit-forum/${forumId}`, {
        method: `PUT`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {name: name, description: description}
    });
    const data = await response.json();
    if(!response.ok){
        throw new Error (data.message || `Failed to update forum`);
    }
    return data;
}

export const deleteForum = async (forumId) => {
    const response = await fetch(`/api/forum/delete-forum/${forumId}`, {
        method: `DELETE`,
    });
    const data = await response.json();
    if(!response.ok){
        throw new Error (data.message || `Failed to delete forum`);
    }
    return data;
}