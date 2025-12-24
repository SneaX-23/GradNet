import { API_BASE_URL } from '../config.js';

export const browseMentorships = async (category = '', search = '') => {
    const query = new URLSearchParams();
    if (category) query.append('category', category);
    if (search) query.append('search', search);
    
    const response = await fetch(`${API_BASE_URL}/api/mentor/browse?${query.toString()}`, { 
        credentials: 'include' 
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch mentorships');
    return data;
};

export const applyForMentorship = async (mentorshipId, requestMessage) => {
    const response = await fetch(`${API_BASE_URL}/api/mentor/apply/${mentorshipId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_message: requestMessage }),
        credentials: 'include',
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to submit application');
    return data;
};

export const getStudentDashboard = async () => {
    const response = await fetch(`${API_BASE_URL}/api/mentor/my-applications`, { 
        credentials: 'include' 
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch your applications');
    return data;
};

export const createMentorProfile = async (mentorData) => {
    const response = await fetch(`${API_BASE_URL}/api/mentor/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mentorData),
        credentials: 'include',
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create mentor profile');
    return data;
};

export const updateMentorProfile = async (mentorData) => {
    const response = await fetch(`${API_BASE_URL}/api/mentor/profile`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mentorData),
        credentials: 'include',
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update mentor profile');
    return data;
};

export const getMentorDashboard = async () => {
    const response = await fetch(`${API_BASE_URL}/api/mentor/dashboard`, { 
        credentials: 'include' 
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch mentor dashboard');
    return data;
};

export const handleMenteeApplication = async (enrollmentId, status, mentorNotes = '') => {
    const response = await fetch(`${API_BASE_URL}/api/mentor/application/${enrollmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, mentor_notes: mentorNotes }),
        credentials: 'include',
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update application status');
    return data;
};

//
export const moderateMentorship = async (mentorshipId, status) => {
    const response = await fetch(`${API_BASE_URL}/api/mentor/moderate/${mentorshipId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
        credentials: 'include',
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to moderate mentorship');
    return data;
};