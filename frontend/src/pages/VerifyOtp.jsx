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
        handleResendOtp,
    } = useVerifyOtp();

    const location = useLocation();
    const { email = "your email" } = location.state || {};

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-xl border border-border sm:p-8">
                <OtpVerificationForm
                    otp={otp}
                    setOtp={setOtp}
                    onSubmit={handelOtpSubmit}
                    error={error}
                    email={email}
                    handleResendOtp={handleResendOtp}
                    isResending={isResending}
                    resendStatus={resendStatus}
                />
            </div>
        </div>
    );
}

export default VerifyOtp;
