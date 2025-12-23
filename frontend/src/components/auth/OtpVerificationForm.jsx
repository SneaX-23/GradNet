import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

const OTP_LENGTH = 6;

function OtpVerificationForm({
    otp,
    setOtp,
    onSubmit,
    error,
    email,
    handleResendOtp,
    isResending,
    resendStatus,
}) {
    const navigate = useNavigate();
    const inputsRef = useRef([]);

    const handleChange = (value, index) => {
        if (!/^\d?$/.test(value)) return;

        const otpArray = otp.split("");
        otpArray[index] = value;
        setOtp(otpArray.join("").slice(0, OTP_LENGTH));

        if (value && index < OTP_LENGTH - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, OTP_LENGTH);

        if (!pasted) return;

        setOtp(pasted);
        inputsRef.current[pasted.length - 1]?.focus();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <>
            {/* Header */}
            <div className="text-center">
                <h2 className="text-xl font-semibold text-foreground">
                    Verify OTP
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                    We’ve sent a verification code to your email.
                </p>
            </div>

            {/* Email info */}
            <div className="mt-4 rounded-md border border-border bg-card px-4 py-2 text-center text-sm text-muted-foreground">
                OTP has been sent to{" "}
                <span className="font-medium text-sky-500">{email}</span>
            </div>

            {/* OTP Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <label className="block text-center text-sm font-medium text-foreground">
                    Enter OTP
                </label>

                <div
                    className="flex justify-center gap-2 sm:gap-3"
                    onPaste={handlePaste}
                >
                    {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputsRef.current[index] = el)}
                            type="tel"
                            inputMode="numeric"
                            maxLength={1}
                            value={otp[index] || ""}
                            onChange={(e) => handleChange(e.target.value, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            className="h-12 w-10 sm:h-14 sm:w-12 rounded-md border border-border bg-background text-center text-lg font-medium text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                        />
                    ))}
                </div>

                {/* Errors / Status */}
                {error && (
                    <p className="text-center text-red-500 text-sm font-medium">
                        {error}
                    </p>
                )}

                {resendStatus && (
                    <p className="text-center text-sm text-muted-foreground">
                        {resendStatus}
                    </p>
                )}

                {/* Verify Button */}
                <button
                    type="submit"
                    className="btn btn-solid w-full "
                    disabled={otp.length !== OTP_LENGTH}
                >
                    Verify OTP
                </button>

                {/* Resend Button */}
                <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isResending}
                    className="btn btn-primary w-full"
                >
                    {isResending ? "Sending..." : "Resend OTP"}
                </button>
            </form>

            {/* Back Button */}
            <button
                type="button"
                onClick={() => navigate("/")}
                className="mt-4 w-full text-center text-sm text-muted-foreground transition-colors hover:text-white hover:underline underline-offset-4"
            >
                ← Back to login
            </button>
        </>
    );
}

export default OtpVerificationForm;