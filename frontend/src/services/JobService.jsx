export const getJobs = async (page) => {
    const response = await fetch(`/api/jobs/get-jobs?page=${page}`);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch jobs.');
    }
    return data;
}

export const createJob = async (jobData) => {
    const response = await fetch('/api/jobs/create-job', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Failed to create job.');
    }
    return data;
};
