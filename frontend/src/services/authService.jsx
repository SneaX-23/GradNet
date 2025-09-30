export const initiateLogin = async (usn) => {
  const response = await fetch('/api/submit-auth-info', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usn: usn }),
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'An unknown error occurred.');
  }
  return data;
};