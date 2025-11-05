import { API_BASE_URL } from '../config';

export const initiateOtpVerification = async (otp) => {
    const response = await fetch(`${API_BASE_URL}/api/otp-auth`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({otp: otp}),
        credentials: 'include',
    });

    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'An unknown error occurred.');
    }
     return data;
};

export const resendOtpRequest = async () => {
    const response = await fetch(`${API_BASE_URL}/api/resend-otp`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
    });

    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'Failed to resend OTP.');
    }
    return data;
};