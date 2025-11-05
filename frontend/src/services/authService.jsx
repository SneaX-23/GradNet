import { API_BASE_URL } from '../config';
export const initiateLogin = async (usn) => {
  const response = await fetch(`${API_BASE_URL}/api/submit-auth-info`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usn: usn }),
    credentials: 'include',
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'An unknown error occurred.');
  }
  return data;
};