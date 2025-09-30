import { useLocation } from "react-router-dom";
import OtpVerificationForm from "../components/auth/OtpVerificationForm";
import { useVerifyOtp } from "../hooks/useVerifyotp";

function VerifyOtp() {
    const {
        otp,
        setOtp,
        error,
        handelOtpSubmit,
        isResending,
        resendStatus,
        handleResendOtp
    } = useVerifyOtp();

    const location = useLocation();
    const { email, status, name } = location.state || { email: 'your email', status: 'SIGNUP_REQUIRED' };

    return (
        <div>
            <OtpVerificationForm
                email={email}
                otp={otp}
                setOtp={setOtp}
                onSubmit={handelOtpSubmit}
                error={error}
           
                handleResendOtp={handleResendOtp}
                isResending={isResending}
                resendStatus={resendStatus}
            />
        </div>
    );
}

export default VerifyOtp;