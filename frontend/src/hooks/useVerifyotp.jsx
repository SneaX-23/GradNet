import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { initiateOtpVerification, resendOtpRequest } from '../services/otpServices'; 
import { useAuth } from '../context/AuthContext';

export const useVerifyOtp = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

    const [isResending, setIsResending] = useState(false);
    const [resendStatus, setResendStatus] = useState('');

    const status = location.state?.status || 'LOGIN';

    const handelOtpSubmit = async () => {
        setError("");

        try {
            const userData = await initiateOtpVerification(otp);
            login(userData.user); 
            if (status === 'LOGIN') {
                navigate('/home');
            } else if (status === 'SIGNUP_REQUIRED') {
                navigate('/create-profile');
            }
        } catch (err) {
            setError(err.message);
        }
    };
    const handleResendOtp = async () => {
        setIsResending(true);
        setResendStatus('');
        try {
            const data = await resendOtpRequest();
            setResendStatus(data.message);
            setOtp('')
        } catch (err) {
            setResendStatus(err.message);
        } finally {
            setIsResending(false);
        }
    };

    return {
        otp,
        setOtp,
        error,
        handelOtpSubmit,
        isResending,
        resendStatus,
        handleResendOtp
    };
};