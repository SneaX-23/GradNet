import { useLocation } from "react-router-dom";
import OtpVerificationForm from "../components/auth/OtpVerificationForm";
import { useVerifyOtp } from "../hooks/useVerifyotp";
import "../styles/pages/VerifyOtpPage.css"
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
        <div className="otp-page-container">
            <div className="otp-card">
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
        </div>
    );
}

export default VerifyOtp;