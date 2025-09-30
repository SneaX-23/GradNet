export const initiateOtpVerification = async (otp) => {
    const response = await fetch('/api/otp-auth', {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({otp: otp})
    });

    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'An unknown error occurred.');
    }
     return data;
};

export const resendOtpRequest = async () => {
    const response = await fetch('/api/resend-otp', {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
    });

    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.message || 'Failed to resend OTP.');
    }
    return data;
};